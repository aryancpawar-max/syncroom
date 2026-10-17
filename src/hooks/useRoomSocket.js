
import { useCallback, useEffect, useState } from "react";
import socket from "../lib/socket";

function useRoomSocket(roomId, user) {
  const [connected, setConnected] = useState(socket.connected);
  const [listeners, setListeners] = useState([]);
  const [roomState, setRoomState] = useState(null);
  const [socketError, setSocketError] = useState("");

  const userId = user?.id || "local-user";
  const userName = user?.name || "Music Lover";

  useEffect(() => {
    if (!roomId) return undefined;

    let active = true;

    const joinRoom = () => {
      if (!active) return;

      setConnected(true);
      setSocketError("");

      socket.emit("room:join", {
        roomId,
        user: { id: userId, name: userName },
      });
    };

    const handleConnect = () => joinRoom();

    const handleDisconnect = () => {
      if (active) setConnected(false);
    };

    const handleConnectError = (error) => {
      if (!active) return;
      setConnected(false);
      setSocketError(error?.message || "Unable to connect to the server.");
    };

    const handleRoomState = (state) => {
      if (!active || !state) return;

      setRoomState((previous) => ({
        ...(previous || {}),
        ...state,
        room: state.room || previous?.room || null,
        queue: Array.isArray(state.queue)
          ? state.queue
          : previous?.queue || [],
        playback: state.playback || previous?.playback || null,
      }));

      if (Array.isArray(state.listeners)) {
        setListeners(state.listeners);
      }
    };

    const handleRoomUsers = (users) => {
      if (active && Array.isArray(users)) {
        setListeners(users);
      }
    };

    const handleRoomCreated = (state) => {
      if (!active || !state) return;
      handleRoomState(state);
    };

    const handleRoomError = (error) => {
      if (!active) return;
      setSocketError(
        typeof error === "string"
          ? error
          : error?.message || "Unable to join this room."
      );
    };

    const handlePlaybackUpdated = (playback) => {
      if (!active || !playback) return;

      setRoomState((previous) => ({
        ...(previous || {}),
        playback,
      }));
    };

    const handleQueueUpdated = (queue) => {
      if (!active) return;

      const nextQueue = Array.isArray(queue) ? queue : queue?.queue;
      if (!Array.isArray(nextQueue)) return;

      setRoomState((previous) => ({
        ...(previous || {}),
        queue: nextQueue,
      }));
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);
    socket.on("room:state", handleRoomState);
    socket.on("room:users", handleRoomUsers);
    socket.on("room:created", handleRoomCreated);
    socket.on("room:error", handleRoomError);
    socket.on("playback:updated", handlePlaybackUpdated);
    socket.on("queue:updated", handleQueueUpdated);

    if (socket.connected) {
      joinRoom();
    } else {
      socket.connect();
    }

    return () => {
      active = false;

      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);
      socket.off("room:state", handleRoomState);
      socket.off("room:users", handleRoomUsers);
      socket.off("room:created", handleRoomCreated);
      socket.off("room:error", handleRoomError);
      socket.off("playback:updated", handlePlaybackUpdated);
      socket.off("queue:updated", handleQueueUpdated);

      socket.emit("room:leave", { roomId });
    };
  }, [roomId, userId, userName]);

  const updatePlayback = useCallback(
    (playback) => {
      if (!socket.connected || !roomId || !playback) return;

      socket.emit("playback:update", {
        roomId,
        ...playback,
      });
    },
    [roomId]
  );

  const updateQueue = useCallback(
    (queue) => {
      if (!socket.connected || !roomId || !Array.isArray(queue)) return;

      socket.emit("queue:update", { roomId, queue });
    },
    [roomId]
  );

  const createRoomOnServer = useCallback(
    (room) => {
      if (!socket.connected || !room?.id) {
        setSocketError("Server connection is unavailable.");
        return false;
      }

      socket.emit("room:create", {
        roomId: room.id,
        roomName: room.name,
        host: room.host,
        hostId: userId,
        description: room.description || "",
        privacy: room.privacy || "public",
        maxListeners: room.maxListeners || 10,
      });

      return true;
    },
    [userId]
  );

  return {
    connected,
    listeners,
    roomState,
    socketError,
    updatePlayback,
    updateQueue,
    createRoomOnServer,
  };
}

export default useRoomSocket;
