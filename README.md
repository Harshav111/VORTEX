🚀 DeepClaim AI
AI-Powered Insurance Claim Fraud Detection System

DeepClaim AI is a forensic AI platform designed to detect fraudulent insurance claims by analyzing claim images using computer vision, image forensics, and similarity search.

The system automatically detects:

🔍 Image tampering
🤖 AI-generated images
🔁 Reused claim photos
📊 Fraud probability scores

It generates an Authenticity Score and highlights suspicious regions with visual heatmaps, enabling insurance adjusters to verify claims faster and more accurately.

🌍 Problem

Insurance companies lose billions annually due to fraudulent claims.

Fraudsters often manipulate images using:

Photo editing tools

AI image generators

Reused accident photos

Staged damage scenes

Manual verification is:

❌ slow
❌ expensive
❌ unreliable

DeepClaim AI provides automated forensic verification to solve this problem.

🧠 Key Features
🔬 Image Forensics

Detects manipulation using:

Error Level Analysis (ELA)

Noise pattern inconsistencies

Copy-move detection

🤖 AI-Generated Image Detection

Identifies synthetic images created using modern generative models.

🧩 Damage Region Segmentation

Uses segmentation models to isolate suspicious regions before analysis.

🔁 Historical Claim Detection

Detects reused incident photos using similarity search across previous claims.

📊 Authenticity Score

Each claim receives a fraud probability score with visual explanations.

🔎 Explainable AI

The system highlights suspicious regions using manipulation heatmaps.

🏗 System Architecture
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
⚙️ Technology Stack
Backend

FastAPI

Python

OpenCV

NumPy

AI / Machine Learning

Segment Anything Model (SAM)

YOLO Object Detection

CLIP Embeddings

FAISS Vector Search

Deep Product Quantization (DPQ)

Frontend

React

TailwindCSS

Recharts

📂 Repository Structure
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
🔄 Workflow
1️⃣ Claim Upload

The adjuster uploads a claim image via the dashboard.

2️⃣ Metadata Inspection

The system extracts EXIF metadata including:

camera model

timestamp

GPS location

3️⃣ Image Forensic Analysis

ELA and noise analysis detect image manipulation.

4️⃣ Region Segmentation

Suspicious regions are isolated using segmentation models.

5️⃣ AI Image Detection

The system evaluates whether the image is AI-generated.

6️⃣ Similarity Search

The claim image is compared with historical claims using vector search.

7️⃣ Fraud Score Generation

All signals are combined into a final Authenticity Score.

📊 Example Output
Authenticity Score: 38%

Fraud Indicators:
• Image manipulation detected
• Similar claim image found
• Synthetic artifact probability: 0.64

The system generates a visual heatmap highlighting suspicious regions.

⚡ Performance Optimization

DeepClaim AI is optimized for scalability using:

Deep Product Quantization (DPQ) for compressed vector search

FAISS indexing for fast similarity queries

Region-based analysis to reduce compute cost

Parallel AI modules for faster processing

⏱ Average processing time: ~0.5 seconds per claim

🌱 Green AI Impact

The system reduces energy usage by:

minimizing full-image computation

compressing embeddings using DPQ

optimizing inference pipelines

This lowers both infrastructure cost and carbon footprint.

📊 Impact

DeepClaim AI helps:

Insurance Companies

✔ Faster claim verification
✔ Reduced fraud losses
✔ Automated fraud detection

Insurance Adjusters

✔ Visual fraud explanation
✔ Instant authenticity score
✔ Better decision support

Industry

✔ Prevent fraud rings
✔ Improve trust in claim processing
✔ Enable scalable fraud prevention

📚 Datasets

CarDD Vehicle Damage Dataset

CASIA Image Tampering Dataset

📖 References

Machine Learning Based Method for Insurance Fraud Detection on Claims Data — IEEE

Improving Insurance Fraud Detection With Generated Data — IEEE

Healthcare Insurance Fraud Detection Powered by Blockchain and ML — IEEE

🚧 Future Work

Planned improvements include:

Graph Neural Networks for fraud ring detection

Blockchain-based claim verification

Multimodal fraud detection

Large-scale claim database indexing

👨‍💻 Contributors

Team Pirate Kings

Harshavarthan S

Kanna VS
🚀 DeepClaim AI
AI-Powered Insurance Claim Fraud Detection System










DeepClaim AI is a forensic AI platform designed to detect fraudulent insurance claims by analyzing claim images using computer vision, image forensics, and similarity search.

The system automatically detects:

🔍 Image tampering
🤖 AI-generated images
🔁 Reused claim photos
📊 Fraud probability scores

It generates an Authenticity Score and highlights suspicious regions with visual heatmaps, enabling insurance adjusters to verify claims faster and more accurately.

🌍 Problem

Insurance companies lose billions annually due to fraudulent claims.

Fraudsters often manipulate images using:

Photo editing tools

AI image generators

Reused accident photos

Staged damage scenes

Manual verification is:

❌ slow
❌ expensive
❌ unreliable

DeepClaim AI provides automated forensic verification to solve this problem.

🧠 Key Features
🔬 Image Forensics

Detects manipulation using:

Error Level Analysis (ELA)

Noise pattern inconsistencies

Copy-move detection

🤖 AI-Generated Image Detection

Identifies synthetic images created using modern generative models.

🧩 Damage Region Segmentation

Uses segmentation models to isolate suspicious regions before analysis.

🔁 Historical Claim Detection

