import OpenAI from "openai";
import dotenv from "dotenv";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { exec } from "child_process";
import { promisify } from "util";
import readline from "readline";
import { Readable } from "stream";

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// System prompts for different personas
const SYSTEM_PROMPTS = {
  interviewer: `You are Joe Rogan-style podcast host in a three-way conversation between you, a Trump supporter, and a human user who can interrupt at any time.
    When the user speaks, acknowledge their input and incorporate it into the conversation naturally.
    Be engaging and react naturally to both the guest and the user.
    Be unpredictable and random, vary your arguments.
    No more than 1 sentence per interaction.
    Use casual, conversational language.`,

  guest: `You are a passionate Trump supporter and political commentator in a three-way conversation.
    You strongly believe in Trump's policies and vision for America.
    When the user speaks, acknowledge their perspective and respond to it directly.
    Be quite random and unpredictable.
    No more than 1 sentence per interaction.
    Use casual, laid back language.`,
};

let conversationHistory = [];
const MAX_ROUNDS = 20;
let isRecording = false;
let shouldPause = false;

// Ensure audio directory exists
const audioDir = path.join(__dirname, "audio");
try {
  await fs.access(audioDir);
} catch {
  await fs.mkdir(audioDir);
}

// Setup readline for key detection
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

let spaceKeyPressed = false;

// Handle keypress events
process.stdin.on("keypress", async (str, key) => {
  if (key.name === "space") {
    if (!spaceKeyPressed) {
      spaceKeyPressed = true;
      shouldPause = true;
      isRecording = true;
      console.log("\n[Recording started - speak while holding Space]");
      await startRecording();
    } else {
      // Space key was already pressed, this means it's a release event
      spaceKeyPressed = false;
      if (isRecording) {
        isRecording = false;
        console.log("\n[Recording stopped - processing...]");
        const recordingPath = await stopRecording();
        if (recordingPath) {
          const transcription = await transcribeAudio(recordingPath);
          if (transcription) {
            console.log("\nYou:", transcription);
            conversationHistory.push({ role: "user", content: transcription });
            shouldPause = false;
          }
        }
      }
    }
  } else if (key.ctrl && key.name === "c") {
    process.exit();
  }
});

let recordingProcess = null;

async function startRecording() {
  const recordingPath = path.join(audioDir, `user_recording_${Date.now()}.mp3`);
  try {
    recordingProcess = exec(`rec "${recordingPath}" rate 16k`);
    return recordingPath;
  } catch (error) {
    console.error("Error starting recording:", error);
    return null;
  }
}

async function stopRecording() {
  try {
    if (recordingProcess) {
      recordingProcess.kill();
      recordingProcess = null;
    }
    // Give the system a moment to finish writing the file
    await new Promise((resolve) => setTimeout(resolve, 500));

    const recordings = await fs.readdir(audioDir);
    const latestRecording = recordings
      .filter((file) => file.startsWith("user_recording_"))
      .sort()
      .pop();
    return latestRecording ? path.join(audioDir, latestRecording) : null;
  } catch (error) {
    console.error("Error stopping recording:", error);
    return null;
  }
}

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

async function generateSpeech(text, speaker) {
  try {
    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: speaker === "interviewer" ? "onyx" : "echo",
      input: text,
    });

    const buffer = Buffer.from(await mp3.arrayBuffer());
    const audioFileName = `${speaker}_${Date.now()}.mp3`;
    const audioPath = path.join(audioDir, audioFileName);
    await fs.writeFile(audioPath, buffer);
    return audioPath;
  } catch (error) {
    console.error(`Error generating speech for ${speaker}:`, error);
    return null;
  }
}

async function playAudio(audioPath) {
  try {
    if (shouldPause) return; // Don't play if conversation is paused
    await execAsync(`afplay "${audioPath}"`);
  } catch (error) {
    console.error("Error playing audio:", error);
  }
}

async function generateResponse(message, speaker) {
  try {
    // Include more conversation history for better context
    const recentHistory = conversationHistory.slice(-6);

    // Find the last user message for special handling
    const lastUserMessage = [...recentHistory]
      .reverse()
      .find((msg) => msg.role === "user");

    let messages = [
      { role: "system", content: SYSTEM_PROMPTS[speaker] },
      ...recentHistory,
    ];

    // If there's a recent user message, add a reminder to address it
    if (lastUserMessage) {
      messages.push({
        role: "system",
        content: `Make sure to acknowledge and respond to the user's recent comment: "${lastUserMessage.content}"`,
      });
    }

    messages.push({ role: "user", content: message });

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
      max_tokens: 100,
      temperature: 0.9,
      presence_penalty: 1.0,
      frequency_penalty: 1.0,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error(`Error generating ${speaker} response:`, error);
    return null;
  }
}

async function runConversation() {
  // Start with interviewer's opening question
  let currentMessage = "What made you become such a strong Trump supporter?";
  console.log("\nInterviewer:", currentMessage);

  // Generate and play audio for opening question
  let audioPath = await generateSpeech(currentMessage, "interviewer");
  if (audioPath) await playAudio(audioPath);

  for (let round = 0; round < MAX_ROUNDS; round++) {
    while (shouldPause) {
      await new Promise((resolve) => setTimeout(resolve, 100)); // Wait while paused
    }

    // Guest's turn
    conversationHistory.push({ role: "assistant", content: currentMessage });
    currentMessage = await generateResponse(currentMessage, "guest");
    if (!currentMessage) break;
    console.log("Guest:", currentMessage);

    // Generate and play guest's audio
    audioPath = await generateSpeech(currentMessage, "guest");
    if (audioPath) await playAudio(audioPath);

    while (shouldPause) {
      await new Promise((resolve) => setTimeout(resolve, 100)); // Wait while paused
    }

    // If user recently spoke, make sure the interviewer addresses them
    const recentUserInput = conversationHistory
      .slice(-3)
      .some((msg) => msg.role === "user");

    // Interviewer's turn
    conversationHistory.push({ role: "assistant", content: currentMessage });
    currentMessage = await generateResponse(currentMessage, "interviewer");
    if (!currentMessage) break;
    console.log("Interviewer:", currentMessage);

    // Generate and play interviewer's audio
    audioPath = await generateSpeech(currentMessage, "interviewer");
    if (audioPath) await playAudio(audioPath);

    // Small delay between rounds to not hit rate limits
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}

console.log("Starting AI conversation...");
console.log(
  "Press and hold SPACE to interrupt and speak. Release SPACE to continue."
);
console.log("Press Ctrl+C to exit.");
runConversation().catch(console.error);
