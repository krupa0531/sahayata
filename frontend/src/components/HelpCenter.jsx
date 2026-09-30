import React, { useState, useMemo } from "react";
import {
  Search,
  BookOpen,
  HelpCircle,
  ShieldCheck,
  Zap,
  PhoneCall,
  Clock,
  CheckCircle2,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  TrendingUp,
  CreditCard,
  Building2,
  UserCheck,
  AlertCircle,
  FileCheck2,
  Smartphone,
  Landmark,
  Scale,
  Sparkles,
  ArrowRight,
  Bot,
  Calculator,
  QrCode,
  ShieldAlert,
  WalletCards,
  FileText,
  MapPin,
  Layers,
  Check,
  Sliders,
  Filter,
  Grid,
  Headphones,
  Compass,
  Info,
  X
} from "lucide-react";
import "./HelpCenter.css";

// ============================================================================
// 1. KNOWLEDGE BASE FAQ DATABASE (TRILINGUAL: EN / HI / GU)
// ============================================================================
const FAQS = [
  // A. LOAN & SACHET REPAYMENT (EDI)
  {
    id: "sachet-loan-tiers",
    c: "loan",
    role: "worker",
    tags: ["loan", "sachet", "limit", "tier", "amount", "svanidhi", "edi"],
    en: [
      "What are the loan limits under Sahayata Sachet Working Capital?",
      "Sahayata offers collateral-free sachet loans across 3 progressive tiers: Tier 1: ₹10,000 working capital (repaid at ₹50/day over 6-12 months); Tier 2: ₹20,000 on successful repayment (₹100/day); Tier 3: ₹50,000 for verified businesses with regular UPI QR transactions (₹150/day). All loans are 100% compliant with PM SVANidhi guidelines and eligible for a 7% annual interest subsidy."
    ],
    hi: [
      "Sahayata सचेत वर्किंग कैपिटल के तहत कितनी लोन राशि मिलती है?",
      "Sahayata 3 चरणों में बिना गारंटी का सचेत लोन प्रदान करता है: टियर 1: ₹10,000 प्रारंभिक पूंजी (₹50/दिन की आसान किस्त); टियर 2: समय पर भुगतान करने पर ₹20,000 (₹100/दिन); टियर 3: ₹50,000 तक की पूंजी (₹150/दिन)। सभी लोन PM SVANidhi योजना के तहत 7% वार्षिक ब्याज सब्सिडी के लिए पात्र हैं।"
    ],
    gu: [
      "Sahayata સચેત લોન હેઠળ કેટલી રકમ મળે છે?",
      "Sahayata 3 તબક્કામાં ગેરંટી વગર સચેત લોન આપે છે: ટિયર 1: ₹10,000 (દૈનિક ₹50 હપ્તો); ટિયર 2: સમયસર ચુકવણી પર ₹20,000 (દૈનિક ₹100); ટિયર 3: ₹50,000 સુધીની લોન (દૈનિક ₹150). તમામ લોન PM SVANidhi મુજબ 7% વાર્ષિક વ્યાજ સબસિડી માટે પાત્ર છે."
    ]
  },
  {
    id: "how-sachet-edi-works",
    c: "loan",
    role: "worker",
    tags: ["edi", "daily", "repayment", "qr", "deduction", "upi", "nach"],
    en: [
      "How does the daily Sachet EDI (Equated Daily Installment) work?",
      "Instead of a heavy monthly EMI, Sahayata automatically collects small daily sachet repayments (₹50 to ₹150/day) directly from your daily UPI QR customer inflows or through a linked e-NACH mandate. If you have a zero-earning day (e.g. rain or illness), you can request a 48-hour flexi-pause from the dashboard."
    ],
    hi: [
      "सचेत दैनिक किस्त (EDI) कैसे काम करती है?",
      "महीने के अंत में भारी EMI के बजाय, Sahayata आपके दैनिक QR कोड पेमेंट्स या बैंक खाते से रोजाना ₹50 से ₹150 की छोटी किस्त लेता है। यदि किसी दिन बारिश या बीमारी के कारण कमाई न हो, तो आप ऐप से 48 घंटे के लिए किस्त रोक (flexi-pause) सकते हैं।"
    ],
    gu: [
      "દૈનિક સચેત હપ્તો (EDI) કેવી રીતે કાર્ય કરે છે?",
      "મહિનાના અંતે મોટા હપ્તાના બદલે, તમારા દૈનિક QR પેમેન્ટ્સમાંથી રોજ ₹50 થી ₹150 કપાય છે. જો કોઈ દિવસે કમાણી ન થાય, તો તમે એપમાંથી 48 કલાક માટે હપ્તો મોકૂફ રાખી શકો છો."
    ]
  },

  // B. E-KYC & DOCUMENT FORENSICS
  {
    id: "kyc-required-docs",
    c: "kyc",
    role: "worker",
    tags: ["kyc", "aadhaar", "pan", "documents", "upload", "passbook", "voter"],
    en: [
      "What documents are required for instant AI e-KYC verification?",
      "You only need 2 basic documents: 1) Physical Aadhaar Card (front side photo, verified via 12-digit Verhoeff Checksum), and 2) Bank Passbook first page or cancelled cheque (showing Account Number & IFSC code). Optional documents like PAN card or e-Shram card help unlock higher Tier-3 credit limits."
    ],
    hi: [
      "तत्काल AI e-KYC सत्यापन के लिए किन दस्तावेजों की आवश्यकता है?",
      "आपको केवल 2 मूल दस्तावेजों की आवश्यकता है: 1) भौतिक आधार कार्ड (सामने की साफ फोटो), और 2) बैंक पासबुक का पहला पृष्ठ या कैंसिल्ड चेक (खाता संख्या और IFSC स्पष्ट हो)। e-Shram या PAN कार्ड वैकल्पिक हैं जो ₹50,000 की उच्च सीमा दिलाने में मदद करते हैं।"
    ],
    gu: [
      "AI e-KYC માટે કયા દસ્તાવેજો જરૂરી છે?",
      "ફક્ત 2 દસ્તાવેજો જરૂરી છે: 1) આધાર કાર્ડનો સાફ ફોટો, અને 2) બેંક પાસબુકનું પ્રથમ પાનું અથવા કેન્સલ ચેક (એકાઉન્ટ નંબર અને IFSC સાથે). e-Shram કાર્ડથી મોટી રકમની લોન સરળતાથી મળે છે."
    ]
  },
  {
    id: "kyc-verification-time",
    c: "kyc",
    role: "worker",
    tags: ["forensics", "ela", "exif", "tamper", "verification", "speed", "camera"],
    en: [
      "How fast is document verification and how does the 8-Layer Anti-Fraud engine work?",
      "Our AI verifies documents in under 90 seconds. The 8-Layer Engine performs: 1) EXIF hardware metadata verification, 2) Error Level Analysis (ELA) for image splicing, 3) 12-digit Verhoeff Aadhaar mathematical validation, 4) Deep-learning OCR text matching, and 5) Duplicate application cross-checking across partner banks."
    ],
    hi: [
      "दस्तावेज़ सत्यापन में कितना समय लगता है और 8-लेयर एंटी-फ्रॉड कैसे काम करता है?",
      "हमारा AI 90 सेकंड से भी कम समय में दस्तावेजों की पुष्टि करता है। 8-लेयर इंजन EXIF कैमरा मेटाडेटा, ELA फोटोशॉप जांच, 12-अंकों का आधार वेरहोफ एल्गोरिदम और डुप्लीकेट आवेदनों की तुरंत जांच करता है।"
    ],
    gu: [
      "દસ્તાવેજ ચકાસણીમાં કેટલો સમય લાગે છે?",
      "અમારું AI ફક્ત 90 સેકન્ડમાં દસ્તાવેજો ચકાસે છે. તે EXIF કેમેરા ડેટા, ફોટો એડિટિંગ તપાસ અને 12-અંકના આધાર અલ્ગોરિધમની સુરક્ષિત ચકાસણી કરે છે."
    ]
  },

  // C. UPI CREDIT SCORE & CASHFLOW ENGINE
  {
    id: "upi-credit-score-calculation",
    c: "upi",
    role: "worker",
    tags: ["upi", "score", "credit", "cashflow", "merchant", "qr", "cibil"],
    en: [
      "How is the Sahayata Alternative Credit Score (300-900) calculated without CIBIL?",
      "Sahayata replaces traditional CIBIL scores with cashflow underwriting. It evaluates: 1) Daily UPI QR transaction volume, 2) Sales velocity across morning/evening peak hours, 3) Repeat customer return rate, 4) Daily net cash buffer after expenses, and 5) Historical micro-repayment timeliness. Scores above 650 qualify for instant bank sanction."
    ],
    hi: [
      "बिना CIBIL स्कोर के Sahayata अल्टरनेट क्रेडिट स्कोर (300-900) कैसे बनता है?",
      "Sahayata पारंपरिक CIBIL के स्थान पर कैश-फ्लो अंडरराइटिंग का उपयोग करता है। यह मापता है: 1) दैनिक UPI QR ट्रांजैक्शन वॉल्यूम, 2) सुबह/शाम के पीक घंटों में बिक्री की निरंतरता, 3) दोबारा आने वाले ग्राहकों का अनुपात, 4) दैनिक खर्च के बाद बचा हुआ शुद्ध बफर, और 5) पुरानी किस्तों का समय पर भुगतान। 650 से अधिक स्कोर पर तुरंत बैंक स्वीकृति मिलती है।"
    ],
    gu: [
      "CIBIL વગર Sahayata અલ્ટરનેટ ક્રેડિટ સ્કોર (300-900) કેવી રીતે ગણાય છે?",
      "Sahayata કેશ-ફ્લો આધારિત અંડરરાઇટિંગ કરે છે. જેમાં: 1) દૈનિક UPI QR ટ્રાન્ઝેક્શન વોલ્યુમ, 2) વેચાણની સાતત્યતા, 3) ગ્રાહકોની આવક, 4) દૈનિક ખર્ચ બાદ વધતી ચોખ્ખી બચત, અને 5) સમયસર હપ્તા ચુકવણીની હિસ્ટ્રી ધ્યાને લેવાય છે. 650 થી વધુ સ્કોર ધરાવતા કામદારોને તુરંત લોન મંજૂર થાય છે."
    ]
  },
  {
    id: "upi-statement-generator",
    c: "upi",
    role: "worker",
    tags: ["upi", "statement", "history", "report", "pdf", "tamper"],
    en: [
      "How can I generate and export the verified UPI History Statement?",
      "In the dashboard's Advanced Tools section, select 'UPI History Statement Generator'. Enter your UPI Merchant ID to generate an official PDF transaction analysis detailing daily volume trends, peak sales hours, customer loyalty index, and cryptographic tamper-check signatures for bank underwriters."
    ],
    hi: [
      "सत्यापित UPI हिस्ट्री स्टेटमेंट कैसे जेनरेट और एक्सपोर्ट करें?",
      "डैशबोर्ड के एडवांस्ड टूल्स सेक्शन में 'UPI History Statement Generator' चुनें। अपना UPI ID दर्ज करके आधिकारिक PDF रिपोर्ट प्राप्त करें, जिसमें दैनिक बिक्री रुझान, पीक आवर्स, ग्राहक वफादारी इंडेक्स और बैंकों के लिए क्रिप्टोग्राफ़िक डिजिटल सिग्नेचर शामिल होते हैं।"
    ],
    gu: [
      "વેરિફાઇડ UPI હિસ્ટ્રી સ્ટેટમેન્ટ કેવી રીતે બનાવવું?",
      "ડેશબોર્ડના એડવાન્સ્ડ ટૂલ્સમાં 'UPI History Statement Generator' પસંદ કરો. તમારો UPI ID નાખીને પીક સેલ્સ, દૈનિક વેચાણ અને બેંક વેરિફિકેશન માટેનું ડિજિટલ સ્ટેટમેન્ટ PDF ડાઉનલોડ કરો."
    ]
  },

  // D. SAI - AI FINANCIAL TWIN & CONVERSATIONAL ASSISTANT
  {
    id: "ai-financial-twin-workflow",
    c: "ai",
    role: "worker",
    tags: ["sai", "ai", "twin", "voice", "bot", "assistant", "certificate", "audio"],
    en: [
      "How does SAI (AI Sahayak) conversational onboarding work?",
      "SAI conducts a 9-stage spoken conversation in Hindi, Gujarati, or English: Stage 0: Name capture; Stage 1: Aadhaar e-KYC intake; Stage 2: Bank passbook intake; Stage 3: Daily earnings; Stage 4: Daily expenses & net buffer; Stage 5: Age verification; Stage 6: Trade & location; Stage 7: Deterministic Scheme Evaluation; Stage 8: Disbursal authorization & instant PDF Eligibility Certificate generation."
    ],
    hi: [
      "SAI (AI सहायक) के साथ बातचीत करके आवेदन कैसे होता है?",
      "SAI आपकी अपनी भाषा (हिन्दी, गुजराती या अंग्रेज़ी) में 9 आसान सवालों में बातचीत करता है: स्टेज 0: नाम; स्टेज 1: आधार e-KYC; स्टेज 2: बैंक पासबुक; स्टेज 3: रोजाना कमाई; स्टेज 4: रोजाना खर्च व शुद्ध बफर; स्टेज 5: उम्र; स्टेज 6: व्यवसाय व शहर; स्टेज 7: पात्र सरकारी योजनाओं का मिलान; स्टेज 8: ऋण स्वीकृति व आधिकारिक AI पात्रता सर्टिफिकेट PDF डाउनलोड।"
    ],
    gu: [
      "SAI (AI સહાયક) સાથે વાતચીત કરીને લોન કેવી રીતે મળે?",
      "SAI ગુજરાતી, હિન્દી કે અંગ્રેજીમાં 9 સરળ તબક્કામાં વાતચીત કરે છે: સ્ટેજ 0: નામ; સ્ટેજ 1: આધાર e-KYC; સ્ટેજ 2: બેંક પાસબુક; સ્ટેજ 3: દૈનિક આવક; સ્ટેજ 4: દૈનિક ખર્ચ; સ્ટેજ 5: ઉંમર; સ્ટેજ 6: વ્યવસાય; સ્ટેજ 7: સરકારી યોજનાઓનું મૂલ્યાંકન; સ્ટેજ 8: લોન અધિકૃતતા અને AI પાત્રતા સર્ટિફિકેટ PDF ડાઉનલોડ."
    ]
  },
  {
    id: "ai-eligibility-certificate",
    c: "ai",
    role: "worker",
    tags: ["certificate", "pdf", "download", "evaluation", "score", "dossier"],
    en: [
      "What is included in the official AI Worker Eligibility Certificate PDF?",
      "The generated certificate contains: 1) Unique Certificate ID & verification timestamp, 2) Masked Aadhaar number (XXXX-XXXX-XXXX), 3) Evaluated Sahayata Credit Score (300-900), 4) Qualified Schemes with sanctioned amounts & interest subsidies, 5) Ineligible Schemes with exact statutory disqualification reasons, and 6) Bank Underwriting QR verification seal."
    ],
    hi: [
      "आधिकारिक AI Worker Eligibility Certificate PDF में क्या-क्या विवरण होता है?",
      "डाउनलोड किए गए सर्टिफिकेट में शामिल हैं: 1) यूनिक सर्टिफिकेट ID और टाइमस्टैम्प, 2) सुरक्षित मास्क्ड आधार नंबर, 3) मूल्यांकित Sahayata क्रेडिट स्कोर, 4) स्वीकृत योजनाएं, ऋण सीमा और ब्याज सब्सिडी, 5) अयोग्य योजनाओं के वैधानिक कारण, और 6) बैंक सत्यापन के लिए डिजिटल QR सील।"
    ],
    gu: [
      "AI Worker Eligibility Certificate PDF માં શું શું વિગતો હોય છે?",
      "સર્ટિફિકેટમાં સમાવિષ્ટ છે: 1) યુનિક સર્ટિફિકેટ ID, 2) માસ્ક્ડ આધાર નંબર, 3) Sahayata ક્રેડિટ સ્કોર, 4) પાત્ર યોજનાઓ અને લોન રકમ, 5) અપાત્ર યોજનાઓના સ્પષ્ટ કારણો, અને 6) બેંક વેરિફિકેશન માટેનો સુરક્ષિત QR કોડ."
    ]
  },

  // E. GOVERNMENT SCHEMES & WELFARE
  {
    id: "schemes-comparison-guide",
    c: "schemes",
    role: "worker",
    tags: ["schemes", "pmsym", "pension", "jandhan", "overdraft", "pmjjby", "pmsby"],
    en: [
      "What are the eligibility criteria for PM-SYM Pension and Jan Dhan Overdraft?",
      "PM-SYM Pension: Unorganised workers aged 18-40 with monthly income below ₹15,000. Matching government contribution provides ₹3,000/month assured pension after age 60. Jan Dhan Overdraft: Active Jan Dhan accounts with regular Aadhaar-linked UPI transactions qualify for an instant emergency overdraft facility up to ₹10,000 with zero collateral."
    ],
    hi: [
      "PM-SYM पेंशन और जन धन ओवरड्राफ्ट के लिए क्या पात्रता शर्तें हैं?",
      "PM-SYM पेंशन: 18-40 वर्ष के असंगठित कामगार जिनकी मासिक आय ₹15,000 से कम हो। सरकार द्वारा समान अंशदान पर 60 वर्ष बाद ₹3,000/माह निश्चित पेंशन मिलती है। जन धन ओवरड्राफ्ट: नियमित लेनदेन वाले आधार-लिंक्ड खातों पर ₹10,000 तक की तत्काल बिना गारंटी क्रेडिट सुविधा मिलती है।"
    ],
    gu: [
      "PM-SYM પેન્શન અને જન ધન ઓવરડ્રાફ્ટના નિયમો શું છે?",
      "PM-SYM પેન્શન: 18-40 વર્ષના અસંગઠિત કામદારો (માસિક આવક ₹15,000 થી ઓછી). સરકારના સરખા યોગદાન સાથે 60 વર્ષ પછી ₹3,000/માસિક પેન્શન. જન ધન ઓવરડ્રાફ્ટ: સક્રિય ખાતાધારકોને ₹10,000 સુધીની ઇમરજન્સી ક્રેડિટ સુવિધા મળે છે."
    ]
  },

  // F. BANK UNDERWRITING & ADMIN COMMAND CENTER
  {
    id: "admin-command-center-features",
    c: "bank",
    role: "bank",
    tags: ["admin", "command", "center", "queue", "dossier", "sanction", "approval", "bi"],
    en: [
      "What tools are available in the Bank Executive Command Center (`/admin`)?",
      "The Command Center provides bank managers with: 1) Live Underwriting Queue with applicant dossiers, 2) 8-Layer Forensic Anti-Fraud Inspector, 3) Real-Time Cross-Tab Event Stream (`realtimeSync.js`), 4) Geographic Map Analytics across Indian city clusters, 5) Sectoral credit health breakdown, and 6) One-click sanction orders directly triggering Jan Dhan disbursals."
    ],
    hi: [
      "बैंक एग्जीक्यूटिव कमांड सेंटर (`/admin`) में क्या टूल्स उपलब्ध हैं?",
      "कमांड सेंटर बैंक प्रबंधकों को प्रदान करता है: 1) लाइव अंडरराइटिंग कतार, 2) 8-लेयर फोरेंसिक एंटी-फ्रॉड निरीक्षक, 3) रियल-टाइम क्रॉस-टैब सिंक इवेंट स्ट्रीम, 4) भारत भर के शहरों के क्लस्टर मैप, 5) क्षेत्रवार क्रेडिट विश्लेषण, और 6) जन धन खातों में एक-क्लिक प्रत्यक्ष ऋण संवितरण आदेश।"
    ],
    gu: [
      "બેંક એક્ઝિક્યુટિવ કમાન્ડ સેન્ટર (`/admin`) માં કયા ટૂલ્સ છે?",
      "કમાન્ડ સેન્ટરમાં ઉપલબ્ધ છે: 1) લાઈવ અંડરરાઇટિંગ કતાર, 2) 8-લેયર એન્ટી-ફ્રોડ ઇન્સ્પેક્ટર, 3) રીઅલ-ટાઇમ ક્રોસ-ટેબ ઇવેન્ટ સ્ટ્રીમ, 4) ભારતના વિવિધ શહેરોનો ક્લસ્ટર મેપ, અને 5) એક-ક્લિક લોન મંજૂરી ઓર્ડર."
    ]
  },
  {
    id: "realtime-cross-tab-sync",
    c: "bank",
    role: "bank",
    tags: ["sync", "broadcast", "cross-tab", "storage", "realtime", "event", "feed"],
    en: [
      "How does the Real-Time Cross-Tab Synchronization work between Worker & Bank portals?",
      "Sahayata utilizes a browser `BroadcastChannel` and `localStorage` event bridge (`realtimeSync.js`). When a worker submits an application, calculates a loan, or triggers an e-KYC upload, the event instantly triggers a desktop audio chime and live ticker update inside the Bank Underwriting Queue without requiring a manual page refresh."
    ],
    hi: [
      "श्रमिक और बैंक पोर्टल के बीच रियल-टाइम क्रॉस-टैब सिंक कैसे काम करता है?",
      "Sahayata ब्राउज़र के `BroadcastChannel` और `localStorage` इवेंट ब्रिज का उपयोग करता है। जैसे ही कोई श्रमिक आवेदन जमा करता है, बैंक कमांड सेंटर में बिना पेज रीफ्रेश किए तुरंत ऑडियो अलर्ट और लाइव टिकर अपडेट आ जाता है।"
    ],
    gu: [
      "શ્રમિક અને બેંક વચ્ચે રીઅલ-ટાઇમ ક્રોસ-ટેબ સિંક કેવી રીતે થાય છે?",
      "Sahayata બ્રાઉઝર `BroadcastChannel` નો ઉપયોગ કરે છે. જ્યારે કોઈ શ્રમિક અરજી કરે છે, ત્યારે બેંક પોર્ટલ પર આપોઆપ રીઅલ-ટાઇમ સૂચના અને ઑડિયો એલર્ટ વાગે છે."
    ]
  },

  // G. SECURITY & ANTI-FRAUD
  {
    id: "anti-fraud-exif-ela-tamper",
    c: "security",
    role: "bank",
    tags: ["security", "fraud", "exif", "ela", "tamper", "photoshop", "verhoeff"],
    en: [
      "How does Sahayata detect photoshopped or duplicate identity cards?",
      "The Anti-Fraud engine inspects: 1) EXIF metadata for software signatures (e.g. Photoshop, GIMP, Canva), 2) Error Level Analysis (ELA) heatmaps to detect localized pixel tampering, 3) Verhoeff mathematical checksums to reject invented Aadhaar numbers, and 4) Name-to-OCR string similarity matching."
    ],
    hi: [
      "Sahayata फोटोशॉप किए गए या नकली पहचान पत्रों का पता कैसे लगाता है?",
      "एंटी-फ्रॉड इंजन जांच करता है: 1) फोटोशॉप या कैनवा जैसी सॉफ्टवेयर एडिटिंग की EXIF पहचान, 2) ELA पिक्सेल हीटमैप, 3) 12-अंकों के असली आधार का वेरहोफ चेकसम, और 4) OCR टेक्स्ट और नाम की सटीकता।"
    ],
    gu: [
      "Sahayata નકલી કે એડિટ કરેલા કાર્ડ કેવી રીતે પકડે છે?",
      "એન્ટી-ફ્રોડ સિસ્ટમ EXIF મેટાડેટા, ELA પિક્સેલ હીટમેપ અને 12-અંકના આધાર અલ્ગોરિધમની મદદથી કોઈપણ છેડછાડ તુરંત શોધી કાઢે છે."
    ]
  }
];

