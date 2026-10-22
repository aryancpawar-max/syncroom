
import "dotenv/config";
import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import { createClient } from "@supabase/supabase-js";

const app = express();
const httpServer = createServer(app);

const PORT = process.env.PORT || 5000;
const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_URL,
].filter(Boolean);

const isAllowedOrigin = (origin) =>
  !origin || allowedOrigins.includes(origin);

app.use(
  cors({
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

app.use(express.json());

app.get("/", (_req, res) => {
  res.send("SyncRoom server is running!");
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Supabase backend connection
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variable."
  );
}

const supabase = createClient(supabaseUrl, supabaseKey);

const io = new Server(httpServer, {
  cors: {
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST"],
  },
});

const rooms = new Map();

function createRoom(roomId, details = {}) {
  return {
    id: roomId,
    name: details.roomName || details.name || roomId,
    host: details.host || "Music Lover",
    hostId: details.hostId || details.host_id || "local-user",
    description: details.description || "",
    privacy: details.privacy || "public",
    maxListeners: details.maxListeners || details.max_listeners || 10,
    listeners: [],
    queue: Array.isArray(details.queue) ? details.queue : [],
    playback: details.playback || {
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

// Save persistent room data; live listeners are not stored.
async function saveRoom(room) {
    console.log("Saving room to Supabase:", room.id);
  const { error } = await supabase
    .from("syncroom_rooms")
    .upsert(
      {
        id: room.id,
        name: room.name,
        host: room.host,
        host_id: room.hostId,
        description: room.description,
        privacy: room.privacy,
        max_listeners: room.maxListeners,
        queue: room.queue,
        playback: room.playback,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    );

  if (error) {
    console.error("Failed to save room:", room.id, error.message);
    throw error;
  }
}

// Restore rooms after a server restart.
async function loadRooms() {
  const { data, error } = await supabase
    .from("syncroom_rooms")
    .select("*");

  if (error) {
    throw new Error(`Failed to load rooms: ${error.message}`);
  }

  for (const savedRoom of data || []) {
    const room = createRoom(savedRoom.id, savedRoom);
    rooms.set(room.id, room);
  }

  console.log(`Restored ${rooms.size} rooms from Supabase.`);
}

const roomsReady = loadRooms();

// Send room state to everyone in the room.
function broadcastRoomState(room) {
  io.to(room.id).emit("room:state", getPublicRoomState(room));
}

// Fetch a room, including rooms restored from Supabase.
app.get("/api/rooms/:roomId", async (req, res) => {
  try {
    await roomsReady;

    const room = rooms.get(req.params.roomId);

    if (!room) {
      return res.status(404).json({ error: "Room not found." });
    }

    return res.json(getPublicRoomState(room));
  } catch (error) {
    console.error("Get room failed:", error.message);
    return res.status(500).json({ error: "Failed to load room." });
  }
});

// Create and persist a room.
app.post("/api/rooms", async (req, res) => {
  try {
    await roomsReady;

    const { roomId, ...details } = req.body || {};

    if (!roomId) {
      return res.status(400).json({ error: "Room ID is required." });
    }

    if (rooms.has(roomId)) {
      return res.status(409).json({ error: "Room already exists." });
    }

    const room = createRoom(roomId, details);

    await saveRoom(room);
    rooms.set(roomId, room);

    return res.status(201).json(getPublicRoomState(room));
  } catch (error) {
    console.error("Create room failed:", error.message);
    return res.status(500).json({ error: "Failed to create room." });
  }
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("room:create", async (payload = {}) => {
    console.log("ROOM CREATE EVENT RECEIVED:", payload);
    try {
      await roomsReady;

      const roomId = payload.roomId;

      if (!roomId) {
        socket.emit("room:error", "Room ID is required.");
        return;
      }

      let room = rooms.get(roomId);

      if (!room) {
        room = createRoom(roomId, payload);
        await saveRoom(room);
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
    } catch (error) {
      console.error("Room creation failed:", error.message);
      socket.emit("room:error", "Failed to create room. Please try again.");
    }
  });

  socket.on("room:join", async (payload = {}) => {
    try {
      await roomsReady;

      const { roomId, user = {} } = payload;
      const room = rooms.get(roomId);

      if (!room) {
        socket.emit("room:error", "Room not found.");
        return;
      }

      const userId = user.id || "local-user";

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
    } catch (error) {
      console.error("Room join failed:", error.message);
      socket.emit("room:error", "Failed to join room. Please try again.");
    }
  });

  socket.on("playback:update", async (payload = {}) => {
    try {
      await roomsReady;

      const room = rooms.get(payload.roomId);
      if (!room) return;

      const { roomId: _roomId, ...playbackUpdate } = payload;

      room.playback = {
        ...room.playback,
        ...playbackUpdate,
        updatedAt: Date.now(),
      };

      // Keep existing real-time playback synchronization.
      socket.to(room.id).emit("playback:updated", room.playback);

      await saveRoom(room);
    } catch (error) {
      console.error("Playback persistence failed:", error.message);
    }
  });

  socket.on("queue:update", async (payload = {}) => {
    try {
      await roomsReady;

      const room = rooms.get(payload.roomId);
      if (!room || !Array.isArray(payload.queue)) return;

      room.queue = payload.queue.map((track) => ({
        id: track.id,
        title: track.title || "Untitled",
        artist: track.artist || "Unknown artist",
        duration: track.duration || 0,
        ...(track.storagePath
          ? { storagePath: track.storagePath }
          : {}),
        ...(!track.storagePath && track.audioUrl
          ? { audioUrl: track.audioUrl }
          : {}),
      }));

      io.to(room.id).emit("queue:updated", room.queue);

      await saveRoom(room);
    } catch (error) {
      console.error("Queue persistence failed:", error.message);
    }
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

async function startServer() {
  try {
    await roomsReady;

    httpServer.listen(PORT, () => {
      console.log(`SyncRoom server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
}

startServer();
