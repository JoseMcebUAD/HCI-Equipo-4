/* ============================================================
   reprogramar.js – Lógica de la página de reprogramación
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- UTILIDADES (mismas que agenda.js) ------------ */
  const pad  = n => String(n).padStart(2,'0');
  const iso  = d => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
  const pISO = s => { const [Y,M,D]=s.split('-').map(Number); return new Date(Y,M-1,D); };
  const addD = (d,n) => { const r=new Date(d); r.setDate(r.getDate()+n); return r; };
  const isWE = d => [0,6].includes(d.getDay());
  const addM = (t,m) => { let [h,min]=t.split(':').map(Number); min+=m; while(min>=60){h++;min-=60;} return `${pad(h)}:${pad(min)}`; };
  const toMin= h => { const [hh,mm]=h.split(':').map(Number); return hh*60+mm; };
  const fmtH = t => { const [h,m]=t.split(':').map(Number); const p=h>=12?'PM':'AM'; return `${h%12||12}:${pad(m)} ${p}`; };
  const fmtDate = s => pISO(s).toLocaleDateString('es-ES',{weekday:'short',day:'numeric',month:'short',year:'numeric'});

  /* ---------- CONSTANTES ----------------------------------- */
  const OPEN=9, CLOSE=17, SLOT=30, MAX_M=6;
  const TIPOS={
    1:{nombre:'Evaluación inicial integral', dur:60, terapeutas:['Terapeuta A','Terapeuta B']},
    2:{nombre:'Cita de terapia',             dur:60, terapeutas:['Terap. 1','Terap. 2','Terap. 3','Terap. 4']}
  };

  /* ---------- LEER ESTADO INICIAL -------------------------- */
  let originalEvent = null;
  let eventos = [];
  let folios = {};

  try { originalEvent = JSON.parse(localStorage.getItem('reprogramar_event')); } catch(e) {}
  try { eventos = JSON.parse(localStorage.getItem('agenda_events')) || []; } catch(e) {}
  try { folios = JSON.parse(localStorage.getItem('agenda_folios')) || {}; } catch(e) {}

  if(!originalEvent) {
    window.location.href = 'agenda.html';
    return;
  }

  /* ---------- ESTADO DE LA SESIÓN -------------------------- */
  let selectedDate = null;
  let selectedTime = null;
  let calViewDate  = new Date();

  /* ---------- DOM refs ------------------------------------- */
  const elCurrentSlot  = document.getElementById('repCurrentSlot');
  const elNewSlot      = document.getElementById('repNewSlot');
  const elNewSlotText  = document.getElementById('repNewSlotText');

  const elPrevMonth    = document.getElementById('repPrevMonth');
  const elNextMonth    = document.getElementById('repNextMonth');
  const elCalTitle     = document.getElementById('repCalTitle');
  const elCalGrid      = document.getElementById('repCalGrid');
  const elSlotsGrid    = document.getElementById('repSlotsGrid');

  const elAvailSection = document.getElementById('repAvailSection');
  const elAvailContent = document.getElementById('repAvailContent');
  const elSuggestSection= document.getElementById('repSuggestSection');
  const elSuggestList  = document.getElementById('repSuggestList');

  const elType         = document.getElementById('repType');
  const elPatient      = document.getElementById('repPatient');
  const elTherapist    = document.getElementById('repTherapist');
  const elRoom         = document.getElementById('repRoom');
  const elFolio        = document.getElementById('repFolio');
  const elDurLabel     = document.getElementById('repDurLabel');
  const elPaySection   = document.getElementById('repPaySection');
  const elProof        = document.getElementById('repProof');
  const elFee          = document.getElementById('repFee');
  const elValMsgs      = document.getElementById('repValidationMessages');

  const elCancelBtn    = document.getElementById('repCancelBtn');
  const elConfirmBtn   = document.getElementById('repConfirmBtn');

  const elConfirmModal = document.getElementById('repConfirmModal');
  const elConfirmSum   = document.getElementById('repConfirmSummary');
  const elConfCancelBtn= document.getElementById('repConfirmCancelBtn');
  const elConfSaveBtn  = document.getElementById('repConfirmSaveBtn');

  const elToast        = document.getElementById('repToast');
  const elToastMsg     = document.getElementById('repToastMsg');

  /* ---------- TOAST ---------------------------------------- */
  let toastTimer = null;
  const showToast = (msg, type='success') => {
    clearTimeout(toastTimer);
    elToast.className = 'toast-notification toast-show toast-' + type;
    elToastMsg.textContent = msg;
    toastTimer = setTimeout(() => elToast.classList.remove('toast-show'), 3000);
  };

  /* ---------- MENSAJES DE VALIDACIÓN ----------------------- */
  const showValidation = (messages, type='error') => {
    if(!messages || !messages.length) { elValMsgs.className='validation-messages'; elValMsgs.innerHTML=''; return; }
    elValMsgs.className = 'validation-messages has-messages msg-' + type;
    elValMsgs.innerHTML = messages.map(m =>
      `<div class="msg-item"><span class="msg-icon">${type==='error'?'✕':'⚠'}</span><span>${m}</span></div>`
    ).join('');
  };

  /* ---------- PRE-RELLENAR FORMULARIO ---------------------- */
  const refreshTherapists = () => {
    const tipo = Number(elType.value);
    const ters = TIPOS[tipo]?.terapeutas || [];
    elTherapist.innerHTML = '<option value="">Seleccionar terapeuta</option>' +
      ters.map(t => `<option${t===originalEvent.ther?' selected':''}>${t}</option>`).join('');
  };

  elType.value      = originalEvent.tipo;
  elPatient.value   = originalEvent.paciente;
  elRoom.value      = originalEvent.sala;
  elFolio.value     = originalEvent.folio;
  elFee.value       = originalEvent.fee ?? '';
  refreshTherapists();
  elTherapist.value = originalEvent.ther;

  const dur = TIPOS[originalEvent.tipo]?.dur || originalEvent.dur || 60;
  elDurLabel.textContent = `${dur} min`;

  if(originalEvent.tipo === 2 || originalEvent.tipo === '2') {
    elPaySection.classList.remove('hidden');
  }

  /* Horario actual en el encabezado */
  elCurrentSlot.textContent = `Horario actual: ${fmtDate(originalEvent.fecha)}  ${fmtH(originalEvent.hora)} – ${fmtH(addM(originalEvent.hora, dur))}`;

  /* ---------- TIPO cambia → terapeutas + cuota ------------ */
  elType.addEventListener('change', () => {
    refreshTherapists();
    const tipo = Number(elType.value);
    const newDur = TIPOS[tipo]?.dur || 60;
    elDurLabel.textContent = `${newDur} min`;
    if(tipo === 2) elPaySection.classList.remove('hidden');
    else elPaySection.classList.add('hidden');
    if(selectedDate && selectedTime) updateAvailability();
  });

  elPatient.addEventListener('change', () => { if(selectedDate&&selectedTime) updateAvailability(); });
  elTherapist.addEventListener('change', () => { if(selectedDate&&selectedTime) updateAvailability(); buildSlots(selectedDate); updateAvailability(); });
  elRoom.addEventListener('change', () => { if(selectedDate&&selectedTime) { buildSlots(selectedDate); updateAvailability(); } });

  /* ---------- VERIFICACIÓN DE CONFLICTOS ------------------- */
  const overlaps = (ev, fecha, hora, dur, skipId) => {
    const start = toMin(hora);
    const end   = start + dur;
    for(let m=0; m<dur; m+=SLOT) {
      const slot = addM(hora, m);
      if(eventos.some(e =>
        e.id !== skipId &&
        e.fecha === fecha &&
        e.hora === slot &&
        (e.paciente === ev.paciente || e.sala === ev.sala || e.ther === ev.ther)
      )) return true;
    }
    return false;
  };

  const isBusyFor = (prop, val, fecha, hora, dur, skipId) => {
    for(let m=0; m<dur; m+=SLOT) {
      const slot = addM(hora, m);
      if(eventos.some(e => e.id !== skipId && e.fecha === fecha && e.hora === slot && e[prop] === val))
        return true;
    }
    return false;
  };

  /* ---------- VALIDACIÓN COMPLETA -------------------------- */
  const validate = (f, h) => {
    const errors = [];
    const tipo = Number(elType.value);
    const dur  = TIPOS[tipo]?.dur || 60;
    const ther = elTherapist.value;
    const sala = elRoom.value;
    const pac  = elPatient.value;

    if(!f || !h)           { errors.push('Selecciona fecha y hora.'); return errors; }
    if(!tipo)              { errors.push('Selecciona el tipo de evento.'); return errors; }
    if(!pac)               { errors.push('Selecciona un paciente.'); }
    if(!ther)              { errors.push('Selecciona un terapeuta.'); }
    if(!sala)              { errors.push('Selecciona una sala.'); }
    if(errors.length) return errors;

    const d = pISO(f);
    if(isWE(d)) errors.push('No se pueden programar eventos en fin de semana.');

    const today = new Date(); today.setHours(0,0,0,0);
    if(d < today) errors.push('No se pueden programar eventos en fechas pasadas.');

    const maxDate = new Date(today); maxDate.setMonth(maxDate.getMonth()+6);
    if(d > maxDate) errors.push('No se permiten fechas a más de seis meses de hoy.');

    const hMin = toMin(h), endMin = hMin + dur;
    if(hMin < OPEN*60 || endMin > (CLOSE+0.5)*60) errors.push('El evento excede el horario (09:00 – 17:30).');

    const [,mm] = h.split(':').map(Number);
    if(mm !== 0 && mm !== 30) errors.push('Solo minutos :00 o :30.');

    if(isBusyFor('paciente', pac,  f, h, dur, originalEvent.id)) errors.push('El paciente ya tiene un evento que se traslapa.');
    if(isBusyFor('sala',     sala, f, h, dur, originalEvent.id)) errors.push('La sala está ocupada en ese rango.');
    if(isBusyFor('ther',     ther, f, h, dur, originalEvent.id)) errors.push('El terapeuta está ocupado en ese rango.');

    if(tipo === 1) {
      const hasSameDay = eventos.some(e =>
        e.id !== originalEvent.id && e.tipo === 1 && e.paciente === pac && e.fecha === f
      );
      if(hasSameDay) errors.push('Solo una evaluación integral al día por paciente.');
    }

    if(tipo === 2) {
      const proof = elProof.files[0];
      if(proof) {
        const allowed = ['application/pdf','image/png','image/jpeg'];
        if(!allowed.includes(proof.type)) errors.push('Formato de comprobante no permitido (PDF, PNG, JPG).');
        if(proof.size > 5*1024*1024) errors.push('El archivo supera 5 MB.');
      }
    }

    return errors;
  };

  /* ---------- PANEL DISPONIBILIDAD ------------------------- */
  const updateAvailability = () => {
    if(!selectedDate || !selectedTime) return;
    const tipo = Number(elType.value);
    const dur  = TIPOS[tipo]?.dur || 60;
    const ther = elTherapist.value;
    const sala = elRoom.value;
    const pac  = elPatient.value;

    const therBusy = ther ? isBusyFor('ther',     ther, selectedDate, selectedTime, dur, originalEvent.id) : null;
    const salaBusy = sala ? isBusyFor('sala',     sala, selectedDate, selectedTime, dur, originalEvent.id) : null;
    const pacBusy  = pac  ? isBusyFor('paciente', pac,  selectedDate, selectedTime, dur, originalEvent.id) : null;

    const card = (label, busy, icon) => {
      if(busy === null) return '';
      const cls = busy ? 'avail-busy' : 'avail-ok';
      const symbol = busy ? '✕' : '✓';
      const status = busy ? 'Ocupado' : 'Disponible';
      return `<div class="rep-avail-card ${cls}">
        <span class="avail-icon">${symbol}</span>
        <div><div class="avail-label">${icon} ${label}</div><div class="avail-status">${status}</div></div>
      </div>`;
    };

    elAvailContent.innerHTML =
      card('Terapeuta', therBusy, '👤') +
      card('Sala',      salaBusy, '🚪') +
      card('Paciente',  pacBusy,  '🧑');
    elAvailSection.classList.remove('hidden');

    const hasConflict = therBusy || salaBusy || pacBusy;
    if(hasConflict) buildSuggestions();
    else elSuggestSection.classList.add('hidden');
  };

  /* ---------- SUGERENCIAS ---------------------------------- */
  const buildSuggestions = () => {
    const tipo = Number(elType.value);
    const dur  = TIPOS[tipo]?.dur || 60;
    const ther = elTherapist.value;
    const sala = elRoom.value;
    const pac  = elPatient.value;
    if(!ther || !sala || !pac) return;

    const today = new Date(); today.setHours(0,0,0,0);
    const maxDate = new Date(today); maxDate.setMonth(maxDate.getMonth()+6);

    const candidates = [];
    let d = new Date(today);
    let daysChecked = 0;

    while(candidates.length < 6 && daysChecked < 90) {
      if(!isWE(d) && d <= maxDate) {
        const f = iso(d);
        for(let h=OPEN; h<CLOSE; h++) {
          for(let m=0; m<60; m+=SLOT) {
            const hora = `${pad(h)}:${pad(m)}`;
            const endMin = toMin(hora) + dur;
            if(endMin > (CLOSE+0.5)*60) continue;
            const ok =
              !isBusyFor('ther',     ther, f, hora, dur, originalEvent.id) &&
              !isBusyFor('sala',     sala, f, hora, dur, originalEvent.id) &&
              !isBusyFor('paciente', pac,  f, hora, dur, originalEvent.id);
            if(ok) {
              const daysFromToday = Math.round((d-today)/(86400000));
              let score = 0;
              if(daysFromToday===0) score+=50;
              else if(daysFromToday===1) score+=30;
              else if(daysFromToday===2) score+=10;
              if(h<=10) score+=20;
              else if(h<=12) score+=10;
              candidates.push({f, hora, score});
              if(candidates.length >= 6) break;
            }
          }
          if(candidates.length >= 6) break;
        }
      }
      d = addD(d,1);
      daysChecked++;
    }

    candidates.sort((a,b) => b.score - a.score);

    if(!candidates.length) {
      elSuggestSection.classList.add('hidden');
      return;
    }

    elSuggestList.innerHTML = candidates.map((c,i) => {
      const isBest = i===0;
      return `<div class="rep-suggest-item${isBest?' suggest-best':''}" data-f="${c.f}" data-h="${c.hora}">
        <span class="rep-suggest-badge">${isBest?'Mejor opción':'Disponible'}</span>
        <span class="rep-suggest-time">${fmtDate(c.f)} ${fmtH(c.hora)}</span>
      </div>`;
    }).join('');

    elSuggestSection.classList.remove('hidden');

    elSuggestList.querySelectorAll('.rep-suggest-item').forEach(el => {
      el.addEventListener('click', () => {
        const f = el.dataset.f;
        const h = el.dataset.h;
        applyDatetime(f, h);
      });
    });
  };

  const applyDatetime = (f, h) => {
    selectedDate = f;
    selectedTime = h;
    calViewDate  = pISO(f);
    buildCalendar();
    buildSlots(f);
    updateNewSlotDisplay();
    updateAvailability();
    elConfirmBtn.disabled = false;
  };

  /* ---------- INDICADOR "nueva fecha" ---------------------- */
  const updateNewSlotDisplay = () => {
    if(!selectedDate || !selectedTime) { elNewSlot.classList.add('hidden'); return; }
    const tipo = Number(elType.value);
    const dur  = TIPOS[tipo]?.dur || originalEvent.dur || 60;
    elNewSlotText.textContent = `${fmtDate(selectedDate)}  ${fmtH(selectedTime)} – ${fmtH(addM(selectedTime, dur))}`;
    elNewSlot.classList.remove('hidden');
  };

  /* ---------- CALENDARIO MENSUAL --------------------------- */
  const buildCalendar = () => {
    const year  = calViewDate.getFullYear();
    const month = calViewDate.getMonth();
    const title = calViewDate.toLocaleDateString('es-ES',{month:'long',year:'numeric'});
    elCalTitle.textContent = title.charAt(0).toUpperCase() + title.slice(1);

    const first  = new Date(year, month, 1);
    const last   = new Date(year, month+1, 0);
    const startWD = first.getDay(); /* 0=Dom */

    const today = new Date(); today.setHours(0,0,0,0);
    const maxDate = new Date(today); maxDate.setMonth(maxDate.getMonth()+MAX_M);

    elCalGrid.innerHTML = '';

    /* Celdas vacías antes del primer día */
    for(let i=0; i<startWD; i++) {
      const empty = document.createElement('div');
      empty.className = 'rep-cal-day other-month';
      elCalGrid.appendChild(empty);
    }

    for(let day=1; day<=last.getDate(); day++) {
      const d    = new Date(year, month, day);
      const dISO = iso(d);
      const btn  = document.createElement('div');
      btn.textContent = day;

      const classes = ['rep-cal-day'];
      const isToday = (iso(today) === dISO);
      if(isToday) classes.push('today');

      if(isWE(d)) {
        classes.push('weekend');
      } else if(d < today) {
        classes.push('past');
      } else if(d > maxDate) {
        classes.push('past');
      } else {
        /* Marcar si hay eventos ese día (para info visual) */
        const hasBusy = eventos.some(e => e.fecha === dISO && e.id !== originalEvent.id);
        if(hasBusy) classes.push('busy-day');
        classes.push('available');

        if(selectedDate === dISO) classes.push('selected');

        btn.addEventListener('click', () => {
          selectedDate = dISO;
          selectedTime = null;
          buildCalendar();
          buildSlots(dISO);
          elConfirmBtn.disabled = true;
          elNewSlot.classList.add('hidden');
          elAvailSection.classList.add('hidden');
          elSuggestSection.classList.add('hidden');
        });
      }

      btn.className = classes.join(' ');
      elCalGrid.appendChild(btn);
    }
  };

  elPrevMonth.addEventListener('click', () => {
    calViewDate = new Date(calViewDate.getFullYear(), calViewDate.getMonth()-1, 1);
    buildCalendar();
  });
  elNextMonth.addEventListener('click', () => {
    calViewDate = new Date(calViewDate.getFullYear(), calViewDate.getMonth()+1, 1);
    buildCalendar();
  });

  /* ---------- SLOTS DE HORA -------------------------------- */
  const buildSlots = (fecha) => {
    const tipo = Number(elType.value);
    const dur  = TIPOS[tipo]?.dur || originalEvent.dur || 60;
    const ther = elTherapist.value;
    const sala = elRoom.value;
    const pac  = elPatient.value;

    elSlotsGrid.innerHTML = '';

    for(let h=OPEN; h<CLOSE; h++) {
      for(let m=0; m<60; m+=SLOT) {
        const hora   = `${pad(h)}:${pad(m)}`;
        const endMin = toMin(hora) + dur;
        if(endMin > (CLOSE+0.5)*60) continue;

        const therBusy = ther ? isBusyFor('ther',     ther, fecha, hora, dur, originalEvent.id) : false;
        const salaBusy = sala ? isBusyFor('sala',     sala, fecha, hora, dur, originalEvent.id) : false;
        const pacBusy  = pac  ? isBusyFor('paciente', pac,  fecha, hora, dur, originalEvent.id) : false;
        const isBusy   = therBusy || salaBusy || pacBusy;

        const slot = document.createElement('div');
        slot.className = `rep-slot ${isBusy ? 'slot-busy' : 'slot-free'}`;
        if(selectedDate === fecha && selectedTime === hora) {
          slot.classList.remove('slot-free');
          slot.classList.add('slot-selected');
        }
        slot.textContent = fmtH(hora);
        slot.title = isBusy ? 'Horario ocupado' : hora;

        if(!isBusy) {
          slot.addEventListener('click', () => {
            selectedTime = hora;
            buildSlots(fecha);
            updateNewSlotDisplay();
            updateAvailability();
            elConfirmBtn.disabled = false;
          });
        }

        elSlotsGrid.appendChild(slot);
      }
    }
  };

  /* ---------- MODAL CONFIRMACIÓN -------------------------- */
  const showConfirm = () => {
    const tipo   = Number(elType.value);
    const dur    = TIPOS[tipo]?.dur || 60;
    const nombre = TIPOS[tipo]?.nombre || '';
    const ther   = elTherapist.value;
    const sala   = elRoom.value;
    const pac    = elPatient.value;
    const fee    = tipo===2 ? Number(elFee.value||0) : null;

    elConfirmSum.innerHTML = `
      <div class="summary-row"><span class="label">Acción:</span><span class="value">Reprogramar evento</span></div>
      <div class="summary-row"><span class="label">Tipo:</span><span class="value">${nombre}</span></div>
      <div class="summary-row"><span class="label">Paciente:</span><span class="value">${pac}</span></div>
      <div class="summary-row"><span class="label">Terapeuta:</span><span class="value">${ther}</span></div>
      <div class="summary-row"><span class="label">Sala:</span><span class="value">${sala}</span></div>
      <div class="summary-row"><span class="label">Fecha anterior:</span><span class="value">${fmtDate(originalEvent.fecha)} ${fmtH(originalEvent.hora)}</span></div>
      <div class="summary-row"><span class="label">Nueva fecha:</span><span class="value">${fmtDate(selectedDate)} ${fmtH(selectedTime)} – ${fmtH(addM(selectedTime,dur))}</span></div>
      <div class="summary-row"><span class="label">Folio:</span><span class="value">${originalEvent.folio}</span></div>
      ${fee!=null ? `<div class="summary-row"><span class="label">Cuota:</span><span class="value">$${fee.toFixed(2)} MXN</span></div>` : ''}
    `;
    elConfirmModal.style.display = 'block';
  };

  elConfCancelBtn.addEventListener('click', () => elConfirmModal.style.display='none');

  elConfSaveBtn.addEventListener('click', () => {
    const tipo   = Number(elType.value);
    const dur    = TIPOS[tipo]?.dur || 60;
    const ther   = elTherapist.value;
    const sala   = elRoom.value;
    const pac    = elPatient.value;
    const fee    = tipo===2 ? Number(elFee.value||0) : null;
    const proof  = elProof.files[0];

    const updatedEvent = {
      ...originalEvent,
      tipo,
      paciente: pac,
      ther,
      sala,
      fecha:  selectedDate,
      hora:   selectedTime,
      dur,
      fee,
      proof: (tipo===2 && proof) ? proof.name : originalEvent.proof
    };

    /* Reemplazar evento en el arreglo */
    const idx = eventos.findIndex(e => e.id === originalEvent.id);
    if(idx >= 0) eventos[idx] = updatedEvent;
    else eventos.push(updatedEvent);

    /* Persistir y volver */
    localStorage.setItem('agenda_events', JSON.stringify(eventos));
    localStorage.setItem('agenda_folios', JSON.stringify(folios));
    localStorage.removeItem('reprogramar_event');

    showToast('Evento reprogramado exitosamente', 'success');
    setTimeout(() => window.location.href='agenda.html', 900);
  });

  /* ---------- BOTÓN CONFIRMAR ------------------------------ */
  elConfirmBtn.addEventListener('click', () => {
    const errors = validate(selectedDate, selectedTime);
    if(errors.length) { showValidation(errors,'error'); return; }
    showValidation([]);
    showConfirm();
  });

  /* ---------- CANCELAR ------------------------------------- */
  elCancelBtn.addEventListener('click', () => {
    localStorage.removeItem('reprogramar_event');
    window.location.href = 'agenda.html';
  });

  /* ---------- INICIALIZAR ---------------------------------- */
  buildCalendar();
});
