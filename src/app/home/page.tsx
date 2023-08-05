"use client";

import Posts from "../components/homepage/Posts";
import Search from "../components/search/Search";
import Navbar from "../components/navbar/Navbar";
import Recommendation from "../components/homepage/Recommendation";

const HomePage = () => {
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


    </div>
  );
};

export default HomePage;
