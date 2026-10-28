# CareFlow AI

**AI-powered hospital operations and patient-support dashboard for a
hackathon prototype.**

CareFlow AI is a web application concept designed to help hospital teams
organize common patient-service workflows in one place. It combines an
operations dashboard, a conversational AI assistant, appointment-request
flows, patient inquiries, support tickets, escalation tracking, and a
curated directory of hospitals and medical specialties in Indore, Madhya
Pradesh.

> **Important:** CareFlow AI is a prototype/demo, not a clinical system.
> Directory information may be incomplete or out of date. It does not
> provide medical diagnosis, confirm real-world appointment
> availability, or replace professional medical advice. Verify hospital
> details directly with the provider. In an emergency, contact local
> emergency services.

## Features

-   **Hospital operations dashboard** --- at-a-glance counts for
    appointments, patient inquiries, support tickets, and cases needing
    staff attention.
-   **AI chat assistant** --- conversational interface for supported
    patient-operation questions and directory searches.
-   **Hospital directory for Indore** --- curated listings with areas,
    hospital types, websites, and listed specialties where available.
-   **Medical department discovery** --- broad specialty coverage,
    including eye care/ophthalmology, ENT, cardiology, dermatology,
    orthopedics, obstetrics and gynaecology, paediatrics, neurology,
    nephrology, gastroenterology, oncology, and more.
-   **Appointment request workflow** --- create and view demo
    appointment records by patient, department, date, and time.
-   **Patient inquiry management** --- record and track inquiries.
-   **Support tickets and escalations** --- track requests that need
    follow-up from staff.
-   **Voice interaction** --- voice-related interaction is available in
    the prototype where configured by the application/browser.
-   **Theme support** --- use light or dark appearance if the theme
    toggle is included in your current build.
-   **Demo persistence** --- application records may be saved in browser
    local storage; this is not a secure production database.

## Technology

The project is built as a React front end using Vite. The AI chat
integration uses Google Gemini when the corresponding backend/API
configuration is set up. The repository may also include a backend
service and environment configuration for API calls.

Typical technologies used in this project: - React - Vite - JavaScript /
JSX - CSS - Google Gemini API integration (requires valid
configuration) - Browser APIs for supported voice features -
`localStorage` for prototype data persistence

Check the project's `package.json`, backend entry point, and
environment-variable references for the exact dependencies and
configuration used by your copy.

## Getting started

### Prerequisites

-   Node.js (a current LTS release is recommended)
-   npm
-   A modern browser
-   A Gemini API key only if you want to use the AI integration

### 1. Clone or download the project

``` bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd <PROJECT_FOLDER>
```

If you downloaded a ZIP, extract it and open the extracted project
folder in a terminal.

### 2. Install dependencies

``` bash
npm install
```

### 3. Configure environment variables

Create a `.env` file only if your project uses one. Open the existing
backend/configuration code to confirm the exact variable names. For a
Gemini integration, store the API key on the server side using the
variable name expected by the backend.

**Do not put a private API key in client-side React code, commit it to
GitHub, or share it in screenshots.** Keep `.env` out of version control
and commit an `.env.example` containing placeholder values instead.

### 4. Start the application

For a typical Vite project:

``` bash
npm run dev
```

If the project has a separate backend server, start it in a second
terminal using the command defined in `package.json` or documented in
`server.js`. The frontend and backend must both be running for
server-backed AI features to work.

Open the local URL printed by Vite in your terminal (commonly
`http://localhost:5173`).

> The exact commands can vary by the project's `package.json`. Use its
> `scripts` section as the source of truth.

## How to use the prototype

1.  Open the dashboard and review the demo operational metrics.
2.  Navigate to the hospital directory and search by hospital name,
    area, or type.
3.  Explore the available medical departments and ask the AI assistant
    supported questions about hospitals or specialties.
4.  Use the appointment flow to create a **demo request**.
5.  Use the inquiry, support-ticket, and escalation workflows to
    demonstrate how staff can track follow-up.
6.  If available, use the theme toggle to switch between light and dark
    mode.

Example questions for the assistant: - "Which eye-care hospitals are
listed in Indore?" - "Find hospitals in Vijay Nagar." - "Which
departments provide maternity and newborn care?" - "Show hospitals that
list oncology services." - "What departments can I request an
appointment for?"

## Data quality and limitations

-   The Indore hospital directory is a curated reference list, **not an
    exhaustive or real-time official registry**.
-   Services, locations, contact numbers, operating hours, and
    appointment availability can change. Confirm details through each
    hospital's official website or directly with the provider.
-   Demo doctors, slots, and records must not be interpreted as real
    clinical staff or confirmed appointments.
-   AI-generated responses can be incorrect. Do not use the assistant
    for diagnosis, medication decisions, or emergency triage.
-   Browser local storage is not appropriate for sensitive patient
    information. Do not enter real patient records, health details, or
    personal identifiers into this demo.
-   Production deployment would require authentication, authorization,
    secure storage, privacy controls, audit logs, input validation,
    monitoring, and clinical/legal review as applicable.

## Suggested project structure

Your exact structure may differ. A common setup is:

``` text
careflow-ai/
├── public/
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   └── styles.css
├── server.js              # if the project includes a backend
├── package.json
├── .env                   # local secrets; do not commit
├── .env.example           # safe placeholders
└── README.md
```

## Troubleshooting

**The AI assistant does not respond** - Confirm the backend is running
if your project uses one. - Confirm the API key is configured using the
exact environment-variable name expected by the backend. - Restart the
backend after changing `.env`. - Check the browser console and backend
terminal for errors.

**The page does not start** - Run `npm install`. - Check the scripts in
`package.json`. - Confirm you are in the project directory and using a
supported Node.js version.

**Hospital or department details look incorrect** - Treat the directory
as demo reference data and verify details with the hospital. - Update
the source data in the project rather than relying on an AI response as
authoritative.

**Theme setting does not persist** - Check whether the current build
stores the preference in browser storage and whether the browser blocks
local storage.

## Future improvements

-   Verified hospital records with official source links and
    last-checked timestamps
-   Filters by area, specialty, hospital type, and service availability
-   Secure database and role-based access for patients and staff
-   Real appointment integration with hospital systems
-   Audit trails and consent-aware patient communication
-   Accessibility testing and multilingual support
-   Automated tests, deployment configuration, and CI checks

## Contributing

1.  Create a branch for your change.
2.  Make a focused change and test it locally.
3.  Do not commit API keys, patient data, or other secrets.
4.  Submit a pull request with a clear summary and screenshots when
    relevant.

## License

No license has been specified here. Add a `LICENSE` file before allowing
others to reuse or redistribute the project. Until then, do not assume
the repository is open source.

------------------------------------------------------------------------

**CareFlow AI --- simplifying hospital operations, one patient
interaction at a time.**
