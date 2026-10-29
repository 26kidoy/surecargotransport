/* ============================================================
   SURECARGO TRANSPORT — CHATBOT JAVASCRIPT
   ------------------------------------------------------------
   A rule-based assistant powered by keyword matching and
   pre-written responses. NOT powered by AI. Does not access
   live data, databases, or external APIs.

   Powers TWO surfaces:
   1. Floating widget (used on most pages)
      IDs: chatFab, chatWidget, chatBody, chatForm,
           chatInput, chatClose, chatClear, chatSuggestions

   2. Dedicated chatbot page panel (chatbot.html)
      IDs: chatPageBody, chatPageForm, chatPageInput,
           chatPageClear, chatPageSuggestions
   ============================================================ */

(function () {
  "use strict";

  /* ============================================================
     1. SUGGESTED QUESTIONS
     ============================================================ */
  var SUGGESTIONS = [
    "What services do you offer?",
    "Do you deliver eggs to Bacolod?",
    "Can I send boxes to Bacolod?",
    "Do you transport dried seafoods?",
    "What cargo can I send to Cebu?",
    "How can I request a quotation?",
    "How can I contact SureCargo?",
    "What trucks do you have?",
    "What are the truck capacities?",
    "How can I confirm the delivery schedule?"
  ];

  /* ============================================================
     2. INTENT DEFINITIONS
     ------------------------------------------------------------
     Each intent has:
       - keywords: array of phrases to match (lowercase)
       - response: the reply to send
     Intents are checked in order; the first intent whose
     keyword is found in the message wins.
     ============================================================ */
  var INTENTS = [
    {
      keywords: ["hello", "hi", "hey", "good morning", "good afternoon", "good evening", "kumusta", "kamusta"],
      response: "Hello! I'm the SureCargo Assistant. I can answer common questions about our cargo services, routes, trucks, team, and contact options. What would you like to know?"
    },
    {
      keywords: ["thank", "thanks", "salamat", "thank you"],
      response: "You're welcome! If you need anything else, feel free to ask. For specific cargo arrangements, please contact SureCargo Transport directly."
    },
    {
      keywords: ["bye", "goodbye", "see you", "paalam"],
      response: "Thank you for visiting SureCargo Transport. Take care, and feel free to come back anytime!"
    },

    /* ----- Services ----- */
    {
      keywords: ["what services", "services offer", "what do you offer", "unsa ang serbisyo", "services"],
      response: "SureCargo Transport offers: Egg Delivery (Bantayan to Bacolod), Box Transportation, Dried Seafood Transportation, General Cargo (Bantayan to Cebu), Commercial Cargo, and Other Accepted Goods. Visit the Services page for details: services.html"
    },
    {
      keywords: ["egg", "eggs", "itlog"],
      response: "Yes — egg delivery is one of our services along the Bantayan to Bacolod route. Eggs must be properly packaged in sturdy trays and cartons. Please confirm handling requirements with SureCargo before shipping. Learn more: bantayan-to-bacolod.html"
    },
    {
      keywords: ["box", "boxes", "parcel", "parcels", "package", "packages", "kahon"],
      response: "Yes — boxes and parcels are accepted on both routes (Bantayan to Bacolod and Bantayan to Cebu). Please pack them securely and label them clearly with recipient name, contact number, and destination. Confirm acceptance with the company before shipping."
    },
    {
      keywords: ["dried seafood", "dried fish", "dried squid", "seafood", "isda"],
      response: "Yes — dried seafood transportation is available along the Bantayan to Bacolod route. Use sealed bags or containers to control odor, and pack inside sturdy boxes. Confirm handling requirements with SureCargo. Learn more: bantayan-to-bacolod.html"
    },
    {
      keywords: ["general cargo", "commercial cargo", "commercial goods", "business cargo"],
      response: "General cargo and commercial goods are accepted on the Bantayan to Cebu route. Suitable for properly packaged goods, retail stock, and business supplies. Confirm cargo acceptance with SureCargo before shipping. Learn more: bantayan-to-cebu.html"
    },
    {
      keywords: ["what cargo", "accepted cargo", "what can i send", "can i send", "pwede ba"],
      response: "SureCargo accepts: eggs, boxes and parcels, dried seafoods, general cargo, commercial goods, and other accepted items. Acceptance depends on type, packaging, and route — please contact the company to confirm your specific cargo."
    },

    /* ----- Routes ----- */
    {
      keywords: ["bacolod", "bantayan to bacolod", "route 1"],
      response: "Bantayan Island to Bacolod is one of our main routes. We handle egg delivery, boxes and parcels, dried seafoods, and other accepted cargo. Rates, transit times, and schedules must be confirmed with the company. Learn more: bantayan-to-bacolod.html"
    },
    {
      keywords: ["cebu", "bantayan to cebu", "route 2"],
      response: "Bantayan Island to Cebu is our other main route. We handle general cargo, boxes and parcels, commercial goods, and other accepted items. Delivery schedules and prices must be confirmed with the company. Learn more: bantayan-to-cebu.html"
    },
    {
      keywords: ["what routes", "which routes", "where do you deliver", "asa mo"],
      response: "SureCargo Transport serves two main routes: 1) Bantayan Island to Bacolod, and 2) Bantayan Island to Cebu. Visit the route pages for details."
    },

    /* ----- Trucks ----- */
    {
      keywords: ["truck", "trucks", "fleet", "vehicle", "sakyanan"],
      response: "The Trucks page shows three sample trucks for layout demonstration: SureCargo Blue Runner (Isuzu N-Series, sample), SureCargo Island Hauler (Mitsubishi Fuso Canter, sample), and SureCargo Fresh Cargo (Isuzu N-Series, sample). Actual fleet specifications must be confirmed with SureCargo. View trucks: trucks.html"
    },
    {
      keywords: ["capacity", "capacities", "load", "tonnage", "metric ton", "how heavy"],
      response: "Sample rated loads shown on the website: SureCargo Blue Runner — 3 metric tons; SureCargo Island Hauler — 5 metric tons; SureCargo Fresh Cargo — 3 metric tons. These are sample figures for demonstration. Actual capacities must be confirmed by SureCargo Transport."
    },

    /* ----- Team ----- */
    {
      keywords: ["owner", "proprietor", "raymond", "menchavez", "atty"],
      response: "The owner of SureCargo Transport is Atty. Ray Lambert Menchavez. You can view the owner profile at: owner.html"
    },
    {
      keywords: ["driver", "drivers", "nonoy", "racky", "tradio", "melecio"],
      response: "Our drivers are Nonoy Tradio and Racky Melecio. You can view their profiles at: drivers.html"
    },
    {
      keywords: ["helper", "helpers", "ramram", "mar capuz", "truck helper"],
      response: "Our truck helpers are Ramram, Mar Capuz, and a third team member (placeholder). You can view the truck helpers page at: truck-helpers.html"
    },
    {
      keywords: ["manager", "ondo", "rubio", "operations manager"],
      response: "Our Operations Manager is Ondo Rubio. You can view the manager profile at: manager.html"
    },
    {
      keywords: ["it developer", "developer", "kidoy", "rogelio", "tradio jr", "website developer", "programmer"],
      response: "Our IT Developer / Website Developer is Rogelio Tradio Jr., also known as Kidoy. You can view the profile at: it-developer.html"
    },
    {
      keywords: ["who made this", "who built this", "who developed", "website developer"],
      response: "This website was developed by Rogelio Tradio Jr. (Kidoy), the IT Developer for SureCargo Transport. You can view the profile at: it-developer.html"
    },

    /* ----- Contact ----- */
    {
      keywords: ["contact", "phone", "email", "call", "number", "facebook", "address", "how to reach", "unsaon pag contact"],
      response: "You can contact SureCargo Transport through the Contact page (contact.html), which lists phone numbers, email, address, and the cargo inquiry form. Please note that sample contact details shown on the website must be replaced with the real company information before publishing."
    },
    {
      keywords: ["office", "location", "where are you", "asa mo", "asa"],
      response: "SureCargo Transport is based in Bantayan Island, Cebu, Philippines. The sample office address on the Contact page is a placeholder and must be replaced with the official business address before publishing. Visit: contact.html"
    },
    {
      keywords: ["operating hours", "hours", "open", "closing", "unsa oras"],
      response: "Sample operating hours on the website are Monday–Saturday, 8:00 AM–5:00 PM. These must be verified with the company before publishing. Please contact SureCargo for the current operating hours."
    },
    {
      keywords: ["facebook", "social media", "fb"],
      response: "A sample Facebook link is shown on the Contact page. The real SureCargo Transport Facebook page URL must be added before publishing. Visit: contact.html"
    },

    /* ----- Pricing & schedules ----- */
    {
      keywords: ["price", "pricing", "rate", "rates", "cost", "how much", "pila", "tagpila", "quotation", "quote"],
      response: "Rates depend on cargo type, size, weight, and destination. Prices are not published on this website — please contact SureCargo Transport directly for a quotation. You can use the inquiry form on the Contact page: contact.html"
    },
    {
      keywords: ["schedule", "when", "transit time", "delivery time", "how long", "kanus-a"],
      response: "Delivery schedules and transit times depend on current arrangements and are not published on this website. Please contact SureCargo Transport to confirm the schedule for your specific shipment."
    },
    {
      keywords: ["availability", "available", "when can i send", "when can i ship"],
      response: "Cargo availability depends on current arrangements. Please contact SureCargo Transport directly to confirm availability for your shipment."
    },

    /* ----- Packaging ----- */
    {
      keywords: ["packaging", "pack", "how to pack", "prepare", "preparation"],
      response: "General packaging tips: use sturdy boxes, seal them securely with strong tape, cushion fragile items, and label clearly with recipient name, contact number, and destination. For eggs, dried seafoods, or fragile goods, please confirm handling requirements with SureCargo before shipping."
    },

    /* ----- Tracking / booking ----- */
    {
      keywords: ["track", "tracking", "where is my cargo", "status"],
      response: "This website does not provide live tracking. For updates on your shipment, please contact SureCargo Transport directly through the Contact page: contact.html"
    },
    {
      keywords: ["book", "booking", "reserve", "reservation"],
      response: "This website does not support automatic booking. To arrange a shipment, please contact SureCargo Transport directly through the Contact page or by phone: contact.html"
    },

    /* ----- Chatbot self-description ----- */
    {
      keywords: ["are you ai", "are you a bot", "is this ai", "chatgpt", "artificial intelligence"],
      response: "No — I'm a rule-based assistant, not AI. I match your message to a set of pre-written responses based on the website's content. For real answers about rates, schedules, or availability, please contact SureCargo Transport directly."
    },
    {
      keywords: ["what can you do", "how can you help", "unsa imong mahimo"],
      response: "I can answer questions about SureCargo's services, routes (Bantayan to Bacolod and Cebu), trucks (sample info), team members, packaging tips, and contact options. I can't confirm live pricing, schedules, or availability — for those, please contact the company directly."
    },

    /* ----- Fallback for other topics ----- */
    {
      keywords: ["other goods", "other items", "special cargo", "custom cargo"],
      response: "Other accepted cargo may be arranged depending on type, packaging, and route. Please contact SureCargo Transport to confirm whether your specific goods can be accepted."
    }
  ];

  /* ============================================================
     3. WELCOME MESSAGE
     ============================================================ */
  var WELCOME_MESSAGE =
    "Hello! 👋 I'm the SureCargo Assistant — a rule-based helper, not AI. I can answer common questions about our services, routes, trucks, team, and contact info. What would you like to know?";

  /* ============================================================
     4. RESPONSE LOOKUP
     ============================================================ */
  function getBotResponse(rawMessage) {
    if (!rawMessage) return getFallbackResponse();
    var msg = rawMessage.toLowerCase();

    for (var i = 0; i < INTENTS.length; i++) {
      var intent = INTENTS[i];
      for (var j = 0; j < intent.keywords.length; j++) {
        if (msg.indexOf(intent.keywords[j]) !== -1) {
          return intent.response;
        }
      }
    }
    return getFallbackResponse();
  }

  function getFallbackResponse() {
    return (
      "I'm not sure about that one. I can help with topics like:\n" +
      "• Services and accepted cargo\n" +
      "• Bantayan to Bacolod or Cebu routes\n" +
      "• Sample truck information\n" +
      "• Our team members\n" +
      "• Contact details and inquiries\n" +
      "• General packaging tips\n\n" +
      "For specific questions, please contact SureCargo Transport directly at contact.html"
    );
  }

  /* ============================================================
     5. SHARED HELPERS
     ============================================================ */
  function nowTimestamp() {
    return Date.now();
  }

  function safeTextContent(el, text) {
    // Use textContent to prevent XSS from user messages.
    el.textContent = text;
  }

  function createBubble(kind, text) {
    var div = document.createElement("div");
    div.className = "msg " + kind;
    safeTextContent(div, text);
    return div;
  }

  function createTypingBubble() {
    var div = document.createElement("div");
    div.className = "msg bot typing";
    for (var i = 0; i < 3; i++) {
      var span = document.createElement("span");
      div.appendChild(span);
    }
    return div;
  }

  function scrollToBottom(container) {
    if (container) container.scrollTop = container.scrollHeight;
  }

  /* ============================================================
     6. CHATBOT INSTANCE
     ------------------------------------------------------------
     A single reusable instance that manages message history,
     typing indicators, and rendering for one surface at a time.
     ============================================================ */
  function createChatInstance(opts) {
    var bodyEl = opts.bodyEl;
    var formEl = opts.formEl;
    var inputEl = opts.inputEl;
    var clearBtn = opts.clearBtn;
    var suggestionsEl = opts.suggestionsEl;
    var onOpen = opts.onOpen || null;

    if (!bodyEl) return null;

    var state = { isTyping: false, history: [] };

    function renderMessage(kind, text) {
      var bubble = createBubble(kind, text);
      bodyEl.appendChild(bubble);
      scrollToBottom(bodyEl);
    }

    function addBotMessage(text) {
      state.history.push({ role: "bot", text: text });
      renderMessage("bot", text);
    }

    function addUserMessage(text) {
      state.history.push({ role: "user", text: text });
      renderMessage("user", text);
    }

    function showTypingThenRespond(userText) {
      if (state.isTyping) return;
      state.isTyping = true;

      var typingBubble = createTypingBubble();
      bodyEl.appendChild(typingBubble);
      scrollToBottom(bodyEl);

      var delay = 550 + Math.random() * 550; // 550–1100ms
      window.setTimeout(function () {
        if (typingBubble.parentNode) {
          typingBubble.parentNode.removeChild(typingBubble);
        }
        state.isTyping = false;
        var reply = getBotResponse(userText);
        addBotMessage(reply);
      }, delay);
    }

    function handleUserSend(rawText) {
      var text = (rawText || "").trim();
      if (!text) return;
      addUserMessage(text);
      showTypingThenRespond(text);
    }

    function clearChat() {
      bodyEl.innerHTML = "";
      state.history = [];
      state.isTyping = false;
      addBotMessage(WELCOME_MESSAGE);
      renderSuggestions();
    }

    function renderSuggestions() {
      if (!suggestionsEl) return;
      suggestionsEl.innerHTML = "";
      // Show a subset of suggestions
      var subset = SUGGESTIONS.slice(0, 6);
      subset.forEach(function (q) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.textContent = q;
        btn.addEventListener("click", function () {
          handleUserSend(q);
          // Hide suggestions after first interaction
          suggestionsEl.innerHTML = "";
        });
        suggestionsEl.appendChild(btn);
      });
    }

    // Wire form
    if (formEl) {
      formEl.addEventListener("submit", function (e) {
        e.preventDefault();
        if (!inputEl) return;
        var text = inputEl.value;
        inputEl.value = "";
        handleUserSend(text);
      });
    }

    // Wire clear
    if (clearBtn) {
      clearBtn.addEventListener("click", clearChat);
    }

    // Initial render
    addBotMessage(WELCOME_MESSAGE);
    renderSuggestions();

    return {
      clear: clearChat,
      focus: function () {
        if (inputEl && typeof inputEl.focus === "function") inputEl.focus();
      },
      open: onOpen
    };
  }

  /* ============================================================
     7. FLOATING WIDGET
     ============================================================ */
  function initFloatingWidget() {
    var fab = document.getElementById("chatFab");
    var widget = document.getElementById("chatWidget");
    var bodyEl = document.getElementById("chatBody");
    var formEl = document.getElementById("chatForm");
    var inputEl = document.getElementById("chatInput");
    var closeBtn = document.getElementById("chatClose");
    var clearBtn = document.getElementById("chatClear");
    var suggestionsEl = document.getElementById("chatSuggestions");

    // If the widget isn't present on this page, skip silently.
    if (!fab || !widget || !bodyEl) return;

    var instance = createChatInstance({
      bodyEl: bodyEl,
      formEl: formEl,
      inputEl: inputEl,
      clearBtn: clearBtn,
      suggestionsEl: suggestionsEl
    });

    function openWidget() {
      widget.classList.add("open");
      widget.setAttribute("aria-hidden", "false");
      fab.setAttribute("aria-expanded", "true");
      if (instance) instance.focus();
    }

    function closeWidget() {
      widget.classList.remove("open");
      widget.setAttribute("aria-hidden", "true");
      fab.setAttribute("aria-expanded", "false");
    }

    fab.addEventListener("click", function () {
      if (widget.classList.contains("open")) {
        closeWidget();
      } else {
        openWidget();
      }
    });

    if (closeBtn) closeBtn.addEventListener("click", closeWidget);

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && widget.classList.contains("open")) {
        closeWidget();
      }
    });
  }

  /* ============================================================
     8. DEDICATED CHATBOT PAGE PANEL
     ------------------------------------------------------------
     On chatbot.html, an inline panel is used instead of the
     floating widget. The floating widget is still present for
     consistency but the page panel is the primary interface.
     ============================================================ */
  function initPagePanel() {
    var pageBody = document.getElementById("chatPageBody");
    if (!pageBody) return;

    var pageForm = document.getElementById("chatPageForm");
    var pageInput = document.getElementById("chatPageInput");
    var pageClear = document.getElementById("chatPageClear");
    var pageSuggestions = document.getElementById("chatPageSuggestions");

    createChatInstance({
      bodyEl: pageBody,
      formEl: pageForm,
      inputEl: pageInput,
      clearBtn: pageClear,
      suggestionsEl: pageSuggestions
    });
  }

  /* ============================================================
     9. INITIALIZATION
     ============================================================ */
  function init() {
    initFloatingWidget();
    initPagePanel();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();