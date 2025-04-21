let obj = {};
obj.getamapLocation = getamapLocation;
module.exports = obj;
global.amapLocation = null;

function getamapLocation() {
    threads.start(gettingamapLocation);
    while (global.amapLocation == null);
    return global.amapLocation;
}

function gettingamapLocation() {
    let dexPath = "./modules/高德地图Dex/classes.dex";
    runtime.loadDex(dexPath);
    //dex已去编译除签名，不用打包调试，
    importClass(Packages.com.amap.api.location.AMapLocation);
    importClass(Packages.com.amap.api.location.AMapLocationClient);
    importClass(Packages.com.amap.api.location.AMapLocationClientOption);
    importClass(Packages.com.amap.api.location.AMapLocationListener);
    importClass(Packages.com.amap.api.location.AMapLocationQualityReport);

    // 初始化定位
    //声明AMapLocationClient类对象
    //初始化定位
    let mLocationClient = null;
    mLocationClient = new AMapLocationClient(context);
    //设置定位回调监听
    mLocationClient.setLocationListener(getAMapLocationListener());

    // 配置参数并启动定位
    //声明AMapLocationClientOption对象
    let mLocationOption = null;
    //初始化AMapLocationClientOption对象
    mLocationOption = new AMapLocationClientOption();

    mLocationOption.setLocationPurpose(AMapLocationClientOption.AMapLocationPurpose.SignIn);
    mLocationOption.setLocationMode(AMapLocationClientOption.AMapLocationMode.Hight_Accuracy);

    //获取一次定位结果：
    mLocationOption.setOnceLocation(true);

    //设置是否返回地址信息（默认返回地址信息）
    mLocationOption.setNeedAddress(true);
    //给定位客户端对象设置定位参数
    mLocationClient.setLocationOption(mLocationOption);
    //设置场景模式后最好调用一次stop，再调用start以保证场景模式生效
    mLocationClient.stopLocation();
    mLocationClient.startLocation();



    let interval = setInterval(function () {
        if (amapLocation != null) {
            //释放资源
            mLocationClient.stopLocation();
            mLocationClient.onDestroy();
            mLocationClient.startLocation();
            clearInterval(interval);
            //停止线程
        }
    }, 1000);

}


function getAMapLocationListener() {
    return new JavaAdapter(AMapLocationListener, {
        onLocationChanged: function (amapLocation) {
            if (amapLocation != null) {
                if (amapLocation.getErrorCode() == 0) {
                    global.amapLocation = amapLocation;
                    mLocationClient.setLocationListener(null)
                    exit()
                } else {
                    //显示错误信息ErrCode是错误码，errInfo是错误信息，详见错误码表。
                    log("location Error, ErrCode:" + amapLocation.getErrorCode() + ", errInfo:" + amapLocation.getErrorInfo());
                }
            } else {
                log("定位失败");
            }
        },
    });
}