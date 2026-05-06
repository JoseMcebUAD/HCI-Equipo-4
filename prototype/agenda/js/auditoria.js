/* ============================================================
   auditoria.js
   Registro y visualización de auditoría (UC-AG-02/03/04)
   ============================================================ */
(function () {
  'use strict';

  const LS_KEY = 'agenda_audit_logs';
  const MAX_LOGS = 500;

  const readLogs = () => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      const rows = raw ? JSON.parse(raw) : [];
      return Array.isArray(rows)
        ? rows.map(item => ({
            id: item.id || `aud-${Math.random().toString(36).slice(2, 8)}`,
            createdAt: item.createdAt || item.timestamp || nowIso(),
            uc: item.uc || '',
            action: item.action || 'Evento',
            actor: item.actor || 'Sistema',
            details: item.details || {}
          }))
        : [];
    } catch (_) {
      return [];
    }
  };

  const writeLogs = logs => {
    localStorage.setItem(LS_KEY, JSON.stringify(logs.slice(0, MAX_LOGS)));
  };

  const nowIso = () => new Date().toISOString();

  const emitUpdated = () => {
    window.dispatchEvent(new CustomEvent('agenda:audit-updated'));
  };

  const log = (entry) => {
    if (!entry || !entry.uc) return;
    const logs = readLogs();
    logs.unshift({
      id: `aud-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      createdAt: nowIso(),
      uc: entry.uc,
      action: entry.action || 'Evento',
      actor: entry.actor || 'Sistema',
      details: entry.details || {}
    });
    writeLogs(logs);
    emitUpdated();
  };

  const fmtDateTime = (iso) => {
    try {
      const d = new Date(iso);
      return d.toLocaleString('es-MX', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (_) {
      return iso || '—';
    }
  };

  const ucClass = (uc) => {
    if (uc === 'UC-AG-02') return 'audit-uc2';
    if (uc === 'UC-AG-03') return 'audit-uc3';
    if (uc === 'UC-AG-04') return 'audit-uc4';
    return '';
  };

  const detailText = (details) => {
    const parts = [];
    if (details.folio) parts.push(`Folio: ${details.folio}`);
    if (details.patient) parts.push(`Paciente: ${details.patient}`);
    if (details.from && details.to) parts.push(`${details.from} → ${details.to}`);
    if (details.requestId) parts.push(`Solicitud: ${details.requestId}`);
    if (details.requestType) parts.push(`Tipo solicitud: ${details.requestType}`);
    if (details.status) parts.push(`Estado: ${details.status}`);
    if (details.reason) parts.push(`Motivo: ${details.reason}`);
    if (details.mode) parts.push(`Modo: ${details.mode}`);
    if (details.affectedAppointments != null) parts.push(`Afectadas: ${details.affectedAppointments}`);
    if (details.firstRescheduledDate) parts.push(`Primera fecha: ${details.firstRescheduledDate}`);
    return parts.join(' · ');
  };

  const render = () => {
    const list = document.getElementById('auditList');
    const empty = document.getElementById('auditEmpty');
    const badge = document.getElementById('auditBadge');
    if (!list || !empty) return;

    const logs = readLogs();

    if (badge) {
      badge.textContent = String(logs.length);
      badge.classList.toggle('hidden', logs.length === 0);
    }

    if (!logs.length) {
      list.innerHTML = '';
      empty.classList.remove('hidden');
      return;
    }

    empty.classList.add('hidden');
    list.innerHTML = logs.map(item => {
      const details = detailText(item.details || {});
      return `
        <article class="audit-item ${ucClass(item.uc)}">
          <div class="audit-head">
            <span class="audit-uc-label">${item.uc}</span>
            <time class="audit-time">${fmtDateTime(item.createdAt)}</time>
          </div>
          <div class="audit-title">${item.action}</div>
          <div class="audit-meta">Actor: ${item.actor}</div>
          ${details ? `<div class="audit-meta">${details}</div>` : ''}
        </article>
      `;
    }).join('');
  };

  const showAuditPanel = () => {
    document.getElementById('calendarContainer')?.classList.remove('hidden');
    document.getElementById('statusLegend')?.classList.remove('hidden');
    document.getElementById('inboxPanel')?.classList.add('hidden');
    document.getElementById('auditPanel')?.classList.remove('hidden');
    render();
  };

  const showCalendarPanel = () => {
    document.getElementById('calendarContainer')?.classList.remove('hidden');
    document.getElementById('statusLegend')?.classList.remove('hidden');
    document.getElementById('inboxPanel')?.classList.add('hidden');
    document.getElementById('auditPanel')?.classList.add('hidden');
  };

  window.Auditoria = {
    init() {
      render();
    },
    refresh: render,
    log,
    showAuditPanel,
    showCalendarPanel
  };

  document.addEventListener('DOMContentLoaded', () => {
    render();
  });
  window.addEventListener('agenda:audit-updated', render);
  window.addEventListener('storage', (e) => {
    if (e.key === LS_KEY) render();
  });
})();
