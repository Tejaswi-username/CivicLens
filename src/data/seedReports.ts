import { Report, StatusHistoryItem } from '../types/report';
import { calculatePriorityScore } from '../utils/priority';

// Authentic Hyderabad civic issue photos (served locally from public/images/sample)
export const SAMPLE_PHOTOS = {
  pothole1: '/images/sample/pothole1.jpg',
  pothole2: '/images/sample/pothole2.jpg',
  pothole3: '/images/sample/pothole3.jpg',
  streetlight1: '/images/sample/streetlight1.jpg',
  streetlight2: '/images/sample/streetlight2.jpg',
  openDrain1: '/images/sample/openDrain1.jpg',
  openDrain2: '/images/sample/openDrain2.jpg',
  waterlogging1: '/images/sample/waterlogging1.jpg',
  waterlogging2: '/images/sample/waterlogging2.jpg',
  footpath1: '/images/sample/footpath1.jpg',
  footpath2: '/images/sample/footpath2.jpg',
  unsafeCrossing1: '/images/sample/unsafeCrossing1.jpg',
  unsafeCrossing2: '/images/sample/unsafeCrossing2.jpg',
  garbage1: '/images/sample/garbage1.jpg',
  garbage2: '/images/sample/garbage2.jpg',
  // Resolution photos
  resolvedRoad1: '/images/sample/resolvedRoad1.jpg',
  resolvedStreetlight1: '/images/sample/resolvedStreetlight1.jpg',
};

// Helper to construct seed report with priority calculations
function createSeedReport(data: {
  reportId: string;
  userId: string;
  userName: string;
  category: Report['category'];
  description: string;
  photoUrl: string;
  latitude: number;
  longitude: number;
  landmark: string;
  status: Report['status'];
  safetyRisk: 1 | 2 | 3;
  locationSensitivity: 1 | 2 | 3;
  confirmations: number;
  confirmedBy: string[];
  assignedDepartment: Report['assignedDepartment'];
  daysAgo: number;
  resolutionPhotoUrl?: string;
  reopenReason?: string;
  statusNotes?: string;
}): Report {
  const now = new Date();
  const createdDate = new Date(now.getTime() - data.daysAgo * 24 * 60 * 60 * 1000);
  const updatedDate = new Date(createdDate.getTime() + 1000 * 60 * 60 * 12);
  const resolvedDate = data.status === 'Fixed' || data.status === 'Reopened'
    ? new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString()
    : undefined;

  const priority = calculatePriorityScore({
    safetyRisk: data.safetyRisk,
    confirmations: data.confirmations,
    createdAt: createdDate,
    locationSensitivity: data.locationSensitivity,
    category: data.category,
    description: data.description,
    status: data.status,
    resolvedAt: resolvedDate
  });

  const history: StatusHistoryItem[] = [
    {
      id: `hist-${data.reportId}-1`,
      status: 'Reported',
      changedBy: data.userName,
      role: 'Citizen',
      timestamp: createdDate.toISOString(),
      note: 'Initial report submitted with photograph and location.'
    }
  ];

  if (data.confirmations >= 3 || data.status !== 'Reported') {
    history.push({
      id: `hist-${data.reportId}-2`,
      status: 'Verified',
      changedBy: 'CivicLens Community Engine',
      role: 'System',
      timestamp: new Date(createdDate.getTime() + 1000 * 60 * 60 * 24).toISOString(),
      note: `Verified by ${data.confirmations} citizen confirmations.`
    });
  }

  if (['Assigned', 'In Progress', 'Fixed', 'Reopened'].includes(data.status)) {
    history.push({
      id: `hist-${data.reportId}-3`,
      status: 'Assigned',
      changedBy: 'Admin Kiran Rao',
      role: 'Admin',
      timestamp: new Date(createdDate.getTime() + 1000 * 60 * 60 * 36).toISOString(),
      note: `Dispatched to ${data.assignedDepartment}`
    });
  }

  if (['In Progress', 'Fixed', 'Reopened'].includes(data.status)) {
    history.push({
      id: `hist-${data.reportId}-4`,
      status: 'In Progress',
      changedBy: 'Field Operations Crew',
      role: 'Admin',
      timestamp: new Date(createdDate.getTime() + 1000 * 60 * 60 * 48).toISOString(),
      note: 'Repair crew deployed on site with materials.'
    });
  }

  if (['Fixed', 'Reopened'].includes(data.status)) {
    history.push({
      id: `hist-${data.reportId}-5`,
      status: 'Fixed',
      changedBy: 'Admin Kiran Rao',
      role: 'Admin',
      timestamp: resolvedDate || new Date().toISOString(),
      note: 'Issue repaired and certified with after-fix photographic evidence.',
      resolutionPhotoUrl: data.resolutionPhotoUrl
    });
  }

  if (data.status === 'Reopened') {
    history.push({
      id: `hist-${data.reportId}-6`,
      status: 'Reopened',
      changedBy: data.userName,
      role: 'Citizen',
      timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 6).toISOString(),
      note: data.reopenReason || 'Citizen flagged that the defect has reappeared.'
    });
  }

  return {
    reportId: data.reportId,
    userId: data.userId,
    userName: data.userName,
    category: data.category,
    description: data.description,
    photoUrl: data.photoUrl,
    latitude: data.latitude,
    longitude: data.longitude,
    landmark: data.landmark,
    status: data.status,
    priorityScore: priority.score,
    priorityLevel: priority.level,
    safetyRisk: data.safetyRisk,
    injuryRisk: priority.injuryRisk,
    nightRisk: priority.nightRisk,
    accessibilityRisk: priority.accessibilityRisk,
    waterloggingRisk: priority.waterloggingRisk,
    locationSensitivity: data.locationSensitivity,
    confirmations: data.confirmations,
    confirmedBy: data.confirmedBy,
    assignedDepartment: data.assignedDepartment,
    assignedAdminId: 'admin_kiran_01',
    createdAt: createdDate.toISOString(),
    updatedAt: updatedDate.toISOString(),
    resolvedAt: resolvedDate,
    resolutionPhotoUrl: data.resolutionPhotoUrl,
    reopenReason: data.reopenReason,
    statusHistory: history,
    isDemoData: true
  };
}

