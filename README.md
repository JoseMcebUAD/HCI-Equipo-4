# HCI-Equipo-4

## User Research

#### **User Research Brief**

Currently, the psychological care system is under development with the objective of facilitating the management of clinical and administrative services within the institution. One of these key components in the system is appointment scheduling, which will be mainly used by the administrative staff in charge of managing appointments between patients and the psychologists available on rotation.

Since this functionality involves critical tasks such as schedule assignment, specialist availability, and the management of sensitive patient data, it is essential that the system interface is intuitive, efficient, and easy to use, aiming to minimize human errors and reduce the time required to complete the scheduling process.

The purpose of this User Research is to identify some of the problems that the administrative staff in charge of scheduling appointments for psychological care may face when interacting with the system. Although several of these issues may overlap with other functionalities and different departments, this research will focus only on this staff and specifically at the moment of using this system functionality.

With this research, we seek to answer some questions that will help us establish the usability requirements of this functionality. Through the research methods we conduct, we aim to obtain answers to questions that:

#### - **Efficiency and Workflow**

- **How long does it take the user to complete the scheduling process?**
- **Are there any unnecessary steps in the process?**
- **Is the scheduling workflow clear for the user?**

#### - **Ease of Use**

- **Does the user easily understand how to register a new appointment?**
- **Is it intuitive for them to check patient/specialist availability?**
- **In the case of both correct and incorrect use, can the user detect it?**

#### - **User Experience**

- **Does the user find it necessary and feel comfortable adapting to this new system?**
- **What are the most common difficulties when performing the process?**
- **What functionalities do they consider unnecessary or, instead, missing from the system?**

For this type of research, we will need methods to collect the necessary information about the system’s issues. Some of the methods we will use are:

#### - **Usability Testing**

We will observe how our users interact with the product in order to identify whether they can successfully complete specific tasks.

**Advantages:**
- It will allow us to identify problems directly during interaction.

**Disadvantages:**
- For our work team, applying these tests would result in high costs and time consumption, so although it is a reliable method, applying it in our context may be tedious.

#### - **User Interviews**

We will interview some users to learn about their experiences with this functionality.

**Advantages:**
- They will help us understand users needs, expectations, and frustrations with the system.

**Disadvantages:**
- Finding and applying this method to a feasible sample population is unlikely.

#### - **Heuristic Evaluations**

Based on Jakob Nielsen’s 10 heuristics, we can identify problems in user interfaces.

**Advantages:**
- It is a quick method that will save us time and costs.

**Disadvantages:**
- Not being fully familiar with these heuristics may cause the results to be biased by our team's experience with them.



### Functional Requirements

| Requirement | Description |
|-------------|-------------|
| 1. Appointment Scheduling Time | Administrative staff should be able to schedule a complete psychology consultation appointment in less than five minutes, provided that all necessary information is available. |
| 2. Visibility of Main Functions | The main screen should clearly display the essential actions, such as creating, editing, or canceling appointments, without requiring unnecessary navigation. |
| 3. Required Field Validation | The system should ensure that all required information is completed before allowing an appointment to be saved. |
| 4. Prevention of Scheduling Conflicts | The system should prevent double-booking by ensuring that a psychologist cannot be assigned to more than one appointment at the same date and time. |
| 5. Clear Error Messages | When an error occurs, the system should clearly explain what went wrong and guide the user on how to correct it, using simple and understandable language. |
| 6. Readable Text and Visual Comfort | The interface should use text that is easy to read, with an appropriate font size and clear contrast, suitable for users across different age ranges. |
| 7. Keyboard Accessibility | Users should be able to complete all main tasks using only the keyboard, without depending entirely on a mouse. |
| 8. Simple and Non-Technical Language | The system should use clear, everyday language related to administrative tasks in psychology services, avoiding technical or system-related terminology. |
| 9. Clear Confirmation of Actions | After successfully completing an action, such as creating or updating an appointment, the system should provide a clear visual confirmation. |
| 10. Standard Date Format | All dates should be displayed and entered using the local format (dd/mm/yyyy) to avoid confusion. |
### Usability Requirements

| Requirement | Description | Priority |
|-------------|-------------|----------|
| 1. Appointment Scheduling Time | Administrative staff should be able to schedule a complete psychology consultation appointment in less than five minutes, provided that all necessary information is available. | High |
| 2. Visibility of Main Functions | The main screen should clearly display the essential actions, such as creating, editing, or canceling appointments, without requiring unnecessary navigation. | High |
| 3. Required Field Validation | The system should ensure that all required information is completed before allowing an appointment to be saved. | High |
| 4. Prevention of Scheduling Conflicts | The system should prevent double-booking by ensuring that a psychologist cannot be assigned to more than one appointment at the same date and time. | High |
| 5. Clear Error Messages | When an error occurs, the system should clearly explain what went wrong and guide the user on how to correct it, using simple and understandable language. | Medium |
| 6. Readable Text and Visual Comfort | The interface should use text that is easy to read, with an appropriate font size and clear contrast, suitable for users across different age ranges. | Medium |
| 7. Keyboard Accessibility | Users should be able to complete all main tasks using only the keyboard, without depending entirely on a mouse. | Low |
| 8. Simple and Non-Technical Language | The system should use clear, everyday language related to administrative tasks in psychology services, avoiding technical or system-related terminology. | Medium |
| 9. Clear Confirmation of Actions | After successfully completing an action, such as creating or updating an appointment, the system should provide a clear visual confirmation. | High |
| 10. Standard Date Format | All dates should be displayed and entered using the local format (dd/mm/yyyy) to avoid confusion. | Medium |


