import Post from "../components/homepage/Post";
import Posts from "../components/homepage/Posts";
import Search from "../components/search/Search";

const HomePage = () => {
  return (
    <div className="m-auto max-w-[80%] ">
      <Search />

      <Posts />
    </div>
  );
};

export default HomePage;
