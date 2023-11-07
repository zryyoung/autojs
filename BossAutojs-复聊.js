auto.waitFor()
launchApp("BOSS直聘")
text("消息").findOne().parent().click()
sleep(1000)
swipe(800, 2600, 1200, 1600, 200)
sleep(500)
var strArray = [
    '我们是饿了么专送，招聘外卖送餐员，月薪7千到一万+，上不封顶，多劳多得的',
    '我们现在正在招聘外卖送餐员，站点直招，非中介！工资在7000—14000，会骑电动车，会看导航就行，前期有老手带。',
    '你好，我们这份是送餐员的工作，月薪6k-13k以上，多劳多得，新员工会有老骑手一对一培训，不用担心没有经验，公司免费提供电动车，0元入职，多个选择多个机会哦，有兴趣聊一下吗？',
    '已读不回是有什么顾虑吗'
]
chat_again()

function chat_again() {
    className("android.widget.ExpandableListView").scrollable(true).findOne().children().forEach(child => {
        sleep(500)
        //toastLog(child);
        var msg = child.children().findOne(id('tv_msg')).getText()
        var msg_status = child.children().findOne(id('iv_msg_status'))
        //toastLog(msg_status+'>'+msg)
        if (msg != '好的' &&
            msg_status &&
            msg_status.getText() == '[已读]'
        ) {
            var bounds = child.bounds();
            if (bounds) {
                var centerX = bounds.centerX();
                var centerY = bounds.centerY();
                click(centerX, centerY);
            } else {
                toastLog("无法获取控件区域！");
            }
            sendMsg(strArray)
            id("iv_back").findOne().click()
            sleep(500)
        }
    });
    toastLog('滑动屏幕')
    swipe(800, 2950, 1000, 250, 200)
    chat_again()
}
//发送单条或者多条消息
function sendMsg(str) {
    for (var i = 0; i < strArray.length ; i++) {
        className("android.widget.EditText").setText(strArray[i])
        //toastLog('发送')
        var imgArray = className('android.widget.ImageView').find()
        sleep(200)
        imgArray[imgArray.length - 1].click()
        sleep(200)
    }
}