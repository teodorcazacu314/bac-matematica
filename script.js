/* ============================================
   MATEMATICĂ BAC — Landing Page Scripts
   Minimal, performant JavaScript
   ============================================ */

(function () {
  'use strict';

  /* -----------------------------------------
     CONFIGURATION
     ----------------------------------------- */
  const CONFIG = {
    // TODO: Replace with your real Google Analytics 4 Measurement ID
    GA_MEASUREMENT_ID: 'GA_MEASUREMENT_ID',

    // Endpoint for form submissions - sends straight to teodorcazacu314@gmail.com
    FORM_ENDPOINT: 'https://formsubmit.co/ajax/teodorcazacu314@gmail.com',

    // Scroll thresholds
    HEADER_SCROLL_THRESHOLD: 50,
    STICKY_CTA_THRESHOLD: 600,
  };

  /* -----------------------------------------
     DOM ELEMENTS
     ----------------------------------------- */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  const header = $('.header');
  const mobileMenuBtn = $('#mobile-menu-btn');
  const mobileMenu = $('#mobile-menu');
  const evaluationForm = $('#evaluation-form');
  const formWrapper = $('.evaluation-form-wrapper');
  const formSuccess = $('.form-success');
  const stickyCta = $('.sticky-cta');
  const faqItems = $$('.faq-item');
  const revealElements = $$('.reveal');

  /* -----------------------------------------
     UTM PARAMETER CAPTURE
     ----------------------------------------- */
  function captureUTMParams() {
    const params = new URLSearchParams(window.location.search);
    const utmFields = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];

    utmFields.forEach((field) => {
      const value = params.get(field);
      const input = $(`input[name="${field}"]`);
      if (input && value) {
        input.value = value;
      }
    });
  }

  /* -----------------------------------------
     MOBILE MENU
     ----------------------------------------- */
  function initMobileMenu() {
    if (!mobileMenuBtn || !mobileMenu) return;

    mobileMenuBtn.addEventListener('click', () => {
      const isActive = mobileMenuBtn.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      mobileMenuBtn.setAttribute('aria-expanded', isActive);
      document.body.style.overflow = isActive ? 'hidden' : '';
    });

    // Close menu when clicking a link
    $$('.mobile-nav-link', mobileMenu).forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenuBtn.classList.remove('active');
        mobileMenu.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close menu on CTA button click inside mobile menu
    const mobileCta = $('.btn', mobileMenu);
    if (mobileCta) {
      mobileCta.addEventListener('click', () => {
        mobileMenuBtn.classList.remove('active');
        mobileMenu.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    }
  }

  /* -----------------------------------------
     HEADER SCROLL EFFECT
     ----------------------------------------- */
  function initHeaderScroll() {
    if (!header) return;

    let ticking = false;

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (window.scrollY > CONFIG.HEADER_SCROLL_THRESHOLD) {
            header.classList.add('scrolled');
          } else {
            header.classList.remove('scrolled');
          }
          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* -----------------------------------------
     STICKY CTA (MOBILE)
     ----------------------------------------- */
  function initStickyCta() {
    if (!stickyCta) return;

    let ticking = false;
    const evaluationSection = $('#evaluare');

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const shouldShow = scrollY > CONFIG.STICKY_CTA_THRESHOLD;

          // Hide sticky CTA when evaluation section is in view
          let hideForEvaluation = false;
          if (evaluationSection) {
            const rect = evaluationSection.getBoundingClientRect();
            hideForEvaluation = rect.top < window.innerHeight && rect.bottom > 0;
          }

          if (shouldShow && !hideForEvaluation) {
            stickyCta.classList.add('visible');
          } else {
            stickyCta.classList.remove('visible');
          }

          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* -----------------------------------------
     SMOOTH SCROLLING
     ----------------------------------------- */
  function initSmoothScroll() {
    $$('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return;

        const target = $(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });

          // Track CTA clicks
          if (anchor.classList.contains('btn-primary') || anchor.classList.contains('btn-secondary')) {
            trackEvent('cta_click', {
              cta_text: anchor.textContent.trim(),
              cta_location: anchor.closest('section')?.id || 'header',
            });
          }
        }
      });
    });
  }

  /* -----------------------------------------
     FAQ ACCORDION
     ----------------------------------------- */
  function initFAQ() {
    faqItems.forEach((item) => {
      const question = $('.faq-question', item);
      const answer = $('.faq-answer', item);

      if (!question || !answer) return;

      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close all other FAQ items
        faqItems.forEach((other) => {
          if (other !== item) {
            other.classList.remove('active');
            const otherAnswer = $('.faq-answer', other);
            if (otherAnswer) otherAnswer.style.maxHeight = '0';
            const otherQuestion = $('.faq-question', other);
            if (otherQuestion) otherQuestion.setAttribute('aria-expanded', 'false');
          }
        });

        // Toggle current item
        if (isActive) {
          item.classList.remove('active');
          answer.style.maxHeight = '0';
          question.setAttribute('aria-expanded', 'false');
        } else {
          item.classList.add('active');
          answer.style.maxHeight = answer.scrollHeight + 'px';
          question.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  /* -----------------------------------------
     FORM VALIDATION & SUBMISSION
     ----------------------------------------- */
  function initForm() {
    if (!evaluationForm) return;

    evaluationForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Clear previous errors
      $$('.form-group.error', evaluationForm).forEach((group) => {
        group.classList.remove('error');
      });

      // Validate required fields
      let isValid = true;
      const requiredFields = $$('[required]', evaluationForm);

      requiredFields.forEach((field) => {
        if (!field.value.trim()) {
          isValid = false;
          const group = field.closest('.form-group');
          if (group) group.classList.add('error');
        }
      });

      // Validate email format
      const emailField = $('#form-email', evaluationForm);
      if (emailField && emailField.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailField.value.trim())) {
          isValid = false;
          const group = emailField.closest('.form-group');
          if (group) group.classList.add('error');
        }
      }

      // Validate phone format (basic Romanian phone)
      const phoneField = $('#form-phone', evaluationForm);
      if (phoneField && phoneField.value.trim()) {
        const phoneClean = phoneField.value.replace(/[\s\-\(\)]/g, '');
        const phoneRegex = /^(\+?40|0)[0-9]{9}$/;
        if (!phoneRegex.test(phoneClean)) {
          isValid = false;
          const group = phoneField.closest('.form-group');
          if (group) group.classList.add('error');
        }
      }

      // Validate GDPR checkbox
      const gdprCheckbox = $('#form-gdpr', evaluationForm);
      if (gdprCheckbox && !gdprCheckbox.checked) {
        isValid = false;
        const group = gdprCheckbox.closest('.form-checkbox');
        if (group) {
          group.style.outline = '2px solid #f87171';
          group.style.borderRadius = '4px';
          group.style.outlineOffset = '4px';
          setTimeout(() => {
            group.style.outline = '';
            group.style.outlineOffset = '';
          }, 3000);
        }
      }

      if (!isValid) {
        // Scroll to first error
        const firstError = $('.form-group.error', evaluationForm) || gdprCheckbox?.closest('.form-checkbox');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }

      // Collect form data
      const formData = new FormData(evaluationForm);

      // If there's a real form endpoint, submit to it
      if (CONFIG.FORM_ENDPOINT) {
        submitForm(formData);
      } else {
        // -----------------------------------------------------------
        // TODO: INTEGRATE FORM SUBMISSION HERE
        // -----------------------------------------------------------
        // Option 1: Formspree (free tier)
        //   Set CONFIG.FORM_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID'
        //
        // Option 2: Google Forms
        //   Map fields to Google Form entry IDs and submit via fetch
        //
        // Option 3: Netlify Forms
        //   Add netlify attribute to form and deploy on Netlify
        //
        // Option 4: EmailJS
        //   Use EmailJS SDK to send form data via email
        //
        // For now, we show the success message to demonstrate the flow.
        // -----------------------------------------------------------
        console.log('Form submission (no backend configured):');
        for (const [key, value] of formData.entries()) {
          console.log(`  ${key}: ${value}`);
        }

        showFormSuccess();
      }

      // Track form submission
      trackEvent('form_submit', {
        form_name: 'evaluation_request',
        utm_source: formData.get('utm_source') || 'direct',
      });
    });

    // Clear error on input
    $$('.form-input, .form-select, .form-textarea', evaluationForm).forEach((input) => {
      input.addEventListener('input', () => {
        const group = input.closest('.form-group');
        if (group) group.classList.remove('error');
      });
    });
  }

  function submitForm(formData) {
    const submitBtn = $('.form-submit-btn', evaluationForm);
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Se trimite...';
    submitBtn.disabled = true;

    fetch(CONFIG.FORM_ENDPOINT, {
      method: 'POST',
      body: formData,
      headers: {
        Accept: 'application/json',
      },
    })
      .then((response) => {
        if (response.ok) {
          showFormSuccess();
        } else {
          throw new Error('Form submission failed');
        }
      })
      .catch((error) => {
        console.error('Form submission error:', error);
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        alert('A apărut o eroare. Te rugăm să încerci din nou sau să ne contactezi direct.');
      });
  }

  function showFormSuccess() {
    if (formWrapper) formWrapper.style.display = 'none';
    if (formSuccess) formSuccess.classList.add('active');
  }

  /* -----------------------------------------
     SCROLL REVEAL (IntersectionObserver)
     ----------------------------------------- */
  function initScrollReveal() {
    if (!revealElements.length) return;

    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      revealElements.forEach((el) => el.classList.add('revealed'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    revealElements.forEach((el) => observer.observe(el));
  }

  /* -----------------------------------------
     ACTIVE NAV LINK HIGHLIGHTING
     ----------------------------------------- */
  function initActiveNav() {
    const sections = $$('section[id]');
    const navLinks = $$('.nav-link');

    if (!sections.length || !navLinks.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            navLinks.forEach((link) => {
              link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
            });
          }
        });
      },
      {
        threshold: 0.3,
        rootMargin: '-20% 0px -70% 0px',
      }
    );

    sections.forEach((section) => observer.observe(section));
  }

  /* -----------------------------------------
     GOOGLE ANALYTICS 4 — EVENT TRACKING
     ----------------------------------------- */
  function trackEvent(eventName, params = {}) {
    if (typeof gtag === 'function' && CONFIG.GA_MEASUREMENT_ID !== 'GA_MEASUREMENT_ID') {
      gtag('event', eventName, params);
    }
    // Log events in development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      console.log(`[Analytics] ${eventName}`, params);
    }
  }

  // Track scroll depth
  function initScrollTracking() {
    const milestones = [25, 50, 75, 100];
    const tracked = new Set();

    let ticking = false;

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollPercent = Math.round(
            ((window.scrollY + window.innerHeight) / document.documentElement.scrollHeight) * 100
          );

          milestones.forEach((milestone) => {
            if (scrollPercent >= milestone && !tracked.has(milestone)) {
              tracked.add(milestone);
              trackEvent('scroll_depth', { percent: milestone });
            }
          });

          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* -----------------------------------------
     INITIALIZATION
     ----------------------------------------- */
  function init() {
    captureUTMParams();
    initMobileMenu();
    initHeaderScroll();
    initStickyCta();
    initSmoothScroll();
    initFAQ();
    initForm();
    initScrollReveal();
    initActiveNav();
    initScrollTracking();
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
