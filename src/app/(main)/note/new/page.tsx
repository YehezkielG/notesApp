"use client";
import { useEffect, useState } from "react";
import TextEditor from "@/components/TextEditor";
import { getEmojiForLabel, getLabelColor } from "@/lib/utils/emotionMapping";

export default function NewNotePage() {
  const [labelEmotion, setLabelEmotion] = useState<
    Array<{ label: string; score: number }>
  >([]);

  useEffect(() => {}, [labelEmotion]);

  return (
    <>
      <TextEditor analyzeEmotion={setLabelEmotion} />
      {labelEmotion.length > 0 && (
        <div className="space-y-3 mt-4 w-full">
          {labelEmotion.map((item: { label: string; score: number }) => (
            <div key={item.label} className="group">
              {/* Label & Persentase */}
              <div className="flex justify-between text-sm mb-1 text-gray-300">
                <span className="flex items-center gap-2 font-medium capitalize">
                  <span>{getEmojiForLabel(item.label)}</span> {item.label}
                </span>
                <span className="font-mono text-xs text-gray-500">
                  {(item.score * 100).toFixed(1)}%
                </span>
              </div>

              {/* The Bar Background */}
              <div className="w-full bg-gray-800 rounded-full h-2.5 overflow-hidden">
                {/* The Bar Value (Animated) */}
                <div
                  className="h-2.5 rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${item.score * 100}%`,
                    backgroundColor: getLabelColor(item.label) 
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