// 20 Realistic community seed reports in Bachupally demonstration area
export const SEED_REPORTS: Report[] = [
  // 1. Pothole - High Priority (Score >= 70)
  createSeedReport({
    reportId: 'REP-BAC-1001',
    userId: 'user_priya',
    userName: 'Priya Sharma',
    category: 'Pothole',
    description: 'Deep hazardous crater pothole in the middle of Bachupally main crossroad lane. Multiple two-wheelers skidded during evening peak hours.',
    photoUrl: SAMPLE_PHOTOS.pothole1,
    latitude: 17.5382,
    longitude: 78.3828,
    landmark: 'Bachupally X Roads, Near Traffic Signal Junction',
    status: 'In Progress',
    safetyRisk: 3,
    locationSensitivity: 3,
    confirmations: 26,
    daysAgo: 10,
    confirmedBy: ['user_rahul', 'user_ananya', 'user_guest_01', 'user_guest_02'],
    assignedDepartment: 'Roads Department',
  }),

  // 2. Open Drain - High Priority (Score >= 70)
  createSeedReport({
    reportId: 'REP-BAC-1002',
    userId: 'user_rahul',
    userName: 'Rahul Verma',
    category: 'Open Drain',
    description: 'Uncovered sewer storm drain directly next to college campus gate and student pedestrian walkway. Concrete slab completely collapsed.',
    photoUrl: SAMPLE_PHOTOS.openDrain1,
    latitude: 17.5404,
    longitude: 78.3865,
    landmark: 'VNR VJIET College Main Gate Road, Bachupally',
    status: 'Assigned',
    safetyRisk: 3,
    locationSensitivity: 3,
    confirmations: 28,
    daysAgo: 8,
    confirmedBy: ['user_priya', 'user_ananya'],
    assignedDepartment: 'Water/Sanitation Department',
  }),

  // 3. Waterlogging - High Priority (Score >= 70)
  createSeedReport({
    reportId: 'REP-BAC-1003',
    userId: 'user_ananya',
    userName: 'Ananya Reddy',
    category: 'Waterlogging',
    description: 'Severe knee-deep stagnant rainwater accumulation blocking arterial culvert approach. Pedestrians unable to cross; mosquito breeding.',
    photoUrl: SAMPLE_PHOTOS.waterlogging1,
    latitude: 17.5265,
    longitude: 78.3890,
    landmark: 'Pragathi Nagar to Bachupally Main Road near Lake Culvert',
    status: 'Verified',
    safetyRisk: 3,
    locationSensitivity: 3,
    confirmations: 25,
    daysAgo: 12,
    confirmedBy: ['user_priya', 'user_rahul'],
    assignedDepartment: 'Water/Sanitation Department',
  }),

  // 4. Unsafe Crossing - High Priority (Score >= 70)
  createSeedReport({
    reportId: 'REP-BAC-1004',
    userId: 'user_priya',
    userName: 'Priya Sharma',
    category: 'Unsafe Crossing',
    description: 'Faded zebra crossing on high-speed road with non-functioning pedestrian crossing signal. Extreme risk for senior citizens and school students.',
    photoUrl: SAMPLE_PHOTOS.unsafeCrossing1,
    latitude: 17.5290,
    longitude: 78.3835,
    landmark: 'Bachupally - Nizampet Road Pedestrian Crossing',
    status: 'Assigned',
    safetyRisk: 3,
    locationSensitivity: 3,
    confirmations: 27,
    daysAgo: 7,
    confirmedBy: ['user_rahul'],
    assignedDepartment: 'Traffic Department',
  }),

  // 5. Pothole - Medium Priority (Score 40-69)
  createSeedReport({
    reportId: 'REP-BAC-1005',
    userId: 'user_rahul',
    userName: 'Rahul Verma',
    category: 'Pothole',
    description: 'Cluster of asphalt potholes emerging on school commute lane after recent rains. Slows down morning school buses and commuter traffic.',
    photoUrl: SAMPLE_PHOTOS.pothole2,
    latitude: 17.5342,
    longitude: 78.3758,
    landmark: 'Silver Oaks International School Lane, Bachupally',
    status: 'In Progress',
    safetyRisk: 2,
    locationSensitivity: 2,
    confirmations: 18,
    daysAgo: 6,
    confirmedBy: ['user_priya'],
    assignedDepartment: 'Roads Department',
  }),

  // 6. Broken Streetlight - Medium Priority (Score 40-69)
  createSeedReport({
    reportId: 'REP-BAC-1006',
    userId: 'user_ananya',
    userName: 'Ananya Reddy',
    category: 'Broken Streetlight',
    description: 'Three consecutive streetlights dark for over two weeks. Street is completely blacked out creating safety concerns for night shifts.',
    photoUrl: SAMPLE_PHOTOS.streetlight1,
    latitude: 17.5480,
    longitude: 78.3740,
    landmark: 'Kennedy High The Global School Link Road, Bachupally',
    status: 'Verified',
    safetyRisk: 2,
    locationSensitivity: 2,
    confirmations: 16,
    daysAgo: 9,
    confirmedBy: ['user_priya', 'user_rahul'],
    assignedDepartment: 'Electricity Department',
  }),

  // 7. Damaged Footpath - Medium Priority (Score 40-69)
  createSeedReport({
    reportId: 'REP-BAC-1007',
    userId: 'user_priya',
    userName: 'Priya Sharma',
    category: 'Damaged Footpath',
    description: 'Broken paver tiles and exposed reinforcement rebar along hospital pedestrian walkway. Serious tripping hazard for patients.',
    photoUrl: SAMPLE_PHOTOS.footpath1,
    latitude: 17.5312,
    longitude: 78.3745,
    landmark: 'Mamata Academy of Medical Sciences & Hospital Gate, Bachupally',
    status: 'Reported',
    safetyRisk: 2,
    locationSensitivity: 2,
    confirmations: 15,
    daysAgo: 5,
    confirmedBy: ['user_rahul'],
    assignedDepartment: 'Roads Department',
  }),

  // 8. Garbage Dumping - Medium Priority (Score 40-69)
  createSeedReport({
    reportId: 'REP-BAC-1008',
    userId: 'user_rahul',
    userName: 'Rahul Verma',
    category: 'Garbage Dumping',
    description: 'Unregulated municipal waste overflow on road margin creating pungent odor and stray animal menace near the school.',
    photoUrl: SAMPLE_PHOTOS.garbage1,
    latitude: 17.5435,
    longitude: 78.3715,
    landmark: 'Mallampet Road near Bachupally Zilla Parishad High School',
    status: 'Assigned',
    safetyRisk: 2,
    locationSensitivity: 3,
    confirmations: 17,
    daysAgo: 4,
    confirmedBy: ['user_ananya'],
    assignedDepartment: 'Water/Sanitation Department',
  }),

  // 9. Open Drain - Medium Priority (Score 40-69)
  createSeedReport({
    reportId: 'REP-BAC-1009',
    userId: 'user_ananya',
    userName: 'Ananya Reddy',
    category: 'Open Drain',
    description: 'Cracked stone drainage cover partially displaced by heavy delivery vehicles. Smells foul and poses hazard at night.',
    photoUrl: SAMPLE_PHOTOS.openDrain2,
    latitude: 17.5330,
    longitude: 78.3815,
    landmark: 'Sri Chaitanya Junior College Lane, Bachupally',
    status: 'Verified',
    safetyRisk: 2,
    locationSensitivity: 2,
    confirmations: 19,
    daysAgo: 8,
    confirmedBy: ['user_priya'],
    assignedDepartment: 'Water/Sanitation Department',
  }),

  // 10. Waterlogging - Low Priority (Score < 40)
  createSeedReport({
    reportId: 'REP-BAC-1010',
    userId: 'user_priya',
    userName: 'Priya Sharma',
    category: 'Waterlogging',
    description: 'Minor gutter overflow pooling beside corner curbing during low-intensity drizzle.',
    photoUrl: SAMPLE_PHOTOS.waterlogging2,
    latitude: 17.5370,
    longitude: 78.3810,
    landmark: 'Bachupally Gram Panchayat Office Circle',
    status: 'Reported',
    safetyRisk: 1,
    locationSensitivity: 1,
    confirmations: 3,
    daysAgo: 2,
    confirmedBy: [],
    assignedDepartment: 'Water/Sanitation Department',
  }),

  // 11. Broken Streetlight - Low Priority (Score < 40)
  createSeedReport({
    reportId: 'REP-BAC-1011',
    userId: 'user_rahul',
    userName: 'Rahul Verma',
    category: 'Broken Streetlight',
    description: 'Sodium lamp flickering intermittently on student residential lane.',
    photoUrl: SAMPLE_PHOTOS.streetlight2,
    latitude: 17.5420,
    longitude: 78.3895,
    landmark: 'VNR VJIET Hostel & Pedestrian Corridor, Bachupally',
    status: 'Reported',
    safetyRisk: 1,
    locationSensitivity: 1,
    confirmations: 2,
    daysAgo: 3,
    confirmedBy: [],
    assignedDepartment: 'Electricity Department',
  }),

  // 12. Damaged Footpath - Low Priority (Score < 40)
  createSeedReport({
    reportId: 'REP-BAC-1012',
    userId: 'user_ananya',
    userName: 'Ananya Reddy',
    category: 'Damaged Footpath',
    description: 'Slightly chipped edge stone on curb boundary. Foot traffic easily bypasses it.',
    photoUrl: SAMPLE_PHOTOS.footpath2,
    latitude: 17.5360,
    longitude: 78.3880,
    landmark: 'Rainbow International School Road, Bachupally',
    status: 'Reported',
    safetyRisk: 1,
    locationSensitivity: 1,
    confirmations: 1,
    daysAgo: 1,
    confirmedBy: [],
    assignedDepartment: 'Roads Department',
  }),

  // 13. Pothole - FIXED REPORT WITH RESOLUTION PHOTO
  createSeedReport({
    reportId: 'REP-BAC-1013',
    userId: 'user_priya',
    userName: 'Priya Sharma',
    category: 'Pothole',
    description: 'Wide road depression on the turning curve of ORR feeder road, successfully repaved.',
    photoUrl: SAMPLE_PHOTOS.pothole3,
    latitude: 17.5510,
    longitude: 78.3780,
    landmark: 'ORR Service Road connecting Bachupally',
    status: 'Fixed',
    safetyRisk: 2,
    locationSensitivity: 2,
    confirmations: 12,
    confirmedBy: ['user_rahul', 'user_ananya'],
    daysAgo: 14,
    resolutionPhotoUrl: SAMPLE_PHOTOS.resolvedRoad1,
    assignedDepartment: 'Roads Department',
  }),

  // 14. Broken Streetlight - FIXED REPORT WITH RESOLUTION PHOTO
  createSeedReport({
    reportId: 'REP-BAC-1014',
    userId: 'user_rahul',
    userName: 'Rahul Verma',
    category: 'Broken Streetlight',
    description: 'Damaged luminaire pole following wind storm. Replaced with high-efficiency LED fixture.',
    photoUrl: SAMPLE_PHOTOS.streetlight1,
    latitude: 17.5355,
    longitude: 78.3790,
    landmark: 'Bachupally Community Health Centre Road',
    status: 'Fixed',
    safetyRisk: 2,
    locationSensitivity: 2,
    confirmations: 8,
    confirmedBy: ['user_priya'],
    daysAgo: 16,
    resolutionPhotoUrl: SAMPLE_PHOTOS.resolvedStreetlight1,
    assignedDepartment: 'Electricity Department',
  }),

  // 15. Garbage Dumping - REOPENED REPORT
  createSeedReport({
    reportId: 'REP-BAC-1015',
    userId: 'user_ananya',
    userName: 'Ananya Reddy',
    category: 'Garbage Dumping',
    description: 'Chronic illegal commercial dumping point near lake boundary.',
    photoUrl: SAMPLE_PHOTOS.garbage2,
    latitude: 17.5300,
    longitude: 78.3770,
    landmark: 'Relief Hospital Road near Bachupally Lake View Colony',
    status: 'Reopened',
    safetyRisk: 2,
    locationSensitivity: 2,
    confirmations: 14,
    confirmedBy: ['user_priya', 'user_rahul'],
    daysAgo: 20,
    resolutionPhotoUrl: SAMPLE_PHOTOS.garbage1,
    reopenReason: 'Garbage clearing was only partial. Dumpsters were emptied once but debris and commercial plastic waste remain strewn across 50 meters of the roadway.',
    assignedDepartment: 'Water/Sanitation Department',
  }),

  // 16. Unsafe Crossing - Medium Priority
  createSeedReport({
    reportId: 'REP-BAC-1016',
    userId: 'user_priya',
    userName: 'Priya Sharma',
    category: 'Unsafe Crossing',
    description: 'Broken safety island curb where pedestrians wait to cross high-speed industrial feeder.',
    photoUrl: SAMPLE_PHOTOS.unsafeCrossing2,
    latitude: 17.5465,
    longitude: 78.3840,
    landmark: 'Dr. Reddy\'s Lab Transit Crossing, Bachupally-Bollaram Road',
    status: 'Reported',
    safetyRisk: 2,
    locationSensitivity: 2,
    confirmations: 16,
    confirmedBy: ['user_rahul'],
    daysAgo: 7,
    assignedDepartment: 'Traffic Department',
  }),

  // 17. Waterlogging - Bachupally Community Central
  createSeedReport({
    reportId: 'REP-BAC-1017',
    userId: 'user_ananya',
    userName: 'Ananya Reddy',
    category: 'Waterlogging',
    description: 'Severe monsoon rainwater puddle and blocked kerbside drain near central bus shelter.',
    photoUrl: SAMPLE_PHOTOS.waterlogging1,
    latitude: 17.5378,
    longitude: 78.3820,
    landmark: 'Near Bachupally Main X Roads Bus Shelter',
    status: 'Verified',
    safetyRisk: 3,
    locationSensitivity: 3,
    confirmations: 22,
    daysAgo: 4,
    confirmedBy: ['user_priya', 'user_rahul'],
    assignedDepartment: 'Water/Sanitation Department',
  }),

  // 18. Open Drain - Bachupally Commercial Lane
  createSeedReport({
    reportId: 'REP-BAC-1018',
    userId: 'user_rahul',
    userName: 'Rahul Verma',
    category: 'Open Drain',
    description: 'Damaged stone slab over stormwater canal near market delivery alleyway.',
    photoUrl: SAMPLE_PHOTOS.openDrain1,
    latitude: 17.5270,
    longitude: 78.3885,
    landmark: 'Alley behind Pragathi Nagar - Bachupally Commercial Plaza',
    status: 'Assigned',
    safetyRisk: 3,
    locationSensitivity: 2,
    confirmations: 19,
    daysAgo: 6,
    confirmedBy: ['user_ananya'],
    assignedDepartment: 'Water/Sanitation Department',
  }),

  // 19. Damaged Footpath - Campus Pathway
  createSeedReport({
    reportId: 'REP-BAC-1019',
    userId: 'user_priya',
    userName: 'Priya Sharma',
    category: 'Damaged Footpath',
    description: 'Displaced pavers and steep broken curb ramp making wheelchair and stroller passage impossible.',
    photoUrl: SAMPLE_PHOTOS.footpath1,
    latitude: 17.5398,
    longitude: 78.3860,
    landmark: 'Pedestrian Pathway leading to VNR VJIET College Gate',
    status: 'Verified',
    safetyRisk: 2,
    locationSensitivity: 3,
    confirmations: 15,
    daysAgo: 5,
    confirmedBy: ['user_rahul'],
    assignedDepartment: 'Roads Department',
  }),

  // 20. Pothole - Community Lake Connector Road
  createSeedReport({
    reportId: 'REP-BAC-1020',
    userId: 'user_rahul',
    userName: 'Rahul Verma',
    category: 'Pothole',
    description: 'Cluster of asphalt potholes emerging on lake park connector lane.',
    photoUrl: SAMPLE_PHOTOS.pothole2,
    latitude: 17.5350,
    longitude: 78.3875,
    landmark: 'East Connector Road near Bachupally Lake & Park',
    status: 'In Progress',
    safetyRisk: 2,
    locationSensitivity: 2,
    confirmations: 14,
    daysAgo: 3,
    confirmedBy: ['user_priya'],
    assignedDepartment: 'Roads Department',
  }),
];
