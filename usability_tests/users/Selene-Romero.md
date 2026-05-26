**USABILITY TEST REPORT**

Scheduling System — Agenda Module

Participant: Selene Romero | Profile: Homemaker (56 years old)

Session Duration: ~19 minutes | Protocol: Think-Aloud

Date: May 2026

**1\. Complete Interview Summary**

The session lasted 19 minutes and 31 seconds and was conducted under the think-aloud protocol. The participant, Selene Romero, has a profile unrelated to the work carried out by the School of Psychology. She is 56 years old and has no prior experience with basic tools such as Word or Excel.

The evaluator presented the system prior to the test as an appointment management tool and instructed the participant to perform tasks sequentially while verbalizing her thought process. The tasks covered were:

- Creating a therapy appointment with a defined patient, therapist, room, and time slot.
- Navigating the calendar to locate appointments scheduled on specific dates.
- Rescheduling an existing appointment to a new date and time.
- Cancelling an appointment and verifying the record in the Audit section.
- Reviewing the incoming external request inbox.
- Using the agenda view filters (therapist, room, patient, appointment type).
- Creating a second appointment directly from the calendar grid.

Throughout the session, the evaluator provided verbal guidance when blockers were detected, indicating that the system is not sufficiently self-explanatory for users without prior training.

**2\. Common Errors and User Experience**

**2.1 Observed Errors**

**Save / Confirm button not found**

During appointment creation, the participant could not locate the confirm button. The primary CTA lacks visual prominence and intuitive positioning.

Use Case: UC-AG-01 | Affected Metrics: M-01, M-02, M-04

**2.2 Emotional and Attitudinal Experience**

- Appointment deletion was executed quickly, suggesting that direct, single-action flows impose less cognitive load than modification or rescheduling processes.

**3\. Metrics Summary (M-01 to M-05)**

The values are qualitative estimates derived from analysis of the session transcript. A deduction criterion was applied per the evaluation protocol in the absence of instrumented quantitative data.

| **ID** | **Description** | **Threshold** | **Estimated Value** | **Result** |     |
| --- | --- | --- | --- | --- | --- |
| M-01 | Avoidable error rate | ≤ 5% | ~10% | **DOES NOT MEET** |     |
| --- | --- | --- | --- | --- | --- |
| M-02 | Error recovery time | Mean ≤ 30 s | ~30 s | **MEETS** |     |
| --- | --- | --- | --- | --- | --- |
| M-03 | Completion rate without restart | ≥ 90% | ~60% | **DOES NOT MEET** |     |
| --- | --- | --- | --- | --- | --- |
| M-04 | Perceived confidence before confirming | ≥ 4.0 / 5 | ~2.5 / 5 | **DOES NOT MEET** |     |
| --- | --- | --- | --- | --- | --- |
| M-05 | Autonomous error resolution rate | ≥ 85% | ~50% | **DOES NOT MEET** |     |
| --- | --- | --- | --- | --- | --- |

**3.1 Detailed Metrics Analysis**

**M-01 — Avoidable error rate (threshold: ≤ 5%)**

Avoidable errors were identified, most notably the inability to locate the Save/Confirm button during appointment creation despite it being present in the interface. Calendar slot misidentification and navigation difficulties also contributed. Estimated value: ~10%. DOES NOT MEET.

**M-02 — Error recovery time (threshold: mean ≤ 30 s)**

With evaluator guidance, the participant was able to recover from errors within approximately 30 seconds on average. Recovery was possible within the threshold when direction was provided. Estimated value: ~30 s. MEETS.

**M-03 — Completion rate without restart (threshold: ≥ 90%)**

Of the 7 tasks evaluated, at least 2-3 required partial restarts or direct guidance equivalent to an assisted restart: creation from the calendar grid (failed and retried) and re-locating the Audit section (re-orientation required). Estimated value: ~60%. DOES NOT MEET.

**M-04 — Perceived confidence before confirming (threshold: ≥ 4.0 / 5)**

The participant showed uncertainty before each confirmation and sought evaluator validation throughout the session. She did not verbalize certainty about the outcome of her actions at any point. Estimated Likert score: ~2.5/5. DOES NOT MEET.

**M-05 — Autonomous error resolution rate (threshold: ≥ 85%)**

Most errors required direct evaluator intervention. Only appointment cancellation was resolved with relative autonomy. Approximately 50% of errors were resolved without assistance. Estimated value: ~50%. DOES NOT MEET.

**4\. Use Case Summary**

| **Use Case** | **Task** | **Result** | **Observations** |
| --- | --- | --- | --- |
| UC-AG-01 | Therapy appointment creation | Completed with guidance | Did not find Save/Confirm button; asked "Where is it?" twice |
| --- | --- | --- | --- |
| UC-AG-02 | Rescheduling an existing appointment | Completed with guidance | Confused form fields; required continuous evaluator instructions |
| --- | --- | --- | --- |
| UC-AG-03 | Appointment cancellation | Completed | Smoothest task; found the cancel button with relative ease |
| --- | --- | --- | --- |
| UC-AG-04 | Inbox / incoming requests | Partial — no data | No requests in the system; full flow could not be evaluated |
| --- | --- | --- | --- |
| UC-AG-06 | Agenda filtering | Completed with guidance | Required step-by-step instructions; did not explore filters autonomously |
| --- | --- | --- | --- |
| UC-AG-01 (2nd) | Creation from calendar grid | Failed / retried | Did not identify Thursday 21 – 12:00 slot; had to use the form method |
| --- | --- | --- | --- |

**5\. Main Recommendations**

- Increase the prominence of the Save/Confirm button: larger size, high-contrast color, and fixed position at the bottom of the form.
- Add visual indicators to the calendar grid: highlight cells on hover showing day and time in a tooltip to facilitate direct selection.
- Implement real-time date validation: display immediate confirmation when a date is selected to reduce input errors.
- Improve main menu labels: use more descriptive names and recognizable icons for sections such as Audit and Inbox.
- Add a breadcrumb or location indicator in all views so the user can orient themselves and navigate without relying on the evaluator.
- Consider onboarding or contextual tooltips for new users, given the target user profile.
