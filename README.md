# LearnHub - Online Learning Platform

A production-quality Online Learning Platform built with the MERN stack (MongoDB, Express, React, Node.js) and integrated with OpenAI's ChatGPT for smart course recommendations.

## Features

- **Role-Based Access Control**: Separate flows for Students and Instructors.
- **Instructors**: Create, edit, delete courses, and view student enrollments.
- **Students**: Browse courses, enroll, track progress, and get AI-powered course recommendations.
- **AI Recommender**: Integrated with OpenAI GPT-3.5-turbo to provide personalized learning paths.
- **Security**: JWT-based authentication, rate limiting, Helmet for HTTP headers, and Express Validator for input sanitization.
- **Modern UI**: Dark-themed, responsive design built with Vanilla CSS and Lucide React icons.

## Project Structure

This is a monorepo containing both the frontend and backend applications:

- `/backend`: Node.js/Express REST API
- `/frontend`: React (Vite) Single Page Application

## Getting Started

1. Clone the repository.
2. Follow the instructions in `backend/README.md` to set up the API.
3. Follow the instructions in `frontend/README.md` to run the client.

## Technologies Used

- **Database**: MongoDB & Mongoose
- **Backend**: Node.js, Express.js
- **Frontend**: React 18, Vite, React Router v6
- **Styling**: Vanilla CSS (Custom Design System)
- **AI Integration**: OpenAI SDK
- **Authentication**: JSON Web Tokens (JWT)
- **State Management**: React Context API
