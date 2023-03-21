"use client";

import { autoPlayNextAtom } from "@/state";
import { Switch, Transition } from "@headlessui/react";
import SwitchBtn from "./styled/Switch";
import { useAtom } from "jotai";
import { useState } from "react";
import cn from "classnames";

export default function AutoPlaySwitch({ className }: { className?: string }) {
  const [autoPlay, setAutoPlay] = useAtom(autoPlayNextAtom);
  const [hover, setHover] = useState(false);
  return (
    <Switch.Group>
      <div className={cn("flex items-center gap-1", className)}>
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
