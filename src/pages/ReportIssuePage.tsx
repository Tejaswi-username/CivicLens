import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useReports } from '../context/ReportContext';
import { reportService } from '../services/reportService';
import { ReportCategory } from '../types/report';
import { LocationPickerMap } from '../components/map/LocationPickerMap';
import { DuplicateWarningModal } from '../components/reports/DuplicateWarningModal';
import { SAMPLE_PHOTOS } from '../data/seedReports';
import { HazardImage } from '../components/ui/HazardImage';
import { compressImage, getAppropriateWebImage } from '../utils/imageUtils';
import {
  COMMUNITY_CONFIG,
  isWithinCommunity,
  OUTSIDE_COMMUNITY_MESSAGE
} from '../utils/communityConfig';
import {
  Camera,
  Upload,
  AlertTriangle,
  MapPin,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Trash2,
  Shield,
  Lightbulb,
  Droplets,
  AlertOctagon,
  Footprints,
  Compass,
  Sparkles,
  HelpCircle,
  Share2
} from 'lucide-react';
import { VoiceInputButton } from '../components/reports/VoiceInputButton';
import { ShareReportModal } from '../components/reports/ShareReportModal';

export const ReportIssuePage: React.FC = () => {
  const { currentUser } = useAuth();
  const { createReport, getReportById } = useReports();
  const navigate = useNavigate();

  // Step state (1 to 6, plus 7 for success screen)
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [submitting, setSubmitting] = useState(false);
  const [createdReportId, setCreatedReportId] = useState<string | null>(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  // Form Fields
  const [photoUrl, setPhotoUrl] = useState<string>(SAMPLE_PHOTOS.pothole1);
  const [photoFileName, setPhotoFileName] = useState<string>('sample_pothole.jpg');
  const [category, setCategory] = useState<ReportCategory>('Pothole');
  const [description, setDescription] = useState<string>('');
  const [landmark, setLandmark] = useState<string>('Bachupally X Roads, Hyderabad');
  const [notes, setNotes] = useState<string>('');
  const [latitude, setLatitude] = useState<number>(17.5382);
  const [longitude, setLongitude] = useState<number>(78.3828);
  const [safetyRisk, setSafetyRisk] = useState<1 | 2 | 3>(3);
  const [nightRisk, setNightRisk] = useState<1 | 2 | 3>(1);
  const [accessibilityRisk, setAccessibilityRisk] = useState<1 | 2 | 3>(1);
  const [waterloggingRisk, setWaterloggingRisk] = useState<1 | 2 | 3>(1);
  const [locationSensitivity, setLocationSensitivity] = useState<1 | 2 | 3>(3);

  // Duplicate Check Modal State
  const [duplicateWarning, setDuplicateWarning] = useState<{
    isOpen: boolean;
    existingReport: any;
    distanceMeters: number;
  }>({
    isOpen: false,
    existingReport: null,
    distanceMeters: 0
  });

  // Validation errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const categoryOptions: { label: ReportCategory; icon: any; desc: string; samplePhoto: string }[] = [
    { label: 'Pothole', icon: AlertOctagon, desc: 'Road depression or asphalt crater', samplePhoto: SAMPLE_PHOTOS.pothole1 },
    { label: 'Broken Streetlight', icon: Lightbulb, desc: 'Dark luminaire or flickering pole', samplePhoto: SAMPLE_PHOTOS.streetlight1 },
    { label: 'Open Drain', icon: AlertTriangle, desc: 'Missing manhole or collapsed storm drain', samplePhoto: SAMPLE_PHOTOS.openDrain1 },
    { label: 'Waterlogging', icon: Droplets, desc: 'Stagnant rainwater pooling on roads', samplePhoto: SAMPLE_PHOTOS.waterlogging1 },
    { label: 'Damaged Footpath', icon: Footprints, desc: 'Broken paver blocks or broken curbs', samplePhoto: SAMPLE_PHOTOS.footpath1 },
    { label: 'Unsafe Crossing', icon: Compass, desc: 'Missing zebra crossing or signals', samplePhoto: SAMPLE_PHOTOS.unsafeCrossing1 },
    { label: 'Garbage Dumping', icon: Trash2, desc: 'Unregulated municipal waste overflow', samplePhoto: SAMPLE_PHOTOS.garbage1 },
    { label: 'Other', icon: HelpCircle, desc: 'Other public civil infrastructure failure', samplePhoto: SAMPLE_PHOTOS.pothole2 },
  ];

  // Handle local file upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, photo: 'Please upload a valid image file (JPG, PNG, WebP).' }));
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, photo: 'Image size should be below 8MB.' }));
      return;
    }

    setPhotoFileName(file.name);
    setErrors(prev => ({ ...prev, photo: '' }));

    try {
      const compressed = await compressImage(file);
      if (compressed) {
        setPhotoUrl(compressed);
        return;
      }
    } catch {
      // Fallback to normal FileReader if canvas compression fails
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setPhotoUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSelectSample = (sampleUrl: string, sampleName: string) => {
    setPhotoUrl(sampleUrl);
    setPhotoFileName(sampleName);
    setErrors(prev => ({ ...prev, photo: '' }));
  };

  const validateStep = (step: number): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (step === 1 && !photoUrl) {
      newErrors.photo = 'Please provide an image of the infrastructure issue.';
    }

    if (step === 3 && (!description.trim() || description.trim().length < 10)) {
      newErrors.description = 'Please provide a clear description (at least 10 characters).';
    }

    if (step === 4) {
      if (!latitude || !longitude) {
        newErrors.location = 'Please set valid GPS coordinates on the map.';
      } else if (!isWithinCommunity(latitude, longitude)) {
        newErrors.location = OUTSIDE_COMMUNITY_MESSAGE;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  // Perform submission
  const executeSubmission = () => {
    setSubmitting(true);
    setTimeout(() => {
      const fullDescription = notes.trim()
        ? `${description.trim()} (Notes: ${notes.trim()})`
        : description.trim();

      const finalPhotoUrl = (photoUrl && photoUrl.trim() !== '')
        ? photoUrl
        : getAppropriateWebImage(category, fullDescription);

      const newReport = createReport({
        userId: currentUser.userId,
        userName: currentUser.name,
        category,
        description: fullDescription,
        photoUrl: finalPhotoUrl,
        latitude,
        longitude,
        landmark: landmark.trim() || 'Bachupally, Hyderabad',
        safetyRisk,
        injuryRisk: safetyRisk,
        nightRisk,
        accessibilityRisk,
        waterloggingRisk,
        locationSensitivity
      });

      setSubmitting(false);
      setCreatedReportId(newReport.reportId);
      setCurrentStep(7); // Success Screen
    }, 600);
  };

  // Pre-submit duplicate verification check
  const handleSubmitClick = () => {
    if (!validateStep(1) || !validateStep(3) || !validateStep(4)) {
      alert('Please fill out all required fields.');
      return;
    }

    // Duplicate detection rule (Section 10)
    const dupCheck = reportService.checkDuplicates(latitude, longitude, category, 40);

    if (dupCheck.isDuplicate && dupCheck.existingReport) {
      setDuplicateWarning({
        isOpen: true,
        existingReport: dupCheck.existingReport,
        distanceMeters: dupCheck.distanceMeters
      });
      return;
    }

    // No duplicate found: submit directly
    executeSubmission();
  };

  // Success Screen
  if (currentStep === 7 && createdReportId) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center animate-bounce shadow-lg">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
            Submission Received
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900">
            Issue Successfully Reported!
          </h2>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            Your report has been logged with coordinates and priority evaluation. Nearby citizens can
            now validate this issue to escalate its urgency.
          </p>
        </div>

        {/* Unique Report ID Box */}
        <div className="p-4 rounded-2xl bg-slate-900 text-white font-mono text-center space-y-1 shadow-md">
          <div className="text-xs text-slate-400">Unique Tracking Report ID</div>
          <div className="text-2xl font-extrabold text-teal-300 tracking-wider">
            {createdReportId}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          {createdReportId && getReportById(createdReportId) && (
            <button
              onClick={() => setShareModalOpen(true)}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              <span>Share Report Card</span>
            </button>
          )}
          <Link
            to={`/reports/${createdReportId}`}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition"
          >
            View Live Report Details
          </Link>
          <Link
            to="/citizen"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs border border-slate-200 transition"
          >
            Return to Citizen Desk
          </Link>
          <Link
            to="/map"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 font-semibold text-xs border border-teal-200 transition"
          >
            Find on Map
          </Link>
        </div>

        {createdReportId && getReportById(createdReportId) && (
          <ShareReportModal
            report={getReportById(createdReportId)!}
            isOpen={shareModalOpen}
            onClose={() => setShareModalOpen(false)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
      {/* Page Title & Progress Stepper */}
      <div className="space-y-4 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-blue-500" />
          <span>SDG 11 Fast Civic Reporting</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Report an Infrastructure Issue
        </h1>
        <p className="text-xs text-slate-500 max-w-lg mx-auto">
          Help eliminate invisible road hazards, open drains, and broken streetlights across your ward.
        </p>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-1.5 pt-2">
          {[1, 2, 3, 4, 5, 6].map(step => (
            <div
              key={step}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentStep === step
                  ? 'w-8 bg-blue-600'
                  : currentStep > step
                  ? 'w-4 bg-teal-600'
                  : 'w-4 bg-slate-200'
              }`}
            />
          ))}
        </div>
        <div className="text-xs font-semibold text-slate-400">
          Step {currentStep} of 6:{' '}
          <span className="text-slate-800">
            {currentStep === 1 && 'Upload Evidence Photo'}
            {currentStep === 2 && 'Select Category'}
            {currentStep === 3 && 'Describe the Problem'}
            {currentStep === 4 && 'Pinpoint Map Location'}
            {currentStep === 5 && 'Assess Safety & Sensitivity'}
            {currentStep === 6 && 'Review & Submit'}
          </span>
        </div>
      </div>

      {/* Main Multi-Step Form Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        {/* STEP 1: Upload Evidence */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Step 1: Upload Photograph</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Clear photographic proof helps engineers quickly diagnose the required equipment.
              </p>
            </div>

            {/* Current Photo Preview or Empty Dropzone */}
            {photoUrl ? (
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 h-64 bg-slate-100 group">
                <HazardImage
                  src={photoUrl}
                  alt="Issue preview"
                  category={category}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3">
                  <label className="cursor-pointer px-4 py-2 bg-white text-slate-900 rounded-xl text-xs font-bold hover:bg-slate-100 transition shadow">
                    Replace Photo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setPhotoUrl('');
                      setPhotoFileName('');
                    }}
                    className="p-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition"
                    title="Remove Photo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="absolute bottom-2 left-2 bg-slate-900/80 text-white text-[11px] px-2.5 py-1 rounded-md">
                  Active Photo: {photoFileName}
                </div>
              </div>
            ) : (
              <label className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition bg-slate-50/50 hover:bg-blue-50/30">
                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-3">
                  <Camera className="w-6 h-6" />
                </div>
                <div className="text-sm font-semibold text-slate-800">
                  Upload an image from your device
                </div>
                <div className="text-xs text-slate-400 mt-1">PNG, JPG, or WebP up to 8MB</div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            )}

            {errors.photo && <p className="text-xs text-red-600 font-semibold">{errors.photo}</p>}

            {/* Quick Demo Sample Selector */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <span className="text-xs font-semibold text-slate-600">
                Or select a demonstration photo:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {categoryOptions.slice(0, 4).map(opt => (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => handleSelectSample(opt.samplePhoto, `sample_${opt.label.toLowerCase()}.jpg`)}
                    className="text-left p-2 rounded-xl border border-slate-200 hover:border-blue-400 text-[11px] flex items-center gap-2 transition hover:bg-slate-50"
                  >
                    <HazardImage
                      src={opt.samplePhoto}
                      alt={opt.label}
                      category={opt.label}
                      className="w-8 h-8 rounded-md object-cover flex-shrink-0"
                      fallbackIconOnly
                    />
                    <span className="font-medium truncate">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Select Category */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Step 2: Select Issue Category</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Choosing the right category automatically routes the issue to the relevant department.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {categoryOptions.map(opt => {
                const IconComponent = opt.icon;
                const isSelected = category === opt.label;
                return (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => {
                      setCategory(opt.label);
                      if (opt.label === 'Broken Streetlight') {
                        setNightRisk(3);
                      } else if (opt.label === 'Waterlogging') {
                        setWaterloggingRisk(3);
                      } else if (opt.label === 'Damaged Footpath') {
                        setAccessibilityRisk(3);
                      } else if (opt.label === 'Unsafe Crossing') {
                        setAccessibilityRisk(3);
                        setNightRisk(2);
                      } else if (opt.label === 'Open Drain') {
                        setAccessibilityRisk(2);
                        setWaterloggingRisk(2);
                        setNightRisk(2);
                      }
                      // Auto-update sample photo if current photo is still a sample
                      if (photoFileName.startsWith('sample_')) {
                        setPhotoUrl(opt.samplePhoto);
                        setPhotoFileName(`sample_${opt.label.toLowerCase()}.jpg`);
                      }
                    }}
                    className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/70 shadow-sm ring-2 ring-blue-500/20'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div
                      className={`p-2 rounded-xl ${
                        isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-900">{opt.label}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{opt.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 3: Describe Issue */}
        {currentStep === 3 && (
          <div className="space-y-5">
            <div>
              <h3 className="text-base font-bold text-slate-900">Step 3: Describe the Problem</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Provide concise details and nearby landmarks so field crews can locate it quickly.
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5 flex-wrap gap-2">
                <label className="block text-xs font-semibold text-slate-800">
                  Description of Defect <span className="text-red-500">*</span>
                </label>
                <VoiceInputButton
                  onTranscript={text => {
                    setDescription(prev => (prev ? `${prev} ${text}` : text));
                  }}
                  onInferredCategory={cat => {
                    setCategory(cat);
                  }}
                />
              </div>
              <textarea
                rows={3}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="e.g. Deep crater pothole right on the edge of the bus stop lane. Two-wheelers are losing balance when turning."
                className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              {errors.description && (
                <p className="text-xs text-red-600 mt-1 font-semibold">{errors.description}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Nearest Landmark (Optional)
              </label>
              <input
                type="text"
                value={landmark}
                onChange={e => setLandmark(e.target.value)}
                placeholder="e.g. Opposite Care Hospital, Banjara Hills Road No. 12"
                className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Additional Notes / Timing (Optional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="e.g. Worse during evening peak hours 6 PM - 9 PM"
                className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* STEP 4: Set Location */}
        {currentStep === 4 && (
          <div className="space-y-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {COMMUNITY_CONFIG.badgeLabel}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900">Step 4: Pinpoint Location in Bachupally</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Drag the pin or click on the map to pinpoint the defect inside the Bachupally community area.
              </p>
            </div>

            <LocationPickerMap
              latitude={latitude}
              longitude={longitude}
              onChangeLocation={(lat, lng) => {
                setLatitude(lat);
                setLongitude(lng);
              }}
            />
          </div>
        )}

        {/* STEP 5: Risk & Sensitivity Assessment */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Step 5: Safety & Risk Assessment</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                These standardized risk questions feed directly into the Priority Scoring Engine.
              </p>
            </div>

            {/* Question 1: Safety Risk */}
            <div className="space-y-2.5">
              <label className="block text-xs font-bold text-slate-800">
                1. Can someone get injured because of this issue?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {[
                  { value: 3 as const, label: 'Yes', sub: 'High risk of accidents/injury', pts: 'Safety Risk 3' },
                  { value: 2 as const, label: 'Maybe', sub: 'Possible hazard if unaware', pts: 'Safety Risk 2' },
                  { value: 1 as const, label: 'No', sub: 'Inconvenience, low hazard', pts: 'Safety Risk 1' },
                ].map(item => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setSafetyRisk(item.value)}
                    className={`p-3 rounded-xl border text-left transition ${
                      safetyRisk === item.value
                        ? 'border-blue-600 bg-blue-50/80 ring-2 ring-blue-500/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="font-bold text-xs text-slate-900 flex items-center justify-between">
                      <span>{item.label}</span>
                      <span className="text-[10px] text-blue-700 font-semibold">{item.pts}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">{item.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Question 2: Location Sensitivity */}
            <div className="space-y-2.5 pt-2">
              <label className="block text-xs font-bold text-slate-800">
                2. How sensitive is this location?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {[
                  { value: 3 as const, label: 'Critical Zone', sub: 'Near school, hospital, bus stop, market, or arterial road', pts: 'Level 3' },
                  { value: 2 as const, label: 'Residential', sub: 'Normal neighborhood street or lane', pts: 'Level 2' },
                  { value: 1 as const, label: 'Low Traffic', sub: 'Isolated or rarely traversed margin', pts: 'Level 1' },
                ].map(item => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setLocationSensitivity(item.value)}
                    className={`p-3 rounded-xl border text-left transition ${
                      locationSensitivity === item.value
                        ? 'border-blue-600 bg-blue-50/80 ring-2 ring-blue-500/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="font-bold text-xs text-slate-900 flex items-center justify-between">
                      <span>{item.label}</span>
                      <span className="text-[10px] text-blue-700 font-semibold">{item.pts}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1 leading-snug">{item.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Additional Risk Factors Grid */}
            <div className="pt-2 border-t border-slate-100 space-y-4">
              <div className="text-xs font-bold text-slate-800">
                3. Vulnerability & Environmental Risk Factors
              </div>

              {/* Night Risk */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">Night Risk (Darkness / Low Visibility Hazard)</span>
                  <span className="text-[11px] text-slate-500 font-mono">Weight × 2</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 3 as const, label: 'Severe (3)', sub: 'Complete darkness' },
                    { value: 2 as const, label: 'Moderate (2)', sub: 'Dimly lit' },
                    { value: 1 as const, label: 'Normal (1)', sub: 'Well-lit' },
                  ].map(lvl => (
                    <button
                      key={lvl.value}
                      type="button"
                      onClick={() => setNightRisk(lvl.value)}
                      className={`p-2 rounded-xl border text-left text-xs transition ${
                        nightRisk === lvl.value
                          ? 'border-indigo-600 bg-indigo-50/70 font-bold ring-1 ring-indigo-500'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="font-semibold">{lvl.label}</div>
                      <div className="text-[10px] text-slate-500">{lvl.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Accessibility Risk */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">Accessibility Risk (Pedestrians, Wheelchairs & Elderly)</span>
                  <span className="text-[11px] text-slate-500 font-mono">Weight × 3</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 3 as const, label: 'Blocks Passage (3)', sub: 'Impairs wheelchairs' },
                    { value: 2 as const, label: 'Obstacle (2)', sub: 'Difficult to pass' },
                    { value: 1 as const, label: 'Clear Path (1)', sub: 'Sidewalk clear' },
                  ].map(lvl => (
                    <button
                      key={lvl.value}
                      type="button"
                      onClick={() => setAccessibilityRisk(lvl.value)}
                      className={`p-2 rounded-xl border text-left text-xs transition ${
                        accessibilityRisk === lvl.value
                          ? 'border-emerald-600 bg-emerald-50/70 font-bold ring-1 ring-emerald-500'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="font-semibold">{lvl.label}</div>
                      <div className="text-[10px] text-slate-500">{lvl.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Waterlogging Risk */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">Waterlogging Risk (Rainwater Stagnation / Flooding)</span>
                  <span className="text-[11px] text-slate-500 font-mono">Weight × 2</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 3 as const, label: 'High Flooding (3)', sub: 'Deep water pooling' },
                    { value: 2 as const, label: 'Partial Drain (2)', sub: 'Gutter overflow' },
                    { value: 1 as const, label: 'Dry / Low (1)', sub: 'No water pooling' },
                  ].map(lvl => (
                    <button
                      key={lvl.value}
                      type="button"
                      onClick={() => setWaterloggingRisk(lvl.value)}
                      className={`p-2 rounded-xl border text-left text-xs transition ${
                        waterloggingRisk === lvl.value
                          ? 'border-cyan-600 bg-cyan-50/70 font-bold ring-1 ring-cyan-500'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="font-semibold">{lvl.label}</div>
                      <div className="text-[10px] text-slate-500">{lvl.sub}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: Review & Final Submit */}
        {currentStep === 6 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Step 6: Review & Submit</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Please verify the summary before filing your official community report.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="sm:col-span-1 h-36 rounded-xl overflow-hidden border border-slate-300">
                <HazardImage
                  src={photoUrl}
                  alt="Review"
                  category={category}
                  description={description}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="sm:col-span-2 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">{category}</span>
                  <span className="text-[11px] font-semibold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                    Reporter: {currentUser.name}
                  </span>
                </div>

                <p className="text-slate-700 leading-relaxed font-medium">
                  {description}
                </p>

                <div className="text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{landmark || 'Bachupally Ward Coordinates'}</span>
                </div>

                <div className="font-mono text-[11px] text-slate-400">
                  GPS: {latitude.toFixed(4)}, {longitude.toFixed(4)}
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-600">
                  <span>Safety Risk: <strong>{safetyRisk}/3</strong></span>
                  <span>Location Sensitivity: <strong>{locationSensitivity}/3</strong></span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer Navigation Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-100 mt-6">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={prevStep}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {currentStep < 6 ? (
            <button
              type="button"
              onClick={nextStep}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md transition flex items-center gap-1.5"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmitClick}
              disabled={submitting}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-700 to-teal-700 hover:from-blue-800 hover:to-teal-800 text-white text-xs font-extrabold shadow-lg shadow-blue-600/30 transition flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{submitting ? 'Submitting Report...' : 'Confirm & Submit Issue'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Duplicate Warning Modal */}
      <DuplicateWarningModal
        isOpen={duplicateWarning.isOpen}
        onClose={() => setDuplicateWarning(prev => ({ ...prev, isOpen: false }))}
        existingReport={duplicateWarning.existingReport}
        distanceMeters={duplicateWarning.distanceMeters}
        onConfirmExisting={(existingId) => {
          navigate(`/reports/${existingId}`);
        }}
        onReportAnyway={() => {
          executeSubmission();
        }}
      />
    </div>
  );
};
