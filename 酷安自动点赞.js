auto.waitFor()
launchApp("酷安");
//text("首页").findOne().click()
sleep(1000)
swipe(1000, 2700, 1100, 500, 200)
sleep(2000)
var qx = requestScreenCapture()
if (!qx) {
    toastLog("请先授权");
    exit();
}
autoStar()

function autoStar() {
    id("main_fragment").waitFor();
    if (id("main_fragment").findOne()) {
        var dt = id("main_fragment").findOne().children().find(className("androidx.cardview.widget.CardView"))
        //toastLog(dt.size())
        dt.forEach(child => {
            //var target = child.find(className("android.widget.LinearLayout").clickable(true).longClickable(true));
            //target.click();
            if (child.findOne(id("feed_action_view_like"))) {
                var star = child.findOne(id("feed_action_view_like")).children().findOne(id("image_view"))
                //toastLog("star-" + star)
                //star.click();
                var bounds = star.bounds();
                if (bounds) {
                    var centerX = bounds.centerX();
                    var centerY = bounds.centerY();
                    if (centerY < 2950) {
                        // 截取屏幕截图
                        var img = captureScreen();
                        //var height = img.getHeight()
                        // 获取控件star中心点的颜色
                        var color = images.pixel(img, centerX, centerY);
                        //toastLog(color)
                        // 判断颜色是否为绿色
                        if (colors.red(color) > 200 && colors.green(color) > 200 && colors.blue(color) > 200) {
                            // 颜色为白色
                            toastLog("star")
                            click(centerX, centerY);
                            sleep(1000)
                        }else{
                            //toastLog("cancel star")
                            //click(centerX, centerY);
                            //sleep(1000)
                        }
                    }
                } else {
                    toastLog("无法获取控件区域！");
                }
            }
        });
    }
    swipe(1000, 2950, 1100, 230, 200)
    sleep(500)
    autoStar()
}

// 获取屏幕控件的截图和颜色判断
function checkColorAndClick() {
    // 截取屏幕截图
    var img = captureScreen();

    // 获取控件的位置和大小
    var widget = text("某个控件的文本").findOne();
    var bounds = widget.bounds();

    // 计算控件的中心坐标
    var centerX = bounds.centerX();
    var centerY = bounds.centerY();

    // 获取控件中心点的颜色
    var color = images.pixel(img, centerX, centerY);

    // 判断颜色是否为绿色
    if (colors.red(color) < 10 && colors.green(color) > 200 && colors.blue(color) < 10) {
        // 颜色为绿色，执行点击操作
        click(centerX, centerY);
    } else if (colors.red(color) > 200 && colors.green(color) > 200 && colors.blue(color) > 200) {
        // 颜色为白色，不做处理
        // do nothing
    } else {
        // 其他颜色，可以根据自己的需求进行处理
        // do something else
    }
}
