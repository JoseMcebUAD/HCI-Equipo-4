/* ============================================================
   bandeja-entrada.js – v1
   Inbox panel for incoming appointment/rescheduling requests.
   Exposes window.Bandeja; depends on agenda.js loading first.
   ============================================================ */
(function () {
  'use strict';

  /* ──────────────────────────────────────────────────────────
     CONSTANTS
  ────────────────────────────────────────────────────────── */
  const LS_KEY       = 'agenda_inbox';
  const ARCHIVE_DAYS = 7;
  const logAudit = payload => window.Auditoria?.log(payload);

  const TIPO_LABEL = {
    nueva:          'Nueva solicitud',
    reprogramacion: 'Reprogramación'
  };

  const SERVICIO_LABEL = {
    1: 'Evaluación inicial',
    2: 'Cita de terapia'
  };

  /* ──────────────────────────────────────────────────────────
     MOCK DATA — seed for prototype demonstration
  ────────────────────────────────────────────────────────── */
  function makeMockRequests() {
    const today = new Date();
    const iso   = d => d.toISOString().slice(0, 10);
    const ago   = n => { const d = new Date(today); d.setDate(d.getDate() - n); return iso(d); };

    // Next weekday offset from today
    function nextWD(offset) {
      let d = new Date(today); let added = 0;
      while (added < offset) {
        d.setDate(d.getDate() + 1);
        if (![0, 6].includes(d.getDay())) added++;
      }
      return iso(d);
    }

    return [
      {
        id: 'req-001',
        tipo: 'nueva',
        estado: 'pendiente',
        fechaCreacion: ago(1),
        paciente: 'Ana Martínez',
        telefono: '555-0101',
        tipoServicio: 1,
        terapeuta: 'Terapeuta A',
        disponibilidad: [
          { dia: nextWD(1), horaInicio: '09:00', horaFin: '11:00' },
          { dia: nextWD(2), horaInicio: '14:00', horaFin: '16:00' }
        ],
        citaOriginalId: null,
        notas: 'Paciente referida por médico familiar'
      },
      {
        id: 'req-002',
        tipo: 'reprogramacion',
        estado: 'pendiente',
        fechaCreacion: ago(3),
        paciente: 'Luis García',
        telefono: '555-0202',
        tipoServicio: 2,
        terapeuta: null,
        disponibilidad: [
          { dia: nextWD(1), horaInicio: '10:00', horaFin: '12:00' },
          { dia: nextWD(3), horaInicio: '09:00', horaFin: '10:30' }
        ],
        citaOriginalId: 'ex2',
        notas: null
      },
      {
        id: 'req-003',
        tipo: 'nueva',
        estado: 'pendiente',
        fechaCreacion: ago(6),
        paciente: 'Carmen Robles',
        telefono: '555-0303',
        tipoServicio: 2,
        terapeuta: 'Terap. 3',
        disponibilidad: [
          { dia: nextWD(2), horaInicio: '09:00', horaFin: '17:00' }
        ],
        citaOriginalId: null,
        notas: null
      },
      {
        id: 'req-004',
        tipo: 'reprogramacion',
        estado: 'archivada',
        fechaCreacion: ago(9),
        paciente: 'Diego Fuentes',
        telefono: '555-0404',
        tipoServicio: 1,
        terapeuta: null,
        disponibilidad: [
          { dia: ago(2), horaInicio: '11:00', horaFin: '13:00' }
        ],
        citaOriginalId: 'old-001',
        notas: 'Auto-archivada por inactividad'
      }
    ];
  }

  /* ──────────────────────────────────────────────────────────
     DATA ACCESS — localStorage
  ────────────────────────────────────────────────────────── */
  function loadRequests() {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      try { return JSON.parse(raw); } catch (_) {}
    }
    const data = makeMockRequests();
    saveRequests(data);
    return data;
  }

  function saveRequests(requests) {
    localStorage.setItem(LS_KEY, JSON.stringify(requests));
  }

  function getRequest(id) {
    return loadRequests().find(r => r.id === id);
  }

  function updateRequest(id, patch) {
    const all = loadRequests();
    const idx = all.findIndex(r => r.id === id);
    if (idx < 0) return;
    all[idx] = { ...all[idx], ...patch };
    saveRequests(all);
  }

  /* ──────────────────────────────────────────────────────────
     AUTO-ARCHIVE
  ────────────────────────────────────────────────────────── */
  function runAutoArchive() {
    const all = loadRequests();
    const now = Date.now();
    let count = 0;
    all.forEach(r => {
      if (r.estado !== 'pendiente') return;
      const days = (now - new Date(r.fechaCreacion).getTime()) / (1000 * 60 * 60 * 24);
      if (days >= ARCHIVE_DAYS) {
        r.estado = 'archivada';
        r.notas  = (r.notas ? r.notas + ' | ' : '') + 'Auto-archivada por inactividad';
        count++;
      }
    });
    if (count > 0) saveRequests(all);
    return count;
  }

  function daysSince(isoDate) {
    return (Date.now() - new Date(isoDate).getTime()) / (1000 * 60 * 60 * 24);
  }

  /* ──────────────────────────────────────────────────────────
     AVAILABILITY CHECK
  ────────────────────────────────────────────────────────── */
  function toMinutes(t) {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  }

  function getAgendaEvents() {
    if (typeof window.Bandeja?._getEvents === 'function') {
      return window.Bandeja._getEvents();
    }
    try {
      const raw = localStorage.getItem('agenda_events');
      return raw ? JSON.parse(raw) : [];
    } catch (_) { return []; }
  }

  function checkSlotConflict(slot) {
    const events = getAgendaEvents();
    if (!events || events.length === 0) return 'unknown';

    const slotStart = toMinutes(slot.horaInicio);
    const slotEnd   = toMinutes(slot.horaFin);

    const hasConflict = events.some(ev => {
      if (ev.fecha !== slot.dia) return false;
      const evStart = toMinutes(ev.hora);
      const evEnd   = evStart + (ev.dur || 60);
      return !(slotEnd <= evStart || slotStart >= evEnd);
    });

    return hasConflict ? 'conflict' : 'free';
  }

  /* ──────────────────────────────────────────────────────────
     RENDERING HELPERS
  ────────────────────────────────────────────────────────── */
  function formatSlotLabel(slot) {
    const d = new Date(slot.dia + 'T12:00:00');
    const dayLabel = d.toLocaleDateString('es-MX', {
      weekday: 'short', day: 'numeric', month: 'short'
    });
    return `${dayLabel}, ${slot.horaInicio}–${slot.horaFin}`;
  }

  function buildSlotChips(disponibilidad) {
    return disponibilidad.map(slot => {
      const status = checkSlotConflict(slot);
      const cls    = status === 'free'     ? 'slot-free'
                   : status === 'conflict' ? 'slot-conflict'
                   : 'slot-unknown';
      const icon   = status === 'free'     ? '✓'
                   : status === 'conflict' ? '⚠'
                   : '?';
      const title  = status === 'free'     ? 'Sin conflictos en este horario'
                   : status === 'conflict' ? 'Hay eventos en este horario'
                   : 'Sin datos de agenda para verificar';
      return `<span class="slot-chip ${cls}" title="${title}">
        <span class="slot-chip-icon">${icon}</span>
        ${formatSlotLabel(slot)}
      </span>`;
    }).join('');
  }

  function buildAgeIndicator(fechaCreacion) {
    const days      = daysSince(fechaCreacion);
    const remaining = ARCHIVE_DAYS - Math.floor(days);
    let cls  = 'card-age';
    let text = `Hace ${Math.floor(days)} día${Math.floor(days) !== 1 ? 's' : ''}`;

    if (remaining <= 0) {
      cls += ' age-critical';
      text += ' — archivándose hoy';
    } else if (remaining <= 1) {
      cls += ' age-critical';
      text += ` — se archiva hoy`;
    } else if (remaining <= 3) {
      cls += ' age-warning';
      text += ` — se archiva en ${remaining} días`;
    }

    return `<span class="${cls}">
      <svg viewBox="0 0 24 24" width="12" height="12" fill="none"
           stroke="currentColor" stroke-width="2" style="flex-shrink:0">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
      ${text}
    </span>`;
  }

  function buildCardHTML(r) {
    const isArchived = r.estado === 'archivada' || r.estado === 'rechazada' || r.estado === 'resolved';
    const typeClass  = isArchived          ? 'card-archivada'
                     : r.tipo === 'nueva'  ? 'card-nueva'
                     : 'card-reprogramacion';
    const badgeClass = isArchived          ? 'badge-archivada'
                     : r.tipo === 'nueva'  ? 'badge-nueva'
                     : 'badge-reprogramacion';
    const badgeLabel = isArchived
                     ? (r.estado === 'rechazada' ? 'Rechazada' : r.estado === 'resolved' ? 'Resuelta' : 'Archivada')
                     : TIPO_LABEL[r.tipo];

    const folioRef = r.citaOriginalId
      ? `<span class="card-meta-item">
           <span class="card-meta-label">Folio ref.:</span> ${r.citaOriginalId}
         </span>`
      : '';

    const terapeutaInfo = r.terapeuta
      ? `<span class="card-meta-item">
           <span class="card-meta-label">Terapeuta:</span> ${r.terapeuta}
         </span>`
      : `<span class="card-meta-item" style="color:var(--clr-text-secondary);font-style:italic">
           Sin preferencia de terapeuta
         </span>`;

    const notasInfo = r.notas
      ? `<span class="card-meta-item">
           <span class="card-meta-label">Notas:</span> ${r.notas}
         </span>`
      : '';

    const actions = isArchived ? '' : `
      <div class="card-actions">
        <button class="btn-action btn-success" data-action="accept" data-id="${r.id}">
          <svg class="btn-icon" viewBox="0 0 24 24" width="14" height="14"
               fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          Aceptar
        </button>
        <button class="btn-action btn-secondary" data-action="modify" data-id="${r.id}">
          <svg class="btn-icon" viewBox="0 0 24 24" width="14" height="14"
               fill="none" stroke="currentColor" stroke-width="2">
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
          Modificar
        </button>
        <button class="btn-action btn-danger" data-action="reject" data-id="${r.id}">
          <svg class="btn-icon" viewBox="0 0 24 24" width="14" height="14"
               fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
          Rechazar
        </button>
      </div>`;

    return `
      <div class="request-card ${typeClass}" data-request-id="${r.id}">
        <div class="card-header">
          <div>
            <div class="card-patient">${r.paciente}</div>
            <div class="card-patient-sub">
              <svg viewBox="0 0 24 24" width="11" height="11" fill="none"
                   stroke="currentColor" stroke-width="2" style="vertical-align:middle;margin-right:2px">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.63A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/>
              </svg>
              ${r.telefono}
            </div>
          </div>
          <span class="card-type-badge ${badgeClass}">${badgeLabel}</span>
        </div>

        <div class="card-meta">
          <span class="card-meta-item">
            <span class="card-meta-label">Servicio:</span>
            ${SERVICIO_LABEL[r.tipoServicio] || 'Desconocido'}
          </span>
          ${terapeutaInfo}
          ${folioRef}
          ${notasInfo}
        </div>

        <div>
          <div class="card-slots-label">Disponibilidad del paciente</div>
          <div class="card-slots">${buildSlotChips(r.disponibilidad)}</div>
        </div>

        ${buildAgeIndicator(r.fechaCreacion)}
        ${actions}
      </div>`;
  }

  /* ──────────────────────────────────────────────────────────
     PREFILL & ACCEPT / MODIFY
  ────────────────────────────────────────────────────────── */
  function getBestFreeSlot(disponibilidad) {
    const free = disponibilidad.find(s => checkSlotConflict(s) === 'free');
    return free || disponibilidad[0] || null;
  }

  function prefillNewEventModal(request) {
    const slot = getBestFreeSlot(request.disponibilidad);
    if (!slot) {
      showToastSafe('No hay disponibilidad definida en la solicitud.', 'warning');
      return;
    }

    const [h, m] = slot.horaInicio.split(':').map(Number);
    const roundedMin = m < 30 ? '00' : '30';
    const hora = `${String(h).padStart(2, '0')}:${roundedMin}`;

    const prefillData = {
      tipo:            request.tipoServicio,
      paciente:        request.paciente,
      ther:            request.terapeuta || '',
      sala:            '',
      fecha:           slot.dia,
      hora:            hora,
      _fromInbox:      request.id,
      _isRescheduling: request.tipo === 'reprogramacion'
    };

    if (typeof window.Bandeja._openModal === 'function') {
      window.Bandeja._openModal(slot.dia, hora, prefillData);
    }
  }

  function handleAccept(id) {
    const r = getRequest(id);
    if (!r) return;
    window._pendingInboxAccept = id;
    prefillNewEventModal(r);
  }

  function handleModify(id) {
    const r = getRequest(id);
    if (!r) return;
    window._pendingInboxAccept = id;
    prefillNewEventModal(r);
  }

  /* ──────────────────────────────────────────────────────────
     REJECT FLOW
  ────────────────────────────────────────────────────────── */
  function handleReject(id) {
    const r = getRequest(id);
    if (!r) return;

    const modal      = document.getElementById('rejectModal');
    const summary    = document.getElementById('rejectSummary');
    const reason     = document.getElementById('rejectReason');
    const confirmBtn = document.getElementById('rejectConfirmBtn');
    const cancelBtn  = document.getElementById('rejectCancelBtn');

    summary.innerHTML = `
      <div class="summary-row">
        <span class="label">Paciente:</span><span class="value">${r.paciente}</span>
      </div>
      <div class="summary-row">
        <span class="label">Tipo:</span><span class="value">${TIPO_LABEL[r.tipo]}</span>
      </div>
      <div class="summary-row">
        <span class="label">Servicio:</span><span class="value">${SERVICIO_LABEL[r.tipoServicio]}</span>
      </div>`;

    reason.value = '';
    modal.style.display = 'block';

    function doReject() {
      updateRequest(id, { estado: 'rechazada', notas: reason.value.trim() || null });
      logAudit({
        uc: 'UC-AG-04',
        action: 'Solicitud rechazada',
        actor: 'Personal administrativo',
        details: {
          requestId: r.id,
          requestType: r.tipo,
          patient: r.paciente,
          status: 'Rejected',
          reason: reason.value.trim() || null
        }
      });
      modal.style.display = 'none';
      showToastSafe('Solicitud rechazada.', 'warning');
      renderCurrentSubtab();
      updateBadges();
      cleanup();
    }
    function doCancel() { modal.style.display = 'none'; cleanup(); }
    function cleanup() {
      confirmBtn.removeEventListener('click', doReject);
      cancelBtn.removeEventListener('click', doCancel);
    }

    confirmBtn.addEventListener('click', doReject);
    cancelBtn.addEventListener('click', doCancel);
  }

  /* ──────────────────────────────────────────────────────────
     RENDER PIPELINE
  ────────────────────────────────────────────────────────── */
  let currentSubtab = 'nuevas';

  function getFilteredRequests(subtab) {
    const all = loadRequests();
    if (subtab === 'nuevas')
      return all.filter(r => r.tipo === 'nueva' && r.estado === 'pendiente');
    if (subtab === 'reprogramaciones')
      return all.filter(r => r.tipo === 'reprogramacion' && r.estado === 'pendiente');
    if (subtab === 'archivadas')
      return all.filter(r => r.estado === 'archivada' || r.estado === 'rechazada' || r.estado === 'resolved');
    return all;
  }

  function renderCurrentSubtab() {
    const list  = document.getElementById('inboxList');
    const empty = document.getElementById('inboxEmpty');
    if (!list || !empty) return;

    const requests = getFilteredRequests(currentSubtab);

    if (requests.length === 0) {
      list.innerHTML = '';
      empty.classList.remove('hidden');
      return;
    }

    empty.classList.add('hidden');
    list.innerHTML = requests.map(buildCardHTML).join('');

    list.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('click', e => {
        const { action, id } = e.currentTarget.dataset;
        if (action === 'accept') handleAccept(id);
        if (action === 'modify') handleModify(id);
        if (action === 'reject') handleReject(id);
      });
    });
  }

  function updateBadges() {
    const all    = loadRequests();
    const nuevas = all.filter(r => r.tipo === 'nueva' && r.estado === 'pendiente').length;
    const reprog = all.filter(r => r.tipo === 'reprogramacion' && r.estado === 'pendiente').length;
    const arch   = all.filter(r => r.estado === 'archivada' || r.estado === 'rechazada' || r.estado === 'resolved').length;
    const total  = nuevas + reprog;

    const mainBadge = document.getElementById('inboxBadge');
    if (mainBadge) {
      mainBadge.textContent = total;
      mainBadge.classList.toggle('hidden', total === 0);
    }
    const setCount = (id, n) => { const el = document.getElementById(id); if (el) el.textContent = n; };
    setCount('badgeNuevas', nuevas);
    setCount('badgeReprog', reprog);
    setCount('badgeArch', arch);
  }

  /* ──────────────────────────────────────────────────────────
     PANEL VISIBILITY
  ────────────────────────────────────────────────────────── */
  function showInboxPanel() {
    document.getElementById('calendarContainer')?.classList.remove('hidden');
    document.getElementById('statusLegend')?.classList.remove('hidden');
    document.getElementById('inboxPanel')?.classList.remove('hidden');
    renderCurrentSubtab();
    updateBadges();
  }

  function showCalendarPanel() {
    document.getElementById('calendarContainer')?.classList.remove('hidden');
    document.getElementById('statusLegend')?.classList.remove('hidden');
    document.getElementById('inboxPanel')?.classList.add('hidden');
  }

  /* ──────────────────────────────────────────────────────────
     TOAST BRIDGE
  ────────────────────────────────────────────────────────── */
  function showToastSafe(message, type) {
    if (typeof window.Bandeja?._showToast === 'function') {
      window.Bandeja._showToast(message, type);
      return;
    }
    const toast    = document.getElementById('toastNotification');
    const toastMsg = document.getElementById('toastMessage');
    if (!toast || !toastMsg) return;
    toast.className = `toast-notification toast-show toast-${type}`;
    toastMsg.textContent = message;
    const undo = document.getElementById('toastUndoBtn');
    if (undo) {
      undo.classList.add('hidden');
      undo.onclick = null;
    }
    setTimeout(() => toast.classList.remove('toast-show'), 3000);
  }

  /* ──────────────────────────────────────────────────────────
     SUB-TAB WIRING
  ────────────────────────────────────────────────────────── */
  function wireSubtabs() {
    document.querySelectorAll('.inbox-subtab').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.inbox-subtab').forEach(b =>
          b.classList.remove('inbox-subtab--active')
        );
        btn.classList.add('inbox-subtab--active');
        currentSubtab = btn.dataset.subtab;
        renderCurrentSubtab();
      });
    });
  }

  /* ──────────────────────────────────────────────────────────
     PUBLIC API — window.Bandeja
  ────────────────────────────────────────────────────────── */
  window.Bandeja = {
    init() {
      const archived = runAutoArchive();
      if (archived > 0) {
        showToastSafe(`${archived} solicitud(es) archivadas automáticamente.`, 'warning');
      }
      updateBadges();
      wireSubtabs();
    },

    onEventSaved(inboxRequestId) {
      if (!inboxRequestId) return;
      const req = getRequest(inboxRequestId);
      updateRequest(inboxRequestId, { estado: 'resolved' });
      if (req) {
        logAudit({
          uc: 'UC-AG-04',
          action: 'Solicitud resuelta',
          actor: 'Personal administrativo',
          details: {
            requestId: req.id,
            requestType: req.tipo,
            patient: req.paciente,
            status: 'Resolved'
          }
        });
      }
      window._pendingInboxAccept = null;
      updateBadges();
      showToastSafe('Solicitud marcada como resuelta.', 'success');
    },

    refresh() {
      const panel = document.getElementById('inboxPanel');
      if (panel && !panel.classList.contains('hidden')) {
        renderCurrentSubtab();
      }
      updateBadges();
    },

    showInboxPanel,
    showCalendarPanel,

    /* Hooks registered by agenda.js after its own init */
    _openModal:  null,
    _showToast:  null,
    _getEvents:  null
  };

})();
