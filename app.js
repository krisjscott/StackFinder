const selected = {
  stage:  null,
  team:   null,
  budget: null,
  sector: null
};

const toggleBtn = document.getElementById("themeToggle");

toggleBtn.addEventListener("click", () => {
  const currentTheme = document.body.getAttribute("data-theme");

  if (currentTheme === "dark") {
    document.body.removeAttribute("data-theme");
    toggleBtn.textContent = "🌙";
  } else {
    document.body.setAttribute("data-theme", "dark");
    toggleBtn.textContent = "☀️";
  }
});

if (localStorage.getItem("theme") === "dark") {
  document.body.setAttribute("data-theme", "dark");
  toggleBtn.textContent = "☀️";
}

toggleBtn.addEventListener("click", () => {
  const isDark = document.body.getAttribute("data-theme") === "dark";

  if (isDark) {
    document.body.removeAttribute("data-theme");
    localStorage.setItem("theme", "light");
    toggleBtn.textContent = "🌙";
  } else {
    document.body.setAttribute("data-theme", "dark");
    localStorage.setItem("theme", "dark");
    toggleBtn.textContent = "☀️";
  }
});

const STACKS = {

  fintech_idea: {
    label: 'Fintech · Idea Stage',
    sector: 'Fintech',
    frontend:  { name: 'React',           cost: 'Free',                    contra: false },
    backend:   { name: 'Supabase Functions', cost: 'Free tier',            contra: false },
    database:  { name: 'Supabase PostgreSQL', cost: 'Free → ₹420/mo Pro', contra: true,
                 reason: 'PostgreSQL over MongoDB — RBI audit trails require ACID compliance. NoSQL is a trap for fintech.' },
    auth:      { name: 'Supabase Auth',   cost: 'Free up to 50K MAU',      contra: false },
    payments:  { name: 'Razorpay',        cost: '2% per txn · no setup',   contra: false },
    hosting:   { name: 'Vercel (frontend) + Supabase', cost: 'Free tier both', contra: false },
    india: {
      icon: 'UPI',
      name: 'Razorpay UPI Payment Links',
      desc: 'Fastest way to accept payments at idea stage — no checkout page needed. Docs: razorpay.com/docs/payment-links. Free setup, 2% per transaction.'
    },
    redflag: 'Supabase free tier gives only 500MB database. At typical fintech transaction volumes you will hit this in under 60 days. Budget ₹420/mo for the Pro plan from week one — do not architect around the free tier.',
    source: 'Supabase pricing: supabase.com/pricing · Razorpay UPI docs: razorpay.com/docs',
    contraCount: 1
  },

  fintech_mvp: {
    label: 'Fintech · MVP',
    sector: 'Fintech',
    frontend:  { name: 'React',           cost: 'Free',                    contra: false },
    backend:   { name: 'Django (Python)',  cost: 'Free',                    contra: true,
                 reason: 'Django over Node.js — Python is mandatory for RBI compliance logic and ML-based fraud detection. Razorpay engineering confirmed this publicly.' },
    database:  { name: 'PostgreSQL on RDS', cost: 'AWS RDS ~₹1,400/mo',   contra: false },
    auth:      { name: 'Custom JWT + Supabase Auth', cost: 'Free',         contra: false },
    payments:  { name: 'Razorpay',         cost: '2% per txn',             contra: false },
    hosting:   { name: 'Railway',          cost: '~₹420/mo starter',       contra: false },
    india: {
      icon: 'UPI',
      name: 'UPI AutoPay Mandate API (Razorpay)',
      desc: 'Mandatory for fintech subscription models — recurring UPI payments. Official docs: razorpay.com/docs/payments/upi/recurring. 0% MDR on UPI per NPCI mandate.'
    },
    redflag: 'At MVP with 2–5 engineers, running Django requires at least one senior Python developer. If your team is primarily JS engineers, Django will slow you down by 3–4 weeks minimum. Validate team skills before committing.',
    source: 'Razorpay engineering blog on PostgreSQL for fintech · Railway pricing: railway.app/pricing',
    contraCount: 1
  },


  healthtech_mvp: {
    label: 'Healthtech · MVP',
    sector: 'Healthtech',
    frontend:  { name: 'React',            cost: 'Free',                   contra: false },
    backend:   { name: 'Node.js + Express', cost: 'Free',                  contra: false },
    database:  { name: 'MongoDB Atlas',     cost: 'Free M0 → ₹600/mo M2', contra: false },
    auth:      { name: 'Firebase Auth',     cost: 'Free up to 10K MAU',    contra: false },
    payments:  { name: 'Razorpay',          cost: '2% per txn',            contra: false },
    hosting:   { name: 'Render',            cost: 'Free → ₹800/mo Starter', contra: false },
    india: {
      icon: 'ABHA',
      name: 'ABDM / ABHA Health ID API',
      desc: 'Ayushman Bharat Digital Mission — mandatory for any health record or telemedicine platform in India. Enables patient data portability. Official docs: abdm.gov.in/sandbox. Free sandbox access.'
    },
    redflag: 'Health data is regulated under India\'s Digital Personal Data Protection Act 2023. You cannot store patient records on free-tier infrastructure. Budget for HIPAA-equivalent storage from day one — MongoDB Atlas M0 free tier does not meet DPDP compliance requirements.',
    source: 'ABDM sandbox: abdm.gov.in · MongoDB Atlas pricing: mongodb.com/pricing · Render pricing: render.com/pricing',
    contraCount: 0
  },

  healthtech_growth: {
    label: 'Healthtech · Growth',
    sector: 'Healthtech',
    frontend:  { name: 'Next.js',          cost: 'Free',                   contra: false },
    backend:   { name: 'Django (Python)',   cost: 'Free',                   contra: true,
                 reason: 'Django over Node.js at growth stage — Python ecosystem (scikit-learn, pandas) is non-negotiable when building AI diagnostic features. Qure.ai and MFine both confirmed Python backends.' },
    database:  { name: 'PostgreSQL + Redis', cost: 'AWS RDS ~₹2,800/mo + ElastiCache ~₹800/mo', contra: false },
    auth:      { name: 'Auth0',             cost: 'Free 7,500 MAU → ₹1,800/mo', contra: false },
    payments:  { name: 'Razorpay Subscriptions', cost: '2% per txn',       contra: false },
    hosting:   { name: 'AWS EC2 + S3',      cost: 'EC2 t3.medium ~₹3,200/mo + S3 ~₹200/mo', contra: false },
    india: {
      icon: 'ABHA',
      name: 'ABDM Health Records + ABHA Linking',
      desc: 'At growth stage, ABDM linking is a competitive moat — users can pull all historical health records. Eka.care built their entire product on this. Official docs: abdm.gov.in/developers.'
    },
    redflag: 'At growth stage, DPDP Act 2023 compliance becomes a legal requirement, not a suggestion. You need a Data Protection Officer and explicit consent management. This is a 3–6 month engineering effort. Start before you need it, not after a regulator asks.',
    source: 'Eka.care ABDM implementation confirmed via eka.care/developers · AWS pricing: aws.amazon.com/pricing',
    contraCount: 1
  },


  edtech_idea: {
    label: 'EdTech · Idea Stage',
    sector: 'EdTech',
    frontend:  { name: 'React',            cost: 'Free',                   contra: false },
    backend:   { name: 'Firebase (BaaS)',   cost: 'Free Spark plan',        contra: false },
    database:  { name: 'Firebase Firestore', cost: 'Free 1GB → ₹7/GB beyond', contra: false },
    auth:      { name: 'Firebase Auth',     cost: 'Free up to 10K MAU',    contra: false },
    payments:  { name: 'None yet',          cost: 'Validate before charging', contra: true,
                 reason: 'No payment gateway at idea stage — most EdTech founders add Razorpay too early before validating willingness to pay. Sstudize confirmed B2B institution invoicing only at early stage.' },
    hosting:   { name: 'Vercel',            cost: 'Free tier (100GB bandwidth)', contra: false },
    india: {
      icon: 'Digi',
      name: 'DigiLocker API for Certificate Issuance',
      desc: 'Issue verifiable course certificates linked to student Digi IDs. Official docs: api.digitallocker.gov.in. Free for government-verified issuers — the credential process takes 4–6 weeks.'
    },
    redflag: 'Firebase Firestore free tier (1GB storage) will be hit within 2–3 months if you store video content, PDFs, or assignment files. Firestore also has no relational query support — complex student progress reports and cohort analytics become very painful to build as you scale.',
    source: 'Sstudize stack confirmed via direct developer conversation, condition of anonymity, April 2026 · Firebase pricing: firebase.google.com/pricing · DigiLocker API: api.digitallocker.gov.in',
    contraCount: 1
  },

  edtech_traction: {
    label: 'EdTech · Early Traction',
    sector: 'EdTech',
    frontend:  { name: 'React + Next.js',  cost: 'Free',                   contra: false },
    backend:   { name: 'Django (Python)',   cost: 'Free',                   contra: true,
                 reason: 'Django over Node.js — Sstudize uses Django specifically to keep Python available for their ML-based adaptive learning algorithms. Python ecosystem is a long-term moat for EdTech.' },
    database:  { name: 'PostgreSQL',        cost: 'Supabase Pro ₹420/mo',  contra: false },
    auth:      { name: 'Firebase Auth',     cost: 'Free up to 10K MAU',    contra: false },
    payments:  { name: 'Razorpay',          cost: '2% per txn',            contra: false },
    hosting:   { name: 'AWS EC2 t3.micro',  cost: '~₹600/mo · free tier eligible', contra: false },
    india: {
      icon: 'Digi',
      name: 'DigiLocker API + ABHA for Student Records',
      desc: 'At traction stage, DigiLocker integration becomes a trust signal for institutions. Enables verified certificate issuance and student identity verification. Docs: api.digitallocker.gov.in.'
    },
    redflag: 'Switching from Firebase to PostgreSQL mid-product is an expensive migration — plan the transition before you have 10,000 users, not after. Data structure decisions made in Firebase Firestore do not map cleanly to relational schemas.',
    source: 'Sstudize stack confirmed via direct developer conversation, April 2026 · LinkedIn job postings confirmed Django requirement · AWS pricing: aws.amazon.com/ec2/pricing',
    contraCount: 1
  },

  d2c_mvp: {
    label: 'D2C · MVP',
    sector: 'D2C / E-comm',
    frontend:  { name: 'Next.js',          cost: 'Free',                   contra: false },
    backend:   { name: 'Shopify or BetterCommerce APIs', cost: 'Shopify Basic ₹1,994/mo', contra: false },
    database:  { name: 'Platform-managed', cost: 'Included in platform',   contra: false },
    auth:      { name: 'Platform-managed', cost: 'Included',               contra: false },
    payments:  { name: 'Razorpay',         cost: '2% per txn · UPI at 0% MDR', contra: false },
    hosting:   { name: 'Vercel',           cost: 'Pro ₹1,700/mo',          contra: false },
    india: {
      icon: 'ONDC',
      name: 'ONDC Buyer App Integration',
      desc: 'Open Network for Digital Commerce — D2C brands on ONDC gain access to 90M+ buyers without Amazon/Flipkart fees. Reference: ondc.org/network-participants. No commission to marketplace.'
    },
    redflag: 'Platform-managed stacks (Shopify, BetterCommerce) create vendor lock-in. If you outgrow the platform, migration is expensive — 3–6 months of engineering effort. The Souled Store faced this exact problem when scaling to offline stores. Build custom only if D2C is your core moat.',
    source: 'DaMENSCH stack confirmed via BetterCommerce partnership announcement · ONDC docs: ondc.org · Shopify pricing: shopify.com/in/pricing',
    contraCount: 0
  },

  d2c_growth: {
    label: 'D2C · Growth Stage',
    sector: 'D2C / E-comm',
    frontend:  { name: 'Vue.js + Next.js', cost: 'Free',                   contra: true,
                 reason: 'Vue.js at growth stage instead of React — The Souled Store scaled to 7M monthly visitors on PHP + Vue.js without rewriting. Stability over trendiness saved 6–12 months of engineering time.' },
    backend:   { name: 'PHP (Laravel) or Node.js', cost: 'Free',           contra: false },
    database:  { name: 'MySQL',            cost: 'AWS RDS ~₹1,400/mo',     contra: false },
    auth:      { name: 'Google OAuth + Facebook OAuth + Email', cost: 'Free (OAuth is free)', contra: false },
    payments:  { name: 'Razorpay + Simpl BNPL', cost: 'Razorpay 2% · Simpl commission-based', contra: false },
    hosting:   { name: 'AWS + Akamai CDN', cost: '₹15,000–50,000/mo at scale', contra: false },
    india: {
      icon: 'Simpl',
      name: 'Simpl Buy Now Pay Later Checkout',
      desc: 'The Souled Store partnership with Simpl confirmed. India-exclusive BNPL and one-tap checkout — directly impacts D2C conversion rates. Ref: leadiq.com/c/the-souled-store. Commission-based pricing.'
    },
    redflag: 'PHP monolithic stacks break at omnichannel scale. The Souled Store hit a 25% order cancellation rate from inventory sync failures when expanding to physical stores. If offline retail is in your 2-year roadmap, architect for real-time inventory sync from day one — not as an afterthought. Source: daffodilsw.com/case-study/the-souled-store.',
    source: 'The Souled Store stack via StackShare (stackshare.io/the-souled-store) · Auth confirmed via live login page (thesouledstore.com/login) · Red flag: daffodilsw.com case study',
    contraCount: 1
  },

  saas_mvp: {
    label: 'SaaS B2B · MVP',
    sector: 'SaaS B2B',
    frontend:  { name: 'React',            cost: 'Free',                   contra: false },
    backend:   { name: 'Django (Python)',   cost: 'Free',                   contra: true,
                 reason: 'Django over Node.js for B2B SaaS — Solytics Partners confirmed this via their careers page. Python is necessary for data analytics logic, not just preference. Node.js would require rewriting analytics pipelines.' },
    database:  { name: 'PostgreSQL',        cost: 'AWS RDS ~₹1,400/mo',    contra: false },
    auth:      { name: 'Custom / Django Auth', cost: 'Free (built-in)',     contra: false },
    payments:  { name: 'Razorpay',          cost: '2% per txn · no setup', contra: false },
    hosting:   { name: 'AWS EC2 t3.small',  cost: '~₹1,700/mo end-to-end', contra: false },
    india: {
      icon: 'GST',
      name: 'GST Verification API (Masters India / Sandbox.io)',
      desc: 'Mandatory for B2B SaaS invoicing in India — verify client GSTINs before issuing invoices. Pricing: ~₹0.50 per API call. Official API: mastersindia.co/gst-verification-api.'
    },
    redflag: 'Solytics Partners runs both Django and Spring Boot simultaneously — confirmed via job postings. For a small team this doubles onboarding time for new engineers. If you are under 10 engineers, pick one backend language and commit to it. Two languages mean two knowledge silos.',
    source: 'Solytics Partners stack confirmed via careers page: solytics-partners.com/careers · GST API pricing: mastersindia.co',
    contraCount: 1
  },

  saas_growth: {
    label: 'SaaS B2B · Growth',
    sector: 'SaaS B2B',
    frontend:  { name: 'React + TypeScript', cost: 'Free',                 contra: false },
    backend:   { name: 'Django + Spring Boot (microservices)', cost: 'Free', contra: true,
                 reason: 'Spring Boot added at growth stage — Solytics Partners introduced Spring Boot only when system complexity demanded stronger structure. Django stayed for analytics. This is a deliberate, staged migration, not a mistake.' },
    database:  { name: 'MySQL + PostgreSQL', cost: 'AWS RDS ~₹2,800/mo dual', contra: false },
    auth:      { name: 'Auth0',              cost: 'Free 7,500 MAU → ₹1,800/mo M1', contra: false },
    payments:  { name: 'Razorpay Subscriptions', cost: '2% per txn recurring', contra: false },
    hosting:   { name: 'AWS (End-to-End)',   cost: 'EC2 + RDS + S3 ~₹8,000–15,000/mo', contra: false },
    india: {
      icon: 'GST',
      name: 'GST API + Aadhaar eKYC for Onboarding',
      desc: 'At growth stage, automated business verification via GSTIN + Aadhaar eKYC reduces manual onboarding friction. Aadhaar eKYC: uidai.gov.in/ecosystem/authentication-devices-documents. Per-call pricing ~₹2–5.'
    },
    redflag: 'At growth stage SaaS, multi-tenancy architecture is your biggest technical risk. If you did not build row-level security and tenant isolation from day one in PostgreSQL, adding it retroactively is a 2–4 month project. This is non-negotiable before enterprise clients come in.',
    source: 'Solytics Partners stack confirmed via solytics-partners.com/careers · Auth0 pricing: auth0.com/pricing · AWS pricing: aws.amazon.com/pricing',
    contraCount: 1
  },

  agritech_idea: {
    label: 'Agritech · Idea Stage',
    sector: 'Agritech',
    frontend:  { name: 'React (PWA)',       cost: 'Free',                   contra: true,
                 reason: 'PWA over native app at idea stage — Agritech users are in low-connectivity rural areas. A Progressive Web App works offline and installs like a native app without App Store friction. This is unconventional but validated by eNAM and multiple agritech platforms.' },
    backend:   { name: 'Firebase (BaaS)',   cost: 'Free Spark plan',        contra: false },
    database:  { name: 'Firebase Firestore', cost: 'Free 1GB → ₹7/GB',     contra: false },
    auth:      { name: 'Firebase Auth (Phone OTP)', cost: 'Free',           contra: false },
    payments:  { name: 'Razorpay UPI',      cost: '0% MDR on UPI per NPCI', contra: false },
    hosting:   { name: 'Vercel',            cost: 'Free tier',              contra: false },
    india: {
      icon: 'eNAM',
      name: 'eNAM API — National Agriculture Market',
      desc: 'Government of India agri trading platform. Integrating eNAM gives access to 1,000+ mandis and real-time crop pricing data. Official API: enam.gov.in/web/guest/api-integration. Free for registered agritech platforms.'
    },
    redflag: 'Agritech products fail most often not because of technology but because of last-mile distribution and farmer trust. Do not over-engineer the stack at idea stage. Spend 70% of your time in the field, 30% building. The biggest red flag is building a sophisticated platform before talking to 50 farmers.',
    source: 'eNAM API: enam.gov.in · Firebase pricing: firebase.google.com/pricing · PWA for rural India: Google India developer case studies',
    contraCount: 1
  }
};

