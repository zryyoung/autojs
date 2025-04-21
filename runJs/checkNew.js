// 配置
//var githubRepo = "maotoumao/MusicFree"; // GitHub 仓库名
let githubRepo = "zryyoung/AppUI"; // GitHub 仓库名
// 获取 GitHub 最新发布版本的函数
function getLatestReleaseVersion() {
    var url = "https://api.github.com/repos/" + githubRepo + "/releases/latest";
    var response = http.get(url, {
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }
    });

    console.log("请求 URL:", url);
    console.log("响应状态码:", response.statusCode);
    console.log("响应内容:", response.body.string());

    if (response.statusCode === 200) {
        var releaseInfo = JSON.parse(response.body.string());
        return {
            version: releaseInfo.tag_name, // 最新发布的版本号
            downloadUrl: releaseInfo.assets[0].browser_download_url // 下载链接
        };
    } else {
        toast("连接Github失败，请检查网络");
        console.log("无法获取最新发布版本, 状态码: " + response.statusCode + ", URL: " + url);
        return;
    }
}

// 比较版本号
function compareVersions(version1, version2) {
    var v1 = version1.split('.').map(Number);
    var v2 = version2.split('.').map(Number);

    for (var i = 0; i < Math.max(v1.length, v2.length); i++) {
        var num1 = v1[i] || 0;
        var num2 = v2[i] || 0;
        if (num1 > num2) return 1;
        if (num1 < num2) return -1;
    }
    return 0;
}

// 从 URL 中提取文件名
function extractFileName(url) {
    return url.substring(url.lastIndexOf('/') + 1);
}

// 下载 APK 文件的函数
function downloadFile(url, filePath) {
    try {
        var response = http.get(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
            },
            followRedirects: true // 处理重定向
        });

        console.log("下载 URL:", url);
        console.log("响应状态码:", response.statusCode);

        if (response.statusCode === 200) {

            files.writeBytes(filePath, response.body.bytes());

        } else {
            toast("网络错误❌")
            console.log("下载失败，状态码: " + response.statusCode);
        }
    } catch (e) {
        console.error("下载过程中发生错误:", e);
    }
}

// 更新应用的函数
function updateApp(downloadUrl) {
    var fileName = extractFileName(downloadUrl); // 从下载链接中提取文件名
    var apkPath = "/sdcard/Download/" + fileName; // 生成保存路径

    if (files.exists(apkPath)) {
        console.log("已下载，开始安装...");
        //toast("已下载，开始安装...")
    } else {
        console.log("正在下载更新...");
        toast("正在下载更新...")
        downloadFile(downloadUrl, apkPath);
    }
    notify(apkPath);
    dialogs.confirm("下载完成", '新版本下载完成，现在安装', function(confirmed) {
        if (confirmed) {
            // 用户点击了“确定”
            //toast("用户点击了确定");
            // 在这里执行确定操作的代码
            app.viewFile(apkPath);
        } else {
            // 用户点击了“取消”
            //  toast("用户点击了取消");
            // 在这里执行取消操作的代码
            console.log("下载保存至:\n" + apkPath);
            
        }
    });
    //console.log("请手动安装更新的 APK 文件：", apkPath);
}

// 主函数
function main() {
    let currentVersion = "v0.0.1"; //app.versionName; // 替换为获取当前应用的版本逻辑
    var latestRelease = getLatestReleaseVersion();
    if (latestRelease) {
        console.log("当前版本:", currentVersion);
        console.log("最新版本:", latestRelease.version);

        if (compareVersions(currentVersion, latestRelease.version) < 0) {
            console.log("发现新版本，开始更新...");
            //toast("发现新版本，开始下载...");
            updateApp(latestRelease.downloadUrl);
        } else {
            console.log("当前版本是最新的，无需更新。");
            toast("当前版本是最新的，无需更新。");
        }
    }
}

function notify(apkPath){
    //通知栏通知
    // 导入所需的类
importClass(android.app.NotificationManager);
importClass(android.app.NotificationChannel);
importClass(android.app.Notification);
importClass(android.content.Context);
importClass(android.graphics.Color);
importClass(android.app.PendingIntent);
importClass(android.content.Intent);
importClass(android.net.Uri);
importClass(android.os.Build);

// 图标的完整路径
var iconPath = files.cwd() + "/res/icon.png";

// 加载图标为 Bitmap
var iconBitmap = android.graphics.BitmapFactory.decodeFile(iconPath);

if (iconBitmap == null) {
    toast("图标加载失败，检查路径是否正确");
}

// 定义通知的 ID 和渠道 ID
var notificationId = 1;
var channelId = "default_channel_id";
var channelName = "Default Channel";

// 获取通知管理器
var notificationManager = context.getSystemService(Context.NOTIFICATION_SERVICE);

// 如果设备版本为 Android 8.0 及以上，需创建通知渠道
if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
    var channel = new NotificationChannel(channelId, channelName, NotificationManager.IMPORTANCE_DEFAULT);
    channel.setDescription("Default Channel Description");
    channel.enableLights(true);
    channel.setLightColor(Color.RED);
    channel.enableVibration(true);
    notificationManager.createNotificationChannel(channel);
}

// 设定APK文件路径
//var apkPath = "/sdcard/Download/WeChat_v1.1.0.apk";
var apkFile = new java.io.File(apkPath);

// 创建 Intent 来启动安装应用
var installIntent = new Intent(Intent.ACTION_VIEW);

if (Build.VERSION.SDK_INT >= 24) {
    // 使用 content:// URI 并添加权限标志
    var apkUri = Uri.parse("content://" + apkPath);
    installIntent.setDataAndType(apkUri, "application/vnd.android.package-archive");
    installIntent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION); // 授予读 URI 权限
} else {
    // 使用 file:// URI
    var apkUri = Uri.fromFile(apkFile);
    installIntent.setDataAndType(apkUri, "application/vnd.android.package-archive");
}

installIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK); // 启动新任务

// 创建 PendingIntent 来包装这个 Intent
var pendingIntent = PendingIntent.getActivity(context, 0, installIntent, PendingIntent.FLAG_UPDATE_CURRENT);

// 创建通知构建器
var builder = new Notification.Builder(context, channelId)
    .setContentTitle("下载完成")
    .setContentText("点击安装应用")
    .setSmallIcon(android.R.drawable.ic_dialog_info) // 设置小图标
    .setLargeIcon(iconBitmap) // 使用自定义大图标
    .setAutoCancel(true) // 点击通知后自动取消
    .setContentIntent(pendingIntent); // 设置 PendingIntent

// 构建并显示通知
notificationManager.notify(notificationId, builder.build());

// 提示通知已发送
//toast("通知已发送，点击通知安装应用");
}

// 运行主函数
//main();
module.exports = {
    main: main,
    getLatestReleaseVersion: getLatestReleaseVersion,
    downloadFile: downloadFile,
    updateApp: updateApp
}