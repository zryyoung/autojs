
// 执行通过 Shizuku 的 ADB shell 命令
result = shell("svc wifi enable", {
    adb: true // 通过 Shizuku 提供 ADB 环境执行
});
console.log("打开 Wi-Fi: " + result.code);

// 使用 Shizuku 命令清除应用数据
result = shell("pm clear io.nekohasekai.sfa", {
    adb: true // 通过 Shizuku 提供 ADB 环境执行
});
console.log("清除应用数据结果: " + result.code);

// 执行 adb shell 命令获取设备信息
result = shell("getprop ro.product.model", {
    adb: true // 通过 Shizuku 提供 ADB 环境执行
});
console.log("设备型号: " + result.result);

result = shell("pm list packages", {
    adb: true // 通过 Shizuku 提供 ADB 环境执行
});
console.log("已安装的应用包名列表: " + result.result);

result = shell("input keyevent 26", true); // 模拟按下电源键
console.log("模拟按键结果: " + result.code);