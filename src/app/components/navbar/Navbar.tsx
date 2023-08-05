"use client";
import { HiMenu } from "react-icons/hi";
import { IoNotificationsOutline } from "react-icons/io5";
import { BiEdit } from "react-icons/bi";
import { BiSearchAlt } from "react-icons/bi";

import Avatar from "../Avatar";
import { useRecoilState } from "recoil";
import { createPost } from "@/app/recoil/atoms/modalAtoms";
import { auth, signOutUser } from "@/app/firebase/auth/auth";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react"

const Navbar = () => {
  const [isCreatePost, setIsCreatePost] = useRecoilState(createPost);
  const [showSearchBar, setShowSearchBar] = useState<boolean>(false);

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

  useEffect(() => {
    const handleScroll = () => {
      if (window.pageYOffset > 200) {
        setShowSearchBar(true);
      } else {
        setShowSearchBar(false);
      }
    }


    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [])
  const [user, loading] = useAuthState(auth);

  if (loading) return <div>Loading...</div>;

  return (
    <nav className="sticky top-0 z-10 flex items-center   justify-between  bg-gray-100 px-[5%] py-2 shadow-md backdrop-filter lg:px-[10%]">
      <HiMenu className="text-2xl lg:text-4xl" />
      {
        showSearchBar &&
        <form className="hidden lg:flex w-96 items-center gap-2 rounded-full border-2 border-gray-400  px-4 py-1 absolute left-[calc(10%_+_2.25rem_+_2rem)]">
          <BiSearchAlt size={24} className="fill-gray-600" />
          <input
            type="text"
            placeholder="Search..."
            className="h-8 w-full bg-transparent outline-none"
          />
        </form>
      }

      <button
        onClick={() => router.push("/")}
        className="text-xl font-bold tracking-wide lg:text-2xl"
      >
        DoBlog
      </button>


      <div className="flex items-center gap-6">
        <button className="icon">
          <IoNotificationsOutline className="text-2xl lg:text-[2rem]" />
          <p className="counter">99</p>
        </button>
        <button onClick={handleSignOut} className="flex items-center gap-1 ">
          <Avatar
            imgSrc={user ? user?.photoURL : "/images/profile.jpg"}
          />
          <h1 className="hidden font-medium lg:block">{user?.displayName}</h1>
        </button>

        <button
          className="hover:shadow-m flex items-center gap-2 rounded-lg border-2 border-gray-400 px-2 py-1 transition-all hover:cursor-pointer  lg:px-4 lg:py-2 "
          onClick={() => router.push("/new-blog")}
        >
          <BiEdit className="text-xl lg:text-2xl" />
          <p className="lg:text-md text-sm">Write</p>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
