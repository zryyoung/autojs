// 定义要保存到文件的路径
var filePath = "./弹幕.txt";

// 确保文件存在，如果不存在则创建它
files.createWithDirs(filePath);

// 实时写入文件的函数
function appendToFile(text) {
    files.append(filePath, text + "\n");
}

// 定义主函数来持续获取和写入数据
function main() {
    while (true) {
        // 获取目标元素
        var elements = id("pa2").findOne().children();
        elements.forEach(child => {
            var target = child.findOne(id("text"));
            if (target) {
                var text = target.text();
                console.log(text);
                appendToFile(text);
            }
        });
        // 等待一段时间再进行下一次获取（例如1秒）
        sleep(1000);
    }
}

// 开始实时数据获取
main();