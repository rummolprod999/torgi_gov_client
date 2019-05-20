const MongoClient = require("mongodb").MongoClient;
let bdName = "torgi";
let colName = "torgigov";

class App {

    constructor() {

        this.mClient = new MongoClient("mongodb://localhost:27017/", {useNewUrlParser: true});
    }

    run() {
        let self = this;
        this.mClient.connect(function (err, client) {

            if (err) {
                return console.log(err);
            }
            const db = client.db(bdName);
            const col = db.collection(colName);
            self.findDocs(col);
            client.close();
        });
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
                console.log(err);
                return;
            }
            for (let r of results) {
                self.createResult(r, col);
            }
        });

    }

    createResult(result, col) {
        //console.log(result);
        let lots = this.createLotArray(result.Dt.lot);
        console.log(lots);
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