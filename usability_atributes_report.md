# Usability Attributes Analysis

**Scheduling System — Agenda Module | May 2026**

Attributes evaluated: **Management and Prevention of Errors** · **User Control and Efficiency**

---

## 1. Scope and Purpose

This report maps the empirical evidence collected across the four usability testing sessions to two core usability attributes defined for the Scheduling System project. For each attribute, session observations are linked to the system's non-functional usability requirements (RNF-US-01 through RNF-US-07) to identify where the current implementation satisfies, partially satisfies, or fails to satisfy the stated goals.

**Participants evaluated:**
- Karla Medina (Secretary/Administrative, 53)
- Adalberto Manzanilla (Department Head, 62)
- Elizabeth Delgado Cuevas (Administrative User, 58)
- Selene Romero (Homemaker, 56)

---

## 2. Attribute 1 — Management and Prevention of Errors

### 2.1 Definition

This attribute covers the system's capacity to: (a) prevent foreseeable errors from occurring, (b) detect errors as they happen, and (c) allow users to recover from errors quickly and without data loss. It corresponds to heuristics H5 (error prevention) and H9 (help users recognize, diagnose, and recover from errors) and maps to requirements RNF-US-01, RNF-US-02, RNF-US-04, RNF-US-05, and RNF-US-07.

---

### 2.2 Evidence from Sessions

**Finding A — Absent input validation and pre-action confirmation**

Across the appointment creation and rescheduling flows, the system accepts inputs without real-time feedback or validation. Incorrect dates were entered and accepted without any alert, and no pre-action summary was displayed before committing multi-step operations. The Save/Confirm button lacked visual prominence, leaving users unable to reliably identify when a form was complete. A functional defect — the original appointment remaining active after a rescheduling operation — went undetected partly because no confirmation summary was shown before commit.

- Participants: Karla Medina, Selene Romero, Adalberto Manzanilla (3/4)
- Metric impact: M-01 (avoidable errors ~10–20%), M-03 (completion without restart ~60–70%), M-04 (confidence ~2.5–2.8/5)
- Requirement gap: **RNF-US-01** — the system does not block or flag implausible inputs at entry time. **RNF-US-07** — no pre-action summary or visual confirmation step exists; the primary CTA is not consistently visible, preventing users from reaching the confirmation stage.

---

**Finding B — Recovery mechanisms exist but are not reliably perceptible**

The "Undo" feature is technically present but its visual implementation is insufficient: one participant permanently lost an appointment because the notification was not perceived within the 5-second window. The inbox deletion flow compounds this problem by offering no confirmation gate at all — destructive actions execute immediately, with no prevention layer and no reliable recovery path.

- Participants: Adalberto Manzanilla, Elizabeth Delgado Cuevas (2/4)
- Metric impact: M-01 (~12–15%), M-04 (~2.8/5), M-05 (~55–70%)
- Requirement gap: **RNF-US-02** — the reversibility window exists technically but fails to meet the clarity and noticeability criteria in practice. **RNF-US-05** — confirmation before permanent deletion of inbox requests is mandated but absent.

---

**Finding C — Error messages do not guide specific recovery**

When system errors occur, messages communicate that something went wrong without identifying the specific cause or prescribing a corrective action. Users resolve errors through trial-and-error rather than by following system guidance, which inflates recovery time and reduces autonomy even for the most experienced participant.

- Participants: Elizabeth Delgado Cuevas (primary); pattern consistent across sessions where errors were encountered
- Metric impact: M-02 (~18–25 s), M-05 (~70%)
- Requirement gap: **RNF-US-04** — the requirement mandates that every error message include the cause of the error and an actionable instruction; current messages satisfy neither criterion reliably.

---

### 2.3 Requirements Compliance — Management and Prevention of Errors

| Requirement | Description | Status | Evidence |
| --- | --- | --- | --- |
| RNF-US-01 | Prevention of invalid selections | ❌ Not met | Incorrect dates accepted without validation (Karla, Selene) |
| RNF-US-02 | Action reversibility window | ⚠️ Partial | Feature exists but undo window not perceived; permanent data loss occurred (Adalberto) |
| RNF-US-04 | Clarity of error messages | ⚠️ Partial | Messages exist but are too generic to guide specific recovery (Elizabeth) |
| RNF-US-05 | Confirmation of critical actions | ❌ Not met | Inbox deletions executed without confirmation dialog (Elizabeth) |
| RNF-US-07 | Preventive warnings | ❌ Not met | No pre-action summary displayed before commit; save button not prominently located |

---

## 3. Attribute 2 — User Control and Efficiency

### 3.1 Definition

This attribute covers the system's capacity to: (a) give users meaningful control over their actions (including undoing, cancelling, and navigating freely), and (b) support efficient task completion without unnecessary steps, restarts, or cognitive overhead. It corresponds to heuristics H3 (user control and freedom) and H7 (flexibility and efficiency of use), and maps to requirements RNF-US-02, RNF-US-03, and RNF-US-06.

---

### 3.2 Evidence from Sessions

**Finding D — Key interface controls and navigation landmarks are not independently discoverable**

