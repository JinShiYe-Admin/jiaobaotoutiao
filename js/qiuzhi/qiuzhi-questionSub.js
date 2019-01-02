var freshContainer;
var freshFlag=0;//0默认 1刷新 2加载更多
var setIcon = function(questionInfo) {
	if(questionInfo && questionInfo.AskMan == myStorage.getItem(storageKeyName.PERSONALINFO).utid && (questionInfo.AnswerNum + questionInfo.AnswerOffNum) == 0) {
		document.getElementById("manage-question").style.display = "inline-block";
	} else {
		document.getElementById("manage-question").style.display = "none";
	}
}
mui.init();
var setFresh = function() {
	//上拉下拉注册
	mui(".mui-scroll-wrapper .mui-scroll").pullToRefresh({
		down: {
			callback: function() {
				freshContainer = this;
				freshFlag=1;
				//清除节点
				pulldownRefresh();
			}
		},
		up: {
			callback: function() {
				freshContainer = this;
				answerFlag = 1;
				//判断是否还有更多
				if(answerIndex <= answerPageCount) {
					freshFlag=2;
					requestAskDetail();
				} else {
					freshContainer.endPullUpToRefresh();
					mui(".mui-pull-loading")[0].innerHTML = "没有更多了";
				}

			}
		}
	});
}
setFresh();
var questionInfo;
var _oldBack = mui.back;
mui.back = function() {

}
//问题id
var askID = 0;
//取数据的默认排序
var askOrderType = 2;
//获取的第几页回复
var answerIndex = 1;
//答案回复的总页数
var answerPageCount = 0;
//回复数组,切换排序方式后，清空数组
var answerArray = [];
//刷新0，还是加载更多1
var answerFlag = 0;
//当前问题的详情model
var askModel;
var AskEncAddr = []; //提问图片原图
var AskThumbnail = []; //提问图片缩略图
var mainData; //记录获取的数据
mui.plusReady(function() {
	//---获取数据并传递数据---start---
	//	mui(".mui-pull-loading")[0].style.display = "none";
	var main = plus.webview.currentWebview(); //获取当前窗体对象
	mainData = main.data; //接收A页面传入参数值
	//从搜索界面跳转的数据，TabId是问题id，得转换为话题id
	var temp0 = mainData.channelInfo.AskChannelId;
	if(temp0 > 0) {
		mainData.channelInfo.TabId = temp0;
	}
	questionInfo = mainData.channelInfo;
	//console.log("获取的questionInfo:" + JSON.stringify(questionInfo));
	setIcon(questionInfo);
	//console.log('qiuzhi-question.html:获取的问题数据' + JSON.stringify(mainData));
	//点击右上角邀请专家按钮
	events.addTap('addExpert', function() {
		events.openNewWindowWithData('experts_main.html', mainData);
	});
	events.addTap("manage-question", function() {
		var titles = [{
			title: "删除问题",
			dia: 1
		}]
		var cbArr = [delQuestion];
		events.showActionSheet(titles, cbArr);
	})
	//	setFresh();
	mui.previewImage();
	events.limitPreviewPullDown("refreshContainer", 1);
	var main = plus.webview.currentWebview(); //获取当前窗体对象
	mainData = main.data; //接收A页面传入参数值
	//console.log('qiuzhi-question.html:' + JSON.stringify(mainData));

	events.preload('qiuzhi-addAnswer.html');
	askModel = mainData.channelInfo;
	setCondition();
	askID = mainData.askID;
	//5.获取某个问题的详情
	requestAskDetail();
	//13.获取是否已对某个问题关注
	getAskFocusByUser(askID);

	window.addEventListener('answerAdded', function() {
		//获取的第几页回复
		answerIndex = 1;
		//答案回复的总页数
		answerPageCount = 0;
		//回复数组,切换排序方式后，清空数组
		answerArray = [];
		//刷新0，还是加载更多1
		answerFlag = 0;
		//5.获取某个问题的详情
		requestAskDetail();
	});
	window.addEventListener("manageQuestion", function() {

	})
	window.addEventListener("answerShield", function() {
		//获取的第几页回复
		answerIndex = 1;
		//答案回复的总页数
		answerPageCount = 0;
		//回复数组,切换排序方式后，清空数组
		answerArray = [];
		//刷新0，还是加载更多1
		answerFlag = 0;
		//5.获取某个问题的详情
		requestAskDetail();
	});
	window.addEventListener("answerDeled", function() {
		//获取的第几页回复
		answerIndex = 1;
		//答案回复的总页数
		answerPageCount = 0;
		//回复数组,切换排序方式后，清空数组
		answerArray = [];
		//刷新0，还是加载更多1
		answerFlag = 0;
		//5.获取某个问题的详情
		requestAskDetail();
	})
	mui('#popover').on('tap', '.mui-table-view-cell', function() {
		//console.log('选择排序' + this.id + '|' + this.value + '|' + this.getAttribute('data-value'));

		if(askOrderType != this.value) {
			var ordertype = document.getElementById("ordertype").innerText = this.getAttribute('data-value');
			document.getElementById("ordertype_" + askOrderType + "_icon").style.display = 'none';
			document.getElementById("ordertype_" + this.value + "_icon").style.display = 'inline';
			askOrderType = this.value;
			//获取的第几页回复
			answerIndex = 1;
			//答案回复的总页数
			answerPageCount = 0;
			//回复数组,切换排序方式后，清空数组
			answerArray = [];
			//刷新0，还是加载更多1
			answerFlag = 0;
			//5.获取某个问题的详情
			requestAskDetail();
		}
		mui('#popover').popover('hide');
	});

	//---点击效果---end---

	events.addTap('guanzhu', function() {
		this.disabled = true;
		if(events.getUtid()) {
			//console.log('点击关注');
			if(this.innerText == '关注') {
				setAskFocus(askID, 1, this);
			} else {
				setAskFocus(askID, 0, this);
			}
		} else {
			this.disabled = false;
			var isDel = this.innerText == '关注' ? 0 : 1;
			events.toggleStorageArray(storageKeyName.FOCUSEQUESTION, parseInt(askID), isDel);
			if(isDel) {
				document.getElementById("guanzhu").innerText = '关注';
				document.getElementById("guanzhu").style.background = '#1db8F1';
				document.getElementById("guanzhu").style.border = '#1db8F1';
			} else {
				document.getElementById("guanzhu").innerText = '已关注';
				document.getElementById("guanzhu").style.background = '#e4e4e4';
				document.getElementById("guanzhu").style.border = '#e4e4e4';
			}
		}
	});

	//点击回答
	mui('#answer_bottom').on('tap', '.ellipsis-3', function() {
		var element = this.parentNode;
		var info = JSON.parse(element.getAttribute('data-info'))
		//console.log(JSON.stringify(info));
		requestAnswerDetail(info.AnswerId, function(answerInfo) {
			//跳转页面
			events.fireToPageWithData('qiuzhi-answerDetail.html', 'answerInfo', answerInfo);
		})
	});

	//点击回答者头像
	mui('#answer_bottom').on('tap', '.mui-media-object', function() {
		var element = this.parentNode;
		var info = JSON.parse(element.getAttribute('data-info'));
		//console.log(JSON.stringify(info));
		if(info.IsAnonym != 1) {
			info.UserId = info.utid;
			this.disabled = true;
			events.singleWebviewInPeriod(this, "expert-detail.html", info);
		}
	});

	var showAll = document.getElementById("showAll");
	showAll.addEventListener('tap', function() {
		var str = this.innerText;
		////console.log('showAll' + str);
		if(str == '显示全部') {
			addImages(1);
			if(askModel.AskSFlag && askModel.AskSFlag == 1) { //旧数据
				document.getElementById("question_content").style.height = 'auto';
			} else {
				document.getElementById("question_content").style.webkitLineClamp = 'inherit';
			}
			this.style.display = 'none';
			showAll.innerText = '收起';
		} else if(str == '收起') {
			showAll.innerText = '显示全部';
			addImages(0);
			if(askModel.AskSFlag && askModel.AskSFlag == 1) { //旧数据
				document.getElementById("question_content").style.height = '60px';
			} else {
				document.getElementById("question_content").style.webkitLineClamp = '3';
			}
		}
	});
});
/**
 * 结束刷新状态；
 */
