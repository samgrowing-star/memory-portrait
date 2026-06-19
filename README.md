# 故影 Memory Portrait

故影是一个开源项目,用于帮助家庭、学校、社区和口述历史项目,为没有留下照片或照片极少的故人创建**基于记忆的纪念肖像**。

本项目不声称还原真实照片。它帮助人们把关于一个人的样貌、气质、年代背景和故事整理成可追溯的记忆档案,并在明确标注不确定性的前提下生成纪念性视觉图像。

> 有些人没有被相机留下,但他们仍然活在许多人的记忆里。

## 项目目标

- 通过结构化问卷采集对故人的样貌记忆。
- 支持多人协作补充、比较和修正记忆。
- 通过候选图选择的方式,让用户逐轮接近主观记忆中的样子。
- 保存生成过程、记忆来源和不确定性,而不是只保存最终图片。
- 为所有生成图片添加 AI 生成标识,避免被误认为真实照片。

## 非目标

故影不是身份识别工具,也不是法证取证工具。

本项目不用于:

- 根据记忆寻找现实中的某个人。
- 与真实人脸数据库匹配。
- 生成执法、取证或新闻证据。
- 冒充真实历史照片。
- 未经同意公开逝者或亲属相关资料。

## Skill-first 方向

本项目的核心不依赖自建大模型服务,而是作为一个可复用 Skill,指导具备图像生成能力的大模型完成:

- 记忆采集
- 伦理边界检查
- 图像生成提示词构造
- 多轮候选选择
- 不确定性标注
- 纪念档案导出

Skill 位于:

```text
skills/memory-portrait/
```

Web App 是这个 Skill 的可视化原型,用于验证交互流程。

## MVP 范围

第一阶段优先做两个可运行、可贡献、可讨论的最小版本:

- 一个 `memory-portrait` Skill,用于图像生成大模型的工作流编排。
- 一个无 GPU Web MVP,用于本地验证人物档案、候选选择和导出流程。

GPU 模型推理或外部图像生成服务会作为可选 provider 接入,而不是 MVP 的前置条件。

## 推荐技术方向

长期技术路线采用可插拔生成器:

- `MockPortraitGenerator`: 无 GPU 的开发与演示版本。
- `StyleGANPortraitGenerator`: 用 StyleGAN2/3 隐空间做交互式进化。
- `DiffusionRefineGenerator`: 用扩散模型做最终高清重绘。

核心交互不是让用户精确描述五官参数,而是让用户从一组候选中选择“更像的方向”,再由系统基于选择结果生成下一代候选。

## 仓库结构

```text
.
├── README.md
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
├── docs/
│   ├── ethics.md
│   ├── product-vision.md
│   ├── technical-design.md
│   └── roadmap.md
├── examples/
│   └── sample-person/
│       ├── README.md
│       ├── memories.md
│       └── person.yaml
├── schemas/
│   └── person.schema.json
├── skills/
│   └── memory-portrait/
│       ├── SKILL.md
│       ├── agents/
│       └── references/
└── src/
```

## 当前状态

项目当前已经包含一个 `memory-portrait` Skill 和一个无 GPU 的 Vite + React MVP。Web MVP 使用 Mock 候选肖像验证人物档案、候选选择、迭代生成和 JSON 导出流程。

## 本地运行

```bash
npm install
npm run dev
```

生产构建:

```bash
npm run build
```

欢迎围绕以下方向贡献:

- 记忆采访问卷设计
- 数据结构与导出格式
- 前端交互原型
- 伦理与隐私边界
- 生成模型 provider
- 中英文文档改进

## License

MIT License.
