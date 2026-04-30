document.addEventListener("DOMContentLoaded", () => {
  // Elementos del DOM
  const searchForm = document.getElementById("searchForm");
  const appointmentInfo = document.getElementById("appointmentInfo");
  const reprogramSection = document.getElementById("reprogramSection");
  const reprogramStatus = document.getElementById("reprogramStatus");
  const requestReprogramBtn = document.getElementById("requestReprogramBtn");
  const cancelReprogramBtn = document.getElementById("cancelReprogramBtn");
  const reprogramForm = document.getElementById("reprogramForm");

  // Datos de ejemplo (simulando una base de datos)
  const sampleAppointments = [
    {
      name: "Juan Pérez López",
      tutor: "María García Méndez",
      email: "juan.perez@example.com",
      phone: "5551234567",
      date: "2023-12-15",
      time: "10:00",
      specialist: "Dra. Ana Rodríguez",
      location: "Consultorio 3, Piso 2",
      reprogramRequest: null,
    },
    {
      name: "Pedro Martínez",
      tutor: null,
      email: "pedro.martinez@example.com",
      phone: "5557654321",
      date: "2023-12-20",
      time: "16:30",
      specialist: "Dr. Carlos Sánchez",
      location: "Consultorio 5, Piso 1",
      reprogramRequest: {
        status: "pending",
        reason: "emergency",
        details: "Necesito viajar por emergencia familiar",
        requestDate: "2023-12-19",
        adminResponse:
          "Hemos recibido su solicitud. Le contactaremos dentro de 24 horas para asignarle una nueva fecha.",
      },
    },
  ];

  // Buscar cita
  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("searchName").value.toLowerCase();
    const contact = document
      .getElementById("searchContact")
      .value.toLowerCase();

    // Buscar en los datos de ejemplo
    const appointment = sampleAppointments.find(
      (app) =>
        (app.name.toLowerCase().includes(name) ||
          (app.tutor && app.tutor.toLowerCase().includes(name))) &&
        (app.email.toLowerCase().includes(contact) ||
          app.phone.includes(contact))
    );

    if (appointment) {
      // Mostrar información de la cita
      document.getElementById("appointmentDate").textContent = formatDate(
        appointment.date
      );
      document.getElementById("appointmentTime").textContent = appointment.time;
      document.getElementById("appointmentSpecialist").textContent =
        appointment.specialist;
      document.getElementById("appointmentLocation").textContent =
        appointment.location;

      appointmentInfo.classList.remove("hidden");

      // Mostrar estado de reprogramación si existe
      if (appointment.reprogramRequest) {
        showReprogramStatus(appointment.reprogramRequest);
      } else {
        reprogramStatus.classList.add("hidden");
      }
    } else {
      // RNF-US-04: Mensaje claro y específico
      showToast("No se encontró ninguna cita con esos datos. Por favor, verifica que tu nombre y contacto coincidan con lo registrado al agendar.", true);
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
    const details = document.getElementById("reprogramDetails").value.trim();

    if (!details) {
        showToast("Por favor, explica brevemente el motivo de tu solicitud para que el administrador pueda procesarla mejor.", true);
        return;
    }

    // RNF-US-07: Resumen preventivo antes de confirmar
    if (!confirm(`¿Confirmas el envío de tu solicitud de reprogramación?\n\nMotivo: ${reasonText}\nDetalles: ${details}\n\nUn administrador revisará tu caso y te contactará.`)) {
        return;
    }

    // Crear objeto de solicitud
    const requestData = {
      status: "pending",
      reason: reasonText,
      details: details,
      requestDate: new Date().toISOString().split("T")[0], // Fecha actual
      adminResponse: "",
    };

    // Simular registro persistente
    const reprogramRequests = JSON.parse(localStorage.getItem('reprogramRequests') || '[]');
    reprogramRequests.push({ ...requestData, patientName: document.getElementById("searchName").value });
    localStorage.setItem('reprogramRequests', JSON.stringify(reprogramRequests));

    // Mostrar estado de la solicitud
    showReprogramStatus(requestData);

    // Limpiar formulario
    reprogramForm.reset();
    reprogramSection.classList.add("hidden");
    showToast("Tu solicitud de reprogramación ha sido enviada. Te contactaremos pronto.");
  });

  function showToast(msg, isError = false) {
    let toast = document.getElementById("globalToast");
    if(!toast) {
        toast = document.createElement("div");
        toast.id = "globalToast";
        toast.className = "fixed bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-xl shadow-2xl z-[200] transform translate-y-20 opacity-0 transition-all duration-300 font-medium text-sm text-center min-w-[300px]";
        document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.className = `fixed bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-xl shadow-2xl z-[200] transform translate-y-20 opacity-0 transition-all duration-300 font-medium text-sm text-center min-w-[300px] ${isError ? 'bg-red-600 text-white' : 'bg-slate-900 text-white'}`;
    toast.classList.remove("translate-y-20", "opacity-0");
    setTimeout(() => toast.classList.add("translate-y-20", "opacity-0"), 4000);
  }

  // Función para mostrar el estado de reprogramación
  function showReprogramStatus(request) {
    // Mostrar fecha de solicitud
    document.getElementById("requestDate").textContent = formatDate(
      request.requestDate
    );

    // Mostrar motivo y detalles
    document.getElementById("requestedReason").textContent = request.reason;
    document.getElementById("requestedDetails").textContent = request.details;

    // Mostrar estado
    document.getElementById("requestStatus").textContent =
      request.status === "pending"
        ? "En revisión"
        : request.status === "approved"
        ? "Aprobada"
        : "Rechazada";

    document.getElementById("requestStatus").className =
      request.status === "pending"
        ? "status-pending"
        : request.status === "approved"
        ? "status-approved"
        : "status-rejected";

    // Mostrar respuesta del administrador si existe
    if (request.adminResponse || request.status !== "pending") {
      document.getElementById("adminResponse").textContent =
        request.adminResponse ||
        (request.status === "approved"
          ? "Su solicitud ha sido aprobada. Nos pondremos en contacto con usted para asignarle una nueva fecha."
          : "Su solicitud ha sido rechazada. Por favor mantenga su cita original o contacte a la clínica.");

      document.getElementById("responseMessage").classList.remove("hidden");
    } else {
      document.getElementById("responseMessage").classList.add("hidden");
    }

    reprogramStatus.classList.remove("hidden");
  }

  // Función para formatear fechas
  function formatDate(dateString) {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("es-ES", options);
  }
});
