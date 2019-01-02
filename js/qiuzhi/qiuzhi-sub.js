mui.init();
var freshContainer;
var freshFlag = 0; //0 默认 1刷新 2加载更多
mui('.mui-scroll-wrapper').scroll({
	bounce: false,
	indicators: true //是否显示滚动条
});
var setFresh = function() {
	//上拉下拉注册
	mui(".scroll-vertical>.mui-scroll").pullToRefresh({
		down: {
			callback: function() {
				freshContainer = this;
				oldPageIndex = pageIndex;
				freshFlag = 1;
				pageIndex = 1;
				getChannelTime = null;
				getExperTime = null;
				wd = events.showWaiting(); //2.获取符合条件的专家信息
				getExpertsArray(channelInfo.TabId);
				//刷新的界面实现逻辑
				requestChannelList(channelInfo);
			}
		},
		up: {
			callback: function() {
				freshContainer = this;
				//console.log('我在底部pageIndex:' + pageIndex + ':总页数:' + totalPage);
				if(pageIndex < totalPage) {
					freshFlag = 2;
					wd = events.showWaiting();
					pageIndex++;
					requestChannelList(channelInfo);
				} else {
					freshContainer.endPullUpToRefresh();
					mui(".mui-pull-loading")[0].innerHTML = "没有更多了";
				}
			}
		}
	});
}
setFresh();
var pageIndex = 1; //当前页数
var oldPageIndex = 1;
var totalPage; //总页数
var channelInfo; //选择的话题
var allChannels; //所有的话题
var answerIsReady = false; //页面已就绪
var wd;
var getExperTime = null;
var getChannelTime = null;
mui.plusReady(function() {
	mui.fire(plus.webview.getWebviewById('qiuzhi_home.html'), 'subIsReady');
	mui.fire(plus.webview.getLaunchWebview(), "indexReady");
	events.preload("qiuzhi-answerDetail.html", 80);
	window.addEventListener('answerIsReady', function() {
		answerIsReady = true;
	});
	window.addEventListener('channelInfo', function(e) {
		//console.log('求知子页面获取的 :' + JSON.stringify(e.detail.data))
		pageIndex = 1; //当前页数
		totalPage = 0; //总页数
		channelInfo = e.detail.data.curChannel; //选择的话题
		allChannels = e.detail.data.allChannels; //所有的话题
		document.getElementById('list-container').innerHTML = "";
		mui(".scroll-vertical").scroll().scrollTo(0, 0);
		if(mui(".mui-pull-loading").length > 0) {
			mui(".mui-pull-loading")[0].innerText = "上拉加载更多";
		}
		//console.log("高度：" + document.querySelector(".mui-scroll-wrapper").offsetHeight);
		getChannelTime = null;
		getExperTime = null;
		if(plus.networkinfo.getCurrentType() != plus.networkinfo.CONNECTION_NONE) {
			wd = events.showWaiting();
		}
		//获取所有符合条件问题
		requestChannelList(channelInfo);
		//清理专家列表
		resetExpertsList();
		//2.获取符合条件的专家信息
		getExpertsArray(channelInfo.TabId);

	});
	window.addEventListener("refreshQuestionList", function() {
		pageIndex = 1;
		//清理问题列表
		events.clearChild(document.getElementById('list-container'));
		//清理专家列表
		//		resetExpertsList();
		getChannelTime = null;
		getExperTime = null;
		if(plus.networkinfo.getCurrentType() != plus.networkinfo.CONNECTION_NONE) {
			wd = events.showWaiting();
		}
		//2.获取符合条件的专家信息
		getExpertsArray(channelInfo.TabId);
		//刷新的界面实现逻辑
		requestChannelList(channelInfo);
	})
	setListener();
});
/**
 * 
 * @param {Object} type
 */
function showNoData(type) {
	if(type) {
		document.querySelector(".vertical-list").style.display = "none";
		document.querySelector(".noDataDisplay").style.display = "block";
		mui(".mui-pull-loading")[0].style.display = "none";
	} else {
		document.querySelector(".vertical-list").style.display = "block";
		document.querySelector(".noDataDisplay").style.display = "none";
		mui(".mui-pull-loading")[0].style.display = "block";
	}
}

function endFresh() {
	if(freshContainer) {
		if(freshFlag == 1) {
			freshContainer.endPullDownToRefresh();
			mui(".mui-pull-loading")[0].innerText = "上拉加载更多";
		} else if(freshFlag == 2) {
			freshContainer.endPullUpToRefresh();
		} else {
			mui(".mui-pull-loading")[0].innerText = "上拉加载更多";
		}
	}
	freshFlag = 0;
}
/**
 * 请求专家数据
 * //2.获取符合条件的专家信息
 */
