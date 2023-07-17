"use client";
import { createPost } from "@/app/recoil/atoms/modalAtoms";
import Image from "next/image";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import Avatar from "../Avatar";
import { IoCloseSharp } from "react-icons/io5";
import firebase_app, { db } from "@/app/firebase/config";
import {
  collection,
  addDoc,
  serverTimestamp,
  updateDoc,
  doc,
} from "firebase/firestore";
import { auth } from "@/app/firebase/auth/auth";
import { getAuth } from "firebase/auth";
import type EditorJS from "@editorjs/editorjs";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
  uploadString,
} from "firebase/storage";
//@ts-ignore
import { v4 as uuidv4 } from "uuid";

const CreatePost = () => {
  const [isCreatePost, setIsCreatePost] = useRecoilState(createPost);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [enabled, setEnabled] = useState<boolean>(false);
  const titleInputRef = useRef<HTMLInputElement>(null);

  const openDialog = () => {
    setIsCreatePost(true);
  };

  const closeDialog = () => {
    setIsCreatePost(false);
  };

  const auth = getAuth();
  const storage = getStorage();
  const imageRef = ref(storage, `posts/image`);
  const postRef = useRef("");
  // const imageRef = ref(
  //   storage,
  //   `posts/image/${auth.currentUser?.uid}/${uuidv4()}`
  // );

  const addPost = async () => {
    try {
      const downloadURL = await getDownloadURL(imageRef);
      const docRef = await addDoc(collection(db, "posts"), {
        fullName: auth.currentUser?.displayName,
        username: auth.currentUser?.displayName?.split(" ")[0],
        postTitle: title,
        postContent: content,
        userProfilePic: auth.currentUser?.photoURL,
        postImage: "",
        timestamp: serverTimestamp(),
      });
      if (downloadURL) {
        await updateDoc(doc(db, "posts", docRef.id), {
          image: downloadURL,
        });
      }
      postRef.current = docRef.id;

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

  // focus the input field when the dialog is open
  useEffect(() => {
    if (titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, []);

  // Escape key to close the dialog
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeDialog();
      }
    };

    if (isCreatePost) {
      document.addEventListener("keydown", handleEscapeKey);
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isCreatePost]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setEnabled(true);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      await intializedEditor();

      setTimeout(() => {});
    };

    if (enabled) {
      init();

      return () => {};
    }
  }, [enabled, intializedEditor]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      await addPost();
      setTitle("");
      setContent("");
    } catch (error) {
      console.log("can't add to the firebase");
    }
  };

  return (
    <div>
      {isCreatePost && (
        <div className="fixed inset-0 flex  items-center justify-center bg-gray-500 bg-opacity-50">
          <div className="w-[90%] rounded-lg bg-white p-8 md:w-[400px] xl:w-[600px]">
            <div className="relative border-b-2 border-gray-400  text-center">
              <h2 className="text-2xl font-medium">Create Post</h2>
              <button
                className="absolute right-1 top-0 rounded-full p-1 transition-all duration-200 ease-in-out hover:cursor-pointer hover:bg-gray-200 hover:fill-red-500"
                onClick={closeDialog}
              >
                <IoCloseSharp size={20} />
              </button>
            </div>

            <div className="mt-2 flex items-center">
              <Avatar />
              <div>
                <div className="ml-4 ">
                  <p className=" text-md font-medium leading-4">
                    {auth.currentUser?.displayName}
                  </p>
                  <p className="text-md text-gray-500">{`@${
                    auth.currentUser?.displayName?.split(" ")[0]
                  }`}</p>
                </div>
              </div>
            </div>
            <form
              action="submit"
              onSubmit={handleSubmit}
              className="mt-4 rounded-md border border-gray-200 p-4 "
            >
              <input
                placeholder="Title"
                ref={titleInputRef}
                className="h-full w-full resize-none py-2 text-2xl font-bold outline-none"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <div id="editorjs" className="min-h-[100px]" />

              <button className="w-full rounded-md bg-gray-300 px-4 py-2 text-lg font-medium hover:opacity-80 ">
                Post
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatePost;
