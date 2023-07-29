import {
  DocumentData,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import Image from "next/image";
import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import Avatar from "../Avatar";
import { AiOutlineMinusCircle } from "react-icons/ai";
import { BsBookmarkPlus, BsBookmarkFill } from "react-icons/bs";
import { BiDotsHorizontal } from "react-icons/bi";
import Tag from "../Tag";
import { db } from "@/app/firebase/config";
import { auth } from "@/app/firebase/auth/auth";
import { useRouter } from "next/navigation";

interface BlockFile {
  url: string;
}
interface BlockImage {
  caption: string;
  file: BlockFile;
}

const Post = ({ id, post }: { id: string; post: DocumentData }) => {
  const [text, setText] = useState("");
  const [image, setImage] = useState<BlockImage[]>([]);
  const [isBookmarked, setIsBookmarked] = useState<Boolean>(false);
  const [isInterested, setIsInterested] = useState<Boolean>(true);
  const router = useRouter();

  const getContent = () => {
    {
      const blockTexts = post.postContent.blocks
        .filter((block: any) => block.type === "paragraph")
        .map((block: any) => block.data.text);

      const blockImages: BlockImage[] = post.postContent.blocks
        .filter((block: any) => block.type === "image")
        .map((block: any) => ({
          caption: block.data.caption,
          file: block.data.file,
        }));

      setText(blockTexts);
      setImage(blockImages);
    }
  };

  const info = () => {
    console.log(image);
  };

  const getPostTime = () => {
    const firebaseTimestamp = post.timestamp.seconds * 1000;

    const currentTimestamp = new Date().getTime();

    const timeDiff = currentTimestamp - firebaseTimestamp;

    const oneHour = 60 * 60 * 1000;
    const oneDay = 24 * oneHour;
    const oneWeek = 7 * oneDay;

    let formattedTime;

    if (timeDiff < oneHour) {
      const minutes = Math.floor(timeDiff / (60 * 1000));
      formattedTime = `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    } else if (timeDiff < oneDay) {
      const hours = Math.floor(timeDiff / oneHour);
      formattedTime = `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else if (timeDiff < oneWeek) {
      const days = Math.floor(timeDiff / oneDay);
      formattedTime = `${days} day${days > 1 ? "s" : ""} ago`;
    } else {
      const date = new Date(firebaseTimestamp);
      const month = date.toLocaleString("default", { month: "short" });
      const day = date.getDate();
      formattedTime = `${month} ${day}`;
    }

    return formattedTime;
  };

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
  const getBookmark = async () => {
    const querySnapshot = await getDocs(
      collection(db, "bookmarks", "users", `${auth?.currentUser?.uid}`)
    );
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      data: doc.data(),
    }));
  };

  // set Bookmark as true if post is bookmarked when component loads
  useEffect(() => {
    const checkBookmark = async () => {
      const bookmarks = await getDocs(
        collection(db, "bookmarks", "users", `${auth?.currentUser?.uid}`)
      );
      const bookmarkID = bookmarks.docs.find((doc) => id === doc.data().postID);

      if (bookmarkID) {
        setIsBookmarked(true);
      }
    };

    checkBookmark();
  }, []);

  useEffect(() => {
    getContent();
  }, []);

  return (
    <div className=" w-full border-2  border-gray-300 p-4 lg:h-[20rem] lg:max-w-[60%]">
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
            <p className="hidden select-none text-sm text-gray-500 lg:block xl:text-base">
              {getPostTime()}
            </p>
          </div>
          <p className="select-none text-xs text-gray-500 lg:hidden ">
            {getPostTime()}
          </p>
          <p className="text-md ml-4 hidden text-gray-500 lg:block">{`bio`}</p>
        </div>
      </div>

      {/* Post content tile and content */}
      <div
        className="grid  cursor-pointer  grid-cols-3 py-4 lg:py-0"
        onClick={() => router.push(`/post/${id}`)}
      >
        <div className="col-span-2 max-h-[40%]   ">
          <h2 className=" truncate-overflow  py-2 text-lg font-medium leading-5 lg:text-2xl">
            {post.postTitle}
          </h2>
          <p className="truncate-overflow-text text-sm lg:text-lg">{text}</p>
        </div>
        <div className="col-span-1 flex items-center justify-center ">
          {image.length > 0 && (
            <Image
              src={image[0].file.url}
              alt="User image"
              width={1000}
              height={1000}
              className=" aspect-square h-24 w-24 rounded-lg object-cover   hover:cursor-pointer hover:opacity-80 lg:h-44 lg:w-44"
            />
          )}
        </div>
      </div>

      {/* Tags and options */}
      <div className="flex w-full items-center justify-between p-1 lg:max-w-[60%] ">
        <div className="space-x-2">
          <Tag tagName="Mrbeast6000" />
          <Tag tagName="2v2" />
        </div>

        <div className="b right-0 mr-4 flex items-center gap-1">
          {!isBookmarked ? (
            <button
              onClick={() => {
                handleBookmark();
                setIsBookmarked(true);
              }}
              title="Set Bookmark"
            >
              <BsBookmarkPlus className=" cursor-pointer  p-1 text-2xl transition-all duration-150 ease-in-out hover:fill-green-700 lg:text-4xl" />
            </button>
          ) : (
            <button
              onClick={() => {
                handleBookmark();
                setIsBookmarked(false);
              }}
              title="Remove Bookmark"
            >
              <BsBookmarkFill className="cursor-pointer p-1 text-2xl transition-all duration-150 ease-in-out hover:fill-red-500 lg:text-4xl" />
            </button>
          )}
          <button
            title="Not Interested"
            onClick={() => setIsInterested(!isInterested)}
          >
            <AiOutlineMinusCircle
              className={`post-icon   ${isInterested ? "" : "fill-red-500"}`}
            />
          </button>
          <button title="More Settings">
            <BiDotsHorizontal className="post-icon" />
          </button>
        </div>
      </div>
    </div>
  );
};
export default Post;
