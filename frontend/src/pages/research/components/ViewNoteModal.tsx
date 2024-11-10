import { FaTimes } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import { Note } from "../../../types";

interface ViewNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  note: Note | null;
}

export const ViewNoteModal: React.FC<ViewNoteModalProps> = ({
  isOpen,
  onClose,
  note,
}) => {
  if (!isOpen || !note) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-container">
        <div className="modal-header">
          <h2 className="text-xl font-semibold">{note.title}</h2>
          <button onClick={onClose} className="btn-icon">
            <FaTimes size={20} />
          </button>
        </div>
        <div className="modal-body">
          <div className="p-4 bg-gray-800 rounded-lg max-h-[300px] overflow-y-auto">
            <ReactMarkdown>{note.content.replace("\n", "\\")}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
};
