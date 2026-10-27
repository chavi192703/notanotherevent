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
  function initials(name, mark) {
    if (mark) return mark;
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
      img.appendChild(el("span", "card__ph", initials(p.title, p.mark)));
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
    else mi.appendChild(el("span", "card__ph", initials(p.title, p.mark)));
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

  /* ---------- phone country codes ---------- */
  function flag(iso) {
    if (iso.length !== 2 || iso === "XK") return "";
    return String.fromCodePoint(0x1F1E6 + iso.charCodeAt(0) - 65, 0x1F1E6 + iso.charCodeAt(1) - 65) + " ";
  }
  var dial = $("#dial"), region = "US";
  try { var mm = (navigator.language || "en-US").match(/-([A-Za-z]{2})$/); if (mm) region = mm[1].toUpperCase(); } catch (e) {}
  (window.COUNTRIES || []).forEach(function (c) {
    var o = document.createElement("option");
    o.value = c.dial; o.dataset.iso = c.iso;
    o.textContent = flag(c.iso) + "+" + c.dial + "  " + c.name;
    o.dataset.short = flag(c.iso) + "+" + c.dial;
    if (c.iso === region) o.selected = true;
    dial.appendChild(o);
  });
  // closed select shows just flag + code; the open list shows country names
  function shortLabel() { $$("option", dial).forEach(function (o) { o.textContent = o.selected && document.activeElement !== dial ? o.dataset.short : o.dataset.short + "  " + o.dataset.name; }); }
  $$("option", dial).forEach(function (o) { o.dataset.name = o.textContent.replace(/^.*?\+\d+\s+/, ""); });
  dial.addEventListener("focus", shortLabel); dial.addEventListener("blur", shortLabel); dial.addEventListener("change", function () { dial.blur(); });
  shortLabel();

  /* ---------- budget (USD): slider + manual amount ---------- */
  var USD = [0, 250, 500, 750, 1000, 1500, 2000, 2500, 3000, 4000, 5000, 6000, 7500, 10000, 12500, 15000, 17500, 20000, 25000, 30000, 50000];
  var range = $("#budget"), amt = $("#budgetInput");
  range.max = USD.length - 1;
  function paintRange() {
    var pct = (+range.value / (USD.length - 1)) * 100;
    range.style.background = "linear-gradient(90deg,#6F32C5 " + pct + "%,rgba(23,16,24,.15) " + pct + "%) center/100% 6px no-repeat";
  }
  function parseAmt() { var n = parseInt(String(amt.value).replace(/[^0-9]/g, ""), 10); return isNaN(n) ? null : n; }
  function nearest(v) {
    var best = 0;
    USD.forEach(function (x, i) { if (Math.abs(x - v) < Math.abs(USD[best] - v)) best = i; });
    return best;
  }
  range.addEventListener("input", function () {
    amt.value = USD[+range.value].toLocaleString("en-US") + (+range.value === USD.length - 1 ? "+" : "");
    paintRange();
  });
  amt.addEventListener("input", function () {
    var n = parseAmt();
    amt.value = n == null ? "" : n.toLocaleString("en-US");
    if (n != null) range.value = nearest(n);
    paintRange();
  });
  range.value = 5; amt.value = USD[5].toLocaleString("en-US"); paintRange();

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

    var n = parseAmt();
    var budget = f.budgetFlexible.checked ? "Flexible, wants advice" : (n == null ? "Not specified" : "$" + n.toLocaleString("en-US") + " USD" + (/\+$/.test(amt.value) ? "+" : ""));
    var digits = f.phone.value.replace(/[^\d]/g, "");
    var payload = {
      name: f.name.value.trim(),
      email: f.email.value.trim(),
      company: f.company.value.trim(),
      phone: digits ? "+" + dial.value + " " + f.phone.value.trim() : "",
      needs: $$('input[name="needs"]:checked').map(function (c) { return c.value; }),
      budget: budget,
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
        form.reset(); range.value = 5; amt.value = USD[5].toLocaleString("en-US"); paintRange();
        say("Thanks! We got it and sent a confirmation to your email. We'll be in touch soon.", true);
      })
      .catch(function () { say("Something went wrong sending that. Please try again in a moment.", false); })
      .then(function () { btn.disabled = false; btn.textContent = "Send it over"; });
  });

  /* ---------- Natey's eyes follow the pointer ---------- */
  (function () {
    var eyes = $$(".eye");
    if (!eyes.length) return;
    var rest = { x: 0.3, y: -0.3 }, target = null, state = eyes.map(function () { return { x: rest.x, y: rest.y }; });
    function point(e) { var t = e.touches && e.touches[0] ? e.touches[0] : e; target = { x: t.clientX, y: t.clientY }; }
    window.addEventListener("pointermove", point, { passive: true });
    window.addEventListener("touchmove", point, { passive: true });
    document.addEventListener("mouseleave", function () { target = null; });
    function tick() {
      eyes.forEach(function (eye, i) {
        var r = eye.getBoundingClientRect(), p = eye.firstElementChild;
        var goal = rest;
        if (target) {
          var dx = target.x - (r.left + r.width / 2), dy = target.y - (r.top + r.height / 2);
          var d = Math.hypot(dx, dy) || 1, k = Math.min(1, d / (r.width * 1.2));
          goal = { x: (dx / d) * k, y: (dy / d) * k };
        }
        var s = state[i]; s.x += (goal.x - s.x) * 0.2; s.y += (goal.y - s.y) * 0.2;
        var max = r.width * 0.2;   // how far the pupil may travel from centre
        p.style.transform = "translate(" + (s.x * max).toFixed(1) + "px," + (s.y * max).toFixed(1) + "px)";
      });
      requestAnimationFrame(tick);
    }
    tick();
  })();

  /* ---------- mobile menu ---------- */
  var navEl = $("#nav"), burger = $("#burger");
  function menu(open) { navEl.classList.toggle("nav--open", open); burger.setAttribute("aria-expanded", open ? "true" : "false"); }
  burger.addEventListener("click", function () { menu(!navEl.classList.contains("nav--open")); });
  $$("#menu a").forEach(function (a) { a.addEventListener("click", function () { menu(false); }); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") menu(false); });
  document.addEventListener("click", function (e) { if (!e.target.closest("#nav")) menu(false); });

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
        if (id.length > 1 && $(id)) { e.preventDefault(); window.lenis.scrollTo(id, { offset: id === "#top" ? 0 : -84 }); }
      });
    });
  }

  // hero intro
  gsap.set(".hero__title .line > span", { yPercent: 110 });
  gsap.timeline({ defaults: { ease: "power4.out" } })
    .to(".hero__title .line > span", { yPercent: 0, duration: 1.1, stagger: 0.12, delay: 0.15 })
    .to(".hero .reveal", { opacity: 1, y: 0, duration: 0.8, stagger: 0.12 }, "-=0.7")
    .from(".mascot__frame", { scale: 0.8, rotate: -6, opacity: 0, duration: 1.1, ease: "elastic.out(1,.6)" }, "-=1")
    .add(function () { $$(".hero__title .line").forEach(function (l) { l.style.overflow = "visible"; }); });

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
