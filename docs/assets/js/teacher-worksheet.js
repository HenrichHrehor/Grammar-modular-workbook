(function () {
  var PASSWORD = "AABBHH";
  var STORAGE_KEYS = { b1: "grammar_wb_b1_unlock", b2: "grammar_wb_b2_unlock" };

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
    var start = ((versionNum - 1) * 2) % Math.max(1, copy.length - count + 1);
    return copy.slice(start, start + count);
  }

  function blankForType(inputType) {
    var cls = "print-blank";
    if (inputType === "phrase") cls += " print-blank--phrase";
    if (inputType === "sentence") cls += " print-blank--sentence";
    var width = inputType === "sentence" ? "________________________" : inputType === "phrase" ? "____________________" : "_____________";
    return '<span class="' + cls + '">' + width + "</span>";
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

    var sheetHtml = '<div class="print-worksheet-header">';
    sheetHtml += "<div><strong>Student:</strong> " + (nameVal || "________________________") + "</div>";
    sheetHtml += '<div><strong>Date:</strong> ' + (worksheetDate || "___________") + "</div>";
    sheetHtml += '<div class="print-meta"><strong>Level:</strong> ' + level.toUpperCase();
    sheetHtml += "<br><strong>Version:</strong> " + versionId + "</div></div>";
    sheetHtml += "<h1>Present Simple — " + level.toUpperCase() + " Worksheet</h1>";
    sheetHtml += '<p class="subtitle">Printable A4 practice (write answers on the lines)</p>';

    pool.sections.forEach(function (section, sIndex) {
      var picked = pickItems(section.items, 5, versionMode, level);
      sectionsData.push({ title: section.title, items: picked });
      if (sIndex === 2) {
        sheetHtml += '<div style="page-break-before:always"></div>';
      }
      sheetHtml += '<div class="section"><h2>' + section.title + "</h2>";
      sheetHtml += '<p class="section-instructions"><strong>Instructions:</strong> ' + section.instructions + "</p>";
      picked.forEach(function (item, i) {
        sheetHtml += '<div class="exercise-item">' + renderPrintItem(item, i + 1) + "</div>";
      });
      sheetHtml += "</div>";
    });

    var selectedGrade = document.querySelector('input[name="teacherGrade"]:checked');
    var gradeNum = selectedGrade ? selectedGrade.value : "";
    var gradeNote = gradeNum ? GRADE_LABELS[gradeNum] : "Teacher assessment";

    sheetHtml += '<div class="print-grade-row"><strong>Assessment scale (1–5):</strong> ' + gradeNote;
    sheetHtml += '<div class="print-grade-circles">';
    for (var g = 1; g <= 5; g++) {
      sheetHtml += "<span><span class=\"circle\"></span> " + g + "</span>";
    }
    sheetHtml += "</div></div>";

    root.innerHTML = sheetHtml;

    if (answerRoot) {
      answerRoot.innerHTML = "<h3>✅ Answer Key — " + versionId + "</h3>";
      sectionsData.forEach(function (block) {
        answerRoot.innerHTML += "<h4>" + block.title + "</h4>";
        block.items.forEach(function (item, i) {
          answerRoot.innerHTML +=
            '<div class="print-answer-item"><strong>' + (i + 1) + ".</strong> " + item.answers.join(" / ") + "</div>";
        });
      });
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
  window.printTeacherSheet = function () {
    window.print();
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
  });
})();
