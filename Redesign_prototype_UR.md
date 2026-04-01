# Usability Evaluation — Scheduling Module

Usability Evaluation
Scheduling Module
────────────────────────────────────────
Psychological Care Clinic
April 2026

---

## Table of Contents

1. Introduction
   - 1.1 Context
   - 1.2 Objective of the Evaluation
   - 1.3 Importance of the Three Requirements
2. Requirement 1: Visibility of Main Functions
   - 2.1 Criteria Evaluated
   - 2.1.1 Clear Labels, Consistent Iconography, Immediate Feedback
   - 2.1.2 Explicit States (Available/Occupied/Conflict/Recommended)
   - 2.1.3 Visual Confirmation Before Applying Changes
3. Requirement 2: Prevention of Agenda Conflicts
   - 3.1 Criteria Evaluated
   - 3.1.1 Do Not Confirm Appointment If Overlap Exists
   - 3.1.2 Conflicts Represented Visually
   - 3.1.3 Automatically Suggest Valid Alternatives
4. Requirement 3: Total Visibility of System Status
   - 4.1 Criteria Evaluated
   - 4.1.1 Simultaneously Visualize: Therapists, Rooms, Patient
   - 4.1.2 Show Occupied and Free Schedules
    -  .1.3 Show Restrictions and Prioritized Suggestions
   - 4.1.4 Real-Time Updated Information
5. Compliance Summary Table
6. Detail of Corrected Files
   - 6.1 agenda.html
   - 6.2 styles.css
   - 6.3 agenda.js

---

Note: This Table of Contents is generated via field codes. To ensure page number accuracy after editing, please right-click the TOC and select "Update Field."

---

# Usability Evaluation — Scheduling Module

—  —

## 1. Introduction

### 1.1 Context

Usability in clinical scheduling management systems is a critical factor that directly impacts the quality of patient care, the operational efficiency of administrative staff, and the prevention of errors that can have serious consequences in mental health care delivery. When healthcare professionals interact with scheduling software on a daily basis, even minor usability issues can compound into significant workflow disruptions, leading to missed appointments, double-booked sessions, and ultimately, a degradation of the therapeutic relationship between clinician and patient.

The rescheduling process—the reprogramming of psychological appointments—is one of the most frequent and sensitive tasks in a psychological care clinic. Patients may need to reschedule for personal reasons, emergencies, or by the therapist's decision. Each change to the schedule implies coordinating the availability of three simultaneous resources: the therapist, the room, and the patient. The complexity of this tripartite coordination means that scheduling systems must provide clear, intuitive interfaces that minimize cognitive load on administrative staff while ensuring that no conflicts arise from changes made to the calendar.

A system with poor usability in this context can generate undetected schedule conflicts, loss of critical information, frustration among administrative personnel, delays in patient care, and ultimately a negative experience for the patient. In mental health settings, where continuity of care and the therapeutic alliance are paramount, these usability shortcomings can directly affect treatment outcomes and patient well-being.

---

### 1.2 Objective of the Evaluation

This report presents the results of a usability evaluation focused on three fundamental requirements of the 11 established for the Rescheduling System of the Psychological Care Clinic. The evaluation was conducted through a systematic analysis of the prototype's interface against recognized usability heuristics, with particular attention to how well the system communicates its state, prevents errors, and supports users in completing scheduling tasks efficiently and accurately.

1. Requirement 1: Visibility of Main Functions — Ensure that all system actions and states are clearly visible to the user, providing immediate feedback and intuitive navigation throughout the scheduling interface.

2. Requirement 2: Prevention of Agenda Conflicts — Guarantee that the system actively prevents the creation of overlapping appointments and offers alternative solutions when conflicts are detected, reducing the cognitive burden on administrative staff.

3. Requirement 3: Total Visibility of System Status — Provide complete transparency about resource availability and applicable restrictions, enabling users to make informed scheduling decisions at a glance.

---

### 1.3 Importance of the Three Requirements

These three requirements are grounded in Nielsen's (1994) heuristic usability principles, particularly the principles of system status visibility, error prevention, and recognition over recall. In the clinical context, compliance with these principles not only improves the user experience but also prevents errors that can affect the continuity of psychological treatment. When a scheduling system fails to display clear status information, administrative staff may inadvertently book conflicting appointments, leading to disruptions in patient care that can undermine the therapeutic process.

The selection of these three requirements from the full set of eleven was driven by their direct impact on the most error-prone aspects of clinical scheduling. Visibility of functions ensures that users always know what actions are available and what state the system is in. Conflict prevention addresses the most common and costly category of scheduling errors. Total system visibility enables users to maintain situational awareness across all resources simultaneously, which is essential in a multi-resource scheduling environment where therapists, rooms, and patients must all be coordinated without conflicts.

