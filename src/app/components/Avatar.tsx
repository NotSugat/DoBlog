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
      className="hover: max-h-[50px] rounded-full border-2 border-gray-400 p-[1px] shadow-sm hover:cursor-pointer hover:opacity-80"
    />
  );
};

export default Avatar;
