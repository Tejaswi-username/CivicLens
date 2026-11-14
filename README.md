# Broken but Invisible | CivicLens

> **Tagline:** “See it. Report it. Track it. Fix it.”  
> **Mission:** “Making every public issue visible, accountable, and actionable.”  
> **Supporting:** **UN Sustainable Development Goal 11: Sustainable Cities and Communities**

**Broken but Invisible** (with product subtitle **CivicLens**) is a civic infrastructure reporting platform designed for transparent municipal collaboration. The platform empowers citizens to report neglected urban infrastructure failures (potholes, open drains, non-functioning streetlights, waterlogging, unsafe crossings, damaged footpaths, and garbage dumps), enables community consensus validation, and equips municipal ward officers with dispatch workflows, priority scoring, after-fix photographic certification, and analytics.

---

## 1. Key Features

- **Multi-Step Citizen Reporting Form:**
  - Image upload with instant preview (supports device camera/local files or quick demo photo selection).
  - 8 standardized urban defect categories with descriptive iconography.
  - Interactive Leaflet/OpenStreetMap marker placement with device GPS support and fallback to sample Hyderabad coordinates.
  - Multi-tier safety hazard and location sensitivity risk scoring.
  - Fast submission yielding a unique report tracking code (e.g. `REP-HYD-1001`).

- **Duplicate Report Detection (40-Meter Proximity Rule):**
  - Uses the Haversine formula to compute geodesic distances between proposed issues and existing open tickets within the same category.
  - If an issue is within 40 meters, warns the citizen with the existing report’s photo, description, and status.
  - Offers two actions: **“Confirm Existing Issue”** (prevents duplicate tickets and elevates urgency) or **“Report Anyway”**.

- **Exact Priority Scoring Engine:**
  - Formula:
    $$\text{Priority Score} = (\text{Safety Risk} \times 3) + (\text{Confirmations} \times 2) + \text{Days Open} + \text{Location Sensitivity}$$
  - **High Priority:** Score $\ge 70$
  - **Medium Priority:** Score $40 - 69$
  - **Low Priority:** Score $< 40$
  - Dynamic score breakdown card with live mathematical explanation and progress gauges.

- **Community Validation Consensus:**
  - Citizens can click **“I also face this issue”** on any ticket.
  - Enforces identity checks (same logged-in citizen cannot confirm twice).
  - When an issue reaches 3 citizen confirmations, its status automatically transitions from *Reported* to *Verified*.

- **Interactive Leaflet & OpenStreetMap Public Map:**
  - Distinct colored pins for status and priority:
    - 🔴 **Red:** High-priority unresolved
    - 🟠 **Orange:** Medium-priority unresolved
    - 🟡 **Yellow:** In Progress
    - 🟢 **Green:** Fixed / Certified
    - ⚪ **Grey:** Low-priority open
  - Popups with thumbnails, landmark distances, status badges, and direct detail links.
  - Search and filter by category, status, and priority.
  - Responsive list/map view switcher for mobile devices.

- **Municipal Operations Dashboard:**
  - Role-based municipal command center with persistent navigation sidebar.
  - Real-time KPI summaries: Total Reports, Open, In Progress, Fixed, and High-Priority Hazards.
  - Interactive charts powered by Recharts: Category distribution, Status pipeline, Intake/Resolution trends, and Department workload.
  - High-priority urgent dispatch queue.

- **Strict Resolution & Audit Workflow:**
  - Department routing to Roads, Electricity, Water/Sanitation, Traffic, or General.
  - Strict prerequisite: A report **cannot be marked Fixed** without uploading certified after-fix photographic evidence.
  - Full audit trail logging every timestamp, actor, role (Citizen, Admin, System), and status note.
  - Citizen Reopen capability: If a defect resurfaces, citizens can reopen a Fixed issue with an explanation.

- **Language Support (English / Telugu):**
  - Integrated header toggle for English and Telugu (తెలుగు) covering navigation, headings, and core citizen actions.

---

## 2. Technology Stack

- **Frontend:** React 18, TypeScript, Vite
- **Styling:** Tailwind CSS, PostCSS, Lucide React icons
- **Maps:** Leaflet & OpenStreetMap
- **Data Visualizations:** Recharts
- **Routing:** React Router v6
- **Persistence & Architecture:**
  - Default: Instant Local Demo Mode via typed `localStorage` persistence.
  - Firebase-Ready: Decoupled service architecture ready for Firebase Auth, Cloud Firestore, and Firebase Storage.

---

## 3. Project Structure

