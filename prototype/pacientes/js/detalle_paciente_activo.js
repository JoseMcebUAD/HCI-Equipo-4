document.addEventListener("DOMContentLoaded", function () {
  // Obtener ID de la URL
  const urlParams = new URLSearchParams(window.location.search);
  const patientId = parseInt(urlParams.get('id'));

  let paciente = null;
  if (window.DB && patientId) {
    paciente = DB.pacientes.getById(patientId);
  }

  // Fallback if not found
  if (!paciente) {
    paciente = {
      id: "demo",
      nombre: "María López",
      celular: "55 1234 5678",
      email: "maria.lopez@example.com",
      servicio: "psicoterapia",
      terapeuta: "Terapeuta A",
      fechaRegistro: "2024-03-15",
      proximaSesion: "2024-04-25T16:00",
      estado: "activo",
    };
  }

  // =============================================
  // ELEMENTOS DEL DOM
  // =============================================
  const volverBtn = document.getElementById("volver-lista");
  const cerrarBtn = document.getElementById("cerrar-expediente");
  const documentosItems = document.querySelectorAll(".document-item");
  const editarInfoBtn = document.getElementById("editar-info");
  const guardarInfoBtn = document.getElementById("guardar-info");
  const cancelarEdicionBtn = document.getElementById("cancelar-edicion");
  const infoForm = document.getElementById("info-form");
  const inputsInfo = infoForm.querySelectorAll("input, select");
  const formActions = infoForm.querySelector(".form-actions");
  
  // No hay un ID 'nombre-paciente' en el HTML, pero hay un h2 en patient-header
  const patientHeaderH2 = document.querySelector(".patient-header h2");

  let datosOriginales = {};

  const handleVolver = () => {
    window.location.href = "pacientes.html";
  };

  const handleArchivar = () => {
    if (confirm('¿Estás seguro que deseas archivar este expediente? El paciente pasará a estado "Archivado"')) {
      if (window.DB && patientId) {
        DB.pacientes.update(patientId, { estado: "archivado" });
      }
      alert("Expediente archivado correctamente");
      window.location.href = "pacientes.html";
    }
  };

  const handleEditarInfo = () => {
    datosOriginales = {};
    inputsInfo.forEach((input) => {
      datosOriginales[input.name] = input.value;
      input.disabled = false;
    });
    formActions.style.display = "flex";
    editarInfoBtn.style.display = "none";
  };

  const handleGuardarInfo = () => {
    if (confirm("¿Guardar los cambios realizados?")) {
      const updateData = {
        celular: document.querySelector('[name="celular"]').value,
        email: document.querySelector('[name="email"]').value,
        servicio: document.querySelector('[name="servicio"]').value,
        terapeuta: document.querySelector('[name="terapeuta"]').value,
        fechaRegistro: document.querySelector('[name="fecha_registro"]').value,
        proximaSesion: document.querySelector('[name="proxima_sesion"]').value
      };

      if (window.DB && patientId) {
        paciente = DB.pacientes.update(patientId, updateData);
      } else {
        Object.assign(paciente, updateData);
      }

      alert("Cambios guardados correctamente");
      
      inputsInfo.forEach((input) => input.disabled = true);
      formActions.style.display = "none";
      editarInfoBtn.style.display = "block";
      actualizarUI();
    }
  };

  const handleCancelarEdicion = () => {
    for (const [name, value] of Object.entries(datosOriginales)) {
      const input = infoForm.querySelector(`[name="${name}"]`);
      if (input) input.value = value;
    }
    inputsInfo.forEach((input) => input.disabled = true);
    formActions.style.display = "none";
    editarInfoBtn.style.display = "block";
  };

  const actualizarUI = () => {
    if (patientHeaderH2) {
      patientHeaderH2.textContent = `${paciente.nombre} - ${paciente.servicio ? (paciente.servicio.charAt(0).toUpperCase() + paciente.servicio.slice(1)) : 'Sin tipo'}`;
    }
    
    document.querySelector('[name="celular"]').value = paciente.celular || "";
    document.querySelector('[name="email"]').value = paciente.email || "";
    document.querySelector('[name="servicio"]').value = paciente.servicio || "psicoterapia";
    
    // Poblar select de terapeutas si es necesario
    if (window.DB) {
      const selTher = document.querySelector('[name="terapeuta"]');
      const allTher = DB.terapeutas.getAll();
      selTher.innerHTML = allTher.map(t => `<option value="${t.nombre}" ${t.nombre === paciente.terapeuta ? 'selected' : ''}>${t.nombre}</option>`).join('');
    }

    document.querySelector('[name="fecha_registro"]').value = paciente.fechaRegistro || "";
    document.querySelector('[name="proxima_sesion"]').value = paciente.proximaSesion || "";
  };

  volverBtn.addEventListener("click", handleVolver);
  cerrarBtn.addEventListener("click", handleArchivar);
  editarInfoBtn.addEventListener("click", handleEditarInfo);
  guardarInfoBtn.addEventListener("click", handleGuardarInfo);
  cancelarEdicionBtn.addEventListener("click", handleCancelarEdicion);

  actualizarUI();
});
