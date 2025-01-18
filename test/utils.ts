import { HTMLScriptElement, Window } from "happy-dom";

export const fakeWindowForScript = (scriptContent: string) => {
  const window = new Window();
  const document = window.document;
  const script = document.createElement("script");
  script.textContent = scriptContent;

  const appendScript = (scriptToAppend?: HTMLScriptElement) =>
    document.head.appendChild(scriptToAppend ?? script);

  return { window, document, script, appendScript };
};
