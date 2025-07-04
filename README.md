# Collaborative WhiteBoard

A real-time collaborative whiteboard application built with React, Node.js, Socket.io, and MongoDB. Users can create or join rooms to draw together in real-time with live cursor tracking.

## Features

- 🎨 Real-time collaborative drawing
- 👥 Live cursor tracking for all users
- 🏠 Room-based collaboration (6-8 character room IDs)
- 💾 Automatic drawing persistence
- 🧹 Canvas clearing functionality
- 👤 User count tracking
- ⏰ Automatic room cleanup (24-hour inactivity)

## Tech Stack

### Frontend
- **React 18** - UI framework
- **Socket.io Client** - Real-time communication
- **Styled Components** - CSS-in-JS styling
- **React Router** - Client-side routing

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Socket.io** - Real-time bidirectional communication
- **MongoDB** - Database
- **Mongoose** - MongoDB ODM

## Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** (comes with Node.js)
- **MongoDB** (local installation or MongoDB Atlas account)

## Quick Start

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <repository-url>
cd WhiteBoard

# Install all dependencies (root, client, and server)
npm run install-all
```

### 2. Environment Setup

Create a `.env` file in the `server` directory:

```bash
cd server
cp .env.example .env
```

Edit the `.env` file with your MongoDB connection string:

```env
DB_URI=mongodb://localhost:27017/whiteboard
PORT=5000
```

For MongoDB Atlas, use:
```env
DB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/whiteboard
```

### 3. Start the Application

#### Development Mode (Recommended)
```bash
# From the root directory
npm run dev
```

This will start both the server (port 5000) and client (port 3000) concurrently.

#### Production Mode
```bash
# Build the client
npm run client build

# Start the server
npm run server
```

### 4. Access the Application

Open your browser and navigate to:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## Usage

1. **Create/Join a Room**: Enter a 6-8 character room ID
2. **Start Drawing**: Use your mouse or touch to draw on the canvas
3. **Collaborate**: See other users' cursors and drawings in real-time
4. **Clear Canvas**: Use the clear button to reset the drawing
5. **Leave Room**: Close the browser tab or navigate away

## Project Structure

```
WhiteBoard/
├── client/                 # React frontend
│   ├── public/            # Static files
│   ├── src/               # React source code
│   └── package.json       # Frontend dependencies
├── server/                # Node.js backend
│   ├── models/            # MongoDB schemas
│   ├── routes/            # REST API endpoints
│   ├── socket/            # Socket.io event handlers
│   ├── server.js          # Main server file
│   └── package.json       # Backend dependencies
├── package.json           # Root package.json with scripts
└── README.md             # This file
```

## Available Scripts

### Root Directory
- `npm run install-all` - Install dependencies for all packages
- `npm run dev` - Start both client and server in development mode
- `npm run server` - Start only the server
- `npm run client` - Start only the client

### Server Directory
- `npm start` - Start server in production mode
- `npm run dev` - Start server with nodemon (development)

### Client Directory
- `npm start` - Start React development server
- `npm run build` - Build for production

## Troubleshooting

### Common Issues

1. **Port Already in Use**
   - Change the port in the `.env` file or kill the process using the port

2. **MongoDB Connection Error**
   - Ensure MongoDB is running locally or your Atlas connection string is correct
   - Check network connectivity for Atlas connections

3. **Socket Connection Issues**
   - Verify the server is running on the correct port
   - Check CORS settings in `server.js`

4. **Dependencies Issues**
   - Delete `node_modules` folders and run `npm run install-all` again

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the GitHub repository or contact the development team. 