function endFresh() {
	if(freshContainer) {
		if(freshFlag==1){
			freshContainer.endPullDownToRefresh();
			mui(".mui-pull-loading")[0].innerText = "上拉加载更多";
		}else if(freshFlag==2){
			freshContainer.endPullUpToRefresh();
		}else{
			mui(".mui-pull-loading")[0].innerText = "上拉加载更多";
		}
	}
	freshFlag=0;
}
/**
 * 根据状况低端按钮显示
 */
var setCondition = function() {
	var manageContainer = document.getElementById("manage-container");
	if(askModel.AnswerId && askModel.IsAnswerOff) { //已回答且已隐藏
		document.querySelector(".mui-content.mui-fullscreen").style.bottom="50px";
		manageContainer.style.display = "block";
		manageContainer.innerHTML = '<div class="tab_div" style="border: 0;">' +
			'<font  id=""><p style="text-align:center;font-size:16px;color:#323232">回答已屏蔽<span id="cancel-shield" style="color:#13b7f6" class="mui-pull-right">撤销</span></p></font>' +
			'</div>';
	} else if(askModel.IsAnswered) { //已回答
		document.querySelector(".mui-content.mui-fullscreen").style.bottom="0";
		manageContainer.style.display = "none";
		manageContainer.innerHTML = "";
	} else {
		document.querySelector(".mui-content.mui-fullscreen").style.bottom="50px";
		manageContainer.style.display = "block";
		manageContainer.innerHTML = '<div id="tab_div">' +
			'<font id="tab_font"><span class="mui-icon iconfont icon-xie mui-pull-left"></span>请输入问题的答案</font>' +
			'</div>';
	}
	//---点击效果---start---
	var tab_div = document.getElementById("tab_div");
	if(tab_div) {
		var tab_font = document.getElementById("tab_font");
		tab_div.addEventListener('tap', function() {
			//判断是否是游客身份登录
			if(events.judgeLoginMode(this)) {
				return;
			}
			//console.log('tab_div-tap');
			if(askModel.IsAnswered == 1) {
				mui.toast('已经回答过此问题');
				this.disabled = false;
				jQuery(this).css("pointerEvents", "all");
				return;
			}
			tab_div.style.background = '#DDDDDD';
			tab_font.style.color = 'white';
			setTimeout(function() {
				tab_div.style.background = 'white';
				tab_font.style.color = 'gray';
			}, 80);
			//点击跳转到回答界面
			jQuery(this).css("pointerEvents", "all");
			this.disabled = false;
			events.fireToPage('qiuzhi-addAnswer.html', 'qiuzhi-addAnswer', function() {
				return askModel;
			});

		});
		tab_div.addEventListener('hold', function() {
			////console.log('tab_div-hold');
			tab_div.style.background = '#DDDDDD';
			tab_font.style.color = 'white';
		});
		tab_div.addEventListener('release', function() {
			////console.log('tab_div-release');
			tab_div.style.background = 'white';
			tab_font.style.color = 'gray';
		});
	}
	events.addTap("cancel-shield", function() {
		//console.log("取消屏蔽点击事件！");
		shieldAnswer();
	})

}
var delQuestion = function() {
	//	mui.toast("功能暂未开放，请稍候！");
	var wd1 = events.showWaiting();
	//37.删除某个用户的某条提问
	postDataQZPro_delAskById({
		askId: askID //提问ID
	}, wd1, function(data) {
		wd1.close();
		//console.log('37.删除某个用户的某条提问:' + JSON.stringify(data));
		if(data.RspCode == 0 && data.RspData.Result) {
			mui.toast("删除问题成功！");
			mui.back();
		} else {
			mui.toast(data.RspTxt);
		}
	});
}
var shieldAnswer = function() {
	//	mui.toast("功能暂未开放，请稍候！");
	var wd1 = events.showWaiting();
	postDataQZPro_setAnswerOffById({
		answerId: askModel.AnswerId,
		status: 0
	}, wd1, function(data) {
		wd1.close();
		//console.log("屏蔽后返回的数据:" + JSON.stringify(data));
		if(data.RspCode == 0 && data.RspData.Result) {
			mui.toast("已取消屏蔽！");
			//			document.getElementById("manage-container").style.display = "none";
			//获取的第几页回复
			answerIndex = 1;
			//答案回复的总页数
			answerPageCount = 0;
			//回复数组,切换排序方式后，清空数组
			answerArray = [];
			//刷新0，还是加载更多1
			answerFlag = 0;
			//5.获取某个问题的详情
			requestAskDetail();
		} else {
			mui.toast("取消屏蔽失败！");
		}
	})
}
//13.获取是否已对某个问题关注
function getAskFocusByUser(askId) {
	if(events.getUtid()) {
		var personalUTID = window.myStorage.getItem(window.storageKeyName.PERSONALINFO).utid; //当前登录账号utid
		//需要加密的数据
		var comData = {
			userId: personalUTID, //用户ID
			askId: askId //问题ID
		};
		// 等待的对话框
		var wd = events.showWaiting();
		//13.获取是否已对某个问题关注
		postDataQZPro_getAskFocusByUser(comData, wd, function(data) {
			wd.close();
			//console.log('13.获取是否已对某个问题关注:' + data.RspCode + ',RspData:' + JSON.stringify(data.RspData) + ',RspTxt:' + data.RspTxt);
			if(data.RspCode == 0) {
				//刷新界面
				if(data.RspData.Result == 0) {
					document.getElementById("guanzhu").innerText = '关注';
					document.getElementById("guanzhu").style.background = '#1db8F1';
					document.getElementById("guanzhu").style.border = '#1db8F1';
				} else {
					document.getElementById("guanzhu").innerText = '已关注';
					document.getElementById("guanzhu").style.background = '#b7b7b7';
					document.getElementById("guanzhu").style.border = '#b7b7b7';
				}
			} else {
				mui.toast(data.RspTxt);
			}
		});
	} else {
		var arrayData = events.isExistInStorageArray(storageKeyName.FOCUSEQUESTION, parseInt(askId));
		if(arrayData[1] >= 0) {
			document.getElementById("guanzhu").innerText = '已关注';
			document.getElementById("guanzhu").style.background = '#b7b7b7';
			document.getElementById("guanzhu").style.border = '#b7b7b7';
		} else {
			document.getElementById("guanzhu").innerText = '关注';
			document.getElementById("guanzhu").style.background = '#1db8F1';
			document.getElementById("guanzhu").style.border = '#1db8F1';
		}
	}
};

