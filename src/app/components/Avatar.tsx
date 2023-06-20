import Image from "next/image";

const Avatar = () => {
  return (
    <Image
      src="/images/profile.jpg"
      alt="profile pic"
      height={40}
      width={40}
      className="rounded-full border-2 border-gray-400 p-[1px]"
    />
  );
};

export default Avatar;
