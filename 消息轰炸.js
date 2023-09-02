function messageFire(msg, num) {
    var tip = "";
    if (null != msg && '' != msg) {
        if (num != "" && !isNaN(num)) {
            for (var i = 1; i <= num; i++) {
                sendMessage(msg);
            }
            tip = "运行结束";
           
        } else {
            tip = "只能输入正整数";
        }
    } else {
        tip = "消息不能为空";
    }
    log(tip);
    return tip;
}

// 发微信消息 
function sendMessage(msg) {
    //点击聊天输入框
    id("kii").findOne().click();
    //设置文本消息
    setText(msg);
    id("b8k").findOne().click(); //点击发送
}
"auto"; //无障碍检测

var msg = rawInput("请输入消息");
var num = rawInput("请输入轰炸次数");
toast(messageFire(msg, num));