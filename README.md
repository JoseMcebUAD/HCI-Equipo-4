# HCI — Team 4
## Agenda Module · ClinicaWeb · UADY Psychology Clinic

This repository contains the user-centered design documentation, functional HTML prototype, and usability evaluation results for the **Agenda module** of ClinicaWeb — a digital management system for the UADY Faculty of Psychology Clinic. The module enables administrative staff (secretaries and coordinators) to manage patient appointments: scheduling, rescheduling (individual and bulk), cancelling, processing external requests, and reviewing the audit log. The prototype also includes supporting modules for Patients, Therapists, Rooms, and Reports.

### 🧪 Third Delivery: Usability Testing & Analysis

For this third delivery, the focus shifted to empirical evaluation. We conducted think-aloud usability sessions with four administrative-profile participants (ages 53–62) covering seven core task flows. All sessions were analyzed against five measurable metrics (M-01 through M-05), traced to the project's non-functional usability requirements (RNF-US-01 through RNF-US-07). Individual session reports were produced per participant, followed by three consolidated reports: a cross-participant analysis with comparison tables, a usability attribute analysis (Management and Prevention of Errors · User Control and Efficiency), and a prioritized improvement action plan.

Key findings: M-01 (avoidable errors), M-03 (completion without restart), and M-05 (autonomous error resolution) failed across all four participants. Filter discoverability and the rescheduling flow were the most widespread issues. Elizabeth Delgado Cuevas was the strongest performer, being the only participant to meet the confidence threshold (M-04), attributable to prior experience with similar administrative systems.

---

## Repository Structure

### 📁 Folders

| Folder | Description |
|--------|-------------|
| `prototype/` | Functional HTML prototype — includes the Agenda, Patients, Therapists, Rooms, Reports, and First Contact modules. Entry point: `index.html`. |
| `reschedule_protoype/` | High-fidelity prototype focused on the individual appointment rescheduling flow. Entry point: `index.html`. |
| `usability_tests/` | Individual session reports for all four participants plus three consolidated analysis reports. |

### 📄 Documentation Files

| File | Description |
|------|-------------|
| `UsabilityRequirements.md` | Usability requirements (RNF-US-01 through RNF-US-07) with name, description, justification, and acceptance criteria. |
| `use_cases.md` | Revised use cases (UC-AG-01 through UC-AG-08) reflecting the current system flow, with pre/postconditions and alternative flows. |
| `MetricsMeasurementTasks.md` | Five usability metrics (M-01 through M-05) following ISO/IEC/IEEE 15939:2017 — formula, threshold, measurement method, and collection procedure. |
| `usability_attributes_selection_rationale.md` | Rationale for the selection of the three project usability attributes (Low error rate, Satisfaction, Learnability) and how they apply to the system and its target user profile. |
| `usability_atributes_report.md` | Empirical analysis of test findings mapped to the Management and Prevention of Errors and User Control and Efficiency attributes, with requirements compliance tables per finding. |
| `usability_testing_overview.md` | Complete usability testing summary: test details, materials used, evidence, metric results per participant, key findings, relation to usability attributes, and overall conclusions. |
| `improvements_report.md` | Prioritized improvement action plan (P1–P4) with concrete items, effort estimates, and recommended implementation order derived from all four test sessions. |

### 📋 Usability Test Reports (`usability_tests/`)

| File | Description |
|------|-------------|
| `users/Karla-Medina.md` | Individual report — Karla Medina, Secretary/Administrative (53). All 5 metrics failed. |
| `users/Adalberto_Manzanilla.md` | Individual report — Adalberto Manzanilla, Department Head (62). All 5 metrics failed; system bug detected in rescheduling. |
| `users/Elizabeth_Delgado_Cuevas.md` | Individual report — Elizabeth Delgado Cuevas, Administrative User (58). Strongest performer; M-02 and M-04 met threshold. |
| `users/Selene-Romero.md` | Individual report — Selene Romero, Homemaker (56). M-02 met threshold; lowest avoidable error rate (M-01 ~10%). |
| `Usability_tests_report.md` | Consolidated cross-participant report with metrics comparison, best/worst tables, task performance breakdown, and experience-vs-performance analysis. |

---

## Prototype Navigation

| Module | Path |
|--------|------|
| Home / Dashboard | [`prototype/index.html`](./prototype/index.html) |
| Agenda (main view) | [`prototype/agenda/agenda.html`](./prototype/agenda/agenda.html) |
| Schedule new appointment | [`prototype/agenda/solicitar-cita.html`](./prototype/agenda/solicitar-cita.html) |
| Reschedule appointment | [`prototype/agenda/reprogramar.html`](./prototype/agenda/reprogramar.html) |
| Bulk rescheduling | [`prototype/agenda/reprogramacion-masiva.html`](./prototype/agenda/reprogramacion-masiva.html) |
| Patients | [`prototype/pacientes/pacientes.html`](./prototype/pacientes/pacientes.html) |
| Therapists | [`prototype/terapeuta/terapeuta.html`](./prototype/terapeuta/terapeuta.html) |
| Rooms | [`prototype/salas/salas.html`](./prototype/salas/salas.html) |
| Reports | [`prototype/reportes/reportes.html`](./prototype/reportes/reportes.html) |
| Reschedule prototype (standalone) | [`reschedule_protoype/index.html`](./reschedule_protoype/index.html) |

---

## Links & Resources

* **Agenda:** [agenda frame](./prototype/agenda/agenda.html)
* **Usability Tests evidence:** [audio links](https://drive.google.com/drive/folders/1T5L61E-rVzr8L_b3Ilw5TV5gkWhFXjWy?usp=drive_link)
* **Participation:** [percentage](./assets/individual_participation.png)