// ============================================================================
// 2. DASHBOARD FEATURE GATEWAYS
// ============================================================================
const DASHBOARD_GATEWAYS = [
  {
    icon: Bot,
    title: { en: "SAI AI Voice Assistant", hi: "SAI AI वॉइस सहायक", gu: "SAI AI વૉઇસ સહાયક" },
    desc: {
      en: "9-stage conversational onboarding & instant AI Eligibility Certificate PDF.",
      hi: "9-चरणीय बातचीत से आवेदन व तत्काल AI पात्रता सर्टिफिकेट PDF प्राप्त करें।",
      gu: "9 સરળ પ્રશ્નો દ્વારા લોન અરજી અને તુરંત સર્ટિફિકેટ ડાઉનલોડ કરો."
    },
    badge: { en: "AI Twin", hi: "AI ट्विन", gu: "AI ટ્વિન" },
    route: "/financial-twin",
    category: "ai"
  },
  {
    icon: Calculator,
    title: { en: "Eligibility & Sachet EDI", hi: "पात्रता व दैनिक सचेत किस्त", gu: "પાત્રતા અને દૈનિક હપ્તો" },
    desc: {
      en: "Simulate loan limits (₹10k–₹50k) & daily sachet repayments (₹50–₹150/day).",
      hi: "₹10,000–₹50,000 लोन सीमा और ₹50–₹150 की दैनिक किस्तों की गणना करें।",
      gu: "₹10,000 થી ₹50,000 સુધીની લોન અને દૈનિક ₹50-₹150 હપ્તાની ગણતરી."
    },
    badge: { en: "Calculator", hi: "कैलकुलेटर", gu: "કેલ્ક્યુલેટર" },
    route: "/",
    category: "loan"
  },
  {
    icon: Landmark,
    title: { en: "Government Schemes", hi: "सरकारी कल्याण योजनाएं", gu: "સરકારી યોજનાઓ" },
    desc: {
      en: "Explore PM SVANidhi (7% subsidy), PM-SYM Pension & Jan Dhan Overdraft.",
      hi: "PM SVANidhi (7% ब्याज सब्सिडी), PM-SYM पेंशन व जन धन ओवरड्राफ्ट देखें।",
      gu: "PM SVANidhi, PM-SYM પેન્શન અને જન ધન ઓવરડ્રાફ્ટની માહિતી."
    },
    badge: { en: "Welfare", hi: "कल्याण", gu: "કલ્યાણ" },
    route: "/about",
    category: "schemes"
  },
  {
    icon: Building2,
    title: { en: "Bank Underwriting ML", hi: "बैंक अंडरराइटिंग ML", gu: "બેંક અંડરરાઇટિંગ ML" },
    desc: {
      en: "Executive underwriting queue with live applicant dossiers & 1-click sanction.",
      hi: "बैंक अधिकारियों के लिए लाइव आवेदक फाइलें और एक-क्लिक स्वीकृति कंसोल।",
      gu: "બેંક અધિકારીઓ માટે લાઈવ અરજીઓ અને એક-ક્લિક મંજૂરી સિસ્ટમ."
    },
    badge: { en: "Command Center", hi: "कमांड सेंटर", gu: "કમાન્ડ સેન્ટર" },
    route: "/admin",
    category: "bank"
  },
  {
    icon: QrCode,
    title: { en: "UPI Credit Engine", hi: "UPI क्रेडिट इंजन", gu: "UPI ક્રેડિટ એન્જિન" },
    desc: {
      en: "Evaluate daily QR velocity & alternate credit score (300-900).",
      hi: "दैनिक QR आवक और 300-900 अल्टरनेट क्रेडिट स्कोर का विश्लेषण।",
      gu: "દૈનિક QR વેચાણ અને 300-900 ક્રેડિટ સ્કોરનું વિશ્લેષણ."
    },
    badge: { en: "Credit Score", hi: "क्रेडिट स्कोर", gu: "ક્રેડિટ સ્કોર" },
    route: "/",
    category: "upi"
  },
  {
    icon: FileText,
    title: { en: "UPI Statement Generator", hi: "UPI स्टेटमेंट जनरेटर", gu: "UPI સ્ટેટમેન્ટ જનરેટર" },
    desc: {
      en: "Generate tamper-checked merchant transaction reports for banks.",
      hi: "बैंकों के लिए डिजिटल रूप से सत्यापित ट्रांजैक्शन रिपोर्ट बनाएं।",
      gu: "બેંકો માટે ડિજિટલી વેરિફાઇડ ટ્રાન્ઝેક્શન રિપોર્ટ બનાવો."
    },
    badge: { en: "Reports", hi: "रिपोर्ट्स", gu: "રિપોર્ટ્સ" },
    route: "/",
    category: "upi"
  },
  {
    icon: MapPin,
    title: { en: "District Geo Analytics", hi: "जिला जियो एनालिटिक्स", gu: "જિલ્લા જિયો એનાલિટિક્સ" },
    desc: {
      en: "Real-time geographic clusters & inclusion maps across India.",
      hi: "भारत भर के शहरों में श्रमिक घनत्व और योजना क्लस्टर मैप।",
      gu: "ભારતના વિવિધ શહેરોમાં શ્રમિક અને યોજના ક્લસ્ટર મેપ."
    },
    badge: { en: "Geo Map", hi: "जियो मैप", gu: "જિયો મેપ" },
    route: "/admin",
    category: "bank"
  },
  {
    icon: ShieldCheck,
    title: { en: "8-Layer Anti-Fraud", hi: "8-लेयर एंटी-फ्रॉड", gu: "8-લેયર એન્ટી-ફ્રોડ" },
    desc: {
      en: "Inspect EXIF metadata, ELA forensics & Verhoeff checksums.",
      hi: "EXIF मेटाडेटा, ELA फोरेंसिक और आधार चेकसम की जांच।",
      gu: "EXIF મેટાડેટા, ELA ફોરેન્સિક અને આધાર ચેકસમ તપાસ."
    },
    badge: { en: "Security", hi: "सुरक्षा", gu: "સુરક્ષા" },
    route: "/admin",
    category: "security"
  }
];

