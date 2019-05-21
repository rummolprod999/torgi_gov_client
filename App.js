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
        if (le > 100000) {
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
        this.run().catch(function (err) {
            logger.error(err);
        })
    }

    async run() {
        delBigLog();
        logger.info("start bot");
        await this.mClient.connect(this.CallBackMongo.bind(this));
        this.mClient.close();

    }

    async CallBackMongo(err, client) {

        if (err) {
            logger.error(err);
            return;
        }
        this.client = client;
        const db = this.client.db(bdName);
        this.col = db.collection(colName);
        await this.findDocs().catch(function (err) {
            logger.error(err);
        });
        logger.info("end bot");
    }

    async findDocs() {
        let regexp = /.*(брянc|клинц).*/;
        this.col.find({
            $and: [
                {Send: false},
                {
                    $or: [{
                        "Dt.bidOrganization.location": {
                            $regex: regexp,
                            $options: "i"
                        }
                    }, {
                        "Dt.bidOrganization.address": {
                            $regex: regexp,
                            $options: "i"
                        }
                    }, {
                        "Dt.common.openingPlace": {
                            $regex: regexp,
                            $options: "i"
                        }
                    }, {
                        "Dt.lot.location": {
                            $regex: regexp,
                            $options: "i"
                        }
                    }, {
                        "Dt.lot.propDesc": {
                            $regex: regexp,
                            $options: "i"
                        }
                    }, {
                        "Dt.lot": {
                            $elemMatch: {
                                "kladrLocation.name": {
                                    $regex: regexp,
                                    $options: "i"
                                }
                            }

                        }
                    }]
                }]
        }).toArray(await this.ArrayExec.bind(this));

    }

    async ArrayExec(err, results) {
        if (err != null) {
            logger.error(err);
            return;
        }
        if (results.length === 0) {
            this.client.close();
            return;
        }
        for (let r of results) {
            try {
                await this.createResult(r);
            } catch (e) {
                logger.error(e);
            }
        }
        this.client.close();
    }

    async createResult(result) {
        let lots = this.createLotArray(result.Dt.lot);
        await this.sendToTg(lots, result);
        await this.updateDocument(result._id)
    }

    async updateDocument(id) {
        let mClient = new MongoClient("mongodb://localhost:27017/?connectTimeoutMS=300000", {useNewUrlParser: true});
        await mClient.connect( async function (err, client) {

            if (err) {
                logger.error(err);
            }
            const db = client.db(bdName);
            const col = db.collection(colName);
            await col.findOneAndUpdate(
                {_id: id},
                {$set: {Send: true}},
                 function (err, _) {

                    if (err != null) {
                        logger.error(err);
                    }

                }
            );
            client.close();

        });
        mClient.close();
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