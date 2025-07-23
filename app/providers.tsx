// app/providers.tsx
"use client";

import { SessionProvider } from "next-auth/react";
import { FavoritesProvider } from "./contexts/FavoritesContext";
import ClientOnly from "@/components/ClientOnly";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <ClientOnly>
      <SessionProvider>
        <FavoritesProvider>
          {children}
        </FavoritesProvider>
      </SessionProvider>
    </ClientOnly>
  );
}