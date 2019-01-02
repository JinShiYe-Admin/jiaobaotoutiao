mui.init();
mui('.mui-scroll-wrapper').scroll({
	bounce: false,
	indicators: true //是否显示滚动条
});
var freshContainer;
var freshFlag = 0; //0 1 刷新2加载更多
var setFresh = function() {
	//上拉下拉注册
	mui(".mui-scroll-wrapper .mui-scroll").pullToRefresh({
		down: {
			callback: function() {
				freshContainer = this;
				oldPageIndex = pageIndex;
				freshFlag = 1;
				pageIndex = 1;
				requestData();
			}
		},
		up: {
			callback: function() {
				freshContainer = this;
				if(pageIndex < totalPage || pageIndex < alertTotalPage) {
					freshFlag = 2;
					pageIndex++;
					requestData();
				} else {
					freshContainer.endPullUpToRefresh();
					mui(".mui-pull-loading")[0].innerHTML = "没有更多了";
				}
			}
		}
	});
}
setFresh();
/**
 * 与我相关界面
 * 逻辑部分
 * @anthor an
 */
//页码，请求第几页数据
var pageIndex = 1;
var oldPageIndex = 1;
//每页条数
var pageCount = 10;
//当前留言的总条数
var totalPage = 0;
//提醒总页码
var alertTotalPage = 0;
//获取个人信息                                                        
var personalUTID;
//判断是加载更多1，还是刷新2
//var flag = 2;
var msgType = 0; //消息类型
var comData = {}; //回复传值
var repliedCell;
var repliedItem; //回复的对象
//页码请求到要显示的数据，array[model_userSpaceAboutMe]
var aboutMeArray = [];
var isShowing = false;
var isDetailReady = true;
//mui.init();
mui.plusReady(function() {
	setFresh();
	events.preload("../show/show-detail.html", 100);
	//重写系统返回方法
	var _back = mui.back;
	mui.back = function() {
		if(plus.webview.currentWebview().opener().id == "homework-commented.html") {
			events.hidePagesExIndex();
			_back();
		} else {
			_back();
		}
	}
	var contentWebview = null;
	//双击标题栏事件
	document.querySelector('header').addEventListener('doubletap', function() {
		mui('#pullrefresh').pullRefresh().scrollTo(0, 0, 100);
	});
	//放置刷新模块

	events.preload("../homework/workdetail-stu.html", 100);
	var pInfo = window.myStorage.getItem(window.storageKeyName.PERSONALINFO);
	personalUTID = pInfo.utid;
	//	initNativeObjects();
	//页码1
	pageIndex = 1;
	//请求并放置数据
	requestData();
	addReplyView();
	addReplyLisetner();
	setListener();
})
/**
 * 结束刷新状态；
 * @param {int} 0 不隐藏上拉加载更多     1隐藏上拉加载更多
 */
function endFresh(type) {
	//console.log("************************************type:" + type);
	if(type) {
		mui(".mui-pull-loading")[0].style.display = "none";
	} else {
		mui(".mui-pull-loading")[0].style.display = "block";
	}
	if(freshContainer) {
		if(freshFlag == 1) {
			freshContainer.endPullDownToRefresh();
			mui(".mui-pull-loading")[0].innerText = "上拉加载更多";
		} else if(freshFlag == 2) {
			freshContainer.endPullUpToRefresh();
		} else {
			mui(".mui-pull-loading")[0].innerText = "上拉加载更多";
		}
		freshFlag = 0;
	}
}
/**
 * 界面放置数据
 * @param {Object} data 请求成功后返回的数据
 */
var setData = function(data) {
	var list = document.getElementById('list-container');
	if(pageIndex == 1) {
		list.innerHTML = "";
	}
	data.forEach(function(cell, i) {
		var li = document.createElement('li');
		li.className = 'mui-table-view-cell';
		li.innerHTML = createInner(cell);
		if(cell.MsgType != 6 && cell.MsgType != 3) {
			li.querySelector('.reply').cell = cell;
		}

		list.appendChild(li);
		if(li.querySelector(".refer-content")) {
			li.querySelector(".refer-content").info = cell;
		}
		if(li.querySelector(".work-notice")) {
			li.querySelector(".work-notice").info = cell;
		}
	})
	endFresh();
}
/**
 * 创建Inner
 * @param {Object} cell
 */
