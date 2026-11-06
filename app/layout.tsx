import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "Sudut — Setiap sisi, jadi cerita.",
  description: "Panduan foto objek untuk referensi model 3D.",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
