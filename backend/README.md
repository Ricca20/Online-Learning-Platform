# LearnHub Backend

REST API for the LearnHub platform built with Node.js, Express, and MongoDB.

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the `backend` directory with the following variables:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key_at_least_32_chars
   JWT_EXPIRES_IN=7d
   FRONTEND_URL=http://localhost:5173
   OPENAI_API_KEY=your_openai_api_key
   ```

3. (Optional) Seed the database with sample data:
   ```bash
   npm run seed
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## API Documentation

- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/me` - Get current user (Auth required)

- `GET /api/v1/courses` - Get all courses
- `GET /api/v1/courses/:id` - Get course by ID
- `POST /api/v1/courses` - Create course (Instructor only)
- `PUT /api/v1/courses/:id` - Update course (Instructor only)
- `DELETE /api/v1/courses/:id` - Delete course (Instructor only)
- `GET /api/v1/courses/my` - Get instructor's courses (Instructor only)
- `GET /api/v1/courses/:id/enrollments` - Get course enrollments (Instructor only)

- `POST /api/v1/courses/:id/enroll` - Enroll in a course (Student only)
- `GET /api/v1/enrollments/my` - Get student's enrollments (Student only)

- `POST /api/v1/ai/recommend` - Get AI course recommendations (Student only)
