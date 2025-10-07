# Smart Campus Waste Detection - Backend

## Run locally

1. Create venv and install deps
```bash
python -m venv .venv
. .venv/Scripts/activate  # Windows PowerShell: .venv\\Scripts\\Activate.ps1
pip install -r backend/requirements.txt
```

2. Ensure weights exist (any of these):
- `yolov8n_waste_detection2/weights/model.pt` (preferred)
- `yolov8n.pt` in project root
- Or set env var `WASTE_MODEL_PATH` to an absolute/relative path

3. One-command run (builds frontend and serves everything on one server)
```bash
python backend/serve.py
```

4. Test
```bash
curl -s http://localhost:8000/health | jq .
```

## API
- `POST /api/detect` (multipart form): field `file` = image. Returns `image/jpeg` annotated.
- `GET /api/health` health info.


