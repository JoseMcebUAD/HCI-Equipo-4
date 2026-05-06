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
  ERR.weekend = 'No se pueden programar eventos en fin de semana. Selecciona una fecha entre lunes y viernes.';
  ERR.hours = 'El evento excede el horario (09:00-17:30). Elige una hora de inicio que termine antes de las 17:30.';
  ERR.slotStep = 'Solo se permiten minutos :00 o :30. Ajusta la hora al siguiente bloque disponible.';
  ERR.patientBusy = 'El paciente ya tiene un evento que se traslapa. Selecciona otro horario.';
  ERR.salaBusy = 'La sala esta ocupada en ese rango. Selecciona otra sala u otro horario.';
  ERR.therBusy = 'El terapeuta esta ocupado en ese rango. Selecciona otro terapeuta u otro horario.';
  ERR.oneEvalDay = 'Solo se permite una evaluacion integral por dia para el paciente. Selecciona otra fecha.';
  ERR.dateRange = 'No se permiten fechas a mas de seis meses de hoy. Selecciona una fecha dentro del rango permitido.';
  ERR.fileType = 'Formato de comprobante no permitido. Adjunta un archivo PDF, PNG o JPG.';
  ERR.fileSize = 'El archivo supera 5 MB. Adjunta un archivo mas ligero.';

  /* ---------- DOM refs ----------------------------------- */
  const grid          = document.getElementById('calendarContainer');
  const filtroFecha   = document.getElementById('filterDate');
  const filtroTipo    = document.getElementById('filterType');
  const filtroTher    = document.getElementById('filterTherapist');
  const filtroRoom    = document.getElementById('filterRoom');
  const filtroPatient = document.getElementById('filterPatient');
  const btnResetFilters = document.getElementById('resetFilters');
  const btnNuevo      = document.getElementById('newEventBtn');
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
  const cancelApptModal = document.getElementById('cancelApptModal');
  const cancelApptSummary = document.getElementById('cancelApptSummary');
  const cancelApptKeepBtn = document.getElementById('cancelApptKeepBtn');
  const cancelApptConfirmBtn = document.getElementById('cancelApptConfirmBtn');

  /* --- toast --- */
  const toast       = document.getElementById('toastNotification');
  const toastMsg    = document.getElementById('toastMessage');
  const toastUndoBtn= document.getElementById('toastUndoBtn');

  /* --- modal DETALLES --- */
  const detModal   = document.getElementById('appointmentModal');
  const detInfo    = document.getElementById('modalInfo');
  const detClose   = document.getElementById('closeModal');

  /* ---------- DATA --------------------------------------- */
  const eventos=[];
  const folios ={};
  const logAudit = payload => window.Auditoria?.log(payload);
  let pendingDeletion = null;

  /* Restore persisted state when returning from reprogramar.html */
  (function(){
    const _evts = localStorage.getItem('agenda_events');
    const _fols = localStorage.getItem('agenda_folios');
    if(_evts){ try{ JSON.parse(_evts).forEach(e=>eventos.push(e)); window['__ejemplo__']=true; }catch(e){} localStorage.removeItem('agenda_events'); }
    if(_fols){ try{ Object.assign(folios,JSON.parse(_fols)); }catch(e){} localStorage.removeItem('agenda_folios'); }
  })();

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
  const clearToastAction = () => {
    if(!toastUndoBtn) return;
    toastUndoBtn.classList.add('hidden');
    toastUndoBtn.onclick = null;
  };
  const showToast = (message, type='success', opts={}) => {
    const { duration = 3000, actionLabel = null, onAction = null } = opts;
    clearTimeout(toastTimer);
    toast.className = 'toast-notification toast-show toast-' + type;
    toastMsg.textContent = message;
    clearToastAction();
    if(actionLabel && typeof onAction === 'function' && toastUndoBtn){
      toastUndoBtn.textContent = actionLabel;
      toastUndoBtn.classList.remove('hidden');
      toastUndoBtn.onclick = () => {
        onAction();
        clearTimeout(toastTimer);
        toast.classList.remove('toast-show');
        clearToastAction();
      };
    }
    toastTimer = setTimeout(()=>{
      toast.classList.remove('toast-show');
      clearToastAction();
    }, duration);
  };

  const finalizePendingDeletion = () => {
    if(!pendingDeletion) return;
    const { event } = pendingDeletion;
    clearTimeout(pendingDeletion.timer);
    logAudit({
      uc: 'UC-AG-03',
      action: 'Cancelacion de cita',
      actor: 'Personal administrativo',
      details: {
        folio: event.folio,
        patient: event.paciente,
        from: `${event.fecha} ${event.hora}`,
        status: 'Canceled'
      }
    });
    pendingDeletion = null;
  };

  const undoPendingDeletion = () => {
    if(!pendingDeletion) return;
    clearTimeout(pendingDeletion.timer);
    const { event, index } = pendingDeletion;
    const safeIndex = Math.max(0, Math.min(index, eventos.length));
    eventos.splice(safeIndex, 0, event);
    pendingDeletion = null;
    render();
    buildMiniCalendar();
    showToast('Cancelacion revertida. La cita fue restaurada.', 'success');
  };

  const startDeletionWindow = (event, index) => {
    finalizePendingDeletion();
    pendingDeletion = {
      event,
      index,
      timer: setTimeout(() => {
        finalizePendingDeletion();
      }, 5000)
    };
    showToast(
      `Cita cancelada: ${event.paciente} ${event.fecha} ${event.hora}.`,
      'warning',
      { duration: 5000, actionLabel: 'Deshacer', onAction: undoPendingDeletion }
    );
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
    const typeFilter    = filtroTipo.value    ? Number(filtroTipo.value) : null;
    const therFilter    = filtroTher.value    || null;
    const roomFilter    = filtroRoom.value    || null;
    const patientFilter = filtroPatient.value || null;

    eventos.forEach(ev=>{
      if(ev.fecha<iso(start)||ev.fecha>end) return;
      if(typeFilter    && ev.tipo     !== typeFilter)    return;
      if(therFilter    && ev.ther     !== therFilter)    return;
      if(roomFilter    && ev.sala     !== roomFilter)    return;
      if(patientFilter && ev.paciente !== patientFilter) return;

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

  const updateWeeklyBar = (avgPct, highDays) => {
    const bar = document.getElementById('weeklyWorkloadBar');
    if(!bar) return;
    const colorHex = avgPct < 25 ? '#27ae60' : avgPct <= 75 ? '#f0c30f' : '#e74c3c';
    const pctClass = avgPct < 25 ? 'ww-low' : avgPct <= 75 ? 'ww-mid' : 'ww-high';
    const statusLabel = avgPct < 25 ? 'Carga baja' : avgPct <= 75 ? 'Carga media' : 'Carga alta';
    const alertHTML = highDays.length>0
      ? `<span class="ww-alert"><svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>${highDays.length} día(s) con carga alta &ndash; redistribución recomendada</span>`
      : '';
    bar.innerHTML = `
      <span class="ww-label">Carga semanal:</span>
      <div class="ww-bar-wrap"><div class="ww-bar-fill" style="width:${Math.min(avgPct,100)}%;background:${colorHex}"></div></div>
      <span class="ww-pct ${pctClass}">${avgPct}%</span>
      <span class="ww-status">${statusLabel}</span>
      ${alertHTML}
    `;
  };

  const colorHeaders = () => {
    Object.values(headerMap).forEach(el=>{
      el.classList.remove('day-low','day-mid','day-high');
      el.querySelector('.day-load-pct')?.remove();
      el.querySelector('.day-load-tooltip')?.remove();
    });

    let totalPct=0, dayCount=0;
    const highDays=[];

    Object.entries(headerMap).forEach(([f,el])=>{
      /* Contar slots de 30 min con al menos un evento */
      let occupied=0;
      for(let r=0;r<ROWS;r++){
        const slotMin=OPEN*60+r*SLOT;
        if(eventos.some(e=>e.fecha===f && toMin(e.hora)<=slotMin && slotMin<toMin(e.hora)+e.dur))
          occupied++;
      }
      const pct=Math.round(occupied/ROWS*100);

      if(pct < 25)     el.classList.add('day-low');
      else if(pct<=75) el.classList.add('day-mid');
      else            {el.classList.add('day-high'); highDays.push(f);}

      /* Badge de porcentaje */
      const badge=document.createElement('span');
      badge.className='day-load-pct';
      badge.textContent=`${pct}%`;
      el.appendChild(badge);

      /* Tooltip */
      const fillColor=pct < 25?'#27ae60':pct<=75?'#f0c30f':'#e74c3c';
      const tooltip=document.createElement('div');
      tooltip.className='day-load-tooltip';
      tooltip.innerHTML=`
        <div class="dlt-title">Carga del día: <strong>${pct}%</strong></div>
        <div class="dlt-bar"><div class="dlt-bar-fill" style="width:${Math.min(pct,100)}%;background:${fillColor}"></div></div>
        <div class="dlt-legend">
          <div class="dlt-leg-item"><span class="dlt-dot" style="background:#27ae60"></span>0-24% Carga baja</div>
          <div class="dlt-leg-item"><span class="dlt-dot" style="background:#f0c30f"></span>25-75% Carga media</div>
          <div class="dlt-leg-item"><span class="dlt-dot" style="background:#e74c3c"></span>76-100% Carga alta</div>
        </div>`;
      el.appendChild(tooltip);

      totalPct+=pct; dayCount++;
    });

    updateWeeklyBar(Math.round(totalPct/(dayCount||1)), highDays);
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
    if(!suggArea || !suggList) return;
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
    if(!availPanel) return;
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
      suggArea?.classList.add('hidden');
      availPanel?.classList.add('hidden');
      clearFieldStates();
      return;
    }

    const editId = editing ? editing.id : null;
    const errors = validate(ev, editId);

    updateAvailabilityPanel();

    if(errors.length > 0){
      showValidation(errors, 'error');
      setFieldStates(errors);
      if(errors.some(e => e.includes('traslapa') || e.includes('ocupad'))){
        const alternatives = findAlternatives(ev);
        renderSuggestions(alternatives);
      } else {
        suggArea?.classList.add('hidden');
      }
    } else {
      showValidation([]);
      clearFieldStates();
      suggArea?.classList.add('hidden');
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

  /* --- Escuchar cambios en campos del wizard paso 1 --- */
  selTipo.addEventListener('change', () => refreshTher());
  selPaciente.addEventListener('change', () => { inFolio.value = getFolio(selPaciente.value); });

  /* ---------- FORM DINÁMICO ------------------------------- */
  /* --- refs bulk schedule --- */
  const bulkToggle = document.getElementById('bulkScheduleToggle');
  const bulkGroup  = document.getElementById('bulkScheduleGroup');

  const refreshTher = () => {
    const cfg=TIPOS[selTipo.value]||{terapeutas:[],dur:''};
    selTher.innerHTML='<option value="">Seleccionar terapeuta</option>' +
                      cfg.terapeutas.map(t=>`<option>${t}</option>`).join('');
    if(lblDur) lblDur.textContent=cfg.dur?`${cfg.dur} min`:'--';
    hidDur.value=cfg.dur||'';
    feeGroup.classList.toggle('hidden', selTipo.value!=='2');
    payProofGrp.classList.toggle('hidden', selTipo.value==='1');
    // Show bulk toggle only for therapy appointments
    if(bulkGroup){
      bulkGroup.classList.toggle('hidden', selTipo.value !== '2');
      if(selTipo.value !== '2' && bulkToggle) bulkToggle.checked = false;
    }
  };

  /* ========================================================
     WIZARD — Estado y funciones
     ======================================================== */
  let wizardCalDate = new Date();

  /* Refs de los paneles y elementos del wizard */
  const wizStep1          = document.getElementById('wizardStep1');
  const wizStep2          = document.getElementById('wizardStep2');
  const wizStep3          = document.getElementById('wizardStep3');
  const wizStep4          = document.getElementById('wizardStep4');
  const wizCalTitleEl     = document.getElementById('wizardCalTitle');
  const wizCalGrid        = document.getElementById('wizardCalendar');
  const wizCalPrevBtn     = document.getElementById('wizardCalPrev');
  const wizCalNextBtn     = document.getElementById('wizardCalNext');
  const step1NextBtn      = document.getElementById('step1Next');
  const step2BackBtn      = document.getElementById('step2Back');
  const step3BackBtn      = document.getElementById('step3Back');
  const step4BackBtn      = document.getElementById('step4Back');
  const timeSlotsGrid     = document.getElementById('timeSlotsGrid');
  const assignedRoomDisp  = document.getElementById('assignedRoomDisplay');
  const assignedRoomName  = document.getElementById('assignedRoomName');
  const step3DateLabel    = document.getElementById('step3DateLabel');
  const eventSummaryCard  = document.getElementById('eventSummaryCard');

  /* Avanza o retrocede al paso n */
  const goToStep = n => {
    [wizStep1, wizStep2, wizStep3, wizStep4].forEach((panel, i) => {
      panel.classList.toggle('wz-panel--active', i + 1 === n);
    });
    document.querySelectorAll('#wizardStepper .wz-step').forEach((el, i) => {
      const circle = el.querySelector('.wz-circle');
      const stepNum = i + 1;
      el.classList.toggle('wz-step--active', stepNum === n);
      el.classList.toggle('wz-step--done',   stepNum < n);
      if(stepNum < n){
        circle.innerHTML='<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>';
      } else {
        circle.textContent = stepNum;
      }
    });
    /* Colorear líneas conectoras */
    document.querySelectorAll('#wizardStepper .wz-line').forEach((line, i) => {
      line.classList.toggle('wz-line--done', i + 1 < n);
    });
  };

  /* ── Paso 2: Calendario de disponibilidad ── */
  const dayHasAvailability = dateISO => {
    const tipo     = Number(selTipo.value);
    const ther     = selTher.value;
    const paciente = selPaciente.value;
    const dur      = TIPOS[tipo]?.dur || 60;
    const editId   = editing ? editing.id : null;
    for(let m = 0; m <= (CLOSE - OPEN) * 60 - dur; m += SLOT){
      const hora = addM(`${pad(OPEN)}:00`, m);
      if(toMin(hora) + dur > CLOSE * 60 + 30) break;
      const therFree = !eventos.some(e => e.id !== editId && e.ther === ther && e.fecha === dateISO &&
        toMin(e.hora) < toMin(hora) + dur && toMin(hora) < toMin(e.hora) + e.dur);
      const patFree  = !eventos.some(e => e.id !== editId && e.paciente === paciente && e.fecha === dateISO &&
        toMin(e.hora) < toMin(hora) + dur && toMin(hora) < toMin(e.hora) + e.dur);
      const anyRoom  = SALAS.some(sala => !eventos.some(e => e.id !== editId && e.sala === sala && e.fecha === dateISO &&
        toMin(e.hora) < toMin(hora) + dur && toMin(hora) < toMin(e.hora) + e.dur));
      if(therFree && patFree && anyRoom) return true;
    }
    return false;
  };

  const buildWizardCalendar = () => {
    wizCalGrid.innerHTML = '';
    const year  = wizardCalDate.getFullYear();
    const month = wizardCalDate.getMonth();
    wizCalTitleEl.textContent =
      `${MESES[month].charAt(0).toUpperCase()}${MESES[month].slice(1)} ${year}`;

    DIAS_SEM.forEach(d => {
      const el = document.createElement('div');
      el.className = 'wz-cal-day-name';
      el.textContent = d;
      wizCalGrid.appendChild(el);
    });

    const firstDay    = new Date(year, month, 1);
    const startOffset = firstDay.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrev  = new Date(year, month, 0).getDate();
    const todayISO    = iso(new Date());

    /* Días del mes anterior (relleno) */
    for(let i = startOffset - 1; i >= 0; i--){
      const el = document.createElement('div');
      el.className = 'wz-cal-day wz-cal-day--other';
      el.textContent = daysInPrev - i;
      wizCalGrid.appendChild(el);
    }

    /* Días del mes actual */
    for(let i = 1; i <= daysInMonth; i++){
      const d    = new Date(year, month, i);
      const dISO = iso(d);
      const el   = document.createElement('div');
      el.className = 'wz-cal-day';
      el.textContent = i;

      if(dISO === todayISO) el.classList.add('wz-cal-day--today');

      if([0, 6].includes(d.getDay())){
        el.classList.add('wz-cal-day--weekend');
      } else if(dISO < todayISO){
        el.classList.add('wz-cal-day--past');
      } else {
        if(dayHasAvailability(dISO)){
          el.classList.add('wz-cal-day--avail');
          el.addEventListener('click', () => selectWizardDate(dISO, d));
        } else {
          el.classList.add('wz-cal-day--busy');
        }
      }

      if(dISO === inFecha.value) el.classList.add('wz-cal-day--selected');
      wizCalGrid.appendChild(el);
    }

    /* Relleno días del mes siguiente */
    const totalCells = startOffset + daysInMonth;
    const remaining  = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
    for(let i = 1; i <= remaining; i++){
      const el = document.createElement('div');
      el.className = 'wz-cal-day wz-cal-day--other';
      el.textContent = i;
      wizCalGrid.appendChild(el);
    }
  };

  const selectWizardDate = (dateISO, dateObj) => {
    inFecha.value = dateISO;
    assignedRoomDisp.classList.add('hidden');
    inHora.value  = '';
    selSala.value = '';
    buildTimeSlots(dateISO);
    const ds = dateObj.toLocaleDateString('es-ES',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
    step3DateLabel.textContent = ds.charAt(0).toUpperCase() + ds.slice(1);
    goToStep(3);
  };

  /* ── Paso 3: Slots horarios ── */
  const buildTimeSlots = dateISO => {
    timeSlotsGrid.innerHTML = '';
    const tipo     = Number(selTipo.value);
    const ther     = selTher.value;
    const paciente = selPaciente.value;
    const dur      = TIPOS[tipo]?.dur || 60;
    const editId   = editing ? editing.id : null;
    let hasAny     = false;

    for(let m = 0; m <= (CLOSE - OPEN) * 60; m += SLOT){
      const hora = addM(`${pad(OPEN)}:00`, m);
      if(toMin(hora) + dur > CLOSE * 60 + 30) break;

      const therFree = !eventos.some(e => e.id !== editId && e.ther === ther && e.fecha === dateISO &&
        toMin(e.hora) < toMin(hora) + dur && toMin(hora) < toMin(e.hora) + e.dur);
      const patFree  = !eventos.some(e => e.id !== editId && e.paciente === paciente && e.fecha === dateISO &&
        toMin(e.hora) < toMin(hora) + dur && toMin(hora) < toMin(e.hora) + e.dur);
      const freeRoom = SALAS.find(sala => !eventos.some(e => e.id !== editId && e.sala === sala && e.fecha === dateISO &&
        toMin(e.hora) < toMin(hora) + dur && toMin(hora) < toMin(e.hora) + e.dur));
      const available = therFree && patFree && !!freeRoom;

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'wz-time-slot ' + (available ? 'wz-time-slot--avail' : 'wz-time-slot--busy');
      btn.textContent = fmtH(hora);
      btn.disabled = !available;

      if(available){
        btn.addEventListener('click', () => selectTimeSlot(hora, dur, freeRoom, btn));
        hasAny = true;
      }
      timeSlotsGrid.appendChild(btn);
    }

    if(!hasAny){
      const msg = document.createElement('p');
      msg.className = 'wz-no-slots';
      msg.textContent = 'No hay horarios disponibles para este día. Por favor selecciona otra fecha.';
      timeSlotsGrid.appendChild(msg);
    }
  };

  const selectTimeSlot = (hora, dur, sala, btn) => {
    timeSlotsGrid.querySelectorAll('.wz-time-slot--selected')
      .forEach(b => b.classList.remove('wz-time-slot--selected'));
    btn.classList.add('wz-time-slot--selected');
    inHora.value  = hora;
    hidDur.value  = dur;
    selSala.value = sala;
    assignedRoomName.textContent = sala;
    assignedRoomDisp.classList.remove('hidden');
    setTimeout(() => { buildEventSummary(); goToStep(4); }, 500);
  };

  /* ── Paso 4: Resumen ── */
  const buildEventSummary = () => {
    const tipo = Number(selTipo.value);
    inFolio.value = getFolio(selPaciente.value);
    const endHora = addM(inHora.value, Number(hidDur.value));
    const isBulk = bulkToggle && bulkToggle.checked && tipo === 2;

    let html = `
      <div class="summary-row"><span class="label">Tipo</span><span class="value">${TIPOS[tipo]?.nombre || '—'}</span></div>
      <div class="summary-row"><span class="label">Terapeuta</span><span class="value">${selTher.value}</span></div>
      <div class="summary-row"><span class="label">Paciente</span><span class="value">${selPaciente.value}</span></div>
      <div class="summary-row"><span class="label">Folio</span><span class="value">${inFolio.value}</span></div>
    `;

    if (isBulk) {
      const baseDate = pISO(inFecha.value);
      const dur = Number(hidDur.value);
      html += `<div class="summary-divider">10 citas programadas:</div>`;
      html += `<div class="bulk-preview-list">`;

      for (let w = 0; w < 10; w++) {
        const d = addD(baseDate, w * 7);
        const dISO = iso(d);

        // Determine room availability
        let room = selSala.value;
        const roomBusy = eventos.some(e =>
          e.sala === room && e.fecha === dISO &&
          toMin(e.hora) < toMin(inHora.value) + dur && toMin(inHora.value) < toMin(e.hora) + e.dur
        );
        if (roomBusy) {
          room = SALAS.find(s => !eventos.some(e =>
            e.sala === s && e.fecha === dISO &&
            toMin(e.hora) < toMin(inHora.value) + dur && toMin(inHora.value) < toMin(e.hora) + e.dur
          )) || selSala.value;
        }

        const dateStr = d.toLocaleDateString('es-ES', {weekday:'short', day:'numeric', month:'short'});
        html += `
          <div class="bulk-preview-item">
            <span class="bulk-num">${w + 1}.</span>
            <span class="bulk-date">${dateStr}</span>
            <span class="bulk-time">${fmtH(inHora.value)} – ${fmtH(endHora)}</span>
            <span class="bulk-room">${room}</span>
          </div>`;
      }
      html += `</div>`;
    } else {
      html += `
        <div class="summary-row"><span class="label">Fecha</span><span class="value">${pISO(inFecha.value).toLocaleDateString('es-ES',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}</span></div>
        <div class="summary-row"><span class="label">Horario</span><span class="value">${fmtH(inHora.value)} – ${fmtH(endHora)}</span></div>
        <div class="summary-row"><span class="label">Duración</span><span class="value">${hidDur.value} min</span></div>
        <div class="summary-row"><span class="label">Sala</span><span class="value">${selSala.value}</span></div>
      `;
    }

    eventSummaryCard.innerHTML = html;
  };

  /* ── Generar 10 citas semanales consecutivas ── */
  const generateBulkAppointments = (baseEvent) => {
    const appointments = [];
    const baseDate = pISO(baseEvent.fecha);
    const dur = baseEvent.dur;
    const baseTs = Date.now().toString(36);

    for (let week = 0; week < 10; week++) {
      const targetDate = addD(baseDate, week * 7);
      const targetISO = iso(targetDate);

      // Try same room; fall back to any available room
      let assignedRoom = baseEvent.sala;
      const roomBusy = eventos.some(e =>
        e.sala === assignedRoom && e.fecha === targetISO &&
        toMin(e.hora) < toMin(baseEvent.hora) + dur && toMin(baseEvent.hora) < toMin(e.hora) + e.dur
      );

      if (roomBusy) {
        assignedRoom = SALAS.find(sala =>
          !eventos.some(e =>
            e.sala === sala && e.fecha === targetISO &&
            toMin(e.hora) < toMin(baseEvent.hora) + dur && toMin(baseEvent.hora) < toMin(e.hora) + e.dur
          )
        ) || baseEvent.sala;
      }

      appointments.push({
        id: baseTs + '-' + week,
        tipo: baseEvent.tipo,
        paciente: baseEvent.paciente,
        folio: baseEvent.folio,
        fecha: targetISO,
        hora: baseEvent.hora,
        sala: assignedRoom,
        ther: baseEvent.ther,
        dur: baseEvent.dur,
        fee: baseEvent.fee,
        proof: baseEvent.proof
      });
    }

    return appointments;
  };

  /* ── Navegación del wizard ── */
  wizCalPrevBtn.addEventListener('click', () => {
    wizardCalDate.setMonth(wizardCalDate.getMonth() - 1);
    buildWizardCalendar();
  });
  wizCalNextBtn.addEventListener('click', () => {
    wizardCalDate.setMonth(wizardCalDate.getMonth() + 1);
    buildWizardCalendar();
  });

  step1NextBtn.addEventListener('click', () => {
    clearValidation();
    const errs = [];
    if(!selTipo.value)     errs.push('Selecciona el tipo de evento.');
    if(!selTher.value)     errs.push('Selecciona un terapeuta.');
    if(!selPaciente.value) errs.push('Selecciona un paciente.');
    if(errs.length){ showValidation(errs, 'error'); return; }
    clearValidation();
    wizardCalDate = new Date();
    buildWizardCalendar();
    goToStep(2);
  });

  step2BackBtn.addEventListener('click', () => { clearValidation(); goToStep(1); });

  step3BackBtn.addEventListener('click', () => {
    clearValidation();
    assignedRoomDisp.classList.add('hidden');
    inFecha.value = '';
    goToStep(2);
    buildWizardCalendar();
  });

  step4BackBtn.addEventListener('click', () => { clearValidation(); goToStep(3); });

  /* ---------- MODAL NUEVO / EDIT -------------------------- */
  let editing=null;
  const openModal = (f,h,ev=null) => {
    editing = ev && !ev._fromInbox ? ev : null;
    form.reset();
    refreshTher();
    clearValidation();
    clearFieldStates();
    assignedRoomDisp.classList.add('hidden');
    if(!ev) modalTitle.textContent='Nuevo Evento';
    else if(ev._isRescheduling) modalTitle.textContent='Reprogramar cita (desde solicitud)';
    else if(ev._fromInbox)      modalTitle.textContent='Nueva cita (desde solicitud)';
    else                        modalTitle.textContent='Reprogramar evento';
    if(ev){
      selTipo.value    = ev.tipo     || '';
      selPaciente.value= ev.paciente || '';
      inFee.value      = ev.fee      || '';
      refreshTher();
      if(ev.ther) selTher.value = ev.ther;
      inFolio.value = ev.folio || getFolio(ev.paciente || '');
    } else {
      inFolio.value=''; inFee.value='';
    }
    wizardCalDate = new Date();
    goToStep(1);
    modal.style.display='block';
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
  let pendingBulkEvents = null;

  const showConfirmation = (ev) => {
    pendingEvent = ev;
    pendingBulkEvents = null;
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

  const showBulkConfirmation = (bulkEvents) => {
    pendingBulkEvents = bulkEvents;
    pendingEvent = null;
    const first = bulkEvents[0];
    const last = bulkEvents[bulkEvents.length - 1];
    const endHora = addM(first.hora, first.dur);

    confirmSummary.innerHTML = `
      <div class="summary-row"><span class="label">Acción:</span><span class="value">Crear 10 citas semanales</span></div>
      <div class="summary-row"><span class="label">Paciente:</span><span class="value">${first.paciente}</span></div>
      <div class="summary-row"><span class="label">Terapeuta:</span><span class="value">${first.ther}</span></div>
      <div class="summary-row"><span class="label">Horario:</span><span class="value">${fmtH(first.hora)} – ${fmtH(endHora)}</span></div>
      <div class="summary-row"><span class="label">Periodo:</span><span class="value">${pISO(first.fecha).toLocaleDateString('es-ES',{day:'numeric',month:'short'})} — ${pISO(last.fecha).toLocaleDateString('es-ES',{day:'numeric',month:'short',year:'numeric'})}</span></div>
      <div class="summary-row"><span class="label">Folio:</span><span class="value">${first.folio}</span></div>
      ${first.fee!=null?`<div class="summary-row"><span class="label">Cuota:</span><span class="value">$${first.fee.toFixed(2)} MXN</span></div>`:''}
    `;

    confirmModal.style.display = 'block';
  };

  const hideConfirmation = () => {
    confirmModal.style.display = 'none';
    pendingEvent = null;
    pendingBulkEvents = null;
  };

  confirmCancelBtn.addEventListener('click', hideConfirmation);
  document.getElementById('closeConfirmModal')?.addEventListener('click', hideConfirmation);

  confirmSaveBtn.addEventListener('click', () => {
    // Handle bulk save
    if (pendingBulkEvents) {
      pendingBulkEvents.forEach(ev => eventos.push(ev));

      filtroFecha.value = pendingBulkEvents[0].fecha;
      hideConfirmation();
      modal.style.display='none';

      render();
      buildMiniCalendar();

      showToast('10 citas de terapia creadas exitosamente', 'success');
      return;
    }

    if(!pendingEvent) return;
    const ev = pendingEvent;

    if(editing){
      const oldEvent = { ...editing };
      const idx=eventos.findIndex(x=>x.id===editing.id);
      if(idx>=0) eventos.splice(idx,1);
      logAudit({
        uc: 'UC-AG-02',
        action: 'Reprogramacion de cita',
        actor: 'Personal administrativo',
        details: {
          folio: oldEvent.folio,
          patient: oldEvent.paciente,
          from: `${oldEvent.fecha} ${oldEvent.hora}`,
          to: `${ev.fecha} ${ev.hora}`
        }
      });
    }
    eventos.push(ev);

    // Notify inbox module if this save originated from an inbox action
    if(window._pendingInboxAccept && window.Bandeja?.onEventSaved){
      window.Bandeja.onEventSaved(window._pendingInboxAccept);
    }

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
    const isBulk = bulkToggle && bulkToggle.checked && selTipo.value === '2';

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

    if (isBulk && !editing) {
      const bulkEvents = generateBulkAppointments(ev);
      showBulkConfirmation(bulkEvents);
    } else {
      showConfirmation(ev);
    }
  };

  /* ---------- DETALLES ------------------------------------ */
  const showDetails = ev => {
    const editId = editing ? editing.id : null;
    const fechaFmt = pISO(ev.fecha).toLocaleDateString('es-ES',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
    const horaFmt  = `${fmtH(ev.hora)} – ${fmtH(addM(ev.hora, ev.dur))}`;
    const hasPay   = (ev.fee != null) || ev.proof;
    detInfo.innerHTML=`
      <div class="md-hero">
        <div class="md-avatar">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        </div>
        <div class="md-hero-info">
          <h3 class="md-title">${TIPOS[ev.tipo].nombre}</h3>
          <p class="md-subtitle">Folio: ${ev.folio}</p>
        </div>
        <div class="md-hero-actions">
          <button class="approve-btn" id="repBtn">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg>
            Reprogramar
          </button>
          <button class="cancel-event-btn" id="cancelEventBtn">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
            Cancelar cita
          </button>
        </div>
      </div>

      <hr class="md-divider">
      <p class="md-eyebrow md-eyebrow-sm">FECHA Y HORA</p>
      <div class="md-row"><span class="md-row-label">Fecha</span><span class="md-row-value">${fechaFmt}</span></div>
      <div class="md-row"><span class="md-row-label">Horario</span><span class="md-row-value">${horaFmt}</span></div>
      <div class="md-row"><span class="md-row-label">Duración</span><span class="md-row-value">${ev.dur} min</span></div>

      <hr class="md-divider">
      <p class="md-eyebrow md-eyebrow-sm">PARTICIPANTES Y LUGAR</p>
      <div class="md-row"><span class="md-row-label">Paciente</span><span class="md-row-value">${ev.paciente}</span></div>
      <div class="md-row"><span class="md-row-label">Terapeuta</span><span class="md-row-value">${ev.ther}</span></div>
      <div class="md-row"><span class="md-row-label">Sala</span><span class="md-row-value">${ev.sala}</span></div>

      ${hasPay ? `
      <hr class="md-divider">
      <p class="md-eyebrow md-eyebrow-sm">PAGO</p>
      ${ev.fee!=null ? `<div class="md-row"><span class="md-row-label">Cuota</span><span class="md-row-value">$${ev.fee.toFixed(2)} MXN</span></div>` : ''}
      <div class="md-row"><span class="md-row-label">Comprobante</span><span class="md-row-value">${ev.proof || '—'}</span></div>
      ` : ''}`;
    detModal.style.display='block';
    document.getElementById('repBtn').onclick=()=>{
      detModal.style.display='none';
      localStorage.setItem('agenda_events', JSON.stringify(eventos));
      localStorage.setItem('agenda_folios', JSON.stringify(folios));
      localStorage.setItem('reprogramar_event', JSON.stringify(ev));
      window.location.href='reprogramar.html';
    };
    document.getElementById('cancelEventBtn').onclick=()=>{
      if(confirm('¿Está seguro de que desea cancelar esta cita?')){
        logAudit({
          uc: 'UC-AG-03',
          action: 'Cancelacion de cita',
          actor: 'Personal administrativo',
          details: {
            folio: ev.folio,
            patient: ev.paciente,
            from: `${ev.fecha} ${ev.hora}`,
            status: 'Canceled'
          }
        });
        const idx=eventos.findIndex(x=>x.id===ev.id);
        if(idx>=0) eventos.splice(idx,1);
        detModal.style.display='none';
        render();
        buildMiniCalendar();
        showToast('Cita cancelada exitosamente', 'warning');
      }
    };
    document.getElementById('cancelEventBtn').onclick=()=>{
      const idx=eventos.findIndex(x=>x.id===ev.id);
      if(idx<0) return;
      cancelApptSummary.innerHTML = `
        <div class="summary-row"><span class="label">Paciente:</span><span class="value">${ev.paciente}</span></div>
        <div class="summary-row"><span class="label">Folio:</span><span class="value">${ev.folio}</span></div>
        <div class="summary-row"><span class="label">Horario:</span><span class="value">${ev.fecha} ${fmtH(ev.hora)} - ${fmtH(addM(ev.hora, ev.dur))}</span></div>
        <div class="summary-row"><span class="label">Resultado:</span><span class="value">La cita quedara cancelada y el horario liberado.</span></div>
      `;
      cancelApptModal.style.display='block';
      const keepHandler = () => {
        cancelApptModal.style.display='none';
        cleanupCancelHandlers();
      };
      const confirmHandler = () => {
        const currentIdx = eventos.findIndex(x=>x.id===ev.id);
        if(currentIdx<0){
          cancelApptModal.style.display='none';
          cleanupCancelHandlers();
          return;
        }
        const removed = eventos[currentIdx];
        eventos.splice(currentIdx,1);
        detModal.style.display='none';
        cancelApptModal.style.display='none';
        render();
        buildMiniCalendar();
        startDeletionWindow(removed, currentIdx);
        cleanupCancelHandlers();
      };
      const cleanupCancelHandlers = () => {
        cancelApptKeepBtn?.removeEventListener('click', keepHandler);
        cancelApptConfirmBtn?.removeEventListener('click', confirmHandler);
      };
      cancelApptKeepBtn?.addEventListener('click', keepHandler);
      cancelApptConfirmBtn?.addEventListener('click', confirmHandler);
    };
  };
  detClose.onclick=()=>detModal.style.display='none';
  window.addEventListener('beforeunload', () => {
    finalizePendingDeletion();
  });

  /* ---------- FILTROS & INICIO --------------------------- */
  filtroFecha.value = iso(new Date());
  filtroFecha.onchange = () => { render(); buildMiniCalendar(); };
  filtroTipo.onchange    = render;
  filtroTher.onchange    = render;
  filtroRoom.onchange    = render;
  filtroPatient.onchange = render;

  btnResetFilters.addEventListener('click', () => {
    filtroTipo.value    = '';
    filtroTher.value    = '';
    filtroRoom.value    = '';
    filtroPatient.value = '';
    render();
  });

  /* ---------- BOTÓN REPROGRAMACIÓN MASIVA ---------------- */
  const btnBulk = document.getElementById('bulkReschedBtn');
  if(btnBulk){
    btnBulk.addEventListener('click', e => {
      e.preventDefault();
      localStorage.setItem('agenda_events', JSON.stringify(eventos));
      localStorage.setItem('agenda_folios', JSON.stringify(folios));
      const dateParam = filtroFecha.value ? `?date=${filtroFecha.value}` : '';
      window.location.href = `reprogramacion-masiva.html${dateParam}`;
    });
  }

  miniCalDate = new Date();
  buildMiniCalendar();
  render();

  /* ── Bandeja de Entrada: register hooks + wire tabs + init ── */
  if(window.Bandeja){
    window.Bandeja._showToast = showToast;
    window.Bandeja._getEvents = () => eventos;
    window.Bandeja._openModal = (f, h, prefillData) => openModal(f, h, prefillData);
  }

  const tabAgenda  = document.getElementById('tabAgenda');
  const tabBandeja = document.getElementById('tabBandeja');
  const tabAuditoria = document.getElementById('tabAuditoria');
  const filtersBar = document.getElementById('filters');

  tabAgenda?.addEventListener('click', () => {
    tabAgenda.classList.add('view-tab--active');
    tabBandeja.classList.remove('view-tab--active');
    tabAuditoria?.classList.remove('view-tab--active');
    tabAgenda.setAttribute('aria-selected', 'true');
    tabBandeja.setAttribute('aria-selected', 'false');
    tabAuditoria?.setAttribute('aria-selected', 'false');
    filtersBar.classList.remove('hidden');
    window.Bandeja?.showCalendarPanel();
    window.Auditoria?.showCalendarPanel();
  });

  tabBandeja?.addEventListener('click', () => {
    tabBandeja.classList.add('view-tab--active');
    tabAgenda.classList.remove('view-tab--active');
    tabAuditoria?.classList.remove('view-tab--active');
    tabBandeja.setAttribute('aria-selected', 'true');
    tabAgenda.setAttribute('aria-selected', 'false');
    tabAuditoria?.setAttribute('aria-selected', 'false');
    filtersBar.classList.add('hidden');
    window.Bandeja?.showInboxPanel();
    document.getElementById('auditPanel')?.classList.add('hidden');
  });

  tabAuditoria?.addEventListener('click', () => {
    tabAuditoria.classList.add('view-tab--active');
    tabAgenda.classList.remove('view-tab--active');
    tabBandeja?.classList.remove('view-tab--active');
    tabAuditoria.setAttribute('aria-selected', 'true');
    tabAgenda.setAttribute('aria-selected', 'false');
    tabBandeja?.setAttribute('aria-selected', 'false');
    filtersBar.classList.add('hidden');
    window.Auditoria?.showAuditPanel();
  });

  window.Bandeja?.init();
  window.Auditoria?.init();
});
