(function () {
  var R = window.MODULES_REGISTRY;

  function shuffle(arr) {
    var copy = arr.slice();
    for (var i = copy.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = copy[i];
      copy[i] = copy[j];
      copy[j] = t;
    }
    return copy;
  }

  function pickUnique(tiles, count) {
    return shuffle(tiles).slice(0, Math.min(count, tiles.length));
  }

  function renderTile(tile, extraClass) {
    var cls = "home-tile " + (extraClass || "");
    if (tile.level) cls += " home-tile--" + tile.level;
    if (tile.partId === "present-continuous") cls += " home-tile--pc";
    return (
      '<a class="' + cls + '" href="' + tile.href + '">' +
      '<span class="home-tile-icon">' + tile.icon + "</span>" +
      "<h3>" + tile.title + "</h3>" +
      "<p>" + tile.desc + "</p>" +
      "</a>"
    );
  }

  function renderTiles() {
    if (!R) return;
    var mapsEl = document.getElementById("homeTilesModuleMaps");
    var practiceEl = document.getElementById("homeTilesPractice");
    var teacherEl = document.getElementById("homeTilesTeacher");
    if (!mapsEl || !practiceEl || !teacherEl) return;

    mapsEl.innerHTML = R.homeModuleMapTiles()
      .map(function (t) {
        return renderTile(t, "home-tile--module-map");
      })
      .join("");

    practiceEl.innerHTML = pickUnique(R.homePracticeTiles(), 3)
      .map(function (t) {
        return renderTile(t, "home-tile--exercise");
      })
      .join("");

    teacherEl.innerHTML = pickUnique(R.homeTeacherTiles(), 3)
      .map(function (t) {
        return renderTile(t, "home-tile--teacher");
      })
      .join("");
  }

  document.addEventListener("DOMContentLoaded", function () {
    renderTiles();
    var btn = document.getElementById("btnShuffleTiles");
    if (btn) btn.addEventListener("click", renderTiles);
  });
})();
