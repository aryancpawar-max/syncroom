import { Link } from "react-router-dom";
import {
  Headphones,
  Users,
  Radio,
  Music2,
  ArrowRight,
  Play,
  AudioLines,
  Waves,
  Sparkles,
} from "lucide-react";

import Button from "../components/ui/Button";

const features = [
  {
    icon: <Headphones size={23} />,
    title: "Listen Together",
    description:
      "Enjoy your favorite tracks with friends, wherever they are.",
  },
  {
    icon: <Radio size={23} />,
    title: "Perfectly in Sync",
    description:
      "Keep playback aligned so everyone enjoys the same moment.",
  },
  {
    icon: <Users size={23} />,
    title: "Private Rooms",
    description:
      "Create your own listening space and invite your friends.",
  },
];

function Landing() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#20232B] text-[#F0F0F5]">
      {/* Navbar */}
      <header className="px-5 py-5 sm:px-8 lg:px-16">
        <nav className="mx-auto flex max-w-7xl items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#252933] text-[#A78BFA] shadow-[5px_5px_10px_rgba(0,0,0,0.35),_-5px_-5px_10px_rgba(255,255,255,0.035)]">
              <Headphones size={23} />
            </div>

            <span className="text-xl font-bold tracking-[0.12em]">
              SYNC<span className="text-[#A78BFA]">ROOM</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="hidden rounded-xl px-4 py-2.5 text-sm text-[#A0A6B5] transition hover:text-white sm:block"
            >
              Log in
            </Link>

            <Link to="/login">
              <Button className="!rounded-xl !px-4 !py-2.5 text-sm">
                Get Started
                <ArrowRight size={16} className="ml-2 inline" />
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <main>
        <section className="relative px-5 pb-20 pt-16 sm:px-8 sm:pt-24 lg:px-16 lg:pb-28 lg:pt-28">
          {/* Decorative background elements */}
          <div className="pointer-events-none absolute left-1/2 top-24 h-72 w-72 -translate-x-1/2 rounded-full bg-[#A78BFA]/5 blur-3xl" />

          <div className="relative mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2 lg:gap-12">
            {/* Hero text */}
            <div className="text-center lg:text-left">
              <div className="mx-auto mb-7 inline-flex items-center gap-2 rounded-full bg-[#252933] px-4 py-2.5 text-xs font-medium tracking-wide text-[#A0A6B5] shadow-[inset_3px_3px_6px_rgba(0,0,0,0.25),inset_-3px_-3px_6px_rgba(255,255,255,0.02)] sm:text-sm lg:mx-0">
                <Sparkles size={15} className="text-[#A78BFA]" />
                YOUR MUSIC, YOUR PEOPLE
              </div>

              <h1 className="text-5xl font-bold leading-[1.1] tracking-tight sm:text-6xl lg:text-7xl">
                Music feels
                <br />
                better{" "}
                <span className="text-[#A78BFA]">together.</span>
              </h1>

              <p className="mx-auto mt-7 max-w-xl text-base leading-8 text-[#A0A6B5] sm:text-lg lg:mx-0">
                Press play together, share your favorite tracks, and
                turn every listening session into a shared experience.
              </p>

              <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
                <Link to="/login">
                  <Button className="flex w-full items-center justify-center gap-2 sm:w-auto">
                    <Play size={17} fill="currentColor" />
                    Create a Room
                    <ArrowRight size={17} />
                  </Button>
                </Link>

                <Link to="/join-room">
                  <Button
                    variant="secondary"
                    className="w-full sm:w-auto"
                  >
                    Join a Room
                  </Button>
                </Link>
              </div>

              <div className="mt-9 flex items-center justify-center gap-3 text-sm text-[#737B8D] lg:justify-start">
                <div className="flex -space-x-2">
                  {["A", "K", "S"].map((letter, index) => (
                    <div
                      key={letter}
                      className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#20232B] bg-[#252933] text-xs font-semibold text-[#A78BFA]"
                      style={{ zIndex: 3 - index }}
                    >
                      {letter}
                    </div>
                  ))}
                </div>

                <span>Good music is better shared.</span>
              </div>
            </div>

            {/* Neumorphic music player visual */}
            <div className="mx-auto w-full max-w-md lg:max-w-none">
              <div className="rounded-[32px] bg-[#252933] p-5 shadow-[14px_14px_28px_rgba(0,0,0,0.38),_-8px_-8px_20px_rgba(255,255,255,0.025)] sm:p-8">
                <div className="mb-7 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#737B8D]">
                      NOW PLAYING
                    </p>

                    <h2 className="mt-2 text-lg font-semibold">
                      Shared Session
                    </h2>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#252933] text-[#A78BFA] shadow-[inset_4px_4px_8px_rgba(0,0,0,0.3),inset_-4px_-4px_8px_rgba(255,255,255,0.025)]">
                    <Music2 size={21} />
                  </div>
                </div>

                {/* Album artwork */}
                <div className="relative flex aspect-square max-h-[320px] items-center justify-center overflow-hidden rounded-[26px] bg-[#252933] shadow-[inset_6px_6px_12px_rgba(0,0,0,0.28),inset_-6px_-6px_12px_rgba(255,255,255,0.025)]">
                  <div className="absolute h-52 w-52 rounded-full border border-[#A78BFA]/20 sm:h-64 sm:w-64" />

                  <div className="absolute h-40 w-40 rounded-full border border-[#A78BFA]/30 sm:h-48 sm:w-48" />

                  <div className="flex h-28 w-28 items-center justify-center rounded-full bg-[#252933] text-[#A78BFA] shadow-[8px_8px_16px_rgba(0,0,0,0.35),_-8px_-8px_16px_rgba(255,255,255,0.025)] sm:h-36 sm:w-36">
                    <AudioLines size={58} strokeWidth={1.2} />
                  </div>

                  <Waves
                    size={22}
                    className="absolute bottom-6 right-6 text-[#A78BFA]/70"
                  />
                </div>

                {/* Track information */}
                <div className="mt-7 flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold sm:text-xl">
                      Your Next Favorite
                    </h3>

                    <p className="mt-1 text-sm text-[#A0A6B5]">
                      Better when shared
                    </p>
                  </div>

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#252933] text-[#A78BFA] shadow-[5px_5px_10px_rgba(0,0,0,0.3),_-5px_-5px_10px_rgba(255,255,255,0.025)]">
                    <Headphones size={22} />
                  </div>
                </div>

                {/* Decorative progress bar */}
                <div className="mt-7">
                  <div className="h-2 overflow-hidden rounded-full bg-[#252933] shadow-[inset_3px_3px_6px_rgba(0,0,0,0.3),inset_-3px_-3px_6px_rgba(255,255,255,0.02)]">
                    <div className="h-full w-[42%] rounded-full bg-[#A78BFA]" />
                  </div>

                  <div className="mt-2 flex justify-between text-xs text-[#737B8D]">
                    <span>01:24</span>
                    <span>03:42</span>
                  </div>
                </div>

                {/* Decorative controls */}
                <div className="mt-6 flex items-center justify-center gap-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#252933] text-[#A0A6B5] shadow-[5px_5px_10px_rgba(0,0,0,0.3),_-5px_-5px_10px_rgba(255,255,255,0.025)]">
                    <Waves size={19} />
                  </div>

                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#252933] text-[#A78BFA] shadow-[7px_7px_14px_rgba(0,0,0,0.35),_-7px_-7px_14px_rgba(255,255,255,0.035)]">
                    <Play size={25} fill="currentColor" />
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#252933] text-[#A0A6B5] shadow-[5px_5px_10px_rgba(0,0,0,0.3),_-5px_-5px_10px_rgba(255,255,255,0.025)]">
                    <Users size={19} />
                  </div>
                </div>

                <div className="mt-7 flex items-center justify-center gap-2 text-xs text-[#737B8D]">
                  <span className="h-2 w-2 rounded-full bg-[#A78BFA]" />
                  Music brings us closer
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="px-5 py-20 sm:px-8 lg:px-16 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#A78BFA]">
                THE EXPERIENCE
              </p>

              <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
                More than just listening.
              </h2>

              <p className="mt-4 leading-7 text-[#A0A6B5]">
                Everything you need to make listening together simple.
              </p>
            </div>

            <div className="mt-14 grid gap-7 md:grid-cols-3">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-[26px] bg-[#252933] p-7 shadow-[9px_9px_18px_rgba(0,0,0,0.32),_-7px_-7px_16px_rgba(255,255,255,0.025)] transition-transform duration-300 hover:-translate-y-1 sm:p-8"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#252933] text-[#A78BFA] shadow-[inset_4px_4px_8px_rgba(0,0,0,0.22),inset_-4px_-4px_8px_rgba(255,255,255,0.02)]">
                    {feature.icon}
                  </div>

                  <h3 className="mt-6 text-lg font-semibold">
                    {feature.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-[#A0A6B5]">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-5 pb-20 sm:px-8 lg:px-16 lg:pb-28">
          <div className="mx-auto max-w-7xl rounded-[30px] bg-[#252933] px-6 py-12 text-center shadow-[10px_10px_20px_rgba(0,0,0,0.32),_-7px_-7px_16px_rgba(255,255,255,0.025)] sm:px-12 sm:py-16">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#252933] text-[#A78BFA] shadow-[inset_4px_4px_8px_rgba(0,0,0,0.25),inset_-4px_-4px_8px_rgba(255,255,255,0.02)]">
              <Headphones size={27} />
            </div>

            <h2 className="mt-6 text-3xl font-bold sm:text-4xl">
              Your next listening session awaits.
            </h2>

            <p className="mx-auto mt-4 max-w-xl leading-7 text-[#A0A6B5]">
              Bring your friends, find your favorite music, and enjoy
              the moment together.
            </p>

            <Link to="/login" className="mt-8 inline-block">
              <Button className="inline-flex items-center gap-2">
                Get Started
                <ArrowRight size={17} />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="px-5 pb-8 sm:px-8 lg:px-16">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-white/5 pt-7 text-center sm:flex-row sm:text-left">
          <Link to="/" className="text-sm font-bold tracking-[0.15em]">
            SYNC<span className="text-[#A78BFA]">ROOM</span>
          </Link>

          <p className="text-xs text-[#737B8D]">
            Made for music, built for togetherness.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Landing;