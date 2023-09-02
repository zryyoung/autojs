auto();
events.observeToast();
events.onToast(function(toast) {
    // 发微信消息 
    function sendAiMessageByName(name) {
        launchApp("微信"); //打开微信
        //sleep(500); //避免卡顿
        if (!id("dl").exists()) {
            //点击左下角微信
            id("kd_").className("android.widget.RelativeLayout").clickable(true).selected(true).findOne().click();
        }
        id("gsl").findOne().click(); //搜索联系人
        //填入联系人
        id("cd7").findOne().setText(name[0]);
        sleep(800);
        //搜索到联系人后点击进去聊天界面
        id("kpm").findOne().parent().click();
        //点击聊天输入框
        id("kii").findOne().parent().click();
        //设置文本消息自动聊天
        var res = http.get("http://api.qingyunke.com/api.php?key=free&appid=0&msg=" + name[1]);
        if (res.statusCode != 200) {
            log("请求失败: " + res.statusCode + " " + res.statusMessage);
        } else {
            var r_msg = res.body.json();
            setText(r_msg.content);
        }
        sleep(500);
        id("b8k").findOne().click(); //点击发送
        //回主界面
        id("g0").findOne().click();
        id("apy").findOne().click();
        swipe(1400, 1800, 1100, 2000, 400);
    }
    // 解锁 
    function unlockPhone(password) {
        if (!device.isScreenOn()) {
            device.wakeUpIfNeeded();
            sleep(100);
            swipe(800, 2600, 1200, 1600, 600);
            for (var i = 0; i < password.length; i++) {
                n = text(password[i].toString()).findOne();
                n.parent().click();
                sleep(600);
            }
        }
    }
    var pkg = toast.getPackageName();
    log("Toast内容: " + toast.getText() +
        " 来自: " + getAppName(pkg) +
        " 包名: " + pkg);
    if (pkg == "com.tencent.mm") {
        var nameAndMessageSet = toast.getText().toString().split(":");
        // 锁屏密码
        var password = [0, 8, 1, 7];
        // 解锁手机
        unlockPhone(password);
        // 到达主屏
        sendAiMessageByName(nameAndMessageSet);
    }

});
toast("监听中，请在日志中查看记录的Toast及其内容");