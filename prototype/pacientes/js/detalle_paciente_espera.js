document.addEventListener('DOMContentLoaded', function() {
    // Obtener ID de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const patientId = parseInt(urlParams.get('id'));

    let paciente = null;
    if (window.DB && patientId) {
      paciente = DB.pacientes.getById(patientId);
    }

    if (!paciente) {
      paciente = { nombre: "Carlos Ruiz", celular: "55 8765 4321", email: "carlos@example.com", fechaRegistro: "2024-04-10", estado: "espera" };
    }

    // Botones de acción
    const volverBtn = document.getElementById('volver-lista');
    const iniciarBtn = document.getElementById('iniciar-expediente');

    // Poblar datos
    document.querySelector('.patient-header h2').textContent = `${paciente.nombre} - Sin tipo`;
    const infoValues = document.querySelectorAll('.info-value');
    if (infoValues.length >= 4) {
      infoValues[0].textContent = paciente.celular || "---";
      infoValues[1].textContent = paciente.email || "---";
      infoValues[2].textContent = paciente.terapeuta || "Por asignar";
      infoValues[3].textContent = paciente.fechaRegistro || "---";
    }
  
    volverBtn.addEventListener('click', function() {
      window.location.href = 'pacientes.html';
    });
  
    iniciarBtn.addEventListener('click', function() {
      if(confirm('¿Estás seguro que deseas inicializar este expediente? El paciente pasará a estado "Activo"')) {
        if (window.DB && patientId) {
          DB.pacientes.update(patientId, { estado: 'activo', servicio: 'psicoterapia' });
        }
        alert('El expediente ha sido inicializado correctamente');
        window.location.href = 'pacientes.html';
      }
    });
  });