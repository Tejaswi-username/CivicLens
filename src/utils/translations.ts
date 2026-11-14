export type Language = 'en' | 'te';

export const translations = {
  en: {
    // Navigation
    appName: 'CIVIC LENS',
    subtitle: 'Report It. Track It. Build Safer Communities.',
    navHome: 'Home',
    navMap: 'Community Map',
    navSafeRoute: 'Safe Routes',
    navReports: 'Local Reports',
    navWins: 'Community Wins',
    navChat: 'Community Chat',
    navScorecards: 'Ward Scorecards',
    navMyReports: 'My Reports',
    navAdmin: 'Community Operations',
    navReportIssue: 'Report a Local Issue',
    navSignIn: 'Sign In',
    navSignOut: 'Sign Out',
    demoMode: 'Community View: Bachupally',
    resetDemo: 'Reset Community Demo Data',

    // Hero
    heroHeadline: 'Report It. Track It. Build Safer Communities.',
    heroSubtitle: 'Report local civic issues in your neighborhood, validate hazard alerts with neighbors, and track repairs until fully fixed.',
    exploreMap: 'Community Hazard Map',
    howItWorks: 'How It Works',
    howStep1Title: 'Spot an Issue',
    howStep1Desc: 'Encounter a pothole, open drain, or broken light in your neighborhood.',
    howStep2Title: 'Snap & Report',
    howStep2Desc: 'Upload a photo, pinpoint the spot on the map, and state the safety impact.',
    howStep3Title: 'Community Validates',
    howStep3Desc: 'Fellow citizens confirm the issue to escalate its priority score.',
    howStep4Title: 'Municipal Resolution',
    howStep4Desc: 'Assigned to the responsible department and tracked with after-fix photo evidence.',

    // Categories
    catPothole: 'Pothole',
    catBrokenStreetlight: 'Broken Streetlight',
    catOpenDrain: 'Open Drain',
    catWaterlogging: 'Waterlogging',
    catDamagedFootpath: 'Damaged Footpath',
    catUnsafeCrossing: 'Unsafe Crossing',
    catGarbageDumping: 'Garbage Dumping',
    catOther: 'Other',

    // Statuses
    statusReported: 'Reported',
    statusVerified: 'Verified',
    statusAssigned: 'Assigned',
    statusInProgress: 'In Progress',
    statusFixed: 'Fixed',
    statusReopened: 'Reopened',

    // Citizen Actions
    confirmIssue: 'I also face this issue',
    confirmedSuccess: 'Thank you for confirming this issue! Priority recalculated.',
    alreadyConfirmed: 'You have already confirmed this issue.',
    reopenReport: 'Reopen this Issue',
    viewDetails: 'View Details',
    duplicateWarning: 'Possible Duplicate Report Found',
    confirmExisting: 'Confirm Existing Issue',
    reportAnyway: 'Report Anyway',
    
    // Priority
    priorityHigh: 'High Priority',
    priorityMedium: 'Medium Priority',
    priorityLow: 'Low Priority',
  },
  te: {
    // Navigation
    appName: 'సివిక్ లెన్స్ (CIVIC LENS)',
    subtitle: 'నివేదించండి. ట్రాక్ చేయండి. సురక్షిత సమాజాలను నిర్మించండి.',
    navHome: 'హోమ్',
    navMap: 'కమ్యూనిటీ మ్యాప్',
    navSafeRoute: 'సురక్షిత మార్గాలు',
    navReports: 'స్థానిక సమస్యలు',
    navWins: 'పరిష్కారాలు (విజయాలు)',
    navChat: 'కమ్యూనిటీ చర్చా వేదిక',
    navScorecards: 'వార్డు స్కోర్‌కార్డ్‌లు',
    navMyReports: 'నా నివేదికలు',
    navAdmin: 'కమ్యూనిటీ డాష్‌బోర్డ్',
    navReportIssue: 'స్థానిక సమస్యను నివేదించండి',
    navSignIn: 'లాగిన్',
    navSignOut: 'లాగ్ అవుట్',
    demoMode: 'కమ్యూనిటీ వీక్షణ: బాచుపల్లి',
    resetDemo: 'డెమో డేటాను రీసెట్ చేయండి',

    // Hero
    heroHeadline: 'నివేదించండి. ట్రాక్ చేయండి. సురక్షిత సమాజాలను నిర్మించండి.',
    heroSubtitle: 'మీ ప్రాంతంలో రోడ్లు, లైట్లు, డ్రైనేజీ సమస్యలను నివేదించండి, పొరుగువారితో కలిసి ధృవీకరించండి మరియు పరిష్కారం వరకు ట్రాక్ చేయండి.',
    exploreMap: 'కమ్యూనిటీ మ్యాప్‌లో చూడండి',
    howItWorks: 'ఇది ఎలా పనిచేస్తుంది?',
    howStep1Title: 'సమస్యను గుర్తించండి',
    howStep1Desc: 'మీ పరిసరాల్లో గుంతలు, మురుగు కాలువలు లేదా పాడైన వీధి దీపాలను గుర్తించండి.',
    howStep2Title: 'ఫోటో తీసి నివేదించండి',
    howStep2Desc: 'ఫోటో తీసి, మ్యాప్‌లో లొకేషన్ ఎంచుకుని, ప్రమాద తీవ్రతను పేర్కొనండి.',
    howStep3Title: 'ప్రజల ధృవీకరణ',
    howStep3Desc: 'పౌరులు దీనిని ధృవీకరించి ప్రాధాన్యత స్కోరు పెంచడానికి సహకరిస్తారు.',
    howStep4Title: 'మున్సిపల్ పరిష్కారం',
    howStep4Desc: 'సంబంధిత విభాగానికి కేటాయించబడి, పరిష్కార ఫోటో రుజువుతో పూర్తవుతుంది.',

    // Categories
    catPothole: 'రోడ్డు గుంత (Pothole)',
    catBrokenStreetlight: 'పాడైన వీధి దీపం',
    catOpenDrain: 'తెరిచిన డ్రైనేజీ',
    catWaterlogging: 'నీరు నిలిచిపోవడం',
    catDamagedFootpath: 'దెబ్బతిన్న ఫుట్‌పాత్',
    catUnsafeCrossing: 'ప్రమాదకర రహదారి దాటే ప్రదేశం',
    catGarbageDumping: 'చెత్త కుప్పలు',
    catOther: 'ఇతర సమస్య',

    // Statuses
    statusReported: 'నివేదించబడింది',
    statusVerified: 'ధృవీకరించబడింది',
    statusAssigned: 'కేటాయించబడింది',
    statusInProgress: 'పని పురోగతిలో ఉంది',
    statusFixed: 'పరిష్కరించబడింది',
    statusReopened: 'తిరిగి తెరవబడింది',

    // Citizen Actions
    confirmIssue: 'నేను కూడా ఈ సమస్యను ఎదుర్కొంటున్నాను',
    confirmedSuccess: 'ధృవీకరించినందుకు ధన్యవాదాలు! ప్రాధాన్యత స్కోర్ పెరిగింది.',
    alreadyConfirmed: 'మీరు ఇప్పటికే ఈ సమస్యను ధృవీకరించారు.',
    reopenReport: 'సమస్యను మళ్ళీ తెరవండి',
    viewDetails: 'వివరాలు చూడండి',
    duplicateWarning: 'సమీపంలో ఇలాంటి సమస్య ఇప్పటికే నివేదించబడింది',
    confirmExisting: 'ఉన్న సమస్యను సమర్థించండి',
    reportAnyway: 'కొత్తగా నివేదించండి',

    // Priority
    priorityHigh: 'అత్యధిక ప్రాధాన్యత',
    priorityMedium: 'మధ్యస్థ ప్రాధాన్యత',
    priorityLow: 'సాధారణ ప్రాధాన్యత',
  }
};
