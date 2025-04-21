threads.start(function() {
    //请求GPS权限
    runtime.requestPermissions(["access_fine_location"]);
    // 加载 GPS 模块
    let gpsModule = require("./modules/高德地图Dex/GPS.js");

    // 获取高德地图位置信息
    let amapLocation = gpsModule.getamapLocation();

    // 获取地址
    let address = amapLocation.getAddress();
    console.verbose("地址: " + address);
    toast("地址: " + address);
    setClip(address)
    // 获取纬度和经度
    let latitude = amapLocation.getLatitude();
    let longitude = amapLocation.getLongitude();
    log("纬度: " + latitude);
    log("经度: " + longitude);

    // 写入日志文件
    let logFilePath = "/storage/emulated/0/Android/gps.log";
    files.write(logFilePath, "地址: " + address + "\n纬度: " + latitude + "\n经度: " + longitude);
});