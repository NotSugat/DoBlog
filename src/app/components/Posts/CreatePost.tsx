"use client";
import { createPost } from "@/app/recoil/atoms/modalAtoms";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import Avatar from "../Avatar";
import { IoCloseSharp } from "react-icons/io5";

const CreatePost = () => {
  const [isCreatePost, setIsCreatePost] = useRecoilState(createPost);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const openDialog = () => {
    setIsCreatePost(true);
  };

  const closeDialog = () => {
    setIsCreatePost(false);
  };

  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeDialog();
      }
    };

    if (isCreatePost) {
      document.addEventListener("keydown", handleEscapeKey);
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isCreatePost]);

  return (
    <div>
      {isCreatePost && (
        <div className="fixed inset-0 flex  items-center justify-center bg-gray-500 bg-opacity-50">
          <div className="w-[90%] rounded-lg bg-white p-8 md:w-[400px] xl:w-[600px]">
            <div className="relative border-b-2 border-gray-400  text-center">
              <h2 className="text-2xl font-medium">Create Post</h2>
              <button
                className="absolute right-1 top-0 rounded-full p-1 transition-all duration-200 ease-in-out hover:cursor-pointer hover:bg-gray-200 hover:fill-red-500"
                onClick={closeDialog}
              >
                <IoCloseSharp size={20} />
              </button>
            </div>

            <div className="mt-2 flex items-center">
              <Avatar />
              <div>
                <div className="ml-4 ">
                  <p className=" text-md font-medium leading-4">Sphinx Crux</p>
                  <p className="text-md text-gray-500">@crux</p>
                </div>
              </div>
            </div>
            <form action="submit">
              <input
                placeholder="Title"
                className="mt-4 h-full w-full resize-none rounded-lg border border-gray-200  p-2 outline-none"
              />
              <textarea
                placeholder="What's in your mind?..."
                className="border-gray-20 mt-1 h-24 w-full resize-none rounded-lg border  p-2 outline-none"
              />

              <button className="w-full rounded-md bg-gray-300 px-4 py-2 text-lg font-medium hover:opacity-80 ">
                Post
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatePost;
