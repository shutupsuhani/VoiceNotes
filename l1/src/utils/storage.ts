import { VoiceNote } from '../types';

const STORAGE_KEY = 'voice-notes';

export const saveNotes = (notes: VoiceNote[]): void => {
  try {
    // Convert notes to storable format (without Blob objects)
    const storableNotes = notes.map(note => ({
      ...note,
      audioBlob: undefined, // Don't store Blob objects
      audioUrl: undefined, // Don't store object URLs
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storableNotes));
  } catch (error) {
    console.error('Failed to save notes:', error);
  }
};

export const loadNotes = (): VoiceNote[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const notes = JSON.parse(stored);
    return notes.map((note: any) => ({
      ...note,
      createdAt: new Date(note.createdAt),
      updatedAt: new Date(note.updatedAt),
    }));
  } catch (error) {
    console.error('Failed to load notes:', error);
    return [];
  }
};

export const clearStorage = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};