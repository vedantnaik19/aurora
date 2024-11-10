import { BrowserRouter, Route, Routes } from "react-router-dom";
import { NotesProvider } from "./context/NotesContext";
import { ResearchProvider } from "./context/ResearchContext";
import { SourcesProvider } from "./context/SourcesContext";
import { HomePage } from "./pages/home/HomePage";
import { ResearchPage } from "./pages/research/ResearchPage";

export function App() {
  return (
    <ResearchProvider>
      <NotesProvider>
        <SourcesProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/research/:id" element={<ResearchPage />} />
            </Routes>
          </BrowserRouter>
        </SourcesProvider>
      </NotesProvider>
    </ResearchProvider>
  );
}
