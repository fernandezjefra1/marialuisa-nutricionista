// El rate limiting de intentos de login se aplica en el servidor:
// app/api/auth/login/route.ts — consulta la tabla audit_logs en Supabase por IP.

/** Devuelve los segundos restantes de bloqueo (0 si no está bloqueado) */
export function getSecondsRemaining(lockedUntil: number | null): number {
  if (!lockedUntil) return 0;
  return Math.max(0, Math.ceil((lockedUntil - Date.now()) / 1000));
}
