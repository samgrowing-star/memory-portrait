# 技术设计

## 概述

故影的技术核心是交互式进化:

```text
基础记忆档案 -> 初始候选图 -> 用户选择更像的方向 -> 生成下一代候选 -> 导出纪念档案
```

第一阶段优先验证完整交互闭环,模型生成能力采用可插拔 provider 设计。

## 系统架构

```text
┌──────────────────────────────┐
│ Web App                       │
│ 表单 · 候选网格 · 选择 · 导出 │
└──────────────┬───────────────┘
               │
┌──────────────▼───────────────┐
│ API Server                    │
│ 会话管理 · 进化调度 · 档案导出 │
└───────┬──────────────┬───────┘
        │              │
┌───────▼───────┐  ┌───▼────────┐
│ Generator     │  │ Storage    │
│ Mock/StyleGAN │  │ Session    │
│ Diffusion     │  │ Archive    │
└───────────────┘  └────────────┘
```

## 生成器接口

生成模型应被抽象为 provider,避免前端和业务逻辑绑定某一个模型。

```ts
export interface PortraitGenerator {
  generateInitialPopulation(
    profile: PersonProfile,
    options: GenerationOptions
  ): Promise<Candidate[]>

  evolvePopulation(
    session: PortraitSession,
    feedback: SelectionFeedback
  ): Promise<Candidate[]>

  finalize(
    candidate: Candidate,
    options: FinalizeOptions
  ): Promise<FinalPortrait>
}
```

第一版可以只实现 `MockPortraitGenerator`,使用预置图或占位图跑通产品流程。

## 会话模型

```json
{
  "sessionId": "session_123",
  "generation": 3,
  "profile": {},
  "population": [
    {
      "id": "candidate_1",
      "imageUrl": "/outputs/candidate_1.png",
      "metadata": {}
    }
  ],
  "history": [
    {
      "generation": 2,
      "selectedIds": ["candidate_2", "candidate_4"],
      "rejectedIds": ["candidate_1"],
      "notes": "眼神更像,但脸型不对"
    }
  ]
}
```

探索过程可以设置 TTL。最终导出的档案才作为长期数据保存。

## API 草案

```text
POST /api/sessions
GET  /api/sessions/:id
POST /api/sessions/:id/select
POST /api/sessions/:id/reroll
POST /api/sessions/:id/finalize
GET  /api/sessions/:id/export
```

### 创建会话

```json
{
  "profile": {
    "displayName": "李老师",
    "relationship": "小学老师",
    "rememberedPeriod": "1980s",
    "ageRange": "40-50"
  }
}
```

### 选择反馈

```json
{
  "selectedIds": ["candidate_2", "candidate_4"],
  "rejectedIds": ["candidate_7"],
  "lockedFeatures": ["face_shape"],
  "note": "眼神接近,头发还不像"
}
```

## 交互式进化算法

当使用 StyleGAN provider 时,每个候选可以表示为隐向量。

```text
w_init = w_mean + Σ(attr_i × direction_i) + noise
```

用户选择的候选作为父代:

```text
w_child = Σ(weight_i × w_parent_i) + mutation_noise
```

变异幅度随轮次递减:

```text
sigma_generation = sigma_initial * decay^generation
```

注意: 特征锁定属于高风险增强功能,不应作为第一阶段必需能力。它需要稳定的局部属性控制,否则会造成用户以为系统能精确保留某些五官,实际却会影响其他特征。

## 输入字段建议

避免把产品设计成生硬的人种、性别分类器。建议使用更贴近记忆场景的字段:

- 称呼或关系
- 记忆年代
- 当时年龄段
- 地区或文化背景,可选
- 整体气质
- 脸型、眼神、发型、衣着
- 标志性特征
- 每个字段的确定度

## 导出档案

最终导出建议包含:

```text
person.yaml
memories.md
generation-history.json
selected-portraits/
consent.md
README.md
```

导出说明必须包含:

```text
This archive contains AI-generated memory portraits, not original photographs.
```
