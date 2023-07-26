import { useEffect, useState } from "react";
import Post from "./Post";
import { DocumentData, collection, getDocs } from "firebase/firestore";
import { db } from "@/app/firebase/config";

const Posts = () => {
  const [posts, setPosts] = useState<DocumentData>([]);

  const getPosts = async () => {
    const querySnapshot = await getDocs(collection(db, "posts"));
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      data: doc.data(),
    }));
    setPosts(data);
  };

  useEffect(() => {
    getPosts();
  }, [db]);

  return (
    <div className="mx-auto max-w-[80%]">
      {posts.map((post: any) => (
        <Post key={post.id} id={post.id} post={post.data} />
      ))}
    </div>
  );
};

export default Posts;
