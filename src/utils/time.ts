
export function threeDats() {
    var date = new Date();
    date.setDate(date.getDate() - 3); //获取3天前的日期
    var year :any= date.getFullYear();
    var month:any = date.getMonth() + 1;
    if (month < 10) {
        month = '0' + month;
    }
    var day:any = date.getDate();
    if (day < 10) {
        day = '0' + day;
    }
    var time = year + "-" + month + "-" + day;
    return time
}

export function nowDats() {
    var date = new Date();
    date.setDate(date.getDate()); //获取3天前的日期
    var year = date.getFullYear();
    var month:any = date.getMonth() + 1;
    if (month < 10) {
        month = '0' + month;
    }
    var day:any = date.getDate();

    if (day < 10) {
        day = '0' + day;
    }
    var time = year + "-" + month + "-" + day ;
    return time
}