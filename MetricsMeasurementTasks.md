### Task #6: Metric Measurement - Visual Accessibility Compliance (WCAG 2.1 AA)

**Description:**
Perform a systematic manual inspection across all main screens of the psychology clinic agenda module to ensure text readability and visual comfort, strictly adhering to WCAG 2.1 AA standards.

**Checklist:**
- [ ] **Interface Inventory:** Identify and list all text elements across the scheduling, list, and editing screens.
- [ ] **Font Size Audit:** Manually inspect CSS properties to verify that the base font size for all text elements is ≥ 16px.
- [ ] **Contrast Ratio Verification:** Use accessibility tools (e.g., WebAIM Contrast Checker or Browser DevTools) to ensure every text element maintains a contrast ratio of at least 4.5:1 against its background.
- [ ] **Metric Calculation:** Count the total number of text elements and the number of compliant ones. Calculate the final percentage: `(Compliant Elements / Total Elements) * 100`.
- [ ] **Result Documentation:** Record the final percentage in the project’s metric report. If the 100% success criterion is not met, document the specific elements that require adjustment.

### Task #7: Metric Measurement - User-Oriented Language Index

**Description:**
Conduct brief interviews with a sample of 5 administrative users to evaluate the clarity of key interface terms within the psychology clinic agenda module. The goal is to ensure all labels, messages, and help texts use simple, non-technical language.

**Checklist:**
- [ ] **Term Extraction:** Compile a comprehensive list of key interface terms, system messages, alerts, and help texts used across the module's screens.
- [ ] **Interview Preparation:** Design a brief interview script or evaluation sheet allowing users to rate each extracted term strictly as either "clear" or "not clear".
- [ ] **User Testing (Interviews):** Conduct brief evaluation sessions with 5 target users (e.g., clinic administrative staff), asking them to review and rate the terms based on their understanding.
- [ ] **Metric Calculation:** Consolidate the results. Count how many key terms were widely understood (rated "clear" by the users) and calculate the final percentage: `(Terms Exceeding Clarity Threshold / Total Key Terms Evaluated) * 100`.
- [ ] **Result Documentation:** Record the final index percentage in the metrics report. If the ≥ 90% success criterion is not met, document the specific terms marked as "not clear" and propose simpler, user-friendly alternatives for the next iteration.

### Task #8: Metric Measurement - Confirmation Timing and Duration

**Description:**
Evaluate the responsiveness and visibility duration of visual confirmations for critical actions (saving, updating, and canceling appointments) within the module. The objective is to ensure that system feedback appears instantly (< 1 second), remains visible for a readable timeframe (2 to 5 seconds), and uses a non-intrusive UI pattern (e.g., toast notifications or snackbars).

**Checklist:**
- [ ] **Action Inventory & Tool Setup:** Identify the exact triggers for the critical actions (save, update, cancel). Prepare a precise measurement tool, such as screen recording software (to analyze frames/timestamps) or browser DevTools (Performance tab).
- [ ] **Test Execution:** Perform exactly 10 distinct executions for *each* of the identified critical action types (e.g., 10 saves, 10 updates, 10 cancellations).
- [ ] **Timing Measurement:** For every single execution, measure and log two specific timing variables:
    - **Appearance Time:** Did the visual confirmation appear in `< 1 second` after the action was triggered?
    - **Duration Time:** Did the confirmation remain visible on the screen for a period of `2 to 5 seconds`?
- [ ] **Non-Intrusive Validation:** Confirm qualitatively that the feedback mechanism does not block the user's workflow (e.g., verifying it is not a mandatory, blocking modal popup).
- [ ] **Metric Calculation:** Count how many total executions successfully met *all* conditions (appearance time, duration time, and non-intrusiveness). Calculate the final percentage: `(Compliant Executions / Total Executions) * 100`.
- [ ] **Result Documentation:** Record the final percentage in the metric report. If the strict 100% success criterion is not met, document exactly which action failed and why (e.g., "Update confirmation took 1.2s to appear" or "Cancel toast disappeared after 1 second").