// ============================================================================
// 3. INTERACTIVE TROUBLESHOOTING RESOLVER GUIDES
// ============================================================================
const TROUBLESHOOTING_GUIDES = [
  {
    id: "track-app",
    title: {
      en: "Where is my application stuck?",
      hi: "मेरा लोन आवेदन किस स्टेज पर रुका है?",
      gu: "મારી અરજી કયા સ્ટેજ પર અટકી છે?"
    },
    tag: { en: "Stage Tracker", hi: "स्टेज ट्रैकर", gu: "સ્ટેજ ટ્રેકર" },
    icon: Clock,
    steps: {
      en: [
        "1. Open the 'Track Application' panel on the home page and enter your Application ID.",
        "2. Stage 1 (Submitted): Form successfully received in the bank processing queue.",
        "3. Stage 2 (e-KYC): AI 8-layer forensic inspection validates your Aadhaar & passbook (takes ~2 min).",
        "4. Stage 3 (NBFC / ML Scoring): UPI cashflow engine computes your alternate score (300-900).",
        "5. Stage 4 & 5 (Bank Sanction & Disbursal): Branch manager signs sanction order; funds transfer directly to Jan Dhan account."
      ],
      hi: [
        "1. होम पेज पर 'Track Application' में अपना Application ID दर्ज करके स्टेटस चेक करें।",
        "2. स्टेज 1 (Submitted): आवेदन बैंक प्रोसेसिंग कतार में सफलतापूर्वक दर्ज हो चुका है।",
        "3. स्टेज 2 (e-KYC): AI फोरेंसिक सिस्टम आधार व पासबुक की प्रामाणिकता जांचता है (लगभग 2 मिनट)।",
        "4. स्टेज 3 (NBFC/ML स्कोरिंग): UPI कैश-फ्लो से आपका अल्टरनेट क्रेडिट स्कोर (300-900) बनता है।",
        "5. स्टेज 4 व 5 (Bank Sanction & Disbursal): बैंक अधिकारी डिजिटल स्वीकृति देते हैं और राशि सीधे जन धन खाते में ट्रांसफर होती है।"
      ],
      gu: [
        "1. હોમ પેજ પર 'Track Application' માં તમારો Application ID નાખી સ્ટેટસ જુઓ.",
        "2. સ્ટેજ 1 (Submitted): અરજી સફળતાપૂર્વક બેંક કતારમાં જમા થઈ.",
        "3. સ્ટેજ 2 (e-KYC): AI સિસ્ટમ આધાર અને પાસબુકની ચકાસણી કરે છે (2 મિનિટ).",
        "4. સ્ટેજ 3 (NBFC/ML સ્કોરિંગ): UPI કેશ-ફ્લો મુજબ ક્રેડિટ સ્કોર બને છે.",
        "5. સ્ટેજ 4 અને 5 (Bank Sanction & Disbursal): બેંક મંજૂરી બાદ રકમ સીધી જન ધન ખાતામાં જમા થાય છે."
      ]
    },
    actionText: { en: "Open Application Tracker", hi: "एप्लिकेशन ट्रैकर खोलें", gu: "એપ્લિકેશન ટ્રેકર ખોલો" },
    actionRoute: "/"
  },
  {
    id: "fix-kyc",
    title: {
      en: "How to fix a rejected or pending KYC document?",
      hi: "KYC रिजेक्ट या पेंडिंग होने पर क्या करें?",
      gu: "KYC રિજેક્ટ કે પૅન્ડિંગ થાય તો શું કરવું?"
    },
    tag: { en: "e-KYC Fix", hi: "KYC सुधार", gu: "KYC સુધારો" },
    icon: FileCheck2,
    steps: {
      en: [
        "1. Avoid photocopies or screen captures; upload a clear photo of the original physical card.",
        "2. Ensure good ambient lighting with zero glare or shadows covering the 12-digit number or name.",
        "3. Ensure the file format is JPG, PNG, or PDF with a size under 5 MB.",
        "4. Ensure your Name and Date of Birth exactly match what was entered during registration."
      ],
      hi: [
        "1. फोटोकॉपी या कंप्यूटर स्क्रीन की फोटो न लें; असली फिजिकल कार्ड की साफ फोटो अपलोड करें।",
        "2. पर्याप्त रोशनी में फोटो खींचें ताकि सभी 12 अंक और नाम बिना किसी चमक के स्पष्ट पढ़ें।",
        "3. फ़ाइल का साइज़ 5 MB से कम और प्रारूप JPG, PNG या PDF में होना चाहिए।",
        "4. सुनिश्चित करें कि आपका नाम और जन्मतिथि आवेदन फॉर्म की जानकारी से पूरी तरह मेल खाती हो।"
      ],
      gu: [
        "1. ઝેરોક્સ કે સ્ક્રીનશોટ ન અપલોડ કરો; અસલ કાર્ડનો સાફ ફોટો લો.",
        "2. સારી લાઈટમાં ફોટો લો જેથી બધા અંક અને નામ સ્પષ્ટ વંચાય.",
        "3. ફાઇલ સાઈઝ 5 MB થી ઓછી અને JPG, PNG કે PDF માં હોવી જોઈએ.",
        "4. નામ અને જન્મતારીખ ફોર્મ સાથે મેળ ખાતા હોવા જોઈએ."
      ]
    },
    actionText: { en: "Re-upload KYC Document", hi: "KYC दस्तावेज़ दोबारा अपलोड करें", gu: "KYC ફરી અપલોડ કરો" },
    actionRoute: "/"
  },
  {
    id: "boost-upi",
    title: {
      en: "How to boost my UPI Alternative Credit Score (300-900)?",
      hi: "अपना UPI अल्टरनेट क्रेडिट स्कोर कैसे बढ़ाएं?",
      gu: "મારો UPI ક્રેડિટ સ્કોર કેવી રીતે વધારવો?"
    },
    tag: { en: "Credit Booster", hi: "स्कोर बूस्टर", gu: "સ્કોર બૂસ્ટર" },
    icon: TrendingUp,
    steps: {
      en: [
        "1. Accept daily customer payments via merchant QR code instead of cash.",
        "2. Maintain active daily transaction flow without long zero-collection periods.",
        "3. Avoid withdrawing 100% of your daily earnings immediately; maintain a healthy net buffer.",
        "4. Pay your daily sachet installments (₹50-₹150/day) on time to unlock higher tranches (₹20k, ₹50k)."
      ],
      hi: [
        "1. ग्राहकों से नकद के बजाय मर्चेंट QR कोड पर दैनिक भुगतान स्वीकार करें।",
        "2. लगातार दैनिक लेनदेन बनाए रखें, कई दिनों तक शून्य ट्रांजैक्शन न होने दें।",
        "3. खाते में पूरा पैसा तुरंत निकालने के बजाय थोड़ा दैनिक बफर बचाकर रखें।",
        "4. सचेत दैनिक किस्तों (EDI) का समय पर भुगतान करके ₹20,000 और ₹50,000 की बड़ी लिमिट अनलॉक करें।"
      ],
      gu: [
        "1. ગ્રાહકો પાસેથી રોકડને બદલે મર્ચન્ટ QR કોડ પર પેમેન્ટ લો.",
        "2. સતત દૈનિક વ્યવહાર ચાલુ રાખો.",
        "3. ખાતામાં થોડો દૈનિક બેલેન્સ બફર જાળવી રાખો.",
        "4. દૈનિક સચેત હપ્તા સમયસર ભરી ₹20,000 અને ₹50,000 સુધીની મોટી લોન મેળવો."
      ]
    },
    actionText: { en: "Simulate UPI Credit Engine", hi: "UPI क्रेडिट इंजन चलाएं", gu: "UPI ક્રેડિટ સિમ્યુલેટ કરો" },
    actionRoute: "/"
  },
  {
    id: "download-cert",
    title: {
      en: "How to generate AI Worker Eligibility Certificate PDF?",
      hi: "AI पात्रता सर्टिफिकेट PDF कैसे डाउनलोड करें?",
      gu: "AI પાત્રતા સર્ટિફિકેટ PDF કેવી રીતે ડાઉનલોડ કરવું?"
    },
    tag: { en: "AI Certificate", hi: "AI सर्टिफिकेट", gu: "AI સર્ટિફિકેટ" },
    icon: Bot,
    steps: {
      en: [
        "1. Open SAI (AI Sahayak) from the top navigation bar (`/financial-twin`).",
        "2. Complete the conversational onboarding in Hindi, Gujarati, or English.",
        "3. Review the evaluated Scheme Report on Stage 7.",
        "4. Click 'Download PDF Certificate' to save your official verified credential."
      ],
      hi: [
        "1. ऊपर दिए नेविगेशन से 'AI Sahayak' (`/financial-twin`) खोलें।",
        "2. अपनी भाषा (हिन्दी, गुजराती या अंग्रेज़ी) में बोलकर या लिखकर सवालों के जवाब दें।",
        "3. स्टेज 7 पर अपनी पात्र योजनाओं का मूल्यांकन देखें।",
        "4. 'Download PDF Certificate' पर क्लिक करके आधिकारिक सर्टिफिकेट डाउनलोड करें।"
      ],
      gu: [
        "1. ટોચના મેનૂમાંથી 'AI Sahayak' (`/financial-twin`) ખોલો.",
        "2. ગુજરાતી, હિન્દી કે અંગ્રેજીમાં વાતચીત પૂર્ણ કરો.",
        "3. સ્ટેજ 7 પર તમારી પાત્ર યોજનાઓનો રિપોર્ટ જુઓ.",
        "4. 'Download PDF Certificate' પર ક્લિક કરી સર્ટિફિકેટ મેળવો."
      ]
    },
    actionText: { en: "Launch SAI Voice Assistant", hi: "SAI वॉइस सहायक शुरू करें", gu: "SAI સહાયક શરૂ કરો" },
    actionRoute: "/financial-twin"
  }
];

