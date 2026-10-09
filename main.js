// ==========================================================================
// NALAM® — Creative Motion Design & Interactive Systems Engine
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- 1. Liquid Light-Wipe & Sliding Navigation Pill ---
  const navLinks = document.querySelectorAll('.header-pill-link[data-nav]');
  const activePill = document.getElementById('nav-active-pill');
  const navContainer = document.getElementById('header-nav-container');
  const liquidSweep = document.getElementById('liquid-light-sweep');

  const updateActivePill = (targetEl) => {
    if (!activePill || !targetEl || !navContainer) return;
    const containerRect = navContainer.getBoundingClientRect();
    const targetRect = targetEl.getBoundingClientRect();

    const left = targetRect.left - containerRect.left;
    const width = targetRect.width;

    activePill.style.transform = `translateX(${left}px)`;
    activePill.style.width = `${width}px`;
    activePill.classList.add('active');
  };

  if (navLinks.length > 0 && activePill) {
    navLinks.forEach(link => {
      link.addEventListener('mouseenter', () => updateActivePill(link));
    });

    if (navContainer) {
      navContainer.addEventListener('mouseleave', () => {
        // Find current section in view
        const currentActive = document.querySelector('.header-pill-link.in-view') || navLinks[0];
        if (currentActive) updateActivePill(currentActive);
      });
    }

    // Set initial position
    setTimeout(() => {
      if (navLinks[0]) updateActivePill(navLinks[0]);
    }, 200);
  }

  // Trigger liquid light sweep on navigation click
  const triggerLightSweep = () => {
    if (!liquidSweep || isReducedMotion) return;
    liquidSweep.classList.remove('animate');
    void liquidSweep.offsetWidth; // Force reflow
    liquidSweep.classList.add('animate');
  };

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', () => {
      triggerLightSweep();
    });
  });

  // Section Observer for active navigation link
  const sectionIds = ['solutions', 'services', 'case-studies', 'contact-cta'];
  const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);

  if ('IntersectionObserver' in window && sections.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            if (link.getAttribute('data-nav') === id) {
              link.classList.add('in-view');
              updateActivePill(link);
            } else {
              link.classList.remove('in-view');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach(sec => sectionObserver.observe(sec));
  }

  // --- 2. Magnetic Proximity Controller ---
  if (!isReducedMotion && window.innerWidth > 768) {
    const magneticElements = document.querySelectorAll('.magnetic-target');

    magneticElements.forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const deltaX = (e.clientX - centerX) * 0.18;
        const deltaY = (e.clientY - centerY) * 0.18;

        // Clamp to max 6px
        const maxDist = 6;
        const clampedX = Math.max(-maxDist, Math.min(maxDist, deltaX));
        const clampedY = Math.max(-maxDist, Math.min(maxDist, deltaY));

        el.style.transform = `translate(${clampedX}px, ${clampedY}px)`;
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform = 'translate(0px, 0px)';
      });
    });
  }

  // --- 3. Localized Cursor-Aware Spotlight Shader ---
  const spotlightCards = document.querySelectorAll('.matrix-panel, .feature-card, .case-card, .process-card, .service-detail-card, .blog-card, .cta-banner-card');

  spotlightCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  // --- 3b. Hero 3D Spatial Tilt & Parallax on Mouse Move ---
  const heroVisual = document.getElementById('hero-visual');
  const heroFluidImg = document.getElementById('hero-fluid-img');
  if (!isReducedMotion && heroVisual && heroFluidImg && window.innerWidth > 768) {
    heroVisual.addEventListener('mousemove', (e) => {
      const rect = heroVisual.getBoundingClientRect();
      const x = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
      const y = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);

      const tiltX = -y * 8; // degrees
      const tiltY = x * 8;
      heroFluidImg.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.02)`;
    });

    heroVisual.addEventListener('mouseleave', () => {
      heroFluidImg.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)';
    });
  }

  // --- 4. Scroll-Based Spatial Depth (Hero Scaling & Parallax) ---
  const heroSection = document.getElementById('hero-section');
  const ambientOrbs = document.querySelectorAll('.ambient-orb');

  if (!isReducedMotion && heroSection) {
    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;

          // Hero scale 1.0 -> 0.96 over the first 650px
          if (scrollY < 800) {
            const scale = Math.max(0.96, 1 - (scrollY / 800) * 0.04);
            const opacity = Math.max(0.65, 1 - (scrollY / 900) * 0.35);
            heroSection.style.transform = `scale(${scale})`;
            heroSection.style.opacity = opacity;
          }

          // Subtle parallax drift on ambient orbs
          if (ambientOrbs.length > 0 && scrollY < 2400) {
            ambientOrbs.forEach((orb, i) => {
              const speed = (i + 1) * 0.04;
              orb.style.transform = `translateY(${scrollY * speed}px)`;
            });
          }

          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // --- 5. Systems Matrix Interactive Simulator ---
  const clusterNodes = document.querySelectorAll('.cluster-node');
  const throughputTicker = document.getElementById('ticker-throughput');
  if (clusterNodes.length > 0) {
    clusterNodes.forEach(node => {
      node.addEventListener('click', () => {
        clusterNodes.forEach(n => n.classList.remove('active'));
        node.classList.add('active');
      });
    });

    // Live throughput micro-fluctuations (142,800 -> 143,120 ops/s)
    if (throughputTicker) {
      let baseOps = 142800;
      setInterval(() => {
        const delta = Math.floor((Math.random() - 0.48) * 350);
        baseOps = Math.max(141500, Math.min(145000, baseOps + delta));
        throughputTicker.textContent = `${baseOps.toLocaleString()} ops/s`;
      }, 2200);
    }
  }

  // Live Agent DAG Step Sequencer
  const agentSteps = document.querySelectorAll('.agent-step-item');
  if (agentSteps.length > 0) {
    let activeStep = 0;
    setInterval(() => {
      agentSteps.forEach(s => s.classList.remove('active'));
      activeStep = (activeStep + 1) % agentSteps.length;
      agentSteps[activeStep].classList.add('active');
    }, 2800);
  }

  // --- 6. Services Multi-Tab Switcher ---
  const tabButtons = document.querySelectorAll('.tab-pill');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-tab');

      tabButtons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      tabPanels.forEach(panel => {
        if (panel.id === targetId) {
          panel.classList.add('active');
        } else {
          panel.classList.remove('active');
        }
      });
    });
  });

  // --- 7. Navigation Menu Dropdown ---
  const menuBtn = document.getElementById('menu-btn');
  const navDropdown = document.getElementById('nav-dropdown');

  if (menuBtn && navDropdown) {
    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navDropdown.classList.contains('active');
      if (isOpen) {
        navDropdown.classList.remove('active');
        menuBtn.classList.remove('open');
      } else {
        navDropdown.classList.add('active');
        menuBtn.classList.add('open');
      }
    });

    document.addEventListener('click', (e) => {
      if (!navDropdown.contains(e.target) && !menuBtn.contains(e.target)) {
        navDropdown.classList.remove('active');
        menuBtn.classList.remove('open');
      }
    });
  }

  // --- 8. Smooth Scroll For Internal Links ---
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          targetEl.scrollIntoView({ behavior: 'smooth' });
          if (navDropdown) navDropdown.classList.remove('active');
          if (menuBtn) menuBtn.classList.remove('open');
        }
      }
    });
  });

  // --- 9. Shared-Element Case Study Architectural Modal ---
  const caseCards = document.querySelectorAll('.case-card[data-case]');
  const caseModal = document.getElementById('case-study-modal');
  const caseModalBackdrop = document.getElementById('case-modal-backdrop');
  const caseModalClose = document.getElementById('case-modal-close');

  const caseData = {
    fintech: {
      sector: 'FinTech Unicorn',
      year: '2026 Production Delivery',
      status: 'Direct Partner Engagement',
      title: 'Scaling Real-Time Ledger to 45M Daily Transactions',
      subtitle: 'Mission-critical distributed systems migration from legacy SQL bottlenecks to an event-sourced, append-only high-concurrency consensus engine.',
      runtime: 'Apache Kafka • Rust Core • ClickHouse',
      nodes: [
        { title: 'Client Ingest', detail: 'gRPC / TLS 1.3' },
        { title: 'Consensus Cluster', detail: 'Raft Quorum (5 nodes)' },
        { title: 'Append-Only Store', detail: 'ClickHouse / NVMe' }
      ],
      challenge: 'Peak concurrency transactions were generating cascading database lockouts, degrading P99 latency past 1,800ms and forcing periodic scheduled maintenance windows during multi-currency market openings.',
      solution: 'Architected a decentralized Raft-based consensus cluster utilizing memory-mapped append logs in Rust, paired with an asynchronous CDC pipeline streaming into ClickHouse for instantaneous audit reconciliation.',
      stats: ['+340%', '12ms', '$14M', '99.999%'],
      labels: ['Transaction Velocity', 'P99 Deterministic Latency', 'Annual Cloud OpEx Saved', 'Consensus Reliability']
    },
    health: {
      sector: 'HealthTech Enterprise',
      year: '2026 Production Delivery',
      status: 'Zero-Retention Airgap',
      title: 'HIPAA-Compliant Private AI Patient Triage Engine',
      subtitle: 'Airgapped sovereign LLM clinical decision intelligence network deployed across 12 hospital networks with deterministic validation layers.',
      runtime: 'vLLM • TensorRT-LLM • Private VPC Airgap',
      nodes: [
        { title: 'EHR Stream', detail: 'HL7 / FHIR Gateway' },
        { title: 'Deterministic Guard', detail: 'DSPy + Semantic Router' },
        { title: 'Private LLM Host', detail: 'Dual H100 Airgapped' }
      ],
      challenge: 'Hospital clinicians were overwhelmed by chart review volume, but strict patient privacy laws (HIPAA/HITECH) prohibited transmitting clinical data to public AI API providers.',
      solution: 'Engineered an on-premise private inference cluster running specialized medical language models with mathematically proven zero-data retention, paired with a deterministic medical ontology validator.',
      stats: ['99.4%', '-72%', 'SOC2 Type II', '< 400ms'],
      labels: ['Triage Precision', 'Chart Review Time', 'Compliance Certified', 'First-Token Latency']
    },
    logistics: {
      sector: 'Global Logistics SaaS',
      year: '2026 Production Delivery',
      status: 'Autonomous Agent Fleet',
      title: 'Autonomous Customs Clearance Agent Orchestration',
      subtitle: 'Multi-agent asynchronous execution swarm orchestrating bills of lading, cross-border tariff computation, and automated customs filing.',
      runtime: 'Temporal.io • LangGraph • FastAPI Cluster',
      nodes: [
        { title: 'Manifest OCR', detail: 'LayoutLM + Vision Pipeline' },
        { title: 'Agent Coordinator', detail: 'Hierarchical Swarm' },
        { title: 'Maritime EDI', detail: 'Automated Customs API' }
      ],
      challenge: 'International freight forwarders were facing tens of millions in demurrage penalties caused by manual, error-prone paperwork verification across differing port jurisdictional requirements.',
      solution: 'Deployed an asynchronous multi-agent coordination cluster where specialized agents independently verify harmonized tariff codes, validate customs declarations, and handle automated filing exceptions.',
      stats: ['4 mins', '28 Ports', 'Zero', '$22M+'],
      labels: ['vs 3 Days Prior', 'Maritime Jurisdictions', 'Demurrage Fines', 'Annual Value Unlocked']
    }
  };

  const openCaseModal = (caseId) => {
    const data = caseData[caseId];
    if (!data || !caseModal) return;

    document.getElementById('case-modal-sector').textContent = data.sector;
    document.getElementById('case-modal-year').textContent = data.year;
    document.getElementById('case-modal-status').textContent = data.status;
    document.getElementById('case-modal-title').textContent = data.title;
    document.getElementById('case-modal-subtitle').textContent = data.subtitle;
    document.getElementById('case-modal-runtime').textContent = data.runtime;
    document.getElementById('case-modal-challenge').textContent = data.challenge;
    document.getElementById('case-modal-solution').textContent = data.solution;

    // Update stats
    for (let i = 1; i <= 4; i++) {
      const valEl = document.getElementById(`case-stat-${i}`);
      if (valEl) {
        valEl.textContent = data.stats[i - 1];
        const lblEl = valEl.nextElementSibling;
        if (lblEl) lblEl.textContent = data.labels[i - 1];
      }
    }

    // Update topology nodes
    const canvas = document.getElementById('case-modal-canvas');
    if (canvas && data.nodes) {
      canvas.innerHTML = `
        <div class="topology-diagram">
          <div class="top-node client-node">
            <span class="tn-title">${data.nodes[0].title}</span>
            <span class="tn-detail">${data.nodes[0].detail}</span>
          </div>
          <div class="top-stream-arrow">
            <span class="stream-line"></span>
            <span class="stream-pulse"></span>
          </div>
          <div class="top-node cluster-node">
            <span class="tn-title">${data.nodes[1].title}</span>
            <span class="tn-detail">${data.nodes[1].detail}</span>
          </div>
          <div class="top-stream-arrow">
            <span class="stream-line"></span>
            <span class="stream-pulse"></span>
          </div>
          <div class="top-node db-node">
            <span class="tn-title">${data.nodes[2].title}</span>
            <span class="tn-detail">${data.nodes[2].detail}</span>
          </div>
        </div>
      `;
    }

    caseModal.classList.add('active');
    caseModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeCaseModal = () => {
    if (!caseModal) return;
    caseModal.classList.remove('active');
    caseModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  caseCards.forEach(card => {
    card.addEventListener('click', () => {
      const caseId = card.getAttribute('data-case');
      openCaseModal(caseId);
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const caseId = card.getAttribute('data-case');
        openCaseModal(caseId);
      }
    });
  });

  if (caseModalClose) caseModalClose.addEventListener('click', closeCaseModal);
  if (caseModalBackdrop) caseModalBackdrop.addEventListener('click', closeCaseModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeCaseModal();
      closeIntroModal();
      closeCheckoutModal();
    }
  });

  // --- 10. Discovery Call Modal Handlers ---
  const introModal = document.getElementById('intro-modal');
  const modalCloseIntro = document.getElementById('modal-close-intro');
  const introForm = document.getElementById('intro-form');
  const introDomainSelect = document.getElementById('intro-domain');

  const openIntroModal = (selectedDomain = null) => {
    if (introModal) {
      if (selectedDomain && introDomainSelect) {
        if (selectedDomain.includes('Strategic')) introDomainSelect.value = 'strategic';
        else if (selectedDomain.includes('Cloud')) introDomainSelect.value = 'cloud';
        else if (selectedDomain.includes('AI')) introDomainSelect.value = 'ai';
      }
      introModal.classList.add('active');
      introModal.setAttribute('aria-hidden', 'false');
    }
  };

  const closeIntroModal = () => {
    if (introModal) {
      introModal.classList.remove('active');
      introModal.setAttribute('aria-hidden', 'true');
    }
  };

  const btnHeroCall = document.getElementById('btn-intro-call-hero');
  if (btnHeroCall) btnHeroCall.addEventListener('click', () => openIntroModal());
  if (modalCloseIntro) modalCloseIntro.addEventListener('click', closeIntroModal);

  document.querySelectorAll('.trigger-advisory-modal').forEach(btn => {
    btn.addEventListener('click', () => {
      const subject = btn.getAttribute('data-subject');
      openIntroModal(subject);
    });
  });

  if (introModal) {
    introModal.addEventListener('click', (e) => {
      if (e.target === introModal) closeIntroModal();
    });
  }

  if (introForm) {
    introForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = introForm.querySelector('.modal-submit-btn');
      submitBtn.textContent = 'Scheduled! Partner invite sent ✓';
      submitBtn.style.background = '#16a34a';
      setTimeout(() => {
        closeIntroModal();
        submitBtn.textContent = 'Confirm Discovery Session';
        submitBtn.style.background = '';
        introForm.reset();
      }, 1800);
    });
  }

  // --- 11. Retainer Checkout Modal ---
  const checkoutModal = document.getElementById('checkout-modal');
  const btnJoinToday = document.getElementById('btn-join-today');
  const modalCloseCheckout = document.getElementById('modal-close-checkout');
  const checkoutForm = document.getElementById('checkout-form');

  const openCheckoutModal = () => {
    if (checkoutModal) {
      checkoutModal.classList.add('active');
      checkoutModal.setAttribute('aria-hidden', 'false');
    }
  };

  const closeCheckoutModal = () => {
    if (checkoutModal) {
      checkoutModal.classList.remove('active');
      checkoutModal.setAttribute('aria-hidden', 'true');
    }
  };

  if (btnJoinToday) btnJoinToday.addEventListener('click', openCheckoutModal);
  if (modalCloseCheckout) modalCloseCheckout.addEventListener('click', closeCheckoutModal);

  if (checkoutModal) {
    checkoutModal.addEventListener('click', (e) => {
      if (e.target === checkoutModal) closeCheckoutModal();
    });
  }

  if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = checkoutForm.querySelector('.modal-submit-btn');
      submitBtn.textContent = 'Retainer Confirmed! Onboarding Initiated ✓';
      submitBtn.style.background = '#16a34a';
      setTimeout(() => {
        closeCheckoutModal();
        submitBtn.textContent = 'Reserve Advisory Retainer';
        submitBtn.style.background = '';
        checkoutForm.reset();
      }, 1800);
    });
  }

  // --- 12. Contact Button Mailto Redirection Engine ---
  // Directs inquiries to ramalingamthangamani2023@gmail.com with pre-filled subject and structured body
  const contactEmail = 'ramalingamthangamani2023@gmail.com';
  const emailSubject = 'Project Inquiry — Strategic Advisory & Systems Engineering';
  const emailBody = `Hello Nalam Team,

I would like to discuss a project with your engineering and advisory team.

• Organization / Company: 
• Scope & Goals: [Cloud Modernization / Autonomous AI / Architecture Audit / Fractional CTO]
• Target Timeline: 
• Estimated Budget / Retainer Tier: 
• Additional Context: 

Looking forward to your prompt response.

Best regards,
[Your Name]
[Your Phone / Position]`;

  const mailtoUrl = `mailto:${contactEmail}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

  const contactTriggers = document.querySelectorAll('.contact-action-trigger, #cta-contact-btn, #footer-contact-btn');
  contactTriggers.forEach(btn => {
    btn.setAttribute('href', mailtoUrl);
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = mailtoUrl;
    });
  });
});
