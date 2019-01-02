mui.init();
var newsDetail;
mui.plusReady(function() {
	mui.fire(plus.webview.currentWebview().opener(), "subReady", 0);
	window.addEventListener("newsDetail", function(e) {
		newsDetail = e.detail.data;
		//console.log("获取的新闻详情：" + JSON.stringify(newsDetail));
		//放置数据
		setData();
	})
	plus.webview.currentWebview().addEventListener("hide", function() {
		//console.log("隐藏页面");
		plus.webview.getWebviewById(newsDetail.turl).close();
	})
	setListener();
})
//放置数据
var setData = function() {
	plus.webview.currentWebview();
	if(newsDetail.turl) {
		//		events.showWaiting();
		var web = plus.webview.create(newsDetail.turl, newsDetail.turl, {
			top: "44px",
			bottom: "50px"
		})
		plus.webview.currentWebview().append(web);
	}
	setCheckInfo()
}
var setCheckInfo = function() {
	var checkInfo;
	var refuseButton = document.getElementById("refuse-button");
	var passButton = document.getElementById("pass-button");
	//console.log(JSON.stringify(newsDetail));
	switch(newsDetail.Ischeck) {
		case 0:
			checkInfo = "未审"
			refuseButton.style.display = "inline-block";
			passButton.style.display = "inline-block";
			break;
		case 1:
			checkInfo = "已显示";
			refuseButton.style.display = "inline-block";
			passButton.style.display = "none";
			break;
		case 2:
			checkInfo = "已屏蔽";
			refuseButton.style.display = "none";
			passButton.style.display = "inline-block";
			break;
		default:
			break;
	}
	document.getElementById("check-status").innerText = "当前审核状态：" + checkInfo;
}

//加载监听
var setListener = function() {
	//拒绝按钮事件
	events.addTap("refuse-button", function() {
		checkNews(2);
	})
	//通过按钮事件
	events.addTap("pass-button", function() {
		checkNews(1);
	})
	rewriteBack();
}
/**
 * 重写back方法
 */
var rewriteBack=function(){
	var _back=mui.back;
	mui.back=function(){
		mui.fire(plus.webview.currentWebview().opener(),"checkedNews",newsDetail)
		_back();
	}
}
/**
 * 
 * @param {Object} checkType
 */
var checkNews = function(checkType) {
	var wd = events.showWaiting();
	postDataPro_PostTnewsE({
		vvl: newsDetail.tabid,
		vvl1: checkType
	}, wd, function(data) {
		wd.close();
		//console.log("当前返回状态：" + JSON.stringify(data));
		if(data.RspCode == 0) {
			newsDetail.Ischeck = checkType;
			setCheckInfo();
		} else {
			mui.toast(data.RspTxt);
		}
	})
}