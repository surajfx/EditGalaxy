/*! EditGalaxy shared footer + cookie banner (v35)
 *  Adds the same footer to every static page (About, Contact, template/prompt/c pages ...).
 *  Social icons + footer text are read live from Firebase (settings/home) so the admin
 *  "Home Page" tab controls them everywhere; built-in defaults are used if that fails. */
(function () {
  if (window.__egFooter) return; window.__egFooter = 1;
  var DB = "https://template-cc1cb-default-rtdb.firebaseio.com/settings/home.json";
  var DEF_DESC = "Free CapCut templates and ready-to-copy AI image prompts for creators.";
  var DEF_SOC = [
    { platform: "instagram", label: "Instagram", url: "https://www.instagram.com/trending_edit_day/" },
    { platform: "telegram", label: "Telegram", url: "https://t.me/trending_edit_day" },
    { platform: "whatsapp", label: "WhatsApp", url: "https://whatsapp.com/channel/0029Vb8LDSC7z4kcrtFkae2k" },
    { platform: "youtube", label: "YouTube", url: "https://youtube.com/@surajfx2.0" },
    { platform: "tiktok", label: "TikTok", url: "https://www.tiktok.com/@trending_edit_day" },
    { platform: "facebook", label: "Facebook", url: "https://www.facebook.com/profile.php?id=61565474049934" },
    { platform: "threads", label: "Threads", url: "https://www.threads.com/@trending_edit_day" }
  ];
  var ICONS = {
    instagram: '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none"/></svg>',
    telegram: '<svg viewBox="0 0 24 24"><path d="M21 4 3 11l5.5 2L10 19l3-4 5 4z"/><path d="m8.5 13 9-6"/></svg>',
    whatsapp: '<svg viewBox="0 0 24 24"><path d="M4 20l1.3-4.2A8 8 0 1 1 8.4 18.8z"/><path d="M9.2 9c0 3 2.8 5.8 5.8 5.8l1.2-1.5-2-1-1 .8c-1-.4-1.8-1.2-2.2-2.2l.8-1-1-2z"/></svg>',
    youtube: '<svg viewBox="0 0 24 24"><rect x="2.5" y="5.5" width="19" height="13" rx="4"/><path d="M10 9.5v5l4.5-2.5z" fill="currentColor" stroke="none"/></svg>',
    facebook: "f", x: "\uD835\uDD4F", tiktok: "\u266A", threads: "@", linkedin: "in", link: "\u2197"
  };
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function ok(u) { return /^https?:\/\//i.test(String(u || "")); }
  var css = ".sfoot{border-top:1px solid var(--line,rgba(255,255,255,.14));margin-top:34px;padding:34px 16px 120px;background:rgba(0,0,0,.18);color:var(--text,#fff);font-family:inherit}" +
    ".sfootIn{max-width:1180px;margin:auto}.sfootBrand .logo{font-size:26px;font-weight:900;color:inherit;text-decoration:none;letter-spacing:-1px}.sfootBrand .logo span{color:var(--accent,#8bdcff)}" +
    ".sfootBrand p{color:var(--muted,#b7bcd6);max-width:520px;line-height:1.6;margin:10px 0 14px}" +
    ".socialIcons{display:flex;flex-wrap:wrap;gap:10px}.sicon{width:48px;height:48px;border-radius:14px;display:grid;place-items:center;border:1px solid var(--line,rgba(255,255,255,.14));background:var(--panel2,rgba(255,255,255,.08));color:inherit;text-decoration:none;font-weight:900;font-size:15px}" +
    ".sicon svg{width:22px;height:22px;fill:none;stroke:currentColor;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round}.sicon:hover{border-color:rgba(139,220,255,.5);color:var(--accent,#8bdcff)}" +
    ".sfootCols{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;margin:28px 0 20px}.sfootCols h4{margin:0 0 12px;font-size:13px;letter-spacing:2px;text-transform:uppercase;color:var(--muted,#b7bcd6)}" +
    ".sfootCols a{display:block;color:inherit;text-decoration:none;font-weight:600;margin:0 0 11px;font-size:15px}.sfootCols a:hover{color:var(--accent,#8bdcff)}" +
    ".sfootNote{color:var(--muted,#b7bcd6);font-size:12px;line-height:1.6;border-top:1px solid var(--line,rgba(255,255,255,.14));padding-top:14px;margin:0}" +
    ".cookieBar{position:fixed;left:12px;right:12px;bottom:14px;z-index:300;display:none;max-width:560px;margin:auto;padding:14px 16px;border-radius:18px;background:rgba(14,16,28,.97);border:1px solid rgba(255,255,255,.14);box-shadow:0 18px 50px rgba(0,0,0,.5);color:#fff;font-family:inherit}" +
    ".cookieBar.show{display:block}.cookieBar p{margin:0 0 12px;font-size:14px;line-height:1.55;color:#fff}.cookieBar a{color:#a99bff}.cookieBtns{display:flex;gap:10px}" +
    ".cbtn{padding:11px 20px;border-radius:12px;border:1px solid rgba(255,255,255,.2);background:transparent;color:#fff;font-weight:800;cursor:pointer;font-family:inherit}.cbtn.cacc{background:#7f77f7;border-color:#7f77f7}" +
    "@media(max-width:700px){.sfootCols{grid-template-columns:1fr 1fr}}";
  var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  function icons(list) {
    return list.map(function (x) {
      var ic = ICONS[x.platform] || ICONS.link;
      return '<a class="sicon" href="' + esc(x.url) + '" target="_blank" rel="noopener" aria-label="' + esc(x.label) + '" title="' + esc(x.label) + '">' + ic + "</a>";
    }).join("");
  }
  var host = document.getElementById("sfootHost");
  if (!host) { host = document.createElement("footer"); host.id = "sfootHost"; document.body.appendChild(host); }
  host.className = "sfoot";
  host.innerHTML =
    '<div class="sfootIn"><div class="sfootBrand"><a class="logo" href="/">Edit<span>Galaxy</span></a><p id="egFootDesc">' + esc(DEF_DESC) + '</p><div class="socialIcons" id="egFootSoc">' + icons(DEF_SOC) + "</div></div>" +
    '<div class="sfootCols"><div><h4>Browse</h4><a href="/#templates">Templates</a><a href="/#prompts">Prompts</a><a href="/#explore">Explore</a></div>' +
    '<div><h4>Site</h4><a href="/about.html">About</a><a href="/contact.html">Contact</a><a href="/team.html">Team</a><a href="/trust.html">Trust &amp; Safety</a></div>' +
    '<div><h4>Legal</h4><a href="/terms.html">Terms of Use</a><a href="/privacy.html">Privacy Policy</a><a href="/copyright.html">Copyright</a><a href="#" id="egCookieLink">Cookie settings</a></div></div>' +
    '<p class="sfootNote">EditGalaxy is an independent template and creative-resource website and is not affiliated with or endorsed by CapCut or other third-party services. Third-party trademarks belong to their respective owners.</p></div>';

  /* cookie banner */
  var bar = document.getElementById("cookieBar");
  if (!bar) {
    bar = document.createElement("div"); bar.id = "cookieBar"; bar.className = "cookieBar"; bar.setAttribute("role", "dialog");
    bar.innerHTML = '<p>We use cookies for analytics and advertising to improve your experience. <a href="/privacy.html">Privacy Policy</a>.</p><div class="cookieBtns"><button type="button" class="cbtn" data-c="reject">Reject</button><button type="button" class="cbtn cacc" data-c="accept">Accept</button></div>';
    document.body.appendChild(bar);
    bar.addEventListener("click", function (e) {
      var v = e.target && e.target.getAttribute && e.target.getAttribute("data-c"); if (!v) return;
      try { localStorage.setItem("eg_cookie", v); } catch (x) {}
      bar.classList.remove("show");
      try { (window.adsbygoogle = window.adsbygoogle || []).requestNonPersonalizedAds = (v === "reject" ? 1 : 0); } catch (x) {}
    });
    try { if (!localStorage.getItem("eg_cookie")) setTimeout(function () { bar.classList.add("show"); }, 900); } catch (x) {}
  }
  document.getElementById("egCookieLink").addEventListener("click", function (e) { e.preventDefault(); bar.classList.add("show"); });

  /* live socials + text from admin (Firebase REST, public read) */
  try {
    var ctl = ("AbortController" in window) ? new AbortController() : null;
    var timer = setTimeout(function () { if (ctl) ctl.abort(); }, 5000);
    fetch(DB, ctl ? { signal: ctl.signal } : {}).then(function (r) { return r.ok ? r.json() : null; }).then(function (d) {
      clearTimeout(timer); if (!d) return;
      if (d.footDesc) document.getElementById("egFootDesc").textContent = String(d.footDesc);
      var raw = Array.isArray(d.social) ? d.social : (d.social && typeof d.social === "object" ? Object.keys(d.social).map(function (k) { return d.social[k]; }) : []);
      var list = raw.filter(function (x) { return x && x.on !== false && x.on !== "false" && x.foot !== false && x.foot !== "false" && ok(x.url); })
        .map(function (x) { return { platform: String(x.platform || "link"), label: String(x.label || x.platform || "Link"), url: x.url }; });
      if (raw.length) document.getElementById("egFootSoc").innerHTML = icons(list);
    }).catch(function () {});
  } catch (x) {}
})();
