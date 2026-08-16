import React, { useState } from "react";
import {
  Landmark,
  ShieldCheck,
  Store,
  BadgeCheck,
  HandCoins,
  TrendingUp,
  FileCheck,
  CheckCircle2,
  ExternalLink,
  Bot,
  Layers,
  Sparkles,
  Award,
  Users,
  Wallet,
  Building2,
  Lock,
  Compass,
  ArrowRight,
  ShieldAlert,
  Fingerprint,
  Check,
  XCircle,
  HelpCircle,
  Mic,
  Cpu,
  Receipt,
  FileText,
  Truck,
  CookingPot,
  Hammer,
  Sparkle,
  Scale
} from "lucide-react";
import "./AboutUs.css";

const OFFICIAL = {
  eshram: "https://www.eshram.gov.in/",
  pmsym: "https://maandhan.in/",
  pmjdy: "https://www.pmjdy.gov.in/scheme",
  jansuraksha: "https://www.jansuraksha.gov.in/",
  svanidhi: "https://pmsvanidhi.mohua.gov.in/",
  mudra: "https://www.mudra.org.in/",
};

const SCHEME_ICONS = {
  "e-Shram": BadgeCheck,
  "ई-श्रम": BadgeCheck,
  "ઈ-શ્રમ": BadgeCheck,
  "PM-SYM": HandCoins,
  "पीएम-एसवाईएम": HandCoins,
  "PM SVANidhi": Store,
  "पीएम स्वनिधि": Store,
  "PM સ્વનિધિ": Store,
  "PM Jan Dhan Yojana": Landmark,
  "प्रधानमंत्री जन-धन योजना": Landmark,
  "પ્રધાનમંત્રી જન ધન યોજના": Landmark,
  "PMSBY": ShieldCheck,
  "पीएमएसबीवाई": ShieldCheck,
  "PMJJBY": ShieldCheck,
  "पीएमजेजेबीवाई": ShieldCheck,
  "Pradhan Mantri MUDRA Yojana": Wallet,
  "प्रधानमंत्री मुद्रा योजना": Wallet,
  "પ્રધાનમંત્રી મુદ્રા યોજના": Wallet,
};

