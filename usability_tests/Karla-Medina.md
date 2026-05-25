**USABILITY TEST REPORT**

Scheduling System — Agenda Module

Participant: Karla Medina | Profile: Secretary/Administrative (53 years old)

Session Duration: ~16 minutes | Protocol: Think-Aloud

Date: May 2026

**1\. Complete Interview Summary**

The session lasted 16 minutes and 50 seconds and was conducted under the think-aloud protocol. The participant, Karla Medina, has an administrative-secretarial profile unrelated to the work carried out by the School of Psychology. She is 53 years old and has basic experience with Word and Excel.

The evaluator introduced the system as an appointment management tool and instructed the participant to perform tasks sequentially while verbalizing her thought process. The tasks covered were:

- Creating a therapy appointment with a defined patient, therapist, room, and time slot.
- Navigating the calendar to locate appointments scheduled on specific dates.
- Rescheduling an existing appointment to a new date and time (May 29, 10:00 am).
- Cancelling an appointment and verifying the record in the Audit section.
- Reviewing the incoming external request inbox.
- Using the agenda view filters (therapist, room, patient, appointment type).
- Creating a second appointment directly from the calendar grid.

Throughout the session, the evaluator provided frequent verbal guidance upon detecting blockers, indicating that the system is not sufficiently self-explanatory for users without prior training. Only the cancellation task was performed with relative fluency; all others required direct evaluator intervention at critical points.

**2\. Common Errors and User Experience**

**2.1 Observed Errors**

**Save / Confirm button not found (x2)**

During appointment creation and rescheduling, the participant explicitly asked "Where is it?" on two occasions before locating the confirm button. The primary CTA lacks visual prominence and intuitive positioning.

Use Cases: UC-AG-01, UC-AG-02 | Affected Metrics: M-01, M-02, M-04

**Failed to create appointment from calendar grid**

When attempting to create an appointment directly from the grid (Thursday the 21st at 12:00), the participant could not identify the correct cell. The evaluator had to redirect her to the form method. The direct calendar interaction lacks clear day/time visual indicators.

Use Case: UC-AG-01 (alternative flow) | Affected Metrics: M-01, M-03

**Difficulty returning to previous state after navigating**

After navigating to June, the participant could not autonomously return to May (date 27). She had to be guided, revealing the absence of clear temporal navigation controls or a visible breadcrumb.

Use Case: UC-AG-06 | Affected Metrics: M-02, M-05

**Incorrect date on second appointment (Ana Martinez)**

The participant entered May 19 instead of the indicated May 28. The system did not proactively detect the error. The appointment had to be cancelled and recreated, generating a partial task restart.

Use Case: UC-AG-01 | Affected Metrics: M-01, M-03

**Audit section not re-located autonomously**

After visiting it once with guidance, when asked to find it again independently, the participant navigated through incorrect sections. The information architecture of the menu is not sufficiently descriptive.

Use Case: UC-AG-03 | Affected Metrics: M-05

**2.2 Emotional and Attitudinal Experience**

- Evaluator dependency: waited for instructions before proceeding at almost every critical step, reflecting low confidence in her interpretation of the interface.
- Verbalized uncertainty: phrases such as "Which one?", "Where is it?", "The 4 or the 3?" reflect a system that does not clearly communicate its state or available options.
- Constructive attitude toward errors: showed no visible frustration; accepted corrections naturally, though tended to attribute errors to her own lack of familiarity rather than to the system design.
- Smoothest task: appointment cancellation (UC-AG-03) was executed with greater ease, suggesting that flow has greater visual consistency compared to the others.

**3\. Metrics Summary (M-01 to M-05)**

The values are qualitative estimates derived from analysis of the session transcript. A deduction criterion was applied per the evaluation protocol in the absence of instrumented quantitative data.

| **ID** | **Description** | **Threshold** | **Estimated Value** | **Result** |     |
| --- | --- | --- | --- | --- | --- |
| M-01 | Avoidable error rate | ≤ 5% | ~20% | **DOES NOT MEET** |     |
| --- | --- | --- | --- | --- | --- |
| M-02 | Error recovery time | Mean ≤ 30 s | ~45-60 s | **DOES NOT MEET** |     |
| --- | --- | --- | --- | --- | --- |
| M-03 | Completion rate without restart | ≥ 90% | ~60% | **DOES NOT MEET** |     |
| --- | --- | --- | --- | --- | --- |
| M-04 | Perceived confidence before confirming | ≥ 4.0 / 5 | ~2.5 / 5 | **DOES NOT MEET** |     |
| --- | --- | --- | --- | --- | --- |
| M-05 | Autonomous error resolution rate | ≥ 85% | ~50% | **DOES NOT MEET** |     |
| --- | --- | --- | --- | --- | --- |

**3.1 Detailed Metrics Analysis**

**M-01 — Avoidable error rate (threshold: ≤ 5%)**

At least 4 errors were committed despite the system having preventive mechanisms available: incorrect date on the second appointment, unidentified calendar slot, save button not found (x2), and Audit section not re-located. Estimated value: ~20%. DOES NOT MEET.

**M-02 — Error recovery time (threshold: mean ≤ 30 s)**

In the recorded episodes, the participant took between 45 and 60 seconds to recover with evaluator guidance. Without intervention, the time would have been indeterminate. Estimated value: ~45-60 s. DOES NOT MEET.

**M-03 — Completion rate without restart (threshold: ≥ 90%)**

Of the 7 tasks evaluated, at least 2-3 required a partial restart or direct guidance equivalent to an assisted restart: creation from the calendar (failed and retried), Ana Martinez appointment (cancelled and recreated), and re-locating the Audit section (re-orientation required). Estimated value: ~60%. DOES NOT MEET.

**M-04 — Perceived confidence before confirming (threshold: ≥ 4.0 / 5)**

The participant showed uncertainty before each confirmation, seeking evaluator validation. She did not verbalize certainty about the outcome of her actions at any point. Estimated Likert score: ~2.5/5. DOES NOT MEET.

**M-05 — Autonomous error resolution rate (threshold: ≥ 85%)**

Most errors required direct evaluator intervention. Only the appointment cancellation was resolved with relative autonomy. Approximately 50% of errors were resolved without assistance. Estimated value: ~50%. DOES NOT MEET.

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
