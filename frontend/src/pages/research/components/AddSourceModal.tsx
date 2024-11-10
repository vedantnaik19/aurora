import { useState } from "react";
import { FaFolder, FaLink, FaTimes } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { useSources } from "../../../context/SourcesContext";
import { FileUploadForm } from "./FileUploadForm";
import { SourceLinkForm } from "./SourceLinkForm";
import { SourceTypeButton } from "./SourceTypeButton";

interface AddSourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSourceAdded?: () => void;
}

export const AddSourceModal: React.FC<AddSourceModalProps> = ({
  isOpen,
  onClose,
  onSourceAdded,
}) => {
  const { id: researchId } = useParams<{ id: string }>();
  const { addLinkSource, addFileSource } = useSources();
  const [sourceType, setSourceType] = useState<"link" | "file">("file");
  const [url, setUrl] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSourceTypeChange = (type: "link" | "file") => {
    setSourceType(type);
  };

  const clearError = () => {
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!researchId) {
      setError("Research ID is undefined");
      return;
    }

    try {
      setIsSubmitting(true);
      if (sourceType === "link" && url) {
        await addLinkSource(researchId, url);
        setUrl("");
      } else if (sourceType === "file" && files.length > 0) {
        // Make sure files exist before trying to upload
        if (!files || files.length === 0) {
          throw new Error("No files selected");
        }

        await addFileSource(researchId, files);
        setFiles([]);
      }
      onSourceAdded?.();
      onClose();
    } catch (error) {
      console.error("Error adding source:", error);
      setError(
        error instanceof Error
          ? error.message
          : "An error occurred while adding the source"
      );
    } finally {
      setIsSubmitting(false);
    }
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
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      handleFileChange(droppedFiles);
      setSourceType("file");
    }
  };

  const handleFileChange = (newFiles: File[] | null) => {
    if (!newFiles) return;

    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    const validFiles = newFiles.filter((file) => {
      if (file.size > MAX_FILE_SIZE) {
        alert(`File ${file.name} is too large. Maximum size is 10MB`);
        return false;
      }
      return true;
    });

    setFiles((prevFiles) => [...prevFiles, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-container">
        <div className="modal-header">
          <h2 className="text-xl font-semibold">Add Sources</h2>
          <button onClick={onClose} className="btn-icon" aria-label="Close">
            <FaTimes size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          {error && (
            <div className="p-3 text-sm text-red-300 bg-red-800/20 rounded-lg flex justify-between items-center">
              <span>{error}</span>
              <button
                type="button"
                onClick={clearError}
                className="btn-icon"
                aria-label="Dismiss error"
              >
                <FaTimes size={14} />
              </button>
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-4">
            <SourceTypeButton
              type="file"
              currentType={sourceType}
              onClick={() => handleSourceTypeChange("file")}
              icon={<FaFolder className="text-xl" />}
              label="Choose File"
            />
            <SourceTypeButton
              type="link"
              currentType={sourceType}
              onClick={() => handleSourceTypeChange("link")}
              icon={<FaLink className="text-xl" />}
              label="Web Link"
            />
          </div>

          {sourceType === "link" ? (
            <SourceLinkForm url={url} setUrl={setUrl} />
          ) : (
            <FileUploadForm
              files={files}
              isDragging={isDragging}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onFileChange={handleFileChange}
              removeFile={removeFile}
            />
          )}

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
              disabled={isSubmitting}
            >
              {isSubmitting ? "Adding..." : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
