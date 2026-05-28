# HCI — Team 4
## Agenda Module · ClinicaWeb · UADY Psychology Clinic

This repository contains the user-centered design documentation, functional HTML prototype, and usability evaluation results for the **Agenda module** of ClinicaWeb — a digital management system for the UADY Faculty of Psychology Clinic. The module enables administrative staff (secretaries and coordinators) to manage patient appointments: scheduling, rescheduling (individual and bulk), cancelling, processing external requests, and reviewing the audit log. The prototype also includes supporting modules for Patients, Therapists, Rooms, and Reports.

### 🧪 Third Delivery: Usability Testing & Analysis

For this third delivery, the focus shifted to empirical evaluation. We conducted think-aloud usability sessions with four administrative-profile participants (ages 53–62) covering seven core task flows. All sessions were analyzed against five measurable metrics (M-01 through M-05), traced to the project's non-functional usability requirements (RNF-US-01 through RNF-US-07). Individual session reports were produced per participant, followed by three consolidated reports: a cross-participant analysis with comparison tables, a usability attribute analysis (Management and Prevention of Errors · User Control and Efficiency), and a prioritized improvement action plan.

---

## Repository Structure

### 📁 Folders

| Folder | Description |
|--------|-------------|
| `prototype/` | Functional HTML prototype — includes the Agenda, Patients, Therapists, Rooms, Reports, and First Contact modules. Entry point: `index.html`., the agenda entry point is [agenda](./prototype/agenda/agenda.html) |
| `reschedule_protoype/` | High-fidelity prototype focused on the individual appointment rescheduling flow. Entry point: `index.html`. |
| `usability_tests/` | Individual session reports for all four participants plus three consolidated analysis reports. |

### 📄 Documentation Files

| File | Description |
|------|-------------|
| `use_cases.md` | Revised use cases (UC-AG-01 through UC-AG-08) reflecting the current system flow, with pre/postconditions and alternative flows. |
| `metrics_measurment_tasks.md` | Five usability metrics (M-01 through M-05) following ISO/IEC/IEEE 15939:2017 — formula, threshold, measurement method, and collection procedure. |
| `attributes.md` | Rationale for the selection of the three project usability attributes (Low error rate, Satisfaction, Learnability), how they apply to the system and its target user profile, and empirical analysis of test findings mapped to Management and Prevention of Errors and User Control and Efficiency attributes. |
| `usability_full_report.md` | Complete usability testing summary: test details, materials used, evidence, metric results per participant, key findings, relation to usability attributes, and overall conclusions. |

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
| Schedule new appointment | [`prototype/Primer_Contacto/solicitar-cita.html`](./prototype/Primer_Contacto/solicitar-cita.html) |
| Reschedule appointment | [`prototype/agenda/reprogramar.html`](./prototype/agenda/reprogramar.html) |
| Bulk rescheduling | [`prototype/agenda/reprogramacion-masiva.html`](./prototype/agenda/reprogramacion-masiva.html)

---

## Links & Resources

* **Agenda:** [Agenda prototype](./prototype/agenda/agenda.html)
* **Usability Tests evidence:** [audio links](https://drive.google.com/drive/folders/1T5L61E-rVzr8L_b3Ilw5TV5gkWhFXjWy?usp=drive_link)
* **Participation:** [Globla participation](./assets/individual_participation.png)

* **Video:** [link_video] (https://alumnosuady-my.sharepoint.com/:f:/g/personal/a20204314_alumnos_uady_mx/IgCjqRLJzIfiR5naOUrgYbTQAZWFV4OjSwXWmCmsAs6TN38?e=du4xBE)
