"ui";
// 设备信息变量
// 动态获取设备信息
var androidVersion = device.release; // 获取 Android 系统版本号
var deviceName = device.product; // 设备名称
var mainboard = device.board; // 主板信息
var manufacturer = device.brand; // 制造商
var model = device.model; // 设备型号
var product = device.product; // 产品名称
var bootloader = device.bootloader; // Bootloader 版本
var hardware = device.hardware; // 硬件名称
var fingerprint = device.fingerprint; // 唯一标识码（fingerprint）
var imei = null //device.getIMEI();      // IMEI 码 (可能需要权限)
var androidId = device.getAndroidId(); // AndroidId
var macAddress = device.getMacAddress(); // Mac 地址 (可能需要权限)
var sdkInt = device.sdkInt; // API 版本
var battery = device.getBattery() + "%"; // 电量信息
//读取本地存储信息
//日志状态，暗色模式，主题颜色，字体颜色
//var isLog,isDark,themeColor,textColor;
// 创建或获取存储对象
var storage = storages.create("appSettings");
//storage.clear() //清楚本地存储
// 读取信息
var logStatus = storage.get("logStatus", false);
var darkMode = storage.get("darkMode", false);
var themeColor = storage.get("themeColor", "#71b49e");
var fontColor = storage.get("fontColor", "#000000");
//  console.log(fontColor)
let currentVersion = app.versionName;

// 读取当前脚本模块文件夹路径
var pwd = files.cwd();
var modulesDir = pwd + "/modules/";

// 读取文件夹中的所有子文件夹
var moduleNames = files.listDir(modulesDir, function(name) {
    return files.isDir(files.join(modulesDir, name));
});
// 获取模块数量
var moduleCount = moduleNames.length;

