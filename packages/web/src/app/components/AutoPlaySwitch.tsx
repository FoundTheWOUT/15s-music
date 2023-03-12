"use client";

import { autoPlayAtom } from "@/state";
import { Switch, Transition } from "@headlessui/react";
import SwitchBtn from "./styled/Switch";
import { useAtom } from "jotai";
import { useState } from "react";

export default function AutoPlaySwitch() {
  const [autoPlay, setAutoPlay] = useAtom(autoPlayAtom);
  const [hover, setHover] = useState(false);
  return (
    <Switch.Group>
      <div className="flex items-center gap-1">
        <Switch.Label className="relative">
          <span
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            className="font-bold text-primary"
          >
            自动播放
          </span>
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
        </Switch.Label>
        <SwitchBtn checked={autoPlay} onChange={setAutoPlay} />
      </div>
    </Switch.Group>
  );
}
