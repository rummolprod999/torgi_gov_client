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
            fs.unlink(LogName);
        }
    }
}

class App {

    constructor() {

        this.mClient = new MongoClient("mongodb://localhost:27017/", {useNewUrlParser: true});
        this.client = null;
    }

    run() {
        delBigLog();
        logger.info("start bot");
        let self = this;
        this.mClient.connect(function (err, client) {

            if (err) {
                logger.error(err);
                return;
            }
            self.client = client;
            const db = self.client.db(bdName);
            const col = db.collection(colName);
            self.findDocs(col);
            logger.info("end bot");
        });


    }

    findDocs(col) {
        let self = this;
        let regexp = /.*(брян|клинц).*/;
        col.find({
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
        }).toArray(function (err, results) {
            if (err != null) {
                logger.error(err);
                return;
            }
            if (results.length === 0) {
                self.client.close();
                return;
            }
            for (let r of results) {
                try {
                    self.createResult(r, col);
                } catch (e) {
                    logger.error(e);
                }
            }
        });

    }

    createResult(result, col) {
        let lots = this.createLotArray(result.Dt.lot);
        this.sendToTg(lots, result);
        this.updateDocument(col, result._id)
    }

    updateDocument(col, id) {
        let self = this;
        col.findOneAndUpdate(
            {_id: id},
            {$set: {Send: true}},
            function (err, _) {

                if (err != null) {
                    logger.error(err);
                }
                self.client.close();
            }
        );
    }

    sendToTg(lots, result) {
        let mess = new Message(result.PublishDateT, result.LastChangedT, result.Dt.common.notificationUrl, result.BidNumberG, result.BidKindT, lots);
        //console.log(mess.returnMessage());
        let tg = new TgBot(mess.returnMessage());
        tg.sendMessage();
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

module.exports = App;