### Functional Requirments
| ID    | Requirement                                                                                                                                                                                                                                                                               |
| ----- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FR-01 | The system shall allow **Event Capture** with the fields: event type, patient, therapist, folio, date, start time, duration, room, payment receipt, fee amount, and reason/notes (optional). Fields shall be shown or hidden depending on the event type and whether payment is required. |
| FR-02 | The system shall allow **Agenda Visualization** in day, week, and month views with color-coded time slots, including the option to open the event capture form.                                                                                                                           |
| FR-03 | The system shall allow **Agenda Consultation** by applying filters on: therapist, room, date range, and event status.                                                                                                                                                                     |
| FR-04 | The system shall allow **Event Editing** modifying the fields: event type, date, time, therapist, room, duration, and reason.                                                                                                                                                             |
| FR-05 | The system shall allow **Event Cancellation** by updating the status to canceled in the agenda and requiring a cancellation reason.                                                                                                                                                       |
| FR-06 | The system shall allow management of **Appointment Requests** through an inbox showing patient, event type, and requested date, with actions to accept, reject, or open the capture form to confirm a new event.                                                                          |
| FR-07 | The system shall allow management of **Rescheduling Requests** through an inbox showing patient, event type, and proposed new date, with actions to accept, reject, or open the edit form to reassign the appointment.                                                                    |
| FR-08 | The system shall allow **User Search** to autocomplete patient and therapist fields using name, ID, or phone number.                                                                                                                                                                      |
| FR-09 | The system shall allow viewing a **Patient Summary** including: contact data, last 5 appointments, relevant notes, and a link to the full record.                                                                                                                                         |

# Definición Formal de User Research - Módulo de Agenda (Análisis Integral)
## 1. Definición del Proyecto: Módulo de Agenda
Este módulo se enfoca en la gestión digital de la disponibilidad y atención de pacientes en la clínica, orientado exclusivamente al **Personal Administrativo** (Secretarias y Coordinadores).
### A. Relevancia Social
*   **Acceso a la Salud Mental:** La agenda es la puerta de entrada al servicio. Un sistema ineficiente crea cuellos de botella que retrasan la atención de personas en crisis o situación de vulnerabilidad.
*   **Sostenibilidad y Equidad:** Al gestionar eficientemente las cuotas socioeconómicas (mínima de $50 MXN) y los horarios, se garantiza que la clínica pueda atender a un mayor volumen de población de escasos recursos de manera organizada.
*   **Impacto Comunitario:** La digitalización permite generar estadísticas (ingresos, edades, motivos de consulta) que son fundamentales para que la Facultad y Vinculación justifiquen la importancia social del servicio y busquen apoyos.
### B. Innovación
*   **Ruptura del Modelo Manual:** A diferencia de procesos previos basados en bitácoras físicas o llamadas telefónicas sin registro centralizado, esta propuesta introduce una **"Fuente Única de Verdad"** digital.
*   **Diferenciación Operativa:**
    *   *Antes:* Reprogramaciones manuales propensas a errores y falta de seguimiento de inasistencias.
    *   *Ahora:* Automatización de reglas de negocio (ej. cancelación automática tras 20 min) y notificaciones digitales (WhatsApp/Correo) ante imprevistos.
*   **Integración de Datos:** El sistema busca eliminar la doble captura de datos (manual y luego a SPSS), innovando en el flujo de trabajo administrativo para reducir el error humano.
### C. Factibilidad
*   **Fortalezas del Equipo:**
    *   Conocimiento profundo del dominio clínico.
    *   Capacidad técnica para el desarrollo de módulos modulares (HTML/JS).
*   **Debilidades y Desafíos:**
    *   *Resistencia al Cambio:* Usuarios con más de 15 años en el puesto pueden percibir el sistema como una amenaza o una carga extra.
    *   *Limitaciones de Infraestructura:* Dependencia de la estabilidad de la red y el hardware de la facultad.
*   **Retos desde HCI/Producto:**
    *   **Usabilidad Crítica:** La interfaz debe ser extremadamente simple ("a prueba de errores") para facilitar la transición digital.
    *   **Gestión de Jerarquías:** Implementar un control de acceso que respete la cadena de mando (Administración ejecuta / Coordinación autoriza) para evitar bloqueos operativos.
## 2. Metodología de User Research Aplicada
Para validar estos puntos, se emplearon:
*   **Entrevistas Semiestructuradas:** Diálogos con coordinadoras para extraer requerimientos de relevancia social y operativa.
*   **Análisis de Stakeholders:** Identificación del Personal Administrativo como usuario primario crítico para la factibilidad del proyecto.
*   **Mapeo de Hallazgos (Findings):** Documentación de puntos de dolor específicos de la agenda actual para guiar la innovación.

### Persona

### Blacklog

### Wishlist

Human Computer Interaction
