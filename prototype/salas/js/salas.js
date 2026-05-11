document.addEventListener('DOMContentLoaded', () => {
  /* ---------- refs DOM ---------- */
  const tbody          = document.querySelector('#salasTable tbody');
  const btnAgregar     = document.getElementById('btnAgregarSala');
  const modal          = document.getElementById('modalSala');
  const cerrarModalBtn = document.getElementById('cerrarModalSala');
  const form           = document.getElementById('salaForm');
  const formTitle      = document.getElementById('formTitle');

  const fId        = document.getElementById('salaId');
  const fNombre    = document.getElementById('nombre');
  const fHoraIni   = document.getElementById('horaInicio');
  const fHoraFin   = document.getElementById('horaFin');

  /* ---------- UI helpers ---------- */
  const closeModal = () => {
    modal.style.display='none';
    form.reset();
    fId.value='';
    [...form.querySelectorAll('input[name="servicios"]')].forEach(c=>c.checked=false);
  };
  const openModal = () => modal.style.display='block';

  /* ---------- render tabla ---------- */
  const render = () => {
    if (!window.DB) return;
    tbody.innerHTML='';
    const salas = DB.salas.getAll();
    salas.forEach((sala,i)=>{
      const tr=document.createElement('tr');
      tr.innerHTML=`
        <td>${i+1}</td>
        <td>${sala.nombre}</td>
        <td>${(sala.servicios || []).join(', ')}</td>
        <td>${sala.horaInicio} – ${sala.horaFin}</td>
        <td>
          <button class="edit-btn" data-id="${sala.id}">Editar</button>
          <button class="del-btn"  data-id="${sala.id}">Eliminar</button>
        </td>`;
      tbody.appendChild(tr);
    });

    /* eventos editar / borrar */
    tbody.querySelectorAll('.edit-btn').forEach(btn=>{
      btn.onclick=()=>{
        const id=parseInt(btn.dataset.id);
        const s=DB.salas.getById(id);
        if(!s) return;
        fId.value=id;
        fNombre.value=s.nombre;
        fHoraIni.value=s.horaInicio;
        fHoraFin.value=s.horaFin;
        /* marcar checkboxes */
        [...form.querySelectorAll('input[name="servicios"]')].forEach(c=>{
          c.checked=(s.servicios || []).includes(c.value);
        });
        formTitle.textContent='Editar Sala';
        openModal();
      };
    });
    tbody.querySelectorAll('.del-btn').forEach(btn=>{
      btn.onclick=()=>{
        const id=parseInt(btn.dataset.id);
        if(confirm('¿Eliminar esta sala?')){
          DB.salas.remove(id);
          render();
        }
      };
    });
  };

  /* ---------- validación horario ---------- */
  const horarioValido = (ini,fin) => {
    if(ini >= fin) return false;
    return ini >= '09:00' && fin <= '18:00';
  };

  /* ---------- submit form ---------- */
  form.onsubmit = e =>{
    e.preventDefault();
    const nombre   = fNombre.value.trim();
    const servicios= [...form.querySelectorAll('input[name="servicios"]:checked')].map(c=>c.value);
    const hIni     = fHoraIni.value;
    const hFin     = fHoraFin.value;

    if(!nombre||servicios.length===0||!hIni||!hFin){
      alert('Complete todos los campos y seleccione al menos un servicio.');
      return;
    }
    if(!horarioValido(hIni,hFin)){
      alert('Horario inválido (09:00 – 18:00 y fin después de inicio).');
      return;
    }

    const data={nombre,servicios,horaInicio:hIni,horaFin:hFin};

    if(fId.value===''){          /* alta */
      DB.salas.add(data);
    }else{                       /* edición */
      DB.salas.update(parseInt(fId.value), data);
    }
    render(); closeModal();
  };

  /* ---------- eventos globales ---------- */
  btnAgregar.onclick = ()=>{
    form.reset();
    [...form.querySelectorAll('input[name="servicios"]')].forEach(c=>c.checked=false);
    fId.value='';
    formTitle.textContent='Agregar Sala';
    openModal();
  };
  cerrarModalBtn.onclick=closeModal;
  window.onclick=e=>{ if(e.target===modal) closeModal(); };

  /* ---------- init ---------- */
  render();
});
