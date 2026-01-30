"use client";
import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";

export default function AuthHydration() {
  const hydrate = useAuthStore((state) => state.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return null;
}