var createInner = function(cell) {
	var cellData = getCellData(cell);
	if(cellData.MsgType != 6) {
		var inner =
			'<div class="cell-title">' +
			'<img class="title-img" headId="' + cellData.headID + '" src="' + ifHaveImg(cellData) + '"/>' +
			zanNoReply(cellData.MsgType) +
			'<div class="title-words">' +
			'<h5 class="title-title">' + cellData.title + '</h5>' +
			'<p class="title-words">' + events.shortForDate(cellData.time) + '</p>' +
			'</div>' +
			'</div>' +
			//最新内容
			'<p class="comment-content break-words">' + ifHave(cellData.content) + '</p>' +
			ifHaveReferContent(cellData, cell) +
			'<div class="extras">' + ifHave(cellData.messages) + '</div>';
	} else {
		var inner = '<a><div class="cell-title">' +
			'<img class="title-img" headId="' + cellData.headID + '" src="' + ifHaveImg(cellData) + '"/>' +
			//		'<span class="reply">回复</span>' +
			'<div class="title-words">' +
			'<h5 class="title-title">' + cellData.title + '</h5>' +
			'<p class="title-words">' + events.shortForDate(cellData.time) + '</p>' +
			'</div>' +
			'</div>' +
			'<p class="comment-content work-notice">' + ifHave(cellData.UserContent) + '</p>' +
			//		'<div class="refer-content">' + '<span>' + cellData.UserOwnerNick + ':</span>' + ifHave(cellData.referContent) + '</div>' +
			//		'<div class="extras">' + ifHave(cellData.messages) + '</div>'
			'</a>';
	}
	return inner;
}
var zanNoReply = function(msgType) {
	if(msgType == 3) {
		return '';
	}
	return '<span class="reply">回复</span>';
}
var ifHaveReferContent = function(cellData, cell) {
	if(cellData.referContent) {
		return '<div class="refer-content">' + addEncImg(cell) + '<div class="refer-words triple-line extra-words break-words">' + '<span>' + events.shortForString(cellData.UserOwnerNick, 6) + ':</span>' + cellData.referContent.replace(/<[^>]*>/g, "") + '</div></div>'
	} else {
		return '';
	}
}
var addEncImg = function(cell) {
	//console.log("获取的数据：" + JSON.stringify(cell));
	if(cell.EncImgAddr && cell.EncImgAddr.length > 0) {
		if(cell.EncType == 1) {
			return '<img class="refer-img display-inlineBlock" src="' + cell.EncImgAddr.split("|")[0] + '"/>';
		}
		if(cell.EncType == 2) {
			return '<div class="refer-img display-inlineBlock" style="background-image:url(' + cell.EncImgAddr + ');background-position:center;background-size:cover;"><img src="../../image/utils/playvideo.png" style="width:50%;margin:25%;"/></div>';
		}
	}
	return '';
}
var addReplyView = function() {
	/**
	 * 回复点击事件
	 */
	mui('.mui-table-view').on('tap', '.reply', function() {
		var replyContainer = document.getElementById('footer');
		//		replyContainer.style.display = 'block';
		//		showSoftInput('#msg-content');
		repliedCell = this.cell;
		repliedItem = this.parentElement.parentElement.querySelector(".extras");
		//console.log('点击的回复包含数据：' + JSON.stringify(repliedCell));
		msgType = this.cell.MsgType;
		//		document.getElementById('msg-content').value = '';
		events.openNewWindowWithData('reply-aboutMe.html', repliedCell);
		//		replyContainer.style.top=(plus.screen.resolutionHeight-replyContainer.offsetHeight);
	})
	/**
	 * 头像点击事件
	 */
	mui('.mui-table-view').on('tap', '.title-img', function() {
		var id = this.getAttribute('headId');
		//console.log(id);
		mui.openWindow({
			url: 'zone_main.html',
			id: 'zone_main.html',
			styles: {
				top: '0px', //设置距离顶部的距离
				bottom: '0px'
			},
			extras: {
				data: id,
				NoReadCnt: 0,
				flag: 0
			}

		});
	})
}
var setListener = function() {
	plus.webview.currentWebview().addEventListener("show", function() {
		isShowing = true;
	})
	plus.webview.currentWebview().addEventListener("hide", function() {
		isShowing = false;
	})
	/**
	 * 进入空间详情
	 */
	mui(".mui-table-view").on("tap", ".refer-content", function() {
		var item = this;
		item.disabled = true;
		//console.log(JSON.stringify(this.info))
		var info = {
			PublisherId: this.info.UserId,
			PublisherName: this.info.UserName,
			TabId: this.info.SpaceId,
			SpaceType:this.info.SpaceType
		}
		//console.log("传递的数值：" + JSON.stringify(this.info));
		getUserSpaceById(info.TabId, function(data) {
			if(data.RspCode == 0) {
				var focusFlag = 0;
				if(info.SpaceType == 1) {
					focusFlag = 0;
					events.singleWebviewInPeriod(item, "../quan/space-detail.html", jQuery.extend(info, {
						focusFlag: focusFlag
					}));
				} else {
					//console.log("与我相关要传递的数据：" + JSON.stringify(info));
					events.readyToPage(isDetailReady, "../show/show-detail.html", "showDetail", info);
					focusFlag = 1;
				}
				item.disabled = false;
			} else {
				mui.toast(data.RspTxt);
				item.disabled = false;
			}
		})

	})
	mui(".mui-table-view").on("tap", ".work-notice", function() {
		var item = this;
		item.disabled = true;
		var curNotice = this.info;
		getHomeworkResult(this.info, function(data) {
			if(data.HomeworkResult.UploadTime) {
				events.singleWebviewInPeriod(item, '../homework/homework-commented.html', jQuery.extend(curNotice, data, {
					HomeworkResultId: data.HomeworkResult.HomeworkResultId,
					workType: 1,
					isNotice: true
				}));
			} else {
				events.fireToPageWithData("../homework/workdetail-stu.html", "workNotice", jQuery.extend(curNotice, {
					isNotice: true
				}));
				item.disabled = false;
			}
		});
	});
}
/**
 * 获取单条空间信息
 * @param {Object} tabId
 * @param {Object} callback
 */
