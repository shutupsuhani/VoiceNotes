import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { LandingPage } from "./components/LandingPage";
import { AuthForm } from "./components/AuthForm";
import { Header } from "./components/Header";
import { VoiceRecorder } from "./components/VoiceRecorder";
import { SearchBar } from "./components/SearchBar";
import { EmptyState } from "./components/EmptyState";
import { NoteEditor } from "./components/NoteEditor";
import { NotesList } from "./components/NotesList";
import { useAuth } from "./context/AuthContext";
import { VoiceNote } from "./types";
import { generateSummaryAPI } from "./utils/geminiAPI";

function App() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [notes, setNotes] = useState<VoiceNote[]>([]);
  const [editingNote, setEditingNote] = useState<VoiceNote | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [generatingSummaryId, setGeneratingSummaryId] = useState<string | null>(
    null
  );

  // 🔹 Fetch notes when authenticated
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch("https://voice-notes-backend.vercel.app/api/notes/getnotes", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch notes");

        const data = await res.json();
        setNotes(data);
      } catch (err) {
        console.error("Error fetching notes:", err);
      }
    };

    if (isAuthenticated) {
      fetchNotes();
    }
  }, [isAuthenticated]);

  // 🔹 Add new note (from VoiceRecorder)
  const handleNoteCreated = (note: VoiceNote) => {
    setNotes((prev) => [note, ...prev]);
  };

  // 🔹 Update note
  const handleNoteUpdated = (updatedNote: VoiceNote) => {
    setNotes((prev) =>
      prev.map((note) => (note._id === updatedNote._id ? updatedNote : note))
    );
    setEditingNote(null);
  };

  // 🔹 Delete note
    
  const handleNoteDeleted = async (_id: string) => {
  if (!window.confirm("Are you sure you want to delete this note?")) return;

  try {
    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await fetch(`http://localhost:4000/api/notes/${_id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error("Failed to delete note");
    }

    // Remove note from state only after successful API response
    setNotes((prev) => prev.filter((note) => note._id !== _id));
  } catch (err) {
    console.error("Error deleting note:", err);
    alert("Error deleting note");
  }
};

  // 🔹 Generate summary
  const handleGenerateSummary = async (_id: string) => {
    const note = notes.find((n) => n._id === _id);
    if (!note) return;

    setIsGeneratingSummary(true);
    setGeneratingSummaryId(_id);

    try {
      const summary = await generateSummaryAPI(_id);
      setNotes((prev) =>
        prev.map((n) =>
          n._id === _id ? { ...n, summary, isEdited: false } : n
        )
      );
    } catch (err) {
      console.error("Failed to generate summary", err);
      alert("Summary generation failed.");
    } finally {
      setIsGeneratingSummary(false);
      setGeneratingSummaryId(null);
    }
  };

  return (
    <Routes>
      {/* Landing Page */}
      <Route
        path="/"
        element={<LandingPage onGetStarted={() => navigate("/register")} />}
      />

      {/* Login */}
      <Route
        path="/login"
        element={
          !isAuthenticated ? <AuthForm mode="login" /> : <Navigate to="/notes" />
        }
      />

      {/* Register */}
      <Route
        path="/register"
        element={
          !isAuthenticated ? (
            <AuthForm mode="register" />
          ) : (
            <Navigate to="/notes" />
          )
        }
      />

      {/* Notes Page */}
      <Route
        path="/notes"
        element={
          isAuthenticated ? (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
              <Header onBackToLanding={() => navigate("/")} />

              <div className="container mx-auto px-4 py-8 max-w-4xl">
                <VoiceRecorder onNoteCreated={handleNoteCreated} />

                <SearchBar
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  notesCount={notes.length}
                />

                <div className="space-y-4 mt-6">
                  {notes.length === 0 ? (
                    <EmptyState hasSearchQuery={!!searchQuery} />
                  ) : (
                    <NotesList
                      notes={notes} // ✅ pass notes here
                      onEdit={setEditingNote}
                      onDelete={handleNoteDeleted}
                      onGenerateSummary={handleGenerateSummary}
                      isGeneratingSummary={isGeneratingSummary}
                      generatingSummaryId={generatingSummaryId}
                      searchQuery={searchQuery}
                    />
                  )}
                </div>

                {editingNote && (
                  <NoteEditor
                    note={editingNote}
                    onSave={handleNoteUpdated}
                    onCancel={() => setEditingNote(null)}
                  />
                )}
              </div>
            </div>
          ) : (
            <Navigate to="/login" />
          )
        }
      />
    </Routes>
  );
}

export default App;
