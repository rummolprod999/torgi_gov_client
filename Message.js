class Message {

    constructor(publishDate, lastChanged, url, bidNumber, bidKind, lots) {
        let options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', timeZoneName: 'short'};
        this.publishDate = new Date(publishDate).toLocaleString("ru-RU", options);
        this.lastChanged = new Date(lastChanged).toLocaleString("ru-RU", options);
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
            let kladrName = "";
            if (l.kladrLocation !== undefined) {
                kladrName = l.kladrLocation.name;
            }

            message += `<b>Лот ${l.lotNum}</b>\n<b>Описание:</b> ${l.propDesc}\n<b>Местонахождение:</b> ${kladrName + ", " + (l.location || "")}\n<b>Начальная цена:</b> ${l.startSalePrice ? Number(l.startSalePrice).toLocaleString("ru-RU") : "0"}\n<b>Размер депозита:</b> ${l.depositSize ? Number(l.depositSize).toLocaleString("ru-RU") : "0"}\n\n`
        }
        return message;
    }

    returnLots13() {
        let message = "Тип: Реализация имущества должников\n\n";
        for (let l of this.lots) {
            let kladrName = "";
            if (l.kladrLocation !== undefined) {
                kladrName = l.kladrLocation.name;
            }
            message += `<b>Лот ${l.lotNum}</b>\n<b>Описание:</b> ${l.propName}\n<b>Местонахождение:</b> ${kladrName + ", " + (l.location || "")}\n<b>Начальная цена:</b> ${l.startPrice ? Number(l.startPrice).toLocaleString("ru-RU") : "0"}\n<b>Размер депозита:</b> ${l.depositSize ? Number(l.depositSize).toLocaleString("ru-RU") : "0"}\n<b>Описание обременения:</b> ${l.burdenDesc || ""}\n\n`
        }
        return message;
    }

    returnLots1() {
        let message = "Тип: Аренда, безвозмездное пользование, доверительное управление имуществом, иные договоры, предусматривающие передачу прав владения и пользования в отношении государственного и муниципального имущества\n\n";
        for (let l of this.lots) {
            let artName = "";
            if (l.article !== undefined) {
                artName = l.article.name;
            }
            let kladrName = "";
            if (l.kladrLocation !== undefined) {
                kladrName = l.kladrLocation.name;
            }
            message += `<b>Лот ${l.lotNum}</b>\n<b>Описание:</b> ${l.description}\n<b>Целевое назначение:</b> ${l.mission}\n<b>Местонахождение:</b> ${kladrName + ", " + (l.location || "")}\n<b>Общая начальная (минимальная) цена за договор:</b> ${l.contractFee ? Number(l.contractFee).toLocaleString("ru-RU") : "0"}\n<b>Размер депозита:</b> ${l.depositSize ? Number(l.depositSize).toLocaleString("ru-RU") : "0"}\n<b>${artName || "Платеж"}:</b> ${l.yearPrice || l.monthPrice || ""}\n\n`
        }
        return message;
    }

    returnLots2() {
        let message = "Тип: Аренда и продажа земельных участков\n\n";
        for (let l of this.lots) {
            let artName = "";
            if (l.article !== undefined) {
                artName = l.article.name;
            }
            let kladrName = "";
            if (l.kladrLocation !== undefined) {
                kladrName = l.kladrLocation.name;
            }
            let unitName = "";
            if (l.unit !== undefined) {
                unitName = l.unit.name;
            }
            message += `<b>Лот ${l.lotNum}</b>\n<b>Описание:</b> ${(l.description || "нет описания") + " ,площадь, " + unitName + ": " + l.area}\n<b>Местонахождение:</b> ${kladrName + ", " + (l.location || "")}\n<b>Начальная цена(${artName || "объект"}):</b> ${l.startPrice ? Number(l.startPrice).toLocaleString("ru-RU") : "0"}\n<b>Размер депозита:</b> ${l.depositSize ? Number(l.depositSize).toLocaleString("ru-RU") : "0"}\n\n`
        }
        return message;
    }

}

module.exports = Message;