var getUserSpaceById = function(tabId, callback) {
	postDataPro_getUserSpaceByUser({
		userId: parseInt(myStorage.getItem(storageKeyName.PERSONALINFO).utid), //用户ID
		userSpaceId: tabId, //用户动态ID
		pageIndex: 1, //评论当前页数
		pageSize: 1 //评论每页记录数
	}, events.showWaiting(), function(data) {
		events.closeWaiting();
		callback(data);
	})
}
var getHomeworkResult = function(workInfo, callback) {
	var personalId = myStorage.getItem(storageKeyName.PERSONALINFO).utid;
	postDataPro_GetHomeworkResultStu({
		studentId: personalId, //学生Id
		classId: workInfo.ClassId, //班级群Id；
		homeworkId: workInfo.HomeworkId //作业id；
	}, null, function(data) {
		//console.log("获取当前作业结果：" + JSON.stringify(data))
		if(data.RspCode == 0) {
			callback(data.RspData);
			//		}else{
			//			mui.toast(data.RspTxt);
		}
	})
}
/**
 * 评论成功后，加载评论
 */
var addReplyLisetner = function() {
	window.addEventListener('hasReplied', function(e) {
		var replyValue = e.detail;
		var p = document.createElement('p');
		p.className = "extra-words break-words";
		p.innerHTML = '<span>' + myStorage.getItem(storageKeyName.PERSONALINFO).unick + '</span>回复<span>' + events.shortForString(repliedCell.MaxUserName, 6) + ':</span>' + replyValue;
		repliedItem.appendChild(p);
	});
	window.addEventListener('infoChanged', function() {
		pageIndex = 1;
		document.getElementById('list-container').innerHTML = '';
		requestData();
	})
}
var ifHave = function(data) {
	return data ? data : '';
}
var ifHaveImg = function(cellData) {
	if(cellData.headImg) {
		return cellData.headImg;
	} else if(cellData.UserImg) {
		return cellData.UserImg;
	} else {
		return '../../image/utils/default_personalimage.png'
	}

}
/**
 * 根据获取信息 设置
 * @param {Object} cell 单个cell数据
 */
