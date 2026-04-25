We initially defined the attribute *“Scheduling Conflict Control”* in a very general way, with the idea of *“preventing the system from overlapping an already scheduled appointment.”* However, it is worth refining this into a more specialized scope.

In his 10 usability heuristics, Jakob Nielsen defines **error prevention** as the system’s ability to help users recognize, diagnose, and recover from errors. Under this definition, the attribute should go beyond simply displaying a message such as *“It is not possible to schedule at this time.”*

> “Even better than good error messages is a careful design which prevents a problem from occurring in the first place.”

Certainly, the system currently covers this basic scenario; displaying a message like *“This time slot is already taken”* is trivial. However, there are many additional areas where this attribute could provide value. At its core, this requirement deals with **error management**. This can range from using visual conventions—such as green for success and red for error—to designing specific flows for executing sensitive actions.

As a team, we did not deeply explore UI standards or widely accepted design conventions. As a result, the attribute is only partially implemented: it fulfills its basic function, but does not fully exploit its potential.

To strengthen this attribute, several improvements could be introduced:
- Consistent use of color coding in the scheduling interface to indicate availability and conflicts  
- Clear, intuitive messages  
- Strategically placed buttons that guide users through the process and indicate the next step  

This aligns with the principles proposed by Ben Shneiderman:

> “Prevent errors whenever possible and provide simple, constructive error handling.”

However, these improvements cannot remain subjective decisions; quality cannot be measured by good intentions alone. Therefore, once the interface is improved, it must be evaluated using measurable metrics.

### **1. User Error Rate**
Measures the proportion of attempts that result in a scheduling conflict. This metric helps determine whether the system is effectively preventing errors through its design. According to Nielsen Norman Group:

> “The number of errors users make is a core usability metric.”

---

### **2. Time on Task**
Measures the time required for a user to successfully complete the scheduling process. Even if a user completes a task without errors, the time required is a key indicator of efficiency. A slow but error-free process may indicate a non-intuitive interface that forces users to carefully analyze each step, which contradicts good design principles. This aligns with the usability definition from ISO 9241-210:

> “Usability: the extent to which a system can be used by specified users to achieve specified goals with effectiveness, efficiency and satisfaction.”

---

Beyond these metrics, additional data could provide a more comprehensive evaluation:

- **Error recovery rate:** how easily users correct a conflict after encountering it  
- **Attempts per task:** number of tries required to successfully schedule an appointment  
- **Time to recovery:** time taken to resolve an error once detected  
- **User perception (Likert scale):** clarity of error messages and guidance  
- **Interaction logs:** unnecessary clicks, erratic navigation, or cancellations  

---
## **References**

- Nielsen Norman Group. *Usability Metrics and User Experience Research*.  
- ISO (2010). *ISO 9241-210: Human-centred design for interactive systems*.  
- Don Norman (2013). *The Design of Everyday Things*. Basic Books.  
