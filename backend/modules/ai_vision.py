import numpy as np
import random

class AIDetectionModule:
    def detect(self, image_path, metadata=None):
        """
        Detects if an image is AI generated using frequency artifact detection (Simulated).
        """
        # Improved simulation: Check filename or metadata for AI hints
        is_suspicious = False
        filename = image_path.lower()
        if any(kw in filename for kw in ['ai', 'generated', 'stable', 'diffusion', 'midjourney']):
            is_suspicious = True
            
        prob = np.random.uniform(0.65, 0.98) if is_suspicious else np.random.uniform(0.01, 0.15)
        
        return {
            "ai_probability": round(prob * 100, 2),
            "is_ai_generated": prob > 0.6,
            "method": "Frequency Artifact Scrutiny"
        }

class ObjectDetectionModule:
    def analyze_damage(self, image_path):
        """
        YOLO + SAM simulation for damage detection.
        """
        damage_types = ["Mechanical Dent", "Surface Scratch", "Structural Deformation", "Glass Fracture"]
        found = random.sample(damage_types, k=random.randint(1, 2))
        
        detections = []
        for d in found:
            detections.append({
                "label": d,
                "confidence": round(random.uniform(0.85, 0.99), 2),
                "bbox": [random.randint(50, 400) for _ in range(4)]
            })
            
        return {
            "detections": detections,
            "sam_mask_count": len(found),
            "total_damaged_area": f"{random.randint(15, 45)}%"
        }

class HistoricalMatchingModule:
    def find_similar(self, image_path):
        """
        FAISS + CLIP simulation.
        """
        return [
            {"claim_id": "CLM-9921", "similarity": 0.89, "status": "Approved", "match_type": "Texture similarity"},
            {"claim_id": "CLM-4412", "similarity": 0.75, "status": "Denied (Fraud)", "match_type": "Geometric correlation"},
            {"claim_id": "CLM-1205", "similarity": 0.62, "status": "Under Review", "match_type": "Contextual match"}
        ]
