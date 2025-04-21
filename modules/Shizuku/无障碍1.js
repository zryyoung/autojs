// 定义应用包名
var packageName = "org.autojs8.autojspro";

// 使用 ADB 命令授予应用 WRITE_SECURE_SETTINGS 权限
var cmd = "pm grant " + packageName + " android.permission.WRITE_SECURE_SETTINGS";

// 使用 Shizuku 执行命令
var result = shell(cmd, {
    adb: true // 通过 Shizuku 提供 ADB 环境执行
});

if (result.code == 0) {
    console.log(packageName + " 已被授予 WRITE_SECURE_SETTINGS 权限");
} else {
    console.log("授予权限失败，错误信息: " + result.error);
}