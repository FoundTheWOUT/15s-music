"use client";

import Image from "next/image";
import useSWRMutation from "swr/mutation";
import { Music } from "../../utils/music";
import { MusicPlayer } from "../../utils/MuiscPlayer";
import { HeartIcon } from "@heroicons/react/24/solid";
import { useCallback, useEffect, useState } from "react";
import cn from "classnames";
import { useAtom } from "jotai";
import { autoPlayAtom, autoPlayNextAtom, likedSongAtom } from "@/state";
import { playEvent, playNextEvent } from "./MusicList";
import { useDebounce } from "@/hooks";
import { STATIC_HOST } from "../../const";
import PlayAndPause from "./PlayAndPause";

const player = new MusicPlayer();

function Music15sPlayer({ music, index }: { music: Music; index: number }) {
  const { trigger } = useSWRMutation(music.song_15s_src, () =>
    fetch(`${STATIC_HOST}/${music.song_15s_src}`).then((res) =>
      res.arrayBuffer()
    )
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

  // ---- autoPlayNext ---
  const [autoPlayNext] = useAtom(autoPlayNextAtom);

  if (player.audio) {
    player.audio.loop = !autoPlayNext;
  }

  const playNext = useCallback(() => {
    if (autoPlayNext) {
      playNextEvent.emit({ index: index + 1 });
    }
  }, [autoPlayNext, index]);

  useEffect(() => {
    const unsubscribePlayNext = playNextEvent.subscribe(({ index: idx }) => {
      if (idx === index) {
        play();
      }
    });
    return () => {
      unsubscribePlayNext();
    };
  }, [playNext, index]);
  // ---- autoPlayNext ---

  const play = async () => {
    const buffer = await trigger();
    if (buffer) {
      // play music
      // stop other music first.
      playEvent.emit({ id: music.id });
      player
        .play(buffer)
        .then((player) => {
          player.once("ended", playNext);
          setPaused(false);
        })
        .catch((err) => {
          // TODO:notice
          console.log(err);
        });
    }
  };

  const { trigger: debouncedPlay, stop } = useDebounce(
    () => {
      play();
    },
    { delay: 300 }
  );

  const pause = () => {
    player.pause();
    setPaused(true);
  };

  useEffect(() => {
    const unsubscribe = playEvent.subscribe(({ id }) => {
      // 当播放音乐不是当前音乐时，恢复当前状态
      if (id !== music.id) {
        pause();
      }
    });

    return () => {
      unsubscribe();
    };
  }, [music.id]);

  const handleMouseEnter = async () => {
    if (!music.song_15s_src) return;
    if (autoPlay) {
      debouncedPlay();
    }
  };

  const handleMouseLeave = () => {
    stop();
    if (autoPlay) {
      pause();
    }
  };

  return (
    <div
      className={cn(
        "group/music relative aspect-square  select-none overflow-hidden rounded-xl shadow-xl",
        !paused && "scale-[var(--amplitude)] transition-[scale]"
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative inset-0 z-10 flex h-full items-center justify-center gap-4">
        {!autoPlay && (
          <PlayAndPause
            className="w-10 opacity-0 transition-opacity group-hover/music:opacity-100"
            paused={paused}
            onClick={() => (paused ? play() : pause())}
          />
        )}
        <div className="icon w-10 opacity-0 transition-opacity group-hover/music:opacity-100">
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
            ? `${STATIC_HOST}/${music.cover_src}`
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
