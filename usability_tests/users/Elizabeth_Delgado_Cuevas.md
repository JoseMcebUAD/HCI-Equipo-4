**USABILITY TEST REPORT**

Scheduling System — Agenda Module

Participant: Elizabeth Delgado Cuevas | Profile: Administrative User (58 years old)

Session Duration: ~18 minutes | Protocol: Think-Aloud

Date: May 2026

**1\. Complete Interview Summary**

The session was conducted under the think-aloud protocol, allowing observation of the participant's behavior while she performed tasks related to the scheduling system's agenda module. Elizabeth Delgado Cuevas, 58 years old, showed prior familiarity with similar administrative systems, which positively influenced several tasks related to navigation and visual recognition of interface elements.

The evaluator introduced the system as a platform for managing medical/therapeutic appointments and requests. During the session, the participant was asked to perform multiple tasks related to creating, modifying, cancelling, and querying appointments, as well as interpreting system error messages and alerts.

The evaluated tasks were:

1. Create a therapy appointment under normal conditions.
2. Attempt to schedule an appointment in an occupied slot and on an invalid date.
3. Reschedule an existing appointment while correcting the selection during the process.
4. Cancel an appointment and undo the operation.
5. Recover from system error messages.
6. Manage incoming requests from the inbox.
7. Process a patient rescheduling request.
8. Query information using calendar filters.
9. Review the schedule workload and interpret alerts.

In general terms, the participant showed good adaptability to the system and completed most tasks without critical restarts. However, significant difficulties were observed in tasks related to filters, advanced request management, and contextual understanding of certain system messages and indicators.

**2\. Common Errors and User Experience**

**2.1 Observed Errors**

**Reliance on prior experience to interpret availability**

During the task involving occupied slots, the participant correctly identified resource conflicts and invalid slots; however, she explicitly stated that this understanding came more from her prior experience with other administrative systems than from the visual elements provided by the interface.

Use Cases: UC-AG-01, UC-AG-05 | Affected Metrics: M-01, M-04

**Incomplete interpretation of error messages**

Although she managed to recover from system error messages, the participant initially assumed that errors came solely from incomplete fields and did not correctly identify the specific room resource conflict. This caused confusion before the issue was resolved.

Use Case: UC-AG-05 | Affected Metrics: M-02, M-05

**Accidental deletion of inbox requests**

During the management of incoming requests, the participant accidentally deleted two of the three test cases. Although she visually distinguished the available actions, she had difficulty correctly executing the expected operations.

Use Case: UC-AG-04 | Affected Metrics: M-01, M-03, M-05

**Difficulty locating and using filters**

In the filter query task, the participant did not correctly identify the filter controls and required evaluator assistance. Once the filters were found, she completed the task, though with considerably more time than expected.

Use Case: UC-AG-06 | Affected Metrics: M-02, M-04, M-05

**Need for clarification on workload alerts**

During the interpretation of schedule alerts, the participant partially understood the problem indicated by the system but needed additional clarification to determine how to proceed.

Use Case: UC-AG-07 | Affected Metrics: M-04, M-05

**2.2 Emotional and Attitudinal Experience**

- Positive disposition throughout the session: the participant maintained a collaborative attitude and showed comfort interacting with the system.
- High confidence in basic operational tasks: actions such as scheduling, rescheduling, and cancelling appointments were performed with confidence and speed.
- Reliance on prior experience: several visual interpretations stemmed from knowledge acquired in other similar systems rather than from the clarity of the interface itself.
- Increased insecurity in complex tasks: when using filters or managing multiple requests, the participant showed hesitation and required external support.
- Positive perception of critical actions: she noted that the cancel and undo options were visible "very clearly," which generated confidence during those operations.

**3\. Metrics Summary (M-01 to M-05)**

The values presented are qualitative estimates derived from analysis of the session transcript and observed behavior. Metrics were interpreted using only the definitions established in the Metrics Measurement Task.

