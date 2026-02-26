### Functional Requirements

| ID | Requirement |
| :--- | :--- |
| FR-01 | The system shall allow **'Appointment Scheduling'** by linking patient, therapist, room, valid operational time slot, and payment proof (in case of therapy), previously validating the cross-availability of resources to avoid overlaps. |
| FR-02 | The system shall allow **'Appointment Rescheduling'** by modifying the date, time, or assigned therapist data of an existing event, validating the availability of the new time block and verifying that the patient does not exceed their global limit of allowed reschedulings. |
| FR-03 | The system shall allow **'Appointment Cancellation'** by updating the event status to canceled through the mandatory registration of the data: canceling actor and reason, immediately releasing the availability of the room and therapist in the schedule. |
| FR-04 | The system shall allow **'New Appointment Request Management'** by processing an inbox with the patient's data, service type, and proposed date, allowing the actions to accept, modify, or reject, and automatically archiving requests that exceed 7 days without resolution. |
| FR-05 | The system shall allow **'Rescheduling Request Management'** by processing an inbox with the patients' petitions, evaluating the feasibility of the change by cross-referencing the original appointment ID with the new proposed date and time. |
| FR-06 | The system shall allow **'Bulk Contingency Rescheduling'** by batch-updating the status to "Pending Rescheduling" for all appointments that match the affected data: date, time block, room, or therapist, releasing the resources and queuing them for manual management. |
| FR-07 | The system shall allow **'Schedule Querying'** by retrieving appointment records through the application of filters on the data: Therapist ID, Room ID, Date Range, and Appointment Status. |
| FR-08 | The system shall allow **'Schedule Workload Calculation'** by evaluating the percentage of reserved time slots against operational time slots, generating a load redistribution alert if the calculated occupancy exceeds 75%. |
| FR-09 | The system shall allow **'Entity Search'** by locating records for the selection of active patients and therapists through matching data: Name, Unique Folio, or 10-digit Phone Number. |
| FR-10 | The system shall allow **'Patient Context Visualization'** by consolidating and displaying a summary with the data: contact information, general patient status, record of their last 5 appointments, and a reference identifier to their full clinical record. |
