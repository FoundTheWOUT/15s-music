"use client";

import cn from "classnames";
import { Switch, SwitchProps } from "@headlessui/react";
import { ElementType } from "react";

function StyledSwitch(props: SwitchProps<ElementType>) {
  return (
    <Switch
      className={cn(
        props.checked ? "bg-[#fc6767]" : "bg-[#fc6767]/30",
        "relative inline-flex h-[20px] w-[40px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75"
      )}
      {...props}
    >
      <span
        aria-hidden="true"
        className={cn(
          props.checked ? "translate-x-5" : "translate-x-0",
          "pointer-events-none inline-block h-[16px] w-[16px] transform rounded-full bg-white shadow-lg ring ring-[#fc6767] transition duration-200 ease-in-out"
        )}
      />
    </Switch>
  );
}

export default StyledSwitch;
