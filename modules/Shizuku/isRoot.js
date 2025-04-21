var isRoot = $shell.checkAccess("root");
if (isRoot) {
	console.log("autojs已经获取到root权限");
}

var isAdb = $shell.checkAccess("adb");
if (isAdb) {
	console.log("autojs已经获取到adb权限");
}