//14.设置某个问题的关注，0 不关注,1 关注
function setAskFocus(askId, status, item) {
	document.getElementById("guanzhu").disabled = true;
	var personalUTID = window.myStorage.getItem(window.storageKeyName.PERSONALINFO).utid; //当前登录账号utid
	//需要加密的数据
	var comData = {
		userId: personalUTID, //用户ID
		askId: askId, //问题ID
		status: status //关注状态,0 不关注,1 关注
	};
	// 等待的对话框
	var wd1 = events.showWaiting();
	//14.设置某个问题的关注
	postDataQZPro_setAskFocus(comData, wd1, function(data) {
		wd1.close();
		item.disabled = false;
		document.getElementById("guanzhu").disabled = false;
		//console.log('14.设置某个问题的关注:' + data.RspCode + ',RspData:' + JSON.stringify(data.RspData) + ',RspTxt:' + data.RspTxt);
		if(data.RspCode == 0) {
			//刷新界面显示
			if(document.getElementById("guanzhu").innerText == '关注') {
				document.getElementById("guanzhu").innerText = '已关注';
				document.getElementById("guanzhu").style.background = '#e4e4e4';
				document.getElementById("guanzhu").style.border = '#e4e4e4';
			} else {
				document.getElementById("guanzhu").innerText = '关注';
				document.getElementById("guanzhu").style.background = '#1db8F1';
				document.getElementById("guanzhu").style.border = '#1db8F1';
			}
		} else {
			mui.toast(data.RspTxt);
		}
	});
};

