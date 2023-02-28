"use client";

import Image from "next/image";
import useSWRMutation from "swr/mutation";
import { Music, playMusic } from "../../music";
import { HeartIcon, PauseIcon, PlayIcon } from "@heroicons/react/24/solid";
import { useEffect, useRef, useState } from "react";
import cn from "classnames";
import { useAtom } from "jotai";
import { autoPlayAtom, likedSongAtom } from "@/state";
import { playEvent } from "./MusicList";

function Music15sPlayer({ music }: { music: Music }) {
  const { trigger } = useSWRMutation(music.song_15s_src, () =>
    music.song_15s_src
      ? music.song_15s_src.startsWith("/")
        ? fetch(
            `${process.env.NEXT_PUBLIC_API_GATE}${music.song_15s_src}`
          ).then((res) => res.arrayBuffer())
        : fetch(`/api/resource/${music.song_15s_src}`).then((res) =>
            res.arrayBuffer()
          )
      : null
  );
  const [autoPlay] = useAtom(autoPlayAtom);
  const [paused, setPaused] = useState(true);
  const [likedSong, setLikedSong] = useAtom(likedSongAtom);
  const liked = likedSong.includes(music.uuid);
  const handleHeartClick = () => {
    if (liked) {
      setLikedSong((liked) => {
        const nextLiked = [...liked];
        const idx = nextLiked.indexOf(music.uuid);
        nextLiked.splice(idx, 1);
        return nextLiked;
      });
    } else {
      setLikedSong((liked) => [...liked, music.uuid]);
    }
  };

  const playerRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const unsubscribe = playEvent.subscribe(({ id }) => {
      // 当播放音乐不是当前音乐时，恢复当前状态
      if (id !== music.id) {
        setPaused(true);
      }
    });
    return () => {
      unsubscribe();
    };
  }, [music.id]);

  const playThis = async () => {
    const buffer = await trigger();
    if (buffer) {
      // play music
      const blob = new Blob([buffer], { type: "audio/mp3" });
      playMusic(blob)
        .then((player) => {
          playerRef.current = player;
          setPaused(false);
          playEvent.emit({ id: music.id });
        })
        .catch((err) => {
          // alert(err);
          // TODO:notice
          console.log(err);
        });
    }
  };

  // TODO: optimize mouse flowing
  const handleMouseEnter = async () => {
    if (!music.song_15s_src) return;
    if (autoPlay) {
      playThis();
    }
  };

  const handleMouseLeave = () => {
    if (autoPlay) {
      playerRef.current?.pause();
    }
  };

  return (
    <div
      className="group/music relative aspect-square select-none overflow-hidden rounded-xl shadow-xl"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative inset-0 z-10 flex h-full items-center justify-center gap-4">
        {!autoPlay &&
          (paused ? (
            <div className="icon opacity-0 transition-opacity group-hover/music:opacity-100">
              <PlayIcon
                className="translate-x-[2px] text-gray-500"
                onClick={() => playThis()}
              />
            </div>
          ) : (
            <div className="icon opacity-0 transition-opacity group-hover/music:opacity-100">
              <PauseIcon
                className=" text-gray-500"
                onClick={() => {
                  playerRef.current?.pause();
                  setPaused(true);
                }}
              />
            </div>
          ))}
        <div className="icon opacity-0 transition-opacity group-hover/music:opacity-100">
          <HeartIcon
            className={cn(
              "translate-y-[1px]",
              liked ? "text-red-500" : "text-gray-500"
            )}
            onClick={handleHeartClick}
          />
        </div>
      </div>

      <Image
        className="transition-[filter] group-hover/music:blur"
        src={
          music.cover_src
            ? music.cover_src.startsWith("/")
              ? music.cover_src
              : `${process.env.NEXT_PUBLIC_OSS}/${music.cover_src}`
            : "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
        }
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
