import OpenAI from "openai";
import dotenv from "dotenv";
import { textToSpeech } from "./text-to-speech.js";
import { SYSTEM_PROMPTS } from "./ai_personas/prompts.js";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
    ],
  });

  const message = response.choices[0].message.content;
  console.log(`\n${isAgent1 ? "🎙️ Interviewer" : "👤 Guest"} says: ${message}`);
  return message;
}

async function runConversation(rounds = 3) {
  try {
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
      ); // Deep, measured voice for interviewer

      // Guest responds
      const agent2Response = await getAIResponse(agent1Response, false);
      await textToSpeech(
        agent2Response,
        `./guest_round${i + 1}.mp3`,
        "shimmer"
      ); // Energetic voice for the guest

      // Update the prompt for the next round
      currentPrompt = `Your guest just said: "${agent2Response}". Ask a follow-up question that digs deeper into their perspective, while maintaining your neutral interviewer stance. Focus on understanding their viewpoint without challenging it directly.`;
    }

    console.log(
      "\nConversation completed! Check the generated MP3 files for audio."
    );
  } catch (error) {
    console.error("Error during conversation:", error);
  }
}

// Start the conversation
runConversation();
