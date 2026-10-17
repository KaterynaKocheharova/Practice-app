---
name: question
description: Quiz the owner one question at a time on backend work from the current thread — rules, flows, checks, guards, and what each method does — with feedback after each answer. Use whenever the owner asks to be questioned, quizzed, tested or checked on their understanding (e.g. "question me", "quiz me", "ask me 15 questions about our thread").
---

# Question Skill

## Core Mission
Help the owner verify they understand what was built or discussed in the thread by running an interactive quiz based on the actual project code and the owner's recent clarifications.

Use this skill when the user asks to be questioned, quizzed, checked, interviewed, or tested on their understanding of project behavior or code.

## Workflow
1. Take the topic and number of questions from the request (default 10). If no topic is named, use the work done in the current thread. If the owner asks how many to do, recommend a number for this scope with a one-line list of the areas it would cover, then start.
   - Priority topics: concepts the owner approved during the task but said they only partly understood (e.g. "I barely understand it"). Quiz those first.
2. Inspect only the relevant code/docs so every question matches the code as it is now, not earlier versions from the thread.
3. Ask one question at a time, labelled `Question N of M (<category>)` every time, including re-asks after side questions. Write it as a single focused question in one or two sentences — no sub-points, bullet lists, or multi-part prompts. It must ask exactly one thing: one question mark, and no second ask joined with "and why/what/how".
4. After the owner answers, give direct feedback:
   - say what is correct;
   - correct misunderstandings;
   - add the missing detail needed for practical project work, with file/method names;
   - keep it short and plain: a few sentences or a 2–4 step list, no walls of text, because the owner gets lost in long explanations.
5. Ask exactly: `Ready for next question?`
6. If the owner says yes, ask the next question.
7. If the owner asks an additional question, answer it first, then ask: `Ready for next question?`
9. Continue until the requested number of questions is complete, then give a short summary: strong areas and what to revisit.
   - If the owner stops early, say `Answered X of M`, list the unanswered questions as still open, and do not call the quiz complete or give a final summary as if it were. If they come back to it, re-ask the open question with its original number.

Do not reveal the next question before the owner confirms readiness.

## What to Ask About
Keep questions high-level — ask the owner to explain, not to recite code. Cover:

- rules: business and access rules (who owns what, who may see or change what, uniqueness, statuses);
- flows: an endpoint end to end — guards, service, repository, success and failure paths;
- checks: each validation or precondition, where it runs (DTO, guard, service, database constraint), and the error it returns;
- guards: what each guard checks, what it puts on the request, the order they run in, and why;
- methods: what each important service/repository method does and why it is shaped that way (narrow projections, transactions, one method per use case);
- decisions: at least one design trade-off (why this approach over an alternative);
- earlier confusions: points the owner questioned or corrected in the conversation.

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


## Recording answers

When the owner asks to record the quiz, save the **correct** answers, not the session transcript, in the existing Q&A file for the topic or a new one next to the feature docs (backend: `docs/<module>/<topic>-quiz.md`; frontend: `src/docs/<area>/<topic>-qa.md`). Keep every entry short and in the same style on both sides: a bold numbered question, then one to three sentences naming the key method, guard or error code. No code blocks, tables or step lists; link to the full feature doc once at the top instead. Include side questions the owner asked when they clarify a real gap.

When a quiz covers both apps, split the answers by ownership (frontend answers in `front/src/docs/<area>/<topic>-qa.md`, backend answers in `back/docs/<module>/<topic>-quiz.md`), mention the other file at the top of each, and link each file from its feature doc with a closing `Self-check questions: [file](file).` line.
