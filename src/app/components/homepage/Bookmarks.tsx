
import { DocumentData, collection, getDocs, orderBy, query } from "firebase/firestore";
import Bookmark from "./Bookmark"
import { database, db } from "@/app/firebase/config";
import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { child, get, onValue, ref } from "firebase/database";
import { useRecoilValue } from "recoil";
import { bookmarkPressed } from "@/app/recoil/atoms/modalAtoms";


interface bookmark {
  id: string,
}

const Bookmarks = () => {
  const [bookmarkedPosts, setBookmarkedPosts] = useState<DocumentData>([]);
  const auth = getAuth();
  const isBookmarkPressed = useRecoilValue(bookmarkPressed);

  useEffect(() => {
    const bookmarkRef = ref(database, `users/${auth?.currentUser?.uid}/bookmarks/`);
    onValue(bookmarkRef, (snapshot) => {
      if (snapshot.exists()) {
        console.log("Rommendation bookmarks: \n", snapshot.val());
        setBookmarkedPosts(snapshot.val());

      } else[
        setBookmarkedPosts([])
      ]
    });


  }, [isBookmarkPressed])

  useEffect(() => {
    console.log("hello world");

  }, [bookmarkedPosts])

  return (
    <div>
      {Object.entries(bookmarkedPosts).map(([key, value]) => (
        <Bookmark key={key} id={value.postID} />
      ))}
    </div>
  )
}

export default Bookmarks
