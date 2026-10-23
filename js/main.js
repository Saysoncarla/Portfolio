/**
 * CARLA JEN SAYSON — PORTFOLIO MAIN SCRIPT
 * Handles: navbar scroll, mobile menu, scroll reveal,
 *          parallax hero portrait, skill chip animation,
 *          GitHub API fetch, contact form validation, back-to-top.
 */

/* ─────────────────────────────────────────────────────────────
   1. NAVBAR — scroll state & active link highlighting
───────────────────────────────────────────────────────────── */
(function initNavbar() {
  const navbar = document.getElementById('navbar');

  // Add/remove scrolled class
  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load

  // Active link highlight via IntersectionObserver
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link[data-section]');

  const observerOpts = {
    rootMargin: `-${navbar.offsetHeight}px 0px -50% 0px`,
    threshold: 0
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.dataset.section === id);
        });
      }
    });
  }, observerOpts);

  sections.forEach(sec => sectionObserver.observe(sec));
})();


/* ─────────────────────────────────────────────────────────────
   2. MOBILE MENU — hamburger toggle
───────────────────────────────────────────────────────────── */
(function initMobileMenu() {
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  function toggleMenu() {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', String(isOpen));
    mobileMenu.setAttribute('aria-hidden', String(!isOpen));
    // Prevent body scroll when menu is open
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  hamburger.addEventListener('click', toggleMenu);

  // Close menu when a link inside it is clicked
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    });
  });

  // Close on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
      toggleMenu();
      hamburger.focus();
    }
  });
})();


/* ─────────────────────────────────────────────────────────────
   3. SCROLL REVEAL — fade/slide-up on IntersectionObserver
───────────────────────────────────────────────────────────── */
(function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal');

  if (!revealEls.length) return;

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target); // animate once
      }
    });
  }, {
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.1
  });

  revealEls.forEach(el => revealObserver.observe(el));
})();


/* ─────────────────────────────────────────────────────────────
   4. PARALLAX HERO PORTRAIT — subtle vertical shift on scroll
───────────────────────────────────────────────────────────── */
(function initParallax() {
  const portraitWrap = document.querySelector('.hero__portrait-wrap');
  if (!portraitWrap) return;

  // Only animate on non-mobile viewports
  let ticking = false;

  function updateParallax() {
    if (window.innerWidth < 768) {
      portraitWrap.style.transform = '';
      return;
    }
    const scrollY = window.scrollY;
    // Move portrait up at 25% scroll speed (parallax coefficient 0.25)
    const offset = scrollY * 0.25;
    portraitWrap.style.transform = `translateY(-${offset}px)`;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }, { passive: true });
})();


/* ─────────────────────────────────────────────────────────────
   5. SKILL CHIP ANIMATION — staggered entrance
───────────────────────────────────────────────────────────── */
(function initSkillChips() {
  const chipGroups = document.querySelectorAll('.skills__chips');

  const chipObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const chips = entry.target.querySelectorAll('.skill-chip');
        chips.forEach((chip, i) => {
          chip.style.transitionDelay = `${i * 60}ms`;
          chip.classList.add('chip-visible');
        });
        chipObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  chipGroups.forEach(group => chipObserver.observe(group));
})();


/* ─────────────────────────────────────────────────────────────
   6. GITHUB REPOS — fetch & render (with fallback)
───────────────────────────────────────────────────────────── */
(function initGitHubRepos() {
  const GITHUB_USERNAME = 'Saysoncarla';
  const MAX_REPOS       = 6;
  const API_URL         = `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=30&type=public`;
  const grid            = document.getElementById('github-repos-grid');
  const loadingEl       = document.getElementById('repos-loading');

  /**
   * Language → background color mapping
   * (mirrors the CSS .lang-dot[data-lang] rules)
   */
  const LANG_COLORS = {
    'HTML':       '#e34c26',
    'CSS':        '#563d7c',
    'JavaScript': '#f1e05a',
    'GDScript':   '#478cbf',
    'Java':       '#b07219',
    'Python':     '#3572A5',
    'TypeScript': '#3178c6',
  };

  /** Static fallback repos shown when API fails */
  const FALLBACK_REPOS = [
    {
      name: 'EDP_files',
      html_url: 'https://github.com/Saysoncarla/EDP_files',
      description: 'Enterprise Data Processing files — HTML coursework.',
      language: 'HTML',
      stargazers_count: 0
    },
    {
      name: 'SIA-files',
      html_url: 'https://github.com/Saysoncarla/SIA-files',
      description: 'Systems Integration & Architecture project files.',
      language: null,
      stargazers_count: 0
    }
  ];

  /**
   * Build a repo card element
   * @param {Object} repo - GitHub repo object (or fallback shape)
   * @returns {HTMLElement}
   */
  function createRepoCard(repo) {
    const article = document.createElement('article');
    article.className = 'repo-card';
    article.setAttribute('aria-label', `Repository: ${repo.name}`);

    const langDot = repo.language
      ? `<span class="lang-dot" data-lang="${repo.language}" style="background:${LANG_COLORS[repo.language] || '#888'}" aria-hidden="true"></span>`
      : '';

    const langText = repo.language
      ? `<span class="repo-card__lang">${langDot}${repo.language}</span>`
      : '';

    article.innerHTML = `
      <div class="repo-card__name">
        <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">${escapeHTML(repo.name)}</a>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/>
        </svg>
      </div>
      <p class="repo-card__desc">${escapeHTML(repo.description || 'No description provided.')}</p>
      <div class="repo-card__meta">
        ${langText}
        <span class="repo-card__stars" aria-label="${repo.stargazers_count} stars">
          ★ ${repo.stargazers_count}
        </span>
      </div>
    `;

    return article;
  }

  /** Sanitize user-sourced strings for safe innerHTML insertion */
  function escapeHTML(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /** Render array of repos into the grid */
  function renderRepos(repos) {
    // Remove loading indicator
    if (loadingEl) loadingEl.remove();

    const fragment = document.createDocumentFragment();
    const displayed = repos.slice(0, MAX_REPOS);

    displayed.forEach(repo => {
      fragment.appendChild(createRepoCard(repo));
    });

    grid.appendChild(fragment);
  }

  /** Show fallback with an error notice */
  function renderFallback(reason) {
    console.warn('[GitHub Repos] Falling back to static data:', reason);
    if (loadingEl) loadingEl.remove();

    // Small notice
    const notice = document.createElement('p');
    notice.style.cssText = `
      grid-column:1/-1; font-size:.7rem; letter-spacing:.1em;
      color:var(--clr-accent-dim); text-align:center;
      padding-bottom:var(--space-lg);
    `;
    notice.textContent = '⚠ COULD NOT LOAD LIVE REPOS — SHOWING SAMPLE PROJECTS';
    grid.appendChild(notice);

    renderRepos(FALLBACK_REPOS);
  }

  // Kick off the fetch
  fetch(API_URL, {
    headers: { 'Accept': 'application/vnd.github.v3+json' }
  })
    .then(response => {
      if (!response.ok) throw new Error(`GitHub API returned ${response.status}`);
      return response.json();
    })
    .then(repos => {
      // Filter out forks and sort by last pushed date
      const own = repos
        .filter(r => !r.fork)
        .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at));

      if (own.length === 0) {
        // All repos were forks — show all sorted by push date
        renderRepos(repos);
      } else {
        renderRepos(own);
      }
    })
    .catch(err => renderFallback(err.message));
})();


