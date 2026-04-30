document.addEventListener('DOMContentLoaded', () => {
    
    // Generar fechas dinámicas para el prototipo (Año Actual)
    const today = new Date();
    const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    
    const formatDate = (dateObj) => {
        return `${monthNames[dateObj.getMonth()]} ${dateObj.getDate()}, ${dateObj.getFullYear()}`;
    };

    const getDateOffset = (offset) => {
        const d = new Date(today);
        d.setDate(today.getDate() + offset);
        return d;
    };

    const getHourFormat = (hour) => {
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const h12 = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
        return `${h12.toString().padStart(2, '0')}:00 ${ampm} — ${(h12 + 1).toString().padStart(2, '0')}:00 ${ampm}`;
    };

    // --- ESTADO SIMULADO ---
    let requests = [
        {
            id: 1,
            patient: "Marcus Richardson",
            patientId: "#PT-8821",
            type: "Evaluación Inicial",
            typeColor: "bg-sky-500",
            dateObj: getDateOffset(1), // Mañana
            startHour: 10, // 10 AM (Chocará con Julian Casablancas que está fijo a las 10 mañana)
            status: "Urgente", 
            isToday: false
        },
        {
            id: 2,
            patient: "Elena Vasquez",
            patientId: "#PT-7742",
            type: "Sesión Seguimiento",
            typeColor: "bg-emerald-500",
            dateObj: getDateOffset(0), // Hoy
            startHour: 14, // 2 PM
            status: "En Revisión",
            isToday: true
        },
        {
            id: 3,
            patient: "Julian Hayes",
            patientId: "#PT-9102",
            type: "Terapia de Pareja",
            typeColor: "bg-purple-500",
            dateObj: getDateOffset(0), // Hoy
            startHour: 11, // 11 AM
            status: "Pendiente",
            isToday: true 
        },
        {
            id: 4,
            patient: "Martha Stewart",
            patientId: "#PT-1244",
            type: "Revisión Diagnóstica",
            typeColor: "bg-orange-500",
            dateObj: getDateOffset(2), // Pasado mañana
            startHour: 16, // 4 PM
            status: "Urgente",
            isToday: false
        }
    ];

    const tableBody = document.getElementById('requestsTableBody');
    const searchInput = document.getElementById('searchInput');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const paginationCount = document.getElementById('paginationCount');
    let currentFilter = 'all'; 

    // Botones extra
    const btnHistory = document.getElementById('btnHistory');
    const btnAdvancedFilters = document.getElementById('btnAdvancedFilters');

    // Modal elements
    const rescheduleModal = document.getElementById('rescheduleModal');
    const btnCancelReschedule = document.getElementById('btnCancelReschedule');
    const btnConfirmReschedule = document.getElementById('btnConfirmReschedule');
    const reschedulePatientName = document.getElementById('reschedulePatientName');
    let currentRescheduleId = null;

    function getBadgeConfig(status) {
        if (status === 'Urgente') return { bg: 'bg-orange-100', text: 'text-orange-700', dot: 'bg-orange-600' };
        if (status === 'En Revisión') return { bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-600' };
        return { bg: 'bg-slate-100', text: 'text-slate-700', dot: 'bg-slate-500' }; // Pendiente
    }

    function renderTable() {
        tableBody.innerHTML = '';
        
        const searchTerm = searchInput.value.toLowerCase();
        
        const filtered = requests.filter(req => {
            if (searchTerm && !req.patient.toLowerCase().includes(searchTerm) && !req.patientId.toLowerCase().includes(searchTerm)) return false;
            
            if (currentFilter === 'Hoy') return req.isToday;
            if (currentFilter !== 'all' && req.status !== currentFilter) return false;
            
            return true;
        });

        filtered.forEach(req => {
            const badge = getBadgeConfig(req.status);
            const displayDate = formatDate(req.dateObj);
            const displayTime = getHourFormat(req.startHour);
            
            const tr = document.createElement('tr');
            tr.className = 'hover:bg-slate-50/80 transition-colors group slide-up';
            
            tr.innerHTML = `
                <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
                            <span class="material-symbols-outlined text-slate-400">person</span>
                        </div>
                        <div>
                            <p class="font-semibold text-slate-900">${req.patient}</p>
                            <p class="text-xs text-slate-500">ID: ${req.patientId}</p>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4">
                    <div class="flex items-center gap-2">
                        <div class="w-2 h-4 ${req.typeColor} rounded-full"></div>
                        <span class="text-slate-700 font-medium">${req.type}</span>
                    </div>
                </td>
                <td class="px-6 py-4 text-slate-600">
                    <div class="flex flex-col">
                        <span class="font-medium text-slate-900">${displayDate} ${req.isToday ? '<span class="text-[10px] bg-blue-100 text-blue-800 px-1.5 rounded ml-1">HOY</span>' : ''}</span>
                        <span class="text-xs">${displayTime}</span>
                    </div>
                </td>
                <td class="px-6 py-4">
                    <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${badge.bg} ${badge.text}">
                        <span class="w-1.5 h-1.5 rounded-full ${badge.dot}"></span>
                        ${req.status}
                    </span>
                </td>
                <td class="px-6 py-4 text-right">
                    <div class="flex items-center justify-end gap-2">
                        <button class="btn-approve px-3 py-1.5 text-xs font-bold text-white bg-primary rounded-lg hover:bg-primary-container transition-all" data-id="${req.id}">Aprobar</button>
                        <button class="btn-reschedule px-3 py-1.5 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-all" data-id="${req.id}">Reprogramar</button>
                        <button class="btn-reject p-1.5 text-slate-400 hover:text-error hover:bg-error-container/20 rounded-lg transition-all" title="Rechazar" data-id="${req.id}">
                            <span class="material-symbols-outlined text-lg pointer-events-none" data-icon="close">close</span>
                        </button>
                    </div>
                </td>
            `;
            
            tableBody.appendChild(tr);
        });

        if(filtered.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="5" class="px-6 py-8 text-center text-slate-500 font-medium">No hay solicitudes que coincidan con los filtros.</td></tr>`;
        }
        
        paginationCount.textContent = filtered.length;

        // Eventos
        document.querySelectorAll('.btn-approve').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.getAttribute('data-id'));
                handleApprove(id);
            });
        });

        document.querySelectorAll('.btn-reject').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.currentTarget.getAttribute('data-id'));
                handleReject(id);
            });
        });

        document.querySelectorAll('.btn-reschedule').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.getAttribute('data-id'));
                openRescheduleModal(id);
            });
        });
    }

    // --- ACCIONES CON VALIDACIÓN LOCALSTORAGE ---
    function handleApprove(id) {
        const req = requests.find(r => r.id === id);
        if(!req) return;

        // Leer Agenda
        let storedEvents = localStorage.getItem('agendaEvents');
        let agenda = [];
        if(storedEvents) {
            agenda = JSON.parse(storedEvents);
            agenda.forEach(ev => ev.date = new Date(ev.date));
        }

        // VALIDACIÓN DE CHOQUES: Verificar si ya hay alguna cita a esa hora y día exacto
        const conflict = agenda.find(ev => 
            ev.date.toDateString() === req.dateObj.toDateString() &&
            ev.startHour === req.startHour
        );

        if (conflict) {
            // ¡Hay choque!
            showToast(`Error: Conflicto de horario. Ya existe una cita a las ${getHourFormat(req.startHour)} en la agenda. Por favor, reprograma la solicitud.`, true);
            return;
        }

        // Si no hay choque, inyectar a la agenda
        let bgClass = "bg-primary-fixed border-primary-container";
        let textClass = "text-primary-container";
        let doctorClass = "text-primary-container";
        
        if (req.type === "Evaluación Inicial") { bgClass = "bg-secondary-container border-secondary"; textClass = "text-on-secondary-container"; doctorClass = "text-secondary"; }
        else if (req.type === "Revisión Diagnóstica") { bgClass = "bg-error-container border-error"; textClass = "text-on-error-container"; doctorClass = "text-error"; }

        agenda.push({
            id: Date.now(),
            patient: req.patient,
            type: req.type,
            room: "Sala 03", // Asignación automática por defecto
            doctor: "Dr. Asignado", // Asignación automática
            date: req.dateObj,
            startHour: req.startHour,
            duration: 1, 
            bgClass: bgClass,
            textClass: textClass,
            doctorClass: doctorClass
        });

        localStorage.setItem('agendaEvents', JSON.stringify(agenda));

        // Eliminar de solicitudes
        requests = requests.filter(r => r.id !== id);
        renderTable();
        showToast("¡Solicitud aprobada y enlazada a la agenda con éxito!");
    }

    function handleReject(id) {
        if(confirm("¿Estás seguro de que deseas rechazar esta solicitud? El paciente será notificado.")) {
            requests = requests.filter(r => r.id !== id);
            renderTable();
            showToast("Solicitud rechazada y eliminada de la bandeja.");
        }
    }

    function openRescheduleModal(id) {
        const req = requests.find(r => r.id === id);
        if(!req) return;
        
        currentRescheduleId = id;
        reschedulePatientName.textContent = `Paciente: ${req.patient} (${req.type})`;
        
        rescheduleModal.classList.remove('hidden');
        setTimeout(() => {
            rescheduleModal.classList.remove('opacity-0');
            rescheduleModal.querySelector('.pop-in-element').classList.remove('scale-95');
            rescheduleModal.querySelector('.pop-in-element').classList.add('scale-100');
        }, 10);
    }

    const hideRescheduleModal = () => {
        rescheduleModal.classList.add('opacity-0');
        rescheduleModal.querySelector('.pop-in-element').classList.remove('scale-100');
        rescheduleModal.querySelector('.pop-in-element').classList.add('scale-95');
        setTimeout(() => {
            rescheduleModal.classList.add('hidden');
            currentRescheduleId = null;
        }, 300);
    };

    btnCancelReschedule.addEventListener('click', hideRescheduleModal);
    
    btnConfirmReschedule.addEventListener('click', () => {
        const newDateVal = document.getElementById('rescheduleDate').value; // YYYY-MM-DD
        const newTimeVal = document.getElementById('rescheduleTime').value; // "08:00 AM"
        
        if(!newDateVal) {
            showToast("Por favor selecciona una nueva fecha.", true);
            return;
        }

        const reqIndex = requests.findIndex(r => r.id === currentRescheduleId);
        if(reqIndex !== -1) {
            
            // Convertir de YYYY-MM-DD a Date Object
            const parts = newDateVal.split('-');
            const d = new Date(parts[0], parts[1] - 1, parts[2]);
            
            // Convertir de "08:00 AM" a StartHour (Number)
            let parsedHour = parseInt(newTimeVal.substring(0, 2));
            if(newTimeVal.includes("PM") && parsedHour < 12) parsedHour += 12;
            if(newTimeVal.includes("AM") && parsedHour === 12) parsedHour = 0;

            requests[reqIndex].dateObj = d;
            requests[reqIndex].startHour = parsedHour;
            requests[reqIndex].status = "En Revisión"; 
            
            // Check if isToday
            requests[reqIndex].isToday = (d.toDateString() === today.toDateString());
            
            renderTable();
            hideRescheduleModal();
            showToast("Propuesta de reprogramación enviada al paciente.");
        }
    });

    // --- EVENTOS Y FILTROS ---
    searchInput.addEventListener('input', () => {
        renderTable();
    });

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => {
                b.classList.remove('bg-primary', 'text-white');
                b.classList.add('bg-white', 'text-slate-600', 'border-slate-200');
            });
            
            btn.classList.remove('bg-white', 'text-slate-600', 'border-slate-200');
            btn.classList.add('bg-primary', 'text-white');
            
            currentFilter = btn.getAttribute('data-filter');
            renderTable();
        });
    });

    // Botones estáticos
    if(btnHistory) {
        btnHistory.addEventListener('click', () => {
            showToast("Abriendo historial de solicitudes pasadas... (En desarrollo)");
        });
    }

    if(btnAdvancedFilters) {
        btnAdvancedFilters.addEventListener('click', () => {
            showToast("Panel de filtros avanzados no disponible en esta versión.");
        });
    }

    // --- TOAST NOTIFICATIONS ---
    function showToast(msg, isError = false) {
        let toast = document.getElementById('globalToast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'globalToast';
            document.body.appendChild(toast);
        }
        
        const bgColor = isError ? 'bg-error' : 'bg-slate-900';
        toast.className = `fixed bottom-6 right-6 ${bgColor} text-white px-6 py-3 rounded-lg shadow-xl z-[100] transform transition-all duration-300 translate-y-20 opacity-0 font-medium text-sm`;
        
        toast.textContent = msg;
        
        setTimeout(() => toast.classList.remove('translate-y-20', 'opacity-0'), 10);
        setTimeout(() => toast.classList.add('translate-y-20', 'opacity-0'), 4000);
    }

    // Init
    renderTable();
});