var getCellData = function(cell) {
	var cellData = new Object();
	cellData.MsgType = cell.MsgType;
	cellData.UserName = cell.UserName;
	if(cell.MsgType == 6) {
		cellData.headID = cell.UserId;
	} else {
		cellData.headID = cell.MaxUser;
	}
	cellData.UserImg = cell.UserImg;
	cellData.UserContent = cell.Content;
	cellData.headImg = cell.MaxUserImg;

	cellData.content = cell.MaxContent;
	cellData.referContent = cell.MsgContent;
	cellData.UserOwnerNick = cell.UserOwnerNick;
	switch(cell.MsgType) {
		//其他用户评论
		case 1:
			cellData.title = events.shortForString(cell.MaxUserName, 6) + ' 评论了我';

			break;
			//评论的回复
		case 2:
			cellData.title = events.shortForString(cell.MaxUserName, 6) + " 回复";
			break;
			//其他用户点赞
		case 3:
			cellData.title = events.shortForString(cell.MaxUserName, 6) + " 赞了我";
			break;
			//其他用户留言
		case 4:
			cellData.title = events.shortForString(cell.MaxUserName, 6) + " 给我留言";
			break;
			//留言的回复
		case 5:
			cellData.title = events.shortForString(cell.MaxUserName, 6) + " 给我留言的回复";
			break;
		case 6:
			cellData.title = events.shortForString(cell.UserName, 6) + ' 的作业提醒';
			break;
		default:
			break;
	}
	cellData.time = cell.MaxDate;
	if(cellData.MsgType != 6) {
		var messages = '';
		//		if(cellData.MsgType != 4) {
		if(cell.Content) {
			messages += ('<p class="extra-words break-words"><span>' + events.shortForString(cell.UserName, 6) + ':</span>' + cell.Content + '</p>')
		}
		//		}

		if(cell.MsgArray && cell.MsgArray.length > 0) {
			cell.MsgArray.forEach(function(msg, i, msgArray) {
				if(msg.MsgContent) {
					if(msg.MsgToName) {
						messages += ('<p class="extra-words break-words" ><span>' + events.shortForString(msg.MsgFromName, 6) + '</span>回复<span>' + events.shortForString(msg.MsgToName, 6) + ':</span>' + msg.MsgContent + '</p>');
					} else {
						messages += ('<p class="extra-words break-words" ><span>' + events.shortForString(msg.MsgFromName, 6) + ':</span>' + msg.MsgContent + '</p>');
					}
				}

			});
		}
		cellData.messages = messages;
	}

	return cellData;
}

/**
 * 请求数据
 * @param {Object} callback 请求数据后的回调
 */
function requestData() {
	if(pageIndex > 1) {
		if(pageIndex <= totalPage) {
			requireAboutMe();
		} else if(pageIndex <= alertTotalPage) {
			requireHomeworkAlert();
		}
	} else {
		requireAboutMe();
	}
}
var getRoleInfos = function(tempRspData) {
	var idsArray = [];
	for(var i in tempRspData) {
		idsArray.push(tempRspData[i].UserId);
		if(tempRspData[i].MsgType != 6) {
			idsArray.push(tempRspData[i].MaxUser);
			idsArray.push(tempRspData[i].UserOwnerId);
			for(var j in tempRspData[i].MsgArray) {
				idsArray.push(tempRspData[i].MsgArray[j].MsgFrom);
				idsArray.push(tempRspData[i].MsgArray[j].MsgTo);
			}
		}
	}
	//console.log('身份数组：' + idsArray);
	if(idsArray.length > 0) {
		idsArray = events.arraySingleItem(idsArray);
		//发送获取用户资料申请
		var tempData = {
			vvl: idsArray.toString(), //用户id，查询的值,p传个人ID,g传ID串
			vtp: 'g' //查询类型,p(个人)g(id串)
		}
		//console.log('tempData:' + JSON.stringify(tempData));
		//21.通过用户ID获取用户资料
		postDataPro_PostUinf(tempData, null, function(infos) {
			//console.log('获取个人资料success:RspCode:' + JSON.stringify(infos));
			if(infos.RspCode == 0) {
				var rechargedData = replenishData(tempRspData, infos.RspData);
				//console.log('最终数据：' + JSON.stringify(rechargedData));
				setData(rechargedData);
			} else {
				endFresh();
				mui.toast(data.RspTxt);
			}
		});
	}
};
var setCommentMsgReadByUser = function() {
	var comData = {
		userId: myStorage.getItem(storageKeyName.PERSONALINFO).utid, //用户ID
		spaceTypes: '[4,5,6,7,8]'
	}
	postDataPro_setCommentMsgReadByUser(comData, null, function(data) {
		//console.log('与我相关设置成已读success:RspCode:' + JSON.stringify(data));
	})

}
var replenishData = function(data, infos) {
	var hashInfos = rechargeArraysToHash(infos);
	for(var i in data) {
		if(!hashInfos[data[i].UserId]) {
			continue;
		}
		data[i].UserName = hashInfos[data[i].UserId].unick?hashInfos[data[i].UserId].unick:'新用户';
		data[i].UserImg = hashInfos[data[i].UserId].uimg;
		if(data[i].MsgType != 6) {
			data[i].MaxUserName = hashInfos[data[i].MaxUser].unick?hashInfos[data[i].MaxUser].unick:'新用户';
			data[i].MaxUserImg = hashInfos[data[i].MaxUser].uimg;
			data[i].UserOwnerNick = hashInfos[data[i].UserOwnerId].unick?hashInfos[data[i].UserOwnerId].unick:"新用户";
			//		idsArray.push(tempRspData[i].MaxUser);
			for(var j in data[i].MsgArray) {
				data[i].MsgArray[j].MsgFromName = hashInfos[data[i].MsgArray[j].MsgFrom] ? hashInfos[data[i].MsgArray[j].MsgFrom].unick : '新用户'
				data[i].MsgArray[j].MsgToName = hashInfos[data[i].MsgArray[j].MsgTo] ? hashInfos[data[i].MsgArray[j].MsgTo].unick : '新用户'
			}
		}

	}
	return data;
}
var rechargeArraysToHash = function(infos) {
	var hash = new Object();
	infos.forEach(function(info) {
		hash[info.utid] = info;
	});
	return hash;
}

