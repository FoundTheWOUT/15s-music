import { useAtom } from "jotai";
import useSWR from "swr";
import { tokenAtom } from "./state";

export const useAuthentication = () => {
  const [token, setToken] = useAtom(tokenAtom);

  const { data, mutate } = useSWR("authentication", () =>
    fetch(`/api/authentication?token=${token}`).then((res) => res.json())
  );

  return {
    data,
    mutate,
  };
};
