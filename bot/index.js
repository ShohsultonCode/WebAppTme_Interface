const { Telegraf } = require("telegraf");
const TOKEN = "6847595776:AAFGMoyl9Tm8ReuTHOqoP4trAp5axXDNC8o";
const bot = new Telegraf(TOKEN);

const web_link = "https://web-app-tme-interface.vercel.app/";

bot.start((ctx) =>
  ctx.reply("Welcome :)))))", {
    reply_markup: {
      keyboard: [[{ text: "web app", web_app: { url: web_link } }]],
    },
  })
);

bot.launch();