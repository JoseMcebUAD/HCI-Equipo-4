**USABILITY TEST REPORT**

Scheduling System — Agenda Module

Participant: Selene Romero | Profile: Homemaker (56 years old)

Session Duration: ~19 minutes | Protocol: Think-Aloud

Date: May 2026

**1. Complete Interview Summary**

The session lasted 19 minutes and 31 seconds and was conducted under the think-aloud protocol. The participant, Selene Romero, has a profile unrelated to the work carried out by the School of Psychology. She is 56 years old and has no prior experience with basic Word and Excel.

The evaluator presented the system prior to the test as an appointment management tool and instructed the participant to perform tasks sequentially while verbalizing her mental process. The tasks covered were:

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

**Save / confirm button not found**

During appointment creation, the participant could not locate the confirmation button. The main CTA lacks visual prominence and intuitive positioning. 
Use Cases: UC-AG-01 | Affected Metrics: M-01, M-02, M-04

**Incorrect date in appointment rescheduling**

The participant entered a date different from the previously selected one, when her intention was only to modify the time. The system did not detect the error proactively. It was necessary to resume the appointment rescheduling, generating an increase in time during the test. 
Use Case: UC-AG-01 | Affected Metrics: M-01, M-03

**Failure to identify appointment from the calendar grid**

When trying to reschedule an appointment directly from the grid, the participant failed to identify the correct cell. The evaluator had to briefly explain how selecting a week from the calendar works in order to access the appointments in the grid. 
Use Case: UC-AG-01 (alternative flow) | Affected Metrics: M-01, M-03

**2.2 Emotional and Attitudinal Experience**

* Appointment deletion was executed quickly, suggesting that direct, single-action flows present less analytical load than modification or rescheduling processes.

**3. Metrics Summary (M-01 to M-05)**

The values are qualitative estimates derived from the analysis of the session transcript. A deduction criterion was applied according to the evaluation protocol since no instrumented quantitative data was available.

| **ID** | **Description** | **Threshold** | **Estimated Value** | **Result** |
| :--- | :--- | :--- | :--- | :--- |
| M-01 | Avoidable error rate | ≤ 5% | ~10% | **DOES NOT MEET** |
| M-02 | Error recovery time | Mean ≤ 30 s | ~30 s | **MEETS** |
| M-03 | Completion rate without restart | ≥ 90% | ~90% | **MEETS** |
| M-04 | Perceived confidence before confirming | ≥ 4.0 / 5 | ~4.5 / 5 | **MEETS** |
| M-05 | Autonomous error resolution rate | ≥ 85% | ~80% | **DOES NOT MEET** |

**3.1 Detailed Metrics Analysis**

**M-01 — Avoidable error rate (threshold: ≤ 5%)**
At least 3 different errors were identified despite the system having preventive mechanisms available: incorrect date rescheduling appointment, unidentified calendar slot, save button not found. Estimated value: ~10%. DOES NOT MEET.

**M-02 — Error recovery time (threshold: mean ≤ 30 s)**
In the recorded episodes, the participant took approximately 30 seconds or less to recover with the evaluator's guidance. Without intervention, the time would have been indeterminate. Estimated value: ~30 s. MEETS.

**M-03 — Completion rate without restart (threshold: ≥ 90%)**
Of the 7 tasks evaluated, at least 1 required direct guidance relatively equivalent to an assisted restart: verifying the record in the Audit section (reorientation to finish the task). Estimated value: ~90%. MEETS.

**M-04 — Perceived confidence before confirming (threshold: ≥ 4.0 / 5)**
The participant did not show uncertainty before each confirmation. She verbalized certainty about the outcome of her actions. Estimated Likert score: ~4.5/5. MEETS.

**M-05 — Autonomous error resolution rate (threshold: ≥ 85%)**
Most errors did not require direct intervention from the evaluator. The incorrect date rescheduling appointment was resolved with relative autonomy, while the unidentified calendar slot and the save button not found required brief explanations from the evaluator. There were several minor errors not mentioned in the error rate that caused the test to extend but only required a little time for the participant to analyze the solution. Approximately 80% of errors were resolved without assistance. Estimated value: ~80%. DOES NOT MEET.

**4. Use Case Summary**

| **Use Case** | **Task** | **Result** | **Observations** |
| :--- | :--- | :--- | :--- |
| UC-AG-01 | Therapy appointment creation | Completed with guidance | Did not find Save/Confirm button; required brief explanation from the evaluator |
| UC-AG-02 | Rescheduling an existing appointment | Completed | Confused the date, but solved it autonomously |
| UC-AG-03 | Appointment cancellation | Completed | Most fluid task |
| UC-AG-04 | Inbox / incoming requests | Partial - no data | No requests in the system; full flow could not be evaluated |
| UC-AG-06 | Agenda filtering | Completed with guidance | Required brief explanation from the evaluator to reset filters |
| UC-AG-01 (2nd) | Creation from calendar grid | Completed | Identified how to create an appointment from the calendar without problems |

**5. Main Recommendations**

* Increase the prominence of the Save/Confirm button: larger size, contrasting color, and fixed position that does not require scrolling down to find it.
* Add visual indicators to the calendar buttons: highlight the buttons that change the month or week of the calendar grid.
* Implement real-time date validation when rescheduling: show immediate confirmation when selecting a date to reduce input errors.
* Add visual indicators to the filtering buttons: highlight filtering controls so they are easy to identify.
* Consider contextual tooltip pop-ups for new users, with brief indications of the controls, especially for the calendar which can be the most confusing to navigate.
