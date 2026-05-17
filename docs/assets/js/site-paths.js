/**
 * Resolves paths from any page depth under docs/ (site root).
 */
(function () {
  function siteRootPrefix() {
    var path = (window.location.pathname || "").replace(/\\/g, "/");
    var idx = path.indexOf("/modules/");
    if (idx >= 0) {
      var after = path.slice(idx + 1);
      var depth = after.split("/").filter(Boolean).length;
      return depth ? "../".repeat(depth) : "";
    }
    var file = path.split("/").pop() || "";
    if (file.indexOf(".html") >= 0) return "";
    return "";
  }

  window.SITE = {
    root: siteRootPrefix,
    asset: function (subpath) {
      return siteRootPrefix() + "assets/" + subpath;
    },
    page: function (subpath) {
      return siteRootPrefix() + subpath;
    }
  };
})();
