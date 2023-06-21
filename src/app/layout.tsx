"use client";
import Navbar from "./components/navbar/Navbar";
import "./globals.css";
import { Nunito } from "next/font/google";
import { RecoilRoot } from "recoil";

const font = Nunito({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
        <body className={font.className}>
        <RecoilRoot>
          {children}
        </RecoilRoot>
        </body>
      </html>
  );
}
