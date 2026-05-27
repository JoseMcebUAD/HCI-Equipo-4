# Usability Testing — Consolidated Cross-Participant Report

**Scheduling System — Agenda Module | May 2026**

---

## 1. Overview

Five participants completed usability testing sessions under the think-aloud protocol during May 2026. Sessions ranged from 11 to 19 minutes. Five usability metrics (M-01 through M-05) were evaluated against pre-defined thresholds. M-01 failed across all five participants. Antonio Perez was the strongest overall performer, meeting four of five thresholds (M-02, M-03, M-04, M-05). Karla Medina and Adalberto Manzanilla showed the weakest performance, each meeting zero thresholds.

---

## 2. Participant Profiles

| Participant | Age | Profile | Digital Experience | Session Duration |
| --- | --- | --- | --- | --- |
| Karla Medina | 53 | Secretary / Administrative | Basic — Word and Excel | ~16 min |
| Adalberto Manzanilla | 62 | Department Head | High — 30+ years file and data management | ~16 min |
| Elizabeth Delgado Cuevas | 58 | Administrative User | Medium-High — prior experience with similar systems | ~18 min |
| Selene Romero | 56 | Homemaker | None — no prior experience with Word or Excel | ~19 min |
| Antonio Perez | 58 | Systems Engineer | Basic — Word and Excel | ~11 min |

---

## 3. Metrics Comparison — All Participants

| Metric | Threshold | Karla | Adalberto | Elizabeth | Selene | Antonio | Threshold Met |
| --- | --- | --- | --- | --- | --- | --- | --- |
| M-01 Avoidable error rate | ≤ 5% | ~20% ❌ | ~15% ❌ | ~12% ❌ | ~10% ❌ | ~10% ❌ | 0 / 5 |
| M-02 Error recovery time | Mean ≤ 30 s | ~45-60 s ❌ | ~40-50 s ❌ | ~18-25 s ✅ | ~30 s ✅ | ~20 s ✅ | 3 / 5 |
| M-03 Completion without restart | ≥ 90% | ~60% ❌ | ~70% ❌ | ~80% ❌ | ~90% ✅ | ~90% ✅ | 2 / 5 |
| M-04 Perceived confidence | ≥ 4.0 / 5 | ~2.5 / 5 ❌ | ~2.8 / 5 ❌ | ~4.2 / 5 ✅ | ~4.5 / 5 ✅ | ~4.5 / 5 ✅ | 3 / 5 |
| M-05 Autonomous error resolution | ≥ 85% | ~50% ❌ | ~55% ❌ | ~70% ❌ | ~80% ❌ | ~90% ✅ | 1 / 5 |
| **Thresholds met** | — | **0 / 5** | **0 / 5** | **2 / 5** | **3 / 5** | **4 / 5** | — |

---

## 4. Best vs. Worst Performer Per Metric

| Metric | Direction | Best Performer | Value | Worst Performer | Value | Gap |
| --- | --- | --- | --- | --- | --- | --- |
| M-01 Avoidable error rate | Lower is better | Selene / Antonio | ~10% | Karla Medina | ~20% | 10 pp |
| M-02 Error recovery time | Lower is better | Antonio Perez | ~20 s | Karla Medina | ~45-60 s | ~35 s |
| M-03 Completion without restart | Higher is better | Selene / Antonio | ~90% | Karla Medina | ~60% | 30 pp |
| M-04 Perceived confidence | Higher is better | Selene / Antonio | ~4.5 / 5 | Karla Medina | ~2.5 / 5 | 2.0 pts |
| M-05 Autonomous error resolution | Higher is better | Antonio Perez | ~90% | Karla Medina | ~50% | 40 pp |

> Antonio Perez leads or co-leads four of five metrics. Karla Medina records the worst value in all five categories. Selene Romero, despite having no prior digital experience, co-leads M-01 and M-03 alongside Antonio and surpasses Elizabeth in M-04 — her caution reduced errors, and the refactored data reflects stronger overall completion than initially estimated.

