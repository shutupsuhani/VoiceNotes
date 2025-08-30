# Voice Notes App with AI Features

A full-stack voice notes application built with **React**, **TypeScript**, **Node.js**, **Express**, and **MongoDB**.  
Users can record voice notes, automatically convert them to text using **AssemblyAI**, and generate summaries using **Gemini AI**.  

The app supports **JWT authentication** and **cookie-based sessions** with proper CORS handling.

---

## Deployed Link:https://voice-notes-bysuhani.vercel.app/

---

## Deployed Links

- **Frontend:** [Voice Notes App](https://voice-notes-bysuhani.vercel.app/)  
- **Backend:** [API Backend](https://voice-notes-backend.vercel.app/)


---
## Features

- User Authentication (Signup/Login/Logout) with JWT & cookies
- Record voice notes directly in the browser
- Audio visualization while recording
- Automatic speech-to-text conversion using **AssemblyAI**
- Text summarization using **Gemini AI**
- Upload and save voice notes + transcripts
- Fetch and display saved notes and summaries
- Responsive UI with clean design
- Secure backend with CORS configured for credentials

---

## Tech Stack

**Frontend:**
- React + TypeScript
- Axios for API requests
- Tailwind CSS for styling
- Lucide-react icons

**Backend:**
- Node.js + Express
- MongoDB (via Mongoose)
- JWT Authentication
- Integration with:
  - **AssemblyAI** for speech-to-text
  - **Gemini AI** for text summarization
- CORS with credentials support

---

## Setup Instructions

### Backend

1. Clone the repo and navigate to `backend` folder:

```bash
cd backend
npm install
Create a .env file with your secrets:


MONGO_URL=your_mongodb_connection_string
KEY=your_jwt_secret
ASSEMBLYAI_API_KEY=your_assemblyai_api_key
GEMINI_API_KEY=your_gemini_api_key
PORT=5000

Start the backend:
npm start

Backend Deployed  at https://voice-notes-backend.vercel.app


Frontend

Navigate to l1 folder:

cd l1
npm install


Start the frontend:

npm run dev


Frontend runs on http://localhost:5173 by default.
