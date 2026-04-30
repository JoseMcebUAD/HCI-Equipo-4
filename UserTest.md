### 5. Test Tasks

---

#### T-01: Schedule an Appointment Under Normal Conditions

|Field|Description|
|---|---|
|**Objective**|Establish the baseline for the full scheduling workflow, verifying that the system correctly links all required resources|
|**Functional requirement**|FR-01|
|**Activated metrics**|M-03 (completion rate), M-04 (confidence when confirming)|
|**Evaluated NF requirements**|RNF-US-05, RNF-US-06, RNF-US-07|
|**Instruction to participant**|_"Schedule an appointment for patient John Smith with therapist Dr. Laura Green, in Room 2, next Tuesday at 10:00 AM for the general consultation service. The patient has already submitted their payment proof."_|
|**System condition**|The requested time slot is available for both the therapist and the room; no conflicts exist; payment proof is registered in the system|
|**Success criterion**|The participant completes the scheduling linking all five required elements (patient, therapist, room, time slot, payment proof) without restarting or abandoning the task|
|**What to observe**|Whether the system validates cross-availability automatically; whether the participant reads the preventive warning before confirming; whether the confirmation dialog causes hesitation; whether the participant spontaneously checks the schedule status|
|**M-04 recording**|Administer Likert question immediately after the final confirmation|

---

#### T-02: Attempt to Schedule in an Occupied Slot and on a Past Date

|Field|Description|
|---|---|
|**Objective**|Verify whether prevention mechanisms stop the user from making selection errors without the need for reactive error messages|
|**Functional requirement**|FR-01 (cross-availability validation)|
|**Activated metrics**|M-01 (avoidable errors), M-03 (completion without restart)|
|**Evaluated NF requirements**|RNF-US-01, RNF-US-06|
|**Instruction to participant**|_"Schedule an appointment for patient Mary Johnson with Dr. Laura Green. Choose the nearest available time slot for today or tomorrow."_|
|**System condition**|Several of Dr. Green's time slots are occupied; Room 1 has a conflict at the same time; a past date is visible on the calendar|
|**Success criterion**|The participant selects a valid time slot without attempting to select an occupied slot, a conflicting room, or a past date|
|**What to observe**|Whether the participant tries to interact with disabled time slots; whether they notice the visual distinction between states; whether resource conflicts (therapist vs. room) are clearly communicated|
|**M-01 recording**|Note every attempt to select an invalid option|

---

#### T-03: Reschedule an Appointment and Correct a Selection Midway

|Field|Description|
|---|---|
|**Objective**|Evaluate whether the user can modify an existing appointment and correct a partial error within the workflow without losing progress; verify that the rescheduling limit is communicated clearly|
|**Functional requirement**|FR-02|
|**Activated metrics**|M-02 (recovery time), M-03 (completion without restart), M-05 (autonomous resolution)|
|**Evaluated NF requirements**|RNF-US-03, RNF-US-04|
|**Instruction to participant**|_"Reschedule Charles Rivera's Thursday appointment to Friday at 3:00 PM with the same therapist. While doing so, you realize you selected the wrong room — correct it before confirming."_|
|**System condition**|The appointment exists in the system; Friday at 3:00 PM is available; the patient has not exceeded their rescheduling limit; multiple rooms are available to trigger the correction scenario|
|**Success criterion**|The participant corrects the room selection and completes the rescheduling without restarting the workflow or losing data from other steps|
|**What to observe**|Whether the system validates the new time block availability; whether the rescheduling limit counter is visible; whether previously entered data is preserved when going back to correct the room|
|**M-02 recording**|Start timer when the participant detects the wrong room selection; stop when they resume with the corrected data|
|**Additional scenario**|If time allows, attempt a rescheduling on a patient who has already reached the global rescheduling limit and observe whether the system communicates the restriction clearly|

---

#### T-04: Cancel an Appointment and Attempt to Undo

