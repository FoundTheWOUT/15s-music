import "./globals.css";

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
      <body className="px-4">{children}</body>
    </html>
  );
}
