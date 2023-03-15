"use client";

import { Popover } from "@headlessui/react";
import { AdjustmentsHorizontalIcon, CogIcon } from "@heroicons/react/24/solid";
import AutoPlayNextSwitch from "./AutoPlayNextSwitch";
import AutoPlaySwitch from "./AutoPlaySwitch";

function Settings() {
  return (
    <Popover className="relative">
      <Popover.Button>
        <div className="btn flex items-center gap-1">
          <span className="font-bold text-primary">设置</span>
          <CogIcon className="w-5 rounded-full text-primary" />
        </div>
      </Popover.Button>

      <Popover.Panel className="absolute right-0 mt-2 w-48 rounded bg-white p-4 shadow-xl">
        <AutoPlaySwitch />
        {/* <div className="mx-2 h-3/5 w-[2px] bg-slate-200"></div> */}
        <AutoPlayNextSwitch />
      </Popover.Panel>
    </Popover>
  );
}

export default Settings;