/* ============================================================
   LOOKUP TABLE
   Maps sector + stage → STACKS key
   Falls back to closest match if exact combo not found
   ============================================================ */
function getStackKey(sector, stage) {
  const exact = `${sector}_${stage}`;
  if (STACKS[exact]) return exact;

  // Fallback mappings
  const fallbacks = {
    fintech_traction: 'fintech_mvp',
    fintech_growth:   'fintech_mvp',
    healthtech_idea:  'healthtech_mvp',
    healthtech_traction: 'healthtech_mvp',
    edtech_growth:    'edtech_traction',
    d2c_idea:         'd2c_mvp',
    d2c_traction:     'd2c_mvp',
    saas_idea:        'saas_mvp',
    saas_traction:    'saas_mvp',
    agritech_mvp:     'agritech_idea',
    agritech_traction:'agritech_idea',
    agritech_growth:  'agritech_idea'
  };

  return fallbacks[exact] || 'fintech_mvp';
}

/* ============================================================
   PILL SELECTION LOGIC
   ============================================================ */
function initPills() {
  const pills = document.querySelectorAll('.pill');

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      const group = pill.dataset.group;
      const value = pill.dataset.value;

      // Deactivate all pills in same group
      document.querySelectorAll(`.pill[data-group="${group}"]`).forEach(p => {
        p.classList.remove('active');
      });

      // Activate clicked pill
      pill.classList.add('active');
      selected[group] = value;

      // Update button and hint
      updateCTA();
    });
  });
}

