export type Exercise = {
  id: string;
  name: string;
  bodyPart: string;
};

export const EXERCISES: Exercise[] = [
  { id: "bench_press", name: "ベンチプレス", bodyPart: "胸" },
  { id: "squat",       name: "スクワット",   bodyPart: "脚" },
  { id: "deadlift",    name: "デッドリフト", bodyPart: "背中" },
  { id: "shoulder",    name: "ショルダープレス", bodyPart: "肩" },
  { id: "curl",        name: "アームカール", bodyPart: "腕" },
];
