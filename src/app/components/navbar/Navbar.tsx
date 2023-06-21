"use client";
import { HiMenu } from "react-icons/hi";
import { IoNotificationsOutline } from "react-icons/io5";
import { BiEdit } from "react-icons/bi";

import Avatar from "../Avatar";
import { useRecoilState } from "recoil";
import { createPost } from "@/app/recoil/atoms/modalAtoms";
import { signOutUser } from "@/app/firebase/auth/auth";
import { useRouter } from "next/navigation";
import { User, getAuth } from "firebase/auth";
import { useEffect, useState } from "react";

const Navbar = () => {
  const [isCreatePost, setIsCreatePost] = useRecoilState(createPost);
  const [user, setUser] = useState<User | null>(null); // 
  const router = useRouter();
  const handleSignOut = async () => {
    const { result, error } = await signOutUser();

    if (error) {
      console.log(error);
    }

    // else successful
    console.log(result);
    return router.push("/signin");
  };

  const auth = getAuth();
  
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (!user) {
        // return router.push("/signin");
        console.log("no user");
      }
      setUser(user);
    });  
  },[]);

  return (
    <nav className="flex items-center justify-between   py-4 shadow-sm">
      <HiMenu size={30} />

      <h1 className="text-2xl font-bold tracking-wide">DoBlog</h1>

      <div className="flex items-center gap-6">
        <button className="icon">
          <IoNotificationsOutline className="" size={32} />
          <p className="counter">99</p>
        </button>
        <button onClick={handleSignOut}>
          <Avatar />
          <h1>{user?.displayName}</h1>
        </button>

        <button
          className="flex items-center gap-2 rounded-lg border-2 border-gray-400 px-4 py-2 transition-all hover:cursor-pointer hover:shadow-md "
          onClick={() => setIsCreatePost(!isCreatePost)}
        >
          <BiEdit size={20} />
          <p className="text-md">Write</p>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
