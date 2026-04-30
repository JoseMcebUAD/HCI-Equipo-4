document.addEventListener('DOMContentLoaded', () => {
    // --- UTILIDADES ---
    const pad = n => String(n).padStart(2, '0');
    const formatHour = h => {
        const ampm = h >= 12 ? 'PM' : 'AM';
        const h12 = h > 12 ? h - 12 : (h === 0 ? 12 : h);
        return `${h12.toString().padStart(2, '0')}:00 ${ampm}`;
    };
    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

    // --- ESTADO ---
    let originalEvent = null;
    let selectedDate = null;
    let selectedHour = null;
    let calViewDate = new Date();
    
    // Cargar evento a reprogramar
    const stored = localStorage.getItem('reprogramarEvent');
    if (!stored) {
        window.location.href = 'agenda.html';
        return;
    }
    originalEvent = JSON.parse(stored);
    originalEvent.date = new Date(originalEvent.date);

    // --- DOM REFS ---
    const elCurrentSlot = document.getElementById('repCurrentSlot');
    const elPatientName = document.getElementById('repPatientName');
    const elFolio = document.getElementById('repFolio');
    const elTherapist = document.getElementById('repTherapist');
    const elCalTitle = document.getElementById('repCalTitle');
    const elCalGrid = document.getElementById('repCalGrid');
    const elSlotsGrid = document.getElementById('repSlotsGrid');
    const elNewSlotText = document.getElementById('repNewSlotText');
    const elConfirmBtn = document.getElementById('repConfirmBtn');
    const elAvailSection = document.getElementById('repAvailSection');
    const elAvailContent = document.getElementById('repAvailContent');
    const elConfirmModal = document.getElementById('repConfirmModal');
    const elConfirmSum = document.getElementById('repConfirmSummary');

    // --- INICIALIZACIÓN ---
    function init() {
        elPatientName.textContent = originalEvent.patient;
        elFolio.value = originalEvent.id;
        elCurrentSlot.textContent = `Horario actual: ${originalEvent.date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })} @ ${formatHour(originalEvent.startHour)}`;
        
        // Cargar terapeutas de la DB filtrados por especialidad
        const targetType = originalEvent.type || "Diagnóstico";
        const therapists = DB.getTherapists().filter(t => t.specialties.includes(targetType));
        elTherapist.innerHTML = therapists.map(t => `<option value="${t.name}" ${t.name === originalEvent.doctor ? 'selected' : ''}>${t.name}</option>`).join('');
        
        renderCalendar();
        
        // Eventos de navegación calendario
        document.getElementById('repPrevMonth').onclick = () => { calViewDate.setMonth(calViewDate.getMonth() - 1); renderCalendar(); };
        document.getElementById('repNextMonth').onclick = () => { calViewDate.setMonth(calViewDate.getMonth() + 1); renderCalendar(); };
        
        elTherapist.onchange = checkAvailability;
        
        document.getElementById('repCancelBtn').onclick = () => window.location.href = 'agenda.html';
        elConfirmBtn.onclick = showConfirmation;
        document.getElementById('repConfirmCancelBtn').onclick = () => elConfirmModal.classList.add('hidden');
        document.getElementById('repConfirmSaveBtn').onclick = saveChanges;
    }

    // --- CALENDARIO ---
    function renderCalendar() {
        const year = calViewDate.getFullYear();
        const month = calViewDate.getMonth();
        elCalTitle.textContent = `${monthNames[month]} ${year}`;

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        elCalGrid.innerHTML = '';
        // Espacios vacíos
        for (let i = 0; i < (firstDay === 0 ? 6 : firstDay - 1); i++) {
            elCalGrid.appendChild(document.createElement('div'));
        }

        const today = new Date();
        today.setHours(0,0,0,0);

        for (let d = 1; d <= daysInMonth; d++) {
            const date = new Date(year, month, d);
            const btn = document.createElement('button');
            btn.className = "h-8 w-8 text-[10px] font-bold rounded-lg transition-all flex items-center justify-center";
            btn.textContent = d;

            if (date < today) {
                btn.classList.add('text-slate-200', 'cursor-not-allowed');
            } else {
                const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
                btn.className += isSelected ? " bg-primary text-white shadow-md" : " text-slate-600 hover:bg-slate-100";
                btn.onclick = () => {
                    selectedDate = date;
                    selectedHour = null;
                    renderCalendar();
                    renderSlots();
                    checkAvailability();
                };
            }
            elCalGrid.appendChild(btn);
        }
    }

    // --- SLOTS ---
    function renderSlots() {
        elSlotsGrid.innerHTML = '';
        if (!selectedDate) return;

        const hours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
        hours.forEach(h => {
            const btn = document.createElement('button');
            const isSelected = selectedHour === h;
            btn.className = `py-2 text-[10px] font-bold border-2 rounded-xl transition-all ${
                isSelected ? 'border-primary bg-primary text-white' : 'border-slate-100 text-slate-500 hover:border-primary/20'
            }`;
            btn.textContent = formatHour(h);
            btn.onclick = () => {
                selectedHour = h;
                elNewSlotText.textContent = `${selectedDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })} @ ${formatHour(h)}`;
                renderSlots();
                checkAvailability();
            };
            elSlotsGrid.appendChild(btn);
        });
    }

    // --- DISPONIBILIDAD ---
    function checkAvailability() {
        if (!selectedDate || !selectedHour) {
            elConfirmBtn.disabled = true;
            return;
        }

        const events = DB.getEvents();
        const doctor = elTherapist.value;
        
        const conflict = events.find(ev => 
            ev.id !== originalEvent.id &&
            ev.doctor === doctor &&
            new Date(ev.date).toDateString() === selectedDate.toDateString() &&
            ev.startHour === selectedHour
        );

        if (conflict) {
            elAvailSection.classList.remove('hidden');
            elAvailContent.textContent = `El terapeuta ${doctor} ya tiene una cita asignada en este bloque (${formatHour(selectedHour)}).`;
            elConfirmBtn.disabled = true;
        } else {
            elAvailSection.classList.add('hidden');
            elConfirmBtn.disabled = false;
        }
    }

    // --- CONFIRMACIÓN ---
    function showConfirmation() {
        elConfirmSum.innerHTML = `
            <div class="space-y-2">
                <p class="text-xs text-slate-500 font-bold uppercase tracking-widest">Paciente</p>
                <p class="text-sm font-bold text-slate-800">${originalEvent.patient}</p>
            </div>
            <div class="grid grid-cols-2 gap-4 mt-4">
                <div>
                    <p class="text-[10px] text-slate-400 font-bold uppercase">Terapeuta Anterior</p>
                    <p class="text-xs font-bold text-slate-600">${originalEvent.doctor}</p>
                </div>
                <div>
                    <p class="text-[10px] text-slate-400 font-bold uppercase">Nuevo Terapeuta</p>
                    <p class="text-xs font-black text-blue-600">${elTherapist.value}</p>
                </div>
                <div>
                    <p class="text-[10px] text-slate-400 font-bold uppercase">Horario Anterior</p>
                    <p class="text-xs font-bold text-slate-600">${originalEvent.date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })} @ ${formatHour(originalEvent.startHour)}</p>
                </div>
                <div>
                    <p class="text-[10px] text-slate-400 font-bold uppercase">Nuevo Horario</p>
                    <p class="text-xs font-black text-emerald-600">${selectedDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })} @ ${formatHour(selectedHour)}</p>
                </div>
            </div>
        `;
        elConfirmModal.classList.remove('hidden');
    }

    // --- GUARDAR ---
    function saveChanges() {
        const events = DB.getEvents();
        const index = events.findIndex(e => e.id === originalEvent.id);
        
        if (index !== -1) {
            events[index].doctor = elTherapist.value;
            events[index].date = selectedDate;
            events[index].startHour = selectedHour;
            
            DB.saveEvents(events);
            localStorage.removeItem('reprogramarEvent');
            
            // Efecto visual y salida
            document.getElementById('repConfirmSaveBtn').innerHTML = '<span class="material-symbols-outlined animate-spin">sync</span>';
            setTimeout(() => {
                window.location.href = 'agenda.html';
            }, 1000);
        }
    }

    init();
});
