/**
 * Resolves paths from any page depth under docs/ (site root).
 * Works locally, on GitHub Pages project sites (/RepoName/...), and in subfolders.
 */
(function () {
  var GITHUB_REPO = "Grammar-modular-workbook";

  function pathname() {
    return (window.location.pathname || "").replace(/\\/g, "/");
  }

  /** e.g. "/Grammar-modular-workbook/" or "" when opening files locally */
  function pagesBase() {
    if ((location.hostname || "").indexOf("github.io") < 0) {
      return "";
    }
    var parts = pathname().split("/").filter(Boolean);
    if (!parts.length) return "";
    var first = parts[0];
    if (first === "modules" || first === "assets" || first.indexOf(".html") >= 0) {
      return "";
    }
    return "/" + first + "/";
  }

  function moduleDepth() {
    var path = pathname();
    var idx = path.indexOf("/modules/");
    if (idx < 0) return 0;
    var after = path.slice(idx + 1);
    var segments = after.split("/").filter(Boolean);
    if (segments.length && /\.html?$/i.test(segments[segments.length - 1])) {
      segments.pop();
    }
    return segments.length;
  }

  function siteRootPrefix() {
    var depth = moduleDepth();
    if (depth > 0) {
      return "../".repeat(depth);
    }
    var file = pathname().split("/").pop() || "";
    if (file.indexOf(".html") >= 0) return "";
    return "";
  }

  function siteUrl(subpath) {
    var base = pagesBase();
    var rel = siteRootPrefix() + (subpath || "");
    if (base && rel.indexOf("..") !== 0) {
      return base + rel.replace(/^\//, "");
    }
    return rel;
  }

  window.SITE = {
    repo: GITHUB_REPO,
    pagesBase: pagesBase,
    root: siteRootPrefix,
    asset: function (subpath) {
      return siteUrl("assets/" + subpath);
    },
    page: function (subpath) {
      return siteUrl(subpath);
    },
    homeUrl: function () {
      return pagesBase() + "contents.html";
    }
  };

  function injectFavicon() {
    if (!document.head || document.querySelector('link[rel="icon"][data-site-favicon]')) {
      return;
    }
    var href = window.SITE.asset("favicon.svg");
    var icon = document.createElement("link");
    icon.rel = "icon";
    icon.type = "image/svg+xml";
    icon.href = href;
    icon.setAttribute("data-site-favicon", "1");
    document.head.appendChild(icon);
    var shortcut = document.createElement("link");
    shortcut.rel = "shortcut icon";
    shortcut.href = href;
    shortcut.setAttribute("data-site-favicon", "1");
    document.head.appendChild(shortcut);
  }

  injectFavicon();
})();
