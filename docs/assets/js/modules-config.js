/**
 * Site module map — drives contents pages and future tense modules.
 */
window.GRAMMAR_MODULES = {
  "present-simple": {
    id: "present-simple",
    label: "Present Simple",
    icon: "📗",
    status: "active",
    contentsUrl: "present-simple-contents.html",
    grammarUrl: "present-simple-grammar.html",
    practice: {
      defaultUrl: "present-simple-exercises.html",
      levels: [
        { id: "b1", label: "B1", url: "present-simple-exercises.html", pool: "B1 pool" },
        { id: "b2", label: "B2", url: "present-simple-exercises-b2.html", pool: "B2 pool" },
        { id: "c1", label: "C1", url: "present-simple-exercises-c1.html", pool: "C1 pool" }
      ]
    },
    teacherPrint: [
      { id: "b1", label: "B1 print", url: "present-simple-b1.html" },
      { id: "b2", label: "B2 print", url: "present-simple-b2.html" },
      { id: "c1", label: "C1 print", url: "present-simple-c1.html" }
    ],
    optional: [
      {
        label: "Protected practice",
        url: "present-simple-exercises-protected.html",
        note: "Check for students; answer key behind password"
      }
    ],
    poolNote:
      "Grammar sections 1–4 match exercise types: -s/-es, affirmative, negative, questions. The practice page draws from the same pools (use New set).",
    structure: [
      { step: 1, title: "Grammar", desc: "Read theory (4 core patterns + extras)", href: "present-simple-grammar.html" },
      { step: 2, title: "Practice", desc: "Interactive exercises — New set from pool", href: "present-simple-exercises.html" },
      { step: 3, title: "Level practice", desc: "B1 / B2 / C1 pools", href: "present-simple-exercises.html" },
      { step: 4, title: "Teacher test", desc: "Printable A4 worksheet + answer key", href: "present-simple-b1.html" }
    ]
  },
  "present-continuous": {
    id: "present-continuous",
    label: "Present Continuous",
    icon: "📘",
    status: "planned",
    contentsUrl: "present-continuous-contents.html",
    grammarUrl: null,
    practice: { defaultUrl: null, levels: [] },
    teacherPrint: [],
    optional: [],
    poolNote: "Same modular layout as Present Simple — coming next.",
    structure: []
  }
};