function getExpertsArray(channelId) {
	//需要加密的数据
	var comData = {
		askId: '0', //问题ID，传入0，则不包括问题参数
		userIds: '[0]', //用户编号列表,Array,传入0，获取所有专家
		channelId: channelId.toString(), //话题ID,传入0，获取所有话题数据
		pageIndex: '1', //当前页数
		pageSize: '10' //每页记录数,传入0，获取总记录数
	};
	// 等待的对话框
	//	var wd = events.showWaiting();
	//2.获取符合条件的专家信息
	postDataQZPro_getExpertsByCondition(comData, wd, function(data) {
		//console.log('2.获取符合条件的专家信息:' + data.RspCode + ',RspData:' + JSON.stringify(data.RspData) + ',RspTxt:' + data.RspTxt);
		if(data.RspCode == 0) {
			resetExpertsList();
			//添加人员信息
			//回调中的临时数据
			var tempRspData = data.RspData.Data;
			//获取当前回调的个人信息，主要是头像、昵称
			var tempArray = [];
			//先遍历回调数组，获取
			for(var item in tempRspData) {
				//当前循环的model
				var tempModel0 = tempRspData[item];
				//将当前model中id塞到数组
				tempArray.push(tempModel0.UserId);
			}
			//给数组去重
			tempArray = arrayDupRemoval(tempArray);
			if(tempArray.length == 0) {
				getExperTime = Date.now();
				if(getChannelTime) {
					events.closeWaiting();
				}
				return;
			}
			//发送获取用户资料申请
			var tempData = {
				vvl: tempArray.toString(), //用户id，查询的值,p传个人ID,g传ID串
				vtp: 'g' //查询类型,p(个人)g(id串)
			}
			//console.log('tempData:' + JSON.stringify(tempData));
			// 等待的对话框
			//			var wd2 = events.showWaiting();
			//21.通过用户ID获取用户资料
			postDataPro_PostUinf(tempData, wd, function(data1) {
				getExperTime = Date.now();
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
							if(tempModel0.UserId == tempModel.utid) {
								//合并
								tempModel0 = $.extend(tempModel0, tempModel);
							}
						}
					}
				} else {
					mui.toast(data.RspTxt);
				}
				//console.log('专家循环遍历后的值：' + JSON.stringify(tempRspData));
				//刷新界面
				for(var i = 0; i < tempRspData.length; i++) {
					expertsItem(channelId, tempRspData[i]);
				}
				if(getChannelTime) {
					events.closeWaiting();
				}
			});
		} else {
			if(data.RspCode != 404) {
				mui.toast(data.RspTxt);
			}
			endFresh();
		}
		//		wd.close();
	});
};

/**
 * 放置专家数据
 * @param {Object} channelId 话题id
 * @param {Object} data 专家数据
 */
function expertsItem(channelId, data) {
	////console.log('expertsItem ' + channelId + '|' + JSON.stringify(data));
	var element = document.createElement('a');
	element.id = 'experts_' + channelId + '_' + data.TabId;
	element.className = 'mui-control-item';
	element.setAttribute('data-info', JSON.stringify(data));
	element.innerHTML = '<img src="' + updateHeadImg(data.uimg, 2) + '" />' +
		'<p id="experts_name_' + data.TabId + '" class="mui-ellipsis" style="color:#323232;"></p>';
	var table = document.getElementById("experts_sc");
	var allExpert = document.getElementById("allExpert");
	table.insertBefore(element, allExpert);
	document.getElementById("experts_name_" + data.TabId).innerText = data.unick;
}

/**
 * 重置专家列表
 */
function resetExpertsList() {
	var table = document.getElementById("experts_sc");
	table.innerHTML = '<a id="allExpert" class="mui-control-item">' +
		'<img src="../../image/qiuzhi/expert_more.png" />' +
		'<p>查看全部</p>' +
		'</a>';
	var scroll = mui('#experts_sw').scroll();
	scroll.scrollTo(0, 0, 100); //100毫秒滚动到顶
}

/**
 * 请求求知数据
 */
