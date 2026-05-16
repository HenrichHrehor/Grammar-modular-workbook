(function () {
  var PASSWORD = "AABBHH";
  var STORAGE_KEYS = {
    b1: "grammar_wb_b1_unlock",
    b2: "grammar_wb_b2_unlock",
    c1: "grammar_wb_c1_unlock"
  };

  var PRINT_ITEMS_PER_SECTION = 5;
  var SECTION_POINTS = 5;
  var TRANSFORM_GRID_POINTS = 4;
  var WRITING_POINTS = 5;
  var TOTAL_POINTS = 29;
  var WORKSHEET_LAYOUT_BASE = "6PART-v6";
  var WORKSHEET_LAYOUT_B1 = "6PART-v7";
  var TRANSFORM_GRID_COUNT = 4;
  var WRITING_LINE_COUNT = 6;
  var PRINTABLE_MAX_HEIGHT_PX = 1039;

  var SECTION_PRINT_LABELS = {
    ex1: { title: "1. -s / -es / -ies", hint: "he/she/it" },
    ex2: { title: "2. Affirmative", hint: "verb in ( )" },
    ex3: { title: "3. Negative", hint: "don't / doesn't" },
    ex4: { title: "4. Questions", hint: "Do / Does" },
    ex5: {
      title: "5. Transform the sentence",
      hint: "follow the instruction under each sentence"
    }
  };

  var GRADE_LABELS = {
    1: "Needs more practice",
    2: "Developing",
    3: "Satisfactory",
    4: "Good",
    5: "Excellent"
  };

  var B1_GRADE_LABELS = {
    1: "Excellent — pass",
    2: "Good — pass",
    3: "Satisfactory — pass",
    4: "Borderline",
    5: "Not pass"
  };

  var B1_SCORE_INPUTS = [
    { id: "scoreEx1", max: 5 },
    { id: "scoreEx2", max: 5 },
    { id: "scoreEx3", max: 5 },
    { id: "scoreEx4", max: 5 },
    { id: "scoreEx5", max: 4 },
    { id: "scoreEx6", max: 5 }
  ];

  function getLevel() {
    return document.body.getAttribute("data-teacher-level");
  }

  function getPool(level) {
    var pools = window.PRESENT_SIMPLE_POOLS;
    var key = level || getLevel();
    if (pools && key && pools[key]) return pools[key];
    return window.PRESENT_SIMPLE_POOL;
  }

  function getWritingSection(level) {
    var pool = getPool(level);
    if (pool && pool.writing) return pool.writing;
    return {
      id: "ex6",
      title: "6. Writing",
      hint: "Write 5–6 sentences. Use present simple.",
      sampleAnswer: "",
      points: WRITING_POINTS
    };
  }

  function isB1Level(level) {
    return (level || getLevel()) === "b1";
  }

  function getLayoutTag(level) {
    var label = (level || getLevel() || "b1").toUpperCase();
    var base = isB1Level(level) ? WORKSHEET_LAYOUT_B1 : WORKSHEET_LAYOUT_BASE;
    return label + "-" + base;
  }

  function calculateGradeFromTotal(total, maxTotal) {
    var pct = maxTotal > 0 ? (total / maxTotal) * 100 : 0;
    if (pct >= 90) return 1;
    if (pct >= 75) return 2;
    if (pct >= 60) return 3;
    if (pct >= 50) return 4;
    return 5;
  }

  function getB1ScoresFromPanel() {
    var total = 0;
    var hasAny = false;
    B1_SCORE_INPUTS.forEach(function (cfg) {
      var el = document.getElementById(cfg.id);
      if (!el || el.value === "") return;
      hasAny = true;
      var val = parseInt(el.value, 10);
      if (isNaN(val)) val = 0;
      total += Math.max(0, Math.min(cfg.max, val));
    });
    if (!hasAny) return { total: null, grade: null };
    return {
      total: total,
      grade: calculateGradeFromTotal(total, TOTAL_POINTS)
    };
  }

  function updateB1ScoreCalculatorDisplay() {
    var totalEl = document.getElementById("scoreTotalDisplay");
    var gradeEl = document.getElementById("scoreGradeDisplay");
    var noteEl = document.getElementById("scoreGradeNote");
    if (!totalEl) return;
    var result = getB1ScoresFromPanel();
    if (result.total === null) {
      totalEl.textContent = "—";
      if (gradeEl) gradeEl.textContent = "—";
      if (noteEl) noteEl.textContent = "";
      return;
    }
    totalEl.textContent = String(result.total);
    if (gradeEl) gradeEl.textContent = String(result.grade);
    if (noteEl) noteEl.textContent = " (" + B1_GRADE_LABELS[result.grade] + ")";
  }

  function applyB1ScoreToWorksheet() {
    var result = getB1ScoresFromPanel();
    if (result.total === null) {
      window.alert("Enter points for at least one part, then apply.");
      return;
    }
    var root = document.getElementById("printWorksheet");
    if (!root) return;
    var totalScore = root.querySelector(".print-total-score");
    if (totalScore) {
      totalScore.innerHTML =
        "<strong>Total score:</strong> " +
        '<span class="print-score-value">' +
        result.total +
        "</span>" +
        '<span class="print-score-label"> / ' +
        TOTAL_POINTS +
        " points</span>";
    }
    var gradeRow = root.querySelector(".print-grade-row");
    if (gradeRow) {
      var gradeNote = B1_GRADE_LABELS[result.grade];
      var circlesHtml = '<span class="print-grade-circles">';
      for (var g = 1; g <= 5; g++) {
        var filled = g === result.grade ? " circle--filled" : "";
        circlesHtml += "<span><span class=\"circle" + filled + '"></span>' + g + "</span>";
      }
      circlesHtml += "</span>";
      gradeRow.innerHTML =
        "<span><strong>Grade:</strong> " + gradeNote + " (" + result.grade + ")</span>" + circlesHtml;
    }
    syncWorksheetHtmlCode();
  }

  function updatePrintHeightMonitor() {
    var monitor = document.getElementById("printHeightMonitor");
    var root = document.getElementById("printWorksheet");
    if (!monitor || !root || !isB1Level()) return;
    window.requestAnimationFrame(function () {
      var h = root.scrollHeight;
      var ok = h <= PRINTABLE_MAX_HEIGHT_PX;
      monitor.className =
        "print-height-monitor" + (ok ? " print-height-monitor--ok" : " print-height-monitor--over");
      monitor.textContent =
        "Page height: " +
        h +
        " px / " +
        PRINTABLE_MAX_HEIGHT_PX +
        " px max" +
        (ok ? " — fits on one sheet" : " — OVER LIMIT (reduce spacing or content)");
    });
  }

  function getGradeForPrint(level) {
    if (isB1Level(level)) {
      var scored = getB1ScoresFromPanel();
      if (scored.grade !== null) {
        return { num: scored.grade, note: B1_GRADE_LABELS[scored.grade] };
      }
      return { num: "", note: "1 = best · 5 = not pass" };
    }
    var selectedGrade = document.querySelector('input[name="teacherGrade"]:checked');
    var gradeNum = selectedGrade ? selectedGrade.value : "";
    return {
      num: gradeNum,
      note: gradeNum ? GRADE_LABELS[gradeNum] : "Teacher assessment"
    };
  }

  function pickItems(items, count, mode, level) {
    var copy = items.slice();
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

  function pickTransformItems(items, mode, level) {
    var negatives = [];
    var questions = [];
    items.forEach(function (item) {
      if (item.transformType === "question") {
        questions.push(item);
      } else {
        negatives.push(item);
      }
    });
    var pickedNeg = pickItems(negatives, 2, mode, level);
    var pickedQ = pickItems(questions, 2, mode, level);
    return [pickedNeg[0], pickedNeg[1], pickedQ[0], pickedQ[1]];
  }

  function blankForType(inputType, level, sectionId) {
    var cls = "print-blank";
    var roomy = isB1Level(level) && (sectionId === "ex3" || sectionId === "ex4");
    if (inputType === "phrase") cls += " print-blank--phrase";
    if (inputType === "sentence") cls += " print-blank--sentence";
    if (roomy) cls += " print-blank--roomy";
    var width;
    if (roomy) {
      width =
        inputType === "sentence"
          ? "___________________"
          : inputType === "phrase"
            ? "_________________"
            : "___________";
    } else {
      width =
        inputType === "sentence" ? "_____________" : inputType === "phrase" ? "___________" : "_______";
    }
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

  function renderPrintItem(item, num, level, sectionId) {
    var html = item.html.replace(/<strong>\d+\.<\/strong>/, "<strong>" + num + ".</strong>");
    return html.replace(/\{\{input\}\}/g, blankForType(item.inputType, level, sectionId));
  }

  function renderTransformLine() {
    return '<div class="print-transform-line" aria-hidden="true"></div>';
  }

  function renderTransformCell(item, num) {
    var mode = item.transformType === "question" ? "question" : "negative";
    return (
      '<div class="print-transform-cell print-transform-cell--' +
      mode +
      '">' +
      '<p class="print-transform-affirmative"><strong>' +
      num +
      ".</strong> " +
      item.affirmative +
      "</p>" +
      '<p class="print-transform-instruction"><em>' +
      item.instruction +
      "</em></p>" +
      renderTransformLine() +
      "</div>"
    );
  }

  function renderTransformGridSection(picked, sectionTitle) {
    var html =
      '<div class="section section--compact section--transform-grid"><h2>' +
      sectionTitle +
      "</h2>";
    html += '<div class="print-transform-grid">';
    picked.forEach(function (item, i) {
      html += renderTransformCell(item, i + 1);
    });
    html += "</div>";
    html += printScoreLine(TRANSFORM_GRID_POINTS);
    html += "</div>";
    return html;
  }

  function renderWritingSection(level) {
    var writing = getWritingSection(level);
    var lines = "";
    for (var i = 0; i < WRITING_LINE_COUNT; i++) {
      lines += '<div class="print-writing-line" aria-hidden="true"></div>';
    }
    return (
      '<div class="section section--compact section--writing">' +
      "<h2>" +
      writing.title +
      '</h2><p class="section-writing-hint">' +
      writing.hint +
      "</p>" +
      '<div class="print-writing-area">' +
      lines +
      "</div>" +
      printScoreLine(writing.points) +
      "</div>"
    );
  }

  function buildVersionId(level, versionMode) {
    var d = new Date();
    var dateStr = d.getFullYear() + "" + String(d.getMonth() + 1).padStart(2, "0") + String(d.getDate()).padStart(2, "0");
    var tag = versionMode === "random" ? "R" + Math.floor(Math.random() * 90 + 10) : "V" + versionMode;
    return level.toUpperCase() + "-" + dateStr + "-" + tag;
  }

  function renderWorksheet(level, versionMode) {
    var pool = getPool(level);
    var root = document.getElementById("printWorksheet");
    var answerRoot = document.getElementById("printAnswerKey");
    if (!pool || !root) return;

    var versionId = buildVersionId(level, versionMode);
    var dateInput = document.getElementById("teacherDate");
    var studentName = document.getElementById("teacherStudentName");
    var worksheetDate = dateInput ? dateInput.value : "";
    var nameVal = studentName ? studentName.value.trim() : "";
    var sectionsData = [];

    var headerClass = "print-worksheet-header print-worksheet-header--one-line";
    if (isB1Level(level)) headerClass += " print-worksheet-header--b1";
    var sheetHtml = '<div class="' + headerClass + '">';
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
      getLayoutTag(level) +
      "</span></span></div>";
    sheetHtml += '<h1 class="print-title">Present Simple — ' + level.toUpperCase() + "</h1>";
    sheetHtml += '<div class="print-worksheet-grid print-worksheet-grid--core">';

    pool.sections.forEach(function (section) {
      if (section.printType === "choice-grid" || section.printType === "transform-grid") return;
      var picked = pickItems(section.items, PRINT_ITEMS_PER_SECTION, versionMode, level);
      var labels = SECTION_PRINT_LABELS[section.id] || { title: section.title, hint: "" };
      sectionsData.push({ title: section.title, items: picked });
      var sectionTitle = labels.title;
      if (labels.hint) {
        sectionTitle += ' <span class="section-hint-inline">(' + labels.hint + ")</span>";
      }
      var sectionClass = "section section--compact";
      if (isB1Level(level) && (section.id === "ex3" || section.id === "ex4")) {
        sectionClass += " section--answer-roomy";
      }
      sheetHtml += '<div class="' + sectionClass + '"><h2>' + sectionTitle + "</h2>";
      picked.forEach(function (item, i) {
        var itemClass = "exercise-item exercise-item--compact";
        if (isB1Level(level) && (section.id === "ex3" || section.id === "ex4")) {
          itemClass += " exercise-item--roomy";
        }
        sheetHtml +=
          '<div class="' + itemClass + '">' + renderPrintItem(item, i + 1, level, section.id) + "</div>";
      });
      sheetHtml += printScoreLine(SECTION_POINTS);
      sheetHtml += "</div>";
    });

    sheetHtml += "</div>";

    sheetHtml += '<div class="print-worksheet-extra">';
    var transformSection = null;
    for (var sj = 0; sj < pool.sections.length; sj++) {
      if (pool.sections[sj].id === "ex5") {
        transformSection = pool.sections[sj];
        break;
      }
    }
    if (transformSection) {
      var pickedTransform = pickTransformItems(transformSection.items, versionMode, level);
      var transformLabels = SECTION_PRINT_LABELS.ex5;
      var transformTitle = transformLabels.title;
      if (transformLabels.hint) {
        transformTitle += ' <span class="section-hint-inline">(' + transformLabels.hint + ")</span>";
      }
      sectionsData.push({
        title: transformSection.title,
        items: pickedTransform,
        isTransform: true
      });
      sheetHtml += renderTransformGridSection(pickedTransform, transformTitle);
    }

    var writingMeta = getWritingSection(level);
    sectionsData.push({
      title: writingMeta.title,
      isWriting: true,
      sampleAnswer: writingMeta.sampleAnswer
    });
    sheetHtml += renderWritingSection(level);
    sheetHtml += "</div>";

    sheetHtml +=
      '<div class="print-total-score"><strong>Total score:</strong> ' +
      '<span class="print-score-dots">................</span>' +
      '<span class="print-score-label"> / ' +
      TOTAL_POINTS +
      " points</span></div>";

    var gradeInfo = getGradeForPrint(level);

    sheetHtml +=
      '<div class="print-grade-row print-grade-row--compact"><span><strong>Grade:</strong> ' +
      gradeInfo.note +
      "</span>";
    sheetHtml += '<span class="print-grade-circles">';
    for (var g = 1; g <= 5; g++) {
      var filled = gradeInfo.num && String(g) === String(gradeInfo.num) ? " circle--filled" : "";
      sheetHtml += '<span><span class="circle' + filled + '"></span>' + g + "</span>";
    }
    sheetHtml += "</span></div>";
    if (isB1Level(level)) {
      sheetHtml += '<p class="print-grade-scale-hint">Scale: 1 = best (pass) · 5 = not pass</p>';
    }

    root.innerHTML = sheetHtml;
    root.className = "sheet sheet--print-a4" + (isB1Level(level) ? " sheet--print-b1" : "");
    root.style.maxHeight = PRINTABLE_MAX_HEIGHT_PX + "px";
    root.style.overflow = "hidden";
    syncWorksheetHtmlCode();
    updatePrintHeightMonitor();
    if (isB1Level(level) && getB1ScoresFromPanel().total !== null) {
      applyB1ScoreToWorksheet();
    }

    if (answerRoot) {
      var keyHtml =
        "<h3>✅ Answer Key (reverse side) — " +
        versionId +
        '</h3><p class="print-subtitle">Turn the sheet over — same version ID as the worksheet</p>';
      sectionsData.forEach(function (block) {
        keyHtml += "<h4>" + block.title + "</h4>";
        if (block.isWriting) {
          keyHtml += "<p class=\"print-answer-item print-answer-sample\">" + block.sampleAnswer + "</p>";
          return;
        }
        keyHtml += '<div class="print-answer-grid">';
        block.items.forEach(function (item, i) {
          var ans;
          if (block.isTransform) {
            ans = item.answer || item.negativeAnswer || item.questionAnswer;
          } else if (block.isChoice) {
            ans = item.answerDisplay || item.answers.join(" / ");
          } else {
            ans = item.answers.join(" / ");
          }
          keyHtml +=
            '<div class="print-answer-item"><strong>' + (i + 1) + ".</strong> " + ans + "</div>";
        });
        keyHtml += "</div>";
      });
      answerRoot.innerHTML = keyHtml;
    }

    var versionLabel = document.getElementById("versionLabel");
    if (versionLabel) versionLabel.textContent = versionId;
  }

  function syncWorksheetHtmlCode() {
    var root = document.getElementById("printWorksheet");
    var textarea = document.getElementById("teacherHtmlCode");
    if (!root || !textarea) return;
    textarea.value = root.innerHTML;
  }

  function toggleWorksheetHtmlCode() {
    var panel = document.getElementById("teacherHtmlCodePanel");
    var btn = document.getElementById("btnToggleHtmlCode");
    if (!panel) return;
    var show = panel.hidden;
    panel.hidden = !show;
    if (show) {
      syncWorksheetHtmlCode();
    }
    if (btn) {
      btn.textContent = show ? "Hide HTML code" : "View HTML code";
    }
  }

  function copyWorksheetHtmlCode() {
    var textarea = document.getElementById("teacherHtmlCode");
    var btn = document.getElementById("btnCopyHtmlCode");
    if (!textarea) return;
    syncWorksheetHtmlCode();
    textarea.select();
    textarea.setSelectionRange(0, textarea.value.length);
    var ok = false;
    try {
      ok = document.execCommand("copy");
    } catch (e) {
      ok = false;
    }
    if (!ok && navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(textarea.value).then(
        function () {
          if (btn) {
            btn.textContent = "Copied!";
            setTimeout(function () {
              btn.textContent = "Copy to clipboard";
            }, 1500);
          }
        },
        function () {}
      );
      return;
    }
    if (btn) {
      btn.textContent = ok ? "Copied!" : "Copy failed";
      setTimeout(function () {
        btn.textContent = "Copy to clipboard";
      }, 1500);
    }
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
    if (isB1Level()) updateB1ScoreCalculatorDisplay();
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
  window.toggleWorksheetHtmlCode = toggleWorksheetHtmlCode;
  window.copyWorksheetHtmlCode = copyWorksheetHtmlCode;
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

    if (isB1Level()) {
      B1_SCORE_INPUTS.forEach(function (cfg) {
        var input = document.getElementById(cfg.id);
        if (input) {
          input.addEventListener("input", updateB1ScoreCalculatorDisplay);
        }
      });
      var btnApplyScore = document.getElementById("btnApplyScoreToSheet");
      if (btnApplyScore) {
        btnApplyScore.addEventListener("click", applyB1ScoreToWorksheet);
      }
      window.addEventListener("resize", updatePrintHeightMonitor);
    }

    var btnAnswers = document.getElementById("btnTogglePrintAnswers");
    if (btnAnswers) btnAnswers.addEventListener("click", togglePrintAnswerKey);

    var btnHtml = document.getElementById("btnToggleHtmlCode");
    if (btnHtml) btnHtml.addEventListener("click", toggleWorksheetHtmlCode);

    var btnCopyHtml = document.getElementById("btnCopyHtmlCode");
    if (btnCopyHtml) btnCopyHtml.addEventListener("click", copyWorksheetHtmlCode);

    var btnPrint = document.getElementById("btnPrintSheet");
    if (btnPrint) btnPrint.addEventListener("click", window.printTeacherSheet);

    var btnPrintReverse = document.getElementById("btnPrintAnswerReverse");
    if (btnPrintReverse) btnPrintReverse.addEventListener("click", window.printAnswerKeyReverse);
  });
})();
