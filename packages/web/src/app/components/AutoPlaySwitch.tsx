"use client";

import { autoPlayAtom } from "@/state";
import { Switch } from "@headlessui/react";
import cn from "classnames";
import { useAtom } from "jotai";

export default function AutoPlaySwitch() {
  const [autoPlay, setAutoPlay] = useAtom(autoPlayAtom);
  return (
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
  );
}
