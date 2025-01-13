/// <reference types="npm:@types/workbox-sw" />
import type { Window as _Window } from "happy-dom";

declare global {
  const turnstile: {
    ready: (callback: () => void) => void;
    render: (callback: () => void) => void;
  };
}

declare module "happy-dom" {
  interface Window {
    importScripts: (url: string) => void;
    turnstile: {
      ready: (callback: () => void) => void;
      render: (callback: () => void) => void;
    };
    workbox: {
      setConfig: (config: Record<string | number | symbol, unknown>) => void;
      routing: {
        registerRoute: (
          callback: (context: Record<string, unknown>) => boolean,
          strategy: unknown,
        ) => void;
      };
      strategies: {
        CacheFirst: () => unknown;
      };
    };
  }
}
