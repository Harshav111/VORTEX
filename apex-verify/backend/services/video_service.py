from __future__ import annotations

import asyncio
import base64
import os
import tempfile
import cv2
import json
import numpy as np
from PIL import Image
from typing import AsyncIterator

from detection import get_detection_pipeline, DEVICE

def _overlay_mask(image_np: np.ndarray, mask: np.ndarray, color=(0, 255, 0), alpha=0.4) -> np.ndarray:
    """Overlays a binary mask on an image."""
    c_mask = np.zeros_like(image_np)
    c_mask[mask > 0] = color
    image_np = cv2.addWeighted(image_np, 1.0, c_mask, alpha, 0)
    return image_np

def _compute_iou(boxA, boxB):
    # box = [x_min, y_min, x_max, y_max]
    xA = max(boxA[0], boxB[0])
    yA = max(boxA[1], boxB[1])
    xB = min(boxA[2], boxB[2])
    yB = min(boxA[3], boxB[3])

    interArea = max(0, xB - xA + 1) * max(0, yB - yA + 1)
    if interArea == 0:
        return 0.0

    boxAArea = (boxA[2] - boxA[0] + 1) * (boxA[3] - boxA[1] + 1)
    boxBArea = (boxB[2] - boxB[0] + 1) * (boxB[3] - boxB[1] + 1)
    iou = interArea / float(boxAArea + boxBArea - interArea)
    return iou

async def analyze_video_stream(file_bytes: bytes) -> AsyncIterator[str]:
    """
    Simulates a real-time CCTV/Dashcam analysis pipeline.
    Reads a video, samples frames roughly 2 fps, runs RT-DETR + SAM2 segmentation.
    Highlights vehicles and flags collision boundaries (crashes).
    """
    # 1. Save video bytes to a temporary file
    fd, temp_path = tempfile.mkstemp(suffix=".mp4")
    cap = None
    try:
        with os.fdopen(fd, 'wb') as f:
            f.write(file_bytes)
        
        cap = cv2.VideoCapture(temp_path)
        if not cap.isOpened():
            yield "data: " + json.dumps({"status": "error", "message": "Failed to read video file."}) + "\n\n"
            return
        
        pipeline = get_detection_pipeline()
        
        fps = cap.get(cv2.CAP_PROP_FPS)
        if fps <= 0 or fps > 120: fps = 30.0
        
        # We want to process roughly 2 frames per second to keep it real-time-ish over SSE
        frame_skip = max(1, int(fps // 2))
        frame_idx = 0
        target_labels = {"car", "truck", "bus", "motorcycle", "train", "airplane"}

        while True:
            ret, frame = cap.read()
            if not ret:
                break
                
            if frame_idx % frame_skip == 0:
                # Process this frame
                rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                pil_img = Image.fromarray(rgb_frame)
                
                # We need to run the detection without the abstract .run() because we want to manipulate the mask natively
                # Wait, detection_pipeline.run() uses SAM2 and returns the combined mask natively, but we can't get individual masks
                # Let's do a direct DETR -> SAM2 pass here for exact visual manipulation.
                
                inputs = pipeline.rtdetr_processor(images=pil_img, return_tensors="pt").to(DEVICE)
                import torch
                with torch.no_grad():
                    outputs = pipeline.rtdetr_model(**inputs)
                
                target_sizes = torch.tensor([pil_img.size[::-1]], device=DEVICE)
                results = pipeline.rtdetr_processor.post_process_object_detection(
                    outputs, target_sizes=target_sizes, threshold=0.45
                )[0]
                
                # Filter vehicles
                vehicles = []
                for score, label_id, box in zip(results["scores"], results["labels"], results["boxes"]):
                    label_name = pipeline.rtdetr_model.config.id2label[label_id.item()].lower()
                    if label_name in target_labels:
                        vehicles.append({
                            "label": label_name,
                            "score": score.item(),
                            "bbox": box.tolist() # [xmin, ymin, xmax, ymax]
                        })
                
                crash_detected = False
                highest_iou = 0.0
                info_msg = ""
                
                if len(vehicles) > 1:
                    # Check for overlaps (Crash heuristic)
                    for i in range(len(vehicles)):
                        for j in range(i + 1, len(vehicles)):
                            iou = _compute_iou(vehicles[i]["bbox"], vehicles[j]["bbox"])
                            if iou > highest_iou:
                                highest_iou = iou
                            
                            # If vehicles overlap heavily, flag it!
                            if iou > 0.15:
                                crash_detected = True
                
                # Get SAM2 masks
                img_h, img_w = rgb_frame.shape[:2]
                pipeline.sam2_predictor.set_image(rgb_frame)
                
                drawn_frame = rgb_frame.copy()
                
                for v in vehicles:
                    from detection import DetectedObject
                    import numpy as np
                    
                    x_min, y_min, x_max, y_max = v["bbox"]
                    box_np = np.array([[x_min, y_min, x_max, y_max]], dtype=np.float32)
                    masks, scores, _ = pipeline.sam2_predictor.predict(box=box_np, multimask_output=True)
                    
                    if masks is not None and len(masks) > 0:
                        best_idx = int(np.argmax(scores))
                        best_mask = masks[best_idx].astype(bool)
                        
                        if best_mask.shape != (img_h, img_w):
                            best_mask = cv2.resize(
                                best_mask.astype(np.uint8),
                                (img_w, img_h),
                                interpolation=cv2.INTER_NEAREST,
                            ).astype(bool)
                        
                        color = (255, 0, 0) if crash_detected else (0, 255, 0) # Red if crash, Green if safe
                        drawn_frame = _overlay_mask(drawn_frame, best_mask, color=color, alpha=0.5)
                    
                    # Draw box
                    color_bgr = (0, 0, 255) if crash_detected else (0, 255, 0)
                    cv2.rectangle(drawn_frame, (int(x_min), int(y_min)), (int(x_max), int(y_max)), color_bgr, 2)
                    
                    label_text = f"{v['label']} {v['score']:.2f}"
                    cv2.putText(drawn_frame, label_text, (int(x_min), max(10, int(y_min)-10)), cv2.FONT_HERSHEY_SIMPLEX, 0.5, color_bgr, 2)
                
                if crash_detected:
                    cv2.putText(drawn_frame, "CRASH DETECTED", (30, 60), cv2.FONT_HERSHEY_DUPLEX, 2.0, (255, 0, 0), 3)
                    info_msg = f"Collision anomaly detected! Overlap metric: {highest_iou:.2f}"
                elif len(vehicles) > 0:
                    info_msg = f"Segemented {len(vehicles)} vehicle(s). Tracking trajectory..."
                
                drawn_bgr = cv2.cvtColor(drawn_frame, cv2.COLOR_RGB2BGR)
                _, buffer = cv2.imencode(".jpg", drawn_bgr)
                b64 = base64.b64encode(buffer).decode("utf-8")
                
                payload = {
                    "type": "frame",
                    "status": "success",
                    "base64_img": b64,
                    "crash_risk": 1.0 if crash_detected else 0.0,
                    "info_msg": info_msg,
                }
                
                # Yield SSE chunk
                yield f"data: {json.dumps(payload)}\n\n"
                
                # Small sleep to simulate real-time processing interval and let asyncio breathe
                await asyncio.sleep(0.01)

            frame_idx += 1
            
        yield f"data: {json.dumps({'type': 'complete', 'status': 'success'})}\n\n"
        
    finally:
        if cap is not None:
            cap.release()
        if os.path.exists(temp_path):
            try:
                os.remove(temp_path)
            except Exception:
                pass # Still locked, but we did our best

__all__ = ["analyze_video_stream"]
