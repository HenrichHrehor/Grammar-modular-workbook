/**
 * Site module map — paths relative to docs/ root.
 * Hierarchy: Module → Module part → Component
 */
window.GRAMMAR_MODULES = {
  "present-simple": {
    id: "present-simple",
    module: "verb-tenses",
    moduleLabel: "Verb Tenses",
    label: "Present Simple",
    contentsLabel: "Module map",
    icon: "📗",
    status: "active",
    contentsUrl: "modules/verb-tenses/present-simple/index.html",
    grammarUrl: "modules/verb-tenses/present-simple/theory/present-simple-grammar.html",
    practice: {
      defaultUrl: "modules/verb-tenses/present-simple/practice/present-simple-exercises.html",
      levels: [
        {
          id: "b1",
          label: "B1",
          url: "modules/verb-tenses/present-simple/practice/present-simple-exercises.html",
          pool: "B1 pool"
        },
        {
          id: "b2",
          label: "B2",
          url: "modules/verb-tenses/present-simple/practice/present-simple-exercises.html?level=b2",
          pool: "B2 pool"
        },
        {
          id: "c1",
          label: "C1",
          url: "modules/verb-tenses/present-simple/practice/present-simple-exercises.html?level=c1",
          pool: "C1 pool"
        }
      ]
    },
    teacherPrint: [
      {
        id: "b1",
        label: "B1 print",
        url: "modules/verb-tenses/present-simple/teacher/present-simple-teacher-b1.html"
      },
      {
        id: "b2",
        label: "B2 print",
        url: "modules/verb-tenses/present-simple/teacher/present-simple-teacher-b2.html"
      },
      {
        id: "c1",
        label: "C1 print",
        url: "modules/verb-tenses/present-simple/teacher/present-simple-teacher-c1.html"
      }
    ],
    optional: [
      {
        label: "Protected practice",
        url: "modules/verb-tenses/present-simple/practice/present-simple-exercises-protected.html",
        note: "Check for students; answer key behind password"
      }
    ],
    poolNote:
      "Grammar sections 1–4 match exercise types: -s/-es, affirmative, negative, questions.",
    structure: [
      {
        step: 1,
        title: "Grammar",
        desc: "Theory",
        href: "modules/verb-tenses/present-simple/theory/present-simple-grammar.html"
      },
      {
        step: 2,
        title: "Practice",
        desc: "Interactive exercises — New set from pool",
        href: "modules/verb-tenses/present-simple/practice/present-simple-exercises.html"
      },
      {
        step: 3,
        title: "Teacher test",
        desc: "Printable A4 worksheet + answer key",
        href: "modules/verb-tenses/present-simple/teacher/present-simple-teacher-b1.html"
      }
    ]
  },
  "present-continuous": {
    id: "present-continuous",
    module: "verb-tenses",
    moduleLabel: "Verb Tenses",
    label: "Present Continuous",
    icon: "📘",
    status: "active",
    contentsUrl: "modules/verb-tenses/present-continuous/index.html",
    grammarUrl: "modules/verb-tenses/present-continuous/theory/present-continuous-grammar.html",
    practice: {
      defaultUrl: "modules/verb-tenses/present-continuous/practice/present-continuous-exercises.html",
      levels: [
        {
          id: "b1",
          label: "B1",
          url: "modules/verb-tenses/present-continuous/practice/present-continuous-exercises.html",
          pool: "B1 pool"
        },
        {
          id: "b2",
          label: "B2",
          url: "modules/verb-tenses/present-continuous/practice/present-continuous-exercises.html?level=b2",
          pool: "B2 pool"
        },
        {
          id: "c1",
          label: "C1",
          url: "modules/verb-tenses/present-continuous/practice/present-continuous-exercises.html?level=c1",
          pool: "C1 pool"
        }
      ]
    },
    teacherPrint: [
      {
        id: "b1",
        label: "B1 print",
        url: "modules/verb-tenses/present-continuous/teacher/present-continuous-teacher-b1.html"
      },
      {
        id: "b2",
        label: "B2 print",
        url: "modules/verb-tenses/present-continuous/teacher/present-continuous-teacher-b2.html"
      },
      {
        id: "c1",
        label: "C1 print",
        url: "modules/verb-tenses/present-continuous/teacher/present-continuous-teacher-c1.html"
      }
    ],
    optional: [],
    poolNote: "Sections match exercise types: -ing form, affirmative, negative, questions.",
    structure: [
      {
        step: 1,
        title: "Grammar",
        desc: "Theory from Present continuous.txt",
        href: "modules/verb-tenses/present-continuous/theory/present-continuous-grammar.html"
      },
      {
        step: 2,
        title: "Practice",
        desc: "Interactive exercises — New set from pool",
        href: "modules/verb-tenses/present-continuous/practice/present-continuous-exercises.html"
      },
      {
        step: 3,
        title: "Teacher test",
        desc: "Printable A4 worksheet + answer key",
        href: "modules/verb-tenses/present-continuous/teacher/present-continuous-teacher-b1.html"
      }
    ]
  },
  "passive-voice": {
    id: "passive-voice",
    module: "grammar-appendix",
    moduleLabel: "Grammar Appendix",
    label: "Passive Voice",
    icon: "📎",
    status: "active",
    contentsUrl: "modules/grammar-appendix/passive-voice/index.html",
    grammarUrl: "modules/grammar-appendix/passive-voice/theory/passive-voice-grammar-b1.html",
    practice: { defaultUrl: null, levels: [] },
    teacherPrint: [],
    optional: [],
    structure: []
  }
};