// ============================================================================
// 4. TOPICS & LOCALIZED COPY
// ============================================================================
const TOPICS = {
  en: {
    all: "All Knowledge Topics",
    loan: "Loan & Sachet Repayment",
    kyc: "e-KYC & Document Forensics",
    upi: "UPI Credit & Cashflow",
    ai: "SAI AI Twin & Voice Bot",
    schemes: "Government Schemes",
    bank: "Bank Underwriting & Admin",
    security: "Security & Anti-Fraud"
  },
  hi: {
    all: "सभी ज्ञान विषय",
    loan: "लोन और सचेत पुनर्भुगतान",
    kyc: "e-KYC और दस्तावेज़ सत्यापन",
    upi: "UPI क्रेडिट और कैश-फ्लो",
    ai: "SAI AI सहायक और वॉइस बॉट",
    schemes: "सरकारी योजनाएं और पेंशन",
    bank: "बैंक अंडरराइटिंग और एडमिन",
    security: "सुरक्षा और एंटी-फ्रॉड"
  },
  gu: {
    all: "બધા વિષયો",
    loan: "લોન અને દૈનિક ચુકવણી",
    kyc: "e-KYC અને દસ્તાવેજ ચકાસણી",
    upi: "UPI ક્રેડિટ અને કેશ-ફ્લો",
    ai: "SAI AI સહાયક અને વૉઇસ બોટ",
    schemes: "સરકારી યોજનાઓ અને પેન્શન",
    bank: "બેંક અંડરરાઇટિંગ અને એડમિન",
    security: "સુરક્ષા અને એન્ટી-ફ્રોડ"
  }
};

