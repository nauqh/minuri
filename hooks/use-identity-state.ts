"use client";

import { useCallback, useEffect, useState } from "react";
import {
  type IdentityStore,
  type JourneyIdentity,
  buildInitialCardState,
  applyDayEarn,
  loadIdentityStore,
  saveIdentityStore,
  clearIdentityStore,
} from "@/lib/journey/identity";

export function useIdentityState() {
  const [store, setStore] = useState<IdentityStore | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setStore(loadIdentityStore());
    setHydrated(true);
  }, []);

  const initIdentity = useCallback((identity: JourneyIdentity) => {
    const next: IdentityStore = {
      identity,
      cardState: buildInitialCardState(identity),
    };
    saveIdentityStore(next);
    setStore(next);
  }, []);

  const earnDay = useCallback(
    (day: number, memoryLine?: string) => {
      setStore((prev) => {
        if (!prev) return prev;
        const next: IdentityStore = {
          ...prev,
          cardState: applyDayEarn(prev.cardState, day, memoryLine),
        };
        saveIdentityStore(next);
        return next;
      });
    },
    [],
  );

  const clearIdentity = useCallback(() => {
    clearIdentityStore();
    setStore(null);
  }, []);

  return {
    store,
    hydrated,
    identity: store?.identity ?? null,
    cardState: store?.cardState ?? null,
    initIdentity,
    earnDay,
    clearIdentity,
  };
}
