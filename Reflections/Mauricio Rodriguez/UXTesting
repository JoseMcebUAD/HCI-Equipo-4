## First point: UX attribute not included in the final project

### Selected attribute: Memorability

In the project developed during the course, while attention was given to attributes like efficiency, effectiveness, and learnability, **memorability** was not explicitly considered as a UX attribute during the planning and design stages of the prototype.

### Definition of the attribute (with reference)

According to the Nielsen Norman Group:

> *"Memorability: When users return to the design after a period of not using it, how easily can they reestablish proficiency?"*  
(Nielsen, 2012, *Usability 101*)

In simple terms, memorability measures how easily a user can resume using a system after a period of inactivity, without needing to relearn how it works.

### Mapping the attribute to the project

In the prototype we developed (a system for scheduling appointments in a health or wellness context), we assumed that administrative users would use the system continuously. However, in real-life scenarios (like vacations, staff rotation, or occasional use), a user might go weeks without interacting with the system.

Right now, the prototype doesn't include explicit memory aids (like contextual guides, keyboard shortcuts, or navigation patterns similar to familiar systems). So, **memorability was neither considered nor actively designed for**.

### Proposed metric

We propose the **Operational Relearning Index (ORI)**, adapted from the example provided.

#### Formula:ORI = (T2 / T1) × (E2 / E1)

Where:
- **T1** = Time to complete a task in the first session (initial use)
- **T2** = Time to complete the same task after a period of inactivity (e.g., 2 weeks)
- **E1** = Number of errors in the first session
- **E2** = Number of errors in the second session

#### Interpretation:
- **ORI ≈ 1** → high memorability (user remembers how to use the system)
- **ORI > 1** → low memorability (performance gets worse)
- **ORI < 1** → improvement (possible additional learning)

### Scenario and tasks for UX testing

**Scenario:**  
An administrative user who first used the prototype 15 days ago to schedule an appointment now needs to use it again to reschedule an existing appointment.

**Tasks:**
1. Log into the system.
2. Find a previously scheduled appointment.
3. Change the date and time of the appointment.
4. Confirm the change.
5. Log out.

### Type of data collected and how it could be analyzed

| Data type | Description |
|-----------|-------------|
| **Task time (seconds)** | Measured from when the user starts the task until completion |
| **Number of errors** | Wrong clicks, wrong paths, unnecessary use of help |
| **Successful completion** | Yes/No per task |

**Analysis:**  
Calculate the ORI for each user and average across participants. You can also complement this with qualitative observations (e.g., "the user hesitated at step 2").

### Why this UX attribute is relevant to measure for the project

Memorability matters because:
- The system might be used intermittently (e.g., substitute administrative staff).
- In health/wellness contexts, frustration from not remembering how to use the system could lead to abandonment.
- Improving memorability reduces support and training costs.

As :contentReference[oaicite:0]{index=0} points out:

> *"Human memory is not perfect, and systems should be designed to minimize the user's memory load"*  
— (Nielsen, *Usability 101*)
