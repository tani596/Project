export type Language = 'en' | 'hi';

export interface Translations {
  appName: string;
  tagline: string;
  heroSub: string;
  exampleLoadedBadge: string;
  tryExampleBtn: string;
  navAdvisor: string;
  navMyFields: string;
  navSignIn: string;
  navGuest: string;
  navSignOut: string;

  // Story sections
  problemHeading: string;
  problemBody: string;
  solutionHeading: string;
  solutionBody: string;

  howItWorksHeading: string;
  step1Title: string;
  step1Desc: string;
  step2Title: string;
  step2Desc: string;
  step3Title: string;
  step3Desc: string;

  modelConsidersHeading: string;
  modelConsidersDesc: string;

  prototypeSolvesHeading: string;
  featureInputsTitle: string;
  featureInputsDesc: string;
  featureAgentTitle: string;
  featureAgentDesc: string;
  featureScenarioTitle: string;
  featureScenarioDesc: string;
  featureChecklistTitle: string;
  featureChecklistDesc: string;

  whatItDoesNotDoHeading: string;
  whatItDoesNotDo1: string;
  whatItDoesNotDo2: string;
  whatItDoesNotDo3: string;
  disclaimerNote: string;

  // Workspace
  workspaceHeading: string;
  workspaceSub: string;
  sampleDataDisclaimer: string;
  mapLabel: string;
  resetBtn: string;
  getAdviceBtn: string;
  loadingAdvice: string;

  // Form labels
  fieldNameLabel: string;
  fieldNamePlaceholder: string;
  latLabel: string;
  lonLabel: string;
  growthStageLabel: string;
  waterConditionLabel: string;
  leafColorLabel: string;
  ureaLabel: string;
  ureaPlaceholder: string;
  notesLabel: string;
  notesPlaceholder: string;

  // Stages
  stageNursery: string;
  stageTransplanting: string;
  stageTillering: string;
  stagePanicleInitiation: string;
  stageFlowering: string;
  stageGrainFilling: string;
  stageMaturity: string;

  // Water conditions
  waterContinuouslyFlooded: string;
  waterAWD: string;
  waterSaturated: string;
  waterDrained: string;
  waterDroughtStressed: string;

  // Leaf color
  leafHealthyGreen: string;
  leafMildYellowing: string;
  leafSevereYellowing: string;
  leafDarkGreen: string;
  leafBrownSpots: string;

  // Advice UI
  topPriorityTitle: string;
  methaneRisk: string;
  yieldRisk: string;
  confidence: string;
  balanceBarTitle: string;
  actionStepsTitle: string;
  whyThisAdvice: string;
  rulesAppliedTitle: string;
  verifyLocallyTitle: string;
  explainSimplyBtn: string;
  explainSimplyLoading: string;
  compareScenariosBtn: string;
  copyAdviceBtn: string;
  copiedBtn: string;
  printPdfBtn: string;
  whatsappShareBtn: string;
  saveFieldBtn: string;
  saveFieldSuccess: string;
  saveFieldGuestPrompt: string;

  // Basics
  basicsHeading: string;
  basicsSub: string;
  awdCardTitle: string;
  awdCardBody: string;
  nitrogenCardTitle: string;
  nitrogenCardBody: string;
  strawCardTitle: string;
  strawCardBody: string;

  // Roadmap
  plannedHeading: string;
  plannedBadge: string;
  plannedCardTitle: string;
  plannedCardBody: string;
  comingNextHeading: string;
  comingNext1: string;
  comingNext2: string;
  comingNext3: string;

  // Footers & common
  footerDisclaimer: string;
  agronomistReminder: string;
  lowRisk: string;
  medRisk: string;
  highRisk: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    appName: 'Rice Methane & Yield Advisor',
    tagline: 'Cut methane. Keep yields steady.',
    heroSub: 'Practical, stage-aware field recommendations that reduce paddy greenhouse gas emissions without sacrificing rice harvest production.',
    exampleLoadedBadge: 'Example field loaded: Karnal, India',
    tryExampleBtn: 'Try the example field',
    navAdvisor: 'Advisor Workspace',
    navMyFields: 'My Fields',
    navSignIn: 'Sign in',
    navGuest: 'Guest Mode',
    navSignOut: 'Sign out',

