# Diccionario de Datos - Módulo de Agenda

**Proyecto:** Clínica Web - Gestión de Expedientes
**Responsable:** Equipo de Backend y Arquitectura (Módulo Agenda)

Este documento define la estructura, tipos de datos y restricciones de las tablas correspondientes al módulo de Agenda. El diseño utiliza un patrón de herencia (Table-per-Type) para gestionar los roles de los usuarios y garantiza la integridad referencial necesaria para la prevención de colisiones en las citas.

---

## 1. Tablas Base (Personas y Roles)

### Tabla: `Persons`
Tabla padre para centralizar los datos de contacto y evitar redundancia.

| Campo | Tipo de Dato | Obligatorio | Descripción / Reglas de Negocio |
| :--- | :--- | :--- | :--- |
| `id` | Int | Sí (PK) | Identificador único autoincremental de la persona. |
| `name` | Varchar(255) | Sí | Nombre completo del usuario. |
| `email` | Varchar(255) | Sí | Correo electrónico de contacto (Debe ser Unique). |
| `phone` | Varchar(20) | Sí | Número de teléfono (a 10 dígitos). |

### Tabla: `Patients`
Datos y métricas específicas de los pacientes.

| Campo | Tipo de Dato | Obligatorio | Descripción / Reglas de Negocio |
| :--- | :--- | :--- | :--- |
| `person_id` | Int | Sí (PK/FK) | Llave foránea que referencia a `Persons.id`. |
| `global_state` | Varchar(50) | Sí | Estado del paciente. Valores permitidos: 'Waitlist', 'Active', 'Archived'. |
| `reschedule_count`| Int | No | Contador histórico de reprogramaciones del paciente. Valor por defecto: 0. |

### Tabla: `Therapists`
Datos específicos y estado operativo de los psicólogos/terapeutas.

| Campo | Tipo de Dato | Obligatorio | Descripción / Reglas de Negocio |
| :--- | :--- | :--- | :--- |
| `person_id` | Int | Sí (PK/FK) | Llave foránea que referencia a `Persons.id`. |
| `specialty` | Varchar(255) | Sí | Especialidad principal o enfoque del terapeuta. |
| `operational_state`| Varchar(50) | Sí | Estado operativo. Valores permitidos: 'Active', 'Intern'. |

### Tabla: `AdminUsers`
Usuarios con privilegios administrativos (recepción, coordinadores).

| Campo | Tipo de Dato | Obligatorio | Descripción / Reglas de Negocio |
| :--- | :--- | :--- | :--- |
| `person_id` | Int | Sí (PK/FK) | Llave foránea que referencia a `Persons.id`. |
| `role_description`| Varchar(100) | No | Descripción del cargo administrativo. |

---

## 2. Tablas del Core Clínico (Agenda)

### Tabla: `Rooms`
Gestión de los espacios físicos o consultorios.

| Campo | Tipo de Dato | Obligatorio | Descripción / Reglas de Negocio |
| :--- | :--- | :--- | :--- |
| `id` | Int | Sí (PK) | Identificador único autoincremental de la sala. |
| `name` | Varchar(100) | Sí | Nombre o número identificador del consultorio. |
| `status` | Varchar(50) | Sí | Disponibilidad física. Valores: 'Available', 'Maintenance'. |

### Tabla: `Appointments`
Registro oficial y motor de las sesiones programadas.