The majority of participants were unable to locate filter controls, re-navigate to the Audit section after a first visit, identify calendar grid cells as interactive appointment-creation targets, or return to a previous calendar month without assistance. These are not edge-case features — filters and calendar navigation are central to the daily workflow of an administrative user managing a high-volume schedule. Their low discoverability forced slower, form-based alternatives and frequent evaluator intervention, driving elevated values across M-01, M-02, and M-05 in most sessions.

- Participants: Karla Medina, Elizabeth Delgado Cuevas, Selene Romero (3/4); Karla and Selene most severely affected
- Metric impact: M-01 (~10–20%), M-02 (recovery times above threshold in sessions without prior experience), M-05 (~50–70%)
- Requirement gap: **RNF-US-06** — the requirement mandates always-available, contextual visibility of schedule status. Filters and navigation controls are the mechanism for this visibility; when they are not discoverable, the requirement is not met regardless of whether the features exist in the interface.

---

**Finding E — Multi-step workflows lack state persistence and a communicated workflow model**

When a multi-step flow (individual rescheduling, bulk rescheduling) was interrupted — whether accidentally or due to confusion — the system discarded all previously entered data, forcing a complete restart. In the bulk rescheduling case, the participant could not determine whether actions should be performed individually or all at once; without a visible workflow model, there was no basis for informed navigation or recovery. Both patterns produced the highest M-02 values in the study and were the primary driver of M-03 failures for this participant.

- Participant: Adalberto Manzanilla (both issues); workflow-model confusion mirrored for complex tasks in other sessions
- Metric impact: M-02 (~40–50 s), M-03 (~70%), M-04 (~2.8/5), M-05 (~55%)
- Requirement gap: **RNF-US-03** — the requirement specifies that users can go back and edit any previous step without losing data. The current implementation discards state on cancellation and provides no step-indicator or model explanation for multi-stage operations.

---

### 3.3 Requirements Compliance — User Control and Efficiency

| Requirement | Description | Status | Evidence |
| --- | --- | --- | --- |
| RNF-US-02 | Action reversibility window | ⚠️ Partial | Undo exists but was not perceived; no broader cancellation support in multi-step flows |
| RNF-US-03 | Error correction without task restart | ❌ Not met | Full restart required after accidental flow cancellation (Adalberto) |
| RNF-US-06 | Permanent visibility of schedule status | ❌ Not met | Calendar navigation controls insufficient; filter discovery failed; section re-navigation failed |

---

## 4. Cross-Attribute Summary

| Finding | Attribute | Requirements | Participants Affected | Failed Metrics | Severity |
| --- | --- | --- | --- | --- | --- |
| A — No input validation or pre-action confirmation | Error Prevention | RNF-US-01, RNF-US-07 | Karla, Selene, Adalberto (3/4) | M-01, M-03, M-04 | High |
| B — Recovery mechanisms not reliably perceptible | Error Recovery | RNF-US-02, RNF-US-05 | Adalberto, Elizabeth (2/4) | M-01, M-04, M-05 | Critical |
| C — Error messages do not guide specific recovery | Error Management | RNF-US-04 | Elizabeth (1/4); pattern broader | M-02, M-05 | Medium |
| D — Key controls and navigation not discoverable | Efficiency | RNF-US-06 | Karla, Elizabeth, Selene (3/4) | M-01, M-02, M-05 | High |
| E — Multi-step flows lack state and workflow model | User Control | RNF-US-03 | Adalberto (1/4); partial in others | M-02, M-03, M-04, M-05 | High |

---

## 5. Attribute-Level Conclusions

**Management and Prevention of Errors**

Three patterns emerged consistently across the sessions. First, the system lacks preventive mechanisms at the input and confirmation stage: incorrect entries are accepted silently, actions commit without a summary review step, and the path to confirmation is not visually prominent (Finding A). Second, the mechanisms intended to enable recovery from mistakes — the undo window and inbox deletion flow — either fail perceptually or are absent entirely, exposing users to irreversible data loss (Finding B). Third, error messages exist but do not communicate cause or corrective action, so users who do encounter errors must resolve them by trial-and-error rather than by following system guidance (Finding C). M-05 (autonomous error resolution) failed across all four participants, indicating that error management depends on evaluator presence rather than on system design.

**User Control and Efficiency**

Two patterns dominate this attribute. The discoverability of key controls — filters, audit navigation, calendar grid interaction, and temporal navigation — was insufficient for three of four participants, forcing detours and evaluator reliance for tasks that should be routine (Finding D). Separately, multi-step workflows discard all state on interruption and provide no visible model of their structure, making recovery from accidental cancellation costly and bulk operations opaque (Finding E). Together, these patterns mean that users cannot efficiently access the schedule data they need or confidently complete operations that span more than one step.

**Combined Observation**

Both attributes point to the same structural gap: the interface does not communicate system state or action consequences clearly enough for the target user population. Across all sessions, M-01, M-03, and M-05 failed universally. M-02 and M-04 met threshold only for participants with prior experience in comparable systems. The system's current usability effectively requires background knowledge that the target administrative profile cannot be assumed to have — a design gap that will not self-correct as users gain familiarity, because the missing mechanisms (validation, confirmation, discoverability) are absent at the architectural level.
