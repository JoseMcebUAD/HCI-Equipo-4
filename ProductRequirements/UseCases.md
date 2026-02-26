# Use Cases: Scheduling Module

### UC-AG-01: Appointment Creation
**Primary Actor:** Administrative Staff  
**Objective:** Register a new appointment by validating business rules, priorities, and resource availability.

#### Preconditions
1. The actor is authenticated with creation privileges.
2. The Patient, Therapist, and Room entities exist in the system.

#### Main Flow
1. The system receives the request with the data: session type (Evaluation or Therapy), patient, therapist, room, and time slot.
2. The system validates that the time slot falls on operational days (Monday to Friday).
3. The system verifies in the resource registry that neither the therapist nor the room has overlapping schedules in that time slot.
4. If the type is "Therapy", the system requires the association of a valid proof of payment (PDF/JPG/PNG ≤ 5 MB).
5. The system assigns logical priority in the allocation if the type is "Initial Evaluation".
6. Upon passing validations, the system generates a tracking ID (folio), persists the appointment with a **Scheduled** state, and blocks the availability of the resources.

#### Alternative Flows
- **A1 – Weekend Restriction:** The requested date is a Saturday or Sunday → the system rejects the transaction.
- **A2 – Resource Conflict:** The room or therapist is already booked → the system rejects the transaction and indicates the conflict.
- **A3 – Missing Payment Proof:** It is a therapy session and no valid file was attached → the transaction is suspended until the requirement is met.

#### Postconditions
Appointment registered in the database and resource availability matrix updated.

---

### UC-AG-02: Existing Appointment Rescheduling
**Primary Actor:** Administrative Staff  
**Objective:** Mutate the temporal attributes or the assigned therapist of an appointment, maintaining referential and resource integrity.

#### Preconditions
1. The target appointment is in a **Scheduled** or **No-Show** state.
2. The actor possesses edit permissions.

#### Main Flow
1. The system receives the original appointment identifier and the new parameters (date, time, therapist).
2. The system validates operational restrictions (Mon-Fri, working hours) and ensures the new date does not exceed a 6-month future window.
3. The system validates that the patient has not exceeded the global `maxReprogramaciones` limit.
4. The system validates the availability of the room and therapist for the new time slot.
5. The system mutates the appointment state to **Rescheduled**, releases the original time block, and occupies the new block.
6. The system appends the event to the appointment's audit log.

#### Alternative Flows
- **B1 – Rule Violation:** If an overlap, weekend, or exceeded rescheduling limit is detected → the system aborts the mutation and notifies the infringed rule.

#### Postconditions
Appointment successfully altered, previous schedule block released, and audit log updated.

---

### UC-AG-03: Appointment Cancellation
**Primary Actor:** Administrative Staff  
**Objective:** Interrupt the lifecycle of an appointment and immediately release the retained clinical resources.

#### Preconditions
1. The appointment is currently in a **Scheduled** state.

#### Main Flow
1. The system receives the cancellation request for a specific appointment.
2. The system strictly requires the parameters: cancellation actor ("Who canceled") and reason.
3. The system mutates the appointment state to **Canceled**.
4. The system releases the retained time block for the corresponding Therapist and Room.
5. The system records the cancellation in the audit log.

#### Alternative Flows
- **C1 – Incomplete Parameters:** The reason or actor is not provided → the cancellation transaction is rejected.

#### Postconditions
Appointment rendered inactive and resource availability matrix released.

---

### UC-AG-04: New Appointment Requests Processing (Inbox)
**Primary Actor:** System (Background) / Administrative Staff  
**Objective:** Enqueue, audit, and resolve asynchronous patient requests to schedule new appointments.

#### Preconditions
1. An external request arrives containing the patient identifier, service type, and proposed date.

#### Main Flow
1. The system registers the request with a **Pending** state in the processing queue.
2. The system periodically evaluates the Time-To-Live (TTL) of the queued requests.
3. The administrative actor extracts a request from the queue to evaluate it (Accept, Modify, or Reject).
4. If "Accepted", the system internally invokes the **UC-AG-01** validations.
5. Upon successful completion, the request mutates to a **Resolved** state and is removed from the active queue.

#### Alternative Flows
- **D1 – TTL Expiration:** If the request remains unattended for 7 days, the system automatically mutates it to **Archived**.

#### Postconditions
Request queue updated and, if applicable, a new appointment created in the system.

---

### UC-AG-05: Rescheduling Requests Processing (Inbox)
**Primary Actor:** System / Administrative Staff  
**Objective:** Enqueue and resolve patient requests to mutate the date/time of previously established appointments.

