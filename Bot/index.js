const { Telegraf } = require("telegraf");
const TOKEN = "7333536576:AAEy1MtDXijiY1NYEEMCFv3L73cpnDbWrek";
const bot = new Telegraf(TOKEN);

const web_link = "https://web-app-tme-interface.vercel.app/";

bot.start((ctx) => {
  const userId = ctx.from.id;
  const webAppUrl = `${web_link}?user_id=${userId}`;
  ctx.reply("Welcome our fucking bot", {
    reply_markup: {
      keyboard: [[{ text: "web app", web_app: { url: webAppUrl } }]],
    },
  });
});

bot.launch();
  