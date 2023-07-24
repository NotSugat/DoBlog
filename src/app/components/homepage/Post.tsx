import { DocumentData } from "firebase/firestore";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Avatar from "../Avatar";
import { AiOutlineMinusCircle } from "react-icons/ai";
import { FaRegCommentDots } from "react-icons/fa";
import { BsBookmarkPlus, BsBookmarkFill } from "react-icons/bs";
import { BiDotsHorizontal } from "react-icons/bi";
import { get } from "http";
import Tag from "../Tag";

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
    const firebaseTimestamp = post.timestamp.seconds * 1000;

    const currentTimestamp = new Date().getTime();

    const timeDiff = currentTimestamp - firebaseTimestamp;
    console.log(firebaseTimestamp);
    console.log(currentTimestamp);
    console.log("timeDiff", timeDiff);
    console.log(post.timestamp.toMillis());
    console.log(getPostTime());
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

  useEffect(() => {
    getContent();
  }, []);

  return (
    <div
      className=" w-full border-2  border-gray-300 p-4 lg:h-[20rem] lg:max-w-[60%]"
      onClick={info}
    >
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
      <div className="grid  cursor-pointer  grid-cols-3 py-4 lg:py-0">
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
        <div>
          <Tag tagName="Mrbeast6000" />
          <Tag tagName="2v2" />
        </div>

        <div className="b right-0 mr-4 flex items-center gap-1">
          {!isBookmarked ? (
            <button onClick={() => setIsBookmarked(true)} title="Set Bookmark">
              <BsBookmarkPlus className=" cursor-pointer  p-1 text-2xl transition-all duration-150 ease-in-out hover:fill-green-700 lg:text-4xl" />
            </button>
          ) : (
            <button
              onClick={() => setIsBookmarked(false)}
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