| **ID** | **Description** | **Threshold** | **Estimated Value** | **Result** |     |
| --- | --- | --- | --- | --- | --- |
| M-01 | Avoidable error rate | ≤ 5% | ~12% | **DOES NOT MEET** |     |
| --- | --- | --- | --- | --- | --- |
| M-02 | Error recovery time | Mean ≤ 30 s | ~18-25 s | **MEETS** |     |
| --- | --- | --- | --- | --- | --- |
| M-03 | Completion rate without restart | ≥ 90% | ~80% | **DOES NOT MEET** |     |
| --- | --- | --- | --- | --- | --- |
| M-04 | Perceived confidence before confirming | ≥ 4.0 / 5 | ~4.2 / 5 | **MEETS** |     |
| --- | --- | --- | --- | --- | --- |
| M-05 | Autonomous error resolution rate | ≥ 85% | ~70% | **DOES NOT MEET** |     |
| --- | --- | --- | --- | --- | --- |

**3.1 Detailed Metrics Analysis**

**M-01 — Avoidable error rate (threshold: ≤ 5%)**

Avoidable errors were identified primarily related to the accidental deletion of inbox requests, difficulty identifying filters, and initial misinterpretation of error messages. Although the participant completed most tasks, several errors occurred even when the system provided visible preventive elements. Estimated value: ~12%. DOES NOT MEET.

**M-02 — Error recovery time (threshold: mean ≤ 30 s)**

Observed errors were corrected in relatively short times. The clearest case was recovery from error messages, resolved in approximately 7 seconds, and the cancel/undo operation performed almost immediately. Even in complex tasks, recovery remained within reasonable margins. Estimated value: ~18-25 s. MEETS.

**M-03 — Completion rate without restart (threshold: ≥ 90%)**

Although most tasks were completed, the incoming request management task could not be finished satisfactorily due to accidental deletions. Additionally, some tasks required evaluator support to continue. Estimated value: ~80%. DOES NOT MEET.

**M-04 — Perceived confidence before confirming (threshold: ≥ 4.0 / 5)**

The participant expressed comfort and confidence in most critical actions. Likert scores provided were predominantly 5/5 and only dropped to 3/5 in the request management task. The overall perception indicates a high level of clarity before confirming important actions. Estimated score: ~4.2/5. MEETS.

**M-05 — Autonomous error resolution rate (threshold: ≥ 85%)**

Although the participant resolved some errors without intervention, tasks involving filters, alerts, and requests required evaluator support or clarification. This indicates that certain recovery mechanisms and guidance cues are not yet sufficiently clear for fully autonomous use. Estimated value: ~70%. DOES NOT MEET.

**4\. Use Case Summary**

| **Use Case** | **Task** | **Result** | **Observations** |
| --- | --- | --- | --- |
| UC-AG-01 | Therapy appointment creation | Completed | Executed the task with ease and high confidence |
| --- | --- | --- | --- |
| UC-AG-02 | Scheduling attempt in occupied slot | Completed | Correctly identified conflicts, relying on prior experience |
| --- | --- | --- | --- |
| UC-AG-03 | Appointment rescheduling | Completed | Fast operation with no significant difficulty |
| --- | --- | --- | --- |
| UC-AG-04 | Cancellation and undo action | Completed | Clearly found the cancel and undo options |
| --- | --- | --- | --- |
| UC-AG-05 | Recovery from error messages | Completed with minor difficulty | Partially interpreted messages before resolving the conflict |
| --- | --- | --- | --- |
| UC-AG-06 | Incoming request management | Partial / Failed | Accidentally deleted requests; task not completed satisfactorily |
| --- | --- | --- | --- |
| UC-AG-07 | Processing a rescheduling request | Completed | Executed the operation correctly without difficulty |
| --- | --- | --- | --- |
| UC-AG-08 | Filter-based query | Completed with guidance | Needed help to locate filters and navigate results |
| --- | --- | --- | --- |
| UC-AG-09 | Workload alert interpretation | Completed with guidance | Partially understood indicators but required clarification |
| --- | --- | --- | --- |

**5\. Main Recommendations**

- Improve the visual differentiation between available and occupied slots using colors, labels, or more explicit iconography that does not rely on prior user experience.
- Redesign error messages to communicate the specific cause of the problem and the expected corrective action with greater precision.
- Implement additional confirmations or recovery mechanisms before deleting critical requests from the inbox.
- Increase the visibility of system filters through visual grouping, more descriptive labels, and prioritized positioning.
- Add contextual help or explanatory tooltips on workload alerts to guide the user on possible follow-up actions.
- Incorporate short tutorials or contextual onboarding for users with lower technological familiarity or for advanced system tasks.