/* ─────────────────────────────────────────────────────────────
   7. CONTACT FORM — front-end validation & submit feedback
───────────────────────────────────────────────────────────── */
(function initContactForm() {
  const form        = document.getElementById('contact-form');
  if (!form) return;

  const nameInput   = document.getElementById('contact-name');
  const emailInput  = document.getElementById('contact-email');
  const msgInput    = document.getElementById('contact-message');
  const successEl   = document.getElementById('form-success');
  const submitBtn   = document.getElementById('submit-btn');

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function setError(inputEl, errorId, message) {
    const errorEl = document.getElementById(errorId);
    inputEl.classList.add('error');
    inputEl.setAttribute('aria-describedby', errorId);
    if (errorEl) errorEl.textContent = message;
  }

  function clearError(inputEl, errorId) {
    const errorEl = document.getElementById(errorId);
    inputEl.classList.remove('error');
    inputEl.removeAttribute('aria-describedby');
    if (errorEl) errorEl.textContent = '';
  }

  function validateField(inputEl, errorId, validationFn) {
    const msg = validationFn(inputEl.value.trim());
    if (msg) {
      setError(inputEl, errorId, msg);
      return false;
    }
    clearError(inputEl, errorId);
    return true;
  }

  // Inline validation on blur
  nameInput.addEventListener('blur', () => {
    validateField(nameInput, 'name-error', v =>
      v.length < 2 ? 'Please enter your name (at least 2 characters).' : ''
    );
  });

  emailInput.addEventListener('blur', () => {
    validateField(emailInput, 'email-error', v =>
      !EMAIL_RE.test(v) ? 'Please enter a valid email address.' : ''
    );
  });

  msgInput.addEventListener('blur', () => {
    validateField(msgInput, 'message-error', v =>
      v.length < 10 ? 'Message must be at least 10 characters.' : ''
    );
  });

  form.addEventListener('submit', e => {
    e.preventDefault();

    // Validate all fields
    const valid = [
      validateField(nameInput,  'name-error',    v => v.length < 2  ? 'Please enter your name.'              : ''),
      validateField(emailInput, 'email-error',   v => !EMAIL_RE.test(v) ? 'Please enter a valid email.' : ''),
      validateField(msgInput,   'message-error', v => v.length < 10 ? 'Message must be at least 10 characters.' : '')
    ].every(Boolean);

    if (!valid) return;

    // Simulate submission (replace with real endpoint / EmailJS / Formspree)
    submitBtn.disabled    = true;
    submitBtn.textContent = 'SENDING…';

    setTimeout(() => {
      form.reset();
      successEl.removeAttribute('hidden');
      submitBtn.disabled    = false;
      submitBtn.textContent = 'SEND MESSAGE';

      // Hide success message after 6 s
      setTimeout(() => successEl.setAttribute('hidden', ''), 6000);
    }, 1200);
  });
})();


/* ─────────────────────────────────────────────────────────────
   8. SMOOTH SCROLL — for all anchor links (polyfill fallback)
───────────────────────────────────────────────────────────── */
(function initSmoothScroll() {
  // Modern browsers support CSS scroll-behavior: smooth
  // This is a lightweight JS fallback for older browsers
  if ('scrollBehavior' in document.documentElement.style) return;

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();


/* ─────────────────────────────────────────────────────────────
   9. BACK-TO-TOP — footer arrow
───────────────────────────────────────────────────────────── */
(function initBackToTop() {
  const btn = document.querySelector('.footer__back-top');
  if (!btn) return;

  btn.addEventListener('click', e => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();
