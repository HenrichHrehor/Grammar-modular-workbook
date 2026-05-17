(function () {
  var VT = "modules/verb-tenses/";
  var PS = VT + "present-simple/";
  var PV = "modules/grammar-appendix/passive-voice/";

  function pageHref(subpath) {
    if (window.SITE && window.SITE.page) return window.SITE.page(subpath);
    return subpath;
  }

  var HOME = { label: "Home", href: "contents.html" };
  var VERB_TENSES = { label: "Verb Tenses" };
  var PS_MAP = { label: "Present Simple", href: PS + "index.html" };
  var APPENDIX = { label: "Grammar Appendix" };
  var PV_PART = { label: "Passive Voice", href: PV + "index.html" };

  function sitePath() {
    var path = (window.location.pathname || "").replace(/\\/g, "/");
    var idx = path.indexOf("/modules/");
    if (idx >= 0) return path.slice(idx + 1);
    var file = path.split("/").pop() || "contents.html";
    return file.split("?")[0];
  }

  function resolveCrumbs() {
    var sp = sitePath();

    if (sp === "contents.html" || sp === "index.html") return [HOME];

    if (sp === PS + "index.html") {
      return [HOME, VERB_TENSES, { label: "Module map" }];
    }

    if (sp.indexOf(PS + "theory/") === 0) {
      return [HOME, VERB_TENSES, PS_MAP, { label: "Grammar" }];
    }

    if (sp.indexOf(PS + "practice/") === 0) {
      var label = "Practice";
      if (sp.indexOf("present-simple-exercises.html") >= 0) {
        var params = new URLSearchParams(window.location.search);
        var level = params.get("level");
        if (level) label = "Practice " + level.toUpperCase();
      } else if (sp.indexOf("protected") >= 0) {
        label = "Protected practice";
      }
      return [HOME, VERB_TENSES, PS_MAP, { label: label }];
    }

    if (sp.indexOf(PS + "teacher/") === 0) {
      var t = "Teacher print";
      if (sp.indexOf("b1") >= 0) t = "Teacher print B1";
      if (sp.indexOf("b2") >= 0) t = "Teacher print B2";
      if (sp.indexOf("c1") >= 0) t = "Teacher print C1";
      return [HOME, VERB_TENSES, PS_MAP, { label: t }];
    }

    if (sp === VT + "present-continuous/index.html") {
      return [HOME, VERB_TENSES, { label: "Present Continuous" }];
    }

    if (sp === PV + "index.html") {
      return [HOME, APPENDIX, { label: "Module map" }];
    }

    if (sp.indexOf(PV + "theory/") === 0) {
      return [HOME, APPENDIX, PV_PART, { label: "Grammar" }];
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

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", insertBreadcrumbs);
  } else {
    insertBreadcrumbs();
  }
})();
