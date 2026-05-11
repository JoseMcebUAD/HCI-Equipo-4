/* ============================================================
   db.js — Módulo central de persistencia con JSON / localStorage
   Versión: 1.0
   ============================================================
   Provee un almacén unificado para todas las entidades del
   sistema clínico. Cada colección se guarda en su propia key
   de localStorage para evitar lecturas/escrituras masivas.

   USO:
     DB.terapeutas.getAll()        → [...]
     DB.terapeutas.getById(id)     → {...} | null
     DB.terapeutas.add(obj)        → obj (con id asignado)
     DB.terapeutas.update(id, obj) → obj actualizado
     DB.terapeutas.remove(id)      → boolean
     DB.terapeutas.set(arr)        → reemplaza toda la colección

   Colecciones: terapeutas, pacientes, salas, eventos, solicitudes,
                inbox, audit, folios, config
   ============================================================ */
window.DB = (function () {
  'use strict';

  /* ──────────────────────────────────────────────────────────
     KEYS de localStorage
  ────────────────────────────────────────────────────────── */
  const KEYS = {
    terapeutas:  'db_terapeutas',
    pacientes:   'db_pacientes',
    salas:       'db_salas',
    eventos:     'db_eventos',
    solicitudes: 'db_solicitudes',
    inbox:       'db_inbox',
    audit:       'db_audit',
    folios:      'db_folios',
    config:      'db_config',
    _initialized:'db_initialized'
  };

  /* ──────────────────────────────────────────────────────────
     HELPERS
  ────────────────────────────────────────────────────────── */
  const read = key => {
    try { return JSON.parse(localStorage.getItem(key)); } catch (_) { return null; }
  };
  const write = (key, data) => localStorage.setItem(key, JSON.stringify(data));

  const nextId = (arr) => {
    if (!arr || arr.length === 0) return 1;
    return Math.max(...arr.map(x => typeof x.id === 'number' ? x.id : 0)) + 1;
  };

  /* ──────────────────────────────────────────────────────────
     COLLECTION FACTORY — genera las funciones CRUD para
     cualquier colección basada en array con campo "id"
  ────────────────────────────────────────────────────────── */
  function makeCollection(key) {
    return {
      getAll() {
        return read(key) || [];
      },
      getById(id) {
        const all = this.getAll();
        return all.find(x => x.id === id) || null;
      },
      add(obj) {
        const all = this.getAll();
        if (obj.id == null) obj.id = nextId(all);
        all.push(obj);
        write(key, all);
        return obj;
      },
      update(id, patch) {
        const all = this.getAll();
        const idx = all.findIndex(x => x.id === id);
        if (idx < 0) return null;
        all[idx] = { ...all[idx], ...patch };
        write(key, all);
        return all[idx];
      },
      remove(id) {
        const all = this.getAll();
        const idx = all.findIndex(x => x.id === id);
        if (idx < 0) return false;
        all.splice(idx, 1);
        write(key, all);
        return true;
      },
      set(arr) {
        write(key, arr);
      },
      /** Buscar por una propiedad */
      findBy(prop, value) {
        return this.getAll().filter(x => x[prop] === value);
      }
    };
  }

  /* ──────────────────────────────────────────────────────────
     COLLECTION — especial para Folios (objeto clave:valor)
  ────────────────────────────────────────────────────────── */
  const foliosAPI = {
    getAll() { return read(KEYS.folios) || {}; },
    get(paciente) {
      const all = this.getAll();
      return all[paciente] || null;
    },
    set(paciente, folio) {
      const all = this.getAll();
      all[paciente] = folio;
      write(KEYS.folios, all);
    },
    getOrCreate(paciente) {
      let f = this.get(paciente);
      if (!f) {
        f = 'F-' + paciente.split(' ').map(w => w[0]).join('') + '-' + Math.random().toString(36).slice(2, 6).toUpperCase();
        this.set(paciente, f);
      }
      return f;
    },
    setAll(obj) { write(KEYS.folios, obj); }
  };

  /* ──────────────────────────────────────────────────────────
     CONFIG — objeto simple
  ────────────────────────────────────────────────────────── */
  const configAPI = {
    get() { return read(KEYS.config) || {}; },
    set(obj) { write(KEYS.config, obj); },
    update(patch) {
      const c = this.get();
      write(KEYS.config, { ...c, ...patch });
    }
  };

  /* ──────────────────────────────────────────────────────────
     DATOS SEMILLA (seed data)
     Se insertan solo en la primera carga o al hacer reset
  ────────────────────────────────────────────────────────── */
  function isoDate(d) {
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  }
  function nextWeekday(offset) {
    const d = new Date(); let added = 0;
    while (added < offset) { d.setDate(d.getDate()+1); if(![0,6].includes(d.getDay())) added++; }
    return isoDate(d);
  }
  function currentMonday() {
    const d = new Date();
    const day = d.getDay();
    const diff = day === 0 ? 1 : 1 - day;
    d.setDate(d.getDate() + diff);
    return d;
  }
  function ago(n) {
    const d = new Date(); d.setDate(d.getDate() - n); return isoDate(d);
  }

  function getSeedData() {
    const mon = currentMonday();
    const monISO = isoDate(mon);
    const wedDate = new Date(mon); wedDate.setDate(wedDate.getDate()+2);
    const wedISO = isoDate(wedDate);

    return {
      terapeutas: [
        { id: 1, nombre: 'Terapeuta A', email: 'terapeuta.a@clinica.com', telefono: '5551001001', rol: 'activo', tipo: 'tipo1', tipoLabel: 'Psicodiagnóstico', horarios: [
          { dia: 'lunes', inicio: '09:00', fin: '14:00' },
          { dia: 'miercoles', inicio: '09:00', fin: '14:00' },
          { dia: 'viernes', inicio: '09:00', fin: '14:00' }
        ]},
        { id: 2, nombre: 'Terapeuta B', email: 'terapeuta.b@clinica.com', telefono: '5551002002', rol: 'activo', tipo: 'tipo1', tipoLabel: 'Psicodiagnóstico', horarios: [
          { dia: 'martes', inicio: '09:00', fin: '17:00' },
          { dia: 'jueves', inicio: '09:00', fin: '17:00' }
        ]},
        { id: 3, nombre: 'Terap. 1', email: 'terap1@clinica.com', telefono: '5552001001', rol: 'activo', tipo: 'tipo2', tipoLabel: 'Terapia Individual', horarios: [
          { dia: 'lunes', inicio: '09:00', fin: '17:00' },
          { dia: 'martes', inicio: '09:00', fin: '17:00' },
          { dia: 'miercoles', inicio: '09:00', fin: '17:00' }
        ]},
        { id: 4, nombre: 'Terap. 2', email: 'terap2@clinica.com', telefono: '5552002002', rol: 'activo', tipo: 'tipo2', tipoLabel: 'Terapia Individual', horarios: [
          { dia: 'lunes', inicio: '09:00', fin: '17:00' },
          { dia: 'jueves', inicio: '09:00', fin: '17:00' },
          { dia: 'viernes', inicio: '09:00', fin: '17:00' }
        ]},
        { id: 5, nombre: 'Terap. 3', email: 'terap3@clinica.com', telefono: '5552003003', rol: 'pasante', tipo: 'tipo2', tipoLabel: 'Terapia Individual', horarios: [
          { dia: 'martes', inicio: '10:00', fin: '15:00' },
          { dia: 'viernes', inicio: '10:00', fin: '15:00' }
        ]},
        { id: 6, nombre: 'Terap. 4', email: 'terap4@clinica.com', telefono: '5552004004', rol: 'externo', tipo: 'tipo2', tipoLabel: 'Terapia Individual', horarios: [
          { dia: 'miercoles', inicio: '09:00', fin: '13:00' },
          { dia: 'jueves', inicio: '09:00', fin: '13:00' }
        ]}
      ],

      pacientes: [
        { id: 1,  nombre: 'Ana Martínez',    estado: 'activo',    servicio: 'psicoterapia',     email: 'ana.martinez@example.com',    celular: '5550101010', terapeuta: 'Terap. 1',    fechaRegistro: '2024-01-15' },
        { id: 2,  nombre: 'Luis García',      estado: 'activo',    servicio: 'psicoterapia',     email: 'luis.garcia@example.com',     celular: '5550202020', terapeuta: 'Terap. 2',    fechaRegistro: '2024-02-10' },
        { id: 3,  nombre: 'Carmen Robles',    estado: 'activo',    servicio: 'psicoterapia',     email: 'carmen.robles@example.com',   celular: '5550303030', terapeuta: 'Terap. 3',    fechaRegistro: '2024-03-05' },
        { id: 4,  nombre: 'José Romero',      estado: 'espera',    servicio: '',                 email: 'jose.romero@example.com',     celular: '5550404040', terapeuta: '',             fechaRegistro: '2024-04-20' },
        { id: 5,  nombre: 'María Torres',     estado: 'activo',    servicio: 'psicodiagnostico', email: 'maria.torres@example.com',    celular: '5550505050', terapeuta: 'Terapeuta A',  fechaRegistro: '2024-02-28' },
        { id: 6,  nombre: 'Diego Fuentes',    estado: 'archivado', servicio: 'psicoterapia',     email: 'diego.fuentes@example.com',   celular: '5550606060', terapeuta: 'Terap. 1',    fechaRegistro: '2023-11-10' },
        { id: 7,  nombre: 'Sofía Paredes',    estado: 'activo',    servicio: 'psicoterapia',     email: 'sofia.paredes@example.com',   celular: '5550707070', terapeuta: 'Terap. 2',    fechaRegistro: '2024-05-01' },
        { id: 8,  nombre: 'Ricardo Vargas',   estado: 'activo',    servicio: 'psicodiagnostico', email: 'ricardo.vargas@example.com',  celular: '5550808080', terapeuta: 'Terapeuta B',  fechaRegistro: '2024-03-18' },
        { id: 9,  nombre: 'Elena Castillo',   estado: 'activo',    servicio: 'psicodiagnostico', email: 'elena.castillo@example.com',  celular: '5550909090', terapeuta: 'Terapeuta A',  fechaRegistro: '2024-04-01' },
        { id: 10, nombre: 'Pedro Rivas',      estado: 'espera',    servicio: '',                 email: 'pedro.rivas@example.com',     celular: '5551010101', terapeuta: '',             fechaRegistro: '2024-06-12' },
        { id: 11, nombre: 'María López',      estado: 'activo',    servicio: 'psicoterapia',     email: 'maria.lopez@example.com',     celular: '5512345678', terapeuta: 'Terapeuta A',  fechaRegistro: '2024-03-15' },
        { id: 12, nombre: 'Carlos Ruiz',      estado: 'espera',    servicio: '',                 email: 'carlos.ruiz@example.com',     celular: '5543216789', terapeuta: '',             fechaRegistro: '2024-05-20' },
        { id: 13, nombre: 'Ana García',       estado: 'archivado', servicio: 'psicodiagnostico', email: 'ana.garcia.p@example.com',    celular: '5567891234', terapeuta: 'Terapeuta B',  fechaRegistro: '2023-09-05' }
      ],

      salas: [
        { id: 1, nombre: 'Sala 101', servicios: ['Evaluación inicial integral', 'Cita de terapia'], horaInicio: '09:00', horaFin: '17:00' },
        { id: 2, nombre: 'Sala 102', servicios: ['Evaluación inicial integral', 'Cita de terapia'], horaInicio: '09:00', horaFin: '17:00' },
        { id: 3, nombre: 'Sala 103', servicios: ['Cita de terapia'],                                horaInicio: '09:00', horaFin: '17:00' }
      ],

      eventos: [
        { id: 'ex1', tipo: 1, paciente: 'Elena Castillo', fecha: monISO,  hora: '10:00', sala: 'Sala 101', ther: 'Terapeuta A', dur: 60, folio: 'F-EC-DEMO', fee: null, proof: '' },
        { id: 'ex2', tipo: 2, paciente: 'Luis García',    fecha: wedISO, hora: '09:30', sala: 'Sala 102', ther: 'Terap. 2',    dur: 60, folio: 'F-LG-DEMO', fee: 350,  proof: '' }
      ],

      solicitudes: [
        { id: 'sol-001', nombre: 'Juan Pérez López', email: 'juan.perez@example.com', telefono: '5551234567', fechaNacimiento: '1995-06-15', motivo: 'psicologica', fechaSolicitada: nextWeekday(3), horaSolicitada: '10:00 AM', estado: 'pendiente', fechaCreacion: ago(2) },
        { id: 'sol-002', nombre: 'Pedro Martínez',   email: 'pedro.martinez@example.com', telefono: '5557654321', fechaNacimiento: '1988-03-22', motivo: 'medica',      fechaSolicitada: nextWeekday(5), horaSolicitada: '04:00 PM', estado: 'aprobada',  fechaCreacion: ago(10),
          cita: { date: nextWeekday(5), time: '16:30', specialist: 'Dr. Carlos Sánchez', location: 'Sala 103' },
          reprogramRequest: { status: 'pending', reason: 'Emergencia', details: 'Necesito viajar por emergencia familiar', requestDate: ago(1), adminResponse: 'Hemos recibido su solicitud. Le contactaremos dentro de 24 horas para asignarle una nueva fecha.' }
        }
      ],

      inbox: [
        {
          id: 'req-001', tipo: 'nueva', estado: 'pendiente', fechaCreacion: ago(1),
          paciente: 'Ana Martínez', telefono: '555-0101', tipoServicio: 1,
          terapeuta: 'Terapeuta A',
          disponibilidad: [
            { dia: nextWeekday(1), horaInicio: '09:00', horaFin: '11:00' },
            { dia: nextWeekday(2), horaInicio: '14:00', horaFin: '16:00' }
          ],
          citaOriginalId: null, notas: 'Paciente referida por médico familiar'
        },
        {
          id: 'req-002', tipo: 'reprogramacion', estado: 'pendiente', fechaCreacion: ago(3),
          paciente: 'Luis García', telefono: '555-0202', tipoServicio: 2,
          terapeuta: null,
          disponibilidad: [
            { dia: nextWeekday(1), horaInicio: '10:00', horaFin: '12:00' },
            { dia: nextWeekday(3), horaInicio: '09:00', horaFin: '10:30' }
          ],
          citaOriginalId: 'ex2', notas: null
        },
        {
          id: 'req-003', tipo: 'nueva', estado: 'pendiente', fechaCreacion: ago(6),
          paciente: 'Carmen Robles', telefono: '555-0303', tipoServicio: 2,
          terapeuta: 'Terap. 3',
          disponibilidad: [
            { dia: nextWeekday(2), horaInicio: '09:00', horaFin: '17:00' }
          ],
          citaOriginalId: null, notas: null
        },
        {
          id: 'req-004', tipo: 'reprogramacion', estado: 'archivada', fechaCreacion: ago(9),
          paciente: 'Diego Fuentes', telefono: '555-0404', tipoServicio: 1,
          terapeuta: null,
          disponibilidad: [
            { dia: ago(2), horaInicio: '11:00', horaFin: '13:00' }
          ],
          citaOriginalId: 'old-001', notas: 'Auto-archivada por inactividad'
        }
      ],

      audit: [],

      folios: {
        'Elena Castillo': 'F-EC-DEMO',
        'Luis García': 'F-LG-DEMO'
      },

      config: {
        notificaciones: 'habilitado',
        tiempoEspera: 15,
        maxReprogramaciones: 3
      }
    };
  }

  /* ──────────────────────────────────────────────────────────
     INICIALIZACIÓN — seed si es primera vez
  ────────────────────────────────────────────────────────── */
  function seedIfNeeded() {
    if (read(KEYS._initialized)) return;
    const seed = getSeedData();
    write(KEYS.terapeutas,  seed.terapeutas);
    write(KEYS.pacientes,   seed.pacientes);
    write(KEYS.salas,       seed.salas);
    write(KEYS.eventos,     seed.eventos);
    write(KEYS.solicitudes, seed.solicitudes);
    write(KEYS.inbox,       seed.inbox);
    write(KEYS.audit,       seed.audit);
    write(KEYS.folios,      seed.folios);
    write(KEYS.config,      seed.config);
    write(KEYS._initialized, true);
  }

  function resetDB() {
    Object.values(KEYS).forEach(k => localStorage.removeItem(k));
    seedIfNeeded();
  }

  /* ──────────────────────────────────────────────────────────
     INICIALIZAR
  ────────────────────────────────────────────────────────── */
  seedIfNeeded();

  /* ──────────────────────────────────────────────────────────
     API PÚBLICA
  ────────────────────────────────────────────────────────── */
  return {
    terapeutas:  makeCollection(KEYS.terapeutas),
    pacientes:   makeCollection(KEYS.pacientes),
    salas:       makeCollection(KEYS.salas),
    eventos:     makeCollection(KEYS.eventos),
    solicitudes: makeCollection(KEYS.solicitudes),
    inbox:       makeCollection(KEYS.inbox),
    audit:       makeCollection(KEYS.audit),
    folios:      foliosAPI,
    config:      configAPI,
    resetDB,
    /** Utilidad: obtener nombres de salas como array de strings */
    getSalasNombres() {
      return this.salas.getAll().map(s => s.nombre);
    },
    /** Utilidad: obtener terapeutas filtrados por tipo de evento */
    getTerapeutasPorTipo(tipoEvento) {
      // tipo 1 = Evaluación (tipo1), tipo 2 = Terapia (tipo2)
      const tipoFiltro = tipoEvento === 1 || tipoEvento === '1' ? 'tipo1' : 'tipo2';
      return this.terapeutas.getAll().filter(t => t.tipo === tipoFiltro).map(t => t.nombre);
    },
    /** Utilidad: obtener nombres de pacientes */
    getPacientesNombres() {
      return this.pacientes.getAll().map(p => p.nombre);
    }
  };
})();