/**
 * 下拉刷新具体业务实现
 */
function pulldownRefresh() {
	setTimeout(function() {
		//获取的第几页回复
		answerIndex = 1;
		//答案回复的总页数
		answerPageCount = 0;
		//回复数组,切换排序方式后，清空数组
		answerArray = [];
		//刷新0，还是加载更多1
		answerFlag = 0;
		//5.获取某个问题的详情
		requestAskDetail();
		//重置显示全部
		document.getElementById("showAll").innerText = '显示全部';
	}, 1500);
}

/**
 * 上拉加载具体业务实现
 */
//function pullupRefresh() {
//	setTimeout(function() {
//		answerFlag = 1;
//		//判断是否还有更多
//		if(answerIndex <= answerPageCount) {
//			//5.获取某个问题的详情
//			requestAskDetail();
//		} else {
//			mui('#refreshContainer').pullRefresh().endPullupToRefresh(true); //参数为true代表没有更多数据了。
//		}
//	}, 1500);
//}

/**
 * 请求问题
 */
//5.获取某个问题的详情
function requestAskDetail() {
	var personalUTID = window.myStorage.getItem(window.storageKeyName.PERSONALINFO).utid; //当前登录账号utid
	//所需参数
	var comData = {
		userId: personalUTID, //用户ID
		askId: askID, //问题ID
		orderType: askOrderType, //回答排序方式,1 按时间排序,2 按质量排序：点赞数+评论数
		pageIndex: answerIndex, //当前页数
		pageSize: '10' //每页记录数,传入0，获取总记录数
	};
	// 等待的对话框
	var wd = events.showWaiting();
	//5.获取某个问题的详情
	postDataQZPro_getAskById(comData, wd, function(data) {

		//console.log('5.获取某个问题的详情:' + JSON.stringify(data));
		if(data.RspCode == 0) {
			if(data.RspData.AskSFlag == 0 && data.RspData.AskEncType == 5) {
				//新数据的图文混排，当做旧数据处理
				data.RspData.AskSFlag = 1;
			}
			askModel = data.RspData;
			noticeQuestionInfo(askModel);
			setCondition();
			answerPageCount = data.RspData.TotalPage; //回答总页数
			answerIndex++;
			//回调中的临时数据
			var tempRspData = data.RspData.Data;
			//获取当前回调的个人信息，主要是头像、昵称
			var tempArray = [];
			//先遍历回调数组，获取
			for(var item in tempRspData) {
				//当前循环的model
				var tempModel0 = tempRspData[item];
				//将当前model中id塞到数组
				tempArray.push(tempModel0.AnswerMan);
			}
			//给数组去重
			tempArray = arrayDupRemoval(tempArray);
			//			if(tempArray.length==0){
			//				events.closeWaiting();
			//				return;
			//			}
			//发送获取用户资料申请
			var tempData = {
				vvl: tempArray.join(), //用户id，查询的值,p传个人ID,g传ID串
				vtp: 'g' //查询类型,p(个人)g(id串)
			}
			//console.log('tempData:' + JSON.stringify(tempData));
			//21.通过用户ID获取用户资料
			postDataPro_PostUinf(tempData, wd, function(data1) {
				//				wd.close();
				//console.log('获取个人资料success:RspCode:' + data1.RspCode + ',RspData:' + JSON.stringify(data1.RspData) + ',RspTxt:' + data1.RspTxt);
				if(data1.RspCode == 0) {
					//循环回调数组
					for(var item in tempRspData) {
						//当前循环的model
						var tempModel0 = tempRspData[item];
						//循环当前的个人信息返回值数组
						for(var i in data1.RspData) {
							//当前model
							var tempModel = data1.RspData[i];
							//更新头像
							tempModel.uimg = updateHeadImg(tempModel.uimg, 2);
							//对比id是否一致
							if(tempModel0.AnswerMan == tempModel.utid) {
								//判断是否为匿名
								if(tempModel0.IsAnonym == 1) {
									tempModel.uimg = updateHeadImg('', 2);
									tempModel.unick = '匿名用户';
								}
								//合并
								tempModel0 = $.extend(tempModel0, tempModel);
							}
						}
					}
				}
				//console.log('循环遍历后的值：' + JSON.stringify(tempRspData));
				//刷新0，还是加载更多1
				if(answerFlag == 0) {
					//					mui('#refreshContainer').pullRefresh().endPulldownToRefresh(); //下拉刷新结束
					answerArray = tempRspData;
					//清理原界面
					cleanQuestion();
					cleanAnswer();
					//生成新界面
					addQuestion(data.RspData);
					if(tempRspData.length == 0) { //没有人回答
						answerNone();
						mui(".mui-pull-loading")[0].style.display = "none";
					} else {
						mui(".mui-pull-loading")[0].style.display = "block";
					}
				} else {
					answerArray = answerArray.concat(tempRspData);
				}
				//刷新界面
				addAnswer(tempRspData);
				wd.close();
			});
		} else {
			wd.close();
			noticeQuestionInfo();
			mui.toast(data.RspTxt);
			endFresh();
			if(data.RspCode == 1016) {
				mui.back();
			}
		}
	});
}
var noticeQuestionInfo = function(questionInfo) {
	setIcon(questionInfo);
	events.closeWaiting();
	mui.back = _oldBack;
}
/**
 *清空问题的所有信息，和回答数
 */
