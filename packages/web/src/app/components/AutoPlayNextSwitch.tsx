"use client";

import { autoPlayNextAtom } from "@/state";
import { Switch, Transition } from "@headlessui/react";
import SwitchBtn from "./styled/Switch";
import { useAtom } from "jotai";
import { useState } from "react";

export default function AutoPlaySwitch() {
  const [autoPlay, setAutoPlay] = useAtom(autoPlayNextAtom);
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
            自动播放下一首
          </span>
        </Switch.Label>
        <SwitchBtn checked={autoPlay} onChange={setAutoPlay} />
      </div>
    </Switch.Group>
  );
}
