import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

/**
 * Generate a PDF report from analysis results.
 * This version uses html2canvas and jsPDF for an actual .pdf file download.
 */
export async function generateAnalysisReport(result, previewUrl) {
    if (!result) return;

    const {
        authenticity_score,
        risk_level,
        breakdown,
        fraud_reasons,
        signals,
        claim_uuid,
        alert,
    } = result;

    const timestamp = new Date().toLocaleString();

    // Create a temporary hidden container to render the report
    const container = document.createElement("div");
    container.style.position = "absolute";
    container.style.left = "-9999px";
    container.style.top = "0";
    container.style.width = "800px";
    container.style.padding = "40px";
    container.style.background = "#ffffff";
    container.style.color = "#1f2937";
    container.style.fontFamily = "'Inter', -apple-system, sans-serif";

    container.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #e5e7eb; padding-bottom: 20px; margin-bottom: 30px;">
            <div style="font-size: 24px; font-weight: 800; color: #0ea5e9;">DeepClaim AI Forensic Report</div>
            <div style="text-align: right; font-size: 10px; color: #6b7280;">
                <div>UUID: ${claim_uuid}</div>
                <div>Date: ${timestamp}</div>
                <div>System: apex-verify v2.0</div>
            </div>
        </div>

        <div style="display: flex; gap: 40px; margin-bottom: 40px; background: #f9fafb; padding: 25px; border-radius: 12px; border: 1px solid #e5e7eb;">
            <div style="width: 100px; height: 100px; border-radius: 50px; display: flex; flex-direction: column; align-items: center; justify-content: center; border: 6px solid ${getScoreColor(authenticity_score)}; background: #fff;">
                <div style="font-size: 24px; font-weight: 800; color: ${getScoreColor(authenticity_score)};">${Math.round(authenticity_score)}</div>
                <div style="font-size: 8px; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280;">Authenticity</div>
            </div>
            <div style="flex: 1;">
                <div style="display: inline-block; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 700; text-transform: uppercase; margin-bottom: 10px; background: ${getRiskBg(risk_level)}; color: ${getScoreColor(authenticity_score)};">
                    ${risk_level} RISK ASSESSMENT
                </div>
                <p style="margin: 0; font-size: 13px; color: #4b5563; line-height: 1.6;">
                    Comprehensive forensic analysis indicates a <strong>${risk_level.toLowerCase()} probability of fraud</strong> 
                    based on multi-modal signal processing including ELA, AI-gen detection, and metadata consistency.
                </p>
            </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px;">
            <div>
                <h2 style="font-size: 16px; font-weight: 700; margin-bottom: 15px; color: #111827; border-left: 4px solid #0ea5e9; padding-left: 12px;">Fraud Signals</h2>
                ${fraud_reasons.map(r => `<div style="display: flex; gap: 10px; margin-bottom: 8px; padding: 10px; background: #f3f4f6; border-radius: 6px; font-size: 11px;">🚩 ${r}</div>`).join('')}
            </div>
            <div>
                <h2 style="font-size: 16px; font-weight: 700; margin-bottom: 15px; color: #111827; border-left: 4px solid #0ea5e9; padding-left: 12px;">Recommended Actions</h2>
                <div style="border: 1px solid #e5e7eb; border-radius: 12px; padding: 15px;">
                    ${alert?.recommended_actions?.map(a => `<div style="margin-bottom: 6px; font-size: 11px; padding-left: 15px; position: relative;">• ${a}</div>`).join('') || "No specific actions recommended."}
                </div>
            </div>
        </div>

        <div>
            <h2 style="font-size: 16px; font-weight: 700; margin-bottom: 15px; color: #111827; border-left: 4px solid #0ea5e9; padding-left: 12px;">Quantitative Analysis</h2>
            <table style="width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 40px;">
                <thead>
                    <tr style="text-align: left; border-bottom: 1px solid #e5e7eb;">
                        <th style="padding: 10px; color: #6b7280; font-size: 10px; text-transform: uppercase;">Signal</th>
                        <th style="padding: 10px; color: #6b7280; font-size: 10px; text-transform: uppercase;">Value</th>
                        <th style="padding: 10px; color: #6b7280; font-size: 10px; text-transform: uppercase;">Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${signals.map(s => `
                        <tr style="border-bottom: 1px solid #f3f4f6;">
                            <td style="padding: 10px;">${s.signal}</td>
                            <td style="padding: 10px; font-weight: 600;">${s.score.toFixed(1)}%</td>
                            <td style="padding: 10px; color: ${getScoreColor(s.score)}; font-weight: 700;">
                                ${s.score >= 82 ? 'Optimal' : s.score >= 55 ? 'Fair' : 'Suspicious'}
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>

        <div style="margin-top: 50px; font-size: 10px; color: #9ca3af; text-align: center; border-top: 1px solid #f3f4f6; padding-top: 20px;">
            This document is a certified digital forensic output from DeepClaim AI. 
            The results are probabilistic and should be verified by a certified fraud investigator.
        </div>
    `;

    document.body.appendChild(container);

    try {
        // Wait for fonts/images to potentially load
        await new Promise(res => setTimeout(res, 500));

        const canvas = await html2canvas(container, {
            scale: 2, // High resolution
            useCORS: true,
            logging: false,
            backgroundColor: "#ffffff"
        });

        const imgData = canvas.toDataURL("image/jpeg", 0.95);
        const pdf = new jsPDF({
            orientation: "portrait",
            unit: "px",
            format: [canvas.width / 2, canvas.height / 2] // Scale back down to actual size
        });

        const width = pdf.internal.pageSize.getWidth();
        const height = pdf.internal.pageSize.getHeight();

        pdf.addImage(imgData, "JPEG", 0, 0, width, height);
        pdf.save(`DeepClaim_Report_${claim_uuid.slice(0, 8)}.pdf`);

    } catch (err) {
        console.error("PDF generation failed:", err);
        alert("Failed to generate PDF. Please try again.");
    } finally {
        document.body.removeChild(container);
    }
}

function getScoreColor(score) {
    if (score >= 82) return "#16a34a"; // green-600
    if (score >= 55) return "#d97706"; // amber-600
    return "#dc2626"; // red-600
}

function getRiskBg(level) {
    if (level === "LOW") return "#f0fdf4";
    if (level === "MEDIUM") return "#fffbeb";
    return "#fef2f2";
}
