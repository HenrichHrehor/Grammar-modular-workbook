(function () {
  function getPoolRegistry() {
    var mod = document.body.getAttribute("data-exercise-module") || "present-simple";
    if (mod === "present-continuous") return window.PRESENT_CONTINUOUS_POOLS;
    return window.PRESENT_SIMPLE_POOLS;
  }

  function getTenseLabel() {
    var mod = document.body.getAttribute("data-exercise-module") || "present-simple";
    return mod === "present-continuous" ? "present continuous" : "present simple";
  }

  function resolvePool() {
    var level = document.body.getAttribute("data-exercise-level");
    var pools = getPoolRegistry();
    if (level && pools && pools[level]) return pools[level];
    if (document.body.getAttribute("data-exercise-module") === "present-continuous") {
      return window.PRESENT_CONTINUOUS_POOL_B1;
    }
    return window.PRESENT_SIMPLE_POOL;
  }

  var pool = resolvePool();
  if (!pool) return;

  var config = {
    pickCount: 5,
    mode: "random",
    pageBreakAfterSection: 1
  };

  var LEVEL_META = {
    b1: { label: "B1", desc: "Everyday topics · shorter sentences", tagClass: "page-tag--b1" },
    b2: { label: "B2", desc: "Work, study · longer structures", tagClass: "page-tag--b2" },
    c1: { label: "C1", desc: "Formal register · complex subjects", tagClass: "page-tag--c1" }
  };

  function refreshPool() {
    pool = resolvePool();
    return pool;
  }

  function getLevelFromUrl() {
    var params = new URLSearchParams(window.location.search);
    var level = (params.get("level") || "").toLowerCase();
    if (level === "b1" || level === "b2" || level === "c1") return level;
    return null;
  }

  function updateLevelUI(level) {
    var meta = LEVEL_META[level] || LEVEL_META.b1;
    var tag = document.querySelector(".page-tag");
    if (tag) {
      tag.textContent = meta.label + " level — " + getTenseLabel() + " practice";
      tag.className = "page-tag " + meta.tagClass;
    }
    var badge = document.getElementById("exerciseLevelBadge");
    if (badge) {
      badge.textContent = meta.label + " question pool";
      badge.className = "exercise-level-badge exercise-level-badge--" + level;
    }
    var sub = document.getElementById("exerciseLevelSubtitle");
    if (sub) {
      sub.textContent =
        meta.label +
        ": " +
        meta.desc +
        " — same four exercise types, different sentences. Use Check or New set.";
    }
    document.querySelectorAll(".practice-level-tab").forEach(function (btn) {
      var active = btn.getAttribute("data-level") === level;
      btn.classList.toggle("practice-level-tab--active", active);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    });
  }

  function setExerciseLevel(level) {
    if (!LEVEL_META[level]) level = "b1";
    document.body.setAttribute("data-exercise-level", level);
    refreshPool();
    if (!pool) return;
    updateLevelUI(level);
    var url = new URL(window.location.href);
    url.searchParams.set("level", level);
    window.history.replaceState({}, "", url);
    buildWorksheet("random");
  }

  window.setExerciseLevel = setExerciseLevel;

  function normalize(text) {
    return String(text || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ")
      .replace(/[\u0027\u0060\u00B4\u2018\u2019\u201A\u201B\u2032\uFF07]/g, "'");
  }

  function stripApostrophes(text) {
    return text.replace(/'/g, "");
  }

  function expandNoApostropheForms(text) {
    return text
      .replace(/\bdon't\b/g, "do not")
      .replace(/\bdoesn't\b/g, "does not")
      .replace(/\bdidn't\b/g, "did not")
      .replace(/\bwon't\b/g, "will not")
      .replace(/\bwouldn't\b/g, "would not")
      .replace(/\bcan't\b/g, "can not")
      .replace(/\bcouldn't\b/g, "could not")
      .replace(/\bshouldn't\b/g, "should not")
      .replace(/\bisn't\b/g, "is not")
      .replace(/\baren't\b/g, "are not")
      .replace(/\bwasn't\b/g, "was not")
      .replace(/\bweren't\b/g, "were not")
      .replace(/\bhasn't\b/g, "has not")
      .replace(/\bhaven't\b/g, "have not")
      .replace(/\bhadn't\b/g, "had not")
      .replace(/\bdont\b/g, "do not")
      .replace(/\bdoesnt\b/g, "does not")
      .replace(/\bdidnt\b/g, "did not")
      .replace(/\bwont\b/g, "will not")
      .replace(/\bwouldnt\b/g, "would not")
      .replace(/\bcant\b/g, "can not")
      .replace(/\bcouldnt\b/g, "could not")
      .replace(/\bshouldnt\b/g, "should not")
      .replace(/\bisnt\b/g, "is not")
      .replace(/\barent\b/g, "are not")
      .replace(/\bwasnt\b/g, "was not")
      .replace(/\bwerent\b/g, "were not")
      .replace(/\bhasnt\b/g, "has not")
      .replace(/\bhavent\b/g, "have not")
      .replace(/\bhadnt\b/g, "had not");
  }

  function normalizeForMatch(text) {
    var n = normalize(text);
    n = expandNoApostropheForms(stripApostrophes(n));
    n = expandNoApostropheForms(n);
    return n.replace(/\s+/g, " ").trim();
  }

  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function insertAtCursor(field, text) {
    var start = field.selectionStart;
    var end = field.selectionEnd;
    var value = field.value;
    field.value = value.slice(0, start) + text + value.slice(end);
    var pos = start + text.length;
    field.selectionStart = field.selectionEnd = pos;
    field.focus();
  }

  function pickItems(items, count, mode) {
    var copy = items.slice();
    if (mode === "random") {
      for (var i = copy.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = copy[i];
        copy[i] = copy[j];
        copy[j] = tmp;
      }
      return copy.slice(0, count);
    }
    return copy.slice(0, count);
  }

  function itemPlainText(item) {
    return String(item.html || "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();
  }

  function resolveExplainPresentSimple(sectionId, text, answer) {
    if (sectionId === "ex1") {
      return "After he, she, it, or a singular subject, add -s, -es, or -ies.";
    }
    if (sectionId === "ex2") {
      if (text.indexOf("majority of") >= 0) {
        return "The real subject is the plural noun after of (e.g. respondents) — use a plural verb, no -s.";
      }
      if (text.indexOf("neither") >= 0) {
        return "After Neither + singular noun, use a singular verb (-s).";
      }
      if (/\b(each|every)\b/.test(text)) {
        return "Each/Every + singular noun → singular verb (-s).";
      }
      if (/\bmost (students|employees|people|respondents|analysts)\b/.test(text) || /\bmost \w+/.test(text)) {
        return "Most + plural noun → plural verb (no -s).";
      }
      if (/\b(several|many|both|findings|regulations|factors|stakeholders)\b/.test(text)) {
        return "Plural subject → base verb without -s.";
      }
      if (/\b(she|he|it|committee|board|shop|train|cat|baby|law|report|ceo|director|author|policy|framework|evidence)\b/.test(text)) {
        return "Singular subject → verb + -s (or -es / -ies).";
      }
      if (/[^s]s$/.test(answer) || /ies$/.test(answer) || /es$/.test(answer)) {
        return "This subject is singular — add -s, -es, or -ies to the verb.";
      }
      return "Use the base verb (no -s) for plural subjects and I/you/we/they.";
    }
    if (sectionId === "ex3") {
      if (/^does not|^doesn't/.test(answer)) {
        return "Singular subject → doesn't (does not) + base verb.";
      }
      return "Plural subject / I/you/we/they → don't (do not) + base verb.";
    }
    if (sectionId === "ex4") {
      if (/^does /.test(answer)) {
        return "Singular subject → Does + subject + base verb?";
      }
      return "Plural subject → Do + subject + base verb?";
    }
    return "";
  }

  function resolveExplainPresentContinuous(sectionId, text, answer) {
    if (sectionId === "ex1") {
      return "Form the -ing spelling (e.g. drop final -e, double the consonant when needed).";
    }
    if (sectionId === "ex2") {
      if (/^is /.test(answer) || /^s /.test(answer)) {
        return "Singular subject → is + verb-ing.";
      }
      if (/^are /.test(answer) || /^re /.test(answer)) {
        return "Plural subject → are + verb-ing.";
      }
      if (/^am /.test(answer)) {
        return "I → am + verb-ing.";
      }
      if (text.indexOf("data") >= 0) {
        return "Data can be singular or plural; here match the answer shown (is/are + -ing).";
      }
      return "Match am / is / are to the subject, then add -ing.";
    }
    if (sectionId === "ex3") {
      if (/^is not|^isn't|^s not|^sn't/.test(answer)) {
        return "Singular → isn't / is not + verb-ing.";
      }
      if (/^are not|^aren't|^re not|^ren't/.test(answer)) {
        return "Plural → aren't / are not + verb-ing.";
      }
      if (/^am not/.test(answer)) {
        return "I → am not + verb-ing.";
      }
      return "Negative: am not / isn't / aren't + verb-ing.";
    }
    if (sectionId === "ex4") {
      if (/^is /.test(answer) || /^s /.test(answer)) {
        return "Singular → Is + subject + verb-ing?";
      }
      if (/^are /.test(answer) || /^re /.test(answer)) {
        return "Plural → Are + subject + verb-ing?";
      }
      if (/^am /.test(answer)) {
        return "I → Am + verb-ing?";
      }
      return "Question: Am / Is / Are + subject + verb-ing?";
    }
    return "";
  }

  function resolveExplain(item, sectionId) {
    if (item.explain) return item.explain;
    var text = itemPlainText(item);
    var answer = normalize((item.answers && item.answers[0]) || "");
    var mod = document.body.getAttribute("data-exercise-module") || "present-simple";
    if (mod === "present-continuous") {
      return resolveExplainPresentContinuous(sectionId, text, answer);
    }
    return resolveExplainPresentSimple(sectionId, text, answer);
  }

  function createInput(item, sectionId, index) {
    var answers = item.answers.join("|");
    var explain = resolveExplain(item, sectionId);
    var field;
    if (item.inputType === "sentence") {
      field = document.createElement("textarea");
      field.rows = 2;
      field.className = "exercise-input exercise-input--sentence";
    } else if (item.inputType === "phrase") {
      field = document.createElement("input");
      field.type = "text";
      field.className = "exercise-input exercise-input--phrase";
    } else {
      field = document.createElement("input");
      field.type = "text";
      field.className = "exercise-input exercise-input--short";
    }
    field.setAttribute("autocomplete", "off");
    field.setAttribute("spellcheck", "false");
    field.setAttribute("data-answers", answers);
    if (explain) field.setAttribute("data-explain", explain);
    field.setAttribute("data-section", sectionId);
    field.setAttribute("aria-label", sectionId + ", question " + (index + 1));
    return field;
  }

  function renderItem(item, sectionId, displayNum) {
    var wrap = document.createElement("div");
    wrap.className = "exercise-item";
    var html = item.html.replace(/<strong>\d+\.<\/strong>/, "<strong>" + displayNum + ".</strong>");
    var parts = html.split("{{input}}");
    var input = createInput(item, sectionId, displayNum - 1);
    if (parts[0]) {
      var before = document.createElement("span");
      before.innerHTML = parts[0];
      wrap.appendChild(before);
    }
    wrap.appendChild(input);
    if (parts[1]) {
      var after = document.createElement("span");
      after.innerHTML = parts[1];
      wrap.appendChild(after);
    }
    return wrap;
  }

  function renderAnswerKey(sectionsData) {
    var key = document.getElementById("answerKey");
    if (!key) return;
    key.innerHTML = "<h3>✅ Answer Key</h3>";
    sectionsData.forEach(function (block) {
      var sec = document.createElement("div");
      sec.className = "answer-section";
      var h4 = document.createElement("h4");
      h4.textContent = block.title;
      sec.appendChild(h4);
      block.items.forEach(function (item, i) {
        var row = document.createElement("div");
        row.className = "answer-item";
        row.innerHTML = "<strong>" + (i + 1) + ".</strong> " + item.answers.join(" / ");
        sec.appendChild(row);
      });
      key.appendChild(sec);
    });
  }

  function buildWorksheet(mode) {
    if (mode) config.mode = mode;
    refreshPool();
    if (!pool) return;
    var root = document.getElementById("exerciseSections");
    if (!root) return;
    root.innerHTML = "";
    var sectionsData = [];

    pool.sections.forEach(function (section, sIndex) {
      if (section.teacherPrintOnly || section.printType === "choice-grid" || section.printType === "transform-grid") {
        return;
      }
      var picked = pickItems(section.items, config.pickCount, config.mode);
      sectionsData.push({ title: section.title, items: picked });

      if (config.pageBreakAfterSection === sIndex) {
        var br = document.createElement("div");
        br.style.pageBreakBefore = "always";
        root.appendChild(br);
      }

      var secEl = document.createElement("div");
      secEl.className = "section";
      secEl.innerHTML =
        "<h2>" + section.title + "</h2>" +
        '<p class="section-instructions"><strong>Instructions:</strong> ' + section.instructions + "</p>";
      picked.forEach(function (item, i) {
        secEl.appendChild(renderItem(item, section.id, i + 1));
      });
      root.appendChild(secEl);
    });

    renderAnswerKey(sectionsData);
    renderBottomActions();
    clearCheckState();
    var result = document.getElementById("checkResult");
    if (result) result.hidden = true;
  }

  function renderBottomActions() {
    var bar = document.getElementById("exerciseActionsBottom");
    if (!bar) {
      bar = document.createElement("div");
      bar.id = "exerciseActionsBottom";
      bar.className = "exercise-actions exercise-actions--bottom";
      bar.setAttribute("aria-label", "Check answers at bottom of page");
    }
    bar.innerHTML =
      '<button type="button" class="check-btn check-btn--large" onclick="checkExercises()">✔️ Check answers</button>' +
      '<button type="button" class="new-set-btn" onclick="buildNewWorksheet()">🔄 New set</button>';

    var answerKey = document.getElementById("answerKey");
    if (answerKey && answerKey.parentNode && bar.nextElementSibling !== answerKey) {
      answerKey.parentNode.insertBefore(bar, answerKey);
    }
  }

  function clearAllAnswerHints() {
    document.querySelectorAll(".exercise-feedback").forEach(function (el) {
      el.remove();
    });
    document.querySelectorAll(".exercise-input").forEach(function (el) {
      el.classList.remove("exercise-input--correct", "exercise-input--incorrect");
      el.removeAttribute("data-hint-visible");
    });
  }

  function clearCheckState() {
    document.body.classList.remove("exercise-checked");
    clearAllAnswerHints();
  }

  function hideAnswerKeyPanel() {
    var key = document.getElementById("answerKey");
    if (key) {
      key.classList.remove("active");
    }
  }

  function onExerciseFieldRetry(field) {
    if (!document.body.classList.contains("exercise-checked")) {
      return;
    }
    if (!field || !field.classList.contains("exercise-input")) {
      return;
    }
    if (!document.querySelector(".exercise-feedback")) {
      return;
    }
    clearAllAnswerHints();
    hideAnswerKeyPanel();
  }

  function markFieldHintVisible(field) {
    field.setAttribute("data-hint-visible", "1");
  }

  function matchesAnswer(userValue, answers) {
    var u = normalizeForMatch(userValue);
    if (!u) return false;
    return answers.some(function (ans) {
      return normalizeForMatch(ans) === u;
    });
  }

  function showInlineFeedback(field, ok, answers) {
    var item = field.closest(".exercise-item");
    if (!item) return;
    var existing = item.querySelector(".exercise-feedback");
    if (existing) existing.remove();

    var fb = document.createElement("div");
    fb.className = "exercise-feedback " + (ok ? "exercise-feedback--ok" : "exercise-feedback--miss");
    var html =
      (ok ? "✅ " : "📝 ") +
      "<strong>Correct answer:</strong> " +
      escapeHtml(answers.join(" / "));
    if (!ok) {
      var explain = field.getAttribute("data-explain");
      if (explain) {
        html +=
          '<p class="exercise-feedback-tip"><strong>Tip:</strong> ' + escapeHtml(explain) + "</p>";
      }
    }
    fb.innerHTML = html;
    item.appendChild(fb);
    markFieldHintVisible(field);
  }

  var MOTIVATION_LEVELS = [
    {
      id: 1,
      status: "Keep going",
      message: "Every try helps you learn. Review the hints below and have another go.",
      resultClass: "check-result--level-1"
    },
    {
      id: 2,
      status: "Try harder",
      message: "You are building skills — focus on the red fields and try again.",
      resultClass: "check-result--level-2"
    },
    {
      id: 3,
      status: "Good effort",
      message: "Solid work. A bit more practice and you will move up to the next level.",
      resultClass: "check-result--level-3"
    },
    {
      id: 4,
      status: "Well done",
      message: "Strong result! Check the few mistakes and aim for a perfect run.",
      resultClass: "check-result--level-4"
    },
    {
      id: 5,
      status: "Excellent",
      message: "Almost perfect — brilliant Present Simple practice!",
      resultClass: "check-result--level-5"
    }
  ];

  function getMotivationLevel(correct, total) {
    if (total === 0) return MOTIVATION_LEVELS[0];
    if (correct === total) {
      return {
        id: 5,
        status: "Perfect job",
        message: "Outstanding! You answered every question correctly. 🎉",
        resultClass: "check-result--level-5 check-result--perfect"
      };
    }
    var percent = (correct / total) * 100;
    if (percent < 20) return MOTIVATION_LEVELS[0];
    if (percent < 40) return MOTIVATION_LEVELS[1];
    if (percent < 60) return MOTIVATION_LEVELS[2];
    if (percent < 80) return MOTIVATION_LEVELS[3];
    return MOTIVATION_LEVELS[4];
  }

  function renderMotivationProgress(levelId) {
    var html = '<div class="motivation-progress" aria-label="Progress level ' + levelId + ' of 5">';
    for (var i = 1; i <= 5; i++) {
      html +=
        '<span class="motivation-step' +
        (i <= levelId ? " motivation-step--active" : "") +
        '"></span>';
    }
    html += "</div>";
    return html;
  }

  function showCheckResult(correct, total) {
    var result = document.getElementById("checkResult");
    if (!result) return;

    var level = getMotivationLevel(correct, total);
    result.hidden = false;
    result.className = "check-result " + level.resultClass;
    result.innerHTML =
      renderMotivationProgress(level.id) +
      '<p class="motivation-status">' +
      escapeHtml(level.status) +
      "</p>" +
      '<p class="motivation-score">' +
      correct +
      " out of " +
      total +
      " correct</p>" +
      '<p class="motivation-message">' +
      escapeHtml(level.message) +
      "</p>";
  }

  function checkExercises() {
    var fields = document.querySelectorAll(".exercise-input[data-answers]");
    var correct = 0;
    var total = fields.length;

    document.body.classList.add("exercise-checked");

    fields.forEach(function (field) {
      var answers = field.getAttribute("data-answers").split("|");
      var ok = matchesAnswer(field.value, answers);
      field.classList.remove("exercise-input--correct", "exercise-input--incorrect");
      field.classList.add(ok ? "exercise-input--correct" : "exercise-input--incorrect");
      showInlineFeedback(field, ok, answers);
      if (ok) correct++;
    });

    showCheckResult(correct, total);

    var resultEl = document.getElementById("checkResult");
    if (resultEl) {
      resultEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    return { correct: correct, total: total };
  }

  window.checkExercises = checkExercises;
  window.buildNewWorksheet = function () {
    buildWorksheet("random");
  };

  document.addEventListener("keydown", function (e) {
    var field = e.target;
    if (!field.classList || !field.classList.contains("exercise-input")) {
      return;
    }
    var isApostropheShortcut =
      (e.altKey && (e.key === "." || e.code === "Period")) ||
      (e.ctrlKey && (e.key === "'" || e.key === "`" || e.code === "Quote"));
    if (isApostropheShortcut) {
      e.preventDefault();
      insertAtCursor(field, "'");
      onExerciseFieldRetry(field);
    }
  });

  document.addEventListener(
    "focusin",
    function (e) {
      onExerciseFieldRetry(e.target);
    },
    true
  );

  document.addEventListener(
    "input",
    function (e) {
      onExerciseFieldRetry(e.target);
    },
    true
  );

  document.addEventListener(
    "keydown",
    function (e) {
      if (!document.body.classList.contains("exercise-checked")) {
        return;
      }
      var field = e.target;
      if (!field.classList || !field.classList.contains("exercise-input")) {
        return;
      }
      if (e.key === "Backspace" || e.key === "Delete" || e.key.length === 1) {
        onExerciseFieldRetry(field);
      }
    },
    true
  );

  document.addEventListener("DOMContentLoaded", function () {
    var page = document.body.getAttribute("data-exercise-page");
    if (!page) return;
    config.mode = "random";
    var urlLevel = getLevelFromUrl();
    if (urlLevel) {
      document.body.setAttribute("data-exercise-level", urlLevel);
    } else if (!document.body.getAttribute("data-exercise-level")) {
      document.body.setAttribute("data-exercise-level", "b1");
    }
    var level = document.body.getAttribute("data-exercise-level") || "b1";
    updateLevelUI(level);
    document.querySelectorAll(".practice-level-tab").forEach(function (btn) {
      btn.addEventListener("click", function () {
        setExerciseLevel(btn.getAttribute("data-level"));
      });
    });
    buildWorksheet(config.mode);
  });
})();
