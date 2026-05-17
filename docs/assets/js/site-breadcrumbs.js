(function () {
  var HOME = { label: "Home", href: "contents.html" };

  var ROUTES = {
    "contents.html": [HOME],
    "index.html": [HOME],
    "present-simple-contents.html": [HOME, { label: "Present Simple", href: "present-simple-contents.html" }, { label: "Module map" }],
    "present-continuous-contents.html": [
      HOME,
      { label: "Present Continuous", href: "present-continuous-contents.html" },
      { label: "Module map" }
    ],
    "present-simple-grammar.html": [
      HOME,
      { label: "Present Simple", href: "present-simple-contents.html" },
      { label: "Grammar" }
    ],
    "grammar-appendix-passive.html": [
      HOME,
      { label: "Present Simple", href: "present-simple-contents.html" },
      { label: "Grammar appendix" },
      { label: "Passive voice" }
    ],
    "present-simple-exercises.html": [
      HOME,
      { label: "Present Simple", href: "present-simple-contents.html" },
      { label: "Practice" }
    ],
    "present-simple-exercises-b2.html": [
      HOME,
      { label: "Present Simple", href: "present-simple-contents.html" },
      { label: "Practice B2" }
    ],
    "present-simple-exercises-c1.html": [
      HOME,
      { label: "Present Simple", href: "present-simple-contents.html" },
      { label: "Practice C1" }
    ],
    "present-simple-exercises-v2.html": [
      HOME,
      { label: "Present Simple", href: "present-simple-contents.html" },
      { label: "Practice" }
    ],
    "present-simple-exercises-protected.html": [
      HOME,
      { label: "Present Simple", href: "present-simple-contents.html" },
      { label: "Protected practice" }
    ],
    "present-simple-b1.html": [
      HOME,
      { label: "Present Simple", href: "present-simple-contents.html" },
      { label: "Teacher print B1" }
    ],
    "present-simple-b2.html": [
      HOME,
      { label: "Present Simple", href: "present-simple-contents.html" },
      { label: "Teacher print B2" }
    ],
    "present-simple-c1.html": [
      HOME,
      { label: "Present Simple", href: "present-simple-contents.html" },
      { label: "Teacher print C1" }
    ]
  };

  function getFileName() {
    var path = window.location.pathname || "";
    var name = path.split("/").pop();
    if (!name || name.indexOf(".html") === -1) return "contents.html";
    return name.split("?")[0];
  }

  function resolveCrumbs() {
    var file = getFileName();
    var crumbs = ROUTES[file];
    if (crumbs) {
      crumbs = crumbs.map(function (c) {
        return { label: c.label, href: c.href };
      });
    } else if (file.indexOf("present-simple") === 0) {
      crumbs = [HOME, { label: "Present Simple", href: "present-simple-contents.html" }, { label: file }];
    } else {
      crumbs = [HOME, { label: file }];
    }

    if (file === "present-simple-exercises.html") {
      var params = new URLSearchParams(window.location.search);
      var level = (params.get("level") || "b1").toUpperCase();
      crumbs[crumbs.length - 1] = { label: "Practice " + level };
    }

    return crumbs;
  }

  function buildHtml(crumbs) {
    var parts = [];
    crumbs.forEach(function (crumb, i) {
      var isLast = i === crumbs.length - 1;
      if (i > 0) {
        parts.push('<span class="site-breadcrumbs-sep" aria-hidden="true">›</span>');
      }
      if (!isLast && crumb.href) {
        parts.push('<a href="' + crumb.href + '">' + crumb.label + "</a>");
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
    if (navBar) {
      sheet.insertBefore(nav, navBar);
    } else {
      sheet.insertBefore(nav, sheet.firstChild);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", insertBreadcrumbs);
  } else {
    insertBreadcrumbs();
  }
})();