// 模拟 GitHub 用户名
const username = "zryyoung";
// 使用回调函数处理返回的数据
fetchRepositories(username, function(repositories) {
    var moduleDownloadCount = repositories.length;
    console.log("模块数量:", moduleDownloadCount);

    // 在UI线程中更新UI
    ui.run(() => {
        ui.moduleDownloadList.setDataSource(repositories);
        ui.moduleDownloadCount.setText("仓库共 " + moduleDownloadCount + " 个模块")
    });
});
// 获取 GitHub 用户的所有仓库，并通过回调函数处理结果
function fetchRepositories(username, callback) {
    
    console.log("向Github仓库发送请求");
    threads.start(function() {
        let repositories = [];
        try {
            const url = 'https://api.github.com/users/' + username + '/repos';
            const headers = {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
            };
            const response = http.get(url, { headers: headers });

            if (response.statusCode == 200) {
                const data = response.body.json();
                repositories = data.map(repo => ({
                    title: repo.name || "无",
                    description: repo.description || "无描述",
                    version: repo.language || "未知语言",
                    icon: "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
                }));
            } else {
                console.log("请求失败，状态码:", response.statusCode);
                toastLog("连接Github失败，请检查网络");
            }
        } catch (e) {
            console.log("请求异常:", e);
            toastLog("连接Github异常，请检查网络");
        }

        // 如果请求失败或异常，返回模拟数据
        if (repositories.length === 0) {
            repositories = [
                {
                    title: "模拟模块1",
                    description: "这是一个模拟描述1",
                    version: "JavaScript",
                    icon: "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
                },
                {
                    title: "模拟模块2",
                    description: "这是一个模拟描述2",
                    version: "Python",
                    icon: "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
                }
            ];
        }
        // 调用回调函数，将数据返回
        callback(repositories);
    });
}
// 初始化状态栏颜色
//ui.statusBarColor(themeColor);
//ui.statusBarColor("#009788");//状态栏背景色
// 创建UI布局
ui.layout(
    <vertical>
        <!-- 顶栏 -->
        <frame bg={themeColor} id="topBar">
            <text text="AutoJsPro" textSize="24sp" textStyle="bold" textColor="#ffffff" gravity="center"/>
            <button id="menu" text="⋮" textSize="18sp"textStyle="bold" textColor="#ffffff" style="Widget.AppCompat.Button.Borderless"
            w="40" h="40" marginTop="-5sp"
            layout_gravity="right" />
        </frame>
        
        <!-- ViewPager 用于页面切换 -->
        <viewpager id="viewpager" layout_weight="1">
            <!-- 下载页面 -->
            <frame>
                <vertical id="moduleDownloadView" padding="16">
                    <text id="moduleDownloadText" text="Github仓库下载" textStyle="bold" textColor="#000000" textSize="24sp" />
                    <text id="moduleDownloadCount"  text={"仓库共 个模块"} textStyle="bold" textSize="16sp" marginTop="8" />
                    <scroll>
                        <list id="moduleDownloadList" marginTop="16">
                            <horizontal padding="8" bg="?selectableItemBackground" w="*" h="wrap_content">
                                <img id="icon" w="50" h="50" scaleType="fitCenter" src="{{this.icon}}" />
                                <vertical layout_weight="1" paddingLeft="8">
                                    <text id="title" text="{{this.title}}" textColor="#A1A1A1" textStyle="bold" textSize="17sp"/>
                                    <text id="description" text="{{this.description}}" textColor="#A1A1A1" textSize="14sp"/>
                                </vertical>
                                <text id="version" textColor="#A1A1A1"text="{{this.version}}" textSize="14sp" align="right"/>
                            </horizontal>
                        </list>
                    </scroll>
                </vertical>
            </frame>
            <!-- 模块页面 -->
            <frame>
                <vertical id = "modelView" padding="16">
                    <text id="moduleText" text="模块" textStyle="bold" textColor={themeColor} textSize="24sp" />
                    <text text={"已启用 " + moduleCount + " 个模块"} textStyle="bold" textSize="16sp" marginTop="8" />
                    <scroll>
                    <list id="moduleList" marginTop="16">
                        <horizontal padding="8" bg="?selectableItemBackground" w="*" h="wrap_content">
                            <img id="icon" w="50" h="50" scaleType="fitCenter" src="{{this.icon}}" />
                            <vertical layout_weight="1" paddingLeft="8">
                                <text id="title" text="{{this.title}}" textStyle="bold" textSize="17sp"/>
                                <text id="description" text="{{this.description}}" textSize="14sp"/>
                            </vertical>
                            <text id="version" text="{{this.version}}" textSize="14sp" align="right"/>
                        </horizontal>
                    </list>
                    </scroll>
                </vertical>
            </frame>
            <!-- 主页页面 -->
            <frame>
                <vertical padding="16 16 16 -5">
                    
                    {/* 标题栏 */}
                    <horizontal gravity="center_vertical" padding="16">
                        <img src={"file:///"+files.cwd()+"/res/icon.png"} w="48" h="48" />
                        <text text="设备信息" id="设备信息" textColor={themeColor} textSize="20sp" textStyle="bold" marginLeft="16"/>
                    </horizontal>
                    {/* 激活状态框 */}
                    <card w="*" h="auto" margin="0 8 0 8" cardCornerRadius="12dp">
                        <vertical id="激活状态框" bg={themeColor} padding="24 16 24 16">
                            <text text={auto.service != null?"已激活":"未激活"} id="激活状态" textColor="#ffffff" textSize="18sp" textStyle="bold"/>
                            <text text="无障碍服务" textColor="#ffffff" textStyle="bold" textSize="14sp"/>
                            <text text={"AutoJs "+currentVersion} textStyle="bold" textColor="#ffffff" textSize="14sp"/>
                        </vertical>
                    </card>
                
                    {/* 设备详细信息 */}
                    <card w="*" h="auto" margin="0 8 0 8" cardCornerRadius="12dp" id="设备信息框">
                            <scroll>
                            <vertical padding="24 16 24 16">
                                {/*<text text="设备详细信息" textColor="#000000" textSize="20sp" textStyle="bold" />*/}
                                {/* 设备信息项 */}
                                <text text="设备" marginTop="0" textColor="#000000" textSize="14sp" />
                                <text text={deviceName} textColor="#000000" textSize="14sp" />
                                <text text="安卓版本" marginTop="15" textColor="#000000" textSize="14sp" />
                                <text text={androidVersion} textColor="#000000" textSize="14sp" />
                                {/* 添加更多的信息项 */}
                                <text text="主板" marginTop="10" textColor="#000000" textSize="14sp" />
                                <text text={mainboard} textColor="#000000" textSize="14sp" />
                                <text text="制造商" marginTop="10" textColor="#000000" textSize="14sp" />
                                <text text={manufacturer} textColor="#000000" textSize="14sp" />
                                
                                <text text="型号" marginTop="10" textColor="#000000" textSize="14sp" />
                                <text text={model} textColor="#000000" textSize="14sp" />
                                
                                <text text="产品名称" marginTop="10" textColor="#000000" textSize="14sp" />
                                <text text={product} textColor="#000000" textSize="14sp" />
                                
                                <text text="Bootloader版本" marginTop="10" textColor="#000000" textSize="14sp" />
                                <text text={bootloader} textColor="#000000" textSize="14sp" />
                                
                                <text text="硬件名称" marginTop="10" textColor="#000000" textSize="14sp" />
                                <text text={hardware} textColor="#000000" textSize="14sp" />
                                
                                <text text="唯一标识码" marginTop="10" textColor="#000000" textSize="14sp" />
                                <text text={fingerprint} textColor="#000000" textSize="14sp" />
                                
                                <text text="IMEI" marginTop="10" textColor="#000000" textSize="14sp" />
                                <text text={imei} textColor="#000000" textSize="14sp" />
                                
                                <text text="AndroidId" marginTop="10" textColor="#000000" textSize="14sp" />
                                <text text={androidId} textColor="#000000" textSize="14sp" />
                                
                                <text text="Mac地址" marginTop="10" textColor="#000000" textSize="14sp" />
                                <text text={macAddress} textColor="#000000" textSize="14sp" />
                                
                                <text text="API版本" marginTop="10" textColor="#000000" textSize="14sp" />
                                <text text={sdkInt} textColor="#000000" textSize="14sp" />
                                
                                <text text="电量" marginTop="10" textColor="#000000" textSize="14sp" />
                                <text text={battery} textColor="#000000" textSize="14sp" />
                            </vertical>
                            </scroll>
                    </card>
                </vertical>
            </frame>
            <!-- 日志页面 -->
            <frame>
                <vertical>
                    <scroll>
                        <text id="log_view" textSize="16sp"/>
                    </scroll>
                </vertical>
            </frame>
            <!-- 设置页面 -->
            <frame>
                <scroll>
                    <vertical padding="16">
                        <text text="基础配置" id="基础配置" textStyle="bold" textSize="20sp" textColor={themeColor}/>
                        <!-- 无障碍服务 -->
                        <horizontal marginTop="10">
                            <text text=" 无障碍服务" textSize="16sp" layout_weight="1"/>
                            <Switch id="accessibilityService" />
                        </horizontal>
                        <!-- shizuku服务 -->
                        <horizontal marginTop="10">
                            <text text=" Shizuku 服务" textSize="16sp" layout_weight="1"/>
                            <Switch id="Shizuku" />
                        </horizontal>
                        <!-- 禁用详细日志 -->
                        <horizontal marginTop="10">
                            <text text=" 禁用日志" textSize="16sp" layout_weight="1"/>
                            <Switch id="detailedLog" checked={logStatus}/>
                        </horizontal>
                        
                        <!-- 主题颜色 -->
                        <text text="主题" id="主题" textStyle="bold" textSize="20sp" textColor={themeColor} marginTop="30"/>
                        <horizontal marginTop="10">
                            <text text=" 暗色模式" textSize="16sp" layout_weight="1"/>
                            <Switch id="themeColor" checked={darkMode}/>
                        </horizontal>
                        <horizontal>
                            <text text=" 主题颜色" textSize="16sp" layout_weight="1"/>
                            <spinner id="themeColorSpinner" entries="黑色|浅灰|主题绿|樱花|亮红|珊瑚橙|亮紫|薰衣草|深蓝|天蓝|薄荷绿|柠檬黄|橙黄|紫罗兰|青绿|青色|浅蓝|绿色|浅绿|黄绿|黄色|琥珀|橙色|深橙|棕色|灰蓝" w="120"/>
                        </horizontal>
                        <horizontal>
                            <text text=" 字体颜色" textSize="16sp" layout_weight="1"/>
                            <spinner id="textColor" entries="黑色|浅灰|主题绿|樱花|亮红|珊瑚橙|亮紫|薰衣草|深蓝|天蓝|薄荷绿|柠檬黄|橙黄|紫罗兰|青绿|青色|浅蓝|绿色|浅绿|黄绿|黄色|琥珀|橙色|深橙|棕色|灰蓝" w="120"/>
                        </horizontal>
                        <horizontal marginTop="10">
                            <text text=" 重置" id="backDefault" textSize="16sp" layout_weight="1"/>
                        </horizontal>
                        
                        <text text="版本信息" id="版本信息" textStyle="bold" textSize="20sp" textColor={themeColor} marginTop="30"/>
                        <!-- 版本信息 -->
                        <text text={"当前版本：AutoJs "+currentVersion} textSize="16sp" marginTop="10"/>
                        <!-- 检测更新 -->
                        <button text=" 检测更新" id="checkNew" textSize="16sp" textColor="#000000" marginTop="20"/>
                    </vertical>
                </scroll>
            </frame>
        </viewpager>
        <frame bg={themeColor}gravity="bottom" id="footBar">
            <horizontal>
                <vertical layout_weight="1" gravity="center" margin="5sp" h="60">
                    <img id="btn_download" src="@drawable/ic_cloud_download_black_48dp" />
                    <text id="txt_download" text="下载" visibility="gone" textSize="14sp" gravity="center" />
                </vertical>
                <vertical layout_weight="1" gravity="center" margin="5sp" h="60">
                    <img id="btn_module" src="@drawable/ic_extension_black_48dp" />
                    <text id="txt_module" text="模块" visibility="gone" textSize="14sp" gravity="center" />
                </vertical>
                <vertical layout_weight="1" gravity="center" margin="5sp" h="60">
                    <img id="btn_home" src="@drawable/ic_home_black_48dp" />
                    <text id="txt_home" text="Home" visibility="visible" textSize="14sp" gravity="center" />
                </vertical>
                <vertical layout_weight="1" gravity="center" margin="5sp" h="60">
                    <img id="btn_log" src="@drawable/ic_description_black_48dp" />
                    <text id="txt_log" text="日志" visibility="gone" textSize="14sp" gravity="center" />
                </vertical>
                <vertical layout_weight="1" gravity="center" margin="5sp" h="60">
                    <img id="btn_settings" src="@drawable/ic_settings_applications_black_48dp" />
                    <text id="txt_settings" text="设置" visibility="gone" textSize="14sp" gravity="center" />
                </vertical>
            </horizontal>
        </frame>
    </vertical>
);

