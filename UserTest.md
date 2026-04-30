## Usability Tests — Scheduling System

---

### 1. General Design Considerations

The tests are designed to evaluate the five usability constructs defined in metrics M-01 through M-05, through scenarios that simulate real system use. Each task naturally activates the mechanisms whose effectiveness is being measured, without alerting the participant to what is specifically being observed.

|Parameter|Recommended value|
|---|---|
|**Participants**|5 to 8 users representative of the usage profile|
|**Duration per session**|60 to 75 minutes|
|**Modality**|In-person with observer, think-aloud protocol|
|**Recording**|Screen recording + audio + evaluator logbook|
|**Activated metrics**|M-01, M-02, M-03, M-04, M-05|

---

### 2. Participant Profile

|Field|Description|
|---|---|
|**Role**|Operational system user (receptionist, administrative assistant, or equivalent profile)|
|**Technological experience**|Regular use of management or scheduling applications; no technical background required|
|**Familiarity with the system**|None prior; first interaction during the session|
|**Exclusion criterion**|Participants who have been involved in the development or prior testing of the system|

---

### 3. Session Structure

|Phase|Estimated duration|Description|
|---|---|---|
|**Welcome and introduction**|5 min|Evaluator introduction, consent form signing, think-aloud protocol explanation|
|**Familiarization**|5 min|Participant freely navigates the system without an assigned task|
|**Task block**|40–50 min|Sequential execution of tasks T-01 through T-05|
|**Post-session questionnaire**|10 min|General perception questionnaire (SUS + specific questions)|
|**Closing interview**|5–10 min|Open-ended questions about difficulty points and overall satisfaction|

---

### 4. Evaluator Instructions

- Do not anticipate or guide the participant during tasks. Intervene only if the participant has been completely blocked for more than 3 minutes without progress, recording the instance as an unresolved error (M-05).
- Maintain a neutral attitude toward errors, frustration, or comments from the participant.
- Record in the logbook: every error committed, whether the system had a preventive mechanism available, the recovery time, and whether resolution was autonomous.
- Administer the M-04 Likert question immediately after each completed critical action, naturally: _"On a scale of 1 to 5, how clear was it to you what was going to happen before you confirmed?"_

---

### 5. Test Tasks

---

#### T-01: Schedule an Appointment Under Normal Conditions

|Field|Description|
|---|---|
|**Objective**|Establish the baseline for full scheduling workflow usage|
|**Activated metrics**|M-03 (completion rate), M-04 (confidence when confirming)|
|**Evaluated requirements**|RNF-US-05, RNF-US-06, RNF-US-07|
|**Instruction to participant**|_"Schedule an appointment for client John Smith next Tuesday at 10:00 AM for the general consultation service."_|
|**System condition**|The requested time slot is available; no conflicts exist|
|**Success criterion**|The participant completes the scheduling without restarting or abandoning the task|
|**What to observe**|Whether the participant reads the preventive warning before confirming; whether the confirmation dialog causes a pause or hesitation; whether the participant spontaneously checks the schedule status|
|**M-04 recording**|Administer Likert question immediately after the final confirmation|

---

#### T-02: Attempt to Schedule in an Occupied Slot and on a Past Date

|Field|Description|
|---|---|
|**Objective**|Verify whether prevention mechanisms stop the user from making selection errors without the need for reactive error messages|
|**Activated metrics**|M-01 (avoidable errors), M-03 (completion without restart)|
|**Evaluated requirements**|RNF-US-01, RNF-US-06|
|**Instruction to participant**|_"Schedule an appointment for client Mary Johnson. Choose the nearest available time slot for today or tomorrow."_|
|**System condition**|Several time slots during the day are occupied; a date prior to today is visible on the calendar|
|**Success criterion**|The participant selects a valid time slot without attempting to select an occupied slot or a past date|
|**What to observe**|Whether the participant tries to interact with disabled time slots; whether they notice the visual distinction between states; whether they need to explore to understand what is available|
|**M-01 recording**|Note every attempt to select an invalid option|

---

#### T-03: Correct Data Entered in a Previous Step Without Restarting