```
CivicLens/
├── public/
├── src/
│   ├── components/
│   │   ├── charts/
│   │   │   └── DashboardCharts.tsx      # Recharts (Bar, Pie, Area, Department)
│   │   ├── layout/
│   │   │   └── AdminLayout.tsx          # Municipal ops sidebar & header
│   │   ├── map/
│   │   │   ├── LeafletMap.tsx           # Full interactive OpenStreetMap
│   │   │   └── LocationPickerMap.tsx    # Draggable pin GPS location picker
│   │   ├── reports/
│   │   │   ├── DuplicateWarningModal.tsx# 40-meter duplicate detection modal
│   │   │   ├── PriorityScoreCard.tsx    # Priority engine breakdown & math
│   │   │   ├── ReopenModal.tsx          # Citizen issue reopen modal
│   │   │   ├── ReportCard.tsx           # Reusable report card
│   │   │   └── ReportStatusTimeline.tsx # Lifecycle stepper & after-fix proof
│   │   └── ui/
│   │       ├── Badge.tsx                # Status, priority & category badges
│   │       ├── DemoRoleBanner.tsx       # 1-click persona switcher & reset
│   │       ├── Footer.tsx               # SDG 11 references & disclaimer
│   │       ├── Modal.tsx                # Accessible backdrop dialog
│   │       ├── Navbar.tsx               # Responsive nav & language toggle
│   │       └── ToastContainer.tsx       # Live status change notifications
│   ├── context/
│   │   ├── AuthContext.tsx              # Persona state & auth credentials
│   │   ├── LanguageContext.tsx          # English / Telugu state
│   │   └── ReportContext.tsx            # Global report store & action handlers
│   ├── data/
│   │   └── seedReports.ts               # 16 realistic Hyderabad sample reports
│   ├── pages/
│   │   ├── AdminDashboard.tsx           # Municipal operations overview
│   │   ├── AdminLoginPage.tsx           # Officer credential portal
│   │   ├── AdminReportDetailsPage.tsx   # Department dispatch & resolution
│   │   ├── AdminReportsPage.tsx         # Filterable master report table
│   │   ├── AnalyticsPage.tsx            # City-wide performance analytics
│   │   ├── CitizenDashboard.tsx         # Citizen hub with nearby issues
│   │   ├── LandingPage.tsx              # Public hero, impact stats & SDG 11
│   │   ├── LoginPage.tsx                # Citizen login & persona picker
│   │   ├── MyReportsPage.tsx            # User report portfolio
│   │   ├── ProfilePage.tsx              # Citizen badges & stats
│   │   ├── PublicMapPage.tsx            # Full-screen issue map explorer
│   │   ├── ReportDetailsPage.tsx        # Public tracking & "I face this"
│   │   ├── ReportIssuePage.tsx          # Multi-step report form
│   │   └── SignupPage.tsx               # Citizen registration
│   ├── services/
│   │   ├── analyticsService.ts          # Aggregate metrics & KPIs
│   │   ├── authService.ts               # Local authentication & Firebase stub
│   │   ├── reportService.ts             # CRUD, duplicate check & confirmations
│   │   └── storageService.ts            # Persistent localStorage layer
│   ├── types/
│   │   ├── report.ts                    # Full TypeScript Report interface
│   │   └── user.ts                      # User & DemoAccount types
│   ├── utils/
│   │   ├── date.ts                      # Date formatting & relative time
│   │   ├── distance.ts                  # Haversine distance formula
│   │   ├── priority.ts                  # Strict priority score formula
│   │   └── translations.ts              # English / Telugu translation keys
│   ├── App.tsx                          # Router configuration
│   ├── index.css                        # Tailwind directives & leaflet styles
│   ├── main.tsx                         # DOM entry point
│   └── vite-env.d.ts                    # Vite client types
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## 4. Prerequisites

- **Node.js:** v18.0.0 or higher (v20+ or v24 recommended)
- **npm:** v9.0.0 or higher
- Modern web browser (Chrome, Edge, Firefox, Safari)

---

## 5. Installation & Local Run Instructions

### Step 1: Open project directory
```bash
cd c:\Users\sathw\OneDrive\Desktop\sat\CivicLens
```

### Step 2: Install dependencies (if not already installed)
```bash
npm install
```

### Step 3: Start the local development server
```bash
npm run dev
```

The application will start immediately at:
👉 **`http://localhost:5173`**

### Step 4: Build for production
```bash
npm run build
npm run preview
```

---

## 6. Demo Access & Credentials

The application includes a visible **Demo Identity Switcher** at the top of every screen:

