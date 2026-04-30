document.addEventListener('DOMContentLoaded', function() {
    // Tabs logic
    const tabReportes = document.getElementById('tabReportes');
    const tabConfiguracion = document.getElementById('tabConfiguracion');
    const reportesSection = document.getElementById('reportesSection');
    const configuracionSection = document.getElementById('configuracionSection');

    function activarPestana(pestana) {
        if (pestana === 'reportes') {
            tabReportes.className = "flex-1 py-3 rounded-xl text-sm font-bold transition-all bg-blue-50 text-blue-700 shadow-sm";
            tabConfiguracion.className = "flex-1 py-3 rounded-xl text-sm font-bold transition-all text-slate-500 hover:bg-slate-50";
            reportesSection.classList.remove('hidden');
            configuracionSection.classList.add('hidden');
        } else {
            tabConfiguracion.className = "flex-1 py-3 rounded-xl text-sm font-bold transition-all bg-blue-50 text-blue-700 shadow-sm";
            tabReportes.className = "flex-1 py-3 rounded-xl text-sm font-bold transition-all text-slate-500 hover:bg-slate-50";
            reportesSection.classList.add('hidden');
            configuracionSection.classList.remove('hidden');
        }
    }

    tabReportes.addEventListener('click', () => activarPestana('reportes'));
    tabConfiguracion.addEventListener('click', () => activarPestana('configuracion'));

    /* REPORTES */
    const formReporte = document.getElementById('formReporte');
    const reporteResultado = document.getElementById('reporteResultado');

    formReporte.addEventListener('submit', function(e) {
        e.preventDefault();
        const btn = formReporte.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;
        
        btn.innerHTML = '<span class="material-symbols-outlined animate-spin">sync</span> Generando...';
        btn.disabled = true;

        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.disabled = false;
            reporteResultado.classList.remove('hidden');
            showToast("Reporte generado y descargado (simulado)");
        }, 2000);
    });

    /* CONFIGURACIÓN */
    const formConfiguracion = document.getElementById('formConfiguracion');

    function cargarConfiguracion() {
        const config = JSON.parse(localStorage.getItem('configSistema') || '{"notificaciones":"habilitado","tiempoEspera":15,"maxReprogramaciones":3}');
        document.getElementById('notificaciones').value = config.notificaciones;
        document.getElementById('tiempoEspera').value = config.tiempoEspera;
        document.getElementById('maxReprogramaciones').value = config.maxReprogramaciones;
    }

    formConfiguracion.addEventListener('submit', function(e) {
        e.preventDefault();
        const config = {
            notificaciones: document.getElementById('notificaciones').value,
            tiempoEspera: document.getElementById('tiempoEspera').value,
            maxReprogramaciones: document.getElementById('maxReprogramaciones').value
        };
        localStorage.setItem('configSistema', JSON.stringify(config));
        showToast("Configuración guardada correctamente");
    });

    function showToast(msg) {
        let toast = document.getElementById("globalToast");
        if(!toast) {
            toast = document.createElement("div");
            toast.id = "globalToast";
            toast.className = "fixed bottom-6 right-6 bg-slate-900 text-white px-6 py-3 rounded-xl shadow-xl z-[200] transform translate-y-20 opacity-0 transition-all duration-300 font-medium text-sm";
            document.body.appendChild(toast);
        }
        toast.textContent = msg;
        toast.classList.remove("translate-y-20", "opacity-0");
        setTimeout(() => toast.classList.add("translate-y-20", "opacity-0"), 3000);
    }

    cargarConfiguracion();
});
