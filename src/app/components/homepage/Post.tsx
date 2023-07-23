import { DocumentData } from "firebase/firestore";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Avatar from "../Avatar";

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
    console.log(text);
    console.log(image);
  };

  useEffect(() => {
    getContent();
  }, []);

  return (
    <div
      className="max-w-[60%] cursor-pointer border-2 border-gray-300 p-4"
      onClick={info}
    >
      <div className="flex">
        <Avatar imgSrc={post.userProfilePic} height={50} width={50} />
        <div>
          <div className="ml-4 flex items-center gap-2">
            <p className=" text-md font-medium leading-4">
              {post.fullName + " ."}
            </p>
            <p className="text-md text-gray-500">{`@${post.username}`}</p>.
            <p className="text-md text-gray-500">{post.postDate}</p>
          </div>
          <p className="text-md ml-4 text-gray-500">{`bio`}</p>
        </div>
      </div>

      <div className=" grid grid-cols-3 items-center">
        <div className="col-span-2 max-w-[90%] ">
          <h2 className=" truncate-overflow py-2  text-2xl font-medium">
            {post.postTitle}
          </h2>
          <p>{text}</p>
        </div>
        <div className="col-span-1">
          {image.length > 0 && (
            <Image
              src={image[0].file.url}
              alt="User image"
              width={1000}
              height={1000}
              className="w aspect-video w-full rounded-lg  hover:cursor-pointer hover:opacity-80"
            />
          )}
        </div>
      </div>
    </div>
  );
};
export default Post;
