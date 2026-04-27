## Second point: TraceabilityAtt – Usability attribute included in the project

### Selected usability attribute: Error Prevention

We initially defined the attribute *"Scheduling Conflict Control"* in a very general way, with the idea of *"preventing the system from overlapping an already scheduled appointment."* However, it is worth refining this into a more specialized scope.

### How the attribute was included in the prototype

In Jakob Nielsen's 10 usability heuristics, **error prevention** is defined as the system's ability to help users recognize, diagnose, and recover from errors. Under this definition, the attribute should go beyond simply displaying a message like *"It is not possible to schedule at this time."*

> *"Even better than good error messages is a careful design which prevents a problem from occurring in the first place."*  
— (Nielsen, *10 Usability Heuristics*)

In our prototype, we included error prevention in the following specific ways:

1. **Basic conflict detection** – When a user tries to schedule an appointment at an already occupied time slot, the system displays a message: *"This time slot is already taken."*
2. **Visual feedback** – The scheduling interface highlights unavailable slots in a different color (though not consistently applied).
3. **Confirmation step** – Before finalizing an appointment, the user must confirm the selected date and time.

However, we did not deeply explore UI standards or widely accepted design conventions. As a result, the attribute is only **partially implemented**: it fulfills its basic function but does not fully exploit its potential.

### How the attribute was measured (or would be measured)

Since we only have a prototype and no user testing was conducted yet, the team proposed a **measurement plan** rather than actual collected data.

#### Did the team consider a well-known metric?

Yes. The team considered two well-known usability metrics from the Nielsen Norman Group and ISO 9241-210:

 **User Error Rate**  Proportion of attempts that result in a scheduling conflict
 **Time on Task**  Time required to successfully complete the scheduling process 

#### What data is collected for this metric?

For **Error Rate**:
- Total number of scheduling attempts
- Number of attempts that result in a conflict
- Formula: `Error Rate = (Conflicts / Total Attempts) × 100`

For **Time on Task**:
- Start time (user begins scheduling)
- End time (user confirms appointment)
- Total time in seconds

#### How the team decided the specific data for this usability attribute?

The team decided based on:
1. **Literature review** – Both metrics are standard in usability evaluation.
2. **Project constraints** – Only a prototype exists, so we needed simple, measurable data.
3. **Relevance to error prevention** – Error rate directly measures prevention effectiveness; time on task measures efficiency, which is affected by poor error handling.

### Alternative data that could be collected to measure the same attribute

Beyond these metrics, additional data could provide a more comprehensive evaluation:


 **Error recovery rate**  How easily users correct a conflict after encountering it 
 **Attempts per task**  Number of tries required to successfully schedule an appointment 
 **Time to recovery**  Time taken to resolve an error once detected 
 **User perception (Likert scale 1-5)**  Clarity of error messages and guidance 
 **Interaction logs**  Unnecessary clicks, erratic navigation, or cancellations 
 **Success rate after first error**  Percentage of users who complete the task after making an error 

These alternatives would provide richer qualitative and behavioral insights, but they require more complex data collection (e.g., screen recording, post-task questionnaires).

### Summary of traceability

| Design decision | Metric | Data collected | Alternative data |
|----------------|--------|----------------|------------------|
| Conflict detection + visual feedback + confirmation step | Error Rate + Time on Task | Conflicts, total attempts, start/end times | Recovery rate, attempts per task, Likert scale, interaction logs |

---

### References

- Nielsen Norman Group. *10 Usability Heuristics for User Interface Design*.
- Nielsen Norman Group. *Usability Metrics and User Experience Research*.
- ISO (2010). *ISO 9241-210: Human-centred design for interactive systems*.
