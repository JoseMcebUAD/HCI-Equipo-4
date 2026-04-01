# Use Cases: Scheduling Module (Revised)

This document reflects the refined set of use cases. Essential operations are preserved, redundant cases are merged, and supporting functions are integrated as included steps. A new use case for resource availability management has been added to ensure completeness.

---

### UC-AG-01: Appointment Creation
**Primary Actor:** Administrative Staff  
**Objective:** Register a new appointment by validating business rules, priorities, and resource availability.

#### Preconditions
1. The actor is authenticated with creation privileges.
2. The Patient, Therapist, and Room entities exist in the system.

#### Main Flow
1. The system receives the request with the data: session type (Evaluation or Therapy), patient, therapist, room, and time slot.
2. The system validates that the time slot falls on operational days (Monday to Friday) and within working hours.
3. The system verifies that neither the therapist nor the room has overlapping schedules in that time slot.
4. The system retrieves the patient’s context using UC-AG-09. If the patient has no prior appointments, the system returns an empty context (or a “no history” message) and continues normally.
5. If the type is "Therapy", the system requires the association of a valid proof of payment (PDF/JPG/PNG ≤ 5 MB).
6. The system assigns logical priority if the type is "Initial Evaluation".
7. Upon passing validations, the system generates a tracking ID (folio), persists the appointment with a **Scheduled** state, and blocks the availability of the resources.

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
3. The system validates that the patient has not exceeded the global `maxReschedulings` limit.
4. The system validates the availability of the room and therapist for the new time slot.
5. The system mutates the appointment state to **Rescheduled**, releases the original time block, and occupies the new block.
6. The system appends the event to the appointment's audit log.

#### Alternative Flows
- **B1 – Rule Violation:** If an overlap, weekend, exceeded rescheduling limit, or invalid resource schedule is detected → the system aborts the mutation and notifies the infringed rule.

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

### UC-AG-04: Processing Appointment Requests (Inbox)
**Primary Actor:** System (Background) / Administrative Staff  
**Objective:** Enqueue, audit, and resolve asynchronous patient requests for new appointments or rescheduling.

*This use case merges the previous UC-AG-04 (new appointment requests) and UC-AG-05 (rescheduling requests) into a single process.*

#### Preconditions
1. An external request arrives containing:
   - **For new appointment:** patient identifier, service type, proposed date/time.
   - **For rescheduling:** original appointment ID and proposed new date/time.

#### Main Flow
1. The system registers the request with a **Pending** state in the processing queue.
2. The system periodically evaluates the Time-To-Live (TTL) of the queued requests.
3. The administrative actor extracts a request from the queue to evaluate it (Accept, Modify, or Reject).
4. If "Accepted":
   - For a **new appointment** request, the system internally invokes the validations of **UC-AG-01**.
   - For a **rescheduling** request, the system verifies that the referenced appointment exists and is in a valid state, then invokes the validations of **UC-AG-02**.
5. Upon successful completion, the request mutates to a **Resolved** state and is removed from the active queue.

#### Alternative Flows
- **D1 – TTL Expiration:** If the request remains unattended for 7 days, the system automatically mutates it to **Archived** (optional).
- **E1 – Invalid Reference (rescheduling only):** If the original appointment does not exist or is not in a valid state → the system immediately mutates the request to **Rejected**.

#### Postconditions
Request queue updated and, if applicable, a new appointment created or an existing appointment rescheduled in the system.

---

### UC-AG-05: Bulk Contingency Rescheduling 
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
5. The system automatically injects the affected appointments into the **Rescheduling Requests** queue (UC-AG-04) to ensure future manual follow-up.
6. The system consolidates the transaction and logs the mass-affectation event in the audit trail.

#### Alternative Flows
- **F1 – Empty Scope:** If the inputted parameters do not intersect with any existing appointment → the system notifies the absence of collisions and terminates without altering records.