//4.获取所有符合条件问题
function requestChannelList(channelInfo) {
	var personalUTID = window.myStorage.getItem(window.storageKeyName.PERSONALINFO).utid; //当前登录账号utid
	//所需参数
	var comData = {
		userId: personalUTID, //用户ID
		askTitle: '', //问题标题,用于查找，可输入部分标题
		channelId: channelInfo.TabId, //话题ID,传入0，获取所有话题数据
		pageIndex: pageIndex, //当前页数
		pageSize: 10 //每页记录数,传入0，获取总记录数
	};
	// 等待的对话框
	//	var wd = events.showWaiting();
	//4.获取所有符合条件问题
	postDataQZPro_getAsksByCondition(comData, wd, function(data) {
		//		wd.close();
		//console.log('获取所有符合条件问题:' + JSON.stringify(data));
		if(data.RspCode == 0) {
			totalPage = data.RspData.totalPage;
			//			var datas = data.RspData.Data;
			getIds(data.RspData.Data);
			//			setChannelList();
		} else {
			//console.log("当前pageIndex:" + pageIndex);
			if(pageIndex > 1) {
				pageIndex -= 1;
			} else {
				pageIndex = oldPageIndex;
			}
			wd.close();
			mui.toast(data.RspTxt);
			endFresh();
		}
	});
}
var getIds = function(datas) {
	var personIds = [];
	for(var i in datas) {
		if(datas[i].AnswerMan) {
			personIds.push(datas[i].AnswerMan);
		}
	}
	requireInfos(datas, events.arraySingleItem(personIds));
}
/**
 *
 * @param {Object} datasource
 * @param {Object} pInfos
 */
var requireInfos = function(datas, pInfos) {
	if(pInfos.length > 0) {
		//发送获取用户资料申请
		var tempData = {
			vvl: pInfos.toString(), //用户id，查询的值,p传个人ID,g传ID串
			vtp: 'g' //查询类型,p(个人)g(id串)
		}
		//21.通过用户ID获取用户资料
		//		var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
		postDataPro_PostUinf(tempData, wd, function(data) {
			//console.log('获取的个人信息:' + JSON.stringify(data));
			if(data.RspCode == 0) {
				rechargeInfos(datas, data.RspData);
			} else {
				setChannelList(datas);
			}
		})
	} else {
		setChannelList(datas);
	}

}
var rechargeInfos = function(datas, infos) {
	for(var i in datas) {
		for(var j in infos) {
			if(datas[i].AnswerMan == infos[j].utid) {
				datas[i].AnswerManName = infos[j].unick;
			}
		}
	}
	setChannelList(datas);
}

/**
 * 放置求知数据
 */
