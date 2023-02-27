"use client";

import { PAGE_SIZE } from "@/const";
import { useRouter, useSearchParams } from "next/navigation";
import { PropsWithChildren, useEffect, useRef } from "react";
import { Event } from "../event";
import ErrorBoundary from "./ErrorBoundary";

export const playEvent = new Event<{ id: number }>();

function MusicList({ children, total }: PropsWithChildren<{ total: number }>) {
  const loadingRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") ?? "0");
  const finished = page * PAGE_SIZE >= total;

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !finished) {
        // setSize(size + 1);
        router.replace(`?page=${page + 1}`);
        router.refresh();
      }
    });
    if (loadingRef.current) {
      observer.observe(loadingRef.current);
    }
    return () => {
      loadingRef.current && observer.unobserve(loadingRef.current);
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
