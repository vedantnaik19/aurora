import { useState } from "react";
import { FaHome, FaPlusCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { AddSourceModal } from "./AddSourceModal";

export const SourcesSidebar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className="flex flex-col h-full max-w-xs md:max-w-md lg:max-w-lg">
      <div className="flex flex-col md:flex-row gap-2 content-center items-center p-4">
        <Link to="/" className="flex items-center">
          <FaHome size={22} className="text-blue-700" />
          <h1 className="text-2xl ml-2 m-0 p-0">Aurora 🌟</h1>
        </Link>
      </div>

      <div className="flex flex-col gap-2 pb-4 px-4">
        <div className="flex justify-between items-center">
          <h4 className="font-bold text-lg md:text-xl ">Sources</h4>
          <button
            onClick={toggleModal}
            className="p-2 hover:bg-gray-600 rounded-full"
          >
            <FaPlusCircle size={20} className="" />
          </button>
        </div>
        <div className="p-2 rounded hover:bg-gray-800 cursor-pointer ">
          Item 1
        </div>
        <div className="p-2 rounded hover:bg-gray-800 cursor-pointer ">
          Item 2
        </div>
        <div className="p-2 rounded hover:bg-gray-800 cursor-pointer ">
          Item 3
        </div>
        <div className="p-2 rounded hover:bg-gray-800 cursor-pointer ">
          Item 4
        </div>
      </div>

      {/* Include the modal component here */}
      <AddSourceModal isOpen={isModalOpen} onClose={toggleModal} />
    </div>
  );
};
