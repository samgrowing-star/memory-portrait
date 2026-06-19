# Workflow Reference

## Agent Flow

1. Boundary statement.
2. Memory intake.
3. Structured profile.
4. Candidate generation.
5. Selection feedback.
6. Next-round generation.
7. Final archive.

## Intake Questions

Ask only the questions needed for the next step.

- 这个人和你的关系是什么?
- 你记得 TA 是哪个年代、哪个年龄段的样子?
- 地区、学校、家庭或社区背景是什么?
- 你最确定的样貌细节是什么?
- 你最不确定的细节是什么?
- TA 给人的整体感觉是什么?
- 是否有痣、皱纹、眼镜、发型、衣着等标志性特征?
- 这张图是否只用于私人纪念?

## Candidate Review Questions

After candidates are shown:

- 哪几张整体更接近?
- 哪张的眼神、脸型、发型或气质更像?
- 哪些地方明显不像?
- 看到这些图后,你想起了什么新细节?
- 下一轮要保留什么,避免什么?

## UI Pattern

Use 4-8 candidates per round. Give each candidate a stable ID. Provide controls:

- More like this
- Not like this
- Preserve eyes/face/hair/clothing/impression
- Add memory note
- Generate next round
- Finalize archive

## Stop Conditions

Stop when:

- The user selects a final direction.
- Two rounds produce no improvement.
- The user becomes uncomfortable.
- The request drifts into identification, evidence, or deception.

## Finalization

The final response should include:

- The final selected image or prompt.
- A short statement of uncertainty.
- The AI-generated label.
- The archive data.
- A reminder that public sharing requires consent.