var setChannelList = function(data) {
	//console.log('求知主界面加载的数据信息：' + JSON.stringify(data));
	var list = document.getElementById('list-container');
	if(pageIndex == 1) {
		list.innerHTML = "";
		showNoData(data.length == 0);
	}
	//	var fragemnt = document.createDocumentFragment();
	for(var i in data) {
		var li = document.createElement('li');
		li.className = "mui-table-view-cell";
		li.innerHTML = getInnerHTML(data[i]);
		list.appendChild(li);
		if(li.querySelector('.answer-container')) {
			li.querySelector('.answer-container').answerInfo = data[i];
		}
		if(li.querySelector('.answer-img')) {
			li.querySelector('.answer-img').style.width = "100%";
		}
		if(li.querySelector(".clip-img")) {
			li.querySelector(".clip-img").style.width = li.querySelector(".imgs-container").offsetWidth + "px";
			li.querySelector(".clip-img").style.height = li.querySelector(".imgs-container").offsetWidth * 0.45 + "px";
		}
		li.querySelector('.focus-status').questionInfo = data[i];
	}
	//	list.appendChild(fragemnt);
	jQuery("img.clip-img").lazyload();
	jQuery("div.video-container").lazyload();
	getChannelTime = Date.now();
	if(getExperTime) {
		events.closeWaiting();
	}
	endFresh();
}
var getInnerHTML = function(cell) {
	//	//console.log("回答内容：" + cell.AnswerContent);
	var inner = '<div>' +
		'<div class="channel-info">' +
		'<p class="channel-title"><img src="' + getChannelIcon(cell) + '" class="channel-icon"/>来自话题:' + cell.AskChannel + '</p>' +
		'</div>' +
		'<div class="ask-container">' +
		'<h5 class="single-line ask-title" askId="' + cell.TabId + '">' + cell.AskTitle + '</h5>';
	if(cell.AnswerContent && cell.AnswerContent.length > 0) {
		inner += '<div class="answer-container"><div class="imgs-container">' + getImgs(cell) + '</div>' +
			'<p class="answer-content triple-line" answerInfo="' + cell.AnswerId + '">' + isAnonymity(cell) + ":" + cell.AnswerContent.replace(/<[^>]*>/g, '') + '</p>' +
			'</div></div>' +
			'<div class="extra-info"></div>' +
			'<p class="question-bottom">' + cell.IsLikeNum + '赞·' + cell.CommentNum + '评论·' + setFocusCondition(cell) + '</p></div>'
	} else {
		inner += '<p class="question-bottom">' + setFocusCondition(cell) + '</p></div>'
	}
	return inner;
}
var isAnonymity = function(cell) {
	if(cell.IsAnonym) {
		return "匿名用户"
	}
	return cell.AnswerManName;
}
var setFocusCondition = function(cell) {
	if(events.getUtid()) {
		if(cell.IsFocused) {
			return '<span class="focus-status">已关注<span>';
		}
		return '<span class="focus-status">关注问题<span>';
	} else {
		var arrayData = events.isExistInStorageArray(storageKeyName.FOCUSEQUESTION, cell.TabId)
		if(arrayData[1] >= 0) {
			return '<span class="focus-status">已关注<span>';
		} else {
			return '<span class="focus-status">关注问题<span>';
		}
	}

}
var getImgs = function(cell) {
	var imgInner;
	switch(cell.AnswerEncType) {
		case 1:
			if(cell.AnswerCutImg && cell.AnswerCutImg != "") {
				var imgArray = cell.AnswerEncAddr.split('|');
				var clipImgs = cell.AnswerCutImg.split("|");
				imgInner = '<img class="clip-img" data-original="' + clipImgs[0] + '" src="../../image/utils/default_load_2.gif"/>';
				return imgInner;
			}
			return "";
		case 2:
			if(cell.AnswerCutImg && cell.AnswerCutImg != "") {
				var win_width = document.body.offsetWidth - 30;
				var imgArray = cell.AnswerEncAddr.split('|');
				var clipImgs = cell.AnswerCutImg.split("|");
				imgInner = '<div class="video-container" data-original="' + clipImgs[0] + '" style="background-image:url(../../image/utils/video-loading.gif);width:' + win_width + 'px;height:' + win_width * 0.45 +
					'px;text-align:center;background-position:center;background-size:cover;"><img style="width:55px;height:55px;margin-top:' + (win_width * 0.45 - 55) / 2 + 'px;" class="answer-video" retry="0" src="../../image/utils/playvideo.png"/></div>';
				return imgInner;
			}
			return "";
			break;
		default:
			return '';
	}

}
/**
 *
 * @param {Object} cell
 */
