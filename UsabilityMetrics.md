# Requirement #1 - Appointment Scheduling Time

| Field | Value |
|-------|-------|
| Metric Name | Appointment Completion Time |
| Measurement Object | Administrative user performing a complete scheduling task |
| Operational Definition | Time elapsed from clicking "New Appointment" (or equivalent action) until receiving visual confirmation that the appointment was successfully saved. |
| Unit of Measure | Seconds (s) |
| Measurement Conditions | User has all necessary information available (patient, psychologist, date, time, reason). No system errors unrelated to user interaction occur. |
| Sample | 10 scheduling attempts |
| Success Criterion | 95% of tasks must be completed in ≤ 180 seconds. |
| Classification | Hard - Objective |
| Measurement Instrument | — |

---

# Requirement #2 - Visibility of Main Functions

| Field | Value |
|-------|-------|
| Metric Name | Direct Accessibility of Main Functions |
| Measurement Object | Main Scheduling screen |
| Operational Definition | Percentage of main functions (create, edit, cancel appointment) that are visible without requiring more than one click or tab switch. |
| Unit of Measure | Percentage (%) |
| Measurement Conditions | Evaluated on the view of the scheduling process |
| Success Criterion | 100% (all main functions must be directly visible). |
| Classification | Hard - Quantitative |
| Measurement Instrument | Manual inspection |

---

# Requirement #3 - Required Field Validation

| Field | Value |
|-------|-------|
| Metric Name | Required Field Validation Effectiveness |
| Measurement Object | Scheduling form during incomplete save attempts |
| Operational Definition | Percentage of save attempts where the system prevents saving because at least one required field is missing, and indicates which fields are missing with messages |
| Unit of Measure | Percentage (%) |
| Sample | 5 scenarios with different missing required fields |
| Success Criterion | 100% blocking the associated corresponding field |
| Classification | Hard - Quantitative |
| Measurement Instrument | Manual inspection |

---

# Requirement #4 - Prevention of Scheduling Conflicts

| Field | Value |
|-------|-------|
| Metric Name | Scheduling Conflict Detection Rate |
| Measurement Object | Attempts to assign a psychologist to an already booked date and time |
| Operational Definition | Percentage of failed scheduling attempts that are blocked by the system before displaying an error message |
| Unit of Measure | Percentage (%) |
| Sample | 10 conflict scenarios (same psychologist, same date and time) |
| Success Criterion | 100% (no failed attempts must be saved) |
| Classification | Hard - Objective |
| Measurement Instrument | — |

---

# Requirement #5 - Clear Error Messages

| Field | Value |
|-------|-------|
| Metric Name | Error Message Quality Compliance |
| Measurement Object | All system error messages (validation, conflicts, server, etc.) |
| Operational Definition | Percentage of messages that meet four criteria: 1) indicate what happened, 2) indicate how to fix it, 3) use non-technical language, 4) appear near the point of action |
| Unit of Measure | Percentage (%) |
| Measurement Conditions | Avoid technical terms like "backend", "module", "exception" |
| Sample | All unique error messages identifiable in the system |
| Success Criterion | ≥ 90% of messages meet all criteria |
| Classification | Hard |
| Measurement Instrument | Manual inspection |

---

# Requirement #6 - Readable Text and Visual Comfort

| Field | Value |
|-------|-------|
| Metric Name | Visual Accessibility Compliance (WCAG 2.1 AA) |
| Measurement Object | Text elements on all main screens |
| Operational Definition | Percentage of text elements meeting: contrast ratio ≥ 4.5:1, base font size ≥ 16 |
| Unit of Measure | Percentage (%) |
| Sample | All main system screens (scheduling, list, editing) |
| Success Criterion | 100% of elements comply |
| Classification | Hard |
| Measurement Instrument | Manual inspection |

---

# Requirement #7 - Simple and Non-Technical Language

| Field | Value |
|-------|-------|
| Metric Name | User-Oriented Language Index |
| Measurement Object | Key interface terms (labels, messages, help texts) |
| Operational Definition | Percentage of terms understood by the administrative user |
| Unit of Measure | Percentage (%) |
| Measurement Conditions | Each term is rated "clear" or "not clear" |
| Sample | 5 users |
| Success Criterion | ≥ 90% of key terms exceed the clarity threshold |
| Classification | Soft - User-based evaluation |
| Measurement Instrument | Brief interviews |

---

# Requirement #8 - Clear Confirmation of Actions

| Field | Value |
|-------|-------|
| Metric Name | Confirmation Timing and Duration |
| Measurement Object | Critical actions (save, update, cancel appointment) |
| Operational Definition | Percentage of actions that show a visual confirmation in less than 1 second, remaining visible for 2 to 5 seconds |
| Unit of Measure | Percentage (%) |
| Measurement Conditions | Confirmation must be non-intrusive |
| Sample | 10 executions per critical action type |
| Success Criterion | 100% of actions meet: appearance < 1s, duration 2-5s |
| Classification | Hard - Objective |
| Measurement Instrument | — |

---

# Requirement #9 - Standard Date Format

| Field | Value |
|-------|-------|
| Metric Name | dd/mm/yyyy Date Format Compliance |
| Measurement Object | All date fields in the system |
| Operational Definition | Percentage of fields that: 1) use dd/mm/yyyy format, 2) include a visual date picker, 3) automatically validate manual entries preventing incorrect formats |
| Unit of Measure | Percentage (%) |
| Measurement Conditions | The date picker must restrict selection to valid dates. Manual validation must show an error for impossible formats |
| Sample | All forms that include a date (create appointment, edit, filters) |
| Success Criterion | 100% of date fields |
| Classification | Hard - Objective |
| Measurement Instrument | Manual inspection |

---

# Requirement #10 - Recovery from Errors

| Field | Value |
|-------|-------|
| Metric Name | Form State Preservation Rate After Errors |
| Measurement Object | Error scenarios (missing required fields, scheduling conflicts, invalid format) |
| Operational Definition | Percentage of error types where the user can correct the error and save without losing already entered data |
| Unit of Measure | Percentage (%) |
| Measurement Conditions | Valid data is entered in other fields, the error is provoked, then corrected and saved; it is verified that previously entered data is preserved |
| Sample | One scenario per error type defined |
| Success Criterion | 100% (no error should cause loss of unsaved data) |
| Classification | Hard - Objective |
| Measurement Instrument | — |

---

# Requirement #11 - Interface Consistency

| Field | Value |
|-------|-------|
| Metric Name | Common Element Consistency |
| Measurement Object | Common elements across all screens (buttons, navigation, labels, messages) |
| Operational Definition | Percentage of elements that maintain the same position, appearance, and behavior on all screens |
| Unit of Measure | Percentage (%) |
| Measurement Conditions | A list of common elements has to be defined |
| Sample | All system screens |
| Success Criterion | 100% (no exceptions) |
| Classification | Hard - Objective |
| Measurement Instrument | Manual inspection |

