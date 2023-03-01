"use client";

import { useAuthentication } from "@/hooks";
import { tokenAtom } from "@/state";
import { Button, Input } from "antd";
import { useAtom } from "jotai";
import { useState } from "react";

function TokenInput() {
  const [tokenInput, setTokenInput] = useState("");
  const [, setToken] = useAtom(tokenAtom);
  const { mutate } = useAuthentication();

  return (
    <>
      <Input
        value={tokenInput}
        onChange={(e) => setTokenInput(e.currentTarget.value)}
      />
      <Button
        onClick={() => {
          setToken(tokenInput);
          mutate(tokenInput);
        }}
      >
        Token
      </Button>
    </>
  );
}

export default TokenInput;