    problemHeading: 'The Problem: The Submerged Paddy Dilemma',
    problemBody: 'Flooded rice fields are a notable source of agricultural methane emissions because continuous standing water creates an oxygen-free zone where methanogenic bacteria flourish. However, growers rightly fear that draining fields or adjusting nitrogen timings will stress plants, cause sterile panicles, and reduce harvest weight. Accessible, field-calibrated guidance is lacking.',
    solutionHeading: 'Our Solution: An AI Field Advisor Agent',
    solutionBody: 'We combine agronomic science with an AI Field Advisor. By assessing your exact growth stage, standing water condition, and leaf nitrogen cues, the advisor formulates safe wetting-and-drying schedules and precision nitrogen splits. You slash methane while keeping crop yield steady.',

    howItWorksHeading: 'How It Works',
    step1Title: '1. Enter Field Observations',
    step1Desc: 'Input your location, current crop growth stage, standing water depth, and leaf color.',
    step2Title: '2. Get AI & Agronomic Guidance',
    step2Desc: 'Deterministic risk rules evaluate methanogenesis and yield safety before generating stage-aware steps.',
    step3Title: '3. Confirm with a Local Agronomist',
    step3Desc: 'Review recommendations against local soil percolation and canal schedules with extension staff.',

    modelConsidersHeading: 'What Our Model Considers',
    modelConsidersDesc: 'The model evaluates 4 core variables: (1) Crop Growth Stage (vegetative vs critical flowering), (2) Field Water Condition (flooded depth, AWD status, saturated), (3) Nitrogen & Leaf Canopy Status (urea dosage & yellowing), and (4) User Field Observations.',

    prototypeSolvesHeading: 'How The Prototype Solves It',
    featureInputsTitle: 'Field Inputs & Geo-Coordinates',
    featureInputsDesc: 'Captures authentic agronomic variables and validates physical coordinates without assuming remote sensor feeds.',
    featureAgentTitle: 'AI Field Advisor Agent',
    featureAgentDesc: 'Quotes user inputs verbatim, follows strict safety constraints, and never recommends drying during flowering.',
    featureScenarioTitle: 'Scenario Comparison',
    featureScenarioDesc: 'Computes what-if water scenarios side-by-side (e.g. continuous flood vs Alternate Wetting and Drying).',
    featureChecklistTitle: 'Action Checklist & Tracking',
    featureChecklistDesc: 'Breaks recommendations into actionable weekly checkboxes saved to your profile or browser.',

    whatItDoesNotDoHeading: 'What It Does NOT Do',
    whatItDoesNotDo1: 'No satellite imagery: Aerial visuals are illustrative app assets, not live satellite feeds.',
    whatItDoesNotDo2: 'No live IoT sensor data: Water table and leaf assessments are grower observations, not telemetry.',
    whatItDoesNotDo3: 'Does not replace a certified agronomist: Always confirm actions with local extension officers or KVK.',
    disclaimerNote: 'All data shown is user-entered or clearly labelled sample data.',

    workspaceHeading: 'Field Advisor Workspace',
    workspaceSub: 'Explore live recommendations for the preloaded Karnal paddy or enter your own field details.',
    sampleDataDisclaimer: 'Example field: sample data, not live satellite or sensor readings.',
    mapLabel: 'Illustrative field view, not to scale',
    resetBtn: 'Reset to example field',
    getAdviceBtn: 'Get AI recommendations',
    loadingAdvice: 'Analyzing agronomic risks & formulating advice...',

    fieldNameLabel: 'Field Name / Identifier',
    fieldNamePlaceholder: 'e.g. Example paddy, Karnal',
    latLabel: 'Latitude (-90 to 90)',
    lonLabel: 'Longitude (-180 to 180)',
    growthStageLabel: 'Crop Growth Stage',
    waterConditionLabel: 'Field Water Condition',
    leafColorLabel: 'Leaf Canopy & Nitrogen Status',
    ureaLabel: 'Last Urea Dose (optional, kg/ha)',
    ureaPlaceholder: 'e.g. 60',
    notesLabel: 'Field Notes & Observations',
    notesPlaceholder: 'e.g. Light loamy soil, slight algae on bunds, canal scheduled in 5 days...',

    stageNursery: 'Nursery (Seedling emergence)',
    stageTransplanting: 'Transplanting (Establishment)',
    stageTillering: 'Tillering (Active vegetative)',
    stagePanicleInitiation: 'Panicle Initiation (Reproductive start)',
    stageFlowering: 'Flowering / Anthesis (Critical moisture window)',
    stageGrainFilling: 'Grain Filling (Milky / Dough stage)',
    stageMaturity: 'Maturity (Pre-harvest ripening)',

