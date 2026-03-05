import React, { useState } from 'react';
import { ShieldAlert, CheckCircle, Info, ArrowLeft, Maximize2, Layers } from 'lucide-react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { motion } from 'framer-motion';

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = ({ data, onReset }) => {
    const [activeTab, setActiveTab] = useState('summary');
    const [showHeatmap, setShowHeatmap] = useState(false);

    if (!data || !data.results || !data.results.assessment) {
        return (
            <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', background: 'var(--bg-dark)' }}>
                <div className="glass-card neon-border" style={{ width: '450px', padding: '50px', textAlign: 'center' }}>
                    <div className="scanner-line"></div>
                    <ShieldAlert size={48} className="gradient-text" style={{ marginBottom: '25px' }} />
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '15px' }}>Finalizing Verification</h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>Aggregating forensic signals and generating authenticity report...</p>
                    <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                        <motion.div
                            initial={{ width: '0%' }}
                            animate={{ width: '100%' }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            style={{ height: '100%', background: 'var(--accent-primary)' }}
                        />
                    </div>
                    <button onClick={onReset} style={{ marginTop: '40px', background: 'transparent', border: '1px solid var(--border-glass)', color: 'var(--text-muted)', padding: '10px 25px', borderRadius: '8px' }}>
                        Abort & Return
                    </button>
                </div>
            </div>
        );
    }

    const results = data.results;
    const assessment = results.assessment;

    const scoreData = {
        datasets: [{
            data: [assessment.authenticity_score, 100 - assessment.authenticity_score],
            backgroundColor: [
                assessment.authenticity_score > 70 ? '#00e676' : assessment.authenticity_score > 40 ? '#ffb700' : '#ff4d4d',
                'rgba(255, 255, 255, 0.05)'
            ],
            borderWidth: 0,
            cutout: '85%'
        }]
    };

    return (
        <div style={{ display: 'flex', height: '100vh', padding: '20px', gap: '20px', overflow: 'hidden' }}>
            {/* Sidebar Navigation */}
            <div className="glass-card" style={{ width: '80px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '30px' }}>
                <button onClick={onReset} style={{ background: 'none', border: 'none', color: 'var(--text-muted)' }}>
                    <ArrowLeft />
                </button>
                <div style={{ margin: '10px 0', width: '30px', height: '1px', background: 'var(--border-glass)' }} />
                <button onClick={() => setActiveTab('summary')} style={{ color: activeTab === 'summary' ? 'var(--accent-primary)' : 'var(--text-muted)' }}><ShieldAlert /></button>
                <button onClick={() => setActiveTab('vision')} style={{ color: activeTab === 'vision' ? 'var(--accent-primary)' : 'var(--text-muted)' }}><Layers /></button>
                <button onClick={() => setActiveTab('history')} style={{ color: activeTab === 'history' ? 'var(--accent-primary)' : 'var(--text-muted)' }}><Info /></button>
            </div>

            {/* Main Content Area */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px', overflowY: 'auto' }}>
                {/* Top Header */}
                <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 30px' }}>
                    <div>
                        <h2 style={{ fontSize: '1.2rem', fontWeight: 600 }}>DeepClaim Analysis ID: <span style={{ color: 'var(--accent-primary)' }}>{data.id.substring(0, 8)}</span></h2>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Analyzed: {new Date().toLocaleString()}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '15px' }}>
                        <div className="neon-border" style={{ padding: '8px 20px', borderRadius: '4px', fontSize: '0.9rem', background: assessment.risk_level === 'LOW' ? 'rgba(0, 230, 118, 0.1)' : 'rgba(255, 77, 77, 0.1)', color: assessment.risk_level === 'LOW' ? 'var(--success)' : 'var(--danger)' }}>
                            Risk: {assessment.risk_level}
                        </div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '20px', flex: 1 }}>
                    {/* Left Column: Image Viewer & Analysis Details */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {/* Image Viewer Component */}
                        <div className="glass-card" style={{ flex: 1, position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', padding: 0 }}>
                            <div style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 5, padding: '10px 20px', background: 'rgba(0,0,0,0.6)', borderRadius: '20px', backdropFilter: 'blur(5px)' }}>
                                {showHeatmap ? "Heatmap Overlay Active" : "Original Source"}
                            </div>
                            <div style={{ position: 'absolute', right: '20px', bottom: '20px', display: 'flex', gap: '10px' }}>
                                <button
                                    onClick={() => setShowHeatmap(!showHeatmap)}
                                    style={{ background: showHeatmap ? 'var(--accent-primary)' : 'var(--bg-glass)', border: '1px solid var(--accent-primary)', color: showHeatmap ? '#000' : 'var(--accent-primary)', padding: '10px', borderRadius: '8px' }}
                                >
                                    <Layers size={18} />
                                </button>
                                <button style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-glass)', padding: '10px', borderRadius: '8px' }}>
                                    <Maximize2 size={18} />
                                </button>
                            </div>

                            <div style={{ width: '100%', height: '100%', background: '#111', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                {data.imageUrl ? (
                                    <img
                                        src={data.imageUrl}
                                        alt="Evidence"
                                        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                                    />
                                ) : (
                                    <div style={{ textAlign: 'center', color: '#333' }}>
                                        <ShieldAlert size={100} opacity={0.3} />
                                        <p>EVIDENCE PREVIEW</p>
                                    </div>
                                )}
                                {showHeatmap && results.forensics.heatmap_url && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 0.9 }}
                                        style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}
                                    >
                                        <img
                                            src={`http://localhost:8000${results.forensics.heatmap_url}`}
                                            alt="ELA Heatmap"
                                            style={{ width: '100%', height: '100%', objectFit: 'contain', mixBlendMode: 'screen', filter: 'hue-rotate(180deg) saturate(2)' }}
                                        />
                                    </motion.div>
                                )}
                            </div>
                        </div>

                        {/* Modules Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
                            <ModuleCard
                                title="Forensic Artifacts"
                                status={results.forensics.ela_score < 20 ? 'Secure' : 'Alert'}
                                value={`${results.forensics.ela_score}% Variation`}
                                sub={results.forensics.manipulation_detected ? 'Potential Edit' : 'Pixel Integrity high'}
                            />
                            <ModuleCard
                                title="Neural Scrutiny"
                                status={results.ai_detection.ai_probability < 30 ? 'Natural' : 'Suspicious'}
                                value={`${results.ai_detection.ai_probability}% AI Prop.`}
                                sub={results.ai_detection.method}
                            />
                            <ModuleCard
                                title="Data Provenance"
                                status={results.metadata.trust_score > 70 ? 'Verified' : 'Anomalous'}
                                value={results.metadata.metadata.camera_model}
                                sub={results.metadata.metadata.gps === 'Available' ? 'GPS Encoded' : 'Striped Metadata'}
                            />
                        </div>
                    </div>

                    {/* Right Column: Scoring & Alerts */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                            <h3 style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '20px' }}>AUTHENTICITY SCORE</h3>
                            <div style={{ position: 'relative', width: '200px', height: '200px' }}>
                                <Doughnut data={scoreData} options={{ cutout: '85%', plugins: { legend: { display: false } } }} />
                                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                    <span style={{ fontSize: '3rem', fontWeight: 800 }}>{assessment.authenticity_score}</span>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>/ 100</span>
                                </div>
                            </div>
                            <p style={{ marginTop: '20px', fontSize: '0.9rem', color: assessment.authenticity_score > 70 ? 'var(--success)' : 'var(--danger)' }}>
                                {assessment.explanation}
                            </p>
                        </div>

                        <div className="glass-card" style={{ flex: 1 }}>
                            <h3 style={{ fontSize: '1rem', marginBottom: '20px' }}>HISTORICAL ANALYSIS</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                {results.historical_matches.map((match, i) => (
                                    <div key={i} style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', borderLeft: match.status === 'Approved' ? '4px solid var(--success)' : '4px solid var(--danger)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                                            <span style={{ fontWeight: 600 }}>{match.claim_id}</span>
                                            <span style={{ color: 'var(--accent-primary)' }}>{Math.round(match.similarity * 100)}% Match</span>
                                        </div>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>Result: {match.status}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ModuleCard = ({ title, status, value, sub }) => (
    <div className="glass-card" style={{ padding: '20px' }}>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>{title}</p>
        <h4 style={{ fontSize: '1.2rem', margin: '10px 0' }}>{value}</h4>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: status === 'Secure' || status === 'Natural' || status === 'Verified' ? 'var(--success)' : 'var(--danger)' }}>
            {status === 'Secure' || status === 'Verified' || status === 'Natural' ? <CheckCircle size={14} /> : <ShieldAlert size={14} />}
            {status}
        </div>
        {sub && <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '8px', opacity: 0.7 }}>{sub}</p>}
    </div>
);

export default Dashboard;