---

## 2. Requirement 1: Visibility of Main Functions

This requirement evaluates whether the system clearly communicates to the user the available actions, the current state of interactive elements, and provides immediate feedback after each action. The visibility of system functions is one of the most fundamental usability principles, as it forms the foundation upon which all user interactions are built. Without clear visibility, users are left guessing whether their actions have been registered, what options are available to them, and what the current state of the system actually is.

---

### 2.1 Criteria Evaluated

#### 2.1.1 Clear Labels, Consistent Iconography, Immediate Feedback

BEFORE: There was no consistent icon system. Action buttons lacked an active state, which generated uncertainty about whether an action had been executed. There was no visual or textual feedback after saving changes, leaving users to wonder whether their modifications had been successfully applied to the system.

AFTER: SVG icons were implemented on all action buttons (save, cancel, reschedule). Visual active/hover/focus states were added for all interactive elements. Toast notifications were implemented to confirm each action performed by the user, providing immediate and clear feedback that reinforces the user's confidence in their interactions with the system.

Status: CORRECTED

---

#### 2.1.2 Explicit States (Available/Occupied/Conflict/Recommended)

BEFORE: Calendar cells lacked explicit states. Events were only displayed as colored blocks without indicating whether a space was available, occupied, in conflict, or was a system recommendation. This absence of state differentiation forced users to rely on memory or manual cross-referencing to understand the calendar's contents.

AFTER: Four differentiated visual states were implemented with specific colors: green (available), red (occupied), yellow (conflict), and blue (recommended). A legend bar was added to explain each state. Dedicated CSS classes were created: cell-available, cell-occupied, cell-conflict, and cell-recommended, establishing a consistent and extensible visual language for the calendar interface.

Status: CORRECTED

---

#### 2.1.3 Visual Confirmation Before Applying Changes

BEFORE: The system saved changes directly without requesting prior confirmation. There was no summary of the changes to be made before their application, which meant that users could inadvertently commit unintended modifications without any opportunity to review or cancel.

AFTER: A confirmation modal was implemented that displays a complete summary of the changes before saving. The modal includes cancel and confirm buttons, allowing the user to review and modify their decision before changes are applied to the schedule. This addition provides a critical safety net that prevents accidental data modifications.

Status: CORRECTED

---

## 3. Requirement 2: Prevention of Agenda Conflicts

This requirement evaluates the system's ability to actively prevent the creation of overlapping appointments in the schedule, visually represent existing conflicts, and offer automatic suggestions for alternative time slots. Conflict prevention is especially critical in clinical environments where scheduling errors can lead to patients arriving for appointments only to find that their therapist or room is unavailable, resulting in wasted time, frustration, and potential disruptions to treatment continuity.

---

### 3.1 Criteria Evaluated

#### 3.1.1 Do Not Confirm Appointment If Overlap Exists

BEFORE: A basic validation already existed through the validate() function that verified the existence of overlaps before confirming an appointment. However, the error messages were not sufficiently clear and were not integrated into the interface, relying instead on generic browser dialogs that disrupted the user's workflow.

AFTER: The existing validation was improved by incorporating inline error messages that appear directly next to the field with the problem, facilitating immediate identification of the conflict by the user. This contextual approach to error display follows established usability best practices by placing corrective information precisely where it is needed.

Status: COMPLIANT (improved)

---

#### 3.1.2 Conflicts Represented Visually

BEFORE: Conflicts were only communicated through popup alerts (alert()) that interrupted the user's workflow. There was no visual blocking of conflicting spaces in the calendar, meaning that after dismissing the alert, the conflict remained invisible in the interface.

