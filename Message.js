class Message {

    constructor(publishDate, lastChanged, url, bidNumber, bidKind, lots) {
        this.publishDate = publishDate.toLocaleString();
        this.lastChanged = lastChanged.toLocaleString();
        this.url = url;
        this.bidNumber = bidNumber;
        this.bidKind = bidKind;
        this.lots = lots;

    }

    returnMessage() {
        return `<b>Дата публикации:</b> ${this.publishDate}\n<b>Последнее изменение:</b> ${this.lastChanged}\n<b>Номер процедуры:</b> ${this.bidNumber}\nТип: ${this.returnTypeProc()}\n\n${this.returnLots()}
<b>Ссылка на процедуру:</b> ${this.url}`;
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
            message += `<b>Лот ${l.lotNum}</b>\n<b>Описание:</b> ${l.propDesc}\n<b>Местонахождение:</b> ${l.location}\n<b>Начальная цена:</b> ${l.startSalePrice}\n\n`
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