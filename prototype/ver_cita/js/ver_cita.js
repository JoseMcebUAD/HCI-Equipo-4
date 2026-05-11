document.addEventListener("DOMContentLoaded", () => {
  // Elementos del DOM
  const searchForm = document.getElementById("searchForm");
  const appointmentInfo = document.getElementById("appointmentInfo");
  const reprogramSection = document.getElementById("reprogramSection");
  const reprogramStatus = document.getElementById("reprogramStatus");
  const requestReprogramBtn = document.getElementById("requestReprogramBtn");
  const cancelReprogramBtn = document.getElementById("cancelReprogramBtn");
  const reprogramForm = document.getElementById("reprogramForm");

  let currentAppointment = null;

  // Buscar cita
  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!window.DB) return;

    const nameInput = document.getElementById("searchName").value.toLowerCase();
    const contactInput = document.getElementById("searchContact").value.toLowerCase();

    // Buscar en DB.eventos
    // Nota: El modelo de datos de eventos tiene 'paciente' (nombre)
    // Para simplificar, buscaremos por nombre del paciente
    const allEvents = DB.eventos.getAll();
    const appointment = allEvents.find(ev => 
        ev.paciente.toLowerCase().includes(nameInput)
    );

    if (appointment) {
      currentAppointment = appointment;
      
      // Mostrar información de la cita
      document.getElementById("appointmentDate").textContent = formatDate(appointment.fecha);
      document.getElementById("appointmentTime").textContent = appointment.hora;
      document.getElementById("appointmentSpecialist").textContent = appointment.terapeuta || "Asignado por clínica";
      document.getElementById("appointmentLocation").textContent = appointment.sala || "Consultorio central";

      appointmentInfo.classList.remove("hidden");

      // Verificar si hay solicitudes de reprogramación en el inbox relacionadas con este paciente
      const allInbox = DB.inbox.getAll();
      const existingRequest = allInbox.find(item => 
        item.tipo === 'reprogramar' && 
        item.paciente === appointment.paciente &&
        item.estado === 'pendiente'
      );

      if (existingRequest) {
        showReprogramStatus({
          status: existingRequest.estado,
          reason: existingRequest.notas.split(':')[0] || 'Conflicto',
          details: existingRequest.notas,
          requestDate: existingRequest.fechaCreacion.split('T')[0]
        });
      } else {
        reprogramStatus.classList.add("hidden");
      }
    } else {
      alert("No se encontró ninguna cita con los datos proporcionados");
      appointmentInfo.classList.add("hidden");
      reprogramStatus.classList.add("hidden");
    }
  });

  // Solicitar reprogramación
  requestReprogramBtn.addEventListener("click", () => {
    appointmentInfo.classList.add("hidden");
    reprogramSection.classList.remove("hidden");
  });

  // Cancelar reprogramación
  cancelReprogramBtn.addEventListener("click", () => {
    reprogramSection.classList.add("hidden");
    appointmentInfo.classList.remove("hidden");
  });

  // Enviar solicitud de reprogramación
  reprogramForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const reasonSelect = document.getElementById("reprogramReason");
    const reasonText = reasonSelect.options[reasonSelect.selectedIndex].text;
    const details = document.getElementById("reprogramDetails").value;

    const requestData = {
      status: "pending",
      reason: reasonText,
      details: details,
      requestDate: new Date().toISOString().split("T")[0],
      adminResponse: "",
    };

    // Guardar en DB.inbox para que el admin lo vea
    if (window.DB && currentAppointment) {
        DB.inbox.add({
            id: 'reprog-' + Date.now().toString(36),
            tipo: 'reprogramar',
            estado: 'pendiente',
            fechaCreacion: new Date().toISOString(),
            paciente: currentAppointment.paciente,
            notas: `${reasonText}: ${details}`,
            eventoId: currentAppointment.id
        });
    }

    // Mostrar estado de la solicitud
    showReprogramStatus(requestData);

    // Limpiar formulario
    reprogramForm.reset();
    reprogramSection.classList.add("hidden");
  });

  function showReprogramStatus(request) {
    document.getElementById("requestDate").textContent = formatDate(request.requestDate);
    document.getElementById("requestedReason").textContent = request.reason;
    document.getElementById("requestedDetails").textContent = request.details;

    const statusMap = {
        'pending': 'En revisión',
        'pendiente': 'En revisión',
        'approved': 'Aprobada',
        'aprobada': 'Aprobada',
        'rejected': 'Rechazada',
        'rechazada': 'Rechazada'
    };

    const statusText = statusMap[request.status] || request.status;
    document.getElementById("requestStatus").textContent = statusText;

    let statusClass = "status-pending";
    if (statusText === 'Aprobada') statusClass = "status-approved";
    if (statusText === 'Rechazada') statusClass = "status-rejected";
    
    document.getElementById("requestStatus").className = statusClass;

    if (request.adminResponse) {
      document.getElementById("adminResponse").textContent = request.adminResponse;
      document.getElementById("responseMessage").classList.remove("hidden");
    } else {
      document.getElementById("responseMessage").classList.add("hidden");
    }

    reprogramStatus.classList.remove("hidden");
  }

  function formatDate(dateString) {
    if (!dateString) return "No definida";
    // Si viene en formato DD/MM/YYYY o similar, intentar convertir
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    try {
        return new Date(dateString).toLocaleDateString("es-ES", options);
    } catch(e) {
        return dateString;
    }
  }
});
