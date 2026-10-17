const API_URL =
  import.meta.env.VITE_SERVER_URL || "http://localhost:5000";

export async function checkServer() {
  try {
    const response = await fetch(`${API_URL}/health`);
    return response.ok;
  } catch {
    return false;
  }
}

export function getSavedRooms() {
  try {
    return JSON.parse(localStorage.getItem("syncroom-rooms") || "[]");
  } catch {
    return [];
  }
}

export function saveRoom(room) {
  const rooms = getSavedRooms();

  const updatedRooms = [
    room,
    ...rooms.filter((item) => item.id !== room.id),
  ];

  localStorage.setItem("syncroom-rooms", JSON.stringify(updatedRooms));

  return room;
}

export async function fetchRoom(roomId) {
  try {
    const response = await fetch(
      `${API_URL}/api/rooms/${encodeURIComponent(roomId)}`
    );

    if (!response.ok) return null;

    const data = await response.json();
    return data.room || null;
  } catch {
    return null;
  }
}