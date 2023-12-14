// 現在の日時を取得する
function getDayAndTime(){
    var now = new Date();
    let nowYear = 	now.getFullYear();
    let nowGetMonth = 	now.getMonth();
    let nowMonth = nowGetMonth + 1;
    let nowDate = 	now.getDate();
    let nowHour = now.getHours();
    let nowMinute = now.getMinutes().toString().padStart(2, "0");
    let nowSecond = now.getSeconds().toString().padStart(2, "0");
    let nowMilliSecond = now.getMilliseconds();
    
    // 日時が羅列した文字列を用意する
    let stringDayAndTime = nowYear + '年' + nowMonth + '月' + nowDate + '日 ' + nowHour + ':' + nowMinute + ':' + nowSecond;
    console.log("現在の日時を取得しました : " + stringDayAndTime);
    return stringDayAndTime;
}

// 現在のミリ秒を取得する
function getMilliSecond(){
    var now = new Date();
    var nowMilliSecond = now.getTime();
    console.log("現在の日時を取得しました(ミリ秒): " + nowMilliSecond);
    return nowMilliSecond;
}

export{ getDayAndTime, getMilliSecond };