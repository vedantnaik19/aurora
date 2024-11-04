import React from "react";
import { FaTrash } from "react-icons/fa";

interface Note {
  title: string;
  content: string;
}

interface NoteItemProps {
  note: Note;
  index: number;
  onDelete: (index: number) => void;
}

export const NoteItem: React.FC<NoteItemProps> = ({
  note,
  index,
  onDelete,
}) => {
  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      onDelete(index);
    }
  };

  return (
    <div className="w-full h-80 flex flex-col justify-between bg-gray-800 p-4 mb-4 rounded-lg shadow-md hover:bg-gray-700 transition-colors overflow-hidden">
      <h3 className="text-lg font-semibold text-gray-200 truncate">
        {note.title}
      </h3>

      <div className="mt-2 text-sm text-gray-300 flex-grow">
        <p className="line-clamp-3">{note.content}</p>
      </div>
      <div className="flex flex-row-reverse">
        <button
          onClick={handleDelete}
          className="p-2  rounded-full hover:bg-gray-600 transition-colors"
        >
          <FaTrash size={16} className="text-gray-400 hover:text-white" />
        </button>
      </div>
    </div>
  );
};
