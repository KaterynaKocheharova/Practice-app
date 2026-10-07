---
name: question
description: Quiz the owner one question at a time on recently implemented frontend behavior or architecture, with feedback after each answer.
disable-model-invocation: true
---

# Question

Run an interactive quiz so the owner can verify they understand a frontend feature, flow, or implementation.

## Workflow

1. Identify the topic from the request and recent conversation.
2. Unless a number was given, ask how many questions they want and recommend one for this scope, with a one-line list of the areas it would cover. If they ask for a recommendation, give it and start.
3. Inspect only relevant code/docs so every question matches the code as it is now, not earlier versions from the thread.
4. Ask ONE question at a time, labelled `Question N of M` every time (including re-asks after side questions); never reveal the next one before they confirm. A question is one short sentence asking one thing: no sub-questions, no "and why…" follow-ons, no multi-part scenarios. Put the "why" in a later question if it matters.
5. After the answer, give feedback: what's correct, corrections, missing practical detail with file/function names. Start with `Correct.`, `Partly correct.`, or `Not quite.`
6. End with exactly: `Ready for next question?`
7. If they ask a side question, answer it first, then ask `Ready for next question?` again.
8. After the last question, give a short summary: strong areas and what to revisit.
10. If asked to save the session, write `src/docs/<topic>-qa.md` with each question and only your answer, as brief as possible (one or two lines, no owner answers).

## Question mix

Structure, high-level flow, data/auth flow, low-level code, calculations, memoization/caching, justify-the-decision. Balance conceptual and code-level; include at least one design-tradeoff question.
