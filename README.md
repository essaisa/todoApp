# Task Tracker App

A full-stack task tracker application that allows users to create, update, and manage tasks with priority levels and due dates. Built with React, Flask, and MongoDB.

---

## Features

- User authentication (Signup & Login)
- Create, edit, complete, and delete tasks
- Due dates & upcoming task filtering
- Priority levels (High, Medium, Low)
- Clean UI with responsive design
- JWT-based token authentication

---

## Tech Stack

### Frontend
- React
- Tailwind CSS
- Axios (for HTTP requests)

### Backend
- Flask (Python)
- Flask-JWT-Extended (for auth)
- MongoDB (via PyMongo)
- CORS and dotenv

---

## Setup Instructions

### 1. Clone the Repository

git clone git@github.com:essaisa/todoApp.git
cd todoApp

### 2. Backend setup (Flask + MongoDB)
1. Install Dependencies
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

2. Create .env file
JWT_SECRET=your_jwt_secret_key
MONGO_URI=mongodb://

3. Run backend
python3 app.py

### 3. Frontend Setup (React)
cd frontend
npm install
npm start