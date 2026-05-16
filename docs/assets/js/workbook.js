function toggleAnswers() {
  var el = document.getElementById("answerKey");
  if (el) {
    el.classList.toggle("active");
  }
}

document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".section").forEach(function (section) {
    var heading = section.querySelector("h2");
    if (!heading || !section.querySelector(".exercise-input")) {
      return;
    }
    var title = heading.textContent.trim();
    section.querySelectorAll(".exercise-item").forEach(function (item) {
      var numEl = item.querySelector("strong");
      var qNum = numEl ? numEl.textContent.replace(/\D/g, "") : "";
      item.querySelectorAll(".exercise-input").forEach(function (field) {
        if (!field.getAttribute("aria-label")) {
          field.setAttribute("aria-label", title + ", question " + qNum);
        }
      });
    });
  });
});
