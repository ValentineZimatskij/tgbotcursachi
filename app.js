const TelegramApi = require("node-telegram-bot-api");
let language, pz, username;
const token = "6588329065:AAGfPqzD-9uiDWMbJ-N5_8C1mxFtCdvHbBQ";
const bot = new TelegramApi(token, { polling: true });

const languageButtons = {
  reply_markup: JSON.stringify({
    inline_keyboard: [
      [{ text: "C++", callback_data: "C++" }],
      [{ text: "C#", callback_data: "C#" }],
    ],
  }),
};

const pzButtons = {
  reply_markup: JSON.stringify({
    inline_keyboard: [
      [{ text: "С ПЗ", callback_data: "с пз" }],
      [{ text: "Без ПЗ", callback_data: "без пз" }],
    ],
  }),
};

let startMessages = (msg) => {
  const text = msg.text;
  const chatId = msg.chat.id;

  if (text === "/start") {
    bot.sendMessage(
      chatId,
      "Выберите язык программирования для курсача",
      languageButtons
    );

    bot.on("callback_query", languageButtonCallback);
  }
};

let languageButtonCallback = (msg) => {
  const chatId = msg.message.chat.id;
  language = msg.data;

  if (language) {
    bot.sendMessage(chatId, "Нужна пояснительная записка?", pzButtons);

    bot.removeListener("callback_query", languageButtonCallback);

    bot.on("callback_query", pzButtonCallback);
  }
};

let finalMessages = (msg) => {
  username = msg.from.username;

  if (username == undefined) {
    bot.sendMessage(
      1153901754,
      `Выбрали ${language}  ${pz} <a href ='tg://user?id=${msg.chat.id}'>Пользователь</a> ${msg.text}`,
      {
        parse_mode: "HTML",
      }
    );

    bot.sendMessage(
      708034703,
      `Выбрали ${language}  ${pz} <a href ='tg://user?id=${msg.chat.id}'>Пользователь</a> ${msg.text}`,
      {
        parse_mode: "HTML",
      }
    );
  } else {
    bot.sendMessage(
      1153901754,
      `Выбрали ${language}  ${pz} @${username} ${msg.text}`
    );

    bot.sendMessage(
      708034703,
      `Выбрали ${language}  ${pz} @${username} ${msg.text}`
    );
  }

  bot.removeListener("message", finalMessages);
};

let pzButtonCallback = (msg) => {
  const chatId = msg.message.chat.id;
  pz = msg.data;

  if (pz) {
    bot.sendMessage(chatId, "Опишите, что должно быть в курсаче:");

    bot.removeListener("callback_query", pzButtonCallback);

    bot.on("message", finalMessages);
  }
};

function start() {
  bot.on("message", startMessages);
}

start();
