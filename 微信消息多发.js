//适配微信8.0.42版
//聊天窗口，悬浮窗内开启脚本
auto.waitFor();
//任意条自定义消息逗号隔开
var strArray = [
    "这是第一条消息",
    "这是第二条消息",
    "这是第三条消息",
]
//发送单条或者多条消息
function sendMsg() {
    for (var i = 0; i < strArray.length ; i++) {
        id("bkk").className("android.widget.EditText").findOne().setText(strArray[i])
        //toastLog('发送')
        text("发送").findOne().click();
    }
    sendMsg()
}
sendMsg()