|Field|Description|
|---|---|
|**Objective**|Evaluate whether the user can complete a structured cancellation (actor + reason) and then identify the undo option within the available time window|
|**Functional requirement**|FR-03|
|**Activated metrics**|M-02 (recovery time), M-04 (confidence when confirming), M-05 (autonomous resolution)|
|**Evaluated NF requirements**|RNF-US-02, RNF-US-05|
|**Instruction to participant**|_"Cancel Anna Thompson's Friday appointment. The cancellation is being made by the receptionist due to room unavailability. Once cancelled, you decide it was a mistake — undo it."_|
|**System condition**|The cancellation form requires mandatory fields: canceling actor and reason; the undo option is available for 5 seconds after confirmation; room and therapist are immediately released upon cancellation|
|**Success criterion**|The participant fills in all mandatory cancellation fields, completes the confirmation, and activates the undo option before the window expires — all without evaluator assistance|
|**What to observe**|Whether the mandatory fields are clearly signaled; whether the participant understands that the undo reverses the resource release; whether the confirmation dialog conveys the irreversibility if the undo window passes|
|**M-04 recording**|Administer Likert question after the cancellation confirmation|
|**M-02 recording**|Record time between cancellation execution and undo activation|
|**Note for evaluator**|If the participant does not react to the undo window in time, allow the action to confirm and record as unresolved (M-05). Do not warn about the time limit.|

---

#### T-05: Recover from a System Error Message

|Field|Description|
|---|---|
|**Objective**|Evaluate whether error messages allow the user to understand what happened and resolve the situation without assistance|
|**Functional requirement**|FR-01 (overlap validation), FR-02 (availability validation on reschedule)|
|**Activated metrics**|M-02 (recovery time), M-05 (autonomous resolution)|
|**Evaluated NF requirements**|RNF-US-04|
|**Instruction to participant**|_"Try to schedule an appointment for Robert Davis on Monday at 9:00 AM with Dr. Mark Chen in Room 3."_|
|**System condition**|Dr. Chen is available but Room 3 has an extended session occupying that block; the system emits an error message indicating the specific conflict|
|**Success criterion**|The participant reads the message, identifies which resource is conflicting, and selects a valid alternative without requesting help|
|**What to observe**|Whether the participant reads the full message or closes it without reading; whether the message clearly identifies which resource caused the conflict (room vs. therapist); whether they express confusion about what to do next|
|**M-02 recording**|Start timer when the error message appears; stop when the participant executes a valid corrective action|
|**M-05 recording**|Note whether resolution was autonomous or required evaluator intervention|

---

#### T-06: Manage Incoming Appointment Requests

|Field|Description|
|---|---|
|**Objective**|Evaluate whether the user can process the incoming request inbox fluently, taking accept, modify, and reject actions without confusion, and whether the 7-day auto-archiving rule is clearly communicated|
|**Functional requirement**|FR-04|
|**Activated metrics**|M-01 (avoidable errors on wrong action), M-03 (completion without restart), M-04 (confidence when confirming)|
|**Evaluated NF requirements**|RNF-US-05, RNF-US-06, RNF-US-07|
|**Instruction to participant**|_"You have three new appointment requests in the inbox. Accept the first one as submitted. Modify the second one — the patient requested Monday at 2:00 PM, but that slot is taken; reassign it to the next available slot. Reject the third one and register the reason."_|
|**System condition**|Three requests are present in the inbox: one conflict-free, one with an unavailable slot, and one to be rejected; one additional request in the inbox is marked as expiring within 24 hours|
|**Success criterion**|The participant correctly processes all three requests without performing the wrong action on any of them and without abandoning the task|
|**What to observe**|Whether the three available actions (accept, modify, reject) are clearly distinguishable; whether the system shows the proposed date and patient data clearly enough to support confident decisions; whether the expiring request triggers a visible warning|
|**M-04 recording**|Administer Likert question after each of the three confirmations|

---

#### T-07: Process a Patient Rescheduling Request

|Field|Description|
|---|---|
|**Objective**|Evaluate whether the user can assess a rescheduling request by cross-referencing the original appointment with the proposed new date, and determine its feasibility without confusion|
|**Functional requirement**|FR-05|
|**Activated metrics**|M-02 (recovery time if wrong decision), M-03 (completion without restart), M-05 (autonomous resolution)|
|**Evaluated NF requirements**|RNF-US-06, RNF-US-07|
|**Instruction to participant**|_"A patient has requested to move their Wednesday appointment with Dr. Green to Friday at 11:00 AM. Review the request and approve or reject it based on what the system shows you."_|
|**System condition**|The original appointment exists; Friday at 11:00 AM is available for both the therapist and a compatible room; the system displays both the original and proposed slot side by side for comparison|
|**Success criterion**|The participant correctly evaluates feasibility using the information provided and reaches a decision without requesting external help|
|**What to observe**|Whether the side-by-side comparison of original vs. proposed slot is sufficient for decision-making; whether the participant attempts to navigate away to verify availability manually|
|**M-04 recording**|Administer Likert question after the approval or rejection confirmation|

