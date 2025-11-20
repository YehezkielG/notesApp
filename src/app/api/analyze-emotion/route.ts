import { NextResponse } from "next/server";
import { franc } from "franc-min";

const TRANSLATOR_API =
    "https://router.huggingface.co/hf-inference/models/Helsinki-NLP/opus-mt-mul-en";
const EMOTION_API =
    "https://router.huggingface.co/hf-inference/models/facebook/bart-large-mnli";

const HEADERS = {
    Authorization: `Bearer ${process.env.HUGGINGFACE_TOKEN}`,
    "Content-Type": "application/json",
};

function splitIntoSentences(text: string): string[] {
    return text
        .split(/(?<=[.!?])\s+/)
        .map((s) => s.trim())
        .filter(Boolean);
}

async function translateToEnIfNeeded(sentence: string): Promise<{
    translated: string;
    lang: string;
}> {
    const langCode = franc(sentence || "");
    const isEnglish = langCode === "eng";

    if (isEnglish) {
        return { translated: sentence, lang: langCode };
    }

    const res = await fetch(TRANSLATOR_API, {
        headers: HEADERS,
        method: "POST",
        body: JSON.stringify({ inputs: sentence }),
    });

    const data = await res.json();
    const translated = data?.[0]?.translation_text || sentence;

    return { translated, lang: langCode };
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { text } = body as { text?: string };

        if (!text || typeof text !== "string") {
            return NextResponse.json(
                { error: "text must be a non-empty string" },
                { status: 400 },
            );
        }

        const sentences = splitIntoSentences(text);
        if (sentences.length === 0) {
            return NextResponse.json(
                { error: "text must contain at least one sentence" },
                { status: 400 },
            );
        }

        const translatedParts = await Promise.all(
            sentences.map((s) => translateToEnIfNeeded(s)),
        );

        const normalizedText = translatedParts.map((p) => p.translated).join(" ");
        const detectedLangs = Array.from(
            new Set(translatedParts.map((p) => p.lang)),
        );

        const emotionRes = await fetch(EMOTION_API, {
            headers: HEADERS,
            method: "POST",
            body: JSON.stringify({
                inputs: normalizedText,
                parameters: {
                    candidate_labels: ["Happy", "Sad", "Angry", "Love", "Anxiety"],
                },
            }),
        });
        const emotionData = await emotionRes.json();
        const topEmotion = emotionData?.labels?.[0] ?? null;

        return NextResponse.json({
            original_langs: detectedLangs,
            normalized_text: normalizedText,
            emotion: topEmotion,
            raw: emotionData,
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
