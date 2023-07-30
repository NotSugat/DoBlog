import dynamic from "next/dynamic";
import Image from "next/image";
import { FC } from "react";

const Output = dynamic(
  async () => (await import("editorjs-react-renderer")).default,
  {
    ssr: false,
  }
);

const style = {
  paragraph: {
    fontSize: "1.2rem",
    lineHeight: "1.75rem",
  },
};

interface EditorOutputProps {
  content: any;
}

const renderers = {
  image: CustomImageRenderer,
  header: CustomHeaderRenderer,
  list: CustomListRenderer,
  // code: CustomCodeRenderer,
};

const EditorOutput: FC<EditorOutputProps> = ({ content }) => {
  return (
    <Output
      data={content}
      style={style}
      clasName="text-sm"
      renderers={renderers}
    />
  );
};

function CustomImageRenderer({ data }: any) {
  const src = data.file.url;
  const caption = data.caption;
  console.log(data);

  return (
    <div className="space-y-2">
      <div className="relative  flex min-h-[20rem] w-full flex-col ">
        <Image
          alt="user posted image"
          className="object-contain "
          fill
          src={src}
        />
      </div>
      <p className="text-center text-sm text-gray-400 lg:text-base">
        {data.caption}
      </p>
    </div>
  );
}

function CustomHeaderRenderer({ data }: any) {
  return <p className="text-xl font-semibold lg:text-2xl ">{data.text}</p>;
}

function CustomListRenderer({ data }: any) {
  return (
    <ul
      className={` ${
        data.style === "unordered" ? "list-disc" : "list-decimal"
      }`}
    >
      {data.items.map((item: any, index: number) => (
        <li key={index} className="ml-8 text-base lg:text-xl ">
          {item}
        </li>
      ))}
    </ul>
  );
}

export default EditorOutput;
