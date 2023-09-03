//desc("微信").findOne().click();
launchApp("微信");
id("f2s").className("android.widget.TextView").text("发现").findOne().parent().click();
id("iwg").indexInParent(0).findOne().click();
username = "遗忘"
while (true) {
    className("android.widget.ListView").findOne().scrollDown();
    sleep(3000);
    var nicknames = id("hg4").className("android.widget.TextView").find();
    if (nicknames.size() > 0) {
        nicknames.forEach(function(ele, index) {
            if (ele.text() == username) {
                toastLog("找到了" + ele.text());
                id("nh").find()[index].click();
                id("n3").findOne().click();
                toastLog("已给" + ele.text() + "点赞成功");
                //点第一条后停止
                //exit();
            } else {
                toastLog("不是目标" + ele.text());
            }
        });
    }
}