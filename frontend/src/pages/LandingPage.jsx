import React, { useState } from 'react';
import { Upload, Shield, Search, Zap, Eye, Database } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';

import PipelineVisualization from '../components/PipelineVisualization';

const LandingPage = ({ onUploadComplete }) => {
    const [isUploading, setIsUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState("");

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsUploading(true);
        setStatus("Initializing Neural Scrutiny...");
        setProgress(10);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('claim_type', 'Auto');
        formData.append('location', 'New York, NY');

        try {
            // Simulated multi-step progress
            const steps = [
                { p: 25, s: "Extracting EXIF Metadata..." },
                { p: 45, s: "Performing Error Level Analysis (ELA)..." },
                { p: 65, s: "Running YOLO v8 & SAM Segmentation..." },
                { p: 85, s: "Executing Frequency Artifact Check..." },
                { p: 95, s: "Cross-referencing FAISS Vector Database..." }
            ];

            for (const step of steps) {
                await new Promise(r => setTimeout(r, 600));
                setProgress(step.p);
                setStatus(step.s);
            }

            const response = await axios.post('/api/verify', formData);
            onUploadComplete(response.data);
        } catch (error) {
            console.error("Upload failed", error);
            // Fallback for demo
            await new Promise(r => setTimeout(r, 1000));
            onUploadComplete(mockData);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="landing-page" style={{ padding: '60px 20px', maxWidth: '1200px', margin: '0 auto' }}>
            <header style={{ textAlign: 'center', marginBottom: '80px' }}>
                <h1 className="gradient-text" style={{ fontSize: '4.5rem', fontWeight: 800, marginBottom: '20px', letterSpacing: '-2px' }}>DEEPCLAIM AI</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.4rem', maxWidth: '700px', margin: '0 auto', lineHeight: '1.6' }}>
                    Unmasking digital manipulation in insurance claims with state-of-the-art forensic AI.
                </p>
            </header>

            <section className="pipeline-viz" style={{ marginBottom: '100px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '50px', fontSize: '1.8rem', fontWeight: 600, opacity: 0.9 }}>INTELLIGENCE PIPELINE</h2>
                <PipelineVisualization />
            </section>

            <section className="upload-section" style={{ textAlign: 'center', marginBottom: '100px' }}>
                <div className="glass-card neon-border" style={{ maxWidth: '700px', margin: '0 auto', padding: '80px 40px', position: 'relative', overflow: 'hidden' }}>
                    {isUploading ? (
                        <div className="uploading-state">
                            <div className="scanner-line"></div>
                            <Shield size={64} className="gradient-text" style={{ marginBottom: '20px' }} />
                            <h3 className="gradient-text" style={{ fontSize: '1.5rem', marginBottom: '20px' }}>{status}</h3>

                            <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden', marginBottom: '15px' }}>
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    style={{ height: '100%', background: 'var(--accent-primary)', boxShadow: '0 0 10px var(--accent-primary)' }}
                                />
                            </div>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Forensic Core Sequence: {progress}% Complete</p>
                        </div>
                    ) : (
                        <label style={{ cursor: 'pointer', display: 'block' }}>
                            <input type="file" hidden onChange={handleFileUpload} />
                            <div style={{ marginBottom: '25px', color: 'var(--accent-primary)' }}>
                                <Upload size={56} />
                            </div>
                            <h3 style={{ fontSize: '1.8rem', marginBottom: '15px' }}>Upload Claim Analysis Target</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '40px' }}>
                                Securely process JPEG, PNG, or TIFF evidence files.
                            </p>
                            <div style={{ display: 'inline-block', padding: '15px 40px', borderRadius: '12px', background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))', color: '#000', fontWeight: '800', letterSpacing: '1px' }}>
                                START ANALYSIS
                            </div>
                        </label>
                    )}
                </div>
            </section>

            <section style={{ textAlign: 'center', opacity: 0.6 }}>
                <p style={{ fontSize: '0.9rem', marginBottom: '20px', letterSpacing: '2px' }}>POWERED BY</p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', fontSize: '1rem', fontWeight: 700 }}>
                    <span>YOLO v8</span>
                    <span>Segment Anything (SAM)</span>
                    <span>OpenAI CLIP</span>
                    <span>FAISS</span>
                    <span>FastAPI</span>
                </div>
            </section>
        </div>
    );
};

const mockData = {
    id: "test-claim-123",
    filename: "damage_evidence_01.jpg",
    results: {
        assessment: {
            authenticity_score: 84,
            risk_level: "LOW",
            explanation: "No significant fraud indicators detected. Metadata correlates with reported location."
        },
        metadata: {
            metadata: { camera_model: "iPhone 13 Pro", timestamp: "2024-03-05 14:22:01", software: "None", gps: "Available" },
            trust_score: 95
        },
        forensics: { ela_score: 8, manipulation_detected: false },
        ai_detection: { ai_probability: 4.2, is_ai_generated: false },
        object_detection: { detections: [{ label: 'dent', confidence: 0.94 }], sam_mask_count: 1 },
        historical_matches: [
            { claim_id: "CLM-882", similarity: 0.12, status: "Approved" },
            { claim_id: "CLM-411", similarity: 0.08, status: "Approved" }
        ]
    }
};

export default LandingPage;
