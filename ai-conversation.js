import fs from "fs";
import path from "path";
import OpenAI from "openai";
import dotenv from "dotenv";
import { recordVoice } from "./voice-recorder.js";
import { textToSpeech } from "./text-to-speech.js";
import { SYSTEM_PROMPTS } from "./ai_personas/prompts.js";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Create recordings directory if it doesn't exist
const RECORDINGS_DIR = "./recordings";
if (!fs.existsSync(RECORDINGS_DIR)) {
  fs.mkdirSync(RECORDINGS_DIR);
}

async function savePlayerInput(audioPath, transcription, roundNumber) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const recordingDir = "./recordings";

  // Ensure recordings directory exists
  if (!fs.existsSync(recordingDir)) {
    fs.mkdirSync(recordingDir);
  }

  // Copy audio file to recordings directory with round number
  const savedAudioPath = path.join(
    recordingDir,
    `player_input_round${roundNumber}_${timestamp}.mp3`
  );
  await fs.promises.copyFile(audioPath, savedAudioPath);

  // Save transcription to log file
  const logPath = path.join(recordingDir, "player_inputs.log");
  const logEntry = `\n[Round ${roundNumber} - ${timestamp}]\nAudio: ${path.basename(
    savedAudioPath
  )}\nTranscription: ${transcription}\n`;
  await fs.promises.appendFile(logPath, logEntry);

  console.log(`💾 Saved recording to: ${savedAudioPath}`);
}

async function transcribeAudio(audioPath) {
  try {
    console.log("🔄 Transcribing audio...");

    // Create a readable stream from the audio file
    const audioStream = fs.createReadStream(audioPath);

    const response = await openai.audio.transcriptions.create({
      file: audioStream,
      model: "whisper-1",
      response_format: "text",
      language: "en",
      prompt:
        "This is a casual English conversation about politics, Trump, and the upcoming election.",
      temperature: 0.2,
    });

    if (!response) {
      throw new Error("No transcription returned from OpenAI");
    }

    return response;
  } catch (error) {
    console.error("Error transcribing audio:", error.message);
    if (error.response) {
      console.error("OpenAI API error:", error.response.data);
    }
    return null;
  }
}

async function getPlayerInput(roundNumber) {
  // Generate unique filename for this round
  const audioPath = `./player_input_${roundNumber}.mp3`;

  console.log("\n🎤 Your turn to speak!");
  console.log("💡 Instructions:");
  console.log("1. Stay quiet for 1 second (sampling background noise)");
  console.log("2. When prompted, speak clearly in English for 5 seconds");

  // Record player's voice
  const recordingSuccess = await recordVoice(audioPath);
  if (!recordingSuccess) {
    console.error("❌ Failed to record voice. Please try again.");
    return null;
  }

  try {
    // Check if file exists and has content
    const stats = fs.statSync(audioPath);
    if (stats.size === 0) {
      console.error("❌ Recording file is empty. Please try again.");
      return null;
    }

    console.log("🔄 Processing your response...");

    // Transcribe the recording
    const transcription = await transcribeAudio(audioPath);
    if (!transcription) {
      console.error("❌ Failed to transcribe audio. Please try again.");
      return null;
    }

    console.log("\n🗣️ You said:", transcription);

    // Save the recording and transcription with round number
    await savePlayerInput(audioPath, transcription, roundNumber);

    return transcription;
  } catch (error) {
    console.error("Error processing recording:", error.message);
    return null;
  }
}

async function getAIResponse(prompt, isAgent1 = true) {
  const agentName = isAgent1 ? "Interviewer" : "Guest";
  const systemPrompt = isAgent1
    ? SYSTEM_PROMPTS.interviewer
    : SYSTEM_PROMPTS.guest;
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: prompt },
      {
        role: "system",
        content:
          "Keep your response under 10 seconds when spoken. Be very concise.",
      },
    ],
    max_tokens: 100, // Limit response length
  });

  const message = response.choices[0].message.content;
  console.log(`\n${isAgent1 ? "🎙️ Interviewer" : "👤 Guest"} says: ${message}`);
  return message;
}

async function runConversation(rounds = 2) {
  try {
    // Clean up any existing player input files
    const files = fs.readdirSync(".");
    files.forEach((file) => {
      if (file.startsWith("player_input_") && file.endsWith(".mp3")) {
        fs.unlinkSync(file);
      }
    });

    console.log("\n🎙️ Welcome to the Interactive Political Podcast!");
    console.log(
      "You can participate in the conversation between the host and the guest."
    );
    console.log(
      "After each response, you'll have a chance to speak your thoughts or questions."
    );
    console.log("Your inputs will be saved in the 'recordings' directory.");

    let currentPrompt =
      "Let's start by talking about your thoughts on the upcoming 2024 election. What makes you confident about Trump's chances?";

    for (let i = 0; i < rounds; i++) {
      console.log(`\n--- Round ${i + 1} ---`);

      // Interviewer asks a question
      const agent1Response = await getAIResponse(currentPrompt, true);
      await textToSpeech(
        agent1Response,
        `./interviewer_round${i + 1}.mp3`,
        "onyx"
      );

      // Guest responds
      const agent2Response = await getAIResponse(agent1Response, false);
      await textToSpeech(
        agent2Response,
        `./guest_round${i + 1}.mp3`,
        "shimmer"
      );

      // Get player's input
      console.log("\n🎤 Your turn! Share your thoughts or ask a question...");
      const playerInput = await getPlayerInput(i + 1);

      if (playerInput) {
        currentPrompt = `The listener just said: "${playerInput}". Consider this input and continue the discussion while maintaining your role and perspective.`;
      } else {
        currentPrompt = `Based on the previous discussion about "${agent2Response}", what's your next question?`;
      }
    }

    console.log(
      "\nConversation completed! Check the generated MP3 files for audio."
    );
    console.log(
      `Your recordings have been saved in the '${RECORDINGS_DIR}' directory.`
    );
  } catch (error) {
    console.error("Error during conversation:", error);
  }
}

// Start the conversation
runConversation();
