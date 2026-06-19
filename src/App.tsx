import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import {
  evolveCandidates,
  generateInitialCandidates,
} from "./mockGenerator";
import type { Candidate, Certainty, MemoryField, PersonProfile, SelectionRecord } from "./types";

const certaintyLabels: Record<Certainty, string> = {
  high: "确定",
  medium: "大概",
  low: "模糊",
  unknown: "不确定",
};

const initialProfile: PersonProfile = {
  displayName: "李老师",
  relationship: "小学老师",
  rememberedPeriod: "1980s",
  ageRange: "40-50",
  regionOrContext: "中国北方乡镇学校",
  faceShape: { value: "偏长脸,颧骨略明显", certainty: "medium" },
  eyes: { value: "眼睛不大,眼神温和", certainty: "high" },
  hair: { value: "短发,略微花白", certainty: "low" },
  clothing: { value: "常穿深色外套", certainty: "medium" },
  impression: { value: "严厉但关心学生,笑起来眼角有皱纹", certainty: "high" },
};

function AppField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />
    </label>
  );
}

function MemoryFieldEditor({
  label,
  field,
  onChange,
}: {
  label: string;
  field: MemoryField;
  onChange: (field: MemoryField) => void;
}) {
  return (
    <div className="memory-field">
      <label className="field">
        <span>{label}</span>
        <input
          value={field.value}
          onChange={(event) => onChange({ ...field, value: event.target.value })}
        />
      </label>
      <select
        aria-label={`${label}确定度`}
        value={field.certainty}
        onChange={(event) =>
          onChange({ ...field, certainty: event.target.value as Certainty })
        }
      >
        {Object.entries(certaintyLabels).map(([value, labelText]) => (
          <option key={value} value={value}>
            {labelText}
          </option>
        ))}
      </select>
    </div>
  );
}

function PortraitCard({
  candidate,
  selected,
  rejected,
  onToggleSelected,
  onToggleRejected,
}: {
  candidate: Candidate;
  selected: boolean;
  rejected: boolean;
  onToggleSelected: () => void;
  onToggleRejected: () => void;
}) {
  const faceStyle = {
    "--skin": candidate.palette.skin,
    "--hair": candidate.palette.hair,
    "--bg": candidate.palette.background,
    "--accent": candidate.palette.accent,
    "--face-width": `${candidate.traits.faceWidth}%`,
    "--face-height": `${candidate.traits.faceHeight}%`,
    "--eye-size": `${candidate.traits.eyeSize}px`,
    "--eye-gap": `${candidate.traits.eyeGap}%`,
    "--mouth-curve": `${candidate.traits.mouthCurve}px`,
    "--hair-height": `${candidate.traits.hairHeight}%`,
    "--shoulder-width": `${candidate.traits.shoulderWidth}%`,
  } as CSSProperties;

  return (
    <article
      className={`portrait-card ${selected ? "is-selected" : ""} ${
        rejected ? "is-rejected" : ""
      }`}
    >
      <button
        className="portrait-button"
        type="button"
        onClick={onToggleSelected}
        aria-pressed={selected}
      >
        <div className="portrait" style={faceStyle}>
          <div className="shoulders" />
          <div className="face">
            <div className="hair" />
            <div className="eyes">
              <span />
              <span />
            </div>
            <div className="nose" />
            <div className="mouth" />
          </div>
        </div>
        <span className="candidate-id">候选 {candidate.id}</span>
      </button>
      <div className="card-actions">
        <button type="button" onClick={onToggleSelected}>
          {selected ? "已选更像" : "更像"}
        </button>
        <button type="button" onClick={onToggleRejected}>
          {rejected ? "取消不像" : "不像"}
        </button>
      </div>
    </article>
  );
}

