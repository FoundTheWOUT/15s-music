"use client";

import { PAGE_SIZE } from "@/const";
import { useRouter, useSearchParams } from "next/navigation";
import { PropsWithChildren, useEffect, useRef } from "react";
import { Event } from "../../event";
import ErrorBoundary from "./ErrorBoundary";

export const playEvent = new Event<{ id: number }>();
export const playNextEvent = new Event<{ index: number }>();

function MusicList({ children, total }: PropsWithChildren<{ total: number }>) {
  const loadingRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") ?? "0");
  const finished = page * PAGE_SIZE >= total;

  useEffect(() => {
    const divNode = loadingRef.current;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !finished) {
        // setSize(size + 1);
        router.replace(`?page=${page + 1}`);
        router.refresh();
      }
    });
    divNode && observer.observe(divNode);
    return () => {
      divNode && observer.unobserve(divNode);
    };
  }, [router, page, finished]);

  return (
    <div>
      <ErrorBoundary>
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-6">
          {children}
        </div>
      </ErrorBoundary>
      {finished && (
        <div className="my-2 text-center text-sm text-gray-500">
          没有更多拉！
        </div>
      )}
      <div ref={loadingRef} className="h-2"></div>
    </div>
  );
}

export default MusicList;
