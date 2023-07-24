const Tag = ({ tagName }: { tagName: String }) => {
  return (
    <button className="rounded-full bg-gray-200 px-2 py-1 text-sm lg:px-4 lg:py-2  ">
      {tagName}
    </button>
  );
};

export default Tag;
