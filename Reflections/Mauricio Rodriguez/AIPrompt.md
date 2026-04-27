## Third point: AI-generated usability testing tasks

### Context

For this reflection, I selected the same usability attribute from the previous section: **Error Prevention** (specifically focused on scheduling conflict detection). The AI tool used was **DeepSeek**.

Instead of designing the usability testing tasks manually with the team, I created a prompt and let the AI generate a structured plan.

### What was included in the prompt

I included the following details in the prompt:

| Element | What I specified |
|---------|------------------|
| **Attribute definition** | Prevention of scheduling conflicts: real-time check to avoid double-booking, immediate error message |
| **System context** | Web-based appointment system for administrative users |
| **Desired output** | List of pre-test and post-test tasks |
| **Complexity level** | Not highly complex, simple and easy-to-understand metrics |
| **Goal** | Collect meaningful metrics to evaluate the attribute |

### The prompt (exact copy)

> Based on the following attribute: *Prevention of Scheduling Conflicts: The system must prevent double-booking by checking in real time that no psychologist is assigned to more than one appointment on the same date and time, displaying an immediate error message if a conflict is detected before saving.*  
> Generate a list of tasks (pre and post) necessary to develop a usability testing plan that allows collecting meaningful metrics to evaluate the attribute. Consider that it is for a web-based appointment system with administrative users. The tasks should not be highly complex; they must involve simple and easy-to-understand metrics.

### AI-generated result summary

DeepSeek generated a structured plan with:

**Pre-test tasks (7):**
1. Define administrative user profiles (5–8 real users)
2. Identify critical scheduling workflow tasks
3. Design simple and realistic test scenarios
4. Define easy-to-measure quantitative metrics
5. Develop a simple observation template
6. Set up the testing environment
7. Write clear instructions for participants

**Post-test tasks (7):**
1. Collect and organize observed data
2. Calculate key usability metrics
3. Identify common error patterns
4. Prepare a simple executive report
5. Recommend system improvements
6. Plan a validation round
7. Document lessons learned

### Comparison of time investment

| Approach | Time spent | Main activities |
|----------|------------|-----------------|
| **Manual design (with team)** | Several hours (approx. 3–4 hours) | Brainstorming, discussing scenarios, debating metrics, writing tasks, reviewing, iterating |
| **AI-generated** | ~2 minutes | Writing the prompt, reviewing the output, minor adjustments |

### Which strategy could provide better results?

Neither is strictly better. It depends on the context.

The **hybrid strategy** likely provides the best results:
1. Use AI to generate an initial structured plan quickly.
2. Manually review, validate, and adapt the plan to the specific project context.
3. Add theoretical grounding and references where needed.

In my experience, the AI-generated plan was more structured and complete than our team's initial manual version. However, it lacked justification for some metric thresholds (e.g., why 10 seconds for reaction time?). The human team is better at providing context-aware reasoning.

### Conditions to decide between AI and manual design

**Use AI when:**

| Condition | Reason |
|-----------|--------|
| Time is very limited | AI generates structure in minutes |
| The team has no clear starting point | AI provides a baseline to build upon |
| The project is low-stakes or internal | Perfect validity is not critical |
| You need to explore multiple approaches quickly | AI can generate variations fast |

**Use manual design when:**

| Condition | Reason |
|-----------|--------|
| The domain is sensitive (healthcare, finance, safety) | Errors could have serious consequences |
| Metrics need to be defensible (academic, client-facing) | You need citations and theoretical support |
| The system has unique or unusual characteristics | AI might miss important nuances |
| The team has strong domain expertise | Human judgment adds value AI cannot replicate |

### Final reflection on the approach

Using AI to design usability testing tasks was surprisingly efficient. In less time than it takes to write a 
single test scenario manually, I had a complete plan with pre-test and post-test tasks, metrics, templates, and
recommendations.

However, efficiency is not the same as quality. The AI-generated plan looked good on the surface, but accepting it without critical review would be risky. For example, the AI suggested that a reaction time above 10 seconds indicates poor usability, but it didn't provide any source or justification for that threshold.

This teaches me that AI is a great **scaffolding tool**, not a replacement for human judgment. The best workflow is:
1. Generate with AI
2. Review with human critical thinking
3. Adapt to the specific context
4. Add references and justification where needed

---

### Tool and prompt reference

**AI Tool Used:** DeepSeek

**Prompt used:**
> Based on the following attribute: *Prevention of Scheduling Conflicts: The system must prevent double-booking by checking in real time that no psychologist is assigned to more than one appointment on the same date and time, displaying an immediate error message if a conflict is detected before saving.*  
> Generate a list of tasks (pre and post) necessary to develop a usability testing plan that allows collecting meaningful metrics to evaluate the attribute. Consider that it is for a web-based appointment system with administrative users. The tasks should not be highly complex; they must involve simple and easy-to-understand metrics.
