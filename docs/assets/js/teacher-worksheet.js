(function () {
  var PASSWORD = "AABBHH";
  var STORAGE_KEYS = { b1: "grammar_wb_b1_unlock", b2: "grammar_wb_b2_unlock" };

  var PRINT_ITEMS_PER_SECTION = 5;
  var SECTION_POINTS = 5;
  var TOTAL_POINTS = 20;
  var WORKSHEET_LAYOUT_TAG = "5Q-SCORE-v2";

  var SECTION_PRINT_LABELS = {
    ex1: { title: "1. -s / -es / -ies", hint: "he/she/it" },
    ex2: { title: "2. Affirmative", hint: "verb in ( )" },
    ex3: { title: "3. Negative", hint: "don't / doesn't" },
    ex4: { title: "4. Questions", hint: "Do / Does" }
  };

  var GRADE_LABELS = {
    1: "Needs more practice",
    2: "Developing",
    3: "Satisfactory",
    4: "Good",
    5: "Excellent"
  };

  function getLevel() {
    return document.body.getAttribute("data-teacher-level");
  }

  function getPool() {
    return window.PRESENT_SIMPLE_POOL;
  }

  function pickItems(items, count, mode, level) {
    var copy = items.slice();
    if (level === "b2") {
      copy = items.slice(5);
      if (copy.length < count) copy = items.slice();
    }
    if (mode === "random") {
      for (var i = copy.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var t = copy[i];
        copy[i] = copy[j];
        copy[j] = t;
      }
      return copy.slice(0, count);
    }
    var versionNum = parseInt(mode, 10) || 1;
    var start = ((versionNum - 1) * count) % Math.max(1, copy.length - count + 1);
    return copy.slice(start, start + count);
  }

  function blankForType(inputType) {
    var cls = "print-blank";
    if (inputType === "phrase") cls += " print-blank--phrase";
    if (inputType === "sentence") cls += " print-blank--sentence";
    var width =
      inputType === "sentence" ? "_____________" : inputType === "phrase" ? "___________" : "_______";
    return '<span class="' + cls + '">' + width + "</span>";
  }

  function printScoreLine(maxPoints) {
    return (
      '<p class="print-section-score">' +
      '<span class="print-score-dots">................</span>' +
      "<span class=\"print-score-label\"> / " +
      maxPoints +
      " points</span></p>"
    );
  }

  function renderPrintItem(item, num) {
    var html = item.html.replace(/<strong>\d+\.<\/strong>/, "<strong>" + num + ".</strong>");
    return html.replace(/\{\{input\}\}/g, blankForType(item.inputType));
  }

  function buildVersionId(level, versionMode) {
    var d = new Date();
    var dateStr = d.getFullYear() + "" + String(d.getMonth() + 1).padStart(2, "0") + String(d.getDate()).padStart(2, "0");
    var tag = versionMode === "random" ? "R" + Math.floor(Math.random() * 90 + 10) : "V" + versionMode;
    return level.toUpperCase() + "-" + dateStr + "-" + tag;
  }

  function renderWorksheet(level, versionMode) {
    var pool = getPool();
    var root = document.getElementById("printWorksheet");
    var answerRoot = document.getElementById("printAnswerKey");
    if (!pool || !root) return;

    var versionId = buildVersionId(level, versionMode);
    var dateInput = document.getElementById("teacherDate");
    var studentName = document.getElementById("teacherStudentName");
    var worksheetDate = dateInput ? dateInput.value : "";
    var nameVal = studentName ? studentName.value.trim() : "";
    var sectionsData = [];

    var sheetHtml = '<div class="print-worksheet-header print-worksheet-header--one-line">';
    sheetHtml +=
      "<span><strong>St:</strong> " +
      (nameVal || "________________") +
      " &nbsp; <strong>Date:</strong> " +
      (worksheetDate || "________") +
      ' &nbsp; <span class="print-meta"><strong>' +
      level.toUpperCase() +
      "</strong> · " +
      versionId +
      " · " +
      WORKSHEET_LAYOUT_TAG +
      "</span></span></div>";
    sheetHtml += '<h1 class="print-title">Present Simple — ' + level.toUpperCase() + "</h1>";
    sheetHtml += '<div class="print-worksheet-grid">';

    pool.sections.forEach(function (section) {
      var picked = pickItems(section.items, PRINT_ITEMS_PER_SECTION, versionMode, level);
      var labels = SECTION_PRINT_LABELS[section.id] || { title: section.title, hint: "" };
      sectionsData.push({ title: section.title, items: picked });
      var sectionTitle = labels.title;
      if (labels.hint) {
        sectionTitle += ' <span class="section-hint-inline">(' + labels.hint + ")</span>";
      }
      sheetHtml += '<div class="section section--compact"><h2>' + sectionTitle + "</h2>";
      picked.forEach(function (item, i) {
        sheetHtml +=
          '<div class="exercise-item exercise-item--compact">' + renderPrintItem(item, i + 1) + "</div>";
      });
      sheetHtml += printScoreLine(SECTION_POINTS);
      sheetHtml += "</div>";
    });

    sheetHtml += "</div>";
    sheetHtml +=
      '<div class="print-total-score"><strong>Total score:</strong> ' +
      '<span class="print-score-dots">................</span>' +
      '<span class="print-score-label"> / ' +
      TOTAL_POINTS +
      " points</div>";

    var selectedGrade = document.querySelector('input[name="teacherGrade"]:checked');
    var gradeNum = selectedGrade ? selectedGrade.value : "";
    var gradeNote = gradeNum ? GRADE_LABELS[gradeNum] : "Teacher assessment";

    sheetHtml +=
      '<div class="print-grade-row print-grade-row--compact"><span><strong>Grade:</strong> ' +
      gradeNote +
      "</span>";
    sheetHtml += '<span class="print-grade-circles">';
    for (var g = 1; g <= 5; g++) {
      sheetHtml += '<span><span class="circle"></span>' + g + "</span>";
    }
    sheetHtml += "</span></div>";

    root.innerHTML = sheetHtml;

    if (answerRoot) {
      var keyHtml =
        "<h3>✅ Answer Key (reverse side) — " +
        versionId +
        '</h3><p class="print-subtitle">Turn the sheet over — same version ID as the worksheet</p>';
      sectionsData.forEach(function (block) {
        keyHtml += "<h4>" + block.title + "</h4><div class=\"print-answer-grid\">";
        block.items.forEach(function (item, i) {
          keyHtml +=
            '<div class="print-answer-item"><strong>' + (i + 1) + ".</strong> " + item.answers.join(" / ") + "</div>";
        });
        keyHtml += "</div>";
      });
      answerRoot.innerHTML = keyHtml;
    }

    var versionLabel = document.getElementById("versionLabel");
    if (versionLabel) versionLabel.textContent = versionId;
  }

  function togglePrintAnswerKey() {
    var key = document.getElementById("printAnswerKey");
    var btn = document.getElementById("btnTogglePrintAnswers");
    if (!key) return;
    key.classList.toggle("visible");
    if (btn) {
      btn.textContent = key.classList.contains("visible") ? "Hide answer key" : "Show answer key";
    }
  }

  function refreshWorksheetFromPanel() {
    var versionSelect = document.getElementById("versionSelect");
    buildWorksheet(versionSelect ? versionSelect.value : "1");
  }

  function unlock(level) {
    var key = STORAGE_KEYS[level];
    sessionStorage.setItem(key, "1");
    showApp();
  }

  function showApp() {
    var gate = document.getElementById("teacherGate");
    var app = document.getElementById("teacherApp");
    if (gate) gate.hidden = true;
    if (app) app.hidden = false;
    var today = new Date().toISOString().slice(0, 10);
    var teacherDate = document.getElementById("teacherDate");
    if (teacherDate && !teacherDate.value) teacherDate.value = today;
    refreshWorksheetFromPanel();
  }

  function tryGate() {
    var input = document.getElementById("gatePassword");
    var err = document.getElementById("gateError");
    if (!input) return;
    if (input.value === PASSWORD) {
      unlock(getLevel());
      if (err) err.textContent = "";
    } else if (err) {
      err.textContent = "Incorrect password. Try again.";
    }
  }

  function buildWorksheet(mode) {
    var level = getLevel();
    if (!level) return;
    renderWorksheet(level, mode || "1");
  }

  window.buildTeacherWorksheet = buildWorksheet;
  window.togglePrintAnswerKey = togglePrintAnswerKey;
  function setPrintMode(mode) {
    document.body.classList.remove("printing-worksheet", "printing-answers");
    if (mode) {
      document.body.classList.add(mode);
    }
  }

  window.printTeacherSheet = function () {
    setPrintMode("printing-worksheet");
    window.print();
    setTimeout(function () {
      setPrintMode("");
    }, 500);
  };

  window.printAnswerKeyReverse = function () {
    var key = document.getElementById("printAnswerKey");
    if (key) {
      key.classList.add("visible");
    }
    setPrintMode("printing-answers");
    window.print();
    setTimeout(function () {
      setPrintMode("");
    }, 500);
  };

  document.addEventListener("DOMContentLoaded", function () {
    var level = getLevel();
    if (!level) return;

    var gateBtn = document.getElementById("gateSubmit");
    var gateInput = document.getElementById("gatePassword");
    if (gateBtn) gateBtn.addEventListener("click", tryGate);
    if (gateInput) {
      gateInput.addEventListener("keydown", function (e) {
        if (e.key === "Enter") tryGate();
      });
    }

    if (sessionStorage.getItem(STORAGE_KEYS[level]) === "1") {
      showApp();
    }

    var btnGen = document.getElementById("btnGenerate");
    var versionSelect = document.getElementById("versionSelect");
    if (btnGen) {
      btnGen.addEventListener("click", function () {
        buildWorksheet(versionSelect ? versionSelect.value : "random");
      });
    }
    if (versionSelect) {
      versionSelect.addEventListener("change", function () {
        buildWorksheet(versionSelect.value);
      });
    }

    var teacherDate = document.getElementById("teacherDate");
    if (teacherDate) {
      teacherDate.addEventListener("change", refreshWorksheetFromPanel);
    }

    var studentName = document.getElementById("teacherStudentName");
    if (studentName) {
      studentName.addEventListener("change", refreshWorksheetFromPanel);
    }

    document.querySelectorAll('input[name="teacherGrade"]').forEach(function (radio) {
      radio.addEventListener("change", refreshWorksheetFromPanel);
    });

    var btnAnswers = document.getElementById("btnTogglePrintAnswers");
    if (btnAnswers) btnAnswers.addEventListener("click", togglePrintAnswerKey);

    var btnPrint = document.getElementById("btnPrintSheet");
    if (btnPrint) btnPrint.addEventListener("click", window.printTeacherSheet);

    var btnPrintReverse = document.getElementById("btnPrintAnswerReverse");
    if (btnPrintReverse) btnPrintReverse.addEventListener("click", window.printAnswerKeyReverse);
  });
})();
