

(function () {
  'use strict';

  
  const CONFIG = {

    FORM_ENDPOINT: 'https://formsubmit.co/ajax/teodorcazacu314@gmail.com',

    HEADER_SCROLL_THRESHOLD: 50,
    STICKY_CTA_THRESHOLD: 600,
  };

  
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

  
  function initMobileMenu() {
    if (!mobileMenuBtn || !mobileMenu) return;

    mobileMenuBtn.addEventListener('click', () => {
      const isActive = mobileMenuBtn.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      mobileMenuBtn.setAttribute('aria-expanded', isActive);
      document.body.style.overflow = isActive ? 'hidden' : '';
    });

    $$('.mobile-nav-link', mobileMenu).forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenuBtn.classList.remove('active');
        mobileMenu.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

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

  
  function initStickyCta() {
    if (!stickyCta) return;

    let ticking = false;
    const evaluationSection = $('#evaluare');

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const shouldShow = scrollY > CONFIG.STICKY_CTA_THRESHOLD;

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

  
  function initSmoothScroll() {
    $$('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return;

        const target = $(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });

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

  
  function initFAQ() {
    faqItems.forEach((item) => {
      const question = $('.faq-question', item);
      const answer = $('.faq-answer', item);

      if (!question || !answer) return;

      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        faqItems.forEach((other) => {
          if (other !== item) {
            other.classList.remove('active');
            const otherAnswer = $('.faq-answer', other);
            if (otherAnswer) otherAnswer.style.maxHeight = '0';
            const otherQuestion = $('.faq-question', other);
            if (otherQuestion) otherQuestion.setAttribute('aria-expanded', 'false');
          }
        });

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

  
  function initForm() {
    if (!evaluationForm) return;

    evaluationForm.addEventListener('submit', (e) => {
      e.preventDefault();

      $$('.form-group.error', evaluationForm).forEach((group) => {
        group.classList.remove('error');
      });

      let isValid = true;
      const requiredFields = $$('[required]', evaluationForm);

      requiredFields.forEach((field) => {
        if (!field.value.trim()) {
          isValid = false;
          const group = field.closest('.form-group');
          if (group) group.classList.add('error');
        }
      });

      const emailField = $('#form-email', evaluationForm);
      if (emailField && emailField.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailField.value.trim())) {
          isValid = false;
          const group = emailField.closest('.form-group');
          if (group) group.classList.add('error');
        }
      }

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

        const firstError = $('.form-group.error', evaluationForm) || gdprCheckbox?.closest('.form-checkbox');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }

      const formData = new FormData(evaluationForm);

      submitForm(formData);

      trackEvent('form_submit', {
        form_name: 'evaluation_request',
        utm_source: formData.get('utm_source') || 'direct',
      });
    });

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

  
  function initScrollReveal() {
    if (!revealElements.length) return;

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

  
  function trackEvent(eventName, params = {}) {
    if (typeof gtag === 'function') {
      gtag('event', eventName, params);
    }
  }

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

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