#### Preconditions
1. A request arrives referencing an original appointment ID and a newly proposed date/time.

#### Main Flow
1. The system verifies the existence and valid state of the referenced appointment.
2. The system enqueues the request, associating it with the original data.
3. The administrative actor evaluates the request. If accepted, the system invokes the **UC-AG-02** validations.
4. The request transitions to a **Resolved** state.

#### Alternative Flows
- **E1 – Invalid Reference:** If the original appointment does not exist or was already completed/canceled → the system immediately mutates the request to **Rejected**.

#### Postconditions
Request processed and original appointment lifecycle altered if the petition was approved.

---

### UC-AG-06: Bulk Contingency Rescheduling
**Primary Actor:** Administrator / Coordinator  
**Objective:** Batch-suspend a block of scheduled appointments in the event of force majeure, protecting schedule integrity and releasing resources.

#### Preconditions
1. The actor is authenticated with administrative privileges.
2. There are appointments with a **Scheduled** state within the affected range.

#### Main Flow
1. The actor defines the contingency scope by supplying the affected parameters (specific date, time block, specific room, and/or specific therapist) and the force majeure reason (e.g., "Power Outage").
2. The system batch-identifies all appointments colliding with said parameters.
3. The system mass-mutates the state of the identified appointments to **Pending Rescheduling**.
4. The system releases the availability of the Therapist and Room in the resource matrix for those time blocks.
5. The system automatically injects the affected appointments into the **Rescheduling Requests (UC-AG-05)** queue to ensure future manual follow-up.
6. The system consolidates the transaction and logs the mass-affectation event in the audit trail.

#### Alternative Flows
- **F1 – Empty Scope:** If the inputted parameters do not intersect with any existing appointment → the system notifies the absence of collisions and terminates without altering records.

#### Postconditions
Affected appointments temporarily extracted from the active schedule, resources released, and follow-up queues populated.

---

### UC-AG-07: Schedule Querying & Filtering
**Primary Actor:** Administrative Staff, Therapists, Coordinator  
**Objective:** Retrieve subsets of appointments based on specific parameters for reading and management.

#### Preconditions
1. The actor possesses read permissions.

#### Main Flow
1. The system receives the filtering parameters: Therapist ID, Room ID, Date Range, or Appointment Status.
2. The system executes the query in the database applying the filters in combination.
3. The system returns the resulting dataset.

#### Alternative Flows
- **A1 – Empty Result:** No appointment matches the parameters → the system safely returns an empty dataset.

#### Postconditions
Delivery of queried information without mutation of records.

---

### UC-AG-08: Schedule Workload Calculation
**Primary Actor:** System / Administrative Staff  
**Objective:** Calculate the operational saturation of the clinical flow to generate load redistribution alerts.

#### Preconditions
1. A date range is defined for the calculation.

#### Main Flow
1. The system queries the total number of operational time slots (09:00 to 18:00, 30-min intervals) within the requested range.
2. The system calculates the percentage of booked slots versus available slots.
3. The system categorizes the result: Low (< 25%), Medium (25% - 75%), High (> 75%).
4. If the occupancy exceeds 75%, the system generates a logical "Load Redistribution" alert.

#### Postconditions
Return of occupancy metrics and alert state without altering persistent data.

---

### UC-AG-09: Resource Resolution & Matching (Search)
**Primary Actor:** System / Administrative Staff  
**Objective:** Locate entities (Patients or Therapists) via identifier matching to facilitate their association in the schedule.

#### Preconditions
1. Entities are registered in the system's database.

#### Main Flow
1. The system receives a query string (Name, unique Folio ID, or 10-digit phone number).
2. The system executes a partial or exact match search within the Patient and Therapist records.
3. If the search is for assigning a *new appointment*, the system filters and excludes Therapists whose operational state is not **Active** or **Intern**.
4. The system returns the data payload with the matched records.

#### Postconditions
Return of referential information without database alterations.

---

### UC-AG-10: Patient Context Aggregation
**Primary Actor:** System / Administrative Staff  
**Objective:** Consolidate and return a structured patient summary to inject context during the scheduling operational flow.

#### Preconditions
1. The patient's unique identifier is valid.

#### Main Flow
1. The system receives the patient's referential ID.
2. The system queries associated databases to extract: Folio, contact details, global state (`Waitlist`, `Active`, `Archived`), the last 5 processed appointments, and relevant clinical notes.
3. The system packages the information and includes the necessary identifier to resolve the full medical record.
4. The system returns the consolidated payload.

#### Postconditions
Delivery of structured data context in a secure, read-only format.
