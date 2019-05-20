const TelegramBot = require('node-telegram-bot-api');
const channelId = "@@@@@@";
const token ="@@@@@@@@@@@";

class TgBot{

    constructor(message) {
        this.bot = new TelegramBot(token, {polling: false});
        this.mes = message;
    }

    sendMessage(){
        this.bot.sendMessage(channelId, this.mes, {parse_mode: "HTML"}).then(null, function (err) {
            throw err;
        });
    }
}
module.exports = TgBot;