AFTER: Inline validation messages (#validationMessages) were implemented to show errors directly in the interface. Field-level highlighting (has-error class) was added to visually indicate fields with problems. Cells with conflicts are marked with the cell-conflict class and a warning icon, making conflicts visible at a glance without disrupting the user's workflow.

Status: CORRECTED

---

#### 2.1.3 Automatically Suggest Valid Alternatives

BEFORE: There was no suggestion system. The user had to manually search for alternative time slots when a conflict was found, which was tedious and error-prone, especially during busy scheduling periods when multiple slots needed to be checked sequentially.

AFTER: The findAlternatives() engine was implemented to automatically search within the next 5 business days. Suggestions are prioritized by score, favoring the same day and early hours. Up to 6 suggestions are shown with priority labels: Best Option, Good Option, and Available. The user can apply any suggestion with a single click, dramatically reducing the time and effort required to resolve scheduling conflicts.

Status: CORRECTED

---

## 4. Requirement 3: Total Visibility of System Status

This requirement evaluates whether the system provides a complete and real-time view of the status of all resources involved in appointment scheduling: therapists, rooms, and patients. Total visibility of system status is essential in clinical scheduling because it enables administrative staff to make informed decisions quickly, without needing to switch between multiple screens or manually cross-reference information from different sources.

---

### 4.1 Criteria Evaluated

#### 4.1.1 Simultaneously Visualize: Therapists, Rooms, Patient

BEFORE: The calendar only showed existing events without any information about the availability of therapists, rooms, or patients for a given time slot. Users had to manually check each resource's schedule separately, which was time-consuming and prone to oversight.

AFTER: A real-time availability panel (#availabilityPanel) was implemented, displaying 3 informative cards with visual indicators: a green checkmark for available and a red cross for unavailable. The panel shows the availability of the therapist, room, and patient, and updates automatically with each change in the form fields, providing continuous situational awareness.

Status: CORRECTED

---

#### 4.1.2 Show Occupied and Free Schedules

BEFORE: Empty calendar cells were indistinguishable from available spaces, making it visually impossible to determine which time slots were free and which were occupied without manually checking each one against existing appointments.

AFTER: The renderCellStates() function was implemented to mark each cell with a green background (available) or red background (occupied). An integrated legend explains the meaning of each state, allowing the user to quickly identify available spaces across the entire calendar view at a glance.

Status: CORRECTED

---

#### 4.1.3 Show Restrictions and Prioritized Suggestions

BEFORE: There was no visualization of applicable restrictions, nor were alternative schedule suggestions displayed. The user had to infer the restrictions on their own, relying on experience and institutional knowledge that might not be available to all staff members.

AFTER: Validation messages now display restrictions inline, directly in the interface. Suggestion cards are shown prioritized by score with descriptive labels, facilitating quick and informed decision-making. This approach makes the system's logic transparent and accessible to all users regardless of their experience level.

Status: CORRECTED

---

#### 4.1.4 Real-Time Updated Information

BEFORE: System information only updated when changes were saved, meaning that the user worked with potentially outdated data during the rescheduling process. This lag between action and feedback created a risk of making decisions based on stale information.

AFTER: The runRealTimeChecks() function was implemented to execute with every change in any form field. The availability panel updates live, instantly reflecting the impact of each modification. Toast notifications confirm each action performed, keeping the user informed at all times and eliminating the risk of working with outdated data.

Status: CORRECTED

---

## 5. Compliance Summary Table

| Requirement     | Criterion                    | Original Status | Final Status         |
| --------------- | ---------------------------- | --------------- | -------------------- |
| 1. Visibility   | Labels and iconography       | Partial         | Corrected            |
| 1. Visibility   | Explicit states              | Non-compliant   | Corrected            |
| 1. Visibility   | Visual confirmation          | Non-compliant   | Corrected            |
| 2. Conflicts    | Prevent overlaps             | Compliant       | Compliant (improved) |
| 2. Conflicts    | Visual representation        | Non-compliant   | Corrected            |
| 2. Conflicts    | Automatic suggestions        | Non-compliant   | Corrected            |
| 3. Transparency | Simultaneous view            | Non-compliant   | Corrected            |
| 3. Transparency | Free/occupied schedules      | Non-compliant   | Corrected            |
| 3. Transparency | Restrictions and suggestions | Non-compliant   | Corrected            |
| 3. Transparency | Real-time updates            | Partial         | Corrected            |

---

Table 1: Summary of compliance status for each evaluated criterion

---

## 6. Detail of Corrected Files

### 6.1 agenda.html

Main interface file of the scheduling system.

1. Addition of the real-time availability panel (#availabilityPanel)
2. Implementation of the confirmation modal
3. Addition of validation messages (#validationMessages)
4. Addition of suggestions container (#suggestionsContainer)
5. Implementation of toast notifications (#toastContainer)
6. Inclusion of legend bar

---

### 6.2 styles.css

Main stylesheet of the system.

1. Definition of cell states
2. Interaction styles
3. Availability panel styles
4. Modal styles
5. Toast styles
6. Validation styles
7. Suggestion card styles
8. CSS variables

---

### 6.3 agenda.js

Business logic and controller.

1. renderCellStates()
2. runRealTimeChecks()
3. findAlternatives()
4. showConfirmationModal()
5. showToast()
6. validate() improvements
7. Availability panel logic
8. SVG icons integration
9. applySuggestion()

---

—  —
