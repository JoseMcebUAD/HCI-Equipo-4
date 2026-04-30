document.addEventListener("DOMContentLoaded", function () {
    // Elementos del DOM
    const btnNuevoTerapeuta = document.getElementById("btnNuevoTerapeuta");
    const modal = document.getElementById("modalTerapeuta");
    const closeModals = document.querySelectorAll(".close-modal");
    const formTerapeuta = document.getElementById("formTerapeuta");
    const btnAddHorario = document.getElementById("btnAddHorario");
    const horariosContainer = document.getElementById("horarios-container");
    const searchInput = document.getElementById("searchInput");
    const filterService = document.getElementById("filterService");
    const filterStatus = document.getElementById("filterStatus");
    const tableBody = document.getElementById("therapistTableBody");

    // Cargar datos de la persistencia
    let terapeutas = DB.getTherapists().map(t => ({
        id: t.id,
        nombre: t.name,
        email: t.email || `${t.name.toLowerCase().replace(/ /g, '.')}@clinica.com`,
        telefono: t.phone || "5550000000",
        rol: t.role,
        tipo: t.specialties[0] || "General",
        pacientes: t.patientsCount || 0,
        horarios: t.busy || []
    }));

    function updateStats() {
        const stats = DB.getStats();
        const totalTeamEl = document.querySelector('h3.text-3xl.font-black.text-slate-900');
        if (totalTeamEl) totalTeamEl.textContent = stats.totalTherapists;
    }

    function syncDB() {
        const dataToSave = terapeutas.map(t => ({
            id: t.id,
            name: t.nombre,
            email: t.email,
            phone: t.telefono,
            role: t.rol,
            specialties: [t.tipo],
            patientsCount: t.pacientes,
            busy: t.horarios
        }));
        DB.saveTherapists(dataToSave);
        updateStats();
    }

    function renderTable() {
        const searchTerm = searchInput.value.toLowerCase();
        const serviceFiltro = filterService.value;
        const statusFiltro = filterStatus.value;

        const filtered = terapeutas.filter(t => {
            const matchesSearch = t.nombre.toLowerCase().includes(searchTerm) || t.email.toLowerCase().includes(searchTerm);
            const matchesService = serviceFiltro === 'all' || t.tipo === serviceFiltro;
            const matchesStatus = statusFiltro === 'all' || t.rol === statusFiltro;
            return matchesSearch && matchesService && matchesStatus;
        });

        tableBody.innerHTML = filtered.map(t => `
            <tr class="hover:bg-slate-50 transition-colors group">
                <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-sm">
                            ${t.nombre.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                            <p class="text-sm font-bold text-slate-900">${t.nombre}</p>
                            <p class="text-xs text-slate-500">${t.email}</p>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4">
                    <span class="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded-md">${t.tipo}</span>
                </td>
                <td class="px-6 py-4">
                    <span class="px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider 
                        ${t.rol === 'Activo' ? 'bg-emerald-50 text-emerald-700' : 
                          t.rol === 'Pasante' ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'}">
                        ${t.rol}
                    </span>
                </td>
                <td class="px-6 py-4">
                    <p class="text-sm text-slate-600 font-medium">${t.pacientes} pacientes</p>
                </td>
                <td class="px-6 py-4 text-right">
                    <div class="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onclick="editTerapeuta(${t.id})" class="p-2 text-slate-400 hover:text-primary transition-colors">
                            <span class="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                        <button onclick="deleteTerapeuta(${t.id})" class="p-2 text-slate-400 hover:text-red-500 transition-colors">
                            <span class="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');

        if (filtered.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="5" class="px-6 py-12 text-center text-slate-400 italic">No se encontraron terapeutas</td></tr>`;
        }
    }

    // Modal logic
    btnNuevoTerapeuta.addEventListener("click", () => {
        document.getElementById("modalTitle").textContent = "Nuevo Terapeuta";
        formTerapeuta.reset();
        horariosContainer.innerHTML = "";
        modal.classList.remove("hidden");
        setTimeout(() => modal.firstElementChild.classList.remove("scale-95"), 10);
    });

    closeModals.forEach(btn => {
        btn.addEventListener("click", () => {
            modal.classList.add("hidden");
            modal.firstElementChild.classList.add("scale-95");
        });
    });

    btnAddHorario.addEventListener("click", () => {
        const div = document.createElement("div");
        div.className = "flex items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200 animate-slide-in";
        div.innerHTML = `
            <select class="dia-semana bg-transparent border-none text-xs font-bold outline-none flex-1">
                <option value="lunes">Lunes</option>
                <option value="martes">Martes</option>
                <option value="miercoles">Miércoles</option>
                <option value="jueves">Jueves</option>
                <option value="viernes">Viernes</option>
            </select>
            <input type="time" class="hora-inicio bg-transparent border-none text-xs outline-none">
            <span class="text-slate-300 text-[10px]">a</span>
            <input type="time" class="hora-fin bg-transparent border-none text-xs outline-none">
            <button type="button" class="text-slate-400 hover:text-red-500 transition-colors">
                <span class="material-symbols-outlined text-[16px]">close</span>
            </button>
        `;
        div.querySelector('button').onclick = () => div.remove();
        horariosContainer.appendChild(div);
    });

    formTerapeuta.addEventListener("submit", (e) => {
        e.preventDefault();
        const id = document.getElementById("modalTerapeuta").dataset.editingId;
        const nombre = document.getElementById("nombre").value.trim();
        const email = document.getElementById("email").value.trim();
        const telefono = document.getElementById("telefono").value.trim();
        const rol = document.getElementById("rol").value;
        const tipo = document.getElementById("tipo-servicio-modal").value;

        if (!nombre || !email || !telefono || !rol || !tipo) {
            showToast("Por favor complete todos los campos obligatorios.", true);
            return;
        }

        const data = {
            nombre: nombre,
            email: email,
            telefono: telefono,
            rol: rol,
            tipo: tipo,
            pacientes: 0,
            horarios: []
        };

        if (id) {
            const index = terapeutas.findIndex(x => x.id == id);
            if (index !== -1) terapeutas[index] = { ...terapeutas[index], ...data };
            delete document.getElementById("modalTerapeuta").dataset.editingId;
        } else {
            terapeutas.push({ id: Date.now(), ...data });
        }

        syncDB();
        renderTable();
        modal.classList.add("hidden");
        showToast("Terapeuta guardado correctamente");
    });

    // Global actions
    window.editTerapeuta = (id) => {
        const t = terapeutas.find(x => x.id === id);
        if(!t) return;
        document.getElementById("modalTerapeuta").dataset.editingId = id;
        document.getElementById("modalTitle").textContent = "Editar Terapeuta";
        document.getElementById("nombre").value = t.nombre;
        document.getElementById("email").value = t.email;
        document.getElementById("telefono").value = t.telefono;
        document.getElementById("rol").value = t.rol;
        document.getElementById("tipo-servicio-modal").value = t.tipo;
        
        modal.classList.remove("hidden");
    };

    window.deleteTerapeuta = (id) => {
        if(confirm("¿Estás seguro de eliminar a este terapeuta?")) {
            terapeutas = terapeutas.filter(t => t.id !== id);
            syncDB();
            renderTable();
            showToast("Terapeuta eliminado");
        }
    };

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

    searchInput.addEventListener("input", renderTable);
    filterService.addEventListener("change", renderTable);
    filterStatus.addEventListener("change", renderTable);

    renderTable();
});
