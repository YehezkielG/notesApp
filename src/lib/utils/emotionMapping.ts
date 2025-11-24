// Data type for the 28 GoEmotion labels
export type GoEmotionLabel =
  | "admiration"
  | "amusement"
  | "anger"
  | "annoyance"
  | "approval"
  | "caring"
  | "confusion"
  | "curiosity"
  | "desire"
  | "disappointment"
  | "disapproval"
  | "disgust"
  | "embarrassment"
  | "excitement"
  | "fear"
  | "gratitude"
  | "grief"
  | "joy"
  | "love"
  | "nervousness"
  | "optimism"
  | "pride"
  | "realization"
  | "relief"
  | "remorse"
  | "sadness"
  | "surprise"
  | "neutral";

export const getEmojiForLabel = (label: string): string => {
  const emotionMap: Record<string, string> = {
    // Positive / Constructive
    admiration: "✨", // Awe
    amusement: "🤭", // Amused
    approval: "👌", // Approval
    caring: "🤗", // Caring
    desire: "🔥", // Desire
    excitement: "🤩", // Excited
    gratitude: "🙏", // Grateful
    joy: "🌻", // Joy
    love: "❤️", // Love
    optimism: "🌅", // Optimistic
    pride: "🦁", // Proud
    relief: "🍃", // Relief

    // Negative / Intense
    anger: "😡", // Angry
    annoyance: "😑", // Annoyed
    disappointment: "😞", // Disappointed
    disapproval: "👎", // Disapproval
    disgust: "🤢", // Disgust
    embarrassment: "😳", // Embarrassed
    fear: "😨", // Afraid
    grief: "💔", // Grief
    nervousness: "😰", // Nervous
    remorse: "🥀", // Remorse
    sadness: "🌧️", // Sadness

    // Ambiguous / Cognitive
    confusion: "😵‍💫", // Confused
    curiosity: "🤔", // Curious
    realization: "💡", // Realization
    surprise: "😲", // Surprise
    neutral: "😶", // Neutral
  };

  // Fallback for unknown labels
  return emotionMap[label] || "🌀";
};

export const getLabelColor = (label: string): string => {
  // Optional: colors for charts or badges
  const colorMap: Record<string, string> = {
    love: "#FF4D4D", // Red
    joy: "#FFD700", // Gold
    sadness: "#536DFE", // Blue
    anger: "#FF3D00", // Orange
    fear: "#9C27B0", // Purple
    neutral: "#9E9E9E", // Gray
    optimism: "#00E676", // Bright green
    sad: "#64748b",
    disgust: "#a855f7",
    surprise: "#f97316",
    happy: "#10b981",
    happiness: "#10b981",
    anxiety: "#facc15",
    // Add more or rely on default
  };
  return colorMap[label] || "#607D8B"; // Default blue gray
};

export const extractDominantEmotion = (
  emotion?: { label: string; score: number }[] | null
) => {
  if (!Array.isArray(emotion) || !emotion.length) return null;
  return emotion.reduce((best, current) =>
    current.score > best.score ? current : best
  );
};