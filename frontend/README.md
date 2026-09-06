# LearnHub Frontend

React single-page application for the LearnHub platform, built with Vite.

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the `frontend` directory with the following variables:
   ```env
   VITE_API_URL=http://localhost:5000/api/v1
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Available Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the app for production.
- `npm run preview`: Previews the production build locally.
- `npm run lint`: Runs ESLint to check for code issues.

## Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router v6
- **State Management**: React Context API
- **Styling**: Vanilla CSS (Custom Design System in `index.css`)
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
