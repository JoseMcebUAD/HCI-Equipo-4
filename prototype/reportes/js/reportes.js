document.addEventListener('DOMContentLoaded', function() {
  // Elementos para el menú de pestañas
  const tabReportes = document.getElementById('tabReportes');
  const tabConfiguracion = document.getElementById('tabConfiguracion');
  const reportesSection = document.getElementById('reportesSection');
  const configuracionSection = document.getElementById('configuracionSection');

  // Función para cambiar de pestaña
  function activarPestana(pestana) {
    if (pestana === 'reportes') {
      tabReportes.classList.add('active');
      tabConfiguracion.classList.remove('active');
      reportesSection.style.display = 'block';
      configuracionSection.style.display = 'none';
    } else if (pestana === 'configuracion') {
      tabReportes.classList.remove('active');
      tabConfiguracion.classList.add('active');
      reportesSection.style.display = 'none';
      configuracionSection.style.display = 'block';
    }
  }

  // Eventos para cambiar pestañas
  tabReportes.addEventListener('click', () => activarPestana('reportes'));
  tabConfiguracion.addEventListener('click', () => activarPestana('configuracion'));

  /* REPORTES */

  const formReporte = document.getElementById('formReporte');
  const reporteResultado = document.getElementById('reporteResultado');

  formReporte.addEventListener('submit', function(e) {
    e.preventDefault();
    if (!window.DB) return;

    const fechaInicio = document.getElementById('fechaInicio').value;
    const fechaFin = document.getElementById('fechaFin').value;
    const filtroReporte = document.getElementById('filtroServicio').value; // 'psicodiagnostico'=Economico, 'terapia'=Citas

    const allEvents = DB.eventos.getAll();
    
    // Filtrar por fecha
    const filteredEvents = allEvents.filter(ev => {
        if (!ev.fecha) return false;
        // Normalizar fecha del evento (asumimos YYYY-MM-DD o DD/MM/YYYY)
        // Por ahora filtro simple si el evento tiene fecha
        const evDate = ev.fecha.includes('/') ? ev.fecha.split('/').reverse().join('-') : ev.fecha;
        if (fechaInicio && evDate < fechaInicio) return false;
        if (fechaFin && evDate > fechaFin) return false;
        return true;
    });

    // Agrupar por paciente
    const stats = {};
    filteredEvents.forEach(ev => {
        if (!stats[ev.paciente]) {
            stats[ev.paciente] = { citas: 0, costo: 0 };
        }
        stats[ev.paciente].citas++;
        stats[ev.paciente].costo += 500; // Costo base simulado
    });

    // Renderizar resultados
    let html = `<h3>Resultados (${filteredEvents.length} citas encontradas)</h3>`;
    html += `<table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Paciente</th>
                      <th>Citas</th>
                      ${filtroReporte === 'psicodiagnostico' ? '<th>Ingreso Estimado</th>' : ''}
                    </tr>
                  </thead>
                  <tbody>`;
    
    Object.keys(stats).forEach((nombre, index) => {
      html += `<tr>
                 <td>${index + 1}</td>
                 <td>${nombre}</td>
                 <td>${stats[nombre].citas}</td>
                 ${filtroReporte === 'psicodiagnostico' ? `<td>$${stats[nombre].costo}</td>` : ''}
               </tr>`;
    });
    html += `</tbody></table>`;
    reporteResultado.innerHTML = html;
  });

  /* CONFIGURACIÓN */

  const formConfiguracion = document.getElementById('formConfiguracion');
  const configResultado = document.getElementById('configResultado');
  const btnResetDB = document.getElementById('btnResetDB');

  function cargarConfiguracion() {
    if (!window.DB) return;
    const config = DB.config.get();
    if (config) {
      document.getElementById('notificaciones').value = config.notificaciones || 'habilitado';
      document.getElementById('tiempoEspera').value = config.tiempoEspera || 15;
      document.getElementById('maxReprogramaciones').value = config.maxReprogramaciones || 3;
    }
  }

  formConfiguracion.addEventListener('submit', function(e) {
    e.preventDefault();
    const notificaciones = document.getElementById('notificaciones').value;
    const tiempoEspera = parseInt(document.getElementById('tiempoEspera').value);
    const maxReprogramaciones = parseInt(document.getElementById('maxReprogramaciones').value);

    if (window.DB) {
        DB.config.set({ notificaciones, tiempoEspera, maxReprogramaciones });
    }

    configResultado.textContent = 'Configuración guardada correctamente.';
    setTimeout(() => {
      configResultado.textContent = '';
    }, 3000);
  });

  btnResetDB.addEventListener('click', () => {
    if (confirm('¿ESTÁS SEGURO? Se borrarán todos los datos y se restablecerán los valores de fábrica.')) {
        localStorage.clear();
        alert('Base de datos restablecida. La página se recargará.');
        location.reload();
    }
  });

  // Inicializar
  cargarConfiguracion();
});
