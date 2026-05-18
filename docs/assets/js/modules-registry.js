/**
 * Book structure: Home → Module → Module part → Component
 * All paths relative to docs/ (site root).
 */
(function () {
  var VT = "modules/verb-tenses/";
  var PS = VT + "present-simple/";
  var PC = VT + "present-continuous/";
  var PAS = VT + "past-simple/";
  var GA = "modules/grammar-appendix/";
  var PV = GA + "passive-voice/";

  function partDef(id, moduleId, moduleLabel, partLabel, icon, base, components) {
    return {
      id: id,
      moduleId: moduleId,
      moduleLabel: moduleLabel,
      partLabel: partLabel,
      icon: icon,
      mapUrl: base + "index.html",
      components: components
    };
  }

  var presentSimple = partDef(
    "present-simple",
    "verb-tenses",
    "Verb Tenses",
    "Present Simple",
    "📗",
    PS,
    {
      theory: {
        label: "Theory",
        shortLabel: "Present Simple Theory",
        url: PS + "theory/present-simple-grammar.html"
      },
      practiceB1: {
        label: "B1 Present Simple Exercises",
        url: PS + "practice/present-simple-exercises.html?level=b1",
        level: "b1"
      },
      practiceB2: {
        label: "B2 Present Simple Exercises",
        url: PS + "practice/present-simple-exercises.html?level=b2",
        level: "b2"
      },
      practiceC1: {
        label: "C1 Present Simple Exercises",
        url: PS + "practice/present-simple-exercises.html?level=c1",
        level: "c1"
      },
      teacherB1: {
        label: "B1 Present Simple Teacher Test",
        url: PS + "teacher/present-simple-teacher-b1.html",
        level: "b1"
      },
      teacherB2: {
        label: "B2 Present Simple Teacher Test",
        url: PS + "teacher/present-simple-teacher-b2.html",
        level: "b2"
      },
      teacherC1: {
        label: "C1 Present Simple Teacher Test",
        url: PS + "teacher/present-simple-teacher-c1.html",
        level: "c1"
      }
    }
  );

  var pastSimple = partDef(
    "past-simple",
    "verb-tenses",
    "Verb Tenses",
    "Past Simple",
    "📙",
    PAS,
    {
      theory: {
        label: "Theory",
        shortLabel: "Past Simple Theory",
        url: PAS + "theory/past-simple-grammar.html"
      },
      practiceB1: {
        label: "B1 Past Simple Exercises",
        url: PAS + "practice/past-simple-exercises.html?level=b1",
        level: "b1"
      },
      practiceB2: {
        label: "B2 Past Simple Exercises",
        url: PAS + "practice/past-simple-exercises.html?level=b2",
        level: "b2"
      },
      practiceC1: {
        label: "C1 Past Simple Exercises",
        url: PAS + "practice/past-simple-exercises.html?level=c1",
        level: "c1"
      },
      teacherB1: {
        label: "B1 Past Simple Teacher Test",
        url: PAS + "teacher/past-simple-teacher-b1.html",
        level: "b1"
      },
      teacherB2: {
        label: "B2 Past Simple Teacher Test",
        url: PAS + "teacher/past-simple-teacher-b2.html",
        level: "b2"
      },
      teacherC1: {
        label: "C1 Past Simple Teacher Test",
        url: PAS + "teacher/past-simple-teacher-c1.html",
        level: "c1"
      }
    }
  );

  var presentContinuous = partDef(
    "present-continuous",
    "verb-tenses",
    "Verb Tenses",
    "Present Continuous",
    "📘",
    PC,
    {
      theory: {
        label: "Theory",
        shortLabel: "Present Continuous Theory",
        url: PC + "theory/present-continuous-grammar.html"
      },
      practiceB1: {
        label: "B1 Present Continuous Exercises",
        url: PC + "practice/present-continuous-exercises.html?level=b1",
        level: "b1"
      },
      practiceB2: {
        label: "B2 Present Continuous Exercises",
        url: PC + "practice/present-continuous-exercises.html?level=b2",
        level: "b2"
      },
      practiceC1: {
        label: "C1 Present Continuous Exercises",
        url: PC + "practice/present-continuous-exercises.html?level=c1",
        level: "c1"
      },
      teacherB1: {
        label: "B1 Present Continuous Teacher Test",
        url: PC + "teacher/present-continuous-teacher-b1.html",
        level: "b1"
      },
      teacherB2: {
        label: "B2 Present Continuous Teacher Test",
        url: PC + "teacher/present-continuous-teacher-b2.html",
        level: "b2"
      },
      teacherC1: {
        label: "C1 Present Continuous Teacher Test",
        url: PC + "teacher/present-continuous-teacher-c1.html",
        level: "c1"
      }
    }
  );

  var passiveVoice = partDef(
    "passive-voice",
    "grammar-appendix",
    "Grammar Appendix",
    "Passive Voice",
    "📎",
    PV,
    {
      theory: {
        label: "Theory",
        shortLabel: "Passive Voice Theory",
        url: PV + "theory/passive-voice-grammar-b1.html"
      }
    }
  );

  window.MODULES_REGISTRY = {
    home: "contents.html",
    modules: {
      "verb-tenses": {
        id: "verb-tenses",
        label: "Verb Tenses",
        icon: "📚",
        mapUrl: VT + "index.html",
        parts: {
          "present-simple": presentSimple,
          "present-continuous": presentContinuous,
          "past-simple": pastSimple
        }
      },
      "grammar-appendix": {
        id: "grammar-appendix",
        label: "Grammar Appendix",
        icon: "📎",
        mapUrl: GA + "index.html",
        parts: {
          "passive-voice": passiveVoice
        }
      },
      "parts-of-speech": {
        id: "parts-of-speech",
        label: "Parts of Speech",
        icon: "📝",
        mapUrl: "modules/parts-of-speech/index.html",
        parts: {}
      }
    }
  };

  function homeModuleMapTiles() {
    var R = window.MODULES_REGISTRY;
    var tiles = [
      {
        title: "Verb Tenses — Module map",
        desc: "Present Simple, Present Continuous, or Past Simple",
        href: R.modules["verb-tenses"].mapUrl,
        icon: R.modules["verb-tenses"].icon
      }
    ];
    var vt = R.modules["verb-tenses"].parts;
    Object.keys(vt).forEach(function (key) {
      var p = vt[key];
      tiles.push({
        title: p.partLabel + " — Module map",
        desc: p.moduleLabel + " → open theory, exercises, or teacher tests",
        href: p.mapUrl,
        icon: p.icon
      });
    });
    return tiles;
  }

  function verbTensesPartIds() {
    return Object.keys(window.MODULES_REGISTRY.modules["verb-tenses"].parts);
  }

  function homePracticeTiles() {
    var out = [];
    verbTensesPartIds().forEach(function (key) {
      var p = window.MODULES_REGISTRY.modules["verb-tenses"].parts[key];
      ["practiceB1", "practiceB2", "practiceC1"].forEach(function (ckey) {
        var c = p.components[ckey];
        out.push({
          title: c.label,
          desc: p.partLabel + " · interactive worksheet",
          href: c.url,
          icon: "✏️",
          level: c.level,
          partId: key
        });
      });
    });
    return out;
  }

  function homeTeacherTiles() {
    var out = [];
    verbTensesPartIds().forEach(function (key) {
      var p = window.MODULES_REGISTRY.modules["verb-tenses"].parts[key];
      ["teacherB1", "teacherB2", "teacherC1"].forEach(function (ckey) {
        var c = p.components[ckey];
        out.push({
          title: c.label,
          desc: "Password needed · printable A4 test",
          href: c.url,
          icon: "🖨️",
          level: c.level,
          partId: key
        });
      });
    });
    return out;
  }

  var R = window.MODULES_REGISTRY;
  R.presentSimple = presentSimple;
  R.presentContinuous = presentContinuous;
  R.pastSimple = pastSimple;
  R.verbTensesPartIds = verbTensesPartIds;
  R.homeModuleMapTiles = homeModuleMapTiles;
  R.homePracticeTiles = homePracticeTiles;
  R.homeTeacherTiles = homeTeacherTiles;
})();
