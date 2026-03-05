import React from 'react';
import { motion } from 'framer-motion';

const PipelineVisualization = () => {
    const steps = [
        { title: "Image Ingestion", desc: "EXIF & Forensic Scrutiny", color: "#00f2ff" },
        { title: "Vision Processing", desc: "YOLO v8 & SAM Segments", color: "#00f2ff" },
        { title: "Frequency Check", desc: "AI Diffusion Artifacts", color: "#7000ff" },
        { title: "Vector Lookup", desc: "CLIP & FAISS Cross-Ref", color: "#7000ff" },
        { title: "Final Aggregation", desc: "8-Signal Fraud Score", color: "#00e676" },
    ];

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '15px', maxWidth: '1000px', margin: '0 auto' }}>
            {steps.map((step, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="glass-card"
                    style={{
                        padding: '20px',
                        textAlign: 'center',
                        position: 'relative',
                        borderBottom: `2px solid ${step.color}`
                    }}
                >
                    <div style={{ fontSize: '0.8rem', fontWeight: 800, color: step.color, marginBottom: '8px' }}>STEP 0{i + 1}</div>
                    <h4 style={{ fontSize: '1rem', marginBottom: '8px' }}>{step.title}</h4>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{step.desc}</p>
                    {i < 4 && (
                        <div style={{ position: 'absolute', top: '50%', right: '-15%', width: '30%', height: '1px', background: 'linear-gradient(90deg, rgba(255,255,255,0.2), transparent)', zIndex: -1 }} />
                    )}
                </motion.div>
            ))}
        </div>
    );
};

export default PipelineVisualization;
