# API Documentation

This document provides comprehensive API documentation for the Collaborative WhiteBoard application, including both REST endpoints and Socket.io events.

## Base URLs

- **Development**: `http://localhost:5000`
- **Production**: `https://your-domain.com`

## REST API Endpoints

### Rooms

#### POST `/api/rooms/join`
Join or create a room with the specified room ID.

**Request Body:**
```json
{
  "roomId": "string" // 6-8 characters
}
```

**Response:**
```json
{
  "roomId": "string",
  "drawingData": [
    {
      "type": "stroke",
      "data": {
        "points": [...],
        "color": "#000000",
        "width": 2
      },
      "timestamp": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

**Status Codes:**
- `200` - Room joined successfully
- `400` - Invalid room ID format
- `500` - Server error

#### GET `/api/rooms/:roomId`
Get existing drawing data for a specific room.

**Parameters:**
- `roomId` (string) - 6-8 character room identifier

**Response:**
```json
{
  "roomId": "string",
  "drawingData": [...],
  "lastActivity": "2024-01-01T00:00:00.000Z",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Status Codes:**
- `200` - Room data retrieved successfully
- `404` - Room not found
- `500` - Server error

## Socket.io Events

### Connection
Socket.io automatically handles WebSocket connections. All events require an active connection.

### Client to Server Events

#### `join-room`
Join a specific room to start collaborating.

**Payload:**
```json
{
  "roomId": "string" // 6-8 character room ID
}
```

**Server Response:**
- Emits `load-drawing` with existing drawing data
- Emits `user-count-update` to all room members

#### `cursor-move`
Broadcast cursor position to other users in the room.

**Payload:**
```json
{
  "roomId": "string",
  "x": "number", // Cursor X coordinate
  "y": "number"  // Cursor Y coordinate
}
```

**Throttling:** This event is throttled to ~60fps for performance.

#### `draw-start`
Start a new drawing stroke.

**Payload:**
```json
{
  "roomId": "string",
  "x": "number",
  "y": "number",
  "color": "string", // Hex color code
  "width": "number"  // Stroke width
}
```

#### `draw-move`
Continue drawing stroke (mouse/touch move).

**Payload:**
```json
{
  "roomId": "string",
  "x": "number",
  "y": "number"
}
```

#### `draw-end`
Complete a drawing stroke.

**Payload:**
```json
{
  "roomId": "string",
  "points": [
    {"x": "number", "y": "number"},
    {"x": "number", "y": "number"}
  ],
  "color": "string",
  "width": "number"
}
```

**Server Action:** Persists the completed stroke to MongoDB.

#### `clear-canvas`
Clear the entire canvas for all users in the room.

**Payload:**
```json
{
  "roomId": "string"
}
```

**Server Action:** Clears drawing data from MongoDB.

#### `leave-room`
Leave a specific room.

**Payload:**
```json
{
  "roomId": "string"
}
```

#### `cursor-inactive`
Indicate that the user's cursor is no longer active.

**Payload:**
```json
{
  "roomId": "string"
}
```

### Server to Client Events

#### `load-drawing`
Sent when a user joins a room to load existing drawing data.

**Payload:**
```json
[
  {
    "type": "stroke",
    "data": {
      "points": [...],
      "color": "#000000",
      "width": 2
    },
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
]
```

#### `user-count-update`
Broadcast updated user count when users join/leave.

**Payload:**
```json
{
  "count": "number" // Number of users in the room
}
```

#### `cursor-move`
Receive cursor movement from other users.

**Payload:**
```json
{
  "id": "string", // Socket ID of the user
  "x": "number",
  "y": "number"
}
```

#### `draw-start`
Receive drawing start event from other users.

**Payload:**
```json
{
  "id": "string",
  "x": "number",
  "y": "number",
  "color": "string",
  "width": "number"
}
```

#### `draw-move`
Receive drawing movement from other users.

**Payload:**
```json
{
  "id": "string",
  "x": "number",
  "y": "number"
}
```

#### `draw-end`
Receive completed drawing stroke from other users.

**Payload:**
```json
{
  "id": "string",
  "points": [...],
  "color": "string",
  "width": "number"
}
```

#### `clear-canvas`
Receive canvas clear event from any user.

**Payload:** None

#### `user-left`
Receive notification when a user leaves the room.

**Payload:**
```json
{
  "id": "string" // Socket ID of the user who left
}
```

#### `cursor-inactive`
Receive cursor inactivity notification from other users.

**Payload:**
```json
{
  "id": "string" // Socket ID of the inactive user
}
```

## Error Handling

### Socket.io Error Events

The server may emit error events in case of issues:

```javascript
socket.on('error', (error) => {
  console.error('Socket error:', error);
});
```

### Connection States

Monitor connection state for better user experience:

```javascript
socket.on('connect', () => {
  console.log('Connected to server');
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});

socket.on('reconnect', () => {
  console.log('Reconnected to server');
});
```

## Rate Limiting

- **Cursor events**: Throttled to ~60fps for performance
- **Drawing events**: No rate limiting (real-time drawing)
- **Room operations**: No rate limiting (infrequent operations)

## Security Considerations

- Room IDs are 6-8 characters (alphanumeric)
- No authentication required (public collaboration)
- CORS enabled for localhost:3000 in development
- Input validation on room ID format

## Example Usage

### JavaScript Client Example

```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

// Join a room
socket.emit('join-room', { roomId: 'ABC123' });

// Listen for drawing data
socket.on('load-drawing', (drawingData) => {
  console.log('Loaded drawing:', drawingData);
});

// Start drawing
socket.emit('draw-start', {
  roomId: 'ABC123',
  x: 100,
  y: 100,
  color: '#FF0000',
  width: 2
});

// Continue drawing
socket.emit('draw-move', {
  roomId: 'ABC123',
  x: 110,
  y: 110
});

// End drawing
socket.emit('draw-end', {
  roomId: 'ABC123',
  points: [{x: 100, y: 100}, {x: 110, y: 110}],
  color: '#FF0000',
  width: 2
});
```

### cURL Example

```bash
# Join a room
curl -X POST http://localhost:5000/api/rooms/join \
  -H "Content-Type: application/json" \
  -d '{"roomId": "ABC123"}'

# Get room data
curl http://localhost:5000/api/rooms/ABC123
``` 