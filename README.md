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

<<<<<<< HEAD
Then open the local URL displayed by Vite, normally `http://localhost:5173`.
=======
`npm run backend` starts the canonical API in `../backend`, including the real male voice service. Do not start the legacy `sahayata-app/backend/run.py` directly.
>>>>>>> d95276c0fe6d1df0397f011981e762566f185559

The frontend proxies `/api` and `/health` calls to the local backend. If the backend terminal is not running, Vite will show `ECONNREFUSED`; start `npm run backend` to resolve it.

## Voice guide

The bottom-right voice assistant supports English, Hindi, and Gujarati guidance. It never asks a user to share an OTP; OTPs should only be entered by the user on an official service page.
