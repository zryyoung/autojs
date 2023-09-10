auto.waitFor();

console.show();
log("微信自动聊天机器人");
launchApp("微信");
sleep(1000);
//等有收到新消息
while (true) {
    sleep(1000)
    var kmvSet = id("kmv").find();
    if (kmvSet.length == 0) {
        log("没有新消息");
    } else if (kmvSet.length > 0) {
        log("有" + kmvSet.length + "联系人给你发消息");
        //单个联系人发的消息数量
        msgNum = kmvSet[0].getText();
        //log(kmvSet[i]);
        /*通过子控件获取父控件
        var child = ui.findOne(new UiSelector().text("child"));
        var parent = child.parent();
        */
        //进去聊天界面
        kmvSet[0].parent().click();
        //调用在聊天界面发消息的方法
        inChatSendMsg()
    }
}
//聊天界面发消息
function inChatSendMsg() {
    id("hp").findOne().children().forEach(child => {
        var target = child.findOne(id("b4b"));
        if (target) {
            child.click();
            log("进入*" + id("ko4").findOne().getText() + "*聊天对话");
            id("kii").findOne().click();
            var sendMsg = "";
            var all_msg = id("b4b").find();
            var new_msg = all_msg[all_msg.length - 1].text();
            if (sendMsg != new_msg) {
                if (all_msg.length > 0) {
                    log("新消息*" + new_msg + "*");
                    var res = http.get("http://api.qingyunke.com/api.php?key=free&appid=0&msg=" + new_msg);
                    if (res.statusCode != 200) {
                        log("请求失败: " + res.statusCode + " " + res.statusMessage);
                    } else {
                        var r_msg = res.body.json();
                        sendMsg = r_msg.content;
                        setText(sendMsg);
                        sleep(1000);
                        id("b8k").findOne().click(); //点击
                        log("消息发送成功");
                        sleep(2000);
                        id("g0").findOne().click();
                        id("apy").findOne().click();
                    }
                } else {
                    log("未找到聊天消息")
                }
            }
        }
    })
}