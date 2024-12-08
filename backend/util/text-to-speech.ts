import fs from "fs";
import path from "path";
import OpenAI from "openai";
import dotenv from "dotenv";
import { exec } from "child_process";

// Load environment variables from .env file
dotenv.config();

// Initialize OpenAI with API key from .env
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const playAudioFile = (filePath: string) => {
  return new Promise((resolve, reject) => {
    const playAudio = exec(`afplay ${filePath}`);

    playAudio.on("exit", (code) => {
      if (code === 0) {
        resolve(undefined);
      } else {
        reject(new Error(`Audio playback failed with code ${code}`));
      }
    });

    if (!playAudio.stderr) {
      throw new Error("Play audio process has no stderr");
    }
    playAudio.stderr.on("data", (data) => {
      console.error(`stderr: ${data}`);
    });
  });
};

export async function textToSpeech(
  text: string,
  outputPath: string,
  voice: "alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer" = "alloy"
) {
  try {
    const speechFile = path.resolve(outputPath);

    // Convert the text to speech
    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: voice,
      input: text,
    });

    console.log("Saving to:", speechFile);
    const buffer = Buffer.from(await mp3.arrayBuffer());
    await fs.promises.writeFile(speechFile, buffer);
    console.log("Audio file created successfully!");

    // Play the audio file and wait for it to finish
    await playAudioFile(speechFile);

    return speechFile;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}
