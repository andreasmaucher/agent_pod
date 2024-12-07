import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import fs from "fs/promises";
import OpenAI from "openai";
import {
  startRecording,
  stopRecording,
  isCurrentlyRecording,
} from "./util/voice-recorder.js";
import dotenv from "dotenv";
import { PERSONAS } from "./ai_personas/index.js";
import type { ChatCompletionMessageParam } from "openai/resources/index.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Create audio directory if it doesn't exist
const audioDir = path.join(__dirname, "audio");
try {
  await fs.access(audioDir);
} catch {
  await fs.mkdir(audioDir);
}

// // Serve audio files statically
app.use("/audio", express.static(path.join(__dirname, "audio")));

// Move the declaration outside the try-catch
let openai: OpenAI;

console.log("Initializing OpenAI...");
try {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  console.log("OpenAI initialized successfully");
} catch (error) {
  console.error("Error initializing OpenAI:", error);
  throw error;
}

let conversationHistory: ChatCompletionMessageParam[] = [];
let currentRound = 0;
const MAX_ROUNDS = 20;
let lastUserInput = "";

async function transcribeAudio(audioPath: string) {
  try {
    const audioFile = await fs.readFile(audioPath);
    const transcript = await openai.audio.transcriptions.create({
      file: new File([audioFile], "audio.mp3", { type: "audio/mp3" }),
      model: "whisper-1",
    });
    return transcript.text;
  } catch (error) {
    console.error("Error transcribing audio:", error);
    return null;
  }
}

async function generateAIResponse(userInput: string, speaker: string) {
  try {
    // Take only the last 4 messages for context, but ensure we have the last user input
    const recentHistory = conversationHistory.slice(-4);
    const messages: ChatCompletionMessageParam[] = [
      { role: "system", content: PERSONAS[speaker]! },
      ...recentHistory,
      { role: "user", content: userInput },
    ];

    console.log(`Generating ${speaker} response...`);
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
      max_tokens: 100,
      temperature: 0.9,
      presence_penalty: 1.0,
      frequency_penalty: 1.0,
    });

    const aiResponse = completion.choices[0]?.message?.content;
    if (!aiResponse) {
      throw new Error("No AI response generated");
    }

    console.log(`${speaker} response text:`, aiResponse);

    // TTS code block start
    // Generate audio for the response in chunks
    console.log(`Generating audio for ${speaker} in chunks...`);
    const audioChunks = [];
    const chunkSize = 100; // Define your chunk size based on your needs

    for (let i = 0; i < aiResponse.length; i += chunkSize) {
      const chunk = aiResponse.slice(i, i + chunkSize);
      const mp3 = await openai.audio.speech.create({
        model: "tts-1",
        voice: speaker === "interviewer" ? "onyx" : "echo",
        input: chunk,
      });
      const buffer = Buffer.from(await mp3.arrayBuffer());
      audioChunks.push(buffer);
    }

    // Concatenate all chunks into a single buffer
    const audioBuffer = Buffer.concat(audioChunks);

    // Save audio file
    const audioFileName = `${speaker}_response_${Date.now()}.mp3`;
    const audioPath = path.join(__dirname, "audio", audioFileName);
    await fs.writeFile(audioPath, audioBuffer);

    console.log(`Audio saved to: ${audioPath}`);

    // Verify the file exists and has content
    const stats = await fs.stat(audioPath);
    if (stats.size === 0) {
      throw new Error("Generated audio file is empty");
    }

    console.log(`Audio file size: ${stats.size} bytes`);

    return {
      text: aiResponse,
      audioFile: `audio/${audioFileName}`,
    };
  } catch (error) {
    console.error(`Error generating ${speaker} response:`, error);
    return null;
  }
}

// TODO: FIX THIS - recording needs to happen on FE
app.post("/start-recording", async (req, res) => {
  if (isCurrentlyRecording()) {
    res.status(400).json({ error: "Already recording" });
    return;
  }

  const recordingPath = path.join(
    __dirname,
    "audio",
    `user_recording_${Date.now()}.mp3`
  );
  const success = await startRecording(recordingPath);

  if (success) {
    res.json({ success: true });
  } else {
    res.status(500).json({ error: "Failed to start recording" });
  }
});

app.post("/stop-recording", async (req, res) => {
  if (!isCurrentlyRecording()) {
    res.status(400).json({ error: "Not recording" });
    return;
  }

  try {
    console.log("Stopping recording...");
    const recordingPath = await stopRecording();
    if (!recordingPath) {
      res.status(500).json({ error: "Failed to stop recording" });
      return;
    }

    console.log("Transcribing audio...");
    const transcription = await transcribeAudio(recordingPath);
    if (!transcription) {
      res.status(500).json({ error: "Failed to transcribe recording" });
      return;
    }
    console.log("Transcription:", transcription);

    lastUserInput = transcription;
    conversationHistory.push({ role: "user", content: transcription });

    console.log("Generating interviewer response...");
    const interviewerResponse = await generateAIResponse(
      transcription,
      "interviewer"
    );
    if (!interviewerResponse) {
      res.status(500).json({ error: "Failed to generate interviewer response" });
      return;
    }
    conversationHistory.push({
      role: "assistant",
      content: interviewerResponse.text,
    });

    console.log("Generating guest response...");
    const guestResponse = await generateAIResponse(
      interviewerResponse.text,
      "guest"
    );
    if (!guestResponse) {
      res.status(500).json({ error: "Failed to generate guest response" });
      return;
    }
    conversationHistory.push({
      role: "assistant",
      content: guestResponse.text,
    });

    currentRound++;

    const response = {
      success: true,
      transcription,
      responses: [
        {
          speaker: "interviewer",
          text: interviewerResponse.text,
          audioFile: interviewerResponse.audioFile,
        },
        {
          speaker: "guest",
          text: guestResponse.text,
          audioFile: guestResponse.audioFile,
        },
      ],
      round: currentRound,
      isComplete: currentRound >= MAX_ROUNDS,
    };

    console.log("Sending response:", response);
    res.json(response);
  } catch (error) {
    console.error("Error processing recording:", error);
    res.status(500).json({ error: "Failed to process recording" });
  }
});

app.post("/reset-conversation", (req, res) => {
  conversationHistory = [];
  currentRound = 0;
  lastUserInput = "";
  res.json({ success: true });
});

app.get("/conversation-status", (req, res) => {
  res.json({
    isActive: currentRound < MAX_ROUNDS,
    currentRound,
    totalRounds: MAX_ROUNDS,
    isRecording: isCurrentlyRecording(),
  });
});

const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
});

server.on("error", (error) => {
  console.error("Server error:", error);
});

process.on("SIGTERM", () => {
  server.close(() => {
    console.log("Server shutdown complete");
    process.exit(0);
  });
});
