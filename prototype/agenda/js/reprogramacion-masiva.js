/* ============================================================
   reprogramacion-masiva.js
   Vista de reprogramación masiva: lista pacientes con citas en
   una fecha origen, propone re-acomodo automático respetando
   disponibilidad cruzada (paciente / terapeuta / sala) y permite
   override manual por slot.

   Calendario navegable por semana (incluye varias semanas hacia
   adelante para ver dónde aterrizan las reprogramaciones).
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- UTILIDADES FECHA / HORA -------------------- */
  const pad  = n => String(n).padStart(2,'0');
  const iso  = d => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
  const pISO = s => {const [Y,M,D]=s.split('-').map(Number);return new Date(Y,M-1,D);};
  const addD = (d,n)=>{const r=new Date(d);r.setDate(r.getDate()+n);return r;};
  const isWE = d=>[0,6].includes(d.getDay());
  const mon  = d=>addD(d,d.getDay()===0?1:1-d.getDay());
  const addM = (t,m)=>{let [h,min]=t.split(':').map(Number);min+=m;while(min>=60){h++;min-=60;}return `${pad(h)}:${pad(min)}`;};
  const toMin= h=>{const [hh,mm]=h.split(':').map(Number);return hh*60+mm;};
  const fmtH = t => {const [h,m]=t.split(':').map(Number);const p=h>=12?'PM':'AM';return `${h%12||12}:${pad(m)} ${p}`;};
  const MESES = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];

  /* ---------- JORNADA ------------------------------------ */
  const OPEN=9, CLOSE=17, SLOT=30, ROWS=((CLOSE-OPEN)*60)/SLOT+2;
  const SEARCH_DAYS = 28; // 4 semanas de búsqueda para alternativas

  /* ---------- TIPOS / SALAS ------------------------------ */
  const TIPOS={
    1:{nombre:'Evaluación inicial integral',dur:60,terapeutas:['Terapeuta A','Terapeuta B']},
    2:{nombre:'Cita de terapia',            dur:60,terapeutas:['Terap. 1','Terap. 2','Terap. 3','Terap. 4']}
  };

  /* ---------- DOM refs ----------------------------------- */
  const inDate       = document.getElementById('rmSourceDate');
  const elCount      = document.getElementById('rmCount');
  const btnAutoAll   = document.getElementById('rmAutoAll');
  const ulPatients   = document.getElementById('rmPatientList');
  const elPatientName= document.getElementById('rmPatientName');
  const elPatientFolio=document.getElementById('rmPatientFolio');
  const elPatientOrig= document.getElementById('rmPatientOriginal');
  const selTher      = document.getElementById('rmTherapist');
  const grid         = document.getElementById('rmCalendar');
  const elHint       = document.getElementById('rmHint');
  const btnPrevWeek  = document.getElementById('rmPrevWeek');
  const btnNextWeek  = document.getElementById('rmNextWeek');
  const btnGoToSource= document.getElementById('rmGoToSource');
  const elWeekLabel  = document.getElementById('rmWeekLabel');

  /* Modal por-slot */
  const slotModal    = document.getElementById('rmSlotModal');
  const slotClose    = document.getElementById('rmSlotClose');
  const slotCancel   = document.getElementById('rmSlotCancel');
  const slotConfirm  = document.getElementById('rmSlotConfirm');
  const slotSummary  = document.getElementById('rmSlotSummary');

  /* Modal lote */
  const batchModal   = document.getElementById('rmBatchModal');
  const batchClose   = document.getElementById('rmBatchClose');
  const batchCancel  = document.getElementById('rmBatchCancel');
  const batchConfirm = document.getElementById('rmBatchConfirm');
  const batchTable   = document.getElementById('rmBatchTable').querySelector('tbody');
  const batchSummary = document.getElementById('rmBatchSummary');

  /* Toast */
  const toast        = document.getElementById('toastNotification');
  const toastMsg     = document.getElementById('toastMessage');

  /* ---------- ESTADO ------------------------------------- */
  let eventos = [];                  // todas las citas
  let proposed = {};                 // id → propuesta {fecha, hora}
  let currentEvent = null;           // cita activa (la del paciente seleccionado)
  let pendingSlot = null;            // slot clicado pendiente de confirmar
  let proposedBatch = null;          // resultado del auto-all pendiente de confirmar
  let viewWeekStart = null;          // lunes de la semana visible en el calendario
  let lastReassignedIds = new Set(); // ids recién reasignados (para resaltarlos)

  /* ---------- CARGAR DATOS DE LOCALSTORAGE --------------- */
  (function loadEvents(){
    const raw = localStorage.getItem('agenda_events');
    if(raw){
      try { eventos = JSON.parse(raw); } catch(e){ eventos = []; }
    }
    if(eventos.length === 0){
      // Sembrar ejemplo mínimo para que la vista no quede vacía
      const today = new Date();
      const ref = isWE(today) ? mon(today) : today;
      const refISO = iso(ref);
      eventos = [
        {id:'rm-seed-1',tipo:2,paciente:'Ana Martínez', fecha:refISO,hora:'09:30',sala:'Sala 101',ther:'Terap. 1',   dur:60,folio:'F-AM-X1',fee:350,proof:''},
        {id:'rm-seed-2',tipo:2,paciente:'Luis García',   fecha:refISO,hora:'10:30',sala:'Sala 102',ther:'Terap. 2',   dur:60,folio:'F-LG-X2',fee:350,proof:''},
        {id:'rm-seed-3',tipo:1,paciente:'Carmen Robles', fecha:refISO,hora:'11:30',sala:'Sala 103',ther:'Terapeuta A',dur:60,folio:'F-CR-X3',fee:null,proof:''}
      ];
    }
  })();

  /* ---------- PARÁMETRO ?date=YYYY-MM-DD ----------------- */
  const params = new URLSearchParams(window.location.search);
  const initialDate = params.get('date') || iso(isWE(new Date()) ? mon(new Date()) : new Date());
  inDate.value = initialDate;
  viewWeekStart = mon(pISO(initialDate));

  /* ========================================================
     TOAST
     ======================================================== */
  let toastTimer = null;
  const showToast = (message, type='success') => {
    clearTimeout(toastTimer);
    toast.className = 'toast-notification toast-show toast-' + type;
    toastMsg.textContent = message;
    toastTimer = setTimeout(() => {
      toast.classList.remove('toast-show');
    }, 3000);
  };

  /* ========================================================
     DETECCIÓN DE CONFLICTOS
     ======================================================== */
  const effectiveEvent = ev => {
    const p = proposed[ev.id];
    return p ? { ...ev, fecha: p.fecha, hora: p.hora } : ev;
  };

  const allEffective = () => eventos.map(effectiveEvent);

  const overlap = (a, b) =>
    Math.max(toMin(a.hora), toMin(b.hora)) < Math.min(toMin(a.hora) + a.dur, toMin(b.hora) + b.dur);

  const hasConflict = (prop, val, f, h, d, skipId) => {
    const test = { fecha: f, hora: h, dur: d };
    return allEffective().some(e =>
      e.id !== skipId && e[prop] === val && e.fecha === f && overlap(test, e)
    );
  };

  /* ========================================================
     MOTOR DE SUGERENCIAS (búsqueda extendida 4 semanas)
     ======================================================== */
  const findAlternatives = (ev, skipId, takenSlots) => {
    const alts = [];
    const baseDate = pISO(ev.fecha);
    const dur = ev.dur || TIPOS[ev.tipo]?.dur || 60;

    // Empezar al día siguiente (no al mismo día) para que las
    // reprogramaciones siempre caigan después de la fecha origen.
    for (let dayOffset = 1; dayOffset <= SEARCH_DAYS; dayOffset++) {
      const tryDate = addD(baseDate, dayOffset);
      if (isWE(tryDate)) continue;
      const tryISO = iso(tryDate);

      for (let m = 0; m < (CLOSE - OPEN) * 60; m += SLOT) {
        const tryHora = addM(`${pad(OPEN)}:00`, m);
        if (toMin(tryHora) + dur > (CLOSE * 60 + 30)) break;

        if (hasConflict('paciente', ev.paciente, tryISO, tryHora, dur, skipId)) continue;
        if (hasConflict('ther', ev.ther, tryISO, tryHora, dur, skipId)) continue;
        if (hasConflict('sala', ev.sala, tryISO, tryHora, dur, skipId)) continue;
        if (takenSlots && collidesBatch(takenSlots, { ...ev, fecha: tryISO, hora: tryHora, dur })) continue;

        let score = 100;
        // Más temprano (menos días después) = mejor
        if (dayOffset <= 2) score += 50;
        else if (dayOffset <= 5) score += 30;
        else if (dayOffset <= 10) score += 15;

        // Hora temprana del día = mejor
        if (toMin(tryHora) <= toMin('10:00')) score += 20;
        else if (toMin(tryHora) <= toMin('12:00')) score += 10;

        alts.push({ fecha: tryISO, hora: tryHora, dur, score, dayOffset });
      }
    }

    alts.sort((a, b) => b.score - a.score);
    return alts;
  };

  /* ========================================================
     COLISIONES INTRA-BATCH
     ======================================================== */
  const slotKeys = ev => {
    const keys = [];
    for (let m = 0; m < ev.dur; m += SLOT) {
      const h = addM(ev.hora, m);
      keys.push(`${ev.fecha}|${h}|ther|${ev.ther}`);
      keys.push(`${ev.fecha}|${h}|sala|${ev.sala}`);
      keys.push(`${ev.fecha}|${h}|paciente|${ev.paciente}`);
    }
    return keys;
  };

  const collidesBatch = (takenSet, ev) => slotKeys(ev).some(k => takenSet.has(k));
  const reserveBatch  = (takenSet, ev) => slotKeys(ev).forEach(k => takenSet.add(k));

  /* ========================================================
     SIDEBAR
     ======================================================== */
  const renderPatientList = () => {
    const date = inDate.value;
    const citasDelDia = eventos.filter(e => e.fecha === date);

    elCount.textContent = `${citasDelDia.length} cita${citasDelDia.length === 1 ? '' : 's'} en la fecha origen`;
    btnAutoAll.disabled = citasDelDia.length === 0;

    if (citasDelDia.length === 0) {
      // Si hay reprogramaciones recientes, mostrarlas como referencia
      if (lastReassignedIds.size > 0) {
        const reasignados = eventos.filter(e => lastReassignedIds.has(e.id));
        ulPatients.innerHTML = `<li class="rm-empty">Citas ya reprogramadas:</li>` +
          reasignados.map(ev => `
            <li class="assigned" data-id="${ev.id}">
              <span class="rm-patient-name">${ev.paciente}</span>
              <span class="rm-patient-meta">${ev.fecha} · ${fmtH(ev.hora)}</span>
            </li>`).join('');

        ulPatients.querySelectorAll('li[data-id]').forEach(li => {
          li.addEventListener('click', () => {
            const ev = eventos.find(e => e.id === li.dataset.id);
            if (ev) { viewWeekStart = mon(pISO(ev.fecha)); renderCalendar(); }
          });
        });
      } else {
        ulPatients.innerHTML = '<li class="rm-empty">No hay citas en esta fecha.</li>';
      }
      currentEvent = null;
      clearMain();
      renderCalendar();
      return;
    }

    ulPatients.innerHTML = citasDelDia.map(ev => {
      const p = proposed[ev.id];
      const horaActual = p ? p.hora : ev.hora;
      const fechaActual = p ? p.fecha : ev.fecha;
      const isAssigned = !!p;
      const isActive = currentEvent && currentEvent.id === ev.id;
      const fechaLabel = fechaActual === ev.fecha
        ? fmtH(horaActual)
        : `${fechaActual} ${fmtH(horaActual)}`;

      return `
        <li class="${isActive ? 'active' : ''} ${isAssigned ? 'assigned' : ''}" data-id="${ev.id}">
          <span class="rm-patient-name">${ev.paciente}</span>
          <span class="rm-patient-meta">${TIPOS[ev.tipo].nombre} · ${fechaLabel}</span>
        </li>`;
    }).join('');

    ulPatients.querySelectorAll('li[data-id]').forEach(li => {
      li.addEventListener('click', () => selectPatient(li.dataset.id));
    });
  };

  const clearMain = () => {
    elPatientName.textContent = '—';
    elPatientFolio.textContent = '';
    elPatientOrig.textContent = '';
    selTher.disabled = true;
    selTher.innerHTML = '<option value="">Seleccionar terapeuta</option>';
    elHint.classList.remove('hidden');
    elHint.textContent = currentEvent
      ? ''
      : 'Selecciona un paciente del panel para ver horarios disponibles. Usa las flechas para navegar entre semanas.';
  };

  /* ========================================================
     SELECCIONAR PACIENTE
     ======================================================== */
  const selectPatient = (id) => {
    const ev = eventos.find(e => e.id === id);
    if (!ev) return;
    currentEvent = ev;

    elPatientName.textContent = ev.paciente;
    elPatientFolio.textContent = `Folio: ${ev.folio} · ${TIPOS[ev.tipo].nombre}`;

    const p = proposed[ev.id];
    if (p) {
      elPatientOrig.textContent = `Original: ${ev.fecha} ${fmtH(ev.hora)} → Propuesto: ${p.fecha} ${fmtH(p.hora)}`;
    } else {
      elPatientOrig.textContent = `Original: ${ev.fecha} ${fmtH(ev.hora)}`;
    }

    const cfg = TIPOS[ev.tipo] || { terapeutas: [] };
    selTher.innerHTML = cfg.terapeutas.map(t =>
      `<option value="${t}" ${t === ev.ther ? 'selected' : ''}>${t}</option>`
    ).join('');
    selTher.disabled = false;

    elHint.classList.add('hidden');
    renderPatientList();
    renderCalendar();
  };

  selTher.addEventListener('change', () => {
    if (currentEvent) {
      currentEvent.ther = selTher.value;
      renderCalendar();
    }
  });

  /* ========================================================
     ETIQUETA SEMANA: "Semana del 14 al 18 de oct"
     ======================================================== */
  const updateWeekLabel = () => {
    const start = viewWeekStart;
    const end = addD(start, 4);
    const sM = MESES[start.getMonth()];
    const eM = MESES[end.getMonth()];
    if (start.getMonth() === end.getMonth()) {
      elWeekLabel.textContent = `Semana del ${start.getDate()} al ${end.getDate()} de ${sM} ${start.getFullYear()}`;
    } else {
      elWeekLabel.textContent = `${start.getDate()} ${sM} – ${end.getDate()} ${eM} ${start.getFullYear()}`;
    }
  };

  /* ========================================================
     RENDER CALENDARIO
     - Siempre dibuja la cuadrícula de la semana visible.
     - Coloca todos los eventos (vista efectiva) sobre las celdas.
     - Si hay paciente seleccionado, marca disponibilidad.
     ======================================================== */
  const renderCalendar = () => {
    grid.innerHTML = '';
    const start = viewWeekStart;
    const cols = 5;

    /* Header */
    const corner = document.createElement('div');
    corner.className = 'day-header';
    grid.appendChild(corner);
    for (let c = 0; c < cols; c++) {
      const d = addD(start, c);
      const h = document.createElement('div');
      h.className = 'day-header day-low';
      const dayName = document.createElement('span');
      dayName.className = 'day-name';
      dayName.textContent = d.toLocaleDateString('es-ES', { weekday: 'short' });
      const dayNum = document.createElement('span');
      dayNum.className = 'day-number';
      dayNum.textContent = d.getDate();
      h.appendChild(dayName);
      h.appendChild(dayNum);
      grid.appendChild(h);
    }

    /* Pre-calcular alternativas top-3 para el paciente activo */
    let topRecommended = new Set();
    if (currentEvent) {
      const alts = findAlternatives(currentEvent, currentEvent.id, null);
      topRecommended = new Set(alts.slice(0, 3).map(a => `${a.fecha}|${a.hora}`));
    }

    /* Filas + celdas (estado vacío inicial) */
    const cellMap = {}; // "fecha|hora" → cell element
    for (let r = 0; r < ROWS; r++) {
      const mins = r * SLOT, hh = OPEN + Math.floor(mins / 60), mm = mins % 60;

      const tl = document.createElement('div');
      tl.className = 'time-cell';
      tl.textContent = `${pad(hh)}:${pad(mm)}`;
      grid.appendChild(tl);

      for (let c = 0; c < cols; c++) {
        const fecha = iso(addD(start, c));
        const hora = `${pad(hh)}:${pad(mm)}`;
        const cell = document.createElement('div');
        cell.className = 'empty-cell';
        cell.dataset.fecha = fecha;
        cell.dataset.hora = hora;

        const state = evaluateCellState(fecha, hora, topRecommended);
        cell.classList.add(state);

        if (currentEvent && (state === 'cell-recommended' || state === 'cell-available')) {
          cell.addEventListener('click', () => onSlotClick(fecha, hora));
        }

        grid.appendChild(cell);
        cellMap[`${fecha}|${hora}`] = cell;
      }
    }

    /* Marcar la celda "origen" del paciente activo (si está visible) */
    if (currentEvent) {
      const originKey = `${currentEvent.fecha}|${currentEvent.hora}`;
      const originCell = cellMap[originKey];
      if (originCell) {
        originCell.classList.add('cell-source');
      }
    }

    /* Colocar todos los eventos visibles (vista efectiva) */
    placeEvents(start, cols, cellMap);

    updateWeekLabel();
  };

  /* ========================================================
     PLACEEVENTS: dibuja las citas como tiles sobre el grid
     ======================================================== */
  const placeEvents = (start, cols, cellMap) => {
    const startISO = iso(start);
    const endISO   = iso(addD(start, cols - 1));

    allEffective().forEach(ev => {
      if (ev.fecha < startISO || ev.fecha > endISO) return;
      const dur = ev.dur || TIPOS[ev.tipo]?.dur || 60;
      const slots = Math.ceil(dur / SLOT);

      for (let i = 0; i < slots; i++) {
        const t = addM(ev.hora, i * SLOT);
        const cell = cellMap[`${ev.fecha}|${t}`];
        if (!cell) continue;

        // Limpiar estados visuales — la cita cubre la celda
        cell.classList.remove('cell-available','cell-recommended','cell-source');
        cell.innerHTML = '';

        const tile = document.createElement('div');
        tile.className = `rm-appt tipo-${ev.tipo}`;
        if (lastReassignedIds.has(ev.id)) tile.classList.add('rm-appt-rescheduled');
        if (currentEvent && ev.id === currentEvent.id) tile.classList.add('rm-appt-active');
        if (i > 0) tile.classList.add('rm-appt-cont'); // continuación visual

        if (i === 0) {
          tile.innerHTML = `
            <span class="rm-appt-name">${ev.paciente}</span>
            <span class="rm-appt-meta">${TIPOS[ev.tipo].nombre} · ${ev.ther}</span>
          `;
        }
        cell.appendChild(tile);
        tile.addEventListener('click', e => {
          e.stopPropagation();
          selectPatient(ev.id);
        });
      }
    });
  };

  /* ========================================================
     EVALUAR ESTADO DE CELDA
     ======================================================== */
  const evaluateCellState = (fecha, hora, topRecommended) => {
    const d = pISO(fecha);
    if (isWE(d)) return 'cell-blocked';

    if (!currentEvent) return 'cell-available';

    const dur = currentEvent.dur || TIPOS[currentEvent.tipo]?.dur || 60;
    if (toMin(hora) + dur > (CLOSE * 60 + 30)) return 'cell-blocked';

    const skipId = currentEvent.id;
    const therBusy = hasConflict('ther', currentEvent.ther, fecha, hora, dur, skipId);
    const salaBusy = hasConflict('sala', currentEvent.sala, fecha, hora, dur, skipId);
    const patBusy  = hasConflict('paciente', currentEvent.paciente, fecha, hora, dur, skipId);

    if (therBusy || salaBusy) return 'cell-blocked';
    if (patBusy) return 'cell-conflict';
    if (topRecommended.has(`${fecha}|${hora}`)) return 'cell-recommended';
    return 'cell-available';
  };

  /* ========================================================
     CLICK EN SLOT LIBRE → modal por-slot
     ======================================================== */
  const onSlotClick = (fecha, hora) => {
    if (!currentEvent) return;
    pendingSlot = { fecha, hora };
    const ev = currentEvent;
    const horaFin = addM(hora, ev.dur);

    slotSummary.innerHTML = `
      <div class="summary-row"><span class="label">Paciente:</span><span class="value">${ev.paciente}</span></div>
      <div class="summary-row"><span class="label">Tipo:</span><span class="value">${TIPOS[ev.tipo].nombre}</span></div>
      <div class="summary-row"><span class="label">Original:</span><span class="value">${ev.fecha} ${fmtH(ev.hora)}</span></div>
      <div class="summary-row"><span class="label">Nuevo horario:</span><span class="value">${fecha} ${fmtH(hora)} – ${fmtH(horaFin)}</span></div>
      <div class="summary-row"><span class="label">Terapeuta:</span><span class="value">${ev.ther}</span></div>
      <div class="summary-row"><span class="label">Sala:</span><span class="value">${ev.sala}</span></div>
    `;
    slotModal.style.display = 'block';
  };

  slotConfirm.addEventListener('click', () => {
    if (!pendingSlot || !currentEvent) return;

    // Aplicar inmediatamente: muta el evento real (no espera al batch).
    const idx = eventos.findIndex(e => e.id === currentEvent.id);
    if (idx >= 0) {
      eventos[idx] = { ...eventos[idx], fecha: pendingSlot.fecha, hora: pendingSlot.hora };
      lastReassignedIds.add(currentEvent.id);
      localStorage.setItem('agenda_events', JSON.stringify(eventos));
    }
    delete proposed[currentEvent.id];

    slotModal.style.display = 'none';
    const newDate = pendingSlot.fecha;
    pendingSlot = null;
    currentEvent = null;
    clearMain();

    // Saltar a la semana del nuevo horario
    viewWeekStart = mon(pISO(newDate));
    renderPatientList();
    renderCalendar();
    showToast('Cita reprogramada', 'success');
  });

  slotCancel.addEventListener('click', () => { slotModal.style.display = 'none'; pendingSlot = null; });
  slotClose.addEventListener('click',  () => { slotModal.style.display = 'none'; pendingSlot = null; });

  /* ========================================================
     AUTO-ASIGNACIÓN BATCH
     ======================================================== */
  const priorityKey = ev => {
    const typeWeight = ev.tipo === 1 ? 0 : 100;
    return typeWeight + toMin(ev.hora);
  };

  const buildBatchProposal = () => {
    const date = inDate.value;
    const citas = eventos.filter(e => e.fecha === date);

    const ordenadas = [...citas].sort((a, b) => priorityKey(a) - priorityKey(b));
    const taken = new Set();
    const result = [];

    // Reservar todos los slots ocupados por citas en otros días
    eventos.filter(e => e.fecha !== date).forEach(e => reserveBatch(taken, e));

    for (const ev of ordenadas) {
      const alts = findAlternatives(ev, ev.id, taken);
      if (alts.length > 0) {
        const best = alts[0];
        const newEv = { ...ev, fecha: best.fecha, hora: best.hora };
        reserveBatch(taken, newEv);
        result.push({ ev, fecha: best.fecha, hora: best.hora, failed: false });
      } else {
        result.push({ ev, fecha: null, hora: null, failed: true });
      }
    }

    return result;
  };

  const renderBatchModal = (batch) => {
    batchTable.innerHTML = batch.map(item => {
      const ev = item.ev;
      if (item.failed) {
        return `
          <tr class="rm-row-failed">
            <td>${ev.paciente}</td>
            <td>${ev.fecha} ${fmtH(ev.hora)}</td>
            <td class="rm-arrow">→</td>
            <td>Sin alternativa disponible</td>
            <td>${ev.ther}</td>
            <td>${ev.sala}</td>
          </tr>`;
      }
      return `
        <tr>
          <td>${ev.paciente}</td>
          <td>${ev.fecha} ${fmtH(ev.hora)}</td>
          <td class="rm-arrow">→</td>
          <td><strong>${item.fecha} ${fmtH(item.hora)}</strong></td>
          <td>${ev.ther}</td>
          <td>${ev.sala}</td>
        </tr>`;
    }).join('');

    const fails = batch.filter(b => b.failed).length;
    const success = batch.length - fails;
    if (fails > 0) {
      batchSummary.classList.add('has-failures');
      batchSummary.textContent = `${success} cita${success===1?'':'s'} reasignada${success===1?'':'s'} correctamente. ${fails} no pudo${fails===1?'':'eron'} reasignarse — revisa manualmente.`;
    } else {
      batchSummary.classList.remove('has-failures');
      batchSummary.textContent = `${success} cita${success===1?'':'s'} lista${success===1?'':'s'} para reasignar. Revisa la propuesta y confirma.`;
    }
  };

  btnAutoAll.addEventListener('click', () => {
    const batch = buildBatchProposal();
    if (batch.length === 0) {
      showToast('No hay citas para reprogramar', 'warning');
      return;
    }
    proposedBatch = batch;
    renderBatchModal(batch);
    batchModal.style.display = 'block';
  });

  batchConfirm.addEventListener('click', () => {
    if (!proposedBatch) return;

    let applied = 0;
    let earliestNewDate = null;
    lastReassignedIds = new Set();

    proposedBatch.forEach(item => {
      if (item.failed) return;
      const idx = eventos.findIndex(e => e.id === item.ev.id);
      if (idx >= 0) {
        eventos[idx] = { ...eventos[idx], fecha: item.fecha, hora: item.hora };
        delete proposed[item.ev.id];
        lastReassignedIds.add(item.ev.id);
        applied++;
        if (!earliestNewDate || item.fecha < earliestNewDate) earliestNewDate = item.fecha;
      }
    });

    /* Persistir para que agenda.html refleje cambios la próxima vez */
    localStorage.setItem('agenda_events', JSON.stringify(eventos));

    batchModal.style.display = 'none';
    proposedBatch = null;
    currentEvent = null;
    clearMain();

    /* Saltar a la semana donde aterrizó la primera reprogramación */
    if (earliestNewDate) {
      viewWeekStart = mon(pISO(earliestNewDate));
    }

    renderPatientList();
    renderCalendar();

    showToast(`${applied} cita${applied===1?'':'s'} reprogramada${applied===1?'':'s'} — vea las nuevas posiciones en el calendario`, 'success');
  });

  batchCancel.addEventListener('click', () => { batchModal.style.display = 'none'; proposedBatch = null; });
  batchClose.addEventListener('click',  () => { batchModal.style.display = 'none'; proposedBatch = null; });

  /* ========================================================
     NAVEGACIÓN DE SEMANA
     ======================================================== */
  btnPrevWeek.addEventListener('click', () => {
    viewWeekStart = addD(viewWeekStart, -7);
    renderCalendar();
  });

  btnNextWeek.addEventListener('click', () => {
    viewWeekStart = addD(viewWeekStart, 7);
    renderCalendar();
  });

  btnGoToSource.addEventListener('click', () => {
    viewWeekStart = mon(pISO(inDate.value));
    renderCalendar();
  });

  /* ========================================================
     FECHA ORIGEN
     ======================================================== */
  inDate.addEventListener('change', () => {
    proposed = {};
    lastReassignedIds = new Set();
    currentEvent = null;
    viewWeekStart = mon(pISO(inDate.value));
    clearMain();
    renderPatientList();
    renderCalendar();
  });

  // Cerrar modales al click fuera del contenido
  window.addEventListener('click', (e) => {
    if (e.target === slotModal)  { slotModal.style.display = 'none'; pendingSlot = null; }
    if (e.target === batchModal) { batchModal.style.display = 'none'; proposedBatch = null; }
  });

  /* ---------- INICIO ------------------------------------- */
  renderPatientList();
  renderCalendar();
});
