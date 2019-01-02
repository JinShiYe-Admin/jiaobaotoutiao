var ExpertsInfoModel; //专家详细页传来的 专家信息
var pageIndex = 1; //请求数据页面
var totalPageCount; //总页码
var flagRef = 0; //是刷新0，还是加载更多1
var questionArray = []; //回答总数组
mui.init();

mui.plusReady(function() {
	//	mui('.mui-table-view').on('tap', '.mui-table-view-cell', function() {
	//		events.openNewWindowWithData('../qiuzhi/expert-detail.html', expertData);
	//	});
	var curPage = plus.webview.currentWebview();
	ExpertsInfoModel = curPage.data;
//	window.addEventListener('focus-question', function(event) {
		//console.log('传值的model为=' + JSON.stringify(ExpertsInfoModel));
		//清除节点
		document.getElementById('list-container').innerHTML = "";
		pageIndex = 1;
		flagRef = 0;
		if(ExpertsInfoModel.uid>0) {
			//26.获取某个用户的关注问题列表
			getFocusAsksByUser(ExpertsInfoModel.UserId);
		} else {
			//游客身份、获取关注的问题
			getFocusAsksByUserNotLogin();
		}
//	});

	mui('.mui-table-view').on('tap', '.ask-title', function() {
		var parent = this.parentNode.parentNode.parentNode;
		var info = JSON.parse(parent.getAttribute('data-info'));
		//console.log('dianji 关注的问题标题' + JSON.stringify(info));
		//判断回答或则问题是否还存在,flag=1为提问，=2为回答，id为对应id
		events.askDetailOrAnswerDetail(1, info.AskId, function(data) {
			if(data) {
				//跳转界面
				events.openNewWindowWithData('qiuzhi-question.html', {
					askID: info.AskId, //问题id
					channelInfo: info, //当前话题
					allChannels: window.myStorage.getItem('allChannels') //全部话题
				});
			}
		});
	});

	//阻尼系数、初始化刷新加载更多
	var deceleration = mui.os.ios ? 0.003 : 0.0009;
	mui('.mui-scroll-wrapper').scroll({
		bounce: false,
		indicators: true, //是否显示滚动条
		deceleration: deceleration
	});

	//上拉下拉注册
	mui(".mui-scroll-wrapper .mui-scroll").pullToRefresh({
		down: {
			callback: function() {
				//清除节点
				document.getElementById('list-container').innerHTML = "";
				var self = this;
				//console.log("下拉刷新");
				pageIndex = 1;
				flagRef = 0;
				if(ExpertsInfoModel.uid>0) {
					//26.获取某个用户的关注问题列表
					getFocusAsksByUser(ExpertsInfoModel.UserId);
				} else {
					//游客身份、获取关注的问题
					getFocusAsksByUserNotLogin();
				}

				setTimeout(function() {
					//结束下拉刷新
					self.endPullDownToRefresh();
				}, 1000);
			}
		},
		up: {
			callback: function() {
				var self = this;
				//console.log("上拉加载更多");
				if(ExpertsInfoModel.uid>0) {
					if(pageIndex <= totalPageCount) {
						flagRef = 1;
						//26.获取某个用户的关注问题列表
						getFocusAsksByUser(ExpertsInfoModel.UserId);
						setTimeout(function() {
							//结束下拉刷新
							self.endPullUpToRefresh();
							if(mui(".mui-table-view-cell").length < 10) {
								mui(".mui-pull-loading")[0].innerHTML = "";
							}
						}, 1000);
					} else {
						//结束下拉刷新
						self.endPullUpToRefresh();
						mui(".mui-pull-loading")[0].innerHTML = "没有更多了";
					}
				} else {
					//游客身份、结束下拉刷新
					self.endPullUpToRefresh();
					mui(".mui-pull-loading")[0].innerHTML = "没有更多了";
				}

			}
		}
	});
});

