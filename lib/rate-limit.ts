const STORAGE_KEY = "ml_login_attempts";
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;  // ventana de 15 min
const LOCKOUT_MS = 15 * 60 * 1000; // bloqueo de 15 min

interface AttemptRecord {
  timestamps: number[];
  lockedUntil: number | null;
}

function getRecord(): AttemptRecord {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { timestamps: [], lockedUntil: null };
    return JSON.parse(raw) as AttemptRecord;
  } catch {
    return { timestamps: [], lockedUntil: null };
  }
}

function saveRecord(record: AttemptRecord) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
}

export function checkRateLimit(): {
  allowed: boolean;
  lockedUntil: number | null;
  attemptsLeft: number;
} {
  const now = Date.now();
  const record = getRecord();

  if (record.lockedUntil && now < record.lockedUntil) {
    return { allowed: false, lockedUntil: record.lockedUntil, attemptsLeft: 0 };
  }

  const recent = record.timestamps.filter((t) => now - t < WINDOW_MS);

  if (recent.length >= MAX_ATTEMPTS) {
    const lockedUntil = now + LOCKOUT_MS;
    saveRecord({ timestamps: recent, lockedUntil });
    return { allowed: false, lockedUntil, attemptsLeft: 0 };
  }

  return {
    allowed: true,
    lockedUntil: null,
    attemptsLeft: MAX_ATTEMPTS - recent.length,
  };
}

export function recordFailedAttempt() {
  const now = Date.now();
  const record = getRecord();
  const recent = record.timestamps.filter((t) => now - t < WINDOW_MS);
  recent.push(now);

  const lockedUntil =
    recent.length >= MAX_ATTEMPTS ? now + LOCKOUT_MS : record.lockedUntil;
  saveRecord({ timestamps: recent, lockedUntil });
}

export function clearAttempts() {
  localStorage.removeItem(STORAGE_KEY);
}

/** Devuelve los segundos restantes de bloqueo (0 si no está bloqueado) */
export function getSecondsRemaining(lockedUntil: number | null): number {
  if (!lockedUntil) return 0;
  return Math.max(0, Math.ceil((lockedUntil - Date.now()) / 1000));
}
