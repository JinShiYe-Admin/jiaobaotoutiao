/**
 * 作者：宋艳明
 * 时间：2016-10-14
 * 描述：index.html作为父页面，通过控制底部选项卡控制四个子页面切换
 */

mui.init({
	statusBarBackground: '#13b7f6'
});
var loginRoleType = 0; //登录角色0为游客1为用户
var noReadCount = 0;
var aniShow = {};
mui.plusReady(function() {
	var personalInfo = myStorage.getItem(storageKeyName.PERSONALINFO);
	if(parseInt(personalInfo.utid)) {
		loginRoleType = 1
	} else {
		loginRoleType = 0;
	}
	//	events.preload("../qiuzhi/expert-detail.html",100);
	var waitingDia = events.showWaiting();
	//安卓的连续点击两次退出程序
	var backButtonPress = 0;
	//重写返回键
	mui.back = function(event) {
		backButtonPress++;
		if(backButtonPress > 1) {
			plus.runtime.quit();
		} else {
			plus.nativeUI.toast('再按一次退出应用');
		}
		setTimeout(function() {
			backButtonPress = 0;
		}, 1000);
		return false;
	};
	Statusbar.barHeight(); //获取一些硬件参数
	addSubPages(); //加载子页面
	setConditionbyRole(loginRoleType);
	//	slideNavigation.add('mine.html', 200); //加载侧滑导航栏
	window.addEventListener('infoChanged', function() {
//		events.fireToPageNone("cloud_home.html", "infoChanged");
//		events.fireToPageNone("qiuzhi_home.html", "infoChanged");
//		events.fireToPageNone("course_home2.html", "infoChanged");
	});
	//登录的监听
	window.addEventListener("login", function() {
		//console.log("login");
		loginRoleType = 1;
		setConditionbyRole(loginRoleType);
	})
	//退出的监听
	window.addEventListener("quit", function() {
		loginRoleType = 0;
		setConditionbyRole(loginRoleType); //根据身份不同加载的界面处理
	})
	//关闭等待框
	window.addEventListener('closeWaiting', function() {
		events.closeWaiting();
	})
	//加载监听
	setListener();

});
//加载子页面
var addSubPages = function() {
	//设置默认打开首页显示的子页序号；
	var Index = 0;
	//把子页的路径写在数组里面（空间，求知，剪辑，云盘 ）四个个子页面
//	var subpages = ['../cloud/cloud_home.html', '../sciedu/sciedu_home.html', '../show/show_home_1.html', '../qiuzhi/qiuzhi_home.html'];
//	var titles = ['云盘', '科教', '展现', '求知'];
//	var subpages = ['../cloud/cloud_home.html', '../sciedu/sciedu_home.html', '../show/show-home.html', '../micro-course/course-home.html'];
	var subpages = ['../sciedu/sciedu_home.html', '../test/collect.html', '../test/mine.html'];
	var titles = ['科教', '收藏', '我的'];
	//创建子页面，首个选项卡页面显示，其它均隐藏；
	var self = plus.webview.currentWebview();
	for(var i = 0; i < 3; i++) {
		//设置子页面距离顶部的位置
		var subpage_style = events.getWebStyle(subpages[i]);
		subpage_style.top = (localStorage.getItem('StatusHeightNo') * 1) + 'px';
		subpage_style.bottom = '51px';
		//console.log("子页面样式：" + JSON.stringify(subpage_style));
		var temp = {};
		var sub = plus.webview.create(subpages[i], subpages[i].split('/')[subpages[i].split('/').length - 1], subpage_style);
		if(i > 0) {
			sub.hide();
		} else {
			temp[subpages[i]] = "true";
			mui.extend(aniShow, temp);
		}
		//append,在被选元素的结尾(仍然在内部)插入指定内容
		self.append(sub);
	}
	//当前激活选项
	activeTab = subpages[Index];
	//去掉展现和科教城市下面的点
	events.closeWaiting();
}
//加载监听
var setListener = function() {
	var title = document.getElementById("title");
	//	var aniShow = {};
	//选项卡点击事件
	mui('.mui-bar-tab').on('tap', 'a', function(e) {
		var targetTab = this.getAttribute('href');
		if(activeTab == '../cloud/cloud_home.html') {
//			events.fireToPageWithData('../cloud/cloud_home.html', 'topPopover', {})
		}
		//console.log("活动的页面：" + activeTab)
		if(targetTab == activeTab) {
			return;
		}

		//更改按钮
		//		changRightIcons(targetTab);
		var targetSplit = targetTab.split('/');
		//显示目标选项卡
		//若为iOS平台或非首次显示，则直接显示
		if(mui.os.ios || aniShow[targetTab]) {
			plus.webview.show(targetSplit[targetSplit.length - 1]);
		} else {
			//否则，使用fade-in动画，且保存变量
			var temp = {};
			temp[targetTab] = "true";
			mui.extend(aniShow, temp);
			plus.webview.show(targetSplit[targetSplit.length - 1], "fade-in", 300);
		}
		var activeSplit = activeTab.split('/');
		//隐藏当前;
		plus.webview.hide(activeSplit[activeSplit.length - 1]);
		//更改当前活跃的选项卡
		activeTab = targetTab;
	});
}
//根据登录角色不同，更改界面显示
var setConditionbyRole = function(role) {
	//console.log("获取的身份信息：" + JSON.stringify(myStorage.getItem(storageKeyName.PERSONALINFO)));
//	var cloudIcon = document.getElementById("defaultTab");
	var sceIcon = document.getElementById("tabclass");
	var active_tab = document.querySelector(".mui-tab-item.mui-active").getAttribute('href');
	//console.log("要隐藏的界面：" + active_tab);
	plus.webview.hide(active_tab.split("/")[active_tab.split("/").length - 1]);
	document.querySelector(".mui-tab-item.mui-active").className = "mui-tab-item";

//	if(role) { //正常用户
//		cloudIcon.style.display = "table-cell";
//		cloudIcon.className = "mui-tab-item mui-active";
//		activeTab = "../cloud/cloud_home.html";
//	} else { //游客
//		cloudIcon.style.display = "none";
		sceIcon.className = "mui-tab-item mui-active";
		activeTab = "../sciedu/sciedu_home.html";
//	}
	//显示活动的界面
	setActivePage();
}
/**
 * 显示活动的界面
 */
var setActivePage = function() {
	var temp = {};
	temp[activeTab] = "true";
	mui.extend(aniShow, temp);
	var splitActiveTabs = activeTab.split("/");
	var activeId = splitActiveTabs[splitActiveTabs.length - 1];
	//console.log("要显示的界面：" + activeTab);
	if(mui.os.ios){
		plus.webview.show(activeId);
	}else{
		plus.webview.show(activeId, "fade-in", 300);
	}
}