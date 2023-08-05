
import { DocumentData, collection, getDocs, orderBy, query } from "firebase/firestore";
import Bookmark from "./Bookmark"
import { database, db } from "@/app/firebase/config";
import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { child, get, onValue, ref } from "firebase/database";


interface bookmark {
  id: string,
}

const Bookmarks = () => {
  const [bookmarkedPosts, setBookmarkedPosts] = useState<DocumentData>([]);
  const auth = getAuth();

  useEffect(() => {
    // const getBookmarkedPosts = async () => {
    //   const querySnapshot = await getDocs(
    //     query(collection(db, "bookmarks", "users", `${auth?.currentUser?.uid}`)));
    //   const data = querySnapshot.docs.map((doc) => ({
    //     id: doc.data().postID,
    //   }));
    //   console.log(querySnapshot.docs);
    //   setBookmarkedPosts(data);
    // }
    //
    // getBookmarkedPosts();

    const bookmarkRef = ref(database, `users/${auth?.currentUser?.uid}/bookmarks/`);
    onValue(bookmarkRef, (snapshot) => {
      if (snapshot.exists()) {
        console.log("Rommendation bookmarks: \n", snapshot.val());
        setBookmarkedPosts(snapshot.val());

      }
    });


  }, [db])

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
