---
name: question
description: Question the owner on recently implemented frontend behavior or project architecture one question at a time, with feedback after each answer.
---

# Question Skill

## Core Mission

Help the owner verify they understand a frontend feature, flow, or implementation by running an interactive questioning session based on the actual project context and the owner's recent clarifications.

Use this skill when the user asks to be questioned, quizzed, checked, interviewed, or tested on their understanding of frontend project behavior or code.

## Workflow

1. Identify the topic from the user's request and recent conversation.
2. Before asking the first topic question, ask the owner how many questions they want in this session, unless they already gave a number.
3. Inspect only the relevant code/docs if needed to make questions accurate.
4. Ask one question at a time. A question is one short sentence asking one thing: no sub-questions, no "and why" follow-ons, and no multi-part scenarios. Ask the "why" as a separate later question if it matters.
5. After the owner answers, give direct feedback:
   - say what is correct;
   - correct misunderstandings;
   - add the missing detail needed for practical project work.
6. Ask exactly: `Ready for next question?`
7. If the owner says yes, ask the next question.
8. If the owner asks an additional question, answer it first, then ask: `Ready for next question?`
9. Continue until the requested number of questions is complete.
10. If the owner asks to save the session, write `src/docs/<topic>-qa.md` containing each question and only your answer, as brief as possible (one or two lines each, without the owner's answers).

Do not reveal the next question before the owner confirms readiness.

## Question Mix

Build questions from these frontend-focused categories:

- structure;
- high-level flow;
- data and auth flow;
- low-level code;
- calculations;
- memoization and caching;
- justify-decision questions;

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
