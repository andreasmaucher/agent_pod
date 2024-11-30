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

const speechFile = path.resolve("./speech.mp3");

async function main() {
  try {
    // First, get response from ChatGPT
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: "Tell me an interesting fact about space."
        }
      ],
    });

    // Get the bot's response
    const botResponse = chatCompletion.choices[0].message.content;
    console.log("Bot's response:", botResponse);

    // Convert the response to speech
    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: "alloy",
      input: botResponse,
    });

    console.log("Saving to:", speechFile);
    const buffer = Buffer.from(await mp3.arrayBuffer());
    await fs.promises.writeFile(speechFile, buffer);
    console.log("Audio file created successfully!");
  } catch (error) {
    console.error("Error:", error);
  }
}

main();
