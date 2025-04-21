
# 📄 AI Resume Builder & ATS Checker

An AI-powered web application that helps users build professional resumes and evaluate them for ATS (Applicant Tracking System) compatibility. With an intuitive UI and powerful backend intelligence, users can either create a new resume from scratch or upload an existing one to check their ATS score.

🚀 Built with:
- Frontend: Next.js (TypeScript + Tailwind CSS)
- Backend API: Python FastAPI (running on port 8000)
- AI Model: Custom-trained model for resume analysis and optimization

---

## 🌟 Features

✅ Build a beautiful, professional resume using a guided interface  
✅ Upload and analyze resumes (PDF) for ATS score and keyword relevance  
✅ AI-generated feedback and suggestions to improve your resume  
✅ Real-time preview and downloadable resume  
✅ Dark/light mode support (optional based on UI)

---

## 🧠 AI Capabilities

- Extracts key resume sections (Experience, Skills, Education, etc.)
- Matches resume content with job descriptions
- Scores resumes based on ATS compatibility
- Provides tailored improvement suggestions (e.g. missing keywords, formatting issues)

---

## 🛠️ Tech Stack

| Layer        | Technology         |
|--------------|-------------------|
| Frontend     | Next.js, TypeScript, Tailwind CSS |
| Backend API  | FastAPI (Python)   |
| AI Engine    | Python NLP/ML Models (served via FastAPI) |
| Server Port  | http://localhost:8000 |

---

## 📦 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/ai-resume-builder.git
cd ai-resume-builder
```

### 2. Start the Frontend (Next.js)

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

Frontend runs at: http://localhost:3000

### 3. Start the Backend (FastAPI)

```bash
cd backend  # Assuming your FastAPI server is in /backend
pip install -r requirements.txt

# Run FastAPI server
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

API runs at: http://localhost:8000

---

## 🧪 Example API Request

POST http://localhost:8000/analyze

Payload:

```json
{
  "resume_text": "Experienced web developer with a background in..."
}
```

Response:

```json
{
  "ats_score": 82,
  "missing_keywords": ["TypeScript", "REST APIs"],
  "feedback": "Add more quantifiable achievements in your work experience."
}
```

---

## 📁 Project Structure

```
ai-resume-builder/
│
├── frontend/         # Next.js frontend
├── backend/          # FastAPI backend
│   └── model/        # AI/ML resume scoring logic
│
└── README.md
```

---

## 🔐 Authentication (Optional)

You can integrate Supabase or Auth.js for secure user authentication and saved resumes.

---

## 📌 Future Enhancements

- 🔍 Job description integration for contextual ATS scoring  
- 📤 One-click LinkedIn resume import  
- 💾 Resume templates/themes  
- 🧑‍💼 Role-specific suggestions (e.g., for Developers, Designers, PMs)

---
