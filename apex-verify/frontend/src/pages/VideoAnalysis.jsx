import React, { useState, useRef, useEffect } from "react";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];

export default function VideoAnalysis() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [dragOver, setDragOver] = useState(false);
    const [status, setStatus] = useState("idle"); // idle, analyzing, done, error
    const [errorStr, setErrorStr] = useState(null);
    const [videoPreviewUrl, setVideoPreviewUrl] = useState(null);

    // Real-time analysis states
    const [currentFrameUrl, setCurrentFrameUrl] = useState(null);
    const [crashDetected, setCrashDetected] = useState(false);
    const [logMessages, setLogMessages] = useState([]);

    const abortControllerRef = useRef(null);
    const videoRef = useRef(null);

    const handleFileChange = (file) => {
        setSelectedFile(file);
        setStatus("idle");
        setErrorStr(null);
        setCrashDetected(false);
        setCurrentFrameUrl(null);
        setLogMessages([]);
        if (file) {
            setVideoPreviewUrl(URL.createObjectURL(file));
        } else {
            setVideoPreviewUrl(null);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        const dropped = e.dataTransfer.files[0];
        if (dropped && ALLOWED_VIDEO_TYPES.includes(dropped.type)) {
            handleFileChange(dropped);
        }
    };

    const handleAnalyze = async () => {
        if (!selectedFile) return;
        setStatus("analyzing");
        setErrorStr(null);
        setCrashDetected(false);
        setCurrentFrameUrl(null);
        setLogMessages([{ time: new Date().toLocaleTimeString(), msg: "Starting dashcam segmentation analysis..." }]);

        const controller = new AbortController();
        abortControllerRef.current = controller;

        const formData = new FormData();
        formData.append("file", selectedFile);

        try {
            const response = await fetch(`${API_BASE}/analyze/video/stream`, {
                method: "POST",
                body: formData,
                signal: controller.signal,
            });

            if (!response.ok) {
                throw new Error("Failed to start video analysis.");
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = "";

            while (true) {
                const { value, done } = await reader.read();
                if (done) break;
                buffer += decoder.decode(value, { stream: true });

                const parts = buffer.split("\n\n");
                buffer = parts.pop();

                for (const part of parts) {
                    const lines = part.trim().split("\n");
                    let dataStr = "";
                    for (const line of lines) {
                        if (line.startsWith("data: ")) dataStr = line.slice(6).trim();
                    }
                    if (!dataStr) continue;

                    try {
                        const data = JSON.parse(dataStr);
                        if (data.status === "error") {
                            throw new Error(data.message);
                        }
                        if (data.type === "frame") {
                            setCurrentFrameUrl(`data:image/jpeg;base64,${data.base64_img}`);

                            if (data.crash_risk > 0.8 && !crashDetected) {
                                setCrashDetected(true);
                                setLogMessages(prev => [{ time: new Date().toLocaleTimeString(), msg: "🚨 HIGH RISK: Collision detected between segmented vehicles!" }, ...prev]);
                            }

                            if (data.info_msg) {
                                setLogMessages(prev => [{ time: new Date().toLocaleTimeString(), msg: data.info_msg }, ...prev].slice(0, 50));
                            }
                        } else if (data.type === "complete") {
                            setStatus("done");
                            setLogMessages(prev => [{ time: new Date().toLocaleTimeString(), msg: "✅ Video analysis completed." }, ...prev]);
                        }
                    } catch (e) {
                        console.error("Parse error logic", e);
                    }
                }
            }
        } catch (err) {
            if (err.name !== "AbortError") {
                setStatus("error");
                setErrorStr(err.message);
                setLogMessages(prev => [{ time: new Date().toLocaleTimeString(), msg: `❌ Error: ${err.message}` }, ...prev]);
            }
        }
    };

    const handleStop = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            setStatus("idle");
            setLogMessages(prev => [{ time: new Date().toLocaleTimeString(), msg: "⏹️ Analysis manually stopped." }, ...prev]);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-6 pb-6 space-y-6 animate-fade-in">
            {/* Page Header */}
            <div className="mb-6">
                <h2 className="text-xl font-bold text-textPrimary flex items-center gap-2">
                    <span className="text-danger">🔴</span> RT-DETR + SAM2 Crash Segmentation
                </h2>
                <p className="text-sm text-textMuted mt-1">
                    Upload dashcam or CCTV footage. AI continuously extracts keyframes, detects vehicles, creates precise segmentation masks, and identifies overlapping collision boundaries to classify physical impact.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Upload & Controls */}
                <div className="lg:col-span-4 space-y-4">
                    <div className="panel p-4">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-textMuted mb-3">
                            Video Input
                        </h3>

                        <div
                            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                            onDragLeave={() => setDragOver(false)}
                            onDrop={handleDrop}
                            className={`relative rounded-xl border-2 border-dashed transition-all duration-200 overflow-hidden cursor-pointer
                ${dragOver
                                    ? "border-danger bg-danger/5 scale-[1.01]"
                                    : videoPreviewUrl
                                        ? "border-border"
                                        : "border-border hover:border-danger/30 hover:bg-surfaceHover"
                                }`}
                            onClick={() => document.getElementById("video-input").click()}
                        >
                            <input
                                id="video-input"
                                type="file"
                                accept={ALLOWED_VIDEO_TYPES.join(",")}
                                className="sr-only"
                                onChange={(e) => handleFileChange(e.target.files[0])}
                            />

                            {videoPreviewUrl ? (
                                <div className="relative">
                                    <video
                                        ref={videoRef}
                                        src={videoPreviewUrl}
                                        className="w-full h-48 object-cover bg-black"
                                        controls
                                        muted
                                    />
                                    <div className="absolute top-2 right-2">
                                        <span className="text-[10px] px-2 py-1 bg-surface/80 backdrop-blur rounded-full text-textSecondary border border-border">
                                            Click to change
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                                    <div className="w-12 h-12 rounded-xl bg-surfaceHover flex items-center justify-center mb-3 text-2xl border border-border">
                                        📹
                                    </div>
                                    <p className="text-sm font-medium text-textPrimary mb-1">
                                        Drop dashcam video here
                                    </p>
                                    <p className="text-xs text-textMuted">
                                        MP4, WebM, MOV · Click to browse
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="mt-4">
                            {status === "analyzing" ? (
                                <button onClick={handleStop} className="btn-primary w-full !bg-surfaceHover !text-textPrimary border border-border">
                                    <span className="w-3.5 h-3.5 border-2 border-danger border-t-transparent rounded-full animate-spin" />
                                    Stop Analysis
                                </button>
                            ) : (
                                <button
                                    onClick={handleAnalyze}
                                    disabled={!selectedFile || status === "analyzing"}
                                    className="btn-primary w-full !bg-danger hover:!bg-danger/80"
                                >
                                    <span>🔍</span> Run Real-Time Crash Detection
                                </button>
                            )}
                        </div>

                        {errorStr && (
                            <div className="mt-3 flex items-start gap-2 px-3 py-2 bg-danger/10 border border-danger/20 rounded-lg">
                                <span className="text-danger text-xs mt-0.5">⚠</span>
                                <p className="text-xs text-danger">{errorStr}</p>
                            </div>
                        )}
                    </div>

                    <div className="panel p-4 h-64 flex flex-col">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-textMuted mb-2">
                            Analysis Log
                        </h3>
                        <div className="flex-1 overflow-y-auto space-y-2 pr-1 pt-1 border-t border-border">
                            {logMessages.length === 0 ? (
                                <p className="text-[11px] text-textMuted">Awaiting video stream...</p>
                            ) : (
                                logMessages.map((log, i) => (
                                    <div key={i} className="flex gap-2">
                                        <span className="text-[10px] text-textMuted font-mono w-14 shrink-0 mt-0.5">{log.time}</span>
                                        <span className={`text-xs ${log.msg.includes("HIGH RISK") ? "text-danger font-bold" : "text-textSecondary"}`}>
                                            {log.msg}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Live SSE Analysis View */}
                <div className="lg:col-span-8 flex flex-col gap-4">
                    <div className="panel p-4 flex-1 flex flex-col relative min-h-[400px]">

                        {/* Status overlay */}
                        <div className="absolute top-6 left-6 z-10 flex gap-2">
                            {status === "analyzing" && (
                                <div className="px-2 py-1 bg-black/60 backdrop-blur rounded text-[10px] text-white flex items-center gap-1.5 uppercase font-medium tracking-wide">
                                    <div className="w-1.5 h-1.5 bg-danger rounded-full animate-pulse" />
                                    Streaming Masks
                                </div>
                            )}
                            {crashDetected && (
                                <div className="px-2 py-1 bg-danger/80 backdrop-blur rounded text-[10px] text-white flex items-center gap-1 flex-col font-bold border border-danger">
                                    <span>CRASH / ANOMALY</span>
                                    <span>DETECTED</span>
                                </div>
                            )}
                        </div>

                        <div className="w-full flex-1 bg-black/50 border border-border rounded-lg overflow-hidden flex items-center justify-center">
                            {currentFrameUrl ? (
                                <img src={currentFrameUrl} alt="Live Analysis Frame" className="w-full object-contain max-h-[500px]" />
                            ) : (
                                <div className="text-center">
                                    <div className="text-4xl opacity-20 mb-2">📺</div>
                                    <p className="text-xs text-textMuted">Live SAM2 segmented frames will render here...</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