const COPY = {
  en: {
    heroBadge: "GOVERNMENT OF INDIA CO-LENDING & FINANCIAL INCLUSION PLATFORM",
    heroTitle: "About Sahayata — India's Alternate Financial & Welfare Gateway",
    heroSubtitle: "Sahayata is an AI-powered fintech platform bridging India's 45-Crore unorganised workers with formal public sector banks, central welfare schemes, and sachet micro-credit without needing traditional CIBIL scores or salary slips.",
    btnAiTwin: "Try SAI Voice Assistant",
    btnBankConsole: "Open Bank Command Center",
    trustEkyc: "e-KYC & CKYC Ready",
    trustAa: "RBI Account Aggregator Aligned",
    trustForensics: "8-Layer Anti-Fraud Forensics",
    trustSachet: "Daily Sachet Micro-Repayments",
    
    kpiBeneficiaries: "50 Lakh+",
    kpiBeneficiariesLbl: "PM SVANidhi Beneficiaries",
    kpiEshram: "28 Crore+",
    kpiEshramLbl: "e-Shram Registered Workers",
    kpiJanDhan: "52 Crore+",
    kpiJanDhanLbl: "Jan Dhan Bank Accounts",
    kpiDisbursed: "₹2.45 Cr+",
    kpiDisbursedLbl: "Live Co-Lended Capital",

    // Section: Problem vs Solution
    whyEyebrow: "National Financial Inclusion Mandate",
    whyTitle: "Why India Needs an Alternate Credit Gateway?",
    whySub: "Traditional banking was architected for salaried employees with monthly paycheques. Sahayata bridges the financial divide for India's 45 Crore daily wage and gig workforce.",
    compTraditional: "Traditional Banking System",
    compSahayata: "Sahayata AI Financial Architecture",
    compR1Title: "Credit Assessment & Scoring",
    compR1Trad: "Requires 750+ CIBIL score, 3 months salary slips, and formal ITR filings.",
    compR1Sah: "100% Alternate Underwriting: analyzes daily UPI QR inflows and cashflow velocity.",
    compR2Title: "Repayment Structure",
    compR2Trad: "Rigid monthly lump-sum EMIs causing default penalties and bounce charges.",
    compR2Sah: "Flexible ₹50 to ₹100/day Sachet Micro-EDIs aligned with daily earnings.",
    compR3Title: "Onboarding & Accessibility",
    compR3Trad: "Complex 14-page physical forms and mandatory branch queue visits.",
    compR3Sah: "Zero-typing multilingual voice dialogue with SAI in Hindi, Gujarati, or English.",
    compR4Title: "Interest Cost & Protection",
    compR4Trad: "Informal moneylenders charge 36%–120% extortionate interest.",
    compR4Sah: "Official 7% subsidized micro-credit with 8-layer anti-fraud security.",

    // Section: Ecosystem & Partners
    partnersEyebrow: "Institutional & Regulatory Infrastructure",
    partnersTitle: "Integrated with National Digital Public Rails",
    partnersSub: "Built on top of Reserve Bank of India, NPCI, and Central Ministry digital frameworks.",

    // Section: What Sahayata Does
    whatWeDoEyebrow: "Comprehensive Platform Capabilities",
    whatWeDoTitle: "What Does the Sahayata Platform Do?",
    whatWeDoSub: "A complete end-to-end ecosystem engineered to assess, underwrite, protect, and disburse micro-credit for informal workers.",

    f1Title: "1. SAI Multilingual AI Voice Assistant",
    f1Desc: "Unlettered workers can simply speak in Hindi, Gujarati, or English. SAI conducts a structured 9-stage voice dialogue, extracts earning patterns, and generates an AI Eligibility Certificate without typing a single word.",
    f1Tag: "Voice-First AI",

    f2Title: "2. Alternate Cashflow Underwriting",
    f2Desc: "Bypasses rigid CIBIL score requirements by analyzing daily UPI QR transaction velocity and PAN-linked Account Aggregator cash flows to determine actual net daily cash buffer (₹400-₹500/day).",
    f2Tag: "UPI + ReBIT AA",

    f3Title: "3. 8-Layer Anti-Fraud Forensics Suite",
    f3Desc: "Provides bank risk analysts with automated tamper detection including Error Level Analysis (ELA) for Photoshop edits, EXIF metadata validation, Aadhaar Verhoeff D5 checksum verification, and GPS geofencing.",
    f3Tag: "0% NPA Protection",

    f4Title: "4. Bank Command Center & Credit Console",
    f4Desc: "Direct co-lending terminal for Public Sector Banks (SBI, Bank of Baroda). Enables Credit Officers to inspect cashflow dossiers, evaluate repayment capacity, and generate official Sanction Letter PDFs in one click.",
    f4Tag: "Instant Sanction",

    f5Title: "5. Sachet Micro-Repayment Rails (EDI)",
    f5Desc: "Replaces stressful monthly lump-sum EMIs with small daily micro-deductions (₹50 to ₹100/day) via UPI Autopay / e-NACH, automatically scheduled after work hours to match daily income rhythms.",
    f5Tag: "₹50/Day Micro-EDI",

    f6Title: "6. Direct Central Government Schemes Access",
    f6Desc: "Instantly maps eligible workers to 7 Central Government welfare schemes (PM SVANidhi, PM-SYM Pension, e-SHRAM, PM Jan Dhan, PMSBY, PMJJBY, MUDRA) with 7% interest subvention assistance.",
    f6Tag: "7 Central Schemes",

    // Section: End-to-End Workflow
    journeyEyebrow: "Step-by-Step Workflow",
    journeyTitle: "How Sahayata Works End-to-End",
    journeySub: "From a worker's first voice interaction to direct bank disbursal in 5 frictionless steps.",

    step1Num: "01",
    step1Title: "Voice Interaction with SAI",
    step1Desc: "Worker speaks to SAI in their local dialect. SAI asks about their occupation, daily earnings, daily expenses, and family dependents.",

    step2Num: "02",
    step2Title: "Alternate AI Scoring & KYC Check",
    step2Desc: "Platform calculates an AI Trust Score (0-100) using UPI transaction velocity and verifies Aadhaar/PAN using Verhoeff checksum algorithm.",

    step3Num: "03",
    step3Title: "8-Layer Anti-Fraud Validation",
    step3Desc: "Uploaded identity documents and merchant QR pass are scanned for digital image tampering and metadata integrity in under 2 seconds.",

    step4Num: "04",
    step4Title: "Bank Credit Officer Sanction",
    step4Desc: "Bank Officer reviews the underwriting dossier in the Command Center and approves the micro-loan with a digital Sanction Letter.",

    step5Num: "05",
    step5Title: "Disbursal & Sachet Micro-EDI",
    step5Desc: "Capital is disbursed directly into the worker's Jan Dhan account. Automated ₹50-₹100 daily sachet repayments begin via UPI Autopay.",

    // Section: Beneficiary Personas
    personasEyebrow: "Target Informal Sectors",
    personasTitle: "Who Does Sahayata Empower?",
    personasSub: "Tailored micro-credit and social security for India's largest unorganised labour segments.",

    p1Role: "Delivery & Gig Riders",
    p1Desc: "Zomato, Swiggy, Blinkit, and Porter riders needing immediate working capital for daily fuel, vehicle repairs, and EV fleet upgrades.",
    p1Scheme: "PM SVANidhi + EV Micro-Credit",

    p2Role: "Street Vendors & Hawkers",
    p2Desc: "Fruit/vegetable sellers and food stall vendors needing daily inventory capital without paying 100%+ interest to local moneylenders.",
    p2Scheme: "PM SVANidhi Tranche 1, 2 & 3",

    p3Role: "Construction Supervisors & Labour",
    p3Desc: "Site workers and masons seeking welfare grants, accident insurance, and safety equipment financing through BOCW boards.",
    p3Scheme: "BOCW Welfare + PMSBY",

    p4Role: "Domestic Workers & Artisans",
    p4Desc: "Home helpers, tailors, and handicrafts makers seeking formal identity, emergency micro-credit, and old-age retirement pension.",
    p4Scheme: "e-SHRAM + PM-SYM Pension",

    // Section: Schemes Directory
    schemesEyebrow: "Central Government Schemes Directory",
    schemesTitle: "Official Welfare & Micro-Credit Catalog",
    schemesSub: "Comprehensive guide to central schemes relevant to gig workers, street vendors, delivery partners, and daily labourers.",
    
    tabAll: "All Schemes (7)",
    tabCredit: "Working Capital & Credit (2)",
    tabSocial: "Social Security & Pension (3)",
    tabIdentity: "Identity & Banking Rails (2)",

    requirements: "Eligibility & Requirements",
    benefits: "Major Financial Benefits",
    documents: "Documents to Keep Ready",
    official: "Open Official Portal",
    checkEligibility: "Check Eligibility with SAI",

    disclaimer: "Official Policy Notice: Sahayata is an alternate credit facilitation and social security portal aligned with the RBI Account Aggregator (ReBIT) framework. We do not charge any scheme application fees. Never share your Aadhaar/Bank OTP with anyone.",

    schemes: [
      { name: "e-Shram", category: "identity", tag: "Worker Identity & UAN", req: "Unorganised worker, age 16-59; not an EPFO/ESIC or government employee member. Registration is completely free.", benefits: "Creates a 12-digit UAN-based national worker record and enables direct access to eligible social-security and disaster relief welfare.", docs: "Aadhaar number, Aadhaar-linked active mobile, savings bank account with IFSC.", link: OFFICIAL.eshram },
      { name: "PM-SYM", category: "social", tag: "Old-Age Pension (₹3,000/mo)", req: "Unorganised worker aged 18-40, monthly income up to Rs. 15,000; not covered by EPFO/ESIC/NPS, not an income-tax payer.", benefits: "Voluntary contributory pension of Rs. 3,000 per month after age 60; Central Government matches 50% of the worker's monthly contribution.", docs: "Aadhaar, savings/Jan Dhan account with IFSC, mobile number.", link: OFFICIAL.pmsym },
      { name: "PM SVANidhi", category: "credit", tag: "Street Vendor Working Capital", req: "Eligible urban street vendor holding a Certificate of Vending (CoV) or Letter of Recommendation (LoR) from the Urban Local Body.", benefits: "Collateral-free progressive working capital loans: Rs. 15,000 (1st Tranche), Rs. 25,000 (2nd Tranche), and Rs. 50,000 (3rd Tranche) with 7% interest subsidy.", docs: "Vendor certificate/LoR, Aadhaar, mobile, bank account details and UPI QR handle.", link: OFFICIAL.svanidhi },
      { name: "PM Jan Dhan Yojana", category: "identity", tag: "Universal Banking & Overdraft", req: "Any Indian citizen without another bank account can open a Basic Savings Bank Deposit (BSBD) account through a bank branch or Bank Mitra.", benefits: "Zero minimum balance requirement, RuPay debit card, Rs. 2 Lakh accident insurance, DBT credit, and overdraft facility up to Rs. 10,000.", docs: "Official Valid Document (Aadhaar, Voter ID, PAN, NREGA job card).", link: OFFICIAL.pmjdy },
      { name: "PMSBY", category: "social", tag: "Accident Insurance (₹2 Lakh)", req: "Bank/post-office savings account holder aged 18-70 years; auto-debit consent enabled from the primary bank account.", benefits: "Renewable annual accidental death and full disability cover of Rs. 2,00,000 (Rs. 1,00,000 for partial disability) for a nominal premium of Rs. 20/year.", docs: "Bank account details, nominee name, and auto-debit consent form.", link: OFFICIAL.jansuraksha },
      { name: "PMJJBY", category: "social", tag: "Term Life Insurance (₹2 Lakh)", req: "Bank/post-office savings account holder aged 18-50 years with auto-debit consent.", benefits: "Renewable one-year life insurance cover of Rs. 2,00,000 for death due to any cause, for an annual premium of Rs. 436/year.", docs: "Bank account details, Aadhaar KYC, nominee details and auto-debit mandate.", link: OFFICIAL.jansuraksha },
      { name: "Pradhan Mantri MUDRA Yojana", category: "credit", tag: "Micro-Enterprise Credit (Up to ₹10 Lakh)", req: "Non-corporate, non-farm small/micro enterprises seeking capital for manufacturing, trading, or service activities.", benefits: "Collateral-free institutional micro-credit across three categories: Shishu (up to Rs. 50,000), Kishor (Rs. 50,000 to Rs. 5 Lakh), and Tarun (Rs. 5 Lakh to Rs. 10 Lakh).", docs: "KYC, business establishment proof, 6-month bank statement, and quotation for machinery/stock.", link: OFFICIAL.mudra },
    ]
  },
  hi: {
    heroBadge: "भारत सरकार सह-उधार एवं वित्तीय समावेशन प्लेटफॉर्म",
    heroTitle: "सहायता के बारे में — भारत का वैकल्पिक क्रेडिट व कल्याणकारी पोर्टल",
    heroSubtitle: "सहायता एक एआई-सक्षम फिनटेक प्लेटफॉर्म है जो भारत के 45 करोड़ असंगठित कामगारों को बिना पारंपरिक CIBIL स्कोर या सैलरी स्लिप के सरकारी बैंकों, केंद्रीय कल्याणकारी योजनाओं और साशे माइक्रो-क्रेडिट से जोड़ता है।",
    btnAiTwin: "SAI वॉयस असिस्टेंट आज़माएं",
    btnBankConsole: "बैंक कमांड सेंटर खोलें",
    trustEkyc: "e-KYC एवं CKYC सक्षम",
    trustAa: "RBI अकाउंट एग्रीगेटर फ्रेमवर्क",
    trustForensics: "8-स्तरीय एंटी-फ्रॉड फॉरेंसिक्स",
    trustSachet: "दैनिक साशे माइक्रो-किश्त",
    
    kpiBeneficiaries: "50 लाख+",
    kpiBeneficiariesLbl: "पीएम स्वनिधि लाभार्थी",
    kpiEshram: "28 करोड़+",
    kpiEshramLbl: "ई-श्रम पंजीकृत कामगार",
    kpiJanDhan: "52 करोड़+",
    kpiJanDhanLbl: "जन धन बैंक खाते",
    kpiDisbursed: "₹2.45 करोड़+",
    kpiDisbursedLbl: "लाइव संवितरित ऋण",

    // Section: Problem vs Solution
    whyEyebrow: "राष्ट्रीय वित्तीय समावेशन मिशन",
    whyTitle: "भारत को वैकल्पिक क्रेडिट गेटवे की आवश्यकता क्यों है?",
    whySub: "पारंपरिक बैंकिंग मासिक वेतन पाने वाले कर्मचारियों के लिए बनाई गई थी। सहायता भारत के 45 करोड़ दैनिक श्रमिकों और गिग कामगारों के लिए वित्तीय पुल का काम करती है।",
    compTraditional: "पारंपरिक बैंकिंग प्रणाली",
    compSahayata: "सहायता एआई वित्तीय प्रणाली",
    compR1Title: "क्रेडिट मूल्यांकन व स्कोरिंग",
    compR1Trad: "750+ CIBIL स्कोर, 3 माह की सैलरी स्लिप और ITR अनिवार्य।",
    compR1Sah: "100% वैकल्पिक अंडरराइटिंग: दैनिक UPI QR और कैशफ्लो विश्लेषण।",
    compR2Title: "किश्त भुगतान संरचना",
    compR2Trad: "मासिक भारी EMI जिससे बाउंस चार्ज और डिफ़ॉल्ट पेनल्टी लगती है।",
    compR2Sah: "दैनिक आय के अनुकूल ₹50 से ₹100 की आसान साशे माइक्रो-किश्त।",
    compR3Title: "पंजीकरण व पहुंच",
    compR3Trad: "अंग्रेजी में 14 पेजों के जटिल फॉर्म और बैंक शाखा में लंबी कतारें।",
    compR3Sah: "हिन्दी, गुजराती या अंग्रेजी में SAI के साथ बिना टाइपिंग का वॉयस संवाद।",
    compR4Title: "ब्याज लागत व सुरक्षा",
    compR4Trad: "स्थानीय साहूकारों द्वारा 36% से 120% तक का अत्यधिक ब्याज।",
    compR4Sah: "7% ब्याज सब्सिडी वाला आधिकारिक सरकारी ऋण और 8-स्तरीय सुरक्षा।",

    // Section: Ecosystem & Partners
    partnersEyebrow: "संस्थागत एवं नियामक संरचना",
    partnersTitle: "राष्ट्रीय डिजिटल पब्लिक इन्फ्रास्ट्रक्चर से एकीकृत",
    partnersSub: "भारतीय रिज़र्व बैंक (ReBIT), NPCI और केंद्रीय मंत्रालयों के मानकों पर आधारित।",

    whatWeDoEyebrow: "प्लेटफॉर्म की सम्पूर्ण कार्यप्रणाली",
    whatWeDoTitle: "हमारी वेबसाइट क्या काम करती है?",
    whatWeDoSub: "असंगठित कामगारों के मूल्यांकन, ऋण स्वीकृति, धोखाधड़ी रोकथाम और दैनिक किश्त भुगतान का सम्पूर्ण एआई समाधान।",

    f1Title: "1. SAI त्रिभाषी एआई वॉयस असिस्टेंट",
    f1Desc: "अनपढ़ कामगार हिन्दी, गुजराती या अंग्रेजी में केवल बोलकर बात कर सकते हैं। SAI 9-चरणीय वॉयस संवाद से काम, आय और खर्च समझकर तुरंत एआई पात्रता प्रमाण पत्र बनाता है।",
    f1Tag: "ऑडियो-फर्स्ट एआई",

    f2Title: "2. वैकल्पिक कैशफ्लो अंडरराइटिंग",
    f2Desc: "पारंपरिक CIBIL स्कोर के बजाय दैनिक UPI QR लेन-देन और PAN अकाउंट एग्रीगेटर से वास्तविक दैनिक नकद बफर (₹400-₹500/दिन) की गणना करता है।",
    f2Tag: "UPI + ReBIT AA",

    f3Title: "3. 8-स्तरीय एंटी-फ्रॉड फॉरेंसिक्स सूट",
    f3Desc: "दस्तावेजों में फोटोशॉप छेड़छाड़ (ELA), EXIF मेटाडेटा, आधार Verhoeff चेकसम और जियो-फेंसिंग से धोखाधड़ी रोककर बैंकों को 0% NPA सुरक्षा देता है।",
    f3Tag: "0% NPA सुरक्षा",

    f4Title: "4. बैंक कमांड सेंटर व क्रेडिट कंसोल",
    f4Desc: "सरकारी बैंकों (SBI, BOB) के लिए लाइव टर्मिनल, जहाँ क्रेडिट ऑफिसर कैशफ्लो देखकर एक क्लिक में आधिकारिक ऋण स्वीकृति पत्र (Sanction Letter PDF) जारी करते हैं।",
    f4Tag: "तुरंत ऋण स्वीकृति",

    f5Title: "5. साशे दैनिक माइक्रो-किश्त (EDI)",
    f5Desc: "मासिक भारी EMI के बदले दैनिक ₹50 से ₹100 की आसान बचत किश्त जो रात 11:30 बजे काम के बाद UPI Autopay से स्वतः जमा होती है।",
    f5Tag: "₹50/दिन माइक्रो-EDI",

    f6Title: "6. केंद्रीय सरकारी योजनाओं से सीधा जुड़ाव",
    f6Desc: "कामगारों को 7 प्रमुख केंद्रीय योजनाओं (पीएम स्वनिधि, पीएम-एसवाईएम, ई-श्रम, जन धन, पीएमएसबीवाई, पीएमजेजेबीवाई, मुद्रा) से 7% ब्याज सब्सिडी के साथ जोड़ता है।",
    f6Tag: "7 केंद्रीय योजनाएं",

    journeyEyebrow: "चरणबद्ध प्रक्रिया",
    journeyTitle: "सहायता कैसे काम करती है (Step-by-Step)",
    journeySub: "कामगार की पहली वॉयस बातचीत से लेकर बैंक खाते में ऋण राशि पहुंचने तक के 5 आसान चरण।",

    step1Num: "01",
    step1Title: "SAI से वॉयस संवाद",
    step1Desc: "कामगार अपनी मातृभाषा में SAI से बात करता है। SAI उसके काम, दैनिक आय और पारिवारिक खर्च की जानकारी लेता है।",

    step2Num: "02",
    step2Title: "वैकल्पिक एआई स्कोरिंग व e-KYC",
    step2Desc: "प्लेटफॉर्म UPI लेन-देन से एआई ट्रस्ट स्कोर बनाता है और Verhoeff एल्गोरिथम से आधार/PAN सत्यापित करता है।",

    step3Num: "03",
    step3Title: "8-स्तरीय फॉरेंसिक जांच",
    step3Desc: "अपलोड किए गए पहचान पत्र और वेंडर लाइसेंस की 2 सेकंड में फोटोशॉप व मेटाडेटा अखंडता जांची जाती है।",

    step4Num: "04",
    step4Title: "बैंक क्रेडिट ऑफिसर द्वारा स्वीकृति",
    step4Desc: "बैंक ऑफिसर डैशबोर्ड में पूरी रिपोर्ट देखकर डिजिटल Sanction Letter जारी करते हैं।",

    step5Num: "05",
    step5Title: "जन धन खाते में राशि व दैनिक किश्त",
    step5Desc: "ऋण राशि तुरंत सीधे जन धन खाते में आती है और दैनिक ₹50 की आसान किश्त शुरू हो जाती है।",

    personasEyebrow: "लक्षित असंगठित क्षेत्र",
    personasTitle: "सहायता किन कामगारों की मदद करती है?",
    personasSub: "भारत के 4 प्रमुख असंगठित कार्यक्षेत्रों के लिए विशेष रूप से निर्मित समाधान।",

    p1Role: "डिलीवरी व गिग राइडर्स",
    p1Desc: "Zomato, Swiggy, Blinkit राइडर्स जिन्हें दैनिक पेट्रोल, वाहन मरम्मत और EV फ्लीट के लिए तत्काल पूंजी चाहिए।",
    p1Scheme: "पीएम स्वनिधि + EV माइक्रो-क्रेडिट",

    p2Role: "स्ट्रीट वेंडर्स व ठेले वाले",
    p2Desc: "सब्जी/फल और चाय-नाश्ता विक्रेता जिन्हें साहूकारों के 100% ब्याज से बचकर दैनिक कच्चा माल खरीदना है।",
    p2Scheme: "पीएम स्वनिधि Tranche 1, 2 व 3",

    p3Role: "निर्माण श्रमिक व सुपरवाइजर",
    p3Desc: "साइट मजदूर और राजमिस्त्री जो BOCW कल्याणकारी अनुदान और दुर्घटना सुरक्षा चाहते हैं।",
    p3Scheme: "BOCW वेलफेयर + PMSBY",

    p4Role: "घरेलू सहायिका व कारीगर",
    p4Desc: "घरेलू कामगार और सिलाई-कढ़ाई कारीगर जिन्हें आपातकालीन ऋण और वृद्धावस्था पेंशन की आवश्यकता है।",
    p4Scheme: "ई-श्रम + पीएम-एसवाईएम पेंशन",

    schemesEyebrow: "केंद्रीय सरकारी योजनाएं",
    schemesTitle: "आधिकारिक कल्याणकारी एवं माइक्रो-क्रेडिट डायरेक्टरी",
    schemesSub: "रेहड़ी-पटरी विक्रेताओं, डिलीवरी पार्टनर्स और दैनिक श्रमिकों के लिए उपयोगी योजनाओं की सम्पूर्ण गाइड।",
    
    tabAll: "सभी योजनाएं (7)",
    tabCredit: "कार्यशील पूंजी व ऋण (2)",
    tabSocial: "सामाजिक सुरक्षा व पेंशन (3)",
    tabIdentity: "पहचान व बैंकिंग रेल (2)",

    requirements: "पात्रता एवं शर्तें",
    benefits: "मुख्य वित्तीय लाभ",
    documents: "तैयार रखने योग्य दस्तावेज",
    official: "आधिकारिक पोर्टल खोलें",
    checkEligibility: "SAI से पात्रता जांचें",

    disclaimer: "आधिकारिक नीति सूचना: सहायता एक वैकल्पिक क्रेडिट सुविधा व सामाजिक सुरक्षा मंच है। हम किसी भी सरकारी लाभ के लिए शुल्क नहीं लेते। अपना आधार/बैंक OTP किसी से साझा न करें।",

    schemes: [
      { name: "ई-श्रम", category: "identity", tag: "कामगार पहचान व UAN", req: "16-59 वर्ष का असंगठित कामगार; EPFO/ESIC या सरकारी कर्मचारी न हो। पंजीकरण पूरी तरह निशुल्क है।", benefits: "12-अंकीय UAN आधारित राष्ट्रीय पहचान पत्र और सामाजिक सुरक्षा व आपदा राहत योजनाओं तक सीधी पहुंच।", docs: "आधार नंबर, आधार से जुड़ा मोबाइल, IFSC कोड सहित बचत बैंक खाता।", link: OFFICIAL.eshram },
      { name: "पीएम-एसवाईएम", category: "social", tag: "वृद्धावस्था पेंशन (₹3,000/माह)", req: "18-40 वर्ष का असंगठित श्रमिक, मासिक आय ₹15,000 तक; EPFO/ESIC/NPS व आयकर से बाहर।", benefits: "60 वर्ष की आयु के बाद ₹3,000 प्रति माह की निश्चित पेंशन; सरकार 50% प्रीमियम खुद जमा करती है।", docs: "आधार, IFSC सहित बचत/जन-धन खाता, मोबाइल नंबर।", link: OFFICIAL.pmsym },
      { name: "पीएम स्वनिधि", category: "credit", tag: "स्ट्रीट वेंडर कार्यशील पूंजी", req: "शहरी स्ट्रीट वेंडर जिसके पास स्थानीय निकाय से Certificate of Vending या Letter of Recommendation हो।", benefits: "बिना गारंटी ₹15,000 (पहला चरण), ₹25,000 (दूसरा चरण) और ₹50,000 (तीसरा चरण) का ऋण 7% ब्याज सब्सिडी के साथ।", docs: "वेंडर प्रमाण/LOR, आधार, मोबाइल, बैंक खाता व UPI QR विवरण।", link: OFFICIAL.svanidhi },
      { name: "प्रधानमंत्री जन-धन योजना", category: "identity", tag: "बुनियादी बैंकिंग व ओवरड्राफ्ट", req: "कोई भी भारतीय नागरिक बैंक शाखा या बैंक मित्र के माध्यम से खाता खुलवा सकता है।", benefits: "शून्य बैलेंस खाता, RuPay कार्ड, ₹2 लाख का दुर्घटना बीमा, DBT सुविधा और ₹10,000 तक ओवरड्राफ्ट।", docs: "आधार, वोटर आईडी या आधिकारिक वैध दस्तावेज।", link: OFFICIAL.pmjdy },
      { name: "पीएमएसबीवाई", category: "social", tag: "दुर्घटना बीमा (₹2 लाख)", req: "18-70 वर्ष का बचत बैंक खाताधारक; ऑटो-डेबिट सहमति के साथ।", benefits: "दुर्घटना में मृत्यु/पूर्ण अपंगता पर ₹2 लाख का कवर (आंशिक पर ₹1 लाख), मात्र ₹20 प्रति वर्ष के प्रीमियम पर।", docs: "बैंक खाता, नामांकित व्यक्ति का नाम, ऑटो-डेबिट सहमति।", link: OFFICIAL.jansuraksha },
      { name: "पीएमजेजेबीवाई", category: "social", tag: "जीवन बीमा (₹2 लाख)", req: "18-50 वर्ष का बैंक खाताधारक, ऑटो-डेबिट सहमति के साथ।", benefits: "किसी भी कारण से मृत्यु पर ₹2 लाख का जीवन बीमा कवर, मात्र ₹436 प्रति वर्ष के प्रीमियम पर।", docs: "बैंक खाता विवरण, आधार KYC, नॉमिनी जानकारी।", link: OFFICIAL.jansuraksha },
      { name: "प्रधानमंत्री मुद्रा योजना", category: "credit", tag: "सूक्ष्म व्यवसाय ऋण (₹10 लाख तक)", req: "गैर-कॉर्पोरेट, गैर-कृषि लघु/सूक्ष्म व्यवसाय जो व्यापार, निर्माण या सेवा में लगे हों।", benefits: "बिना गारंटी ऋण: शिशु (₹50,000 तक), किशोर (₹50,000 से ₹5 लाख), और तरुण (₹5 लाख से ₹10 लाख)।", docs: "KYC, व्यवसाय प्रमाण, 6 माह का बैंक स्टेटमेंट, सामग्री/मशीनरी कोटेशन।", link: OFFICIAL.mudra },
    ]
  },
  gu: {
    heroBadge: "ભારત સરકાર સહ-ધિરાણ અને નાણાકીય સમાવેશ પ્લેટફોર્મ",
    heroTitle: "સહાયતા વિશે — ભારતનું વૈકલ્પિક ધિરાણ અને કલ્યાણકારી પોર્ટલ",
    heroSubtitle: "સહાયતા એ એક AI-સંચાલિત ફિનટેક પ્લેટફોર્મ છે જે ભારતના 45 કરોડ અસંગઠિત કામદારોને પરંપરાગત CIBIL સ્કોર કે પગાર સ્લિપ વગર સરકારી બેંકો, કેન્દ્રીય યોજનાઓ અને સાશે માઇક્રો-ધિરાણ સાથે જોડે છે.",
    btnAiTwin: "SAI વોઇસ આસિસ્ટન્ટ અજમાવો",
    btnBankConsole: "બેંક કમાન્ડ સેન્ટર ખોલો",
    trustEkyc: "e-KYC અને CKYC સક્ષમ",
    trustAa: "RBI Account Aggregator આધારિત",
    trustForensics: "8-સ્તરીય એન્ટી-ફ્રોડ ફોરેન્સિક્સ",
    trustSachet: "દૈનિક સાશે માઇક્રો-હપ્તો",
    
    kpiBeneficiaries: "50 લાખ+",
    kpiBeneficiariesLbl: "PM સ્વનિધિ લાભાર્થીઓ",
    kpiEshram: "28 કરોડ+",
    kpiEshramLbl: "ઈ-શ્રમ રજિસ્ટર્ડ કામદારો",
    kpiJanDhan: "52 કરોડ+",
    kpiJanDhanLbl: "જન ધન બેંક ખાતાઓ",
    kpiDisbursed: "₹2.45 કરોડ+",
    kpiDisbursedLbl: "લાઇવ વિતરણ કરાયેલ લોન",

    // Section: Problem vs Solution
    whyEyebrow: "રાષ્ટ્રીય નાણાકીય સમાવેશ મિશન",
    whyTitle: "ભારતને વૈકલ્પિક ધિરાણ ગેટવેની જરૂર શા માટે છે?",
    whySub: "પરંપરાગત બેંકિંગ માસિક પગારદાર કર્મચારીઓ માટે બનાવવામાં આવી હતી. સહાયતા ભારતના 45 કરોડ દૈનિક શ્રમિકો અને ગિગ કામદારો માટે નાણાકીય સેતુનું કાર્ય કરે છે.",
    compTraditional: "પરંપરાગત બેંકિંગ વ્યવસ્થા",
    compSahayata: "સહાયતા AI નાણાકીય વ્યવસ્થા",
    compR1Title: "ક્રેડિટ મૂલ્યાંકન અને સ્કોરિંગ",
    compR1Trad: "750+ CIBIL સ્કોર, 3 મહિનાની પગાર સ્લિપ અને ITR ફરજિયાત.",
    compR1Sah: "100% વૈકલ્પિક અંડરરાઇટિંગ: દૈનિક UPI QR અને કેશફ્લો વિશ્લેષણ.",
    compR2Title: "હપ્તા ચુકવણી માળખું",
    compR2Trad: "માસિક ભારે EMI જેના કારણે બાઉન્સ ચાર્જ અને ડિફોલ્ટ પેનલ્ટી લાગે છે.",
    compR2Sah: "દૈનિક આવક મુજબ ₹50 થી ₹100 નો સરળ સાશે માઇક્રો-હપ્તો.",
    compR3Title: "નોંધણી અને સુલભતા",
    compR3Trad: "અંગ્રેજીમાં 14 પાનાના જટિલ ફોર્મ અને બેંક શાખામાં લાંબી કતારો.",
    compR3Sah: "હિન્દી, ગુજરાતી કે અંગ્રેજીમાં SAI સાથે ટાઇપિંગ વગરનો વોઇસ સંવાદ.",
    compR4Title: "વ્યાજ ખર્ચ અને સુરક્ષા",
    compR4Trad: "સ્થાનિક શાહુકારો દ્વારા 36% થી 120% સુધીનું અતિશય વ્યાજ.",
    compR4Sah: "7% વ્યાજ સબસિડી સાથે સત્તાવાર સરકારી લોન અને 8-સ્તરીય સુરક્ષા.",

    // Section: Ecosystem & Partners
    partnersEyebrow: "સંસ્થાકીય અને નિયમનકારી માળખું",
    partnersTitle: "રાષ્ટ્રીય ડિજિટલ પબ્લિક ઇન્ફ્રાસ્ટ્રક્ચર સાથે સંકલિત",
    partnersSub: "ભારતીય રિઝર્વ બેંક (ReBIT), NPCI અને કેન્દ્રીય મંત્રાલયોના ધોરણો પર આધારિત.",

    whatWeDoEyebrow: "પ્લેટફોર્મની સંપૂર્ણ કાર્યપદ્ધતિ",
    whatWeDoTitle: "અમારી વેબસાઇટ શું કામ કરે છે?",
    whatWeDoSub: "અસંગઠિત કામદારો માટે મૂલ્યાંકન, લોન મંજૂરી, છેતરપિંડી નિવારણ અને દૈનિક હપ્તા ચુકવણીનું સંપૂર્ણ AI સોલ્યુશન.",

    f1Title: "1. SAI ત્રિભાષી AI વોઇસ આસિસ્ટન્ટ",
    f1Desc: "અભણ કામદારો હિન્દી, ગુજરાતી કે અંગ્રેજીમાં માત્ર બોલીને વાત કરી શકે છે. SAI 9-તબક્કાના સંવાદથી કામ, આવક અને ખર્ચ સમજીને તુરંત AI પાત્રતા પ્રમાણપત્ર બનાવે છે.",
    f1Tag: "ઓડિયો-પ્રથમ AI",

    f2Title: "2. વૈકલ્પિક કેશફ્લો અંડરરાઇટિંગ",
    f2Desc: "પરંપરાગત CIBIL સ્કોરને બદલે દૈનિક UPI QR વ્યવહારો અને PAN એકાઉન્ટ એગ્રીગેટરથી વાસ્તવિક દૈનિક કેશ બફર (₹400-₹500/દિવસ) ની ગણતરી કરે છે.",
    f2Tag: "UPI + ReBIT AA",

    f3Title: "3. 8-સ્તરીય એન્ટી-ફ્રોડ ફોરેન્સિક્સ સુટ",
    f3Desc: "દસ્તાવેજોમાં ફોટોશોપ છેડછાડ (ELA), EXIF મેટાડેટા, આધાર Verhoeff ચેકસમ અને જીઓ-ફેન્સિંગ દ્વારા બેંકોને 0% NPA સુરક્ષા આપે છે.",
    f3Tag: "0% NPA સુરક્ષા",

    f4Title: "4. બેંક કમાન્ડ સેન્ટર અને ક્રેડિટ કન્સોલ",
    f4Desc: "સરકારી બેંકો (SBI, BOB) માટે લાઇવ ટર્મિનલ, જ્યાં ક્રેડિટ ઓફિસર એક ક્લિકમાં સત્તાવાર મંજૂરી પત્ર (Sanction Letter PDF) જારી કરે છે.",
    f4Tag: "તુરંત લોન મંજૂરી",

    f5Title: "5. સાશે દૈનિક માઇક્રો-હપ્તો (EDI)",
    f5Desc: "માસિક ભારે EMI ને બદલે દૈનિક ₹50 થી ₹100 નો સરળ બચત હપ્તો જે રાત્રે 11:30 વાગ્યે કામ પછી UPI Autopay થી આપોઆપ જમા થાય છે.",
    f5Tag: "₹50/દિવસ માઇક્રો-EDI",

    f6Title: "6. કેન્દ્રીય યોજનાઓ સાથે સીધું જોડાણ",
    f6Desc: "કામદારોને 7 મુખ્ય કેન્દ્રીય યોજનાઓ (PM સ્વનિધિ, PM-SYM, ઈ-શ્રમ, જન ધન, PMSBY, PMJJBY, મુદ્રા) સાથે 7% વ્યાજ સબસિડી સાથે જોડે છે.",
    f6Tag: "7 કેન્દ્રીય યોજનાઓ",

    journeyEyebrow: "તબક્કાવાર પ્રક્રિયા",
    journeyTitle: "સહાયતા કેવી રીતે કાર્ય કરે છે (Step-by-Step)",
    journeySub: "કામદારની પ્રથમ વોઇસ વાતચીતથી લઈને બેંક ખાતામાં લોનની રકમ પહોંચવા સુધીના 5 સરળ પગલાં.",

    step1Num: "01",
    step1Title: "SAI સાથે વોઇસ સંવાદ",
    step1Desc: "કામદાર પોતાની માતૃભાષામાં SAI સાથે વાત કરે છે. SAI તેના કામ, દૈનિક આવક અને પારિવારિક ખર્ચની માહિતી મેળવે છે.",

    step2Num: "02",
    step2Title: "વૈકલ્પિક AI સ્કોરિંગ અને e-KYC",
    step2Desc: "પ્લેટફોર્મ UPI વ્યવહારોથી AI ટ્રસ્ટ સ્કોર બનાવે છે અને Verhoeff અલ્ગોરિધમથી આધાર/PAN ચકાસે છે.",

    step3Num: "03",
    step3Title: "8-સ્તરીય ફોરેન્સિક ચકાસણી",
    step3Desc: "અપલોડ કરેલા ઓળખપત્ર અને વેન્ડર લાઇસન્સની 2 સેકન્ડમાં ફોટોશોપ અને મેટાડેટા અખંડિતતા ચકાસાય છે.",

    step4Num: "04",
    step4Title: "બેંક ક્રેડિટ ઓફિસર દ્વારા મંજૂરી",
    step4Desc: "બેંક ઓફિસર ડેશબોર્ડમાં સંપૂર્ણ રિપોર્ટ જોઈને ડિજિટલ Sanction Letter જારી કરે છે.",

    step5Num: "05",
    step5Title: "જન ધન ખાતામાં રકમ અને દૈનિક હપ્તો",
    step5Desc: "લોનની રકમ તુરંત સીધી જન ધન ખાતામાં જમા થાય છે અને દૈનિક ₹50 નો સરળ હપ્તો શરૂ થાય છે.",

    personasEyebrow: "લક્ષિત અસંગઠિત ક્ષેત્રો",
    personasTitle: "સહાયતા કયા કામદારોને મદદ કરે છે?",
    personasSub: "ભારતના 4 મુખ્ય અસંગઠિત કાર્યક્ષેત્રો માટે ખાસ બનાવવામાં આવેલ સમાધાન.",

    p1Role: "ડિલિવરી અને ગિગ રાઇડર્સ",
    p1Desc: "Zomato, Swiggy, Blinkit રાઇડર્સ જેમને દૈનિક પેટ્રોલ, વાહન સમારકામ અને EV ફ્લીટ માટે તાત્કાલિક મૂડીની જરૂર છે.",
    p1Scheme: "PM સ્વનિધિ + EV માઇક્રો-ધિરાણ",

    p2Role: "સ્ટ્રીટ વેન્ડર્સ અને લારી-ગલ્લાવાળા",
    p2Desc: "શાકભાજી/ફળ અને નાસ્તાના વેપારીઓ જેમને શાહુકારોના 100% વ્યાજથી બચીને દૈનિક માલ ખરીદવો છે.",
    p2Scheme: "PM સ્વનિધિ Tranche 1, 2 અને 3",

    p3Role: "બાંધકામ શ્રમિકો અને સુપરવાઇઝર",
    p3Desc: "સાઇટ મજૂરો અને કડિયા જેઓ BOCW કલ્યાણકારી ગ્રાન્ટ અને અકસ્માત સુરક્ષા ઇચ્છે છે.",
    p3Scheme: "BOCW વેલ્ફેર + PMSBY",

    p4Role: "ઘરેલું કામદાર અને કારીગરો",
    p4Desc: "ઘરેલું મદદગારો અને સિલાઈ-હસ્તકલાના કારીગરો જેમને કટોકટી લોન અને વૃદ્ધાવસ્થા પેન્શનની જરૂર છે.",
    p4Scheme: "ઈ-શ્રમ + PM-SYM પેન્શન",

    schemesEyebrow: "કેન્દ્રીય સરકારી યોજનાઓ",
    schemesTitle: "સત્તાવાર કલ્યાણકારી અને માઇક્રો-ક્રેડિટ ડિરેક્ટરી",
    schemesSub: "લારી-ગલ્લાવાળા, ડિલિવરી પાર્ટનર્સ અને દૈનિક શ્રમિકો માટે ઉપયોગી યોજનાઓની સંપૂર્ણ માર્ગદર્શિકા.",
    
    tabAll: "તમામ યોજનાઓ (7)",
    tabCredit: "વર્કિંગ કેપિટલ અને લોન (2)",
    tabSocial: "સામાજિક સુરક્ષા અને પેન્શન (3)",
    tabIdentity: "ઓળખ અને બેંકિંગ રેલ (2)",

    requirements: "પાત્રતા અને શરતો",
    benefits: "મુખ્ય નાણાકીય લાભો",
    documents: "તૈયાર રાખવાના દસ્તાવેજો",
    official: "સત્તાવાર પોર્ટલ ખોલો",
    checkEligibility: "SAI સાથે પાત્રતા તપાસો",

    disclaimer: "સત્તાવાર નીતિ સૂચના: સહાયતા વૈકલ્પિક ધિરાણ સુવિધા અને સામાજિક સુરક્ષા પોર્ટલ છે. અમે કોઈ સરકારી લાભ ફી લેતા નથી. તમારો આધાર/બેંક OTP ક્યારેય કોઈ સાથે શેર કરશો નહીં.",

    schemes: [
      { name: "ઈ-શ્રમ", category: "identity", tag: "કામદાર ઓળખ અને UAN", req: "16-59 વર્ષનો અસંગઠિત કામદાર; EPFO/ESIC અથવા સરકારી કર્મચારી ન હોવો જોઈએ. નોંધણી સંપૂર્ણ મફત છે.", benefits: "12-અંકના UAN આધારિત રાષ્ટ્રીય ઓળખપત્ર અને સામાજિક સુરક્ષા યોજનાઓ સુધી સીધી પહોંચ.", docs: "આધાર નંબર, આધાર સાથે લિંક કરેલ મોબાઇલ, IFSC કોડ સાથે બચત બેંક ખાતું.", link: OFFICIAL.eshram },
      { name: "PM-SYM", category: "social", tag: "વૃદ્ધાવસ્થા પેન્શન (₹3,000/માસ)", req: "18-40 વર્ષનો અસંગઠિત શ્રમિક, માસિક આવક ₹15,000 સુધી; EPFO/ESIC/NPS અને આવકવેરાથી બહાર.", benefits: "60 વર્ષની ઉંમર પછી ₹3,000 પ્રતિ માસનું નિશ્ચિત પેન્શન; સરકાર 50% પ્રીમિયમ પોતે જમા કરે છે.", docs: "આધાર, IFSC સાથે બચત/જન-ધન ખાતું, મોબાઇલ નંબર.", link: OFFICIAL.pmsym },
      { name: "PM સ્વનિધિ", category: "credit", tag: "સ્ટ્રીટ વેન્ડર વર્કિંગ કેપિટલ", req: "શહેરી સ્ટ્રીટ વેન્ડર જેની પાસે સ્થાનિક સંસ્થા તરફથી Certificate of Vending અથવા Letter of Recommendation હોય.", benefits: "કોલેટરલ વગર ₹15,000 (પ્રથમ તબક્કો), ₹25,000 (બીજો તબક્કો) અને ₹50,000 (ત્રીજો તબક્કો) ની લોન 7% વ્યાજ સબસિડી સાથે.", docs: "વેન્ડર પ્રમાણપત્ર/LOR, આધાર, મોબાઇલ, બેંક ખાતું અને UPI QR વિગતો.", link: OFFICIAL.svanidhi },
      { name: "પ્રધાનમંત્રી જન ધન યોજના", category: "identity", tag: "મૂળભૂત બેંકિંગ અને ઓવરડ્રાફ્ટ", req: "કોઈપણ ભારતીય નાગરિક બેંક શાખા અથવા બેંક મિત્ર મારફતે ખાતું ખોલી શકે છે.", benefits: "શૂન્ય બેલેન્સ ખાતું, RuPay કાર્ડ, ₹2 લાખનો અકસ્માત વીમો, DBT સુવિધા અને ₹10,000 સુધી ઓવરડ્રાફ્ટ.", docs: "આધાર, મતદાર આઈડી અથવા સત્તાવાર માન્ય દસ્તાવેજ.", link: OFFICIAL.pmjdy },
      { name: "PMSBY", category: "social", tag: "અકસ્માત વીમો (₹2 લાખ)", req: "18-70 વર્ષનો બચત બેંક ખાતાધારક; ઓટો-ડેબિટ સંમતિ સાથે.", benefits: "અકસ્માતમાં મૃત્યુ/સંપૂર્ણ અપંગતા પર ₹2 લાખનું કવર (આંશિક પર ₹1 લાખ), માત્ર ₹20 પ્રતિ વર્ષના પ્રીમિયમ પર.", docs: "બેંક ખાતું, નોમિનીનું નામ, ઓટો-ડેબિટ સંમતિ.", link: OFFICIAL.jansuraksha },
      { name: "PMJJBY", category: "social", tag: "જીવન વીમો (₹2 લાખ)", req: "18-50 વર્ષનો બેંક ખાતાધારક, ઓટો-ડેબિટ સંમતિ સાથે.", benefits: "કોઈપણ કારણસર મૃત્યુ પર ₹2 લાખનું જીવન વીમા કવર, માત્ર ₹436 પ્રતિ વર્ષના પ્રીમિયમ પર.", docs: "બેંક ખાતાની વિગતો, આધાર KYC, નોમિની વિગતો.", link: OFFICIAL.jansuraksha },
      { name: "પ્રધાનમંત્રી મુદ્રા યોજના", category: "credit", tag: "સૂક્ષ્મ વ્યવસાય લોન (₹10 લાખ સુધી)", req: "બિન-કોર્પોરેટ, બિન-ખેતી લઘુ/સૂક્ષ્મ વ્યવસાય જે વેપાર, ઉત્પાદન અથવા સેવામાં રોકાયેલા હોય.", benefits: "કોલેટરલ વગર લોન: શિશુ (₹50,000 સુધી), કિશોર (₹50,000 થી ₹5 લાખ), અને તરુણ (₹5 લાખ થી ₹10 લાખ).", docs: "KYC, વ્યવસાય પુરાવો, 6 મહિનાનું બેંક સ્ટેટમેન્ટ, મશીનરી/સ્ટોક ક્વોટેશન.", link: OFFICIAL.mudra },
    ]
  }
};