| Campo | Tipo de Dato | Obligatorio | Descripción / Reglas de Negocio |
| :--- | :--- | :--- | :--- |
| `id` | Int | Sí (PK) | Folio único de seguimiento de la cita. |
| `patient_id` | Int | Sí (FK) | Referencia al paciente (`Patients.person_id`). |
| `therapist_id` | Int | Sí (FK) | Referencia al terapeuta asignado (`Therapists.person_id`). |
| `room_id` | Int | Sí (FK) | Referencia a la sala asignada (`Rooms.id`). |
| `session_type` | Varchar(50) | Sí | Tipo de sesión. Valores: 'Evaluation', 'Therapy'. |
| `appointment_date`| Date | Sí | Fecha calendarizada de la sesión (Formato YYYY-MM-DD). |
| `start_time` | Time | Sí | Hora de inicio estipulada para el bloque. |
| `end_time` | Time | Sí | Hora de finalización estipulada para el bloque. |
| `status` | Varchar(50) | Sí | Estado del ciclo de vida. Valores: 'Scheduled', 'Rescheduled', 'Canceled', 'No-Show', 'Pending Rescheduling'. |
| `proof_of_payment_url`| Varchar(500)| No | Ruta del archivo adjunto. Obligatorio por lógica de negocio si `session_type` es 'Therapy'. |
| `reschedule_count`| Int | No | Veces que esta cita específica ha sido modificada. |
| `created_at` | Timestamp | Sí | Fecha y hora de creación del registro. |

---

## 3. Tablas de Soporte y Flujos Asíncronos

### Tabla: `Appointment_Requests`
Bandeja de entrada (Inbox) para peticiones de citas antes de ser aprobadas.

| Campo | Tipo de Dato | Obligatorio | Descripción / Reglas de Negocio |
| :--- | :--- | :--- | :--- |
| `id` | Int | Sí (PK) | Folio de la solicitud. |
| `patient_id` | Int | Sí (FK) | Referencia al paciente que realiza la solicitud. |
| `service_type` | Varchar(50) | Sí | Tipo de servicio solicitado: 'Evaluation', 'Therapy'. |
| `proposed_date` | Date | Sí | Fecha sugerida por el paciente. |
| `proposed_start_time`| Time | No | Hora de inicio sugerida (opcional). |
| `proposed_end_time`| Time | No | Hora de fin sugerida (opcional). |
| `request_status` | Varchar(50) | Sí | Estado de la solicitud. Valores: 'Pending', 'Resolved', 'Archived', 'Rejected'. |
| `created_at` | Timestamp | Sí | Fecha de creación. Utilizada por el sistema para calcular el Time-To-Live (TTL) de 7 días. |

### Tabla: `Audit_Logs`
Bitácora de seguridad para rastrear movimientos críticos (cancelaciones, contingencias).

| Campo | Tipo de Dato | Obligatorio | Descripción / Reglas de Negocio |
| :--- | :--- | :--- | :--- |
| `id` | Int | Sí (PK) | Identificador autoincremental del registro de auditoría. |
| `appointment_id` | Int | Sí (FK) | Referencia a la cita que sufrió la modificación. |
| `admin_actor_id` | Int | Sí (FK) | Referencia al administrador que ejecutó la acción. |
| `action` | Varchar(100) | Sí | Tipo de evento (ej. 'Cancelation', 'Contingency Reschedule'). |
| `reason` | Text | No | Motivo explícito de la acción. Obligatorio si la acción es una cancelación. |
| `created_at` | Timestamp | Sí | Fecha y hora exacta en la que se registró el movimiento. |

### Tabla: `Resource_Availability`
Gestión de horarios laborales y excepciones para validación de conflictos.

| Campo | Tipo de Dato | Obligatorio | Descripción / Reglas de Negocio |
| :--- | :--- | :--- | :--- |
| `id` | Int | Sí (PK) | Identificador único de la regla de disponibilidad. |
| `therapist_id` | Int | No (FK) | Referencia al terapeuta (Nulo si la regla aplica a una sala). |
| `room_id` | Int | No (FK) | Referencia a la sala (Nulo si la regla aplica a un terapeuta). |
| `day_of_week` | Varchar(20) | Sí | Día de aplicación (ej. 'Monday', 'Tuesday'). |
| `start_time` | Time | Sí | Hora de inicio del turno o bloque disponible. |
| `end_time` | Time | Sí | Hora de fin del turno o bloque disponible. |
| `is_exception` | Boolean | Sí | Define si es un horario regular (False) o una excepción/bloqueo como vacaciones (True). |
