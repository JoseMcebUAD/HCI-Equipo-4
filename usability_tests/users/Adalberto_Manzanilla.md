**USABILITY TEST REPORT**

Scheduling System — Agenda Module

Participant: Adalberto Manzanilla | Profile: Department Head (62 years old)

Session Duration: ~16 minutes | Protocol: Think-Aloud

Date: May 2026

**1\. Complete Interview Summary**

The session lasted 15 minutes and 42 seconds and was conducted under the think-aloud protocol. The participant, Adalberto Manzanilla, is a department head with over 30 years of experience using file and data management tools. He is 62 years old and has no prior familiarity with the School of Psychology's processes.

The evaluator introduced the system as a medical appointment management platform where the user's role is entirely administrative, responsible for creating, modifying, and cancelling appointments. The evaluator did not provide technical information about the system, leaving the participant to infer the workflow solely from information displayed in real time and the system's built-in prompts. The tasks addressed during the session were:

- Scheduling an appointment under normal conditions.
- Rescheduling an appointment (individual and bulk).
- Deleting (and recovering) appointments.
- Filtering appointments.
- Using buttons and navigating different interfaces.

**2\. Common Errors and User Experience**

**2.1 Observed Errors**

**Complete restart of the rescheduling flow**

During the rescheduling of an appointment, the participant accidentally cancelled the flow and had to re-enter all information from the beginning.

Use Case: UC-AG-02 | Affected Metrics: M-02, M-03, M-05

**"Undo" window not noticed after deleting an appointment**

After deleting an appointment, the participant did not perceive the temporary "Undo" notification window. As a result, the appointment was permanently lost.

Use Case: UC-AG-03 | Affected Metrics: M-04, M-05

**Disorientation in bulk rescheduling flow**

Upon entering the rescheduling interface, the participant showed uncertainty about how the workflow operated. He could not determine whether the action should be performed individually or all at once, saying: "I don't know if all of them need to be rescheduled manually, or if there's a button that does it all, or one by one…"

Use Case: UC-AG-05 | Affected Metrics: M-04, M-05

**Difficulty locating the "Reschedule" button**

The participant took approximately 17 seconds to identify the main rescheduling button. The top-level controls were not immediately perceived during most of the session.

Use Case: UC-AG-05 | Affected Metrics: M-01, M-02

**Logical bug in appointment rescheduling**

The participant detected a functional error: when rescheduling an appointment, the system correctly created the new one but kept the original appointment active in the previous time slot.

Use Case: UC-AG-02 | Affected Metrics: M-01, M-03

**2.2 Emotional and Attitudinal Experience**

- Constant disorientation in complex flows: the participant showed uncertainty especially during rescheduling processes, moving the cursor extensively across the screen in search of help elements or instructions.
- Need for contextual guidance: the participant expected visual support or in-interface instructions, stating: "There should be a sign here, or a guide, that tells me how to do this rescheduling."
- Undirected exploration: during several tasks the participant wandered within the system before making decisions, reflecting difficulty building a clear mental navigation model.
- Visible confusion body language: the participant showed visible disorientation through facial expressions and hand gestures.
- Greater fluency in simple tasks: appointment deletion was performed quickly, suggesting that direct, single-action flows impose less cognitive load than modification or rescheduling processes.

**3\. Metrics Summary (M-01 to M-05)**

The values are qualitative estimates derived from analysis of the session transcript and observed behavior. A deduction criterion was applied per the evaluation protocol in the absence of instrumented quantitative data.

| **ID** | **Description** | **Threshold** | **Estimated Value** | **Result** |     |
| --- | --- | --- | --- | --- | --- |
| M-01 | Avoidable error rate | ≤ 5% | ~15% | **DOES NOT MEET** |     |
| --- | --- | --- | --- | --- | --- |
| M-02 | Error recovery time | Mean ≤ 30 s | ~40-50 s | **DOES NOT MEET** |     |
| --- | --- | --- | --- | --- | --- |
| M-03 | Completion rate without restart | ≥ 90% | ~70% | **DOES NOT MEET** |     |
| --- | --- | --- | --- | --- | --- |
| M-04 | Perceived confidence before confirming | ≥ 4.0 / 5 | ~2.8 / 5 | **DOES NOT MEET** |     |
| --- | --- | --- | --- | --- | --- |
| M-05 | Autonomous error resolution rate | ≥ 85% | ~55% | **DOES NOT MEET** |     |
| --- | --- | --- | --- | --- | --- |

**3.1 Detailed Metrics Analysis**

