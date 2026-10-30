/**
 * Eagle Eye Inspection Company - Official JavaScript
 * Author: Frontend Engineering
 * Date: 2026
 * Description: Vanilla JS providing navigation, responsive drawer, modal views,
 *              AQL/inspection briefs, accessible form validation, and mail/WhatsApp handlers.
 */

(function () {
  'use strict';

  // ---------------------------------------------------------------------------
  // 1. Dynamic Current Year in Footer
  // ---------------------------------------------------------------------------
  const currentYearEl = document.getElementById('current-year');
  if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear();
  }

  // ---------------------------------------------------------------------------
  // 2. Navbar Sticky Shadow on Scroll & Back-to-Top Button
  // ---------------------------------------------------------------------------
  const navbar = document.getElementById('navbar');
  const backToTopBtn = document.getElementById('back-to-top');

  function handleWindowScroll() {
    const scrollY = window.scrollY || window.pageYOffset;

    if (navbar) {
      if (scrollY > 30) {
        navbar.classList.add('is-scrolled');
      } else {
        navbar.classList.remove('is-scrolled');
      }
    }

    if (backToTopBtn) {
      if (scrollY > 400) {
        backToTopBtn.classList.add('is-visible');
      } else {
        backToTopBtn.classList.remove('is-visible');
      }
    }
  }

  window.addEventListener('scroll', handleWindowScroll, { passive: true });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', function () {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ---------------------------------------------------------------------------
  // 3. Mobile Navigation Drawer
  // ---------------------------------------------------------------------------
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileNavOverlay = document.getElementById('mobile-nav-overlay');
  const mobileNavClose = document.getElementById('mobile-nav-close');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav__link, .mobile-nav__cta');

  function openMobileNav() {
    if (!mobileNav || !hamburgerBtn) return;
    mobileNav.classList.add('is-open');
    mobileNav.setAttribute('aria-hidden', 'false');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileNav() {
    if (!mobileNav || !hamburgerBtn) return;
    mobileNav.classList.remove('is-open');
    mobileNav.setAttribute('aria-hidden', 'true');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', function () {
      const isExpanded = hamburgerBtn.getAttribute('aria-expanded') === 'true';
      if (isExpanded) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });
  }

  if (mobileNavClose) {
    mobileNavClose.addEventListener('click', closeMobileNav);
  }

  if (mobileNavOverlay) {
    mobileNavOverlay.addEventListener('click', closeMobileNav);
  }

  mobileNavLinks.forEach(function (link) {
    link.addEventListener('click', closeMobileNav);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (mobileNav && mobileNav.classList.contains('is-open')) {
        closeMobileNav();
      }
      closeServiceModal();
    }
  });

  // ---------------------------------------------------------------------------
  // 4. Active Navigation Links on Scroll (Intersection Observer)
  // ---------------------------------------------------------------------------
  const navLinks = document.querySelectorAll('.nav-menu .nav-link');
  const observedSections = document.querySelectorAll('section[id]');

  if ('IntersectionObserver' in window && observedSections.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    };

    const sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          navLinks.forEach(function (link) {
            const href = link.getAttribute('href');
            if (href === '#' + currentId) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, observerOptions);

    observedSections.forEach(function (sec) {
      sectionObserver.observe(sec);
    });
  }

  // ---------------------------------------------------------------------------
  // 5. Service Scope Details Modal System
  // ---------------------------------------------------------------------------
  const serviceModal = document.getElementById('service-modal');
  const modalOverlay = document.getElementById('modal-overlay');
  const modalClose = document.getElementById('modal-close');
  const modalDismissBtn = document.getElementById('modal-dismiss-btn');
  const modalSelectServiceBtn = document.getElementById('modal-select-service-btn');
  const modalCategory = document.getElementById('modal-category');
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');

  let currentSelectedService = '';

  const serviceData = {
    'modal-fabric': {
      category: 'Material Quality Assurance',
      title: 'Fabric Inspection Scope & Criteria',
      serviceName: 'Fabric Inspection',
      content: `
        <p>Our raw and finished fabric inspection provides thorough evaluation of woven and knitted textiles against agreed commercial specifications and buyer tolerances.</p>
        <h4>Key Inspection Parameters:</h4>
        <ul>
          <li><strong>Defect Detection & Classification:</strong> Weft bars, warp streaks, slubs, holes, dropped stitches, grease spots, and shade variation.</li>
          <li><strong>Standard 4-Point System Support:</strong> Systematic numerical grading per 100 square yards according to international textile protocols.</li>
          <li><strong>Physical Measurements:</strong> Verification of roll width (cuttable vs. total), roll length, GSM (grams per square meter), and edge-to-edge uniformity.</li>
          <li><strong>Visual Appearance & Hand-Feel:</strong> Face/back differentiation, surface finishing, skewness, and bowing analysis.</li>
        </ul>
        <h4>Deliverables:</h4>
        <p>A comprehensive fabric inspection summary detailing defect point scores, roll-by-roll defect map, and clear recommendation for acceptance or rejection.</p>
      `
    },
    'modal-garment': {
      category: 'Workmanship & Measurements',
      title: 'Garment Inspection Scope & Criteria',
      serviceName: 'Garment Inspection',
      content: `
        <p>Examines finished garments across apparel lines to ensure stitching accuracy, structural integrity, styling conformity, and packaging alignment.</p>
        <h4>Key Inspection Parameters:</h4>
        <ul>
          <li><strong>Workmanship & Stitching:</strong> Loose threads, skipped stitches, broken seams, puckering, uneven tension, and raw edges.</li>
          <li><strong>Size Specification Audit:</strong> Systematic measurement comparison against the client-approved tech pack and tolerance table.</li>
          <li><strong>Component & Accessory Check:</strong> Zippers, buttons, snap fasteners, rivets, eyelets, interlinings, and drawstrings.</li>
          <li><strong>Labeling & Compliance:</strong> Care labels, fiber composition, country of origin, size tags, barcodes, and hangtags.</li>
        </ul>
        <h4>Deliverables:</h4>
        <p>Measurement deviation chart, defect breakdown categorized into Critical, Major, and Minor flaws, accompanied by detailed close-up photographs.</p>
      `
    },
    'modal-inline': {
      category: 'In-Process Quality Control',
      title: 'Inline Inspection (During Production)',
      serviceName: 'Inline Inspection',
      content: `
        <p>Performed when 10% to 30% of an order is cut and assembled. Inline inspection pinpoints systematic manufacturing flaws early, preventing bulk shipment rejections.</p>
        <h4>Key Inspection Parameters:</h4>
        <ul>
          <li><strong>Initial Output Review:</strong> Verification of the first production batch against the approved pre-production (PP) sample.</li>
          <li><strong>Sewing & Assembly Lines:</strong> Analysis of machine tensions, needle sizes, alignment, and seam allowances on active lines.</li>
          <li><strong>Pattern & Cut Panels:</strong> Ensuring accurate cutting patterns, grain line alignment, and notch placements.</li>
          <li><strong>Corrective Action Guidance:</strong> Immediate identification of defects so factory floor supervisors can recalibrate before mass assembly.</li>
        </ul>
        <h4>Deliverables:</h4>
        <p>Same-day preliminary summary highlighting active production bottlenecks, sewing faults, and necessary line adjustments.</p>
      `
    },
    'modal-fri': {
      category: 'Pre-Shipment Authorization',
      title: 'Final Random Inspection (FRI / PSI)',
      serviceName: 'Final Random Inspection (FRI)',
      content: `
        <p>The definitive inspection conducted when 100% of the consignment is finished and at least 80% is packed into export master cartons.</p>
        <h4>Key Inspection Parameters:</h4>
        <ul>
          <li><strong>Statistical AQL Sampling:</strong> Representative sampling following ISO 2859-1 / ANSI/ASQ Z1.4 tables across normal single sampling plans.</li>
          <li><strong>Visual Appearance & Functional Tests:</strong> Garment symmetry, zipper fatigue tests, button pull tests, and seam elasticity.</li>
          <li><strong>Defect Tallying:</strong> Strict counting of Critical (0), Major, and Minor defects against agreed Acceptance Quality Limits.</li>
          <li><strong>Packaging & Barcoding:</strong> Master carton drop test, polybag suffocation warnings, carton markings, and barcode scan validation.</li>
        </ul>
        <h4>Deliverables:</h4>
        <p>A formal Final Inspection Report providing the definitive factual basis to authorize release or withhold shipment pending factory rework.</p>
      `
    },
    'modal-audit': {
      category: 'Facility & Capability Assessment',
      title: 'Textile Factory Audit Scope',
      serviceName: 'Textile Factory Audit',
      content: `
        <p>Impartial assessment of manufacturing units to evaluate production capacity, internal quality systems, machinery maintenance, and workplace procedures.</p>
        <h4>Key Audit Parameters:</h4>
        <ul>
          <li><strong>Production Capacity & Workflow:</strong> Machine inventory, capacity utilization, line balancing, and material flow through cutting, sewing, and packing.</li>
          <li><strong>Internal Quality Control:</strong> Review of incoming material inspection records, in-process QC stations, needle logbooks, and calibration tools.</li>
          <li><strong>Storage & Inventory Management:</strong> Raw fabric storage, yarn moisture protection, finished goods segregation, and carton stacking safety.</li>
          <li><strong>Workplace & Operational Safety:</strong> Fire extinguisher availability, emergency exits, machine guards, and housekeeping standards within agreed audit scope.</li>
        </ul>
        <h4>Deliverables:</h4>
        <p>Comprehensive audit evaluation report featuring photographic records, machinery status, capacity analysis, and identified operational risks.</p>
      `
    },
    'modal-packing': {
      category: 'Logistics & Dispatch Readiness',
      title: 'Packing and Shipment Inspection Scope',
      serviceName: 'Packing and Shipment Inspection',
      content: `
        <p>Ensures that ready-to-ship consignments are correctly packed, labeled, counted, and protected for international ocean or air transport.</p>
        <h4>Key Inspection Parameters:</h4>
        <ul>
          <li><strong>Carton Markings & Barcode Checks:</strong> Side marks, main shipping marks, purchase order numbers, destination details, and scannable EAN/UPC codes.</li>
          <li><strong>Quantity & Assortment Verification:</strong> Verification of pieces per carton, size breakdowns, color ratios, and gross/net weight checks.</li>
          <li><strong>Carton Durability:</strong> Standard carton drop test to simulate transit impacts and confirm tape adhesion and bursting strength.</li>
          <li><strong>Packaging Integrity:</strong> Polybag ventilation holes, moisture silica gel packets, hanger quality, and tissue paper placement.</li>
        </ul>
        <h4>Deliverables:</h4>
        <p>Packing conformity report verifying total piece count, carton condition, barcode readability, and confirmation of shipment readiness.</p>
      `
    }
  };

  function openServiceModal(modalKey) {
    const data = serviceData[modalKey];
    if (!data || !serviceModal) return;

    currentSelectedService = data.serviceName;
    modalCategory.textContent = data.category;
    modalTitle.textContent = data.title;
    modalBody.innerHTML = data.content;

    serviceModal.classList.add('is-active');
    serviceModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeServiceModal() {
    if (!serviceModal) return;
    serviceModal.classList.remove('is-active');
    serviceModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Service Card "View Scope Details" Click
  const serviceButtons = document.querySelectorAll('.service-card__btn');
  serviceButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const modalKey = btn.getAttribute('data-modal');
      openServiceModal(modalKey);
    });
  });

  if (modalClose) {
    modalClose.addEventListener('click', closeServiceModal);
  }
  if (modalOverlay) {
    modalOverlay.addEventListener('click', closeServiceModal);
  }
  if (modalDismissBtn) {
    modalDismissBtn.addEventListener('click', closeServiceModal);
  }

  // "Request This Service" button inside modal
  if (modalSelectServiceBtn) {
    modalSelectServiceBtn.addEventListener('click', function () {
      closeServiceModal();
      const serviceSelect = document.getElementById('service-required');
      if (serviceSelect && currentSelectedService) {
        // Try to match value
        for (let i = 0; i < serviceSelect.options.length; i++) {
          if (serviceSelect.options[i].value === currentSelectedService ||
              serviceSelect.options[i].text.includes(currentSelectedService)) {
            serviceSelect.selectedIndex = i;
            break;
          }
        }
      }

      const requestSection = document.getElementById('request-inspection');
      if (requestSection) {
        requestSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // ---------------------------------------------------------------------------
  // 6. Inspection Request Form Validation & Transmit Dispatcher
  // ---------------------------------------------------------------------------
  const inspectionForm = document.getElementById('inspection-form');
  const formFeedback = document.getElementById('form-feedback');
  const submissionResult = document.getElementById('submission-result');
  const resultSummary = document.getElementById('result-summary');
  const resultDetails = document.getElementById('result-details');
  const sendEmailBtn = document.getElementById('send-email-btn');
  const sendWhatsappBtn = document.getElementById('send-whatsapp-btn');
  const editFormBtn = document.getElementById('edit-form-btn');
  const preferredDateInput = document.getElementById('preferred-date');

  // Set minimum date for preferredDate to today
  if (preferredDateInput) {
    const today = new Date().toISOString().split('T')[0];
    preferredDateInput.setAttribute('min', today);
  }

  function validateEmail(email) {
    const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;
    return re.test(String(email).toLowerCase());
  }

  function validatePhone(phone) {
    const cleaned = phone.replace(/[\s\-\(\)\+]/g, '');
    return cleaned.length >= 8;
  }

  function clearFormErrors() {
    const inputs = inspectionForm.querySelectorAll('.form-input, .form-select, .form-textarea');
    inputs.forEach(function (inp) {
      inp.classList.remove('is-invalid');
    });
    const errorMsgs = inspectionForm.querySelectorAll('.form-error-msg');
    errorMsgs.forEach(function (msg) {
      msg.style.display = 'none';
      msg.classList.remove('is-visible');
    });
    if (formFeedback) {
      formFeedback.className = 'form-feedback';
      formFeedback.textContent = '';
      formFeedback.style.display = 'none';
    }
  }

  if (inspectionForm) {
    inspectionForm.addEventListener('submit', function (e) {
      e.preventDefault();
      clearFormErrors();

      const fullName = document.getElementById('full-name');
      const companyName = document.getElementById('company-name');
      const email = document.getElementById('email-address');
      const phone = document.getElementById('phone-number');
      const service = document.getElementById('service-required');
      const productType = document.getElementById('product-type');
      const location = document.getElementById('inspection-location');
      const preferredDate = document.getElementById('preferred-date');
      const additionalNotes = document.getElementById('additional-requirements');

      let isValid = true;
      let firstInvalidInput = null;

      // Validate Full Name
      if (!fullName.value.trim()) {
        fullName.classList.add('is-invalid');
        document.getElementById('name-error').style.display = 'block';
        isValid = false;
        if (!firstInvalidInput) firstInvalidInput = fullName;
      }

      // Validate Company Name
      if (!companyName.value.trim()) {
        companyName.classList.add('is-invalid');
        document.getElementById('company-error').style.display = 'block';
        isValid = false;
        if (!firstInvalidInput) firstInvalidInput = companyName;
      }

      // Validate Email
      if (!email.value.trim() || !validateEmail(email.value.trim())) {
        email.classList.add('is-invalid');
        document.getElementById('email-error').style.display = 'block';
        isValid = false;
        if (!firstInvalidInput) firstInvalidInput = email;
      }

      // Validate Phone
      if (!phone.value.trim() || !validatePhone(phone.value.trim())) {
        phone.classList.add('is-invalid');
        document.getElementById('phone-error').style.display = 'block';
        isValid = false;
        if (!firstInvalidInput) firstInvalidInput = phone;
      }

      // Validate Service Required
      if (!service.value) {
        service.classList.add('is-invalid');
        const serviceErr = document.getElementById('service-error');
        serviceErr.style.display = 'block';
        serviceErr.classList.add('is-visible');
        isValid = false;
        if (!firstInvalidInput) firstInvalidInput = service;
      }

      // Validate Product Type
      if (!productType.value.trim()) {
        productType.classList.add('is-invalid');
        document.getElementById('product-error').style.display = 'block';
        isValid = false;
        if (!firstInvalidInput) firstInvalidInput = productType;
      }

      // Validate Location
      if (!location.value.trim()) {
        location.classList.add('is-invalid');
        document.getElementById('location-error').style.display = 'block';
        isValid = false;
        if (!firstInvalidInput) firstInvalidInput = location;
      }

      // Validate Preferred Date
      if (!preferredDate.value) {
        preferredDate.classList.add('is-invalid');
        document.getElementById('date-error').style.display = 'block';
        isValid = false;
        if (!firstInvalidInput) firstInvalidInput = preferredDate;
      }

      if (!isValid) {
        if (formFeedback) {
          formFeedback.className = 'form-feedback is-error';
          formFeedback.textContent = 'Please correct the highlighted fields before submitting your inspection request.';
          formFeedback.style.display = 'block';
        }
        if (firstInvalidInput) {
          firstInvalidInput.focus();
        }
        return;
      }

      // If valid, format the Inspection Brief
      const briefData = {
        fullName: fullName.value.trim(),
        companyName: companyName.value.trim(),
        email: email.value.trim(),
        phone: phone.value.trim(),
        service: service.value,
        productType: productType.value.trim(),
        location: location.value.trim(),
        preferredDate: preferredDate.value,
        notes: additionalNotes.value.trim() || 'No additional notes provided.'
      };

      // Populate Result Card
      resultDetails.innerHTML = `
        <p><strong>Client:</strong> ${escapeHtml(briefData.fullName)} (${escapeHtml(briefData.companyName)})</p>
        <p><strong>Contact:</strong> Phone: ${escapeHtml(briefData.phone)} | Email: ${escapeHtml(briefData.email)}</p>
        <p><strong>Requested Service:</strong> ${escapeHtml(briefData.service)}</p>
        <p><strong>Product Type:</strong> ${escapeHtml(briefData.productType)}</p>
        <p><strong>Inspection Location:</strong> ${escapeHtml(briefData.location)}</p>
        <p><strong>Target Date:</strong> ${escapeHtml(briefData.preferredDate)}</p>
        <p><strong>Additional Scope Details:</strong> ${escapeHtml(briefData.notes)}</p>
      `;

      // Build Mailto link
      const emailSubject = encodeURIComponent(`Inspection Request: ${briefData.service} - ${briefData.companyName}`);
      const emailBody = encodeURIComponent(
        `Dear Nadeem Ahmad (Eagle Eye Inspection Company),\n\n` +
        `I would like to request an inspection/audit with the following specifications:\n\n` +
        `Client Name: ${briefData.fullName}\n` +
        `Company Name: ${briefData.companyName}\n` +
        `Contact Phone: ${briefData.phone}\n` +
        `Contact Email: ${briefData.email}\n` +
        `Service Required: ${briefData.service}\n` +
        `Product Type: ${briefData.productType}\n` +
        `Inspection Location: ${briefData.location}\n` +
        `Preferred Date: ${briefData.preferredDate}\n\n` +
        `Additional Requirements:\n${briefData.notes}\n\n` +
        `Please confirm availability and the next steps for coordination.\n\n` +
        `Kind regards,\n${briefData.fullName}`
      );
      sendEmailBtn.setAttribute('href', `mailto:nadeem.eagleeyeinspection@gmail.com?subject=${emailSubject}&body=${emailBody}`);

      // Build WhatsApp link
      const whatsappMsg = encodeURIComponent(
        `*Textile Inspection Request - Eagle Eye Inspection Company*\n\n` +
        `*Name:* ${briefData.fullName}\n` +
        `*Company:* ${briefData.companyName}\n` +
        `*Phone:* ${briefData.phone}\n` +
        `*Email:* ${briefData.email}\n` +
        `*Service:* ${briefData.service}\n` +
        `*Product Type:* ${briefData.productType}\n` +
        `*Location:* ${briefData.location}\n` +
        `*Target Date:* ${briefData.preferredDate}\n` +
        `*Scope Notes:* ${briefData.notes}`
      );
      sendWhatsappBtn.setAttribute('href', `https://wa.me/923164499185?text=${whatsappMsg}`);

      // Show result card, hide form
      inspectionForm.style.display = 'none';
      submissionResult.style.display = 'block';
      submissionResult.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  // Edit Information button inside confirmation result
  if (editFormBtn) {
    editFormBtn.addEventListener('click', function () {
      submissionResult.style.display = 'none';
      inspectionForm.style.display = 'block';
      inspectionForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  // Helper function to safely escape HTML output
  function escapeHtml(string) {
    const entityMap = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
      '/': '&#x2F;'
    };
    return String(string).replace(/[&<>"'\/]/g, function (s) {
      return entityMap[s];
    });
  }

  // ---------------------------------------------------------------------------
  // 7. Image Fallback & Graceful Degradation
  // ---------------------------------------------------------------------------
  // If an external image fails to load due to offline status or network policy,
  // gracefully fall back to an elegant brand-colored placeholder card.
  const allImages = document.querySelectorAll('img');
  allImages.forEach(function (img) {
    img.addEventListener('error', function () {
      if (this.dataset.hasFallback) return;
      this.dataset.hasFallback = 'true';

      const width = this.naturalWidth || this.clientWidth || 600;
      const height = this.naturalHeight || this.clientHeight || 400;
      const altText = this.alt || 'Eagle Eye Inspection Company';

      // SVG fallback placeholder
      const svgPlaceholder = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="100%" height="100%">
          <rect width="100%" height="100%" fill="#142B45"/>
          <circle cx="${width / 2}" cy="${height / 2 - 20}" r="32" fill="none" stroke="#C99A35" stroke-width="2" stroke-dasharray="4 2"/>
          <text x="${width / 2}" y="${height / 2 - 14}" font-family="sans-serif" font-size="14" fill="#C99A35" text-anchor="middle" font-weight="bold">EAGLE EYE</text>
          <text x="${width / 2}" y="${height / 2 + 35}" font-family="sans-serif" font-size="12" fill="#CAD5E2" text-anchor="middle">${escapeHtml(altText.substring(0, 48))}</text>
        </svg>
      `;
      this.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgPlaceholder);
    });
  });

  // ---------------------------------------------------------------------------
  // 8. Console Initialization Confirmation
  // ---------------------------------------------------------------------------
  console.log('Eagle Eye Inspection Company website scripts initialized successfully.');

})();
