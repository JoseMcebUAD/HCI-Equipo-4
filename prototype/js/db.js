// Central Database Manager using LocalStorage
const DB_KEYS = {
    THERAPISTS: 'psico_therapists',
    ROOMS: 'psico_rooms',
    PATIENTS: 'psico_patients',
    EVENTS: 'agendaEvents',
    REQUESTS: 'agendaRequests'
};

const INITIAL_DATA = {
    THERAPISTS: [
        { id: 1, name: "Dr. Roberto Miller", specialties: ["Diagnóstico"], role: "Activo", phone: "5511223344", email: "roberto.m@clinica.com" },
        { id: 2, name: "Lic. Sarah Connor", specialties: ["Evaluación"], role: "Activo", phone: "5522334455", email: "sarah.c@clinica.com" },
        { id: 3, name: "Dra. Laura Pérez", specialties: ["Seguimiento"], role: "Activo", phone: "5533445566", email: "laura.p@clinica.com" }
    ],
    ROOMS: [
        { id: 1, name: "Sala A-01", status: "Disponible" },
        { id: 2, name: "Sala B-02", status: "Disponible" },
        { id: 3, name: "Sala C-03", status: "Disponible" }
    ],
    PATIENTS: [
        { id: 101, name: "Juan Pérez", email: "juan@mail.com", phone: "5512345678", service: "Diagnóstico", status: "Activo", folio: "#PT-1001" },
        { id: 102, name: "María García", email: "maria@mail.com", phone: "5587654321", service: "Evaluación", status: "Activo", folio: "#PT-1002" },
        { id: 103, name: "Carlos López", email: "carlos@mail.com", phone: "5599887766", service: "Seguimiento", status: "En Espera", folio: "#PT-1003" }
    ],
    REQUESTS: [
        { id: 1, patient: "Marcus Richardson", patientId: "#PT-8821", type: "Diagnóstico", dateObj: new Date().toISOString(), startHour: 10, status: "Urgente", category: "nueva" },
        { id: 2, patient: "Elena Vasquez", patientId: "#PT-7742", type: "Evaluación", dateObj: new Date().toISOString(), startHour: 14, status: "En Revisión", category: "nueva" },
        { id: 3, patient: "Roberto Gómez", patientId: "#PT-9910", type: "Seguimiento", dateObj: new Date().toISOString(), startHour: 9, status: "Pendiente", category: "nueva" }
    ]
};

const DB = {
    init() {
        // Initialize ONLY if keys don't exist (null)
        const initKey = (key, initial) => {
            if (localStorage.getItem(key) === null) {
                localStorage.setItem(key, JSON.stringify(initial));
            }
        };

        initKey(DB_KEYS.THERAPISTS, INITIAL_DATA.THERAPISTS);
        initKey(DB_KEYS.ROOMS, INITIAL_DATA.ROOMS);
        initKey(DB_KEYS.PATIENTS, INITIAL_DATA.PATIENTS);
        initKey(DB_KEYS.REQUESTS, INITIAL_DATA.REQUESTS);
        
        if (localStorage.getItem(DB_KEYS.EVENTS) === null) {
            localStorage.setItem(DB_KEYS.EVENTS, JSON.stringify([]));
        }
    },

    reset() {
        // Clear all relevant keys
        Object.values(DB_KEYS).forEach(key => localStorage.removeItem(key));
        // Re-initialize with default data
        this.init();
        // Refresh page to apply changes
        window.location.reload();
    },

    // --- GETTERS ---
    getTherapists() { return JSON.parse(localStorage.getItem(DB_KEYS.THERAPISTS) || '[]'); },
    getRooms() { return JSON.parse(localStorage.getItem(DB_KEYS.ROOMS) || '[]'); },
    getPatients() { return JSON.parse(localStorage.getItem(DB_KEYS.PATIENTS) || '[]'); },
    getEvents() { return JSON.parse(localStorage.getItem(DB_KEYS.EVENTS) || '[]'); },
    getRequests() { return JSON.parse(localStorage.getItem(DB_KEYS.REQUESTS) || '[]'); },

    // --- SETTERS ---
    saveTherapists(data) { localStorage.setItem(DB_KEYS.THERAPISTS, JSON.stringify(data)); },
    saveRooms(data) { localStorage.setItem(DB_KEYS.ROOMS, JSON.stringify(data)); },
    savePatients(data) { localStorage.setItem(DB_KEYS.PATIENTS, JSON.stringify(data)); },
    saveEvents(data) { localStorage.setItem(DB_KEYS.EVENTS, JSON.stringify(data)); },
    saveRequests(data) { localStorage.setItem(DB_KEYS.REQUESTS, JSON.stringify(data)); },

    // --- STATS HELPER ---
    getStats() {
        const patients = this.getPatients();
        const requests = this.getRequests();
        const events = this.getEvents();
        const rooms = this.getRooms();
        const therapists = this.getTherapists();

        return {
            activePatients: patients.filter(p => p.status === 'Activo').length,
            pendingRequests: requests.filter(r => r.status === 'Pendiente' || r.status === 'Urgente' || r.status === 'En Revisión').length,
            occupiedRooms: rooms.filter(r => r.status === 'Ocupada').length,
            totalTherapists: therapists.length,
            sessionsThisWeek: events.length // Mock or calculated
        };
    }
};

DB.init();
