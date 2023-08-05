import Bookmarks from "./Bookmarks"
import Person from "./Person"

const Recommendation = () => {
  // const [bookmarkedPost, setBookmarkedPost] = useState


  return (
    <div className="hidden xl:block">
      <div className="border-2">
        <p className="text-xl px-4 py-2">People you might be interested</p>
        <Person fullName={"Elon musk"} username="xuser" bio="bio" userProfilePic="" />
        <Person fullName={"Sugat Sujakhu"} username="sugat" bio="bio" userProfilePic="" />
      </div>

      <div className="sticky top-[calc(1rem_+_3rem)]" >
        <p className="text-xl px-4 font-semibold py-2" >Continue Reading</p>


        <Bookmarks />
      </div>

    </div>
  )
}

export default Recommendation
