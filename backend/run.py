import os

import uvicorn

if __name__ == "__main__":
    # Some Windows installations reserve or block particular ports. Keep the
    # server local and let developers override the port without editing code.
    port = int(os.getenv("PORT", "8010"))
    uvicorn.run("main:app", host="127.0.0.1", port=port, reload=True)
