# Prompt Patterns

## Base Candidate Prompt

Use this structure for each candidate:

```text
Create an AI-generated memory portrait, not a real photograph, of [relationship/name], remembered as [age range] during [period] in [region/context]. Head-and-shoulders portrait, respectful memorial tone, neutral background. Appearance from memory: [face], [eyes], [hair], [clothing], [distinctive details]. Overall impression: [personality/gait/expression]. Some details are uncertain, so create one plausible interpretation rather than claiming accuracy.
```

## Negative Prompt

```text
Do not create a celebrity likeness, modern selfie, police composite, surveillance image, ID photo, forensic evidence, glamour portrait, caricature, horror style, or image that appears to be an original historical photograph. Avoid text artifacts, extra faces, distorted eyes, distorted hands, and exaggerated ethnic stereotypes.
```

## Candidate Variation Strategy

Generate variations by changing only one or two uncertain dimensions per candidate:

- Candidate A: prioritize face shape and age.
- Candidate B: prioritize eyes and expression.
- Candidate C: prioritize hair and clothing.
- Candidate D: prioritize overall warmth/strictness.
- Candidate E: younger remembered version.
- Candidate F: older remembered version.
- Candidate G: more rural/community context.
- Candidate H: more formal/school context.

## Iteration Prompt

After user selection:

```text
Create the next round of AI-generated memory portrait candidates. Preserve these selected traits: [selected traits]. Avoid these rejected traits: [rejected traits]. Newly remembered detail: [note]. Keep the result clearly labeled as a memory portrait, not a real photograph. Generate [count] diverse but related candidates.
```

## Final Prompt

```text
Create a final respectful AI-generated memory portrait based on the selected candidate direction. Preserve: [selected traits]. Include: [high-certainty details]. Treat as uncertain: [low-certainty details]. Avoid: [rejected traits]. The image should feel like a memorial portrait based on oral memory, not a restored photograph.
```

## Prompt Hygiene

- Use "remembered as" instead of "accurately".
- Use "plausible interpretation" instead of "reconstruction".
- Include uncertainty directly in the prompt.
- Avoid overly detailed demographic stereotyping.
- Keep lighting and background simple so the face remains inspectable.