function cleanQuestion() {
	document.getElementById("question_title").innerHTML = '';
	document.getElementById("question_images").innerHTML = '';
	document.getElementById("question_content").innerHTML = '';
	document.getElementById("liulanshu").innerHTML = '';
	document.getElementById("guanzhushu").innerHTML = '';
	//回答数
	document.getElementById("answershu").innerText = '';
}

/**
 * 放置问题，和回答数
 */
function addQuestion(data) {
	//console.log('addQuestion:' + JSON.stringify(data));
	questionTitle(data.AskTitle);

	if(data.AskSFlag != 1 && data.AskEncAddr != '') {
		AskEncAddr = data.AskEncAddr.split('|'); //图片原图
		AskThumbnail = data.AskThumbnail.split('|'); //图片缩略图
		addImages(0);
	}
	if(data.AskSFlag && data.AskSFlag == 1) { //问题来源,1 为外部导入数据
		//console.log('AskSFlag 1 外部导入数据');
		questionContent(data.AskNote, 1);
	} else {
		//console.log('AskSFlag 0 新增数据');
		questionContent(data.AskNote, 0);
	}
	getQuestionInfo(data.ReadNum, data.FocusNum);
	answerShu(data.AnswerNum);
}

/**
 * 放置问题的图片
 * @param {Object} num 0三张，1全部
 * @param {Object} data
 */
