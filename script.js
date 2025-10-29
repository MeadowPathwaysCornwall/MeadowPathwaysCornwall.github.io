// site.js — Meadow Pathways small utilities

(function () {
  // Back to top
  var backBtn = document.getElementById('backToTop');
  if (backBtn) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 300) backBtn.classList.add('show'); else backBtn.classList.remove('show');
    });
    backBtn.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
  }

  // Remove stray artifacts that might be injected or leftover
  var artifactSelectors = ['svg#__artifact','div.blue-circle','.stray-code','.random-programming-text'];
  artifactSelectors.forEach(function (sel) {
    var nodes = document.querySelectorAll(sel);
    nodes.forEach(function (n) {
      try { n.parentNode && n.parentNode.removeChild(n); } catch (e) { /* ignore */ }
    });
  });

  // Ensure hero background is applied — fallback check
  var hero = document.querySelector('.hero');
  if (hero) {
    var comp = window.getComputedStyle(hero, '::before');
    if (!comp || comp.backgroundImage === 'none' || comp.backgroundImage === '') {
      hero.style.backgroundImage = "url('BG.png')";
      hero.style.backgroundSize = "cover";
      hero.style.backgroundPosition = "center center";
    }
  }

  // Improve image loading (defer large images if needed)
  document.querySelectorAll('img').forEach(function(img){
    if(!img.hasAttribute('loading')) img.setAttribute('loading','lazy');
  });

})();
