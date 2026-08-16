/**
 * HOME PAGE VOICE GUIDANCE INTENTS & KNOWLEDGE ENGINE
 * Supports: English, Hindi (Devanagari), Gujarati (Script), Hinglish, Gujlish.
 * Automatically maps natural spoken queries to:
 * - LOAN_REQUEST -> Opens / Renders Application Form (Step 3) & scrolls to #application-journey
 * - GOVERNMENT_SCHEMES -> Smoothly scrolls to #schemes-section
 * - DOCUMENT_REQUIREMENTS / E_KYC -> Opens KYC & Documents (Step 2)
 * - ELIGIBILITY_CHECK -> Opens Income Calculator (Step 1)
 * - APPLICATION_STATUS -> Opens Live Status Tracker (Step 4)
 * - CREDIT_SCORE / CREDIT_HISTORY -> Expands Advanced Credit Analytics
 * - REPAYMENT -> Expands Sachet Daily EDI Repayment Planner
 * - BANKING_HELP / HELP -> Navigates to /help
 * - ADMIN_DASHBOARD -> Navigates to /admin
 * - AI_ASSISTANT -> Navigates to /financial-twin
 * - LANGUAGE_SWITCH -> Dynamically changes app language (en / hi / gu)
 */

export const HOME_VOICE_INTENTS = {
  LANGUAGE_SWITCH: {
    patterns: [
      "hindi me", "hindi bolo", "hindi", "gujarati ma", "gujarati bolo", "gujarati", "english me", "speak english", "english",
      "हिन्दी में", "हिंदी में", "हिन्दी बोलो", "हिंदी", "ગુજરાતીમાં", "ગુજરાતી બોલો", "ગુજરાતી", "અંગ્રેજી"
    ],
    responses: {
      en: "Language set to English. How can I help you today?",
      hi: "भाषा बदलकर हिन्दी कर दी गई है। मैं आपकी क्या सहायता कर सकता हूँ?",
      gu: "ભાષા બદલીને ગુજરાતી કરવામાં આવી છે. હું તમારી શું મદદ કરી શકું?",
    },
    action: (handlers, rawPhrase) => {
      const p = rawPhrase.toLowerCase();
      if (p.includes("hindi") || p.includes("हिन्दी") || p.includes("हिंदी")) {
        handlers.changeLang && handlers.changeLang("hi");
      } else if (p.includes("gujarati") || p.includes("ગુજરાતી")) {
        handlers.changeLang && handlers.changeLang("gu");
      } else if (p.includes("english") || p.includes("અંગ્રેજી") || p.includes("अंग्रेजी")) {
        handlers.changeLang && handlers.changeLang("en");
      }
    },
  },

  DOCUMENT_REQUIREMENTS: {
    patterns: [
      "document", "documents", "kagaz", "kagjat", "aadhaar", "aadhar", "pan", "passbook", "statement", "kyc", "ekyc", "proof",
      "दस्तावेज", "दस्तावेज़", "कागजात", "आधार", "केवाईसी", "पासबुक", "दस्तावेजो", "દસ્તાવેજ", "દસ્તાવેજો", "આધાર", "પાસબુક"
    ],
    responses: {
      en: "For worker micro-loans and schemes, you only need your Aadhaar card and bank passbook or UPI statement. Opening the e-KYC verification section.",
      hi: "ऋण और सरकारी योजनाओं के लिए केवल आधार कार्ड और बैंक पासबुक या यूपीआई विवरण की आवश्यकता होती है। ई-केवाईसी सेक्शन खोला जा रहा है।",
      gu: "લોન અને સરકારી યોજનાઓ માટે માત્ર આધાર કાર્ડ અને બેંક પાસબુક અથવા UPI વિગતોની જરૂર છે. ઈ-KYC સેક્શન ખોલાઈ રહ્યું છે.",
    },
    action: (handlers) => {
      handlers.scrollToSection("application-journey");
      handlers.onTriggerStep && handlers.onTriggerStep(2);
    },
  },

  CREDIT_SCORE: {
    patterns: [
      "credit score", "cibil", "upi score", "credit report", "credit history", "cibil score",
      "क्रेडिट स्कोर", "सिबिल", "स्कोर", "ક્રેડિટ સ્કોર", "સિબિલ", "સ્કોર"
    ],
    responses: {
      en: "Informal workers do not need a CIBIL score. We generate a fair score from your daily QR and UPI transactions. Opening advanced credit analytics.",
      hi: "असंगठित कामगारों के लिए CIBIL की आवश्यकता नहीं होती। हम UPI इतिहास से निष्पक्ष वैकल्पिक क्रेडिट स्कोर बनाते हैं।",
      gu: "અસંગઠિત શ્રમિકો માટે CIBIL ની જરૂર નથી. અમે UPI વ્યવહારોથી વાજબી વૈકલ્પિક ક્રેડિટ સ્કોર બનાવીએ છીએ.",
    },
    action: (handlers) => {
      handlers.scrollToSection("application-journey");
      handlers.onOpenAdvanced && handlers.onOpenAdvanced(true);
    },
  },

  REPAYMENT: {
    patterns: [
      "repay", "repayment", "edi", "daily payment", "installment", "emi", "sachet", "daily deduction", "bhugtan", "kist", "hafto",
      "भुगतान", "किस्त", "ईएमआई", "दैनिक भुगतान", "रीपेमेंट", "ચુકવણી", "હપ્તો", "દૈનિક ચુકવણી", "રિપેમેન્ટ"
    ],
    responses: {
      en: "Sachet loans replace burdensome monthly EMIs with small daily repayments of ₹50 to ₹100 aligned with your daily cashflow. Opening the sachet repayment planner.",
      hi: "सचेत माइक्रो-लोन में कोई भारी मासिक ईएमआई नहीं होती। रोज़ाना ₹50 से ₹100 का आसान दैनिक भुगतान (EDI) होता है।",
      gu: "સાશે માઇક્રો-લોનમાં કોઈ મોટી માસિક EMI હોતી નથી. રોજના માત્ર ₹50 થી ₹100 ની સરળ દૈનિક ચુકવણી (EDI) થાય છે.",
    },
    action: (handlers) => {
      handlers.scrollToSection("application-journey");
      handlers.onOpenAdvanced && handlers.onOpenAdvanced(true);
    },
  },

  APPLICATION_STATUS: {
    patterns: [
      "status", "track", "tracker", "kahan tak pahuncha", "stithi", "tracking", "application status", "check status",
      "स्थिति", "ट्रैक", "स्टेटस", "आवेदन स्थिति", "સ્ટેટસ", "ટ્રેક", "સ્થિતિ", "અરજી સ્થિતિ"
    ],
    responses: {
      en: "You can track your live loan application status, bank review, and sanction progress here.",
      hi: "आप अपने ऋण आवेदन का लाइव स्टेटस और बैंक सत्यापन चरण यहाँ ट्रैक कर सकते हैं।",
      gu: "તમે તમારી લોન અરજીનું લાઈવ સ્ટેટસ અને બેંક વેરિફિકેશન સ્ટેજ અહીં ટ્રેક કરી શકો છો.",
    },
    action: (handlers) => {
      handlers.scrollToSection("application-journey");
      handlers.onTriggerStep && handlers.onTriggerStep(4);
    },
  },

  ELIGIBILITY_CHECK: {
    patterns: [
      "eligibility", "calculate", "calculator", "patrata", "yogya", "limit", "kitna milega", "ketli malshe", "how much loan",
      "पात्रता", "कैलकुलेटर", "सीमा", "कितना मिलेगा", "पात्र", "પાત્રતા", "કેલ્ક્યુલેટર", "મર્યાદા", "કેટલા મળશે"
    ],
    responses: {
      en: "Use our real-time calculator to estimate your micro-loan limit based on your daily income and expenses.",
      hi: "पात्रता कैलकुलेटर से आप अपनी दैनिक कमाई और खर्च के आधार पर सटीक लोन सीमा तुरंत जांच सकते हैं।",
      gu: "પાત્રતા કેલ્ક્યુલેટરથી તમે તમારી દૈનિક આવક અને ખર્ચ મુજબ સચોટ લોન મર્યાદા ચકાસી શકો છો.",
    },
    action: (handlers) => {
      handlers.scrollToSection("application-journey");
      handlers.onTriggerStep && handlers.onTriggerStep(1);
    },
  },

  GOVERNMENT_SCHEMES: {
    patterns: [
      "scheme", "schemes", "goverment scheme", "goverment schemes", "government scheme", "government schemes", "gov scheme", "gov schemes",
      "sarkari yojana", "sarkari yojna", "sarkari scheme", "sarkari yojanao", "yojana", "yojna", "yojanao", "yojanaen", "yojnaen",
      "eshram", "e-shram", "jandhan", "jan dhan", "pmsym", "pm-sym", "pension", "bima", "svanidhi", "pm svanidhi", "swarnidhi",
      "ayushman", "pmjay", "mudra", "vishwakarma", "labharthi", "shramik card", "patrata", "eligibility", "eligible",
      "योजना", "योजनाएं", "योजनाओं", "सरकारी योजना", "सरकारी योजनाएं", "सरकारी योजनाओ", "सरकारी स्कीम", "स्कीम", "ईश्रम", "ई-श्रम", "जनधन", "जन धन", "पेंशन", "पीएम स्वनिधि", "स्वनिधि", "आयुष्मान", "पीएमजेएवाई", "बीमा", "श्रमिक कार्ड", "पात्रता", "सरकारी लाभ",
      "યોજના", "યોજનાઓ", "સરકારી યોજના", "સરકારી યોજનાઓ", "સરકારી સ્કીમ", "સરકારી સહાય", "સ્કીમ", "ઈ-શ્રમ", "જન ધન", "પેન્શન", "પીએમ સ્વનિધિ", "સ્વનિધિ", "આયુષ્માન", "વીમો", "શ્રમિક કાર્ડ", "પાત્રતા"
    ],
    responses: {
      en: "Taking you to Sahayata AI Assistant. Let us check whether you are eligible for government schemes or not. Please provide your details to begin.",
      hi: "मैं आपको सहायता AI सहायक पेज पर ले जा रहा हूँ। आइए जांचते हैं कि आप कौन-कौन सी सरकारी योजनाओं के लिए पात्र हैं या नहीं। कृपया अपना नाम और विवरण बताएं।",
      gu: "હું તમને સહાયતા AI સહાયક પેજ પર લઈ જઈ રહ્યો છું. ચાલો જોઈએ કે તમે કઈ સરકારી યોજનાઓ માટે પાત્ર છો કે નહીં. કૃપા કરીને તમારું નામ અને વિગતો જણાવો.",
    },
    action: (handlers) => {
      handlers.navigateTo("/financial-twin");
    },
  },

  BANKING_HELP: {
    patterns: [
      "help", "madad", "support", "contact", "customer care", "helpline", "phone", "grievance",
      "मदद", "सहायता", "हेल्प", "संपर्क", "कस्टमर केयर", "સહાય", "મદદ", "સંપર્ક", "હેલ્પલાઇન"
    ],
    responses: {
      en: "Welcome to the Sahayata Help Center. You can find comprehensive guidelines and support details here.",
      hi: "सहायता केंद्र में आपका स्वागत है। यहाँ सभी योजनाओं, दिशानिर्देशों और सहायता संपर्कों की पूरी जानकारी है।",
      gu: "સહાયતા કેન્દ્રમાં આપનું સ્વાગત છે. અહીં બધી યોજનાઓ, માર્ગદર્શિકા અને સહાય સંપર્કોની સંપૂર્ણ માહિતી છે.",
    },
    action: (handlers) => {
      handlers.navigateTo("/help");
    },
  },

  ADMIN_DASHBOARD: {
    patterns: [
      "admin", "banker", "bank dashboard", "analytics", "command center", "officer",
      "एडमिन", "बैंक डैशबोर्ड", "एनालिटिक्स", "બેંક ડેશબોર્ડ", "એડમિન"
    ],
    responses: {
      en: "Opening the Bank Partner Analytics and Underwriting Command Dashboard.",
      hi: "बैंक पार्टनर एनालिटिक्स एवं अंडरराइटिंग डैशबोर्ड खोला जा रहा है।",
      gu: "બેંક પાર્ટનર એનાલિટિક્સ અને અંડરરાઇટિંગ ડેશબોર્ડ ખોલાઈ રહ્યું છે.",
    },
    action: (handlers) => {
      handlers.navigateTo("/admin");
    },
  },

  AI_ASSISTANT: {
    patterns: [
      "sai assistant", "sai ai", "financial twin", "chatbot", "deep ai", "chat with ai",
      "एआई सहायक", "साई सहायक", "ચેટબોટ", "AI સહાયક"
    ],
    responses: {
      en: "Opening SAI Financial Inclusion AI Assistant for interactive profiling.",
      hi: "गिग कामगारों के लिए SAI वित्तीय समावेशी एआई सहायक खोला जा रहा है।",
      gu: "ગીગ વર્કર્સ માટે SAI નાણાકીય AI સહાયક ખોલાઈ રહ્યો છે.",
    },
    action: (handlers) => {
      handlers.navigateTo("/financial-twin");
    },
  },

  PROBLEM_BARRIERS: {
    patterns: [
      "barrier", "obstacles", "why credit out of reach", "why loan reject", "dikkot",
      "बाधा", "समस्याएं", "तकलीफ", "મુશ્કેલીઓ"
    ],
    responses: {
      en: "Here are the main obstacles informal workers face when seeking credit and how Sahayata solves them.",
      hi: "यहाँ असंगठित कामगारों को ऋण मिलने में आने वाली मुख्य बाधाएं और सहायता का समाधान प्रस्तुत है।",
      gu: "અહીં અસંગઠિત શ્રમિકોને લોન મળવામાં આવતી મુખ્ય મુશ્કેલીઓ અને સહાયતાનો ઉકેલ દર્શાવેલ છે.",
    },
    action: (handlers) => {
      handlers.scrollToSection("problem-section");
    },
  },

  LOAN_REQUEST: {
    patterns: [
      "loan", "credit", "borrow", "udhar", "paiso", "paisa", "paise", "rupaye", "rupiya",
      "लोन", "ऋण", "उधार", "पैसे", "पैसा", "रुपये", "સ્વનિધિ", "લોન", "ઉધાર", "પૈસા", "રૂપિયા",
      "swarnidhi", "svanidhi", "sachet", "working capital", "micro loan", "apply"
    ],
    responses: {
      en: "Certainly! You can get a collateral-free sachet loan from ₹10,000 to ₹50,000 with 7% interest subsidy. Opening the loan application form now.",
      hi: "हाँ बिल्कुल! आप बिना किसी गारंटी के ₹10,000 से ₹50,000 तक का सचेत लोन ले सकते हैं। मैं आपको आवेदन फॉर्म पर ले जा रहा हूँ।",
      gu: "ચોક્કસ! તમે કોઈપણ ગેરંટી વગર ₹10,000 થી ₹50,000 સુધીની સાશે લોન મેળવી શકો છો. હું તમને અરજી ફોર્મ પર લઈ જઈ રહ્યો છું.",
    },
    action: (handlers) => {
      handlers.scrollToSection("application-journey");
      handlers.onTriggerStep && handlers.onTriggerStep(3);
    },
  },
};

