import React from 'react';
import { Edit, Trash2, FileText, Sparkles, Clock, Loader2 } from 'lucide-react';
import { VoiceNote } from '../types/index';

interface NoteCardProps {
  note: VoiceNote;
  onEdit: (note: VoiceNote) => void;
  onDelete: (id: string) => void;
  onGenerateSummary: (id: string) => void;
  isGeneratingSummary: boolean;
}

export const NoteCard: React.FC<NoteCardProps> = ({
  note,
  onEdit,
  onDelete,
  onGenerateSummary,
  isGeneratingSummary,
}) => {
  const formatDate = (dateStr: string): string => {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "Invalid date";
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
  };

 
  const showGenerateSummary = (!note.summary || note.isEdited);

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-800 line-clamp-2 mb-2">
              {note.title}
            </h3>
            <div className="flex items-center text-sm text-gray-500 space-x-4">
              <span className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {formatDate(note.createdAt)}
              </span>
             
              {note.isEdited && (
                <span className="text-orange-500 font-medium">Edited</span>
              )}
            </div>
          </div>
        </div>

        {/* Transcript */}
        <div className="mb-4">
          <div className="flex items-center mb-2">
            <FileText className="w-4 h-4 text-gray-600 mr-2" />
            <span className="text-sm font-medium text-gray-600">Transcript</span>
          </div>
          <p className="text-gray-700 leading-relaxed line-clamp-3 bg-gray-50 rounded-lg p-3">
            {note.transcript}
          </p>
        </div>

        {/* Summary */}
        {note.summary && (
          <div className="mb-4">
            <div className="flex items-center mb-2">
              <Sparkles className="w-4 h-4 text-purple-600 mr-2" />
              <span className="text-sm font-medium text-purple-600">
                AI Summary
              </span>
            </div>
            <p className="text-gray-700 leading-relaxed bg-purple-50 rounded-lg p-3 border border-purple-100">
              {note.summary}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(note)}
              className="flex items-center px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
            >
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </button>
            <button
              onClick={() => onDelete(note._id)}
              className="flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Delete
            </button>
          </div>

          {/* Generate Summary Button */}
          {showGenerateSummary && (
            <button
              onClick={() => onGenerateSummary(note._id)}
              disabled={isGeneratingSummary}
              className={`group relative overflow-hidden rounded-xl border-2 px-4 py-2 text-sm font-semibold text-white transition-all
                ${isGeneratingSummary
                  ? 'bg-gradient-to-r from-indigo-400 to-purple-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700'}
              `}
            >
              <div className="relative flex items-center justify-center">
                {isGeneratingSummary ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Summary
                  </>
                )}
              </div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
