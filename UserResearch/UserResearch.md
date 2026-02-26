# User Research: Agenda Module
## UADY Psychology Clinic — Administrative Scheduling Interface

---

## 1. Project Overview

The UADY Psychology Clinic manages dozens of weekly appointments between patients and therapists. Currently, all scheduling is handled manually: secretaries receive phone calls, check a physical agenda or shared Excel file, assign time slots verbally, verify payments by hand, and send reminders from personal phones. This process is fragile — double-bookings happen when Excel files fall out of sync, patients miss appointments because reminders never arrive, and rescheduling a single appointment can take multiple phone calls.

The clinic is developing **ClinicaWeb**, a digital system to replace these manual processes. The **Agenda module** is its most critical component. It will be used primarily by administrative staff (secretaries and the clinic coordinator) to schedule, edit, cancel, and track all patient appointments.

**The core challenge:** Designing an Agenda interface that administrative staff — including users with limited digital experience — can operate efficiently under real work conditions (phone call in progress, multiple open requests, time pressure).

---

## 2. Research Objectives

| # | Objective |
|---|-----------|
| O1 | Understand the current manual scheduling workflow and identify where it fails |
| O2 | Map the roles and permission boundaries between secretaries, coordinators, and therapists |
| O3 | Identify what information users need at each step of the scheduling process |
| O4 | Uncover the specific pain points that cause errors, delays, or frustration |
| O5 | Determine barriers to digital adoption among administrative staff |
| O6 | Translate findings into actionable design requirements for the Agenda module |

---

## 3. Methodology

Three research methods were selected based on the project's constraints (limited access to users, early design stage) and objectives:

### Semi-Structured Interviews *(Conducted)*
Conducted with the **Clinic Coordinator** and the **Vinculación Coordinator** — the two roles with the broadest operational knowledge of the scheduling process.

**Why:** Interviews allow us to surface mental models, workflows, and pain points that are difficult to observe directly. They are especially valuable at the discovery stage before any prototype exists.

**What we focused on:** Daily scheduling flow, role responsibilities, cancellation and rescheduling handling, technology barriers, and reporting needs.

---

### Heuristic Evaluation *(Planned)*
A review of the ClinicaWeb Agenda prototype against Jakob Nielsen's 10 usability heuristics, conducted by the research team.

**Why:** It is a fast, low-cost method to identify interface problems before involving real users. Useful as a quality filter before usability testing.

**Limitation:** Results may be biased by the team's familiarity (or lack thereof) with the heuristics. Findings must be validated with actual users.

---

### Usability Testing *(Planned)*
Observation sessions where representative users complete key tasks on the Agenda prototype:
- Schedule a new therapy appointment during a simulated phone call
- Reschedule an appointment from the inbox
- Cancel an appointment with a reason
- Filter the weekly agenda by therapist

**Why:** Task-based testing reveals where users hesitate, misread labels, or make errors — problems that interviews and heuristic evaluation alone cannot surface.

**Limitation:** Recruiting real clinic staff is logistically difficult. A proxy user with similar characteristics (administrative background, moderate digital literacy) may be needed.

---

## 4. Participants

### Who Was Interviewed

| Participant | Role | Relevance |
|------------|------|-----------|
| Clinic Coordinator | Oversees all clinic operations and scheduling decisions | Broadest view of the scheduling process; defines role boundaries |
| Vinculación Coordinator | Manages academic and income reporting | Reveals reporting needs derived from agenda data |

### Target Users for Usability Testing

The primary users of the Agenda module are administrative secretaries. Based on the interviews, two distinct profiles were identified:

**Profile A — Experienced, Low-Tech Secretary**
- 15+ years working at the clinic
- Expert in physical agendas and established routines
- Cautious with new digital tools; risk of resistance
- Needs: a system that mirrors familiar workflows, clear confirmations, no data loss risk

**Profile B — Junior, Tech-Comfortable Secretary**
- Fewer years of experience, faster digital adoption
- Comfortable with web applications; likely to use keyboard shortcuts
- Needs: speed, minimal steps, quick patient search

Both profiles will be represented in usability testing to capture the full range of expected user behavior.

---

## 5. Findings

> Full detail in [UserFindings.md](./UserFindings.md). This section highlights the patterns most relevant to the Agenda module.

### 5.1 The scheduling process is phone-driven and time-pressured

Every new appointment begins with a phone call. While on the line, the secretary must simultaneously collect patient data, check therapist availability, assign a room, and confirm the time slot — all without putting the patient on hold for too long. The system must support fast data entry and inline availability checking.

### 5.2 Role boundaries are strict and non-negotiable

Only secretaries and coordinators can modify the agenda. Therapists can *suggest* changes, but all changes must be validated by coordination. Coordinators have exclusive authority over major changes (releasing time slots, adjusting session frequency). The system must enforce these boundaries by role.

### 5.3 The 20-minute no-show rule is tracked inconsistently

If a patient doesn't arrive within 20 minutes, the appointment is marked as a no-show (with exceptions). Currently this is tracked with tally marks on paper, leading to inconsistent policy enforcement. There is no automated no-show detection.

### 5.4 Rescheduling is expensive in time and effort

Rescheduling one appointment currently requires multiple calls: the secretary contacts the patient, checks availability with the therapist, and updates the physical agenda. Automating this flow is a top priority.

### 5.5 Some users resist digital change — especially afternoon staff

The afternoon shift staff showed more reluctance toward adopting a digital system. Long-time users (like Gaby) are comfortable with routines that have worked for 15 years. Onboarding friction must be minimized; the interface should not feel like a step backward from what they already know.

### 5.6 Coordinators need aggregate data, not just individual appointments

Vinculación requests annual descriptive reports with attendance counts, service types, age ranges, and income brackets. The Agenda module must capture structured data at every event creation to support this reporting.

### 5.7 Emergency communication happens outside the system

During power outages or unexpected closures, staff notify patients via personal WhatsApp. The system currently has no fallback notification channel. Any notification feature must feel reliable enough to replace this workaround.

---
