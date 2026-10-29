import uvicorn
import os
from app.config import settings

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "127.0.0.1")
    print(f"Starting {settings.PROJECT_NAME} backend on http://{host}:{port} ...")
    uvicorn.run("app.main:app", host=host, port=port, reload=True)
