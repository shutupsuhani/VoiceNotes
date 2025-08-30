import React from "react";
import { VoiceNote } from "../types";
import { NoteCard } from "./NoteCard";

interface NotesListProps {
  notes: VoiceNote[];
  searchQuery: string;
  onEdit: (note: VoiceNote) => void;
  onDelete: (id: string) => void;
  onGenerateSummary: (id: string) => void;
  isGeneratingSummary: boolean;
  generatingSummaryId: string | null;
}

export const NotesList: React.FC<NotesListProps> = ({
  notes,
  searchQuery,
  onEdit,
  onDelete,
  onGenerateSummary,
  isGeneratingSummary,
  generatingSummaryId,
}) => {
  const filteredNotes = notes.filter((note) =>
    note.transcript.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (filteredNotes.length === 0) {
    return <p className="text-gray-500">No notes found</p>;
  }

  return (
    <div className="grid gap-4">
      {filteredNotes.map((note) => (
        <NoteCard
          key={note._id}
          note={note}
          onEdit={onEdit}
          onDelete={onDelete}
          onGenerateSummary={onGenerateSummary}
          isGeneratingSummary={isGeneratingSummary && generatingSummaryId === note._id}
        />
      ))}
    </div>
  );
};