function updateCTA() {
  const btn  = document.getElementById('generateBtn');
  const hint = document.getElementById('inputHint');
  const all  = selected.stage && selected.team && selected.budget && selected.sector;

  btn.disabled = !all;

  if (all) {
    hint.textContent = 'Ready — click to generate';
    hint.style.color = 'var(--accent)';
  } else {
    const missing = [];
    if (!selected.stage)  missing.push('stage');
    if (!selected.team)   missing.push('team size');
    if (!selected.budget) missing.push('budget');
    if (!selected.sector) missing.push('sector');
    hint.textContent = `Still need: ${missing.join(', ')}`;
    hint.style.color = 'var(--text-tertiary)';
  }
}

/* ============================================================
   GENERATE BUTTON
   ============================================================ */
function initGenerate() {
  document.getElementById('generateBtn').addEventListener('click', () => {
    if (!selected.stage || !selected.team || !selected.budget || !selected.sector) return;
    renderResult();
  });
}

/* ============================================================
   RENDER RESULT
   ============================================================ */
function renderResult() {
  const key   = getStackKey(selected.sector, selected.stage);
  const stack = STACKS[key];

  if (!stack) return;

  // Hide empty state, show result
  document.getElementById('emptyState').style.display    = 'none';
  const wrapper = document.getElementById('resultWrapper');
  wrapper.style.display = 'flex';

  // Force re-animation
  wrapper.style.animation = 'none';
  wrapper.offsetHeight;
  wrapper.style.animation = '';

  // --- HEADER ---
  document.getElementById('resultTitle').textContent = 'Recommended stack';
  document.getElementById('resultSubtitle').textContent =
    `${stack.label} · ${selected.team === 'solo' ? 'Solo' : selected.team === 'small' ? '2–5 people' : selected.team === 'mid' ? '6–15 people' : '15+ people'} · ${getBudgetLabel(selected.budget)}`;

  // --- BADGES ---
  const badgeContainer = document.getElementById('resultBadges');
  badgeContainer.innerHTML = '';
  badgeContainer.innerHTML += `<span class="badge badge-sector">${stack.sector}</span>`;
  if (stack.contraCount > 0) {
    badgeContainer.innerHTML += `<span class="badge badge-contra">${stack.contraCount} contrarian pick${stack.contraCount > 1 ? 's' : ''}</span>`;
  }

  // --- STACK GRID ---
  const grid = document.getElementById('stackGrid');
  grid.innerHTML = '';

  const layers = [
    { key: 'frontend',  label: 'Frontend' },
    { key: 'backend',   label: 'Backend' },
    { key: 'database',  label: 'Database' },
    { key: 'auth',      label: 'Auth' },
    { key: 'payments',  label: 'Payments' },
    { key: 'hosting',   label: 'Hosting' }
  ];

  layers.forEach(layer => {
    const data = stack[layer.key];
    if (!data) return;

    const card = document.createElement('div');
    card.className = `stack-card${data.contra ? ' is-contra' : ''}`;

    card.innerHTML = `
      <div class="stack-layer">${layer.label}</div>
      <div class="stack-name">${data.name}</div>
      <div class="stack-cost">${data.cost}</div>
      ${data.contra ? `<span class="contra-badge">Contrarian</span><p class="contra-reason">${data.reason}</p>` : ''}
    `;

    grid.appendChild(card);
  });

  // --- INDIA INTEGRATION ---
  const indiaBox = document.getElementById('indiaBox');
  indiaBox.innerHTML = `
    <div class="india-icon">${stack.india.icon}</div>
    <div class="india-content">
      <div class="india-label">India-specific integration</div>
      <div class="india-name">${stack.india.name}</div>
      <div class="india-desc">${stack.india.desc}</div>
    </div>
  `;

  // --- RED FLAG ---
  const redflagBox = document.getElementById('redflagBox');
  redflagBox.innerHTML = `
    <div class="redflag-header">⚠ Red flag for this combination</div>
    <div class="redflag-text">${stack.redflag}</div>
  `;

  // --- SOURCE ---
  const sourceRow = document.getElementById('sourceRow');
  sourceRow.innerHTML = `
    <div class="source-dot"></div>
    <span class="source-text">Sources:</span>
    <span class="source-text">${stack.source}</span>
  `;

  // Scroll to output on mobile
  if (window.innerWidth <= 900) {
    document.getElementById('outputPanel').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

/* ============================================================
   HELPERS
   ============================================================ */
function getBudgetLabel(budget) {
  const map = {
    micro: 'Under ₹50K/mo',
    low:   '₹50K–2L/mo',
    mid:   '₹2L–10L/mo',
    high:  '₹10L+/mo'
  };
  return map[budget] || budget;
}

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initPills();
  initGenerate();
});
