/* ============================================================
   agenda.js  – v4 (mejoras de usabilidad: estados visuales,
                     validación inline, sugerencias automáticas,
                     confirmación previa, panel de disponibilidad)
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
  const diffM= (a,b)=>(a.getFullYear()-b.getFullYear())*12+a.getMonth()-b.getMonth();
  const fmtH = t => {const [h,m]=t.split(':').map(Number);const p=h>=12?'PM':'AM';return `${h%12||12}:${pad(m)} ${p}`;};

  /* ---------- JORNADA ------------------------------------ */
  const OPEN=9, CLOSE=17, SLOT=30, ROWS=((CLOSE-OPEN)*60)/SLOT+2, MAX_M=6;

  /* ---------- TIPOS EVENTO ------------------------------- */
  const TIPOS={
    1:{nombre:'Evaluación inicial integral',dur:60,terapeutas:['Terapeuta A','Terapeuta B']},
    2:{nombre:'Cita de terapia',            dur:60,terapeutas:['Terap. 1','Terap. 2','Terap. 3','Terap. 4']}
  };

  /* ---------- SALAS -------------------------------------- */
  const SALAS=['Sala 101','Sala 102','Sala 103'];

  /* ---------- ERRORES ------------------------------------ */
  const ERR={
    weekend   :'No se pueden programar eventos en fin de semana.',
    hours     :'El evento excede el horario (09:00 – 17:30).',
    slotStep  :'Solo minutos :00 o :30.',
    patientBusy:'El paciente ya tiene un evento que se traslapa.',
    salaBusy  :'La sala está ocupada en ese rango.',
    therBusy  :'El terapeuta está ocupado en ese rango.',
    oneEvalDay:'Solo una evaluación integral al día por paciente.',
    dateRange :'No se permiten fechas a más de seis meses de hoy.',
    fileType  :'Formato de comprobante no permitido.',
    fileSize  :'El archivo supera 5 MB.'
  };

  /* ---------- DOM refs ----------------------------------- */
  const grid          = document.getElementById('calendarContainer');
  const filtroFecha   = document.getElementById('filterDate');
  const filtroTipo    = document.getElementById('filterType');
  const btnNuevo      = document.getElementById('newEventBtn');
  const btnPrint      = document.getElementById('printView');
  const btnToggle     = document.getElementById('sidebarToggle');
  const btnShowSidebar= document.getElementById('sidebarShowBtn');
  const sidebar       = document.getElementById('sidebar');

  /* --- mini calendario --- */
  const miniCalGrid   = document.getElementById('miniCalendar');
  const miniCalTitle  = document.getElementById('miniCalTitle');
  const btnPrevMonth  = document.getElementById('prevMonth');
  const btnNextMonth  = document.getElementById('nextMonth');

  /* --- modal NUEVO/EDIT --- */
  const modal      = document.getElementById('newEventModal');
  const closeModal = document.getElementById('closeNewEventModal');
  const form       = document.getElementById('newEventForm');
  const modalTitle = document.getElementById('newEventTitle');

  const selTipo    = document.getElementById('eventType');
  const selPaciente= document.getElementById('eventPatient');
  const selTher    = document.getElementById('eventTherapist');
  const selSala    = document.getElementById('eventRoom');
  const inFolio    = document.getElementById('eventFolio');
  const inFecha    = document.getElementById('eventDate');
  const inHora     = document.getElementById('eventStartTime');
  const lblDur     = document.getElementById('eventDurationLabel');
  const hidDur     = document.getElementById('eventDuration');
  const payProof   = document.getElementById('payProof');
  const payProofGrp= document.getElementById('payProofGroup');
  const feeGroup   = document.getElementById('feeGroup');
  const inFee      = document.getElementById('eventFee');

  /* --- validación inline --- */
  const valMsgs    = document.getElementById('validationMessages');

  /* --- panel de disponibilidad --- */
  const availPanel = document.getElementById('availabilityPanel');
  const availContent=document.getElementById('availabilityContent');

  /* --- sugerencias --- */
  const suggArea   = document.getElementById('suggestionsArea');
  const suggList   = document.getElementById('suggestionsList');

  /* --- modal confirmación --- */
  const confirmModal    = document.getElementById('confirmModal');
  const confirmSummary  = document.getElementById('confirmSummary');
  const confirmCancelBtn= document.getElementById('confirmCancelBtn');
  const confirmSaveBtn  = document.getElementById('confirmSaveBtn');
  const closeConfirmBtn = document.getElementById('closeConfirmModal');

  /* --- toast --- */
  const toast       = document.getElementById('toastNotification');
  const toastMsg    = document.getElementById('toastMessage');

  /* --- modal DETALLES --- */
  const detModal   = document.getElementById('appointmentModal');
  const detInfo    = document.getElementById('modalInfo');
  const detClose   = document.getElementById('closeModal');

  /* ---------- DATA --------------------------------------- */
  const eventos=[];
  const folios ={};

  /* ---------- HELPERS FOLIO ------------------------------ */
  const getFolio = pac => {
    if(!folios[pac]){
      folios[pac]='F-'+pac.split(' ').map(w=>w[0]).join('')+'-'+Math.random().toString(36).slice(2,6).toUpperCase();
    }
    return folios[pac];
  };

  /* ---------- DEMO EJEMPLOS ------------------------------ */
  const EJ='__ejemplo__';
  const genEj = sem => {
    if(window[EJ]) return;
    const p1='Elena Castillo', p2='Luis García';
    folios[p1]=getFolio(p1); folios[p2]=getFolio(p2);
    eventos.push(
      {id:'ex1',tipo:1,paciente:p1,fecha:iso(sem),hora:'10:00',sala:'Sala 101',ther:'Terapeuta A',dur:60,folio:folios[p1],fee:null,proof:''},
      {id:'ex2',tipo:2,paciente:p2,fecha:iso(addD(sem,2)),hora:'09:30',sala:'Sala 102',ther:'Terap. 2',dur:60,folio:folios[p2],fee:350,proof:''}
    );
    window[EJ]=true;
  };

  /* ========================================================
     TOAST NOTIFICATIONS (feedback visual inmediato)
     ======================================================== */
  let toastTimer=null;
  const showToast = (message, type='success') => {
    clearTimeout(toastTimer);
    toast.className = 'toast-notification toast-show toast-' + type;
    toastMsg.textContent = message;
    toastTimer = setTimeout(()=>{
      toast.classList.remove('toast-show');
    }, 3000);
  };

  /* ========================================================
     MENSAJES DE VALIDACIÓN INLINE
     (reemplaza alert() por feedback contextual)
     ======================================================== */
  const showValidation = (messages, type='error') => {
    if(!messages || messages.length===0){
      valMsgs.className = 'validation-messages';
      valMsgs.innerHTML = '';
      return;
    }
    valMsgs.className = 'validation-messages has-messages msg-' + type;
    valMsgs.innerHTML = messages.map(m =>
      `<div class="msg-item"><span class="msg-icon">${type==='error'?'✕':'⚠'}</span><span>${m}</span></div>`
    ).join('');
  };

  const clearValidation = () => {
    valMsgs.className = 'validation-messages';
    valMsgs.innerHTML = '';
  };

  /* ========================================================
     MINI CALENDARIO (panel izquierdo)
     ======================================================== */
  const DIAS_SEM = ['D','L','M','M','J','V','S'];
  const MESES = ['enero','febrero','marzo','abril','mayo','junio',
                 'julio','agosto','septiembre','octubre','noviembre','diciembre'];

  let miniCalDate = new Date();

  const buildMiniCalendar = () => {
    miniCalGrid.innerHTML = '';
    const year = miniCalDate.getFullYear();
    const month = miniCalDate.getMonth();

    miniCalTitle.textContent = `${MESES[month]} ${year}`;

    DIAS_SEM.forEach(d => {
      const el = document.createElement('div');
      el.className = 'mini-cal-day-name';
      el.textContent = d;
      miniCalGrid.appendChild(el);
    });

    const firstDay = new Date(year, month, 1);
    const startOffset = firstDay.getDay();
    const daysInMonth = new Date(year, month+1, 0).getDate();
    const daysInPrev = new Date(year, month, 0).getDate();

    const today = new Date();
    const todayISO = iso(today);
    const selectedISO = filtroFecha.value;
    const selectedDate = selectedISO ? pISO(selectedISO) : today;
    const weekStart = mon(selectedDate);
    const weekEnd = addD(weekStart, 4);
    const weekStartISO = iso(weekStart);
    const weekEndISO = iso(weekEnd);

    for(let i = startOffset - 1; i >= 0; i--){
      const dayNum = daysInPrev - i;
      const d = new Date(year, month-1, dayNum);
      miniCalGrid.appendChild(createMiniDay(dayNum, d, true));
    }

    for(let i = 1; i <= daysInMonth; i++){
      const d = new Date(year, month, i);
      miniCalGrid.appendChild(createMiniDay(i, d, false));
    }

    const totalCells = miniCalGrid.children.length;
    const remaining = 42 - totalCells;
    for(let i = 1; i <= remaining; i++){
      const d = new Date(year, month+1, i);
      miniCalGrid.appendChild(createMiniDay(i, d, true));
    }
  };

  const createMiniDay = (num, date, isOtherMonth) => {
    const el = document.createElement('div');
    el.className = 'mini-cal-day';
    el.textContent = num;

    const dISO = iso(date);
    const today = new Date();
    const todayISO = iso(today);

    if(isOtherMonth) el.classList.add('other-month');
    if([0,6].includes(date.getDay())) el.classList.add('weekend');
    if(dISO === todayISO) el.classList.add('today');

    const selectedDate = filtroFecha.value ? pISO(filtroFecha.value) : today;
    const weekStart = mon(selectedDate);
    const weekStartISO = iso(weekStart);
    const weekEndISO = iso(addD(weekStart, 4));
    if(dISO >= weekStartISO && dISO <= weekEndISO) el.classList.add('current-week');

    if(dISO === filtroFecha.value) el.classList.add('selected');

    el.addEventListener('click', () => {
      filtroFecha.value = dISO;
      render();
      buildMiniCalendar();
    });

    return el;
  };

  btnPrevMonth.addEventListener('click', () => {
    miniCalDate.setMonth(miniCalDate.getMonth() - 1);
    buildMiniCalendar();
  });

  btnNextMonth.addEventListener('click', () => {
    miniCalDate.setMonth(miniCalDate.getMonth() + 1);
    buildMiniCalendar();
  });

  /* ---------- SIDEBAR TOGGLE ------------------------------ */
  btnToggle.addEventListener('click', () => {
    sidebar.classList.add('collapsed');
    btnShowSidebar.classList.remove('hidden');
  });
  btnShowSidebar.addEventListener('click', () => {
    sidebar.classList.remove('collapsed');
    btnShowSidebar.classList.add('hidden');
  });

  /* ========================================================
     RENDER GRID SEMANAL (con estados visuales de celda)
     ======================================================== */
  let headerMap={};

  const buildHeader = (start, cols) => {
    headerMap={};
    const corner = document.createElement('div');
    corner.className = 'day-header';
    grid.appendChild(corner);

    for(let c=0;c<cols;c++){
      const d = addD(start,c);
      const h = document.createElement('div');
      h.className = 'day-header';
      const dayName = document.createElement('span');
      dayName.className = 'day-name';
      dayName.textContent = d.toLocaleDateString('es-ES',{weekday:'short'});
      const dayNum = document.createElement('span');
      dayNum.className = 'day-number';
      dayNum.textContent = d.getDate();
      h.appendChild(dayName);
      h.appendChild(dayNum);
      grid.appendChild(h);
      headerMap[iso(d)]=h;
    }
  };

  const buildRows = (start,cols) => {
    for(let r=0;r<ROWS;r++){
      const mins=r*SLOT, hh=OPEN+Math.floor(mins/60), mm=mins%60;
      const tl=document.createElement('div');
      tl.className='time-cell'; tl.textContent=`${pad(hh)}:${pad(mm)}`;
      grid.appendChild(tl);
      for(let c=0;c<cols;c++){
        const cell=document.createElement('div');
        cell.className='empty-cell cell-container';
        cell.dataset.fecha=iso(addD(start,c));
        cell.dataset.hora=`${pad(hh)}:${pad(mm)}`;
        cell.onclick=()=>openModal(cell.dataset.fecha,cell.dataset.hora);
        grid.appendChild(cell);
      }
    }
  };

  const placeEvents = (start,cols) => {
    const end=iso(addD(start,cols-1));
    const typeFilter = filtroTipo.value ? Number(filtroTipo.value) : null;

    eventos.forEach(ev=>{
      if(ev.fecha<iso(start)||ev.fecha>end) return;
      if(typeFilter && ev.tipo !== typeFilter) return;

      const slots=ev.dur/SLOT;
      for(let i=0;i<slots;i++){
        const t=addM(ev.hora,i*SLOT);
        const cont=grid.querySelector(`.cell-container[data-fecha="${ev.fecha}"][data-hora="${t}"]`);
        if(!cont) continue;
        const div=document.createElement('div');
        div.className=`appointment tipo-${ev.tipo}`;
        if(i===0) div.textContent=`${TIPOS[ev.tipo].nombre} – ${ev.paciente}`;
        div.onclick=e=>{e.stopPropagation();showDetails(ev);};
        cont.appendChild(div);
      }
    });
  };

  /* --- Marcado visual de estados de celda (disponible/ocupado/conflicto/recomendado) --- */
  const renderCellStates = () => {
    const cells = grid.querySelectorAll('.cell-container');
    cells.forEach(cell => {
      cell.classList.remove('cell-available','cell-occupied','cell-conflict','cell-recommended');
      const fecha = cell.dataset.fecha;
      const hora  = cell.dataset.hora;
      if(!fecha || !hora) return;

      const hasEvent = eventos.some(ev => {
        return ev.fecha === fecha && toMin(ev.hora) <= toMin(hora) && toMin(hora) < toMin(ev.hora) + ev.dur;
      });

      if(hasEvent){
        cell.classList.add('cell-occupied');
      } else {
        cell.classList.add('cell-available');
      }
    });
  };

  const colorHeaders = () => {
    Object.values(headerMap).forEach(el=>{
      el.classList.remove('day-low','day-mid','day-high');
    });
    Object.entries(headerMap).forEach(([f,el])=>{
      const pct=eventos.filter(e=>e.fecha===f).length/ROWS*100;
      if(pct<25)      el.classList.add('day-low');
      else if(pct<75) el.classList.add('day-mid');
      else            el.classList.add('day-high');
    });
  };

  const render = () => {
    grid.innerHTML='';
    let ref = filtroFecha.value ? pISO(filtroFecha.value) : new Date();
    if(isWE(ref)) ref = mon(ref);
    genEj(mon(ref));
    filtroFecha.value = iso(ref);

    const cols = 5;
    const start = mon(ref);
    grid.style.gridTemplateColumns = `60px repeat(${cols},1fr)`;

    buildHeader(start,cols);
    buildRows(start,cols);
    placeEvents(start,cols);
    renderCellStates();
    colorHeaders();
  };

  /* ========================================================
     VALIDACIÓN (con detección de conflictos)
     ======================================================== */
  const busy = (prop,val,f,h,d,skipId=null) => {
    for(let m=0;m<d;m+=SLOT){
      if(eventos.some(e=>e[prop]===val && e.id!==skipId && e.fecha===f && e.hora===addM(h,m)))
        return true;
    }
    return false;
  };

  const overlap = (a,b)=>
    Math.max(toMin(a.hora),toMin(b.hora)) < Math.min(toMin(a.hora)+a.dur,toMin(b.hora)+b.dur);

  const validate = (ev,editId) => {
    const errors=[];
    const d=pISO(ev.fecha);
    if(isWE(d))                     errors.push(ERR.weekend);
    if(diffM(d,new Date())>MAX_M)   errors.push(ERR.dateRange);

    const [ ,M]=ev.hora.split(':').map(Number);
    if(M!==0&&M!==30)               errors.push(ERR.slotStep);
    if(toMin(ev.hora)+ev.dur>=(CLOSE*60+30)) errors.push(ERR.hours);

    if(eventos.some(e=>e.id!==editId && e.paciente===ev.paciente && e.fecha===ev.fecha && overlap(ev,e)))
      errors.push(ERR.patientBusy);

    if(busy('sala',ev.sala,ev.fecha,ev.hora,ev.dur,editId)) errors.push(ERR.salaBusy);
    if(busy('ther',ev.ther,ev.fecha,ev.hora,ev.dur,editId)) errors.push(ERR.therBusy);

    if(ev.tipo===1 && eventos.some(e=>e.id!==editId && e.tipo===1 && e.paciente===ev.paciente && e.fecha===ev.fecha))
      errors.push(ERR.oneEvalDay);

    if(ev.tipo===2){
      const f=payProof.files[0];
      if(f){
        if(!/pdf|png|jpe?g$/i.test(f.type)) errors.push(ERR.fileType);
        if(f.size>5*1024*1024)              errors.push(ERR.fileSize);
      }
    }
    return errors;
  };

  /* ========================================================
     MOTOR DE SUGERENCIAS AUTOMÁTICAS
     (alternativas priorizadas cuando hay conflicto)
     ======================================================== */
  const findAlternatives = (ev) => {
    const alternatives=[];
    const baseDate = pISO(ev.fecha);
    const editId = editing ? editing.id : null;

    // Buscar en el mismo día y los próximos 5 días hábiles
    for(let dayOffset=0; dayOffset<=5; dayOffset++){
      const tryDate = addD(baseDate, dayOffset);
      if(isWE(tryDate)) continue;
      const tryISO = iso(tryDate);
      const dur = TIPOS[ev.tipo]?.dur || 60;

      for(let m=0; m<(CLOSE-OPEN)*60; m+=SLOT){
        const tryHora = addM(`${pad(OPEN)}:00`, m);
        if(toMin(tryHora)+dur > (CLOSE*60+30)) break;

        // Verificar conflictos para esta combinación
        const testEv = {...ev, fecha:tryISO, hora:tryHora, dur};
        const errors = validate(testEv, editId);

        if(errors.length===0){
          // Verificar disponibilidad de terapeuta y sala para esta alternativa
          const therAvailable = !busy('ther', testEv.ther, testEv.fecha, testEv.hora, testEv.dur, editId);
          const salaAvailable = !busy('sala', testEv.sala, testEv.fecha, testEv.hora, testEv.dur, editId);
          const patientAvailable = !eventos.some(e=>e.id!==editId && e.paciente===testEv.paciente && e.fecha===testEv.fecha && overlap(testEv, e));

          if(therAvailable && salaAvailable && patientAvailable){
            let score = 100;
            if(dayOffset===0) score += 50; // Mismo día es mejor
            else if(dayOffset===1) score += 30;
            else if(dayOffset===2) score += 10;

            // Hora temprana tiene mejor puntuación
            if(toMin(tryHora) <= toMin('10:00')) score += 20;
            else if(toMin(tryHora) <= toMin('12:00')) score += 10;

            alternatives.push({
              fecha: tryISO,
              hora: tryHora,
              dur,
              score,
              dayOffset,
              terapeuta: testEv.ther,
              sala: testEv.sala
            });
          }
        }
      }
      // Limitar a máximo 5 días de búsqueda
      if(dayOffset >= 5) break;
    }

    // Ordenar por puntuación (mayor primero = mejor opción)
    alternatives.sort((a,b) => b.score - a.score);

    return alternatives.slice(0, 6); // Mostrar máximo 6 sugerencias
  };

  const renderSuggestions = (alternatives) => {
    if(!alternatives || alternatives.length===0){
      suggArea.classList.add('hidden');
      suggList.innerHTML='';
      return;
    }
    suggArea.classList.remove('hidden');

    const d = pISO(inFecha.value);
    const dateStr = d.toLocaleDateString('es-ES',{weekday:'long', day:'numeric', month:'long'});

    suggList.innerHTML = alternatives.map((alt, i) => {
      const altDate = pISO(alt.fecha);
      const isSameDay = alt.fecha === inFecha.value;
      const dateLabel = isSameDay ? 'Mismo día' : altDate.toLocaleDateString('es-ES',{weekday:'short', day:'numeric'});
      const priorityClass = i===0 ? 'priority-best' : (i<3 ? 'priority-good' : 'priority-ok');
      const priorityLabel = i===0 ? 'Mejor opción' : (i<3 ? 'Buena opción' : 'Disponible');
      const cardClass = i===0 ? 'suggestion-card suggestion-best' : 'suggestion-card';

      return `<div class="${cardClass}" data-fecha="${alt.fecha}" data-hora="${alt.hora}">
        <div class="suggestion-info">
          <span class="suggestion-priority ${priorityClass}">${priorityLabel}</span>
          <span>${fmtH(alt.hora)} – ${fmtH(addM(alt.hora, alt.dur))}</span>
          <span style="color:var(--clr-text-secondary);font-size:.75rem;">${dateLabel}</span>
        </div>
        <span class="suggestion-apply">Aplicar →</span>
      </div>`;
    }).join('');

    // Asignar click a cada sugerencia
    suggList.querySelectorAll('.suggestion-card').forEach(card => {
      card.addEventListener('click', () => {
        inFecha.value = card.dataset.fecha;
        inHora.value = card.dataset.hora;
        clearValidation();
        runRealTimeChecks();
      });
    });
  };

  /* ========================================================
     PANEL DE DISPONIBILIDAD EN TIEMPO REAL
     ======================================================== */
  const updateAvailabilityPanel = () => {
    const tipo = selTipo.value;
    const ther = selTher.value;
    const sala = selSala.value;
    const paciente = selPaciente.value;
    const fecha = inFecha.value;
    const hora = inHora.value;

    if(!tipo || !ther || !sala || !paciente || !fecha || !hora){
      availPanel.classList.add('hidden');
      return;
    }

    const dur = TIPOS[tipo]?.dur || 60;
    const editId = editing ? editing.id : null;

    const therBusy = busy('ther', ther, fecha, hora, dur, editId);
    const salaBusy = busy('sala', sala, fecha, hora, dur, editId);
    const patBusy = eventos.some(e=>e.id!==editId && e.paciente===paciente && e.fecha===fecha &&
      toMin(e.hora) < toMin(hora)+dur && toMin(hora) < toMin(e.hora)+e.dur);

    availPanel.classList.remove('hidden');
    availContent.innerHTML = `
      <div class="avail-card ${therBusy?'avail-busy':'avail-ok'}">
        <span class="avail-icon">${therBusy?'✕':'✓'}</span>
        <span>Terapeuta: ${therBusy?'Ocupado':'Disponible'}</span>
      </div>
      <div class="avail-card ${salaBusy?'avail-busy':'avail-ok'}">
        <span class="avail-icon">${salaBusy?'✕':'✓'}</span>
        <span>Sala ${sala}: ${salaBusy?'Ocupada':'Disponible'}</span>
      </div>
      <div class="avail-card ${patBusy?'avail-busy':'avail-ok'}">
        <span class="avail-icon">${patBusy?'✕':'✓'}</span>
        <span>Paciente: ${patBusy?'Ocupado':'Disponible'}</span>
      </div>
    `;
  };

  /* ========================================================
     VALIDACIÓN EN TIEMPO REAL (al cambiar campos del form)
     ======================================================== */
  const getFormData = () => {
    return {
      tipo: Number(selTipo.value),
      paciente: selPaciente.value,
      ther: selTher.value,
      sala: selSala.value,
      fecha: inFecha.value,
      hora: inHora.value,
      dur: Number(hidDur.value) || (TIPOS[selTipo.value]?.dur || 60),
      fee: selTipo.value==='2' ? Number(inFee.value||0) : null,
      folio: inFolio.value
    };
  };

  const runRealTimeChecks = () => {
    const ev = getFormData();
    if(!ev.tipo || !ev.fecha || !ev.hora || !ev.ther || !ev.sala || !ev.paciente){
      clearValidation();
      suggArea.classList.add('hidden');
      availPanel.classList.add('hidden');
      clearFieldStates();
      return;
    }

    const editId = editing ? editing.id : null;
    const errors = validate(ev, editId);

    updateAvailabilityPanel();

    if(errors.length > 0){
      showValidation(errors, 'error');
      setFieldStates(errors);
      // Mostrar sugerencias si hay conflictos de agenda
      if(errors.some(e => e.includes('traslapa') || e.includes('ocupad'))){
        const alternatives = findAlternatives(ev);
        renderSuggestions(alternatives);
      } else {
        suggArea.classList.add('hidden');
      }
    } else {
      showValidation([]);
      clearFieldStates();
      suggArea.classList.add('hidden');
    }
  };

  /* --- Marcar campos con error visualmente --- */
  const setFieldStates = (errors) => {
    clearFieldStates();
    const pacienteGroup = selPaciente.closest('.form-group');
    const therGroup = selTher.closest('.form-group');
    const salaGroup = selSala.closest('.form-group');

    if(errors.some(e => e.includes('paciente'))) pacienteGroup?.classList.add('has-error');
    if(errors.some(e => e.includes('terapeuta') || e.includes('Terapeuta'))) therGroup?.classList.add('has-error');
    if(errors.some(e => e.includes('sala') || e.includes('Sala'))) salaGroup?.classList.add('has-error');
    if(errors.some(e => e.includes('fin de semana') || e.includes('horario') || e.includes('minutos') || e.includes('meses'))){
      inFecha.closest('.form-group')?.classList.add('has-error');
      inHora.closest('.form-group')?.classList.add('has-error');
    }
  };

  const clearFieldStates = () => {
    document.querySelectorAll('.form-group.has-error').forEach(g => g.classList.remove('has-error'));
  };

  /* --- Escuchar cambios en campos para validación en tiempo real --- */
  selTipo.addEventListener('change', () => { refreshTher(); setTimeout(runRealTimeChecks, 50); });
  selPaciente.addEventListener('change', () => { inFolio.value=getFolio(selPaciente.value); setTimeout(runRealTimeChecks, 50); });
  selTher.addEventListener('change', () => setTimeout(runRealTimeChecks, 50));
  selSala.addEventListener('change', () => setTimeout(runRealTimeChecks, 50));
  inFecha.addEventListener('change', () => setTimeout(runRealTimeChecks, 50));
  inHora.addEventListener('change', () => setTimeout(runRealTimeChecks, 50));

  /* ---------- FORM DINÁMICO ------------------------------- */
  const refreshTher = () => {
    const cfg=TIPOS[selTipo.value]||{terapeutas:[],dur:''};
    selTher.innerHTML='<option value="">Seleccionar terapeuta</option>' +
                      cfg.terapeutas.map(t=>`<option>${t}</option>`).join('');
    lblDur.textContent=cfg.dur?`${cfg.dur} min`:'--';
    hidDur.value=cfg.dur||'';
    feeGroup.classList.toggle('hidden', selTipo.value!=='2');
    payProofGrp.classList.toggle('hidden', selTipo.value==='1');
  };

  /* ---------- MODAL NUEVO / EDIT -------------------------- */
  let editing=null;
  const openModal = (f,h,ev=null) => {
    editing=ev;
    form.reset();
    refreshTher();
    clearValidation();
    suggArea.classList.add('hidden');
    availPanel.classList.add('hidden');
    clearFieldStates();
    modalTitle.textContent=ev?'Reprogramar evento':'Nuevo Evento';
    if(ev){
      selTipo.value=ev.tipo;
      selPaciente.value=ev.paciente;
      inFolio.value=ev.folio;
      selSala.value=ev.sala;
      selTher.value=ev.ther;
      inFee.value=ev.fee||'';
      refreshTher();
    }else{
      inFolio.value=''; inFee.value='';
    }
    inFecha.value=f;
    inHora.value=h;
    modal.style.display='block';
    // Ejecutar validación en tiempo real al abrir
    setTimeout(runRealTimeChecks, 100);
  };

  btnNuevo.onclick = () => {
    let d=new Date(); if(isWE(d)) d=mon(d);
    openModal(iso(d),`${pad(OPEN)}:00`);
  };
  closeModal.onclick = () => modal.style.display='none';

  /* ========================================================
     MODAL DE CONFIRMACIÓN (antes de guardar cambios)
     ======================================================== */
  let pendingEvent = null;

  const showConfirmation = (ev) => {
    pendingEvent = ev;
    const isEditing = !!editing;
    const actionText = isEditing ? 'Reprogramar' : 'Crear';

    confirmSummary.innerHTML = `
      <div class="summary-row"><span class="label">Acción:</span><span class="value">${actionText} evento</span></div>
      <div class="summary-row"><span class="label">Tipo:</span><span class="value">${TIPOS[ev.tipo].nombre}</span></div>
      <div class="summary-row"><span class="label">Paciente:</span><span class="value">${ev.paciente}</span></div>
      <div class="summary-row"><span class="label">Terapeuta:</span><span class="value">${ev.ther}</span></div>
      <div class="summary-row"><span class="label">Sala:</span><span class="value">${ev.sala}</span></div>
      <div class="summary-row"><span class="label">Fecha:</span><span class="value">${ev.fecha}</span></div>
      <div class="summary-row"><span class="label">Hora:</span><span class="value">${fmtH(ev.hora)} – ${fmtH(addM(ev.hora, ev.dur))}</span></div>
      <div class="summary-row"><span class="label">Duración:</span><span class="value">${ev.dur} minutos</span></div>
      <div class="summary-row"><span class="label">Folio:</span><span class="value">${ev.folio}</span></div>
      ${ev.fee!=null?`<div class="summary-row"><span class="label">Cuota:</span><span class="value">$${ev.fee.toFixed(2)} MXN</span></div>`:''}
    `;

    confirmModal.style.display = 'block';
  };

  const hideConfirmation = () => {
    confirmModal.style.display = 'none';
    pendingEvent = null;
  };

  confirmCancelBtn.addEventListener('click', hideConfirmation);
  document.getElementById('closeConfirmModal')?.addEventListener('click', hideConfirmation);

  confirmSaveBtn.addEventListener('click', () => {
    if(!pendingEvent) return;
    const ev = pendingEvent;

    if(editing){
      const idx=eventos.findIndex(x=>x.id===editing.id);
      if(idx>=0) eventos.splice(idx,1);
    }
    eventos.push(ev);

    filtroFecha.value = ev.fecha;
    hideConfirmation();
    modal.style.display='none';

    // Re-renderizar todo
    render();
    buildMiniCalendar();

    // Feedback de éxito
    showToast(editing ? 'Evento reprogramado exitosamente' : 'Evento creado exitosamente', 'success');
  });

  /* ========================================================
     GUARDAR (ahora con confirmación previa)
     ======================================================== */
  form.onsubmit = e => {
    e.preventDefault();

    const f=payProof.files[0];
    const ev={
      id: editing ? editing.id : Date.now().toString(36),
      tipo: Number(selTipo.value),
      paciente: selPaciente.value,
      folio: getFolio(selPaciente.value),
      fecha: inFecha.value,
      hora : inHora.value,
      sala : selSala.value,
      ther : selTher.value,
      dur  : Number(hidDur.value),
      fee  : selTipo.value==='2' ? Number(inFee.value||0) : null,
      proof: (selTipo.value==='2' && f) ? f.name : (editing?editing.proof:'')
    };

    const errors=validate(ev,editing?.id);
    if(errors.length > 0){
      showValidation(errors, 'error');
      setFieldStates(errors);
      return;
    }

    // En lugar de guardar directamente, mostrar confirmación
    showConfirmation(ev);
  };

  /* ---------- DETALLES ------------------------------------ */
  const showDetails = ev => {
    const editId = editing ? editing.id : null;
    detInfo.innerHTML=`
      <p><strong>Tipo:</strong> ${TIPOS[ev.tipo].nombre}</p>
      <p><strong>Paciente:</strong> ${ev.paciente}</p>
      <p><strong>Folio:</strong> ${ev.folio}</p>
      <p><strong>Fecha:</strong> ${ev.fecha}</p>
      <p><strong>Hora inicio:</strong> ${fmtH(ev.hora)} – ${fmtH(addM(ev.hora, ev.dur))}</p>
      <p><strong>Duración:</strong> ${ev.dur} min</p>
      <p><strong>Sala:</strong> ${ev.sala}</p>
      <p><strong>Terapeuta:</strong> ${ev.ther}</p>
      ${ev.fee!=null?`<p><strong>Cuota:</strong> $${ev.fee.toFixed(2)} MXN</p>`:''}
      <p><strong>Comprobante:</strong> ${ev.proof||'—'}</p>
      <div class="request-actions">
        <button class="approve-btn" id="repBtn">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg>
          Reprogramar
        </button>
        <button class="cancel-event-btn" id="cancelEventBtn">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
          Cancelar cita
        </button>
      </div>`;
    detModal.style.display='block';
    document.getElementById('repBtn').onclick=()=>{
      detModal.style.display='none';
      openModal(ev.fecha,ev.hora,ev);
    };
    document.getElementById('cancelEventBtn').onclick=()=>{
      if(confirm('¿Está seguro de que desea cancelar esta cita?')){
        const idx=eventos.findIndex(x=>x.id===ev.id);
        if(idx>=0) eventos.splice(idx,1);
        detModal.style.display='none';
        render();
        buildMiniCalendar();
        showToast('Cita cancelada exitosamente', 'warning');
      }
    };
  };
  detClose.onclick=()=>detModal.style.display='none';

  /* ---------- PRINT --------------------------------------- */
  btnPrint.onclick=()=>{
    const head=document.querySelector('head').innerHTML;
    const calendarHTML=document.getElementById('calendarContainer').outerHTML;
    const w=window.open('','','width=900,height=600');
    w.document.write(`
      <html><head>${head}
        <style>
          @media print{
            body{margin:0;font-family:'Segoe UI',Arial,sans-serif;}
            #calendarContainer{border:none;}
            .time-cell,.day-header{font-size:11px}
            .appointment{font-size:10px}
            .status-legend{display:none;}
          }
        </style>
      </head><body>${calendarHTML}</body></html>`);
    w.document.close(); w.focus(); w.print(); w.close();
  };

  /* ---------- FILTRO TIPO & INICIO ----------------------- */
  filtroFecha.value = iso(new Date());
  filtroFecha.onchange = () => { render(); buildMiniCalendar(); };
  filtroTipo.onchange = render;

  miniCalDate = new Date();
  buildMiniCalendar();
  render();
});
