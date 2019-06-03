const MongoClient = require("mongodb").MongoClient;
const log4js = require('log4js');
const Message = require("./Message");
const TgBot = require("./TgBot");
const fs = require("fs");
const LogName = "app.log";

log4js.configure({
    appenders: {bot: {type: 'file', filename: LogName}},
    categories: {default: {appenders: ['bot'], level: 'all'}}
});
const logger = log4js.getLogger('bot');
let bdName = "torgi";
let colName = "torgigov";

function delBigLog() {
    if (fs.existsSync(LogName)) {
        let le = fs.statSync(LogName)["size"];
        if (le > 1000000) {
            fs.unlink(LogName, function (err) {
                logger.error(err);
            });
        }
    }
}

class App {

    constructor() {
        this.mClient = new MongoClient("mongodb://localhost:27017/?connectTimeoutMS=300000", {useNewUrlParser: true});
        this.client = null;
    }

    runner() {
        delBigLog();
        logger.info("start bot");
        this.run().then(ok => {
            logger.info("end bot");
        }, err => {
            logger.error(err);
            logger.info("end bot");

        })
    }

    async run() {
        try {
            let client = await this.mClient.connect();
            await this.finder(client);
        } catch (e) {
            logger.error(e);
        } finally {
            if(this.client !== null && this.client !== undefined){
                this.client.close();
            }
            if(this.mClient !== null && this.mClient !== undefined){
                await this.mClient.close();
            }
        }
        /*await new Promise((resolve) => setTimeout(() => {
            console.log("result");
            resolve("result");
        }, 5000));*/
        return Promise.resolve("ok");
    }

    async finder(client) {
        this.client = client;
        const db = this.client.db(bdName);
        this.col = db.collection(colName);
        await this.findDocs();
        return Promise.resolve("ok");
    }

    async findDocs() {
        //let regexp = /.*(брян|клинц).*/;
        let regexp = /б[pр]ян[сc][кk]|[кk]линц/;
        let resFind = await this.col.find({
            $and: [
                {Send: false},
                {
                    $or: [{
                        "Dt.bidOrganization.location": {
                            $regex: regexp,
                            $options: "si"
                        }
                    }, {
                        "Dt.bidOrganization.address": {
                            $regex: regexp,
                            $options: "si"
                        }
                    }, {
                        "Dt.common.openingPlace": {
                            $regex: regexp,
                            $options: "si"
                        }
                    }, {
                        "Dt.lot.location": {
                            $regex: regexp,
                            $options: "si"
                        }
                    }, {
                        "Dt.lot.kladrLocation.name": {
                            $regex: regexp,
                            $options: "si"
                        }
                    }, {
                        "Dt.lot.propDesc": {
                            $regex: regexp,
                            $options: "si"
                        }
                    }, {
                        "Dt.lot": {
                            $elemMatch: {
                                "kladrLocation.name": {
                                    $regex: regexp,
                                    $options: "si"
                                }
                            }

                        }
                    }, {
                        "Dt.lot": {
                            $elemMatch: {
                                "location": {
                                    $regex: regexp,
                                    $options: "si"
                                }
                            }

                        }
                    }]
                }]
        });
        let arr = await resFind.toArray();
        for (let r of arr) {
            try {
                await this.createResult(r);
            } catch (e) {
                logger.error(e);
            }
        }
    }

    async createResult(result) {
        let lots = this.createLotArray(result.Dt.lot);
        await this.sendToTg(lots, result);
        await this.updateDocument(result._id)
    }

    async updateDocument(id) {
        let mClient = new MongoClient("mongodb://localhost:27017/?connectTimeoutMS=300000", {useNewUrlParser: true});
        await mClient.connect(async (err, client) => {

            if (err) {
                logger.error(err);
            }
            const db = client.db(bdName);
            const col = db.collection(colName);
            await col.findOneAndUpdate(
                {_id: id},
                {$set: {Send: true}},
                (err, _) => {

                    if (err != null) {
                        logger.error(err);
                    }

                }
            );
            await client.close();

        });
        await mClient.close();
    }

    async sendToTg(lots, result) {
        let mess = new Message(result.PublishDateT, result.LastChangedT, result.Dt.common.notificationUrl, result.BidNumberG, result.BidKindT, lots);
        let tg = new TgBot(mess.returnMessage());
        await tg.sendMessage();
    }

    createLotArray(lots) {
        let arr = [];
        let isArray = function (a) {
            return (!!a) && (a.constructor === Array);
        };
        if (isArray(lots)) {
            for (let o of lots) {
                arr.push(o);
            }
        } else {
            arr.push(lots)
        }
        return arr;
    }
}

module.exports.App = App;
module.exports.logger = logger;