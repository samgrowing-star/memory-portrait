# Archive Schema Reference

Use this shape for exported YAML or JSON. Keep unknown details explicit.

```yaml
schemaVersion: "0.1.0"
notice: "AI-generated memory portrait archive. Not an original photograph."
person:
  displayName: "李老师"
  relationship: "小学老师"
  rememberedPeriod: "1980s"
  ageRange: "40-50"
  regionOrContext: "中国北方乡镇学校"

appearance:
  faceShape:
    value: "偏长脸,颧骨略明显"
    certainty: "medium"
    sources: ["学生A", "学生B"]
  eyes:
    value: "眼睛不大,眼神温和"
    certainty: "high"
    sources: ["学生A"]
  hair:
    value: "短发,略微花白"
    certainty: "low"
    sources: ["学生B"]
  clothing:
    value: "常穿深色外套"
    certainty: "medium"
    sources: ["学生A"]
  impression:
    value: "严厉但关心学生"
    certainty: "high"
    sources: ["学生A", "学生C"]

memories:
  - contributor: "学生A"
    text: "她说话很慢,笑起来眼角有皱纹。"

generationHistory:
  - round: 1
    selected: ["A", "C"]
    rejected: ["B"]
    note: "眼神接近,脸型还不够瘦。"

outputPolicy:
  labelAsAiGenerated: true
  allowPublicSharing: false
  notes: "公开分享前需确认家庭或社区授权。"
```

## Certainty Values

Use only:

```text
high
medium
low
unknown
```

## Markdown Export

For a readable archive, include:

```markdown
# [displayName] 的记忆肖像档案

> AI 生成的记忆肖像,非真实历史照片。

## 人物背景
## 样貌记忆
## 多人记忆片段
## 生成历史
## 分享与同意
```