Detects reused incident photos using similarity search across previous claims.

📊 Authenticity Score

Each claim receives a fraud probability score with visual explanations.

🔎 Explainable AI

The system highlights suspicious regions using manipulation heatmaps.

🏗 System Architecture
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
⚙️ Technology Stack
Backend

FastAPI

Python

OpenCV

NumPy

AI / Machine Learning

Segment Anything Model (SAM)

YOLO Object Detection

CLIP Embeddings

FAISS Vector Search

Deep Product Quantization (DPQ)

Frontend

React

TailwindCSS

Recharts

📂 Repository Structure
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
🔄 Workflow
1️⃣ Claim Upload

The adjuster uploads a claim image via the dashboard.

2️⃣ Metadata Inspection

The system extracts EXIF metadata including:

camera model

timestamp

GPS location

3️⃣ Image Forensic Analysis

ELA and noise analysis detect image manipulation.

4️⃣ Region Segmentation

Suspicious regions are isolated using segmentation models.

5️⃣ AI Image Detection

The system evaluates whether the image is AI-generated.

6️⃣ Similarity Search

The claim image is compared with historical claims using vector search.

7️⃣ Fraud Score Generation

All signals are combined into a final Authenticity Score.

📊 Example Output
Authenticity Score: 38%

Fraud Indicators:
• Image manipulation detected
• Similar claim image found
• Synthetic artifact probability: 0.64

The system generates a visual heatmap highlighting suspicious regions.

⚡ Performance Optimization

DeepClaim AI is optimized for scalability using:

Deep Product Quantization (DPQ) for compressed vector search

FAISS indexing for fast similarity queries

Region-based analysis to reduce compute cost

Parallel AI modules for faster processing

⏱ Average processing time: ~0.5 seconds per claim

🌱 Green AI Impact

The system reduces energy usage by:

minimizing full-image computation

compressing embeddings using DPQ

optimizing inference pipelines

This lowers both infrastructure cost and carbon footprint.

📊 Impact

DeepClaim AI helps:

Insurance Companies

✔ Faster claim verification
✔ Reduced fraud losses
✔ Automated fraud detection

Insurance Adjusters

✔ Visual fraud explanation
✔ Instant authenticity score
✔ Better decision support

Industry

✔ Prevent fraud rings
✔ Improve trust in claim processing
✔ Enable scalable fraud prevention

📚 Datasets

CarDD Vehicle Damage Dataset

CASIA Image Tampering Dataset

📖 References

Machine Learning Based Method for Insurance Fraud Detection on Claims Data — IEEE

Improving Insurance Fraud Detection With Generated Data — IEEE

Healthcare Insurance Fraud Detection Powered by Blockchain and ML — IEEE

🚧 Future Work

Planned improvements include:

Graph Neural Networks for fraud ring detection

Blockchain-based claim verification

Multimodal fraud detection

Large-scale claim database indexing

👨‍💻 Contributors

Team Pirate Kings

Harshavarthan S

Kanna VS

📜 License

MIT License

⭐ If you like this project, consider starring the repository.
⚙️ Installation & Setup

Follow these steps to run DeepClaim AI locally.

1️⃣ Clone the Repository
git clone https://github.com/your-username/deepclaim-ai.git
cd deepclaim-ai
2️⃣ Setup Backend (FastAPI)

Navigate to the backend folder:

cd backend

Create a virtual environment:

python -m venv venv

Activate the virtual environment:

Windows
venv\Scripts\activate
Mac/Linux
source venv/bin/activate
3️⃣ Install Python Dependencies
pip install -r requirements.txt

Typical dependencies include:

fastapi

uvicorn

torch

transformers

faiss-cpu

opencv-python

numpy

pillow

4️⃣ Download AI Models

Download required models such as:

Segment Anything Model (SAM)

YOLO detection weights

CLIP model

Example:

python download_models.py

Or manually place them inside:

models/
 ├── sam/
 ├── yolo/
 └── clip/
5️⃣ Build Similarity Search Index

Before running the system, generate embeddings for historical claim images.

python build_index.py

This will:

convert images into CLIP embeddings

store vectors in FAISS index

save similarity database

6️⃣ Run the Backend Server

Start the FastAPI server:

uvicorn main:app --reload

Backend will run on:

http://localhost:8000

API documentation:

http://localhost:8000/docs
7️⃣ Setup Frontend (React Dashboard)

Open a new terminal and navigate to the frontend folder:

cd frontend

Install dependencies:

npm install
8️⃣ Run the Frontend

Start the React development server:

npm run dev

Frontend will run on:

http://localhost:5173
9️⃣ Test the System

Open the dashboard in your browser

Upload a claim image

The system will analyze the image and generate:

Authenticity Score

Fraud heatmap

Similar claims

Metadata analysis

🔟 Example Request (API)

Example API call:

POST /verify_claim

Upload image and receive fraud analysis.

Response example:

{
  "authenticity_score": 32,
  "tampering_probability": 0.81,
  "ai_generation_probability": 0.64,
  "similar_claims": ["claim_203.jpg", "claim_511.jpg"]
}
🛠 System Requirements

Minimum requirements:

Python 3.9+

Node.js 18+

8 GB RAM

Optional GPU for faster segmentation

Recommended:

NVIDIA GPU with CUDA

16 GB RAM

🧪 Demo Data

Example claim images are provided in:

data/sample_claims

You can use these to test the system.

📜 License

MIT License

⭐ If you like this project, consider starring the repository.
