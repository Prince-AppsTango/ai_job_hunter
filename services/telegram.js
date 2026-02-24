
import TelegramBot from "node-telegram-bot-api";

const sendTelegram = async (message) => {
  const token = process.env.TELEGRAM_TOKEN?.replace(/^["']|["']$/g, '');
  const chatId = process.env.CHAT_ID?.replace(/^["']|["']$/g, '');
  const bot = new TelegramBot(token, { polling: false });
  console.log("Telegram Message:", message);
  await bot.sendMessage(chatId, message);
};

export default sendTelegram;
