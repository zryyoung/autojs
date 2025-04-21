// 定义完整的无障碍服务名称
var serviceName = "org.autojs8.autojspro/org.autojs8.autojspro.AccessibilityService";

// 启用指定的无障碍服务
var enableServiceCmd = "settings put secure enabled_accessibility_services " + serviceName;

// 使用 Shizuku 执行命令启用无障碍服务
var result = shell(enableServiceCmd, {
    adb: true // 通过 Shizuku 执行 ADB 命令
});

if (result.code == 0) {
    console.log("无障碍服务已启用");

    // 确保无障碍服务功能已开启
    shell("settings put secure accessibility_enabled 2", {
        adb: true
    });
} else {
    console.log("命令执行失败，错误信息: " + result.error);
}