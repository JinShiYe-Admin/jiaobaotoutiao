/**
 * 求知主界面逻辑
 */
events.initSubPage('qiuzhi-sub.html', "", 40);
var allChannels; //所有话题
var channelInfo; //当前话题
var subPageReady = false; //子页面是否已触发plusReady事件
mui.plusReady(function() {
	//初始化为空
	document.getElementById('subjects-container').innerHTML = '';
	document.getElementById("sliderGroup").innerHTML = '';
	//console.log("个人信息："+JSON.stringify(myStorage.getItem(storageKeyName.PERSONALINFO)))
	document.querySelector(".img-icon>img").src=updateHeadImg(myStorage.getItem(storageKeyName.PERSONALINFO).uimg,2);
	//获取当前页面
	var curPage = plus.webview.currentWebview();
	//当前页面加载显示监听
	curPage.addEventListener("show", function(e) {
		if(allChannels && allChannels.length > 0) {
			if(!channelInfo) { //如果当前频道不存在
				channelInfo = allChannels[0]; //
				judgeWebReady();
			}
		} else {
			mui('#slider_sw').scroll().scrollTo(0, 0, 0);
			requestAllChannels(setChannels);
		}
	});
	//当前页面加载自定义方法的监听
	window.addEventListener('infoChanged', function() {
		document.querySelector(".img-icon>img").src = updateHeadImg(myStorage.getItem(storageKeyName.PERSONALINFO).uimg, 2)
		mui('#slider_sw').scroll().scrollTo(0, 0, 0);
		requestAllChannels(setChannels);
	})
	//当前页面获取子页面已健在完毕的监听
	window.addEventListener("subIsReady", function() {
		subPageReady = true;
	})
	//本页面子控件的各种监听事件
	setListener();
})
//1.获取所有话题
function requestAllChannels(callback) {
	//所需参数
	var comData = {
		pageIndex: '1', //当前页数
		pageSize: '0' //每页记录数,传入0，获取总记录数
	};
	// 等待的对话框
	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
	//1.获取所有话题
	postDataQZPro_getAllChannels(comData, wd, function(data) {
		wd.close();
		//console.log('获取所有话题:' + JSON.stringify(data));
		if(data.RspCode == 0) {
			var temArr = data.RspData.Data;
			var allChannel = {
				TabId: 0, //话题ID
				ChannelCode: 00, //话题编号
				ChannelName: "全部" //话题名称
			}
			temArr.splice(0, 0, allChannel);
			window.myStorage.setItem('allChannels', temArr);
			callback(temArr);
		} else {
			mui.toast(data.RspTxt);
		}
	});
}
/**
 * 设置频道
 * @param {Object} subjectArr
 */
var setChannels = function(subjectArr) {
	var subjects = document.getElementById('subjects-container');
	document.getElementById("sliderGroup").innerHTML = '';
	//console.log('要加载的类别:' + JSON.stringify(subjectArr));
	allChannels = subjectArr;
	events.clearChild(subjects);
	for(var i in subjectArr) {
		var a = document.createElement('a');
		var elementBot = document.createElement('div');
		if(i == 0) {
			a.className = "mui-control-item mui-active";
			elementBot.className = 'mui-slider-item mui-control-content mui-active';
		} else {
			a.className = "mui-control-item";
			elementBot.className = 'mui-slider-item mui-control-content';
		}
		a.innerText = subjectArr[i].ChannelName;
		a.info = subjectArr[i];
		a.href = '#bot_' + subjectArr[i].TabId;
		elementBot.id = 'bot_' + subjectArr[i].TabId;
		//elementBot.innerText = subjectArr[i].ChannelName;
		subjects.appendChild(a);
		document.getElementById("sliderGroup").appendChild(elementBot);
	}
	//	document.body.querySelector('.main-navigation').style.width = document.body.querySelector('.more-navigation').offsetLeft + 'px';
	mui('#slider').slider();
	channelInfo = allChannels[0];
	//console.log("获取频道信息：" + JSON.stringify(channelInfo));
	judgeWebReady();
}
/**
 * 判断子页面是否已触发plusReady事件
 */
var judgeWebReady = function() {
	if(subPageReady) {
		events.fireToPageNone('qiuzhi-sub.html', 'channelInfo', {
			curChannel: channelInfo,
			allChannels: allChannels
		});
	} else {
		setTimeout(judgeWebReady, 500);
	}
}
/**
 * 各频道的点击监听事件
 */
var setListener = function() {
	mui('#subjects-container').on('tap', '.mui-control-item', function() {
		channelInfo = this.info;
		events.fireToPageNone('qiuzhi-sub.html', 'channelInfo', {
			curChannel: channelInfo,
			allChannels: allChannels
		});
	});
	events.addTap('expertSearch', function() {
		this.disabled=true;
		events.singleWebviewInPeriod(this,'../qiuzhi/qiuzhi-questionSearch.html', 'jxq')
//		events.openNewWindowWithData();
	});
	document.querySelector('.img-icon').addEventListener('tap', function(e) {
		this.disabled=true;
		jQuery(this).css("pointerEvents","none");
		var personalInfo = myStorage.getItem(storageKeyName.PERSONALINFO);
		personalInfo.UserId = personalInfo.utid;
		events.singleWebviewInPeriod(this,'../qiuzhi/expert-detail.html', personalInfo)
	})
}