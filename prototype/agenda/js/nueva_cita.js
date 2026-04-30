document.addEventListener('DOMContentLoaded', () => {
    // --- DATOS DESDE DB ---
    const therapists = DB.getTherapists();
    let events = DB.getEvents();

    const slots = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

    // --- ESTADO ---
    let currentStep = 1;
    let selectedSpecialty = "";
    let selectedTherapist = null;
    let selectedDate = null;
    let selectedHour = null;

    // --- DOM REFS ---
    const steps = [1, 2, 3, 4];
    const specialtySelect = document.getElementById('specialtySelect');
    const therapistGrid = document.getElementById('therapistGrid');
    const scheduleSection = document.getElementById('scheduleSection');
    const daySelector = document.getElementById('daySelector');
    const timeSlotsGrid = document.getElementById('timeSlotsGrid');
    const btnNext2 = document.getElementById('btnNext2');
    const btnFinalConfirm = document.getElementById('btnFinalConfirm');

    // --- STEPPER LOGIC ---
    window.goToStep = function(stepNum) {
        if (stepNum > currentStep && !validateStep(currentStep)) return;

        // Ocultar actual
        document.getElementById(`step${currentStep}`).classList.add('hidden');
        document.getElementById(`stepIndicator${currentStep}`).querySelector('div').className = "w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold text-sm transition-all step-inactive";
        document.getElementById(`stepIndicator${currentStep}`).querySelector('span').className = "text-[10px] font-black uppercase tracking-widest text-slate-400";
        
        currentStep = stepNum;

        // Mostrar nuevo
        document.getElementById(`step${currentStep}`).classList.remove('hidden');
        document.getElementById(`stepIndicator${currentStep}`).querySelector('div').className = "w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold text-sm transition-all step-active";
        document.getElementById(`stepIndicator${currentStep}`).querySelector('span').className = "text-[10px] font-black uppercase tracking-widest text-primary";
        
        // Actualizar Footer
        const btnPrev = document.getElementById('btnPrev');
        const btnNext = document.getElementById('btnNext');
        const btnFinal = document.getElementById('btnFinal');

        if (currentStep === 1) {
            btnPrev.classList.add('hidden');
        } else {
            btnPrev.classList.remove('hidden');
        }

        if (currentStep === 4) {
            btnNext.classList.add('hidden');
            btnFinal.classList.remove('hidden');
            renderPreview();
        } else {
            btnNext.classList.remove('hidden');
            btnFinal.classList.add('hidden');
        }

        // Reset scroll
        document.querySelector('.overflow-y-auto').scrollTop = 0;
    };

    window.nextStep = () => goToStep(currentStep + 1);
    window.prevStep = () => goToStep(currentStep - 1);

    function validateStep(step) {
        if (step === 1) {
            const name = document.getElementById('patientName').value.trim();
            const email = document.getElementById('patientEmail').value.trim();
            const phone = document.getElementById('patientPhone').value.trim();
            const room = document.getElementById('roomSelect').value;
            const spec = specialtySelect.value;
            
            if (!name || !email || !phone || !spec || !room) {
                showToast("Por favor complete todos los campos (nombre, correo, teléfono, especialidad y sala).", true);
                return false;
            }
            selectedSpecialty = spec;
            renderTherapists();
        }
        if (step === 2) {
            if (!selectedTherapist || !selectedDate || !selectedHour) {
                showToast("Debes seleccionar un terapeuta y un horario disponible.", true);
                return false;
            }
        }
        if (step === 3) {
            const amount = document.getElementById('paymentAmount').value;
            const method = document.getElementById('paymentMethod').value;
            const ref = document.getElementById('paymentRef').value.trim();
            
            if (!amount || amount <= 0 || !method || !ref) {
                showToast("Por favor complete todos los datos del pago, incluyendo el monto y la referencia.", true);
                return false;
            }
        }
        return true;
    }

    // --- STEP 2: THERAPISTS ---
    function renderTherapists() {
        therapistGrid.innerHTML = '';
        const filtered = therapists.filter(t => t.specialties.includes(selectedSpecialty));

        filtered.forEach(t => {
            const card = document.createElement('div');
            card.className = "p-6 rounded-3xl bg-slate-50 border-2 border-transparent hover:border-primary/20 transition-all cursor-pointer flex items-center gap-4 group";
            if (selectedTherapist?.id === t.id) card.classList.add('border-primary', 'bg-blue-50');
            
            card.innerHTML = `
                <div class="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                    <span class="material-symbols-outlined">person</span>
                </div>
                <div>
                    <p class="font-bold text-slate-800 text-sm">${t.name}</p>
                    <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Especialista</p>
                </div>
            `;
            card.onclick = () => {
                selectedTherapist = t;
                renderTherapists();
                showSchedule();
            };
            therapistGrid.appendChild(card);
        });
    }

    function showSchedule() {
        scheduleSection.classList.remove('hidden');
        renderDays();
    }

    function renderDays() {
        daySelector.innerHTML = '';
        const today = new Date();
        for (let i = 0; i < 7; i++) {
            const d = new Date(today);
            d.setDate(today.getDate() + i);
            if (d.getDay() === 0 || d.getDay() === 6) continue; // Saltar fin de semana

            const btn = document.createElement('button');
            const isSelected = selectedDate && d.toDateString() === selectedDate.toDateString();
            btn.className = `flex-shrink-0 w-16 h-20 rounded-2xl border-2 flex flex-col items-center justify-center transition-all ${
                isSelected ? 'border-primary bg-primary text-white shadow-lg' : 'border-slate-100 bg-white text-slate-400 hover:border-primary/20'
            }`;
            
            btn.innerHTML = `
                <span class="text-[10px] font-black uppercase mb-1">${dayNames[d.getDay()]}</span>
                <span class="text-lg font-black">${d.getDate()}</span>
            `;
            btn.onclick = () => {
                selectedDate = d;
                renderDays();
                renderTimeSlots();
            };
            daySelector.appendChild(btn);
        }
    }

    function renderTimeSlots() {
        timeSlotsGrid.innerHTML = '';
        if (!selectedDate) return;

        slots.forEach(h => {
            const isOccupied = events.some(ev => 
                ev.doctor === selectedTherapist.name && 
                new Date(ev.date).toDateString() === selectedDate.toDateString() && 
                ev.startHour === h
            );
            
            const btn = document.createElement('button');
            const isSelected = selectedHour === h;
            btn.className = `time-slot-btn ${isSelected ? 'selected' : ''} ${isOccupied ? 'disabled' : ''}`;
            btn.textContent = formatHour(h);
            btn.disabled = isOccupied;
            
            btn.onclick = () => {
                selectedHour = h;
                renderTimeSlots();
                document.getElementById('btnNext').disabled = false;
            };
            timeSlotsGrid.appendChild(btn);
        });
    }

    function formatHour(h) {
        const ampm = h >= 12 ? 'PM' : 'AM';
        const h12 = h > 12 ? h - 12 : (h === 0 ? 12 : h);
        return `${h12.toString().padStart(2, '0')}:00 ${ampm}`;
    }

    // --- STEP 4: PREVIEW ---
    function renderPreview() {
        document.getElementById('previewName').textContent = document.getElementById('patientName').value;
        document.getElementById('previewContact').textContent = `${document.getElementById('patientEmail').value} | ${document.getElementById('patientPhone').value}`;
        document.getElementById('previewSpecialty').textContent = specialtySelect.options[specialtySelect.selectedIndex].text;
        document.getElementById('previewTherapist').textContent = selectedTherapist.name;
        document.getElementById('previewSchedule').textContent = `${selectedDate.toLocaleDateString('es-ES', { weekday:'long', day:'numeric', month:'long' })} @ ${formatHour(selectedHour)}`;
        document.getElementById('previewRoom').textContent = document.getElementById('roomSelect').value || "Sala no especificada";
        document.getElementById('previewPayment').textContent = `$${document.getElementById('paymentAmount').value} MXN via ${document.getElementById('paymentMethod').value}`;
        document.getElementById('previewRef').textContent = document.getElementById('paymentRef').value || "Sin referencia";
    }

    // --- FINAL CONFIRM ---
    window.confirmAppointment = () => {
        const newEvent = {
            id: Date.now(),
            patient: document.getElementById('patientName').value,
            type: selectedSpecialty,
            doctor: selectedTherapist.name,
            date: selectedDate,
            startHour: selectedHour,
            duration: 1,
            room: document.getElementById('roomSelect').value || "Sala General",
            bgClass: getBgClass(selectedSpecialty),
            textClass: "text-slate-900",
            doctorClass: "text-primary",
            payment: {
                amount: document.getElementById('paymentAmount').value,
                method: document.getElementById('paymentMethod').value,
                ref: document.getElementById('paymentRef').value
            }
        };

        events.push(newEvent);
        DB.saveEvents(events);
        
        showToast("¡Cita registrada y agendada correctamente!", false);
        setTimeout(() => {
            window.location.href = 'agenda.html';
        }, 2000);
    };

    function getBgClass(spec) {
        if (spec === "Diagnóstico") return "bg-blue-100 border-blue-200";
        if (spec === "Evaluación") return "bg-emerald-100 border-emerald-200";
        if (spec === "Seguimiento") return "bg-amber-100 border-amber-200";
        return "bg-slate-100 border-slate-200";
    }

    // --- TOAST ---
    const patientInput = document.getElementById('patientName');
    const patientEmail = document.getElementById('patientEmail');
    const patientPhone = document.getElementById('patientPhone');
    const patientsList = document.getElementById('patientsList');
    const roomSelect = document.getElementById('roomSelect');

    const patients = DB.getPatients();
    patientsList.innerHTML = patients.map(p => `<option value="${p.name}">`).join('');

    patientInput.addEventListener('input', () => {
        const match = patients.find(p => p.name === patientInput.value);
        if (match) {
            patientEmail.value = match.email || '';
            patientPhone.value = match.phone || '';
            showToast(`Datos de ${match.name} cargados`);
        }
    });

    const rooms = DB.getRooms();
    roomSelect.innerHTML = `<option value="">Selecciona una sala</option>` + 
        rooms.map(r => `<option value="${r.name}">${r.name} (${r.status})</option>`).join('');

    function showToast(msg, isError = false) {
        const toast = document.getElementById('globalToast');
        toast.textContent = msg;
        toast.className = `fixed bottom-6 right-6 ${isError ? 'bg-rose-600' : 'bg-slate-900'} text-white px-6 py-3 rounded-xl shadow-xl z-[200] transition-all duration-300 font-medium text-sm`;
        toast.classList.remove('translate-y-20', 'opacity-0');
        setTimeout(() => toast.classList.add('translate-y-20', 'opacity-0'), 3000);
    }
});
