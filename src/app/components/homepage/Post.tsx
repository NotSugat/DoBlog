import Image from "next/image";
import React from "react";
import { SignatureHelpTriggerReason } from "typescript";
import { Url } from "url";

const Post = ({
  fullName,
  username,
  bio,
  postTitle,
  postContent,
  tags,
  userProfilePic,
  postImage,
  postDate,
}: {
  fullName: String;
  username: String;
  postTitle: String;
  bio: String;
  postContent: String;
  tags: String[];
  userProfilePic: string;
  postImage: string;
  postDate: String;
}) => {
  return (
    <div className="max-w-[60%] cursor-pointer border-2 border-gray-300 p-4">
      <div className="flex  ">
        <Image
          src={userProfilePic}
          alt="User image"
          width={50}
          height={50}
          className="max-h-[50px] rounded-full  hover:cursor-pointer hover:opacity-80"
        />
        <div>
          <div className="ml-4 flex items-center gap-2">
            <p className=" text-md font-medium leading-4">{fullName}</p>
            <p className="text-md text-gray-500">{`@${username}`}</p>.
            <p className="text-md text-gray-500">{postDate}</p>
          </div>
          <p className="text-md ml-4 text-gray-500">{bio}</p>
        </div>
      </div>

      <div className=" grid grid-cols-3 items-center">
        <div className="col-span-2 max-w-[90%] ">
          <h2 className=" truncate-overflow py-2  text-2xl font-medium">
            {postTitle}
          </h2>
          <p>{postContent}</p>
        </div>
        <div className="col-span-1">
          <Image
            src={postImage}
            alt="User image"
            width={1000}
            height={1000}
            className="w aspect-video w-full rounded-lg  hover:cursor-pointer hover:opacity-80"
          />
        </div>
      </div>
    </div>
  );
};
export default Post;
