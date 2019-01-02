//设置顶部高度
//如果设置了沉浸式并且机器支持沉浸式,界面就会变成全屏的
//在index.html页面设置header，然后将之后的页面设置距离顶部的高度为状态栏高度
//如果不支持沉浸式，设置距离顶部高度为默认的0px
var Statusbar = (function() {
	var barHeight = function() {
		//判断当前是否为沉浸式状态栏模式，返回true或者false
		var isImmersedStatusbar = plus.navigator.isImmersedStatusbar();
		if(isImmersedStatusbar) {
			//是沉浸式状态栏模式
			localStorage.setItem('$Statusbar', plus.navigator.getStatusbarHeight() + 'px'); //系统状态栏高度
			localStorage.setItem('StatusHeightNo', plus.navigator.getStatusbarHeight()); //数值
		} else {
			//不是沉浸式状态栏模式
			localStorage.setItem('$Statusbar', 0 + 'px'); //设置0px
			localStorage.setItem('StatusHeightNo', 0); //数值
		}
		localStorage.setItem('getStatusbarHeight', plus.navigator.getStatusbarHeight()); //系统状态栏高度
		localStorage.setItem('resolutionHeight', plus.screen.resolutionHeight); //设备屏幕高度分辨率
		localStorage.setItem('resolutionWidth', plus.screen.resolutionWidth); //设备屏幕宽度分辨率
	}
	return {
		barHeight: barHeight,
	}
})();