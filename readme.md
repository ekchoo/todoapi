To Do App

Description
This project is a Node.js server that connects to a MongoDB database and provides a REST API for task management. It also supports WebSocket connections for real-time communication. The server is built using Express, Mongoose, and the ws library, with Joi for validation.

Features
-REST API for managing tasks
-WebSocket support for real-time updates
-CORS configuration for secure cross-origin requests
-Graceful shutdown of the server

Prerequisites
-Node.js
-MongoDB instance (or MongoDB Atlas)

Installation
-Clone the repository
-npm install
-Set up environment variables. Create a .env file in the root of the project and add your MongoDB connection URI:

Usage
-node index.js
-This will start both the HTTP server and the WebSocket server.
-The HTTP server will be listening on http://localhost:3000 (or the port specified in .env).
-The WebSocket server will be listening on ws://localhost:3030 (or the port specified in .env).

API Endpoints
Task Routes
-GET /api/v1/tasks - Retrieve a list of tasks
-POST /api/v1/tasks - Create a new task
-PUT /api/v1/tasks/:id - Update a task by ID
-DELETE /api/v1/tasks/:id - Delete a task by ID

WebSocket Integration
-Connect to the WebSocket server using ws://localhost:3030 to receive real-time updates.
