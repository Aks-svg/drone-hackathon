import os
import subprocess
import sys
from pathlib import Path


def ensure_frontend_built() -> None:
    project_root = Path(__file__).resolve().parents[1]
    dist_dir = project_root / "dist"
    needs_build = not dist_dir.exists()
    if needs_build:
        # Use shell=True for Windows compatibility
        subprocess.check_call("npm install", cwd=project_root, shell=True)
        subprocess.check_call("npm run build", cwd=project_root, shell=True)


def run_server() -> None:
    import uvicorn
    import importlib
    main = importlib.import_module("main")
    uvicorn.run(main.app, host="127.0.0.1", port=8000, reload=False)


if __name__ == "__main__":
    ensure_frontend_built()
    run_server()


