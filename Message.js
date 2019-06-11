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
        return `<b>Дата публикации:</b> ${this.publishDate}\n<b>Последнее изменение:</b> ${this.lastChanged}\n<b>Номер процедуры:</b> ${this.bidNumber}\n<b>Ссылка на процедуру:</b> ${this.url}\n${this.returnLots()}
`;
    }

    returnLots() {
        switch (this.bidKind) {
            case 8:
                return this.returnLots8();
            case 13:
                return this.returnLots13();
            case 1:
                return this.returnLots1();
            case 2:
                return this.returnLots2();
            default:
                return "";
        }
    }

    returnLots8() {
        let message = "Тип: Продажа государственного и муниципального имущества\n\n";
        for (let l of this.lots) {
            message += `<b>Лот ${l.lotNum}</b>\n<b>Описание:</b> ${l.propDesc}\n<b>Местонахождение:</b> ${l.kladrLocation.name + ", " + (l.location || "")}\n<b>Начальная цена:</b> ${l.startSalePrice}\n<b>Размер депозита:</b> ${l.depositSize}\n\n`
        }
        return message;
    }

    returnLots13() {
        let message = "Тип: Реализация имущества должников\n\n";
        for (let l of this.lots) {
            message += `<b>Лот ${l.lotNum}</b>\n<b>Описание:</b> ${l.propName}\n<b>Местонахождение:</b> ${l.kladrLocation.name + ", " + (l.location || "")}\n<b>Начальная цена:</b> ${l.startPrice}\n<b>Размер депозита:</b> ${l.depositSize}\n<b>Описание обременения:</b> ${l.burdenDesc || ""}\n\n`
        }
        return message;
    }

    returnLots1() {
        let message = "Тип: Аренда, безвозмездное пользование, доверительное управление имуществом, иные договоры, предусматривающие передачу прав владения и пользования в отношении государственного и муниципального имущества\n\n";
        for (let l of this.lots) {
            message += `<b>Лот ${l.lotNum}</b>\n<b>Описание:</b> ${l.description}\n<b>Целевое назначение:</b> ${l.mission}\n<b>Местонахождение:</b> ${l.kladrLocation.name + ", " + (l.location || "")}\n<b>Общая начальная (минимальная) цена за договор:</b> ${l.contractFee}\n<b>Размер депозита:</b> ${l.depositSize}\n<b>${l.article.name || "Платеж"}:</b> ${l.yearPrice || l.monthPrice || ""}\n\n`
        }
        return message;
    }

    returnLots2() {
        let message = "Тип: Аренда и продажа земельных участков\n\n";
        for (let l of this.lots) {
            message += `<b>Лот ${l.lotNum}</b>\n<b>Описание:</b> ${(l.description || "нет описания") + " ,площадь, " + unit.name + ": " + l.area}\n<b>Местонахождение:</b> ${l.kladrLocation.name + ", " + (l.location || "")}\n<b>Начальная цена(${article.name || "объект"}):</b> ${l.startPrice}\n<b>Размер депозита:</b> ${l.depositSize}\n\n`
        }
        return message;
    }

}

module.exports = Message;