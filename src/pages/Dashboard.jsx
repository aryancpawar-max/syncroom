import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Music2,
  Plus,
  Users,
  Radio,
  Headphones,
  Search,
  ArrowRight,
} from "lucide-react";

import Button from "../components/ui/Button";
import RoomCard from "../components/ui/RoomCard";
import StatCard from "../components/ui/StatCard";
import EmptyState from "../components/ui/EmptyState";
import Avatar from "../components/ui/Avatar";

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const savedUser = JSON.parse(
      localStorage.getItem("syncroom-user") || "null"
    );

    const savedRooms = JSON.parse(
      localStorage.getItem("syncroom-rooms") || "[]"
    );

    setUser(savedUser);
    setRooms(savedRooms);
  }, []);

  const filteredRooms = rooms.filter((room) =>
    `${room.name} ${room.description || ""}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const displayName = user?.name || "Music Lover";

  const handleOpenRoom = (room) => {
    navigate(`/room/${room.id}`);
  };

  return (
    <main className="min-h-screen bg-[#20232B] text-[#F0F0F5]">
      <header className="border-b border-white/[0.05] bg-[#252933]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#20232B] text-[#A78BFA]">
              <Music2 size={23} />
            </div>

            <span className="text-xl font-bold tracking-tight">
              SyncRoom
            </span>
          </button>

          <div className="flex items-center gap-3">
            <Button onClick={() => navigate("/create-room")}>
              <Plus size={17} />
              <span className="hidden sm:inline">Create room</span>
              <span className="sm:hidden">Create</span>
            </Button>

            <Avatar
              name={displayName}
              size="md"
            />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm text-[#A78BFA]">
              YOUR MUSIC SPACE
            </p>

            <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
              Welcome back, {displayName.split(" ")[0]}!
            </h1>

            <p className="mt-3 text-sm text-[#A0A6B5] sm:text-base">
              Create a room, invite your friends, and listen together.
            </p>
          </div>

          <Button onClick={() => navigate("/join")}>
            <Users size={17} />
            Join a room
          </Button>
        </section>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Your rooms"
            value={rooms.length}
            subtitle="Rooms saved on this device"
            icon={Radio}
          />

          <StatCard
            title="Your role"
            value="Listener"
            subtitle="Enjoy music together"
            icon={Headphones}
          />

          <StatCard
            title="Music library"
            value="Local"
            subtitle="Audio files from your device"
            icon={Music2}
          />
        </section>

        <section className="space-y-5">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-bold sm:text-2xl">
                Your rooms
              </h2>

              <p className="mt-1 text-sm text-[#A0A6B5]">
                Open a room or create a new one.
              </p>
            </div>

            <label className="flex w-full items-center gap-3 rounded-xl bg-[#252933] px-4 shadow-[inset_4px_4px_8px_rgba(0,0,0,0.3),inset_-4px_-4px_8px_rgba(255,255,255,0.025)] sm:max-w-xs">
              <Search size={18} className="text-[#737B8D]" />

              <input
                type="search"
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(event.target.value)
                }
                placeholder="Search rooms..."
                className="w-full bg-transparent py-3.5 text-sm outline-none placeholder:text-[#737B8D]"
              />
            </label>
          </div>

          {filteredRooms.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredRooms.map((room) => (
                <RoomCard
                  key={room.id}
                  room={room}
                  listenerCount={1}
                  onOpen={handleOpenRoom}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl bg-[#252933] p-6 sm:p-10">
              <EmptyState
                icon={Music2}
                title={
                  searchQuery
                    ? "No matching rooms"
                    : "Your music space starts here"
                }
                description={
                  searchQuery
                    ? "Try another search term."
                    : "Create your first room and invite friends to join you."
                }
                action={
                  searchQuery ? undefined : (
                    <Button
                      onClick={() => navigate("/create-room")}
                    >
                      <Plus size={17} />
                      Create your first room
                    </Button>
                  )
                }
              />
            </div>
          )}
        </section>

        <section className="rounded-3xl bg-[#252933] p-6 shadow-[7px_7px_14px_rgba(0,0,0,0.3),_-5px_-5px_12px_rgba(255,255,255,0.025)] sm:p-8">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-bold">
                Want to listen with someone?
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#A0A6B5]">
                Enter a room ID shared by your friend to find their room.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/join")}
              className="flex items-center justify-center gap-2 self-start rounded-xl bg-[#20232B] px-5 py-3 text-sm font-semibold text-[#A78BFA] transition hover:text-[#B8A3FF] sm:self-auto"
            >
              Join a room
              <ArrowRight size={17} />
            </button>
          </div>
        </section>

        <footer className="border-t border-white/[0.05] py-5 text-center text-xs text-[#737B8D]">
          SyncRoom · Listen together, wherever you are.
        </footer>
      </div>
    </main>
  );
}

export default Dashboard;