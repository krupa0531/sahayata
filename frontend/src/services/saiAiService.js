/**
 * SAI (Sahayata AI Assistant) UNIFIED MULTILINGUAL CONVERSATIONAL ENGINE
 * Supports English (en), Pure Hindi Devanagari (hi), and Pure Gujarati Script (gu).
 *
 * Architecture:
 * - One AI -> Three Languages -> One Continuous Conversation.
 * - Preserves conversational context across language switching.
 * - Dynamic System Prompt for Gemini / LLMs.
 * - Trilingual STT (Speech Recognition) and TTS (Speech Synthesis).
 * - Contextual fallback reasoning engine when offline.
 */

import { queryRagApi } from "../api.js";

export const SUPPORTED_LANGUAGES = [
  { code: "en", label: "English", nativeLabel: "English", locale: "en-IN" },
  { code: "hi", label: "Hindi", nativeLabel: "हिन्दी", locale: "hi-IN" },
  { code: "gu", label: "Gujarati", nativeLabel: "ગુજરાતી", locale: "gu-IN" },
];

export function getSavedSaiLanguage() {
  const saved = localStorage.getItem("sahayata_lang") || localStorage.getItem("sai_language");
  return ["en", "hi", "gu"].includes(saved) ? saved : "en";
}

export function saveSaiLanguage(lang) {
  const code = ["en", "hi", "gu"].includes(lang) ? lang : "en";
  localStorage.setItem("sahayata_lang", code);
  localStorage.setItem("sai_language", code);
  window.dispatchEvent(new CustomEvent("sahayata_lang_change", { detail: { lang: code } }));
  window.dispatchEvent(new CustomEvent("sai_language_switch", { detail: { lang: code } }));
  return code;
}

// Immediate feedback message when user switches language
export const LANGUAGE_SWITCH_MESSAGES = {
  en: "Hello! I will now speak with you in English. Feel free to ask me anything about loans, government schemes, or financial guidance.",
  hi: "नमस्ते! अब मैं आपसे हिंदी में बात करूंगा। आप मुझसे लोन, सरकारी योजनाओं या वित्तीय मार्गदर्शन के बारे में कुछ भी पूछ सकते हैं।",
  gu: "હવે હું તમારી સાથે ગુજરાતીમાં વાત કરીશ. તમે મને લોન, સરકારી યોજનાઓ અથવા નાણાકીય માર્ગદર્શન વિશે કોઈપણ પ્રશ્ન પૂછી શકો છો.",
};

