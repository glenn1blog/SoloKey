"use client";

import { useEffect } from "react";
import type { TPitchFrame } from "@solokey/shared";
import { useSoloKeyStore } from "../hooks/useSoloKeyStore.js";

interface SingBootstrapProps {
  reference: readonly TPitchFrame[];
  actual: readonly TPitchFrame[];
}

export function SingBootstrap({ reference, actual }: SingBootstrapProps) {
  const setReference = useSoloKeyStore((state) => state.setReference);
  const setActual = useSoloKeyStore((state) => state.setActual);

  useEffect(() => {
    setReference(reference);
    setActual(actual);
  }, [reference, actual, setReference, setActual]);

  return null;
}
