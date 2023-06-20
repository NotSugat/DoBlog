"use client";
import { HiMenu } from "react-icons/hi";
import { IoNotificationsOutline } from "react-icons/io5";
import { BiEdit } from "react-icons/bi";

import Avatar from "../Avatar";
import { useState } from "react";
import CreatePost from "../Posts/CreatePost";
import { useRecoilState } from "recoil";
import { createPost } from "@/app/recoil/atoms/modalAtoms";

const Navbar = () => {
  const [isCreatePost, setIsCreatePost] = useRecoilState(createPost);
  return (
    <nav className="flex items-center justify-between  px-[10%] py-4 shadow-sm">
      <HiMenu size={30} />

      <h1 className="text-2xl font-bold tracking-wide">DoBlog</h1>

      <div className="flex items-center gap-6">
        <button className="icon">
          <IoNotificationsOutline className="" size={32} />
          <p className="counter">99</p>
        </button>
        <Avatar />

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
