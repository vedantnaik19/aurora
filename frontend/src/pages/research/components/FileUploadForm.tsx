import { FaTimes, FaUpload } from "react-icons/fa";

interface FileUploadFormProps {
  files: File[];
  isDragging: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
  onFileChange: (files: File[] | null) => void;
  removeFile: (index: number) => void;
}

export const FileUploadForm: React.FC<FileUploadFormProps> = ({
  files,
  isDragging,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileChange,
  removeFile,
}) => (
  <div className="space-y-4">
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
        isDragging
          ? "border-blue-500 bg-blue-700/20"
          : "border-gray-600 hover:border-gray-500 bg-gray-700"
      }`}
    >
      <label className="cursor-pointer text-center">
        <div className="flex flex-col items-center gap-4">
          <FaUpload className="text-2xl" />
          <p className="text-sm text-gray-400">
            <span className="font-semibold">Click to upload</span> or drag and
            drop multiple files
          </p>
        </div>
        <input
          type="file"
          onChange={(e) =>
            onFileChange(e.target.files ? Array.from(e.target.files) : null)
          }
          className="hidden"
          multiple
          required={files.length === 0}
        />
      </label>
    </div>
    {files.length > 0 && (
      <div className="border border-gray-600 rounded-lg">
        <div className="p-2 border-b border-gray-600">
          <span className="text-sm text-gray-400">
            Selected files ({files.length})
          </span>
        </div>
        <div className="max-h-[200px] overflow-y-auto custom-scrollbar">
          <div className="space-y-1 p-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-gray-700 rounded-lg"
              >
                <span className="text-sm text-blue-400 truncate flex-1 mr-2">
                  {file.name}
                </span>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="p-1 hover:bg-gray-700/50 rounded-full transition-colors flex-shrink-0"
                  aria-label="Remove file"
                >
                  <FaTimes
                    size={14}
                    className="text-gray-400 hover:text-red-400"
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    )}
    <p className="text-sm text-gray-500 italic mt-2">
      Most document, spreadsheet, presentation, and image formats are supported.
    </p>
  </div>
);
