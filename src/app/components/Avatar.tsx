import Image from "next/image";
import { cn } from "../lib/utils";

const Avatar = ({
  imgSrc,
  className,
}: {
  imgSrc: String | null;
  className?: string,
}) => {

  return (
    <img
      src={imgSrc?.toString() || "/images/profile.jpg"}
      alt="profile pic"
      className={cn("h-8 w-8 rounded-full border-2 border-gray-400 p-[1px] shadow-sm  hover:cursor-pointer hover:opacity-80 lg:h-12 lg:w-12", className)}
    />
  );
};

export default Avatar;
