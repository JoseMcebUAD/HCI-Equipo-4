# Usability Requirements and Evaluation Metrics Document

## 1. Non-Functional Requirements (NFR) - Usability

**Error Prevention and Handling**
* **UR-01:** The agenda module shall prevent the selection of conflicting scheduling parameters, including overlapping time slots, double-booked therapists, and unavailable rooms.
* **UR-02:** The system shall require explicit user confirmation prior to the execution of any critical or destructive action (e.g., canceling a therapy appointment).
* **UR-03:** The interface shall prioritize constrained selection inputs (such as dropdown menus and interactive date pickers) over free-text manual entry to minimize formatting errors.
* **UR-04:** The system shall display predictive, contextual warnings detailing the outcome of an action before its final execution (e.g., "The appointment will be scheduled for June 4 at 17:00").
* **UR-05:** The system shall provide a grace period that allows administrative users to revert actions immediately following their execution.
* **UR-06:** The system shall display error messages using non-technical, solution-oriented language that explicitly states the required steps for resolution.
* **UR-07:** The system shall allow users to rectify localized form errors without losing previously entered valid data or requiring a complete workflow restart.

**System Status Visibility**
* **UR-08:** The system shall continuously and prominently display the real-time availability and booking status of the clinic's schedule.
* **UR-09:** The interface shall generate immediate, perceivable visual feedback in response to all user interactions.
* **UR-10:** The system shall employ a standardized, system-wide color-coding scheme to clearly differentiate between various appointment states (e.g., pending, confirmed, canceled).

**Cognitive Load Management**
* **UR-11:** The system shall display exclusively the information and interactive controls that are strictly necessary for the user's current context or task step.
* **UR-12:** The system shall organize complex administrative procedures into logical, sequential, and predictable steps.
* **UR-13:** The system shall restrict mandatory manual data entry to the absolute minimum required for successful task completion.
* **UR-14:** The interface shall limit the density of simultaneous interactive elements on a single screen to prevent visual clutter and reduce decision fatigue.

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
*(Measured via a 5-point Likert scale where 1 = Very difficult and 5 = Very easy).*
* **Measurement Method:** Administer a post-task question asking users: "How easy was it to use the system?". Aggregate the scores to find the mean satisfaction level.
* **Justification:** Quantitative metrics cannot capture user sentiment. High perceived satisfaction is crucial for long-term system adoption, user trust, and overall acceptance.
