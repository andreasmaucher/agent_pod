import fs from "fs";
import path from "path";
import OpenAI from "openai";
import dotenv from "dotenv";
import { exec } from "child_process"; // Import exec for playing audio

// Load environment variables from .env file
dotenv.config();

// Initialize OpenAI with API key from .env
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function textToSpeech(text, outputPath, voice = "alloy") {
  try {
    const speechFile = path.resolve(outputPath);

    // Convert the text to speech
    const mp3Stream = openai.audio.speech.create({
      model: "tts-1",
      voice: voice,
      input: text,
      speed: 10, // Increase speed
      pitch: 3.0, // Adjust pitch if needed
    });

    // Start playing audio while it's being prepared
    const playAudio = exec(`afplay ${speechFile}`); // Use appropriate command for your OS

    // Stream the audio to the file
    const writeStream = fs.createWriteStream(speechFile);
    mp3Stream.on("data", (chunk) => {
      writeStream.write(chunk); // Write each chunk to the file
      // Optionally, you can play the chunk directly if your player supports it
      playAudio.stdin.write(chunk); // Uncomment if your player supports streaming input
    });

    mp3Stream.on("end", () => {
      writeStream.end(); // Close the write stream when done
      console.log("Audio file created successfully!");
      playAudio.kill(); // Stop playing audio after it's done
    });

    mp3Stream.on("error", (error) => {
      console.error("Error streaming audio:", error);
      writeStream.end(); // Ensure the write stream is closed on error
      playAudio.kill(); // Stop playback on error
    });

    return speechFile;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}
