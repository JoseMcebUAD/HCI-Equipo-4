# Usability Requirements and Evaluation Metrics Document

## 1. Non-Functional Requirements (NFR) - Usability

### NFR-01: Error Prevention and Recovery
* **Description:** The system shall proactively mitigate user errors through guided workflows and provide intuitive, non-destructive recovery mechanisms to maintain task continuity.
* **Acceptance Criteria:**
    * **Constraint Validation:** Prevent the selection of incompatible scheduling parameters (e.g., conflicting time, therapist, or room allocations).
    * **Explicit Confirmation:** Require deliberate user confirmation prior to executing destructive or critical actions.
    * **Input Optimization:** Favor constrained choices (e.g., dropdowns, date pickers) over free-text input to minimize data entry errors.
    * **Predictive Warnings:** Display contextual warnings detailing the consequences of an action prior to its final execution (e.g., "The appointment will be scheduled for June 4 at 17:00").
    * **Action Reversibility:** Provide a grace period allowing users to seamlessly undo actions immediately following their execution.
    * **Actionable Feedback:** Ensure error messages are specific, non-technical, and clearly state the required resolution steps.
    * **Graceful Recovery:** Allow users to rectify localized errors without losing previously entered valid data or restarting the entire workflow.

### NFR-02: System Status Visibility
* **Description:** The system must provide continuous, low-effort visibility into its current operational state and data, ensuring users remain informed without relying on memory.
* **Acceptance Criteria:**
    * **Persistent Status Display:** Maintain constant visibility of the schedule's availability and current booking status.
    * **Real-time Feedback:** Deliver immediate, perceivable interface feedback in response to every user interaction.
    * **Visual Consistency:** Enforce a standardized, system-wide color-coding paradigm to represent different appointment states clearly.

### NFR-03: Cognitive Load Reduction
* **Description:** The interface shall minimize cognitive friction by streamlining workflows, reducing visual clutter, and avoiding reliance on the user's short-term memory.
* **Acceptance Criteria:**
    * **Contextual Relevance:** Display exclusively the information and interactive controls relevant to the active context or step.
    * **Sequential Workflows:** Organize complex procedures into logical, sequential, and predictable steps.
    * **Data Entry Minimization:** Reduce mandatory manual data entry to the absolute minimum required for task completion.
    * **Interactive Density Control:** Limit the density of simultaneous interactive elements to prevent choice overload and visual fatigue.

---

## 2. Usability Evaluation Metrics

### M1 - Error Rate in Critical Tasks
* **Description:** Quantifies the frequency of user-generated errors during core system workflows, such as booking, rescheduling, or canceling appointments.
* **Objective:** Evaluate the interface's effectiveness in guiding users and proactively preventing missteps.
* **Formula:** `Error Rate (%) = (Total Errors Committed / Total Tasks Executed) * 100`
* **Measurement Method:** Define critical workflows. Observe external users executing these tasks and log every instance of error (e.g., selecting invalid constraints, navigating incorrectly). Calculate the overall error proportion.
* **Justification:** High usability relies on proactive error prevention. Elevated error rates pinpoint specific UI bottlenecks, inadequate validations, or excessive cognitive load.

### M2 - Error Recovery Rate
* **Description:** Measures the proportion of errors that users successfully resolve autonomously, without requiring external intervention or abandoning the process.
* **Objective:** Assess the resilience and clarity of the system's error-handling and recovery mechanisms.
* **Formula:** `Recovery Rate (%) = (Autonomously Resolved Errors / Total Errors Encountered) * 100`
* **Measurement Method:** Track all user errors during testing sessions. Categorize resolutions as autonomous, assisted, or unresolved. Calculate the percentage of autonomous recoveries.
* **Justification:** System robustness is defined not just by preventing errors, but by facilitating seamless recovery, which directly reduces user frustration and task abandonment.

### M3 - Average Task Completion Time
* **Description:** Tracks the total time expended by a user to successfully complete a predefined system task.
* **Objective:** Benchmark operational efficiency and the cognitive friction associated with the system's workflows.
* **Formula:** `Average Task Time = (Sum of Individual Completion Times) / Total Number of Tasks Evaluated`
* **Measurement Method:** Establish targeted workflows (e.g., creating an appointment). Record the elapsed time from initial engagement to successful completion. Aggregate data across the user sample to determine the average duration.
* **Justification:** Prolonged completion times strongly correlate with usability flaws such as excessive steps, confusing layouts, or poor information architecture.

### M4 - Task Success Rate
* **Description:** Calculates the percentage of tasks that users complete accurately without encountering fatal errors or abandoning the workflow.
* **Objective:** Determine the overall functional viability of the system in enabling users to accomplish their goals.
* **Formula:** `Success Rate (%) = (Successfully Completed Tasks / Total Attempted Tasks) * 100`
* **Measurement Method:** Define clear completion criteria. Observe users and log outcomes as successful, failed, or abandoned. Calculate the aggregate success percentage.
* **Justification:** This is the baseline indicator of usability. If the success rate is low, the system fundamentally fails its primary objective, overriding other positive metrics.

### M5 - Key Information Identification Time
* **Description:** Measures the time required for a user to locate, comprehend, and articulate essential system data, specifically schedule availability.
* **Objective:** Evaluate the effectiveness of the system's data presentation and status visibility.
* **Formula:** `Average Identification Time = (Sum of Correct Response Times) / Total Queries Issued`
* **Measurement Method:** Expose the user to the interface and ask specific state-related questions (e.g., "Which schedules are available?"). Time the interval until a correct answer is provided and calculate the mean.
* **Justification:** Users should decipher the system's state instantaneously. Extended identification times highlight poor visual hierarchy or suboptimal data presentation.

### M6 - Perceived Satisfaction Level
* **Description:** A subjective assessment capturing the user's perceived ease of use and overall interaction experience.
* **Objective:** Quantify user satisfaction and perceived cognitive effort.
* **Formula:** `Average Satisfaction Score = (Sum of Likert Ratings) / Total Number of Users` 
*(Measured via a 5-point Likert scale where 1 = Very difficult and 5 = Very easy)*.
* **Measurement Method:** Administer a post-task question asking users: "How easy was it to use the system?". Aggregate the scores to find the mean satisfaction level.
* **Justification:** Quantitative metrics cannot capture user sentiment. High perceived satisfaction is crucial for long-term system adoption, user trust, and overall acceptance.