**M-01 — Avoidable error rate (threshold: ≤ 5%)**

At least 3 avoidable errors were identified: the "Undo" window not perceived after deletion, ~17-second delay in locating the reschedule button, and disorientation during bulk rescheduling. A confirmed system bug (original appointment not removed after rescheduling) also contributed to observed error impact. Estimated value: ~15%. DOES NOT MEET.

**M-02 — Error recovery time (threshold: mean ≤ 30 s)**

The most significant recovery cost was the complete restart of the rescheduling flow, requiring the participant to re-enter all information from scratch. The 17-second delay in finding the reschedule button also elevated the average recovery time. Estimated value: ~40-50 s. DOES NOT MEET.

**M-03 — Completion rate without restart (threshold: ≥ 90%)**

Of the 10 tasks evaluated, T-04 (failed), T-08 (failed), and T-05, T-06, T-07, T-10 (not performed) were not satisfactorily completed. T-03 was completed with significant difficulties including a full flow restart. Estimated value: ~70%. DOES NOT MEET.

**M-04 — Perceived confidence before confirming (threshold: ≥ 4.0 / 5)**

The participant showed marked uncertainty during bulk rescheduling and did not perceive the "Undo" window, indicating low awareness of available system mechanisms. Expressions such as "I don't know if all of them need to be rescheduled manually…" reflect low confidence during critical actions. Estimated Likert score: ~2.8/5. DOES NOT MEET.

**M-05 — Autonomous error resolution rate (threshold: ≥ 85%)**

Most errors required either extended independent exploration or were unresolvable without evaluator guidance. The participant did not autonomously recover from the missing "Undo" window (appointment permanently deleted). Approximately 55% of errors were resolved without direct assistance. Estimated value: ~55%. DOES NOT MEET.

**4\. Use Case Summary**

| **Use Case** | **Task** | **Result** | **Observations** |
| --- | --- | --- | --- |
| UC-AG-01 (T-01) | Schedule an appointment under normal conditions | Completed | Completed appointment creation in 54 s without evaluator assistance |
| --- | --- | --- | --- |
| UC-AG-01 (T-02) | Attempt to schedule in a busy or invalid slot | Completed | Did not select invalid dates or time slots; system blocked the action correctly |
| --- | --- | --- | --- |
| UC-AG-02 (T-03) | Reschedule an appointment and correct selection during the process | Completed with difficulty | Accidentally cancelled the flow once and had to re-enter all data from scratch |
| --- | --- | --- | --- |
| UC-AG-03 (T-04) | Cancel an appointment and attempt to undo | Failed | Deleted the appointment in 5 s but did not notice the "Undo" window; appointment permanently lost |
| --- | --- | --- | --- |
| UC-AG-05 (T-05) | Recover from a system error message | Not performed | No specific error interpretation test was recorded during the session |
| --- | --- | --- | --- |
| UC-AG-04 (T-06) | Manage incoming appointment requests | Not performed | No evidence of interaction with the incoming request inbox was observed |
| --- | --- | --- | --- |
| UC-AG-02 (T-07) | Process a patient rescheduling request | Not performed | Approval/rejection flow for patient requests was not evaluated |
| --- | --- | --- | --- |
| UC-AG-05 (T-08) | Execute a bulk rescheduling for contingency | Failed | Participant did not understand the bulk rescheduling flow; could not complete the task |
| --- | --- | --- | --- |
| UC-AG-06 (T-09) | Review the agenda using filters | Completed | Performed filter-based searches in approximately the expected time |
| --- | --- | --- | --- |
| UC-AG-07 (T-10) | Review agenda workload and interpret indicators | Not performed | No interaction with workload indicators was observed during the session |
| --- | --- | --- | --- |

**5\. Main Recommendations**

- Increase the visual prominence of the "Undo" notification after deletion: increase its size, display duration, and contrast to ensure it is reliably perceived before the action becomes irreversible.
- Improve the hierarchy and visibility of the "Reschedule" button: promote it to a primary-level control that is immediately visible without requiring extensive cursor exploration.
- Add in-interface instructions for bulk rescheduling: provide a brief step-by-step guide or contextual tooltip explaining how the bulk workflow operates and how it differs from individual rescheduling.
- Fix the logical bug in rescheduling: ensure the original appointment is automatically cancelled when a new one is created through the rescheduling flow.
- Reduce cognitive load in multi-step workflows by clearly separating individual and bulk operations with distinct visual groupings and labels.
- Add explicit confirmation dialogs before irreversible actions such as permanent deletion to prevent accidental data loss.
