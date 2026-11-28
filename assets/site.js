(() => {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const nav = document.querySelector(".nav");
  const onScrollNav = () => nav && nav.classList.toggle("is-scrolled", scrollY > 8);
  addEventListener("scroll", onScrollNav, { passive: true }); onScrollNav();

  const toggle = document.querySelector(".nav-toggle");
  const panel = document.getElementById("nav-menu");
  if (toggle && panel && nav) {
    const setOpen = (open) => {
      nav.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Menu");
      panel.setAttribute("aria-hidden", open ? "false" : "true");
      if (open) panel.removeAttribute("inert");
      else panel.setAttribute("inert", "");
    };
    toggle.addEventListener("click", () => setOpen(toggle.getAttribute("aria-expanded") !== "true"));
    panel.addEventListener("click", (e) => { if (e.target.closest("a")) setOpen(false); });
    document.addEventListener("click", (e) => {
      if (toggle.getAttribute("aria-expanded") === "true" && !e.target.closest(".nav")) setOpen(false);
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setOpen(false);
        toggle.focus();
      }
    });
    addEventListener("resize", () => {
      if (innerWidth > 720 && toggle.getAttribute("aria-expanded") === "true") setOpen(false);
    });
  }

  // hero entrance
  const hero = document.querySelector(".hero");
  if (hero) requestAnimationFrame(() => requestAnimationFrame(() => hero.classList.add("is-ready")));

  // scroll reveals
  const els = document.querySelectorAll("[data-reveal]");
  if (reduce || !("IntersectionObserver" in window)) els.forEach(e => e.classList.add("in"));
  else {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    els.forEach(e => io.observe(e));
  }

  // approval chip: label, draft, wait, approved. Ends on the approved state and stays there.
  const chip = document.querySelector(".chip ol");
  if (chip) {
    const items = [...chip.children];
    const finish = () => { items.forEach(li => { li.classList.remove("wait"); li.classList.add("done"); }); items[items.length - 1].classList.add("ok"); };
    if (reduce) finish();
    else {
      items.forEach(li => li.classList.remove("done", "ok"));
      const t0 = 1500;
      setTimeout(() => items[0].classList.add("done"), t0);
      setTimeout(() => items[1].classList.add("done"), t0 + 700);
      setTimeout(() => items[2].classList.add("wait"), t0 + 1300);
      setTimeout(finish, t0 + 3100);
    }
  }

  // light parallax on the hero portrait planes
  const pars = [...document.querySelectorAll(".par")];
  if (pars.length && !reduce) {
    let ticking = false;
    const run = () => {
      ticking = false;
      const y = Math.min(scrollY, innerHeight);
      pars.forEach(el => { el.style.translate = `0 ${(y * parseFloat(el.dataset.speed || 0)).toFixed(1)}px`; });
    };
    addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(run); } }, { passive: true });
  }

  // project page: Challenge / Actions / Results rail
  const rail = document.querySelector(".rail");
  if (rail) {
    const links = [...rail.querySelectorAll("a")];
    const parts = links.map(a => document.querySelector(a.getAttribute("href")));
    const story = document.querySelector(".story");
    const bar = rail.querySelector(".bar");
    let ticking = false;
    const run = () => {
      ticking = false;
      const mid = innerHeight * 0.4;
      let on = 0;
      parts.forEach((p, i) => { if (p && p.getBoundingClientRect().top < mid) on = i; });
      links.forEach((a, i) => a.classList.toggle("on", i === on));
      const r = story.getBoundingClientRect();
      const p = Math.max(0, Math.min(1, (mid - r.top) / (r.height - innerHeight * 0.3)));
      bar.style.setProperty("--p", p.toFixed(3));
    };
    addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(run); } }, { passive: true });
    run();
  }
})();
