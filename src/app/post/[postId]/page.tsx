"use client";
import Avatar from "@/app/components/Avatar";
import { auth } from "@/app/firebase/auth/auth";
import { db } from "@/app/firebase/config";
import { DocumentData, doc, getDoc } from "firebase/firestore";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

interface PostPageProps {
  params: {
    postId: string;
  };
}

const PostPage = ({ params }: PostPageProps) => {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const id = params.postId;
  const [post, setPost] = useState<DocumentData>({});

  useEffect(() => {
    const getPost = async () => {
      const docRef = doc(db, "posts", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setPost(docSnap.data());
        console.log("Document data:", docSnap.data());
      } else {
        // docSnap.data() will be undefined in this case
        console.log("No such document!");
      }
    };

    getPost();
  }, []);

  const info = () => {
    console.log(post);
    console.log(post.timestamp.toDate().toDateString());
  };

  if (loading)
    return <div className="mt-32 text-center text-2xl">Loading...</div>;

  if (!user) router.push("/signin");

  return (
    <div onClick={() => info()}>
      <h2>{post.postTitle}</h2>

      <div className="flex">
        <Avatar imgSrc={post.userProfilePic} height={50} width={50} />
        <div className="flex w-full items-start justify-between  lg:block">
          <div className="ml-4 flex flex-col lg:flex-row  lg:items-center lg:gap-2">
            <p className="cursor-pointer  text-xs font-medium lg:text-base ">
              {post.fullName}
            </p>
            <span className="hidden lg:block">.</span>
            <p className=" cursor-pointer text-xs text-gray-500 lg:text-base">{`@${post.username}`}</p>
            <span className="hidden lg:block">.</span>
            <p className=" cursor-pointer text-xs text-green-600 transition  hover:text-green-800 lg:text-base">
              Follow
            </p>
          </div>

          <p className="text-md ml-4 hidden text-gray-500 lg:block">
            {post.timestamp.toDate().toDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PostPage;
