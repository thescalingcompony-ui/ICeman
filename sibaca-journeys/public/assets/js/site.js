// Sibaca Journeys — menu toggle and quote form (no backend: hands off to WhatsApp or email).
(function () {
  var WA_NUMBER = "27783242012";
  var EMAIL = "info@sibacajourneys.co.za";

  // Mobile menu
  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".nav-toggle");
  if (header && toggle) {
    toggle.addEventListener("click", function () {
      var open = header.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
  }

  var year = document.querySelector("[data-year]");
  if (year) year.textContent = new Date().getFullYear();

  // Quote form
  var form = document.getElementById("quote-form");
  if (!form) return;

  // Pre-select the journey type from ?type=airport etc.
  var params = new URLSearchParams(location.search);
  var type = params.get("type");
  if (type && form.elements.journey_type) {
    var opt = form.elements.journey_type.querySelector('option[value="' + type.replace(/"/g, "") + '"]');
    if (opt) opt.selected = true;
  }

  // Don't allow dates in the past
  if (form.elements.travel_date) {
    var d = new Date();
    form.elements.travel_date.min = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  }

  var labels = [
    ["name", "Name"],
    ["company", "Company"],
    ["phone", "Phone / WhatsApp"],
    ["email", "Email"],
    ["journey_type", "Journey type"],
    ["pickup", "Pickup location"],
    ["destination", "Destination"],
    ["travel_date", "Travel date"],
    ["pickup_time", "Pickup time"],
    ["passengers", "Passengers"],
    ["vehicle", "Vehicle required"],
    ["notes", "Additional requirements"]
  ];

  function value(name) {
    var el = form.elements[name];
    if (!el) return "";
    if (el.tagName === "SELECT") return el.value ? el.options[el.selectedIndex].text : "";
    return el.value.trim();
  }

  function validate() {
    var firstBad = null;
    Array.prototype.forEach.call(form.querySelectorAll("[required], input[type=email]"), function (el) {
      var field = el.closest(".field");
      var ok = el.checkValidity();
      if (field) field.classList.toggle("invalid", !ok);
      if (!ok && !firstBad) firstBad = el;
    });
    if (firstBad) firstBad.focus();
    return !firstBad;
  }

  function message() {
    var lines = ["*Quote request — Sibaca Journeys website*", ""];
    labels.forEach(function (pair) {
      var v = value(pair[0]);
      if (v) lines.push(pair[1] + ": " + v);
    });
    return lines.join("\n");
  }

  function done(text) {
    var status = document.getElementById("form-status");
    if (status) {
      status.textContent = text;
      status.classList.add("show");
    }
  }

  form.addEventListener("input", function (e) {
    var field = e.target.closest(".field");
    if (field && field.classList.contains("invalid") && e.target.checkValidity()) field.classList.remove("invalid");
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!validate()) return;
    var via = (e.submitter && e.submitter.value) || "whatsapp";
    var text = message();
    if (via === "email") {
      var subject = "Quote request: " + (value("journey_type") || "transport") + " — " + value("name");
      location.href = "mailto:" + EMAIL + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(text.replace(/\*/g, ""));
      done("Your email app should now open with your request filled in — just press send. If nothing opened, email us at " + EMAIL + ".");
    } else {
      window.open("https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(text), "_blank", "noopener");
      done("WhatsApp should now open with your request filled in — just press send. If it didn't open, message us on 078 324 2012.");
    }
  });

  // Toggle the field-level hints when the browser marks a field invalid
  form.addEventListener("invalid", function (e) {
    var field = e.target.closest(".field");
    if (field) field.classList.add("invalid");
  }, true);
})();
