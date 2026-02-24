# Prajwalan Event Management System

A full-stack MERN application for college event management with QR code-based attendance tracking.

## Features
- User authentication (Student, Host, Admin roles)
- Event creation and management
- Event registration
- QR code generation and scanning for attendance
- Event analytics dashboard
- Calendar view of events

## Tech Stack
- Frontend: React, React Router, Axios
- Backend: Node.js, Express, MongoDB
- Authentication: JWT
- QR Code: qrcode, html5-qrcode

## Setup Instructions

### Server Setup
1. Navigate to server directory: `cd server`
2. Install dependencies: `npm install`
3. Create `.env` file based on `.env.example`
4. Start MongoDB
5. Run server: `npm run dev`

### Client Setup
1. Navigate to client directory: `cd client`
2. Install dependencies: `npm install`
3. Start client: `npm start`

## Default Ports
- Server: http://localhost:5000
- Client: http://localhost:3000

## User Roles
- **Student**: Register for events, view events, mark attendance
- **Host**: Create and manage events
- **Admin**: View analytics, manage all events
