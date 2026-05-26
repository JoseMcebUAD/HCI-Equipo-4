# Usability Attributes — Selection Rationale

**Scheduling System — Agenda Module | ClinicaWeb | May 2026**

---

## Why These Three Attributes
 Not because we had the metrics and results already done ,  let's pretend that didn´t happend.

The Agenda Module of ClinicaWeb is focused on being used by administrative staff at the UADY Faculty of Psychology Clinic — secretaries and coordinators between 40 and 62 years old, with varying levels of digital literacy and no specialized technical background. This user profile directly drives the selection of three usability attributes: **Low error rate**, **Learnability**, and **Satisfaction**. 
*A practical guide to usability testing. Joseph S.Dumas, Janice C. Redish. Intellect Books, c1999.* 


---

### Low error rate

This is the central attribute of the project because the clinical domain means that a scheduling mistake carries real-world consequences: double-booked appointments, patients left without care, or conflicts between therapists and rooms. All seven non-functional requirements are designed almost entirely around preventing and recovering from errors — disabling occupied time slots, providing an undo window and so on.

The team chose these attribute because most of the tasks have a strong error prevention and avoids real world problems

---

### Learnability

Learnability is a priority because the target users shouold be able to use the system pretty quick and adapt it into their daily work, and the user profile includes individuals with limited prior digital experience. The system must be understandable from first use without requiring extensive training or prior knowledge of comparable tools.


---

### Satisfaction

Satisfaction is how the system is perceived as uncertain or intimidating to be  be avoided or used superficially, even if it functions correctly at a technical level, the user must feel that they understand what is about to happen before executing an irreversible action.

---

## How the Three Attributes Relate

The three attributes are not independent. They converge on the same structural gap identified across all four usability testing sessions: **the interface does not communicate system state or action consequences clearly enough for the target user population**.

- A user who cannot learn the interface (Learnability) will commit more errors (Errors).
- A user who cannot recover from errors autonomously (Errors) will lose confidence in the system (Satisfaction).
- A user who does not feel in control (Satisfaction) will avoid the flows that require the most precision — which are exactly the ones the system is designed to support.

This interdependence is why no single attribute is sufficient on its own. The acceptance thresholds defined in the metrics (M-01 ≤ 5%, M-03 ≥ 90%, M-04 ≥ 4.0/5, M-05 ≥ 85%) are calibrated to detect failures at each layer of this chain.
