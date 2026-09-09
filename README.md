# LearnHub - Online Learning Platform

A comprehensive, production-ready Online Learning Platform built with the MERN stack (MongoDB, Express, React, Node.js) and integrated with OpenAI's GPT-3 API for intelligent, personalized course recommendations.

## 🚀 Features & Requirements Fulfilled

1. **JWT-based Authentication**: Secure login and access token verification using JSON Web Tokens.
2. **RESTful APIs**: Comprehensive API for user registration, login, and authentication.
3. **Course CRUD**: Instructors can Create, Read, Update, and Delete courses via dedicated APIs and UI.
4. **Course Schema**: MongoDB schema includes `title`, `description`, `instructor` (ref: User), and `content`.
5. **Key Pages**: Clean, responsive pages for Registration, Login, and Course Listing.
6. **Enrollment System**: Students can view the course catalog and enroll in courses seamlessly.
7. **Enrollment Status**: Track and display whether a student is "active" or "completed".
8. **Success Messages**: Toast notifications for successful enrollments and other actions.
9. **My Learning Page**: Dedicated page for students to view their enrolled courses.
10. **Role-Based Access Control (RBAC)**: Distinct permissions for `student` and `instructor` roles.
11. **Route Protection**: Private routes on both the backend (Express Middleware) and frontend (React Router).
12. **GPT-3 Integration**: Uses OpenAI's GPT-3 API to provide personalized course recommendations based on student learning goals.
13. **AI Chatbot Advisor**: Floating interactive widget where students can ask prompts like *"I want to be a software engineer, what courses should I follow"* and receive a curated list of recommendations.

### 🛑 API Request Limit Compliance
To strictly adhere to the limit of 250 API requests:
- **No loops:** The GPT-3 API is *never* called inside loops. It is triggered by a single, deliberate user submission via the AI Advisor widget.
- **Tracking:** The platform limits recommendations per user session to avoid runaway usage. OpenAI dashboard logs will reflect optimal and minimal consumption (currently ~0-1 requests per session, comfortably below 250).

---

## 🏗 Architecture

The project is structured as a Monorepo containing two distinct applications:

- **Frontend (`/frontend`)**: React 18, Vite, React Router v6, Axios, custom Teal/Light design system.
- **Backend (`/backend`)**: Node.js, Express.js, MongoDB (Mongoose), OpenAI SDK, JWT authentication.

---

## 🔗 API Endpoints

### Authentication (`/api/v1/auth`)
- `POST /register`: Register a new user (Student or Instructor).
- `POST /login`: Authenticate and receive a JWT.
- `GET /me`: Get current user profile.

### Courses (`/api/v1/courses`)
- `GET /`: List all published courses.
- `GET /:id`: Get specific course details.
- `POST /`: Create a new course (Instructor only).
- `PUT /:id`: Update course details (Instructor only).
- `DELETE /:id`: Remove a course (Instructor only).
- `GET /my`: Get courses created by the instructor (Instructor only).

### Enrollments (`/api/v1/enrollments`)
- `POST /courses/:id/enroll`: Enroll in a course (Student only).
- `GET /my`: Get all enrolled courses for the current student (Student only).
- `GET /courses/:id/enrollments`: View all students enrolled in a specific course (Instructor only).

### AI Recommendations (`/api/v1/ai`)
- `POST /recommend`: Send a prompt to GPT-3 and receive course recommendations (Student only).

---

## 🛠 Local Setup & Development

### Prerequisites
- Node.js (v18+)
- MongoDB connection string (Atlas or Local)
- OpenAI API Key

### 1. Clone & Install Dependencies
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Environment Variables
Create a `.env` file in the `backend` directory:
```env
PORT=5001
NODE_ENV=development
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/learnhub
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d
OPENAI_API_KEY=your_openai_api_key_here
FRONTEND_URL=http://localhost:5173
```

Create a `.env` file in the `frontend` directory:
```env
VITE_API_URL=http://localhost:5001/api/v1
```

### 3. Run the Application
You can run both servers concurrently or in separate terminal windows:

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```
The application will be available at `http://localhost:5173`.

---

## 🚀 Deployment Instructions

### Backend (Render / Heroku)
1. Add environment variables (`MONGO_URI`, `JWT_SECRET`, `OPENAI_API_KEY`, `FRONTEND_URL`) in your hosting provider's dashboard.
2. Set the build command to `npm install` and the start command to `node server.js`.
3. Ensure CORS is configured to accept requests from your deployed frontend domain.

### Frontend (Vercel / Netlify)
1. Set the root directory to `frontend`.
2. Add the environment variable `VITE_API_URL` pointing to your deployed backend URL.
3. The build command is automatically detected as `npm run build` and output directory as `dist`.
