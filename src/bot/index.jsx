const { Telegraf } = require("telegraf");
const TOKEN = "6782375542:AAEsF4BDqc3tBkv4NMryssT4-VpUd8GvzpI";
const bot = new Telegraf(TOKEN);

const web_link = "http://http://localhost:5173";

bot.start((ctx) =>
  ctx.reply("Welcome :)))))", {
    reply_markup: {
      keyboard: [[{ text: "web app", web_app: { url: web_link } }]],
    },
  })
);

bot.launch();