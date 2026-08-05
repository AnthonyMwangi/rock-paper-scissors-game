const USERNAME_MIN_LENGTH = 3;
const USERNAME_MAX_LENGTH = 20;
const USERNAME_PATTERN = /^[a-zA-Z0-9_-]+$/;

export type UsernameInvalidReason =
  "empty" | "too_short" | "too_long" | "invalid_characters";

type UsernameValidationResult =
  | { valid: true }
  | {
      valid: false;
      reason: UsernameInvalidReason;
    };

export const USERNAME_ERROR_MESSAGES: Record<UsernameInvalidReason, string> = {
  empty: "Please enter a username",
  too_short: `Username must be at least ${USERNAME_MIN_LENGTH} characters`,
  too_long: `Username must be ${USERNAME_MAX_LENGTH} characters or fewer`,
  invalid_characters:
    "Only letters, numbers, underscores, and hyphens are allowed",
};

export function validateUsername(raw: string): UsernameValidationResult {
  const trimmed = raw.trim();

  if (trimmed.length === 0) {
    return { valid: false, reason: "empty" };
  }

  if (trimmed.length < USERNAME_MIN_LENGTH) {
    return { valid: false, reason: "too_short" };
  }

  if (trimmed.length > USERNAME_MAX_LENGTH) {
    return { valid: false, reason: "too_long" };
  }

  if (!USERNAME_PATTERN.test(trimmed)) {
    return { valid: false, reason: "invalid_characters" };
  }

  return { valid: true };
}
