(function () {
  var S = window.SITE || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- helpers ---------- */
  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  function initials(name) {
    return (name || "?").split(/\s+/).map(function (w) { return w[0]; }).slice(0, 2).join("").toUpperCase();
  }

  /* ---------- projects ---------- */
  var grid = $("#projects");
  (S.projects || []).forEach(function (p) {
    var card = el("button", "card reveal");
    card.type = "button";
    card.dataset.type = p.type || "client";
    var img = el("div", "card__img");
    img.style.background = p.color || "#BFA6F6";
    if (p.image) {
      var im = new Image();
      im.src = p.image; im.alt = p.title + " screenshot"; im.loading = "lazy";
      img.appendChild(im);
    } else {
      img.appendChild(el("span", "card__ph", initials(p.title)));
    }
    var body = el("div", "card__body");
    body.appendChild(el("span", "tag", p.tag || ""));
    body.appendChild(el("h3", null, p.title));
    body.appendChild(el("p", null, p.summary || ""));
    body.appendChild(el("span", "card__more", "See more →"));
    card.appendChild(img); card.appendChild(body);
    card.addEventListener("click", function () { openModal(p); });
    grid.appendChild(card);
  });

  $$(".filters .chip").forEach(function (c) {
    c.addEventListener("click", function () {
      $$(".filters .chip").forEach(function (x) { x.classList.remove("is-on"); });
      c.classList.add("is-on");
      var f = c.dataset.filter;
      $$("#projects .card").forEach(function (card) {
        card.classList.toggle("hide", f !== "all" && card.dataset.type !== f);
      });
      if (window.ScrollTrigger) ScrollTrigger.refresh();
    });
  });

  /* ---------- modal ---------- */
  var modal = $("#modal"), lastFocus = null;
  function openModal(p) {
    lastFocus = document.activeElement;
    $("#mTag").textContent = p.tag || "";
    $("#mTitle").textContent = p.title;
    $("#mText").textContent = p.details || p.summary || "";
    var mi = $("#mImg"); mi.innerHTML = ""; mi.style.background = p.color || "#BFA6F6";
    if (p.image) { var im = new Image(); im.src = p.image; im.alt = p.title; mi.appendChild(im); }
    else mi.appendChild(el("span", "card__ph", initials(p.title)));
    var f = $("#mFeat"); f.innerHTML = "";
    (p.features || []).forEach(function (t) { f.appendChild(el("li", null, t)); });
    var l = $("#mLink");
    if (p.link) { l.href = p.link; l.hidden = false; } else l.hidden = true;
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    if (window.lenis) window.lenis.stop();
    $("#mClose").focus();
  }
  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = "";
    if (window.lenis) window.lenis.start();
    if (lastFocus) lastFocus.focus();
  }
  $("#mClose").addEventListener("click", closeModal);
  modal.addEventListener("click", function (e) { if (e.target === modal) closeModal(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !modal.hidden) closeModal(); });

  /* ---------- testimonials ---------- */
  var quotes = $("#quotes");
  (S.testimonials || []).forEach(function (t) {
    var q = el("figure", "quote reveal");
    q.appendChild(el("blockquote", null, t.quote));
    var who = el("figcaption", "who");
    if (t.photo) { var im = new Image(); im.src = t.photo; im.alt = t.name; im.loading = "lazy"; who.appendChild(im); }
    else who.appendChild(el("span", "av", initials(t.name)));
    var d = el("div");
    d.appendChild(el("b", null, t.name)); d.appendChild(el("span", null, t.role || ""));
    who.appendChild(d); q.appendChild(who);
    quotes.appendChild(q);
  });

  /* ---------- socials ---------- */
  var labels = { instagram: "Instagram", linkedin: "LinkedIn", facebook: "Facebook", tiktok: "TikTok", x: "X", youtube: "YouTube" };
  var soc = $("#socials");
  Object.keys(S.socials || {}).forEach(function (k) {
    if (!S.socials[k]) return;
    var a = el("a", null, labels[k] || k);
    a.href = S.socials[k]; a.target = "_blank"; a.rel = "noopener me";
    soc.appendChild(a);
  });
  $("#year").textContent = new Date().getFullYear();

  /* ---------- stats (hidden until real numbers are added in index.html) ---------- */
  var stats = $(".stats");
  var counters = $$("[data-count]");
  var hasStats = counters.some(function (c) { return +c.dataset.count > 0; });
  if (!hasStats) stats.hidden = true;

  /* ---------- Tawk.to live chat ---------- */
  if (S.tawk && S.tawk.propertyId && S.tawk.widgetId) {
    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://embed.tawk.to/" + S.tawk.propertyId + "/" + S.tawk.widgetId;
    s.charset = "UTF-8"; s.setAttribute("crossorigin", "*");
    document.head.appendChild(s);
  }

  /* ---------- budget slider ---------- */
  var USD = [0, 250, 500, 750, 1000, 1500, 2000, 2500, 3000, 4000, 5000, 6000, 7500, 10000, 12500, 15000, 17500, 20000, 25000, 30000, 50000];
  var RATE = { USD: 1, LKR: 300 };
  var SYM = { USD: "$", LKR: "Rs " };
  var cur = "USD";
  var range = $("#budget"), out = $("#budgetOut");
  function fmt(v) { return SYM[cur] + Math.round(v * RATE[cur]).toLocaleString("en-US"); }
  function paintBudget() {
    var i = +range.value, last = i === USD.length - 1;
    out.textContent = fmt(USD[i]) + (last ? "+" : "");
    $("#bMin").textContent = fmt(0);
    $("#bMax").textContent = fmt(USD[USD.length - 1]) + "+";
    var pct = (i / (USD.length - 1)) * 100;
    range.style.background = "linear-gradient(90deg,#6F32C5 " + pct + "%,rgba(23,16,24,.15) " + pct + "%) center/100% 6px no-repeat";
  }
  range.max = USD.length - 1; range.value = 4;
  range.addEventListener("input", paintBudget);
  $$(".seg button").forEach(function (b) {
    b.addEventListener("click", function () {
      $$(".seg button").forEach(function (x) { x.classList.remove("is-on"); });
      b.classList.add("is-on"); cur = b.dataset.cur; paintBudget();
    });
  });
  paintBudget();

  /* ---------- form ---------- */
  var form = $("#form"), msg = $("#formMsg"), btn = $("#submit");
  function say(t, ok) { msg.textContent = t; msg.className = "form__msg " + (ok ? "ok" : "bad"); }
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var f = form.elements, bad = false;
    ["name", "email", "message"].forEach(function (n) { f[n].classList.remove("err"); });
    if (!f.name.value.trim()) { f.name.classList.add("err"); bad = true; }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email.value.trim())) { f.email.classList.add("err"); bad = true; }
    if (!f.message.value.trim()) { f.message.classList.add("err"); bad = true; }
    if (bad) { say("Please fill in your name, a valid email and a short message.", false); return; }

    var i = +range.value;
    var payload = {
      name: f.name.value.trim(),
      email: f.email.value.trim(),
      company: f.company.value.trim(),
      phone: f.phone.value.trim(),
      needs: $$('input[name="needs"]:checked').map(function (c) { return c.value; }),
      budget: f.budgetFlexible.checked ? "Flexible, wants advice" : fmt(USD[i]) + (i === USD.length - 1 ? "+" : ""),
      currency: cur,
      timeline: f.timeline.value,
      message: f.message.value.trim(),
      website: f.website.value
    };
    btn.disabled = true; btn.textContent = "Sending...";
    say("", true);
    fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.ok, j: j }; }); })
      .then(function (res) {
        if (!res.ok) throw new Error(res.j.error || "fail");
        form.reset(); range.value = 4; paintBudget();
        say("Thanks! We got it and sent a confirmation to your email. We'll be in touch soon.", true);
      })
      .catch(function () { say("Something went wrong sending that. Please try again in a moment.", false); })
      .then(function () { btn.disabled = false; btn.textContent = "Send it over"; });
  });

  /* ---------- nav shadow ---------- */
  var nav = $("#nav");
  window.addEventListener("scroll", function () { nav.classList.toggle("scrolled", window.scrollY > 20); }, { passive: true });

  /* ---------- animations ---------- */
  if (!window.gsap || !window.ScrollTrigger || reduce) {
    document.documentElement.classList.remove("js");
    if (hasStats) counters.forEach(function (c) { c.textContent = (+c.dataset.count).toLocaleString() + "+"; });
    return;
  }
  gsap.registerPlugin(ScrollTrigger);

  // smooth scroll
  if (window.Lenis) {
    window.lenis = new Lenis({ lerp: 0.09 });
    window.lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(function (t) { window.lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
    $$('a[href^="#"]').forEach(function (a) {
      a.addEventListener("click", function (e) {
        var id = a.getAttribute("href");
        if (id.length > 1 && $(id)) { e.preventDefault(); window.lenis.scrollTo(id, { offset: -10 }); }
      });
    });
  }

  // hero intro
  gsap.set(".hero__title .line > span", { yPercent: 110 });
  gsap.timeline({ defaults: { ease: "power4.out" } })
    .to(".hero__title .line > span", { yPercent: 0, duration: 1.1, stagger: 0.12, delay: 0.15 })
    .to(".hero .reveal", { opacity: 1, y: 0, duration: 0.8, stagger: 0.12 }, "-=0.7")
    .from(".hero__logo", { scale: 0.7, rotate: -8, opacity: 0, duration: 1.1, ease: "elastic.out(1,.6)" }, "-=1");

  // scroll reveals (everything not already in the hero)
  $$(".reveal").forEach(function (n) {
    if (n.closest(".hero")) return;
    gsap.to(n, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: n, start: "top 88%", once: true } });
  });

  // parallax blobs
  $$("[data-speed]").forEach(function (n) {
    var sp = parseFloat(n.dataset.speed);
    gsap.to(n, { y: function () { return sp * 400; }, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
  });

  // counters
  counters.forEach(function (c) {
    var end = +c.dataset.count, o = { v: 0 };
    if (!end) return;
    gsap.to(o, { v: end, duration: 1.8, ease: "power2.out", scrollTrigger: { trigger: c, start: "top 90%", once: true },
      onUpdate: function () { c.textContent = Math.round(o.v).toLocaleString() + "+"; } });
  });

  // marquee speeds up with scroll
  var track = $(".marquee__track");
  ScrollTrigger.create({ onUpdate: function (s) {
    var v = Math.min(Math.abs(s.getVelocity()) / 1200, 3);
    track.style.animationDuration = (28 / (1 + v)) + "s";
  } });

  // magnetic buttons
  $$(".magnetic").forEach(function (b) {
    b.addEventListener("mousemove", function (e) {
      var r = b.getBoundingClientRect();
      gsap.to(b, { x: (e.clientX - r.left - r.width / 2) * 0.25, y: (e.clientY - r.top - r.height / 2) * 0.35, duration: 0.3 });
    });
    b.addEventListener("mouseleave", function () { gsap.to(b, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1,.4)" }); });
  });

  // card tilt
  $$("#projects .card").forEach(function (c) {
    c.addEventListener("mousemove", function (e) {
      var r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      gsap.to(c, { rotateY: x * 6, rotateX: -y * 6, transformPerspective: 900, duration: 0.4 });
    });
    c.addEventListener("mouseleave", function () { gsap.to(c, { rotateX: 0, rotateY: 0, duration: 0.6 }); });
  });

  // custom cursor
  var cur2 = $(".cursor");
  if (window.matchMedia("(hover:hover)").matches) {
    var qx = gsap.quickTo(cur2, "x", { duration: 0.25 }), qy = gsap.quickTo(cur2, "y", { duration: 0.25 });
    window.addEventListener("mousemove", function (e) { cur2.classList.add("on"); qx(e.clientX); qy(e.clientY); });
    document.addEventListener("mouseover", function (e) {
      cur2.classList.toggle("big", !!e.target.closest("a,button,.card,summary,.chip-check"));
    });
  }
})();
