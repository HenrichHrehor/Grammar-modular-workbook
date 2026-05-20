/**
 * Home search — builds grammarTopics from MODULES_REGISTRY (multi-page workbook).
 */
(function () {
  var grammarTopics = [];

  var TYPE_ICONS = {
    theory: "📚",
    practice: "✏️",
    teacher: "🖨️",
    map: "🗺️"
  };

  function buildGrammarTopics() {
    var R = window.MODULES_REGISTRY;
    if (!R || !R.modules) return [];
    var list = [];
    var index = 0;

    function push(entry) {
      entry.index = index++;
      list.push(entry);
    }

    Object.keys(R.modules).forEach(function (moduleId) {
      var mod = R.modules[moduleId];
      push({
        title: mod.label + " — Module map",
        subtitle: "Open the module map",
        tags: [moduleId, "map", mod.label.toLowerCase()],
        topic: moduleId,
        topicLabel: mod.label,
        type: "map",
        level: "",
        href: mod.mapUrl,
        icon: mod.icon || "🗺️"
      });

      Object.keys(mod.parts || {}).forEach(function (partId) {
        var part = mod.parts[partId];
        push({
          title: part.partLabel + " — Module map",
          subtitle: part.moduleLabel + " → theory, exercises, teacher",
          tags: [moduleId, partId, "map", part.partLabel.toLowerCase()],
          topic: partId,
          topicLabel: part.partLabel,
          type: "map",
          level: "",
          href: part.mapUrl,
          icon: part.icon || "🗺️"
        });

        var comp = part.components || {};
        if (comp.theory) {
          push({
            title: comp.theory.shortLabel || comp.theory.label,
            subtitle: part.partLabel + " · grammar reference",
            tags: [moduleId, partId, "theory", part.partLabel.toLowerCase()],
            topic: partId,
            topicLabel: part.partLabel,
            type: "theory",
            level: "",
            href: comp.theory.url,
            icon: TYPE_ICONS.theory
          });
        }
        ["practiceB1", "practiceB2", "practiceC1", "teacherB1", "teacherB2", "teacherC1"].forEach(function (
          key
        ) {
          if (!comp[key]) return;
          var c = comp[key];
          var isPractice = key.indexOf("practice") === 0;
          push({
            title: c.label,
            subtitle: part.partLabel + (isPractice ? " · interactive worksheet" : " · teacher test"),
            tags: [
              moduleId,
              partId,
              isPractice ? "practice" : "teacher",
              c.level || "",
              part.partLabel.toLowerCase()
            ],
            topic: partId,
            topicLabel: part.partLabel,
            type: isPractice ? "practice" : "teacher",
            level: c.level || "",
            href: c.url,
            icon: isPractice ? TYPE_ICONS.practice : TYPE_ICONS.teacher
          });
        });
      });
    });

    return list;
  }

  function topicHref(topic) {
    if (window.SITE && window.SITE.page) {
      return window.SITE.page(topic.href);
    }
    return topic.href;
  }

  function loadTopic(index) {
    var topic = grammarTopics[index];
    if (!topic) return;
    window.location.href = topicHref(topic);
  }

  function loadTopicFromSearch(index) {
    loadTopic(index);
    var results = document.getElementById("search-results");
    if (results) {
      results.classList.remove("search-results--visible");
      results.innerHTML = "";
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function displaySearchResults(results) {
    var container = document.getElementById("search-results");
    if (!container) return;

    container.classList.add("search-results--visible");

    if (!results.length) {
      container.innerHTML = '<p class="search-results-empty">No materials found.</p>';
      return;
    }

    container.innerHTML = results
      .map(function (topic) {
        var badges =
          '<span class="tag-badge">' +
          escapeHtml(topic.topicLabel) +
          "</span> " +
          '<span class="tag-badge">' +
          escapeHtml(topic.type) +
          "</span>";
        if (topic.level) {
          badges += ' <span class="tag-badge">' + escapeHtml(topic.level.toUpperCase()) + "</span>";
        }
        return (
          '<button type="button" class="result-item" data-topic-index="' +
          topic.index +
          '">' +
          '<span class="result-item-icon" aria-hidden="true">' +
          topic.icon +
          "</span>" +
          '<span class="result-item-body">' +
          "<strong>" +
          escapeHtml(topic.title) +
          "</strong>" +
          "<span class="result-item-subtitle">" +
          escapeHtml(topic.subtitle) +
          "</span>" +
          '<span class="result-item-tags">' +
          badges +
          "</span>" +
          "</span>" +
          "</button>"
        );
      })
      .join("");

    container.querySelectorAll(".result-item").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var idx = parseInt(btn.getAttribute("data-topic-index"), 10);
        loadTopicFromSearch(idx);
      });
    });
  }

  function escapeHtml(text) {
    return String(text || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function performSearch() {
    var query = (document.getElementById("search-input").value || "").trim().toLowerCase();
    var topicFilter = (document.getElementById("filter-topic").value || "").toLowerCase();
    var typeFilter = (document.getElementById("filter-type").value || "").toLowerCase();
    var levelFilter = (document.getElementById("filter-level").value || "").toLowerCase();

    var results = grammarTopics.filter(function (item) {
      var textMatch =
        !query ||
        item.title.toLowerCase().indexOf(query) >= 0 ||
        item.subtitle.toLowerCase().indexOf(query) >= 0 ||
        item.tags.some(function (tag) {
          return tag.indexOf(query) >= 0;
        });

      var topicMatch = !topicFilter || item.topic === topicFilter;
      var typeMatch = !typeFilter || item.type === typeFilter;
      var levelMatch = !levelFilter || item.level === levelFilter;

      return textMatch && topicMatch && typeMatch && levelMatch;
    });

    displaySearchResults(results);
  }

  function clearSearch() {
    var input = document.getElementById("search-input");
    if (input) input.value = "";
    ["filter-topic", "filter-type", "filter-level"].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.value = "";
    });
    var results = document.getElementById("search-results");
    if (results) {
      results.classList.remove("search-results--visible");
      results.innerHTML = "";
    }
  }

  function populateFilterOptions() {
    var topicSelect = document.getElementById("filter-topic");
    if (!topicSelect || topicSelect.options.length > 1) return;

    var seen = {};
    grammarTopics.forEach(function (item) {
      if (seen[item.topic]) return;
      seen[item.topic] = true;
      var opt = document.createElement("option");
      opt.value = item.topic;
      opt.textContent = item.topicLabel;
      topicSelect.appendChild(opt);
    });
  }

  function initSearchPanel() {
    grammarTopics = buildGrammarTopics();
    window.grammarTopics = grammarTopics;
    window.loadTopic = loadTopic;
    window.performSearch = performSearch;
    window.clearSearch = clearSearch;

    populateFilterOptions();

    var toggleBtn = document.getElementById("btnToggleSearch");
    var advanced = document.getElementById("advanced-search");
    if (toggleBtn && advanced) {
      toggleBtn.addEventListener("click", function () {
        var open = advanced.style.display !== "none";
        advanced.style.display = open ? "none" : "block";
        toggleBtn.setAttribute("aria-expanded", open ? "false" : "true");
      });
    }

    var searchBtn = document.getElementById("btnSearch");
    if (searchBtn) searchBtn.addEventListener("click", performSearch);

    var clearBtn = document.getElementById("btnClearSearch");
    if (clearBtn) clearBtn.addEventListener("click", clearSearch);

    var input = document.getElementById("search-input");
    if (input) {
      input.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
          e.preventDefault();
          performSearch();
        }
      });
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (!window.MODULES_REGISTRY) return;
    initSearchPanel();
  });
})();
