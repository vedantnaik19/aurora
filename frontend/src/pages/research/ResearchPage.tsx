import { ChatContainer } from "./ChatContainer";
import { NotesSidebar } from "./NotesSidebar";
import { SourcesSidebar } from "./SourcesSidebar";

export const ResearchPage: React.FC = () => {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <div className="w-2/12">
        <div className="h-full overflow-y-auto">
          <SourcesSidebar />
        </div>
      </div>

      <div className="flex flex-grow flex-col">
        <ChatContainer />
      </div>

      <div className="w-3/12">
        <div className="h-full overflow-y-auto">
          <NotesSidebar />
        </div>
      </div>
    </div>
  );
};
