"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  FileText,
  Globe2,
  Lock,
  Loader2,
  Maximize2,
  Minimize2,
  Save,
  RotateCcw,
  Copy,
  Trash2,
} from "lucide-react";

const LOCAL_DRAFT_KEY = "new-note-draft";

export default function NewNotePage() {
}