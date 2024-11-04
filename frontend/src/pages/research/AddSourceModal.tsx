import { useState } from "react";
import { FaFolder, FaLink, FaTimes, FaUpload } from "react-icons/fa";

interface AddSourceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddSourceModal: React.FC<AddSourceModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [sourceType, setSourceType] = useState<"link" | "file">("link");
  const [url, setUrl] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleSourceTypeChange = (type: "link" | "file") => {
    setSourceType(type);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Source Type:", sourceType);
    console.log("URL:", url);
    console.log("File:", file);
    onClose();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      setSourceType("file");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
      <div className="w-11/12 max-w-xl border border-gray-700 rounded-lg shadow-lg">
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-2xl">Add Sources</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-full transition-colors"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="flex gap-4 mb-6">
            <button
              type="button"
              onClick={() => handleSourceTypeChange("link")}
              className={`flex-1 p-4 rounded-lg border transition-colors ${
                sourceType === "link"
                  ? "border-blue-500 bg-blue-500/20"
                  : "border-gray-600 hover:border-gray-500"
              }`}
            >
              <div className="flex flex-col items-center">
                <span className="text-2xl mb-2">
                  <FaLink size={16} />
                </span>
                <span>
                  <h3>Web Link</h3>
                </span>
              </div>
            </button>
            <button
              type="button"
              onClick={() => handleSourceTypeChange("file")}
              className={`flex-1 p-4 rounded-lg border transition-colors ${
                sourceType === "file"
                  ? "border-blue-500 bg-blue-500/20"
                  : "border-gray-600 hover:border-gray-500"
              }`}
            >
              <div className="flex flex-col items-center">
                <span className="text-2xl mb-2">
                  <FaFolder size={16} />
                </span>
                <span>
                  <h3>Choose File</h3>
                </span>
              </div>
            </button>
          </div>

          {sourceType === "link" ? (
            <div className="space-y-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-300">
                  Source URL
                </label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                  placeholder="https://example.com"
                  required
                />
              </div>
              <p className="text-sm text-opacity-60 italic">
                Supports links to web pages, PDFs, research papers, and more.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-lg p-6 text-center ${
                  isDragging
                    ? "border-blue-500 bg-blue-500/10"
                    : "border-gray-600 hover:border-gray-500"
                }`}
              >
                <label className="cursor-pointer text-center">
                  <div className="flex flex-col items-center">
                    <span className="text-3xl mb-4 block">
                      {" "}
                      <FaUpload size={18} />{" "}
                    </span>
                    <p className="mb-2 text-sm text-gray-300">
                      <span className="font-semibold">Click to upload</span>
                    </p>
                  </div>
                  <input
                    type="file"
                    onChange={(e) =>
                      setFile(e.target.files ? e.target.files[0] : null)
                    }
                    className="hidden"
                    required
                  />
                  {file && (
                    <p className="text-sm text-blue-400 mt-2">{file.name}</p>
                  )}
                </label>
              </div>
              <p className="text-sm text-opacity-60 italic">
                Supports text files, PDFs, PowerPoint presentations, audio
                files, images, and programming files.
              </p>
            </div>
          )}

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm bg-gray-700 hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg text-sm bg-blue-700 hover:bg-blue-600"
            >
              Add Source
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
