
import { DocumentData, collection, getDocs, orderBy, query } from "firebase/firestore";
import Bookmark from "./Bookmark"
import { db } from "@/app/firebase/config";
import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";

interface bookmark {
  id: string,
}

const Bookmarks = () => {
  const [bookmarkedPosts, setBookmarkedPosts] = useState<DocumentData>([]);
  const auth = getAuth();

  useEffect(() => {
    const getBookmarkedPosts = async () => {
      const querySnapshot = await getDocs(
        query(collection(db, "bookmarks", "users", `${auth?.currentUser?.uid}`)));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.data().postID,
      }));
      setBookmarkedPosts(data);
    }
    getBookmarkedPosts();
  }, [db])

  return (
    <div>
      {bookmarkedPosts.map((data: bookmark) => (
        <Bookmark id={data.id} />
      ))}
    </div>
  )
}

export default Bookmarks
