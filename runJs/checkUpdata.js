// 配置
//var githubRepo = "maotoumao/MusicFree"; // GitHub 仓库名
var githubRepo = "zryyoung/WeChat"; // GitHub 仓库名
var currentVersion = app.versionName; // 替换为获取当前应用的版本逻辑

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
        console.log("无法获取最新发布版本, 状态码: " + response.statusCode + ", URL: " + url);
        return null;
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
            toast("下载成功");
        } else {
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
    } else {
        console.log("正在下载更新...");
        downloadFile(downloadUrl, apkPath);
    }
    //console.log("请手动安装更新的 APK 文件：", apkPath);
    app.viewFile(apkPath);
}

// 主函数
function main() {
    var latestRelease = getLatestReleaseVersion();
    if (latestRelease) {
        console.log("当前版本:", currentVersion);
        console.log("最新版本:", latestRelease.version);

        if (compareVersions(currentVersion, latestRelease.version) < 0) {
            console.log("发现新版本，开始更新...");
            updateApp(latestRelease.downloadUrl);
        } else {
            console.log("当前版本是最新的，无需更新。");
        }
    }
}

// 运行主函数
main();