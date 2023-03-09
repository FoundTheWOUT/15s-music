import { useAtom } from "jotai";
import { useRef } from "react";
import useSWR from "swr";
import { isBrowser } from "./const";
import { tokenAtom } from "./state";

export const useAuthentication = () => {
  let localToken = "";
  if (isBrowser) {
    const tokenFromStorage = localStorage.getItem("token");
    localToken = tokenFromStorage ? JSON.parse(tokenFromStorage) : "";
  }
  const [token, setToken] = useAtom(tokenAtom);

  const { data, mutate } = useSWR("authentication", () =>
    fetch(`/api/authentication?token=${token || localToken}`).then((res) =>
      res.json()
    )
  );

  return {
    data,
    mutate,
  };
};

export const useDebounce = (cb: any, params?: { delay: number }) => {
  const { delay = 800 } = params ?? {};
  const timeoutId = useRef<any>(-1);
  const trigger = () => {
    clearTimeout(timeoutId.current);
    timeoutId.current = setTimeout(() => {
      cb();
    }, delay);
  };
  const stop = () => {
    clearTimeout(timeoutId.current);
  };

  return {
    trigger,
    stop,
  };
};
