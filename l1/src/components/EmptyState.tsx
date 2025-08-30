import React from 'react';
import { Mic, MessageSquare } from 'lucide-react';

interface EmptyStateProps {
  hasSearchQuery: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ hasSearchQuery }) => {
  if (hasSearchQuery) {
    return (
      <div className="text-center py-12">
        <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-medium text-gray-600 mb-2">No matching notes</h3>
        <p className="text-gray-500">Try adjusting your search terms</p>
      </div>
    );
  }

  return (
    <div className="text-center py-16">
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 mx-auto max-w-md">
        <Mic className="w-16 h-16 text-blue-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No voice notes yet</h3>
        <p className="text-gray-500 leading-relaxed">
          Start by recording your first voice note above. Your notes will be automatically transcribed and organized here.
        </p>
      </div>
    </div>
  );
};