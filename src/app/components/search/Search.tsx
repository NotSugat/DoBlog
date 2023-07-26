import { BiSearchAlt } from "react-icons/bi";
import Tag from "../Tag";

const Search = () => {
  return (
    <div className="mx-auto my-12 flex max-w-[80%] items-center">
      <form className="flex items-center gap-2 rounded-full border-2 border-gray-400 px-2">
        <BiSearchAlt size={24} className="fill-gray-600" />
        <input
          type="text"
          placeholder="Search..."
          className="h-10 w-full bg-transparent outline-none"
        />
      </form>

      <h2>Tags: </h2>
      <div className="space-x-2">
        <Tag tagName="Valorant" />
        <Tag tagName="Mobile legend" />
        <Tag tagName="Roblox" />
      </div>
    </div>
  );
};

export default Search;
