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
    <nav className="flex items-center justify-between   py-4 shadow-sm">
      <HiMenu size={30} />

      <h1 className="text-2xl font-bold tracking-wide">DoBlog</h1>

      <div className="flex items-center gap-6">
        <button className="icon">
          <IoNotificationsOutline className="" size={32} />
          <p className="counter">99</p>
        </button>
        <button onClick={handleSignOut} className="flex items-center gap-1 ">
          <Avatar />
          <h1 className="font-medium">{user?.displayName}</h1>
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
