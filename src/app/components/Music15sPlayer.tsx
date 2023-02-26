"use client";

import Image from "next/image";
import useSWRMutation from "swr/mutation";
import { Music, playMusic } from "../music";
import { HeartIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import cn from "classnames";

function Music15sPlayer({
  music,
  autoPlay,
}: {
  music: Music;
  autoPlay: boolean;
}) {
  const { trigger } = useSWRMutation(music.name, () =>
    fetch("/Even-LA.wav").then((res) => res.arrayBuffer())
  );
  const [liked, setLiked] = useState(false);
  const handleMouseEnter = async () => {
    // fetch music
    // play music
    const buffer = await trigger();
    if (buffer) {
      const blob = new Blob([buffer], { type: "audio/mp3" });
      if (autoPlay) {
        playMusic(blob).catch((err) => {
          // alert(err);
          // TODO:notice
          console.log(err);
        });
      }
    }
  };
  return (
    <div className="group/music relative aspect-square select-none overflow-hidden rounded-xl shadow-xl">
      {/* <div className="opacity-0 group-hover/music:opacity-100 h-full w-full backdrop-blur absolute inset-0  z-10"></div> */}

      <div className="relative inset-0 z-10 flex h-full items-center justify-center">
        <div className="w-10 cursor-pointer rounded-full bg-white p-1 opacity-0 transition-opacity group-hover/music:opacity-100">
          <HeartIcon
            className={cn(
              "translate-y-[1px]",
              liked ? "text-red-500" : "text-gray-500"
            )}
            onClick={() => setLiked(!liked)}
          />
        </div>
      </div>

      <Image
        className="transition-[filter] group-hover/music:blur"
        onMouseEnter={handleMouseEnter}
        src={music.image.url}
        fill
        sizes="(max-width: 768px) 100vw,
        (max-width: 1200px) 50vw,
        33vw"
        alt=""
      />
    </div>
  );
}

export default Music15sPlayer;
