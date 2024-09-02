var d = dialogs.build({
    title: "标题",
    positive: "确定",
    negative: "取消"
}).on("dismiss", (dialog)=>{
    toast("对话框消失了");
}).show();

setTimeout(()=>{
    d.dismiss();
}, 5000);


// 需要确保你在 Shizuku 设置中已经授予 Auto.js 权限
shell("input keyevent 26", {
    adb: true // 通过 Shizuku 提供 ADB 环境执行
}, function(code, stdout, stderr) {
    log("exit code: " + code);
    log("stdout: " + stdout);
    log("stderr: " + stderr);
});


// 使用 ADB 命令打开 Wi-Fi
shell("svc wifi enable", {
    adb: true // 通过 Shizuku 执行 ADB 命令
}, function(code, stdout, stderr) {
    if (code == 0) {
        log("Wi-Fi 已成功打开");
    } else {
        log("无法打开 Wi-Fi: " + stderr);
    }
});