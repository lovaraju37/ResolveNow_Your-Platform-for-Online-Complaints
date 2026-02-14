# ResolveNow: Your Platform for Online Complaints

**Category**: Full Stack Development

**Skills Required**: HTML, CSS, Javascript, Bootstrap, React.js, Node.js, MongoDB

## Overview
- Submit complaints with attachments.
- Track progress in My Complaints.
- Chat with assigned agents in real time.
- Admin assigns to agents; agents update status.
- Secure auth with JWT; real‑time via Socket.io.

## Features
- Customer: submit, track, chat, give feedback.
- Agent: view assigned items, chat, update status.
- Admin: manage users/agents, assign complaints.

## Roles 
- Customer: register/login, submit complaint, track status, chat, give feedback.
- Agent: handle assigned complaints, chat with customers, update status.
- Admin: assign complaints, manage users and agents.

## TECHNICAL ARCHITECTURE

The technical architecture of **ResolveNow** follows a client-server model. The frontend acts as the client, built with **React.js** and **Vite**, while the backend serves as the API server using **Node.js** and **Express.js**.

### Frontend
- **React.js**: For building a dynamic and responsive user interface.
- **Vite**: Modern build tool for faster development.
- **Axios**: For handling RESTful API requests to the backend.
- **Socket.io-Client**: Enables real-time communication for the built-in messaging system.
- **Material UI & Bootstrap**: Used for creating a consistent, modern, and accessible UI.

### Backend
- **Node.js & Express.js**: Handles server-side logic, routing, and middleware.
- **Socket.io**: Powers real-time updates and customer-agent chat.
- **JWT (JSON Web Tokens)**: Secure user authentication and authorization.
- **Multer**: Middleware for handling multi-part form data and file uploads (attachments).
- **Mongoose**: Provides a schema-based solution to model application data.

### Database
- **MongoDB**: NoSQL database for flexible and scalable data storage. Stores user profiles, complaint details, chat history, and feedback.

## PROJECT STRUCTURE

The project is organized into two main directories: `backend` and `frontend`, located within the `Project Files` folder.

