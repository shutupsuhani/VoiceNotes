import React from "react";
import { Mic, LogOut, User as UserIcon } from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface HeaderProps {
  onBackToLanding: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onBackToLanding }) => {
  const { user, logoutUser } = useAuth();

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <button
          onClick={onBackToLanding}
          className="flex items-center space-x-3 hover:opacity-80 transition-opacity duration-200"
        >
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-xl shadow-md">
            <Mic className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-800">VoiceNotes</span>
        </button>

        {user && (
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3 bg-gray-50 rounded-lg px-4 py-2">
              <div className="bg-blue-100 p-2 rounded-full">
                <UserIcon className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-sm">
                <p className="font-medium text-gray-900">{user.username}</p>
                <p className="text-gray-500">{user.email}</p>
              </div>
            </div>
            <button
              onClick={logoutUser}
              className="flex items-center px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
