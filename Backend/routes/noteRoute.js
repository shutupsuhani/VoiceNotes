import express from "express";
import multer from "multer";
import { AssemblyAI } from "assemblyai";
import  authenticate  from "../middleware/auth.js";
import { Note } from "../models/Note.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const client = new AssemblyAI({
  apiKey: process.env.ASSEMBLYAI_API_KEY,
});

router.post("/create", authenticate, upload.single("audio"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No audio file provided" });

    const audioBuffer = req.file.buffer;
    const transcript = await client.transcripts.transcribe({
      audio: audioBuffer,
      speech_model: "universal",
    });

    const note = await Note.create({
      userId: req.user._id,
      transcript: transcript.text,
      isEdited: false,
    });

    res.json(note);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to transcribe audio" });
  }
});


// Generate summary using Gemini
router.post("/summary/:id", authenticate, async (req, res) => {
  try {
    const noteId = req.params.id;
    const note = await Note.findById(noteId);
    if (!note) return res.status(404).json({ message: "Note not found" });

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Summarize the following note concisely:\n${note.transcript}`,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    // Gemini’s response structure is different from PaLM
    const summary =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Summary not generated";

    note.summary = summary;
    note.isEdited = false;
    await note.save();

    res.json({ summary });
  } catch (err) {
    console.error("Gemini API error:", err);
    res.status(500).json({ message: "Failed to generate summary" });
  }
});


router.get("/getnotes", authenticate, async (req, res) => {
  try {
    const userId = req.user._id;
    const notes = await Note.find({ userId }).sort({ createdAt: -1 });
    res.json(notes);
    console.log(notes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch notes" });
  }
});

// Get note by ID (keep this below so it doesn’t conflict with /getnotes)
router.get("/:id", authenticate, async (req, res) => {
  try {
    const noteId = req.params.id;
    const note = await Note.findOne({ _id: noteId, userId: req.user._id });
    if (!note) return res.status(404).json({ message: "Note not found" });
    res.json(note);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch note" });
  }
});

//update the task
router.patch("/:id", authenticate, async (req, res) => {
  try {
    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      { $set: req.body }, // updates only fields provided
      { new: true }
    );
    res.json(updatedNote);
  } catch (err) {
    res.status(500).json({ message: "Failed to update note" });
  }
});

// Delete note
router.delete("/:id", authenticate, async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.json({ message: "Note deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete note" });
  }
});




export default router;
