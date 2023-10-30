auto.waitFor();
launchApp("应用商店")
sleep(1000)
text("我的").findOne().parent().click()
sleep(500)
text("应用升级").findOne().parent().click()
sleep(500)
while (true) {
    id("update_details").findOne().click();
    sleep(100);
    id("ignore_permanently").findOne().click();
    sleep(100);
}