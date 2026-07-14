const OFFICIAL = {
  eshram: "https://www.eshram.gov.in/",
  pmsym: "https://maandhan.in/",
  pmjdy: "https://www.pmjdy.gov.in/scheme",
  jansuraksha: "https://www.jansuraksha.gov.in/",
  svanidhi: "https://pmsvanidhi.mohua.gov.in/",
  mudra: "https://www.mudra.org.in/",
};

const COPY = {
  en: {
    eyebrow: "About Sahayata",
    title: "Government schemes guide for workers",
    intro: "A practical guide to central schemes relevant to gig workers, street vendors, delivery partners and daily-wage workers. Eligibility is indicative; always confirm final eligibility and current terms on the official portal or at a CSC/bank.",
    requirements: "Who can apply / requirements",
    benefits: "Benefits",
    documents: "Keep ready",
    official: "Open official portal",
    note: "Sahayata does not approve government benefits or collect scheme fees. Never share an OTP with anyone.",
    schemes: [
      { name: "e-Shram", tag: "Worker identity", req: "Unorganised worker, age 16-59; not an EPFO/ESIC or government employee member. Registration is free.", benefits: "Creates a UAN-based worker record and helps deliver eligible social-security and welfare services.", docs: "Aadhaar, Aadhaar-linked mobile, savings bank account with IFSC.", link: OFFICIAL.eshram },
      { name: "PM-SYM", tag: "Old-age pension", req: "Unorganised worker aged 18-40, monthly income up to Rs. 15,000; not covered by EPFO/ESIC/NPS, not an income-tax payer and not receiving another government pension.", benefits: "Voluntary contributory pension: Rs. 3,000 per month after age 60; government matches the worker contribution. Spouse family-pension rules apply.", docs: "Aadhaar, savings/Jan Dhan account with IFSC, mobile number.", link: OFFICIAL.pmsym },
      { name: "PM SVANidhi", tag: "Street-vendor working capital", req: "Eligible urban street vendor with a Certificate of Vending or Letter of Recommendation, as per the official scheme process.", benefits: "Collateral-free progressive working-capital loans of Rs. 15,000, Rs. 25,000 and Rs. 50,000, subject to repayment history and lender approval; applicable subsidy/incentives follow scheme rules.", docs: "Vendor certificate/LOR, Aadhaar, mobile, bank-account details and local-body verification where required.", link: OFFICIAL.svanidhi },
      { name: "PM Jan Dhan Yojana", tag: "Basic banking", req: "A person without another bank account can open a basic savings account through a bank branch or Bank Mitra.", benefits: "Zero-minimum-balance account, deposit interest, RuPay card, DBT access and an overdraft facility up to Rs. 10,000 for eligible account holders.", docs: "KYC documents as requested by the bank; Aadhaar is commonly used.", link: OFFICIAL.pmjdy },
      { name: "PMSBY", tag: "Accident insurance", req: "Bank/post-office account holder aged 18-70; enrol through one eligible account with auto-debit consent.", benefits: "One-year renewable personal accident cover. Premium and benefit conditions are set by the official scheme and bank.", docs: "Bank/post-office account, nominee details and auto-debit consent.", link: OFFICIAL.jansuraksha },
      { name: "PMJJBY", tag: "Life insurance", req: "Bank/post-office account holder aged 18-50; enrol through one eligible account with auto-debit consent.", benefits: "One-year renewable life-insurance cover for death due to any cause; the official annual premium and claim conditions apply.", docs: "Bank/post-office account, nominee details and auto-debit consent.", link: OFFICIAL.jansuraksha },
      { name: "Pradhan Mantri MUDRA Yojana", tag: "Micro-business credit", req: "Non-corporate small business / micro enterprise seeking income-generating business finance; lender underwriting applies.", benefits: "Loan support through participating lenders for eligible micro-enterprise activity under Shishu, Kishor and Tarun categories.", docs: "Identity/address KYC, business details, bank statements and documents requested by the lending institution.", link: OFFICIAL.mudra },
    ],
  },
  hi: {
    eyebrow: "सहायता के बारे में",
    title: "कामगारों के लिए सरकारी योजनाओं की गाइड",
    intro: "गिग वर्कर, रेहड़ी-पटरी विक्रेता, डिलीवरी पार्टनर और दिहाड़ी कामगारों के लिए उपयोगी केंद्रीय योजनाएं। पात्रता सांकेतिक है; अंतिम नियम आधिकारिक पोर्टल, CSC या बैंक से जांचें।",
    requirements: "कौन आवेदन कर सकता है / शर्तें",
    benefits: "मुख्य लाभ",
    documents: "तैयार रखें",
    official: "आधिकारिक पोर्टल खोलें",
    note: "सहायता सरकारी लाभ स्वीकृत नहीं करती और किसी योजना शुल्क का संग्रह नहीं करती। OTP किसी के साथ साझा न करें।",
    schemes: [
      { name: "ई-श्रम", tag: "कामगार पहचान", req: "असंगठित कामगार, आयु 16-59 वर्ष; EPFO/ESIC या सरकारी कर्मचारी सदस्य नहीं। पंजीकरण निशुल्क है।", benefits: "UAN आधारित कामगार रिकॉर्ड बनता है और पात्र सामाजिक सुरक्षा/कल्याण सेवाओं तक पहुंच में मदद मिलती है।", docs: "आधार, आधार से जुड़ा मोबाइल, IFSC सहित बचत बैंक खाता।", link: OFFICIAL.eshram },
      { name: "पीएम-एसवाईएम", tag: "वृद्धावस्था पेंशन", req: "18-40 वर्ष का असंगठित कामगार, मासिक आय Rs. 15,000 तक; EPFO/ESIC/NPS, आयकर और दूसरी सरकारी पेंशन से बाहर।", benefits: "स्वैच्छिक अंशदायी पेंशन: 60 वर्ष के बाद Rs. 3,000 प्रति माह; सरकार कामगार के अंशदान के बराबर योगदान करती है।", docs: "आधार, IFSC सहित बचत/जन-धन खाता, मोबाइल नंबर।", link: OFFICIAL.pmsym },
      { name: "पीएम स्वनिधि", tag: "स्ट्रीट वेंडर कार्यशील पूंजी", req: "शहरी स्ट्रीट वेंडर, जिसके पास Certificate of Vending या Letter of Recommendation हो।", benefits: "बिना गारंटी क्रमिक कार्यशील पूंजी ऋण: Rs. 15,000, Rs. 25,000 और Rs. 50,000; भुगतान इतिहास व ऋणदाता स्वीकृति लागू।", docs: "वेंडर प्रमाण/LOR, आधार, मोबाइल, बैंक विवरण और जरूरत पर स्थानीय निकाय सत्यापन।", link: OFFICIAL.svanidhi },
      { name: "प्रधानमंत्री जन-धन योजना", tag: "बुनियादी बैंकिंग", req: "जिस व्यक्ति का कोई अन्य बैंक खाता नहीं है, वह बैंक शाखा या बैंक मित्र के जरिए खाता खोल सकता है।", benefits: "शून्य न्यूनतम बैलेंस खाता, ब्याज, RuPay कार्ड, DBT और पात्र खाताधारक के लिए Rs. 10,000 तक ओवरड्राफ्ट।", docs: "बैंक द्वारा मांगे गए KYC दस्तावेज; आमतौर पर आधार।", link: OFFICIAL.pmjdy },
      { name: "पीएमएसबीवाई", tag: "दुर्घटना बीमा", req: "18-70 वर्ष का बैंक/डाकघर खाताधारक; एक योग्य खाते से ऑटो-डेबिट सहमति।", benefits: "एक-वर्षीय नवीकरणीय व्यक्तिगत दुर्घटना कवर; प्रीमियम और लाभ आधिकारिक योजना/बैंक नियमों के अनुसार।", docs: "बैंक/डाकघर खाता, नामांकित व्यक्ति की जानकारी, ऑटो-डेबिट सहमति।", link: OFFICIAL.jansuraksha },
      { name: "पीएमजेजेबीवाई", tag: "जीवन बीमा", req: "18-50 वर्ष का बैंक/डाकघर खाताधारक; एक योग्य खाते से ऑटो-डेबिट सहमति।", benefits: "किसी भी कारण से मृत्यु के लिए एक-वर्षीय नवीकरणीय जीवन बीमा कवर; प्रीमियम/दावा नियम आधिकारिक हैं।", docs: "बैंक/डाकघर खाता, नामांकित व्यक्ति की जानकारी, ऑटो-डेबिट सहमति।", link: OFFICIAL.jansuraksha },
      { name: "प्रधानमंत्री मुद्रा योजना", tag: "सूक्ष्म व्यवसाय ऋण", req: "आय पैदा करने वाले छोटे गैर-कॉर्पोरेट व्यवसाय/सूक्ष्म उद्यम; बैंक/NBFC की अंडरराइटिंग लागू।", benefits: "पात्र माइक्रो-एंटरप्राइज गतिविधि के लिए Shishu, Kishor और Tarun श्रेणी में भागीदार ऋणदाताओं से ऋण।", docs: "KYC, व्यवसाय विवरण, बैंक स्टेटमेंट और ऋणदाता द्वारा मांगे गए दस्तावेज।", link: OFFICIAL.mudra },
    ],
  },
  gu: {
    eyebrow: "સહાયતા વિશે",
    title: "કામદારો માટે સરકારી યોજનાઓની માર્ગદર્શિકા",
    intro: "ગિગ વર્કર, લારી-ગલ્લાવાળા, ડિલિવરી પાર્ટનર અને દૈનિક વેતન કામદારો માટે ઉપયોગી કેન્દ્રીય યોજનાઓ. પાત્રતા સૂચક છે; અંતિમ નિયમો માટે સત્તાવાર પોર્ટલ, CSC અથવા બેંક તપાસો.",
    requirements: "કોણ અરજી કરી શકે / શરતો",
    benefits: "મુખ્ય લાભો",
    documents: "તૈયાર રાખો",
    official: "સત્તાવાર પોર્ટલ ખોલો",
    note: "સહાયતા સરકારી લાભ મંજૂર કરતી નથી અને કોઈ યોજના ફી લેતી નથી. OTP કોઈને આપશો નહીં.",
    schemes: [
      { name: "ઈ-શ્રમ", tag: "કામદાર ઓળખ", req: "અસંગઠિત કામદાર, ઉંમર 16-59; EPFO/ESIC અથવા સરકારી કર્મચારી સભ્ય ન હોવો જોઈએ. નોંધણી મફત છે.", benefits: "UAN આધારિત કામદાર રેકોર્ડ બને છે અને પાત્ર સામાજિક સુરક્ષા/કલ્યાણ સેવાઓ સુધી પહોંચમાં મદદ મળે છે.", docs: "આધાર, આધાર સાથે જોડાયેલ મોબાઇલ, IFSC સાથે બચત બેંક ખાતું.", link: OFFICIAL.eshram },
      { name: "PM-SYM", tag: "વૃદ્ધાવસ્થા પેન્શન", req: "18-40 વર્ષનો અસંગઠિત કામદાર, માસિક આવક Rs. 15,000 સુધી; EPFO/ESIC/NPS, આવકવેરો અને બીજી સરકારી પેન્શનથી બહાર.", benefits: "સ્વૈચ્છિક ફાળો આધારિત પેન્શન: 60 વર્ષ પછી Rs. 3,000 પ્રતિ મહિનો; સરકાર સમાન ફાળો આપે છે.", docs: "આધાર, IFSC સાથે બચત/જન ધન ખાતું, મોબાઇલ નંબર.", link: OFFICIAL.pmsym },
      { name: "PM સ્વનિધિ", tag: "સ્ટ્રીટ વેન્ડર વર્કિંગ કેપિટલ", req: "Certificate of Vending અથવા Letter of Recommendation ધરાવતો પાત્ર શહેરી સ્ટ્રીટ વેન્ડર.", benefits: "કોલેટરલ વગર ક્રમિક વર્કિંગ કેપિટલ લોન: Rs. 15,000, Rs. 25,000 અને Rs. 50,000; ચુકવણી ઇતિહાસ અને લેનદારની મંજૂરી લાગુ.", docs: "વેન્ડર પ્રમાણ/LOR, આધાર, મોબાઇલ, બેંક વિગતો અને જરૂર પડે તો સ્થાનિક સંસ્થાની ચકાસણી.", link: OFFICIAL.svanidhi },
      { name: "પ્રધાનમંત્રી જન ધન યોજના", tag: "મૂળભૂત બેંકિંગ", req: "જે વ્યક્તિ પાસે બીજું બેંક ખાતું નથી તે બેંક શાખા અથવા બેંક મિત્ર પાસે ખાતું ખોલી શકે છે.", benefits: "શૂન્ય ન્યૂનતમ બેલેન્સ ખાતું, વ્યાજ, RuPay કાર્ડ, DBT અને પાત્ર ખાતાધારક માટે Rs. 10,000 સુધી ઓવરડ્રાફ્ટ.", docs: "બેંક માંગે તે KYC દસ્તાવેજ; સામાન્ય રીતે આધાર.", link: OFFICIAL.pmjdy },
      { name: "PMSBY", tag: "અકસ્માત વીમો", req: "18-70 વર્ષનો બેંક/પોસ્ટ ઓફિસ ખાતાધારક; એક પાત્ર ખાતા મારફતે ઓટો-ડેબિટ સંમતિ.", benefits: "એક વર્ષનો રિન્યૂ કરી શકાય એવો વ્યક્તિગત અકસ્માત કવર; પ્રીમિયમ અને લાભ સત્તાવાર યોજના/બેંકના નિયમો મુજબ.", docs: "બેંક/પોસ્ટ ઓફિસ ખાતું, નોમિની વિગતો, ઓટો-ડેબિટ સંમતિ.", link: OFFICIAL.jansuraksha },
      { name: "PMJJBY", tag: "જીવન વીમો", req: "18-50 વર્ષનો બેંક/પોસ્ટ ઓફિસ ખાતાધારક; એક પાત્ર ખાતા મારફતે ઓટો-ડેબિટ સંમતિ.", benefits: "કોઈપણ કારણસર મૃત્યુ માટે એક વર્ષનો રિન્યૂ કરી શકાય એવો જીવન વીમો; પ્રીમિયમ/દાવાના નિયમો સત્તાવાર છે.", docs: "બેંક/પોસ્ટ ઓફિસ ખાતું, નોમિની વિગતો, ઓટો-ડેબિટ સંમતિ.", link: OFFICIAL.jansuraksha },
      { name: "પ્રધાનમંત્રી મુદ્રા યોજના", tag: "સૂક્ષ્મ વ્યવસાય લોન", req: "આવક ઊભી કરતા નાના બિન-કોર્પોરેટ વ્યવસાય/સૂક્ષ્મ ઉદ્યોગ; બેંક/NBFC અન્ડરરાઇટિંગ લાગુ.", benefits: "પાત્ર સૂક્ષ્મ ઉદ્યોગ પ્રવૃત્તિ માટે Shishu, Kishor અને Tarun કેટેગરીમાં ભાગીદાર ધિરાણદાતાઓ પાસેથી લોન.", docs: "KYC, વ્યવસાય વિગતો, બેંક સ્ટેટમેન્ટ અને લેનદાર માંગે તે દસ્તાવેજો.", link: OFFICIAL.mudra },
    ],
  },
};

