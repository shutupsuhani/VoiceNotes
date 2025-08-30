import { useState, useRef, useEffect } from 'react';
import { VoiceNote } from '../types';

export const useAudioPlayer = () => {
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playPause = (note: VoiceNote) => {
    if (currentlyPlaying === note.id) {
      // Pause current audio
      if (audioRef.current) {
        audioRef.current.pause();
        setCurrentlyPlaying(null);
      }
    } else {
      // Stop any current audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      
      // Play new audio
      if (note.audioUrl) {
        audioRef.current = new Audio(note.audioUrl);
        audioRef.current.play().catch(console.error);
        setCurrentlyPlaying(note.id);
        
        audioRef.current.onended = () => {
          setCurrentlyPlaying(null);
        };
        
        audioRef.current.onerror = () => {
          setCurrentlyPlaying(null);
          console.error('Error playing audio');
        };
      }
    }
  };

  const isPlaying = (noteId: string): boolean => {
    return currentlyPlaying === noteId;
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  return { playPause, isPlaying };
};