import {
  FaBrain,
  FaClipboardList,
  FaPen,
  FaQuestionCircle,
} from "react-icons/fa";
import { Sidebar } from "./Sidebar";
import { Link } from "react-router-dom";

export const HomePage: React.FC = () => {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <div className="w-2/12">
        <div className="h-full overflow-y-auto">
          <Sidebar />
        </div>
      </div>
      <div className="w-1/12"></div>

      <div className="flex flex-grow flex-col">
        <div className="flex-col flex-grow max-w-screen-md items-center content-center">
          <h1 className="text-2xl md:text-4xl lg:text-5xl">
            Welcome to Aurora 🌟
          </h1>
          <h2 className="text-2xl md:text-3xl mb-6">
            Your Virtual Research Assistant
          </h2>
          <p className="text-base md:text-lg mb-4">
            Aurora empowers your research experience by allowing you to add
            multiple types of sources, including PDF documents, PowerPoint
            Presentations, Excel Sheets, Images, Audio, and Image files.
          </p>

          <p className="text-base md:text-lg mb-4">
            With these resources, Aurora helps you to:
          </p>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-800 p-4 rounded-lg shadow-md flex items-center">
              <FaBrain className="text-blue-400 mr-2" />
              <span className="text-sm md:text-md">Craft study guides</span>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg shadow-md flex items-center">
              <FaClipboardList className="text-purple-400 mr-2" />
              <span className="text-sm md:text-md">Summarize content</span>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg shadow-md flex items-center">
              <FaQuestionCircle className="text-pink-400 mr-2" />
              <span className="text-sm md:text-md">Answer questions (Q&A)</span>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg shadow-md flex items-center">
              <FaPen className="text-blue-500 mr-2" />
              <span className="text-sm md:text-md">Take notes</span>
            </div>
          </div>

          <p className="text-base md:text-lg mb-6">
            Making your research process efficient and enjoyable!
          </p>
          <Link to="/research">
            <button className="btn-primary">Start New Research</button>
          </Link>
        </div>
      </div>

      <div className="w-1/12"></div>
    </div>
  );
};
