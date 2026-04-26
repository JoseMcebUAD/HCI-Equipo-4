## Usability Testing Plan Reflection (AI vs. Human Design)

After providing a very general context of the project—specifically the global scope and the expected simplicity of the metrics—the AI generated a list of 14 tasks, divided into pre-test and post-test activities, resulting in the following:

---

### Pre-Test Tasks

1. **Define administrative user profiles**
   - Select between 5 and 8 administrative users with real experience in appointment management (avoid only IT staff).
   - Ensure they have a basic level of web system usage (no technical expertise required).

2. **Identify critical scheduling workflow tasks**
   - Create an appointment for a psychologist at a specific date/time.
   - Attempt to assign another appointment to the same psychologist at the same date/time.
   - Modify an existing appointment to a time slot where the psychologist is already booked.
   - Change the psychologist in an existing appointment to one who is unavailable at that time.

3. **Design simple and realistic test scenarios**
   - Example: “María, an administrative user, needs to schedule a new appointment for patient Pedro with psychologist Dr. López on Monday the 10th at 10:00. Then, by mistake, she tries to schedule another appointment with the same psychologist at the same date and time. The system must prevent this and display a message.”
   - Avoid more than 3 steps per scenario to maintain simplicity.

4. **Define easy-to-measure quantitative metrics**
   - **Conflict prevention success rate** (% of double-booking attempts blocked).
   - **Reaction time to error** (seconds until the user reads the message and takes corrective action).
   - **User error count** (failed attempts despite conflict).
   - **Drop-off rate** (users who abandon the task without resolving the conflict).
   - **Subjective satisfaction** (post-task question: “How clear was the error message?” scale 1–5).

5. **Develop a simple observation template**
   - Columns: Scenario, System blocked? (Yes/No), User understood? (Yes/No), Reaction time (sec), Comments.
   - Include space to capture the displayed error message.

6. **Set up the testing environment**
   - Use a test version of the system with mock data.
   - Prepare a visible timer or time-tracking tool.

7. **Write clear instructions for participants**
   - Clarify that the system is being evaluated, not their performance.
   - Ask them to act as they would in their daily work.

---

### Post-Test Tasks

1. **Collect and organize observed data**
   - Transfer results into a spreadsheet (one row per attempt).
   - Calculate aggregate metrics.

2. **Calculate key usability metrics**
   - **Conflict detection rate** = (blocked conflicts / total attempts) × 100.
   - **Average resolution time**.
   - **Error message clarity** (mean score 1–5).
   - **Subjective efficiency** (% of users reporting clarity and immediacy).

3. **Identify common error patterns**
   - Detect repeated failed attempts.
   - Group qualitative feedback about message clarity.

4. **Prepare a simple executive report**
   - Include objective, methodology, results, and 3–5 actionable recommendations.

5. **Recommend system improvements**
   - Detection < 100% → review validation logic.
   - Reaction time > 10 seconds → improve visibility of error messages.
   - Clarity < 3/5 → redesign message wording.

6. **Plan a validation round**
   - Retest with 3 users focusing on problematic tasks.

7. **Document lessons learned**
   - Create a checklist for future usability attributes.

---

Compared to the human-designed plan, the AI-generated version appears significantly more structured and methodical. It introduces elements such as standardized templates, controlled scenarios, and clearly segmented phases, which contribute to a more formal and replicable testing process. From a process engineering perspective, this is valuable because it promotes consistency and scalability.

However, despite its apparent rigor, the proposed metrics and thresholds are largely **unsupported**. For instance, stating that a reaction time above 10 seconds implies poor usability may seem reasonable, but the AI does not provide empirical justification or references. Accepting such thresholds without validation introduces epistemic risk: the evaluation becomes arbitrary rather than evidence-based.

This highlights a key limitation of AI-generated outputs: **they optimize for plausibility, not necessarily for validity**. The absence of traceable sources means that adopting these metrics blindly would be equivalent to making design decisions without theoretical or empirical grounding.

That said, the efficiency gain is undeniable. Generating this plan required approximately two minutes of prompt engineering, compared to several hours—or even days—of manual analysis, discussion, and iteration by a team. This creates a clear trade-off:

- **AI approach**: high speed, high structure, low justification  
- **Human approach**: lower speed, contextual awareness, higher critical reasoning  

The optimal strategy is therefore **hybridization**. AI should be used as a **scaffolding tool** to accelerate the generation of initial artifacts (tasks, metrics, scenarios), while human effort should focus on **validation, contextual adaptation, and theoretical grounding**.

Both approaches demonstrate strengths in different dimensions. AI excels in speed and structural completeness, while human design provides contextual depth and critical evaluation. Combining both approaches allows teams to leverage efficiency without sacrificing rigor—resulting in a process that is both practical and well-founded.

---
### When to Use AI vs. Manual Design

**Use AI when:**
- Time constraints are critical.
- A baseline structure is needed quickly.
- The team lacks initial direction.

**Use manual design when:**
- Decisions require scientific or domain-specific validation.
- Metrics must be defensible (e.g., academic or high-stakes contexts).
- The system involves sensitive domains (e.g., healthcare).

---

## Tool and Prompt

**Tool Used:** DeepSeek  

**Prompt:**
> Based on the following attribute: *Prevention of Scheduling Conflicts: The system must prevent double-booking by checking in real time that no psychologist is assigned to more than one appointment on the same date and time, displaying an immediate error message if a conflict is detected before saving.*  
> Generate a list of tasks (pre and post) necessary to develop a usability testing plan that allows collecting meaningful metrics to evaluate the attribute. Consider that it is for a web-based appointment system with administrative users. The tasks should not be highly complex; they must involve simple and easy-to-understand metrics.
