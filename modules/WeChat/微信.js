/*微信自动发消息
可以把具体的步骤分解如下 ：

如果手机在休眠，则唤醒屏幕解锁 ，否则直接下一步；
启动微信 ；
主界面直接搜索联系人，进去聊天界面，发消息 
回主界面；
auto.js 设定定时执行脚本， 每天6:30自动执行 ；
代码如下：*/
// 解锁 
function unlockPhone(password) {
    if (!device.isScreenOn()) {
        device.wakeUpIfNeeded();
        sleep(500);
        swipe(800, 2600, 1200, 1600, 500);
        sleep(1000)
        for (var i = 0; i < password.length; i++) {
            var digit = password[i].toString();
            var n = desc(digit).findOne(); // 使用desc查找元素
            if (n) {
                n.click(); // 直接点击找到的元素
                sleep(500);
            } else {
                console.log("未找到数字 " + digit);
            }
        }
    }
}
// 发微信消息 
function sendMessageByName(msg, name) {
    launchApp("微信"); //打开微信
    sleep(2000); //避免卡顿
    //搜索联系人
    id("jha").findOne().click()
    sleep(500)
    //填入联系人
    setText(name);
    sleep(1000);
    //搜索到联系人后点击进去聊天界面
    id("mem").className("android.widget.LinearLayout").findOne().parent().click()
    sleep(1000)
    //设置文本消息
    setText(msg);
    text("发送").findOne().click();
    //返回主界面
    back();
    sleep(500)
    back();
}
auto.waitFor(); //无障碍检测

sleep(2000)
//setScreenMetrics(1440, 3200); //设置屏幕像素
// 锁屏密码
password = "0817";
// 解锁手机
unlockPhone(password);
// 到达主屏 
sendMessageByName("早上好", "17305218161");