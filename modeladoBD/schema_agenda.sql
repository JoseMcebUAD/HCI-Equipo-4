-- ==========================================
-- SCRIPT DDL: Módulo de Agenda
-- Proyecto: Clínica Web - Gestión de Expedientes
-- Autor: Equipo de Backend y Arquitectura
-- ==========================================

-- 1. TABLAS BASE DE PERSONAS (Patrón Table-per-Type)
CREATE TABLE Persons (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL
);

CREATE TABLE Patients (
    person_id INT PRIMARY KEY REFERENCES Persons(id),
    global_state VARCHAR(50) NOT NULL CHECK (global_state IN ('Waitlist', 'Active', 'Archived')),
    reschedule_count INT DEFAULT 0
);

CREATE TABLE Therapists (
    person_id INT PRIMARY KEY REFERENCES Persons(id),
    specialty VARCHAR(255) NOT NULL,
    operational_state VARCHAR(50) NOT NULL CHECK (operational_state IN ('Active', 'Intern'))
);

CREATE TABLE AdminUsers (
    person_id INT PRIMARY KEY REFERENCES Persons(id),
    role_description VARCHAR(100)
);

-- 2. TABLAS DEL CORE CLÍNICO Y AGENDA
CREATE TABLE Rooms (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Available' CHECK (status IN ('Available', 'Maintenance'))
);

CREATE TABLE Appointments (
    id SERIAL PRIMARY KEY,
    patient_id INT NOT NULL REFERENCES Patients(person_id),
    therapist_id INT NOT NULL REFERENCES Therapists(person_id),
    room_id INT NOT NULL REFERENCES Rooms(id),
    session_type VARCHAR(50) NOT NULL CHECK (session_type IN ('Evaluation', 'Therapy')),
    appointment_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('Scheduled', 'Rescheduled', 'Canceled', 'No-Show', 'Pending Rescheduling')),
    proof_of_payment_url VARCHAR(500),
    reschedule_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. TABLAS DE SOPORTE Y GESTIÓN ASÍNCRONA
CREATE TABLE Appointment_Requests (
    id SERIAL PRIMARY KEY,
    patient_id INT NOT NULL REFERENCES Patients(person_id),
    service_type VARCHAR(50) NOT NULL CHECK (service_type IN ('Evaluation', 'Therapy')),
    proposed_date DATE NOT NULL,
    proposed_start_time TIME,
    proposed_end_time TIME,
    request_status VARCHAR(50) NOT NULL DEFAULT 'Pending' CHECK (request_status IN ('Pending', 'Resolved', 'Archived', 'Rejected')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Audit_Logs (
    id SERIAL PRIMARY KEY,
    appointment_id INT NOT NULL REFERENCES Appointments(id),
    admin_actor_id INT NOT NULL REFERENCES AdminUsers(person_id),
    action VARCHAR(100) NOT NULL,
    reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Resource_Availability (
    id SERIAL PRIMARY KEY,
    therapist_id INT REFERENCES Therapists(person_id),
    room_id INT REFERENCES Rooms(id),
    day_of_week VARCHAR(20) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_exception BOOLEAN DEFAULT FALSE
);
