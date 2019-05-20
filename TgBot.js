const TelegramBot = require('node-telegram-bot-api');
const channelId = "";
const token ="";

class TgBot{

    constructor(message) {
        this.bot = new TelegramBot(token, {polling: true});
        this.mes = message;
    }

    sendMessage(){
        this.bot.sendMessage(channelId, this.mes).then(null, function (err) {
            throw err;
        });
    }
}