import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square } from 'lucide-react';
import { VoiceNote } from '../types';

interface VoiceRecorderProps {
  onNoteCreated: (note: VoiceNote) => void;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onNoteCreated }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [duration, setDuration] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number | null>(null);

  // Start recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Audio context for visualization
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);

      // MediaRecorder
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => audioChunksRef.current.push(e.data);
      mediaRecorderRef.current.start();

      setIsRecording(true);
      setDuration(0);
      setTranscript('');

      intervalRef.current = setInterval(() => setDuration(prev => prev + 1), 1000);
      monitorAudioLevel();
    } catch (err) {
      console.error('Error starting recording:', err);
      alert('Could not access microphone. Check permissions.');
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        uploadAudioToServer(audioBlob); // send to backend

        setIsRecording(false);
        setTranscript('');
        setDuration(0);
        setAudioLevel(0);
      };
    }

    if (intervalRef.current) clearInterval(intervalRef.current);
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    if (audioContextRef.current) audioContextRef.current.close();
  };

  // Monitor audio levels for visualization
  const monitorAudioLevel = () => {
    if (!analyserRef.current) return;
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const updateLevel = () => {
      if (!analyserRef.current || !isRecording) return;
      analyserRef.current.getByteFrequencyData(dataArray);
      const avg = dataArray.reduce((a, b) => a + b, 0) / bufferLength;
      setAudioLevel(avg);
      animationRef.current = requestAnimationFrame(updateLevel);
    };

    updateLevel();
  };

  // Upload audio to backend
  const uploadAudioToServer = async (audioBlob: Blob) => {
    const formData = new FormData();
    formData.append('audio', audioBlob);

    const token = localStorage.getItem('token');
    if (!token) {
      alert('User not authenticated!');
      return;
    }

    try {
      const res = await fetch('http://localhost:4000/api/notes/create', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');
      const note = await res.json();
      onNoteCreated(note); 
    } catch (err) {
      console.error('Failed to upload audio:', err);
      alert('Failed to save note on server.');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Create Voice Note</h2>

      <div className="flex flex-col items-center space-y-6">
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-105 ${
            isRecording
              ? 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-200'
              : 'bg-blue-500 hover:bg-blue-600 shadow-lg shadow-blue-200'
          }`}
        >
          {isRecording ? <Square className="w-8 h-8 text-white" /> : <Mic className="w-8 h-8 text-white" />}
          {isRecording && <div className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-75"></div>}
        </button>

        <div className="text-center">
          <p className="text-lg font-medium text-gray-700">{isRecording ? 'Recording...' : 'Tap to start recording'}</p>
          {isRecording && <p className="text-sm text-gray-500 mt-1">Duration: {formatTime(duration)}</p>}
        </div>

        {isRecording && (
          <div className="flex items-center space-x-1">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className={`w-1 bg-blue-400 rounded-full transition-all duration-150 ${
                  i < (audioLevel / 255) * 20 ? 'h-8' : 'h-2'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
