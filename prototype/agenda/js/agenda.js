/* ============================================================
   agenda.js  – v3 (rediseño Teams: mini-calendario, solo semana,
                     filtro por tipo, sidebar colapsable)
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

  /* ---------- JORNADA ------------------------------------ */
  const OPEN=9, CLOSE=17, SLOT=30, ROWS=((CLOSE-OPEN)*60)/SLOT+2, MAX_M=6;

  /* ---------- TIPOS EVENTO ------------------------------- */
  const TIPOS={
    1:{nombre:'Evaluación inicial integral',dur:60,terapeutas:['Terapeuta A','Terapeuta B']},
    2:{nombre:'Cita de terapia',            dur:60,terapeutas:['Terap. 1','Terap. 2','Terap. 3','Terap. 4']}
  };

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

  /* --- modal DETALLES --- */
  const detModal   = document.getElementById('appointmentModal');
  const detInfo    = document.getElementById('modalInfo');
  const detClose   = document.getElementById('closeModal');

  /* ---------- DATA --------------------------------------- */
  const eventos=[];
  const folios ={};
  let miniCalDate = new Date(); // mes que muestra el mini calendario

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
     MINI CALENDARIO (panel izquierdo)
     ======================================================== */
  const DIAS_SEM = ['D','L','M','M','J','V','S'];
  const MESES = ['enero','febrero','marzo','abril','mayo','junio',
                 'julio','agosto','septiembre','octubre','noviembre','diciembre'];

  const buildMiniCalendar = () => {
    miniCalGrid.innerHTML = '';
    const year = miniCalDate.getFullYear();
    const month = miniCalDate.getMonth();

    miniCalTitle.textContent = `${MESES[month]} ${year}`;

    // Encabezados de día
    DIAS_SEM.forEach(d => {
      const el = document.createElement('div');
      el.className = 'mini-cal-day-name';
      el.textContent = d;
      miniCalGrid.appendChild(el);
    });

    // Primer día del mes y offset
    const firstDay = new Date(year, month, 1);
    const startOffset = firstDay.getDay(); // 0=Dom
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

    // Días del mes anterior (relleno)
    for(let i = startOffset - 1; i >= 0; i--){
      const dayNum = daysInPrev - i;
      const d = new Date(year, month-1, dayNum);
      miniCalGrid.appendChild(createMiniDay(dayNum, d, true));
    }

    // Días del mes actual
    for(let i = 1; i <= daysInMonth; i++){
      const d = new Date(year, month, i);
      miniCalGrid.appendChild(createMiniDay(i, d, false));
    }

    // Días del mes siguiente (relleno hasta completar 6 filas = 42 celdas)
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

    // Semana actualmente mostrada
    const selectedDate = filtroFecha.value ? pISO(filtroFecha.value) : today;
    const weekStart = mon(selectedDate);
    const weekStartISO = iso(weekStart);
    const weekEndISO = iso(addD(weekStart, 4));
    if(dISO >= weekStartISO && dISO <= weekEndISO) el.classList.add('current-week');

    if(dISO === filtroFecha.value) el.classList.add('selected');

    // Click → navegar a esa semana
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
     RENDER GRID SEMANAL
     ======================================================== */
  let headerMap={};

  const buildHeader = (start, cols) => {
    headerMap={};
    // Esquina vacía (col horas)
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

    // Siempre vista semanal (5 columnas, Lun-Vie)
    const cols = 5;
    const start = mon(ref);
    grid.style.gridTemplateColumns = `60px repeat(${cols},1fr)`;

    buildHeader(start,cols);
    buildRows(start,cols);
    placeEvents(start,cols);
    colorHeaders();
  };

  /* ---------- VALIDACIÓN RANGO --------------------------- */
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
    const d=pISO(ev.fecha);
    if(isWE(d))                     return ERR.weekend;
    if(diffM(d,new Date())>MAX_M)   return ERR.dateRange;

    const [ ,M]=ev.hora.split(':').map(Number);
    if(M!==0&&M!==30)               return ERR.slotStep;
    if(toMin(ev.hora)+ev.dur>=(CLOSE*60+30)) return ERR.hours;

    if(eventos.some(e=>e.id!==editId && e.paciente===ev.paciente && e.fecha===ev.fecha && overlap(ev,e)))
      return ERR.patientBusy;

    if(busy('sala',ev.sala,ev.fecha,ev.hora,ev.dur,editId)) return ERR.salaBusy;
    if(busy('ther',ev.ther,ev.fecha,ev.hora,ev.dur,editId)) return ERR.therBusy;

    if(ev.tipo===1 && eventos.some(e=>e.id!==editId && e.tipo===1 && e.paciente===ev.paciente && e.fecha===ev.fecha))
      return ERR.oneEvalDay;

    if(ev.tipo===2){
      const f=payProof.files[0];
      if(f){
        if(!/pdf|png|jpe?g$/i.test(f.type)) return ERR.fileType;
        if(f.size>5*1024*1024)              return ERR.fileSize;
      }
    }
    return '';
  };

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
  selTipo.onchange=refreshTher;
  selPaciente.onchange=()=>inFolio.value=getFolio(selPaciente.value);

  /* ---------- MODAL NUEVO / EDIT -------------------------- */
  let editing=null;
  const openModal = (f,h,ev=null) => {
    editing=ev;
    form.reset();
    refreshTher();
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
  };

  btnNuevo.onclick = () => {
    let d=new Date(); if(isWE(d)) d=mon(d);
    openModal(iso(d),`${pad(OPEN)}:00`);
  };
  closeModal.onclick = () => modal.style.display='none';

  /* ---------- GUARDAR ------------------------------------- */
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

    const err=validate(ev,editing?.id);
    if(err){ alert(err); return; }

    if(editing){
      const idx=eventos.findIndex(x=>x.id===editing.id);
      if(idx>=0) eventos.splice(idx,1);
    }
    eventos.push(ev);

    filtroFecha.value = ev.fecha;
    modal.style.display='none';
    render();
    buildMiniCalendar();
  };

  /* ---------- DETALLES ------------------------------------ */
  const showDetails = ev => {
    detInfo.innerHTML=`
      <p><strong>Tipo:</strong> ${TIPOS[ev.tipo].nombre}</p>
      <p><strong>Paciente:</strong> ${ev.paciente}</p>
      <p><strong>Folio:</strong> ${ev.folio}</p>
      <p><strong>Fecha:</strong> ${ev.fecha}</p>
      <p><strong>Hora inicio:</strong> ${ev.hora}</p>
      <p><strong>Duración:</strong> ${ev.dur} min</p>
      <p><strong>Sala:</strong> ${ev.sala}</p>
      <p><strong>Terapeuta:</strong> ${ev.ther}</p>
      ${ev.fee!=null?`<p><strong>Cuota:</strong> $${ev.fee.toFixed(2)}</p>`:''}
      <p><strong>Comprobante:</strong> ${ev.proof||'—'}</p>
      <div class="request-actions">
        <button class="approve-btn" id="repBtn">Reprogramar</button>
      </div>`;
    detModal.style.display='block';
    document.getElementById('repBtn').onclick=()=>{
      detModal.style.display='none';
      openModal(ev.fecha,ev.hora,ev);
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
          }
        </style>
      </head><body>${calendarHTML}</body></html>`);
    w.document.close(); w.focus(); w.print(); w.close();
  };

  /* ---------- FILTRO TIPO & INICIO ----------------------- */
  filtroFecha.value = iso(new Date());
  filtroFecha.onchange = () => { render(); buildMiniCalendar(); };
  filtroTipo.onchange = render;

  // Sincronizar mini calendario con la fecha actual
  miniCalDate = new Date();
  buildMiniCalendar();
  render();
});
