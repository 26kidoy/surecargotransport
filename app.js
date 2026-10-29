/* ============================================================
   SURECARGO TRANSPORT — SHARED GLOBAL JAVASCRIPT
   ------------------------------------------------------------
   Powers:
   - Editable company configuration (contact details, URLs)
   - Header sidebar open/close + overlay + Escape
   - Active page highlighting in sidebar
   - Dynamic copyright year
   - Contact link configuration on contact.html
   - Cargo inquiry form validation + WhatsApp/email generation
   - Fleet search/filter/modal on trucks.html
   - Safe handling of elements that do not exist on a page
   ============================================================ */

(function () {
  "use strict";

  /* ============================================================
     1. EDITABLE CONFIGURATION
     ------------------------------------------------------------
     Replace these sample values with the company's real details
     before publishing.
     ============================================================ */
  var SURECARGO_CONFIG = {
    companyName: "SureCargo Transport",

    // NOTE: The following are SAMPLE values. Replace them
    // with the real company details before publishing.
    phone: "+63 917 000 1234",
    phoneAlt: "+63 905 000 5678",
    phoneTel: "+639170001234",
    phoneAltTel: "+639050005678",

    // WhatsApp: international digits only, no +, no spaces.
    whatsappDigits: "639170001234",

    email: "surecargo.example@gmail.com",

    facebookUrl: "https://www.facebook.com/",

    address:
      "Bantayan Island, Cebu, Philippines — Replace with the official business address",

    hours: "Monday–Saturday, 8:00 AM–5:00 PM (Sample — verify before publishing)",

    githubPagesUrl: "https://username.github.io/surecargo-transport/",

    // Flag used by the contact page notice. Set to true once real
    // details have replaced the sample values above.
    contactDetailsConfigured: false
  };

  // Expose config globally (read-only usage elsewhere)
  window.SURECARGO_CONFIG = SURECARGO_CONFIG;

  /* ============================================================
     2. SIDEBAR NAVIGATION
     ============================================================ */
  function initSidebar() {
    var openBtn = document.getElementById("hamburgerBtn");
    var sidebar = document.getElementById("sidebar");
    var overlay = document.getElementById("sidebarOverlay");
    var closeBtn = document.getElementById("sidebarClose");

    // If the page doesn't have a sidebar, exit silently.
    if (!sidebar || !overlay) return;

    var lastFocusedElement = null;

    function openSidebar() {
      lastFocusedElement = document.activeElement;
      sidebar.classList.add("open");
      sidebar.setAttribute("aria-hidden", "false");
      overlay.hidden = false;
      // small delay so CSS transition applies
      window.setTimeout(function () {
        overlay.classList.add("open");
      }, 10);
      if (openBtn) openBtn.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
      // focus close button
      if (closeBtn) {
        window.setTimeout(function () {
          closeBtn.focus();
        }, 60);
      }
    }

    function closeSidebar() {
      sidebar.classList.remove("open");
      sidebar.setAttribute("aria-hidden", "true");
      overlay.classList.remove("open");
      if (openBtn) openBtn.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
      window.setTimeout(function () {
        overlay.hidden = true;
      }, 260);
      // restore focus
      if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
        try {
          lastFocusedElement.focus();
        } catch (e) {
          /* ignore */
        }
      }
    }

    if (openBtn) {
      openBtn.addEventListener("click", function () {
        if (sidebar.classList.contains("open")) {
          closeSidebar();
        } else {
          openSidebar();
        }
      });
    }
    if (closeBtn) {
      closeBtn.addEventListener("click", closeSidebar);
    }
    overlay.addEventListener("click", closeSidebar);

    // Escape key
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && sidebar.classList.contains("open")) {
        closeSidebar();
      }
    });

    // Close after selecting a link
    var links = sidebar.querySelectorAll("a");
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener("click", function () {
        // Let the navigation happen, but close the sidebar visually
        closeSidebar();
      });
    }
  }

  /* ============================================================
     3. ACTIVE PAGE HIGHLIGHTING
     ------------------------------------------------------------
     The active state is set statically in each HTML file via the
     `active` class. This is a light-touch fallback that compares
     the current path with each link's href and marks it active
     if the static markup missed it.
     ============================================================ */
  function initActiveLinkFallback() {
    var sidebar = document.getElementById("sidebar");
    if (!sidebar) return;

    var currentFile = "";
    try {
      var path = window.location.pathname;
      var parts = path.split("/");
      currentFile = parts[parts.length - 1] || "index.html";
      if (currentFile === "") currentFile = "index.html";
    } catch (e) {
      currentFile = "index.html";
    }

    var links = sidebar.querySelectorAll("a");
    var alreadyActive = false;
    for (var i = 0; i < links.length; i++) {
      if (links[i].classList.contains("active")) {
        alreadyActive = true;
        break;
      }
    }
    if (alreadyActive) return;

    for (var j = 0; j < links.length; j++) {
      var href = links[j].getAttribute("href") || "";
      if (href === currentFile) {
        links[j].classList.add("active");
      }
    }
  }

  /* ============================================================
     4. DYNAMIC COPYRIGHT YEAR
     ============================================================ */
  function initCopyrightYear() {
    var yearEl = document.getElementById("year");
    if (!yearEl) return;
    yearEl.textContent = String(new Date().getFullYear());
  }

  /* ============================================================
     5. CONTACT PAGE — CONFIGURATION WIRING
     ------------------------------------------------------------
     Applies the SURECARGO_CONFIG values to elements that carry
     data-config attributes on the contact page.
     ============================================================ */
  function initContactConfig() {
    // Contact page only; skip elsewhere.
    var form = document.getElementById("cargoInquiryForm");
    if (!form) return;

    var cfg = SURECARGO_CONFIG;

    // Phone number (text + link)
    var phoneText = document.querySelector('[data-config-text="phone"]');
    if (phoneText) phoneText.textContent = cfg.phone;
    var phoneLink = document.querySelector('[data-config="phone-link"]');
    if (phoneLink) phoneLink.setAttribute("href", "tel:" + cfg.phoneTel);

    // Alternate phone
    var phoneAltText = document.querySelector('[data-config-text="phoneAlt"]');
    if (phoneAltText) phoneAltText.textContent = cfg.phoneAlt;
    var phoneAltLink = document.querySelector('[data-config="phone-alt-link"]');
    if (phoneAltLink) phoneAltLink.setAttribute("href", "tel:" + cfg.phoneAltTel);

    // Email
    var emailText = document.querySelector('[data-config-text="email"]');
    if (emailText) emailText.textContent = cfg.email;
    var emailLink = document.querySelector('[data-config="email-link"]');
    if (emailLink) emailLink.setAttribute("href", "mailto:" + cfg.email);

    // Address
    var addressEl = document.querySelector('[data-config="address"]');
    if (addressEl) addressEl.textContent = cfg.address;

    // Facebook link
    var fbLink = document.querySelector('[data-config="facebook-link"]');
    if (fbLink) fbLink.setAttribute("href", cfg.facebookUrl);

    // Top-level WhatsApp / Email buttons
    var waBtn = document.getElementById("whatsappContactBtn");
    var emBtn = document.getElementById("emailContactBtn");

    var defaultWaMessage =
      "Hello SureCargo Transport, I would like to ask about cargo delivery.";
    if (waBtn) {
      waBtn.setAttribute(
        "href",
        "https://wa.me/" +
          encodeURIComponent(cfg.whatsappDigits) +
          "?text=" +
          encodeURIComponent(defaultWaMessage)
      );
      waBtn.setAttribute("target", "_blank");
      waBtn.setAttribute("rel", "noopener");
    }
    if (emBtn) {
      emBtn.setAttribute(
        "href",
        "mailto:" +
          cfg.email +
          "?subject=" +
          encodeURIComponent("Cargo Inquiry — SureCargo Transport") +
          "&body=" +
          encodeURIComponent(defaultWaMessage)
      );
    }
  }

  /* ============================================================
     6. CARGO INQUIRY FORM
     ------------------------------------------------------------
     - Client-side validation
     - Prefilled message generation
     - WhatsApp / email opening with the composed message
     ============================================================ */
  function initCargoInquiryForm() {
    var form = document.getElementById("cargoInquiryForm");
    if (!form) return;

    var cfg = SURECARGO_CONFIG;

    var fields = {
      name: document.getElementById("customerName"),
      contact: document.getElementById("customerContact"),
      cargoType: document.getElementById("cargoType"),
      origin: document.getElementById("origin"),
      destination: document.getElementById("destination"),
      weight: document.getElementById("weight"),
      boxes: document.getElementById("boxes"),
      pickupDate: document.getElementById("pickupDate"),
      message: document.getElementById("message")
    };

    var previewBox = document.getElementById("previewBox");
    var previewText = document.getElementById("previewText");
    var generateBtn = document.getElementById("generatePreviewBtn");
    var waBtn = document.getElementById("formWhatsAppBtn");
    var emBtn = document.getElementById("formEmailBtn");

    function fieldWrap(el) {
      return el && el.closest ? el.closest(".form-field") : null;
    }

    function markInvalid(el, invalid) {
      var wrap = fieldWrap(el);
      if (!wrap) return;
      if (invalid) {
        wrap.classList.add("invalid");
      } else {
        wrap.classList.remove("invalid");
      }
    }

    function validateField(el) {
      if (!el) return true;
      var value = (el.value || "").trim();
      var valid = true;

      if (el.hasAttribute("required")) {
        valid = value.length > 0;
      }
      if (valid && el.getAttribute("minlength")) {
        var min = parseInt(el.getAttribute("minlength"), 10);
        if (!isNaN(min) && value.length < min) valid = false;
      }
      if (valid && el.getAttribute("min")) {
        var minN = parseFloat(el.getAttribute("min"));
        if (!isNaN(minN) && value !== "") {
          var n = parseFloat(value);
          if (isNaN(n) || n < minN) valid = false;
        }
      }
      markInvalid(el, !valid);
      return valid;
    }

    // Live validation
    Object.keys(fields).forEach(function (key) {
      var el = fields[key];
      if (!el) return;
      el.addEventListener("blur", function () {
        validateField(el);
      });
      el.addEventListener("input", function () {
        // Clear invalid state on typing
        markInvalid(el, false);
      });
    });

    function collectValues() {
      return {
        name: fields.name ? fields.name.value.trim() : "",
        contact: fields.contact ? fields.contact.value.trim() : "",
        cargoType: fields.cargoType ? fields.cargoType.value : "",
        origin: fields.origin ? fields.origin.value.trim() : "",
        destination: fields.destination ? fields.destination.value : "",
        weight: fields.weight ? fields.weight.value.trim() : "",
        boxes: fields.boxes ? fields.boxes.value.trim() : "",
        pickupDate: fields.pickupDate ? fields.pickupDate.value : "",
        message: fields.message ? fields.message.value.trim() : ""
      };
    }

    function buildInquiryText(v) {
      var lines = [];
      lines.push("Hello SureCargo Transport,");
      lines.push("");
      lines.push("I would like to inquire about cargo delivery.");
      lines.push("");
      lines.push("— Cargo Inquiry Details —");
      lines.push("Name: " + (v.name || "(not provided)"));
      lines.push("Contact: " + (v.contact || "(not provided)"));
      lines.push("Cargo type: " + (v.cargoType || "(not specified)"));
      lines.push("Origin: " + (v.origin || "(not provided)"));
      lines.push("Destination: " + (v.destination || "(not specified)"));
      if (v.weight) lines.push("Approx. weight: " + v.weight);
      if (v.boxes) lines.push("Boxes / packages: " + v.boxes);
      if (v.pickupDate) lines.push("Preferred pickup date: " + v.pickupDate);
      if (v.message) {
        lines.push("");
        lines.push("Additional message:");
        lines.push(v.message);
      }
      lines.push("");
      lines.push("Thank you.");
      return lines.join("\n");
    }

    function validateAll() {
      var valid = true;
      // Required fields only (weight, boxes, date, message are optional)
      ["name", "contact", "cargoType", "origin", "destination"].forEach(
        function (k) {
          var el = fields[k];
          if (el && !validateField(el)) valid = false;
        }
      );
      return valid;
    }

    function updatePreview() {
      var v = collectValues();
      var text = buildInquiryText(v);
      if (previewText) previewText.textContent = text;
      if (previewBox) previewBox.hidden = false;
      return text;
    }

    if (generateBtn) {
      generateBtn.addEventListener("click", function () {
        if (!validateAll()) {
          // Focus first invalid field
          var firstInvalid = form.querySelector(".form-field.invalid input, .form-field.invalid select, .form-field.invalid textarea");
          if (firstInvalid && typeof firstInvalid.focus === "function") {
            firstInvalid.focus();
          }
          return;
        }
        updatePreview();
      });
    }

    if (waBtn) {
      waBtn.addEventListener("click", function () {
        if (!validateAll()) {
          var firstInvalid = form.querySelector(".form-field.invalid input, .form-field.invalid select, .form-field.invalid textarea");
          if (firstInvalid && typeof firstInvalid.focus === "function") firstInvalid.focus();
          return;
        }
        var text = updatePreview();
        var url =
          "https://wa.me/" +
          encodeURIComponent(cfg.whatsappDigits) +
          "?text=" +
          encodeURIComponent(text);
        window.open(url, "_blank", "noopener");
      });
    }

    if (emBtn) {
      emBtn.addEventListener("click", function () {
        if (!validateAll()) {
          var firstInvalid = form.querySelector(".form-field.invalid input, .form-field.invalid select, .form-field.invalid textarea");
          if (firstInvalid && typeof firstInvalid.focus === "function") firstInvalid.focus();
          return;
        }
        var text = updatePreview();
        var subject = "Cargo Inquiry — SureCargo Transport";
        var url =
          "mailto:" +
          cfg.email +
          "?subject=" +
          encodeURIComponent(subject) +
          "&body=" +
          encodeURIComponent(text);
        window.location.href = url;
      });
    }

    // Prevent accidental submission
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (validateAll()) {
        updatePreview();
      }
    });
  }

  /* ============================================================
     7. FLEET PAGE — TRUCK DATA + FILTERS + MODAL
     ------------------------------------------------------------
     TRUCK_DATA is the editable source of truck information.
     All fields below are SAMPLE specifications for demonstration.
     ============================================================ */
  var TRUCK_DATA = [
    {
      id: "truck-01",
      name: "SureCargo Blue Runner",
      model: "Isuzu N-Series — Sample Model",
      year: 2022,
      ratedLoad: 3, // metric tons
      bodyType: "Closed van",
      suitability: ["boxes", "general"],
      suitabilityLabel: "Boxes, parcels, and general cargo",
      image: "assets/images/trucks/truck-01.jpg",
      alt: "Sample cargo truck 1 — SureCargo Blue Runner"
    },
    {
      id: "truck-02",
      name: "SureCargo Island Hauler",
      model: "Mitsubishi Fuso Canter — Sample Model",
      year: 2021,
      ratedLoad: 5,
      bodyType: "Cargo truck",
      suitability: ["general", "commercial"],
      suitabilityLabel: "General and commercial cargo",
      image: "assets/images/trucks/truck-02.jpg",
      alt: "Sample cargo truck 2 — SureCargo Island Hauler"
    },
    {
      id: "truck-03",
      name: "SureCargo Fresh Cargo",
      model: "Isuzu N-Series — Sample Model",
      year: 2024,
      ratedLoad: 3,
      bodyType: "Enclosed cargo body",
      suitability: ["boxes", "packaged"],
      suitabilityLabel: "Boxes and suitable packaged goods",
      image: "assets/images/trucks/truck-03.jpg",
      alt: "Sample cargo truck 3 — SureCargo Fresh Cargo"
    }
  ];

  function initFleet() {
    var grid = document.getElementById("truckGrid");
    if (!grid) return; // Not on trucks.html

    var searchEl = document.getElementById("truckSearch");
    var suitEl = document.getElementById("truckSuitability");
    var loadEl = document.getElementById("truckLoad");
    var countEl = document.getElementById("resultsCount");
    var emptyEl = document.getElementById("emptyState");
    var clearBtn = document.getElementById("clearFiltersBtn");

    // Modal
    var modal = document.getElementById("truckModal");
    var modalMedia = document.getElementById("truckModalMedia");
    var modalTitle = document.getElementById("truckModalTitle");
    var modalSpecs = document.getElementById("truckModalSpecs");
    var modalCloseBtn = document.getElementById("truckModalClose");
    var lastFocused = null;

    function escapeHtml(str) {
      if (str === null || str === undefined) return "";
      return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }

    function filteredTrucks() {
      var q = searchEl ? searchEl.value.trim().toLowerCase() : "";
      var suit = suitEl ? suitEl.value : "";
      var load = loadEl ? loadEl.value : "";

      return TRUCK_DATA.filter(function (t) {
        // Search filter
        if (q) {
          var hay = (t.name + " " + t.model).toLowerCase();
          if (hay.indexOf(q) === -1) return false;
        }
        // Suitability filter
        if (suit && t.suitability.indexOf(suit) === -1) return false;
        // Load filter (exact match on metric tons)
        if (load) {
          var loadNum = parseFloat(load);
          if (!isNaN(loadNum) && t.ratedLoad !== loadNum) return false;
        }
        return true;
      });
    }

    function renderTrucks() {
      var list = filteredTrucks();
      grid.innerHTML = "";

      if (countEl) {
        countEl.innerHTML =
          "Showing <strong>" +
          list.length +
          "</strong> of " +
          TRUCK_DATA.length +
          " sample trucks.";
      }

      if (emptyEl) {
        if (list.length === 0) {
          emptyEl.hidden = false;
        } else {
          emptyEl.hidden = true;
        }
      }

      list.forEach(function (t) {
        var article = document.createElement("article");
        article.className = "truck-card";
        article.setAttribute("data-truck-id", t.id);

        // Image
        var imgWrap = document.createElement("div");
        imgWrap.className = "truck-img";
        var img = document.createElement("img");
        img.src = t.image;
        img.alt = t.alt;
        img.loading = "lazy";
        img.addEventListener("error", function () {
          img.style.display = "none";
          imgWrap.classList.add("img-fallback");
          imgWrap.textContent = t.name;
        });
        imgWrap.appendChild(img);

        // Body
        var body = document.createElement("div");
        body.className = "truck-body";

        var h3 = document.createElement("h3");
        h3.textContent = t.name;
        body.appendChild(h3);

        var sample = document.createElement("span");
        sample.className = "truck-sample";
        sample.textContent = "Sample specification";
        body.appendChild(sample);

        var specList = document.createElement("ul");
        specList.className = "spec-list";
        [
          ["Model", t.model],
          ["Model Year", t.year + " (Sample)"],
          ["Rated Load", t.ratedLoad + " metric tons"],
          ["Body Type", t.bodyType]
        ].forEach(function (row) {
          var li = document.createElement("li");
          var k = document.createElement("span");
          k.className = "k";
          k.textContent = row[0];
          var v = document.createElement("span");
          v.className = "v";
          v.textContent = row[1];
          li.appendChild(k);
          li.appendChild(v);
          specList.appendChild(li);
        });
        body.appendChild(specList);

        var suitBox = document.createElement("div");
        suitBox.className = "suitability";
        var suitH = document.createElement("h4");
        suitH.textContent = "Suggested Cargo";
        var suitP = document.createElement("p");
        suitP.textContent = t.suitabilityLabel;
        suitBox.appendChild(suitH);
        suitBox.appendChild(suitP);
        body.appendChild(suitBox);

        var actions = document.createElement("div");
        actions.className = "truck-actions";

        var detailsBtn = document.createElement("button");
        detailsBtn.type = "button";
        detailsBtn.className = "btn btn-secondary btn-sm";
        detailsBtn.textContent = "View Details";
        detailsBtn.addEventListener("click", function () {
          openModal(t);
        });
        actions.appendChild(detailsBtn);

        var inquiryLink = document.createElement("a");
        inquiryLink.href = "contact.html";
        inquiryLink.className = "btn btn-primary btn-sm";
        inquiryLink.textContent = "Inquire";
        actions.appendChild(inquiryLink);

        body.appendChild(actions);

        article.appendChild(imgWrap);
        article.appendChild(body);
        grid.appendChild(article);
      });
    }

    function openModal(t) {
      if (!modal || !modalMedia || !modalTitle || !modalSpecs) return;
      lastFocused = document.activeElement;

      modalMedia.innerHTML = "";
      var img = document.createElement("img");
      img.src = t.image;
      img.alt = t.alt;
      img.addEventListener("error", function () {
        img.style.display = "none";
        modalMedia.classList.add("img-fallback");
        modalMedia.textContent = t.name;
      });
      modalMedia.appendChild(img);

      modalTitle.textContent = t.name;

      modalSpecs.innerHTML = "";
      [
        ["Model", t.model],
        ["Model Year", t.year + " (Sample)"],
        ["Rated Load", t.ratedLoad + " metric tons (Sample)"],
        ["Body Type", t.bodyType],
        ["Suggested Cargo", t.suitabilityLabel]
      ].forEach(function (row) {
        var li = document.createElement("li");
        var k = document.createElement("span");
        k.className = "k";
        k.textContent = row[0];
        var v = document.createElement("span");
        v.className = "v";
        v.textContent = row[1];
        li.appendChild(k);
        li.appendChild(v);
        modalSpecs.appendChild(li);
      });

      modal.classList.add("open");
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";

      if (modalCloseBtn) {
        window.setTimeout(function () {
          modalCloseBtn.focus();
        }, 60);
      }
    }

    function closeModal() {
      if (!modal) return;
      modal.classList.remove("open");
      modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      if (lastFocused && typeof lastFocused.focus === "function") {
        try {
          lastFocused.focus();
        } catch (e) {
          /* ignore */
        }
      }
    }

    if (modalCloseBtn) modalCloseBtn.addEventListener("click", closeModal);
    if (modal) {
      modal.addEventListener("click", function (e) {
        if (e.target === modal) closeModal();
      });
    }
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && modal && modal.classList.contains("open")) {
        closeModal();
      }
    });

    if (searchEl) searchEl.addEventListener("input", renderTrucks);
    if (suitEl) suitEl.addEventListener("change", renderTrucks);
    if (loadEl) loadEl.addEventListener("change", renderTrucks);

    if (clearBtn) {
      clearBtn.addEventListener("click", function () {
        if (searchEl) searchEl.value = "";
        if (suitEl) suitEl.value = "";
        if (loadEl) loadEl.value = "";
        renderTrucks();
      });
    }

    renderTrucks();
  }

  /* ============================================================
     8. INITIALIZATION
     ============================================================ */
  function init() {
    initSidebar();
    initActiveLinkFallback();
    initCopyrightYear();
    initContactConfig();
    initCargoInquiryForm();
    initFleet();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();