//游客身份、获取关注的问题
function getFocusAsksByUserNotLogin() {
	//console.log('111111=='+window.myStorage.getItem(window.storageKeyName.FOCUSEQUESTION));
	if (window.myStorage.getItem(window.storageKeyName.FOCUSEQUESTION) == null||window.myStorage.getItem(window.storageKeyName.FOCUSEQUESTION)=='') {
		mui.toast('没有数据');
		return;
	}
	//需要加密的数据
	var comData = {
		askIds: JSON.stringify(window.myStorage.getItem(window.storageKeyName.FOCUSEQUESTION)) //问题ID列表，Array，	例如[1,2,3]
	};
	// 等待的对话框
	var wd = events.showWaiting();
	//39.获取问题列表
	postDataQZPro_getAskByIds(comData, wd, function(data) {
		wd.close();
		//console.log('39.获取问题列表:' + data.RspCode + ',RspData:' + JSON.stringify(data.RspData) + ',RspTxt:' + data.RspTxt);
		if(data.RspCode == 0) {
			//如果是旧数据，去掉里面的html标签
			for(var i = 0; i < data.RspData.Data.length; i++) {
				var temp = data.RspData.Data[i];
				if(temp.AskSFlag == 1) {
					temp.AskTitle = events.deleteHtml(temp.AskTitle);
				}
			}
			questionArray = data.RspData.Data;
			if(data.RspData.Data.length == 0) {
				mui.toast('没有数据');
			}
			if(mui(".mui-table-view-cell").length < 10) {
				mui(".mui-pull-loading")[0].innerHTML = "";
			}
			setQuestionRecord(data.RspData.Data);
		} else {
			mui.toast(data.RspTxt);
		}
	});
}

//26.获取某个用户的关注问题列表
function getFocusAsksByUser(userId) {
	//需要加密的数据
	var comData = {
		userId: userId, //用户ID
		pageIndex: pageIndex, //当前页数
		pageSize: 10 //每页记录数,传入0，获取总记录数
	};
	// 等待的对话框
	var wd = events.showWaiting();
	//26.获取某个用户的关注问题列表
	postDataQZPro_getFocusAsksByUser(comData, wd, function(data) {
		wd.close();
		//console.log('26.获取某个用户的关注问题列表:' + data.RspCode + ',RspData:' + JSON.stringify(data.RspData) + ',RspTxt:' + data.RspTxt);
		if(data.RspCode == 0) {
			//总页数
			totalPageCount = data.RspData.TotalPage;
			pageIndex++;
			//如果是旧数据，去掉里面的html标签
			for(var i = 0; i < data.RspData.Data.length; i++) {
				var temp = data.RspData.Data[i];
				if(temp.AskSFlag == 1) {
					temp.AskTitle = events.deleteHtml(temp.AskTitle);
				}
			}
			if(flagRef == 0) { //刷新
				questionArray = data.RspData.Data;
				if(data.RspData.Data.length == 0) {
					mui.toast('没有数据');
				}
			} else { //加载更多
				//合并数组
				questionArray = questionArray.concat(data.RspData.Data);
			}
			if(mui(".mui-table-view-cell").length < 10) {
				mui(".mui-pull-loading")[0].innerHTML = "";
			}
			setQuestionRecord(data.RspData.Data);
		} else {
			mui.toast(data.RspTxt);
		}
	});
};

/**
 * 放置关注问题记录数据
 * @param {Object} list 关注问题记录数据
 */
var setQuestionRecord = function(list) {
	var listContainer = document.getElementById('list-container');
	for(var i in list) {
		createList(listContainer, list[i])
	}
}
/**
 *
 * @param {Object} cell
 */
var getChannelIcon = function(channelName) {
	var iconSourse = "../../image/qiuzhi/";
	switch(channelName) {
		case "教学":
			iconSourse += "channel-edu.png";
			break;
		case "美食":
			iconSourse += "channel-food.png";
			break;
		case "健康":
			iconSourse += "channel-health.png";
			break;
		case "其他":
			iconSourse += "channel-others.png";
			break;
		case "科普":
			iconSourse += "channel-science.png";
			break;
		default:
			iconSourse = "";
			break;
	}
	return iconSourse;
}
/**
 * 拼接问题记录
 * @param {Object} listContainer
 * @param {Object} record
 */
var createList = function(listContainer, record) {
	var li = document.createElement('li');
	li.className = 'mui-table-view-cell';
	li.setAttribute('data-info', JSON.stringify(record));
	//拼接显示

	li.innerHTML = '<a>' +
		'<div class="channel-info">' +
		'<p>' +
		'<img src="' + getChannelIcon(record.AskChannel) + '"  class="channel-icon head-portrait "/>来自话题:' +
		record.AskChannel +
		'</p>' +

		'</div>' +
		'<div class="ask-container ">' +
		'<h5 class="single-line ask-title " style="font-size: 1.6rem;" >' + record.AskTitle + '</h5>' +

		'</div>' +
		'<p>' + record.FocusNum + '关注·' + record.AnswerNum + '回答' + '</p>' +
		'</a>'
	listContainer.appendChild(li)
}