function exportArchive(
  profile: PersonProfile,
  selected: Candidate | undefined,
  history: SelectionRecord[],
) {
  const archive = {
    schemaVersion: "0.1.0",
    notice: "AI-generated memory portrait archive. Not an original photograph.",
    person: {
      displayName: profile.displayName,
      relationship: profile.relationship,
      rememberedPeriod: profile.rememberedPeriod,
      ageRange: profile.ageRange,
      regionOrContext: profile.regionOrContext,
    },
    appearance: {
      faceShape: profile.faceShape,
      eyes: profile.eyes,
      hair: profile.hair,
      clothing: profile.clothing,
      impression: profile.impression,
    },
    selectedCandidate: selected ?? null,
    history,
    outputPolicy: {
      labelAsAiGenerated: true,
      allowPublicSharing: false,
    },
  };

  const blob = new Blob([JSON.stringify(archive, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "memory-portrait-archive.json";
  link.click();
  URL.revokeObjectURL(url);
}

export function App() {
  const [profile, setProfile] = useState<PersonProfile>(initialProfile);
  const [generation, setGeneration] = useState(1);
  const [candidates, setCandidates] = useState(() =>
    generateInitialCandidates(initialProfile),
  );
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [rejectedIds, setRejectedIds] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [history, setHistory] = useState<SelectionRecord[]>([]);
  const [finalId, setFinalId] = useState<string | null>(null);

  const finalCandidate = useMemo(
    () => candidates.find((candidate) => candidate.id === finalId),
    [candidates, finalId],
  );

  function updateProfile<Key extends keyof PersonProfile>(
    key: Key,
    value: PersonProfile[Key],
  ) {
    setProfile((current) => ({ ...current, [key]: value }));
  }

  function startSession() {
    const nextCandidates = generateInitialCandidates(profile);
    setCandidates(nextCandidates);
    setGeneration(1);
    setSelectedIds([]);
    setRejectedIds([]);
    setHistory([]);
    setFinalId(null);
    setNote("");
  }

  function nextGeneration() {
    const nextGenerationNumber = generation + 1;
    setHistory((records) => [
      ...records,
      { generation, selectedIds, rejectedIds, note },
    ]);
    setCandidates(
      evolveCandidates(candidates, selectedIds, nextGenerationNumber),
    );
    setGeneration(nextGenerationNumber);
    setSelectedIds([]);
    setRejectedIds([]);
    setNote("");
  }

  function reroll() {
    setCandidates(evolveCandidates(candidates, [], generation + 1));
    setGeneration((current) => current + 1);
    setSelectedIds([]);
    setRejectedIds([]);
    setNote("这轮整体不像,重新散开一批。");
  }

  function toggleSelected(id: string) {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((candidateId) => candidateId !== id)
        : [...current, id],
    );
    setRejectedIds((current) => current.filter((candidateId) => candidateId !== id));
  }

  function toggleRejected(id: string) {
    setRejectedIds((current) =>
      current.includes(id)
        ? current.filter((candidateId) => candidateId !== id)
        : [...current, id],
    );
    setSelectedIds((current) => current.filter((candidateId) => candidateId !== id));
  }

  return (
    <main>
      <section className="intro">
        <div>
          <p className="eyebrow">Memory Portrait MVP</p>
          <h1>故影</h1>
          <p>
            一个基于记忆的纪念肖像档案工具。当前版本使用 Mock
            候选图验证交互流程,不会生成真实照片。
          </p>
        </div>
        <div className="notice">
          AI 生成的记忆肖像,非真实历史照片。默认私有保存,公开分享前请确认授权。
        </div>
      </section>

      <section className="workspace">
        <aside className="panel">
          <h2>人物记忆档案</h2>
          <AppField
            label="称呼"
            value={profile.displayName}
            onChange={(value) => updateProfile("displayName", value)}
          />
          <AppField
            label="关系"
            value={profile.relationship}
            onChange={(value) => updateProfile("relationship", value)}
          />
          <AppField
            label="记忆年代"
            value={profile.rememberedPeriod}
            onChange={(value) => updateProfile("rememberedPeriod", value)}
          />
          <AppField
            label="当时年龄段"
            value={profile.ageRange}
            onChange={(value) => updateProfile("ageRange", value)}
          />
          <AppField
            label="地区或背景"
            value={profile.regionOrContext}
            onChange={(value) => updateProfile("regionOrContext", value)}
          />

          <div className="divider" />

          <MemoryFieldEditor
            label="脸型"
            field={profile.faceShape}
            onChange={(field) => updateProfile("faceShape", field)}
          />
          <MemoryFieldEditor
            label="眼神"
            field={profile.eyes}
            onChange={(field) => updateProfile("eyes", field)}
          />
          <MemoryFieldEditor
            label="发型"
            field={profile.hair}
            onChange={(field) => updateProfile("hair", field)}
          />
          <MemoryFieldEditor
            label="衣着"
            field={profile.clothing}
            onChange={(field) => updateProfile("clothing", field)}
          />
          <MemoryFieldEditor
            label="整体印象"
            field={profile.impression}
            onChange={(field) => updateProfile("impression", field)}
          />

          <button className="primary full" type="button" onClick={startSession}>
            重新生成第一代
          </button>
        </aside>

        <section className="stage">
          <div className="stage-header">
            <div>
              <p className="eyebrow">第 {generation} 代候选</p>
              <h2>选择更接近记忆的方向</h2>
            </div>
            <div className="toolbar">
              <button type="button" onClick={reroll}>
                这轮都不像
              </button>
              <button
                className="primary"
                type="button"
                onClick={nextGeneration}
                disabled={selectedIds.length === 0}
              >
                生成下一代
              </button>
            </div>
          </div>

          <div className="candidate-grid">
            {candidates.map((candidate) => (
              <PortraitCard
                key={candidate.id}
                candidate={candidate}
                selected={selectedIds.includes(candidate.id)}
                rejected={rejectedIds.includes(candidate.id)}
                onToggleSelected={() => toggleSelected(candidate.id)}
                onToggleRejected={() => toggleRejected(candidate.id)}
              />
            ))}
          </div>

          <label className="field note-field">
            <span>这一轮的新记忆或修正</span>
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="例如: 眼神接近,但脸型还不够瘦。"
            />
          </label>

          <div className="finalize">
            <select
              value={finalId ?? ""}
              onChange={(event) => setFinalId(event.target.value || null)}
              aria-label="选择最终候选"
            >
              <option value="">选择最终候选</option>
              {candidates.map((candidate) => (
                <option key={candidate.id} value={candidate.id}>
                  {candidate.id}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => exportArchive(profile, finalCandidate, history)}
            >
              导出记忆档案 JSON
            </button>
          </div>
        </section>
      </section>
    </main>
  );
}
