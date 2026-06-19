import type { Candidate, PersonProfile } from "./types";

const skinTones = ["#f2c9a7", "#e7b98f", "#d7a076", "#c58663", "#ad7658"];
const hairTones = ["#1f1a17", "#3a2b23", "#5a4637", "#6e6258", "#8e8a80"];
const backgrounds = ["#edf3f0", "#f5efe6", "#ece8dd", "#e8eef5", "#f2ecef"];
const accents = ["#5d716f", "#8a6f4d", "#6c718c", "#7a604c", "#526f57"];

function hashText(value: string): number {
  let hash = 2166136261;
  for (const char of value) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function random(seed: number): () => number {
  let state = seed || 1;
  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let next = Math.imul(state ^ (state >>> 15), 1 | state);
    next ^= next + Math.imul(next ^ (next >>> 7), 61 | next);
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T>(items: T[], value: number): T {
  return items[Math.floor(value * items.length) % items.length];
}

function makeCandidate(seed: number, generation: number, score = 0): Candidate {
  const rand = random(seed);

  return {
    id: `g${generation}-${seed.toString(36)}`,
    generation,
    score,
    seed,
    palette: {
      skin: pick(skinTones, rand()),
      hair: pick(hairTones, rand()),
      background: pick(backgrounds, rand()),
      accent: pick(accents, rand()),
    },
    traits: {
      faceWidth: 42 + rand() * 18,
      faceHeight: 54 + rand() * 18,
      eyeSize: 4 + rand() * 4,
      eyeGap: 17 + rand() * 10,
      mouthCurve: -4 + rand() * 10,
      hairHeight: 10 + rand() * 18,
      shoulderWidth: 58 + rand() * 26,
    },
  };
}

export function generateInitialCandidates(profile: PersonProfile): Candidate[] {
  const seed = hashText(
    [
      profile.displayName,
      profile.relationship,
      profile.rememberedPeriod,
      profile.ageRange,
      profile.regionOrContext,
      profile.impression.value,
    ].join("|"),
  );

  return Array.from({ length: 8 }, (_, index) =>
    makeCandidate(seed + index * 9973, 1),
  );
}

export function evolveCandidates(
  previous: Candidate[],
  selectedIds: string[],
  generation: number,
): Candidate[] {
  const selected = previous.filter((candidate) =>
    selectedIds.includes(candidate.id),
  );
  const parents = selected.length > 0 ? selected : previous;
  const baseSeed =
    parents.reduce((total, candidate) => total + candidate.seed, 0) +
    generation * 104729;

  return Array.from({ length: 8 }, (_, index) => {
    const parent = parents[index % parents.length];
    const child = makeCandidate(baseSeed + parent.seed + index * 3571, generation);
    return {
      ...child,
      score: selectedIds.includes(parent.id) ? parent.score + 1 : parent.score,
      palette: {
        ...child.palette,
        hair: index % 3 === 0 ? parent.palette.hair : child.palette.hair,
      },
      traits: {
        ...child.traits,
        faceWidth: (child.traits.faceWidth + parent.traits.faceWidth) / 2,
        faceHeight: (child.traits.faceHeight + parent.traits.faceHeight) / 2,
        eyeGap: (child.traits.eyeGap + parent.traits.eyeGap) / 2,
      },
    };
  });
}
