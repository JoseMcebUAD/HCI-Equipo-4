
The Web Clinic project, while promising, does not yet have a strong enough foundation to be considered a system that fully integrates UX attributes. Rather, it can be seen as a partial integration of different attributes—something like a “vegetable soup.” However, from a personal standpoint, I consider that **memorability** was not an attribute that was taken into account during the planning stage.

We can define memorability as the ease with which users can reestablish their knowledge of how to use a system after a period of inactivity. In the words of :contentReference[oaicite:0]{index=0}:

> “Memorability: When users return to the design after a period of not using it, how easily can they reestablish proficiency?”

This idea can be understood through a simple everyday example: even if someone has not ridden a bicycle in years, when they get back on it, they remember how to do it. That is memorability.

Although it sounds important to be able to remember how to schedule appointments and manage time slots, during the development of the system, the possibility that an administrative user might stop using the system for a prolonged period was never really considered. It was assumed that, since the processes are relatively simple and well-structured—and also comply with attributes such as effectiveness, accessibility, and learnability—the user would not have difficulty resuming their tasks.

However, when considering real-world scenarios (for example, vacation periods), this assumption no longer holds. At this point, a clear limitation of the project becomes evident: **there is no indicator to evaluate the system’s memorability**, nor was it designed with this attribute in mind.

To address this gap, a metric called the **Operational Relearning Index (ORI)** is proposed. This metric aims to measure the user’s ability to resume system use after a period of inactivity by comparing performance across two different moments. This approach aligns with standard UX evaluation practices. According to :contentReference[oaicite:1]{index=1}:

> “Usability is measured relative to users’ performance on a given set of tasks. Common metrics include success rate, time on task, and error rate.”

Based on this premise, memorability can be evaluated by comparing variables such as task completion time and number of errors between an initial session and a second session after a period of inactivity.

---

## **Operational Relearning Index (ORI)**

**Definition:**  
A metric that evaluates memorability by comparing user performance before and after a period without system use.

**Formula:**
![[Pasted image 20260424200817.png]]

**Where:**
- **Tr (Relative Time):** time in second session / time in first session  
- **Er (Relative Errors):** errors in second session / errors in first session  

**Interpretation:**
- **ORI ≈ 1:** High memorability (performance is maintained)  
- **ORI > 1:** Low memorability (performance worsens)  
- **ORI < 1:** Improvement (possible further learning or familiarization)  

---

This avoids the need to construct overly complex metrics, as the literature supports the use of simple but meaningful indicators.

Furthermore, the relevance of this attribute can also be supported from a cognitive perspective. According to :contentReference[oaicite:2]{index=2}:

> “Human memory is not perfect, and systems should be designed to minimize the user’s memory load.”

This implies that a well-designed system should not only be easy to use, but also easy to remember.

Ultimately, memorability is something I only considered while doing this reflection (I did not even know it was a UX attribute, to be honest). After this, I will definitely take it into account, since the ability for a user to remember or associate elements based on prior experiences is somewhat important—especially in a context like mental health.

---
## Referencias
- Nielsen Norman Group – _Usability 101: Introduction to Usability_ (2012) 
- Documento: _UX Metrics – Measuring the Success of Usability and User Experience