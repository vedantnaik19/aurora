import {
  FaBrain,
  FaClipboardList,
  FaPen,
  FaQuestionCircle,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { api } from "../../api";
import { Sidebar } from "./Sidebar";

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const createResearch = async () => {
    try {
      const data = await api.createResearch();
      navigate(`/research/${data.id}`);
    } catch (error) {
      console.error("Error creating research:", error);
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <div className="hidden sm:block sm:w-auto">
        <Sidebar />
      </div>

      <div className="flex flex-grow flex-col justify-center px-4 sm:px-8 md:px-12 py-6 overflow-y-auto">
        <div className="max-w-3xl mx-auto w-full">
          <h1 className="logo-gradient text-3xl sm:text-4xl md:text-5xl logo font-bold mb-4">
            Welcome to Aurora 🌟
          </h1>
          <h2 className="text-xl sm:text-2xl md:text-3xl mb-8 text-gray-200">
            Your Virtual Research Assistant
          </h2>

          <div className="prose prose-invert max-w-none mb-8">
            <p className="text-base sm:text-lg text-gray-300">
              Aurora empowers your research experience by allowing you to add
              multiple types of sources, including most document formats,
              spreadsheets, presentation formats, image formats, and webpages.
            </p>

            <p className="text-base sm:text-lg mt-4 text-gray-300">
              With these resources, Aurora helps you to:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {/* Feature cards with consistent styling */}
            <div className="bg-gray-700 p-4 rounded-2xl hover:bg-gray-600 transition-colors">
              <div className="flex items-center">
                <FaBrain className="text-blue-400 text-xl sm:text-2xl" />
                <span className="ml-3 text-sm sm:text-base">
                  Craft study guides
                </span>
              </div>
            </div>
            <div className="bg-gray-700 p-4 rounded-2xl hover:bg-gray-600 transition-colors">
              <div className="flex items-center">
                <FaClipboardList className="text-purple-400 text-xl sm:text-2xl" />
                <span className="ml-3 text-sm sm:text-base">
                  Summarize content
                </span>
              </div>
            </div>
            <div className="bg-gray-700 p-4 rounded-2xl hover:bg-gray-600 transition-colors">
              <div className="flex items-center">
                <FaQuestionCircle className="text-pink-400 text-xl sm:text-2xl" />
                <span className="ml-3 text-sm sm:text-base">
                  Answer questions (Q&A)
                </span>
              </div>
            </div>
            <div className="bg-gray-700 p-4 rounded-2xl hover:bg-gray-600 transition-colors">
              <div className="flex items-center">
                <FaPen className="text-blue-500 text-xl sm:text-2xl" />
                <span className="ml-3 text-sm sm:text-base">Take notes</span>
              </div>
            </div>
          </div>

          <p className="text-base sm:text-lg mb-8">
            Making your research process efficient and enjoyable!
          </p>

          <button
            onClick={createResearch}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-full font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-800"
          >
            Start New Research
          </button>
        </div>
      </div>
    </div>
  );
};
