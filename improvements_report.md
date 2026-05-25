# Improvement Action Plan

**Scheduling System — Agenda Module | Based on May 2026 Usability Testing**

---

## Priority Criteria

Items are prioritized by two factors:  
**Impact** — how many participants were affected and how severely (metric failure, data loss, task failure).  
**Effort** — estimated implementation complexity (Low / Medium / High).

| Priority | Criteria |
| --- | --- |
| P1 — Critical | Data loss or task failure; ≥ 2 participants affected |
| P2 — High | Significant guidance dependency or task failure; 2–3 participants affected |
| P3 — Medium | Guidance required but task eventually completed; 1–2 participants affected |
| P4 — Low | Minor friction; 1 participant; workaround available |

---

## P1 — Critical (Fix Before Release)

### I-01 · Make "Undo" notification impossible to miss

**Problem:** After deleting an appointment, the reversibility window (RNF-US-02) exists but was not perceived. Adalberto suffered permanent data loss as a direct result.

**Improvement:**
- Replace the current subtle notification with a prominent, full-attention banner (e.g., fixed bottom bar with high-contrast color and a large "Undo" button).
- Extend the display duration to at least 5 seconds with a visible countdown.
- Optionally add a brief sound or haptic signal on deletion to draw attention before the notification appears.

**Participants affected:** Adalberto Manzanilla  
**Requirements addressed:** RNF-US-02  
**Effort:** Low

---

### I-02 · Add confirmation dialog before destructive actions in the inbox

**Problem:** Elizabeth deleted two of three inbox requests accidentally. There was no confirmation step before the action was executed, violating RNF-US-05.

**Improvement:**
- Add a modal confirmation dialog ("Are you sure you want to delete this request? This action cannot be undone.") before any delete action in the inbox.
- Use a destructive-action button style (e.g., red button) to reinforce the weight of the decision.

**Participants affected:** Elizabeth Delgado Cuevas  
**Requirements addressed:** RNF-US-05  
**Effort:** Low

---

### I-03 · Fix the rescheduling system bug (duplicate appointment)

**Problem:** Adalberto identified that rescheduling created the new appointment but left the original one active, producing duplicate entries in the system.

**Improvement:**
- Ensure the rescheduling transaction atomically cancels the original appointment and activates the new one. No partial state should be possible.
- If the issue is a race condition or async update, add a post-reschedule confirmation showing the final state ("Original appointment cancelled. New appointment created for [date/time]").

**Participants affected:** Adalberto Manzanilla  
**Requirements addressed:** RNF-US-07  
**Effort:** Medium (requires backend fix)

---

## P2 — High (Address in Next Sprint)

### I-04 · Increase Save / Confirm button prominence

**Problem:** Karla and Selene could not locate the Save/Confirm button during appointment creation, leading to confusion, wasted time, and low confidence (M-04 ~2.5/5 for both).

**Improvement:**
- Use a primary-action button style (larger, high-contrast, e.g., filled with accent color) that stands out from the rest of the form.
- Fix the button at the bottom of the form, always in the same position regardless of scroll state.
- Label it explicitly: "Confirm Appointment" rather than a generic "Save" or icon-only button.

**Participants affected:** Karla Medina, Selene Romero  
**Requirements addressed:** RNF-US-07  
**Effort:** Low

---

### I-05 · Make filter controls discoverable

**Problem:** 3 of 4 participants (Karla, Elizabeth, Selene) failed to find or use the agenda filters autonomously. Filters are the primary efficiency feature for high-volume scheduling.

**Improvement:**
- Move filter controls to a visually prominent location above the calendar/list view (persistent, not collapsed by default).
- Add clear labels ("Filter by therapist," "Filter by room") and consider a filter icon with text, not icon alone.
- Add a visible "Filters" pill or button that shows the active filter count when applied ("Filters: 2 active").

**Participants affected:** Karla Medina, Elizabeth Delgado Cuevas, Selene Romero  
**Requirements addressed:** RNF-US-06  
**Effort:** Medium

---

### I-06 · Preserve flow state on accidental cancellation

**Problem:** Adalberto accidentally cancelled the rescheduling flow and had to re-enter all data from scratch, directly violating RNF-US-03.

**Improvement:**
- Store form state in session/local state so that if the user accidentally navigates away or cancels, they are shown a prompt: "You have unsaved changes. Continue editing or discard?"
- Allow return to the partially completed form with data intact.

**Participants affected:** Adalberto Manzanilla  
**Requirements addressed:** RNF-US-03  
**Effort:** Medium

---

### I-07 · Add real-time date validation and action preview

**Problem:** Karla entered an incorrect date with no immediate system feedback. Combined with the missing action preview, this led to a wasted create-cancel-recreate cycle.

**Improvement:**
- Validate date inputs on blur (when the field loses focus): show an inline confirmation ("Appointment will be set for Thursday, May 19") so the user can spot errors before submitting.
- Display a pre-confirmation summary before the final submit action listing all selected values (patient, therapist, room, date/time).

**Participants affected:** Karla Medina  
**Requirements addressed:** RNF-US-01, RNF-US-07  
**Effort:** Low–Medium

---

### I-08 · Add breadcrumb and temporal navigation controls to the calendar

**Problem:** Karla navigated to a different month and could not return autonomously. The calendar lacks visible navigation controls and location feedback.

