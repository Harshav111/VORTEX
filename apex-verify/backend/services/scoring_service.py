"""
Scoring Service — computes structured fraud confidence breakdown.

Returns a richer payload than the legacy ensemble score, including
physics and context sub-scores for a complete fraud confidence breakdown.
"""
from __future__ import annotations

from typing import Any, Dict, List, Tuple


WEIGHTS = {
    "sam2_confidence": 0.20,
    "ela_score": 0.17,
    "region_ela_score": 0.13,
    "similarity_score": 0.17,
    "ai_gen_score": 0.13,
    "metadata_score": 0.10,
    "physics_score": 0.05,
    "context_score": 0.05,
}


def compute_confidence_breakdown(
    sam2_confidence: float,
    ela_score: float,
    region_ela_score: float,
    similarity_score: float,
    ai_gen_score: float,
    metadata_score: float,
    physics_score: float = 0.5,
    context_score: float = 0.5,
) -> Dict[str, Any]:
    """
    Compute a structured fraud confidence breakdown using a penalty-based model.
    Authentic images start at 100 points, and penalties are deducted for strong fraud signals.
    """
    def clamp(x: float) -> float:
        return float(max(0.0, min(1.0, x)))

    sam2 = clamp(sam2_confidence)
    ela = clamp(ela_score)
    r_ela = clamp(region_ela_score)
    sim = clamp(similarity_score)
    ai = clamp(ai_gen_score)
    meta = clamp(metadata_score)
    phys = clamp(physics_score)
    ctx = clamp(context_score)

    risk_penalty = 0.0

    # AI penalty (max ~50 points)
    if ai > 0.3:
        risk_penalty += (ai - 0.3) * 70

    # ELA tampering penalties
    if ela > 0.3:
        risk_penalty += (ela - 0.3) * 50
    if r_ela > 0.3:
        risk_penalty += (r_ela - 0.3) * 50

    # Similarity penalty
    if sim > 0.4:
        risk_penalty += (sim - 0.4) * 60

    # Metadata penalty - Only heavily penalize tampered EXIF (<0.5). MISSING exif (0.85) carries 0 penalty.
    if meta < 0.5:
        risk_penalty += (0.5 - meta) * 50

    # Physics & Context penalties
    if phys < 0.4:
        risk_penalty += (0.4 - phys) * 40
    if ctx < 0.4:
        risk_penalty += (0.4 - ctx) * 40

    authenticity_score = max(0.0, min(100.0, 100.0 - risk_penalty))
    authenticity_score = round(authenticity_score, 1)

    # Calibrated risk thresholds for the deductive scale
    if authenticity_score >= 82:
        risk_level = "LOW"
    elif authenticity_score >= 55:
        risk_level = "MEDIUM"
    elif authenticity_score >= 25:
        risk_level = "HIGH"
    else:
        risk_level = "CRITICAL"

    # Per-dimension fraud probabilities (inverted where needed for UI display compatibility)
    tampering_probability = round((ela * 0.6 + r_ela * 0.4), 3)
    ai_generation_probability = round(ai, 3)
    metadata_fraud_score = round(1.0 - meta, 3)
    region_consistency_score = round(1.0 - r_ela, 3)
    physics_consistency_score = round(phys, 3)
    context_consistency_score = round(ctx, 3)
    similarity_risk = round(sim, 3)

    fraud_reasons: List[str] = _build_reasons(
        ela, r_ela, sim, ai, meta, sam2, phys, ctx
    )

    return {
        "authenticity_score": authenticity_score,
        "risk_level": risk_level,
        "breakdown": {
            "metadata_score": round(meta, 3),
            "tampering_probability": tampering_probability,
            "ai_generation_probability": ai_generation_probability,
            "similarity_score": similarity_risk,
            "region_consistency_score": region_consistency_score,
            "physics_consistency_score": physics_consistency_score,
            "context_consistency_score": context_consistency_score,
        },
        "fraud_reasons": fraud_reasons,
    }


def _build_reasons(
    ela: float,
    r_ela: float,
    sim: float,
    ai: float,
    meta: float,
    sam2: float,
    phys: float,
    ctx: float,
) -> List[str]:
    reasons: List[str] = []

    if ai > 0.60:
        reasons.append("AI-generation detector indicates high likelihood of synthetic content")
    if ela > 0.40 or r_ela > 0.40:
        reasons.append("Strong ELA anomalies detected — possible region manipulation")
    if sim > 0.60:
        reasons.append("Image highly similar to previous claims — possible reuse or duplication")
    
    # Metadata evaluation
    if meta < 0.40:
        reasons.append("Metadata inconsistencies detected — possible EXIF tampering")
    elif meta <= 0.85:
        reasons.append("⚠️ Missing EXIF metadata (Common for web uploads, but prevents complete forensic analysis)")
        
    if phys < 0.40:
        reasons.append("Physical inconsistencies — shadow/lighting mismatch detected")
    if ctx < 0.40:
        reasons.append("Context mismatch — claim details inconsistent with verified real-world events")

    # If the only recorded "reason" is the missing EXIF warning, or there are no reasons at all.
    _has_strong_fraud = any(not r.startswith("⚠️") for r in reasons)
    if not _has_strong_fraud:
        reasons.insert(0, "✅ No significant visual fraud indicators detected")

    return reasons


__all__ = ["compute_confidence_breakdown"]
