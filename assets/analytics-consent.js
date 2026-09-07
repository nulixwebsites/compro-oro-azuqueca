(function () {
  "use strict";

  /**
   * Microsoft Clarity, gated behind explicit visitor consent (Consent V2).
   * Inert (no banner, no script, no request) whenever CLARITY_PROJECT_ID is empty.
   */
  var CLARITY_PROJECT_ID = "yd2fo1hyui";
  var STORAGE_KEY = "coa_analytics_consent";

  function getStoredConsent() {
    try {
      return window.localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function storeConsent(value) {
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch (e) {
      /* private mode / storage blocked: consent still applies for this page view */
    }
  }

  function injectClarityScript(projectId) {
    if (window.clarity) return;
    (function (c, l, a, r, i, t, y) {
      c[a] =
        c[a] ||
        function () {
          (c[a].q = c[a].q || []).push(arguments);
        };
      t = l.createElement(r);
      t.async = 1;
      t.src = "https://www.clarity.ms/tag/" + i;
      y = l.getElementsByTagName(r)[0];
      y.parentNode.insertBefore(t, y);
    })(window, document, "clarity", "script", projectId);
  }

  function applyConsent(state) {
    if (!CLARITY_PROJECT_ID) return;
    if (state === "granted") {
      injectClarityScript(CLARITY_PROJECT_ID);
      if (window.clarity) window.clarity("consent", true);
    } else if (state === "denied" && window.clarity) {
      window.clarity("consent", false);
    }
  }

  var returnFocusTo = null;

  function removeBanner() {
    var el = document.getElementById("cookie-consent");
    if (!el) return;
    el.classList.remove("is-visible");
    document.body.classList.remove("has-cookie-banner");
    window.setTimeout(function () {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, 250);
    if (returnFocusTo) {
      returnFocusTo.focus();
      returnFocusTo = null;
    }
  }

  function showBanner(opener) {
    if (document.getElementById("cookie-consent")) return;
    returnFocusTo = opener || null;
    document.body.classList.add("has-cookie-banner");
    var bar = document.createElement("div");
    bar.id = "cookie-consent";
    bar.setAttribute("role", "dialog");
    bar.setAttribute("aria-live", "polite");
    bar.setAttribute("aria-label", "Preferencias de cookies");
    bar.innerHTML =
      '<p>Usamos cookies de análisis para entender cómo se usa esta web y mejorarla. Puedes aceptarlas, rechazarlas, o cambiar de idea cuando quieras. <a href="politica-de-cookies.html">Más información</a>.</p>' +
      '<div class="cookie-actions">' +
      '<button type="button" data-action="deny">Rechazar</button>' +
      '<button type="button" data-action="accept">Aceptar</button>' +
      "</div>";
    document.body.appendChild(bar);
    var acceptBtn = bar.querySelector('[data-action="accept"]');
    acceptBtn.addEventListener("click", function () {
      storeConsent("granted");
      applyConsent("granted");
      removeBanner();
    });
    bar.querySelector('[data-action="deny"]').addEventListener("click", function () {
      storeConsent("denied");
      applyConsent("denied");
      removeBanner();
    });
    window.requestAnimationFrame(function () {
      bar.classList.add("is-visible");
      acceptBtn.focus();
    });
  }

  function attachSettingsButton() {
    var btn = document.getElementById("cookie-settings-btn");
    if (!btn || !CLARITY_PROJECT_ID) return;
    btn.hidden = false;
    btn.addEventListener("click", function () {
      showBanner(btn);
    });
  }

  document.addEventListener("DOMContentLoaded", attachSettingsButton);

  var existing = getStoredConsent();
  if (existing === "granted" || existing === "denied") {
    applyConsent(existing);
  } else if (CLARITY_PROJECT_ID) {
    document.addEventListener("DOMContentLoaded", function () {
      window.setTimeout(function () {
        showBanner(null);
      }, 600);
    });
  }
})();
