# Sahayata Frontend

React + Vite frontend for the Sahayata worker-support portal.

## Run locally

Open two terminals:

```bash
# Terminal 1: from sahayata-app
npm run backend

# Terminal 2: from sahayata-app
npm run dev
```

`npm run backend` starts the canonical API in `../backend`, including the real male voice service. Do not start the legacy `sahayata-app/backend/main.py` directly.

## Loan voice guide

The bottom-right voice assistant has English, Hindi, and Gujarati buttons. Each calls:

```
/api/voice-assistant/loan-guidance/audio?language=en|hi|gu
```

It streams a free Indian male neural voice. A user may also say "loan", "credit", or "mujhe loan" after pressing the microphone. Voice input needs Chrome or Edge and microphone permission.

The assistant never asks a user to share an OTP. Any OTP must be entered by the user only on the official website.
