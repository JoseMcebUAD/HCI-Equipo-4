document.addEventListener('DOMContentLoaded', () => {
    // --- DATOS SIMULADOS ---
    const today = new Date();
    const currentYear = today.getFullYear();

    let patients = [
        {
            id: 1,
            name: "María López",
            email: "maria.lopez@email.com",
            patientId: "#PT-5521",
            lastVisit: `20 Oct, ${currentYear}`,
            service: "Psicoterapia",
            status: "Activo",
            initials: "ML",
            colorClass: "bg-primary/10 text-primary"
        },
        {
            id: 2,
            name: "Carlos Ruiz",
            email: "c.ruiz@email.com",
            patientId: "#PT-3342",
            lastVisit: `15 Oct, ${currentYear}`,
            service: "Ninguno",
            status: "En Espera",
            initials: "CR",
            colorClass: "bg-secondary/10 text-secondary"
        },
        {
            id: 3,
            name: "Ana García",
            email: "agarcia88@email.com",
            patientId: "#PT-8890",
            lastVisit: `12 Sep, ${currentYear}`,
            service: "Psicodiagnóstico",
            status: "Archivado",
            initials: "AG",
            colorClass: "bg-slate-100 text-slate-500"
        },
        {
            id: 4,
            name: "Roberto Gómez",
            email: "rgomez@email.com",
            patientId: "#PT-1224",
            lastVisit: `05 Nov, ${currentYear}`,
            service: "Terapia de Pareja",
            status: "Activo",
            initials: "RG",
            colorClass: "bg-primary/10 text-primary"
        }
    ];

    // --- ELEMENTOS DOM ---
    const tableBody = document.getElementById('patientsTableBody');
    const searchInput = document.getElementById('searchInput');
    const statusButtons = document.querySelectorAll('.status-btn');
    const serviceSelect = document.getElementById('serviceSelect');
    const paginationCount = document.getElementById('paginationCount');
    const statActive = document.getElementById('statActive');
    const statSessions = document.getElementById('statSessions');

    let currentStatusFilter = 'all';

    // --- RENDERIZADO ---
    function renderPatients() {
        tableBody.innerHTML = '';
        
        const searchTerm = searchInput.value.toLowerCase();
        const selectedService = serviceSelect.value;

        const filtered = patients.filter(p => {
            // Filtro de búsqueda
            const matchesSearch = p.name.toLowerCase().includes(searchTerm) || 
                                 p.patientId.toLowerCase().includes(searchTerm) ||
                                 p.email.toLowerCase().includes(searchTerm);
            
            // Filtro de estado
            const matchesStatus = currentStatusFilter === 'all' || p.status === currentStatusFilter;
            
            // Filtro de servicio
            const matchesService = selectedService === 'all' || p.service === selectedService;

            return matchesSearch && matchesStatus && matchesService;
        });

        filtered.forEach(p => {
            const tr = document.createElement('tr');
            tr.className = 'hover:bg-slate-50 transition-colors slide-up';
            
            const statusConfig = getStatusConfig(p.status);

            tr.innerHTML = `
                <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-full ${p.colorClass} flex items-center justify-center font-bold">
                            ${p.initials}
                        </div>
                        <div>
                            <p class="font-semibold text-blue-900">${p.name}</p>
                            <p class="text-xs text-slate-500">${p.email}</p>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4">
                    <span class="text-slate-600 font-mono text-sm">${p.patientId}</span>
                </td>
                <td class="px-6 py-4">
                    <div class="flex items-center gap-2">
                        <span class="material-symbols-outlined text-slate-400 text-lg">event</span>
                        <span class="text-slate-700 text-sm">${p.lastVisit}</span>
                    </div>
                </td>
                <td class="px-6 py-4">
                    ${p.service !== 'Ninguno' ? 
                        `<span class="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium border border-blue-100">${p.service}</span>` :
                        `<span class="text-slate-400 italic text-sm">Ninguno</span>`
                    }
                </td>
                <td class="px-6 py-4">
                    <span class="flex items-center gap-1.5 text-sm font-medium ${statusConfig.textClass}">
                        <span class="w-2 h-2 ${statusConfig.bgClass} rounded-full"></span>
                        ${p.status}
                    </span>
                </td>
                <td class="px-6 py-4 text-right">
                    <div class="flex justify-end gap-2">
                        <button class="p-2 text-slate-400 hover:text-primary transition-colors action-view" title="Ver Perfil" data-id="${p.id}">
                            <span class="material-symbols-outlined">visibility</span>
                        </button>
                        <button class="p-2 text-slate-400 hover:text-primary transition-colors action-edit" title="Editar" data-id="${p.id}">
                            <span class="material-symbols-outlined">edit</span>
                        </button>
                    </div>
                </td>
            `;
            tableBody.appendChild(tr);
        });

        // Actualizar contadores
        paginationCount.textContent = filtered.length;
        updateStats();
        
        // Re-enlazar eventos de botones de acción
        attachActionEvents();
    }

    function getStatusConfig(status) {
        switch(status) {
            case 'Activo': return { textClass: 'text-emerald-600', bgClass: 'bg-emerald-500' };
            case 'En Espera': return { textClass: 'text-amber-600', bgClass: 'bg-amber-500' };
            case 'Archivado': return { textClass: 'text-slate-500', bgClass: 'bg-slate-400' };
            default: return { textClass: 'text-slate-500', bgClass: 'bg-slate-400' };
        }
    }

    function updateStats() {
        const activeCount = patients.filter(p => p.status === 'Activo').length;
        statActive.textContent = activeCount;
        statSessions.textContent = activeCount * 2; // Simulación
    }

    function attachActionEvents() {
        document.querySelectorAll('.action-view').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                const patient = patients.find(p => p.id == id);
                if (patient) {
                    localStorage.setItem('selectedPatient', JSON.stringify(patient));
                    window.location.href = 'detalle_paciente.html';
                }
            });
        });
        document.querySelectorAll('.action-edit').forEach(btn => {
            btn.addEventListener('click', () => {
                showToast("Abriendo editor de información del paciente...");
            });
        });
    }

    // --- EVENTOS ---
    searchInput.addEventListener('input', renderPatients);
    serviceSelect.addEventListener('change', renderPatients);

    statusButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // UI Update
            statusButtons.forEach(b => {
                b.classList.remove('bg-primary-fixed', 'text-on-primary-fixed-variant');
                b.classList.add('bg-slate-100', 'text-slate-600');
            });
            btn.classList.remove('bg-slate-100', 'text-slate-600');
            btn.classList.add('bg-primary-fixed', 'text-on-primary-fixed-variant');

            currentStatusFilter = btn.getAttribute('data-filter');
            renderPatients();
        });
    });

    // --- NOTIFICACIONES (TOAST) ---
    function showToast(msg) {
        let toast = document.getElementById('globalToast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'globalToast';
            toast.className = 'fixed bottom-6 right-6 bg-slate-900 text-white px-6 py-3 rounded-lg shadow-xl z-[100] transform transition-all duration-300 translate-y-20 opacity-0 font-medium text-sm';
            document.body.appendChild(toast);
        }
        toast.textContent = msg;
        
        setTimeout(() => toast.classList.remove('translate-y-20', 'opacity-0'), 10);
        setTimeout(() => toast.classList.add('translate-y-20', 'opacity-0'), 3000);
    }

    // --- INICIALIZACIÓN ---
    renderPatients();
});