"use client";
import { PauseIcon, PlayIcon } from "@heroicons/react/24/solid";

function PlayAndPause({
  paused,
  ...rest
}: {
  paused: boolean;
} & JSX.IntrinsicElements["div"]) {
  return (
    <div {...rest}>
      {paused ? (
        <div className="icon">
          <PlayIcon className="translate-x-[1px] text-gray-500" />
        </div>
      ) : (
        <div className="icon">
          <PauseIcon className="text-gray-500" />
        </div>
      )}
    </div>
  );
}

export default PlayAndPause;