var getChannelIcon = function(cell) {
	var iconSourse = "../../image/qiuzhi/";
	switch(cell.AskChannel) {
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
 * 各种监听事件
 */
var setListener = function() {
	events.addTap('submit-question', function() {
		var self = this;
		//		self.disabled=true;
		//判断是否是游客身份登录
		if(events.judgeLoginMode(self)) {
			return;
		}
		//console.log(JSON.stringify(allChannels))
		events.singleWebviewInPeriod(self, 'qiuzhi-newQ.html', {
			curChannel: channelInfo,
			allChannels: allChannels
		});
	});
	//标题点击事件
	mui('.mui-table-view').on('tap', '.ask-title', function() {
		var item = this;
		item.disabled = true;
		requireQuestionInfo(item.getAttribute('askId'), function(questionInfo) {
			events.singleWebviewInPeriod(item, "qiuzhi-question.html", {
				askID: item.getAttribute('askId'), //问题id
				channelInfo: questionInfo, //当前话题
				allChannels: allChannels //全部话题
			});
		}, function() {
			item.disabled = false;
		});
	})

	//点击回答
	mui('.mui-table-view').on('tap', '.answer-container', function() {
		var postData = this.answerInfo;
		requestAnswerDetail(postData.AnswerId, function() {
			fireToPageReady(1, postData)
		})
	});

	//点击专家列表
	mui('#experts_sc').on('tap', '.mui-control-item', function() {
		this.disabled = true;
		////console.log('点击专家列表 ' + this.id);
		////console.log('当前话题的信息 ' + JSON.stringify(channelInfo));
		if(this.id == 'allExpert') { //查看某个话题的全部专家
			events.singleWebviewInPeriod(this, 'experts_main.html', {
				askID: '0',
				channelInfo: channelInfo, //当前话题
				allChannels: allChannels //所有话题
			})
			//			events.openNewWindowWithData();
		} else { //查看某个话题的某个专家
			////console.log('当前专家的信息 ' + JSON.stringify(JSON.parse(this.getAttribute('data-info'))));
			events.singleWebviewInPeriod(this, 'expert-detail.html', JSON.parse(this.getAttribute('data-info')))
			//			events.openNewWindowWithData();
		}
	});
	//求知关注
	mui(".mui-table-view").on('tap', '.focus-status', function() {

		var item = this;
		item.disabled = true;
		requireQuestionInfo(item.questionInfo.TabId, function(data) {
			//console.log("获取的个人id" + events.getUtid());
			if(events.getUtid()) {
				setQuestionFocus(item);
			} else {
				var isDel = item.innerText == "关注问题" ? 0 : 1;
				events.toggleStorageArray(storageKeyName.FOCUSEQUESTION, parseInt(item.questionInfo.TabId), isDel);
				//console.log("获取存储在本地的数组：" + myStorage.getItem(storageKeyName.FOCUSEQUESTION));
				if(isDel) {
					item.innerText = "关注问题";
				} else {
					item.innerText = "已关注";
				}
				item.disabled = false;
			}
		}, function() {
			item.disabled = false;
		});
	})
}
var requireQuestionInfo = function(askId, callback, noneCallback) {
	var wd1 = events.showWaiting();
	postDataQZPro_getAskById({
		userId: myStorage.getItem(storageKeyName.PERSONALINFO).utid, //用户ID
		askId: askId, //问题ID
		orderType: 1, //回答排序方式,1 按时间排序,2 按质量排序：点赞数+评论数
		pageIndex: 1, //当前页数
		pageSize: 1 //每页记录数,传入0，获取总记录数
	}, wd1, function(data) {
		wd1.close();
		//console.log("获取的问题数据：" + JSON.stringify(data));
		if(data.RspCode == 0) {
			callback(data.RspData);
		} else {
			mui.toast(data.RspTxt)
			if(noneCallback) {
				noneCallback()
			}
		}
	})
}
//关注问题
var setQuestionFocus = function(item) {
	var wd = events.showWaiting();
	var questionInfo = item.questionInfo;
	//console.log('当前问题信息：' + JSON.stringify(questionInfo));
	var selfId = myStorage.getItem(storageKeyName.PERSONALINFO).utid;
	postDataQZPro_setAskFocus({
		userId: selfId, //用户ID
		askId: questionInfo.TabId, //问题ID
		status: questionInfo.IsFocused ? 0 : 1 //关注状态,0 不关注,1 关注
	}, wd, function(data) {
		wd.close();
		if(data.RspCode == 0 && data.RspData.Result) {
			if(questionInfo.IsFocused) { //原来是已关注
				item.questionInfo.IsFocused = 0;
				item.innerText = "关注问题";
			} else { //原来是未关注
				item.questionInfo.IsFocused = 1;
				item.innerText = "已关注";
			}
		} else {
			mui.toast(data.RspTxt);
		}
		item.disabled = false;
	})
}
/**
 *
 * @param {Object} type 0问题 1答案
 */
var fireToPageReady = function(type, options) {
	//console.log("answerIsReady:" + answerIsReady)
	if(type) {
		if(answerIsReady) { //求知回答界面已加载完毕
			events.closeWaiting();
			events.fireToPageWithData('qiuzhi-answerDetail.html', 'answerInfo', options);
		} else {
			setTimeout(function() {
				events.showWaiting();
				fireToPageReady(type, options);
			}, 500);
		}
	}
}
//8.获取某个回答的详情
function requestAnswerDetail(answerId, callback) {
	//所需参数
	var comData = {
		userId: myStorage.getItem(storageKeyName.PERSONALINFO).utid,
		answerId: answerId, //回答ID
		orderType: 1, //评论排序方式,1 时间正序排序,2 时间倒序排序
		pageIndex: 1, //当前页数
		pageSize: 1 //每页记录数,传入0，获取总记录数
	};
	// 等待的对话框
	var wd1 = events.showWaiting();
	//8.获取某个回答的详情
	postDataQZPro_getAnswerById(comData, wd1, function(data) {
		wd1.close();
		//console.log('8.获取某个回答的详情:' + JSON.stringify(data));
		if(data.RspCode == 0 && data.RspData.AnswerId) {
			callback();
		} else {
			mui.toast(data.RspTxt);
			events.closeWaiting();
		}
	});
}