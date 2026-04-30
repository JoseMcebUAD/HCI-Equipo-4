document.addEventListener('DOMContentLoaded', () => {

  // Utilidades
  const pad  = n => String(n).padStart(2,'0');
  const iso  = d => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
  const pISO = s => { const [Y,M,D]=s.split('-').map(Number); return new Date(Y,M-1,D); };
  const addM = (t,m) => { let [h,min]=t.split(':').map(Number); min+=m; while(min>=60){h++;min-=60;} return `${pad(h)}:${pad(min)}`; };
  const toMin= h => { const [hh,mm]=h.split(':').map(Number); return hh*60+mm; };
  const fmtH = t => { const [h,m]=t.split(':').map(Number); const p=h>=12?'PM':'AM'; return `${h%12||12}:${pad(m)} ${p}`; };
  const fmtDate = s => pISO(s).toLocaleDateString('es-ES',{weekday:'short',day:'numeric',month:'short',year:'numeric'});

  const OPEN=9, CLOSE=17, SLOT=30;
  const TIPOS={
    1:{nombre:'Evaluación inicial integral', dur:60},
    2:{nombre:'Cita de terapia', dur:60}
  };

  let originalEvent = null;
  let eventos = [];

  try { originalEvent = JSON.parse(localStorage.getItem('reprogramar_event')); } catch(e) {}
  try { eventos = JSON.parse(localStorage.getItem('agenda_events')) || []; } catch(e) {}

  if(!originalEvent) {
    window.location.href = 'agenda.html';
    return;
  }

  let selectedDate = null;
  let selectedTime = null;
  let calViewDate  = new Date();

  // DOM Refs
  const elCurrentSlot  = document.getElementById('repCurrentSlot');
  const elNewSlotText  = document.getElementById('repNewSlotText');
  const elPrevMonth    = document.getElementById('repPrevMonth');
  const elNextMonth    = document.getElementById('repNextMonth');
  const elCalTitle     = document.getElementById('repCalTitle');
  const elCalGrid      = document.getElementById('repCalGrid');
  const elSlotsGrid    = document.getElementById('repSlotsGrid');
  const elAvailSection = document.getElementById('repAvailSection');
  const elAvailContent = document.getElementById('repAvailContent');
  const elPatientName  = document.getElementById('repPatientName');
  const elFolio        = document.getElementById('repFolio');
  const elTherapist    = document.getElementById('repTherapist');
  const elConfirmBtn   = document.getElementById('repConfirmBtn');
  const elCancelBtn    = document.getElementById('repCancelBtn');
  const elConfirmModal = document.getElementById('repConfirmModal');
  const elConfirmSum   = document.getElementById('repConfirmSummary');

  // Fill initial data
  elPatientName.textContent = originalEvent.paciente;
  elFolio.value = originalEvent.folio;
  elCurrentSlot.textContent = `Horario actual: ${fmtDate(originalEvent.fecha)} ${fmtH(originalEvent.hora)}`;
  
  // Fill therapists (mock)
  const therapists = ["Dra. Ana Rodríguez", "Dr. Carlos Sánchez", "Dra. Laura Pérez"];
  elTherapist.innerHTML = therapists.map(t => `<option${t === originalEvent.ther ? ' selected' : ''}>${t}</option>`).join('');

  const isBusyFor = (prop, val, fecha, hora, dur) => {
    for(let m=0; m<dur; m+=SLOT) {
      const slot = addM(hora, m);
      if(eventos.some(e => e.id !== originalEvent.id && e.fecha === fecha && e.hora === slot && e[prop] === val))
        return true;
    }
    return false;
  };

  const updateAvailability = () => {
    if(!selectedDate || !selectedTime) return;
    const dur = 60;
    const ther = elTherapist.value;
    const busy = isBusyFor('ther', ther, selectedDate, selectedTime, dur);

    if(busy) {
        elAvailSection.classList.remove('hidden');
        elAvailContent.textContent = `El terapeuta ${ther} ya tiene una cita asignada en este bloque (${fmtH(selectedTime)}). Por favor, seleccione otro horario o terapeuta.`;
        elConfirmBtn.disabled = true;
    } else {
        elAvailSection.classList.add('hidden');
        elConfirmBtn.disabled = false;
    }
  };

  const buildCalendar = () => {
    const year  = calViewDate.getFullYear();
    const month = calViewDate.getMonth();
    const title = calViewDate.toLocaleDateString('es-ES',{month:'short',year:'numeric'});
    elCalTitle.textContent = title.toUpperCase();

    const first = new Date(year, month, 1);
    const last  = new Date(year, month+1, 0);
    let startWD = first.getDay(); 
    if(startWD === 0) startWD = 6; else startWD--; // Ajuste lunes=0

    elCalGrid.innerHTML = '';
    for(let i=0; i<startWD; i++) elCalGrid.innerHTML += '<div></div>';

    const today = new Date(); today.setHours(0,0,0,0);

    for(let day=1; day<=last.getDate(); day++) {
        const d = new Date(year, month, day);
        const dISO = iso(d);
        const btn = document.createElement('button');
        btn.textContent = day;
        btn.className = "w-8 h-8 text-[10px] font-bold rounded-lg transition-all ";
        
        const isWE = [0,6].includes(d.getDay());
        if(isWE || d < today) {
            btn.className += "text-slate-200 cursor-not-allowed";
            btn.disabled = true;
        } else {
            btn.className += (selectedDate === dISO) ? "bg-primary text-white shadow-md" : "text-slate-600 hover:bg-blue-50";
            btn.onclick = () => {
                selectedDate = dISO;
                selectedTime = null;
                elNewSlotText.textContent = "Fecha: " + fmtDate(dISO);
                buildCalendar();
                buildSlots(dISO);
            };
        }
        elCalGrid.appendChild(btn);
    }
  };

  const buildSlots = (fecha) => {
    elSlotsGrid.innerHTML = '';
    const dur = 60;
    const ther = elTherapist.value;

    for(let h=OPEN; h<CLOSE; h++) {
        for(let m=0; m<60; m+=SLOT) {
            const hora = `${pad(h)}:${pad(m)}`;
            const isBusy = isBusyFor('ther', ther, fecha, hora, dur);
            
            const btn = document.createElement('button');
            btn.className = `p-3 rounded-xl text-[10px] font-bold border transition-all ${
                isBusy ? 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed' : 
                (selectedTime === hora ? 'bg-blue-600 text-white border-blue-600 shadow-lg' : 'bg-white text-slate-600 border-slate-100 hover:border-blue-200 hover:bg-blue-50')
            }`;
            btn.innerHTML = `<span class="block text-[12px]">${fmtH(hora)}</span>${isBusy ? 'Ocupado' : 'Disponible'}`;
            btn.disabled = isBusy;
            btn.onclick = () => {
                selectedTime = hora;
                elNewSlotText.textContent = `${fmtDate(fecha)} a las ${fmtH(hora)}`;
                buildSlots(fecha);
                updateAvailability();
            };
            elSlotsGrid.appendChild(btn);
        }
    }
  };

  elPrevMonth.onclick = () => { calViewDate.setMonth(calViewDate.getMonth()-1); buildCalendar(); };
  elNextMonth.onclick = () => { calViewDate.setMonth(calViewDate.getMonth()+1); buildCalendar(); };

  elConfirmBtn.onclick = () => {
    elConfirmSum.innerHTML = `
        <div class="flex justify-between text-xs font-medium"><span class="text-slate-400">Paciente:</span><span class="text-slate-900">${originalEvent.paciente}</span></div>
        <div class="flex justify-between text-xs font-medium"><span class="text-slate-400">Folio:</span><span class="text-slate-900">${originalEvent.folio}</span></div>
        <div class="flex justify-between text-xs font-medium"><span class="text-slate-400">Nueva Fecha:</span><span class="text-blue-600 font-bold">${fmtDate(selectedDate)}</span></div>
        <div class="flex justify-between text-xs font-medium"><span class="text-slate-400">Nueva Hora:</span><span class="text-blue-600 font-bold">${fmtH(selectedTime)}</span></div>
        <div class="flex justify-between text-xs font-medium"><span class="text-slate-400">Terapeuta:</span><span class="text-slate-900">${elTherapist.value}</span></div>
    `;
    elConfirmModal.classList.remove('hidden');
  };

  document.getElementById('repConfirmCancelBtn').onclick = () => elConfirmModal.classList.add('hidden');

  document.getElementById('repConfirmSaveBtn').onclick = () => {
    const idx = eventos.findIndex(e => e.id === originalEvent.id);
    if(idx >= 0) {
        eventos[idx].fecha = selectedDate;
        eventos[idx].hora = selectedTime;
        eventos[idx].ther = elTherapist.value;
        localStorage.setItem('agenda_events', JSON.stringify(eventos));
    }
    localStorage.removeItem('reprogramar_event');
    window.location.href = 'agenda.html';
  };

  elCancelBtn.onclick = () => {
    localStorage.removeItem('reprogramar_event');
    window.location.href = 'agenda.html';
  };

  elTherapist.onchange = () => {
    if(selectedDate) buildSlots(selectedDate);
    updateAvailability();
  };

  buildCalendar();
});
