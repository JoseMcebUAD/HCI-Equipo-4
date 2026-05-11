document.addEventListener('DOMContentLoaded', function() {
  // Elementos del DOM
  const buscarNombreInput = document.getElementById('buscar-nombre');
  const tipoServicioSelect = document.getElementById('tipo-servicio');
  const estadoRadios = document.querySelectorAll('input[name="estado"]');
  const patientListContainer = document.getElementById('patientList');

  // Función para renderizar pacientes
  function renderPacientes() {
    if (!window.DB) return;

    const allPacientes = DB.pacientes.getAll();
    const nombreFiltro = buscarNombreInput.value.toLowerCase();
    const servicioFiltro = tipoServicioSelect.value;
    const estadoFiltro = document.querySelector('input[name="estado"]:checked').value;

    patientListContainer.innerHTML = "";

    allPacientes.forEach(p => {
      const nombreCoincide = p.nombre.toLowerCase().includes(nombreFiltro);
      const servicioCoincide = servicioFiltro === '' || p.servicio === servicioFiltro;
      const estadoCoincide = estadoFiltro === 'todos' || p.estado === estadoFiltro;

      if (nombreCoincide && servicioCoincide && estadoCoincide) {
        // Determinar qué página de detalle usar
        let detailPage = "detalle_paciente_activo.html";
        if (p.estado === "espera") detailPage = "detalle_paciente_espera.html";
        if (p.estado === "archivado") detailPage = "detalle_paciente_archivado.html";

        const item = document.createElement("a");
        item.href = `${detailPage}?id=${p.id}`;
        item.className = "patient-item";
        item.setAttribute("data-estado", p.estado);
        item.setAttribute("data-servicio", p.servicio || "");
        
        item.innerHTML = `
            <span>${p.nombre} - ${p.servicio ? (p.servicio.charAt(0).toUpperCase() + p.servicio.slice(1)) : 'Sin tipo'}</span>
            <span class="patient-status ${p.estado}">${p.estado.charAt(0).toUpperCase() + p.estado.slice(1)}</span>
        `;

        patientListContainer.appendChild(item);
      }
    });
  }

  // Event listeners para los filtros
  buscarNombreInput.addEventListener('input', renderPacientes);
  tipoServicioSelect.addEventListener('change', renderPacientes);
  estadoRadios.forEach(radio => {
    radio.addEventListener('change', renderPacientes);
  });

  // Inicialización
  renderPacientes();
});