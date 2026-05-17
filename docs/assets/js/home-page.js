(function () {
  var GRAMMAR_TILES = [
    {
      title: "Present Simple — full grammar",
      desc: "Rules for -s/-es, affirmative, negative, and questions.",
      href: "present-simple-grammar.html",
      icon: "📚"
    },
    {
      title: "Present Simple — verb forms",
      desc: "He/she/it: plays, studies, goes, does.",
      href: "present-simple-grammar.html",
      icon: "✏️"
    },
    {
      title: "Don't / doesn't explained",
      desc: "Negative present simple with examples.",
      href: "present-simple-grammar.html",
      icon: "🚫"
    },
    {
      title: "Do / Does questions",
      desc: "How to build present simple questions.",
      href: "present-simple-grammar.html",
      icon: "❓"
    },
    {
      title: "Module map",
      desc: "Present Simple — grammar, practice, and teacher print paths.",
      href: "present-simple-contents.html",
      icon: "📖"
    },
    {
      title: "Passive voice appendix",
      desc: "Active ↔ passive across tenses.",
      href: "grammar-appendix-passive.html",
      icon: "📎"
    },
    {
      title: "Why verbs matter",
      desc: "Core grammar introduction (section 1).",
      href: "present-simple-grammar.html",
      icon: "🔑"
    },
    {
      title: "Present Continuous",
      desc: "Next tense module — structure preview.",
      href: "present-continuous-contents.html",
      icon: "📘"
    }
  ];

  var EXERCISE_TILES = [
    {
      title: "B1 Practice",
      desc: "Everyday topics · shorter sentences · New set from pool.",
      href: "present-simple-exercises.html?level=b1",
      icon: "🎯",
      level: "b1"
    },
    {
      title: "B1 — negative & questions",
      desc: "Interactive checks; dont/doesnt accepted.",
      href: "present-simple-exercises.html?level=b1",
      icon: "✅",
      level: "b1"
    },
    {
      title: "B2 Practice",
      desc: "Work & study · longer structures.",
      href: "present-simple-exercises.html?level=b2",
      icon: "🚀",
      level: "b2"
    },
    {
      title: "B2 — advanced pool",
      desc: "Harder vocabulary; same four exercise types.",
      href: "present-simple-exercises.html?level=b2",
      icon: "📈",
      level: "b2"
    }
  ];

  var TEACHER_TILES = [
    {
      title: "B1 printable test",
      desc: "A4 worksheet · 6 parts · /29 · password required.",
      href: "present-simple-b1.html",
      icon: "🖨️",
      level: "b1"
    },
    {
      title: "B1 — random version",
      desc: "Generate a new test sheet + answer key.",
      href: "present-simple-b1.html",
      icon: "🔄",
      level: "b1"
    },
    {
      title: "B2 printable test",
      desc: "B2 question pool · teacher panel.",
      href: "present-simple-b2.html",
      icon: "🖨️",
      level: "b2"
    },
    {
      title: "B2 — score & print",
      desc: "Enter points · grade 1–5 · print footer.",
      href: "present-simple-b2.html",
      icon: "📊",
      level: "b2"
    }
  ];

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
    return (
      '<a class="' +
      cls +
      '" href="' +
      tile.href +
      '">' +
      '<span class="home-tile-icon">' +
      tile.icon +
      "</span>" +
      "<h3>" +
      tile.title +
      "</h3>" +
      "<p>" +
      tile.desc +
      "</p>" +
      "</a>"
    );
  }

  function renderTiles() {
    var grammarEl = document.getElementById("homeTilesGrammar");
    var exerciseEl = document.getElementById("homeTilesExercise");
    var teacherEl = document.getElementById("homeTilesTeacher");
    if (!grammarEl || !exerciseEl || !teacherEl) return;

    var grammar = pickUnique(GRAMMAR_TILES, 4);
    var exercise = pickUnique(EXERCISE_TILES, 2);
    var teacher = pickUnique(TEACHER_TILES, 2);

    grammarEl.innerHTML = grammar.map(function (t) {
      return renderTile(t, "home-tile--grammar");
    }).join("");
    exerciseEl.innerHTML = exercise.map(function (t) {
      return renderTile(t, "home-tile--exercise");
    }).join("");
    teacherEl.innerHTML = teacher.map(function (t) {
      return renderTile(t, "home-tile--teacher");
    }).join("");
  }

  function initScheme() {
    var scheme = document.getElementById("homeScheme");
    if (!scheme) return;

    var nodes = scheme.querySelectorAll(".scheme-node[data-href]");
    nodes.forEach(function (node) {
      node.addEventListener("click", function () {
        var href = node.getAttribute("data-href");
        if (href) window.location.href = href;
      });
      node.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          node.click();
        }
      });
    });

    scheme.querySelectorAll(".scheme-node[data-scheme-group]").forEach(function (node) {
      node.addEventListener("mouseenter", function () {
        var group = node.getAttribute("data-scheme-group");
        scheme.setAttribute("data-active-group", group);
      });
      node.addEventListener("mouseleave", function () {
        scheme.removeAttribute("data-active-group");
      });
      node.addEventListener("focus", function () {
        var group = node.getAttribute("data-scheme-group");
        scheme.setAttribute("data-active-group", group);
      });
      node.addEventListener("blur", function () {
        scheme.removeAttribute("data-active-group");
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    renderTiles();
    initScheme();
    var btn = document.getElementById("btnShuffleTiles");
    if (btn) {
      btn.addEventListener("click", renderTiles);
    }
  });
})();