**Improvement:**
- Add a persistent breadcrumb or date label (e.g., "May 2026 ›") indicating the current calendar view.
- Add "Previous / Next" arrow controls and a "Today" shortcut button in a fixed position above the calendar grid.
- Consider a date-picker quick-jump for navigating to a specific date without multiple clicks.

**Participants affected:** Karla Medina  
**Requirements addressed:** RNF-US-06  
**Effort:** Low

---

## P3 — Medium (Address in Upcoming Iteration)

### I-09 · Improve main menu labels and section findability

**Problem:** Karla and Selene could not re-navigate to the Audit section after visiting it once. Section names in the menu are not sufficiently descriptive.

**Improvement:**
- Rename menu items to be task-oriented (e.g., "Audit Log" instead of "Audit"; "Pending Requests" instead of "Inbox").
- Add recognizable icons alongside text labels.
- Highlight the active section with a clear visual indicator.

**Participants affected:** Karla Medina, Selene Romero  
**Requirements addressed:** RNF-US-06  
**Effort:** Low

---

### I-10 · Add visual affordance to calendar grid cells for appointment creation

**Problem:** Karla and Selene failed to identify the correct cell in the calendar grid to create a direct appointment. Cells were not visually interactive.

**Improvement:**
- On hover, highlight the cell and show a tooltip or inline label ("Thursday 21 — 12:00 · Click to add appointment").
- Consider a "+" icon that appears inside cells on hover to signal createability.

**Participants affected:** Karla Medina, Selene Romero  
**Requirements addressed:** RNF-US-06  
**Effort:** Low

---

### I-11 · Rewrite error messages to be specific and actionable

**Problem:** Elizabeth misread error messages as generic field-level errors rather than specific resource conflicts (e.g., room already booked).

**Improvement:**
- Every error message must include: (1) the specific cause ("Room 3 is already booked at 3:00 PM on May 20") and (2) a direct corrective action ("Please select a different room or time slot").
- Avoid generic messages like "There is a conflict" or "Please check your inputs."

**Participants affected:** Elizabeth Delgado Cuevas  
**Requirements addressed:** RNF-US-04  
**Effort:** Low (copy/UX writing task)

---

### I-12 · Add instructional copy and step indicator to bulk rescheduling

**Problem:** Adalberto could not determine whether bulk rescheduling operated individually or all at once, rendering the entire flow inaccessible.

**Improvement:**
- Add a brief inline explanation at the top of the bulk rescheduling view ("This will reschedule all selected appointments at once. Review the list and confirm.").
- Include a step indicator (e.g., Step 2 of 3) to give users a sense of progress and control.

**Participants affected:** Adalberto Manzanilla  
**Requirements addressed:** RNF-US-03  
**Effort:** Low

---

## P4 — Low (Backlog / Future Consideration)

### I-13 · Contextual onboarding for first-time and low-experience users

**Problem:** All four participants would have benefited from brief guidance on the system's key flows. The target user population includes users with no prior digital experience (Selene) and users unfamiliar with the domain (Karla, Adalberto).

**Improvement:**
- Add an optional guided walkthrough for the first session (skippable for experienced users).
- Add contextual tooltips (e.g., small "?" icons) next to non-obvious elements like the filter panel, bulk reschedule, and Audit Log.

**Participants affected:** All  
**Effort:** High

---

## Summary Table

| ID | Improvement | Priority | Participants Affected | Requirement | Effort |
| --- | --- | --- | --- | --- | --- |
| I-01 | Undo notification prominence | P1 — Critical | 1 (data loss) | RNF-US-02 | Low |
| I-02 | Inbox deletion confirmation dialog | P1 — Critical | 1 (data loss) | RNF-US-05 | Low |
| I-03 | Fix rescheduling duplicate bug | P1 — Critical | 1 | RNF-US-07 | Medium |
| I-04 | Save/Confirm button prominence | P2 — High | 2 | RNF-US-07 | Low |
| I-05 | Filter control discoverability | P2 — High | 3 | RNF-US-06 | Medium |
| I-06 | Preserve flow state on cancel | P2 — High | 1 | RNF-US-03 | Medium |
| I-07 | Real-time date validation + preview | P2 — High | 1 | RNF-US-01, RNF-US-07 | Low–Medium |
| I-08 | Calendar breadcrumb + navigation | P2 — High | 1 | RNF-US-06 | Low |
| I-09 | Menu labels and section findability | P3 — Medium | 2 | RNF-US-06 | Low |
| I-10 | Calendar grid cell affordance | P3 — Medium | 2 | RNF-US-06 | Low |
| I-11 | Specific, actionable error messages | P3 — Medium | 1 | RNF-US-04 | Low |
| I-12 | Bulk rescheduling instructions | P3 — Medium | 1 | RNF-US-03 | Low |
| I-13 | Onboarding / contextual tooltips | P4 — Low | All | — | High |

---

## Recommended Implementation Order

**Immediate (before next test round):** I-01, I-02, I-04, I-08, I-09, I-11, I-12 — these are all low-effort and address critical or high-priority issues. Together they close the most visible friction points without requiring architectural changes.

**Next sprint:** I-03, I-05, I-06, I-07, I-10 — these require more development work but address the highest-frequency issues (filters, flow state, validation).

**Future iteration:** I-13 — contextual onboarding is valuable but depends on stable flows being in place first; implementing it over an interface that is still changing would waste the effort.
