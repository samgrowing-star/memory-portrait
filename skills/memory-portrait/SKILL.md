---
name: memory-portrait
description: Create ethical AI-assisted, memory-based memorial portraits for people with no photographs or few photographs. Use when a user wants to reconstruct or imagine the remembered appearance of a deceased relative, teacher, classmate, elder, community member, or historical person from oral memory; when Codex needs to guide memory collection, build safe image-generation prompts, run multi-round candidate selection with an image generator, label uncertainty, and export a memorial portrait archive. Do not use for identity search, surveillance, law enforcement, evidence generation, or making images appear to be real photographs.
---

# Memory Portrait

## Core Rule

Never claim to restore a real photograph or true identity. Produce an **AI-generated memory portrait** with visible uncertainty and provenance.

Always preserve this label in user-facing outputs:

```text
AI-generated memory portrait. Not an original photograph.
AI 生成的记忆肖像,非真实历史照片。
```

## Workflow

1. **Set boundaries first.** State that the work is memorial, not identification or evidence. If the request asks for face search, real-person matching, law enforcement use, deception, or a fake historical photo, refuse that part and offer a memorial archive alternative.
2. **Collect memory.** Ask for missing essentials only when needed: relationship, remembered period, age range, region/context, face/eyes/hair/clothing, distinctive marks, personality impression, and which details are certain or uncertain.
3. **Structure the profile.** Convert free text into the archive schema in `references/archive-schema.md`. Keep conflicting memories as separate notes rather than forcing a single fact.
4. **Generate candidates.** If image generation is available, create 4-8 diverse candidate portraits using `references/prompt-patterns.md`. If not, provide a prompt pack ready for an image-capable model.
5. **Iterate by selection.** Ask the user which candidates feel closer, which feel wrong, and what new memory was triggered. Generate the next round by preserving selected traits, removing rejected traits, and keeping uncertainty visible.
6. **Finalize carefully.** Export or present the final image with the required AI label, profile summary, memory notes, generation history, and sharing restrictions.

## Reference Routing

- Read `references/ethics.md` when handling consent, public sharing, real-person risk, minors, living people, law enforcement, or deceptive use.
- Read `references/prompt-patterns.md` before constructing image prompts or multi-round generation instructions.
- Read `references/archive-schema.md` when exporting YAML/JSON/Markdown archives or validating profile fields.
- Read `references/workflow.md` when designing UI, agent flows, candidate selection, or iteration loops.

## Image Generation Requirements

When generating images:

- Prefer portrait, head-and-shoulders framing, neutral background, respectful documentary tone.
- Avoid hyperrealistic wording that implies a recovered photograph.
- Avoid direct claims like "this is what they looked like".
- Include age, era, region/context, expression, clothing, and uncertainty cues.
- Generate multiple plausible variants when memory is uncertain.
- Do not use real living people or celebrities as references unless the user provides authorized reference material and the task is otherwise safe.

## Output Shape

For a complete result, provide:

- A short memory profile.
- 4-8 candidate prompts or generated images.
- A selection/iteration note.
- A final archive snippet in YAML or JSON.
- The required AI-generated label.

If the user only wants a prompt, provide one concise prompt plus a negative prompt and the required label.
