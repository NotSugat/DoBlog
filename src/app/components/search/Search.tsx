import { BiSearchAlt } from "react-icons/bi";
import Tag from "../Tag";

const Search = () => {
  return (
    <div className="mx-auto  max-w-[80%] items-center gap-4 space-y-4 border-4 border-gray-200 px-4 py-8">
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-medium lg:text-2xl">Discover new </h2>
          <h2 className="text-4xl font-bold italic">Doer</h2>
        </div>
        <p className="text-xl font-semibold italic">
          Doers & Dreamers, Fear out, dream in. Take action and win!
        </p>
      </div>

      {/* search bar */}
      <div className="flex items-center gap-4">
        <form className="flex w-96 items-center gap-2 rounded-full border-2 border-gray-400  px-4 py-1">
          <BiSearchAlt size={24} className="fill-gray-600" />
          <input
            type="text"
            placeholder="Search..."
            className="h-10 w-full bg-transparent outline-none"
          />
        </form>

        <div className="space-x-2">
          <Tag tagName="Valorant" />
          <Tag tagName="Mobile legend" />
          <Tag tagName="Roblox" />
        </div>
      </div>
    </div>
  );
};

export default Search;
