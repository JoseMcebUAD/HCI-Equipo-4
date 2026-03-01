# Usability vs UX

HCI looks at how humans and machines interact, centered in computer science, psychology and design. UX is the experience a person has interacting with a system. Usability is how easily, how quickly, how accurately a user can make use of a system to achieve a task. UX is under the HCI concept, and Usability is a component of UX.

<mark>Usability is about a system being functional, if it is easy to learn and efficient, meanwhile UX is about how the user feels, their thoughts before, during and after using a system. Usability is a somewhat more objective metric, and UX is more a subjective metric. Usability is focused on effectiveness and UX is focused on emotions.</mark> In my team project, the UADY Psychology Clinic Agenda Module, we can imagine a situation to compare Usability with UX using an example:

There’s a need to reschedule a patient’s appointment because the psychologist reported as sick.

**Usability Perspective:** If the patient’s name and the reschedule function can be found easily, selecting a new available date from a visual calendar is easy to understand, and confirm the changes can be done under 30 seconds without any system errors, then we can say the system has good usability.

**UX Perspective:** If during this stressful moment, the system transmits calm, control and confidence feelings, the system provides a good UX.

## Proposed UX Feature: Undo Toast Notification

**Context:** Currently the module allows users to schedule or cancel appointments, but accidental clicks can happen and cause frustration, so by implementing a 5 seconds Undo notification after a destructive action like cancelling an appointment, we could target the UX attribute of Psychological Safety, ensuring the administrative staff can feel confident that the software forgives human errors.

**Verification and Measurement:** We would verify this UX attribute by interviews, asking to rate on a scale of 1 to 5 the confidence and stress levels when modifying the calendar appointments. We would measure its success by tracking the usage percentage of the Undo button, which serves as a metric for the number of errors mitigated.
