(function () {
  var P = window.MODULES_REGISTRY && window.MODULES_REGISTRY.paths;
  var grammar = P ? P.grammar : "modules/verb-tenses/present-simple/theory/present-simple-grammar.html";
  var moduleMap = P ? P.moduleMap : "modules/verb-tenses/present-simple/index.html";
  var practice = P ? P.practice : "modules/verb-tenses/present-simple/practice/present-simple-exercises.html";
  var passive = P ? P.passiveGrammar : "modules/grammar-appendix/passive-voice/theory/passive-voice-grammar-b1.html";
  var teacherB1 = P ? P.teacherB1 : "modules/verb-tenses/present-simple/teacher/present-simple-teacher-b1.html";
  var teacherB2 = P ? P.teacherB2 : "modules/verb-tenses/present-simple/teacher/present-simple-teacher-b2.html";
  var presentContinuous = P ? P.presentContinuousMap : "modules/verb-tenses/present-continuous/index.html";
  var pcGrammar = P ? P.presentContinuousGrammar : "modules/verb-tenses/present-continuous/theory/present-continuous-grammar.html";
  var pcPractice = P ? P.presentContinuousPractice : "modules/verb-tenses/present-continuous/practice/present-continuous-exercises.html";
  var pcTeacherB1 = P ? P.presentContinuousTeacherB1 : "modules/verb-tenses/present-continuous/teacher/present-continuous-teacher-b1.html";

  var GRAMMAR_TILES = [
    { title: "Present Simple — full grammar", desc: "Rules for -s/-es, affirmative, negative, and questions.", href: grammar, icon: "📚" },
    { title: "Present Simple — verb forms", desc: "He/she/it: plays, studies, goes, does.", href: grammar, icon: "✏️" },
    { title: "Don't / doesn't explained", desc: "Negative present simple with examples.", href: grammar, icon: "🚫" },
    { title: "Do / Does questions", desc: "How to build present simple questions.", href: grammar, icon: "❓" },
    { title: "Module map", desc: "Verb Tenses → Present Simple — all components.", href: moduleMap, icon: "📖" },
    { title: "Passive voice appendix", desc: "Grammar Appendix → Passive Voice theory.", href: passive, icon: "📎" },
    { title: "Why verbs matter", desc: "Core grammar introduction (section 1).", href: grammar, icon: "🔑" },
    { title: "Present Continuous — grammar", desc: "am/is/are + verb-ing · now & temporary.", href: pcGrammar, icon: "📘" },
    { title: "Present Continuous — module map", desc: "Verb Tenses → practice & teacher print.", href: presentContinuous, icon: "🗺️" }
  ];

  var EXERCISE_TILES = [
    { title: "B1 Practice", desc: "Everyday topics · shorter sentences · New set from pool.", href: practice + "?level=b1", icon: "🎯", level: "b1" },
    { title: "B1 — negative & questions", desc: "Interactive checks; dont/doesnt accepted.", href: practice + "?level=b1", icon: "✅", level: "b1" },
    { title: "B2 Practice", desc: "Work & study · longer structures.", href: practice + "?level=b2", icon: "🚀", level: "b2" },
    { title: "B2 — advanced pool", desc: "Harder vocabulary; same four exercise types.", href: practice + "?level=b2", icon: "📈", level: "b2" }
  ];

  var TEACHER_TILES = [
    { title: "B1 printable test", desc: "A4 worksheet · 6 parts · /29 · password required.", href: teacherB1, icon: "🖨️", level: "b1" },
    { title: "B1 — random version", desc: "Generate a new test sheet + answer key.", href: teacherB1, icon: "🔄", level: "b1" },
    { title: "B2 printable test", desc: "B2 question pool · teacher panel.", href: teacherB2, icon: "🖨️", level: "b2" },
    { title: "B2 — score & print", desc: "Enter points · grade 1–5 · print footer.", href: teacherB2, icon: "📊", level: "b2" }
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
      '<a class="' + cls + '" href="' + tile.href + '">' +
      '<span class="home-tile-icon">' + tile.icon + "</span>" +
      "<h3>" + tile.title + "</h3>" +
      "<p>" + tile.desc + "</p>" +
      "</a>"
    );
  }

  function renderTiles() {
    var grammarEl = document.getElementById("homeTilesGrammar");
    var exerciseEl = document.getElementById("homeTilesExercise");
    var teacherEl = document.getElementById("homeTilesTeacher");
    if (!grammarEl || !exerciseEl || !teacherEl) return;
    grammarEl.innerHTML = pickUnique(GRAMMAR_TILES, 4).map(function (t) {
      return renderTile(t, "home-tile--grammar");
    }).join("");
    exerciseEl.innerHTML = pickUnique(EXERCISE_TILES, 2).map(function (t) {
      return renderTile(t, "home-tile--exercise");
    }).join("");
    teacherEl.innerHTML = pickUnique(TEACHER_TILES, 2).map(function (t) {
      return renderTile(t, "home-tile--teacher");
    }).join("");
  }

  function initScheme() {
    var scheme = document.getElementById("homeScheme");
    if (!scheme) return;
    scheme.querySelectorAll(".scheme-node[data-href]").forEach(function (node) {
      node.addEventListener("click", function () {
        var href = node.getAttribute("data-href");
        if (href) window.location.href = href;
      });
    });
    scheme.querySelectorAll(".scheme-node[data-scheme-group]").forEach(function (node) {
      node.addEventListener("mouseenter", function () {
        scheme.setAttribute("data-active-group", node.getAttribute("data-scheme-group"));
      });
      node.addEventListener("mouseleave", function () {
        scheme.removeAttribute("data-active-group");
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    renderTiles();
    initScheme();
    var btn = document.getElementById("btnShuffleTiles");
    if (btn) btn.addEventListener("click", renderTiles);
  });
})();
