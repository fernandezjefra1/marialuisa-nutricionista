export type AuditEventType =
  | "login_success"
  | "login_failed"
  | "login_google_initiated"
  | "login_mfa_success"
  | "login_mfa_failed"
  | "login_rate_limited"
  | "logout"
  | "mfa_enrolled"
  | "mfa_unenrolled";

export async function logEvent(
  eventType: AuditEventType,
  data?: {
    email?: string;
    userId?: string;
    metadata?: Record<string, unknown>;
  }
) {
  try {
    await fetch("/api/audit-log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event_type: eventType,
        email: data?.email ?? null,
        user_id: data?.userId ?? null,
        metadata: data?.metadata ?? {},
      }),
    });
  } catch {
    // No bloqueante — el log nunca debe interrumpir el flujo principal
  }
}
