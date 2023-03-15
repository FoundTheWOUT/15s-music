import "./globals.css";
import "antd/dist/reset.css";
import AutoPlaySwitch from "./components/AutoPlaySwitch";
import AutoPlayNextSwitch from "./components/AutoPlayNextSwitch";
import Link from "next/link";
import {
  AdjustmentsHorizontalIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/solid";
import { Analytics } from "@vercel/analytics/react";
import Settings from "./components/Settings";

export const metadata = {
  title: "15S Music",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="mx-auto max-w-7xl px-4">
        {/* header */}
        <header className="sticky top-2 z-50 my-2 flex justify-between rounded-xl p-2 backdrop-blur">
          <Link
            href="/"
            className="bg-gradient-to-r from-[#ec008c] to-[#fc6767] bg-clip-text text-3xl font-extrabold text-transparent"
          >
            15S Music
          </Link>

          <div className="flex items-center">
            <Link href="/music/add">
              <div className="btn flex items-center gap-1">
                <span className="font-bold text-primary">上传音乐</span>
                <PlusCircleIcon className="w-5 rounded-full text-primary " />
              </div>
            </Link>
            {/* divider */}
            <div className="mx-2 h-3/5 w-[2px] bg-slate-200"></div>
            <Settings />
            {/* <AutoPlaySwitch />
            <div className="mx-2 h-3/5 w-[2px] bg-slate-200"></div>
            <AutoPlayNextSwitch /> */}
          </div>
        </header>

        {/* main */}
        {children}
        <Analytics />
      </body>
    </html>
  );
}
