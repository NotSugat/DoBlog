import { DocumentData } from "firebase/firestore";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Avatar from "../Avatar";
import { AiOutlineMinusCircle } from "react-icons/ai";
import { FaRegCommentDots } from "react-icons/fa";
import { BsBookmarkPlus, BsBookmarkFill } from "react-icons/bs";
import { BiDotsHorizontal } from "react-icons/bi";
import { get } from "http";

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
    <div className="max-w-[60%] border-2 border-gray-300 p-4" onClick={info}>
      <div className="flex">
        <Avatar imgSrc={post.userProfilePic} height={50} width={50} />
        <div>
          <div className="ml-4 flex items-center gap-2">
            <p className=" text-md cursor-pointer font-medium leading-4">
              {post.fullName + " ."}
            </p>
            <p className="text-md cursor-pointer text-gray-500">{`@${post.username}`}</p>
            .
            <p className="text-md  select-none text-gray-500">
              {getPostTime()}
            </p>
          </div>
          <p className="text-md ml-4 text-gray-500">{`bio`}</p>
        </div>
      </div>

      <div className=" grid grid-cols-3  ">
        <div className="col-span-2 max-w-[90%]  ">
          <h2 className=" truncate-overflow py-2  text-2xl font-medium">
            {post.postTitle}
          </h2>
          <p>{text}</p>
          <div className="right-0 flex items-center justify-end gap-1  px-8 pt-4">
            {!isBookmarked ? (
              <button
                onClick={() => setIsBookmarked(true)}
                title="Set Bookmark"
              >
                <BsBookmarkPlus
                  size={32}
                  className="cursor-pointer p-1 transition-all duration-150 ease-in-out hover:fill-green-700"
                />
              </button>
            ) : (
              <button
                onClick={() => setIsBookmarked(false)}
                title="Remove Bookmark"
              >
                <BsBookmarkFill
                  size={32}
                  className="cursor-pointer p-1 transition-all duration-150 ease-in-out hover:fill-red-500"
                />
              </button>
            )}
            <button title="Not Interested">
              <AiOutlineMinusCircle
                size={32}
                className="post-icon hover:fill-red-500"
              />
            </button>
            <button title="More Settings">
              <BiDotsHorizontal size={32} className="post-icon" />
            </button>
          </div>
        </div>
        <div className="col-span-1 flex items-center justify-center ">
          {image.length > 0 && (
            <Image
              src={image[0].file.url}
              alt="User image"
              width={1000}
              height={1000}
              className=" aspect-square h-44 w-44   rounded-lg object-cover hover:cursor-pointer hover:opacity-80"
            />
          )}
        </div>
      </div>
    </div>
  );
};
export default Post;
