const TelegramBot = require('node-telegram-bot-api');
const token ="";

class TgBot{

    constructor() {
        this.bot = new TelegramBot(token, {polling: true});
    }
}