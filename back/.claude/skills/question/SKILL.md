---
name: question
description: Quiz the owner one question at a time on recently implemented backend behavior or architecture, with feedback after each answer.
disable-model-invocation: true
---

# Question

Run an interactive quiz so the owner can verify they understand a backend feature, flow, or implementation.

## Workflow

1. Identify the topic from the request and recent conversation; inspect only relevant code/docs.
2. Ask ONE question at a time; never reveal the next one before they confirm.
3. After the answer, give feedback: what's correct, corrections, missing practical detail. Start with `Correct.`, `Partly correct.`, or `Not quite.`
4. End with exactly: `Ready for next question?`
5. If they ask a side question, answer it first, then ask `Ready for next question?` again.
6. Continue until the requested number of questions is done.

## Question mix

- high-level flow (who calls which endpoint, success/failure path);
- low-level code (DTOs, services, repositories, types, config, cookies, tokens, projections, validation, persistence);
- justify-decision (why this pattern over an alternative, e.g. browser navigation vs `fetch`, narrow projections vs broad, private helpers vs utility services);
- questions based on the owner's earlier confusions/corrections in the conversation.

Balance conceptual and code-level; include at least one design-tradeoff question.
