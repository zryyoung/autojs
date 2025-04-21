auto.waitFor();
launchApp("酷安");
sleep(2000);
swipe(800, 2000, 600, 1500, 200);
//首页推荐动态
id("recycler_view").findOne().children().forEach(child => {
    var target = child.findOne(id("text_view").className("android.widget.TextView"));
    target.click();
});