export default function GovernmentSchemesGuide({ lang = "en" }) {
  const copy = COPY[lang] || COPY.en;
  return (
    <main className="about-page">
      <section className="about-hero">
        <div className="section-inner">
          <div className="eyebrow">{copy.eyebrow}</div>
          <h1 className="section-title">{copy.title}</h1>
          <p className="section-sub">{copy.intro}</p>
        </div>
      </section>
      <section className="section">
        <div className="section-inner">
          <div className="scheme-guide-grid">
            {copy.schemes.map((scheme) => (
              <article className="scheme-guide-card" key={scheme.name}>
                <div className="scheme-guide-head"><h2>{scheme.name}</h2><span>{scheme.tag}</span></div>
                <div className="scheme-guide-item"><strong>{copy.requirements}</strong><p>{scheme.req}</p></div>
                <div className="scheme-guide-item"><strong>{copy.benefits}</strong><p>{scheme.benefits}</p></div>
                <div className="scheme-guide-item"><strong>{copy.documents}</strong><p>{scheme.docs}</p></div>
                <a className="scheme-guide-link" href={scheme.link} target="_blank" rel="noreferrer">{copy.official} ↗</a>
              </article>
            ))}
          </div>
          <p className="scheme-guide-note">{copy.note}</p>
        </div>
      </section>
    </main>
  );
}
