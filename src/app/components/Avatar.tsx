import Image from "next/image";

const Avatar = ({
  imgSrc,
  height,
  width,
}: {
  imgSrc: String | null;
  height?: number;
  width?: number;
}) => {
  return (
    <Image
      src={imgSrc?.toString() || "/images/profile.jpg"}
      alt="profile pic"
      height={height || 40}
      width={width || 40}
      className="h-8 w-8 rounded-full border-2 border-gray-400 p-[1px] shadow-sm hover:max-h-[50px] hover:cursor-pointer hover:opacity-80 lg:h-12 lg:w-12"
    />
  );
};

export default Avatar;
