<<<<<<< HEAD
# Sahayata

Sahayata is a financial-support portal for gig workers, delivery partners, street vendors, farmers, and daily-wage earners. It presents scheme discovery, eligibility checks, loan planning, KYC, application tracking, and a UPI-informed credit view in one guided journey.

## Run locally

Open two terminals from this project folder:

```bash
# Terminal 1 — starts the local FastAPI backend on http://127.0.0.1:8010
npm run backend

# Terminal 2 — starts the Vite frontend
npm run dev
```

# Sahayata — AI-Powered Financial Fraud Detection & Financial Inclusion

Sahayata is an AI-powered financial technology platform designed to improve access to safer digital financial services for underserved informal and gig workers in India.

The platform combines **AI-based fraud detection, financial identity, loan eligibility assessment, e-KYC, government scheme discovery, and financial assistance** into a single digital platform.

---

## Problem

Millions of informal and gig workers rely on cash-based income and have limited access to formal financial services.

Common challenges include:

* Limited formal credit history
* Difficulty accessing suitable financial products
* Digital payment and financial fraud
* Repeated or inconsistent identity information across applications
* Lack of awareness about government financial schemes
* Complex financial-service application processes

---

## Solution

Sahayata creates a digital financial identity from available financial and identity signals and uses AI-assisted analysis to help identify suspicious activity and improve access to appropriate financial services.

### Core Flow

```text
User
  ↓
Digital Financial Data
  ↓
Identity & Data Verification
  ↓
AI Fraud Detection
  ↓
Financial Risk Signals
  ↓
Loan / Banking / Scheme Eligibility
  ↓
Financial Assistance
```

---

## Key Features

### 1. AI Fraud Detection

Detects potentially suspicious financial activity and inconsistent identity signals.

Examples include:

* Inconsistent identity information
* Multiple identity signals associated with applications
* Reused identity information
* Suspicious transaction patterns
* Unusual financial behaviour

---

### 2. Financial Identity

Creates a structured financial profile using available user information and financial signals.

The goal is to help users build a more useful digital financial identity for accessing formal financial services.

---

### 3. Loan Eligibility

Sahayata provides an AI-assisted eligibility workflow:

```text
Eligibility
     ↓
e-KYC
     ↓
Application Submission
```

The platform is designed to simplify the process of discovering and applying for suitable financial assistance.

---

### 4. e-KYC & Identity Verification

The system supports identity verification workflows and document-based checks.

It is designed with security and privacy considerations for sensitive financial information.

---

### 5. Government Scheme Discovery

Users can discover financial and welfare schemes that may be relevant to their profile.

The platform can provide guidance about:

* Eligibility
* Required documents
* Application process
* Financial assistance

---

### 6. Voice-First Assistance

Sahayata is designed to support a conversational interface so that users can interact with financial services more easily.

Supported languages can include:

* English
* Hindi
* Gujarati

---

## Technology Stack

### Frontend

* React
* JavaScript
* HTML
* CSS
* Responsive UI

### Backend

* PHP
* REST APIs
* MySQL

### AI / Data

* Python
* Machine Learning
* AI-based fraud detection
* Data analysis

### Other Technologies

* Git & GitHub
* REST APIs
* Authentication
* Document verification
* Financial-data integration architecture

---

## Project Structure

```text
Sahayata-AI-Fraud-Detection/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── api/
│   ├── config/
│   └── database/
│
├── docs/
│   └── screenshots/
│
├── .env.example
├── .gitignore
└── README.md
```

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/krupa0531/Sahayata-AI-Fraud-Detection.git
```

```bash
cd Sahayata-AI-Fraud-Detection
```

---

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

### 3. Backend Setup

Configure the PHP backend according to your local server environment.

For XAMPP:

```text
htdocs/
└── sahayata-app/
```

Configure the database credentials in the environment/configuration file.

---

### 4. Environment Variables

Create a `.env` file based on:

```text
.env.example
```

Do not commit API keys, passwords, database credentials, or other secrets to GitHub.

---

## Security & Privacy

Sahayata is designed with privacy and security in mind.

The public repository should contain **no real Aadhaar numbers, PAN information, bank account details, personal documents, API keys, passwords, or other sensitive user information**.

For development and demonstration, use synthetic or dummy data.

---

## Screenshots

Screenshots and product demonstrations will be added here.

### Dashboard

```text
Add dashboard screenshot here
```

### AI Fraud Detection

```text
Add fraud detection screenshot here
```

### Loan & Financial Assistance

```text
Add loan/financial assistance screenshot here
```

---

## Future Scope

Potential future development areas include:

* Advanced fraud detection models
* Real-time transaction monitoring
* Financial-data integrations
* Consent-based financial data sharing
* Improved multilingual voice interaction
* Advanced document forensics
* Financial-risk analytics
* Banking and lending ecosystem integrations
* Expanded welfare-scheme discovery

---

## Project Status

Sahayata is under active development with continuous improvements to its AI, fraud detection, financial assistance, and user experience modules.

---

## Vision

> Making safer and more accessible digital financial services available to underserved workers through AI, responsible financial technology, and simplified user experiences.

---

## Disclaimer

Sahayata is a technology project and demonstration platform. Any financial eligibility, fraud-risk indication, or recommendation generated by the system should be independently verified before being used for real-world financial decisions.

---

## License

This project is currently maintained for development, research, demonstration, and educational purposes.
