"use client";
import Image from "next/image";
import HomePage from "./home/page";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase/auth/auth";
import SignIn from "./signin/page";

export default function Home() {
  const [user, loading] = useAuthState(auth);

  if (loading)
    return <div className="mt-32 text-center text-2xl">Loading...</div>;

  if (user) {
    return <HomePage />;
  } else {
    return <SignIn />;
  }
}
