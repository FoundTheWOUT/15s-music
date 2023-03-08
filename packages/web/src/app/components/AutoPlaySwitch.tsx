"use client";

import { autoPlayAtom } from "@/state";
import { Switch, Transition } from "@headlessui/react";
import cn from "classnames";
import { useAtom } from "jotai";
import { useState } from "react";

export default function AutoPlaySwitch() {
  const [autoPlay, setAutoPlay] = useAtom(autoPlayAtom);
  const [hover, setHover] = useState(false);
  return (
    <Switch.Group>
      <div className="inline-flex items-center gap-1">
        <Switch.Label>
          <div className="relative">
            <div
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
              className="font-bold text-[#fc6767]"
            >
              自动播放
            </div>
            <Transition
              className="absolute -left-16 mt-2 w-48 rounded-xl border bg-white p-2 text-sm shadow-xl"
              show={hover}
              enter="transition-opacity"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              启动该选项后，鼠标移动到唱片上，音乐自动播放
            </Transition>
          </div>
        </Switch.Label>
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
