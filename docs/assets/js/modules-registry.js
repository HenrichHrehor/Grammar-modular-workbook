/**
 * Canonical site paths: Module → Module part → Component
 * All paths are relative to docs/ (site root).
 */
(function () {
  var PS = "modules/verb-tenses/present-simple/";
  var PC = "modules/verb-tenses/present-continuous/";
  var PV = "modules/grammar-appendix/passive-voice/";

  window.MODULES_REGISTRY = {
    home: "contents.html",
    modules: {
      "verb-tenses": {
        label: "Verb Tenses",
        parts: {
          "present-simple": {
            label: "Present Simple",
            icon: "📗",
            mapUrl: PS + "index.html",
            components: {
              grammar: {
                label: "Grammar",
                type: "theory",
                url: PS + "theory/present-simple-grammar.html"
              },
              practice: {
                label: "Practice",
                type: "practice",
                url: PS + "practice/present-simple-exercises.html"
              },
              practiceProtected: {
                label: "Protected practice",
                type: "practice",
                url: PS + "practice/present-simple-exercises-protected.html"
              },
              teacherB1: {
                label: "Teacher B1",
                type: "teacher",
                url: PS + "teacher/present-simple-teacher-b1.html"
              },
              teacherB2: {
                label: "Teacher B2",
                type: "teacher",
                url: PS + "teacher/present-simple-teacher-b2.html"
              },
              teacherC1: {
                label: "Teacher C1",
                type: "teacher",
                url: PS + "teacher/present-simple-teacher-c1.html"
              }
            }
          },
          "present-continuous": {
            label: "Present Continuous",
            icon: "📘",
            status: "planned",
            mapUrl: PC + "index.html",
            components: {}
          }
        }
      },
      "grammar-appendix": {
        label: "Grammar Appendix",
        parts: {
          "passive-voice": {
            label: "Passive Voice",
            icon: "📎",
            mapUrl: PV + "index.html",
            components: {
              grammar: {
                label: "Grammar",
                type: "theory",
                url: PV + "theory/passive-voice-grammar-b1.html"
              }
            }
          }
        }
      },
      "parts-of-speech": {
        label: "Parts of Speech",
        parts: {}
      }
    }
  };

  var R = window.MODULES_REGISTRY;
  var ps = R.modules["verb-tenses"].parts["present-simple"];
  R.presentSimple = ps;
  R.paths = {
    home: R.home,
    moduleMap: ps.mapUrl,
    grammar: ps.components.grammar.url,
    practice: ps.components.practice.url,
    practiceProtected: ps.components.practiceProtected.url,
    teacherB1: ps.components.teacherB1.url,
    teacherB2: ps.components.teacherB2.url,
    teacherC1: ps.components.teacherC1.url,
    passiveGrammar: R.modules["grammar-appendix"].parts["passive-voice"].components.grammar.url,
    presentContinuousMap: R.modules["verb-tenses"].parts["present-continuous"].mapUrl
  };
})();
