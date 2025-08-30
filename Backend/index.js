import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

import {userRouter} from './routes/authRoute.js';
import noteRoutes from "./routes/noteRoute.js";

dotenv.config();

const app = express();   

// Middleware
app.use(cors());
app.use(cors({
  origin: ["https://voice-notes-bysuhani.vercel.app","http://localhost:5173"], 
  credentials: true, // required for cookies
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json()); 

// Routes
app.use("/api/auth", userRouter); 
app.use("/api/notes",noteRoutes);

// Database connection
const connectToDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

app.get("/", (req, res) => {
  res.send("Welcome to the Task Management App API");
});

// Start the server
const startServer = () => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
  });
};

(async () => {
  await connectToDB();
  startServer();
})();
