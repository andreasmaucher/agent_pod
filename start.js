// start.js
import { spawn } from "child_process";

const runVite = () => {
  const vite = spawn("npm", ["run", "dev"], {
    cwd: "bolt_frontend",
    stdio: "inherit",
  });
  vite.on("close", (code) => {
    console.log(`Vite process exited with code ${code}`);
  });
};

const runAiConversation = () => {
  const aiConversation = spawn("node", ["ai-conversation.js"], {
    stdio: "inherit",
  });
  aiConversation.on("close", (code) => {
    console.log(`AI Conversation process exited with code ${code}`);
  });
};

// Run both processes
runVite();
runAiConversation();
