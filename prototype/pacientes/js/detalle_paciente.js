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

    // 4. Estadísticas simuladas basadas en el paciente
    const sessions = (patient.id * 3) + 2; // Simulación
    const compliance = patient.status === 'Activo' ? 95 : (patient.status === 'Archivado' ? 80 : 0);
    
    document.getElementById('sessionsCount').textContent = sessions;
    document.getElementById('complianceText').textContent = `${compliance}%`;
    
    // Animar barra de progreso
    const progressBar = document.getElementById('progressBar');
    setTimeout(() => {
        progressBar.style.width = `${compliance}%`;
    }, 300);

    // 5. Descargas
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
