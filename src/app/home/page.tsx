"use client";

import { useRecoilValue } from "recoil";
import Posts from "../components/homepage/Posts";
import Search from "../components/search/Search";
import { createPost } from "../recoil/atoms/modalAtoms";
import CreatePost from "../components/Posts/CreatePost";
import Navbar from "../components/navbar/Navbar";
import Recommendation from "../components/homepage/Recommendation";

const HomePage = () => {
  const isCreatePost = useRecoilValue(createPost);
  return (
    <div className="m-auto ">
      <Navbar />

      <div className="xl:grid xl:grid-cols-[70fr_30fr] max-w-[90%] xl:max-w-[80%] mx-auto">
        <div>
          <Search />
          <Posts />
        </div>

        <Recommendation />
      </div>


      {isCreatePost && <CreatePost />}
    </div>
  );
};

export default HomePage;
