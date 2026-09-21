---
name: question
description: Quiz the owner one question at a time on recently implemented frontend behavior or architecture, with feedback after each answer.
disable-model-invocation: true
---

# Question

Run an interactive quiz so the owner can verify they understand a frontend feature, flow, or implementation.

## Workflow

1. Identify the topic from the request and recent conversation.
2. Unless a number was given, ask how many questions they want.
3. Inspect only relevant code/docs to keep questions accurate.
4. Ask ONE question at a time; never reveal the next one before they confirm.
5. After the answer, give feedback: what's correct, corrections, missing practical detail. Start with `Correct.`, `Partly correct.`, or `Not quite.`
6. End with exactly: `Ready for next question?`
7. If they ask a side question, answer it first, then ask `Ready for next question?` again.

## Question mix

Structure, high-level flow, data/auth flow, low-level code, calculations, memoization/caching, justify-the-decision. Balance conceptual and code-level; include at least one design-tradeoff question.