export function detectHomeVoiceIntent(phrase, lang = "en") {
  const clean = (phrase || "").toLowerCase().trim();
  if (!clean) return null;

  if (
    clean.includes("hindi me") || clean.includes("hindi bolo") || clean.includes("हिन्दी में") || clean.includes("हिंदी में") ||
    clean.includes("gujarati ma") || clean.includes("gujarati bolo") || clean.includes("ગુજરાતીમાં") || clean.includes("ગુજરાતી બોલો") ||
    clean.includes("english me") || clean.includes("speak english")
  ) {
    let targetLang = "en";
    if (clean.includes("hindi") || clean.includes("हिन्दी") || clean.includes("हिंदी")) targetLang = "hi";
    else if (clean.includes("gujarati") || clean.includes("ગુજરાતી")) targetLang = "gu";

    return {
      intentKey: "LANGUAGE_SWITCH",
      responseText: HOME_VOICE_INTENTS.LANGUAGE_SWITCH.responses[targetLang],
      targetLang,
      action: (handlers) => HOME_VOICE_INTENTS.LANGUAGE_SWITCH.action(handlers, clean),
    };
  }

  // Ordered check through intent dictionary
  for (const [key, config] of Object.entries(HOME_VOICE_INTENTS)) {
    if (key === "LANGUAGE_SWITCH") continue;
    const isMatch = config.patterns.some((pattern) => clean.includes(pattern));
    if (isMatch) {
      return {
        intentKey: key,
        responseText: config.responses[lang] || config.responses.en,
        action: config.action,
      };
    }
  }

  const fallbackText = {
    en: "I can help you check your loan eligibility, discover government schemes like PM SVANidhi, or upload documents. What would you like to explore?",
    hi: "मैं आपको लोन पात्रता जांचने, PM स्वनिधि जैसी सरकारी योजनाएं खोजने या दस्तावेज अपलोड करने में मदद कर सकता हूँ। आप क्या जानना चाहते हैं?",
    gu: "હું તમને લોન પાત્રતા ચકાસવા, PM સ્વનિધિ જેવી સરકારી યોજનાઓ શોધવા અથવા દસ્તાવેજ અપલોડ કરવામાં મદદ કરી શકું છું. તમે શું જાણવા માંગો છો?",
  };

  return {
    intentKey: "GENERAL_GUIDE",
    responseText: fallbackText[lang] || fallbackText.en,
    action: (handlers) => {
      handlers.scrollToSection("application-journey");
    },
  };
}

export const QUICK_SUGGESTIONS = {
  en: [
    { label: "I need a loan", query: "I need a loan" },
    { label: "Government schemes", query: "Show government schemes" },
    { label: "Required documents", query: "What documents do I need?" },
    { label: "Check eligibility", query: "Check my eligibility" },
  ],
  hi: [
    { label: "मुझे लोन चाहिए", query: "मुझे लोन चाहिए" },
    { label: "सरकारी योजनाएं", query: "सरकारी योजनाएं दिखाओ" },
    { label: "कौन से दस्तावेज चाहिए?", query: "कौन से दस्तावेज चाहिए?" },
    { label: "मेरी पात्रता जांचो", query: "मेरी पात्रता जांचो" },
  ],
  gu: [
    { label: "મારે લોન જોઈએ છે", query: "મારે લોન જોઈએ છે" },
    { label: "સરકારી યોજનાઓ", query: "સરકારી યોજનાઓ બતાવો" },
    { label: "કયા દસ્તાવેજો જોઈએ?", query: "કયા દસ્તાવેજો જોઈએ?" },
    { label: "મારી પાત્રતા તપાસો", query: "મારી પાત્રતા તપાસો" },
  ],
};
