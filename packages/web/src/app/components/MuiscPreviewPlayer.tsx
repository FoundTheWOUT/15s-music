"use client";

import React, { useEffect, useState } from "react";
import { player } from "../../utils/MuiscPlayer";
import PlayAndPause from "./PlayAndPause";

function MusicPreviewPlayer({ src }: { src: string }) {
  const [paused, setPaused] = useState(true);

  const play = () => {
    player.play(src);
    setPaused(false);
  };

  const doPaused = () => {
    player.pause();
    setPaused(true);
  };

  return (
    <PlayAndPause
      paused={paused}
      className="h-8"
      onClick={() => {
        paused ? play() : doPaused();
      }}
    />
  );
}

export default MusicPreviewPlayer;
