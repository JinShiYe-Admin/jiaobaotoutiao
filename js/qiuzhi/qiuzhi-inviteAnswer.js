var ExpertsInfo; //专家详细页传来的 专家信息
var pageIndex = 1; //请求数据页面
var totalPageCount; //总页码
var flagRef = 0; //是刷新0，还是加载更多1
var answerArray = []; //回答总数组

mui.init();

mui.plusReady(function() {
	var main = plus.webview.currentWebview();
	ExpertsInfo = main.data; //接收专家详情页传来的专家用户信息
	//console.log('邀请回答传值:' + JSON.stringify(ExpertsInfo));
	//		mui('.mui-table-view').on('tap', 'img', function() {
	//			events.openNewWindowWithData('../qiuzhi/expert-detail.html', ExpertsInfo);
	//		});

	mui('.mui-table-view').on('tap', '.mui-table-view-cell', function() {
		//获取存储值
		var index = this.id.replace('li', '');
		var modelTemp = answerArray[index];
		//console.log('dianji 标题' + JSON.stringify(modelTemp));
		//判断回答或则问题是否还存在,flag=1为提问，=2为回答，id为对应id
		events.askDetailOrAnswerDetail(1, modelTemp.AskId, function(data) {
			if(data) {
				//跳转界面
				events.openNewWindowWithData('qiuzhi-question.html', {
					askID: modelTemp.AskId, //问题id
					channelInfo: modelTemp, //当前话题
					allChannels: window.myStorage.getItem('allChannels') //全部话题
				});
			}
		});
	});
	//36.获取某个用户的被邀请问题列表
	getInviteAsksByUser(ExpertsInfo.UserId);

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
				//36.获取某个用户的被邀请问题列表
				getInviteAsksByUser(ExpertsInfo.UserId);
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
				flagRef = 1;
				if(pageIndex <= totalPageCount) {
					//36.获取某个用户的被邀请问题列表
					getInviteAsksByUser(ExpertsInfo.UserId);
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
			}
		}
	});

});

//36.获取某个用户的被邀请问题列表
function getInviteAsksByUser(userId) {
	//需要加密的数据
	var comData = {
		userId: userId, //用户ID
		pageIndex: pageIndex, //当前页数
		pageSize: '10' //每页记录数,传入0，获取总记录数
	};
	// 等待的对话框
	var wd = events.showWaiting();
	//36.获取某个用户的被邀请问题列表
	postDataQZPro_getInviteAsksByUser(comData, wd, function(data) {
		wd.close();
		//console.log('36.获取某个用户的被邀请问题列表:' + data.RspCode + ',RspData:' + JSON.stringify(data.RspData) + ',RspTxt:' + data.RspTxt);
		if(data.RspCode == 0) {
			//总页数
			totalPageCount = data.RspData.TotalPage;
			pageIndex++;
			//回调中的临时数据
			var tempRspData = data.RspData.Data;
			//获取当前回调的个人信息，主要是头像、昵称
			var tempArray = [];
			//先遍历回调数组，获取
			for(var item in tempRspData) {
				//当前循环的model
				var tempModel0 = tempRspData[item];
				//将当前model中id塞到数组
				tempArray.push(tempModel0.InviteMan);
			}
			//给数组去重
			tempArray = arrayDupRemoval(tempArray);
			//发送获取用户资料申请
			var tempData = {
				vvl: tempArray.join(), //用户id，查询的值,p传个人ID,g传ID串
				vtp: 'g' //查询类型,p(个人)g(id串)
			}
			//console.log('tempData:' + JSON.stringify(tempData));
			// 等待的对话框
			var wd2 = events.showWaiting();
			//21.通过用户ID获取用户资料
			postDataPro_PostUinf(tempData, wd2, function(data1) {
				wd2.close();
				//console.log('21.获取个人资料success:RspCode:' + data1.RspCode + ',RspData:' + JSON.stringify(data1.RspData) + ',RspTxt:' + data1.RspTxt);
				if(data1.RspCode == 0) {
					//循环当前的个人信息返回值数组
					for(var i in data1.RspData) {
						//当前model
						var tempModel = data1.RspData[i];
						//更新头像
						tempModel.uimg = updateHeadImg(tempModel.uimg, 2);
						//循环回调数组
						for(var item in tempRspData) {
							//当前循环的model
							var tempModel0 = tempRspData[item];
							//对比id是否一致
							if(tempModel0.InviteMan == tempModel.utid) {
								//合并
								tempModel0 = $.extend(tempModel0, tempModel);
							}
							if(!tempModel0.utid) {
								tempModel0 = $.extend(tempModel0, {
									unick: "匿名",
									uimg: "../../image/utils/default_personalimage.png"
								});
							}
						}

					}
				}
				if(flagRef == 0) { //刷新
					answerArray = tempRspData;
					if(data.RspData.Data.length == 0) {
						mui.toast('没有数据');
					}
				} else { //加载更多
					//合并数组
					answerArray = answerArray.concat(tempRspData);
				}
				if(mui(".mui-table-view-cell").length < 10) {
					mui(".mui-pull-loading")[0].innerHTML = "";
				}
				setAnswerRecord(tempRspData);
				//console.log('专家循环遍历后的值：' + JSON.stringify(tempRspData));
			});

		} else {
			mui.toast(data.RspTxt);
		}
	});
};

/**
 * 放置邀请回答记录数据
 * @param {Object} list 回答记录数据
 */
var setAnswerRecord = function(list) {
	var listContainer = document.getElementById('list-container');
	for(var i in list) {
		createList(listContainer, list[i], i);
	}
}
/**
 * 拼接回答记录
 * @param {Object} listContainer
 * @param {Object} record
 */
var createList = function(listContainer, record, index) {
	var li = document.createElement('li');
	li.className = 'mui-table-view-cell';
	li.id = 'li' + index;
	//拼接显示
	li.innerHTML = '<div class="cell-container"><img  src="' + record.uimg + '"/><div class="invite-info"><p><span>" ' +
		record.unick + '"</span>邀请<span>"' + ExpertsInfo.unick + '"</span>回答问题</p><p class="Ask-Title" style= "font-size:1.4rem;">[' +
		record.AskChannel + ']' + record.AskTitle + '</p></div></div>';
	listContainer.appendChild(li);
}