import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CreateRoom from "./pages/CreateRoom";
import JoinRoom from "./pages/JoinRoom";
import Room from "./pages/Room";

function NotFound() {
  return (
    <main className="page-shell flex min-h-screen items-center justify-center p-6">
      <section className="neo-card p-10 text-center">
        <p className="eyebrow">LOST IN THE MIX</p>
        <h1 className="mt-3 text-4xl font-bold">404</h1>
        <a className="neo-link mt-5 inline-block" href="/">
          Back to home
        </a>
      </section>
    </main>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-room" element={<CreateRoom />} />

        {/* Support both join URLs */}
        <Route path="/join" element={<JoinRoom />} />
        <Route path="/join-room" element={<JoinRoom />} />

        <Route path="/room/:roomId" element={<Room />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}