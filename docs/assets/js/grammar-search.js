/**
 * Home search — index of all workbook pages from MODULES_REGISTRY.
 */
(function () {
  var grammarTopics = [];
  var searchDebounceTimer = null;

  var TYPE_ICONS = {
    theory: "📚",
    practice: "✏️",
    teacher: "🖨️",
    map: "🗺️"
  };

  var TYPE_LABELS = {
    theory: "Theory",
    practice: "Practice",
    teacher: "Teacher test",
    map: "Module map"
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
        subtitle: "Choose a grammar topic inside " + mod.label,
        tags: [moduleId, "map", mod.label.toLowerCase(), "module"],
        topic: moduleId,
        topicLabel: mod.label,
        type: "map",
        level: "",
        href: mod.mapUrl,
        icon: mod.icon || TYPE_ICONS.map
      });

      Object.keys(mod.parts || {}).forEach(function (partId) {
        var part = mod.parts[partId];
        push({
          title: part.partLabel + " — Module map",
          subtitle: part.moduleLabel + " · theory, practice, and teacher pages",
          tags: [moduleId, partId, "map", part.partLabel.toLowerCase()],
          topic: partId,
          topicLabel: part.partLabel,
          type: "map",
          level: "",
          href: part.mapUrl,
          icon: part.icon || TYPE_ICONS.map
        });

        var comp = part.components || {};
        if (comp.theory) {
          push({
            title: comp.theory.shortLabel || comp.theory.label,
            subtitle: part.partLabel + " · grammar explanation",
            tags: [moduleId, partId, "theory", part.partLabel.toLowerCase(), "grammar"],
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
            subtitle: part.partLabel + (isPractice ? " · interactive exercises" : " · printable teacher test"),
            tags: [
              moduleId,
              partId,
              isPractice ? "practice" : "teacher",
              isPractice ? "exercises" : "print",
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
    clearSearchResultsOnly();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function escapeHtml(text) {
    return String(text || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function typeLabel(type) {
    return TYPE_LABELS[type] || type;
  }

  function updateResultsSummary(count, hasFilters) {
    var el = document.getElementById("search-results-summary");
    if (!el) return;
    if (count === 0 && !hasFilters) {
      el.hidden = true;
      el.textContent = "";
      return;
    }
    el.hidden = false;
    if (count === 0) {
      el.textContent = "No pages match your search. Try fewer filters or different keywords.";
    } else if (count === 1) {
      el.textContent = "1 page found — click to open:";
    } else {
      el.textContent = count + " pages found — click to open:";
    }
  }

  function displaySearchResults(results) {
    var container = document.getElementById("search-results");
    if (!container) return;

    var input = document.getElementById("search-input");
    var hasFilters =
      (input && input.value.trim()) ||
      document.getElementById("filter-topic").value ||
      document.getElementById("filter-type").value ||
      document.getElementById("filter-level").value;

    updateResultsSummary(results.length, hasFilters);

    if (!results.length) {
      container.classList.add("search-results--visible");
      container.innerHTML = '<p class="search-results-empty">No materials found.</p>';
      return;
    }

    container.classList.add("search-results--visible");
    container.innerHTML = results
      .map(function (topic) {
        var badges =
          '<span class="tag-badge">' + escapeHtml(topic.topicLabel) + "</span>" +
          '<span class="tag-badge">' + escapeHtml(typeLabel(topic.type)) + "</span>";
        if (topic.level) {
          badges += '<span class="tag-badge tag-badge--level">' + escapeHtml(topic.level.toUpperCase()) + "</span>";
        }
        return (
          '<button type="button" class="result-item" data-topic-index="' + topic.index + '">' +
          '<span class="result-item-icon" aria-hidden="true">' + topic.icon + "</span>" +
          '<span class="result-item-body">' +
          "<strong>" + escapeHtml(topic.title) + "</strong>" +
          '<span class="result-item-subtitle">' + escapeHtml(topic.subtitle) + "</span>" +
          '<span class="result-item-tags">' + badges + "</span>" +
          "</span>" +
          "</button>"
        );
      })
      .join("");

    container.querySelectorAll(".result-item").forEach(function (btn) {
      btn.addEventListener("click", function () {
        loadTopicFromSearch(parseInt(btn.getAttribute("data-topic-index"), 10));
      });
    });
  }

  function performSearch() {
    var query = (document.getElementById("search-input").value || "").trim().toLowerCase();
    var topicFilter = document.getElementById("filter-topic").value || "";
    var typeFilter = document.getElementById("filter-type").value || "";
    var levelFilter = document.getElementById("filter-level").value || "";

    var results = grammarTopics.filter(function (item) {
      var textMatch =
        !query ||
        item.title.toLowerCase().indexOf(query) >= 0 ||
        item.subtitle.toLowerCase().indexOf(query) >= 0 ||
        item.topicLabel.toLowerCase().indexOf(query) >= 0 ||
        item.tags.some(function (tag) {
          return tag.indexOf(query) >= 0;
        });

      var topicMatch = !topicFilter || item.topic === topicFilter;
      var typeMatch = !typeFilter || item.type === typeFilter;
      var levelMatch = !levelFilter || item.level === levelFilter;

      return textMatch && topicMatch && typeMatch && levelMatch;
    });

    results.sort(function (a, b) {
      return a.title.localeCompare(b.title, "en");
    });

    displaySearchResults(results);
  }

  function clearSearchResultsOnly() {
    var container = document.getElementById("search-results");
    if (container) {
      container.classList.remove("search-results--visible");
      container.innerHTML = "";
    }
    var summary = document.getElementById("search-results-summary");
    if (summary) summary.hidden = true;
  }

  function clearSearch() {
    var input = document.getElementById("search-input");
    if (input) input.value = "";
    ["filter-topic", "filter-type", "filter-level"].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.value = "";
    });
    clearSearchResultsOnly();
  }

  function populateFilterOptions() {
    var topicSelect = document.getElementById("filter-topic");
    if (!topicSelect) return;

    while (topicSelect.options.length > 1) {
      topicSelect.remove(1);
    }

    var byTopic = {};
    grammarTopics.forEach(function (item) {
      if (!byTopic[item.topic]) {
        byTopic[item.topic] = item.topicLabel;
      }
    });
    grammarTopics.forEach(function (item) {
      if (item.type === "theory" || item.type === "practice" || item.type === "teacher") {
        byTopic[item.topic] = item.topicLabel;
      }
    });
    var options = Object.keys(byTopic).map(function (key) {
      return { value: key, label: byTopic[key] };
    });

    options.sort(function (a, b) {
      return a.label.localeCompare(b.label, "en");
    });

    options.forEach(function (opt) {
      var node = document.createElement("option");
      node.value = opt.value;
      node.textContent = opt.label;
      topicSelect.appendChild(node);
    });
  }

  function scheduleSearch() {
    if (searchDebounceTimer) clearTimeout(searchDebounceTimer);
    searchDebounceTimer = setTimeout(performSearch, 220);
  }

  function initSearchPanel() {
    grammarTopics = buildGrammarTopics();
    window.grammarTopics = grammarTopics;
    window.loadTopic = loadTopic;
    window.performSearch = performSearch;
    window.clearSearch = clearSearch;
    window.loadTopicFromSearch = loadTopicFromSearch;

    populateFilterOptions();

    var toggleBtn = document.getElementById("btnToggleSearch");
    var advanced = document.getElementById("advanced-search");
    if (toggleBtn && advanced) {
      toggleBtn.addEventListener("click", function () {
        var open = advanced.classList.contains("search-panel-body--hidden");
        advanced.classList.toggle("search-panel-body--hidden", !open);
        toggleBtn.setAttribute("aria-expanded", open ? "true" : "false");
        toggleBtn.textContent = open ? "Hide search" : "Show search";
      });
    }

    document.getElementById("btnSearch").addEventListener("click", performSearch);
    document.getElementById("btnClearSearch").addEventListener("click", clearSearch);

    var input = document.getElementById("search-input");
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        performSearch();
      }
    });
    input.addEventListener("input", scheduleSearch);

    ["filter-topic", "filter-type", "filter-level"].forEach(function (id) {
      document.getElementById(id).addEventListener("change", performSearch);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (!window.MODULES_REGISTRY) return;
    initSearchPanel();
  });
})();
