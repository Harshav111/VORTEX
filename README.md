# 🚀 DeepClaim AI
### AI-Powered Insurance Claim Fraud Detection System

DeepClaim AI is a forensic AI platform designed to detect fraudulent insurance claims by analyzing claim images using computer vision, image forensics, and similarity search.

The system automatically detects:

- 🔍 Image tampering
- 🤖 AI-generated images
- 🔁 Reused claim photos
- 📊 Fraud probability scores

It generates an **Authenticity Score** and highlights suspicious regions with visual heatmaps, enabling insurance adjusters to verify claims faster and more accurately.

---

## 🌍 Problem

Insurance companies lose billions annually due to fraudulent claims.

Fraudsters often manipulate images using:
- Photo editing tools
- AI image generators
- Reused accident photos
- Staged damage scenes

Manual verification is ❌ slow, ❌ expensive, and ❌ unreliable.

**DeepClaim AI provides automated forensic verification to solve this problem.**

---

## 🧠 Key Features

### 🔬 Image Forensics
Detects manipulation using:
- Error Level Analysis (ELA)
- Noise pattern inconsistencies
- Copy-move detection

### 🤖 AI-Generated Image Detection
Identifies synthetic images created using modern generative models.

### 🧩 Damage Region Segmentation
Uses segmentation models to isolate suspicious regions before analysis.

### 🔁 Historical Claim Detection
Detects reused incident photos using similarity search across previous claims.

### 📊 Authenticity Score
Each claim receives a fraud probability score with visual explanations.

### 🔎 Explainable AI
The system highlights suspicious regions using manipulation heatmaps.

---

## 🏗 System Architecture

```
User Upload
     │
     ▼
React Dashboard
     │
     ▼
FastAPI Backend
     │
 ┌───────────────┬───────────────┬───────────────┐
 │               │               │
Metadata Engine  SAM Segmentation  Image Similarity
 │               │               │
 ▼               ▼               ▼
Metadata Score   Region Forensics   Claim Database
 │               │               │
 └───────────────┴───────────────┘
             ▼
      Fraud Risk Aggregator
             ▼
      Explainable AI Layer
             ▼
      Adjuster Dashboard
```

---

## ⚙️ Technology Stack

| Layer | Technologies |
|-------|-------------|
| **Backend** | FastAPI, Python, OpenCV, NumPy |
| **AI / ML** | SAM, YOLO, CLIP Embeddings, FAISS, Deep Product Quantization (DPQ) |
| **Frontend** | React, TailwindCSS, Recharts |

---

## 📂 Repository Structure

```
deepclaim-ai
│
├── backend
│   ├── api
│   ├── services
│   ├── forensic
│   └── similarity
│
├── frontend
│   └── dashboard
│
├── models
│   ├── sam
│   └── detection
│
├── data
│   └── claim_index
│
└── README.md
```

---

## 🔄 Workflow

| Step | Description |
|------|-------------|
| 1️⃣ Claim Upload | Adjuster uploads a claim image via the dashboard |
| 2️⃣ Metadata Inspection | Extracts EXIF metadata (camera model, timestamp, GPS location) |
| 3️⃣ Image Forensic Analysis | ELA and noise analysis detect image manipulation |
| 4️⃣ Region Segmentation | Suspicious regions isolated using segmentation models |
| 5️⃣ AI Image Detection | Evaluates whether the image is AI-generated |
| 6️⃣ Similarity Search | Compares claim image with historical claims via vector search |
| 7️⃣ Fraud Score Generation | All signals combined into a final Authenticity Score |

---

## 📊 Example Output

```
Authenticity Score: 38%

Fraud Indicators:
• Image manipulation detected
• Similar claim image found
• Synthetic artifact probability: 0.64
```

The system generates a **visual heatmap** highlighting suspicious regions.

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-username/deepclaim-ai.git
cd deepclaim-ai
```

### 2️⃣ Setup Backend (FastAPI)
```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate
```

### 3️⃣ Install Python Dependencies
```bash
pip install -r requirements.txt
```

Key dependencies: `fastapi`, `uvicorn`, `torch`, `transformers`, `faiss-cpu`, `opencv-python`, `numpy`, `pillow`

### 4️⃣ Download AI Models
```bash
python download_models.py
```

Or manually place models inside:
```
models/
 ├── sam/
 ├── yolo/
 └── clip/
```

### 5️⃣ Build Similarity Search Index
```bash
python build_index.py
```

This will convert images into CLIP embeddings, store vectors in a FAISS index, and save the similarity database.

### 6️⃣ Run the Backend Server
```bash
uvicorn main:app --reload
```

- **API:** `http://localhost:8000`
- **Docs:** `http://localhost:8000/docs`

### 7️⃣ Setup & Run Frontend
```bash
cd frontend
npm install
npm run dev
```

- **Dashboard:** `http://localhost:5173`

---

## 🔟 Example API Request

```http
POST /verify_claim
```

Upload an image and receive fraud analysis. Example response:

```json
{
  "authenticity_score": 32,
  "tampering_probability": 0.81,
  "ai_generation_probability": 0.64,
  "similar_claims": ["claim_203.jpg", "claim_511.jpg"]
}
```

---

## 🛠 System Requirements

| | Minimum | Recommended |
|--|---------|-------------|
| **Python** | 3.9+ | 3.10+ |
| **Node.js** | 18+ | 20+ |
| **RAM** | 8 GB | 16 GB |
| **GPU** | Optional | NVIDIA with CUDA |

---

## ⚡ Performance & 🌱 Green AI

- ⏱ **Average processing time:** ~0.5 seconds per claim
- Uses **Deep Product Quantization (DPQ)** for compressed vector search
- **FAISS indexing** for fast similarity queries
- Region-based analysis minimizes full-image computation
- Optimized inference pipelines reduce carbon footprint and infrastructure cost

---

## 📊 Impact

| For | Benefits |
|-----|----------|
| **Insurance Companies** | Faster claim verification · Reduced fraud losses · Automated detection |
| **Insurance Adjusters** | Visual fraud explanation · Instant authenticity score · Better decision support |
| **Industry** | Prevent fraud rings · Improve trust · Enable scalable fraud prevention |

---

## 🚧 Future Work

- Graph Neural Networks for fraud ring detection
- Blockchain-based claim verification
- Multimodal fraud detection
- Large-scale claim database indexing

---

## 📚 Datasets

- [CarDD Vehicle Damage Dataset](https://github.com/)
- [CASIA Image Tampering Dataset](https://github.com/)

## 📖 References

- Machine Learning Based Method for Insurance Fraud Detection on Claims Data — IEEE
- Improving Insurance Fraud Detection With Generated Data — IEEE
- Healthcare Insurance Fraud Detection Powered by Blockchain and ML — IEEE

---

## 👨‍💻 Contributors — Team Pirate Kings

- **Harshavarthan S**
- **Kanna VS**

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).
DEMO LINK:https://youtu.be/71cb4WtIJiw

---

⭐ *If you find this project useful, consider starring the repository!*