    waterContinuouslyFlooded: 'Continuously Flooded (5-10 cm deep)',
    waterAWD: 'Alternate Wetting & Drying (AWD Pani Pipe in use)',
    waterSaturated: 'Saturated (Wet soil, no deep ponded water)',
    waterDrained: 'Drained (Naturally drying down)',
    waterDroughtStressed: 'Drought-Stressed (Soil cracking, leaf curling)',

    leafHealthyGreen: 'Normal Dark Green (Adequate Nitrogen)',
    leafMildYellowing: 'Mild Yellowing of Lower Leaves (N deficiency sign)',
    leafSevereYellowing: 'Severe Yellowing & Stunted Growth (Acute deficit)',
    leafDarkGreen: 'Excessive Deep Green (Potential over-fertilization)',
    leafBrownSpots: 'Brown Spotting / Rust (Disease observation)',

    topPriorityTitle: 'Top Priority This Week',
    methaneRisk: 'Methane Risk',
    yieldRisk: 'Yield Risk',
    confidence: 'Model Confidence',
    balanceBarTitle: 'Methane Reduction vs Yield Protection Balance',
    actionStepsTitle: 'Actionable Field Plan',
    whyThisAdvice: 'Why this advice (Agronomic Rules Applied)',
    rulesAppliedTitle: 'Evaluated Rules & Constraints',
    verifyLocallyTitle: 'Verify Locally With Agronomist',
    explainSimplyBtn: 'Explain simply (Farmer Summary)',
    explainSimplyLoading: 'Generating 3 simple farmer lines...',
    compareScenariosBtn: 'Compare Scenarios (AWD vs Flooding)',
    copyAdviceBtn: 'Copy Advice',
    copiedBtn: 'Copied!',
    printPdfBtn: 'Print / Save PDF',
    whatsappShareBtn: 'Share on WhatsApp',
    saveFieldBtn: 'Save Field & Advice',
    saveFieldSuccess: 'Saved to My Fields!',
    saveFieldGuestPrompt: 'Sign in to sync your saved fields across devices (saved locally for now)',

    basicsHeading: 'Methane-Saving Basics',
    basicsSub: 'General agronomic principles for rice water and nutrient management. Always confirm locally.',
    awdCardTitle: 'Alternate Wetting & Drying (AWD)',
    awdCardBody: 'Periodic soil drying allows oxygen to enter pore spaces, suppressing anaerobic methanogenic microbes; this is likely to lower methane while keeping yield about steady when soil drying is avoided during flowering.',
    nitrogenCardTitle: 'Split Nitrogen Timing & Placement',
    nitrogenCardBody: 'Applying urea in 3-4 small splits synchronized with leaf color chart (LCC) readings prevents excess nitrogen leaching, cuts nitrous oxide, and avoids stimulating methanogen growth.',
    strawCardTitle: 'Straw Management & Aerobic Decomposition',
    strawCardBody: 'Incorporating fresh straw right before flooding spikes methane. Decomposing straw aerobically during dry fallows or applying microbial decomposers prevents carbon-fuelled methane spikes.',

    plannedHeading: 'Planned Future Integrations',
    plannedBadge: 'Not implemented in this prototype',
    plannedCardTitle: 'Multi-Spectral Satellite & Ground IoT Feeds',
    plannedCardBody: 'Future production releases will integrate automated radar surface-water detection (Sentinel-1) and low-cost LoRaWAN field water tubes. This prototype relies exclusively on user-entered field observations.',
    comingNextHeading: 'Coming Next In Future Milestones',
    comingNext1: 'Season-wise field performance & historical emissions comparison',
    comingNext2: 'Local-language speech & voice observation input for field work',
    comingNext3: 'Machine learning calibrated on verified harvest outcomes and public agronomy trials',

