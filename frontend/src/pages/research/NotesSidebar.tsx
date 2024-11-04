import { NoteItem } from "./NoteItem";

export const NotesSidebar = () => {
  const notes = [
    {
      title: "Noteworthy technology acquisitions 2021",
      content:
        "Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.",
    },
    {
      title: "Meeting Notes",
      content:
        "Discussion about Q4 planning and strategic initiatives for the upcoming year...",
    },
    {
      title: "Project Ideas",
      content:
        "1. Build a task management app\n2. Create a recipe collection tool\n3. Design a personal finance tracker...",
    },
  ];

  return (
    <div className="flex flex-col h-full max-w-xs md:max-w-md lg:max-w-lg shadow-lg">
      <div className="flex items-center gap-2 p-4 border-b border-gray-800 sticky top-0 z-10">
        <div className="flex flex-col gap-3 w-full">
          <h2 className="text-xl font-semibold">Saved Notes</h2>
          <input
            type="text"
            placeholder="Search..."
            className="p-2 rounded-lg bg-gray-700  placeholder-gray-500 mb-1"
          />
        </div>
      </div>

      <div className="flex flex-col flex-grow p-4">
        <div className="flex flex-col flex-grow overflow-y-auto">
          <div className="space-y-2">
            {notes.map((note, index) => (
              <NoteItem
                key={index}
                note={note}
                index={index}
                onDelete={() => {}}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
