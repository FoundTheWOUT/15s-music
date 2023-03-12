"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  WheelEventHandler,
} from "react";
import WaveSurfer from "wavesurfer.js";
import RegionsPlugin from "wavesurfer.js/dist/plugin/wavesurfer.regions";
import PlayAndPause from "./PlayAndPause";

function AudioEditor({ blob, id }: { blob: Blob; id: string }) {
  const [count, setCount] = useState(0);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const [paused, setPaused] = useState(true);
  useLayoutEffect(() => {
    // wavesurfer
    if (!wavesurferRef.current) {
      const wavesurfer = (wavesurferRef.current = WaveSurfer.create({
        container: `#${id}`,
        waveColor: "rgb(252 103 103 / 0.3)",
        progressColor: "#fc6767",
        plugins: [RegionsPlugin.create()],
      }));
      wavesurfer.loadBlob(blob);
      wavesurfer.once("ready", () => {
        const duration = wavesurfer.getDuration();
        if (duration > 18) {
          console.log("add plugin");
          wavesurfer.addRegion({
            start: 0,
            end: 18,
            minLength: 10,
            maxLength: 20,
            color: "hsla(400, 100%, 30%, 0.1)",
          });
        }
      });
    }
  }, []);

  //   TODO: listen on wheel event in non passive.
  const handleZoom: WheelEventHandler = (e) => {
    if (e.altKey) {
      //   e.stopPropagation();
      e.preventDefault();
      console.log(e.deltaX, e.deltaY);
    }
    return false;
  };

  const play = () => {
    if (!wavesurferRef.current) return;
    const regions = Object.values(wavesurferRef.current.regions.list ?? {});
    if (regions.length) {
      const region = regions[0];
      region.playLoop();
      return;
    } else {
      wavesurferRef.current?.play();
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div id={id}></div>
      {/* control */}
      <div className="self-center rounded bg-primary/20 p-2">
        <PlayAndPause
          className="w-5"
          paused={paused}
          onClick={() => {
            paused ? play() : wavesurferRef.current?.pause();
            setPaused(!paused);
          }}
        />
      </div>
    </div>
  );
}

export default AudioEditor;
