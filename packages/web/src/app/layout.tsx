import "./globals.css";
import AutoPlaySwitch from "./components/AutoPlaySwitch";
import Link from "next/link";
import { Analytics } from '@vercel/analytics/react';

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
        <header className="sticky top-2 z-50 my-2 flex justify-between rounded-xl p-2 backdrop-blur">
          <Link
            href="/"
            className="bg-gradient-to-r from-[#ec008c] to-[#fc6767] bg-clip-text text-3xl font-extrabold text-transparent"
          >
            15S Music
          </Link>
          <AutoPlaySwitch />
        </header>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
