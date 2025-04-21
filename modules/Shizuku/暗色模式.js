// 定义要执行的Shell命令
var cmd = "am start -n com.sohu.inputmethod.sogouoem/.MainActivity --es \"theme\" \"light\"";

// 使用Shizuku执行命令
var result = shell(cmd, {
    adb: true // 通过 Shizuku 提供 ADB 环境执行
});

// 输出执行结果
if (result.code == 0) {
    console.log("主题切换命令成功执行");

    // 重新启动应用以应用新主题
    shell("am force-stop com.sohu.inputmethod.sogouoem", {
        adb: true
    });
    shell("monkey -p com.sohu.inputmethod.sogouoem -c android.intent.category.LAUNCHER 1", {
        adb: true
    });

} else {
    console.log("命令执行失败，错误信息: " + result.error);
}