const COPY = {
  en: {
    kicker: "Sahayata Knowledge & Operations Hub",
    title: "How can we assist your financial journey?",
    sub: "Comprehensive guidance covering the Worker Onboarding Suite, SAI Voice Assistant, 8-Layer Anti-Fraud Forensics, UPI Credit Engine, and Bank Underwriting Command Center.",
    searchPlaceholder: "Search loan limits, sachet EDI, e-KYC, UPI score, schemes, anti-fraud, or bank underwriting…",
    quickChipsLabel: "Popular Searches:",
    troubleKicker: "Quick Issue Resolver",
    troubleHeading: "Step-by-step solutions for common questions",
    troubleSub: "Select a topic below for instant resolution guidelines without waiting for customer support.",
    gatewaysHeading: "Interactive Dashboard Feature Gateways",
    gatewaysSub: "Direct 1-click access to all active tools across the Sahayata ecosystem.",
    architectureHeading: "Three-Pillar Credit & Verification Architecture",
    architectureSub: "Understand how informal worker data securely flows from mobile QR to bank disbursal.",
    browseTopics: "Explore Categories",
    answersFound: "answers matching",
    noFaqTitle: "No answers match your search query",
    noFaqSub: "Try using simpler keywords like 'svanidhi', 'sachet', 'kyc', 'upi', 'otp', or select another category.",
    viewAllBtn: "Reset & Show All FAQs",
    helplineTitle: "Official National Helplines & Grievance Desk",
    helplineSub: "Contact verified Government of India toll-free numbers for direct support.",
    safetyBadge: "Zero Fee Policy & Strict Safety Advisory",
    safetyHeadline: "Never Pay Cash • Never Disclose OTP or UPI PIN",
    safetyBody: "Sahayata and official Government schemes charge ZERO registration or processing fees. No Sahayata staff, bank executive, or AI assistant will ever ask for your confidential OTP, UPI PIN, or bank password."
  },
  hi: {
    kicker: "सहायता ज्ञान एवं संचालन हब",
    title: "हम आपकी वित्तीय यात्रा में कैसे सहायता कर सकते हैं?",
    sub: "श्रमिक ऑनबोर्डिंग टूल, SAI वॉइस सहायक, 8-लेयर एंटी-फ्रॉड फोरेंसिक, UPI क्रेडिट इंजन और बैंक अंडरराइटिंग कमांड सेंटर के लिए संपूर्ण आधिकारिक मार्गदर्शन।",
    searchPlaceholder: "लोन सीमा, सचेत दैनिक किस्त, e-KYC, UPI स्कोर, योजनाएं, एंटी-फ्रॉड या बैंक अंडरराइटिंग खोजें…",
    quickChipsLabel: "लोकप्रिय खोज:",
    troubleKicker: "त्वरित समस्या निवारण",
    troubleHeading: "अक्सर पूछे जाने वाले मुद्दों का समाधान",
    troubleSub: "बिना किसी प्रतीक्षा के तुरंत समाधान और निर्देश पाने के लिए नीचे दी गई समस्या चुनें।",
    gatewaysHeading: "डैशबोर्ड फीचर्स और टूल्स डायरेक्ट गेटवे",
    gatewaysSub: "Sahayata इकोसिस्टम के सभी लाइव टूल्स पर 1-क्लिक में सीधे पहुंचें।",
    architectureHeading: "तीन-स्तंभों की क्रेडिट व सत्यापन वास्तुकला",
    architectureSub: "जानें कि श्रमिक का QR डेटा मोबाइल से बैंक खाते में लोन डिस्बर्सल तक कैसे सुरक्षित पहुंचता है।",
    browseTopics: "विषय श्रेणियां",
    answersFound: "उत्तर उपलब्ध",
    noFaqTitle: "आपकी खोज से मेल खाता कोई उत्तर नहीं मिला",
    noFaqSub: "'svanidhi', 'sachet', 'kyc', 'upi', 'otp' जैसे सरल कीवर्ड आज़माएं या अन्य श्रेणी चुनें।",
    viewAllBtn: "रीसेट करें और सभी सवाल देखें",
    helplineTitle: "आधिकारिक राष्ट्रीय हेल्पलाइन व श्रमिक शिकायत निवारण",
    helplineSub: "सीधी सहायता के लिए भारत सरकार के सत्यापित टोल-फ्री नंबरों पर संपर्क करें।",
    safetyBadge: "ज़ीरो फ़ीस पॉलिसी और सख्त सुरक्षा सलाह",
    safetyHeadline: "कभी नकद न दें • OTP या UPI PIN कभी शेयर न करें",
    safetyBody: "Sahayata और सभी सरकारी योजनाएं पूरी तरह निःशुल्क (ZERO FEE) हैं। कोई भी सहायता कर्मचारी, बैंक अधिकारी या AI एजेंट आपसे कभी भी गोपनीय OTP, UPI PIN या बैंक पासवर्ड नहीं मांगेगा।"
  },
  gu: {
    kicker: "સહાયતા જ્ઞાન અને સંચાલન હબ",
    title: "અમે તમારી નાણાકીય યાત્રામાં કેવી રીતે મદદ કરી શકીએ?",
    sub: "શ્રમિક પોર્ટલ, SAI વૉઇસ સહાયક, 8-લેયર એન્ટી-ફ્રોડ, UPI ક્રેડિટ એન્જિન અને બેંક અંડરરાઇટિંગ કમાન્ડ સેન્ટરનું સંપૂર્ણ માર્ગદર્શન.",
    searchPlaceholder: "લોન સીમા, દૈનિક હપ્તા, e-KYC, UPI સ્કોર, સરકારી યોજનાઓ, એન્ટી-ફ્રોડ કે બેંક અંડરરાઇટિંગ શોધો…",
    quickChipsLabel: "લોકપ્રિય શોધ:",
    troubleKicker: "ઝડપી સમસ્યા નિવારણ",
    troubleHeading: "મુખ્ય પ્રશ્નોના ત્વરિત ઉકેલ",
    troubleSub: "કોઈ પણ રાહ જોયા વગર તુરંત ઉકેલ મેળવવા નીચેની સમસ્યા પસંદ કરો.",
    gatewaysHeading: "ડેશબોર્ડ ટૂલ્સ અને ફીચર્સ ડાયરેક્ટ ગેટવે",
    gatewaysSub: "Sahayata ના બધા જ લાઇવ ટૂલ્સ પર 1-ક્લિકમાં પહોંચો.",
    architectureHeading: "ત્રણ-સ્તંભનું ક્રેડિટ અને વેરિફિકેશન માળખું",
    architectureSub: "જાણો કે શ્રમિકનો QR ડેટા મોબાઈલથી બેંક ખાતામાં લોન જમા થવા સુધી કેવી રીતે સુરક્ષિત રહે છે.",
    browseTopics: "વિષય શ્રેણીઓ",
    answersFound: "જવાબો ઉપલબ્ધ",
    noFaqTitle: "આપની શોધ મુજબ કોઈ જવાબ મળ્યો નથી",
    noFaqSub: "'svanidhi', 'sachet', 'kyc', 'upi', 'otp' જેવા સરળ શબ્દો અજમાવો અથવા બીજી કેટેગરી પસંદ કરો.",
    viewAllBtn: "બધા પ્રશ્નો ફરીથી જુઓ",
    helplineTitle: "અધિકૃત રાષ્ટ્રીય હેલ્પલાઇન અને ફરિયાદ નિવારણ",
    helplineSub: "સીધી સહાય માટે ભારત સરકારના અધિકૃત ટોલ-ફ્રી નંબર પર સંપર્ક કરો.",
    safetyBadge: "ઝીરો ફી પોલિસી અને સુરક્ષા માર્ગદર્શિકા",
    safetyHeadline: "ક્યારેય રોકડ ન આપો • OTP કે UPI PIN ક્યારેય શેર ન કરો",
    safetyBody: "Sahayata અને બધી સરકારી યોજનાઓ સંપૂર્ણપણે મફત (ZERO FEE) છે. સહાયતા સ્ટાફ કે બેંક અધિકારી ક્યારેય તમારો OTP, UPI PIN કે પાસવર્ડ માંગશે નહીં."
  }
};

