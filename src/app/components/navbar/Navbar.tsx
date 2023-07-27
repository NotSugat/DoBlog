"use client";
import { HiMenu } from "react-icons/hi";
import { IoNotificationsOutline } from "react-icons/io5";
import { BiEdit } from "react-icons/bi";

import Avatar from "../Avatar";
import { useRecoilState } from "recoil";
import { createPost } from "@/app/recoil/atoms/modalAtoms";
import { auth, signOutUser } from "@/app/firebase/auth/auth";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";

const Navbar = () => {
  const [isCreatePost, setIsCreatePost] = useRecoilState(createPost);
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
  const [user, loading] = useAuthState(auth);

  if (loading) return <div>Loading...</div>;

  return (
    <nav className="sticky top-0 flex items-center justify-between   bg-gray-100  px-[5%] py-4 shadow-md backdrop-filter lg:px-[10%]">
      <HiMenu className="text-2xl lg:text-4xl" />

      <h1 className="text-xl font-bold tracking-wide lg:text-2xl">DoBlog</h1>

      <div className="flex items-center gap-6">
        <button className="icon">
          <IoNotificationsOutline className="text-2xl lg:text-[2rem]" />
          <p className="counter">99</p>
        </button>
        <button onClick={handleSignOut} className="flex items-center gap-1 ">
          <Avatar
            imgSrc={user ? user?.photoURL : "/images/profile.jpg"}
            height={40}
            width={40}
          />
          <h1 className="hidden font-medium lg:block">{user?.displayName}</h1>
        </button>

        <button
          className="hover:shadow-m flex items-center gap-2 rounded-lg border-2 border-gray-400 px-2 py-1 transition-all hover:cursor-pointer  lg:px-4 lg:py-2 "
          onClick={() => setIsCreatePost(!isCreatePost)}
        >
          <BiEdit className="text-xl lg:text-2xl" />
          <p className="lg:text-md text-sm">Write</p>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
