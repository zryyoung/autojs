auto.waitFor();
launchApp("BOSS直聘")
sayHello()

function sayHello() {
    text("牛人").findOne().parent().click()
    sleep(2000)
    id("rv_list").className("androidx.recyclerview.widget.RecyclerView").scrollable(true).findOne().children().forEach(child => {
        //关闭广告
        var ads = child.findOne(id("cl_ads_guide_card"));
        if (ads != null && ads != '') {
            var adsX = ads.children().findOne(id("iv_close"));
            adsX.click();
        }
        //判断是否在线
        var target = child.findOne(id("iv_online_state"));
        if (target != '' && target != null) {
            child.click()
            sleep(500)
            if (className("android.widget.Button").text("立即沟通").exists()) {
                sleep(1000)
                var targetText = '偏好工作地点'
                /*while (!textContains(targetText).exists()) {
                    //toastLog('循环')
                    swipe(1000, 2300, 1100 , 1800 , 800)
                    //swipe(device.width / 2, device.height * 0.8, device.width / 2, device.height * 0.2, 500);
                    //sleep(2000)
                }*/
                // 获取目标文本后的内容
                textAfterTarget = textContains(targetText).findOne().text();
                //toastLog(textAfterTarget)

                // 判断内容是否包含宝安区或龙岗区
                var isValidLocation = textAfterTarget.includes('宝安区') || textAfterTarget.includes('龙岗区');
                if (isValidLocation) {
                    toastLog("位置符合要求");
                    /*text('立即沟通').findOne().click()
                    sleep(1000)
                    className("android.widget.EditText").setText('你好，我们这份是送餐员的工作，月薪6k-13k以上，多劳多得，新员工会有老骑手一对一培训，不用担心没有经验，公司免费提供电动车，0元入职，多个选择多个机会哦，有兴趣聊一下吗？')
                    sleep(500)
                    var imgArray = className('android.widget.ImageView').find()
                    imgArray[imgArray.length - 1].click()
                    sleep(1000)
                    id("iv_back").findOne().click()
                    sleep(500)*/
                }
                id("iv_back").findOne().click()
                sleep(1000)
            } else {
                sleep(500)
                id("iv_back").findOne().click()
                sleep(500)
            }
        }
    });
    sayHello();
}