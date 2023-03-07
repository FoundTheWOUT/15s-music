"use client";

import { useAuthentication } from "@/hooks";
import { PropsWithChildren, Suspense } from "react";
import TokenInput from "./Token";

function AuthenticationGuard({ children }: PropsWithChildren<{}>) {
  const { data } = useAuthentication();

  if (!data) return <div>loading</div>;
  if (data.role !== "master") {
    return <TokenInput />;
  }
  return <Suspense>{children}</Suspense>;
}

export default AuthenticationGuard;
