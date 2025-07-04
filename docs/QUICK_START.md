# Quick Start Guide

Get the Collaborative WhiteBoard application running in under 5 minutes!

## Prerequisites

- Node.js (v16 or higher)
- npm
- MongoDB (local or cloud)

## 1. Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd WhiteBoard

# Install all dependencies
npm run install-all
```

## 2. Set Up Environment

```bash
# Copy environment example
cp server/env.example server/.env

# Edit the .env file with your MongoDB connection
# For local MongoDB: mongodb://localhost:27017/whiteboard
# For MongoDB Atlas: mongodb+srv://<username>:<password>@<cluster>.mongodb.net/whiteboard
```

## 3. Start the Application

```bash
# Start both client and server in development mode
npm run dev
```

## 4. Open Your Browser

Navigate to: **http://localhost:3000**

## 5. Start Collaborating!

1. Enter a room ID (6-8 characters)
2. Start drawing
3. Share the room ID with others
4. Collaborate in real-time!

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000 or 5000
npx kill-port 3000 5000
```

### MongoDB Connection Error
- Ensure MongoDB is running locally
- Check your connection string in `.env`
- For Atlas: verify network access and credentials

### Dependencies Issues
```bash
# Clean install
rm -rf node_modules client/node_modules server/node_modules
npm run install-all
```

## Next Steps

- Read the [API Documentation](API.md)
- Check the [Architecture Overview](ARCHITECTURE.md)
- Review the [Deployment Guide](DEPLOYMENT.md)

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both client and server |
| `npm run server` | Start only the server |
| `npm run client` | Start only the client |
| `npm run install-all` | Install all dependencies |

That's it! Your collaborative whiteboard is ready to use. 🎨 