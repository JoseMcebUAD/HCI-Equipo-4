document.addEventListener('DOMContentLoaded', () => {
    // --- ESTADO Y DATOS SIMULADOS ---
    const today = new Date();
    const currentDay = today.getDay(); // 0 = Sun, 1 = Mon...
    const distToMonday = currentDay === 0 ? -6 : 1 - currentDay;
    const baseMonday = new Date(today);
    baseMonday.setDate(today.getDate() + distToMonday);
    baseMonday.setHours(0,0,0,0);

    let currentViewMonday = new Date(baseMonday); // Cambiará al navegar
    let currentViewMode = 'week'; // 'week', 'day'
    let currentOpenEventId = null; // Para saber qué cita eliminar
    let undoState = null; // Para deshacer eliminación
    let undoTimeout = null;
    
    const getDateForOffset = (offset) => {
        const d = new Date(baseMonday);
        d.setDate(baseMonday.getDate() + offset);
        return d;
    };

    let events = [];
    const storedEvents = localStorage.getItem('agendaEvents');
    
    if (storedEvents) {
        events = JSON.parse(storedEvents);
        events.forEach(ev => ev.date = new Date(ev.date));
    } else {
        events = [
            {
                id: 1, patient: "Elena Rodriguez", type: "TCC", room: "Sala 02", doctor: "Dr. Miller",
                date: getDateForOffset(0), startHour: 9, duration: 1,
                bgClass: "bg-secondary-container border-secondary",
                textClass: "text-on-secondary-container", doctorClass: "text-secondary"
            },
            {
                id: 2, patient: "Julian Casablancas", type: "Evaluación", room: "Sala 01", doctor: "Lic. Connor",
                date: getDateForOffset(1), startHour: 10, duration: 1,
                bgClass: "bg-primary-fixed border-primary-container",
                textClass: "text-primary-container", doctorClass: "text-primary-container"
            },
            {
                id: 3, patient: "Mark Hollis", type: "Pareja", room: "Sala 04", doctor: "Dr. Miller",
                date: getDateForOffset(2), startHour: 11, duration: 1,
                bgClass: "bg-tertiary-fixed border-tertiary-container",
                textClass: "text-tertiary-container", doctorClass: "text-tertiary-container"
            },
            {
                id: 4, patient: "Sade Adu", type: "Urgencia", room: "Sala 01", doctor: "Lic. Connor",
                date: getDateForOffset(3), startHour: 8, duration: 1,
                bgClass: "bg-error-container border-error",
                textClass: "text-on-error-container", doctorClass: "text-error"
            }
        ];
        localStorage.setItem('agendaEvents', JSON.stringify(events));
    }

    function saveEvents() {
        localStorage.setItem('agendaEvents', JSON.stringify(events));
    }

    const START_HOUR = 8;
    const END_HOUR = 18;
    const TOTAL_ROWS = (END_HOUR - START_HOUR); // 10 filas de 1 hora
    const ROW_HEIGHT_PX = 80;
    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

    // --- ELEMENTOS DOM ---
    const calendarGrid = document.getElementById('calendarGrid');
    const dateRangeLabel = document.getElementById('currentDateRange');
    const mainSearch = document.getElementById('mainSearchInput');
    const sidebarSearch = document.getElementById('sidebarSearchInput');
    const sidebarList = document.getElementById('sidebarPatientsList');
    
    // --- LÓGICA DE RENDERIZADO CSS GRID ---

    function generateGrid() {
        calendarGrid.innerHTML = '';
        
        if (currentViewMode === 'week') {
            calendarGrid.style.gridTemplateColumns = '80px repeat(5, 1fr)';
            calendarGrid.style.gridTemplateRows = `repeat(${TOTAL_ROWS}, ${ROW_HEIGHT_PX}px)`;
        } else {
            calendarGrid.style.gridTemplateColumns = '80px 1fr';
            calendarGrid.style.gridTemplateRows = `repeat(${TOTAL_ROWS}, ${ROW_HEIGHT_PX}px)`;
        }

        for (let r = 0; r < TOTAL_ROWS; r++) {
            const rowStart = r + 1;
            const hourValue = START_HOUR + r;

            const timeLabel = document.createElement('div');
            timeLabel.className = 'time-label-cell';
            timeLabel.style.gridColumn = '1';
            timeLabel.style.gridRow = `${rowStart}`;
            timeLabel.textContent = formatHour(hourValue);
            calendarGrid.appendChild(timeLabel);

            const cols = currentViewMode === 'week' ? 5 : 1;
            for (let c = 0; c < cols; c++) {
                const cell = document.createElement('div');
                cell.style.gridColumn = `${c + 2}`;
                cell.style.gridRow = `${rowStart}`;
                
                let dayOffset = currentViewMode === 'week' ? c : (today.getDay() === 0 ? 6 : today.getDay() - 1);
                const cellDate = new Date(currentViewMonday);
                cellDate.setDate(currentViewMonday.getDate() + dayOffset);
                
                // RNF-US-01: Marcar celdas ocupadas visualmente
                const isOccupied = events.some(ev => ev.date.toDateString() === cellDate.toDateString() && ev.startHour === hourValue);
                const isPast = cellDate < new Date(today.getFullYear(), today.getMonth(), today.getDate()) || (cellDate.toDateString() === today.toDateString() && hourValue < today.getHours());
                
                if (isPast) {
                    cell.className = 'grid-cell grid-cell-past';
                    cell.title = 'Horario pasado — no disponible';
                } else if (isOccupied) {
                    cell.className = 'grid-cell grid-cell-occupied';
                    cell.title = 'Horario ocupado — seleccione otro';
                } else {
                    cell.className = 'grid-cell';
                    cell.addEventListener('click', () => handleGridClick(dayOffset, hourValue));
                }
                calendarGrid.appendChild(cell);
            }
        }
    }

    function updateHeaders() {
        const headersContainer = document.getElementById('calendarHeaders');
        let current = new Date(currentViewMonday);
        
        if (currentViewMode === 'week') {
            headersContainer.style.gridTemplateColumns = '80px repeat(5, 1fr)';
            let end = new Date(currentViewMonday);
            end.setDate(end.getDate() + 4); 
            dateRangeLabel.textContent = `${monthNames[current.getMonth()]} ${current.getDate()} - ${end.getDate()}, ${current.getFullYear()}`;
            
            for (let i = 0; i < 5; i++) {
                const header = document.getElementById(`header-${i}`);
                if(!header) continue;
                
                header.style.display = 'flex';
                const dateNumSpan = header.querySelector('.date-num');
                dateNumSpan.textContent = current.getDate();
                
                if (current.toDateString() === today.toDateString()) {
                    header.classList.add('current-day-col');
                } else {
                    header.classList.remove('current-day-col');
                }
                current.setDate(current.getDate() + 1);
            }
        } else if (currentViewMode === 'day') {
            headersContainer.style.gridTemplateColumns = '80px 1fr';
            dateRangeLabel.textContent = `${today.getDate()} de ${monthNames[today.getMonth()]}, ${today.getFullYear()}`;
            
            for (let i = 0; i < 5; i++) {
                const header = document.getElementById(`header-${i}`);
                if(!header) continue;
                
                if (i === 0) {
                    header.style.display = 'flex';
                    header.querySelector('.text-outline').textContent = "Hoy";
                    header.querySelector('.date-num').textContent = today.getDate();
                    header.classList.add('current-day-col');
                } else {
                    header.style.display = 'none';
                }
            }
        }
        
        generateGrid();
    }

    function getActiveFilters() {
        const checkboxes = document.querySelectorAll('.filter-check:checked');
        return Array.from(checkboxes).map(cb => cb.value);
    }

    function renderEvents(filterText = "") {
        const existingCards = calendarGrid.querySelectorAll('.strict-event-card');
        existingCards.forEach(card => card.remove());

        const searchLower = filterText.toLowerCase();
        const activeTypes = getActiveFilters();
        
        const endOfWeek = new Date(currentViewMonday);
        endOfWeek.setDate(endOfWeek.getDate() + 4);
        endOfWeek.setHours(23, 59, 59);
    
        let renderedCount = 0;
        
        events.forEach(ev => {
            if (!activeTypes.includes(ev.type)) return;
            if (searchLower && !ev.patient.toLowerCase().includes(searchLower) && !ev.type.toLowerCase().includes(searchLower)) return;

            if (currentViewMode === 'day') {
                if (ev.date.toDateString() !== today.toDateString()) return;
            } else {
                if (ev.date < currentViewMonday || ev.date > endOfWeek) return;
            }
            
            let dayIndex = ev.date.getDay() - 1;
            if (currentViewMode === 'day') dayIndex = 0; 

            if (dayIndex < 0 || dayIndex > 4) return; 
            
            const rowStart = (ev.startHour - START_HOUR) + 1;
            const colStart = dayIndex + 2;
            
            const card = document.createElement('div');
            card.className = `strict-event-card slide-up ${ev.bgClass}`;
            card.style.gridColumn = `${colStart}`;
            card.style.gridRow = `${rowStart}`; // duration is always 1 row
            
            card.innerHTML = `
                <div>
                    <p class="text-[12px] font-bold truncate ${ev.textClass}">${ev.patient}</p>
                    <p class="text-[10px] opacity-80 font-medium ${ev.textClass}">${ev.type} • ${ev.room}</p>
                </div>
                <p class="text-[10px] font-bold ${ev.doctorClass}">${ev.doctor}</p>
            `;
            
            card.addEventListener('click', (e) => {
                e.stopPropagation(); 
                openModal(ev);
            });
            calendarGrid.appendChild(card);
            renderedCount++;
        });
        
        document.getElementById('statTotal').textContent = renderedCount;
        const totalSlots = currentViewMode === 'day' ? TOTAL_ROWS : TOTAL_ROWS * 5;
        const available = totalSlots - renderedCount;
        document.getElementById('statAvailable').textContent = available.toString().padStart(2, '0');
        
        // FR-08: Cálculo de ocupación y alerta ≥75%
        const occupancyPct = Math.round((renderedCount / totalSlots) * 100);
        const occLabel = document.getElementById('occupancyLabel');
        if (occLabel) {
            occLabel.textContent = `${occupancyPct}%`;
            occLabel.parentElement.className = occupancyPct >= 75 
                ? 'text-label-sm font-bold text-error bg-error-container px-2 py-1 rounded animate-pulse' 
                : 'text-label-sm font-bold text-secondary bg-secondary-container px-2 py-1 rounded';
            occLabel.parentElement.querySelector('.occ-text').textContent = occupancyPct >= 75 ? '⚠ Redistribución Requerida' : 'Alta Demanda';
        }
        
        // RNF-US-06: Actualizar sidebar de salas dinámicamente
        updateRoomStatus();
    }

    function renderSidebarPatients(filterText = "") {
        sidebarList.innerHTML = '';
        const searchLower = filterText.toLowerCase();
        
        const uniquePatients = Array.from(new Set(events.map(e => e.patient)))
            .map(p => events.find(e => e.patient === p));

        uniquePatients.forEach(ev => {
            if (searchLower && !ev.patient.toLowerCase().includes(searchLower)) return;

            const div = document.createElement('div');
            div.className = 'flex items-center gap-3 p-2 rounded-lg hover:bg-blue-50/50 dark:hover:bg-slate-700 transition-all cursor-pointer slide-up';
            div.innerHTML = `
                <div class="w-8 h-8 rounded-full bg-slate-200 flex-shrink-0 overflow-hidden">
                    <span class="material-symbols-outlined text-slate-400 m-1">person</span>
                </div>
                <div class="overflow-hidden">
                    <p class="text-[13px] font-semibold truncate text-slate-900 dark:text-slate-100">${ev.patient}</p>
                    <p class="text-[11px] text-slate-500 truncate">${ev.type} • ${formatHour(ev.startHour)}</p>
                </div>
            `;
            div.addEventListener('click', () => openModal(ev));
            sidebarList.appendChild(div);
        });
    }

    function formatHour(hourInt) {
        const ampm = hourInt >= 12 ? 'PM' : 'AM';
        const h12 = hourInt > 12 ? hourInt - 12 : (hourInt === 0 ? 12 : hourInt);
        return `${h12.toString().padStart(2, '0')}:00 ${ampm}`;
    }

    // --- INTERACCIÓN EN CELDAS VACÍAS (CREAR CITA) ---
    const createModal = document.getElementById('createEventModal');
    const closeCreateModal = document.getElementById('closeCreateModal');
    const btnCancelCreate = document.getElementById('btnCancelCreate');
    const btnSaveCreate = document.getElementById('btnSaveCreate');
    const lblCreateDateTime = document.getElementById('createModalDateTime');
    
    let pendingCreateDate = null;
    let pendingCreateHour = null;

    const therapists = [
        { name: "Dr. Miller", busy: [{ day: 0, hour: 10 }, { day: 2, hour: 11 }] },
        { name: "Lic. Connor", busy: [{ day: 1, hour: 10 }, { day: 3, hour: 8 }] },
        { name: "Dra. Laura Pérez", busy: [] },
        { name: "Dr. Carlos Sánchez", busy: [] }
    ];

    function updateCreateModalTherapists(date, hour) {
        const select = document.getElementById('newDoctorName');
        const day = date.getDay() - 1; // 0=Mon, 4=Fri
        
        const available = therapists.filter(t => {
            const isBusyInEvents = events.some(ev => ev.doctor === t.name && ev.date.toDateString() === date.toDateString() && ev.startHour === hour);
            const isBusyInMock = t.busy.some(b => b.day === day && b.hour === hour);
            return !isBusyInEvents && !isBusyInMock;
        });

        if (available.length === 0) {
            select.innerHTML = '<option value="" disabled selected>No hay terapeutas disponibles</option>';
            showModalError("No hay terapeutas disponibles en este bloque. Elija otro horario.");
        } else {
            select.innerHTML = '<option value="" disabled selected>Selecciona un especialista</option>' +
                available.map(t => `<option value="${t.name}">${t.name}</option>`).join('');
            document.getElementById('createModalError').classList.add('hidden');
        }
    }

    function showModalError(msg) {
        const err = document.getElementById('createModalError');
        err.textContent = `⚠ ${msg}`;
        err.classList.remove('hidden');
    }

    function handleGridClick(dayOffset, clickHour) {
        const clickedDate = new Date(currentViewMonday);
        clickedDate.setDate(currentViewMonday.getDate() + dayOffset);

        pendingCreateDate = clickedDate;
        pendingCreateHour = clickHour;

        const dias = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
        const dayStr = dias[clickedDate.getDay()];
        const timeStr = formatHour(clickHour);

        lblCreateDateTime.textContent = `${dayStr}, ${clickedDate.getDate()} de ${monthNames[clickedDate.getMonth()]} • ${timeStr}`;

        document.getElementById('newPatientName').value = '';
        document.getElementById('createModalError').classList.add('hidden');
        updateCreateModalTherapists(clickedDate, clickHour);

        createModal.classList.remove('hidden');
        setTimeout(() => {
            createModal.classList.remove('opacity-0');
            createModal.querySelector('.pop-in-element').classList.remove('scale-95');
            createModal.querySelector('.pop-in-element').classList.add('scale-100');
        }, 10);
    }

    const hideCreateModal = () => {
        createModal.classList.add('opacity-0');
        createModal.querySelector('.pop-in-element').classList.remove('scale-100');
        createModal.querySelector('.pop-in-element').classList.add('scale-95');
        setTimeout(() => {
            createModal.classList.add('hidden');
        }, 300);
    };

    closeCreateModal.addEventListener('click', hideCreateModal);
    btnCancelCreate.addEventListener('click', hideCreateModal);
    createModal.addEventListener('click', (e) => {
        if (e.target === createModal) hideCreateModal();
    });

    // RNF-US-07 + Validar Choques
    btnSaveCreate.addEventListener('click', () => {
        const patient = document.getElementById('newPatientName').value || "Paciente Nuevo";
        const specialty = document.getElementById('newSpecialty').value;
        const room = document.getElementById('newRoom').value;
        const doctor = document.getElementById('newDoctorName').value || "Dr. Asignado";

        if (!patient.trim() || patient === "Paciente Nuevo") {
            showModalError('El nombre del paciente es obligatorio. Por favor ingrese un nombre válido.');
            return;
        }

        if (!doctor) {
            showModalError('Debe seleccionar un terapeuta disponible.');
            return;
        }

        // VERIFICAR CHOQUES (RNF-US-01)
        const conflict = events.find(ev => 
            ev.date.toDateString() === pendingCreateDate.toDateString() &&
            ev.startHour === pendingCreateHour &&
            (ev.room === room || ev.doctor === doctor)
        );

        if (conflict) {
            if (conflict.room === room) {
                showModalError(`Error: La ${room} ya está ocupada a esta hora. Seleccione otra sala o cambie el horario.`);
            } else {
                showModalError(`Error: ${doctor} ya tiene sesión a esta hora. Asigne otro terapeuta o elija otro horario.`);
            }
            return;
        }

        // RNF-US-07: Mostrar resumen preventivo antes de confirmar
        const dias = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
        const dayStr = dias[pendingCreateDate.getDay()];
        const timeStr = formatHour(pendingCreateHour);
        const summaryMsg = `La cita será agendada para ${dayStr} ${pendingCreateDate.getDate()} de ${monthNames[pendingCreateDate.getMonth()]} a las ${timeStr} con ${doctor} en ${room} para ${patient} (${specialty}).`;
        
        showConfirmModal(
            'Confirmar nueva sesión',
            summaryMsg,
            () => {
                let bgClass, textClass, doctorClass;
                if (specialty === "TCC") { bgClass = "bg-secondary-container border-secondary"; textClass = "text-on-secondary-container"; doctorClass = "text-secondary"; }
                else if (specialty === "Evaluación") { bgClass = "bg-primary-fixed border-primary-container"; textClass = "text-primary-container"; doctorClass = "text-primary-container"; }
                else if (specialty === "Pareja") { bgClass = "bg-tertiary-fixed border-tertiary-container"; textClass = "text-tertiary-container"; doctorClass = "text-tertiary-container"; }
                else { bgClass = "bg-error-container border-error"; textClass = "text-on-error-container"; doctorClass = "text-error"; }

                events.push({
                    id: Date.now(),
                    patient, type: specialty, room, doctor,
                    date: pendingCreateDate, startHour: pendingCreateHour, duration: 1,
                    bgClass, textClass, doctorClass
                });
                saveEvents();
                hideCreateModal();
                showToast("¡Sesión creada y agendada exitosamente!");
                renderEvents(mainSearch.value);
                renderSidebarPatients(sidebarSearch.value);
            }
        );
    });

    // --- VISTAS DÍA/SEMANA/MES ---
    const btnWeek = document.getElementById('btnViewWeek');
    const btnDay = document.getElementById('btnViewDay');
    const btnMonth = document.getElementById('btnViewMonth');

    function updateViewButtons(activeBtn) {
        [btnWeek, btnDay, btnMonth].forEach(btn => {
            btn.className = "px-4 py-1 rounded-full text-label-sm font-label-sm text-outline hover:text-primary transition-all";
        });
        activeBtn.className = "px-4 py-1 rounded-full text-label-sm font-label-sm bg-white shadow-sm text-primary transition-all";
    }

    btnWeek.addEventListener('click', () => {
        currentViewMode = 'week';
        updateViewButtons(btnWeek);
        updateHeaders();
        renderEvents(mainSearch.value);
    });

    btnDay.addEventListener('click', () => {
        currentViewMode = 'day';
        updateViewButtons(btnDay);
        updateHeaders();
        renderEvents(mainSearch.value);
    });

    btnMonth.addEventListener('click', () => {
        updateViewButtons(btnMonth);
        showToast("La vista de Mes requiere navegación extendida (En desarrollo).");
    });

    // --- MENÚ DE FILTROS ---
    const btnFilters = document.getElementById('btnFilters');
    const filtersDropdown = document.getElementById('filtersDropdown');
    const btnApplyFilters = document.getElementById('btnApplyFilters');

    btnFilters.addEventListener('click', () => {
        if (filtersDropdown.classList.contains('hidden')) {
            filtersDropdown.classList.remove('hidden');
            setTimeout(() => filtersDropdown.classList.remove('opacity-0'), 10);
        } else {
            filtersDropdown.classList.add('opacity-0');
            setTimeout(() => filtersDropdown.classList.add('hidden'), 300);
        }
    });

    btnApplyFilters.addEventListener('click', () => {
        renderEvents(mainSearch.value);
        filtersDropdown.classList.add('opacity-0');
        setTimeout(() => filtersDropdown.classList.add('hidden'), 300);
    });

    // --- NAVEGACIÓN DE FECHAS ---
    document.getElementById('btnPrevWeek').addEventListener('click', () => {
        if (currentViewMode === 'day') return showToast('Cambia a vista de Semana para navegar.');
        currentViewMonday.setDate(currentViewMonday.getDate() - 7);
        updateHeaders();
        renderEvents(mainSearch.value);
    });

    document.getElementById('btnNextWeek').addEventListener('click', () => {
        if (currentViewMode === 'day') return showToast('Cambia a vista de Semana para navegar.');
        currentViewMonday.setDate(currentViewMonday.getDate() + 7);
        updateHeaders();
        renderEvents(mainSearch.value);
    });

    // --- BUSCADORES ---
    mainSearch.addEventListener('input', (e) => {
        renderEvents(e.target.value);
        renderSidebarPatients(e.target.value);
    });

    sidebarSearch.addEventListener('input', (e) => {
        renderSidebarPatients(e.target.value);
    });

    // --- ACCORDIONS ---
    document.querySelectorAll('.accordion-header').forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            const icon = header.querySelector('.material-symbols-outlined');
            if (content.style.display === 'none') {
                content.style.display = 'block';
                icon.style.transform = 'rotate(0deg)';
                icon.style.transition = 'transform 0.3s ease';
            } else {
                content.style.display = 'none';
                icon.style.transform = 'rotate(-90deg)';
                icon.style.transition = 'transform 0.3s ease';
            }
        });
    });

    // --- MODAL DETALLE DE CITA (VER Y ELIMINAR) ---
    const modal = document.getElementById('eventModal');
    const btnClose = document.getElementById('closeModal');
    const btnDeleteEvent = document.getElementById('btnDeleteEvent');
    
    const mPatient = document.getElementById('modalPatient');
    const mType = document.getElementById('modalType');
    const mDoctor = document.getElementById('modalDoctor');
    const mTime = document.getElementById('modalTime');
    const mRoom = document.getElementById('modalRoom');
    const mDate = document.getElementById('modalDate');

    function openModal(ev) {
        currentOpenEventId = ev.id;
        
        mPatient.textContent = ev.patient;
        mType.textContent = ev.type;
        mRoom.textContent = ev.room;
        mDoctor.textContent = ev.doctor;
        
        mTime.textContent = `${formatHour(ev.startHour)} - ${formatHour(ev.startHour + ev.duration)}`;
        
        const d = ev.date;
        const dias = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
        mDate.textContent = `${dias[d.getDay()]}, ${d.getDate()} de ${monthNames[d.getMonth()]} ${d.getFullYear()}`;

        modal.classList.remove('hidden');
    }

    const hideModal = () => {
        modal.classList.add('hidden');
        currentOpenEventId = null;
    };
    
    btnClose.addEventListener('click', hideModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) hideModal(); });

    // FR-03 + RNF-US-05: Cancelar cita con motivo y actor
    btnDeleteEvent.addEventListener('click', () => {
        if (!currentOpenEventId) return;
        showCancelModal(currentOpenEventId);
    });

    function showCancelModal(eventId) {
        const ev = events.find(e => e.id === eventId);
        if (!ev) return;
        let overlay = document.getElementById('cancelModal');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'cancelModal';
            overlay.className = 'fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[120] flex items-center justify-center p-4';
            overlay.innerHTML = `
                <div class="bg-white w-full max-w-sm rounded-2xl p-6 shadow-xl">
                    <h3 class="text-lg font-bold text-slate-800 mb-1">Cancelar Cita</h3>
                    <p class="text-sm text-slate-500 mb-4" id="cancelPatientInfo"></p>
                    <label class="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wide">Actor que cancela</label>
                    <select id="cancelActor" class="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm mb-3 outline-none focus:border-blue-500">
                        <option value="Administrativo">Administrativo</option>
                        <option value="Paciente">Paciente</option>
                        <option value="Terapeuta">Terapeuta</option>
                    </select>
                    <label class="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wide">Motivo</label>
                    <textarea id="cancelReason" rows="3" required class="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm mb-4 outline-none focus:border-blue-500" placeholder="Describa el motivo de la cancelación..."></textarea>
                    <div class="flex gap-2">
                        <button id="cancelModalClose" class="flex-1 py-2 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 transition-colors">Volver</button>
                        <button id="cancelModalConfirm" class="flex-1 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors">Cancelar Cita</button>
                    </div>
                </div>`;
            document.body.appendChild(overlay);
        }
        document.getElementById('cancelPatientInfo').textContent = `Paciente: ${ev.patient} — ${ev.type}`;
        document.getElementById('cancelReason').value = '';
        overlay.classList.remove('hidden');
        overlay.style.display = 'flex';

        document.getElementById('cancelModalClose').onclick = () => { overlay.style.display = 'none'; };
        document.getElementById('cancelModalConfirm').onclick = () => {
            const reason = document.getElementById('cancelReason').value.trim();
            if (!reason) { showToast('Debe indicar un motivo para cancelar la cita.', true); return; }
            overlay.style.display = 'none';
            hideModal();
            // RNF-US-02: Eliminación con ventana de undo 5s
            const deletedEvent = events.find(e => e.id === eventId);
            events = events.filter(e => e.id !== eventId);
            saveEvents();
            renderEvents(mainSearch.value);
            renderSidebarPatients(sidebarSearch.value);
            undoState = { event: deletedEvent };
            if (undoTimeout) clearTimeout(undoTimeout);
            showToast('Cita cancelada. ', false, true);
            undoTimeout = setTimeout(() => { undoState = null; }, 5000);
        };
    }

    function handleUndo() {
        if (!undoState) return;
        events.push(undoState.event);
        saveEvents();
        undoState = null;
        if (undoTimeout) clearTimeout(undoTimeout);
        renderEvents(mainSearch.value);
        renderSidebarPatients(sidebarSearch.value);
        showToast('Cita restaurada correctamente.');
    }

    // RNF-US-05: Modal de confirmación genérico
    function showConfirmModal(title, message, onConfirm) {
        let overlay = document.getElementById('genericConfirmModal');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'genericConfirmModal';
            overlay.className = 'fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[120] flex items-center justify-center p-4';
            overlay.innerHTML = `
                <div class="bg-white w-full max-w-sm rounded-2xl p-6 shadow-xl">
                    <h3 id="gcmTitle" class="text-lg font-bold text-slate-800 mb-3"></h3>
                    <p id="gcmMessage" class="text-sm text-slate-600 mb-6 leading-relaxed"></p>
                    <div class="flex gap-2">
                        <button id="gcmCancel" class="flex-1 py-2.5 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 transition-colors">Cancelar</button>
                        <button id="gcmConfirm" class="flex-1 py-2.5 bg-primary text-white font-semibold rounded-lg hover:opacity-90 transition-all">Confirmar</button>
                    </div>
                </div>`;
            document.body.appendChild(overlay);
        }
        document.getElementById('gcmTitle').textContent = title;
        document.getElementById('gcmMessage').textContent = message;
        overlay.style.display = 'flex';
        document.getElementById('gcmCancel').onclick = () => { overlay.style.display = 'none'; };
        document.getElementById('gcmConfirm').onclick = () => { overlay.style.display = 'none'; onConfirm(); };
    }

    // RNF-US-06: Actualizar estado de salas dinámicamente
    function updateRoomStatus() {
        const roomCards = document.querySelectorAll('.accordion-content.grid .bg-white');
        const rooms = ['Sala 01', 'Sala 02'];
        const now = new Date();
        roomCards.forEach((card, i) => {
            const roomName = rooms[i];
            if (!roomName) return;
            const occupied = events.some(ev => ev.room === roomName && ev.date.toDateString() === now.toDateString() && ev.startHour <= now.getHours() && (ev.startHour + ev.duration) > now.getHours());
            const statusEl = card.querySelector('p:last-child');
            if (statusEl) {
                statusEl.textContent = occupied ? 'Ocupada' : 'Disponible';
                statusEl.className = occupied ? 'text-[12px] font-semibold text-error' : 'text-[12px] font-semibold text-secondary';
            }
        });
    }

    // --- TOAST NOTIFICATIONS ---
    function showToast(msg, isError = false, withUndo = false) {
        let toast = document.getElementById('globalToast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'globalToast';
            document.body.appendChild(toast);
        }
        const bgColor = isError ? 'bg-red-600' : 'bg-slate-900';
        toast.className = `fixed bottom-6 right-6 ${bgColor} text-white px-6 py-3 rounded-lg shadow-xl z-[100] transform transition-all duration-300 translate-y-20 opacity-0 font-medium text-sm flex items-center gap-3`;
        
        if (withUndo) {
            toast.innerHTML = `<span>${msg}</span><button onclick="document.dispatchEvent(new CustomEvent('undoDelete'))" class="bg-white/20 hover:bg-white/30 px-3 py-1 rounded font-bold text-xs transition-colors">DESHACER (5s)</button>`;
        } else {
            toast.innerHTML = `<span>${msg}</span>`;
        }
        
        setTimeout(() => toast.classList.remove('translate-y-20', 'opacity-0'), 10);
        setTimeout(() => toast.classList.add('translate-y-20', 'opacity-0'), withUndo ? 5000 : 3000);
    }

    document.addEventListener('undoDelete', handleUndo);

    // Conectar botón Reprogramar del modal de detalle
    const btnReprogramar = document.querySelector('#eventModal .bg-surface-container');
    if (btnReprogramar) {
        btnReprogramar.addEventListener('click', () => {
            if (!currentOpenEventId) return;
            const ev = events.find(e => e.id === currentOpenEventId);
            if (ev) {
                localStorage.setItem('reprogramarEvent', JSON.stringify(ev));
                window.location.href = 'reprogramar.html';
            }
        });
    }

    // --- INICIALIZACIÓN ---
    updateHeaders(); 
    renderEvents();
    renderSidebarPatients();
});