function addImages(num) {
	if(AskEncAddr.length != 0) {
		questionImages(num, AskEncAddr, AskThumbnail);
		if(AskEncAddr.length > 3) {
			//内容高度大于三行
			var show = document.getElementById("showAll");
			if(show.style.display != 'inline') {
				document.getElementById("showAll").style.display = 'inline';
			}
		}
	}
}

/**
 * 放置问题标题
 * @param {Object} title 问题标题
 */
function questionTitle(title) {
	document.getElementById("question_title").innerHTML = title;
}

/**
 * 放置问题图片
 * @param {Object} type 0显示三张，1显示全部
 * @param {Object} AskEncAddr 问题图片数组
 * @param {Object} AskThumbnail 缩略图数组
 */
function questionImages(type, AskEncAddr, AskThumbnail) {
	var footer = document.getElementById("question_images");
	var imageArray = AskEncAddr;
	var thumbArray = AskThumbnail;
	var num = imageArray.length;

	var mediaStr = '';
	var width = (footer.offsetWidth) * 0.32;
	var height = width * 3 / 4;
	var marginBottom = (footer.offsetWidth) * 0.02;
	var marginRight;

	var html_0 = '<div class="record-imge">';
	var html_1 = '';
	var html_2 = ''; //是否显示三张之后的图片
	for(var i = 0; i < imageArray.length; i++) {
		if(i == 2 || i == 5 || i == 8) {
			marginRight = 0;
		} else {
			marginRight = marginBottom;
		}
		if(type == 0 && i > 2) {
			html_2 = 'display:none;';
		}
		html_1 = html_1 + '<div class="record-picture" style="width: ' + width + 'px; height: ' + height + 'px; margin-right: ' + marginRight + 'px; margin-bottom: ' + marginBottom + 'px;' + html_2 + '">\
								<img src="' + thumbArray[i] + '" data-preview-src="' + imageArray[i] + '" data-preview-group="questionImages" style="width:100%;visibility:hidden;" onload="if(this.offsetHeight<this.offsetWidth){this.style.height=\'' + height + 'px\';this.style.width=\'initial\';this.style.marginLeft=-(this.offsetWidth-' + width + ')/2+\'px\';}else{this.style.marginTop=-(this.offsetHeight-' + height + ')/2+\'px\';}this.style.visibility=\'visible\';" onerror="this.style.visibility=\'visible\';">\
							</div>';
	}
	mediaStr = html_0 + html_1 + '</div>';
	footer.innerHTML = mediaStr;
	if(num == 0) { //0张
		footer.style.height = '0px';
	} else if((num > 0 && num <= 3) || type == 0) { //1-3张,一行
		footer.style.height = height + marginBottom + 'px';
	} else if(num > 3 && num <= 6) { //4-6张，二行
		footer.style.height = height * 2 + marginBottom * 2 + 'px';
	} else if(num > 6 && num <= 9) { //7-9张，三行
		footer.style.height = height * 3 + marginBottom * 3 + 'px';
	} else {
		//console.log('### ERROR ### 图片数量超过 9 张，放置图片的区域未设置相应的高度');
	}

}

/**
 * 放置问题内容
 * @param {Object} content 问题内容
 */
