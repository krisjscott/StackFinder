const selected = {
  stage:  null,
  team:   null,
  budget: null,
  sector: null
};

const toggleBtn = document.getElementById("themeToggle");

if (toggleBtn) {
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "dark") {
    document.body.setAttribute("data-theme", "dark");
    toggleBtn.textContent = "☀️";
  } else {
    toggleBtn.textContent = "🌙";
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
}

/* ============================================================
   STACK DATA
   ============================================================ */
const STACKS = {

  fintech_idea: {
    label: 'Fintech · Idea Stage',
    sector: 'Fintech',
    frontend:  { name: 'React',           cost: 'Free',                    contra: false },
    backend:   { name: 'Supabase Functions / Firebase', cost: 'Free tier', contra: false },
    database:  { name: 'Supabase PostgreSQL / Firestore', cost: 'Free → ₹420/mo Pro', contra: true,
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

  fintech_growth: {
    label: 'Fintech · Growth Stage',
    sector: 'Fintech',
    frontend:  { name: 'React + TypeScript', cost: 'Free',                 contra: false },
    backend:   { name: 'Django + microservices (Python)', cost: 'Free',    contra: true,
                 reason: 'Python backend maintained at growth — RBI regulation and ML-based fraud detection make a Python rewrite prohibitive. Migrate individual services, never the whole stack at once.' },
    database:  { name: 'PostgreSQL + Redis', cost: 'AWS RDS ~₹2,800/mo + ElastiCache ~₹800/mo', contra: false },
    auth:      { name: 'Auth0',              cost: 'Free 7,500 MAU → ₹1,800/mo', contra: false },
    payments:  { name: 'Razorpay Subscriptions + UPI AutoPay', cost: '2% per txn', contra: false },
    hosting:   { name: 'AWS EC2 + S3',       cost: 'EC2 t3.medium ~₹3,200/mo + S3', contra: false },
    india: {
      icon: 'NACH',
      name: 'NACH Mandate + RBI Sandbox API',
      desc: 'National Automated Clearing House — for loan EMI and insurance premium auto-debit. Mandatory at scale. RBI Regulatory Sandbox: rbi.org.in/fintech/sandbox. Apply 3–6 months before launch.'
    },
    redflag: 'At fintech growth stage, PCI-DSS certification becomes non-negotiable for card payments. This is a 6-month audit process. Begin the compliance checklist before you hit ₹10L+ monthly transactions, not after.',
    source: 'RBI sandbox: rbi.org.in/fintech · NACH API: npci.org.in/product-overview/nach · AWS pricing: aws.amazon.com/pricing',
    contraCount: 1
  },

  healthtech_idea: {
    label: 'Healthtech · Idea Stage',
    sector: 'Healthtech',
    frontend:  { name: 'React',            cost: 'Free',                   contra: false },
    backend:   { name: 'Firebase (BaaS)',   cost: 'Free Spark plan',        contra: false },
    database:  { name: 'Firebase Firestore', cost: 'Free 1GB → ₹7/GB beyond', contra: false },
    auth:      { name: 'Firebase Auth',     cost: 'Free up to 10K MAU',    contra: false },
    payments:  { name: 'Razorpay',          cost: '2% per txn',            contra: false },
    hosting:   { name: 'Vercel',            cost: 'Free tier (100GB bandwidth)', contra: false },
    india: {
      icon: 'ABHA',
      name: 'ABDM / ABHA Health ID API (Sandbox)',
      desc: 'Ayushman Bharat Digital Mission — mandatory for any health record or telemedicine platform. Start with sandbox access now. Official docs: abdm.gov.in/sandbox. Free sandbox access.'
    },
    redflag: 'Health data is regulated under India\'s Digital Personal Data Protection Act 2023. You cannot store patient records on free-tier infrastructure. Budget for DPDP-compliant storage from day one — Firebase M0 free tier does not meet DPDP requirements.',
    source: 'ABDM sandbox: abdm.gov.in · Firebase pricing: firebase.google.com/pricing · DPDP Act 2023: meity.gov.in',
    contraCount: 0
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

  edtech_mvp: {
    label: 'EdTech · MVP',
    sector: 'EdTech',
    frontend:  { name: 'React',            cost: 'Free',                   contra: false },
    backend:   { name: 'Node.js + Express', cost: 'Free',                  contra: false },
    database:  { name: 'Supabase PostgreSQL', cost: 'Free → ₹420/mo Pro', contra: false },
    auth:      { name: 'Firebase Auth',     cost: 'Free up to 10K MAU',    contra: false },
    payments:  { name: 'Razorpay',          cost: '2% per txn',            contra: false },
    hosting:   { name: 'Render',            cost: 'Free → ₹800/mo Starter', contra: false },
    india: {
      icon: 'Digi',
      name: 'DigiLocker API for Certificate Issuance',
      desc: 'Issue verifiable course certificates linked to student Digi IDs. Official docs: api.digitallocker.gov.in. Free for government-verified issuers — the credential process takes 4–6 weeks.'
    },
    redflag: 'Moving from Firebase to PostgreSQL mid-product is an expensive migration. Plan your data structure before you have 5,000 users — relational schemas do not map cleanly from Firestore document models.',
    source: 'Sstudize stack confirmed via direct developer conversation, April 2026 · Supabase pricing: supabase.com/pricing',
    contraCount: 0
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

  edtech_growth: {
    label: 'EdTech · Growth Stage',
    sector: 'EdTech',
    frontend:  { name: 'Next.js',          cost: 'Free',                   contra: false },
    backend:   { name: 'Django (Python) + microservices', cost: 'Free',    contra: true,
                 reason: 'Python at growth stage — ML-based personalization (adaptive quizzes, learning paths) requires scikit-learn and pandas pipelines. Rewriting to Node.js at this stage would be catastrophic.' },
    database:  { name: 'PostgreSQL + Redis', cost: 'AWS RDS ~₹2,800/mo + ElastiCache ~₹800/mo', contra: false },
    auth:      { name: 'Auth0',             cost: 'Free 7,500 MAU → ₹1,800/mo', contra: false },
    payments:  { name: 'Razorpay Subscriptions', cost: '2% per txn',       contra: false },
    hosting:   { name: 'AWS EC2 + S3',      cost: 'EC2 t3.medium ~₹3,200/mo + S3 ~₹200/mo', contra: false },
    india: {
      icon: 'Digi',
      name: 'DigiLocker + NEP 2020 Digital Credentials',
      desc: 'National Education Policy 2020 mandates digital credentials for all certified courses. DigiLocker integration is now a competitive necessity for institution partnerships. Docs: api.digitallocker.gov.in.'
    },
    redflag: 'Video streaming at scale is a major cost trap. AWS S3 + CloudFront charges ₹7–9 per GB egress in India. At growth stage with 10,000+ concurrent learners, CDN costs can exceed your infra budget. Evaluate BunnyCDN (India PoP) as a 60–70% cheaper alternative.',
    source: 'Sstudize stack via developer conversation, April 2026 · AWS pricing: aws.amazon.com/cloudfront/pricing · BunnyCDN: bunny.net/pricing',
    contraCount: 1
  },

  d2c_idea: {
    label: 'D2C · Idea Stage',
    sector: 'D2C / E-comm',
    frontend:  { name: 'Shopify (hosted)',  cost: 'Basic ₹1,994/mo',       contra: false },
    backend:   { name: 'Platform-managed (Shopify)', cost: 'Included',      contra: false },
    database:  { name: 'Platform-managed', cost: 'Included in platform',   contra: false },
    auth:      { name: 'Platform-managed', cost: 'Included',               contra: false },
    payments:  { name: 'Razorpay',         cost: '2% per txn · UPI at 0% MDR', contra: false },
    hosting:   { name: 'Shopify-hosted',   cost: 'Included in plan',        contra: false },
    india: {
      icon: 'UPI',
      name: 'Razorpay UPI + COD Handling',
      desc: 'COD (Cash on Delivery) is still 40–50% of Indian D2C orders. Razorpay COD Intelligence scores delivery risk per order. Docs: razorpay.com/docs/payments/cod. No extra setup cost.'
    },
    redflag: 'Shopify charges 2% transaction fees if you do not use Shopify Payments — which is unavailable in India. You will always pay Razorpay (2%) + Shopify (2%) = 4% per transaction. Budget this into your unit economics from day one.',
    source: 'Shopify India pricing: shopify.com/in/pricing · Razorpay COD docs: razorpay.com/docs',
    contraCount: 0
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

  saas_idea: {
    label: 'SaaS B2B · Idea Stage',
    sector: 'SaaS B2B',
    frontend:  { name: 'React',            cost: 'Free',                   contra: false },
    backend:   { name: 'Supabase (BaaS)',   cost: 'Free tier',              contra: false },
    database:  { name: 'Supabase PostgreSQL', cost: 'Free → ₹420/mo Pro',  contra: false },
    auth:      { name: 'Supabase Auth',     cost: 'Free up to 50K MAU',    contra: false },
    payments:  { name: 'Razorpay',          cost: '2% per txn · no setup', contra: false },
    hosting:   { name: 'Vercel + Supabase', cost: 'Free tier both',         contra: false },
    india: {
      icon: 'GST',
      name: 'GST Verification API (Masters India / Sandbox.io)',
      desc: 'Mandatory for B2B SaaS invoicing in India — verify client GSTINs before issuing invoices. Pricing: ~₹0.50 per API call. Official API: mastersindia.co/gst-verification-api.'
    },
    redflag: 'B2B SaaS at idea stage often skips multi-tenancy design. Retrofitting row-level tenant isolation into a single-schema PostgreSQL database is a 2–3 month project. Design for multiple tenants from your very first migration — even if you have just one customer.',
    source: 'Supabase pricing: supabase.com/pricing · GST API: mastersindia.co · Vercel pricing: vercel.com/pricing',
    contraCount: 0
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

  saas_traction: {
    label: 'SaaS B2B · Early Traction',
    sector: 'SaaS B2B',
    frontend:  { name: 'React + TypeScript', cost: 'Free',                 contra: false },
    backend:   { name: 'Django (Python)',    cost: 'Free',                  contra: true,
                 reason: 'Django maintained at traction — analytics pipeline rewrites at this stage cost 2–3 months. Only add Spring Boot for specific high-throughput services, not as a replacement.' },
    database:  { name: 'PostgreSQL',         cost: 'AWS RDS ~₹1,400/mo',   contra: false },
    auth:      { name: 'Auth0',              cost: 'Free 7,500 MAU → ₹1,800/mo', contra: false },
    payments:  { name: 'Razorpay Subscriptions', cost: '2% per txn',       contra: false },
    hosting:   { name: 'AWS EC2 t3.small',   cost: '~₹1,700/mo',           contra: false },
    india: {
      icon: 'GST',
      name: 'GST Verification + E-Invoice API',
      desc: 'From ₹5Cr+ annual turnover, e-invoicing is mandatory under GST rules. Integrate the IRP (Invoice Registration Portal) API early: einvoice1.gst.gov.in. ~₹0.50 per call.'
    },
    redflag: 'At traction stage, enterprise clients will ask for SOC 2 Type II or ISO 27001 certification. Starting this compliance process takes 9–12 months. If enterprise is your ICP, begin the audit process now — not when a client demands it.',
    source: 'Solytics Partners confirmed via careers page · Auth0 pricing: auth0.com/pricing · GST e-invoice: einvoice1.gst.gov.in',
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
      desc: 'At growth stage, automated business verification via GSTIN + Aadhaar eKYC reduces manual onboarding friction. Aadhaar eKYC: uidai.gov.in/ecosystem. Per-call pricing ~₹2–5.'
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
  },

  agritech_mvp: {
    label: 'Agritech · MVP',
    sector: 'Agritech',
    frontend:  { name: 'React (PWA) + Vernacular UI', cost: 'Free',        contra: true,
                 reason: 'Vernacular-first design at MVP — Agritech retention depends on regional language support (Hindi, Marathi, Telugu). Apps that launched English-only lost 60–70% of rural users in onboarding.' },
    backend:   { name: 'Node.js + Express', cost: 'Free',                  contra: false },
    database:  { name: 'MongoDB Atlas',     cost: 'Free M0 → ₹600/mo M2', contra: false },
    auth:      { name: 'Firebase Auth (Phone OTP)', cost: 'Free',           contra: false },
    payments:  { name: 'Razorpay UPI',      cost: '0% MDR on UPI',         contra: false },
    hosting:   { name: 'Render',            cost: 'Free → ₹800/mo',         contra: false },
    india: {
      icon: 'eNAM',
      name: 'eNAM + PM-KISAN API Integration',
      desc: 'PM-KISAN API gives access to verified farmer beneficiary data — invaluable for credit scoring and subsidy disbursement features. Combined with eNAM for market price data. Both free for registered platforms.'
    },
    redflag: 'SMS-based OTP auth fails in low-connectivity zones. Build a fallback TOTP (Time-based OTP) or missed-call verification for farmers in areas with 2G coverage. Skipping this will cause 30–40% drop-off at signup.',
    source: 'eNAM API: enam.gov.in · PM-KISAN: pmkisan.gov.in · MongoDB Atlas pricing: mongodb.com/pricing',
    contraCount: 1
  },

  agritech_growth: {
    label: 'Agritech · Growth Stage',
    sector: 'Agritech',
    frontend:  { name: 'React Native (cross-platform)', cost: 'Free',      contra: false },
    backend:   { name: 'Django (Python)',   cost: 'Free',                   contra: true,
                 reason: 'Python at growth — ML crop yield prediction, soil analysis, and weather correlation require pandas and scikit-learn. Agritech at scale without ML is a commodity product. Python is not optional.' },
    database:  { name: 'PostgreSQL + PostGIS', cost: 'AWS RDS ~₹2,800/mo', contra: false },
    auth:      { name: 'Firebase Auth',     cost: 'Free 10K MAU',          contra: false },
    payments:  { name: 'Razorpay UPI + NACH', cost: '0% MDR UPI · NACH for loan EMI', contra: false },
    hosting:   { name: 'AWS EC2 + S3',      cost: 'EC2 t3.medium ~₹3,200/mo', contra: false },
    india: {
      icon: 'AGRI',
      name: 'AgriStack + Soil Health Card API',
      desc: 'AgriStack is India\'s federated farmer database — digital land records, crop history, input usage. Soil Health Card API (soilhealth.dac.gov.in) provides farm-level nutrient data. Both are free for verified agritech platforms.'
    },
    redflag: 'PostGIS (geospatial PostgreSQL) is powerful but requires specialized database skills. If your team has no GIS experience, raw GPS coordinates in MongoDB may serve you better for 12–18 months. Only adopt PostGIS when you have field-boundary polygon data at scale.',
    source: 'AgriStack: agristack.gov.in · Soil Health Card: soilhealth.dac.gov.in · PostGIS docs: postgis.net',
    contraCount: 1
  }
};

function detectEdgeCases({ stage, team, budget, sector }) {

 
  if (stage === 'growth' && team === 'solo' && budget === 'micro') {
    return {
      type: 'unrealistic',
      headline: '⚠ This combination is unrealistic',
      body: 'A solo founder with a sub-₹50K/mo budget cannot operate a growth-stage product. Growth stage typically requires 5–15 engineers and ₹2L–10L/mo infrastructure. Showing you an MVP-stage stack instead — this is the realistic starting point.',
      downgradedKey: resolveKey({ stage: 'mvp', team, budget: 'micro', sector })
    };
  }

  if (stage === 'growth' && budget === 'micro') {
    return {
      type: 'mismatch',
      headline: '⚠ Budget–Stage mismatch detected',
      body: 'Growth-stage products require meaningful infrastructure spend — typically ₹2L–10L/mo. A sub-₹50K/mo budget at growth stage means you are either pre-revenue or heavily bootstrapped. Showing you an MVP stack — the realistic fit for this budget.',
      downgradedKey: resolveKey({ stage: 'mvp', team, budget: 'micro', sector })
    };
  }

  if (stage === 'growth' && budget === 'low') {
    return {
      type: 'caution',
      headline: '⚠ Tight budget for growth stage',
      body: '₹50K–2L/mo is tight for a growth-stage product. You can operate this stack, but you will face hard trade-offs between reliability (uptime SLAs) and features. Consider vertical scaling before horizontal. Showing the best stack for your constraints.',
      downgradedKey: null // still show growth stack, just warn
    };
  }

  return null; // no edge case
}

function resolveKey({ sector, stage, budget }) {

  if (budget === 'micro') {
    const microMap = {
      edtech:     'edtech_idea',
      fintech:    'fintech_idea',
      agritech:   'agritech_idea',
      healthtech: 'healthtech_idea',
      saas:       'saas_idea',
      d2c:        'd2c_idea'
    };
    return microMap[sector] || 'saas_idea'; // fallback only if sector unknown
  }

  /* --- low budget: sector-specific, stage-aware --- */
  if (budget === 'low') {
    if (sector === 'healthtech') {
      return stage === 'growth' ? 'healthtech_growth' : 'healthtech_mvp';
    }
    if (sector === 'fintech')    return 'fintech_mvp';
    if (sector === 'edtech')     return stage === 'idea' ? 'edtech_idea' : 'edtech_traction';
    if (sector === 'saas')       return 'saas_mvp';
    if (sector === 'd2c')        return 'd2c_mvp';
    if (sector === 'agritech')   return 'agritech_mvp';
    return 'saas_mvp'; // generic B2B fallback
  }

  /* --- mid budget: sector + stage aware --- */
  if (budget === 'mid') {
    if (sector === 'healthtech') return 'healthtech_growth';
    if (sector === 'd2c')        return stage === 'growth' ? 'd2c_growth' : 'd2c_mvp';
    if (sector === 'saas')       return stage === 'growth' ? 'saas_growth' : 'saas_traction';
    if (sector === 'fintech')    return stage === 'growth' ? 'fintech_growth' : 'fintech_mvp';
    if (sector === 'edtech')     return stage === 'growth' ? 'edtech_growth' : 'edtech_traction';
    if (sector === 'agritech')   return stage === 'growth' ? 'agritech_growth' : 'agritech_mvp';
    return 'saas_growth';
  }

  /* --- high budget: push to growth stacks per sector --- */
  if (budget === 'high') {
    const highMap = {
      d2c:        'd2c_growth',
      saas:       'saas_growth',
      healthtech: 'healthtech_growth',
      fintech:    'fintech_growth',
      edtech:     'edtech_growth',
      agritech:   'agritech_growth'
    };
    return highMap[sector] || 'saas_growth';
  }
  if (stage === "idea") {
  // always downgrade complexity
    return `${sector}_idea`;
  }
  /* --- exact match fallback --- */
  const exact = `${sector}_${stage}`;
  return STACKS[exact] ? exact : 'saas_mvp';

  
}

function initPills() {
  const pills = document.querySelectorAll('.pill[data-group]');

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      const group = pill.dataset.group;
      const value = pill.dataset.value;

      document.querySelectorAll(`.pill[data-group="${group}"]`).forEach(p => {
        p.classList.remove('active');
      });

      pill.classList.add('active');
      selected[group] = value;
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

function initGenerate() {
  document.getElementById('generateBtn').addEventListener('click', () => {
    if (!selected.stage || !selected.team || !selected.budget || !selected.sector) return;
    renderResult();
  });
}

function renderResult() {
  const edgeCase  = detectEdgeCases(selected);
  const resolvedKey = edgeCase && edgeCase.downgradedKey
    ? edgeCase.downgradedKey
    : resolveKey(selected);
  const stack = STACKS[resolvedKey];

  if (!stack) {
    console.error('No stack found for key:', resolvedKey, '| inputs:', selected);
    return;
  }

  /* --- show result area --- */
  document.getElementById('emptyState').style.display = 'none';
  const wrapper = document.getElementById('resultWrapper');
  wrapper.style.display = 'flex';

  /* trigger re-animation */
  wrapper.style.animation = 'none';
  wrapper.offsetHeight;
  wrapper.style.animation = '';

  /* --- header --- */
  document.getElementById('resultTitle').textContent = 'Recommended stack';
  document.getElementById('resultSubtitle').textContent =
    `${stack.label} · ${getTeamLabel(selected.team)} · ${getBudgetLabel(selected.budget)}`;

  const badgeContainer = document.getElementById('resultBadges');
  badgeContainer.innerHTML = `<span class="badge badge-sector">${stack.sector}</span>`;
  if (stack.contraCount > 0) {
    badgeContainer.innerHTML += `<span class="badge badge-contra">${stack.contraCount} contrarian pick${stack.contraCount > 1 ? 's' : ''}</span>`;
  }
  if (edgeCase && edgeCase.downgradedKey) {
    badgeContainer.innerHTML += `<span class="badge badge-contra">Adjusted for realism</span>`;
  }

  /* --- edge case warning banner --- */
  renderEdgeCaseBanner(edgeCase);

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

 
  document.getElementById('indiaBox').innerHTML = `
    <div class="india-icon">${stack.india.icon}</div>
    <div class="india-content">
      <div class="india-label">India-specific integration</div>
      <div class="india-name">${stack.india.name}</div>
      <div class="india-desc">${stack.india.desc}</div>
    </div>
  `;

  document.getElementById('redflagBox').innerHTML = `
    <div class="redflag-header">⚠ Red flag for this combination</div>
    <div class="redflag-text">${stack.redflag}</div>
  `;

  
  document.getElementById('sourceRow').innerHTML = `
    <div class="source-dot"></div>
    <span class="source-text">Sources:</span>
    <span class="source-text">${stack.source}</span>
  `;

  if (window.innerWidth <= 900) {
    document.getElementById('outputPanel').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}


function renderEdgeCaseBanner(edgeCase) {

  const existing = document.getElementById('edgeCaseBanner');
  if (existing) existing.remove();

  if (!edgeCase) return;

  const banner = document.createElement('div');
  banner.id = 'edgeCaseBanner';

  const colorClass = edgeCase.type === 'caution' ? 'banner-caution' : 'banner-warn';
  banner.className = `edge-case-banner ${colorClass}`;

  banner.innerHTML = `
    <div class="banner-headline">${edgeCase.headline}</div>
    <div class="banner-body">${edgeCase.body}</div>
  `;

  const wrapper = document.getElementById('resultWrapper');
  wrapper.insertBefore(banner, wrapper.firstChild);
}

function getTeamLabel(team) {
  const map = {
    solo:  'Solo founder',
    small: '2–5 people',
    mid:   '6–15 people',
    large: '15+ people'
  };
  return map[team] || team;
}

function getBudgetLabel(budget) {
  const map = {
    micro: 'Under ₹50K/mo',
    low:   '₹50K–2L/mo',
    mid:   '₹2L–10L/mo',
    high:  '₹10L+/mo'
  };
  return map[budget] || budget;
}

(function injectBannerStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .edge-case-banner {
      border-radius: var(--radius-lg);
      padding: 14px 18px;
      animation: fadeIn 0.35s ease both;
    }
    .banner-warn {
      background: var(--amber-bg);
      border: 1px solid var(--amber-border);
    }
    .banner-caution {
      background: var(--amber-bg);
      border: 1px solid var(--amber-border);
      opacity: 0.85;
    }
    .banner-headline {
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: var(--amber-text);
      margin-bottom: 5px;
    }
    .banner-body {
      font-size: 13px;
      color: var(--amber-text);
      line-height: 1.55;
    }
  `;
  document.head.appendChild(style);
})();

document.addEventListener('DOMContentLoaded', () => {
  initPills();
  initGenerate();
});