/**
 * 获取与我相关
 */
var requireAboutMe = function() {
	var comData = {
		userId: myStorage.getItem(storageKeyName.PERSONALINFO).utid, //用户ID
		pageIndex: pageIndex, //当前页数
		pageSize: pageCount //每页记录数
	};
	//56.（用户空间）获取与我相关
	postDataPro_getAboutMe(comData, null, function(data) {

		//console.log('获取的与我相关的数据：' + JSON.stringify(data));
		if(data.RspCode == '0000') {
			setCommentMsgReadByUser();
			totalPage = data.RspData.TotalPage;
			if(pageIndex == 1 || pageIndex <= alertTotalPage) {
				requireHomeworkAlert(data.RspData.Data);
			} else {
				getRoleInfos(data.RspData.Data)
			}
		} else {
			if(pageIndex > 1) {
				pageIndex -= 1;
			} else {
				pageIndex = oldPageIndex;
			}
			endFresh();
			mui.toast(data.RspTxt);
		}
	});
}
/**
 * 获取作业提醒并和与我相关的消息合并
 * @param {Object} aboutMeData 与我相关的数据
 */
var requireHomeworkAlert = function(aboutMeData) {
	//	userId，学生/家长Id；
	//pageIndex，页码，从1开始；
	//pageSize，每页记录数；
	postDataPro_GetHomeworkAlert({
		userId: myStorage.getItem(storageKeyName.PERSONALINFO).utid,
		pageIndex: pageIndex,
		pageSize: 5
	}, null, function(data) {
		//console.log('与我相关界面获取的作业提醒：' + JSON.stringify(data));
		if(data.RspCode == 0) {
			alertTotalPage = data.RspData.TotalPage;
			if(totalPage == 0 && alertTotalPage == 0) {
				if(isShowing) {
					mui.toast('暂无数据！');
				}
				return;
			}
			if(!aboutMeData) {
				aboutMeData = [];
			}
			for(var i in data.RspData.Data) {
				data.RspData.Data[i].MaxDate = new Date(data.RspData.Data[i].MsgDate).Format('yyyy-MM-dd HH:mm:ss')
			}
			//拼接数据
			var allData = aboutMeData.concat(data.RspData.Data);
			//数据排序
			allData.sort(function(a, b) {
				return Date.parse(b.MaxDate.replace(/-/g, '/')) - Date.parse(a.MaxDate.replace(/-/g, '/'));
			})

			//console.log('与我相关界面获取的所有数据:' + JSON.stringify(allData))
			//获取人员信息
			getRoleInfos(allData);
		} else {
			mui.toast(data.RspTxt);
		}
	})
}
//格式化日期
Date.prototype.Format = function(fmt) {
	var o = {
		"y+": this.getFullYear(),
		"M+": this.getMonth() + 1, //月份
		"d+": this.getDate(), //日
		"H+": this.getHours(), //小时
		"m+": this.getMinutes(), //分
		"s+": this.getSeconds(), //秒
		"q+": Math.floor((this.getMonth() + 3) / 3), //季度
		"S+": this.getMilliseconds() //毫秒
	};
	for(var k in o) {
		if(new RegExp("(" + k + ")").test(fmt)) {
			if(k == "y+") {
				fmt = fmt.replace(RegExp.$1, ("" + o[k]).substr(4 - RegExp.$1.length));
			} else if(k == "S+") {
				var lens = RegExp.$1.length;
				lens = lens == 1 ? 3 : lens;
				fmt = fmt.replace(RegExp.$1, ("00" + o[k]).substr(("" + o[k]).length - 1, lens));
			} else {
				fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
			}
		}
	}
	return fmt;
}