// 设置底栏按钮点击事件，切换页面
ui.btn_download.click(() => ui.viewpager.setCurrentItem(0));
ui.btn_module.click(() => ui.viewpager.setCurrentItem(1));
ui.btn_home.click(() => ui.viewpager.setCurrentItem(2));
ui.btn_log.click(() => ui.viewpager.setCurrentItem(3));
ui.btn_settings.click(() => ui.viewpager.setCurrentItem(4));

const buttons = [
    {
        id: ui.btn_download,
        textView: ui.txt_download
    },
    {
        id: ui.btn_module,
        textView: ui.txt_module
    },
    {
        id: ui.btn_home,
        textView: ui.txt_home
    },
    {
        id: ui.btn_log,
        textView: ui.txt_log
    },
    {
        id: ui.btn_settings,
        textView: ui.txt_settings
    }
];
// 给每个按钮设置点击事件
buttons.forEach(function(button) {
    button.id.on("click", function() {
        // 先将所有图标复位，隐藏提示
        resetButtons();
        // 进行动画效果，将图标上移并显示对应的提示文字
        animateButton(button.id, button.textView);
    });
});
function animateButton(button, textView) {
    // 动画效果：图标上移
    let objectAnimator = android.animation.ObjectAnimator.ofFloat(button, "translationY", 0, -10);
    objectAnimator.setDuration(200);
    objectAnimator.start();
    // 显示对应的提示文字
    textView.setVisibility(android.view.View.VISIBLE);
}
function resetButtons() {
    buttons.forEach(function(button) {
        // 重置图标位置
        android.animation.ObjectAnimator.ofFloat(button.id, "translationY", -30, 0).setDuration(300).start();
        // 隐藏提示文字
        button.textView.setVisibility(android.view.View.GONE);
    });
}
// 设置菜单按钮的点击事件
ui.menu.click(() => {
    dialogs.select("菜单", ["关于", "Github项目地址","反馈建议","退出"], (i) => {
        if (i === 0) {
            showAboutDialog();
        } else if (i === 1) {
            app.openUrl("https://github.com/zryyoung/AutoJsPro");
        } else if(i===2){
            app.openUrl("https://github.com/zryyoung/AutoJsPro/issues");
        } else if(i===3){
            confirm("确定退出吗").then(value=>{
                //当点击确定后会执行这里, value为true或false, 表示点击"确定"或"取消"
                if(value){
                    exit();
                }
            });
        }
    });
});
// 显示关于对话框
function showAboutDialog() {
    dialogs.alert("AutoJsPro", "这是关于 AppUI 应用的信息。\n当前版本：AppUI "+currentVersion)//+"\nGithub仓库地址：\nhttps://github.com/zryyoung/AutoJsPro");
}
// 设置初始页面为主页
ui.viewpager.setCurrentItem(2);

