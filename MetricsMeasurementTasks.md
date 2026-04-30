## Usability Metrics — Scheduling System

_ISO/IEC/IEEE 15939:2017_

---

### M-01 — Rate of Avoidable Errors Committed by the User

|Field|Description|
|---|---|
|**Evaluated construct**|Error control and prevention|
|**Related requirements**|RNF-US-01, RNF-US-05, RNF-US-07|
|**Information need**|Do the system's prevention mechanisms effectively stop the user from executing unintended or incorrect actions?|
|**Measured entity**|Test session with a scheduling task|
|**Measure type**|Derived measure (observed proportion)|
|**Measurement method**|During the session, the evaluator records every action the user executes that produces an unintended result, given that a preventive mechanism was available in the system (disabled option, prior warning, confirmation dialog). These are counted against the total actions executed during the session.|
|**Formula**|`M-01 = (Avoidable errors committed / Total actions executed) × 100`|
|**Unit of measure**|Percentage (%)|
|**Measurement scale**|Continuous ratio (0% – 100%)|
|**Acceptance threshold**|≤ 5%|
|**Interpretation**|A value close to 0% indicates that the preventive mechanisms are effective and the user perceives them naturally. High values suggest that warnings, confirmations, or disabled options are not sufficiently visible or understandable, regardless of their technical presence in the system.|
|**Collection procedure**|Direct observation with evaluator logbook. A catalog of actions with associated preventive mechanisms is defined beforehand. The evaluator marks each instance where the user executes an incorrect action despite the preventive mechanism being available.|

---

### M-02 — Recovery Time After a Committed Error

|Field|Description|
|---|---|
|**Evaluated construct**|Error recoverability|
|**Related requirements**|RNF-US-02, RNF-US-03, RNF-US-04|
|**Information need**|When the user makes an error, can they recover quickly without abandoning or restarting the task?|
|**Measured entity**|Error instance during a test session|
|**Measure type**|Base measure (observed time)|
|**Measurement method**|Time is measured from the moment the user detects they made an error (expressed verbally or through a change in behavior) until they successfully correct it and resume the task. Recorded for each error instance observed during the session.|
|**Formula**|`M-02 = T_correction − T_error_detection (in seconds)` `M-02_mean = average across all instances in the session`|
|**Unit of measure**|Seconds (s)|
|**Measurement scale**|Continuous ratio|
|**Acceptance threshold**|Mean ≤ 30 seconds per error instance|
|**Interpretation**|Low times indicate the system facilitates correction and the user locates the mechanisms easily. High times signal that, even if correction mechanisms exist, the user cannot find or understand them, evidencing a failure in the combined effectiveness of RNF-US-02, 03, and 04.|
|**Collection procedure**|Screen and audio recording under a think-aloud protocol. The evaluator marks the timestamps for the start and end of each error episode. The mechanism used by the user (undo, step back, direct field correction) is also recorded for complementary qualitative analysis.|

---

### M-03 — Rate of Involuntary Task Abandonment or Restart

|Field|Description|
|---|---|
|**Evaluated construct**|Error recoverability|
|**Related requirements**|RNF-US-03, RNF-US-04|
|**Information need**|Does the user successfully complete the task without being forced to restart or abandon it due to an unresolvable error along the way?|
|**Measured entity**|Full scheduling task per participant|
|**Measure type**|Base measure (binary event) + derived measure (proportion)|
|**Measurement method**|It is recorded whether each participant completed the task without restarting or abandoning it. A restart occurs when the user returns to the beginning of the workflow losing previously entered data. An abandonment occurs when the user states they cannot continue or requests help from the evaluator.|
|**Formula**|`M-03 = (Tasks completed without restart or abandonment / Total attempted tasks) × 100`|
|**Unit of measure**|Percentage (%)|
|**Measurement scale**|Ratio (0% – 100%)|
|**Acceptance threshold**|≥ 90%|
|**Interpretation**|A high rate indicates the system allows the user to navigate the workflow and recover from errors fluidly. A low rate is direct evidence that partial correction mechanisms and error messages are not effective enough for the user to continue autonomously.|
|**Collection procedure**|Observation with binary recording per task. The evaluator documents the reason for each restart or abandonment to identify the point in the workflow where the breakdown occurs.|

---

### M-04 — Perceived Confidence Before Confirming an Action

|Field|Description|
|---|---|
|**Evaluated construct**|Error control and prevention / Contextual orientation|
|**Related requirements**|RNF-US-05, RNF-US-06, RNF-US-07|
|**Information need**|Does the user feel they have enough information to confirm an action without uncertainty about its outcome?|
|**Measured entity**|User's subjective experience when confirming critical actions|
|**Measure type**|Subjective base measure (perception scale)|
|**Measurement method**|Immediately after the user confirms a critical action (schedule, modify, delete), a 5-point Likert question is administered: _"Before confirming, how clear was it to you what was going to happen?"_ (1 = Not clear at all — 5 = Completely clear).|
|**Formula**|`M-04 = average of Likert scores per participant` `M-04_global = average across all participants`|
|**Unit of measure**|Likert score (1–5)|
|**Measurement scale**|Ordinal (treated as interval for average calculation)|
|**Acceptance threshold**|M-04_global ≥ 4.0|
|**Interpretation**|A high score indicates that preventive warnings, visible schedule status, and confirmation dialogs together create a sense of informed control. A low score indicates the user confirms actions without fully understanding their scope, revealing that contextual orientation mechanisms are not fulfilling their purpose.|
|**Collection procedure**|Question administered verbally or on paper after each critical action, at natural pause points in the protocol so as not to interrupt the task flow.|

---

### M-05 — Rate of Errors Resolved Autonomously by the User

|Field|Description|
|---|---|
|**Evaluated construct**|Error recoverability|
|**Related requirements**|RNF-US-02, RNF-US-03, RNF-US-04|
|**Information need**|Is the user able to resolve the errors they make on their own, without requiring external intervention?|
|**Measured entity**|Error instances during the session|
|**Measure type**|Derived measure (proportion)|
|**Measurement method**|Of all error instances recorded during the session, it is counted how many were resolved autonomously by the user (without evaluator assistance, without consulting external documentation, and without abandoning the task) versus how many required intervention or proved unresolvable.|
|**Formula**|`M-05 = (Errors resolved autonomously / Total errors recorded) × 100`|
|**Unit of measure**|Percentage (%)|
|**Measurement scale**|Ratio (0% – 100%)|
|**Acceptance threshold**|≥ 85%|
|**Interpretation**|A high rate validates that error messages are understandable and actionable, that the undo option is locatable, and that the workflow allows effective partial correction. A low rate indicates that recovery mechanisms exist but are not sufficiently clear or accessible to the user in a real-use context.|
|**Collection procedure**|Per-instance recording in the evaluator's logbook, classifying each error as: resolved autonomously, resolved with assistance, or unresolved. The evaluator does not intervene unless the user has been blocked for more than 3 minutes without progress, at which point it is recorded as unresolved.|
