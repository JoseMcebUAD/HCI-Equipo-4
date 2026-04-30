document.addEventListener('DOMContentLoaded', () => {
    // 1. Cargar datos del paciente seleccionado
    const patientData = localStorage.getItem('selectedPatient');
    if (!patientData) {
        window.location.href = 'pacientes.html';
        return;
    }

    const patient = JSON.parse(patientData);

    // 2. Inyectar datos básicos
    document.getElementById('patientName').textContent = patient.name;
    document.getElementById('patientService').textContent = patient.service;
    document.getElementById('patientId').textContent = patient.patientId;
    document.getElementById('patientEmail').textContent = patient.email;
    document.getElementById('patientLastVisit').textContent = patient.lastVisit;
    
    // Avatar
    const avatar = document.getElementById('patientAvatar');
    avatar.textContent = patient.initials;
    avatar.className = `w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold border border-slate-200 shadow-sm ${patient.colorClass}`;

    // 3. Configurar Insignia de Estado
    const badge = document.getElementById('statusBadge');
    badge.textContent = patient.status;
    
    // Colores según estado
    if (patient.status === 'Activo') {
        badge.className = 'px-3 py-1 bg-emerald-100 text-emerald-700 text-label-sm rounded-full font-bold uppercase tracking-wider';
    } else if (patient.status === 'En Espera') {
        badge.className = 'px-3 py-1 bg-amber-100 text-amber-700 text-label-sm rounded-full font-bold uppercase tracking-wider';
    } else {
        badge.className = 'px-3 py-1 bg-slate-200 text-slate-600 text-label-sm rounded-full font-bold uppercase tracking-wider';
    }

    // 4. Estadísticas y Datos Adicionales (FR-10)
    const sessions = (patient.id * 3) + 2; 
    const compliance = patient.status === 'Activo' ? 95 : (patient.status === 'Archivado' ? 80 : 0);
    
    document.getElementById('sessionsCount').textContent = sessions;
    document.getElementById('complianceText').textContent = `${compliance}%`;
    
    // Contacto y Expediente (FR-10)
    if (document.getElementById('patientPhone')) {
        document.getElementById('patientPhone').textContent = patient.phone || "No registrado";
    }
    if (document.getElementById('clinicalRecordRef')) {
        document.getElementById('clinicalRecordRef').textContent = `EXP-${patient.patientId.replace('#PT-', '')}`;
    }

    // 5. Historial de Últimas 5 Citas (FR-10)
    const historyBody = document.getElementById('appointmentHistoryBody');
    if (historyBody) {
        const historyData = [
            { date: '15 Oct, 2023', type: 'Psicoterapia', doctor: 'Dr. Martínez', status: 'Completada' },
            { date: '01 Oct, 2023', type: 'Evaluación', doctor: 'Dra. Smith', status: 'Completada' },
            { date: '15 Sep, 2023', type: 'Psicoterapia', doctor: 'Dr. Martínez', status: 'Completada' },
            { date: '01 Sep, 2023', type: 'Entrevista', doctor: 'Lic. Rios', status: 'Completada' },
            { date: '15 Ago, 2023', type: 'Psicoterapia', doctor: 'Dr. Martínez', status: 'Cancelada' }
        ];

        historyBody.innerHTML = historyData.map(h => `
            <tr class="hover:bg-slate-50/50 transition-colors">
                <td class="px-6 py-4 text-sm font-medium text-slate-700">${h.date}</td>
                <td class="px-6 py-4 text-sm text-slate-600">${h.type}</td>
                <td class="px-6 py-4 text-sm text-slate-600">${h.doctor}</td>
                <td class="px-6 py-4 text-sm">
                    <span class="px-2 py-1 ${h.status === 'Completada' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'} rounded-md text-[10px] font-bold uppercase">
                        ${h.status}
                    </span>
                </td>
            </tr>
        `).join('');
    }

    // 6. Animar barra de progreso
    const progressBar = document.getElementById('progressBar');
    if (progressBar) {
        setTimeout(() => {
            progressBar.style.width = `${compliance}%`;
        }, 300);
    }

    // 7. Descargas
    document.querySelectorAll('.btn-download').forEach(btn => {
        btn.addEventListener('click', () => {
            const docName = btn.getAttribute('data-name');
            showToast(`Iniciando descarga de: ${docName} - ${patient.name}...`);
        });
    });

    // Toast function
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
});
