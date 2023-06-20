import Image from "next/image";
import { useState } from "react";

const CreatePost = () => {
  const [isDialogOpen, setDialogOpen] = useState(true);

  const openDialog = () => {
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
  };
  return (
    <div>
      {isDialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
          <div className="rounded-lg bg-white p-8">
            {/* Dialog content goes here */}
            <h2>Create Post</h2>
            <p>This is the dialog content.</p>
            <button onClick={closeDialog}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatePost;
