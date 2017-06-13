function ShowDate(time, weeks) {
    this.commonDate = new Date();
    global.nowDate = new Date();
    global.now = this.getDateMap(time, weeks);
    console.log(global);
    // return this.bornDates();
}

ShowDate.prototype.bornDates = ({
    y: global['now']['y'],
    m: global['now']['m']
} = {}) => {
    this.commonDate.setFullYear(y);
    this.commonDate.setFullYear(m + 1);
    this.commonDate.setDate(0);

    let {
        d: day,
        w: week,
    } = getDateMap(this.commonDate);
    let arr = [];
    let prev = getMonthLastDay(y, m - 1);

    arr.concat(pushDate(prev, w), pushDate(day), pushDate(6 - w));
    return arr;
}

ShowDate.prototype.getDateMap = (time = global.nowDate, weeks = '日一二三四五六') => {
    return {
        y: time.getFullYear().toString(),
        m: (time.getMonth() + 1).toString(),
        d: time.getDate().toString(),
        h: time.getHours().toString().padStart(2, 0),
        i: time.getMinutes().toString().padStart(2, 0),
        s: time.getSeconds().toString().padStart(2, 0),
        w: weeks[time.getDay()]
    };
}

ShowDate.prototype.pushDate = (lastDay, len = lastDay) => {
    let arr = [];
    while (lastDay > lastDay - len) {
        arr.unshift(lastDay--);
    }
    return arr;
}

ShowDate.prototype.getMonthLastDay = (y, m) => {
    y = Number(y) + Math.floor(m / 12);
    m = Number(m) % 12;

    let tDate = new Date();
    tDate.setFullYear(y);
    tDate.setMonth(m + 1);
    tDate.setDate(0);

    return this.getDateMap(tDate).d - 0;
}
// console.log(global);
new ShowDate();
