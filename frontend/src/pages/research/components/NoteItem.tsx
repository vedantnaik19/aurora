import { FaTrash } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import { Note } from "../../../types";

interface NoteItemProps {
  note: Note;
  onDelete: () => void;
  onClick: () => void;
}

export const NoteItem: React.FC<NoteItemProps> = ({
  note,
  onDelete,
  onClick,
}) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this note?")) {
      onDelete();
    }
  };

  return (
    <div
      className="py-3 px-5 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-colors group cursor-pointer"
      onClick={onClick}
    >
      <div className="flex justify-between items-start gap-2">
        <h3 className="font-medium">{note.title}</h3>
        <button
          onClick={handleDelete}
          className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-white hover:bg-gray-600 rounded-full transition-all"
        >
          <FaTrash size={12} />
        </button>
      </div>

      <ReactMarkdown className="text-gray-400 mt-1 line-clamp-6">
        {note.content}
      </ReactMarkdown>
    </div>
  );
};
