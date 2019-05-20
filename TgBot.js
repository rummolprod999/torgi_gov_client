const TelegramBot = require('node-telegram-bot-api');
const channelId = "-0000000";
const token = "00000000";
const l = require("./App");
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
        // one param defined
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
};
class TgBot {

    constructor(message) {
        this.bot = new TelegramBot(token, {polling: false});
        this.mes = message;
    }

    sendMessage() {
        if (this.mes.length > 4096) {
            let mesArray = this.mes.split("\n\n");
            for (let m of range(0, this.mes.length, 4096)) {
                if (m === "\n") continue;
                let mess = this.mes.slice(m, m+4096);
                this.bot.sendMessage(channelId, mess, {parse_mode: "HTML"}).then(function (){sleep(3)},function (err) {
                    l.logger.error(err);
                });
                sleep(3);
            }
        } else {
            this.bot.sendMessage(channelId, this.mes, {parse_mode: "HTML"}).catch(function (err) {
                l.logger.error(err);
            });
            sleep(3);
        }

    }
}

module.exports = TgBot;
