import React, { useState } from 'react';
import { Save, X } from 'lucide-react';
import { VoiceNote } from '../types/index';

interface NoteEditorProps {
  note: VoiceNote;
  onSave: (updatedNote: VoiceNote) => void;
  onCancel: () => void;
}

export const NoteEditor: React.FC<NoteEditorProps> = ({ note, onSave, onCancel }) => {
  const [title, setTitle] = useState(note.title);
  const [transcript, setTranscript] = useState(note.transcript);

  const handleSave = async () => {
    // Build only the fields that changed
    const updatedNote: Partial<VoiceNote> = {};

    if (title.trim() !== note.title) {
      updatedNote.title = title.trim() || 'Untitled Note';
    }

    if (transcript.trim() !== note.transcript) {
      updatedNote.transcript = transcript.trim();
      updatedNote.summary = ""; // clear summary if transcript changed
    }

    if (
      title.trim() !== note.title ||
      transcript.trim() !== note.transcript
    ) {
      updatedNote.isEdited = true;
      updatedNote.updatedAt = new Date().toISOString();
    }

    try {
      const res = await fetch(`https://voice-notes-backend.vercel.app/api/notes/${note._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`, // if auth
        },
        body: JSON.stringify(updatedNote),
      });

      if (!res.ok) {
        throw new Error("Failed to update note");
      }

      const savedNote = await res.json();
      onSave(savedNote); // send updated note back to parent
    } catch (err) {
      console.error(err);
      alert("Error updating note");
    }
  };

  const isChanged = title !== note.title || transcript !== note.transcript;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Edit Note</h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 140px)' }}>
          {/* Title Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter note title..."
            />
          </div>
          
          {/* Transcript Editor */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Transcript
            </label>
            <textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              rows={12}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
              placeholder="Edit your transcript..."
            />
          </div>
          
          {/* Warning about summary */}
          {note.summary && transcript !== note.transcript && (
            <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <p className="text-sm text-orange-700">
                ⚠️ Editing the transcript will clear the existing summary. You'll need to generate a new summary after saving.
              </p>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!isChanged}
            className="flex items-center px-6 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200 transform hover:scale-105 disabled:scale-100"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};
