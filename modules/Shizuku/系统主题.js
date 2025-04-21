// 使用 ADB 命令将系统主题切换为暗色模式
var cmd = "settings put secure ui_night_mode 1";

// 使用 Shizuku 执行命令
var result = shell(cmd, {
    adb: true // 通过 Shizuku 提供 ADB 环境执行
});

// 检查命令执行结果
if (result.code == 0) {
    console.log("系统已成功切换到暗色模式");

    // 强制重载系统 UI 以应用暗色模式
    shell("cmd overlay reload", true);
} else {
    console.log("命令执行失败，错误信息: " + result.error);
}