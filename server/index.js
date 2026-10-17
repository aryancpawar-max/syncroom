
import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);

const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

app.use(cors({ origin: CLIENT_URL }));
app.use(express.json());

app.get("/", (_req, res) => {
  res.send("SyncRoom server is running!");
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

const io = new Server(httpServer, {
  cors: {
    origin: CLIENT_URL,
    methods: ["GET", "POST"],
  },
});

const rooms = new Map();

function createRoom(roomId, details = {}) {
  return {
    id: roomId,
    name: details.roomName || details.name || roomId,
    host: details.host || "Music Lover",
    hostId: details.hostId || "local-user",
    description: details.description || "",
    privacy: details.privacy || "public",
    maxListeners: details.maxListeners || 10,
    listeners: [],
    queue: [],
    playback: {
      trackId: null,
      currentTime: 0,
      isPlaying: false,
      updatedAt: Date.now(),
    },
  };
}

function getPublicRoomState(room) {
  return {
    room: {
      id: room.id,
      name: room.name,
      host: room.host,
      hostId: room.hostId,
      description: room.description,
      privacy: room.privacy,
      maxListeners: room.maxListeners,
    },
    listeners: room.listeners,
    queue: room.queue,
    playback: room.playback,
  };
}

function broadcastRoomState(room) {
  io.to(room.id).emit("room:state", getPublicRoomState(room));
}

app.get("/api/rooms/:roomId", (req, res) => {
  const room = rooms.get(req.params.roomId);

  if (!room) {
    return res.status(404).json({ error: "Room not found." });
  }

  return res.json(getPublicRoomState(room));
});

app.post("/api/rooms", (req, res) => {
  const { roomId, ...details } = req.body || {};

  if (!roomId) {
    return res.status(400).json({ error: "Room ID is required." });
  }

  if (rooms.has(roomId)) {
    return res.status(409).json({ error: "Room already exists." });
  }

  const room = createRoom(roomId, details);
  rooms.set(roomId, room);

  return res.status(201).json(getPublicRoomState(room));
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("room:create", (payload = {}) => {
    const roomId = payload.roomId;

    if (!roomId) {
      socket.emit("room:error", "Room ID is required.");
      return;
    }

    let room = rooms.get(roomId);

    if (!room) {
      room = createRoom(roomId, payload);
      rooms.set(roomId, room);
    }

    socket.join(roomId);

    room.listeners = room.listeners.filter(
      (listener) => listener.socketId !== socket.id
    );

    room.listeners.push({
      id: payload.hostId || "local-user",
      name: payload.host || "Music Lover",
      socketId: socket.id,
    });

    socket.emit("room:created", getPublicRoomState(room));
    broadcastRoomState(room);
    io.to(roomId).emit("room:users", room.listeners);
  });

  socket.on("room:join", (payload = {}) => {
    const { roomId, user = {} } = payload;
    const room = rooms.get(roomId);

    if (!room) {
      socket.emit("room:error", "Room not found.");
      return;
    }

    const userId = user.id || "local-user";

    // Avoid duplicate entries for the same socket.
    room.listeners = room.listeners.filter(
      (listener) => listener.socketId !== socket.id
    );

    if (room.listeners.length >= room.maxListeners) {
      socket.emit("room:error", "This room has reached its listener limit.");
      return;
    }

    socket.join(roomId);

    room.listeners.push({
      id: userId,
      name: user.name || "Music Lover",
      socketId: socket.id,
    });

    socket.emit("room:state", getPublicRoomState(room));
    io.to(roomId).emit("room:users", room.listeners);
  });

    socket.on("playback:update", (payload = {}) => {
  const room = rooms.get(payload.roomId);
  if (!room) return;

  const { roomId: _roomId, ...playbackUpdate } = payload;

  room.playback = {
    ...room.playback,
    ...playbackUpdate,
    updatedAt: Date.now(),
  };

  socket.to(room.id).emit("playback:updated", room.playback);
});

  socket.on("queue:update", (payload = {}) => {
  const room = rooms.get(payload.roomId);
  if (!room || !Array.isArray(payload.queue)) return;

  room.queue = payload.queue.map((track) => ({
    id: track.id,
    title: track.title || "Untitled",
    artist: track.artist || "Unknown artist",
    duration: track.duration || 0,
    ...(track.storagePath ? { storagePath: track.storagePath } : {}),
    ...(!track.storagePath && track.audioUrl
      ? { audioUrl: track.audioUrl }
      : {}),
  }));

  io.to(room.id).emit("queue:updated", room.queue);
});
  socket.on("room:leave", ({ roomId } = {}) => {
  if (!roomId) return;

  socket.leave(roomId);

  const room = rooms.get(roomId);
  if (!room) return;

  room.listeners = room.listeners.filter(
    (listener) => listener.socketId !== socket.id
  );

  io.to(roomId).emit("room:users", room.listeners);
});
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);

    for (const room of rooms.values()) {
      const previousCount = room.listeners.length;

      room.listeners = room.listeners.filter(
        (listener) => listener.socketId !== socket.id
      );

      if (room.listeners.length !== previousCount) {
        io.to(room.id).emit("room:users", room.listeners);
      }
    }
  });
});

httpServer.listen(PORT, () => {
  console.log(`SyncRoom server running on http://localhost:${PORT}`);
});
