/* Elvar mobile menu: three-line button (top left) that opens a slide-out page menu on phones. */
(function () {
  var ACU = 'https://elvarstrategyfirm.as.me/schedule/523525b2';
  var SECTIONS = [
    { title: 'Elvar Athlete', href: '/elvar-athlete', items: [
      ['One-on-One Partnerships', '/one-on-one-partnerships'],
      ['Team Partnerships', '/team-partnerships'],
      ['One-on-One Partner Portal', '/one-on-one-partner-portal'],
      ['Team Partner Portal', '/team-portal']
    ]},
    { title: 'Elvar Business', href: '/elvar-business', items: [
      ['Coaching for Business Owners', '/elvar-business/coaching'],
      ['Process & Systems Consulting', '/elvar-business/systems']
    ]}
  ];

  var css = `
  .em-btn{display:none;width:44px;height:44px;margin:0 6px 0 -8px;border-radius:12px;align-items:center;justify-content:center;flex-direction:column;gap:5px;background:none;border:0;cursor:pointer;-webkit-tap-highlight-color:transparent}
  .em-btn span{display:block;width:22px;height:2px;background:#fff;border-radius:2px;transition:transform .3s,opacity .3s}
  .em-left{display:flex;align-items:center}
  .em-scrim{position:fixed;inset:0;background:rgba(0,0,0,.6);opacity:0;pointer-events:none;transition:opacity .3s;z-index:998}
  .em-panel{position:fixed;top:0;left:0;bottom:0;width:min(86vw,360px);background:#1d1d1d;border-right:1px solid #3a3a3a;transform:translateX(-102%);transition:transform .35s cubic-bezier(.2,.8,.2,1);z-index:999;display:flex;flex-direction:column;font-family:Montserrat,system-ui,sans-serif;overflow-y:auto}
  .em-open .em-scrim{opacity:1;pointer-events:auto}
  .em-open .em-panel{transform:none}
  .em-head{display:flex;align-items:center;justify-content:space-between;padding:20px 22px;border-bottom:1px solid #3a3a3a}
  .em-mark{font-weight:900;font-size:24px;color:#fff;text-decoration:none;letter-spacing:.01em}
  .em-mark b{color:#C9A84C;font-weight:900}
  .em-x{width:40px;height:40px;border:0;background:none;color:#8a8a8a;font-size:28px;line-height:1;cursor:pointer}
  .em-body{padding:10px 22px 20px;flex:1}
  .em-home{display:block;padding:16px 0;border-bottom:1px solid #2e2e2e;color:#fff;text-decoration:none;font-weight:800;font-size:17px}
  .em-sec{padding:18px 0 10px;border-bottom:1px solid #2e2e2e}
  .em-sec>a{display:flex;justify-content:space-between;align-items:center;color:#fff;text-decoration:none;font-weight:800;font-size:17px}
  .em-sec>a::after{content:"\\2192";color:#C9A84C;font-weight:700}
  .em-sub{list-style:none;margin:10px 0 0;padding:0 0 0 2px}
  .em-sub a{display:block;padding:9px 0 9px 14px;border-left:2px solid #3a3a3a;color:#bdbdbd;text-decoration:none;font-size:15px;font-weight:600}
  .em-sub a:hover,.em-body a.em-cur{color:#C9A84C;border-left-color:#C9A84C}
  .em-home.em-cur,.em-sec>a.em-cur{color:#C9A84C}
  .em-cta{display:block;margin:24px 0 14px;padding:16px;border-radius:999px;background:#C9A84C;color:#1d1d1d;text-align:center;text-decoration:none;font-weight:800;font-size:13px;letter-spacing:.16em;text-transform:uppercase}
  .em-small{display:flex;gap:20px;justify-content:center;font-size:13px}
  .em-small a{color:#8a8a8a;text-decoration:none}
  .em-foot{padding:16px 22px 24px;color:#6b6b6b;font-size:10px;text-align:center}
  @media (max-width:860px){
    .em-btn{display:inline-flex}
    .em-host .links a:not(.nav-book),.em-host .navlinks{display:none!important}
  }
  body.em-lock{overflow:hidden}`;
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  function init() {
    var wrap = document.querySelector('nav .wrap, header.bar .wrap');
    if (!wrap || document.querySelector('.em-btn')) return;
    var here = location.pathname.replace(/\/+$/, '') || '/';
    var cur = function (h) { return h === here ? ' class="em-cur"' : ''; };

    // button goes to the left of the logo
    var logo = wrap.firstElementChild;
    var left = document.createElement('div'); left.className = 'em-left';
    var btn = document.createElement('button');
    btn.className = 'em-btn'; btn.type = 'button';
    btn.setAttribute('aria-label', 'Open menu'); btn.setAttribute('aria-expanded', 'false');
    btn.innerHTML = '<span></span><span></span><span></span>';
    wrap.insertBefore(left, logo); left.appendChild(btn); left.appendChild(logo);
    (wrap.closest('nav, header') || wrap).classList.add('em-host');

    var secs = SECTIONS.map(function (s) {
      return '<div class="em-sec"><a href="' + s.href + '"' + cur(s.href) + '>' + s.title + '</a><ul class="em-sub">' +
        s.items.map(function (i) { return '<li><a href="' + i[1] + '"' + cur(i[1]) + '>' + i[0] + '</a></li>'; }).join('') +
        '</ul></div>';
    }).join('');
    var shell = document.createElement('div');
    shell.innerHTML =
      '<div class="em-scrim"></div>' +
      '<aside class="em-panel" role="dialog" aria-modal="true" aria-label="Site menu">' +
        '<div class="em-head"><a class="em-mark" href="/">EL<b>V</b>AR</a><button class="em-x" type="button" aria-label="Close menu">&times;</button></div>' +
        '<div class="em-body">' +
          '<a class="em-home' + (here === '/' ? ' em-cur' : '') + '" href="/">Home</a>' + secs +
          '<a class="em-cta" href="' + ACU + '" target="_blank" rel="noopener">Book a Free Consult</a>' +
          '<div class="em-small"><a href="mailto:mike@elvarstrategyfirm.com">Email</a><a href="https://www.instagram.com/elvarmindset/" target="_blank" rel="noopener">Instagram</a><a href="/terms-and-conditions">Terms</a><a href="/privacy-policy">Privacy</a></div>' +
        '</div>' +
        '<div class="em-foot">Prepared by Michael Chaves Jr.</div>' +
      '</aside>';
    while (shell.firstChild) document.body.appendChild(shell.firstChild);

    var open = function (o) {
      document.documentElement.classList.toggle('em-open', o);
      document.body.classList.toggle('em-lock', o);
      btn.setAttribute('aria-expanded', o ? 'true' : 'false');
      if (o) document.querySelector('.em-x').focus();
    };
    btn.addEventListener('click', function () { open(true); });
    document.querySelector('.em-x').addEventListener('click', function () { open(false); btn.focus(); });
    document.querySelector('.em-scrim').addEventListener('click', function () { open(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') open(false); });
    document.querySelectorAll('.em-panel a').forEach(function (a) { a.addEventListener('click', function () { open(false); }); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
