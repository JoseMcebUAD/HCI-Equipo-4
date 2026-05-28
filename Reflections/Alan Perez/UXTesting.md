# UX Testing

A UX attribute that was not included as part of the final project is efficiency. According to the ISO 9241-11 framework, <mark>efficiency can be defined as the resources expended in relation to the results achieved, and in usability testing it is commonly measured through time on task</mark> (NIST, 2001). This is different from the final attributes of the project, which were low error rate, learnability, and satisfaction, so efficiency fills a gap in how the user experience is evaluated.

Mapped to the ClinicaWeb Agenda Module, this attribute is relevant because administrative staff perform time-sensitive actions like creating, rescheduling, and canceling appointments on a daily basis. Even if a user completes a task successfully, an interface that takes too long or requires too many steps still creates friction in the clinic's workflow.

The metric to measure this attribute would be time on task, recording the moment a participant starts and finishes a task successfully, then calculating the average across participants. Additionally, the number of errors or corrections and whether the user needed any assistance would also be collected. <mark>The data could be analyzed using mean, median, and standard deviation to determine whether task completion times are stable across users or if certain steps in the interface are causing slowdowns.</mark>

A realistic test scenario would be: 
> *"As an administrative staff member, reschedule an existing appointment to a new available date and time without creating a conflict with the therapist or room schedule."* This matches the actual rescheduling flow in the module and reflects real work users perform in the clinic.

<mark>Efficiency is especially relevant for this project because the target users are administrative staff with varying levels of digital literacy, so an interface that is correct but slow still creates a problem.</mark> For a scheduling system, delays in the interface can translate directly into delays in patient management and lower adoption of the system overall. Measuring efficiency would complement the existing attributes and give a more complete picture of the user experience.

---

### Reference
* International Organization for Standardization. (2018). *Ergonomics of human-system interaction — Part 11: Usability: Definitions and concepts (ISO Standard No. 9241-11).* https://www.iso.org/standard/63500.html
