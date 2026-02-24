
import TelegramBot from "node-telegram-bot-api";

const sendTelegram = async (message) => {
  const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: false });
  console.log("Telegram Message:", message);
  await bot.sendMessage(process.env.CHAT_ID, message);
};

export default sendTelegram;
