"use client";
import { createPost } from "@/app/recoil/atoms/modalAtoms";
import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import Avatar from "../Avatar";
import { IoCloseSharp } from "react-icons/io5";
import { db } from "@/app/firebase/config";
import { collection, addDoc } from "firebase/firestore";
import { auth } from "@/app/firebase/auth/auth";
import { getAuth } from "firebase/auth";

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

  const auth = getAuth();

  const addPost = async () => {
    try {
      const docRef = await addDoc(collection(db, "posts"), {
        fullName: auth.currentUser?.displayName,
        username: auth.currentUser?.displayName?.split(" ")[0],
        postTitle: title,
        postContent: content,
        userProfilePic: auth.currentUser?.photoURL,
        postImage: "",
      });

      console.log("Document written with ID: ", docRef.id);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      await addPost();
      setTitle("");
      setContent("");
    } catch (error) {
      console.log("can't add to the firebase");
    }
  };

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
                  <p className=" text-md font-medium leading-4">
                    {auth.currentUser?.displayName}
                  </p>
                  <p className="text-md text-gray-500">{`@${
                    auth.currentUser?.displayName?.split(" ")[0]
                  }`}</p>
                </div>
              </div>
            </div>
            <form action="submit" onSubmit={handleSubmit}>
              <input
                placeholder="Title"
                className="mt-4 h-full w-full resize-none rounded-lg border border-gray-200  p-2 outline-none"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <textarea
                placeholder="What's in your mind?..."
                className="border-gray-20 mt-1 h-24 w-full resize-none rounded-lg border  p-2 outline-none"
                value={content}
                onChange={(e) => setContent(e.target.value)}
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
