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
      .replace(/['']/g, "'");
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
    clearCheckState();
    var result = document.getElementById("checkResult");
    if (result) result.hidden = true;
  }

  function clearCheckState() {
    document.querySelectorAll(".exercise-input").forEach(function (el) {
      el.classList.remove("exercise-input--correct", "exercise-input--incorrect");
    });
  }

  function matchesAnswer(userValue, answers) {
    var u = normalize(userValue);
    if (!u) return false;
    return answers.some(function (ans) {
      return normalize(ans) === u;
    });
  }

  function checkExercises() {
    var fields = document.querySelectorAll(".exercise-input[data-answers]");
    var correct = 0;
    var total = fields.length;

    fields.forEach(function (field) {
      var answers = field.getAttribute("data-answers").split("|");
      var ok = matchesAnswer(field.value, answers);
      field.classList.remove("exercise-input--correct", "exercise-input--incorrect");
      field.classList.add(ok ? "exercise-input--correct" : "exercise-input--incorrect");
      if (ok) correct++;
    });

    var result = document.getElementById("checkResult");
    if (result) {
      result.hidden = false;
      result.className = "check-result " + (correct === total ? "check-result--success" : "check-result--partial");
      result.textContent =
        correct === total
          ? "✅ Excellent! All " + total + " answers are correct."
          : "You got " + correct + " out of " + total + " correct. Review the highlighted fields and try again.";
    }
    return { correct: correct, total: total };
  }

  window.checkExercises = checkExercises;
  window.buildNewWorksheet = function () {
    buildWorksheet("random");
  };

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
