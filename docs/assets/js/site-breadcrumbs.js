(function () {
  var VT = "modules/verb-tenses/";
  var PS = VT + "present-simple/";
  var PC = VT + "present-continuous/";
  var PAS = VT + "past-simple/";
  var GA = "modules/grammar-appendix/";
  var PV = GA + "passive-voice/";

  function pageHref(subpath) {
    if (window.SITE && window.SITE.page) return window.SITE.page(subpath);
    return subpath;
  }

  var HOME = { label: "Home", href: "contents.html" };
  var VERB_TENSES = { label: "Verb Tenses", href: VT + "index.html" };
  var GRAMMAR_APPENDIX = { label: "Grammar Appendix", href: GA + "index.html" };

  function sitePath() {
    var path = (window.location.pathname || "").replace(/\\/g, "/");
    var idx = path.indexOf("/modules/");
    if (idx >= 0) return path.slice(idx + 1);
    var file = path.split("/").pop() || "contents.html";
    return file.split("?")[0];
  }

  function levelFromUrl() {
    var params = new URLSearchParams(window.location.search);
    var level = (params.get("level") || "").toLowerCase();
    if (level === "b1" || level === "b2" || level === "c1") return level;
    return null;
  }

  function levelFromTeacherPath(sp) {
    if (sp.indexOf("-b1.") >= 0 || sp.indexOf("-b1.html") >= 0) return "b1";
    if (sp.indexOf("-b2.") >= 0 || sp.indexOf("-b2.html") >= 0) return "b2";
    if (sp.indexOf("-c1.") >= 0 || sp.indexOf("-c1.html") >= 0) return "c1";
    return null;
  }

  function partFromRegistry(partId) {
    var R = window.MODULES_REGISTRY;
    if (!R || !R.modules || !R.modules["verb-tenses"]) return null;
    return R.modules["verb-tenses"].parts[partId] || null;
  }

  function componentLabel(part, kind, level) {
    if (!part || !part.components) return kind;
    if (kind === "theory") {
      return part.components.theory.shortLabel || part.components.theory.label;
    }
    if (!level) return kind;
    var key =
      (kind === "practice" ? "practice" : "teacher") +
      level.charAt(0).toUpperCase() +
      level.slice(1);
    var c = part.components[key];
    return c ? c.label : kind;
  }

  function verbTensesPartBase(partId) {
    if (partId === "present-continuous") return PC;
    if (partId === "past-simple") return PAS;
    return PS;
  }

  function partMapCrumb(partId) {
    var part = partFromRegistry(partId);
    var base = verbTensesPartBase(partId);
    return {
      label: part ? part.partLabel : partId,
      href: base + "index.html"
    };
  }

  function resolveVerbTensesPart(sp, partId) {
    var base = verbTensesPartBase(partId);
    var partMap = partMapCrumb(partId);

    if (sp === base + "index.html") {
      return [HOME, VERB_TENSES, { label: partMap.label + " — Module map" }];
    }

    if (sp.indexOf(base + "theory/") === 0) {
      return [
        HOME,
        VERB_TENSES,
        partMap,
        { label: componentLabel(partFromRegistry(partId), "theory") }
      ];
    }

    if (sp.indexOf(base + "practice/") === 0) {
      var level = levelFromUrl() || "b1";
      return [
        HOME,
        VERB_TENSES,
        partMap,
        { label: componentLabel(partFromRegistry(partId), "practice", level) }
      ];
    }

    if (sp.indexOf(base + "teacher/") === 0) {
      var tLevel = levelFromTeacherPath(sp) || "b1";
      return [
        HOME,
        VERB_TENSES,
        partMap,
        { label: componentLabel(partFromRegistry(partId), "teacher", tLevel) }
      ];
    }

    return null;
  }

  function resolveCrumbs() {
    var sp = sitePath();

    if (sp === "contents.html" || sp === "index.html") return [HOME];

    if (sp === VT + "index.html") {
      return [HOME, { label: "Verb Tenses — Module map" }];
    }

    var vtPart =
      resolveVerbTensesPart(sp, "present-simple") ||
      resolveVerbTensesPart(sp, "present-continuous") ||
      resolveVerbTensesPart(sp, "past-simple");
    if (vtPart) return vtPart;

    if (sp === GA + "index.html") {
      return [HOME, { label: "Grammar Appendix — Module map" }];
    }

    if (sp === PV + "index.html") {
      return [HOME, GRAMMAR_APPENDIX, { label: "Passive Voice — Module map" }];
    }

    if (sp.indexOf(PV + "theory/") === 0) {
      return [
        HOME,
        GRAMMAR_APPENDIX,
        { label: "Passive Voice", href: PV + "index.html" },
        { label: "Passive Voice Theory" }
      ];
    }

    return [HOME, { label: sp.split("/").pop() }];
  }

  function buildHtml(crumbs) {
    var parts = [];
    crumbs.forEach(function (crumb, i) {
      var isLast = i === crumbs.length - 1;
      if (i > 0) {
        parts.push('<span class="site-breadcrumbs-sep" aria-hidden="true">›</span>');
      }
      var href = crumb.href ? pageHref(crumb.href) : null;
      if (!isLast && href) {
        parts.push('<a href="' + href + '">' + crumb.label + "</a>");
      } else {
        parts.push("<span>" + crumb.label + "</span>");
      }
    });
    return parts.join("");
  }

  function insertBreadcrumbs() {
    if (document.querySelector(".site-breadcrumbs")) return;
    var sheet = document.querySelector(".sheet");
    if (!sheet) return;
    var old = sheet.querySelector(".module-breadcrumb");
    if (old) old.remove();
    var nav = document.createElement("nav");
    nav.className = "site-breadcrumbs";
    nav.setAttribute("aria-label", "Breadcrumb");
    nav.innerHTML = buildHtml(resolveCrumbs());
    var navBar = sheet.querySelector(".nav-bar");
    if (navBar) sheet.insertBefore(nav, navBar);
    else sheet.insertBefore(nav, sheet.firstChild);
  }

  function applyLeafNav() {
    var sp = sitePath();
    var navLinks = document.querySelector(".nav-bar .nav-links");
    if (!navLinks) return;

    var crumbs = resolveCrumbs();
    if (crumbs.length < 3) return;

    var html = [];
    crumbs.forEach(function (crumb, i) {
      var isLast = i === crumbs.length - 1;
      var href = crumb.href ? pageHref(crumb.href) : null;
      if (isLast) {
        html.push('<span class="nav-btn nav-btn--current">' + crumb.label + "</span>");
      } else if (href) {
        html.push('<a href="' + href + '" class="nav-btn">' + crumb.label + "</a>");
      }
    });
    navLinks.innerHTML = html.join("");

    if (sp.indexOf("/practice/") >= 0 && levelFromUrl()) {
      document.body.classList.add("leaf-single-level");
    }
    if (sp.indexOf("/teacher/") >= 0) {
      document.body.classList.add("leaf-single-level");
    }

    var last = crumbs[crumbs.length - 1];
    if (last && last.label) {
      var h1 = document.querySelector(".sheet h1");
      if (h1 && sp.indexOf("/theory/") >= 0) h1.textContent = last.label;
      if (h1 && sp.indexOf("/practice/") >= 0) h1.textContent = last.label;
      if (h1 && sp.indexOf("/teacher/") >= 0) h1.textContent = last.label;
      document.title = last.label + " — Grammar Modular Workbook";
    }
  }

  function init() {
    insertBreadcrumbs();
    applyLeafNav();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
