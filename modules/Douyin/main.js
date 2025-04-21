auto.waitFor();
launchApp("抖音");
sleep(1000);
// 定义要保存到文件的路径
var filePath = "/sdcard/弹幕.txt";

// 确保文件存在，如果不存在则创建它
files.createWithDirs(filePath);

// 用于跟踪最近的10条弹幕
var recentTexts = [];
var maxRecentSize = 10; // 最大缓存条数

// 实时写入文件的函数
function appendToFile(text) {
    files.append(filePath, text + "\n");
}

// 更新最近弹幕记录
function updateRecentTexts(text) {
    if (recentTexts.length >= maxRecentSize) {
        recentTexts.shift(); // 删除最旧的弹幕
    }
    recentTexts.push(text); // 添加最新的弹幕
}

// 定义主函数来持续获取和写入数据
function main() {
    while (true) {
        var elements = id("pa2").findOne().children();
        elements.forEach(child => {
            if (child) {
                var target = child.findOne(id("text"));
                if (target) {
                    var text = target.text().trim();
                    if (text && recentTexts.indexOf(text) === -1) { // 使用 indexOf 代替 includes
                        console.log(text);
                        appendToFile(text);
                        updateRecentTexts(text);
                    }
                }
            }
        });
        // 等待一段时间再进行下一次获取（例如1秒）
        //sleep(1000);
    }
}
toast("弹幕日志文本保存在：\n"+filePath);
// 开始实时数据获取
main();
