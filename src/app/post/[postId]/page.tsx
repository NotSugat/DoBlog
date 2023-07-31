"use client";
import Avatar from "@/app/components/Avatar";
import EditorOutput from "@/app/components/EditorOutput";
import Tag from "@/app/components/Tag";
import Navbar from "@/app/components/navbar/Navbar";
import { auth } from "@/app/firebase/auth/auth";
import { db } from "@/app/firebase/config";
import {
  DocumentData,
  addDoc,
  collection,
  doc,
  getDoc,
  setDoc,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { AiFillHeart, AiOutlineHeart, AiOutlineShareAlt } from "react-icons/ai";
import { BiDotsHorizontal } from "react-icons/bi";
import { BsBookmarkFill, BsBookmarkPlus } from "react-icons/bs";
import { FaRegComment } from "react-icons/fa";

interface PostPageProps {
  params: {
    postId: string;
  };
}

interface BlockFile {
  url: string;
}
interface BlockImage {
  caption: string;
  file: BlockFile;
}
interface Item {
  blocks: Array<{
    data?: {
      text?: string;
      caption?: string;
      file?: {
        url?: string;
      };
      items?: string[];
    };
    stretched?: boolean;
    withBackground?: boolean;
    withBorder?: boolean;
    style?: string;
    id: string;
    type: string;
  }>;
}

const PostPage = ({ params }: PostPageProps) => {
  const [user, loading] = useAuthState(auth);
  const [isLiked, setIsLiked] = useState<Boolean>(false);
  const [isBookmarked, setIsBookmarked] = useState<Boolean>(false);
  const [blocks, setBlocks] = useState([]);
  const [followed, setFollowed] = useState<Boolean>(false);

  const router = useRouter();
  const id = params.postId;
  const [post, setPost] = useState<DocumentData>({});

  const getContent = () => {
    const blockItems = post.postContent?.blocks.map((block: any) => block.data);

    setBlocks(blockItems);
  };

  const info = () => {
    console.log(post);
    console.log(post.timestamp.toDate().toDateString());
    console.log(post.postContent);
  };

  const handleLike = async () => { };

  const handleBookmark = async () => {
    try {
      if (!isBookmarked) {
        const bookmarkRef = await addDoc(
          collection(db, "bookmarks", "users", `${auth?.currentUser?.uid}`),
          {
            postID: id,
          }
        );
        const docRef = doc(db, "posts", id);
        const docSnap = await getDoc(docRef);

        const currentBookmarkCount = docSnap.data()?.bookmarkCount || 0;

        const newBookmarkCount = currentBookmarkCount + 1;

        await setDoc(docRef, {
          ...docSnap.data(),
          bookmarkCount: newBookmarkCount,
        });

        console.log("Bookmark no: ", post.bookmarkCount);
        console.log("Bookmark added with ID: ", bookmarkRef.id);
      } else {
        const bookmarks = await getDocs(
          collection(db, "bookmarks", "users", `${auth?.currentUser?.uid}`)
        );
        const bookmarkID = bookmarks.docs.find(
          (doc) => id === doc.data().postID
        );

        if (bookmarkID) {
          await deleteDoc(bookmarkID.ref);

          const docRef = doc(db, "posts", id);
          const docSnap = await getDoc(docRef);
          const currentBookmarkCount = docSnap.data()?.bookmarkCount || 0;
          const newBookmarkCount = currentBookmarkCount - 1;

          await setDoc(docRef, {
            ...docSnap.data(),
            bookmarkCount: newBookmarkCount,
          });
          console.log("Bookmark no: ", post.bookmarkCount);
          console.log("Bookmark deleted with ID: ", bookmarkID.ref);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

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
    getContent();
  }, []);

  if (loading)
    return <div className="mt-32 text-center text-2xl">Loading...</div>;

  if (!user) router.push("/signin");

  return (
    <div onClick={() => info()}>
      <Navbar />
      <div className="mx-auto mt-8 w-[90%] lg:max-w-[40%] ">
        <h2 className=" py-4 text-4xl font-bold ">{post.postTitle}</h2>

        {/* User Profile section  */}
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
              <span
                className={` cursor-pointer select-none text-xs text-green-600  transition hover:text-green-800 lg:text-base`}
                onClick={() => setFollowed(!followed)}
              >
                {followed ? "Following" : "Follow"}
              </span>
            </div>

            <p className="text-md ml-4 hidden text-gray-500 lg:block">
              {post.timestamp?.toDate().toDateString()}
            </p>
          </div>
        </div>
        {/* Reaction section */}
        <div className="right-0 mr-4 mt-6 flex items-center justify-between gap-1">
          <div className="flex gap-6">
            <div className="flex items-center">
              {!isLiked ? (
                <button
                  onClick={() => {
                    handleLike();
                    setIsLiked(true);
                  }}
                  title="Like"
                >
                  <AiOutlineHeart className=" cursor-pointer  p-1 text-2xl transition-all  ease-in-out hover:fill-red-500 lg:text-3xl" />
                </button>
              ) : (
                <button
                  onClick={() => {
                    handleLike();
                    setIsLiked(false);
                  }}
                  title="UnLike"
                >
                  <AiFillHeart className="cursor-pointer fill-red-500 p-1 text-2xl transition-all  ease-in-out hover:opacity-80 lg:text-3xl" />
                </button>
              )}

              <p className="text-gray-600 sm:text-sm lg:text-base ">99.13k</p>
            </div>

            <div className="flex items-center">
              <FaRegComment className="cursor-pointer  p-1 text-2xl transition-all  ease-in-out hover:fill-red-500 lg:text-3xl" />
              <p className="text-gray-600 sm:text-sm lg:text-base ">99.12k</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {!isBookmarked ? (
              <button
                onClick={() => {
                  handleBookmark();
                  setIsBookmarked(true);
                }}
                title="Set Bookmark"
              >
                <BsBookmarkPlus className=" cursor-pointer  p-1 text-2xl transition-all duration-150 ease-in-out hover:fill-green-700 lg:text-3xl" />
              </button>
            ) : (
              <button
                onClick={() => {
                  handleBookmark();
                  setIsBookmarked(false);
                }}
                title="Remove Bookmark"
              >
                <BsBookmarkFill className="cursor-pointer p-1 text-2xl transition-all duration-150 ease-in-out hover:fill-red-500 lg:text-3xl" />
              </button>
            )}
            <button>
              <AiOutlineShareAlt className="cursor-pointer  p-1 text-2xl transition-all duration-150 ease-in-out hover:fill-green-700 lg:text-3xl" />
            </button>
            <button title="More Settings">
              <BiDotsHorizontal className="post-icon" />
            </button>
          </div>
        </div>

        {/* Block preview */}
        <div className="mt-8">
          <EditorOutput content={post.postContent} />

          <div className="mt-8 flex flex-wrap gap-4">
            <Tag tagName={"Design"} />
            <Tag tagName={"UI/UX"} />
          </div>
        </div>

        {/* User info section */}
        <div className=" mt-8 bg-[#e7e5e5] px-4 py-8">
          <div className="flex items-center  justify-between py-4 ">
            <Image
              src={post.userProfilePic}
              alt="profile pic"
              height={1000}
              width={1000}
              className="h-8 w-8 rounded-full border-2 border-gray-400 p-[1px] shadow-sm  hover:cursor-pointer hover:opacity-80 lg:h-20 lg:w-20"
            />

            <div>
              <button
                className={`rounded-full ${followed
                  ? "border-2 border-black bg-transparent text-black"
                  : "bg-[#111] text-white"
                  } px-4 py-2`}
                onClick={() => setFollowed(!followed)}
              >
                {followed ? "Following" : "Follow"}
              </button>
            </div>
          </div>

          <h2 className="text-bold  cursor-pointer text-sm lg:text-2xl">
            Written by {post.fullName}
          </h2>
          <p className="text-sm text-gray-700  lg:text-base">
            99.12k Followers
          </p>
          <p className=" mt-2 text-base ">bio is the bio and bio is my bio</p>

          <p className=" mt-2 text-base">
            <span className="font-semibold">More from </span>
            <span className=" cursor-pointer text-xs text-gray-700 transition-colors hover:text-gray-900 lg:text-base">{`@${post.username}`}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PostPage;
