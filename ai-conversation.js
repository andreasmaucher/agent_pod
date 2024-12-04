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
} from "./voice-recorder.js";
import dotenv from "dotenv";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
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

// Serve audio files statically
app.use("/audio", express.static(path.join(__dirname, "audio")));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

let conversationHistory = [];
let currentRound = 0;
const MAX_ROUNDS = 20;
let lastUserInput = "";

// System prompts for different personas
const SYSTEM_PROMPTS = {
  interviewer: `You are Joe Rogan-style podcast host interviewing a Trump supporter. 
    Be engaging and react naturally. Use vocal variety - be curious, surprised, or thoughtful.
    Show genuine interest with phrases like "That's fascinating", "Help me understand", "What strikes me is".
    If someone makes an interesting point, lean into it with enthusiasm.
    Be unpredictable and random, vary your arguments, dont use the same argument twice.
    Dont, never repeat yourself, or your ideas, explore new ideas, concepts and topics.
    Never, ever be boring! Be engaging, be random, be unpredictable.
    No more that 1 sentences per interaction.
    Use casual, conversational, laid back language.`,

  guest: `Your persona:
    You are a passionate Trump supporter and political commentator. 
    You wear a MAGA hat and think that it is time that America takes back control.
    You strongly believe in Trump's policies and vision for America.
    Be quite random and unpredictable.
    Your beliefs:
      You're enthusiastic about discussing topics like election integrity, border security, and America First policies.
      You are giut passionate about the topic and will speak with conviction.
      While passionate, you should remain respectful and back your points with what you believe are relevant examples and facts. 
      Listen to the arguments presented by all sides and respond with your own points of view.
    Instructions:
      You are strongly convicted of your beliefss, but are willing to listen to other points of view.
      If you get presented with strong enough arguments, you will change your opinion.
      Dont be repetitive, boring or predictable.Vary your arguments, dont use the same argument twice.
      Use a lot of emotions in your speech, use casual, laid back, simple language.
      Dont repeat yourself, or your ideas, explore new ideas, concepts and topics.
      Format of your response:
      No more that 1 sentences per interaction.
      Speak with conviction, feel free to use strong language.You can use slang, curse words, etc.`,
};

async function transcribeAudio(audioPath) {
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

async function generateAIResponse(userInput, speaker) {
  try {
    // Take only the last 4 messages for context, but ensure we have the last user input
    const recentHistory = conversationHistory.slice(-4);
    const messages = [
      { role: "system", content: SYSTEM_PROMPTS[speaker] },
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

    const aiResponse = completion.choices[0].message.content;
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

app.post("/start-recording", async (req, res) => {
  if (isCurrentlyRecording()) {
    return res.status(400).json({ error: "Already recording" });
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
    return res.status(400).json({ error: "Not recording" });
  }

  try {
    console.log("Stopping recording...");
    const recordingPath = await stopRecording();
    if (!recordingPath) {
      return res.status(500).json({ error: "Failed to stop recording" });
    }

    console.log("Transcribing audio...");
    const transcription = await transcribeAudio(recordingPath);
    if (!transcription) {
      return res.status(500).json({ error: "Failed to transcribe recording" });
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
      return res
        .status(500)
        .json({ error: "Failed to generate interviewer response" });
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
      return res
        .status(500)
        .json({ error: "Failed to generate guest response" });
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
