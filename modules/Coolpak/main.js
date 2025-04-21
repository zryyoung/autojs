auto.waitFor()
launchApp("酷安");
sleep(2000)
text("首页").findOne().click()
sleep(1000)
//swipe(1000, 2700, 1100, 500, 200)
//sleep(2000)
if (!requestScreenCapture()) {
    toastLog("请先授权");
    exit();
}
autoStar();

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
                            //toastLog("star");
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
    //swipe(1000, 2950, 1100, 230, 200)
    //sleep(500)
    autoStar()
}

