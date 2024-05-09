/*
Author  Zhang Ruyi
Data    2024.05.09
Comment 音乐搜索自动点击下载脚本
*/
"ui";
ui.layout(
    <vertical padding="16">
        <text id="reminder" text="请选择自动下载的音源" textColor="red" textSize="16sp" gravity="center"/>
        <button id="click_me1" text="音源一" style="Widget.AppCompat.Button.Colored" w="auto"/>
        <button id="click_me2" text="音源二" style="Widget.AppCompat.Button.Colored" w="auto"/>
    </vertical>
);

ui.click_me1.on("click", () => {
    toast("自动下载音源一");
    currentThread = threads.start(download1); // 启动线程一

});
toast("脚本运行结束")

ui.click_me2.on("click", () => {
    toast("自动下载音源二");
    currentThread = threads.start(download2); // 启动线程
});

function startMusic() {
    auto.waitFor();
    log("开始运行");
    launchApp("音乐搜索");
    sleep(2000);
    toast("启动音乐搜索");
}

//音源一
function download1() {
    startMusic();
    click(200, 450);
    while (true) {
        id('recyclerView').findOne().children().forEach(child => {
            if (child != null) {
                var target = child.findOne(id("more"));
                if (target != null) {
                    target.click();
                    sleep(200)
                    text("下载").click();
                    var nameView = child.findOne(id("name"));
                    var contentView = child.findOne(id('content'));
                    if (nameView != null && contentView != null) {
                        log(nameView.text() + "-" +
                            contentView.text());
                    }
                    check();
                }
            }
        });
        sleep(500)
        swipe(800, 2300, 850, 660, 800);
    }
}

//音源二
function download2() {
    startMusic();
    click(400, 450);

    while (true) {
        (id('recyclerView').untilFind())[1].children().forEach(child => {
            var target = child.findOne(id("more"));
            if (target != null) {
                target.click();
                sleep(200);
                text("无损").findOne().click();
                text("下载").click();
                check();
                var nameView = child.findOne(id("name"));
                var contentView = child.findOne(id('content'));
                if (nameView != null && contentView != null) {
                    log(nameView.text() + "-" +
                        contentView.text());
                }
            }
        });
        swipe(800, 2300, 850, 660, 800);
    }
}

function check() {
    // 检查界面是否有 "正在下载" 文字
    if (text("正在下载").exists() || text("正在加载").exists()) {
        log("正在下载，等待...");
        // 等待 "正在下载" 文字消失
        while (text("正在下载").exists() || text("正在加载").exists()) {
            sleep(100);
        }
    } else {
        log("继续下载");
    }
}
