document.addEventListener("DOMContentLoaded", function () {
  // Elementos del DOM
  const btnNuevoTerapeuta = document.getElementById("btnNuevoTerapeuta");
  const modal = document.getElementById("modalTerapeuta");
  const closeModal = document.querySelectorAll(".close-modal");
  const formTerapeuta = document.getElementById("formTerapeuta");
  const btnAddHorario = document.getElementById("btnAddHorario");
  const horariosContainer = document.getElementById("horarios-container");
  const buscarNombre = document.getElementById("buscar-nombre");
  const tipoServicio = document.getElementById("tipo-servicio");
  const rolTerapeuta = document.getElementById("rol-terapeuta");
  const therapistListContainer = document.getElementById("therapistList");

  let currentEditId = null;

  // Listeners para filtros
  buscarNombre.addEventListener("input", renderTerapeutas);
  tipoServicio.addEventListener("change", renderTerapeutas);
  rolTerapeuta.addEventListener("change", renderTerapeutas);

  // Cargar y mostrar terapeutas
  function renderTerapeutas() {
    if (!window.DB) return;
    
    const allTerapeutas = DB.terapeutas.getAll();
    const nombreFiltro = buscarNombre.value.toLowerCase();
    const tipoFiltro = tipoServicio.value;
    const rolFiltro = rolTerapeuta.value;

    therapistListContainer.innerHTML = "";

    allTerapeutas.forEach((t) => {
      const coincideNombre = t.nombre.toLowerCase().includes(nombreFiltro) || nombreFiltro === "";
      const coincideTipo = t.tipo === tipoFiltro || tipoFiltro === "";
      const coincideRol = t.rol === rolFiltro || rolFiltro === "";

      if (coincideNombre && coincideTipo && coincideRol) {
        const item = document.createElement("div");
        item.className = "therapist-list-item-container";
        item.style.display = "flex";
        item.style.alignItems = "center";
        item.style.marginBottom = "8px";
        item.innerHTML = `
            <div class="therapist-list" style="flex-grow: 1; margin-bottom: 0;">
              <a href="detalle_terapeuta.html?id=${t.id}" style="text-decoration: none; color: inherit; display: flex; justify-content: space-between; width: 100%;">
                <span>${t.nombre} - ${t.tipoLabel || (t.tipo === 'tipo1' ? 'Psicodiagnóstico' : 'Terapia Individual')}</span>
                <span class="therapist-status">${t.rol.charAt(0).toUpperCase() + t.rol.slice(1)}</span>
              </a>
            </div>
            <button class="btn-edit-small" data-id="${t.id}" style="margin-left: 10px; background: none; border: none; cursor: pointer; font-size: 1.2rem;">✏️</button>
        `;
        
        item.querySelector(".btn-edit-small").addEventListener("click", (e) => {
          e.stopPropagation();
          openEditModal(t.id);
        });

        therapistListContainer.appendChild(item);
      }
    });
  }

  function openEditModal(id) {
    const t = DB.terapeutas.getById(id);
    if (!t) return;

    currentEditId = id;
    document.getElementById("modalTitle").textContent = "Editar Terapeuta";
    document.getElementById("nombre").value = t.nombre;
    document.getElementById("email").value = t.email;
    document.getElementById("telefono").value = t.telefono;
    document.getElementById("rol").value = t.rol;
    document.getElementById("tipo-servicio-modal").value = t.tipo;

    horariosContainer.innerHTML = "";
    (t.horarios || []).forEach(h => addHorarioRow(h));

    modal.style.display = "block";
  }

  function addHorarioRow(h = { dia: 'lunes', inicio: '09:00', fin: '13:00' }) {
    const horarioItem = document.createElement("div");
    horarioItem.className = "horario-item";
    horarioItem.innerHTML = `
        <select class="dia-semana">
          <option value="lunes" ${h.dia === 'lunes' ? 'selected' : ''}>Lunes</option>
          <option value="martes" ${h.dia === 'martes' ? 'selected' : ''}>Martes</option>
          <option value="miercoles" ${h.dia === 'miercoles' ? 'selected' : ''}>Miércoles</option>
          <option value="jueves" ${h.dia === 'jueves' ? 'selected' : ''}>Jueves</option>
          <option value="viernes" ${h.dia === 'viernes' ? 'selected' : ''}>Viernes</option>
        </select>
        <input type="time" class="hora-inicio" value="${h.inicio}">
        <span>a</span>
        <input type="time" class="hora-fin" value="${h.fin}">
        <button type="button" class="btn-remove-horario">✕</button>
      `;
    horariosContainer.appendChild(horarioItem);

    horarioItem.querySelector(".btn-remove-horario").addEventListener("click", () => horarioItem.remove());
  }

  // Abrir modal para nuevo terapeuta
  btnNuevoTerapeuta.addEventListener("click", function () {
    currentEditId = null;
    document.getElementById("modalTitle").textContent = "Nuevo Terapeuta";
    formTerapeuta.reset();
    horariosContainer.innerHTML = "";
    modal.style.display = "block";
  });

  // Cerrar modal
  closeModal.forEach((btn) => {
    btn.addEventListener("click", () => modal.style.display = "none");
  });

  window.addEventListener("click", (e) => {
    if (e.target === modal) modal.style.display = "none";
  });

  btnAddHorario.addEventListener("click", () => addHorarioRow());

  // Enviar formulario
  formTerapeuta.addEventListener("submit", function (e) {
    e.preventDefault();

    const tipoSelect = document.getElementById("tipo-servicio-modal");
    const nuevoTerapeuta = {
      nombre: document.getElementById("nombre").value,
      email: document.getElementById("email").value,
      telefono: document.getElementById("telefono").value,
      rol: document.getElementById("rol").value,
      tipo: tipoSelect.value,
      tipoLabel: tipoSelect.options[tipoSelect.selectedIndex].text,
      horarios: Array.from(document.querySelectorAll(".horario-item")).map(item => ({
        dia: item.querySelector(".dia-semana").value,
        inicio: item.querySelector(".hora-inicio").value,
        fin: item.querySelector(".hora-fin").value,
      }))
    };

    if (currentEditId) {
      DB.terapeutas.update(currentEditId, nuevoTerapeuta);
    } else {
      DB.terapeutas.add(nuevoTerapeuta);
    }

    modal.style.display = "none";
    renderTerapeutas();
    alert("Terapeuta guardado correctamente");
  });

  // Inicialización
  renderTerapeutas();
});
