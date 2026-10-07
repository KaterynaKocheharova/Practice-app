---
name: question
description: Quiz the owner one question at a time on backend work from the current thread — rules, flows, checks, guards, and what each method does — with feedback after each answer. Use whenever the owner asks to be questioned, quizzed, tested or checked on their understanding (e.g. "question me", "quiz me", "ask me 15 questions about our thread").
---

# Question

Run an interactive quiz so the owner can verify they understand what was built or discussed in the thread.

## Workflow

1. Take the topic and number of questions from the request (default 10). If no topic is named, use the work done in the current thread. If the owner asks how many to do, recommend a number for this scope with a one-line list of the areas it would cover, then start.
2. Inspect only the relevant code/docs so every question matches the code as it is now, not earlier versions from the thread.
3. Ask ONE question at a time, labelled `Question N of M (<category>)` every time, including re-asks after side questions. Write it as a single focused question in one or two sentences — no sub-points, bullet lists, or multi-part prompts. It must ask exactly one thing: one question mark, and no second ask joined with "and why/what/how". Never reveal the next question before the owner confirms.
4. After each answer, give feedback starting with `Correct.`, `Partly correct.`, or `Not quite.`: what was right, what was missing or wrong, and the correct explanation with file/method names.
5. End every feedback with exactly: `Ready for next question?`
6. If the owner asks a side question, answer it first, then ask `Ready for next question?` again.
7. Continue until all questions are done, then give a short summary: strong areas and what to revisit.

## What to ask about

Keep questions high-level — ask the owner to explain, not to recite code. Cover:

- **rules**: business and access rules (who owns what, who may see or change what, uniqueness, statuses);
- **flows**: an endpoint end to end — guards, service, repository, success and failure paths;
- **checks**: each validation or precondition, where it runs (DTO, guard, service, database constraint), and the error it returns;
- **guards**: what each guard checks, what it puts on the request, the order they run in, and why;
- **methods**: what each important service/repository method does and why it is shaped that way (narrow projections, transactions, one method per use case);
- **decisions**: at least one design trade-off (why this approach over an alternative);
- **earlier confusions**: points the owner questioned or corrected in the thread.

## Feedback style

```txt
Correct.

[One or two concrete refinements if needed.]

Ready for next question?
```

```txt
Partly correct.

[What was right.]
[What was missing or wrong.]
[Correct explanation.]

Ready for next question?
```

```txt
Not quite.

[Correct explanation.]
[Why the distinction matters in this project.]

Ready for next question?
```