// Natural Financial Terminology Dictionary for UI & Prompts
export const SAI_UI_DICTIONARY = {
  en: {
    title: "SAI Financial Assistant",
    subtitle: "AI Financial Inclusion Twin for Gig Workers & Micro-Borrowers",
    languageLabel: "Language",
    placeholder: "Ask about PM SVANidhi, sachet loans, e-Shram, CIBIL, or upload statement...",
    voiceBtn: "Voice",
    listening: "Listening...",
    processing: "SAI is analyzing...",
    speaking: "Speaking...",
    send: "Send",
    newChat: "New Conversation",
    antiFraudAudit: "Anti-Fraud Audit",
    exitHome: "Exit to Home",
    uploadDoc: "Upload Documents",
    authSubmit: "Authorize & Submit Application",
    scoreLabel: "Sahayata Score",
    errorMic: "Microphone access error. Please check permissions.",
    errorGeneral: "Could not generate response. Please try again.",
    terms: {
      cibil: "CIBIL Score",
      creditHistory: "Credit History",
      loan: "Loan",
      scheme: "Government Scheme",
      repayment: "Repayment",
      sachet: "Sachet Micro-Loan",
      edi: "Daily EDI Repayment",
      ekyc: "Aadhaar e-KYC",
      fraudCheck: "8-Layer Anti-Fraud Check",
    },
  },
  hi: {
    title: "SAI वित्तीय सहायक",
    subtitle: "गिग कामगारों और छोटे ऋणधारकों के लिए एआई वित्तीय समावेशी ट्विन",
    languageLabel: "भाषा",
    placeholder: "PM स्वनिधि, सचेत लोन, ई-श्रम, CIBIL स्कोर या स्टेटमेंट के बारे में पूछें...",
    voiceBtn: "आवाज़",
    listening: "सुन रहा हूँ...",
    processing: "SAI विश्लेषण कर रहा है...",
    speaking: "बोल रहा हूँ...",
    send: "भेजें",
    newChat: "नई बातचीत",
    antiFraudAudit: "धोखाधड़ी रोधी ऑडिट",
    exitHome: "होम पर वापस जाएं",
    uploadDoc: "दस्तावेज़ अपलोड करें",
    authSubmit: "आवेदन अधिकृत करें और जमा करें",
    scoreLabel: "सहायता स्कोर",
    errorMic: "माइक्रोफ़ोन एक्सेस त्रुटि। कृपया अनुमति जांचें।",
    errorGeneral: "उत्तर तैयार करने में असमर्थ। कृपया पुनः प्रयास करें।",
    terms: {
      cibil: "CIBIL स्कोर",
      creditHistory: "क्रेडिट हिस्ट्री",
      loan: "लोन / ऋण",
      scheme: "सरकारी योजना",
      repayment: "भुगतान / रीपेमेंट",
      sachet: "सचेत माइक्रो-लोन",
      edi: "दैनिक EDI भुगतान",
      ekyc: "आधार ई-केवाईसी",
      fraudCheck: "8-स्तरीय धोखाधड़ी जांच",
    },
  },
  gu: {
    title: "SAI નાણાકીય સહાયક",
    subtitle: "ગીગ વર્કર્સ અને નાના ઉધારકર્તાઓ માટે AI ફાઇનાન્શિયલ ઇન્ક્લુઝન ટ્વિન",
    languageLabel: "ભાષા",
    placeholder: "PM સ્વનિધિ, સાશે લોન, ઈ-શ્રમ, CIBIL સ્કોર અથવા સ્ટેટમેન્ટ વિશે પૂછો...",
    voiceBtn: "અવાજ",
    listening: "સાંભળી રહ્યો છું...",
    processing: "SAI વિશ્લેષણ કરી રહ્યો છે...",
    speaking: "બોલી રહ્યો છું...",
    send: "મોકલો",
    newChat: "નવી વાતચીત",
    antiFraudAudit: "છેતરપિંડી વિરોધી ઓડિટ",
    exitHome: "હોમ પર પાછા જાઓ",
    uploadDoc: "દસ્તાવેજ અપલોડ કરો",
    authSubmit: "અરજી અધિકૃત કરો અને સબમિટ કરો",
    scoreLabel: "સહાયતા સ્કોર",
    errorMic: "માઇક્રોફોન એક્સેસ ત્રુટિ. કૃપા કરીને પરવાનગી ચકાસો.",
    errorGeneral: "જવાબ મેળવવામાં અસમર્થ. કૃપા કરીને ફરી પ્રયાસ કરો.",
    terms: {
      cibil: "CIBIL સ્કોર",
      creditHistory: "ક્રેડિટ હિસ્ટ્રી",
      loan: "લોન",
      scheme: "સરકારી યોજના",
      repayment: "ચુકવણી / રિપેમેન્ટ",
      sachet: "સાશે માઇક્રો-લોન",
      edi: "દૈનિક EDI ચુકવણી",
      ekyc: "આધાર ઈ-KYC",
      fraudCheck: "૮-સ્તરીય છેતરપિંડી તપાસ",
    },
  },
};

/**
 * Speech Recognition Locale Mapper
 */
export function getRecognitionLocale(lang = "en") {
  const map = { en: "en-IN", hi: "hi-IN", gu: "gu-IN" };
  return map[lang] || "en-IN";
}

/**
 * Speech Synthesis (TTS) Helper
 */