### Backend (`Project Files/backend`)
- **config.js**: Configuration for database connection and environment variables.
- **models/**: Mongoose schemas and models (User, Complaint, Assigned, Message, Feedback).
- **routes/**: API route definitions for authentication, complaints, and real-time messaging.
- **middleware/**: Custom middleware for authentication and centralized error handling.
- **uploads/**: Storage for complaint attachments and chat images.
- **index.js**: The entry point for the Express server.

### Frontend (`Project Files/frontend`)
- **src/**:
  - **components/**: Reusable UI components for dashboards, forms, and chat.
  - **App.jsx**: The main component managing application routing.
  - **main.jsx**: The entry point for the React application.
  - **index.css**: Global styles and shared layout definitions.
- **public/**: Static assets like logos and icons.
- **vite.config.js**: Configuration for the Vite build tool.

## Quick Start
```bash
git clone https://github.com/lovaraju37/ResolveNow_Your-Platform-for-Online-Complaints.git
cd ResolveNow_Your-Platform-for-Online-Complaints

# Backend
cd "Project Files/backend" && npm install && npm start

# Frontend
cd "../frontend" && npm install && npm start
```
Backend: http://localhost:5000  
Frontend (Vite): http://localhost:5173

## GETTING STARTED

Follow these steps to run the **ResolveNow** project on your local machine:

### 1. Clone the Repository
Open your terminal and execute:
```bash
git clone https://github.com/lovaraju37/ResolveNow_Your-Platform-for-Online-Complaints.git
```

### 2. Install Dependencies
Navigate into the project directory and install dependencies for both frontend and backend:
```bash
# Navigate to the project root
cd ResolveNow_Your-Platform-for-Online-Complaints

# Install backend dependencies
cd "Project Files/backend"
npm install

# Install frontend dependencies
cd "../frontend"
npm install
```

### 3. Start the Application
You will need two terminal windows:

**Terminal 1 (Backend):**
```bash
cd "Project Files/backend"
npm start
```

**Terminal 2 (Frontend):**
```bash
cd "Project Files/frontend"
npm start
```
The application will be accessible at [http://localhost:5173](http://localhost:5173) (default Vite port).

## Environment
Create `Project Files/backend/.env`:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/resolvenow
```

## API
Base URL: http://localhost:5000  
Auth header (where required): Authorization: Bearer <token>

- Auth
  - POST /api/auth/register — create user (name, email, password, phone, userType)
  - POST /api/auth/login — returns { token, user }
  - POST /api/auth/logout — invalidate client session
  - GET  /api/auth/agents — list agents with activeAssignments

- Complaints
  - POST /api/complaints — create complaint (multipart/form-data)
    - fields: userId, name, address, city, state, pincode, comment
    - files: attachments[]; optional attachmentNames[]
  - GET  /api/complaints — list all (populates userId, assignment)
  - GET  /api/complaints/:id — get by id
  - PUT  /api/complaints/:id — update complaint
  - DELETE /api/complaints/:id — remove complaint

- Assignments
  - POST /api/assigned — assign complaint to agent (complaintId, agentId, agentName)
  - GET  /api/assigned — list all assignments
  - GET  /api/assigned/agent/:agentId — list assignments for an agent (populated)

- Messages
  - POST /api/messages — send message (multipart/form-data: attachments[])
    - body: complaintId, name, message
  - GET  /api/messages/:complaintId — fetch conversation (sorted by sentAt)
  - PUT  /api/messages/read/:complaintId — mark as read (for messages not sent by current user)
  - GET  /api/messages/unread/counts — unread counts per complaint

- Feedback
  - POST /api/feedback — create feedback (complaintId, rating, comment)
  - GET  /api/feedback/complaint/:complaintId — fetch single complaint feedback
  - GET  /api/feedback/agent/:agentId — feedbacks for an agent

- Users
  - GET  /api/users/profile — current user profile
  - PUT  /api/users/profile — update profile (name, email, phone)
  - GET  /api/users — list users (admin only)

- Static uploads
  - GET  /uploads/<filename> — serves uploaded files

## How It Works
- Customer submits a complaint → Admin assigns to an agent → Agent updates status → Customer chats and gives feedback.

## Screenshots
Replace placeholders with your images (recommended: `screenshots/` at repo root or `Project Files/frontend/public/screenshots/`).

- Landing Page  
    ![Landing](https://github.com/user-attachments/assets/7939aa36-4f5c-4138-9728-d04b3b7f714d)
  
- Registration  
    ![Registration](https://github.com/user-attachments/assets/b240a6b1-e909-4cfb-8b6a-ab2cf0291d20)
  
- Login  
    ![Login](https://github.com/user-attachments/assets/ad5dbbb6-926f-4f9a-a8fc-f699ec3c34d9)
  
- Submit Complaint  
   <img width="1902" height="866" alt="image" src="https://github.com/user-attachments/assets/1fa71ba7-e835-4053-83c0-ebbc8d2f26b1" />
 
- My Complaints  
   <img width="1915" height="845" alt="image" src="https://github.com/user-attachments/assets/d2a3527e-1aa4-4001-ae6f-838592e2f7c2" />

- Chat With Agent  
    <img width="1919" height="826" alt="image" src="https://github.com/user-attachments/assets/3f1b2d38-c1be-4ef7-bf7f-2bcfdd3d333e" />
  
- Admin Dashboard  
    ![Admin Dashboard](https://github.com/user-attachments/assets/b5edb65e-5f30-4089-8905-b76fa8f883f3)
  
- Agent Dashboard  
    ![Agent Dashboard](https://github.com/user-attachments/assets/b9d45c5c-64f3-4931-af1e-3e28008ad5e7)

