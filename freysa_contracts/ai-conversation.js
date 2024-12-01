import fs from "fs";
import path from "path";
import OpenAI from "openai";
import dotenv from "dotenv";
import { recordVoice } from "./voice-recorder.js";
import { textToSpeech } from "./text-to-speech.js";
import { execAsync } from "./exec-async.js";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Create directories if they don't exist
const RECORDS_DIR = "./conversation_records";
const RECORDINGS_DIR = path.join(RECORDS_DIR, "player_inputs");

[RECORDS_DIR, RECORDINGS_DIR].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const DEBUG_MODE = process.env.DEBUG_MODE === "true";

async function savePlayerInput(audioPath, transcription, roundNumber) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

  // Copy audio file to recordings directory with round number
  const savedAudioPath = path.join(
    RECORDINGS_DIR,
    `player_input_round${roundNumber}_${timestamp}.mp3`
  );
  await fs.promises.copyFile(audioPath, savedAudioPath);

  // Save transcription to log file
  const logPath = path.join(RECORDINGS_DIR, "player_inputs.log");
  const logEntry = `\n[Round ${roundNumber} - ${timestamp}]\nAudio: ${path.basename(
    savedAudioPath
  )}\nTranscription: ${transcription}\n`;
  await fs.promises.appendFile(logPath, logEntry);

  console.log(` Saved recording to: ${savedAudioPath}`);
}