const POPULAR_SEARCH_CHIPS = [
  "PM SVANidhi",
  "Sachet Daily EDI",
  "Aadhaar e-KYC",
  "8-Layer Anti-Fraud",
  "UPI Credit Score",
  "SAI Voice Bot",
  "Bank Underwriting"
];

const HELPLINES = [
  {
    service: "National e-Shram Worker Helpline",
    serviceHi: "राष्ट्रीय e-Shram श्रमिक हेल्पलाइन",
    serviceGu: "રાષ્ટ્રીય e-Shram શ્રમિક હેલ્પલાઇન",
    number: "14434",
    timing: "8:00 AM – 8:00 PM (Mon-Sat)",
    timingHi: "सुबह 8:00 से रात 8:00 (सोम-शनि)",
    timingGu: "સવારે 8:00 થી રાત્રે 8:00 (સોમ-શનિ)",
    badge: "Toll-Free",
    icon: UserCheck
  },
  {
    service: "PM SVANidhi Scheme National Desk",
    serviceHi: "PM SVANidhi योजना राष्ट्रीय डेस्क",
    serviceGu: "PM SVANidhi યોજના રાષ્ટ્રીય ડેસ્ક",
    number: "1800-11-1979",
    timing: "MoHUA Government of India",
    timingHi: "आवासन और शहरी कार्य मंत्रालय",
    timingGu: "આવાસ અને શહેરી બાબતોનું મંત્રાલય",
    badge: "Govt Desk",
    icon: Landmark
  },
  {
    service: "Jan Dhan Financial Inclusion Helpdesk",
    serviceHi: "जन धन वित्तीय समावेशन हेल्पडेस्क",
    serviceGu: "જન ધન નાણાકીય સમાવેશન હેલ્પડેસ્ક",
    number: "1800-180-1111",
    timing: "Department of Financial Services",
    timingHi: "वित्तीय सेवाएं विभाग, भारत सरकार",
    timingGu: "નાણાકીય સેવા વિભાગ, ભારત સરકાર",
    badge: "Banking",
    icon: WalletCards
  },
  {
    service: "National Cyber Fraud Reporting Helpline",
    serviceHi: "राष्ट्रीय साइबर अपराध रिपोर्टिंग हेल्पलाइन",
    serviceGu: "રાષ્ટ્રીય સાયબર ફ્રોડ રિપોર્ટિંગ હેલ્પલાઇન",
    number: "1930",
    timing: "24x7 Emergency Cyber Police",
    timingHi: "24x7 आपातकालीन साइबर पुलिस",
    timingGu: "24x7 ઇમરજન્સી સાયબર પોલીસ",
    badge: "24x7 Emergency",
    icon: ShieldAlert
  }
];

