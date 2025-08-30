import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, default: "Untitled" },
  transcript: { type: String, required: true }, // text note
  summary: { type: String, default: "" },
  isEdited: { type: Boolean, default: false },
}, { timestamps: true });

export const Note = mongoose.model("Note", noteSchema);
