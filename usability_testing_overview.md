    # Usability Testing — Agenda Module

    **ClinicaWeb | UADY Faculty of Psychology Clinic | May 2026**

    ---

    ## 1. Test Details

    ### Technique
    Sessions were conducted under the **think-aloud protocol**: participants were asked to verbalize their thought process as they interacted with the system, allowing evaluators to identify confusion, hesitation, and decision points in real time. Audio from each session was recorded in full to support post-session metric estimation and qualitative analysis.

    ### Participant Selection
    Participants were selected from the team members' family circles. The selection criterion was proximity to the target user persona: administrative or semi-administrative backgrounds, ages between 53 and 62, and limited to no prior experience with specialized clinical management software.

    | Participant | Age | Profile | Digital Experience |
    |---|---|---|---|
    | Karla Medina | 53 | Secretary / Administrative | Basic — Word and Excel |
    | Adalberto Manzanilla | 62 | Department Head | High — 30+ years file and data management |
    | Elizabeth Delgado Cuevas | 58 | Administrative User | Medium-High — prior experience with similar systems |
    | Selene Romero | 56 | Homemaker | None — no prior experience with Word or Excel |

    ### Context and Task Briefing
    Before each session, the evaluator provided participants with a detailed contextual explanation of the system: its purpose, the role they would play (administrative staff managing clinical appointments), and the goal of each task. Step-by-step instructions were not given during tasks, but the initial briefing was extensive to ensure all participants operated from the same baseline understanding. This briefing requirement itself reflects a gap: a well-designed system should not require extensive onboarding to be usable by its target population.

    Sessions lasted between 16 and 19 minutes each.

    ---

    ## 2. Materials Used

    ### Use Cases
    Tasks were designed directly from the system's defined use cases ([use_cases.md](use_cases.md)). Each task covered one or more use cases:

    | Task | Use Case |
    |---|---|
    | Create a therapy appointment | UC-AG-01 |
    | Reschedule an existing appointment | UC-AG-02 |
    | Cancel an appointment | UC-AG-03 |
    | Process incoming requests from inbox | UC-AG-04 |
    | Execute bulk rescheduling | UC-AG-05 |
    | Filter the agenda view | UC-AG-06 |
    | Review schedule workload and alerts | UC-AG-07 |

    ### Interface
    The prototype evaluated was the Agenda Module web interface ([prototype/agenda/agenda.html](prototype/agenda/agenda.html)), which includes: a weekly calendar view with appointment creation wizard (4-step flow), incoming request inbox, audit log, filter bar, and bulk rescheduling module.

    ### Metrics and Usability Attributes
    Evaluation was guided by the five metrics defined in [MetricsMeasurementTasks.md](MetricsMeasurementTasks.md), derived from the three usability attributes selected for the project ([usability_attributes_selection_rationale.md](usability_attributes_selection_rationale.md)):

    | Metric | Attribute | Threshold |
    |---|---|---|
    | M-01 — Avoidable error rate | Low error rate | ≤ 5% |
    | M-02 — Error recovery time | Low error rate | Mean ≤ 30 s |
    | M-03 — Completion without restart | Low error rate | ≥ 90% |
    | M-04 — Perceived confidence before confirming | Satisfaction | ≥ 4.0 / 5 |
    | M-05 — Autonomous error resolution | Learnability | ≥ 85% |

    ---

    ## 3. Evidence

    Sessions were recorded as audio files. Each recording covers the participant's verbalization and the evaluator's facilitation from task start to session end. Metric values reported in this document are qualitative estimates derived from transcript analysis, applied against the protocol defined in MetricsMeasurementTasks.md.

    **Usability Tests evidence (audio recordings):** [Google Drive folder](https://drive.google.com/drive/folders/1T5L61E-rVzr8L_b3Ilw5TV5gkWhFXjWy?usp=drive_link)

    Individual session reports are available in the [usability_tests/users/](usability_tests/users/) directory, one file per participant.

    ---

    ## 4. Data Analysis

    ### 4.1 Metric Results by Participant

    | Metric | Threshold | Karla | Adalberto | Elizabeth | Selene | Pass Rate |
    |---|---|---|---|---|---|---|
    | M-01 Avoidable error rate | ≤ 5% | ~20% ❌ | ~15% ❌ | ~12% ❌ | ~10% ❌ | **0 / 4** |
    | M-02 Error recovery time | ≤ 30 s | ~45-60 s ❌ | ~40-50 s ❌ | ~18-25 s ✅ | ~30 s ✅ | **2 / 4** |
    | M-03 Completion without restart | ≥ 90% | ~60% ❌ | ~70% ❌ | ~80% ❌ | ~60% ❌ | **0 / 4** |
    | M-04 Perceived confidence | ≥ 4.0 / 5 | ~2.5 ❌ | ~2.8 ❌ | ~4.2 ✅ | ~2.5 ❌ | **1 / 4** |
    | M-05 Autonomous error resolution | ≥ 85% | ~50% ❌ | ~55% ❌ | ~70% ❌ | ~50% ❌ | **0 / 4** |
    | **Thresholds met** | — | **0 / 5** | **0 / 5** | **2 / 5** | **1 / 5** | — |

    > 📊 **[Suggested graphic: grouped bar chart — one group per participant, five bars per group (one per metric), with threshold lines marked in red]**

    ---

    ### 4.2 Key Findings

    **Finding 1 — M-01, M-03, and M-05 failed universally (0 of 4 participants)**

    Every participant produced avoidable errors, failed to complete tasks cleanly, and could not resolve errors autonomously. These three metrics form the core usability deficit. The system's preventive mechanisms exist technically but are not perceived, understood, or actionable for the target user profile.

    > 📊 **[Suggested graphic: traffic light table or heatmap — rows = metrics, columns = participants, cells colored red/yellow/green by pass/fail]**

    ---

    **Finding 2 — Filter discoverability failed in 3 of 4 sessions**

    Filter controls (therapist, room, patient, type) were not independently located by Karla, Elizabeth, or Selene. All three required evaluator intervention before the filter bar was found. This is the most widespread single issue in the study and directly impacts M-01, M-02, and M-05.

    ---

    **Finding 3 — Rescheduling flows are the highest source of failure (3 of 4 affected)**

    Individual rescheduling caused a complete flow restart for Adalberto (accidental cancellation, all data lost). It required continuous guidance for Karla and Selene. Bulk rescheduling was entirely opaque to Adalberto, who could not determine whether operations were performed individually or in batch. A confirmed system bug was also detected: the original appointment remained active after rescheduling.

    ---

    **Finding 4 — UC-AG-03 (appointment cancellation) is the only consistently smooth flow**

    All three participants who performed the cancellation task completed it independently. This flow's visual design — a clear confirmation dialog with explicit "Cancel appointment" and "Keep appointment" buttons — is a functional reference pattern for other flows in the system.

    ---

    **Finding 5 — Experience with similar systems predicts performance; general digital literacy does not**

    Elizabeth (prior experience with similar systems) was the strongest performer despite not being the youngest or most digitally literate. Adalberto (high literacy, different domain) scored only marginally better than Karla (low literacy), suggesting the system does not transfer general digital skills — it depends on prior familiarity with analogous workflows.

    > 📊 **[Suggested graphic: scatter plot — x = digital experience level (None / Basic / Medium / High), y = thresholds met (0–5); annotate each point with participant name]**

    ---

    ### 4.3 Relation to Usability Attributes

    | Attribute | Metrics | Result | Interpretation |
    |---|---|---|---|
    | **Low error rate** | M-01, M-02, M-03 | M-01 and M-03: 0% pass rate. M-02: 50%. | The system generates errors consistently and users cannot complete flows without restarts. Prevention mechanisms are present but imperceptible. |
    | **Satisfaction** | M-04 | 25% pass rate (1/4 participants) | Only the participant with prior system experience felt confident before confirming. The interface does not build confidence for unfamiliar users — a direct failure of RNF-US-05, RNF-US-06, and RNF-US-07. |
    | **Learnability** | M-05 | 0% pass rate | No participant resolved errors autonomously at threshold. The system's recovery mechanisms (undo, error messages, back navigation) exist but are not self-explanatory, meaning the system does not teach itself to its users through use. |

    For the detailed data behind each finding, see the full consolidated report: [usability_tests/Usability_tests_report.md](usability_tests/Usability_tests_report.md)

    ---

    ## 5. Results

    ### Overall System Assessment

    The Agenda Module in its current state does not meet any of the three usability attributes established for the project for the majority of its target users. No participant met M-01, M-03, or M-05. Only one participant (Elizabeth Delgado) passed M-04, and only two participants (Elizabeth and Selene) met M-02 — and in Selene's case, only with constant evaluator support.

    ### Behavior with Unfamiliar Users

    Users without prior experience in similar systems (Karla, Selene, and partially Adalberto) required continuous evaluator intervention across almost every task. The session briefing had to be unusually detailed to allow any task to begin. This pattern indicates that the system's learnability is effectively zero without external instruction — a critical failure for a tool intended to be adopted by administrative staff with heterogeneous digital backgrounds.

    Notably, Selene (no digital experience) produced the fewest avoidable errors (M-01 ~10%), not because the interface guided her better, but because her inexperience made her more cautious and deliberate. She still failed M-03, M-04, and M-05 entirely.

    ### What Can Be Improved

    The evidence points to three structural gaps that affect all three usability attributes simultaneously:

    1. **Visibility of primary actions** — The Save/Confirm button was not found independently by half the participants. The undo window was missed entirely in one session, causing permanent data loss. Critical CTAs need higher visual prominence and fixed, predictable positioning.

    2. **Discoverability of secondary controls** — Filters, audit navigation, and calendar grid interaction are not intuitively accessible. Progressive disclosure, onboarding cues, or improved visual affordances are needed before these features can be considered functional for the target user.

    3. **Multi-step flow transparency** — The appointment creation wizard and the rescheduling flows do not communicate their structure, state, or consequences clearly enough. Users cannot determine what step they are on, what will happen when they confirm, or how to recover if they cancel accidentally. State must be preserved across flow interruptions, and a visible step model must communicate the workflow.

    These gaps are not superficial — they are architectural. Addressing them requires design changes, not cosmetic fixes.
