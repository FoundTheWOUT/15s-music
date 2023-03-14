"use client";

import { ArrowPathRoundedSquareIcon } from "@heroicons/react/24/solid";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  WheelEventHandler,
} from "react";
import PlayAndPause from "./PlayAndPause";

// WaveSurfer use self internal, we can't import here, otherwise causing server error.
// import WaveSurfer from "wavesurfer.js";
// import RegionsPlugin from "wavesurfer.js/src/plugin/regions";

const AudioEditor = forwardRef(function AudioEditor(
  { blob, id }: { blob: Blob; id: string },
  ref
) {
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const wavesurferDivRef = useRef<HTMLDivElement | null>(null);
  const [paused, setPaused] = useState(true);
  const [loadingWavesurfer, setLoadingWavesurfer] = useState(true);

  useImperativeHandle(
    ref,
    () => {
      return {
        wavesurferRef,
      };
    },
    []
  );

  // TODO: resize the editor.
  // useEffect(() => {
  //   const handleResize = () => {
  //     const width = wavesurferDivRef.current?.clientWidth;
  //     // console.log(wavesurferRef.current?.drawer);
  //     wavesurferRef.current?.drawer?.updateSize();
  //   };

  //   window.addEventListener("resize", handleResize);
  //   return () => {
  //     window.removeEventListener("resize", handleResize);
  //   };
  // }, []);

  useEffect(() => {
    const run = async () => {
      const { default: WaveSurfer } = await import("wavesurfer.js");
      const { default: RegionsPlugin } = await import(
        "wavesurfer.js/src/plugin/regions"
      );
      if (!wavesurferRef.current && wavesurferDivRef.current) {
        const wavesurfer = (wavesurferRef.current = WaveSurfer.create({
          container: wavesurferDivRef.current,
          waveColor: "rgb(252 103 103 / 0.3)",
          progressColor: "#fc6767",
          plugins: [RegionsPlugin.create({})],
        }));
        wavesurfer.loadBlob(blob);
        wavesurfer.once("ready", () => {
          setLoadingWavesurfer(false);
          const duration = wavesurfer.getDuration();
          if (duration > 18) {
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
    };
    run();
    return () => {
      // ! we do not destroy wavesurfer instance here
      // ! but before the editor list state updated
      // ! otherwise, wavesurfer would not get the element
      // ! and causing error.
      // wavesurferRef.current?.destroy()
      wavesurferRef.current = null;
    };
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

  const regions = Object.values(wavesurferRef.current?.regions.list ?? {});
  const playFromRegionHead = () => {
    if (regions.length) {
      const region = regions[0];
      region.playLoop();
    }
    setPaused(false);
  };

  return (
    <div className="flex flex-col gap-2">
      {/* <div className="h-32 rounded-lg bg-primary/30"></div> */}
      {/* maybe we can add a loading here */}
      <div className="h-32" ref={wavesurferDivRef}></div>
      {/* control */}
      <div className="flex gap-2 self-center rounded bg-primary/80 p-2">
        <PlayAndPause
          title="播放/暂停"
          className="w-6"
          paused={paused}
          onClick={() => {
            paused
              ? wavesurferRef.current?.play()
              : wavesurferRef.current?.pause();
            setPaused(!paused);
          }}
        />
        {regions.length > 0 && (
          <ArrowPathRoundedSquareIcon
            className="icon btn w-6 group-hover:hidden"
            title="区间循环播放"
            onClick={() => {
              playFromRegionHead();
            }}
          />
        )}
      </div>
    </div>
  );
});

export default AudioEditor;
