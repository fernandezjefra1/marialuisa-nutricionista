"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/lib/use-user";
import { createClient } from "@/lib/supabase";

export function useAdmin() {
  const { user, correo, loading: userLoading } = useUser();
  const [esAdmin, setEsAdmin] = useState(false);
  const [adminLoading, setAdminLoading] = useState(true);

  useEffect(() => {
    if (userLoading) return;

    let vigente = true;

    if (!user || !correo) {
      // Sin sesión no hay nada que consultar; se resuelve fuera del render sincrónico
      queueMicrotask(() => {
        if (!vigente) return;
        setEsAdmin(false);
        setAdminLoading(false);
      });
      return () => { vigente = false; };
    }

    const supabase = createClient();
    supabase
      .rpc("check_is_admin", { check_email: correo })
      .then(({ data }) => {
        if (!vigente) return;
        setEsAdmin(!!data);
        setAdminLoading(false);
      });

    return () => { vigente = false; };
  }, [user, correo, userLoading]);

  return { esAdmin, loading: userLoading || adminLoading, user };
}
