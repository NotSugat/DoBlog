
"use client";
import { createPost } from "@/app/recoil/atoms/modalAtoms";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import Avatar from "../Avatar";
import { IoCloseSharp } from "react-icons/io5";
import { db } from "@/app/firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import type EditorJS from "@editorjs/editorjs";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
//@ts-ignore
import { v4 as uuidv4 } from "uuid";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import { auth } from "../firebase/auth/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { BiDotsHorizontal } from "react-icons/bi";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [enabled, setEnabled] = useState<boolean>(false);
  const titleInputRef = useRef<HTMLInputElement>(null);

  const [user, loading] = useAuthState(auth)
  const storage = getStorage();
  const imageRef = ref(
    storage,
    `posts/images/${auth.currentUser?.uid}/${uuidv4()}`
  );
  const router = useRouter();


  const notify = () =>
    toast.success("Blog posted. Do Blog!", {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });


  const addPost = async () => {
    try {
      const blocks = await editorRef.current?.save();

      const docRef = await addDoc(collection(db, "posts"), {
        id: auth.currentUser?.uid,
        fullName: auth.currentUser?.displayName,
        username: auth.currentUser?.displayName?.split(" ")[0].toLowerCase(),
        postTitle: title,
        postContent: blocks,
        userProfilePic: auth.currentUser?.photoURL,
        timestamp: serverTimestamp(),
        bookmarkCount: 0,
      });
      notify();
      console.log("Document written with ID: ", docRef.id);
    } catch (error) {
      console.log(error);
    }
  };

  const editorRef = useRef<EditorJS>();

  const intializedEditor = useCallback(async () => {
    const Editorjs = (await import("@editorjs/editorjs")).default;
    const Header = (await import("@editorjs/header")).default;
    // @ts-ignore
    const List = (await import("@editorjs/list")).default; // @ts-ignore
    const Embed = (await import("@editorjs/embed")).default; // @ts-ignore
    const Code = (await import("@editorjs/code")).default; // @ts-ignore
    const InlineCode = (await import("@editorjs/code")).default; // @ts-ignore
    const LinkTool = (await import("@editorjs/link")).default; // @ts-ignore
    const Table = (await import("@editorjs/table")).default; // @ts-ignore
    const ImageTool = (await import("@editorjs/image")).default; // @ts-ignore

    if (!editorRef.current) {
      console.log("Initialization of editor js is happening");
      const editor = new Editorjs({
        /**
         * Id of Element that should contain the Editor
         */
        holder: "editorjs",

        onReady: () => {
          console.log("Editor.js is ready to work!");
          editorRef.current = editor;
        },
        placeholder: "Do blog with one click!",
        inlineToolbar: true,
        data: { blocks: [] },

        tools: {
          header: Header,
          LinkTool: {
            class: LinkTool,
            config: {
              endpoint: "api/link",
            },
          },
          image: {
            class: ImageTool,
            config: {
              uploader: {
                async uploadByFile(file: File) {
                  console.log(imageRef);

                  var metadata = {
                    contentType: "image/jpeg",
                  };
                  var uploadTask = await uploadBytesResumable(
                    imageRef,
                    file,
                    metadata
                  );
                  console.log("Uploaded successfully!", uploadTask);
                  const downloadURL = await getDownloadURL(imageRef);
                  console.log(downloadURL);
                  return {
                    success: 1,
                    file: {
                      url: downloadURL,
                    },
                  };
                },
              },
            },
          },
          list: List,
          embed: Embed,
          code: Code,
          table: Table,
        },
      });
    }
  }, []);


  useEffect(() => {
    if (typeof window !== "undefined") {
      setEnabled(true);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      await intializedEditor();

      setTimeout(() => { });
    };

    if (enabled) {
      init();
      return () => { };
    }
  }, [enabled, intializedEditor]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      await addPost();
      router.push("/");

    } catch (error) {
      console.log("can't add to the firebase");
    }
  };

  if (!user && !loading) router.push("/signin");

  return (
    <div>
      <div className="flex items-center px-[20%] py-2 justify-between shadow-md sticky top-0 z-10 bg-gray-100 ">
        <div className="flex items-center gap-4 ">
          <button
            onClick={() => router.push("/")}
            className="text-xl font-bold tracking-wide lg:text-2xl"
          >
            DoBlog
          </button>
          <p className="text-xl lg:text-xl font-thin text-gray-500">Draft in {user?.displayName}</p>

        </div>

        <div className="flex items-center gap-2">
          <button className={`px-4 py-2 ${title ? "bg-green-400" : "bg-green-100"} rounded-full`} onClick={handleSubmit}>Publish</button>
          <button title="More Settings">
            <BiDotsHorizontal className="post-icon" />
          </button>
        </div>

      </div>

      {/* form section*/}
      <form
        action="submit"
        onSubmit={handleSubmit}
        className="mx-auto  w-[90%] lg:max-w-[50%] rounded-md border border-gray-200 p-4"
      >
        <input
          placeholder="Title"
          ref={titleInputRef}
          className="h-full w-full resize-none px-4 py-2 text-xl lg:text-3xl font-bold outline-none bg-transparent"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div id="editorjs" className="min-h-full  max-w-[80%]  mx-auto text-base lg:text-xl " />
      </form>

    </div>
  )
}

export default CreatePost; 
