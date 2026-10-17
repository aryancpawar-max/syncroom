
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Headphones,
  Music2,
  Users,
  LockKeyhole,
  Globe,
  Check,
} from "lucide-react";

import Button from "../components/ui/Button";
import socket from "../lib/socket";
import { saveRoom } from "../lib/roomApi";

function CreateRoom() {
  const navigate = useNavigate();
  const timeoutRef = useRef(null);
  const pendingRoomRef = useRef(null);

  const [roomName, setRoomName] = useState("");
  const [description, setDescription] = useState("");
  const [privacy, setPrivacy] = useState("public");
  const [maxListeners, setMaxListeners] = useState("10");
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const handleCreated = (payload) => {
      const room = payload?.room || payload;
      const pendingRoom = pendingRoomRef.current;

      if (!pendingRoom || room?.id !== pendingRoom.id) return;

      clearTimeout(timeoutRef.current);
      pendingRoomRef.current = null;

      navigate(`/room/${encodeURIComponent(room.id)}`);
    };

    const handleError = (payload) => {
      if (!pendingRoomRef.current) return;

      clearTimeout(timeoutRef.current);
      pendingRoomRef.current = null;

      setError(
        typeof payload === "string"
          ? payload
          : payload?.message || "Could not create the room."
      );
      setCreating(false);
    };

    socket.on("room:created", handleCreated);
    socket.on("room:error", handleError);

    return () => {
      socket.off("room:created", handleCreated);
      socket.off("room:error", handleError);
      clearTimeout(timeoutRef.current);
    };
  }, [navigate]);

  async function handleCreateRoom(event) {
    event.preventDefault();

    if (creating) return;

    const trimmedName = roomName.trim();

    if (!trimmedName) {
      setError("Please enter a room name.");
      return;
    }

    setCreating(true);
    setError("");

    try {
      let user = null;

      try {
        user = JSON.parse(localStorage.getItem("syncroom-user") || "null");
      } catch {
        user = null;
      }

      const newRoom = {
        id: `room-${Date.now().toString(36)}`,
        name: trimmedName,
        description: description.trim(),
        privacy,
        maxListeners: Number(maxListeners),
        host: user?.name || "Music Lover",
        hostId: user?.id || "local-user",
        createdAt: new Date().toISOString(),
      };

      if (!socket.connected) {
        socket.connect();
      }

      const registerRoom = () => {
        if (pendingRoomRef.current?.id !== newRoom.id) return;

        try {
          saveRoom(newRoom);
        } catch (saveError) {
          console.error("Local room save failed:", saveError);
        }

        socket.emit("room:create", {
          roomId: newRoom.id,
          roomName: newRoom.name,
          host: newRoom.host,
          hostId: newRoom.hostId,
          description: newRoom.description,
          privacy: newRoom.privacy,
          maxListeners: newRoom.maxListeners,
        });

        timeoutRef.current = setTimeout(() => {
          if (pendingRoomRef.current?.id !== newRoom.id) return;

          pendingRoomRef.current = null;
          setCreating(false);
          setError("The server did not confirm room creation. Please retry.");
        }, 10000);
      };

      pendingRoomRef.current = newRoom;

      if (socket.connected) {
        registerRoom();
      } else {
        const handleConnect = () => {
          socket.off("connect", handleConnect);
          socket.off("connect_error", handleConnectError);
          registerRoom();
        };

        const handleConnectError = (socketError) => {
          socket.off("connect", handleConnect);
          socket.off("connect_error", handleConnectError);

          pendingRoomRef.current = null;
          setCreating(false);
          setError(
            socketError?.message ||
              "Cannot connect to the server on port 5000."
          );
        };

        socket.once("connect", handleConnect);
        socket.once("connect_error", handleConnectError);
      }
    } catch (err) {
      console.error("Room creation failed:", err);
      pendingRoomRef.current = null;
      setCreating(false);
      setError(err?.message || "Could not create the room. Please try again.");
    }
  }

  return (
    <main className="min-h-screen bg-[#20232B] px-4 py-8 text-[#F0F0F5] sm:px-6 sm:py-12">
      <div className="mx-auto max-w-3xl">
        <Link
          to="/dashboard"
          className="mb-8 inline-flex items-center gap-2 text-sm text-[#A0A6B5] transition hover:text-[#A78BFA]"
        >
          <ArrowLeft size={17} />
          Back to dashboard
        </Link>

        <div className="mb-8">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#252933] text-[#A78BFA] shadow-[7px_7px_14px_rgba(0,0,0,0.35),-7px_-7px_14px_rgba(255,255,255,0.035)]">
            <Headphones size={28} />
          </div>

          <h1 className="text-3xl font-bold sm:text-4xl">
            Create your room
          </h1>

          <p className="mt-3 text-sm leading-6 text-[#A0A6B5] sm:text-base">
            Set the vibe, invite your friends, and enjoy music together.
          </p>
        </div>

        <form
          onSubmit={handleCreateRoom}
          className="rounded-3xl bg-[#252933] p-5 shadow-[9px_9px_18px_rgba(0,0,0,0.3),-7px_-7px_18px_rgba(255,255,255,0.025)] sm:p-8"
        >
          <div className="mb-6">
            <label htmlFor="roomName" className="mb-3 block text-sm font-medium">
              Room name <span className="text-[#A78BFA]">*</span>
            </label>

            <div className="flex items-center gap-3 rounded-xl bg-[#20232B] px-4 shadow-[inset_4px_4px_8px_rgba(0,0,0,0.3),inset_-4px_-4px_8px_rgba(255,255,255,0.025)] focus-within:outline-1 focus-within:outline-[#A78BFA]">
              <Music2 size={19} className="shrink-0 text-[#A78BFA]" />
              <input
                id="roomName"
                type="text"
                value={roomName}
                onChange={(event) => {
                  setRoomName(event.target.value);
                  setError("");
                }}
                placeholder="e.g. Late Night Vibes"
                maxLength={50}
                required
                className="w-full bg-transparent py-4 text-sm text-[#F0F0F5] outline-none placeholder:text-[#737B8D]"
              />
            </div>

            <p className="mt-2 text-right text-xs text-[#737B8D]">
              {roomName.length}/50
            </p>
          </div>

          <div className="mb-7">
            <label htmlFor="description" className="mb-3 block text-sm font-medium">
              Description{" "}
              <span className="font-normal text-[#737B8D]">(optional)</span>
            </label>

            <textarea
              id="description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Describe the vibe of your room..."
              maxLength={160}
              rows={3}
              className="w-full resize-none rounded-xl bg-[#20232B] px-4 py-3 text-sm leading-6 text-[#F0F0F5] shadow-[inset_4px_4px_8px_rgba(0,0,0,0.3),inset_-4px_-4px_8px_rgba(255,255,255,0.025)] outline-none placeholder:text-[#737B8D] focus-visible:outline-1 focus-visible:outline-[#A78BFA]"
            />

            <p className="mt-2 text-right text-xs text-[#737B8D]">
              {description.length}/160
            </p>
          </div>

          <div className="mb-7">
            <h2 className="mb-3 text-sm font-medium">Room visibility</h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setPrivacy("public")}
                className={`rounded-2xl p-5 text-left transition ${
                  privacy === "public"
                    ? "bg-[#252933] shadow-[inset_4px_4px_8px_rgba(0,0,0,0.3),inset_-4px_-4px_8px_rgba(255,255,255,0.025)] outline-1 outline-[#A78BFA]"
                    : "bg-[#252933] shadow-[5px_5px_10px_rgba(0,0,0,0.25),-5px_-5px_10px_rgba(255,255,255,0.02)]"
                }`}
              >
                <div className="mb-4 flex items-center justify-between">
                  <Globe
                    size={23}
                    className={privacy === "public" ? "text-[#A78BFA]" : "text-[#A0A6B5]"}
                  />
                  {privacy === "public" && <Check size={18} className="text-[#A78BFA]" />}
                </div>
                <h3 className="font-semibold">Public room</h3>
                <p className="mt-2 text-xs leading-5 text-[#A0A6B5]">
                  Anyone with the room link can join.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setPrivacy("private")}
                className={`rounded-2xl p-5 text-left transition ${
                  privacy === "private"
                    ? "bg-[#252933] shadow-[inset_4px_4px_8px_rgba(0,0,0,0.3),inset_-4px_-4px_8px_rgba(255,255,255,0.025)] outline-1 outline-[#A78BFA]"
                    : "bg-[#252933] shadow-[5px_5px_10px_rgba(0,0,0,0.25),-5px_-5px_10px_rgba(255,255,255,0.02)]"
                }`}
              >
                <div className="mb-4 flex items-center justify-between">
                  <LockKeyhole
                    size={23}
                    className={privacy === "private" ? "text-[#A78BFA]" : "text-[#A0A6B5]"}
                  />
                  {privacy === "private" && <Check size={18} className="text-[#A78BFA]" />}
                </div>
                <h3 className="font-semibold">Private room</h3>
                <p className="mt-2 text-xs leading-5 text-[#A0A6B5]">
                  Intended for listening with invited friends.
                </p>
              </button>
            </div>
          </div>

          <div className="mb-8">
            <label htmlFor="maxListeners" className="mb-3 block text-sm font-medium">
              Maximum listeners
            </label>

            <div className="flex items-center gap-3 rounded-xl bg-[#20232B] px-4 shadow-[inset_4px_4px_8px_rgba(0,0,0,0.3),inset_-4px_-4px_8px_rgba(255,255,255,0.025)]">
              <Users size={19} className="text-[#A78BFA]" />
              <select
                id="maxListeners"
                value={maxListeners}
                onChange={(event) => setMaxListeners(event.target.value)}
                className="w-full cursor-pointer bg-transparent py-4 text-sm text-[#F0F0F5] outline-none"
              >
                {[2, 5, 10, 20, 50].map((count) => (
                  <option key={count} value={count} className="bg-[#252933]">
                    {count} listeners
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <p role="alert" className="mb-5 text-sm text-red-400">
              {error}
            </p>
          )}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate("/dashboard")}
              className="justify-center"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={creating}
              className="flex items-center justify-center gap-2"
            >
              {creating ? "Creating..." : "Create Room"}
              <ArrowRight size={17} />
            </Button>
          </div>
        </form>

        <p className="mt-6 text-center text-xs leading-5 text-[#737B8D]">
          Rooms are saved locally and registered with the connected server.
        </p>
      </div>
    </main>
  );
}

export default CreateRoom;
