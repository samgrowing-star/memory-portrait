export type Certainty = "high" | "medium" | "low" | "unknown";

export interface MemoryField {
  value: string;
  certainty: Certainty;
}

export interface PersonProfile {
  displayName: string;
  relationship: string;
  rememberedPeriod: string;
  ageRange: string;
  regionOrContext: string;
  faceShape: MemoryField;
  eyes: MemoryField;
  hair: MemoryField;
  clothing: MemoryField;
  impression: MemoryField;
}

export interface Candidate {
  id: string;
  generation: number;
  score: number;
  seed: number;
  palette: {
    skin: string;
    hair: string;
    background: string;
    accent: string;
  };
  traits: {
    faceWidth: number;
    faceHeight: number;
    eyeSize: number;
    eyeGap: number;
    mouthCurve: number;
    hairHeight: number;
    shoulderWidth: number;
  };
}

export interface SelectionRecord {
  generation: number;
  selectedIds: string[];
  rejectedIds: string[];
  note: string;
}
