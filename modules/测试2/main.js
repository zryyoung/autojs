var isAdb = $shell.checkAccess("adb");
if (isAdb) {
	console.log("autojs已经获取到adb权限");
	toast("autojs已经获取到adb权限");
}
