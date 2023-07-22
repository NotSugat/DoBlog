"use client";
import { ToastContainer } from "react-toastify";
import "./globals.css";
import { Poppins } from "next/font/google";
import { RecoilRoot } from "recoil";

const font = Poppins({ weight: "400", subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={font.className}>
        <RecoilRoot>
          <ToastContainer
            position="top-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
          {children}
        </RecoilRoot>
      </body>
    </html>
  );
}