function questionContent(content, flag) {
	var height_0;
	var height_1;
	if(flag == 1) { //求知旧数据
		document.getElementById("question_content").style.lineHeight = '20px';
		document.getElementById("question_content").innerHTML = content;
		height_0 = document.getElementById("question_content").offsetHeight;
		if(height_0 > 60) {
			document.getElementById("question_content").style.lineHeight = '20px';
			document.getElementById("question_content").style.height = '60px';
			document.getElementById("showAll").style.display = 'inline';
		}
	} else {
		document.getElementById("question_content").innerHTML = content.replace(/ /g, "&nbsp;").replace(/\n/g, "<br/>");
		document.getElementById("question_content").style.webkitLineClamp = '4';
		height_0 = document.getElementById("question_content").offsetHeight;
		document.getElementById("question_content").style.webkitLineClamp = '3';
		height_1 = document.getElementById("question_content").offsetHeight;
		////console.log(height_0 + '|' + height_1);
		if(height_0 > height_1) {
			//内容高度大于三行
			document.getElementById("showAll").style.display = 'inline';
		}
	}
}

/**
 * 放置问题浏览数，关注数
 * @param {Object} liulanshu 问题浏览数
 * @param {Object} guanzhushu 问题关注数
 */
function getQuestionInfo(liulanshu, guanzhushu) {
	document.getElementById("liulanshu").innerHTML = '&nbsp;' + liulanshu;
	document.getElementById("guanzhushu").innerHTML = '&nbsp;' + guanzhushu;
}

/**
 * 放置回答数
 * @param {Object} answershu 回答数
 */
function answerShu(answershu) {
	document.getElementById("answershu").innerText = answershu + '个回答';
}

/**
 * 清空回答列表,重置排序
 */
function cleanAnswer() {
	//回答列表
	document.getElementById("answer_bottom").innerHTML = '';
	document.querySelector('body').style.backgroundColor = '#efeff4';
	document.querySelector('.mui-content').style.backgroundColor = '#efeff4';
	//	//排序类型
	//	document.getElementById("ordertype").innerText = '按质量排序';
	//	document.getElementById("ordertype_2_icon").style.display = 'inline';
	//	document.getElementById("ordertype_1_icon").style.display = 'none';
}

/**
 * 放置问题列表
 * @param {Object} data 回答数组
 */
function addAnswer(data) {
	var fragment = document.createDocumentFragment();
	for(var i = 0; i < data.length; i++) {
		answerList(data[i], fragment);
	}
	document.getElementById("answer_bottom").appendChild(fragment);
	endFresh();
}

/**
 * 放置回答列表的一项
 * @param {Object} answershu 一个回答的数据
 */
function answerList(data, fragment) {

	var li = document.createElement('li');
	li.className = 'mui-table-view-cell mui-media';
	li.id = 'answer_' + data.AnswerId;
	li.setAttribute('data-info', JSON.stringify(data));
	li.innerHTML = '' +
		'<img class="mui-media-object mui-pull-left" src="' + updateHeadImg(data.uimg, 2) + '">' +
		'<div class="mui-ellipsis">' + data.unick + '</div>' +
		'<div id="answer_content_' + data.AnswerId + '" class="ellipsis-3"></div>' +
		'<div class="answer-info">' + data.IsLikeNum + '赞同·' + data.CommentNum + '评论·' + modifyTimeFormat(data.AnswerTime) + '</div>';
	fragment.appendChild(li);
	if(data.AnswerSFlag != 1) { //不是旧数据
		fragment.querySelector("#answer_content_" + data.AnswerId).innerHTML = data.AnswerContent.replace(/\n/g, "<br/>");
	} else {
		var content_0 = events.htmlGetText(data.AnswerContent);
		var content_1 = content_0.replace(/\s+/g, ""); //替换所有空格
		fragment.querySelector("#answer_content_" + data.AnswerId).innerText = content_1;
	}

}

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
			callback(data.RspData);
		} else {
			mui.toast(data.RspTxt);
			events.closeWaiting();
		}
	});
}

/**
 * 没有人回答该问题
 */
function answerNone() {
	//console.log('answerNone');
	document.querySelector('body').style.backgroundColor = 'white';
	document.querySelector('.mui-content').style.backgroundColor = 'white';
	document.getElementById("answer_bottom").innerHTML = '\
		<div id="answer_none" class="answer-none">\
			<img src="../../image/qiuzhi/qiuzhi_noanswer.png" />\
			<div>暂无人回答此问题，快来回答吧~~~~</div>\
		</div>';
}