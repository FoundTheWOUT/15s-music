"use client";

import { Popover } from "@headlessui/react";
import { AdjustmentsHorizontalIcon, CogIcon } from "@heroicons/react/24/solid";
import AutoPlayNextSwitch from "./AutoPlayNextSwitch";
import AutoPlaySwitch from "./AutoPlaySwitch";

function Settings() {
  return (
    <Popover className="relative">
      <Popover.Button className="flex items-center gap-1 outline-none">
        <span className="font-bold text-primary">设置</span>
        <CogIcon className="w-5 rounded-full text-primary" />
      </Popover.Button>

      <Popover.Panel className="absolute right-0 mt-2 w-48 rounded bg-white p-4 shadow-primary/10 border border-primary">
        <AutoPlaySwitch className="justify-between" />
        <div className="my-2 h-[1px] w-full bg-primary/30"></div>
        {/* <div className="mx-2 h-3/5 w-[2px] bg-slate-200"></div> */}
        <AutoPlayNextSwitch className="justify-between" />
      </Popover.Panel>
    </Popover>
  );
}

export default Settings;
