auto.waitFor();
console.show();
log("****微信自动回复聊天脚本****")
log("**********开始运行**********")
// 解锁 
function unlockPhone(password) {
    if (!device.isScreenOn()) {
        device.wakeUpIfNeeded();
        log("wake");
        swipe(800, 2600, 1200, 1600, 500);
        for (var i = 0; i < password.length; i++) {
            n = text(password[i].toString()).findOne();
            n.parent().click();
        }
    }
}
<<<<<<< HEAD
events.observeToast()
events.onToast(function (toast) {
    var pkg = toast.getPackageName();
    log("Toast内容: " + toast.getText() +
        " 来自: " + getAppName(pkg) +
        " 包名: " + pkg);
    if (pkg == "com.tencent.mm" && currentActivity().search('com.tencent.mm') == -1) {
        // var nameAndMessageSet = toast.getText().toString().split(":");
        // 锁屏密码
        var password = [0, 8, 1, 7];
        // 解锁手机
        unlockPhone(password);
        launchApp("微信");
    }
});
toast("监听中，请在日志中查看记录的Toast及其内容");
=======
threads.start(function(){
    events.observeToast()
    events.onToast(function (toast) {
        var pkg = toast.getPackageName();
        log("Toast内容: " + toast.getText() +
            " 来自: " + getAppName(pkg) +
            " 包名: " + pkg);
        if (pkg == "com.tencent.mm" && currentActivity().search('com.tencent.mm') == -1) {
            // var nameAndMessageSet = toast.getText().toString().split(":");
            // 锁屏密码
            var password = [0, 8, 1, 7];
            // 解锁手机
            unlockPhone(password);
            launchApp("微信");
        }
    });
})
>>>>>>> 11b2914 (first commit)
//主线程
do {
    sleep(3000);
    inChatSendMsg();
} while (true);
//主界面监控界面发消息
function inChatSendMsg() {
    //主界面找到发消息的人，进去聊天界面
    var kmvSet = id("o_u").find();
    if (kmvSet.length > 0) {
        log("有" + kmvSet.length + "个联系人给你发消息");
        //单个联系人发的消息数量
        msgNum = kmvSet[0].getText();
        /*通过子控件获取父控件
        var child = ui.findOne(new UiSelector().text("child"));
        var parent = child.parent();
        */
        //进去聊天界面
        kmvSet[0].parent().parent().parent().click();
        var name = id("obn").findOne().getText();
        log("进入*" + name + "*聊天对话"+"-新消息："+msgNum);
        if (name != "微信运动" && name != "微信支付" && name != "QQ邮箱提醒") {
            //id("he").findOne().click();
            var all_msg = id("bkl").find();
            if (all_msg.length > 0) {
                //最新的消息
                var new_msg = all_msg[all_msg.length - 1].text();
                log("新消息*" + new_msg + "*");
                var res = http.get("http://api.qingyunke.com/api.php?key=free&appid=0&msg=" + new_msg);
                if (res.statusCode != 200) {
                    log("请求失败: " + res.statusCode + " " + res.statusMessage);
                } else {
                    var r_msg = res.body.json();
                    sendMsg = r_msg.content;
                    setText(sendMsg);
                    text('发送').findOne().click(); //点击
                    log("消息发送成功");
                    sleep(2000);
                    id("he").findOne().click();
                }
            } else {
                log("未找到消息");
                id("he").findOne().click();
            }
        } else {
            log("自动退出");
            id("he").findOne().click();
        }
    }
}
