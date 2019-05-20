class Message {

    constructor(publishDate, lastChanged, url, bidNumber, bidKind, lots) {
        this.publishDate = publishDate;
        this.lastChanged = lastChanged;
        this.url = url;
        this.bidNumber = bidNumber;
        this.bidKind = bidKind;
        this.lots = lots;

    }

    returnMessage() {
        return `Дата публикации: ${this.publishDate}\nПоследнее изменение: ${this.lastChanged}\nНомер процедуры: ${this.bidNumber}\nСсылка на сайт: ${this.url}\nТип: ${this.returnTypeProc()}\n${this.returnLots()}`;
    }

    returnLots() {
        switch (this.bidKind) {
            case 8:
                return this.returnLots8();
            default:
                return "";
        }
    }

    returnLots8() {
        let message = "";
        for (let l of this.lots) {
            message += `Лот\nОписание: ${l.propDesc}\nМестонахождение: ${l.location}\nНачальная цена: ${l.startSalePrice}\n\n`
        }
        return message;
    }

    returnTypeProc() {
        switch (this.bidKind) {
            case 8:
                return "Продажа государственного и муниципального имущества";
            default:
                return "undefined";
        }
    }
}

module.exports = Message;