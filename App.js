const MongoClient = require("mongodb").MongoClient;
const log4js = require('log4js');
const Message = require("./Message");

log4js.configure({
    appenders: { cheese: { type: 'file', filename: 'app.log' } },
    categories: { default: { appenders: ['cheese'], level: 'all' } }
});
const logger = log4js.getLogger('cheese');
let bdName = "torgi";
let colName = "torgigov";

class App {

    constructor() {

        this.mClient = new MongoClient("mongodb://localhost:27017/", {useNewUrlParser: true});
    }

    run() {
        logger.info("start bot");
        let self = this;
        this.mClient.connect(function (err, client) {

            if (err) {
                logger.error(err);
                return;
            }
            const db = client.db(bdName);
            const col = db.collection(colName);
            self.findDocs(col);
            client.close();
        });
        logger.info("end bot");
    }

    findDocs(col) {
        let self = this;
        let regexp = /.*(брян|клинц).*/;
        col.find({
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
                "Dt.lot": {
                    $elemMatch: {
                        "kladrLocation.name": {
                            $regex: regexp,
                            $options: "i"
                        }
                    }

                }
            }]
        }).toArray(function (err, results) {
            if (err != null) {
                logger.error(err);
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
        //console.log(lots);
        this.sendToTg(lots, result);
    }

    sendToTg(lots, result){
        let mess = new Message(result.PublishDateT, result.LastChangedT, result.Dt.common.notificationUrl, result.BidNumberG, result.BidKindT, lots);
        console.log(mess.returnMessage());
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