# 🗳️ ElectoAI: Your Democratic Companion

ElectoAI is a premium, AI-driven election assistant designed to empower citizens with accurate, non-partisan, and instant information about the democratic process. Built with a focus on trust, accessibility, and modern aesthetics.

**🚀 Live Demo:** [https://electo-app-882061897053.asia-south1.run.app](https://electo-app-882061897053.asia-south1.run.app)

---

## ✨ Key Features

-   **🤖 Enterprise AI**: Powered by **Google Vertex AI** (Gemini 1.5 Flash) for production-grade reliability and low-latency responses.
-   **📅 Interactive Timeline**: A dynamic, status-driven visualization of the entire election cycle.
-   **📚 Knowledge Hub**: A curated library of step-by-step guides for diverse voter demographics.
-   **🛡️ Production Hardened**: Implemented with **Structured Cloud Logging**, **IP-based Rate Limiting**, and strict **Security Headers**.
-   **💾 Cloud Persistence**: Securely stores chat history using **Firebase Firestore** with **Firebase Auth** (Google Sign-In).
-   **📈 Real-time Analytics**: Integrated with **Firebase Analytics** and **Performance Monitoring**.

---

## 🛠️ Tech Stack

-   **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
-   **AI Platform**: [Google Cloud Vertex AI](https://cloud.google.com/vertex-ai)
-   **Database/Auth**: [Google Firebase](https://firebase.google.com/) (Firestore, Analytics, Performance)
-   **Observability**: [Google Cloud Logging](https://cloud.google.com/logging) (Structured JSON)
-   **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
-   **Testing**: [Jest](https://jestjs.io/) & [React Testing Library](https://testing-library.com/)
-   **Infrastructure**: [Google Cloud Run](https://cloud.google.com/run) (Serverless Containerization)

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone [repository-url]
cd electo
```

### 2. Environment Setup
Create a `.env.local` file in the root directory:
```env
# Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_id
```

### 3. Install & Run
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to see the app.

---

## 🧪 Quality & Testing

This project maintains high code quality standards through automated tools:

-   **Unit Testing**: `npm test`
-   **Linting**: `npm run lint` (ESLint + TypeScript)
-   **Formatting**: `npm run format` (Prettier)

---

## ☁️ Cloud Deployment

The app is containerized using Docker and deployed to **Google Cloud Run**.

**Build & Push:**
```bash
gcloud builds submit --tag asia-south1-docker.pkg.dev/[PROJECT_ID]/electo-repo/electo-app
```

**Deploy:**
```bash
gcloud run deploy electo-app --image asia-south1-docker.pkg.dev/[PROJECT_ID]/electo-repo/electo-app --platform managed --region asia-south1
```

---

## ⚖️ Disclaimer
*ElectoAI is an educational tool. It is not an official government application. Users are always encouraged to verify critical information with their local Election Commission.*

Developed with ❤️ for Democracy.
