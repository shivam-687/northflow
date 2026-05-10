"use client";

import { useEffect } from "react";

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;

    const register = async () => {
      try {
        // In development, skip service worker to avoid cache issues
        if (process.env.NODE_ENV === "development") {
          console.log("[SW] Skipped in development mode");
          return;
        }

        // Unregister any old service workers to clear broken caches
        const existing = await navigator.serviceWorker.getRegistrations();
        for (const reg of existing) {
          try {
            await reg.unregister();
            console.log("[SW] Unregistered old service worker");
          } catch {
            // Ignore unregister errors
          }
        }

        // Register the new service worker
        const registration = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
        });

        console.log("[SW] Registered:", registration.scope);

        // Listen for updates
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener("statechange", () => {
              if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                console.log("[SW] New version available, reloading...");
                window.location.reload();
              }
            });
          }
        });
      } catch (err) {
        console.error("[SW] Registration failed:", err);
      }
    };

    register();
  }, []);

  return null;
}
