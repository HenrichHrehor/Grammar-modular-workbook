(function () {
  var pool = window.PRESENT_SIMPLE_POOL;
  if (!pool) return;

  var config = {
    pickCount: 5,
    mode: "first",
    pageBreakAfterSection: 1
  };

  function normalize(text) {
    return String(text || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ")
      .replace(/[''`´]/g, "'");
  }

  function stripApostrophes(text) {
    return text.replace(/'/g, "");
  }

  function expandNoApostropheForms(text) {
    return text
      .replace(/\bdont\b/g, "do not")
      .replace(/\bdoesnt\b/g, "does not")
      .replace(/\bdidnt\b/g, "did not")
      .replace(/\bwont\b/g, "will not")
      .replace(/\bcant\b/g, "can not")
      .replace(/\bisnt\b/g, "is not")
      .replace(/\barent\b/g, "are not");
  }

  function normalizeForMatch(text) {
    var n = normalize(text);
    n = expandNoApostropheForms(stripApostrophes(n));
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

  function createInput(item, sectionId, index) {
    var answers = item.answers.join("|");
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
    var root = document.getElementById("exerciseSections");
    if (!root) return;
    root.innerHTML = "";
    var sectionsData = [];

    pool.sections.forEach(function (section, sIndex) {
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
    fb.innerHTML =
      (ok ? "✅ " : "📝 ") +
      "<strong>Correct answer:</strong> " +
      escapeHtml(answers.join(" / "));
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
    if (page === "v2") {
      config.mode = "random";
    } else {
      config.mode = "first";
    }
    buildWorksheet(config.mode);
  });
})();
