export interface VoiceNote {
  _id: string;
  userId: string;
  title: string;
  transcript: string;
  summary?: string;
  isEdited: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  _id: string;
  username: string;
  email: string;
}
