(() => {
  const { currentScript } = document;
  if (currentScript) {
    turnstile.ready(() =>
      turnstile.render("#contact-form-turnstile", {
        sitekey: currentScript.getAttribute("siteKey"),
        callback: () => console.log("Challenge success"),
      })
    );
  }
})();
