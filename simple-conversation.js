import OpenAI from "openai";
import dotenv from "dotenv";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// System prompts for different personas
const SYSTEM_PROMPTS = {
  interviewer: `You are Joe Rogan-style podcast host interviewing a Trump supporter. 
    Be engaging and react naturally. Show genuine interest.
    Be unpredictable and random, vary your arguments.
    No more than 1 sentence per interaction.
    Use casual, conversational language.`,

  guest: `You are a passionate Trump supporter and political commentator.
    You strongly believe in Trump's policies and vision for America.
    Be quite random and unpredictable.
    No more than 1 sentence per interaction.
    Use casual, laid back language.`,
};

let conversationHistory = [];
const MAX_ROUNDS = 20;

// Ensure audio directory exists
const audioDir = path.join(__dirname, "audio");
try {
  await fs.access(audioDir);
} catch {
  await fs.mkdir(audioDir);
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
    // Use afplay for macOS, adjust command for other OS if needed
    await execAsync(`afplay "${audioPath}"`);
  } catch (error) {
    console.error("Error playing audio:", error);
  }
}

async function generateResponse(message, speaker) {
  try {
    const recentHistory = conversationHistory.slice(-4);
    const messages = [
      { role: "system", content: SYSTEM_PROMPTS[speaker] },
      ...recentHistory,
      { role: "user", content: message },
    ];

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
    // Guest's turn
    conversationHistory.push({ role: "assistant", content: currentMessage });
    currentMessage = await generateResponse(currentMessage, "guest");
    if (!currentMessage) break;
    console.log("Guest:", currentMessage);

    // Generate and play guest's audio
    audioPath = await generateSpeech(currentMessage, "guest");
    if (audioPath) await playAudio(audioPath);

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
runConversation().catch(console.error);
