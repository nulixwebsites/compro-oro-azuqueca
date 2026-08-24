(function(){
  /* Mobile menu */
  var btn = document.getElementById('menu-toggle');
  var menu = document.getElementById('mobile-menu');
  if (btn && menu) {
    btn.addEventListener('click', function(){
      var open = menu.classList.toggle('hidden') === false;
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    });
    menu.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){
        menu.classList.add('hidden');
        btn.setAttribute('aria-expanded','false');
        btn.setAttribute('aria-label','Abrir menú');
      });
    });
  }

  /* Product navigation: on narrow screens keep the current category centred
     instead of leaving the active pill clipped at the right edge. */
  var categoryStrip = document.querySelector('.cat-strip');
  var activeCategory = categoryStrip && categoryStrip.querySelector('.cat-pill.active');
  if (categoryStrip && activeCategory && categoryStrip.scrollWidth > categoryStrip.clientWidth) {
    categoryStrip.scrollLeft = activeCategory.offsetLeft - (categoryStrip.clientWidth - activeCategory.offsetWidth) / 2;
  }

  /* Motion: scroll reveals */
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReduced) {
    document.body.classList.add('motion-ready');
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
    document.querySelectorAll('.reveal, .img-reveal, .step-num-anim').forEach(function(el){ io.observe(el); });
  }

  /* Review carousel (no-op on pages without #rev-carousel) */
  var c = document.getElementById('rev-carousel');
  if (c) {
    var slides = c.querySelectorAll('.rev-slide');
    var dots = document.querySelectorAll('#rev-dots .rev-dot');
    var n = slides.length;
    var idx = 0;

    function go(i) {
      idx = ((i % n) + n) % n;
      var gap = parseFloat(getComputedStyle(c).gap) || 0;
      var offset = 0;
      for (var j = 0; j < idx; j++) offset += slides[j].offsetWidth + gap;
      var center = offset - (c.offsetWidth - slides[idx].offsetWidth) / 2;
      c.scrollTo({ left: Math.max(0, center), behavior: 'smooth' });
    }

    function syncDots() {
      var gap = parseFloat(getComputedStyle(c).gap) || 0;
      var best = 0, bestDist = 1e9, center = c.scrollLeft + c.offsetWidth / 2, pos = 0;
      for (var i = 0; i < n; i++) {
        var mid = pos + slides[i].offsetWidth / 2;
        var d = Math.abs(center - mid);
        if (d < bestDist) { bestDist = d; best = i; }
        pos += slides[i].offsetWidth + gap;
      }
      idx = best;
      dots.forEach(function(d, j){ d.classList.toggle('active', j === idx); });
    }

    var timer = setInterval(function(){ go(idx + 1); }, 5000);

    c.addEventListener('scroll', syncDots, { passive: true });
    c.addEventListener('pointerdown', function(){ clearInterval(timer); });
    c.addEventListener('pointerup', function(){
      timer = setInterval(function(){ go(idx + 1); }, 5000);
    });

    dots.forEach(function(d, i){
      d.addEventListener('click', function(){
        clearInterval(timer);
        go(i);
        timer = setInterval(function(){ go(idx + 1); }, 5000);
      });
    });
  }

  /* Subtle hero parallax (only on pages with .hero-tuned) */
  var heroImg = document.querySelector('.hero-tuned .img-cover');
  if (heroImg && !prefersReduced) {
    var ticking = false;
    window.addEventListener('scroll', function(){
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(function(){
          var y = window.scrollY;
          if (y < window.innerHeight) {
            heroImg.style.transform = 'scale(1.08) translateY(' + (y * 0.12) + 'px)';
          }
          ticking = false;
        });
      }
    }, { passive: true });
  }
})();