---

## 5. Task Performance Comparison

Tasks are grouped by use case. Results use the following codes:  
**I** = Completed independently · **G** = Completed with guidance · **P** = Partial / incomplete · **F** = Failed · **–** = Not evaluated in this session

| Use Case / Task | Karla | Adalberto | Elizabeth | Selene | Antonio |
| --- | --- | --- | --- | --- | --- |
| UC-AG-01 — Create therapy appointment | G | I | I | G | I |
| UC-AG-02 — Reschedule appointment | G | G (difficulty) | I | I | I |
| UC-AG-03 — Cancel appointment | I | F | I | I | I |
| UC-AG-04 — Inbox / incoming requests | P | – | F | P | P |
| UC-AG-05 — Error recovery / bulk reschedule | – | F | G | – | – |
| UC-AG-06 — Filter agenda | G | I | F | G | G |
| UC-AG-07 — Workload review | – | – | G | – | – |
| UC-AG-01 (alt) — Create from calendar grid | F | – | – | I | I |

> UC-AG-03 (appointment cancellation) is the only task with a fully consistent positive pattern — all participants who performed it completed it independently. UC-AG-04 (inbox) remains structurally untestable due to lack of live data. Antonio and Selene completed the calendar grid creation flow independently; Karla failed it entirely.

---

## 6. Task Performance Summary Per Participant

| Participant | Tasks Performed | Independent | Guided / Difficulty | Partial | Failed | Completion Rate | Independence Rate |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Karla Medina | 6 | 1 | 3 | 1 | 1 | 83% | 17% |
| Adalberto Manzanilla | 6 of 10 | 3 | 1 | 0 | 2 | 67% | 50% |
| Elizabeth Delgado Cuevas | 9 | 5 | 3 | 0 | 1 | 89% | 56% |
| Selene Romero | 6 | 3 | 2 | 1 | 0 | 100% | 50% |
| Antonio Perez | 6 | 4 | 1 | 1 | 0 | 100% | 67% |

> Antonio achieved the highest independence rate (67%) across the fewest minutes (11). Selene's figures were substantially revised upward from the initial report: three tasks completed independently and zero failures, reflecting her cautious but effective approach. Elizabeth evaluated the most tasks (9). Adalberto covered the fewest tasks relative to his 10-task protocol (60% coverage) due to 4 untested flows.

---

## 7. Cross-Participant Issues Matrix

| Issue | Karla | Adalberto | Elizabeth | Selene | Antonio | Participants Affected |
| --- | --- | --- | --- | --- | --- | --- |
| Save / Confirm button not found | ✓ | — | — | ✓ | — | 2 / 5 |
| Calendar grid slot not identifiable | ✓ | — | — | ✓ | — | 2 / 5 |
| Filter controls not discoverable | ✓ | — | ✓ | ✓ | ✓ | 4 / 5 |
| Rescheduling flow confusion / restart | ✓ | ✓ | — | ✓ | ✓ | 4 / 5 |
| Undo / reversibility window not noticed | — | ✓ | — | — | — | 1 / 5 |
| Menu / section re-navigation failure | ✓ | — | — | ✓ | — | 2 / 5 |
| Error message misinterpretation | — | — | ✓ | — | — | 1 / 5 |
| Accidental deletion of inbox items | — | — | ✓ | — | — | 1 / 5 |
| Bulk rescheduling workflow unclear | — | ✓ | — | — | — | 1 / 5 |
| System bug: original appointment not deleted on reschedule | — | ✓ | — | — | — | 1 / 5 |

> Filter discoverability and rescheduling confusion are now the two most widespread issues, each affecting 4 of 5 participants. Filter controls were not independently located by any participant except Adalberto; rescheduling caused errors or confusion for all others. The save/confirm button remained a blocker for 2 of 5 participants.

---

## 8. Digital Experience vs. Performance

