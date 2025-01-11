(() => {
  const { currentScript } = document;
  if (!currentScript) return;

  const { marqueeObserverId, marqueeId, marqueeDupIdPrefix } =
    currentScript.dataset;
  if (!marqueeObserverId || !marqueeId || !marqueeDupIdPrefix) return;

  /** @type {HTMLDivElement} */
  const marquee = document.getElementById(marqueeId);

  /** @argument {IntersectionObserverEntry[]} entries */
  const callback = ([entry]) => {
    if (entry.isIntersecting) return;

    marquee.style.animation = "none";
    requestAnimationFrame(() =>
      setTimeout(() => marquee.removeAttribute("style"), 0)
    );
  };
  /** @type {IntersectionObserverInit} */
  const options = {
    root: document.getElementById(marqueeObserverId),
    rootMargin: "120px",
    threshold: 0,
  };

  const observer = new IntersectionObserver(callback, options);
  observer.observe(document.getElementById(`${marqueeDupIdPrefix}1`));
})();
