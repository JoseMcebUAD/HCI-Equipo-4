# User Findings

**Universidad Autónoma de Yucatán**
Bachelor's Degree in Software Engineering
Human-Computer Interaction

| | |
|---|---|
| **Semester** | 6 |
| **Group** | LIS A |
| **Professor** | Edgar Antonio Cambranes Martinez |
| **Submission date** | February 27, 2025 |

**Team members:**
- José Alberto Murcia Cen
- José Antonio Diaz Fernandez
- Sebastian Laines
- David Ernesto Escalante García
- Deco Acierno

---

## 1. Introduction

This document compiles the findings obtained from interviews with the Psychology Clinic coordinator and the Vinculación coordinator. The information presented here is essential for restructuring the administrative side of the *SistemaDeGestionDeCitasClinicas*. These findings are intended to serve as input for defining requirements, designing interfaces, and improving internal processes, adapting the system to the real needs of its users.

---

## 2. Methodology

**Sources of Information:** Semi-structured interviews with:
- Psychology Clinic Coordinator
- Vinculación Coordinator

**Focus:**
Operational aspects, technological challenges, reporting and statistics needs, as well as barriers faced by administrative and technical users during the appointment management and patient follow-up processes.

---

## 3. Key Findings

### 3.1. Scheduling Process and First Contact

**Initial Contact:**
- First contact is made via phone call.
- New patients are scheduled for a free initial evaluation appointment.

**Information Collection:**
- Basic data is gathered during the call for the evaluation.
- Vinculación requests statistics on income levels, ages, genders, service types, and consultation reasons.

### 3.2. Results and Report Management

**Delivery of Test Results:**

Patients may request a written report that includes:
- Reasons for evaluation
- Data collected during testing
- Recommendations made by the evaluating psychologist

Reports are accessed through the coordination office or the intern, and are used by therapists for personality profiling.

**Administrative Reports:**

The clinic's management and Vinculación request annual descriptive reports including:
- Number of consultations and cases
- Statistics on income levels, ages, genders, and service types

This data is used to assess the sustainability and impact of the service.

### 3.3. Agenda Management and Changes

**Agenda Modifications:**
- Only authorized staff (interns, coordinators, and secretaries) can execute changes to the agenda.
- Therapists can only suggest modifications, which must be approved by coordination.
- Coordinators are the only ones with authority to make major changes (releasing time slots, adjusting session duration and frequency).

**Appointment and Cancellation Handling:**
- A 20-minute wait time is established; if the patient does not arrive within that window, the appointment is marked as a no-show (with exceptions if justified).
- Automated rescheduling is recommended for greater efficiency.
- In unexpected situations (such as power outages), patients are notified via WhatsApp.

### 3.4. Supervision and Roles

**Therapist Supervision:**
- All therapists receive weekly supervision.
- Supervisors have access to patient records but cannot directly modify the agenda.

**Roles and Specific Responsibilities:**

| Role | Responsibilities |
|------|-----------------|
| **Secretaries** | Execute agenda changes. Update information in SPSS for case tracking. Notable experience: Gaby (15+ years) and Lucy (strong digital skills). |
| **Coordinators** | Have final say on major agenda changes. |
| **Therapists** | May suggest changes, but these must be validated by coordination. |
| **Vinculación** | Requests data to support academic processes and income generation. Coordinates information integration to propose new services and training courses. |

### 3.5. Infrastructure and Technology

**Technology Requirements:**
The infrastructure required to fully leverage the system must be clearly defined (data storage, SPSS integration, email notification capability, etc.).

**Digital Transition:**
Resistance to change has been identified among some users, so the following is recommended:
- Ongoing training
- Intuitive and user-friendly interfaces
- Technical support during the transition

### 3.6. Service and Sustainability Considerations

**Therapeutic Process Duration:**
- There are no fixed limits, but 12 to 16 sessions are recommended, with the possibility of extension.
- Shortening case timelines is a goal to improve efficiency in a public service setting.

**Economic Considerations:**
- Patient fees are determined based on their socioeconomic status, with a minimum of 50 MXN.
- Income generation and service sustainability are evaluated in coordination with the faculty's management.

---

## 4. Challenges and Opportunities

### Identified Challenges

**Digital Adoption:**
Some users (especially those on afternoon shifts) show resistance or difficulty using the digital system.

**Integration of Manual and Digital Data:**
SPSS data updates are performed manually, which can lead to inconsistencies and delays.

**Technical Infrastructure:**
There is a need to define and standardize the technology infrastructure to support the automated system.

### Improvement Opportunities

**Automated Reminders:**
Implement automatic appointment confirmations and reminders via email or WhatsApp.

**Rescheduling Optimization:**
Design an automatic mechanism to reschedule appointments in the event of justified cancellations.

**Training and Support:**
Develop training programs for administrative and Vinculación staff, focused on the use of the new digital platform.

**Report Integration:**
Automate the generation of descriptive reports to facilitate follow-up and strategic decision-making.
