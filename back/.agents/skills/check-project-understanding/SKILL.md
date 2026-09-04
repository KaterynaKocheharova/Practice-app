---
name: check-project-understanding
description: Quiz the owner on recently implemented backend behavior or project architecture one question at a time, with feedback after each answer.
---

# Check Project Understanding Skill

## Core Mission
Help the owner verify they understand a backend feature, flow, or implementation by running an interactive quiz based on the actual project context and the owner's recent clarifications.

Use this skill when the user asks to be questioned, quizzed, checked, interviewed, or tested on their understanding of project behavior or code.

## Workflow
1. Identify the topic from the user's request and recent conversation.
2. Inspect only the relevant code/docs if needed to make questions accurate.
3. Ask one question at a time.
4. After the owner answers, give direct feedback:
   - say what is correct;
   - correct misunderstandings;
   - add the missing detail needed for practical project work.
5. Ask exactly: `Ready for next question?`
6. If the owner says yes, ask the next question.
7. If the owner asks an additional question, answer it first, then ask: `Ready for next question?`
8. Continue until the requested number of questions is complete.

Do not reveal the next question before the owner confirms readiness.

## Question Mix
Build questions from these categories:

- high-level flow: who calls which endpoint, what the user/browser/backend/provider does, and what the success/failure path is;
- low-level code: DTOs, services, repositories, types, config objects, cookies, tokens, projections, validation, and persistence details;
- justify-decision questions: why the implementation uses a specific pattern instead of an alternative, such as browser navigation instead of `fetch`, `state` plus cookie instead of only query data, narrow projections instead of broad repository methods, or private helpers instead of utility services;
- clarification-based questions: questions based on the owner's previous confusions, corrections, and decisions in the conversation.

Balance conceptual questions with code-level reasoning. Include at least one question that asks the owner to explain a design tradeoff.

## Feedback Style
Keep feedback concise but explicit.

Use this pattern:

```txt
Correct.

[One or two concrete refinements if needed.]

Ready for next question?
```

If the answer is partly wrong:

```txt
Partly correct.

[What was right.]
[What was missing or wrong.]
[Correct explanation.]

Ready for next question?
```

If the answer is wrong:

```txt
Not quite.

[Correct explanation.]
[Why the distinction matters in this project.]

Ready for next question?
```
