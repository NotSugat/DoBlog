import { useEffect, useState } from "react";
import Post from "./Post";
import {
  DocumentData,
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "@/app/firebase/config";

const Posts = () => {
  const [posts, setPosts] = useState<DocumentData>([]);

  const getPosts = async () => {
    const querySnapshot = await getDocs(
      query(collection(db, "posts"), orderBy("timestamp", "desc"))
    );
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      data: doc.data(),
    }));
    setPosts(data);
  };

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <div className="">
      {posts.map((post: any) => (
        <Post key={post.id} id={post.id} post={post.data} />
      ))}
    </div>
  );
};

export default Posts;
