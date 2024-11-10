import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import ReactMarkdown from "react-markdown";

interface SaveNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
  onSave: (title: string, content: string) => void;
}

export const SaveNoteModal: React.FC<SaveNoteModalProps> = ({
  isOpen,
  onClose,
  content,
  onSave,
}) => {
  const [title, setTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    onSave(title, content);
    setIsSubmitting(false);
    setTitle("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-container">
        <div className="modal-header">
          <h2 className="text-xl font-semibold">Save to Notes</h2>
          <button onClick={onClose} className="btn-icon">
            <FaTimes size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div>
            <label htmlFor="title" className="label">
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input"
              required
            />
          </div>
          <div>
            <label className="label">Content</label>
            <div className="p-4 bg-gray-700 rounded-lg max-h-[300px] overflow-y-auto">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting || !title.trim()}
            >
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
