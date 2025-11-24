export function validateUsername(value: unknown): string | null {
  if (!value || typeof value !== "string" || !value.trim()) {
    return "Username is required.";
  }
  const v = value.trim();
  if (v.length < 3 || v.length > 30) {
    return "Username must be between 3 and 30 characters.";
  }
  // Only allow lowercase letters, numbers, dot, underscore, hyphen
  if (!/^[a-z0-9._-]+$/.test(v)) {
    return "Username can only contain lowercase letters, numbers, dots, underscores, and hyphens.";
  }
  return null;
}

export function validateDisplayName(value: unknown): string | null {
  if (!value || typeof value !== "string" || !value.trim()) {
    return "Display Name is required.";
  }
  const v = value.trim();
  if (v.length > 50) {
    return "Display Name must be 50 characters or fewer.";
  }
  // Only allow alphabets (upper and lower case)
  if (!/^[a-zA-Z\s]+$/.test(v)) {
    return "Display Name can only contain alphabets and spaces.";
  }
  return null;
}

export function validateBio(value: unknown): string | null {
  if (value === undefined || value === null || value === "") return null;
  if (typeof value !== "string") return "Invalid bio.";
  if (value.length > 160) return "Bio must be 160 characters or fewer.";
  return null;
}

export function validateGender(value: unknown): string | null {
  if (value === undefined || value === null || value === "") return null;
  if (typeof value !== "string") return "Invalid gender.";
  const allowed = new Set(["male", "female", "-"]);
  if (!allowed.has(value)) return "Invalid gender selection.";
  return null;
}

export function validateOnboarding(payload: {
  username?: unknown;
  displayName?: unknown;
  gender?: unknown;
  bio?: unknown;
}): string | null {
  return (
    validateUsername(payload.username) ||
    validateDisplayName(payload.displayName) ||
    validateGender(payload.gender) ||
    validateBio(payload.bio) ||
    null
  );
}

export function validateEmail(value: unknown): string | null {
    if (!value || typeof value !== "string" || !value.trim()) {
        return "Email is required.";
    }
    const v = value.trim();
    // Simple email regex for basic validation
    if (
        !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(v)
    ) {
        return "Invalid email address.";
    }
    return null;
}