async function transcribeAudio(audioPath) {
  try {
    console.log(" Transcribing audio...");

    // Create a readable stream from the audio file
    const audioStream = fs.createReadStream(audioPath);

    const response = await openai.audio.transcriptions.create({
      file: audioStream,
      model: "whisper-1",
      response_format: "text",
      language: "en",
      prompt:
        "This is a casual English conversation about politics, Trump, and the upcoming election. Be engaging, dynamic, and unpredictable.",
      temperature: 1.8,
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

async function getPlayerInput(round) {
  try {
    if (DEBUG_MODE) {
      // In debug mode, use readline for CLI input
      const { createInterface } = await import("readline/promises");
      const readline = createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      const input = await readline.question(
        "\n Your turn! Enter your response: "
      );
      readline.close();
      return input;
    } else {
      // Normal voice recording mode
      console.log("\n Recording your response in 3...");
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("2...");
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("1...");
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const outputPath = path.join(
        RECORDINGS_DIR,
        `player_input_round${round}_${timestamp}.mp3`
      );
      await recordVoice(outputPath);

      // Transcribe the recording
      const transcription = await transcribeAudio(outputPath);
      console.log("\n You said:", transcription);
      return transcription;
    }
  } catch (error) {
    console.error("Error getting player input:", error);
    return null;
  }
}

async function playResponseIfNeeded(audioPath) {
  if (!DEBUG_MODE) {
    await playAudioFile(audioPath);
  }
}

async function playAudioFile(filePath) {
  try {
    console.log(` Playing: ${path.basename(filePath)}`);
    await execAsync(`afplay "${filePath}"`);
  } catch (error) {
    console.error(`Error playing audio: ${error.message}`);
  }
}

function enhanceEmotionalSpeech(text, isAgent1) {
  // Add pauses and emphasis
  let enhancedText = text
    // Add pauses after punctuation
    .replace(/\./g, "... ")
    .replace(/\!/g, "! ... ")
    .replace(/\?/g, "? ... ")
    // Add emphasis for important words
    .replace(/Trump/g, "TRUMP")
    .replace(/America/g, "AMERICA")
    .replace(/freedom/g, "FREEDOM");

  // Add emotional markers based on agent
  if (isAgent1) {
    // Interviewer: More thoughtful, questioning tone
    enhancedText = enhancedText
      .replace(/interesting/gi, "fascinating")
      .replace(/what do you think/gi, "what are your thoughts")
      .replace(/tell me/gi, "help me understand");
  } else {
    // Trump Supporter: More passionate, energetic tone
    enhancedText = enhancedText
      .replace(/good/gi, "GREAT")
      .replace(/like/gi, "LOVE")
      .replace(/support/gi, "STRONGLY support")
      // Add enthusiasm markers
      .replace(/!/g, "!! ");
  }

  return enhancedText;
}

async function getAIResponse(
  prompt,
  isAgent1 = true,
  askPlayer = false,
  playerInput = null
) {
  try {
    const role = isAgent1 ? "Neutral Interviewer" : "Trump Supporter";
    const voiceType = isAgent1 ? "echo" : "onyx";
    console.log(`\n${isAgent1 ? " Interviewer" : " Guest"} says: `);

    let systemContent = "";
    if (isAgent1) {
      systemContent = `You are Joe Rogan-style podcast host interviewing a Trump supporter. 
        Be engaging and react naturally. Use vocal variety - be curious, surprised, or thoughtful.
        Show genuine interest with phrases like "That's fascinating", "Help me understand", "What strikes me is".
        If someone makes an interesting point, lean into it with enthusiasm.`;
      if (playerInput) {
        systemContent +=
          " When referencing the listener's perspective, use an intrigued, curious tone.";
      }
      if (askPlayer) {
        systemContent +=
          " When asking the listener's opinion, be genuinely curious and engaging.";
      }
    } else {
      systemContent = `You are a passionate Trump supporter being interviewed. 
        Be VERY enthusiastic and emotional! Use strong, energetic language.
        Emphasize words like GREAT, AMAZING, INCREDIBLE.
        Show your passion with exclamation marks and patriotic references.
        React with strong emotion - either excited agreement or passionate disagreement.`;
      if (playerInput) {
        systemContent +=
          " React to the listener's view with genuine emotion - either enthusiastic support or passionate counter-arguments.";
      }
    }

    let messages = [{ role: "system", content: systemContent }];

    if (playerInput) {
      messages.push({
        role: "system",
        content: `The listener just said: "${playerInput}". React with genuine emotion to their point.`,
      });
    }

    messages.push({ role: "user", content: prompt });

    const completion = await openai.chat.completions.create({
      messages,
      model: "gpt-3.5-turbo",
      // max_tokens: 100,
      temperature: 1.8,
    });

    let response = completion.choices[0].message.content;
    response = enhanceEmotionalSpeech(response, isAgent1);
    console.log(response);

    let audioPath = null;
    if (!DEBUG_MODE) {
      // Only generate audio in non-debug mode
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const speaker = isAgent1 ? "interviewer" : "guest";
      audioPath = path.join(
        RECORDS_DIR,
        `${speaker}_round${currentRound}_${timestamp}.mp3`
      );
      await textToSpeech(response, audioPath, voiceType);
    }

    return { text: response, audioPath };
  } catch (error) {
    console.error("Error getting AI response:", error);
    return null;
  }
}

let currentRound = 1;

async function runConversation(rounds = 2) {
  try {
    console.log(
      `\n Welcome to the Interactive Political Podcast! [${
        DEBUG_MODE ? "Debug Mode" : "Voice Mode"
      }]`
    );
    if (!DEBUG_MODE) {
      // Clean up existing files only in voice mode
      const files = fs.readdirSync(".");
      files.forEach((file) => {
        if (file.startsWith("player_input_") && file.endsWith(".mp3")) {
          fs.unlinkSync(file);
        }
      });

      console.log(
        "You can participate in the conversation between the host and the guest."
      );
      console.log(
        "After each response, you'll have a chance to speak your thoughts or questions."
      );
      console.log(
        `Your recordings will be saved in the '${RECORDS_DIR}' directory.`
      );
    } else {
      console.log("Debug mode: Enter your responses through the command line.");
      console.log("No audio will be recorded or played.");
    }

    let currentPrompt =
      "Let's dive right in! Tell us why you believe TRUMP will be VICTORIOUS in 2024! What makes you so PASSIONATE about his chances?";
    let lastPlayerInput = null;

    for (let i = 0; i < rounds; i++) {
      currentRound = i + 1;
      console.log(`\n--- Round ${currentRound} ---`);

      // Interviewer asks a question and asks for player's opinion
      const agent1Response = await getAIResponse(
        currentPrompt,
        true,
        true,
        lastPlayerInput
      );
      await playResponseIfNeeded(agent1Response.audioPath);

      // Get player's input after interviewer
      const playerInput = await getPlayerInput(currentRound);
      lastPlayerInput = playerInput;

      // Guest responds to both interviewer and player with high emotion
      const guestPrompt = playerInput
        ? `The interviewer said: "${agent1Response.text}" and a listener responded: "${playerInput}". Share your PASSIONATE thoughts on both points!`
        : `${agent1Response.text} Give your most ENERGETIC response!`;
      const agent2Response = await getAIResponse(
        guestPrompt,
        false,
        false,
        playerInput
      );
      await playResponseIfNeeded(agent2Response.audioPath);

      // Update prompt for next round based on the full context
      if (playerInput) {
        currentPrompt = `The listener said: "${playerInput}" and our passionate guest responded: "${agent2Response.text}". 
          Dive deeper into these fascinating perspectives with an engaging follow-up question!`;
      } else {
        currentPrompt = `Our fired-up guest just said: "${agent2Response.text}". 
          What FASCINATING aspect of their perspective would you like to explore further?`;
      }
    }

    console.log("\nConversation completed!");
    if (!DEBUG_MODE) {
      console.log(
        `All recordings have been saved in the '${RECORDS_DIR}' directory.`
      );
      console.log(`Your inputs are in the '${RECORDINGS_DIR}' subdirectory.`);
    }
  } catch (error) {
    console.error("Error during conversation:", error);
  }
}

// Start the conversation
runConversation();
