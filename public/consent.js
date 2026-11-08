// Souhlas s reklamními cookies (Google Ads). Bez souhlasu se kód Googlu vůbec nenačte.
// Volba se pamatuje v localStorage („vs-consent“: granted / denied); změnit ji jde odkazem „Nastavení cookies“.
(function () {
  var KEY = 'vs-consent';
  var TAG_ID = 'AW-18561475256';
  // Štítky konverzních akcí z Google Ads (Cíle → Konverze → akce → Nastavení značky → send_to „AW-…/ŠTÍTEK“).
  var CONVERSIONS = { sign_up: '', purchase: '' };
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }

  function read() {
    try {
      return localStorage.getItem(KEY);
    } catch (e) {
      return null;
    }
  }
  function save(v) {
    try {
      localStorage.setItem(KEY, v);
    } catch (e) {
      /* soukromý režim – volba platí jen do zavření stránky */
    }
  }

  var state = read();
  var loaded = false;
  function load() {
    if (loaded) return;
    loaded = true;
    gtag('consent', 'default', { ad_storage: 'granted', ad_user_data: 'granted', ad_personalization: 'denied', analytics_storage: 'denied' });
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + TAG_ID;
    document.head.appendChild(s);
    gtag('js', new Date());
    gtag('config', TAG_ID);
  }

  /** Událost pro měření konverzí (sign_up, purchase). Bez souhlasu se nic neodešle. */
  window.vsTrack = function (event, params) {
    if (state !== 'granted') return;
    gtag('event', event, params || {});
    var label = CONVERSIONS[event];
    if (label) {
      var p = { send_to: TAG_ID + '/' + label };
      if (params && params.value) {
        p.value = params.value;
        p.currency = params.currency;
        p.transaction_id = params.transaction_id;
      }
      gtag('event', 'conversion', p);
    }
  };

  var banner = null;
  function close() {
    if (banner) banner.remove();
    banner = null;
  }
  function choose(v) {
    state = v;
    save(v);
    close();
    if (v === 'granted') load();
    else if (loaded) location.reload(); // odvolání souhlasu: zahodit už načtený kód Googlu
  }
  function show() {
    if (banner) return;
    banner = document.createElement('div');
    banner.className = 'consent';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Souhlas s cookies');
    banner.innerHTML =
      '<p>Se souhlasem použijeme cookies Google Ads, abychom věděli, které reklamy vedou k registraci. ' +
      'Bez souhlasu funguje web i aplikace stejně. <a href="/soukromi.html#cookies">Více informací</a></p>' +
      '<div class="consent-actions"><button type="button" data-v="denied">Odmítnout</button>' +
      '<button type="button" data-v="granted">Přijmout</button></div>';
    banner.addEventListener('click', function (e) {
      var v = e.target && e.target.getAttribute && e.target.getAttribute('data-v');
      if (v) choose(v);
    });
    document.body.appendChild(banner);
  }

  var css = document.createElement('link');
  css.rel = 'stylesheet';
  css.href = '/consent.css';
  document.head.appendChild(css);

  if (state === 'granted') load();
  function init() {
    if (state !== 'granted' && state !== 'denied') show();
    document.addEventListener('click', function (e) {
      var t = e.target && e.target.closest && e.target.closest('[data-consent-open]');
      if (t) {
        e.preventDefault();
        show();
      }
    });
  }
  if (document.body) init();
  else document.addEventListener('DOMContentLoaded', init);
})();