| Participant | Prior System Experience | M-01 | M-02 | M-03 | M-04 | M-05 | Thresholds Met |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Antonio Perez | Basic (technical domain) | ~10% | ~20 s ✅ | ~90% ✅ | ~4.5 ✅ | ~90% ✅ | **4 / 5** |
| Selene Romero | None | ~10% | ~30 s ✅ | ~90% ✅ | ~4.5 ✅ | ~80% | **3 / 5** |
| Elizabeth Delgado Cuevas | High (similar systems) | ~12% | ~18-25 s ✅ | ~80% | ~4.2 ✅ | ~70% | **2 / 5** |
| Adalberto Manzanilla | High (different domain) | ~15% | ~40-50 s | ~70% | ~2.8 | ~55% | **0 / 5** |
| Karla Medina | Low (basic Office) | ~20% | ~45-60 s | ~60% | ~2.5 | ~50% | **0 / 5** |

> Antonio Perez is the strongest performer despite having only basic digital literacy — his Systems Engineer background appears to transfer structured problem-solving to this domain. Selene (no digital experience) outperformed Elizabeth (prior similar-system experience) in thresholds met, driven by cautious deliberation and a strong showing on M-03 and M-04. High digital experience in an **unrelated domain** (Adalberto) provides no meaningful advantage, scoring identically to Karla on all but M-02 and M-05.

---

## 9. Overall Metric Pass Rates

| Metric | Times Met | Times Failed | Pass Rate |
| --- | --- | --- | --- |
| M-01 Avoidable error rate (≤ 5%) | 0 | 5 | 0% |
| M-02 Error recovery time (≤ 30 s) | 3 | 2 | 60% |
| M-03 Completion without restart (≥ 90%) | 2 | 3 | 40% |
| M-04 Perceived confidence (≥ 4.0 / 5) | 3 | 2 | 60% |
| M-05 Autonomous error resolution (≥ 85%) | 1 | 4 | 20% |

> M-01 is the only metric that failed universally (0/5). M-02 and M-04 now reach 60% pass rates, indicating that error recovery speed and perceived confidence are achievable for participants with structured or cautious profiles. M-03 and M-05 remain majority failures, with autonomous task completion and independent error resolution still beyond most of the target population.

---

## 10. Key Findings

1. **M-01 failed universally (0/5); M-03 and M-05 remain majority failures.** Avoidable errors occurred for every participant regardless of background. Task completion without restart and autonomous error resolution improved only for participants with structured or cautious profiles (Selene, Antonio), but remain out of reach for the broader target population.

2. **Antonio Perez is the strongest performer (4/5 thresholds met), followed by Selene Romero (3/5).** Antonio's Systems Engineer background appears to transfer structured problem-solving even with basic digital literacy. Selene's cautious approach kept her error rate low and completion rate high despite having no prior digital experience. Elizabeth Delgado (2/5) was previously the top performer; her prior system experience remains relevant but is no longer uniquely decisive.

3. **UC-AG-03 (cancellation) is the only consistently smooth flow.** All participants who performed it completed it independently, confirming its visual design — a clear confirmation dialog with explicit action labels — as the reference pattern the rest of the system should follow.

4. **Filter controls are the most widespread failure point** (4 of 5 participants affected). No participant except Adalberto located them independently. The current design provides no onboarding, progressive disclosure, or visual affordance to guide discovery.

5. **Rescheduling flows (individual and bulk) are the highest source of errors and confusion**, affecting 4 of 5 participants. Symptoms range from incorrect date entry (resolved autonomously by Antonio and Selene) to full flow restarts and permanent data loss (Adalberto). A confirmed system bug — original appointment not deleted after rescheduling — adds to this failure cluster.

6. **Technical background and domain familiarity are stronger predictors of performance than general digital literacy.** Antonio (basic literacy, engineering domain) outperforms Adalberto (high literacy, unrelated domain) by 4 thresholds. The system's learnability transfers to users with analytical reasoning skills, not just digital fluency — a risk for the target population of administrative staff without technical backgrounds.
