const Tag = ({ tagName }: { tagName: String }) => {
	return (
		<button className="rounded-full bg-gray-200 px-4 py-2 ">{tagName}</button>
	);
};

export default Tag;