    footerDisclaimer: 'AI-generated guidance. Please confirm with a local agronomist before acting.',
    agronomistReminder: 'Please confirm all water adjustments with your local agricultural extension officer.',
    lowRisk: 'Low',
    medRisk: 'Medium',
    highRisk: 'High',
  },
  hi: {
    appName: 'धान मीथेन व उपज सलाहकार',
    tagline: 'मीथेन घटाएं। पैदावार सुरक्षित रखें।',
    heroSub: 'धान के खेतों में बिना पैदावार घटाए ग्रीनहाउस मीथेन गैस उत्सर्जन कम करने के लिए फसल-अवस्था आधारित व्यावहारिक सलाह।',
    exampleLoadedBadge: 'उदाहरण खेत लोड: करनाल, हरियाणा',
    tryExampleBtn: 'उदाहरण खेत देखें व आज़माएं',
    navAdvisor: 'सलाहकार कार्यक्षेत्र',
    navMyFields: 'मेरे खेत',
    navSignIn: 'साइन इन',
    navGuest: 'अतिथि मोड',
    navSignOut: 'लॉग आउट',

    problemHeading: 'समस्या: लगातार भरे पानी की चुनौती',
    problemBody: 'धान के खेतों में लगातार पानी भरे रहने से मिट्टी में ऑक्सीजन खत्म हो जाती है और मीथेन गैस उत्पन्न होती है। लेकिन किसान डरते हैं कि खेत सुखाने या खाद में बदलाव करने से पैदावार गिर जाएगी। किसानों के पास खेत-विशिष्ट सटीक सलाह का अभाव है।',
    solutionHeading: 'समाधान: एआई फील्ड एडवाइजर एजेंट',
    solutionBody: 'हमारा एआई फील्ड एडवाइजर आपकी फसल की अवस्था, खेत में पानी की स्थिति और पत्तियों के रंग का विश्लेषण करता है। यह ऐसे व्यावहारिक कदम सुझाता है जिनसे मीथेन गैस कम होती है और धान की उपज सुरक्षित रहती है।',

    howItWorksHeading: 'यह कैसे काम करता है',
    step1Title: '1. खेत की जानकारी दर्ज करें',
    step1Desc: 'खेत का स्थान, फसल की अवस्था, पानी का स्तर और पत्तियों का रंग चुनें।',
    step2Title: '2. वैज्ञानिक एआई सलाह प्राप्त करें',
    step2Desc: 'सख्त कृषि नियमों के आधार पर मीथेन व उपज जोखिम का आकलन और कार्ययोजना प्राप्त करें।',
    step3Title: '3. स्थानीय कृषि विशेषज्ञ से पुष्टि करें',
    step3Desc: 'नहर के पानी और मिट्टी की किस्म के अनुसार नजदीकी कृषि विज्ञान केंद्र (KVK) से सलाह लें।',

    modelConsidersHeading: 'हमारा मॉडल किन बातों का ध्यान रखता है',
    modelConsidersDesc: 'यह मॉडल 4 मुख्य बिंदुओं का विश्लेषण करता है: (1) फसल की अवस्था (कल्ले फूटना, बाली बनना, फूल आना), (2) पानी की स्थिति (लगातार भरा, AWD, सूखा), (3) पत्तियों का रंग व नाइट्रोजन (यूरिया की खुराक), और (4) किसान के खेत की टिप्पणियां।',

    prototypeSolvesHeading: 'प्रोटोटाइप इसे कैसे हल करता है',
    featureInputsTitle: 'सटीक निर्देशांक और खेत अवलोकन',
    featureInputsDesc: 'बिना किसी फर्जी सेंसर के किसान द्वारा दर्ज वास्तविक अवलोकनों का सत्यापन करता है।',
    featureAgentTitle: 'सख्त कृषि सुरक्षा नियमों पर आधारित एआई',
    featureAgentDesc: 'उपयोगकर्ता के इनपुट का संदर्भ देता है और फूल आने के समय खेत सुखाने की सलाह कभी नहीं देता।',
    featureScenarioTitle: 'परिदृश्य तुलना (Scenario Comparison)',
    featureScenarioDesc: 'लगातार पानी भरने और AWD के बीच जोखिम अंतर को आमने-सामने दिखाता है।',
    featureChecklistTitle: 'साप्ताहिक कार्य चेकलिस्ट',
    featureChecklistDesc: 'सुझाई गई सलाह को टिक-मार्क चेकलिस्ट में बदलता है जिसे आप सहेज सकते हैं।',

    whatItDoesNotDoHeading: 'यह क्या नहीं करता है (सत्यता सूचना)',
    whatItDoesNotDo1: 'कोई लाइव उपग्रह चित्र नहीं: ऊपर दिखाई गई तस्वीर केवल एक उदाहरण छवि है।',
    whatItDoesNotDo2: 'कोई लाइव सेंसर डेटा नहीं: सभी डेटा किसान द्वारा दर्ज या नमूना डेटा है।',
    whatItDoesNotDo3: 'यह कृषि वैज्ञानिक का विकल्प नहीं है: अंतिम निर्णय से पहले स्थानीय कृषि अधिकारी से पुष्टि करें।',
    disclaimerNote: 'प्रोटोटाइप में दिखाया गया सभी डेटा किसान-प्रविष्ट या स्पष्ट रूप से उदाहरण डेटा है।',

    workspaceHeading: 'सलाहकार कार्यक्षेत्र (Advisor Workspace)',
    workspaceSub: 'करनाल के पूर्व-लोड खेत का विश्लेषण देखें या अपने खेत का विवरण दर्ज करें।',
    sampleDataDisclaimer: 'उदाहरण खेत: नमूना डेटा, कोई लाइव उपग्रह या सेंसर रीडिंग नहीं।',
    mapLabel: 'सांकेतिक खेत दृश्य, पैमाने पर नहीं',
    resetBtn: 'उदाहरण खेत पर रीसेट करें',
    getAdviceBtn: 'एआई सलाह प्राप्त करें',
    loadingAdvice: 'कृषि जोखिमों का विश्लेषण और सलाह तैयार की जा रही है...',

    fieldNameLabel: 'खेत का नाम / पहचान',
    fieldNamePlaceholder: 'उदा. उदाहरण खेत, करनाल',
    latLabel: 'अक्षांश (Latitude: -90 से 90)',
    lonLabel: 'देशांतर (Longitude: -180 से 180)',
    growthStageLabel: 'फसल की वृद्धि अवस्था',
    waterConditionLabel: 'खेत में पानी की स्थिति',
    leafColorLabel: 'पत्तियों का रंग / नाइट्रोजन लक्षण',
    ureaLabel: 'पिछली यूरिया खुराक (वैकल्पिक, किग्रा/हे.)',
    ureaPlaceholder: 'उदा. 60',
    notesLabel: 'खेत संबंधी टिप्पणियां',
    notesPlaceholder: 'उदा. दोमट मिट्टी, मेड़ों पर हल्की काई, 4 दिन में नहर का पानी अपेक्षित...',

    stageNursery: 'नर्सरी / पौध अवस्था',
    stageTransplanting: 'रोपाई (प्रतिरोपण अवस्था)',
    stageTillering: 'कल्ले फूटना (सक्रिय वानस्पतिक वृद्धि)',
    stagePanicleInitiation: 'बाली की शुरुआत (Panicle Initiation)',
    stageFlowering: 'फूल आने की अवस्था (पानी की सबसे संवेदनशील अवस्था)',
    stageGrainFilling: 'दाना भराव / दुग्ध अवस्था',
    stageMaturity: 'पकाव अवस्था (कटाई से पूर्व)',

    waterContinuouslyFlooded: 'लगातार भरा पानी (5-10 सेमी गहरा)',
    waterAWD: 'वैकल्पिक गीला व सूखा (AWD पानी पाइप का उपयोग)',
    waterSaturated: 'नम / गीली मिट्टी (खड़ा पानी नहीं)',
    waterDrained: 'सूख रहा / पानी निकाला गया',
    waterDroughtStressed: 'सूखे का तनाव (मिट्टी में दरारें, पत्तियां मुड़ना)',

    leafHealthyGreen: 'सामान्य गहरा हरा (पर्याप्त नाइट्रोजन)',
    leafMildYellowing: 'निचली पत्तियों में हल्का पीलापन (नाइट्रोजन की कमी)',
    leafSevereYellowing: 'गंभीर पीलापन व बौनापन (तीव्र कमी)',
    leafDarkGreen: 'अत्यधिक गहरा हरा (अतिरिक्त खाद की संभावना)',
    leafBrownSpots: 'भूरे धब्बे / झुलसा लक्षण',

    topPriorityTitle: 'इस सप्ताह की सर्वोच्च प्राथमिकता',
    methaneRisk: 'मीथेन जोखिम',
    yieldRisk: 'उपज जोखिम',
    confidence: 'मॉडल विश्वास स्तर',
    balanceBarTitle: 'मीथेन कटौती बनाम पैदावार सुरक्षा संतुलन',
    actionStepsTitle: 'कार्यवाही योग्य योजना',
    whyThisAdvice: 'यह सलाह क्यों दी गई (लागू कृषि नियम)',
    rulesAppliedTitle: 'विश्लेषित नियम और सीमाएं',
    verifyLocallyTitle: 'स्थानीय स्तर पर पुष्टि योग्य बिंदु',
    explainSimplyBtn: 'सरल भाषा में समझें (किसान सारांश)',
    explainSimplyLoading: 'सरल सारांश तैयार किया जा रहा है...',
    compareScenariosBtn: 'परिदृश्य तुलना (AWD बनाम बाढ़)',
    copyAdviceBtn: 'सलाह कॉपी करें',
    copiedBtn: 'कॉपी हो गया!',
    printPdfBtn: 'प्रिंट / PDF सहेजें',
    whatsappShareBtn: 'व्हाट्सएप पर शेयर करें',
    saveFieldBtn: 'खेत व सलाह सहेजें',
    saveFieldSuccess: 'सफलतापूर्वक सहेजा गया!',
    saveFieldGuestPrompt: 'सभी डिवाइस पर सिंक करने के लिए साइन इन करें (वर्तमान में स्थानीय रूप से सहेजा गया)',

    basicsHeading: 'मीथेन बचत के बुनियादी सिद्धांत',
    basicsSub: 'धान जल और पोषण प्रबंधन के सामान्य कृषि सिद्धांत। हमेशा स्थानीय स्तर पर पुष्टि करें।',
    awdCardTitle: 'वैकल्पिक गीला और सूखा (AWD)',
    awdCardBody: 'खेत में पानी सूखने और फिर भरने से मिट्टी में हवा जाती है। इससे फूल आने के संवेदनशील समय को छोड़कर, उपज स्थिर रखते हुए मीथेन में संभावित कमी और पानी की बचत होती है।',
    nitrogenCardTitle: 'यूरिया की किस्तों में सही समय पर खुराक',
    nitrogenCardBody: 'खड़े पानी में यूरिया की भारी खुराक न डालें। लीफ कलर चार्ट (LCC) देखकर 3-4 छोटी किस्तों में यूरिया डालने से नुकसान कम होता है और मीथेन नहीं बढ़ती।',
    strawCardTitle: 'पराली प्रबंधन और मिट्टी का स्वास्थ्य',
    strawCardBody: 'पानी भरने से ठीक पहले ताजी पराली मिलाने से मीथेन तेजी से बढ़ती है। पराली को सूखी अवस्था में गलाने या जैविक अपघटक का उपयोग करने से मीथेन नियंत्रित रहती है।',

    plannedHeading: 'भविष्य का नियोजित एकीकरण',
    plannedBadge: 'इस प्रोटोटाइप में लागू नहीं है',
    plannedCardTitle: 'मल्टी-स्पेक्ट्रल उपग्रह और खेत IoT सेंसर',
    plannedCardBody: 'भविष्य के संस्करणों में रडार आधारित जल निगरानी (Sentinel-1) और स्वचालित जल ट्यूब सेंसर जोड़े जाएंगे। वर्तमान प्रोटोटाइप किसान के अवलोकनों पर आधारित है।',
    comingNextHeading: 'अगले चरणों में आने वाली सुविधाएं',
    comingNext1: 'विभिन्न मौसमों के उत्सर्जन व प्रदर्शन का ऐतिहासिक तुलनात्मक अध्ययन',
    comingNext2: 'खेत में काम करते हुए स्थानीय भाषा में वॉयस/ध्वनि द्वारा जानकारी दर्ज करना',
    comingNext3: 'वास्तविक कटाई परिणामों और सार्वजनिक अनुसंधान डेटा से मॉडल की निरंतर सीख',

    footerDisclaimer: 'एआई जनरेटेड सलाह। कृपया कोई भी कदम उठाने से पहले स्थानीय कृषि विशेषज्ञ से सलाह अवश्य लें।',
    agronomistReminder: 'कृपया पानी के किसी भी बड़े बदलाव से पहले अपने कृषि विज्ञान केंद्र या प्रसार अधिकारी से संपर्क करें।',
    lowRisk: 'कम',
    medRisk: 'मध्यम',
    highRisk: 'उच्च',
  },
};
