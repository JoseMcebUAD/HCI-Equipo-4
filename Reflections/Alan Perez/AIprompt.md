# AI Prompt

The usability attribute selected for this reflection is low error rate. The system is used by administrative staff to schedule and reschedule clinical appointments, and a mistake like a duplicated booking or a therapist conflict can create real operational problems. The prototype already includes preventive behaviors such as disabling occupied slots, showing warnings, and requiring confirmation in conflict cases.

To generate a set of usability test tasks for this attribute, the following prompt was used with ChatGPT:

> *"You are a UX testing assistant. My project is a clinic scheduling system called ClinicaWeb, specifically the Agenda module used by administrative staff. I need to evaluate the usability attribute Low error rate. Based on this attribute, propose a set of usability test tasks that would help collect data for avoidable user errors, recovery time after an error, and task abandonment or restart. The tasks should fit a clinic context and include appointment scheduling, rescheduling, and conflict prevention. For each task, provide the goal, the expected user action, the possible error points, and the data I should record during the test. Keep the tasks realistic for secretaries and coordinators with varying digital literacy."*

The details included were not random. <mark>The system name, module, target users, usability attribute, and exact metrics needed were all specified, because the quality of the tasks depends directly on how well they match the real system flows.</mark>

Compared to the manual process the team followed, which required mapping use cases, prototype flows, and measurement formulas into testable scenarios, <mark>using AI is significantly faster but not more accurate on its own. The better strategy is a hybrid one: use AI to produce a first draft, then refine it manually against the actual prototype constraints.</mark> AI works best for quick drafts and brainstorming; manual design is better when the system has strict validation rules and well-documented flows, which is exactly the case for this module. <mark>In a clinical scheduling system, a weak task can directly affect the quality of the evaluation, so manual review is always necessary before using any AI-generated task set.</mark>

---

### Reference Details
* **Prompt used:** You are a UX testing assistant. My project is a clinic scheduling system called ClinicaWeb, specifically the Agenda module used by administrative staff. I need to evaluate the usability attribute Low error rate. Based on this attribute, propose a set of usability test tasks that would help collect data for avoidable user errors, recovery time after an error, and task abandonment or restart. The tasks should fit a clinic context and include appointment scheduling, rescheduling, and conflict prevention. For each task, provide the goal, the expected user action, the possible error points, and the data I should record during the test. Keep the tasks realistic for secretaries and coordinators with varying digital literacy.
* **AI tool used:** ChatGPT.
