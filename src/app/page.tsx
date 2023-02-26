"use client"; // optimize
// import { Inter } from "next/font/google";
import { useState } from "react";
import Music15sPlayer from "./components/Music15sPlayer";
import { musics } from "./music";
import { Switch } from "@headlessui/react";
import cn from "classnames";

// const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [autoPlay, setAutoPlay] = useState(false);

  return (
    <main className="mx-auto max-w-7xl">
      {/* header */}
      <header className="sticky top-2 z-50 my-2 flex justify-between rounded-xl p-2 backdrop-blur">
        <span className="bg-gradient-to-r from-[#ec008c] to-[#fc6767] bg-clip-text text-3xl font-extrabold text-transparent ">
          15S Music
        </span>
        <Switch.Group>
          <div className="inline-flex items-center gap-1">
            <Switch.Label>自动播放</Switch.Label>
            <Switch
              checked={autoPlay}
              onChange={setAutoPlay}
              className={cn(
                autoPlay ? "bg-[#ec008c]" : "bg-[#fc6767]",
                "relative inline-flex h-[20px] w-[40px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75"
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  autoPlay ? "translate-x-5" : "translate-x-0",
                  "pointer-events-none inline-block h-[16px] w-[16px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out"
                )}
              />
            </Switch>
          </div>
        </Switch.Group>
      </header>
      {/* music list */}
      <div className="mx-auto grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-6">
        {musics.map((music, idx) => {
          return (
            <div key={idx} className="flex flex-col gap-2">
              <Music15sPlayer music={music} autoPlay={autoPlay} />

              <div>
                <div className="truncate font-bold" title={music.name}>
                  {music.name}
                </div>
                <div className="truncate text-xs text-gray-500">
                  {Array.isArray(music.authors)
                    ? music.authors.join("/")
                    : music.authors}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
