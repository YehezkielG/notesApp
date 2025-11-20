"use client";
import { useState } from "react";

export default function Form() {
    const [text, setText] = useState("");
    const [result, setResult] = useState<string | null>(null);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const res = await fetch("/api/AI-Test", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text }),
        });
        const data = await res.json();
        setResult(data.distribution);
        console.log(data);
    }


    return (
        <div className="mx-auto max-w-xl rounded-xl border border-slate-200 bg-white p-6 shadow">
            <h1 className="mb-4 text-xl font-semibold text-slate-900">Emotion Analyzer</h1>
            <form method="post" onSubmit={handleSubmit} className="space-y-4">
                <textarea
                    name="content"
                    placeholder="Enter your text..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="w-full rounded-md border border-slate-300 p-3 text-slate-800 focus:border-blue-500 focus:outline-none"
                    rows={5}
                />
                <button
                    type="submit"
                    className="w-full rounded-md bg-blue-600 py-2 text-white transition hover:bg-blue-700"
                >
                    Analyze Emotion
                </button>
            </form>
            {result && (
                <p className="mt-6 rounded-md bg-slate-100 p-4 text-slate-800">
                    Emotion: <span className="font-semibold">{result}</span>
                </p>
            )}
        </div>
    );
}