<<<<<<< HEAD
auto.waitFor();
console.show();
log("****微信自动回复聊天脚本****")
log("**********开始运行**********")
<<<<<<< HEAD
//启动一个线程
var firstThread = threads.start(function() {
    //toast监听悬浮窗通知
    events.observeToast();
    events.onToast(function(toast) {
        // 发微信消息 
        function sendAiMessageByName(name) {
            launchApp("微信"); //打开微信
            sleep(1000);
            //在联系人界面时
            if (name[0] == id("obn").findOne().getText()) {
                log("进去悬浮窗通知聊天")
                //点击聊天输入框
                id("kii").findOne().parent().click();
                var res = http.get("http://api.qingyunke.com/api.php?key=free&appid=0&msg=" + name[1]);
                if (res.statusCode != 200) {
                    log("请求失败: " + res.statusCode + " " + name[1]);
                } else {
                    var r_msg = res.body.json();
                    setText(r_msg.content);
                    sleep(500);
                    text('发送').findOne().click(); //点击发送
                    log("消息发送成功");
                    //回主界面
                    id("he").findOne().click();
                    sleep(300);
                    id("b5i").findOne().click();
                    swipe(1400, 1800, 1100, 2000, 400);
                }
            } else {
                //checkNewMsg();
                id("jha").findOne().click(); //搜索联系人
                //填入联系人
                id("d98").findOne().setText(name[0]);
                sleep(1000);
                //搜索到联系人后点击进去聊天界面
                id("odf").findOne().parent().click();
                sleep(500);
                //点击聊天输入框
                id("o4q").findOne().parent().click();
                //设置文本消息自动聊天
                res = http.get("http://api.qingyunke.com/api.php?key=free&appid=0&msg=" + name[1]);
                if (res.statusCode != 200) {
                    log("请求失败: " + res.statusCode + " " + res.statusMessage);
                } else {
                    r_msg = res.body.json();
                    setText(r_msg.content);
                }
                sleep(500);
                text('发送').findOne().click(); //点击发送
                log("消息发送成功");
                //回主界面
                id("he").findOne().click();
                sleep(300);
                id("b5i").findOne().click();
                swipe(1400, 1800, 1100, 2000, 400);
            }
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
=======
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
threads.start(function(){
    events.observeToast()
    events.onToast(function (toast) {
>>>>>>> wechat/main
        var pkg = toast.getPackageName();
        log("Toast内容: " + toast.getText() +
            " 来自: " + getAppName(pkg) +
            " 包名: " + pkg);
<<<<<<< HEAD
        var nameAndMessageSet = toast.getText().toString().split(":");
=======
>>>>>>> wechat/main
        if (pkg == "com.tencent.mm" && currentActivity().search('com.tencent.mm') == -1) {
            // var nameAndMessageSet = toast.getText().toString().split(":");
            // 锁屏密码
            var password = [0, 8, 1, 7];
            // 解锁手机
            unlockPhone(password);
<<<<<<< HEAD
            // 到达主屏
            sendAiMessageByName(nameAndMessageSet);
        }
    });
    toast("监听中，请在日志中查看记录的Toast及其内容");
});
//启动另一个线程
var sonThread = threads.start(function() {
    //微信无悬浮通知时,但在微信界面
    setInterval(function() {
        inChatSendMsg();
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
                kmvSet[0].parent().click();
                var name = id("obn").findOne().getText();
                log("进入*" + name + "*聊天对话");
                if (name != "微信运动" && name != "微信支付" && name != "QQ邮箱提醒") {
                    //id("he").findOne().click();
                    var all_msg = id("bkl").find();
                    if (all_msg.length > 0) {
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
    }, 3000)
});
//检测是否在主界面 微信 通讯录 发现 我
function checkNewMsg() {
    if (id("he").exists()) {
        log("聊天界面");
        id("he").findOne().click();
    }
    //退出订阅号
    if (className("android.view.View").desc("订阅号消息").exists()) {
        className("android.widget.ImageView").desc("返回").findOne().click();
    }
    //点击左下角微信
    text("微信").findOne().parent().click();
}
=======
            launchApp("微信");
        }
    });
})
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
>>>>>>> wechat/main
=======
toast('Hello, Auto.js');
importClass(android.database.Cursor);
auto.waitFor()
var qx = requestScreenCapture()
if (!qx) {
    toastLog("请先授权");
    exit();
}
launchApp("酷安");
//text("首页").findOne().click()
sleep(1000)
swipe(1000, 2700, 1100, 500, 200)
sleep(2000)
autoStar()

function autoStar() {
    id("main_fragment").waitFor();
    if (id("main_fragment").findOne()) {
        var dt = id("main_fragment").findOne().children().find(className("androidx.cardview.widget.CardView"))
        //toastLog(dt.size())
        dt.forEach(child => {
            //var target = child.find(className("android.widget.LinearLayout").clickable(true).longClickable(true));
            //target.click();
            if (child.findOne(id("feed_action_view_like"))) {
                var star = child.findOne(id("feed_action_view_like")).children().findOne(id("image_view"))
                //toastLog("star-" + star)
                //star.click();
                var bounds = star.bounds();
                if (bounds) {
                    var centerX = bounds.centerX();
                    var centerY = bounds.centerY();
                    if (centerY < 2950) {
                        // 截取屏幕截图
                        var img = captureScreen();
                        //var height = img.getHeight()
                        // 获取控件star中心点的颜色
                        var color = images.pixel(img, centerX, centerY);
                        //toastLog(color)
                        // 判断颜色是否为绿色
                        if (colors.red(color) > 200 && colors.green(color) > 200 && colors.blue(color) > 200) {
                            // 颜色为白色
                            toastLog("star")
                            click(centerX, centerY);
                            sleep(1000)
                        }else{
                            //toastLog("cancel star")
                            //click(centerX, centerY);
                            //sleep(1000)
                        }
                    }
                } else {
                    toastLog("无法获取控件区域！");
                }
            }
        });
    }
    //swipe(1000, 2900, 1100, 300, 200)
    swipe(device.width / 2, device.height * 3 / 4, device.width / 2, device.height / 4, 200);
    sleep(500)
    autoStar()
}

// 获取屏幕控件的截图和颜色判断
function checkColorAndClick() {
    // 截取屏幕截图
    var img = captureScreen();

    // 获取控件的位置和大小
    var widget = text("某个控件的文本").findOne();
    var bounds = widget.bounds();

    // 计算控件的中心坐标
    var centerX = bounds.centerX();
    var centerY = bounds.centerY();

    // 获取控件中心点的颜色
    var color = images.pixel(img, centerX, centerY);

    // 判断颜色是否为绿色
    if (colors.red(color) < 10 && colors.green(color) > 200 && colors.blue(color) < 10) {
        // 颜色为绿色，执行点击操作
        click(centerX, centerY);
    } else if (colors.red(color) > 200 && colors.green(color) > 200 && colors.blue(color) > 200) {
        // 颜色为白色，不做处理
        // do nothing
    } else {
        // 其他颜色，可以根据自己的需求进行处理
        // do something else
    }
}
>>>>>>> coolpak/main
