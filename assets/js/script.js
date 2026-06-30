/* =====================================================
   AKHMAD MUZAKKII - Portfolio JavaScript
   Custom Cursor · Particle System · Animations · Slider
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ====================================================
     1. CUSTOM CURSOR
  ==================================================== */
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');
  const trailContainer = document.getElementById('trailContainer');

  let mouseX = 0, mouseY = 0;
  let dotX = 0, dotY = 0;
  let ringX = 0, ringY = 0;
  let trailCounter = 0;

  const trailColors = [
    'rgba(108, 99, 255, 0.7)',
    'rgba(0, 212, 255, 0.6)',
    'rgba(255, 107, 157, 0.5)',
    'rgba(0, 255, 136, 0.4)',
  ];

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    trailCounter++;
    if (trailCounter % 3 === 0) createTrailDot(e.clientX, e.clientY);
  });

  function createTrailDot(x, y) {
    const dot = document.createElement('div');
    dot.className = 'trail-dot';
    const size = Math.random() * 6 + 3;
    const color = trailColors[Math.floor(Math.random() * trailColors.length)];
    dot.style.cssText = `
      width:${size}px; height:${size}px;
      background:${color};
      left:${x}px; top:${y}px;
      box-shadow:0 0 ${size * 2}px ${color};
    `;
    trailContainer.appendChild(dot);
    setTimeout(() => dot.remove(), 600);
  }

  function animateCursor() {
    dotX += (mouseX - dotX) * 0.9;
    dotY += (mouseY - dotY) * 0.9;
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    cursorDot.style.left = `${dotX}px`;
    cursorDot.style.top = `${dotY}px`;
    cursorRing.style.left = `${ringX}px`;
    cursorRing.style.top = `${ringY}px`;
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  const hoverTargets = document.querySelectorAll(
    'a, button, .project-card, .skill-category, .timeline-card, .tech-badge, .highlight-item, .slider-btn, .social-btn'
  );
  hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => cursorRing.classList.add('hovered'));
    el.addEventListener('mouseleave', () => cursorRing.classList.remove('hovered'));
  });
  document.addEventListener('mousedown', () => cursorRing.classList.add('clicked'));
  document.addEventListener('mouseup', () => cursorRing.classList.remove('clicked'));
  document.addEventListener('mouseleave', () => {
    cursorDot.style.opacity = '0'; cursorRing.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursorDot.style.opacity = '1'; cursorRing.style.opacity = '1';
  });

  /* ====================================================
     2. PARTICLE SYSTEM
  ==================================================== */
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.radius = Math.random() * 1.5 + 0.5;
      this.alpha = Math.random() * 0.5 + 0.1;
      this.color = Math.random() > 0.5 ? '108, 99, 255' : '0, 212, 255';
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      const dx = mouseX - this.x, dy = mouseY - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        const force = (120 - dist) / 120;
        this.vx -= (dx / dist) * force * 0.05;
        this.vy -= (dy / dist) * force * 0.05;
      }
      const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
      if (speed > 2) { this.vx *= 0.95; this.vy *= 0.95; }
      if (this.x < 0) this.x = canvas.width;
      if (this.x > canvas.width) this.x = 0;
      if (this.y < 0) this.y = canvas.height;
      if (this.y > canvas.height) this.y = 0;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color}, ${this.alpha})`;
      ctx.fill();
    }
  }

  const particleCount = Math.min(100, Math.floor(window.innerWidth * window.innerHeight / 12000));
  for (let i = 0; i < particleCount; i++) particles.push(new Particle());

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(108, 99, 255, ${(1 - dist / 100) * 0.2})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(animateParticles);
  }
  animateParticles();

  /* ====================================================
     3. NAVBAR SCROLL BEHAVIOR
  ==================================================== */
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
    let current = '';
    sections.forEach(section => {
      if (window.scrollY >= section.offsetTop - 100) current = section.getAttribute('id');
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) link.classList.add('active');
    });
    updateTimelineProgress();
    revealTimelineItems();

    checkStats();
  });

  /* ====================================================
     4. TYPING ANIMATION
  ==================================================== */
  const dynamicText = document.getElementById('dynamicText');
  const texts = ['Data Scientist', 'ML Engineer', 'AI Enthusiast', 'Problem Solver', 'Deep Learner', 'Data Storyteller'];
  let textIndex = 0, charIndex = 0, isDeleting = false;

  function typeText() {
    const currentText = texts[textIndex];
    dynamicText.textContent = currentText.substring(0, isDeleting ? charIndex - 1 : charIndex + 1);
    isDeleting ? charIndex-- : charIndex++;

    if (!isDeleting && charIndex === currentText.length) {
      setTimeout(() => { isDeleting = true; typeText(); }, 2000);
      return;
    }
    if (isDeleting && charIndex === 0) {
      isDeleting = false;
      textIndex = (textIndex + 1) % texts.length;
    }
    setTimeout(typeText, isDeleting ? 60 : 100);
  }
  setTimeout(typeText, 1500);

  /* ====================================================
     5. STAT COUNTER
  ==================================================== */
  const statNumbers = document.querySelectorAll('.stat-number');
  let statsAnimated = false;

  function checkStats() {
    if (statsAnimated) return;
    const firstStat = statNumbers[0];
    if (!firstStat) return;
    if (firstStat.getBoundingClientRect().top < window.innerHeight - 100) {
      statsAnimated = true;
      statNumbers.forEach(el => {
        const target = parseInt(el.dataset.target);
        let current = 0;
        const step = target / 40;
        const timer = setInterval(() => {
          current += step;
          if (current >= target) { el.textContent = target; clearInterval(timer); }
          else el.textContent = Math.floor(current);
        }, 40);
      });
    }
  }
  checkStats();

  /* ====================================================
     7. PROJECTS SLIDER — AUTO-SLIDE + PAUSE ON HOVER + DRAG
  ==================================================== */
  const track = document.getElementById('projectsTrack');
  const prevBtn = document.getElementById('sliderPrev');
  const nextBtn = document.getElementById('sliderNext');
  const dotsContainer = document.getElementById('sliderDots');
  const cards = document.querySelectorAll('.project-card');

  // Buat dots indicator
  cards.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = `slider-dot ${i === 0 ? 'active' : ''}`;
    dot.addEventListener('click', () => scrollToCard(i));
    dotsContainer.appendChild(dot);
  });

  function getCardWidth() {
    return cards[0] ? cards[0].offsetWidth + 24 : 374; // width + gap
  }

  function updateDots() {
    const activeIndex = Math.round(track.scrollLeft / getCardWidth());
    document.querySelectorAll('.slider-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === activeIndex);
    });
  }

  function scrollToCard(index) {
    track.scrollTo({ left: getCardWidth() * index, behavior: 'smooth' });
  }

  prevBtn.addEventListener('click', () => track.scrollBy({ left: -getCardWidth(), behavior: 'smooth' }));
  nextBtn.addEventListener('click', () => track.scrollBy({ left: getCardWidth(), behavior: 'smooth' }));
  track.addEventListener('scroll', updateDots);

  /* --- AUTO-SLIDE LOGIC --- */
  let isHovering = false;       // apakah kursor sedang di atas slider
  let isDragging = false;       // apakah sedang drag
  let autoSlideInterval = null;

  function startAutoSlide() {
    stopAutoSlide(); // clear dulu kalau ada
    autoSlideInterval = setInterval(() => {
      if (isHovering || isDragging) return; // pause saat hover/drag
      const maxScroll = track.scrollWidth - track.clientWidth;
      if (track.scrollLeft >= maxScroll - 10) {
        // Kembali ke awal dengan smooth
        track.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        track.scrollBy({ left: getCardWidth(), behavior: 'smooth' });
      }
    }, 3000);
  }

  function stopAutoSlide() {
    if (autoSlideInterval) {
      clearInterval(autoSlideInterval);
      autoSlideInterval = null;
    }
  }

  // Pause saat kursor masuk ke area slider
  const sliderWrapper = document.querySelector('.projects-slider-wrapper');
  track.addEventListener('mouseenter', () => { isHovering = true; });
  if (sliderWrapper) {
    sliderWrapper.addEventListener('mouseenter', () => { isHovering = true; });
    sliderWrapper.addEventListener('mouseleave', () => { isHovering = false; if (!isDragging) startAutoSlide(); });
  }

  // Resume saat kursor keluar dari slider
  track.addEventListener('mouseleave', () => {
    isHovering = false;
    if (!isDragging) startAutoSlide();
  });

  /* --- DRAG TO SCROLL (MANUAL) --- */
  let startX = 0;
  let scrollStart = 0;
  let velocity = 0;
  let lastX = 0;
  let momentumFrame = null;

  track.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX;
    scrollStart = track.scrollLeft;
    lastX = e.clientX;
    velocity = 0;
    if (momentumFrame) cancelAnimationFrame(momentumFrame);
    track.style.cursor = 'grabbing';
    track.style.scrollSnapType = 'none'; // matikan snap saat drag
    e.preventDefault();
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const delta = startX - e.clientX;
    velocity = lastX - e.clientX;
    lastX = e.clientX;
    track.scrollLeft = scrollStart + delta;
  });

  document.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    track.style.cursor = 'grab';
    track.style.scrollSnapType = 'x mandatory'; // aktifkan snap lagi

    // Momentum scroll
    function applyMomentum() {
      if (Math.abs(velocity) > 0.5) {
        track.scrollLeft += velocity * 0.6;
        velocity *= 0.88;
        momentumFrame = requestAnimationFrame(applyMomentum);
      } else {
        // Snap ke card terdekat setelah momentum berhenti
        const nearestIndex = Math.round(track.scrollLeft / getCardWidth());
        scrollToCard(nearestIndex);
      }
    }
    applyMomentum();

    // Resume auto-slide jika kursor sudah tidak di slider
    if (!isHovering) {
      setTimeout(() => startAutoSlide(), 2000);
    }
  });

  // Touch support
  let touchStartX = 0, touchScrollStart = 0;
  track.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchScrollStart = track.scrollLeft;
    isHovering = true; // pause auto saat touch
  }, { passive: true });
  track.addEventListener('touchmove', (e) => {
    track.scrollLeft = touchScrollStart + (touchStartX - e.touches[0].clientX);
  }, { passive: true });
  track.addEventListener('touchend', () => {
    isHovering = false;
    const nearestIndex = Math.round(track.scrollLeft / getCardWidth());
    scrollToCard(nearestIndex);
    setTimeout(() => startAutoSlide(), 2000);
  });

  // Mulai auto-slide
  startAutoSlide();

  /* ====================================================
     8. TIMELINE SCROLL ANIMATION
  ==================================================== */
  const timelineItems = document.querySelectorAll('.timeline-item');
  const timelineProgress = document.getElementById('timelineProgress');

  function revealTimelineItems() {
    timelineItems.forEach((item, i) => {
      const rect = item.getBoundingClientRect();
      if (rect.top < window.innerHeight - 100) {
        setTimeout(() => item.classList.add('visible'), i * 120);
      }
    });
  }
  revealTimelineItems();

  function updateTimelineProgress() {
    const expSection = document.getElementById('experience');
    if (!expSection || !timelineProgress) return;
    const scrolled = window.scrollY - expSection.offsetTop + window.innerHeight * 0.3;
    const progress = Math.min(Math.max(scrolled / expSection.offsetHeight, 0), 1);
    timelineProgress.style.height = `${progress * 100}%`;
  }

  /* ====================================================
     9. SMOOTH SCROLL
  ==================================================== */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) window.scrollTo({ top: target.offsetTop - 70, behavior: 'smooth' });
    });
  });

  /* ====================================================
     10. CONTACT FORM
  ==================================================== */
  const form = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitText = submitBtn.querySelector('.submit-text');
    const submitIcon = submitBtn.querySelector('.submit-icon');
    const submitLoader = submitBtn.querySelector('.submit-loader');

    submitText.style.display = 'none';
    submitIcon.style.display = 'none';
    submitLoader.style.display = 'block';
    submitBtn.disabled = true;

    const formData = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      subject: document.getElementById('subject').value,
      message: document.getElementById('message').value,
    };

    try {
      const response = await fetch('https://formspree.io/f/xzzbeqvb', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(formData),
      });

      submitLoader.style.display = 'none';

      if (response.ok) {
        submitBtn.style.background = 'linear-gradient(135deg, #00ff88, #00d4ff)';
        submitBtn.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <span>Pesan Terkirim!</span>`;
        form.reset();
      } else {
        submitBtn.style.background = 'linear-gradient(135deg, #ff6b6b, #ff4444)';
        submitBtn.innerHTML = `<span>Gagal, coba lagi</span>`;
      }
    } catch (err) {
      submitLoader.style.display = 'none';
      submitBtn.style.background = 'linear-gradient(135deg, #ff6b6b, #ff4444)';
      submitBtn.innerHTML = `<span>Gagal, coba lagi</span>`;
    }

    submitBtn.disabled = false;
    setTimeout(() => {
      submitBtn.style.background = '';
      submitBtn.innerHTML = `
        <span class="submit-text">Kirim Pesan</span>
        <svg class="submit-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="22" y1="2" x2="11" y2="13"/>
          <polygon points="22 2 15 22 11 13 2 9 22 2"/>
        </svg>
        <div class="submit-loader"></div>`;
    }, 3000);
  });

  /* ====================================================
     11. HAMBURGER MENU
  ==================================================== */
  const hamburger = document.getElementById('hamburger');
  const navLinksEl = document.getElementById('navLinks');
  let menuOpen = false;

  hamburger.addEventListener('click', () => {
    menuOpen = !menuOpen;
    if (menuOpen) {
      navLinksEl.style.cssText = `
        display:flex; flex-direction:column; position:fixed;
        top:80px; left:0; right:0; padding:1.5rem 5%;
        background:rgba(5,8,22,0.97); backdrop-filter:blur(20px);
        border-bottom:1px solid rgba(108,99,255,0.15); gap:1.5rem; z-index:999;`;
    } else {
      navLinksEl.style.display = 'none';
    }
  });

  /* ====================================================
     12. SECTION FADE-IN OBSERVER
  ==================================================== */
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.skill-category, .about-visual-block, .contact-card-big, .contact-form').forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = `opacity 0.7s ease ${i * 0.1}s, transform 0.7s ease ${i * 0.1}s`;
    sectionObserver.observe(el);
  });

  // Stagger project cards entrance
  const projectCardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0) scale(1)';
        projectCardObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.project-card').forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(40px) scale(0.96)';
    card.style.transition = `opacity 0.6s ease ${i * 0.12}s, transform 0.6s ease ${i * 0.12}s`;
    projectCardObserver.observe(card);
  });

  // Stagger timeline items
  const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateX(0)';
        timelineObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.timeline-item').forEach((item, i) => {
    const dir = item.classList.contains('right') ? '60px' : '-60px';
    item.style.opacity = '0';
    item.style.transform = `translateX(${dir})`;
    item.style.transition = `opacity 0.7s ease ${i * 0.15}s, transform 0.7s ease ${i * 0.15}s`;
    timelineObserver.observe(item);
  });

  /* ====================================================
     13. HERO PARALLAX
  ==================================================== */
  window.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;
    const profileContainer = document.querySelector('.profile-container');
    if (profileContainer) profileContainer.style.transform = `translate(${x * 0.5}px, ${y * 0.5}px)`;
  });

  /* ====================================================
     14. PROJECT CARD TILT
  ==================================================== */
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const rotX = ((e.clientY - rect.top) / rect.height - 0.5) * -10;
      const rotY = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
      card.style.transform = `translateY(-8px) perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });

  /* ====================================================
     15. GLITCH EFFECT
  ==================================================== */
  setInterval(() => {
    document.querySelectorAll('.title-word').forEach(word => {
      word.style.textShadow = `2px 0 var(--accent-secondary), -2px 0 var(--accent-tertiary)`;
      word.style.transform = 'skewX(-2deg)';
      setTimeout(() => { word.style.textShadow = ''; word.style.transform = ''; }, 100);
    });
  }, 4000);

  /* ====================================================
     16. LOADING SCREEN
  ==================================================== */
  const loadingOverlay = document.createElement('div');
  loadingOverlay.style.cssText = `
    position:fixed; inset:0; background:#050816; z-index:99999;
    display:flex; align-items:center; justify-content:center;
    flex-direction:column; gap:1.5rem; font-family:'Outfit',sans-serif;
    transition:opacity 0.8s ease;`;
  loadingOverlay.innerHTML = `
    <div style="font-size:3rem;font-weight:900;background:linear-gradient(135deg,#6c63ff,#00d4ff,#ff6b9d);
      -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
      letter-spacing:-0.03em;animation:pulse 1s ease-in-out infinite;">AM.</div>
    <div style="width:200px;height:3px;background:rgba(255,255,255,0.1);border-radius:2px;overflow:hidden;">
      <div id="loadProgress" style="width:0%;height:100%;background:linear-gradient(135deg,#6c63ff,#00d4ff);
        border-radius:2px;transition:width 0.1s linear;"></div>
    </div>
    <span style="color:rgba(255,255,255,0.4);font-size:0.8rem;letter-spacing:0.2em;text-transform:uppercase;">
      Loading Portfolio
    </span>
    <style>@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.7}}</style>`;
  document.body.appendChild(loadingOverlay);

  let loadPct = 0;
  const loadTimer = setInterval(() => {
    loadPct += Math.random() * 15 + 5;
    if (loadPct > 100) loadPct = 100;
    const bar = document.getElementById('loadProgress');
    if (bar) bar.style.width = `${loadPct}%`;
    if (loadPct >= 100) {
      clearInterval(loadTimer);
      setTimeout(() => {
        loadingOverlay.style.opacity = '0';
        setTimeout(() => loadingOverlay.remove(), 800);
      }, 300);
    }
  }, 80);

  /* Logo click scroll to top */
  document.querySelector('.nav-logo')?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  console.log('%c✨ Akhmad Muzakkii Portfolio', 'font-size:20px;font-weight:bold;color:#6c63ff;');
  console.log('%cData Scientist | AI Enthusiast', 'font-size:14px;color:#00d4ff;');
});
