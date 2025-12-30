"use client";

import { useEffect } from "react";

export function ServiceWorkerRegister() {
  useEffect(() => {
    // Verifica se o navegador suporta Service Workers
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => console.log("SW registrado:", registration.scope))
        .catch((err) => console.error("Erro ao registrar SW:", err));
    }
  }, []);

  return null; // Esse componente não desenha nada na tela
}