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
        sleep(100);
        swipe(800, 2600, 1200, 1600, 800);
        for (var i = 0; i < password.length; i++) {
            n = text(password[i].toString()).findOne();
            n.parent().click();
            sleep(600);
        }
    }
}
// 发微信消息 
function sendMessageByName(name) {
    launchApp("微信"); //打开微信
    //sleep(500); //避免卡顿
    id("gsl").findOne().click(); //搜索联系人
    //填入联系人
    id("cd7").findOne().setText(name);
    sleep(1000);
    //搜索到联系人后点击进去聊天界面
    id("kpm").findOne().parent().click();
    //点击聊天输入框
    id("kii").findOne().parent().click();
    //设置文本消息
    setText("晚安");
    //sleep(500);
    id("b8k").findOne().click(); //点击发送
    //回主界面
    id("g0").findOne().click();
    id("apy").findOne().click();
}
auto.waitFor(); //无障碍检测
setScreenMetrics(1440, 3200); //设置屏幕像素
// 锁屏密码
password = [0, 8, 1, 7];
// 解锁手机
unlockPhone(password);
// 到达主屏 
sendMessageByName("17305218161");
