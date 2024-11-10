interface QuickActionsProps {
  text: string;
  onClick: () => void;
}

export const QuickActions = ({ text, onClick }: QuickActionsProps) => (
  <button
    onClick={onClick}
    className="btn btn-secondary text-sm bg-gray-700 whitespace-nowrap"
  >
    {text}
  </button>
);
