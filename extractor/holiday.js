// keys are formatted as either
//  month, day in the month
// or
//  month(January is 1), week(first week is 1) and weekday (Monday is 1, Saturday is 6, Sunday is 7)
var holidays = {
    "new year ' s day": "1,1",
    "martin luther king jr . day": "1,3,1",
    "martin luther king day": "1,3,1",
    "valentine ' s day": "2,14",
    "president ' s day": "2,3,1",
    "patrick ' s day": "3,17",
    "april fool ' s day": "4,1",
    "mother ' s day": "5,2,0",
    "memorial day": "5,-1,1",
    "father ' s day": "6,3,0",
    "canada day": "7,1",
    "independence day": "7,4",
    "labor day": "9,1,1",
    "columbus day": "10,2,1",
    "halloween": "10,31",
    "veterans day": "11,11",
    "remembrance day": "11,11",
    "thanksgiving day": "11,4,4",
    "black friday": "11,4,5",
    "christmas eve": "12,24",
    "christmas": "12,25",
    "boxing day": "12,26",
    "new year ' s eve": "12,31",
};

function getHolidayDate(y, m, w, d) {
    let year = y;
    let month = m - 1; // month starts with 0
    let weekDay = d >=7 ? 0 : d; // weekDay starts with Sunday
    return w > 0 ? getFirstWeekDay(year, month, w - 1, weekDay) : getLastWeekDay(year, month, w + 1, weekDay); 
}

function getFirstWeekDay(year, month, week, weekDay) {
    let firstDay = new Date(year, month, 1).getDay();
    if (firstDay > weekDay) week++;
    let day = week * 7 + weekDay - firstDay + 1;
    return new Date(year, month, day);
}

function getLastWeekDay(year, month, week, weekDay) {
    let firstDay = new Date(year, month + 1, 1).getDay();
    if (firstDay <= weekDay) week--;
    let day = week * 7 + weekDay - firstDay + 1;
    return new Date(year, month + 1, day);
}

function getHolidayDateString(year, holiday) {
    let dateString;
    if (holiday in holidays) {
        var a = holidays[holiday].split(",");
        var date = (a.length == 3 ? getHolidayDate(year, Number(a[0]), Number(a[1]), Number(a[2])) : new Date(year, a[0] - 1, a[1]));
        dateString = date.toLocaleDateString();
    }
    return dateString;
}

function getHolidays() {
    return Object.keys(holidays);
}

// console.log(getHolidays());
// for (var h in holidays) {
//     console.log(h + " is " + getHolidayDateString(2018, h));
// }
