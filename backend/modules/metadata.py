import exifread
from datetime import datetime

class MetadataModule:
    def analyze(self, image_path):
        with open(image_path, 'rb') as f:
            tags = exifread.process_file(f)
        
        metadata = {
            "camera_model": f"{str(tags.get('Image Make', ''))} {str(tags.get('Image Model', ''))}".strip() or "Unknown",
            "timestamp": str(tags.get('EXIF DateTimeOriginal', tags.get('Image DateTime', 'Unknown'))),
            "software": str(tags.get('Image Software', 'None')),
            "gps": self._get_gps(tags),
            "raw_tags_count": len(tags),
            "anomalies": []
        }
        
        # Enhanced anomaly detection
        trust_score = 100
        if metadata["software"] != 'None' and any(x in metadata["software"].lower() for x in ['photoshop', 'gimp', 'picsart', 'adobe']):
            metadata["anomalies"].append(f"Editing software detected: {metadata['software']}")
            trust_score -= 40
        
        if metadata["camera_model"] == 'Unknown':
            metadata["anomalies"].append("Missing camera hardware signature")
            trust_score -= 20
        
        if metadata["timestamp"] == 'Unknown':
            metadata["anomalies"].append("Missing internal timeline metadata")
            trust_score -= 15
            
        return {
            "metadata": metadata,
            "trust_score": max(0, trust_score)
        }

    def _get_gps(self, tags):
        if 'GPS GPSLatitude' in tags:
            return "Available"
        return "Not available"
