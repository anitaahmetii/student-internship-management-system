# student-internship-management-system
Backend API for managing student internships, applications, and company workflows using Node.js and Express.js.
## Problem Statement
Managing internship processes is often fragmented across multiple platforms and communication channels. Students usually search for internship opportunities on different websites, submit applications separately, send CVs through email, update documents manually, and communicate with HR staff using disconnected systems.

This scattered workflow creates several problems, including:

- Difficulty tracking applications
- Inefficient communication between students, HR staff, and mentors
- Lack of transparency regarding application status and internship progress
- Manual handling of updated CVs and documents
- Limited visibility into student performance during internships

Additionally, mentors and HR teams often lack a centralized system for managing enrollments, assigning tasks, monitoring student progress, and providing structured feedback throughout the internship lifecycle.

To address these issues, this project aims to provide a centralized internship management platform that combines internship publishing, application management, CV handling, enrollment, mentorship, task assignment, and progress tracking into a single organized system.

## Core Modules

- Authentication & Role-Based Access Control (RBAC)
- Internship Publishing & Management
- Internship Applications & CV Handling
- Internship Enrollment System
- Task Assignment & Management
- Student Progress Tracking
- Location Management (States & Cities)
- Real-Time Dashboard and Notifications (Socket.IO)

## ER Diagram
[ER Diagram](https://github.com/user-attachments/assets/2526f21d-f61c-48fe-a595-0a9f0bfa2a96)

## Live Demo
🔗 [Swagger API Documentation](https://student-internship-management-system-rkub.onrender.com/api-docs/)

## Tech Stack
### Backend
- Node.js
- Express.js
### Database
- MongoDB (NoSQL)
- Mongoose (ODM for MongoDB)
### Authentication & Security
- JSON Web Token (JWT) 
- bcrypt / bcryptjs 
- Role-Based Access Control (RBAC)
### Real-Time Communication
- Socket.IO
- WebSockets
### Validation
- express-validator 
### File Handling
- Multer
### API Documentation
- Swagger (swagger-jsdoc, swagger-ui-express)
### Environment Variables 
- dotenv
### Server Tooling (Development)
- Nodemon
### Architecture Style
- RESTful API

## Real-Time Dashboard and Notifications (Socket.IO)

This project implements real-time communication using Socket.IO to provide instant dashboard updates and live notifications without page refresh.

### HR Dashboard Test
1. Login as HR through `login.ejs`
2. Login as STUDENT using the Swagger login endpoint
3. Apply to an internship through the Swagger application endpoint
4. Navigate to `hrDashboard.ejs`
5. Without refreshing the page:
   - the newly applied student appears instantly on the dashboard
   - a live notification appears in the notification bar
### Student Dashboard Test
1. Login as STUDENT through `login.ejs`
2. Login as HR using the Swagger login endpoint
3. Accept or reject a student application through the Swagger endpoint
4. Navigate to `studentDashboard.ejs`
5. Without refreshing the page:
   - the internship status updates instantly
   - a live notification appears in the notification section

### Live Demo Notes
When testing the live demo, make sure to use the full deployed route URL.

Example login route:
https://student-internship-management-system-rkub.onrender.com/api/user/login

## Installation Guide
1. Clone the repository
   #### git clone https://github.com/anitaahmetii/student-internship-management-system.git
2. Navigate to the project directory
   #### cd student-internship-management-system
3. Install dependencies
   #### npm install
4. Setup environment variables
   #### Create a .env file in the root directory and add the following:
    - PORT=YOUR_PORT
    - ACCESS_TOKEN_SECRET=YOUR_ACCESS_TOKEN_SECRET
    - REFRESH_TOKEN_SECRET=YOUR_REFRESH_TOKEN_SECRET
    - DATABASE=YOUR_DATABASE_CONNECTION_STRING_OR_URL_IF_IT_IS_MONGO_ATLAS
5. Run the development server
   #### npm run dev
7. Run in product mode
   #### npm start
   
## API Documentation (Swagger)
### Swagger UI is available after running the server:
#### http://localhost:5000/api-docs
