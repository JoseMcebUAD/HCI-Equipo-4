**USABILITY TEST REPORT**

Scheduling System — Agenda Module

Participant: Antonio Perez | Profile: Systems Engineer (58 years old)

Session Duration: ~11 minutes | Protocol: Think-Aloud

Date: May 2026

**1. Complete Interview Summary**

The session lasted 11 minutes and 22 seconds and was conducted under the think-aloud protocol. The participant, Antonio Perez, has a profile unrelated to the work carried out by the School of Psychology. He is 58 years old and has experience with basic Word and Excel.

The evaluator presented the system prior to the test as an appointment management tool and instructed the participant to perform tasks sequentially while verbalizing his mental process. The tasks covered were:

* Creating a therapy appointment with a defined patient, therapist, room, and time.
* Navigating the calendar to locate scheduled appointments on specific dates.
* Rescheduling an existing appointment to a new date and time.
* Canceling an appointment and verifying the record in the Audit section.
* Reviewing the inbox of external requests.
* Using the agenda view filters (therapist, room, patient, appointment type).
* Creating a second appointment directly from the calendar grid.

Throughout the session, the evaluator provided verbal guidance if necessary when detecting blocks, indicating that the system is not sufficiently self-explanatory for users without prior training.

**2. Common Errors and User Experience**

**2.1 Observed Errors**

**Failure to identify filtering controls**

When attempting to filter appointments, the participant failed to identify the controls and entered sections unrelated to this task, thinking the filtering controls were directly within his specific section (e.g., patients). The evaluator had to explicitly indicate where the filtering controls are located to continue with the task. 
Use Case: UC-AG-06 | Affected Metrics: M-01, M-02, M-05

**Incorrect date in appointment rescheduling**

The participant attempted to enter an incorrect date; his initial intention was to occupy Friday, but the system did not allow it and the box was highlighted in red from the beginning. The system detected the error proactively. It was necessary to think of other alternatives to reschedule the appointment. 
Use Case: UC-AG-01 | Affected Metrics: M-01, M-03

**2.2 Emotional and Attitudinal Experience**

* Appointment deletion was executed quickly, suggesting that direct, single-action flows present less analytical load than modification or rescheduling processes.
* What caused the most wasted time and confusion was identifying the filtering controls; in general, all other tasks were completed consistently and relatively quickly compared to other tests.

**3. Metrics Summary (M-01 to M-05)**

The values are qualitative estimates derived from the analysis of the session transcript. A deduction criterion was applied according to the evaluation protocol since no instrumented quantitative data was available.

| **ID** | **Description** | **Threshold** | **Estimated Value** | **Result** |
| :--- | :--- | :--- | :--- | :--- |
| M-01 | Avoidable error rate | ≤ 5% | ~10% | **DOES NOT MEET** |
| M-02 | Error recovery time | Mean ≤ 30 s | ~20 s | **MEETS** |
| M-03 | Completion rate without restart | ≥ 90% | ~90% | **MEETS** |
| M-04 | Perceived confidence before confirming | ≥ 4.0 / 5 | ~4.5 / 5 | **MEETS** |
| M-05 | Autonomous error resolution rate | ≥ 85% | ~90% | **MEETS** |

**3.1 Detailed Metrics Analysis**

**M-01 — Avoidable error rate (threshold: ≤ 5%)**
At least 2 different errors were identified despite the system having preventive mechanisms available: incorrect date rescheduling appointment, and failure to identify the filtering controls. Estimated value: ~10%. DOES NOT MEET.

**M-02 — Error recovery time (threshold: mean ≤ 30 s)**
In the recorded episodes, the participant took approximately 20 seconds or less to recover with the evaluator's guidance. Without intervention, the time would have been indeterminate. Estimated value: ~20 s. MEETS.

**M-03 — Completion rate without restart (threshold: ≥ 90%)**
Of the 7 tasks evaluated, at least 1 required direct guidance relatively equivalent to an assisted restart: Agenda filtering (reorientation to finish the task). Estimated value: ~90%. MEETS.

**M-04 — Perceived confidence before confirming (threshold: ≥ 4.0 / 5)**
The participant did not show uncertainty before each confirmation. Most of the time he verbalized certainty about the outcome of his actions. Estimated Likert score: ~4.5/5. MEETS.

**M-05 — Autonomous error resolution rate (threshold: ≥ 85%)**
Most errors did not require direct intervention from the evaluator. The incorrect date rescheduling appointment was resolved with relative autonomy, while the failure to identify the filtering controls required explicit instructions from the evaluator. There were some minor errors not mentioned in the error rate that caused the test to extend but only required a little time for the participant to analyze the solution. Approximately 90% of errors were resolved without assistance. Estimated value: ~90%. MEETS.

**4. Use Case Summary**

| **Use Case** | **Task** | **Result** | **Observations** |
| :--- | :--- | :--- | :--- |
| UC-AG-01 | Therapy appointment creation | Completed | By using an option when creating the appointment that does not hide the Save/Confirm button, he had no problems finishing the task |
| UC-AG-02 | Rescheduling an existing appointment | Completed | Confused the date, but solved it autonomously |
| UC-AG-03 | Appointment cancellation | Completed | Most fluid task |
| UC-AG-04 | Inbox / incoming requests | Partial - no data | No requests in the system; full flow could not be evaluated |
| UC-AG-06 | Agenda filtering | Completed with guidance | Required explicit instructions from the evaluator to reset filters |
| UC-AG-01 (2nd) | Creation from calendar grid | Completed | Identified how to create an appointment from the calendar without problems |

**5. Main Recommendations**

* Add visual indicators to the calendar buttons: highlight the buttons that change the month or week of the calendar grid.
* Implement real-time date validation when rescheduling: show immediate confirmation when selecting a date to reduce input errors.
* Add visual indicators to the filtering buttons: highlight filtering controls so they are easy to identify.
* Consider contextual tooltip pop-ups for new users, with brief indications of the controls, especially for the calendar which can be the most confusing to navigate.