export function speakSaiUtterance(text, lang = "en", callbacks = {}) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();

  const cleanText = text
    .replace(/\bSAI\b/gi, "Sai")
    .replace(/[*#_`]/g, "")
    .replace(/₹/g, lang === "hi" ? " रुपये " : lang === "gu" ? " રૂપિયા " : " Rupees ")
    .slice(0, 350);

  const utterance = new SpeechSynthesisUtterance(cleanText);
  const targetLocale = getRecognitionLocale(lang);
  utterance.lang = targetLocale;

  const voices = window.speechSynthesis.getVoices();
  if (voices && voices.length > 0) {
    let matchedVoice = null;
    if (lang === "hi") {
      matchedVoice = voices.find(v => v.lang.startsWith("hi") || v.name.includes("Google Hindi") || v.name.includes("hi-IN"));
    } else if (lang === "gu") {
      matchedVoice = voices.find(v => v.lang.startsWith("gu") || v.name.includes("Google Gujarati") || v.name.includes("gu-IN"));
    } else {
      matchedVoice = voices.find(v => (v.lang === "en-IN" || v.lang.startsWith("en")) && (v.name.includes("Indian") || v.name.includes("Prabhat") || v.name.includes("Google UK English Male")));
    }

    if (!matchedVoice) {
      matchedVoice = voices.find(v => v.lang.startsWith(lang));
    }
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }
  }

  utterance.pitch = 1.0;
  utterance.rate = 0.95;
  utterance.volume = 1.0;

  if (callbacks.onStart) utterance.onstart = callbacks.onStart;
  if (callbacks.onEnd) utterance.onend = callbacks.onEnd;
  if (callbacks.onError) utterance.onerror = callbacks.onError;

  window.speechSynthesis.speak(utterance);
}

export function stopSaiUtterance() {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

/**
 * Robust Multilingual Contextual AI Reasoning Engine (Gemini API + Offline Intelligence)
 */
export async function generateSaiAiResponse({
  userPrompt,
  currentLanguage = "en",
  chatHistory = [],
  workerProfile = {},
  apiKey = "",
}) {
  const cleanInput = (userPrompt || "").trim();
  const lower = cleanInput.toLowerCase();
  const lang = ["en", "hi", "gu"].includes(currentLanguage) ? currentLanguage : "en";

  // Build Context Summary
  const profileContext = {
    name: workerProfile.fullName || "Worker Applicant",
    occupation: workerProfile.occupation || "Street Vendor / Gig Worker",
    age: workerProfile.age || 28,
    dailyEarning: workerProfile.dailyEarning || 600,
    dailyExpense: workerProfile.dailyExpense || 250,
    netBuffer: (workerProfile.dailyEarning || 600) - (workerProfile.dailyExpense || 250),
    location: workerProfile.location || "Gujarat",
    aadhaarVerified: workerProfile.aadhaarVerified || false,
    statementVerified: workerProfile.statementVerified || false,
  };

  // 1. Check if Gemini API is available
  const keyToUse = apiKey || (typeof import.meta !== "undefined" && import.meta.env?.VITE_GEMINI_API_KEY) || (typeof localStorage !== "undefined" && localStorage.getItem("SAI_GEMINI_KEY"));
  if (keyToUse) {
    try {
      const systemInstruction = `You are SAI (Sahayata AI Assistant), the official AI Financial Inclusion and Welfare Assistant for India's 45-Crore unorganised workers, street vendors, delivery partners, and daily wage earners under the Sahayata platform.

CRITICAL INSTRUCTIONS:
1. You MUST respond ONLY in the user's currently selected language: ${lang === "hi" ? "Pure Hindi in Devanagari Script (हिन्दी)" : lang === "gu" ? "Pure Gujarati in Gujarati Script (ગુજરાતી)" : "English"}.
2. If language is 'hi', do NOT write in Roman Hindi or English script. Use natural, conversational Devanagari Hindi.
3. If language is 'gu', do NOT write in Roman Gujarati. Use natural, conversational Gujarati script.
4. If language is 'en', write in clear, empathetic Indian English.
5. PRESERVE ALL CONVERSATIONAL CONTEXT and past messages across language switches. The applicant is ${profileContext.name}, working as ${profileContext.occupation}, aged ${profileContext.age}, earning ₹${profileContext.dailyEarning}/day in ${profileContext.location}.
6. Use natural financial terminology (e.g. CIBIL स्कोर / CIBIL સ્કોર, क्रेडिट हिस्ट्री / ક્રેડિટ હિસ્ટ્રી, लोन / લોન, सरकारी योजना / સરકારી યોજના, भुगतान / ચુકવણી).
7. NEVER ask for or collect OTPs, passwords, UPI PINs, or CVVs.
8. If user asks about eligibility, explain PM SVANidhi (₹10k-₹50k collateral-free loan with 7% interest subsidy), PM Jan Dhan Yojana (₹10k overdraft), e-Shram (UAN & ₹2L cover), PM-SYM (₹3k/mo pension), or Sachet Daily Repayments (EDI: ₹50-₹100/day).
9. Keep responses structured, concise, and easy to understand for informal workers.`;

      const contents = [
        {
          role: "user",
          parts: [{ text: systemInstruction }],
        },
        {
          role: "model",
          parts: [{ text: lang === "hi" ? "मैं समझ गया। मैं सहायता एआई सहायक के रूप में केवल शुद्ध हिंदी (देवनागरी) में उत्तर दूंगा।" : lang === "gu" ? "હું સમજી ગયો. હું સહાયતા AI સહાયક તરીકે માત્ર શુદ્ધ ગુજરાતીમાં જ ઉત્તર આપીશ." : "Understood. I will act as the SAI Financial Assistant and respond strictly in English." }],
        },
      ];

      // Add last 6 messages of chat history for context preservation
      const recentHistory = chatHistory.slice(-6);
      recentHistory.forEach((msg) => {
        if (msg.text && msg.sender) {
          contents.push({
            role: msg.sender === "user" ? "user" : "model",
            parts: [{ text: msg.text }],
          });
        }
      });

      // Add current message
      contents.push({
        role: "user",
        parts: [{ text: cleanInput }],
      });

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${keyToUse}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents,
            generationConfig: {
              temperature: 0.3,
              maxOutputTokens: 600,
            },
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const generatedText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (generatedText && generatedText.trim()) {
          return {
            text: generatedText.trim(),
            source: "gemini",
            language: lang,
          };
        }
      }
    } catch (err) {
      console.warn("Gemini Live API fallback:", err);
    }
  }

  // 2. Query Backend RAG Endpoint
  try {
    const ragResult = await queryRagApi(cleanInput, lang);
    if (ragResult && ragResult.answer && ragResult.answer.length > 20) {
      return {
        text: ragResult.answer,
        source: "rag",
        language: lang,
        citations: ragResult.citations,
      };
    }
  } catch (err) {
    // Fallback to local rule-based intelligence
  }

  // 3. Ultra-Fast, Contextual Multilingual Rule & Knowledge Engine
  return {
    text: evaluateContextualResponse(lower, lang, profileContext),
    source: "local_intelligent_engine",
    language: lang,
  };
}

