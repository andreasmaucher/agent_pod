import fs from "fs";
import path from "path";
import OpenAI from "openai";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Initialize OpenAI with API key from .env
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function textToSpeech(text, outputPath, voice = "alloy") {
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
    
    return speechFile;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}
