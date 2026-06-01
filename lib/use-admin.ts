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

    if (!user || !correo) {
      setEsAdmin(false);
      setAdminLoading(false);
      return;
    }

    const supabase = createClient();
    supabase
      .rpc("check_is_admin", { check_email: correo })
      .then(({ data }) => {
        setEsAdmin(!!data);
        setAdminLoading(false);
      });
  }, [user, correo, userLoading]);

  return { esAdmin, loading: userLoading || adminLoading, user };
}
