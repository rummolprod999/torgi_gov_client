const TelegramBot = require('node-telegram-bot-api');
const channelId = "";
const token = "";
const exec = require('child_process').execSync;
const sleep = time => (
    (time = parseInt(time)),
        (time > 0
                ? exec(`sleep ${time}`)
                : null
        )
);

function range(start, stop, step) {
    if (typeof stop == 'undefined') {
        stop = start;
        start = 0;
    }

    if (typeof step == 'undefined') {
        step = 1;
    }

    if ((step > 0 && start >= stop) || (step < 0 && start <= stop)) {
        return [];
    }

    let result = [];
    for (let i = start; step > 0 ? i < stop : i > stop; i += step) {
        result.push(i);
    }

    return result;
}

class TgBot {

    constructor(message) {
        this.bot = new TelegramBot(token, {polling: false});
        this.mes = message;
    }

    async sendMessage() {
        if (this.mes.length > 4096) {
            for (let m of range(0, this.mes.length, 4096)) {
                if (m === "\n") continue;
                let mess = this.mes.slice(m, m + 4096);
                await this.bot.sendMessage(channelId, mess, {parse_mode: "HTML"});
                sleep(5);
            }
        } else {
            await this.bot.sendMessage(channelId, this.mes, {parse_mode: "HTML"});
            sleep(5);
        }

    }
}

module.exports = TgBot;
