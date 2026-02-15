
# 🧠 Micro Wins AI – Smart Task Companion

A full-stack AI-powered micro-task productivity system built using:

- Azure Functions (Python)
- React + Vite
- SQLite
- Docker & Docker Compose

---

# <span align="center">
   <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=36&duration=3000&pause=500&color=6EE7B7&center=true&vCenter=true&width=600&lines=Micro-Wins" alt="Micro-Wins Gradient Animated Title"/>
</span>

---

## 🌟 Micro-Wins: Smart Productivity & Motivation System

A modern, minimal, and gamified productivity companion for neurodivergent and neurotypical users alike. Focus on small wins, positive reinforcement, and real progress—one micro-step at a time.

---

<p align="center">
   <img src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/trophy.svg" alt="Micro-Wins Logo" width="100" height="100"/>
</p>

---

## ✨ Features

- **LLM-Powered Task Breakdown:** Any user input is auto-broken into micro-steps using AI (Groq LLM).
- **Chat-Based Flow:** Step-by-step tasking in a chat-like interface.
- **Reminders & Break Timer:** Gentle, motivational reminders and break control (no pressure!).
- **Gamified Rewards:** Earn points, streaks, and motivational messages for progress.
- **Virtual Badges:** Earn and view badges for milestones and streaks (profile UI, backend logic).
- **Voice Commands:** Create tasks using speech-to-text (browser voice input).
- **Font Accessibility:** Toggle OpenDyslexic or Lexend fonts for neuro-inclusive reading (profile/preferences).
- **Real-Time Sync:** Profile, badges, and progress update instantly.
- **Minimal, Accessible UI:** Clean, distraction-free, and neurodivergent-friendly design.
- **Privacy-First:** No PII sent to LLM, all data local, user-controlled.

---

## 🚀 Tech Stack

- **Frontend:** React, Tailwind CSS
- **Backend:** Python (Azure Functions), SQLite
- **APIs:** RESTful endpoints for user, tasks, stats
- **State:** React hooks, localStorage

---

## 🖥️ Screenshots

| Home (Chat + Steps) | Task Timer | Profile (Progress) |
|:------------------:|:----------:|:------------------:|
| ![Home](https://user-images.githubusercontent.com/placeholder/micro-wins-home.png) | ![Task](https://user-images.githubusercontent.com/placeholder/micro-wins-task.png) | ![Profile](https://user-images.githubusercontent.com/placeholder/micro-wins-profile.png) |

---

## 🧠 For Whom?
- Students, professionals, neurodivergent users (ADHD, Dyslexia, Autism), or anyone who wants to break big goals into micro-wins.

---


## 🛠️ Local Setup

1. **Clone the repo:**
   ```bash
   git clone https://github.com/vivekbarnaon/micro-wins-ai.git
   cd micro-wins-ai
   ```
2. **Backend:**
   ```bash
   cd backend
   pip install -r requirements.txt
   func start
   ```
3. **Frontend:**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```
4. **Open in browser:**
   - Frontend: [http://localhost:5173](http://localhost:5173)
   - Backend: [http://localhost:7071/api](http://localhost:7071/api)

---

## 🐳 Run the Project Using Docker

This project is fully containerized.
You can run both backend and frontend using Docker Compose.

### 🔧 Prerequisites

- Docker installed
- Docker Compose installed

Verify installation:

```sh
docker --version
docker compose version
```

### 🚀 Build and Run the Application

From the project root directory (where `docker-compose.yml` exists):

```sh
docker compose up --build
```

This will:
- Build backend container (Azure Functions + SQLite)
- Build frontend container (React + Vite + Nginx)
- Start both services

### 🌐 Access the Application

After successful startup:

**Frontend**  
http://localhost:3000

**Backend Health Check**  
http://localhost:8080/api/health

Expected response:

```json
{
  "status": "ok",
  "service": "smart-companion-backend"
}
```

### 🛑 Stop the Application

Press:

`Ctrl + C`

Or run in another terminal:

```sh
docker compose down
```

### 📦 Project Architecture

- **Frontend:** React (Vite) served via Nginx
- **Backend:** Azure Functions (Python 3.10)
- **Database:** SQLite (auto-created on container startup)
- **Orchestration:** Docker Compose

### 💡 Notes

- No external database is required.
- The SQLite database is created automatically inside the container.
- The application runs fully offline once built.

---

## ⚙️ Folder Structure

```
backend/
  ├── function_app.py
  ├── user/           # User profile & stats endpoints
  ├── task/           # Task logic (steps, mark done)
  ├── database/       # SQLite schema & connection
frontend/
  ├── src/pages/      # HomeChat, Task, Profile
  ├── src/services/   # API logic
  ├── src/components/ # UI components
```

---

## 🏆 Reward & Progress System
- **Points:** Earned for each completed task (bonus for streaks, difficulty, on-time completion)
- **Streaks:** Daily progress streaks tracked and rewarded
- **Virtual Badges:** Earn badges for first task, streaks, 10 tasks, hard tasks, and more
- **Motivational Messages:** Positive feedback based on your progress

---

## 💡 Why Micro-Wins?
- Big goals can be overwhelming. Micro-wins make progress visible, rewarding, and fun.
- Designed for real humans—no pressure, just progress!
- Neuro-inclusive: Voice, font, and UI accessibility built-in.
- AI granularity: Real micro-steps, not generic todos.
- Privacy: No personal data sent to LLM.

---

## 📸 Demo GIF

![Demo Animation](https://user-images.githubusercontent.com/placeholder/micro-wins-demo.gif)

---

## 🙏 Credits
- Built by [vivekbarnaon](https://github.com/vivekbarnaon)
- UI inspiration: Notion, Linear, and the neurodivergent community

---

## 📬 Feedback & Contributions
- Issues and PRs welcome!
- DM for suggestions, collab, or feedback.

---

> **Micro-Wins: Every step counts. Celebrate your progress!**