| Role | Name | Email | Description |
| :--- | :--- | :--- | :--- |
| **Citizen** | Priya Sharma | `priya.sharma@civiclens.demo` | Active Community Reporter (Banjara Hills) |
| **Citizen** | Rahul Verma | `rahul.verma@civiclens.demo` | Citizen Advocate & Cyclist (Gachibowli) |
| **Citizen** | Ananya Reddy | `ananya.reddy@civiclens.demo` | Pedestrian Safety Campaigner |
| **Admin** | Officer Kiran Rao | `admin.kiran@ghmc.gov.in.demo` | Chief Municipal Operations Officer (GHMC) |
| **Guest** | Guest Citizen | `guest@civiclens.demo` | Public viewing only (prompts login on action) |

*All demonstration passwords:* Any string (e.g. `demo123`).

---

## 7. How to Reset Demo Data

At any time during a demonstration, click the **“Reset Demo Data”** button in the top banner. Confirm the modal to restore the initial dataset of 16 Hyderabad infrastructure reports, sample resolution photographs, and status histories.

---

## 8. Complete 19-Step Demonstration Script

Follow this sequence for an end-to-end evaluation:

1. **Landing Page:** Open `http://localhost:5173`. Notice dynamic impact statistics calculated from live data.
2. **Citizen Experience:** Switch persona to **Priya Sharma** (Citizen) or click **Sign In**.
3. **Submit a Pothole Report:** Click **“Report an Issue”** (`/report/new`):
   - Step 1: Select a sample photo or upload a file.
   - Step 2: Select **Pothole**.
   - Step 3: Enter description (*“Deep road crater on turning curve”*) and landmark (*“Opposite Care Hospital, Banjara Hills”*).
   - Step 4: Pinpoint location on the OpenStreetMap.
   - Step 5: Answer risk assessment (*Safety Risk: Yes (3), Location: Critical Zone (3)*).
   - Step 6: Review summary and submit.
4. **Unique Report ID:** Observe generated report ID (e.g., `REP-HYD-XXXX`).
5. **Interactive Map:** Open **“Explore Map”** (`/map`). Find the newly created report pin.
6. **Duplicate Detection:** Return to `/report/new` and submit another *Pothole* at the same coordinates:
   - Notice the **Duplicate Warning Modal** triggers (*“Nearby Issue Found Within 40 Meters”*).
   - Choose **“Confirm Existing Issue”**.
7. **Identity Switch for Multi-Citizen Consensus:** In the top banner, switch identity to **Rahul Verma**.
8. **Community Validation:** Open the report details page (`/reports/:id`). Click **“I Also Face This Issue”**:
   - Notice the confirmation count increases.
   - Priority score automatically recalculates according to the exact project formula.
9. **Municipal Dashboard:** In the top banner, switch identity to **Officer Kiran Rao** (Admin).
10. **Admin Command Center:** Open `/admin`. Inspect live metric cards, category chart, and urgent queue.
11. **Locate Issue:** Open `/admin/reports` and click on the newly submitted high-priority report.
12. **Department Routing:** In Section 1, assign the report to **Roads Department**.
13. **Advance to In Progress:** In Section 2, click **Mark In Progress**.
14. **Cross-View Verification:** Click *“View Citizen Public Page”* to verify that the citizen view immediately reflects the *In Progress* state.
15. **Resolution Proof Requirement:** Attempt to click *“Certify & Mark Issue as Fixed”* before uploading evidence. Notice the button is disabled with an explanatory warning.
16. **Upload Resolution Photo:** Select the *“Road Repair”* sample resolution photo.
17. **Certify as Fixed:** Click **Certify & Mark Issue as Fixed**. Notice status shifts to *Fixed* and the map pin turns green.
18. **Citizen Reopen Flow:** Switch back to citizen **Priya Sharma**. View the fixed report, click **“Flag as Unresolved / Reopen”**, provide reason (*“Gravel washed out after rain”*), and submit.
19. **Reopened Queue & Analytics:** Return to `/admin/reports?status=Reopened` and visit `/admin/analytics` to view the reopened ticket and clearance rate charts.

---

## 9. Firebase Integration (Optional)

The platform is designed with a service-based repository pattern (`src/services/reportService.ts`, `authService.ts`, `storageService.ts`). When environment variables are defined, Firebase can be activated:

```env
# .env.local
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Firestore Security Rules Template

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    match /reports/{reportId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update: if request.auth != null;
      allow delete: if request.auth.token.role == 'Admin';
    }
  }
}
```

*Note: Without these environment variables, CivicLens runs entirely in self-contained Local Demo Mode using persistent browser storage without crashing.*

---

## 10. License & Academic Disclaimer

This project was built for academic demonstration purposes supporting **UN Sustainable Development Goal 11 (Sustainable Cities & Communities)**. Reports filed in demo mode are not transmitted to real municipal dispatch authorities.
