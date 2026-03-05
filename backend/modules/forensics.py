import cv2
import numpy as np
from PIL import Image, ImageChops

class ForensicsModule:
    def perform_ela(self, image_path, output_dir, file_id, quality=90):
        """Perform real Error Level Analysis (ELA) and save heatmap"""
        temp_path = os.path.join(output_dir, f"temp_{file_id}.jpg")
        original = Image.open(image_path).convert('RGB')
        
        # Save at a lower quality to create compression artifacts
        original.save(temp_path, 'JPEG', quality=quality)
        temporary = Image.open(temp_path)
        
        # Calculate the difference (this highlights areas with different compression levels)
        ela_image = ImageChops.difference(original, temporary)
        
        # Enhance the contrast so it's visible as a heatmap
        extrema = ela_image.getextrema()
        max_diff = max([ex[1] for ex in extrema])
        if max_diff == 0:
            max_diff = 1
        scale = 255.0 / max_diff
        
        from PIL import ImageEnhance
        ela_image = ImageEnhance.Brightness(ela_image).enhance(scale)
        
        # Save the actual forensic heatmap
        heatmap_filename = f"ela_{file_id}.png"
        heatmap_path = os.path.join(output_dir, heatmap_filename)
        ela_image.save(heatmap_path)
        
        # Calculate a real score based on mean pixel difference
        # High variation in compression error = high likelihood of tampering
        stat = np.array(ela_image).mean()
        manipulation_score = min(100, int(stat * 2)) 
        
        # Cleanup temp file
        if os.path.exists(temp_path):
            os.remove(temp_path)
            
        return {
            "ela_score": manipulation_score,
            "manipulation_detected": manipulation_score > 35,
            "heatmap_url": f"/uploads/{heatmap_filename}"
        }

    def detect_noise_inconsistency(self, image_path):
        # Placeholder for noise analysis
        return {"noise_score": np.random.randint(0, 15)}
