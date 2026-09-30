/* ============================================================
   site.js · 杂志海报版 · 全站共用脚本
   ① 图版库（纯 SVG，颜色全部走 CSS 变量，换肤自动跟随）
   ② 全站交互：主题/强调色、移动端菜单、滚动态、进场、
      磁吸按钮、FAQ、分类筛选、搜索演示、表单演示、当前页高亮
   ============================================================ */
(function () {
  'use strict';

  /* ----------------------------------------------------------
     0. 运行环境
     ---------------------------------------------------------- */
  var STILL = location.search.indexOf('still') > -1;
  var Q = location.search;
  var reduce = STILL || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var root = document.documentElement;

  /* ----------------------------------------------------------
     1. 图版库
     统一 viewBox 0 0 800 600；用 preserveAspectRatio="slice" 填满任意容器。
     颜色只用 var(--plate-bg) / var(--plate-fg) / var(--accent)，
     所以深色/浅色皮肤切换时图版自动跟随。
     ---------------------------------------------------------- */
  function grid(cols, rows, op) {
    var d = '', i;
    for (i = 1; i < cols; i++) d += 'M' + Math.round(800 / cols * i) + ' 0V600';
    for (i = 1; i < rows; i++) d += 'M0 ' + Math.round(600 / rows * i) + 'H800';
    return '<path d="' + d + '" fill="none"/>'.replace('fill="none"', 'stroke="var(--plate-fg)" stroke-width="1" opacity="' + (op || 0.07) + '"');
  }
  function base(inner, extra) {
    return '<rect width="800" height="600" fill="var(--plate-bg)"/>' + (extra || '') + inner;
  }

  var PLATES = {
    /* 罗盘：同心环（缓转）+ 强调色大圆 + 墨条 */
    compass: function () {
      return base(
        grid(6, 5, 0.07) +
        '<g class="rings" fill="none" stroke="var(--plate-fg)" stroke-width="1" opacity=".38">' +
        '<circle cx="180" cy="430" r="38"/><circle cx="180" cy="430" r="68"/>' +
        '<circle cx="180" cy="430" r="98"/><circle cx="180" cy="430" r="128"/>' +
        '<circle cx="180" cy="430" r="158"/><circle cx="180" cy="430" r="188"/></g>' +
        '<circle cx="560" cy="170" r="212" fill="var(--accent)"/>' +
        '<circle cx="560" cy="170" r="212" fill="none" stroke="var(--plate-fg)" stroke-width="1" opacity=".3"/>' +
        '<g fill="var(--plate-fg)"><rect x="0" y="252" width="286" height="8"/>' +
        '<rect x="0" y="274" width="176" height="8" opacity=".55"/>' +
        '<rect x="0" y="296" width="226" height="8" opacity=".3"/></g>' +
        '<rect x="430" y="500" width="66" height="66" fill="var(--plate-fg)"/>' +
        '<rect x="512" y="500" width="66" height="66" fill="none" stroke="var(--plate-fg)" stroke-width="1" opacity=".5"/>'
      );
    },
    /* 轨道：大圆环 + 偏心强调圆 + 十字线 */
    orbit: function () {
      return base(
        '<circle cx="400" cy="300" r="196" fill="none" stroke="var(--plate-fg)" stroke-width="1" opacity=".45"/>' +
        '<circle cx="400" cy="300" r="130" fill="none" stroke="var(--plate-fg)" stroke-width="1" opacity=".2"/>' +
        '<circle cx="470" cy="230" r="92" fill="var(--accent)"/>' +
        '<path d="M0 300H204M596 300H800M400 0V104M400 496V600" stroke="var(--plate-fg)" stroke-width="1" opacity=".45"/>' +
        '<rect x="330" y="430" width="46" height="46" fill="var(--plate-fg)" opacity=".9"/>'
      );
    },
    /* 柱阵：横格线 + 高低柱 */
    columns: function () {
      return base(
        '<g stroke="var(--plate-fg)" stroke-width="1" opacity=".22" fill="none">' +
        '<path d="M0 470H800M0 400H800M0 330H800M0 260H800M0 190H800M0 120H800"/></g>' +
        '<rect x="96" y="330" width="86" height="140" fill="var(--plate-fg)" opacity=".85"/>' +
        '<rect x="220" y="216" width="86" height="254" fill="var(--accent)"/>' +
        '<rect x="344" y="272" width="86" height="198" fill="var(--plate-fg)" opacity=".55"/>' +
        '<rect x="468" y="160" width="86" height="310" fill="var(--plate-fg)" opacity=".3"/>' +
        '<rect x="592" y="300" width="86" height="170" fill="none" stroke="var(--plate-fg)" stroke-width="1" opacity=".6"/>'
      );
    },
    /* 层叠：三块错位方板 */
    stack: function () {
      return base(
        '<rect x="150" y="96" width="230" height="330" fill="var(--plate-fg)" opacity=".16"/>' +
        '<rect x="286" y="152" width="230" height="330" fill="var(--plate-fg)" opacity=".9"/>' +
        '<rect x="422" y="208" width="230" height="330" fill="var(--accent)"/>' +
        '<path d="M60 560H740" stroke="var(--plate-fg)" stroke-width="1" opacity=".35"/>'
      );
    },
    /* 节点：网络连线 */
    nodes: function () {
      var pts = [[130, 140], [300, 96], [470, 180], [640, 110], [200, 320], [380, 300], [560, 340], [700, 280], [260, 480], [460, 470], [650, 490]];
      var lines = [[0, 1], [1, 2], [2, 3], [0, 4], [1, 5], [2, 5], [3, 6], [4, 5], [5, 6], [6, 7], [4, 8], [5, 9], [6, 10], [8, 9], [9, 10], [5, 9]];
      var s = '', i;
      for (i = 0; i < lines.length; i++) {
        var a = pts[lines[i][0]], b = pts[lines[i][1]];
        s += '<path d="M' + a[0] + ' ' + a[1] + 'L' + b[0] + ' ' + b[1] + '" stroke="var(--plate-fg)" stroke-width="1" opacity=".28"/>';
      }
      for (i = 0; i < pts.length; i++) {
        var big = (i === 5);
        s += '<circle cx="' + pts[i][0] + '" cy="' + pts[i][1] + '" r="' + (big ? 26 : 9) + '" fill="' + (big ? 'var(--accent)' : 'var(--plate-fg)') + '" opacity="' + (big ? 1 : .8) + '"/>';
      }
      return base(s);
    },
    /* 弧：四分弧群 */
    arc: function () {
      return base(
        '<g fill="none" stroke="var(--plate-fg)" stroke-width="1">' +
        '<circle cx="0" cy="0" r="200" opacity=".4"/><circle cx="0" cy="0" r="300" opacity=".3"/>' +
        '<circle cx="0" cy="0" r="400" opacity=".22"/><circle cx="0" cy="0" r="500" opacity=".16"/>' +
        '<circle cx="0" cy="0" r="600" opacity=".1"/></g>' +
        '<path d="M0 0L250 0A250 250 0 0 1 0 250Z" fill="var(--accent)" opacity=".92"/>' +
        '<g fill="var(--plate-fg)"><rect x="560" y="120" width="180" height="7"/>' +
        '<rect x="560" y="146" width="118" height="7" opacity=".55"/>' +
        '<rect x="560" y="172" width="150" height="7" opacity=".3"/></g>' +
        '<rect x="600" y="440" width="60" height="60" fill="var(--plate-fg)"/>'
      );
    },
    /* 条带：横向墨条粗细渐变 */
    bars: function () {
      var s = '', y = 90, w = 620, i, op = 0.95;
      for (i = 0; i < 9; i++) {
        if (i === 3) { s += '<rect x="90" y="' + y + '" width="' + w + '" height="14" fill="var(--accent)"/>'; }
        else { s += '<rect x="90" y="' + y + '" width="' + Math.round(w * (1 - i * 0.085)) + '" height="9" fill="var(--plate-fg)" opacity="' + op.toFixed(2) + '"/>'; }
        y += 48; op -= 0.1;
      }
      return base(s);
    },
    /* 斜切：对角分割 */
    split: function () {
      return base(
        '<path d="M0 600L800 0V600Z" fill="var(--plate-fg)" opacity=".1"/>' +
        '<path d="M0 600L520 0H800V600Z" fill="var(--accent)" opacity=".9"/>' +
        '<path d="M0 600L520 0" stroke="var(--plate-fg)" stroke-width="1" opacity=".5" fill="none"/>' +
        '<rect x="470" y="400" width="70" height="70" fill="var(--plate-fg)"/>' +
        '<g fill="var(--plate-fg)" opacity=".8"><rect x="60" y="90" width="200" height="7"/>' +
        '<rect x="60" y="116" width="130" height="7" opacity=".6"/></g>'
      );
    },
    /* 齿环：带刻度的圆环 */
    rings2: function () {
      var s = '<circle cx="400" cy="300" r="200" fill="none" stroke="var(--plate-fg)" stroke-width="1" opacity=".3"/>' +
        '<circle cx="400" cy="300" r="120" fill="none" stroke="var(--accent)" stroke-width="2"/>';
      var i, a, r1 = 200, r2;
      for (i = 0; i < 36; i++) {
        a = i * 10 * Math.PI / 180;
        r2 = (i % 9 === 0) ? 172 : 186;
        s += '<path d="M' + (400 + r1 * Math.cos(a)).toFixed(1) + ' ' + (300 + r1 * Math.sin(a)).toFixed(1) +
          'L' + (400 + r2 * Math.cos(a)).toFixed(1) + ' ' + (300 + r2 * Math.sin(a)).toFixed(1) +
          '" stroke="var(--plate-fg)" stroke-width="1" opacity=".45"/>';
      }
      return base(s + '<rect x="371" y="271" width="58" height="58" fill="var(--plate-fg)" opacity=".9"/>');
    },
    /* 密格：细网格 + 强调小方 + 墨条 */
    grid2: function () {
      return base(
        grid(16, 12, 0.09) +
        '<rect x="500" y="80" width="180" height="180" fill="var(--accent)"/>' +
        '<rect x="120" y="380" width="240" height="8" fill="var(--plate-fg)"/>' +
        '<rect x="120" y="404" width="150" height="8" fill="var(--plate-fg)" opacity=".5"/>' +
        '<rect x="120" y="428" width="196" height="8" fill="var(--plate-fg)" opacity=".28"/>'
      );
    },
    /* 点阵 */
    dots: function () {
      var s = '', x, y, i = 0;
      for (y = 80; y <= 520; y += 55) {
        for (x = 90; x <= 710; x += 55) {
          i++;
          var accent = (i === 7 || i === 18 || i === 29 || i === 40);
          s += '<circle cx="' + x + '" cy="' + y + '" r="' + (accent ? 17 : 6) + '" fill="' + (accent ? 'var(--accent)' : 'var(--plate-fg)') + '" opacity="' + (accent ? 1 : .5) + '"/>';
        }
      }
      return base(s);
    },
    /* 阶梯 */
    ladder: function () {
      var s = '', i, y = 120, w = 120;
      for (i = 0; i < 6; i++) {
        s += '<rect x="80" y="' + y + '" width="' + w + '" height="10" fill="var(--plate-fg)" opacity="' + (0.9 - i * 0.13).toFixed(2) + '"/>';
        y += 62; w += 96;
      }
      return base(s + '<rect x="560" y="60" width="180" height="180" fill="var(--accent)" opacity=".9"/>');
    },
    /* 刊号：大号数字 */
    numeral: function () {
      return base(
        '<text x="400" y="380" text-anchor="middle" font-family="Playfair Display,Georgia,serif" ' +
        'font-size="300" fill="none" stroke="var(--plate-fg)" stroke-width="2" opacity=".55">01</text>' +
        '<circle cx="400" cy="300" r="230" fill="none" stroke="var(--plate-fg)" stroke-width="1" opacity=".18"/>' +
        '<path d="M80 520H720" stroke="var(--accent)" stroke-width="3"/>'
      );
    },
    /* 波纹 */
    wave: function () {
      return base(
        '<g fill="none" stroke="var(--plate-fg)" stroke-width="1" opacity=".35">' +
        '<path d="M0 200C160 120 240 280 400 200S640 120 800 200"/>' +
        '<path d="M0 280C160 200 240 360 400 280S640 200 800 280"/>' +
        '<path d="M0 360C160 280 240 440 400 360S640 280 800 360"/>' +
        '<path d="M0 440C160 360 240 520 400 440S640 360 800 440"/></g>' +
        '<rect x="300" y="70" width="200" height="90" fill="var(--accent)" opacity=".92"/>'
      );
    },
    /* 尺规 */
    ruler: function () {
      return base(
        '<g stroke="var(--plate-fg)" stroke-width="1" opacity=".35"><path d="M0 300H800"/><path d="M400 0V600"/></g>' +
        '<g stroke="var(--plate-fg)" stroke-width="1" opacity=".5">' +
        '<path d="M120 240V360M220 260V340M320 275V325"/><path d="M520 240V360M620 260V340M720 275V325"/></g>' +
        '<circle cx="400" cy="300" r="140" fill="none" stroke="var(--accent)" stroke-width="1.5"/>' +
        '<circle cx="400" cy="300" r="7" fill="var(--plate-fg)"/>'
      );
    },
    /* 肖像位（关于页用）：抽象人形剪影块面 */
    portrait: function () {
      return base(
        '<g fill="var(--plate-fg)" opacity=".09"><path d="M100 600V120h600v480z"/></g>' +
        '<circle cx="400" cy="250" r="118" fill="none" stroke="var(--plate-fg)" stroke-width="1" opacity=".4"/>' +
        '<circle cx="400" cy="250" r="118" fill="var(--accent)" opacity=".9"/>' +
        '<path d="M180 600c0-121 98-220 220-220s220 99 220 220z" fill="var(--plate-fg)" opacity=".85"/>' +
        grid(6, 5, 0.06) +
        '<path d="M0 600H800" stroke="var(--plate-fg)" stroke-width="1" opacity=".5"/>'
      );
    }
  };

  /* 图版注入 */
  var CYCLE = ['columns', 'orbit', 'nodes', 'bars', 'arc', 'split', 'rings2', 'dots', 'ladder', 'wave', 'grid2', 'compass'];
  var cycleAt = 0;
  var slots = document.querySelectorAll('[data-plate]');
  Array.prototype.forEach.call(slots, function (el) {
    var name = el.getAttribute('data-plate');
    if (name === 'cycle') { name = CYCLE[cycleAt++ % CYCLE.length]; }
    var fn = PLATES[name] || PLATES.grid2;
    var label = el.getAttribute('aria-label');
    el.innerHTML = '<svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice"' +
      (label ? ' role="img" aria-label="' + label + '"' : ' aria-hidden="true"') + '>' + fn() + '</svg>';
  });

  /* ----------------------------------------------------------
     1b. 跑马灯分词（Publii 适配）
     后台「Ticker words」是一个纯文本框，用户会写成一整串逗号分隔的词。
     设计稿里每个词是独立的 <span>（各自带一个强调色圆点）。
     这里按逗号/顿号/竖线拆开重建成 span，再把整组复制一份接在后面，
     这样 transform:translateX(-50%) 的无缝循环才成立。
     好处：后台永远只有一个简单输入框，不用让用户去凑 5 个字段。
     ---------------------------------------------------------- */
  Array.prototype.forEach.call(document.querySelectorAll('.ticker__track'), function (track) {
    // 模板为了「无 JS 兜底」放了同样内容的两份 span，所以只取第一份作为词源，
    // 否则拆出来的词会被重复两遍。
    var src = (track.children[0] ? track.children[0].textContent : track.textContent) || '';
    src = src.trim();
    if (!src) { return; }
    var words = src.split(/[,，、|]/).map(function (w) { return w.trim(); }).filter(Boolean);
    if (words.length < 2) { return; }
    var group = words.map(function (w) {
      var s = document.createElement('span');
      s.textContent = w;
      return s.outerHTML;
    }).join('');
    track.innerHTML = group + group;   // 两份，才能无缝循环
  });

  /* ----------------------------------------------------------
     2. 主题 / 强调色
     ---------------------------------------------------------- */
  if (STILL) {
    document.body.classList.add('is-still');
    document.body.classList.remove('is-hero');
    if (Q.indexOf('theme=ink') > -1) root.dataset.theme = 'ink';
    if (Q.indexOf('accent=b') > -1) root.dataset.accent = 'b';
    if (Q.indexOf('accent=c') > -1) root.dataset.accent = 'c';
  } else {
    try {
      var t = localStorage.getItem('zy-theme'); if (t) root.dataset.theme = t;
      var a = localStorage.getItem('zy-accent'); if (a) root.dataset.accent = a;
    } catch (e) { }
  }

  var themeBtn = document.getElementById('themeBtn');
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      root.dataset.theme = root.dataset.theme === 'ink' ? 'paper' : 'ink';
      try { localStorage.setItem('zy-theme', root.dataset.theme); } catch (e) { }
    });
  }
  var sws = document.querySelectorAll('.sw');
  Array.prototype.forEach.call(sws, function (b) {
    b.classList.toggle('is-on', b.dataset.accent === root.dataset.accent);
    b.addEventListener('click', function () {
      root.dataset.accent = b.dataset.accent;
      Array.prototype.forEach.call(sws, function (x) { x.classList.toggle('is-on', x === b); });
      try { localStorage.setItem('zy-accent', b.dataset.accent); } catch (e) { }
    });
  });

  /* ----------------------------------------------------------
     3. 移动端菜单
     ---------------------------------------------------------- */
  var burger = document.getElementById('burger');
  if (burger) {
    burger.addEventListener('click', function () {
      var open = document.body.classList.toggle('nav-open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    Array.prototype.forEach.call(document.querySelectorAll('.mnav a'), function (a) {
      a.addEventListener('click', function () { document.body.classList.remove('nav-open'); });
    });
  }

  /* ----------------------------------------------------------
     4. 当前页高亮（按文件名自动判断，改页面不用手改导航）
     ---------------------------------------------------------- */
  function normPath(u) {
    if (!u || u.charAt(0) === '#') return '';
    try { u = new URL(u, location.origin).pathname; } catch (e) { return ''; }
    if (u.length > 10 && u.slice(-10) === 'index.html') u = u.slice(0, -10);
    if (u.length > 1 && u.slice(-1) === '/') u = u.slice(0, -1);
    return u || '/';
  }
  var here = normPath(location.pathname);
  Array.prototype.forEach.call(document.querySelectorAll('[data-nav]'), function (a) {
    var target = normPath(a.getAttribute('href'));
    if (!target) return;
    if (target === here) { a.classList.add('is-cur'); return; }
    if (target !== '/' && here.indexOf(target + '/') === 0) a.classList.add('is-cur');
  });

  /* ----------------------------------------------------------
     5. 页头滚动态 + 光斑
     ---------------------------------------------------------- */
  var head = document.getElementById('masthead');
  var isHeroPage = document.body.classList.contains('page-hero');
  function onScroll() {
    var y = window.scrollY || 0;
    if (head) head.classList.toggle('is-stuck', y > 24);
    if (isHeroPage && !STILL) document.body.classList.toggle('is-hero', y < window.innerHeight * 0.8);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  var mx = 0, my = 0, queued = false;
  document.addEventListener('pointermove', function (e) {
    mx = e.clientX; my = e.clientY;
    if (queued || reduce) return;
    queued = true;
    requestAnimationFrame(function () {
      root.style.setProperty('--mx', mx + 'px');
      root.style.setProperty('--my', my + 'px');
      queued = false;
    });
  }, { passive: true });

  /* ----------------------------------------------------------
     6. 滚动进场
     ---------------------------------------------------------- */
  var reve = document.querySelectorAll('.reveal, .quote');
  if (STILL || !('IntersectionObserver' in window)) {
    Array.prototype.forEach.call(reve, function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.16, rootMargin: '0px 0px -8% 0px' });
    Array.prototype.forEach.call(reve, function (el) { io.observe(el); });
  }

  /* ----------------------------------------------------------
     7. 图版视差（只在首屏那张）
     ---------------------------------------------------------- */
  var pbox = document.getElementById('plateBox');
  if (pbox && !reduce) {
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var r = pbox.getBoundingClientRect();
        var p = Math.max(-1, Math.min(1, (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight));
        pbox.style.transform = 'translateY(' + (p * 26).toFixed(1) + 'px)';
        ticking = false;
      });
    }, { passive: true });
  }

  /* ----------------------------------------------------------
     8. 磁吸按钮
     ---------------------------------------------------------- */
  if (!reduce && window.matchMedia('(hover:hover)').matches) {
    Array.prototype.forEach.call(document.querySelectorAll('[data-magnet]'), function (el) {
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        el.style.setProperty('--tx', ((e.clientX - (r.left + r.width / 2)) / r.width * 12).toFixed(1) + 'px');
        el.style.setProperty('--ty', ((e.clientY - (r.top + r.height / 2)) / r.height * 8).toFixed(1) + 'px');
      });
      el.addEventListener('pointerleave', function () {
        el.style.setProperty('--tx', '0px');
        el.style.setProperty('--ty', '0px');
      });
    });
  }

  /* ----------------------------------------------------------
     9. FAQ 折叠
     ---------------------------------------------------------- */
  Array.prototype.forEach.call(document.querySelectorAll('.faq__item'), function (item) {
    var q = item.querySelector('.faq__q'), a = item.querySelector('.faq__a');
    if (!q || !a) return;
    q.setAttribute('aria-expanded', 'false');
    q.addEventListener('click', function () {
      var open = item.classList.toggle('is-open');
      q.setAttribute('aria-expanded', open ? 'true' : 'false');
      a.style.maxHeight = open ? (a.scrollHeight + 40) + 'px' : '0px';
    });
  });
  if (STILL) {
    Array.prototype.forEach.call(document.querySelectorAll('.faq__a'), function (a) { a.style.maxHeight = 'none'; });
  }

  /* ----------------------------------------------------------
     10. 分类筛选（文章列表 / 主题页）
     ---------------------------------------------------------- */
  var chips = document.querySelectorAll('[data-filter]');
  if (chips.length) {
    var targets = document.querySelectorAll('[data-cat]');
    Array.prototype.forEach.call(chips, function (c) {
      c.addEventListener('click', function () {
        var key = c.getAttribute('data-filter');
        Array.prototype.forEach.call(chips, function (x) { x.classList.toggle('is-on', x === c); });
        var shown = 0;
        Array.prototype.forEach.call(targets, function (t) {
          var hit = (key === 'all' || t.getAttribute('data-cat') === key);
          t.style.display = hit ? '' : 'none';
          if (hit) shown++;
        });
        var cnt = document.getElementById('filterCount');
        if (cnt) cnt.textContent = shown;
        var emptyBox = document.getElementById('filterEmpty');
        if (emptyBox) emptyBox.hidden = shown > 0;
      });
    });
  }

  /* ----------------------------------------------------------
     11. 搜索演示（纯前端，不发请求）
     ---------------------------------------------------------- */
  var sForm = document.getElementById('searchForm');
  if (sForm) {
    var sInput = sForm.querySelector('input');
    var hits = document.querySelectorAll('[data-hit]');
    var none = document.getElementById('searchEmpty');
    var meta = document.getElementById('searchMeta');
    var total = hits.length;
    function run() {
      var q = (sInput.value || '').trim().toLowerCase();
      var n = 0;
      Array.prototype.forEach.call(hits, function (h) {
        var ok = !q || h.getAttribute('data-hit').toLowerCase().indexOf(q) > -1;
        h.style.display = ok ? '' : 'none';
        if (ok) n++;
      });
      if (none) none.hidden = n > 0;
      if (meta) meta.textContent = q ? (n + ' / ' + total + ' 条匹配') : ('共 ' + total + ' 条');
    }
    sForm.addEventListener('submit', function (e) { e.preventDefault(); run(); });
    sInput.addEventListener('input', run);
    run();
  }

  /* ----------------------------------------------------------
     12. 表单演示（订阅 / 联系）
     ---------------------------------------------------------- */
  function bindDemo(id, okId, okText) {
    var f = document.getElementById(id), ok = document.getElementById(okId);
    if (!f) return;
    if (f.getAttribute('action')) return;
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var em = f.querySelector('input[type="email"]');
      if (em && (!em.value || em.value.indexOf('@') < 0)) {
        if (ok) { ok.textContent = 'Please enter a valid email.'; ok.classList.add('is-on'); }
        return;
      }
      if (ok) { ok.textContent = okText; ok.classList.add('is-on'); }
      f.reset();
    });
  }
  bindDemo('subForm', 'subOk', "Thanks — you're on the list. (demo only)");
  bindDemo('contactForm', 'contactOk', 'Received — demo only, nothing was sent.');

  /* ----------------------------------------------------------
     13. 数据上报（演示：点击合作按钮）
     ---------------------------------------------------------- */
  if (!document.getElementById('__demo_note')) {
    var n = document.createElement('span');
    n.id = '__demo_note';
    n.style.display = 'none';
    n.textContent = 'design draft';
    document.body.appendChild(n);
  }
})();
