| # | Usability Requirement | Priority | Justification |
|---|----------------------|----------|--------------|
| 1 | **Appointment Scheduling Time**: Administrative staff must be able to complete the scheduling of a psychology appointment, from session start to final confirmation, in less than 3 minutes in 95% of cases, provided all necessary information is available. | High | Directly impacts efficiency and productivity; delays affect service quality and user satisfaction. |
| 2 | **Visibility of Main Functions**: The main functions (create, edit, cancel appointments) must be directly visible on the main screen without requiring more than one click or tab to access them, following the principle of recognition rather than recall. | High | Critical for usability and learnability; reduces cognitive load and speeds up task execution. |
| 3 | **Required Field Validation**: The system must prevent saving an appointment until all required fields are completed, indicating in real time or at the moment of save attempt which fields are missing, with a visible message directly associated with the corresponding field. | High | Prevents user errors and incomplete data, aligning with error prevention heuristics. |
| 4 | **Prevention of Scheduling Conflicts**: The system must prevent double-booking by checking in real time that no psychologist is assigned to more than one appointment on the same date and time, displaying an immediate error message if a conflict is detected before saving. | High | Avoids critical system errors that could disrupt operations and affect multiple users. |
| 5 | **Clear Error Messages**: Error messages must: 1) Indicate what happened 2) Indicate how to fix it 3) Use non-technical language 4) Be visible near the point of action where the error occurred. | High | Essential for error recovery and user guidance, reducing frustration and confusion. |
| 6 | **Readable Text and Visual Comfort**: The interface must comply with WCAG 2.1 Level AA for text contrast (minimum contrast ratio of 4.5:1) and use a base font size of at least 12 points (16px), adjustable by the browser without breaking the layout. | Medium | Important for accessibility and inclusivity, but does not block core functionality. |
| 7 | **Simple and Non-Technical Language**: Interface texts must use everyday, user-oriented language, avoiding terms like “backend”, “module”, “system record”, and must be understandable by administrative staff without technical knowledge. | Medium | Improves understandability and reduces learning curve, but users may still complete tasks with minor difficulty. |
| 8 | **Clear Confirmation of Actions**: After saving, updating, or canceling an appointment, the system must display a clear and non-intrusive visual confirmation (e.g., temporary message with green background) in less than 1 second, and remain visible for an adequate duration between 2 and 5 seconds to ensure user perception without interrupting workflow. | Medium | Enhances feedback and user confidence, though absence would not completely block task completion. |
| 9 | **Standard Date Format**: All dates must be displayed and entered in dd/mm/yyyy format, with a visual date picker that prevents format errors, and automatic validation when entered manually. | Medium | Reduces input errors and ambiguity |
|10 | **Recovery from Errors**: When an error occurs (e.g., duplicate appointment, invalid field), the system must allow the user to correct the error without losing already entered data, preserving the current session state. | High | Critical for user control and freedom; prevents frustration and data loss. |
|11 | **Interface Consistency**: Common elements (save/cancel buttons, navigation, field labels) must maintain the same position, appearance, and behavior across all screens of the system. | Medium | Supports learnability and predictability, though inconsistencies may slow users rather than block them. |

## References

«¿Qué es la norma ISO 9241? Una guía completa sobre estándares de HCI y usabilidad», ALEKVS.
https://www.alekvs.com/es_mx/what-is-iso-9241-a-complete-guide-to-hci-and-usabilitystandards/

B. Shneiderman, «The Eight Golden Rules of Interface Design», University Of Maryland.
https://www.cs.umd.edu/users/ben/goldenrules.html

J. Nielsen, «10 Usability Heuristics for User Interface Design», Nielsen Norman Group.
https://www.nngroup.com/articles/ten-usability-heuristics/

W3C, «Web Content Accessibility Guidelines (WCAG) 2.1». https://www.w3.org/TR/WCAG21/