export default function GovernmentSchemesGuide({ lang = "en", navigateTo }) {
  const [activeCategory, setActiveCategory] = useState("all");
  const copy = COPY[lang] || COPY.en;

  const filteredSchemes = activeCategory === "all"
    ? copy.schemes
    : copy.schemes.filter(s => s.category === activeCategory);

  const handleStartAiCheck = () => {
    if (navigateTo) {
      navigateTo("/financial-twin");
    } else {
      window.location.hash = "#/financial-twin";
    }
  };

  const handleOpenBankDashboard = () => {
    if (navigateTo) {
      navigateTo("/admin");
    } else {
      window.location.hash = "#/admin";
    }
  };

  return (
    <main className="about-page-enhanced" id="about-us-hub">
      <div className="about-main-content">
        
        {/* 1. SECTION: WHY INDIA NEEDS SAHAYATA (PROBLEM VS SOLUTION) */}
        <section style={{ marginBottom: "56px" }}>
          <div className="about-section-header">
            <div className="about-section-eyebrow">
              <Scale size={14} />
              <span>{copy.whyEyebrow}</span>
            </div>
            <h2 className="about-section-title">{copy.whyTitle}</h2>
            <p className="about-section-subtitle">{copy.whySub}</p>
          </div>

          <div className="about-comp-grid">
            <div className="about-comp-card traditional">
              <div className="about-comp-header">
                <div className="about-comp-icon-wrap red"><XCircle size={22} /></div>
                <div>
                  <h3 className="about-comp-title">{copy.compTraditional}</h3>
                  <span className="about-comp-subtitle">Rigid, High-Exclusion Paradigm</span>
                </div>
              </div>

              <div className="about-comp-rows">
                <div className="about-comp-row">
                  <div className="about-comp-row-title">{copy.compR1Title}</div>
                  <p className="about-comp-row-desc">{copy.compR1Trad}</p>
                </div>
                <div className="about-comp-row">
                  <div className="about-comp-row-title">{copy.compR2Title}</div>
                  <p className="about-comp-row-desc">{copy.compR2Trad}</p>
                </div>
                <div className="about-comp-row">
                  <div className="about-comp-row-title">{copy.compR3Title}</div>
                  <p className="about-comp-row-desc">{copy.compR3Trad}</p>
                </div>
                <div className="about-comp-row">
                  <div className="about-comp-row-title">{copy.compR4Title}</div>
                  <p className="about-comp-row-desc">{copy.compR4Trad}</p>
                </div>
              </div>
            </div>

            <div className="about-comp-card sahayata">
              <div className="about-comp-header">
                <div className="about-comp-icon-wrap blue"><CheckCircle2 size={22} /></div>
                <div>
                  <h3 className="about-comp-title blue">{copy.compSahayata}</h3>
                  <span className="about-comp-subtitle blue">AI-Driven, Daily Cashflow Inclusion</span>
                </div>
              </div>

              <div className="about-comp-rows">
                <div className="about-comp-row">
                  <div className="about-comp-row-title blue">{copy.compR1Title}</div>
                  <p className="about-comp-row-desc">{copy.compR1Sah}</p>
                </div>
                <div className="about-comp-row">
                  <div className="about-comp-row-title blue">{copy.compR2Title}</div>
                  <p className="about-comp-row-desc">{copy.compR2Sah}</p>
                </div>
                <div className="about-comp-row">
                  <div className="about-comp-row-title blue">{copy.compR3Title}</div>
                  <p className="about-comp-row-desc">{copy.compR3Sah}</p>
                </div>
                <div className="about-comp-row">
                  <div className="about-comp-row-title blue">{copy.compR4Title}</div>
                  <p className="about-comp-row-desc">{copy.compR4Sah}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. SECTION: WHAT DOES OUR PLATFORM DO? (6 CORE CAPABILITIES) */}
        <section style={{ marginBottom: "56px" }}>
          <div className="about-section-header">
            <div className="about-section-eyebrow">
              <Sparkles size={14} />
              <span>{copy.whatWeDoEyebrow}</span>
            </div>
            <h2 className="about-section-title">{copy.whatWeDoTitle}</h2>
            <p className="about-section-subtitle">{copy.whatWeDoSub}</p>
          </div>

          <div className="about-features-grid">
            <div className="about-feature-box">
              <div className="about-feature-top">
                <div className="about-feature-icon-wrap"><Mic size={22} /></div>
                <span className="about-feature-tag">{copy.f1Tag}</span>
              </div>
              <h3 className="about-feature-title">{copy.f1Title}</h3>
              <p className="about-feature-desc">{copy.f1Desc}</p>
            </div>

            <div className="about-feature-box">
              <div className="about-feature-top">
                <div className="about-feature-icon-wrap"><TrendingUp size={22} /></div>
                <span className="about-feature-tag">{copy.f2Tag}</span>
              </div>
              <h3 className="about-feature-title">{copy.f2Title}</h3>
              <p className="about-feature-desc">{copy.f2Desc}</p>
            </div>

            <div className="about-feature-box">
              <div className="about-feature-top">
                <div className="about-feature-icon-wrap"><ShieldAlert size={22} /></div>
                <span className="about-feature-tag">{copy.f3Tag}</span>
              </div>
              <h3 className="about-feature-title">{copy.f3Title}</h3>
              <p className="about-feature-desc">{copy.f3Desc}</p>
            </div>

            <div className="about-feature-box">
              <div className="about-feature-top">
                <div className="about-feature-icon-wrap"><Landmark size={22} /></div>
                <span className="about-feature-tag">{copy.f4Tag}</span>
              </div>
              <h3 className="about-feature-title">{copy.f4Title}</h3>
              <p className="about-feature-desc">{copy.f4Desc}</p>
            </div>

            <div className="about-feature-box">
              <div className="about-feature-top">
                <div className="about-feature-icon-wrap"><Wallet size={22} /></div>
                <span className="about-feature-tag">{copy.f5Tag}</span>
              </div>
              <h3 className="about-feature-title">{copy.f5Title}</h3>
              <p className="about-feature-desc">{copy.f5Desc}</p>
            </div>

            <div className="about-feature-box">
              <div className="about-feature-top">
                <div className="about-feature-icon-wrap"><Award size={22} /></div>
                <span className="about-feature-tag">{copy.f6Tag}</span>
              </div>
              <h3 className="about-feature-title">{copy.f6Title}</h3>
              <p className="about-feature-desc">{copy.f6Desc}</p>
            </div>
          </div>
        </section>

        {/* 4. SECTION: STEP-BY-STEP END-TO-END WORKFLOW */}
        <section style={{ marginBottom: "56px" }}>
          <div className="about-section-header">
            <div className="about-section-eyebrow">
              <Layers size={14} />
              <span>{copy.journeyEyebrow}</span>
            </div>
            <h2 className="about-section-title">{copy.journeyTitle}</h2>
            <p className="about-section-subtitle">{copy.journeySub}</p>
          </div>

          <div className="about-workflow-steps">
            <div className="about-workflow-card">
              <div className="about-workflow-step-num">{copy.step1Num}</div>
              <h3 className="about-workflow-title">{copy.step1Title}</h3>
              <p className="about-workflow-text">{copy.step1Desc}</p>
            </div>

            <div className="about-workflow-card">
              <div className="about-workflow-step-num">{copy.step2Num}</div>
              <h3 className="about-workflow-title">{copy.step2Title}</h3>
              <p className="about-workflow-text">{copy.step2Desc}</p>
            </div>

            <div className="about-workflow-card">
              <div className="about-workflow-step-num">{copy.step3Num}</div>
              <h3 className="about-workflow-title">{copy.step3Title}</h3>
              <p className="about-workflow-text">{copy.step3Desc}</p>
            </div>

            <div className="about-workflow-card">
              <div className="about-workflow-step-num">{copy.step4Num}</div>
              <h3 className="about-workflow-title">{copy.step4Title}</h3>
              <p className="about-workflow-text">{copy.step4Desc}</p>
            </div>

            <div className="about-workflow-card">
              <div className="about-workflow-step-num">{copy.step5Num}</div>
              <h3 className="about-workflow-title">{copy.step5Title}</h3>
              <p className="about-workflow-text">{copy.step5Desc}</p>
            </div>
          </div>
        </section>

        {/* 5. SECTION: TARGET INFORMAL SECTOR PERSONAS */}
        <section style={{ marginBottom: "56px" }}>
          <div className="about-section-header">
            <div className="about-section-eyebrow">
              <Users size={14} />
              <span>{copy.personasEyebrow}</span>
            </div>
            <h2 className="about-section-title">{copy.personasTitle}</h2>
            <p className="about-section-subtitle">{copy.personasSub}</p>
          </div>

          <div className="about-personas-grid">
            <div className="about-persona-card">
              <div className="about-persona-header">
                <Truck size={24} color="#0284C7" />
                <div>
                  <h3 className="about-persona-role">{copy.p1Role}</h3>
                  <span className="about-persona-sub">E-Commerce & Food Delivery</span>
                </div>
              </div>
              <p className="about-persona-desc">{copy.p1Desc}</p>
              <div className="about-persona-footer">
                <span className="about-persona-badge">{copy.p1Scheme}</span>
              </div>
            </div>

            <div className="about-persona-card">
              <div className="about-persona-header">
                <CookingPot size={24} color="#059669" />
                <div>
                  <h3 className="about-persona-role">{copy.p2Role}</h3>
                  <span className="about-persona-sub">Urban Micro-Retail & Food Stalls</span>
                </div>
              </div>
              <p className="about-persona-desc">{copy.p2Desc}</p>
              <div className="about-persona-footer">
                <span className="about-persona-badge green">{copy.p2Scheme}</span>
              </div>
            </div>

            <div className="about-persona-card">
              <div className="about-persona-header">
                <Hammer size={24} color="#D97706" />
                <div>
                  <h3 className="about-persona-role">{copy.p3Role}</h3>
                  <span className="about-persona-sub">Civil Works & Skilled Trades</span>
                </div>
              </div>
              <p className="about-persona-desc">{copy.p3Desc}</p>
              <div className="about-persona-footer">
                <span className="about-persona-badge amber">{copy.p3Scheme}</span>
              </div>
            </div>

            <div className="about-persona-card">
              <div className="about-persona-header">
                <Store size={24} color="#7C3AED" />
                <div>
                  <h3 className="about-persona-role">{copy.p4Role}</h3>
                  <span className="about-persona-sub">Home Support & Craft Producers</span>
                </div>
              </div>
              <p className="about-persona-desc">{copy.p4Desc}</p>
              <div className="about-persona-footer">
                <span className="about-persona-badge purple">{copy.p4Scheme}</span>
              </div>
            </div>
          </div>
        </section>

        {/* 6. CENTRAL GOVERNMENT SCHEMES DIRECTORY (WITH TABS) */}
        <section style={{ marginBottom: "52px" }}>
          <div className="about-section-header">
            <div className="about-section-eyebrow">
              <Landmark size={14} />
              <span>{copy.schemesEyebrow}</span>
            </div>
            <h2 className="about-section-title">{copy.schemesTitle}</h2>
            <p className="about-section-subtitle">{copy.schemesSub}</p>
          </div>

          {/* Scheme Category Filter Tabs */}
          <div className="about-schemes-filter-bar">
            <button
              className={`about-scheme-tab ${activeCategory === "all" ? "active" : ""}`}
              onClick={() => setActiveCategory("all")}
            >
              <Layers size={15} />
              <span>{copy.tabAll}</span>
            </button>
            <button
              className={`about-scheme-tab ${activeCategory === "credit" ? "active" : ""}`}
              onClick={() => setActiveCategory("credit")}
            >
              <Wallet size={15} />
              <span>{copy.tabCredit}</span>
            </button>
            <button
              className={`about-scheme-tab ${activeCategory === "social" ? "active" : ""}`}
              onClick={() => setActiveCategory("social")}
            >
              <ShieldCheck size={15} />
              <span>{copy.tabSocial}</span>
            </button>
            <button
              className={`about-scheme-tab ${activeCategory === "identity" ? "active" : ""}`}
              onClick={() => setActiveCategory("identity")}
            >
              <BadgeCheck size={15} />
              <span>{copy.tabIdentity}</span>
            </button>
          </div>

          {/* Scheme Cards Grid */}
          <div className="about-schemes-grid">
            {filteredSchemes.map((s, idx) => {
              const IconComp = SCHEME_ICONS[s.name] || Landmark;
              return (
                <div key={idx} className="about-scheme-card">
                  <div className="about-scheme-header">
                    <div className="about-scheme-icon-box">
                      <IconComp size={22} />
                    </div>
                    <div>
                      <h3 className="about-scheme-name">{s.name}</h3>
                      <span className="about-scheme-tag">{s.tag}</span>
                    </div>
                  </div>

                  <div className="about-scheme-body">
                    <div className="about-scheme-block">
                      <span className="about-block-label">{copy.requirements}</span>
                      <p className="about-block-text">{s.req}</p>
                    </div>

                    <div className="about-scheme-block highlight">
                      <span className="about-block-label green">{copy.benefits}</span>
                      <p className="about-block-text">{s.benefits}</p>
                    </div>

                    <div className="about-scheme-block">
                      <span className="about-block-label">{copy.documents}</span>
                      <p className="about-block-text">{s.docs}</p>
                    </div>
                  </div>

                  <div className="about-scheme-footer">
                    <a
                      href={s.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="about-scheme-link"
                    >
                      <span>{copy.official}</span>
                      <ExternalLink size={14} />
                    </a>

                    <button
                      className="about-scheme-btn"
                      onClick={handleStartAiCheck}
                    >
                      <Bot size={14} />
                      <span>{copy.checkEligibility}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 8. SECTION: INTEGRATED NATIONAL PUBLIC RAILS & BANKING ECOSYSTEM */}
        <section style={{ marginBottom: "52px" }}>
          <div className="about-section-header">
            <div className="about-section-eyebrow">
              <Building2 size={14} />
              <span>{copy.partnersEyebrow}</span>
            </div>
            <h2 className="about-section-title">{copy.partnersTitle}</h2>
            <p className="about-section-subtitle">{copy.partnersSub}</p>
          </div>

          <div className="about-ecosystem-grid">
            <div className="about-ecosystem-card">
              <div className="about-ecosystem-icon-wrap"><Landmark size={22} /></div>
              <h4 className="about-ecosystem-title">RBI Account Aggregator (ReBIT Schema)</h4>
              <p className="about-ecosystem-desc">Standardized consent-driven financial data sharing architecture without physical branch document verification.</p>
              <span className="about-ecosystem-badge">ReBIT Certified</span>
            </div>

            <div className="about-ecosystem-card">
              <div className="about-ecosystem-icon-wrap"><Wallet size={22} /></div>
              <h4 className="about-ecosystem-title">NPCI UPI AutoPay & e-NACH</h4>
              <p className="about-ecosystem-desc">Automated sachet micro-installment rails executing daily ₹50/day micro-debits at 11:30 PM post-work hours.</p>
              <span className="about-ecosystem-badge">NPCI Real-Time</span>
            </div>

            <div className="about-ecosystem-card">
              <div className="about-ecosystem-icon-wrap"><Users size={22} /></div>
              <h4 className="about-ecosystem-title">e-SHRAM National Registry</h4>
              <p className="about-ecosystem-desc">12-digit Universal Account Number (UAN) cross-verification linking 28 Crore unorganised workers with direct DBT.</p>
              <span className="about-ecosystem-badge">Ministry of Labour</span>
            </div>

            <div className="about-ecosystem-card">
              <div className="about-ecosystem-icon-wrap"><Building2 size={22} /></div>
              <h4 className="about-ecosystem-title">Public Sector Co-Lending Banks</h4>
              <p className="about-ecosystem-desc">Partnered with State Bank of India, Bank of Baroda, and PNB for direct co-lending micro-credit disbursement.</p>
              <span className="about-ecosystem-badge">PSU Co-Lending</span>
            </div>

            <div className="about-ecosystem-card">
              <div className="about-ecosystem-icon-wrap"><Fingerprint size={22} /></div>
              <h4 className="about-ecosystem-title">DigiLocker & CKYC Registry</h4>
              <p className="about-ecosystem-desc">Instant paperless Aadhaar, PAN, and Driver License retrieval with Verhoeff D5 cryptographic checksum security.</p>
              <span className="about-ecosystem-badge">DigiLocker API</span>
            </div>

            <div className="about-ecosystem-card">
              <div className="about-ecosystem-icon-wrap"><Store size={22} /></div>
              <h4 className="about-ecosystem-title">PM SVANidhi Portal Integration</h4>
              <p className="about-ecosystem-desc">Urban Local Body Letter of Recommendation (LoR) and Certificate of Vending (CoV) automated validation.</p>
              <span className="about-ecosystem-badge">MoHUA Unified</span>
            </div>
          </div>
        </section>

        {/* 9. REGULATORY COMPLIANCE DISCLAIMER */}
        <section className="about-disclaimer-box">
          <ShieldCheck size={24} className="about-disclaimer-icon" />
          <p className="about-disclaimer-text">{copy.disclaimer}</p>
        </section>

      </div>
    </main>
  );
}
