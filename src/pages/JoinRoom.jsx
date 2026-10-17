
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Hash,
  Headphones,
  Search,
  Music2,
} from "lucide-react";

import Button from "../components/ui/Button";

const API_URL = (
  import.meta.env.VITE_SERVER_URL || "http://localhost:5000"
).replace(/\/+$/, "");

function getLocalRooms() {
  try {
    const stored = JSON.parse(localStorage.getItem("syncroom-rooms") || "[]");
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
}

function normalizeRoomId(value) {
  const input = value.trim();

  if (!input) return "";

  try {
    const url = new URL(input);
    return (
      url.searchParams.get("roomId") ||
      url.pathname.split("/").filter(Boolean).pop() ||
      ""
    );
  } catch {
    return input;
  }
}

function JoinRoom() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [roomId, setRoomId] = useState(searchParams.get("roomId") || "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [rooms, setRooms] = useState(getLocalRooms);

  useEffect(() => {
    setRooms(getLocalRooms());
  }, []);

  const handleJoinRoom = useCallback(
    async (event) => {
      event.preventDefault();

      const enteredId = normalizeRoomId(roomId);

      if (!enteredId) {
        setError("Please enter a valid room ID.");
        return;
      }

      if (loading) return;

      setLoading(true);
      setError("");

      try {
        let response = await fetch(
          `${API_URL}/api/rooms/${encodeURIComponent(enteredId)}`
        );

        let data = await response.json().catch(() => ({}));
        let room = data.room || data;

        if (response.status === 404) {
          const localRoom = getLocalRooms().find(
            (item) => item.id === enteredId
          );

          if (!localRoom) {
            setError("Room not found. Check the room ID and try again.");
            return;
          }

          const createResponse = await fetch(`${API_URL}/api/rooms`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              roomId: localRoom.id,
              roomName: localRoom.name,
              host: localRoom.host,
              hostId: localRoom.hostId || "local-user",
              description: localRoom.description || "",
              privacy: localRoom.privacy || "public",
              maxListeners: localRoom.maxListeners || 10,
            }),
          });

          const createData = await createResponse.json().catch(() => ({}));

          if (!createResponse.ok && createResponse.status !== 409) {
            setError(createData.error || "Could not register this room.");
            return;
          }

          response = await fetch(
            `${API_URL}/api/rooms/${encodeURIComponent(enteredId)}`
          );

          data = await response.json().catch(() => ({}));
          room = data.room || data;
        }

        if (!response.ok) {
          setError(data.error || "Unable to verify the room.");
          return;
        }

        if (!room?.id) {
          setError("The server returned invalid room information.");
          return;
        }

        const localRooms = getLocalRooms();
        const updatedRooms = [
          room,
          ...localRooms.filter((item) => item.id !== room.id),
        ];

        localStorage.setItem("syncroom-rooms", JSON.stringify(updatedRooms));
        setRooms(updatedRooms);

        navigate(`/room/${encodeURIComponent(room.id)}`);
      } catch (err) {
        console.error("Failed to join room:", err);
        setError(
          "Cannot connect to the SyncRoom server. Make sure it is running on port 5000."
        );
      } finally {
        setLoading(false);
      }
    },
    [roomId, loading, navigate]
  );

  return (
    <main className="min-h-screen bg-[#20232B] px-4 py-8 text-[#F0F0F5] sm:px-6 sm:py-12">
      <div className="mx-auto max-w-2xl">
        <Link
          to="/dashboard"
          className="mb-10 inline-flex items-center gap-2 text-sm text-[#A0A6B5] transition hover:text-[#A78BFA]"
        >
          <ArrowLeft size={17} />
          Back to dashboard
        </Link>

        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#252933] text-[#A78BFA] shadow-[7px_7px_14px_rgba(0,0,0,0.35),-7px_-7px_14px_rgba(255,255,255,0.035)]">
            <Headphones size={30} />
          </div>
          <h1 className="text-3xl font-bold sm:text-4xl">Join a room</h1>
          <p className="mt-3 text-sm leading-6 text-[#A0A6B5]">
            Enter a room ID to join your friends.
          </p>
        </div>

        <form
          onSubmit={handleJoinRoom}
          className="rounded-3xl bg-[#252933] p-6 shadow-[9px_9px_18px_rgba(0,0,0,0.3),-7px_-7px_18px_rgba(255,255,255,0.025)] sm:p-8"
        >
          <label htmlFor="roomId" className="mb-3 block text-sm font-medium">
            Room ID
          </label>

          <div className="flex items-center gap-3 rounded-xl bg-[#20232B] px-4 shadow-[inset_4px_4px_8px_rgba(0,0,0,0.3),inset_-4px_-4px_8px_rgba(255,255,255,0.025)] focus-within:outline-1 focus-within:outline-[#A78BFA]">
            <Hash size={19} className="shrink-0 text-[#A78BFA]" />
            <input
              id="roomId"
              type="text"
              value={roomId}
              onChange={(event) => {
                setRoomId(event.target.value);
                setError("");
              }}
              placeholder="Paste your room ID"
              autoComplete="off"
              spellCheck={false}
              disabled={loading}
              className="w-full bg-transparent py-4 text-sm text-[#F0F0F5] outline-none placeholder:text-[#737B8D] disabled:opacity-60"
            />
          </div>

          {error && (
            <p role="alert" className="mt-3 text-sm text-red-400">
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="mt-5 flex w-full items-center justify-center gap-2"
          >
            {loading ? "Checking room..." : "Join Room"}
            {!loading && <ArrowRight size={17} />}
          </Button>
        </form>

        <div className="my-8 flex items-center gap-4">
          <div className="h-px flex-1 bg-white/[0.06]" />
          <span className="text-xs text-[#737B8D]">OR</span>
          <div className="h-px flex-1 bg-white/[0.06]" />
        </div>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Your created rooms</h2>
            <span className="text-xs text-[#737B8D]">
              {rooms.length} rooms
            </span>
          </div>

          {rooms.length > 0 ? (
            <div className="space-y-3">
              {rooms.map((room) => (
                <button
                  key={room.id}
                  type="button"
                  onClick={() => setRoomId(room.id)}
                  className="flex w-full items-center gap-4 rounded-2xl bg-[#252933] p-4 text-left shadow-[6px_6px_12px_rgba(0,0,0,0.25),-6px_-6px_12px_rgba(255,255,255,0.02)] transition hover:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.25),inset_-3px_-3px_6px_rgba(255,255,255,0.02)]"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#20232B] text-[#A78BFA]">
                    <Music2 size={22} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-semibold">
                      {room.name}
                    </h3>
                    <p className="mt-1 truncate text-xs text-[#A0A6B5]">
                      ID: {room.id}
                    </p>
                  </div>
                  <ArrowRight size={18} className="shrink-0 text-[#A78BFA]" />
                </button>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl bg-[#252933] px-5 py-8 text-center shadow-[inset_4px_4px_8px_rgba(0,0,0,0.3),inset_-4px_-4px_8px_rgba(255,255,255,0.025)]">
              <Search size={28} className="mx-auto text-[#737B8D]" />
              <p className="mt-3 text-sm font-medium">No created rooms yet</p>
              <p className="mt-2 text-xs text-[#A0A6B5]">
                Enter a room ID above to join an existing room.
              </p>
              <Link
                to="/create-room"
                className="mt-4 inline-flex items-center gap-2 text-sm text-[#A78BFA] hover:text-[#B8A3FF]"
              >
                Create a room <ArrowRight size={15} />
              </Link>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default JoinRoom;