|Field|Description|
|---|---|
|**Objective**|Evaluate whether the user can amend a partial error within the workflow without losing accumulated progress|
|**Activated metrics**|M-02 (recovery time), M-03 (completion without restart), M-05 (autonomous resolution)|
|**Evaluated requirements**|RNF-US-03, RNF-US-04|
|**Instruction to participant**|_"Schedule an appointment for Charles Rivera on Thursday at 3:00 PM for the follow-up service. Before confirming, you will realize the service should be 'initial assessment', not 'follow-up'. Please correct it."_|
|**System condition**|The scheduling workflow has at least 3 steps; the error is intentionally introduced in the instruction|
|**Success criterion**|The participant corrects the selected service and completes the scheduling without restarting the workflow or losing data from other steps|
|**What to observe**|Whether the participant finds how to go back; whether previously entered data is preserved upon returning; whether they express frustration or confusion during the correction|
|**M-02 recording**|Start timer when the participant detects the error; stop when they resume the workflow with the corrected data|

---

#### T-04: Undo a Recently Executed Action

|Field|Description|
|---|---|
|**Objective**|Evaluate whether the user identifies and uses the undo option within the available time window|
|**Activated metrics**|M-02 (recovery time), M-05 (autonomous resolution)|
|**Evaluated requirements**|RNF-US-02|
|**Instruction to participant**|_"Delete the appointment for Anna Thompson on Friday. Immediately after, decide it was a mistake and undo the action."_|
|**System condition**|The undo option is available for 5 seconds after the deletion is executed|
|**Success criterion**|The participant locates and activates the undo option before the window expires, without evaluator assistance|
|**What to observe**|Whether the participant notices the undo notification spontaneously; how long they take to react; whether they express surprise or hesitation at the limited time window|
|**M-02 recording**|Record the time between the execution of the deletion and the activation of the undo option|
|**Note for evaluator**|If the participant does not react in time, allow the action to be confirmed and record it as not autonomously resolved (M-05). Do not warn about the available time.|

---

#### T-05: Recover from a System Error Message

|Field|Description|
|---|---|
|**Objective**|Evaluate whether error messages allow the user to understand what happened and resolve the situation without assistance|
|**Activated metrics**|M-02 (recovery time), M-05 (autonomous resolution)|
|**Evaluated requirements**|RNF-US-04|
|**Instruction to participant**|_"Try to schedule an appointment for Robert Davis on Monday at 9:00 AM."_|
|**System condition**|The selected time slot generates a conflict (another service occupies that block due to extended duration); the system displays an error message|
|**Success criterion**|The participant reads the message, understands the cause of the error, and selects a valid alternative time slot without requesting help|
|**What to observe**|Whether the participant reads the full message or closes it without reading; whether the message's instruction directly guides them to a solution; whether they express confusion about what to do next|
|**M-02 recording**|Start timer when the error message appears; stop when the participant executes a valid corrective action|
|**M-05 recording**|Note whether resolution was autonomous or required evaluator intervention|

---

### 6. Evaluator Logbook

For each session, the evaluator completes the following structure per task:

| Field                                   | T-01     | T-02     | T-03     | T-04     | T-05     |
| --------------------------------------- | -------- | -------- | -------- | -------- | -------- |
| **Task completed?**                     | Yes / No | Yes / No | Yes / No | Yes / No | Yes / No |
| **Restart or abandonment?**             | —        | —        | —        | —        | —        |
| **No. of avoidable errors (M-01)**      | —        | —        | —        | —        | —        |
| **Recovery time in seconds (M-02)**     | —        | —        | —        | —        | —        |
| **Error resolved autonomously? (M-05)** | —        | —        | —        | —        | —        |
| **Likert score M-04**                   | —        | N/A      | N/A      | N/A      | N/A      |
| **Qualitative observations**            |          |          |          |          |          |

---

### 7. Correspondence Between Tasks, Metrics, and Requirements

| Task                                      | Evaluated requirements          | Activated metrics |
| ----------------------------------------- | ------------------------------- | ----------------- |
| T-01: Schedule under normal conditions    | RNF-US-05, RNF-US-06, RNF-US-07 | M-03, M-04        |
| T-02: Attempt occupied slot / past date   | RNF-US-01, RNF-US-06            | M-01, M-03        |
| T-03: Correct data in a previous step     | RNF-US-03, RNF-US-04            | M-02, M-03, M-05  |
| T-04: Undo a recently executed action     | RNF-US-02                       | M-02, M-05        |
| T-05: Recover from a system error message | RNF-US-04                       | M-02, M-05        |