---

#### T-08: Execute a Bulk Contingency Rescheduling

|Field|Description|
|---|---|
|**Objective**|Evaluate whether the user can correctly identify and batch-update affected appointments without accidentally including unaffected records, and whether the consequences of the action are clearly communicated before confirmation|
|**Functional requirement**|FR-06|
|**Activated metrics**|M-01 (avoidable errors on wrong selection), M-04 (confidence before confirming bulk action)|
|**Evaluated NF requirements**|RNF-US-05, RNF-US-07|
|**Instruction to participant**|_"Room 1 will be unavailable all day this Thursday due to maintenance. Mark all affected appointments as 'Pending Rescheduling' and release the associated resources."_|
|**System condition**|There are 6 appointments in Room 1 on Thursday and 2 appointments in Room 1 on Friday; the filter must be applied correctly to avoid affecting Friday records|
|**Success criterion**|The participant applies the bulk update exclusively to Thursday's Room 1 appointments (6 records) without including Friday's records, and confirms only after reviewing the scope of the action|
|**What to observe**|Whether the scope preview (how many records will be affected) is shown before confirmation; whether the participant pauses to verify the selection before confirming; whether they express uncertainty about which records are included|
|**M-04 recording**|Administer Likert question after the bulk confirmation|
|**M-01 recording**|Note if the participant confirms without reviewing the affected record count, or if they accidentally include Friday records|

---

#### T-09: Query the Schedule Using Filters

|Field|Description|
|---|---|
|**Objective**|Evaluate whether the user can retrieve specific appointment records efficiently using the available filters, and whether the results are presented clearly enough to support decisions|
|**Functional requirement**|FR-07|
|**Activated metrics**|M-03 (task completion), M-05 (autonomous resolution if filters produce unexpected results)|
|**Evaluated NF requirements**|RNF-US-06|
|**Instruction to participant**|_"Find all confirmed appointments assigned to Dr. Laura Green between Monday and Friday of the current week. Then, from those results, identify whether she has any appointments in Room 3."_|
|**System condition**|The schedule contains at least 15 appointments across the week; Dr. Green has 4 appointments, 2 of which are in Room 3; other therapists also have appointments in Room 3 during the same period|
|**Success criterion**|The participant retrieves Dr. Green's filtered results and correctly identifies the Room 3 appointments without browsing outside the filtered view|
|**What to observe**|Whether the filter fields (Therapist, Date Range, Status) are self-explanatory; whether the participant applies all filters in a single pass or iterates; whether the results display enough information to answer the second part of the task without further navigation|
|**M-05 recording**|Note whether the participant resolves unexpected filter results autonomously|

---

#### T-10: Review Schedule Workload and Interpret a Load Alert

|Field|Description|
|---|---|
|**Objective**|Evaluate whether the user can locate the workload indicator, interpret the occupancy percentage, and understand the meaning and recommended action of a redistribution alert|
|**Functional requirement**|FR-08|
|**Activated metrics**|M-04 (confidence interpreting the alert), M-05 (autonomous resolution of next action)|
|**Evaluated NF requirements**|RNF-US-06, RNF-US-07|
|**Instruction to participant**|_"Check the current workload status of the schedule. If any alert is active, tell us what it means and what you would do next."_|
|**System condition**|One therapist has occupancy above 75%, triggering a load redistribution alert; another therapist is below 50% occupancy; the workload view is accessible from the main schedule screen|
|**Success criterion**|The participant locates the workload indicator without assistance, correctly identifies which therapist triggered the alert, and describes a coherent next action|
|**What to observe**|Whether the workload percentage and alert threshold are immediately understandable; whether the alert message suggests a concrete action or leaves the user without direction; whether the participant connects the alert to the scheduling workflow naturally|
|**M-04 recording**|Administer Likert question after the participant interprets the alert: _"How clear was it to you what the system was asking you to do?"_|
|**M-05 recording**|Note whether the participant determines the next action autonomously or requires clarification|
