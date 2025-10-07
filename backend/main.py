from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response, JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from typing import Optional
import io
import os
import uuid
import base64

try:
    from ultralytics import YOLO  # type: ignore
except Exception as exc:  # pragma: no cover
    YOLO = None  # type: ignore

try:
    import torch  # type: ignore
except Exception:  # pragma: no cover
    torch = None  # type: ignore

try:
    import cv2  # type: ignore
    import numpy as np  # type: ignore
except Exception:  # pragma: no cover
    cv2 = None  # type: ignore
    np = None  # type: ignore


app = FastAPI(title="Smart Campus Waste Detection API")

# Configuration
UPLOAD_FOLDER = 'uploads'
PROCESSED_FOLDER = 'processed'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

# Create necessary directories
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(PROCESSED_FOLDER, exist_ok=True)

# Allow Vite dev server and common local origins
origins = [
    "http://localhost:8080",
    "http://127.0.0.1:8080",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


_model: Optional["YOLO"] = None


def get_model_path() -> str:
    # Use the specific model path you provided
    model_path = os.path.join(os.getcwd(), "yolov8n_waste_detection2", "weights", "model.pt")
    if os.path.exists(model_path):
        return model_path
    # Fallback to default if not found
    return "yolov8n.pt"


def load_model() -> "YOLO":
    global _model
    if _model is not None:
        return _model
    if YOLO is None:
        raise RuntimeError("ultralytics not installed. See backend/requirements.txt")
    weights_path = get_model_path()
    _model = YOLO(weights_path)
    print("YOLOv8 model loaded successfully.")
    return _model


def allowed_file(filename: str) -> bool:
    """Check if the uploaded file has an allowed extension."""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.get("/api/health")
def health():
    try:
        path = get_model_path()
        ok = os.path.exists(path)
        return {"status": "ok", "model_path": path, "model_found": ok}
    except Exception as exc:  # pragma: no cover
        return JSONResponse(status_code=500, content={"status": "error", "detail": str(exc)})


# Backward-compatible health endpoint (some clients call /health)
@app.get("/health")
def health_compat():
    return health()


@app.post("/api/predict")
async def predict(file: UploadFile = File(...)):
    """Handle file uploads for waste detection and return JSON - matches Flask version exactly."""
    try:
        model = load_model()
        if model is None:
            return JSONResponse(status_code=500, content={"error": "Model not loaded"})
        
        if not file.filename:
            return JSONResponse(status_code=400, content={"error": "No file selected."})
        
        if not allowed_file(file.filename):
            return JSONResponse(status_code=400, content={"error": "Invalid file type."})

        # Save uploaded file - exactly like Flask
        filename = str(uuid.uuid4()) + os.path.splitext(file.filename)[1]
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        
        # Read and save file
        content = await file.read()
        with open(filepath, "wb") as f:
            f.write(content)
        
        print(f"File saved: {filepath}")

        # Run YOLO prediction - exactly like Flask
        results = model(filepath)
        result_image_array = results[0].plot()

        # Save processed image - exactly like Flask
        processed_filename = 'processed_' + filename
        processed_filepath = os.path.join(PROCESSED_FOLDER, processed_filename)
        cv2.imwrite(processed_filepath, result_image_array)
        
        print(f"Processed image saved: {processed_filepath}")
        
        # Return exactly like Flask
        return JSONResponse({
            "original_url": f"/api/uploads/{filename}",
            "processed_url": f"/api/processed/{processed_filename}"
        })
        
    except Exception as e:
        print(f"Error in predict endpoint: {str(e)}")
        import traceback
        traceback.print_exc()
        return JSONResponse(status_code=500, content={"error": f"Detection failed: {str(e)}"})


@app.post("/api/webcam")
async def webcam_predict(request_data: dict):
    """Handle webcam image data for prediction - matches Flask version exactly."""
    try:
        model = load_model()
        if model is None:
            return JSONResponse(status_code=500, content={"error": "Model not loaded"})
        
        if not request_data or 'image' not in request_data:
            return JSONResponse(status_code=400, content={"error": "No image data received"})
            
        # Process base64 image - exactly like Flask
        image_data = request_data['image']
        header, encoded = image_data.split(",", 1)
        binary_data = base64.b64decode(encoded)
        
        nparr = np.frombuffer(binary_data, np.uint8)
        img_np = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        # Save webcam image - exactly like Flask
        filename = f"webcam_{uuid.uuid4()}.jpg"
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        cv2.imwrite(filepath, img_np)

        # Run YOLO prediction - exactly like Flask
        results = model(filepath)
        result_image_array = results[0].plot()

        # Save processed image - exactly like Flask
        processed_filename = 'processed_' + filename
        processed_filepath = os.path.join(PROCESSED_FOLDER, processed_filename)
        cv2.imwrite(processed_filepath, result_image_array)

        # Return exactly like Flask
        return JSONResponse({"processed_image_url": f"/api/processed/{processed_filename}"})
        
    except Exception as e:
        print(f"Error in webcam endpoint: {str(e)}")
        import traceback
        traceback.print_exc()
        return JSONResponse(status_code=500, content={"error": f"Detection failed: {str(e)}"})


@app.get("/api/uploads/{filename}")
async def uploaded_file(filename: str):
    """Serve uploaded files."""
    return FileResponse(os.path.join(UPLOAD_FOLDER, filename))


@app.get("/api/processed/{filename}")
async def processed_file(filename: str):
    """Serve processed files."""
    return FileResponse(os.path.join(PROCESSED_FOLDER, filename))

# Serve frontend build if available
DIST_DIR = os.path.join(os.getcwd(), "dist")
if os.path.isdir(DIST_DIR):
    app.mount("/", StaticFiles(directory=DIST_DIR, html=True), name="static")


if __name__ == "__main__":  # pragma: no cover
    import uvicorn

    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)


