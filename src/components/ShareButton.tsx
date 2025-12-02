"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Share2, CheckCircle2, X } from "lucide-react";
import Portal from "@/components/Portal";

type Props = {
  path: string; // e.g. `/note/123`
  label?: string;
  className?: string;
};

export default function ShareButton({ path, label = "Share", className = "" }: Props) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const absoluteUrl = useMemo(() => {
    if (typeof window === "undefined") return path;
    try {
      const url = new URL(path, window.location.origin);
      return url.toString();
    } catch {
      return path;
    }
  }, [path]);

  const copyToClipboard = useCallback(async () => {
    const text = absoluteUrl;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setCopied(true);
      setOpen(true);
    } catch {
      setCopied(false);
      setOpen(true);
    }
  }, [absoluteUrl]);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => setOpen(false), 1500);
    return () => clearTimeout(t);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={copyToClipboard}
        className={`inline-flex items-center gap-2 hover:text-indigo-600 transition-colors group ${className}`}
        aria-label="Copy share link"
      >
        <Share2 size={18} className="group-hover:scale-110 transition-transform" />
        <span className="text-sm font-medium">{label}</span>
      </button>

      {open && (
        <Portal>
          <div className="fixed inset-0 z-50 flex items-end justify-center pointer-events-none">
            <div className="mb-6 px-4 w-full flex justify-center">
              <div
                className="pointer-events-auto flex items-center gap-2 rounded-lg border border-gray-200 bg-white/95 shadow-lg px-3 py-2 text-sm text-gray-800 max-w-sm"
                role="status"
                aria-live="polite"
              >
                {copied ? (
                  <CheckCircle2 className="text-green-600" size={18} />
                ) : (
                  <X className="text-red-600" size={18} />
                )}
                <div className="truncate">
                  {copied ? "Link copied" : "Failed to copy"}
                </div>
              </div>
            </div>
          </div>
        </Portal>
      )}
    </>
  );
}
