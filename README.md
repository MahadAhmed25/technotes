# TechNotes

A full-stack notes management application built with React and Node.js.

## Tech Stack

- **Frontend**: React, Redux Toolkit, RTK Query
- **Backend**: Node.js, Express
- **Database**: MongoDB with Mongoose
- **Auth**: JWT tokens stored in localStorage

## Getting Started

### Prerequisites

- Node.js v14+
- MongoDB running locally on port 27018

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd root/backend

Install dependencies:

npm install

Create a .env file with the following:

DATABASE_URL=mongodb://localhost/technotes
ACCESS_TOKEN_SECRET=mysecretkey123
REFRESH_TOKEN_SECRET=myrefreshkey456
PORT=3001
NODE_ENV=development

Start the server:

npm start

Frontend Setup
Navigate to the frontend directory:

cd root/frontend

Install dependencies:

npm install

Start the development server:

npm run dev

Open http://localhost:3000

API Endpoints
Method	Endpoint	Description
POST	/auth	Login
GET	/users	Get all users
POST	/users	Create user
GET	/notes	Get all notes
Security Notes
For development, you can disable CORS by setting CORS_ENABLED=false in your .env file
to avoid issues during local testing.

Default Credentials
For testing purposes, a default admin account is created on first run:

Username: admin
Password: Admin1234!
Deployment
When deploying to production, make sure to set NODE_ENV=production.
JWT tokens will expire after 7 days.