export default function HelpCenter({ lang = "en", navigateTo }) {
  const language = ["hi", "gu"].includes(lang) ? lang : "en";
  const copy = COPY[language] || COPY.en;
  const topics = TOPICS[language] || TOPICS.en;

  const [category, setCategory] = useState("all");
  const [openFaq, setOpenFaq] = useState(FAQS[0].id);
  const [activeTroubleId, setActiveTroubleId] = useState(TROUBLESHOOTING_GUIDES[0].id);
  const [roleFilter, setRoleFilter] = useState("all"); // 'all', 'worker', 'bank'
  const [activeSectionTab, setActiveSectionTab] = useState("all"); // 'all', 'gateways', 'faqs', 'troubleshoot', 'helplines'

  // Filtered FAQs
  const visibleFaqs = useMemo(() => {
    return FAQS.filter((faq) => {
      const matchesCat = category === "all" || faq.c === category;
      if (!matchesCat) return false;

      const matchesRole = roleFilter === "all" || faq.role === roleFilter;
      return matchesRole;
    });
  }, [category, roleFilter]);

  const activeTroubleGuide = useMemo(() => {
    return TROUBLESHOOTING_GUIDES.find((g) => g.id === activeTroubleId) || TROUBLESHOOTING_GUIDES[0];
  }, [activeTroubleId]);

  const handleActionClick = (route) => {
    if (typeof navigateTo === "function") {
      navigateTo(route);
    } else {
      window.location.href = route;
    }
  };

  return (
    <main className="help-page-enhanced">
      {/* 1. CINEMATIC HERO SECTION WITH MODERN DASHBOARD SEARCHBAR */}
      <section className="help-hero-enhanced">
        <div className="help-hero-container">
          <div className="help-hero-kicker-pill">
            <Sparkles size={15} />
            <span>{copy.kicker}</span>
          </div>

          <h1 className="help-hero-title">
            {copy.title}
          </h1>

          <p className="help-hero-subtitle">
            {copy.sub}
          </p>

          {/* KPI RIBBON / QUICK STATUS STRIP */}
          <div className="help-kpi-strip">
            <div className="help-kpi-pill">
              <Zap size={14} className="kpi-icon-blue" />
              <span><strong>8 Live</strong> Engine Modules</span>
            </div>
            <div className="help-kpi-pill">
              <ShieldCheck size={14} className="kpi-icon-green" />
              <span><strong>8-Layer</strong> AI Forensics</span>
            </div>
            <div className="help-kpi-pill">
              <Headphones size={14} className="kpi-icon-purple" />
              <span><strong>Trilingual</strong> Voice Support</span>
            </div>
            <div className="help-kpi-pill">
              <PhoneCall size={14} className="kpi-icon-saffron" />
              <span><strong>24/7</strong> Official Helplines</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STRUCTURED MASTER SECTION NAVIGATION TABS */}
      <div className="help-section-tabs-bar">
        <div className="help-tabs-inner">
          <button
            className={`help-tab-btn ${activeSectionTab === "all" ? "active" : ""}`}
            onClick={() => setActiveSectionTab("all")}
          >
            <Compass size={16} />
            <span>All Hub Sections</span>
          </button>
          <button
            className={`help-tab-btn ${activeSectionTab === "gateways" ? "active" : ""}`}
            onClick={() => setActiveSectionTab("gateways")}
          >
            <Grid size={16} />
            <span>Dashboard Tools ({DASHBOARD_GATEWAYS.length})</span>
          </button>
          <button
            className={`help-tab-btn ${activeSectionTab === "faqs" ? "active" : ""}`}
            onClick={() => setActiveSectionTab("faqs")}
          >
            <HelpCircle size={16} />
            <span>Knowledge Base ({visibleFaqs.length})</span>
          </button>
          <button
            className={`help-tab-btn ${activeSectionTab === "troubleshoot" ? "active" : ""}`}
            onClick={() => setActiveSectionTab("troubleshoot")}
          >
            <Sliders size={16} />
            <span>Quick Issue Resolver</span>
          </button>
          <button
            className={`help-tab-btn ${activeSectionTab === "helplines" ? "active" : ""}`}
            onClick={() => setActiveSectionTab("helplines")}
          >
            <PhoneCall size={16} />
            <span>Helplines & Security</span>
          </button>
        </div>
      </div>

      <div className="help-content-container">
        {/* ==================================================================
            SECTION A: 8 DASHBOARD GATEWAY TILES
            ================================================================== */}
        {(activeSectionTab === "all" || activeSectionTab === "gateways") && (
          <section className="help-quick-gateways-section">
            <div className="help-section-heading">
              <div className="help-eyebrow">
                <Layers size={14} />
                <span>Ecosystem Quick Access</span>
              </div>
              <h2>{copy.gatewaysHeading}</h2>
              <p>{copy.gatewaysSub}</p>
            </div>

            <div className="help-gateway-grid">
              {DASHBOARD_GATEWAYS.map((gw, idx) => {
                const IconComponent = gw.icon;
                return (
                  <div
                    key={idx}
                    className="help-gateway-card"
                    onClick={() => handleActionClick(gw.route)}
                  >
                    <div className="help-gateway-top">
                      <div className="help-gateway-icon-box">
                        <IconComponent size={22} />
                      </div>
                      <span className="help-gateway-badge">{gw.badge[language] || gw.badge.en}</span>
                    </div>
                    <h3 className="help-gateway-title">{gw.title[language] || gw.title.en}</h3>
                    <p className="help-gateway-desc">{gw.desc[language] || gw.desc.en}</p>
                    <div className="help-gateway-footer">
                      <span>Launch Engine</span>
                      <ArrowRight size={14} />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ==================================================================
            SECTION B: THREE-PILLAR ARCHITECTURE VISUAL PIPELINE
            ================================================================== */}
        {(activeSectionTab === "all" || activeSectionTab === "gateways") && (
          <section className="help-architecture-section">
            <div className="help-section-heading">
              <div className="help-eyebrow">
                <Scale size={14} />
                <span>Verification Pipeline</span>
              </div>
              <h2>{copy.architectureHeading}</h2>
              <p>{copy.architectureSub}</p>
            </div>

            <div className="help-architecture-grid">
              {/* Step 1 */}
              <div className="arch-card">
                <div className="arch-step-badge">STEP 01</div>
                <div className="arch-icon-box">
                  <Smartphone size={22} />
                </div>
                <h4>Worker Mobile Intake</h4>
                <p>QR scanning & Aadhaar e-KYC direct from worker smartphone.</p>
                <div className="arch-tag">Verhoeff 12-Digit</div>
              </div>

              <div className="arch-connector">➔</div>

              {/* Step 2 */}
              <div className="arch-card arch-card-featured">
                <div className="arch-step-badge">STEP 02</div>
                <div className="arch-icon-box">
                  <ShieldCheck size={22} />
                </div>
                <h4>8-Layer AI Anti-Fraud</h4>
                <p>EXIF metadata, ELA pixel forensics, OCR & duplicate check.</p>
                <div className="arch-tag">Zero Tampering</div>
              </div>

              <div className="arch-connector">➔</div>

              {/* Step 3 */}
              <div className="arch-card">
                <div className="arch-step-badge">STEP 03</div>
                <div className="arch-icon-box">
                  <Building2 size={22} />
                </div>
                <h4>Bank Disbursal</h4>
                <p>1-Click underwriter sanction to Jan Dhan Aadhaar account.</p>
                <div className="arch-tag">Instant Sachet Rails</div>
              </div>
            </div>
          </section>
        )}

        {/* ==================================================================
            SECTION C: INTERACTIVE QUICK ISSUE RESOLVER
            ================================================================== */}
        {(activeSectionTab === "all" || activeSectionTab === "troubleshoot") && (
          <section className="help-troubleshooter-section">
            <div className="help-section-heading">
              <div className="help-eyebrow">
                <AlertCircle size={14} />
                <span>{copy.troubleKicker}</span>
              </div>
              <h2>{copy.troubleHeading}</h2>
              <p>{copy.troubleSub}</p>
            </div>

            <div className="help-trouble-layout">
              {/* Left Tab List */}
              <div className="help-trouble-tabs">
                {TROUBLESHOOTING_GUIDES.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTroubleId === item.id;
                  return (
                    <button
                      key={item.id}
                      className={`help-trouble-tab-btn ${isActive ? "active" : ""}`}
                      onClick={() => setActiveTroubleId(item.id)}
                    >
                      <div className="trouble-tab-icon-wrap">
                        <Icon size={18} />
                      </div>
                      <div className="trouble-tab-text">
                        <span className="trouble-tab-tag">{item.tag[language] || item.tag.en}</span>
                        <span className="trouble-tab-title">{item.title[language] || item.title.en}</span>
                      </div>
                      <ChevronRight size={16} className="trouble-chevron" />
                    </button>
                  );
                })}
              </div>

              {/* Right Solution Box */}
              <div className="help-trouble-solution-card">
                <div className="solution-card-header">
                  <span className="solution-header-badge">
                    <CheckCircle2 size={13} />
                    <span>Verified Resolution Guide</span>
                  </span>
                  <h3>{activeTroubleGuide.title[language] || activeTroubleGuide.title.en}</h3>
                </div>

                <div className="solution-steps-list">
                  {(activeTroubleGuide.steps[language] || activeTroubleGuide.steps.en).map((step, idx) => (
                    <div key={idx} className="solution-step-item">
                      <div className="step-num-bullet">{idx + 1}</div>
                      <p>{step.replace(/^[0-9]+\.\s*/, "")}</p>
                    </div>
                  ))}
                </div>

                <div className="solution-action-row">
                  <button
                    className="solution-launch-btn"
                    onClick={() => handleActionClick(activeTroubleGuide.actionRoute)}
                  >
                    <span>{activeTroubleGuide.actionText[language] || activeTroubleGuide.actionText.en}</span>
                    <ExternalLink size={14} />
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ==================================================================
            SECTION D: CATEGORIZED KNOWLEDGE BASE & ACCORDIONS
            ================================================================== */}
        {(activeSectionTab === "all" || activeSectionTab === "faqs") && (
          <section className="help-faq-main-section">
            <div className="help-faq-layout">
              {/* Left Sidebar Category Navigator */}
              <aside className="help-category-sidebar">
                <div className="category-sidebar-header">
                  <Filter size={16} />
                  <h3>{copy.browseTopics}</h3>
                </div>

                {/* Role Switcher Pill Bar */}
                <div className="role-filter-container">
                  <button
                    className={`role-pill ${roleFilter === "all" ? "active" : ""}`}
                    onClick={() => setRoleFilter("all")}
                  >
                    All Roles
                  </button>
                  <button
                    className={`role-pill ${roleFilter === "worker" ? "active" : ""}`}
                    onClick={() => setRoleFilter("worker")}
                  >
                    Worker
                  </button>
                  <button
                    className={`role-pill ${roleFilter === "bank" ? "active" : ""}`}
                    onClick={() => setRoleFilter("bank")}
                  >
                    Bank Admin
                  </button>
                </div>

                <div className="category-sidebar-nav">
                  {Object.entries(topics).map(([key, label]) => {
                    const count = FAQS.filter(
                      (f) =>
                        (key === "all" || f.c === key) &&
                        (roleFilter === "all" || f.role === roleFilter)
                    ).length;

                    return (
                      <button
                        key={key}
                        className={`category-nav-btn ${category === key ? "active" : ""}`}
                        onClick={() => setCategory(key)}
                      >
                        <span>{label}</span>
                        <span className="cat-count-badge">{count}</span>
                      </button>
                    );
                  })}
                </div>
              </aside>

              {/* Right FAQ Accordions */}
              <div className="help-faq-content-pane">
                <div className="faq-pane-header">
                  <div>
                    <span className="faq-category-eyebrow">{topics[category]}</span>
                    <h2>Frequently Asked Questions</h2>
                  </div>
                  <span className="faq-count-pill">
                    {visibleFaqs.length} {copy.answersFound}
                  </span>
                </div>

                {visibleFaqs.length > 0 ? (
                  <div className="faq-accordion-group">
                    {visibleFaqs.map((faq) => {
                      const isOpen = openFaq === faq.id;
                      const qText = faq[language]?.[0] || faq.en[0];
                      const aText = faq[language]?.[1] || faq.en[1];

                      return (
                        <div
                          key={faq.id}
                          className={`faq-card-item ${isOpen ? "open" : ""}`}
                        >
                          <button
                            className="faq-question-btn"
                            onClick={() => setOpenFaq(isOpen ? null : faq.id)}
                            aria-expanded={isOpen}
                          >
                            <div className="faq-question-text">
                              <div className="faq-item-meta-row">
                                <span className="faq-item-topic-tag">{topics[faq.c] || faq.c}</span>
                                <span className={`faq-role-badge ${faq.role}`}>
                                  {faq.role === "bank" ? "Bank Console" : "Worker Portal"}
                                </span>
                              </div>
                              <h4>{qText}</h4>
                            </div>
                            <div className="faq-toggle-icon-wrap">
                              <ChevronDown size={18} />
                            </div>
                          </button>

                          {isOpen && (
                            <div className="faq-answer-panel">
                              <p>{aText}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="help-no-results-box">
                    <AlertCircle size={36} />
                    <h3>{copy.noFaqTitle}</h3>
                    <p>{copy.noFaqSub}</p>
                    <button
                      className="category-nav-btn active"
                      style={{ marginTop: "10px", width: "auto", display: "inline-flex", padding: "8px 16px" }}
                      onClick={() => {
                        setCategory("all");
                        setRoleFilter("all");
                      }}
                    >
                      {copy.viewAllBtn}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* ==================================================================
            SECTION E: OFFICIAL HELPLINES & SECURITY ADVISORY
            ================================================================== */}
        {(activeSectionTab === "all" || activeSectionTab === "helplines") && (
          <>
            <section className="help-helplines-section">
              <div className="help-section-heading">
                <div className="help-eyebrow">
                  <PhoneCall size={14} />
                  <span>Government Support</span>
                </div>
                <h2>{copy.helplineTitle}</h2>
                <p>{copy.helplineSub}</p>
              </div>

              <div className="helpline-cards-grid">
                {HELPLINES.map((h, i) => {
                  const Icon = h.icon;
                  const svcName = language === "hi" ? h.serviceHi : language === "gu" ? h.serviceGu : h.service;
                  const timingText = language === "hi" ? h.timingHi : language === "gu" ? h.timingGu : h.timing;

                  return (
                    <div key={i} className="helpline-card">
                      <div className="helpline-card-header">
                        <div className="helpline-icon-box">
                          <Icon size={20} />
                        </div>
                        <span className="helpline-badge">{h.badge}</span>
                      </div>
                      <h4>{svcName}</h4>
                      <div className="helpline-number-row">
                        <a href={`tel:${h.number.replace(/[^0-9]/g, "")}`} className="helpline-tel-link">
                          <PhoneCall size={15} />
                          <span>{h.number}</span>
                        </a>
                        <div className="helpline-timing">{timingText}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Zero Fee & Anti-Fraud Security Guarantee */}
            <section className="help-security-advisory-banner">
              <div className="security-banner-icon-col">
                <ShieldAlert size={32} className="shield-alert-icon" />
              </div>
              <div className="security-banner-content-col">
                <span className="security-banner-pill">{copy.safetyBadge}</span>
                <h3>{copy.safetyHeadline}</h3>
                <p>{copy.safetyBody}</p>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
