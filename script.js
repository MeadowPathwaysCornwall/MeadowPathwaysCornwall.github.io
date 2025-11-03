/**
 * Meadow Pathways — scripts.js
 * Single site script to power sidebar toggle, smooth scroll, back-to-top,
 * small Formspree UX, and safe initialization of optional plugins.
 *
 * Place at end of body as: <script src="script.js"></script>
 *
 * This file assumes you have:
 * - sidebar container with class .sidebar-menu and toggle .menu-trigger
 * - page content container .page-content
 * - buttons / links using .main-button and internal anchors
 * - forms posting to Formspree (optional)
 * - optional libs: bootstrap.min.js, owl-carousel.js, lightbox.js (initialised only if present)
 */

(function () {
  "use strict";

  // Run when DOM is ready
  document.addEventListener("DOMContentLoaded", function () {
    // ---------- Sidebar toggle (mobile) ----------
    var sidebar = document.querySelector(".sidebar-menu");
    var trigger = document.querySelector(".menu-trigger");

    if (trigger && sidebar) {
      trigger.addEventListener("click", function (e) {
        e.preventDefault();
        sidebar.classList.toggle("active");
        // For accessibility: toggle aria-expanded on trigger if it exists as a button
        if (trigger.getAttribute("aria-expanded") !== null) {
          var expanded = trigger.getAttribute("aria-expanded") === "true";
          trigger.setAttribute("aria-expanded", String(!expanded));
        }
      });

      // Close sidebar when clicking outside it on small screens
      document.addEventListener("click", function (e) {
        if (
          sidebar.classList.contains("active") &&
          !sidebar.contains(e.target) &&
          !trigger.contains(e.target)
        ) {
          sidebar.classList.remove("active");
          if (trigger.getAttribute("aria-expanded") !== null) {
            trigger.setAttribute("aria-expanded", "false");
          }
        }
      });
    }

    // ---------- Active menu link highlight (basic) ----------
    try {
      var menuLinks = document.querySelectorAll(".main-menu a");
      var current = window.location.pathname.split("/").pop() || "index.html";
      menuLinks.forEach(function (a) {
        var href = (a.getAttribute("href") || "").split("/").pop();
        if (href && href === current) {
          a.parentElement && a.parentElement.classList.add("active");
        } else {
          a.parentElement && a.parentElement.classList.remove("active");
        }
      });
    } catch (e) {
      /* no-op */
    }

    // ---------- Smooth scroll for same-page anchors ----------
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener("click", function (e) {
        var targetSelector = this.getAttribute("href");
        if (targetSelector.length === 1) return; // href="#"
        var target = document.querySelector(targetSelector);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: "smooth", block: "start" });
          // move focus for accessibility
          target.setAttribute("tabindex", "-1");
          target.focus({ preventScroll: true });
        }
      });
    });

    // ---------- Back to top button (insert if not present) ----------
    (function setupBackToTop() {
      var btn = document.querySelector(".back-to-top");
      if (!btn) {
        btn = document.createElement("button");
        btn.className = "back-to-top";
        btn.type = "button";
        btn.setAttribute("aria-label", "Back to top");
        btn.textContent = "↑";
        // Basic styling fallbacks (allow CSS to override)
        btn.style.position = "fixed";
        btn.style.bottom = "20px";
        btn.style.right = "20px";
        btn.style.display = "none";
        btn.style.padding = "8px 10px";
        btn.style.borderRadius = "8px";
        btn.style.background = "#007f7f";
        btn.style.color = "#fff";
        btn.style.border = "none";
        btn.style.cursor = "pointer";
        btn.style.zIndex = "2000";
        document.body.appendChild(btn);
      }

      // Show/hide on scroll
      var showOn = 300;
      window.addEventListener("scroll", function () {
        if (window.scrollY > showOn) {
          btn.style.display = "inline-block";
          btn.classList && btn.classList.add("show");
        } else {
          btn.style.display = "none";
          btn.classList && btn.classList.remove("show");
        }
      });

      btn.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    })();

    // ---------- Formspree UX enhancement (graceful, non-blocking) ----------
    (function enhanceForms() {
      var forms = document.querySelectorAll('form[action^="https://formspree.io"]');
      if (!forms || !forms.length) return;
      forms.forEach(function (form) {
        form.addEventListener("submit", function (e) {
          // Let the form submit normally (redirect will happen), but show immediate feedback
          try {
            var feedback = document.createElement("div");
            feedback.className = "form-feedback";
            feedback.setAttribute("role", "status");
            feedback.style.marginTop = "12px";
            feedback.style.padding = "10px 12px";
            feedback.style.borderRadius = "8px";
            feedback.style.background = "#f0f9f8";
            feedback.style.border = "1px solid rgba(0,127,127,0.08)";
            feedback.style.color = "#0b3b37";
            feedback.textContent = "Submitting… Please wait.";
            // Place feedback after the form submit button or at end of form
            var lastBtn = form.querySelector("button[type='submit'], input[type='submit']");
            if (lastBtn && lastBtn.parentNode) lastBtn.parentNode.insertBefore(feedback, lastBtn.nextSibling);
            else form.appendChild(feedback);
            // Allow default behaviour to continue (Formspree redirect)
          } catch (err) {
            // do nothing — keep normal submission
          }
        });
      });
    })();

    // ---------- Safe plugin initialisation (only if libs are present) ----------
    (function initOptionalPlugins() {
      // Owl carousel if present and you have .owl-carousel elements
      try {
        if (window.jQuery && typeof window.jQuery.fn.owlCarousel === "function") {
          window.jQuery(".owl-carousel").each(function () {
            var $el = window.jQuery(this);
            $el.owlCarousel({ items: 1, loop: true, autoplay: true, autoplayTimeout: 5000, nav: true, dots: true });
          });
        }
      } catch (e) {
        /* optional plugin not present or init failed */
      }

      // Lightbox initialisation (if lightbox.js provides a global init)
      try {
        if (typeof lightbox !== "undefined" && typeof lightbox.option === "function") {
          lightbox.option({ resizeDuration: 200, wrapAround: true, fadeDuration: 150 });
        }
      } catch (e) {
        /* no lightbox */
      }

      // Isotope grid (guarded)
      try {
        if (typeof Isotope !== "undefined") {
          var isoContainers = document.querySelectorAll(".isotope-grid");
          isoContainers.forEach(function (c) {
            new Isotope(c, { itemSelector: ".grid-item", layoutMode: "masonry" });
          });
        }
      } catch (e) {
        /* no isotope */
      }
    })();

    // ---------- Accessibility: focus outlines (if keyboard used) ----------
    (function keyboardFocusStyles() {
      var keyboardActive = false;
      window.addEventListener("keydown", function (e) {
        if (e.key === "Tab") {
          if (!keyboardActive) {
            document.documentElement.classList.add("user-is-tabbing");
            keyboardActive = true;
          }
        }
      });
      window.addEventListener("mousedown", function () {
        if (keyboardActive) {
          document.documentElement.classList.remove("user-is-tabbing");
          keyboardActive = false;
        }
      });
    })();

    // ---------- Small utility: ensure all external links open safely ----------
    (function externalLinks() {
      document.querySelectorAll('a[target="_blank"]').forEach(function (a) {
        if (!a.hasAttribute("rel")) a.setAttribute("rel", "noopener noreferrer");
      });
    })();
  }); // DOMContentLoaded end

  // Expose a tiny public API if needed later
  window.Meadow = window.Meadow || {};
  window.Meadow.hideSidebar = function () {
    var sb = document.querySelector(".sidebar-menu");
    if (sb) sb.classList.remove("active");
  };
})();
