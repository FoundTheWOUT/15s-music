"use client";

import { useAuthentication } from "@/hooks";
import { PropsWithChildren, Suspense } from "react";
import TokenInput from "./Token";

// const allowList = ["master", "guest"];

function AuthenticationGuard({
  children,
  allowGuest = false,
}: PropsWithChildren<{ allowGuest?: boolean }>) {
  const { data } = useAuthentication();

  if (!data) return <div>loading</div>;

  if (data.role === "master" || (data.role === "guest" && allowGuest)) {
    return <Suspense>{children}</Suspense>;
  }

  return <TokenInput />;
}

export default AuthenticationGuard;
