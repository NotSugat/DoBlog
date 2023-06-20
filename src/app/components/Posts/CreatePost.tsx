"use client";
import { createPost } from "@/app/recoil/atoms/modalAtoms";
import Image from "next/image";
import { useState } from "react";
import { useRecoilState } from "recoil";

const CreatePost = () => {
  const [isCreatePost, setIsCreatePost] = useRecoilState(createPost);

  const openDialog = () => {
    setIsCreatePost(true);
  };

  const closeDialog = () => {
    setIsCreatePost(false);
  };
  return (
    <div>
      {isCreatePost && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
          <div className="rounded-lg bg-white p-8">
            {/* Dialog content goes here */}
            <h2>Create Post</h2>
            <p>This is the dialog content.</p>
            <button onClick={closeDialog}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatePost;