### Task #9: Metric Measurement - dd/mm/yyyy Date Format Compliance

**Description:**
Perform a systematic manual inspection of all date input fields across the system's forms (such as appointment creation, editing, and list filters) to verify strict adherence to the `dd/mm/yyyy` format, the integration of functional date pickers, and robust input validation.

**Checklist:**
- [ ] **Date Field Inventory:** Identify and compile a list of all forms and screens within the module that contain date input fields.
- [ ] **Format Verification:** Inspect each identified field to confirm that the default placeholder, displayed text, and accepted input format are strictly set to `dd/mm/yyyy`.
- [ ] **Date Picker Inspection:** Verify that every date field includes a functional visual date picker interface. Ensure this picker actively restricts users from selecting inherently invalid dates.
- [ ] **Manual Entry & Validation Testing:** Intentionally type incorrect or impossible dates (e.g., `12/31/2026` [mm/dd/yyyy], `32/01/2026`, or letters) directly into the input fields. Confirm that the system automatically prevents the input/submission and displays a clear error message.
- [ ] **Metric Calculation:** Count the total number of date fields and the number of fields that successfully meet *all three* criteria (correct format, active date picker, and manual validation). Calculate the final percentage: `(Compliant Date Fields / Total Date Fields) * 100`.
- [ ] **Result Documentation:** Record the final percentage in the project's metrics report. Given the strict 100% success criterion, document the exact location and specific failure reason for any field that does not meet all conditions.

### Task #10: Metric Measurement - Form State Preservation Rate After Errors

**Description:**
Evaluate the system's ability to retain user-entered data when form submission fails due to validation errors. The objective is to ensure a frustration-free experience where users can correct specific mistakes (like missing fields or scheduling conflicts) without losing the valid information they have already typed.

**Checklist:**
- [ ] **Error Scenario Mapping:** Catalog all distinct error types that can occur within the module's forms (e.g., missing mandatory fields, appointment time conflicts, invalid input formats). 
- [ ] **Test Execution (Provoke Error):** For each identified error type, fill out the form with valid data but intentionally trigger the specific error (e.g., leave a required field blank, or select an already booked time slot). Attempt to save/submit.
- [ ] **State Preservation Check:** Immediately after the error is triggered and the warning is displayed, inspect the form to verify that all the valid data previously entered remains perfectly intact (the form must not wipe or reset).
- [ ] **Correction and Resolution:** Correct the provoked error in the specific field and attempt to save the form again. Confirm that the data saves successfully.
- [ ] **Metric Calculation:** Count the total number of error scenarios tested and the number of scenarios where data was successfully preserved. Calculate the final percentage: `(Scenarios with Preserved State / Total Error Scenarios Tested) * 100`.
- [ ] **Result Documentation:** Record the final percentage in the metrics report. Since the success criterion is a strict 100%, meticulously document any specific error scenario that caused a form reset or data loss so the development team can address it.

### Task #11: Metric Measurement - Common Element Consistency

**Description:**
Perform a systematic manual inspection across all system screens to verify that common interface elements (such as buttons, navigation components, labels, and messages) maintain strict consistency in position, appearance, and behavior.

**Checklist:**
- [ ] **Define Common Elements List:** Create a definitive baseline list of all recurring UI elements that should be standardized across the system (e.g., primary action buttons, navigation menus, input labels, success/error messages).
- [ ] **Screen Mapping:** Compile a list of all active screens in the system that need to be inspected to ensure full coverage.
- [ ] **Manual Inspection:** Navigate through all system screens and systematically check each recurring element against the baseline. Verify that its position (layout placement), appearance (color, size, typography), and behavior (interactions, hover states) remain exactly the same across the entire application.
- [ ] **Metric Calculation:** Count the total number of common element instances reviewed and how many maintained perfect consistency. Calculate the final percentage: `(Consistent Element Instances / Total Element Instances Evaluated) * 100`.
- [ ] **Result Documentation:** Record the final percentage in the project's metrics report. Given the strict 100% success criterion, clearly document any specific element (including the screen it is on) that deviates in position, style, or behavior so the team can standardize it.
