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
    turnstile: {
      ready: (callback: () => void) => void;
      render: (callback: () => void) => void;
    };
  }
}
