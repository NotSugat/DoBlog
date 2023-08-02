import { db } from "@/app/firebase/config";
import { DocumentData } from "firebase/firestore";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import Image from "next/image";
import Avatar from "../Avatar";
import { useRouter } from "next/navigation";

interface BlockFile {
  url: string;
}
interface BlockImage {
  caption: string;
  file: BlockFile;
}

const Bookmark = ({ id }: { id: string }) => {
  const [text, setText] = useState("");
  const [image, setImage] = useState<BlockImage[]>([]);
  const [post, setPost] = useState<DocumentData>({});
  const [date, setDate] = useState("");
  const [postId, setPostId] = useState("")
  const router = useRouter();

  const getDate = () => {

    const timestamp = post.timestamp?.toDate();
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    const formattedDate = `${months[timestamp?.getMonth()]} ${timestamp?.getDate()} ${timestamp?.getFullYear()}`;

    setDate(formattedDate);
  }

  const getContent = () => {
    {
      const blockTexts = post.postContent?.blocks
        .filter((block: any) => block.type === "paragraph")
        .map((block: any) => block.data.text);

      const blockImages: BlockImage[] = post.postContent?.blocks
        .filter((block: any) => block.type === "image")
        .map((block: any) => ({
          caption: block.data.caption,
          file: block.data.file,
        }));

      console.log("blockTexts:", blockTexts); // Add this line
      console.log("blockImages:", blockImages); // Add this line

      setText(blockTexts);
      setImage(blockImages);
    }
  };

  useEffect(() => {
    const getPost = async () => {
      const docRef = doc(db, "posts", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setPost(docSnap.data());
        setPostId(docSnap.id);
        console.log("Document data:", docSnap.id);

      } else {
        console.log("No such document!");
      }
    };

    getPost();
  }, []);

  useEffect(() => {
    console.log("postContent:", post.postContent);
    console.log("blocks:", post.postContent?.blocks);

    getDate();
    getContent();
  }, [post])

  const info = () => {
    console.log(post);
    console.log(postId);
  }



  return (
    <div onClick={() => {
      router.push(`/post/${postId}`)
      info();
    }} className="flex p-2 items-center gap-2 group cursor-pointer">
      {image?.length > 0 && (
        <Image
          src={image[0].file.url}
          alt="User image"
          width={1000}
          height={1000}
          className=" aspect-square rounded-lg object-cover group-hover:opacity-80 h-[9rem] w-[9rem] transition-opacity ease-in-out"
        />
      )}
      <div>
        <h2 className=" truncate-overflow-xl font-semibold text-xl">{post.postTitle}</h2>
        <p className="truncate-overflow-text-2 text-lg">{text}</p>
        <div className="flex items-center gap-2">
          <Image alt={`Porfile pictue of ${post.fullName} `} src={post.userProfilePic} height={1000} width={1000} className="h-6 w-6 rounded-full border-2 shadow-md" />
          <p className=" cursor-pointer text-gray-500 text-sm">{`@${post.username} `}</p>
          <span>.</span>
          <p className="text-xs text-gray-500">
            {date}
          </p>

        </div>

      </div>
    </div>
  )
}

export default Bookmark
