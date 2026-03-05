from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
import shutil
import uuid

# Import modules
from modules.metadata import MetadataModule
from modules.forensics import ForensicsModule
from modules.ai_vision import AIDetectionModule, ObjectDetectionModule, HistoricalMatchingModule
from modules.aggregator import FraudAggregator

app = FastAPI(title="DeepClaim AI API")

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Instances
metadata_mod = MetadataModule()
forensics_mod = ForensicsModule()
ai_det_mod = AIDetectionModule()
obj_det_mod = ObjectDetectionModule()
hist_mod = HistoricalMatchingModule()
aggregator = FraudAggregator()

@app.get("/")
def read_root():
    return {"status": "DeepClaim AI Backend Running"}

@app.post("/verify")
async def verify_claim(
    file: UploadFile = File(...),
    claim_type: str = Form("Auto"),
    location: str = Form("Unknown")
):
    print(f"\n[RECEIVED] New claim target: {file.filename}")
    # Save the file
    file_id = str(uuid.uuid4())
    file_ext = os.path.splitext(file.filename)[1]
    file_path = os.path.join(UPLOAD_DIR, f"{file_id}{file_ext}")
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    print(f"  > Evidence saved to: {file_path}")
    
    # Process through pipeline
    try:
        print("  > STAGE 1: Metadata Forensics...")
        meta_results = metadata_mod.analyze(file_path)
        
        print("  > STAGE 2: Image Forensics (ELA)...")
        forensic_results = forensics_mod.perform_ela(file_path, UPLOAD_DIR, file_id)
        
        print("  > STAGE 3: vision AI (YOLO + SAM)...")
        obj_results = obj_det_mod.analyze_damage(file_path)
        
        print("  > STAGE 4: AI Generation Check...")
        ai_results = ai_det_mod.detect(file_path)
        
        print("  > STAGE 5: FAISS Vector Matching...")
        match_results = hist_mod.find_similar(file_path)
        
        print("  > STAGE 6: Risk Aggregation...")
        final_assessment = aggregator.calculate_score(
            meta_results, forensic_results, ai_results, match_results
        )
        
        print(f"[COMPLETE] Authenticity: {final_assessment['authenticity_score']}% | Risk: {final_assessment['risk_level']}")
        
        # Construct the full image URL
        image_url = f"http://localhost:8000/uploads/{file_id}{file_ext}"
        
        return {
            "id": file_id,
            "filename": file.filename,
            "imageUrl": image_url,
            "claim_type": claim_type,
            "location": location,
            "results": {
                "metadata": meta_results,
                "forensics": forensic_results,
                "ai_detection": ai_results,
                "object_detection": obj_results,
                "historical_matches": match_results,
                "assessment": final_assessment
            }
        }
    except Exception as e:
        print(f"[ERROR] Pipeline failure: {str(e)}")
        return {"error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