/**
 * Contextual Rule Engine producing 100% pure script responses
 */
function evaluateContextualResponse(lower, lang, profile) {
  const occ = (profile.occupation || "").toLowerCase();
  const isVendor = occ.includes("vendor") || occ.includes("thela") || occ.includes("hawker") || lower.includes("vendor") || lower.includes("दुकान") || lower.includes("ફેરીવાળા");
  const isDelivery = occ.includes("delivery") || occ.includes("swiggy") || occ.includes("zomato") || lower.includes("delivery") || lower.includes("ડિલિવરી") || lower.includes("डिलीवरी");

  // A. Government Scheme Queries (PM SVANidhi, PMJDY, e-Shram, PM-SYM)
  if (lower.includes("scheme") || lower.includes("yojana") || lower.includes("योजना") || lower.includes("યોજના") || lower.includes("svanidhi") || lower.includes("स्वनिधि") || lower.includes("સ્વનિધિ")) {
    if (lang === "hi") {
      return `आपके प्रोफ़ाइल (${profile.occupation}) के अनुसार, आपके लिए प्रमुख सरकारी योजनाएं निम्नलिखित हैं:\n\n1. **PM स्वनिधि योजना**: स्ट्रीट वेंडरों और गिग पार्टनरों के लिए ₹10,000 से ₹50,000 तक बिना गारंटी (Collateral-Free) लोन, 7% ब्याज सब्सिडी और ₹1,200/वर्ष का डिजिटल कैशबैक।\n2. **ई-श्रम पोर्टल**: 12-अंकीय UAN कार्ड, ₹2 लाख दुर्घटना बीमा और सरकारी राहत का सीधा लाभ।\n3. **PM जन धन योजना**: ₹10,000 ओवरड्राफ्ट सुविधा और निःशुल्क RuPay डेबिट कार्ड।\n\nक्या आप इनमें से किसी योजना के लिए आवेदन प्रक्रिया शुरू करना चाहते हैं?`;
    }
    if (lang === "gu") {
      return `તમારી પ્રોફાઇલ (${profile.occupation}) મુજબ, તમારા માટે મુખ્ય સરકારી યોજનાઓ નીચે મુજબ છે:\n\n1. **PM સ્વનિધિ યોજના**: સ્ટ્રીટ વેન્ડર્સ અને ગીગ વર્કર્સ માટે ₹10,000 થી ₹50,000 સુધીની કોલેટરલ-મુક્ત લોન, 7% વ્યાજ સબસિડી અને ₹1,200/વર્ષ સુધીનું ડિજિટલ કેશબેક.\n2. **ઈ-શ્રમ પોર્ટલ**: ૧૨-અંકનું UAN કાર્ડ, ₹૨ લાખ અકસ્માત વીમો અને સરકારી સહાય.\n3. **PM જન ધન યોજના**: ₹10,000 ઓવરડ્રાફ્ટ સુવિધા અને ફ્રી RuPay ડેબિટ કાર્ડ.\n\nશું તમે આમાંથી કોઈ યોજના માટે અરજી પ્રક્રિયા શરૂ કરવા માંગો છો?`;
    }
    return `Based on your profile as a ${profile.occupation}, here are the best government schemes for you:\n\n1. **PM SVANidhi Scheme**: Collateral-free working capital loan from ₹10,000 up to ₹50,000 with 7% interest subsidy and ₹1,200/year digital cashback.\n2. **e-Shram Portal**: 12-digit Universal Account Number (UAN) with ₹2 Lakh accidental insurance and direct DBT relief.\n3. **PM Jan Dhan Yojana**: Zero-balance banking with ₹10,000 overdraft facility.\n\nWould you like me to guide you through applying for any of these?`;
  }

  // B. Loan / Credit Eligibility Queries
  if (lower.includes("loan") || lower.includes("credit") || lower.includes("ऋण") || lower.includes("लोन") || lower.includes("લોન") || lower.includes("उधार") || lower.includes("पैसा") || lower.includes("પૈસા")) {
    const loanEst = profile.netBuffer >= 200 ? "₹15,000 से ₹50,000" : "₹10,000";
    const loanEstGu = profile.netBuffer >= 200 ? "₹15,000 થી ₹50,000" : "₹10,000";
    const loanEstEn = profile.netBuffer >= 200 ? "₹15,000 to ₹50,000" : "₹10,000";

    if (lang === "hi") {
      return `आपकी दैनिक आय (₹${profile.dailyEarning}/दिन) और खर्च (₹${profile.dailyExpense}/दिन) के आधार पर आपका शुद्ध दैनिक कैश बफर ₹${profile.netBuffer}/दिन है।\n\nआप **${loanEst}** के सचेत माइक्रो-लोन (Sachet Loan) के लिए पात्र हैं।\n\n- **पुनर्भुगतान (EDI)**: भारी मासिक EMI के बजाय रोज़ाना मात्र ₹50 से ₹100 का आसान भुगतान।\n- **CIBIL की आवश्यकता नहीं**: हम आपके दैनिक UPI लेनदेन और कैश-फ्लो के आधार पर क्रेडिट तय करते हैं।\n\nआवेदन आगे बढ़ाने के लिए कृपया अपना आधार कार्ड या बैंक स्टेटमेंट साझा करें।`;
    }
    if (lang === "gu") {
      return `તમારી દૈનિક આવક (₹${profile.dailyEarning}/દિવસ) અને ખર્ચ (₹${profile.dailyExpense}/દિવસ) ના આધારે તમારો ચોખ્ખો દૈનિક કેશ બફર ₹${profile.netBuffer}/દિવસ છે.\n\nતમે **${loanEstGu}** ની સાશે માઇક્રો-લોન માટે પાત્ર છો.\n\n- **ચુકવણી (EDI)**: મોટી માસિક EMI ને બદલે રોજના માત્ર ₹50 થી ₹100 ની સરળ ચુકવણી.\n- **CIBIL ની જરૂર નથી**: અમે તમારા દૈનિક UPI વ્યવહારોના આધારે ક્રેડિટ મંજૂર કરીએ છીએ.\n\nઅરજી આગળ વધારવા માટે કૃપા કરીને તમારું આધાર કાર્ડ અથવા બેંક સ્ટેટમેન્ટ અપલોડ કરો.`;
    }
    return `Based on your daily earning (₹${profile.dailyEarning}/day) and expenses (₹${profile.dailyExpense}/day), your net daily cash buffer is ₹${profile.netBuffer}/day.\n\nYou are eligible for an estimated sachet micro-loan of **${loanEstEn}**.\n\n- **Repayment (EDI)**: Small daily repayments of ₹50 to ₹100 aligned with your daily cash cycle instead of heavy monthly EMIs.\n- **No CIBIL Required**: Assessed using your daily UPI transaction flow.\n\nTo proceed, please upload your Aadhaar card or bank statement.`;
  }

  // C. CIBIL Score / Document Verification Queries
  if (lower.includes("cibil") || lower.includes("score") || lower.includes("दस्तावेज") || lower.includes("document") || lower.includes("દસ્તાવેજ") || lower.includes("kyc")) {
    if (lang === "hi") {
      return `सहायता प्लेटफॉर्म पर असंगठित कामगारों को पारंपरिक CIBIL स्कोर या सैलरी स्लिप की आवश्यकता नहीं होती है।\n\nहम तीन आसान दस्तावेज़ों से सत्यापन करते हैं:\n1. **आधार कार्ड** (पहचान सत्यापन हेतु)\n2. **बैंक पासबुक या UPI QR रिकॉर्ड** (दैनिक कैश-फ्लो समझने हेतु)\n3. **ई-श्रम कार्ड या सहकर्मी सिफ़ारिश (Peer LOR)**\n\nसुरक्षा सूचना: सहायता कभी भी आपसे OTP, UPI पिन या पासवर्ड नहीं मांगता।`;
    }
    if (lang === "gu") {
      return `સહાયતા પ્લેટફોર્મ પર અસંગઠિત શ્રમિકોને પરંપરાગત CIBIL સ્કોર અથવા સેલેરી સ્લિપની જરૂર હોતી નથી.\n\nઅમે ત્રણ સરળ દસ્તાવેજોથી વેરિફિકેશન કરીએ છીએ:\n1. **આધાર કાર્ડ** (ઓળખ ચકાસણી માટે)\n2. **બેંક પાસબુક અથવા UPI QR રેકોર્ડ** (દૈનિક કેશ-ફ્લો સમજવા માટે)\n3. **ઈ-શ્રમ કાર્ડ અથવા સાથી શ્રમિક ભલામણ પત્ર (Peer LOR)**\n\nસુરક્ષા સૂચના: સહાયતા ક્યારેય તમારી પાસે OTP, UPI પિન કે પાસવર્ડ માંગતું નથી.`;
    }
    return `On the Sahayata platform, informal workers do not need a traditional CIBIL score or salary slip.\n\nWe verify your eligibility using three simple items:\n1. **Aadhaar Card** (for identity verification)\n2. **Bank Passbook photo or UPI QR statement** (to analyze daily cashflow)\n3. **e-Shram card or Peer Letter of Recommendation (LOR)**\n\nSecurity notice: Sahayata will never ask you for an OTP, UPI PIN, or password.`;
  }

  // D. General Greeting / Fallback Context
  if (lang === "hi") {
    return `नमस्ते ${profile.name}! मैं सहायता एआई सहायक हूँ। आप एक ${profile.occupation} के रूप में पंजीकृत हैं। मैं आपको PM स्वनिधि योजना, सचेत दैनिक ऋण, ई-श्रम पंजीकरण और सामाजिक सुरक्षा पेंशन से संबंधित पूरी जानकारी दे सकता हूँ। आप मुझसे क्या पूछना चाहते हैं?`;
  }
  if (lang === "gu") {
    return `નમસ્તે ${profile.name}! હું સહાયતા AI સહાયક છું. તમે ${profile.occupation} તરીકે નોંધાયેલા છો. હું તમને PM સ્વનિધિ યોજના, સાશે લોન, ઈ-શ્રમ નોંધણી અને સામાજિક સુરક્ષા પેન્શન વિશે સંપૂર્ણ માર્ગદર્શન આપી શકું છું. તમે શું પૂછવા માંગો છો?`;
  }
  return `Hello ${profile.name}! I am SAI, your financial assistant. You are profiled as a ${profile.occupation}. I can guide you on PM SVANidhi loans, sachet daily repayments, e-Shram welfare, and Jan Dhan overdrafts. How can I help you today?`;
}
