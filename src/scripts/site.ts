// Page behaviour: current atlas station (effect 2), sticky call bar after the first screen (effect 4), mobile menu close.
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Effect 2: the station crossing the middle of the viewport becomes current (dot on the line + organ index).
const stations = Array.from(document.querySelectorAll<HTMLElement>("[data-station]"));
const indexLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>("[data-station-link]"));
if (stations.length && "IntersectionObserver" in window) {
  const setCurrent = (id: string) => {
    for (const s of stations) s.classList.toggle("is-current", s.id === id);
    for (const a of indexLinks) {
      const on = a.getAttribute("href") === `#${id}`;
      a.classList.toggle("is-current", on);
      if (on) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
    }
  };
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) setCurrent((e.target as HTMLElement).id);
  }, { rootMargin: "-42% 0px -52% 0px", threshold: 0 });
  stations.forEach((s) => io.observe(s));
  const atlas = document.getElementById("atlas");
  if (atlas) {
    new IntersectionObserver((entries) => {
      for (const e of entries) if (!e.isIntersecting) setCurrent("");
    }, { threshold: 0 }).observe(atlas);
  }
}

// Effect 4: call bar slides in once the first screen has left the viewport.
const hero = document.getElementById("hero");
if (hero && "IntersectionObserver" in window) {
  new IntersectionObserver((entries) => {
    for (const e of entries) document.body.classList.toggle("past-hero", !e.isIntersecting && e.boundingClientRect.top < 0);
  }, { rootMargin: "-80px 0px 0px 0px", threshold: 0 }).observe(hero);
}

// Mobile menu (a <details> element works without JS): close on link click and Escape.
const menu = document.querySelector<HTMLDetailsElement>("details.menu");
if (menu) {
  menu.addEventListener("click", (ev) => {
    if ((ev.target as HTMLElement).closest("a")) menu.open = false;
  });
  document.addEventListener("keydown", (ev) => {
    if (ev.key === "Escape" && menu.open) { menu.open = false; menu.querySelector("summary")?.focus(); }
  });
  window.matchMedia("(min-width: 64rem)").addEventListener("change", (m) => { if (m.matches) menu.open = false; });
}
void reduce;
