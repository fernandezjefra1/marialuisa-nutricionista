"use client";

import { createClient } from "@/lib/supabase";

export async function adminFetch(path: string, options?: RequestInit): Promise<Response> {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  return fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
      ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
    },
  });
}
