# Usability Requirements and Evaluation Metrics Document

## 1. Non-Functional Requirements (NFR) - Usability

### NFR-01: Error prevention and recovery
* **Description:** The system must minimize the occurrence of errors during user interaction and provide efficient mechanisms for their detection, correction, and recovery without affecting the continuity of the task.
* **Acceptance criteria:**
    * **Restriction of invalid combinations:** The system must prevent the selection of invalid combinations (time - therapist - room).
    * **Confirmation of critical actions:** Critical actions must require explicit confirmation.
    * **Reduction of manual inputs:** The system should prioritize guided selection over manual inputs.
    * **Preventive warnings:** The system must show warnings with the result of the action (e.g., "The appointment will be scheduled for June 4 at 17:00").
    * **Action reversibility:** The system must allow actions to be reversed for a period of time after their execution.
    * **Solution-oriented error handling:** Error messages must be specific and solution-oriented.
    * **Correction without flow restart:** The system must allow correcting errors without restarting the entire task.

### NFR-02: Visibility of system status
* **Description:** The system must communicate clearly, immediately, and continuously the status of the information and user actions, allowing comprehension without additional cognitive effort.
* **Acceptance criteria:**
    * **Permanent status visibility:** The system must show the current status of the schedule at all times.
    * **Immediate feedback:** Every action must generate immediate feedback.
    * **Visual consistency of states:** The system must present a consistent color code.

### NFR-03: Cognitive load reduction
* **Description:** The system must minimize the mental effort required to complete tasks, reducing the amount of information, decisions, and memory needed during interaction.
* **Acceptance criteria:**
    * **Contextually relevant information:** The system must show only the information necessary for the current task.
    * **Sequential task flow:** Tasks must be structured in clear and ordered steps.
    * **Input minimization:** The system must reduce the amount of manual data to the essential minimum.
    * **Interactive density control:** The system must limit the number of simultaneous interactive elements.

---

## 2. Usability Evaluation Metrics

### M1 - Error Rate in Critical Tasks
* **Description:** A quantitative metric measuring the frequency of user errors during the execution of core system workflows (e.g., creating, rescheduling, or canceling appointments).
* **Objective:** To evaluate the system's effectiveness in error prevention during user interaction.
* **Formula:** `Error Rate (%) = (Number of errors made / Total number of tasks performed) * 100`
* **Measurement Method:** Define a set of critical tasks. Observe users during task execution and log every error (e.g., attempting to select an invalid time slot, navigation confusion, incorrect actions). Calculate the error proportion relative to the total tasks executed.
* **Justification:** A highly usable system proactively prevents errors. This metric identifies whether the interface properly guides the user or causes cognitive friction. A high error rate highlights deficiencies in validation, layout, or cognitive load management.

### M2 - Error Recovery Rate
* **Description:** Evaluates the user's capacity to recognize and resolve errors autonomously without abandoning the current workflow.
* **Objective:** To assess the effectiveness and clarity of the system's error-handling and recovery mechanisms.
* **Formula:** `Recovery Rate (%) = (Errors autonomously corrected / Total errors triggered) * 100`
* **Measurement Method:** Track all errors made during the evaluation sessions. Observe if the user can overcome the error without external assistance. Classify outcomes as: autonomously corrected, corrected with assistance, or uncorrected. Calculate the percentage of autonomous recoveries.
* **Justification:** Since it is impossible to prevent all user errors, robust recovery mechanisms are critical to minimize user frustration and task abandonment.

### M3 - Average Task Completion Time
* **Description:** Measures the time required for a user to successfully complete specific predefined tasks within the module.
* **Objective:** To determine the operational efficiency and cognitive load associated with the system's interactions.
* **Formula:** `Average Time = (Sum of individual task completion times) / Total number of evaluated tasks`
* **Measurement Method:** Define specific workflows (e.g., booking a new appointment). Time the execution from the initial interaction to successful completion. Log the times across multiple users and compute the average duration per task type.
* **Justification:** Systems with optimized cognitive loads enable faster task completion. High average times suggest excessive steps, unclear navigation, or poor information architecture.

### M4 - Task Success Rate
* **Description:** Represents the percentage of tasks that users complete accurately without encountering critical, workflow-breaking errors.
* **Objective:** To measure the overall functional effectiveness of the system in enabling users to reach their goals.
* **Formula:** `Success Rate (%) = (Tasks successfully completed / Total attempted tasks) * 100`
* **Measurement Method:** Establish clear, measurable task parameters. Observe user performance to determine if the task is completed successfully, failed, or abandoned. Consolidate results across the user sample to calculate the overall success percentage.
* **Justification:** This is the most direct usability indicator. If users are unable to complete their intended tasks, the system fails its primary objective regardless of performance in other metrics.

### M5 - Key Information Identification Time
* **Description:** Measures the time elapsed before a user successfully locates and interprets essential system status data (e.g., schedule availability).
* **Objective:** To evaluate the clarity and visibility of the system's current state.
* **Formula:** `Average Time = (Sum of correct response times) / Number of queries asked`
* **Measurement Method:** Present the interface to the user. Ask specific state-related queries (e.g., "Which time slots are available today?"). Measure the time taken from the end of the question to the user's correct response. Calculate the average.
* **Justification:** Users must be able to understand the system state with minimal effort. Excessive identification times indicate poor visual hierarchy or inadequate data presentation.

### M6 - Perceived Satisfaction Level
* **Description:** A subjective assessment measuring the user's overall perception of the system's usability and ease of use.
* **Objective:** To quantify the general user experience and perceived cognitive load.
* **Formula:** `Average Satisfaction = (Sum of Likert scale ratings) / Number of evaluated users`
*(Note: Evaluated using a 5-point Likert Scale where 1 = Very difficult and 5 = Very easy).*
* **Measurement Method:** Post-evaluation, ask the user to rate their experience: "How easy was it to use the system?". Log the ratings and calculate the mean score.
* **Justification:** Objective data does not encompass the full user experience. Subjective perception is a key driver for system adoption, user trust, and long-term acceptance.
