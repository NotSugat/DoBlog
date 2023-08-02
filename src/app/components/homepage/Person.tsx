"use client"
import { useState } from "react"
import Avatar from "../Avatar"


const Person = ({ fullName, username, bio, userProfilePic }: { fullName: string, username: string, bio: string, userProfilePic: string }) => {

  const [followed, setFollowed] = useState<boolean>(false)

  return (
    <div className="flex justify-between w-full px-4 py-2">
      <div className="flex gap-2">
        <Avatar imgSrc={userProfilePic} />
        <div>
          <p className="cursor-pointer  text-xs font-semibold lg:text-base ">
            {fullName}
          </p>
          <p className=" cursor-pointer text-xs text-gray-500 lg:text-base">{`@${username}`}</p>

        </div>


      </div>
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
  )
}

export default Person
