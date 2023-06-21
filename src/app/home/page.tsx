"use client";

import { useRecoilValue } from "recoil";
import Posts from "../components/homepage/Posts";
import Search from "../components/search/Search";
import { createPost } from "../recoil/atoms/modalAtoms";
import CreatePost from "../components/Posts/CreatePost";
import Navbar from "../components/navbar/Navbar";

const HomePage = () => {
  const isCreatePost = useRecoilValue(createPost);
  return (
    <div className="m-auto max-w-[80%] ">
      <Navbar />

      <Search />

      <Posts />

      {isCreatePost && <CreatePost />}
    </div>
  );
};

export default HomePage;
