interface SourceTypeButtonProps {
  type: "link" | "file";
  currentType: "link" | "file";
  onClick: () => void;
  icon: JSX.Element;
  label: string;
}

export const SourceTypeButton: React.FC<SourceTypeButtonProps> = ({
  type,
  currentType,
  onClick,
  icon,
  label,
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex-1 p-4 rounded-lg border transition-colors ${
      currentType === type
        ? "border-blue-500 bg-blue-700/30"
        : "border-gray-600 hover:border-gray-500 bg-gray-700"
    }`}
  >
    <div className="flex flex-col items-center gap-2">
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </div>
  </button>
);
