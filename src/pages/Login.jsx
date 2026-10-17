import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Headphones,
  Eye,
  EyeOff,
  Mail,
  LockKeyhole,
  UserRound,
  ArrowRight,
  ArrowLeft,
  Music2,
} from "lucide-react";

import Button from "../components/ui/Button";

function Login() {
  const navigate = useNavigate();

  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (isSignup && !formData.name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!formData.email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    // Temporary frontend-only authentication.
    // Real authentication will be added in Phase 4.
    localStorage.setItem(
      "syncroom-user",
      JSON.stringify({
        name: isSignup
          ? formData.name.trim()
          : formData.email.split("@")[0],
        email: formData.email.trim(),
      })
    );

    navigate("/dashboard");
  }

  function toggleMode() {
    setIsSignup((previous) => !previous);
    setShowPassword(false);
    setError("");
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#20232B] px-5 py-10 text-[#F0F0F5]">
      {/* Background decoration */}
      <div className="pointer-events-none absolute -left-32 top-20 h-80 w-80 rounded-full bg-[#A78BFA]/5 blur-3xl" />

      <div className="pointer-events-none absolute -right-32 bottom-10 h-80 w-80 rounded-full bg-[#A78BFA]/5 blur-3xl" />

      {/* Back to landing */}
      <Link
        to="/"
        className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-[#A0A6B5] transition hover:text-[#A78BFA] sm:left-8 sm:top-8"
      >
        <ArrowLeft size={17} />
        <span>Home</span>
      </Link>

      <div className="relative my-10 w-full max-w-md">
        {/* Brand */}
        <Link to="/" className="mb-8 flex items-center justify-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#252933] text-[#A78BFA] shadow-[6px_6px_12px_rgba(0,0,0,0.35),_-6px_-6px_12px_rgba(255,255,255,0.035)]">
            <Headphones size={25} />
          </div>

          <span className="text-2xl font-bold tracking-[0.12em]">
            SYNC<span className="text-[#A78BFA]">ROOM</span>
          </span>
        </Link>

        {/* Authentication card */}
        <section className="rounded-[30px] bg-[#252933] p-6 shadow-[14px_14px_28px_rgba(0,0,0,0.38),_-8px_-8px_20px_rgba(255,255,255,0.025)] sm:p-9">
          {/* Heading */}
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#252933] text-[#A78BFA] shadow-[inset_4px_4px_8px_rgba(0,0,0,0.3),inset_-4px_-4px_8px_rgba(255,255,255,0.025)]">
              {isSignup ? (
                <UserRound size={25} />
              ) : (
                <Music2 size={25} />
              )}
            </div>

            <h1 className="mt-6 text-2xl font-bold sm:text-3xl">
              {isSignup ? "Create your account" : "Welcome back"}
            </h1>

            <p className="mt-3 text-sm leading-6 text-[#A0A6B5]">
              {isSignup
                ? "Join SyncRoom and start sharing music."
                : "Sign in to continue your listening sessions."}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {isSignup && (
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-[#A0A6B5]"
                >
                  Your name
                </label>

                <div className="relative">
                  <UserRound
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#737B8D]"
                  />

                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full rounded-2xl border-0 bg-[#252933] py-3.5 pl-12 pr-4 text-sm text-[#F0F0F5] shadow-[inset_4px_4px_8px_rgba(0,0,0,0.3),inset_-4px_-4px_8px_rgba(255,255,255,0.025)] outline-none transition placeholder:text-[#737B8D] focus-visible:ring-2 focus-visible:ring-[#A78BFA]"
                  />
                </div>
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-[#A0A6B5]"
              >
                Email address
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#737B8D]"
                />

                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-2xl border-0 bg-[#252933] py-3.5 pl-12 pr-4 text-sm text-[#F0F0F5] shadow-[inset_4px_4px_8px_rgba(0,0,0,0.3),inset_-4px_-4px_8px_rgba(255,255,255,0.025)] outline-none transition placeholder:text-[#737B8D] focus-visible:ring-2 focus-visible:ring-[#A78BFA]"
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-[#A0A6B5]"
                >
                  Password
                </label>

                {!isSignup && (
                  <button
                    type="button"
                    onClick={() =>
                      setError(
                        "Password recovery will be available when authentication is connected."
                      )
                    }
                    className="text-xs text-[#A78BFA] transition hover:text-[#B8A3FF]"
                  >
                    Forgot password?
                  </button>
                )}
              </div>

              <div className="relative">
                <LockKeyhole
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#737B8D]"
                />

                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete={
                    isSignup ? "new-password" : "current-password"
                  }
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  minLength={6}
                  required
                  className="w-full rounded-2xl border-0 bg-[#252933] py-3.5 pl-12 pr-12 text-sm text-[#F0F0F5] shadow-[inset_4px_4px_8px_rgba(0,0,0,0.3),inset_-4px_-4px_8px_rgba(255,255,255,0.025)] outline-none transition placeholder:text-[#737B8D] focus-visible:ring-2 focus-visible:ring-[#A78BFA]"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((previous) => !previous)
                  }
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#737B8D] transition hover:text-[#A78BFA] focus-visible:outline-2 focus-visible:outline-[#A78BFA]"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Validation message */}
            {error && (
              <div
                role="alert"
                className="rounded-xl bg-[#252933] px-4 py-3 text-sm leading-6 text-red-300 shadow-[inset_3px_3px_6px_rgba(0,0,0,0.25),inset_-3px_-3px_6px_rgba(255,255,255,0.02)]"
              >
                {error}
              </div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              className="!flex w-full items-center justify-center gap-2 !py-3.5"
            >
              {isSignup ? "Create Account" : "Sign In"}
              <ArrowRight size={17} />
            </Button>
          </form>

          {/* Toggle login/signup */}
          <div className="mt-7 text-center text-sm text-[#A0A6B5]">
            {isSignup
              ? "Already have an account?"
              : "Don't have an account?"}

            <button
              type="button"
              onClick={toggleMode}
              className="ml-2 font-semibold text-[#A78BFA] transition hover:text-[#B8A3FF]"
            >
              {isSignup ? "Sign in" : "Sign up"}
            </button>
          </div>
        </section>

        <p className="mt-6 text-center text-xs leading-6 text-[#737B8D]">
          Your music journey starts here.
        </p>
      </div>
    </main>
  );
}

export default Login;