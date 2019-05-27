const TelegramBot = require('node-telegram-bot-api');
const channelId = "444444444";
const token = "4444444444444";
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
        if (this.mes.length > 4080) {
            let next = false;
            for (let m of range(0, this.mes.length, 4080)) {
                if (m === "\n") continue;
                let mess = this.mes.slice(m, m + 4080);
                if (next) {
                    mess = `<b>${mess}`;
                    next = false;
                }
                let t = mess.match(/(<\/?b>)/ig);
                if (t) {
                    if (t[t.length - 1] === "<b>") {
                        mess = `${mess}</b>`;
                        next = true;
                    }
                }
                try {
                    await this.bot.sendMessage(channelId, mess, {parse_mode: "HTML"});
                } catch (e) {
                    await this.bot.sendMessage(channelId, mess);
                }
                sleep(4);
            }
        } else {
            await this.bot.sendMessage(channelId, this.mes, {parse_mode: "HTML"});
            sleep(2);
        }

    }
}

module.exports = TgBot;
