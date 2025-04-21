// 打开无障碍服务设置页面
app.startActivity({
    action: "android.settings.ACCESSIBILITY_SETTINGS"
});

// 等待设置页面加载
//sleep(2000);

text("已下载的应用").findOne().click();
// 查找并点击你的无障碍服务
var serviceSwitch = textContains("AutoJsPro8").findOne();
if (serviceSwitch) {
    serviceSwitch.click();
    console.log("无障碍服务已尝试启用");
} else {
    console.log("未找到无障碍服务开关");
}