#### Postconditions
Affected appointments temporarily extracted from the active schedule, resources released, and follow-up queues populated.

---

### UC-AG-06: Schedule Querying & Filtering
**Primary Actor:** Administrative Staff, Therapists, Coordinator  
**Objective:** Retrieve subsets of appointments based on specific parameters for reading and management.

#### Preconditions
1. The actor possesses read permissions.

#### Main Flow
1. The system receives the filtering parameters: Therapist ID, Room ID, Date Range, or Appointment Status.
2. The system executes the query in the database applying the filters in combination.
3. The system returns the resulting dataset.

#### Alternative Flows
- **G1 – Empty Result:** No appointment matches the parameters → the system safely returns an empty dataset.

#### Postconditions
Delivery of queried information without mutation of records.

---

### UC-AG-07: Schedule Workload Calculation
**Primary Actor:** System / Administrative Staff  
**Objective:** Calculate the operational saturation of the clinical flow to generate load redistribution alerts.

#### Preconditions
1. A date range is defined for the calculation.

#### Main Flow
1. The system queries the total number of operational time slots (e.g., 09:00 to 18:00, 30-min intervals) within the requested range.
2. The system calculates the percentage of booked slots versus available slots.
3. The system categorizes the result: Low (< 25%), Medium (25% - 75%), High (> 75%).
4. If the occupancy exceeds 75%, the system generates a logical "Load Redistribution" alert (e.g., displayed on the schedule view or sent to administrators).

#### Postconditions
Return of occupancy metrics and alert state without altering persistent data.

---

### UC-AG-08: Resource Availability Management
**Primary Actor:** Administrator / Coordinator  
**Objective:** Define and maintain operational schedules for therapists and rooms, enabling accurate conflict detection during appointment creation and rescheduling.

#### Preconditions
1. The actor is authenticated with administrative privileges.

#### Main Flow
1. The actor selects a resource type (Therapist or Room) and a specific resource.
2. The system displays the current availability schedule (default working hours: Mon-Fri 09:00-18:00, if not overridden).
3. The actor defines or modifies:
   - Days of the week when the resource is available (e.g., Mon, Wed, Fri).
   - Specific time ranges per day (e.g., 10:00-12:00, 14:00-17:00).
   - Exceptions (e.g., vacations, maintenance, blocked days).
4. The system validates that the defined schedule does not conflict with already booked appointments for future dates (soft validation; conflicts trigger warnings).
5. The system persists the availability rules.

#### Alternative Flows
- **H1 – Conflict with Existing Appointments:** If the actor attempts to block a time slot where future appointments already exist → the system warns and requires confirmation before saving; appointments are not automatically canceled.

#### Postconditions
Availability rules updated; all subsequent scheduling validations (UC-AG-01, UC-AG-02) use the new rules.

---

### UC-AG-09: Patient Context Retrieval
**Primary Actor:** Administrative Staff, Therapists, Coordinator  
**Objective:** Retrieve a structured summary of a patient’s relevant data to support clinical and administrative workflows (e.g., appointment creation, session preparation, follow-up).

#### Preconditions
1. The patient’s unique identifier is valid.
2. The actor has read permissions to access patient data.

#### Main Flow
1. The system receives the patient’s identifier (e.g., folio, name, or ID number).
2. The system queries the patient database and aggregates:
   - Basic identification: full name, contact details, folio.
   - Global state: `Waitlist`, `Active`, or `Archived`.
   - Clinical history: the last 5 processed appointments (including dates, types, outcomes).
   - Relevant clinical notes (e.g., diagnoses, treatment plan summaries, alerts).
3. The system packages the information into a secure, read‑only payload.
4. The system returns the payload to the requesting actor.

#### Alternative Flows
- **I1 – Patient Not Found:** If the provided identifier does not match any patient record, the system returns an empty result with a notification indicating no match.

#### Postconditions
The patient’s data is delivered without any modification to the system state.