ui.激活状态框.on("click", () => {
    if (auto.service != null) {
        // 无障碍服务已启用
        toast("无障碍已激活");
    } else {
        // 无障碍服务未启用，引导用户到无障碍设置页面
        toast("请在设置中开启无障碍服务");
        app.startActivity({
            action: "android.settings.ACCESSIBILITY_SETTINGS"
        });
    }
});
if(auto.service!==null){
    ui.accessibilityService.checked=true;
}else{
    ui.accessibilityService.checked=false;
}
// 设置无障碍服务开关
ui.accessibilityService.on("check", (checked) => {
    if (checked && auto.service == null) {
        app.startActivity({
            action: "android.settings.ACCESSIBILITY_SETTINGS"
        });
    }
    if (!checked && auto.service != null) {
        auto.service.disableSelf();
        toastLog("已关闭")
        ui.run(() => {
            ui.激活状态.setText("未激活");
        });
    }
});
// 监听页面返回事件，检测无障碍服务的状态并更新开关状态
ui.emitter.on("resume", function() {
    ui.accessibilityService.setChecked(auto.service != null);
    ui.Shizuku.checked=$shell.checkAccess("adb");
    ui.run(() => {
        ui.激活状态.setText((auto.service != null) ? "已激活" : "未激活");
    });
});
// 定义日志输出函数，将日志显示在日志页面
function logToView(text) {
    // 获取当前时间并格式化为 "HH:mm:ss"
    let date = new Date();
    let time = date.toTimeString().split(" ")[0]; // 获取时间部分
    // 将时间和日志内容组合成 "时间: 日志内容" 格式
    let logMessage = time + ": " + text;
    // 更新日志视图
    ui.run(() => {
        ui.log_view.setText(ui.log_view.text() + "\n" + logMessage);
    });
}
var BackLog = console.log;
function logStatusChecked(logStatus){
    if (!logStatus) {
        console.log = function(message) {
            // 调用自定义的 logToView 方法，打印到应用的日志页面
            logToView(message);
            BackLog(message)
        };
        console.log("启用日志");
    } else {
        logToView("禁用日志");
        console.log = function(msg) {
            BackLog(msg)
        }
    }
}
logStatusChecked(logStatus)
//engines.execScriptFile("./AutoJs Pro.js");
// 示例日志输出
console.log("日志功能已启动！");
console.log("这是一个测试日志。");
// 在代码其他部分使用 console.log 进行日志输出时，都会显示在日志页面上
// 设置禁用详细日志开关
ui.detailedLog.on("check", (checked) => {
    toast("日志已" + (checked ? "禁用" : "启用"));
    logStatusChecked(checked);
    storage.put("logStatus", checked);
});
var isShizuku = $shell.checkAccess("adb");
if (isShizuku) {
    ui.Shizuku.checked=true;
}else{
    ui.Shizuku.checked=false;
}
//Shizuku服务开关
// 设置禁用详细日志开关
ui.Shizuku.on("check", (checked) => {
    if(!checked){
        toast("打开Shizuku关闭授权");
    }
    var isShizuku = $shell.checkAccess("adb");
    if (isShizuku) {
    	console.log("已经获取到adb权限");
    	toast("已经获取到Shizuku权限");
    	ui.Shizuku.checked=true;
    }else{
        ui.Shizuku.checked=false;
        if(auto.service==null){
            toast("请打开无障碍")
            return;
        }
        //toast("请打开Shizuku授权");
        launchApp("Shizuku");
        toast("请手动授权");
    }
    toast("Shizuku服务 " + (isShizuku ? "启用" : "禁用"));
});
let scripts = {}; // 用于存储子脚本的引擎实例
// 启动脚本并记录引擎实例
function startScript(name, path) {
    if (scripts[name]) {
        toast(name + " 已经在运行");
        return;
    }
    let engine = engines.execScriptFile(path);
    console.log("engine-"+engine);

    scripts[name] = engine;
    toast(name + " 启动成功");
}
// 停止脚本
function stopScript(name) {
    if (scripts[name]) {
        scripts[name].getEngine().forceStop();
        //engines.stopAll();
        delete scripts[name];
        console.log(name + " 已停止");
        toast(name + " 已停止");
    } else {
        toast(name + " 未运行");
    }
}
let window = null;
function createWindow(item, i, itemView, listView){
    if(window!=null){
        window.close();
        window=null;
    }
// 创建悬浮窗
window = $floaty.rawWindow(
    <frame id="view" w="180dp" h="300dp" alpha="1.0" >
        <card w="*" h="*" cardCornerRadius="16dp" cardBackgroundColor={storage.get("themeColor")} padding="10dp">

            <vertical gravity="center">
            <horizontal gravity="center" margin="5dp">
        <text text={item.title} textSize="18sp" textStyle="bold" textColor={storage.get("fontColor")}/>
        </horizontal>
                <horizontal gravity="center" margin="5dp">
                    <img src="@drawable/ic_play_arrow_black_48dp" tint="#ffffff" w="24dp" h="24dp"/>
                    <text id="run" text="运行" textColor="#ffffff" textSize="14sp" marginLeft="10dp"/>
                </horizontal>
                <horizontal gravity="center" margin="5dp">
                    <img src="@drawable/ic_block_black_48dp" tint="#ffffff" w="24dp" h="24dp"/>
                    <text id="stop" text="停止" textColor="#ffffff" textSize="14sp" marginLeft="10dp"/>
                </horizontal>
                <horizontal gravity="center" margin="5dp">
                    <img src="@drawable/ic_edit_black_48dp" tint="#ffffff" w="24dp" h="24dp"/>
                    <text id="edit" text="编辑" textColor="#ffffff" textSize="14sp" marginLeft="10dp"/>
                </horizontal>
                <horizontal gravity="center" margin="5dp">
                    <img src="@drawable/ic_folder_open_black_48dp" tint="#ffffff" w="24dp" h="24dp"/>
                    <text id="viewMoudle" text="查看" textColor="#ffffff" textSize="14sp" marginLeft="10dp"/>
                </horizontal>
                <horizontal gravity="center" margin="5dp">
                    <img src="@drawable/ic_share_black_48dp" tint="#ffffff" w="24dp" h="24dp"/>
                    <text id="share" text="分享" textColor="#ffffff" textSize="14sp" marginLeft="10dp"/>
                </horizontal>
                <horizontal gravity="center" margin="5dp">
                    <img src="@drawable/ic_delete_black_48dp" tint="#ffffff" w="24dp" h="24dp"/>
                    <text id="delete" text="删除" textColor="#ffffff" textSize="14sp" marginLeft="10dp"/>
                </horizontal>
                <horizontal gravity="center" margin="5dp">
                    <img src="@drawable/ic_clear_black_48dp" tint="#ffffff" w="24dp" h="24dp"/>
                    <text id="cancel" text="取消" textColor="#ffffff" textSize="14sp" marginLeft="10dp"/>
                </horizontal>
            </vertical>
        </card>
    </frame>
);
if(window!=null){
//window.setPosition(-1000, -1000);
// 设置悬浮窗位置
window.setPosition(720, 800);
//window.setPosition(720, 900);
window.setTouchable(true);
// 设置点击区域外隐藏
window.view.setOnTouchListener(new android.view.View.OnTouchListener({
    onTouch: function(view, event) {
        if (event.getAction() == android.view.MotionEvent.ACTION_OUTSIDE) {
            window.close();  // 点击区域外关闭悬浮窗
        }
        return true;
    }
}));
var mainScript = files.join(item.path, "main.js");
// 绑定点击事件
window.run.click(() => {
    window.close();
    //toast("运行");
    // 在这里添加运行代码
    // 单击事件：运行模块路径下的 main.js
    if (files.exists(mainScript)) {
        //try{engines.execScriptFile(mainScript);}catch(e){console.log(e)};
        
        startScript(item.title,mainScript)
    } else {
        toast("模块的 main.js 文件不存在");
    }
});
window.stop.click(() => {
    window.close();
    console.log("停止");
    stopScript(item.title);
});
window.edit.click(() => {
    window.close();
    console.log("编辑 main.js");
    app.editFile(mainScript)
});
    

window.viewMoudle.click(() => {
    window.close();
    console.log("查看");
    console.log(item.path)
    app.editFile(modulesDir+item.title);
});

window.share.click(() => {
    window.close();
    console.log("分享"+item.title);
    // 在这里添加分享代码
var moduleName = item.title +"打包项目"
dialogs.select("请选择分享", ["main.js文件", moduleName])
    .then(i => {
        if(i==0){
            console.log("分享"+item.title+"的main.js文件")
            console.log("路径："+mainScript);
            console.log(modulesDir)
            app.sendBroadcast({
    action: "android.intent.action.SEND",
    type: "*/*", // 你也可以指定具体的 MIME 类型，如 "text/plain"
    extras: {
        "android.intent.extra.STREAM": android.net.Uri.parse("file://" + modulesDir+"/main.js")
    },
    packageName: null, // 如果你想指定一个特定的应用来分享，可以在这里设置包名
});
        }else if(i==1){
            
        }
    });
});

window.delete.click(() => {
    window.close();
    console.log("删除");
    // 在这里添加删除代码
});

// 计时器，用于保持脚本运行
//let timer = setInterval(() => { }, 5000);

window.cancel.click(() => {
    console.log("取消");
    window.close(); // 关闭悬浮窗
    //clearInterval(timer); // 停止计时器，结束当前子脚本的循环
    // 不使用 exit()，仅停止当前子脚本的操作
});

}
}
// 构造模块数据
var modules = moduleNames.map(function(name) {
    var moduleDir = files.join(modulesDir, name);
    var configFile = files.join(moduleDir, "config.json");

    // 读取配置文件
    var config = {};
    if (files.exists(configFile)) {
        config = JSON.parse(files.read(configFile));
    }

    return {
        icon: "file://" + files.join(moduleDir, config.icon || "icon.png"), // 默认使用icon.png，如果没有配置则从config中获取
        title: name, // 模块名称等于文件夹名称
        description: config.description || "", // 从配置文件中读取描述，默认为空
        version: config.version || "", // 从配置文件中读取版本号，默认为空
        path: moduleDir // 记录模块路径
    };
});
// 绑定数据到列表,将仓库下载的模块数据设置到UI列表中
//ui.moduleDownloadList.setDataSource(repositories);

