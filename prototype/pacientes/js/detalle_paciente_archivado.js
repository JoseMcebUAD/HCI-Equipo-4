document.addEventListener('DOMContentLoaded', function() {
    // Obtener ID de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const patientId = parseInt(urlParams.get('id'));

    let paciente = null;
    if (window.DB && patientId) {
      paciente = DB.pacientes.getById(patientId);
    }

    if (!paciente) {
      paciente = { nombre: "Ana García", celular: "55 5555 5555", email: "ana@example.com", servicio: "psicodiagnostico", terapeuta: "Dr. Luis Hernández", fechaRegistro: "2024-02-01", estado: "archivado" };
    }

    // Botón de volver
    const volverBtn = document.getElementById('volver-lista');

    // Poblar datos
    document.querySelector('.patient-header h2').textContent = `${paciente.nombre} - ${paciente.servicio ? (paciente.servicio.charAt(0).toUpperCase() + paciente.servicio.slice(1)) : 'Sin tipo'}`;
    const infoValues = document.querySelectorAll('.info-value');
    if (infoValues.length >= 5) {
      infoValues[0].textContent = paciente.celular || "---";
      infoValues[1].textContent = paciente.email || "---";
      infoValues[2].textContent = paciente.servicio || "---";
      infoValues[3].textContent = paciente.terapeuta || "---";
      infoValues[4].textContent = paciente.fechaRegistro || "---";
    }

    volverBtn.addEventListener('click', function() {
      window.location.href = 'pacientes.html';
    });
  
    // Lógica para abrir documentos
    document.querySelectorAll('.document-item').forEach(item => {
      item.addEventListener('click', function(e) {
        e.preventDefault();
        alert(`Abriendo: ${this.textContent}`);
      });
    });
  });