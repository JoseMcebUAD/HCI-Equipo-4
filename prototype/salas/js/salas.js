document.addEventListener('DOMContentLoaded', () => {
    /* ---------- refs DOM ---------- */
    const grid           = document.getElementById('salasGrid');
    const btnAgregar     = document.getElementById('btnAgregarSala');
    const modal          = document.getElementById('modalSala');
    const closeButtons   = document.querySelectorAll('.close-button');
    const form           = document.getElementById('salaForm');
    const formTitle      = document.getElementById('formTitle');

    const fId        = document.getElementById('salaId');
    const fNombre    = document.getElementById('nombre');
    const fHoraIni   = document.getElementById('horaInicio');
    const fHoraFin   = document.getElementById('horaFin');

    /* ---------- estado ---------- */
    let salas = [];

    const load = () => {
        salas = JSON.parse(localStorage.getItem('salas') || '[]');
        if(salas.length === 0) {
            salas = [
                { id: 1, nombre: "Sala 01 - PB", servicios: ["Evaluación inicial integral", "Cita de terapia"], horaInicio: "09:00", horaFin: "18:00" },
                { id: 2, nombre: "Sala 02 - PB", servicios: ["Cita de terapia"], horaInicio: "09:00", horaFin: "18:00" },
                { id: 3, nombre: "Sala Grupal 01", servicios: ["Evaluación inicial integral"], horaInicio: "10:00", horaFin: "16:00" }
            ];
            save();
        }
    };
    const save = () => localStorage.setItem('salas', JSON.stringify(salas));

    /* ---------- UI helpers ---------- */
    const closeModal = () => {
        modal.classList.add('hidden');
        form.reset();
        fId.value = '';
    };
    const openModal = () => modal.classList.remove('hidden');

    /* ---------- render grid ---------- */
    const render = () => {
        grid.innerHTML = '';
        salas.forEach((sala, i) => {
            const card = document.createElement('div');
            card.className = 'bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group relative';
            card.innerHTML = `
                <div class="flex justify-between items-start mb-4">
                    <div class="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                        <span class="material-symbols-outlined">meeting_room</span>
                    </div>
                    <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onclick="editSala(${i})" class="p-2 text-slate-400 hover:text-primary transition-colors">
                            <span class="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                        <button onclick="deleteSala(${i})" class="p-2 text-slate-400 hover:text-red-500 transition-colors">
                            <span class="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                    </div>
                </div>
                <h3 class="font-black text-slate-900 text-lg mb-1">${sala.nombre}</h3>
                <div class="flex items-center gap-1 text-slate-400 text-xs font-bold uppercase tracking-wider mb-4">
                    <span class="material-symbols-outlined text-[14px]">schedule</span>
                    ${sala.horaInicio} - ${sala.horaFin}
                </div>
                <div class="flex flex-wrap gap-2">
                    ${sala.servicios.map(s => `
                        <span class="px-2 py-1 bg-slate-50 text-slate-500 text-[10px] font-bold rounded-lg border border-slate-100 uppercase">
                            ${s}
                        </span>
                    `).join('')}
                </div>
            `;
            grid.appendChild(card);
        });

        if (salas.length === 0) {
            grid.innerHTML = '<div class="col-span-full py-12 text-center text-slate-400 italic">No hay salas registradas. Haga clic en "Agregar Sala" para comenzar.</div>';
        }
    };

    /* ---------- acciones globales ---------- */
    window.editSala = (i) => {
        const s = salas[i];
        fId.value = i;
        fNombre.value = s.nombre;
        fHoraIni.value = s.horaInicio;
        fHoraFin.value = s.horaFin;
        [...form.querySelectorAll('input[name="servicios"]')].forEach(c => {
            c.checked = s.servicios.includes(c.value);
        });
        formTitle.textContent = 'Editar Sala';
        openModal();
    };

    window.deleteSala = (i) => {
        if (confirm('¿Eliminar esta sala?')) {
            salas.splice(i, 1);
            save(); render();
            showToast("Sala eliminada");
        }
    };

    /* ---------- submit form ---------- */
    form.onsubmit = e => {
        e.preventDefault();
        const nombre    = fNombre.value.trim();
        const servicios = [...form.querySelectorAll('input[name="servicios"]:checked')].map(c => c.value);
        const hIni      = fHoraIni.value;
        const hFin      = fHoraFin.value;

        if (!nombre || servicios.length === 0 || !hIni || !hFin) {
            showToast("Complete todos los campos y seleccione al menos un servicio.", true);
            return;
        }

        const data = { nombre, servicios, horaInicio: hIni, horaFin: hFin };

        if (fId.value === '') {
            salas.push(data);
            showToast("Sala agregada con éxito");
        } else {
            salas[Number(fId.value)] = data;
            showToast("Sala actualizada");
        }
        save(); render(); closeModal();
    };

    btnAgregar.onclick = () => {
        form.reset();
        fId.value = '';
        formTitle.textContent = 'Agregar Sala';
        openModal();
    };

    closeButtons.forEach(btn => btn.onclick = closeModal);

    function showToast(msg, isError = false) {
        let toast = document.getElementById("globalToast");
        if(!toast) {
            toast = document.createElement("div");
            toast.id = "globalToast";
            toast.className = "fixed bottom-6 right-6 px-6 py-3 rounded-xl shadow-xl z-[200] transform translate-y-20 opacity-0 transition-all duration-300 font-medium text-sm";
            document.body.appendChild(toast);
        }
        toast.textContent = msg;
        toast.className = `fixed bottom-6 right-6 px-6 py-3 rounded-xl shadow-xl z-[200] transform translate-y-20 opacity-0 transition-all duration-300 font-medium text-sm ${isError ? 'bg-red-600 text-white' : 'bg-slate-900 text-white'}`;
        toast.classList.remove("translate-y-20", "opacity-0");
        setTimeout(() => toast.classList.add("translate-y-20", "opacity-0"), 3000);
    }

    /* ---------- init ---------- */
    load(); render();
});