// 将模块数据设置到UI列表中
ui.moduleList.setDataSource(modules);
// 添加点击事件
ui.moduleList.on("item_click", function(item, i, itemView, listView) {
    //toast(item.title);
    try{
        console.log("点击模块:"+item.title)
        createWindow(item, i, itemView, listView);
    }catch(e){
        console.log(e);
    }
});
// 长按事件：显示悬浮窗，提供编辑和打开文件管理器的选项
ui.moduleList.on("item_long_click", function(item, i, itemView, listView) {
    console.log("长按")
    console.log(item);
    var itemTitle = item.title;
    // 使用 ui 提供的对话框选择功能
    dialogs.select("单击可以，长按获取不到item，没搞完", ["编辑 main.js", "打开文件管理器"])
        .then(index => {
            if (index === 0) {
                // 编辑 main.js
                var filePath = files.join(item.path, "main.js");
                console.log(filePath)
                if (files.exists(filePath)) {
                    app.editFile(filePath);
                } else {
                    toast("main.js 文件不存在");
                }
            } else if (index === 1) {
                // 调用文件管理器打开该模块的路径
                app.viewFile(item.path);
            }
        });
});
// 添加点击事件
ui.moduleDownloadList.on("item_click", function(item, i, itemView, listView) {
    //toast(item.title);
    try{
        toast("点击模块:"+item.title)
        console.log("点击模块:"+item.title)
        //createWindow(item, i, itemView, listView);
    }catch(e){
        console.log(e);
    }
});
// 在长按事件中，使用 `i` 作为索引来访问 `repositories` 数组中的数据
ui.moduleDownloadList.on('item_long_click', function(item, i, itemView, listView) {
    var itemData = repositories[i];  // 直接从 repositories 数组中获取数据
    console.log(i+"-"+item)
    if (item) {
        console.log("长按事件 - 绑定的数据: " + itemData);

        dialogs.select(item.title, ["编辑 main.js", "打开文件管理器"])
            .then(index => {
                if (index === 0) {
                    var filePath = files.join(item.path, "main.js");
                    if (files.exists(filePath)) {
                        app.editFile(filePath);
                    } else {
                        toast("main.js 文件不存在");
                    }
                } else if (index === 1) {
                    app.viewFile(item.path);
                }
            });
    } else {
        console.log("没有绑定数据");
    }
});
// 遍历布局并更改文本颜色
function changeColorByTextSize(viewGroup, color, size) {
    let childCount = viewGroup.getChildCount();
    for (let i = 0; i < childCount; i++) {
        let view = viewGroup.getChildAt(i);
        // 检查是否为 TextView，并且字体大小为指定的 sp
        if (view instanceof android.widget.TextView) {
            let textSizePx = view.getTextSize(); // 获取的是 px 值
            let textSizeSp = textSizePx / view.getResources().getDisplayMetrics().scaledDensity; // 转换为 sp 值
            if (textSizeSp === size) { // 判断是否为指定的 sp
                view.setTextColor(color);
                view.setTypeface(null, android.graphics.Typeface.BOLD);
            }
        }
        // 如果这个 view 是一个 ViewGroup，有子 view，递归调用
        if (view instanceof android.view.ViewGroup) {
            changeColorByTextSize(view, color, size);
        }
    }
}
// 遍历布局并更改文本颜色
function changeTextColor(viewGroup, color) {
    let childCount = viewGroup.getChildCount();
    for (let i = 0; i < childCount; i++) {
        let view = viewGroup.getChildAt(i);
        // 检查是否为 TextView，并且字体大小为 16sp
        if (view instanceof android.widget.TextView) {
            let textSizePx = view.getTextSize(); // 获取的是 px 值
            let textSizeSp = textSizePx / view.getResources().getDisplayMetrics().scaledDensity; // 转换为 sp 值
            if (textSizeSp === 16) { // 判断是否为 16sp
                view.setTextColor(color);
            }
        }
        // 如果这个 view 是一个 ViewGroup，有子 view，递归调用
        if (view instanceof android.view.ViewGroup) {
            changeTextColor(view, color);
        }
    }
}
// 工具函数：将dp转换为像素
function dpToPx(dp) {
    return Math.round(dp * context.getResources().getDisplayMetrics().density);
}
function changeDarkBydarkMode(darkMode) {
    // 创建一个 GradientDrawable 对象
    var drawable = new android.graphics.drawable.GradientDrawable();
    //用于填充设备信息框的背景，实现圆角边框
    // 设置圆角半径（单位：像素）
    var cornerRadius = dpToPx(16);  // 将12dp转换为像素
    drawable.setCornerRadius(cornerRadius);  // 设置圆角半径
    if (darkMode) {
        ui.viewpager.setBackgroundColor(colors.parseColor("#333333"));
        ui.设备信息框.setBackgroundColor(colors.parseColor("#333333"));
        // 设置圆角半径（单位：像素）
        //ui.设备信息框.setCardCornerRadius(16);  // 设置圆角半径为16px
        changeColorByTextSize(ui.设备信息框, colors.parseColor("#FFFFFF"), 14);
        ui.post(function() {
            //changeColorByTextSize(ui.viewpager, colors.parseColor("#FFFFFF"), 14);
            //changeColorByTextSize(ui.viewpager, colors.parseColor("#FFFFFF"), 14);
            changeColorByTextSize(ui.moduleList, colors.parseColor("#FFFFFF"), 17);
            changeColorByTextSize(ui.moduleList, colors.parseColor("#FFFFFF"), 14);
            //changeColorByTextSize(ui.moduleDownloadView,colors.parseColor("#FFFFFF"), 17);
        });
        // 设置背景颜色
        drawable.setColor(colors.parseColor("#333334"));
        // 设置边框颜色和宽度（单位：像素）
        drawable.setStroke(4, colors.parseColor("#A1A1A1"));  // 可选：设置白色边框，宽度为4px
    } else {
        ui.viewpager.setBackgroundColor(colors.parseColor("#FFFFFF"));
        ui.设备信息框.setBackgroundColor(colors.parseColor("#FFFFFF"));
        //ui.设备信息框.setCardCornerRadius(16);// 设置圆角半径（单位：像素）
        changeColorByTextSize(ui.设备信息框, colors.parseColor("#000000"), 14);
        ui.post(function() {
            changeColorByTextSize(ui.moduleList, colors.parseColor("#A1A1A1"), 14);
            //changeColorByTextSize(ui.modelView, colors.parseColor("#A1A1A1"), 12);
            changeColorByTextSize(ui.moduleList, colors.parseColor("#A1A1A1"), 17);  
            //changeColorByTextSize(ui.moduleDownloadView,colors.parseColor("#A1A1A1"), 17);
        });
        // 设置背景颜色
        drawable.setColor(colors.parseColor("#FFFFFF"));
        // 如果需要，还可以设置边框颜色和宽度（单位：像素）
        drawable.setStroke(4, colors.parseColor("#FFFFFF"));
        
    }
    ui.设备信息框.setBackgroundDrawable(drawable);
}
changeDarkBydarkMode(darkMode);
// 监听暗色模式切换
ui.themeColor.on("check", (checked) => {
    changeDarkBydarkMode(checked);
    //changeTextColor(ui.viewpager,color)
    console.log(checked ? "开启暗色模式" : "关闭暗色模式");
    storage.put("darkMode", checked)
});
let colorMap = {
    "黑色": "#000000",
    "浅灰": "#A1A1A1",
    "主题绿": "#71b49e",
    "樱花": "#FFB7C5",
    "亮红": "#FF4500",
    "珊瑚橙": "#FF7F50",
    "亮紫": "#BA55D3",
    "薰衣草": "#E6E6FA",
    "深蓝": "#00008B",
    "天蓝": "#87CEEB",
    "薄荷绿": "#98FF98",
    "柠檬黄": "#FFF44F",
    "橙黄": "#FFA500",
    "紫罗兰": "#EE82EE",
    "青绿": "#00FF7F",
    "青色": "#00FFFF",
    "浅蓝": "#ADD8E6",
    "绿色": "#008000",
    "浅绿": "#90EE90",
    "黄绿": "#9ACD32",
    "黄色": "#FFFF00",
    "琥珀": "#FFBF00",
    "橙色": "#FFA500",
    "深橙": "#FF8C00",
    "棕色": "#A52A2A",
    "灰蓝": "#6C7B8B"
};
// 获取颜色名称对应的索引
function getColorIndexByValue(colorValue) {
    var index = 0;
    for (var colorName in colorMap) {
        if (colorMap[colorName] === colorValue) {
            return index; // 返回找到的索引
        }
        index++;
    }
    return -1; // 如果未找到，返回-1
}
// 获取对应颜色的索引
var themeColorIndex = getColorIndexByValue(themeColor);
var fontColorIndex = getColorIndexByValue(fontColor);
ui.textColor.setSelection(fontColorIndex);
ui.textColor.setOnItemSelectedListener({
    onItemSelected: function(parent, view, position, id) {
        //if(storage.get("darkMode",false)){
        //toast("暗色模式不能改字体颜色")
        //return;
        //}
        let selectedColor = parent.getSelectedItem().toString();
        storage.put("fontColor", colorMap[selectedColor]);
        changeTextColor(ui.viewpager, colors.parseColor(colorMap[selectedColor]));
    }
});
// 设置默认选项为“主题绿”，它在列表中的索引是1（从0开始）
ui.themeColorSpinner.setSelection(themeColorIndex);
ui.themeColorSpinner.setOnItemSelectedListener({
    onItemSelected: function(parent, view, position, id) {
        ui.themeColorSpinner.setTextColor(colors.parseColor(fontColor));
        let selectedColor = parent.getSelectedItem().toString();
        storage.put("themeColor", colorMap[selectedColor]);
        let color = colors.parseColor(colorMap[selectedColor]);
        var themeId = ["topBar", "footBar", "激活状态框", //"backDefault",
            "checkNew", "基础配置", "主题", "版本信息", "设备信息","moduleDownloadText"
        ]
        ui.statusBarColor(color); //状态栏背景色
        for (var i = 0; i < themeId.length; i++) {
            var element = eval("ui." + themeId[i]); // 动态访问 UI 元素
            if (i <= 3) {
                element.setBackgroundColor(color);
            } else {
                element.setTextColor(color);
            }
        }
        //ui.基础配置.setTextColor(color);        
        //ui.topBar.setBackgroundColor(color);
        //toast("主题颜色已切换");  
    }
});
ui.backDefault.on('click', function() {
    toast("恢复默认");
    storage.clear();
    var themeColorSave = storage.get("themeColor", "#71b49e");
    var fontColorSave = storage.get("fontColor", "#000000");
    // 获取对应颜色的索引
    var themeColorIndex = getColorIndexByValue(themeColorSave);
    var fontColorIndex = getColorIndexByValue(fontColorSave);
    ui.themeColor.checked=false;
    ui.textColor.setSelection(fontColorIndex);
    ui.themeColorSpinner.setSelection(themeColorIndex);
});
//动画窗口。
let windowLoad=null;
//检测更新脚本执行
let checkUpdata = null;
//检测更新脚本执行状态
let checkUpdataStatue=false;
ui.checkNew.on('click', function() {
    console.log("检测更新");
    threads.start(function() {
    try{
        if(!checkUpdataStatue){
            checkUpdataStatue=true;
            if(windowLoad==null){
                //windowLoad = 
                threads.start(function() {加载动画();})
                setTimeout(() => {
                    //engines.execScriptFile("./runJs/checkUpdata.js");
                    if(checkUpdata==null){
                        checkUpdata = require("./runJs/checkNew.js");
                        checkUpdata.main();
                        
                        checkUpdata = null;
                        //engines.execScriptFile("./modules/高德地图Dex/定位.js");
                        //windowLoad=null;
                        checkUpdataStatue=false;
                    }else{
                        toastLog("检查更新脚本运行中,请稍后再试")
                        return;
                    }
                }, 3000);
            }else{
                console.log("关闭加载窗口动画")
                //windowLoad.close();
                //windowLoad=null;
            }
        }else{
            toast("正在检查更新");
        }
    }catch(e){
        console.log(e)
    }
    })
});
function 加载动画(){
    if(windowLoad!=null){
        windowLoad.close();
        windowLoad=null;
    }
    windowLoad = floaty.rawWindow(
    <frame w="100dp" h="100dp" marginLeft="130" marginTop="300" alpha="1.0">
        <vertical gravity="center" layout_width="match_parent" layout_height="match_parent">
            <canvas id="canvas" layout_width="40dp" layout_height="40dp"/>
        </vertical>
    </frame>
    );
    //windowLoad.setTouchable(false); // 禁止悬浮窗的触摸事件
    const arcColors = [
        android.graphics.Color.parseColor("#4285f4"), 
        android.graphics.Color.parseColor("#34a853"), 
        android.graphics.Color.parseColor("#fbbc05"), 
        android.graphics.Color.parseColor("#ea4335")
    ];
    let startAngle = 0;
    windowLoad.canvas.on("draw", function(canvas) {
        let paint = new Paint();
        let width = canvas.getWidth();
        let height = canvas.getHeight();
        let radius = Math.min(width, height) / 2 * 0.8;
        canvas.drawColor(android.graphics.Color.TRANSPARENT); // 设置背景为透明
        for (let i = 0; i < arcColors.length; i++) {
            paint.setColor(arcColors[i]);
            paint.setStyle(Paint.Style.STROKE);
            paint.setStrokeWidth(15);
            let sweepAngle = 90;
            canvas.drawArc(
                width / 2 - radius, 
                height / 2 - radius, 
                width / 2 + radius, 
                height / 2 + radius, 
                startAngle + i * sweepAngle, 
                sweepAngle, 
                false, 
                paint
            );
        }
        startAngle += 5; // 旋转速度
        if (startAngle >= 360) {
            startAngle = 0;
        }
    });
    // 设置悬浮窗的显示位置
    //windowLoad.setPosition(530, 1100);
    setTimeout(() => {
        windowLoad.close();
        windowLoad=null;
    },3000)
    //return windowLoad;
}