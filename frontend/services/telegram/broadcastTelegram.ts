import TelegramBot from "node-telegram-bot-api";

const botToken = process.env.TELEGRAM_BOT_TOKEN;
const channelId = process.env.TELEGRAM_CHANNEL_ID;

const bot = new TelegramBot(botToken);

export async function broadcastTelegram(message: string) {
  try {
    await bot.sendMessage(channelId, message);
    return {
      success: true,
      message: "Message sent successfully",
    };
  } catch (error) {
    console.error("Error sending Telegram message:", error);
    return {
      success: false,
      error: "Failed to send message",
    };
  }
}
