class FraudAggregator:
    def calculate_score(self, metadata_res, forensic_res, ai_res, matching_res):
        """
        Combine all signals into a final score (0-100).
        High score = Authentic.
        Low score = Likely Fraud.
        """
        w_metadata = 0.2
        w_forensic = 0.3
        w_ai = 0.2
        w_matching = 0.3
        
        # Metadata Score (higher is better)
        s_metadata = metadata_res['trust_score']
        
        # Forensic Score (lower ela_score is better)
        s_forensic = max(0, 100 - forensic_res['ela_score'] * 2)
        
        # AI Score (lower probability is better)
        s_ai = max(0, 100 - ai_res['ai_probability'])
        
        # Matching Score (if similar to fraud, score drops)
        is_similar_to_fraud = any(m['status'] == 'Denied (Fraud)' and m['similarity'] > 0.7 for m in matching_res)
        s_matching = 40 if is_similar_to_fraud else 100
        
        final_score = (s_metadata * w_metadata) + (s_forensic * w_forensic) + (s_ai * w_ai) + (s_matching * w_matching)
        
        risk_level = "LOW"
        if final_score < 40:
            risk_level = "HIGH"
        elif final_score < 70:
            risk_level = "MEDIUM"
            
        return {
            "authenticity_score": round(final_score),
            "risk_level": risk_level,
            "explanation": self._generate_explanation(risk_level, metadata_res, forensic_res, is_similar_to_fraud)
        }
        
    def _generate_explanation(self, risk, meta, foren, match):
        explanations = []
        if meta['trust_score'] < 70:
            explanations.append("Metadata anomalies detected (editing software).")
        if foren['ela_score'] > 20:
            explanations.append("Image forensics suggests pixel-level manipulation.")
        if match:
            explanations.append("High similarity to known historical fraud cases.")
            
        if not explanations:
            return "No significant fraud indicators detected."
        return " ".join(explanations)
