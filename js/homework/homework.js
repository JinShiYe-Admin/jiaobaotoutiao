/**
 * @anthor an
 * 教师作业模块
 */
mui.init();
var freshContainer;
var freshFlag = 0;
mui('.mui-scroll-wrapper.mui-fullscreen ').scroll({
	bounce: false,
	indicators: true //是否显示滚动条
});
var setFresh = function() {
	//上拉下拉注册
	mui(".mui-scroll-wrapper.mui-fullscreen .mui-scroll").pullToRefresh({
		down: {
			callback: function() {
				freshContainer = this;
				freshFlag = 1;
				selectGContainer.classInfo.pageIndex = 1;
				events.clearChild(list);
				requireHomeWork(selectGContainer.classInfo, setData);
			}
		},
		up: {
			callback: function() {
				freshContainer = this;
				freshFlag = 2;
				if(selectGContainer.classInfo.pageIndex < totalPageCount) {
					selectGContainer.classInfo.pageIndex++;
					requireHomeWork(selectGContainer.classInfo, setData);
				} else {
					freshContainer.endPullUpToRefresh();
					mui(".mui-pull-loading")[0].innerHTML = "没有更多了";
				}
			}
		}
	});
}
setFresh();
var personalUTID; //个人UTID
var role = 2; //角色 2老師 30 學生/家長
var teacherClasses = []; //老师身份关联班级
var studentClasses = []; //学生身份关联班级
var teacherHash; //老师作业键值对
var studentHash; //学生作业键值对
var selectGId; //选取班级数据
var selectGContainer; //选中的班级控件；
var list; //数据列表
var totalPageCount;
var clickItem; //点击的子控件
var publish;
var publishIsReady = false;
var stuWorkReady = false;
//document.getElementById('tabs-class').style.display = "none";
mui.init({});
//mui的plusready监听
mui.plusReady(function() {
	publish = document.getElementById('iconPublish');
	events.fireToPageNone('../cloud_home.html', 'homeworkReady');
	//预加载发布作业
	events.preload('homework-publish.html', 300);
	//老师临时作业界面
	//	events.preload('workdetailTea-temporary.html', 300);
	var stuWorkNavBarStyle = {
		titleText: "作业详情"
	}
	//学生作业详情页面
	events.preload('workdetail-stu.html', 100);
	//做作业界面
	events.preload('doHomework-stu.html', 400);
	//列表
	list = document.getElementById('list-container');
	/**监听父页面的图标事件*/
	window.addEventListener('togglePop', function(e) {
		mui("#popover").popover('toggle');
	});
	//预加载发布作业界面
	//	events.preload('publish-answer.html');
	mui('.mui-scrollbar-horizontal').scroll();
	//标题
	var title = document.getElementById('workPage-title');
	//角色
	var roles = document.getElementById('workPage-roles');
	//更多
	var btn_more = document.getElementById('more');
	//隐藏更多按钮
	btn_more.style.display = 'none';
	var data = plus.webview.currentWebview().data;
	//学生角色所在班级数组
	studentClasses = data.studentClasses;
	//老师角色所在班级数组
	teacherClasses = data.teacherClasses;
	//console.log("传过来的值：" + JSON.stringify(data));
	//设置界面
	setChoices(title, roles, btn_more);
	//角色选择的监听
	roles.addEventListener("toggle", function(event) {
		events.showWaiting();
		if(event.detail.isActive) {
			role = 30; //学生or家长
			//			btn_more.style.display='block';
		} else {
			role = 2; //老师
			//			btn_more.style.display='none';
		}
		//角色转换
		roleChanged();
	})
	//重写返回按钮
	var _back = mui.back;
	mui.back = function() {
		console.log("作业界面的打开界面id:" + plus.webview.currentWebview().opener().id)
//		if(plus.webview.currentWebview().opener().id == "homework-commented.html") {
			if(teacherClasses.length > 0 && studentClasses.length > 0) {
				if(roles.classList.contains("mui-active")) {
					mui('#workPage-roles').switch().toggle();
				}
//			}
			events.hidePagesExIndex();
		}
		_back();
	}
	//做作业界面传过来的事件，通知界面已完成作业，更改作业状态
	window.addEventListener('homeworkDone', function() {
		clickItem.homeworkInfo.IsSubmitted = true;
		clickItem.className = 'mui-table-view-cell stuHomework ' + getBackGround(clickItem.homeworkInfo);
		clickItem.innerHTML = createStuHomeworkInner(clickItem.homeworkInfo);
	})
	window.addEventListener("publishIsReady", function() {
		publishIsReady = true;
	})
	window.addEventListener("stuWorkReady", function() {
		stuWorkReady = true;
	})
	//老师作业发布完成，刷新界面
	window.addEventListener('homeworkPublished', function() {
		teacherHash = newHashMap();
		selectGContainer.classInfo.pageIndex = 1;
		events.clearChild(list);
		requireHomeWork(selectGContainer.classInfo, setData);
	})
	//设置监听
	setListener();
	//上拉加载
	//	pullUpRefresh();
})
/**
 * 
 * @param {Object} type
 */
function showNoData(type) {
	if(type) {
		document.querySelector("#list-container").style.display = "none";
		document.querySelector(".noDataDisplay").style.display = "block";
		mui(".mui-pull-loading")[0].style.display = "none";
		document.body.style.backgroundColor="white";
	} else {
		document.querySelector("#list-container").style.display = "block";
		document.querySelector(".noDataDisplay").style.display = "none";
		mui(".mui-pull-loading")[0].style.display = "block";
		document.body.style.backgroundColor="#efeff4";
	}
}
/**
 * 结束刷新状态；
 * @param {int} 0 不隐藏上拉加载更多     1隐藏上拉加载更多
 */
function endFresh() {
	//console.log("************************************type:" + freshFlag);
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
 * 更改角色
 */
var roleChanged = function() {
	mui('.mui-scroll-wrapper.mui-slider-indicator').scroll().scrollTo(0, 0, 100);
	//console.log('作业子页面获取的角色变换值roleChanged：' + role);
	setClasses(role);
	list.innerHTML = "";
	if(role == 2) { //老师角色
		mui("#popover").popover('hide');
		publish.style.display = 'block';
		selectGId = teacherClasses[0].gid;
		//		requireHomeWork(teacherClasses[0], setData);
		//如果数据已存在
		if(teacherHash.get(selectGId)) {
			setPublishedData(teacherHash.get(selectGId));
			//如果数据不存在
		} else {
			requireHomeWork(teacherClasses[0], setData);
		}
	} else { //学生or家长角色
		publish.style.display = 'none';
		selectGId = studentClasses[0].gid;
		//		requireHomeWork(studentClasses[0], setData);
		if(studentHash.get(selectGId)) { //获取数据
			setHomeworkData(studentHash.get(selectGId));
		} else {
			requireHomeWork(studentClasses[0], setData);
		}
	}
}
/**
 * 获取作业详情
 */
var getWorkDetail = function() {
	mui('.mui-scroll-wrapper.mui-slider-indicator').scroll().scrollTo(0, 0, 100);
	//个人UTID
	personalUTID = myStorage.getItem(storageKeyName.PERSONALINFO).utid;
	//获取个人身份角色
	//		role = e.detail.data.role;
	//console.log("角色：" + role);
	//老师
	if(role == 2) {
		mui("#popover").popover('hide');
		//显示发布作业按钮
		publish.style.display = 'block';
	} else {
		//不显示发布作业按钮
		publish.style.display = 'none';
	}
	//老师角色的班级数据
	//		teacherClasses = e.detail.data.teacherClasses;
	//		//学生家长的班级数据
	//		studentClasses = e.detail.data.studentClasses;
	//console.log('作业主界面获取的teacherClasses:' + JSON.stringify(teacherClasses))
	//console.log('作业主界面获取的studentClasses:' + JSON.stringify(studentClasses))
	//老师角色的作业数据
	teacherHash = newHashMap();
	//学生、家长的作业数据
	studentHash = newHashMap();
	//根据角色不同，加载班级列表
	setClasses(role);
	//老师角色，默认获取的数据
	events.clearChild(list);
	//老师角色
	if(role == 2) {
		selectGId = teacherClasses[0].gid;
		requireHomeWork(teacherClasses[0], setData);
		//家长、学生角色默认获取的数据
	} else {
		selectGId = studentClasses[0].gid;
		requireHomeWork(studentClasses[0], setData);
	}
}

/**
 * 设置监听
 */
var setListener = function() {
	//班级被点击事件
	mui('.tabs-classes').on('tap', '.mui-control-item', function() {
		selectGContainer = this;
		selectGId = this.classInfo.gid;
		events.clearChild(list);
		//console.log('被点击的班级数据：' + JSON.stringify(this.classInfo));
		totalPageCount = this.classInfo.totalPageCount;
		//老师角色
		if(role == 2) {
			//如果数据已存在
			if(teacherHash.get(selectGId)) {
				setPublishedData(teacherHash.get(selectGId));
				//如果数据不存在
			} else {
				this.classInfo.pageIndex = 1;
				requireHomeWork(this.classInfo, setData);
			}
			//学生家长角色
		} else {
			//console.log("获取的作业：" + JSON.stringify(studentHash.get(selectGId)));
			if(studentHash.get(selectGId) && studentHash.get(selectGId).length > 0) {

				setHomeworkData(studentHash.get(selectGId));
			} else {
				this.classInfo.pageIndex = 1;
				requireHomeWork(this.classInfo, setData);
			}
		}
	})
	//获取发布作业按钮
	var publish = document.getElementById('iconPublish');
	//常规作业点击事件
	mui('.mui-table-view').on('tap', '.publishedHomework', function() {
		var self = this;
		self.disabled = true;
		events.openNewWindowWithData('workdetail-tea.html', jQuery.extend({}, this.homeworkInfo, selectGContainer.classInfo));
		setTimeout(function() {
			self.disabled = false;
		}, 1500);
	})
	//学生作业在线提交点击事件
	mui('.mui-table-view').on('tap', '.submitOnline', function() {
		var item = this;
		clickItem = item;
		//console.log("我点的是这个")
		events.showWaiting();
		openStuWork(item);
	});
	//学生作业不需要提交点击事件
	mui('.mui-table-view').on('tap', '.noSubmit', function() {
		clickItem = this;
		events.showWaiting();
		openStuWork(this);
	})
	//学生作业已提交点击事件
	mui('.mui-table-view').on('tap', '.isSubmitted', function() {
		clickItem = this;
		this.disabled = true;
		events.singleWebviewInPeriod(this, 'homework-commented.html', jQuery.extend({}, this.homeworkInfo, selectGContainer.classInfo));
	})
	//学生作业在已评论点击事件
	mui('.mui-table-view').on('tap', '.isCommentedBG', function() {
		clickItem = this;
		this.disabled = true;
		events.singleWebviewInPeriod(this, 'homework-commented.html', jQuery.extend({}, this.homeworkInfo, selectGContainer.classInfo));
	})
	//发布作业界面
	publish.addEventListener('tap', function() {
		events.showWaiting();
		openPublish();
	})
}
/**
 * 学生作业
 * @param {Object} item
 */
var openStuWork = function(item) {
	if(stuWorkReady) {
		events.fireToPageWithData('workdetail-stu.html', 'workDetail', jQuery.extend({}, item.homeworkInfo, selectGContainer.classInfo));
		events.closeWaiting();
	} else {
		setTimeout(function() {
			openStuWork(item);
		}, 500);
	}
}
var openPublish = function() {
	if(publishIsReady) {
		events.fireToPageWithData('homework-publish.html', 'postClasses', teacherClasses);
		events.closeWaiting();
	} else {
		setTimeout(openPublish, 500);
	}
}
/**
 * 放置班级列表数据
 * @param {Object} role 角色
 */
var setClasses = function(role) {
	var tabs = document.getElementById('scroll-class');
	tabs.innerHTML = "";
	var classes;
	if(role == 2) {
		classes = teacherClasses;
	} else {
		classes = studentClasses;
	}
	//遍历班级数组，并放置数据
	classes.forEach(function(classModel, i, classArray) {
		initializeClassesIndex(i);
		var a = document.createElement('a');
		a.className = 'mui-control-item';
		a.innerText = classModel.gname;
		tabs.appendChild(a);
		a.classInfo = classModel;
	})
	//第一个子控件 为选中状态
	tabs.firstElementChild.className = "mui-control-item mui-active";
	selectGContainer = tabs.firstElementChild;
	document.getElementById("tabs-class").style.display = "block";
	//console.log("获取班级控件：" + tabs.innerHTML);
}
/**
 * 初始化每个班级请求页码为1
 * @param {Object} i
 */
var initializeClassesIndex = function(i) {
	if(role == 2) {
		teacherClasses[i].pageIndex = 1;
	} else {
		studentClasses[i].pageIndex = 1;
	}
}
/**
 * 请求作业列表
 * @param {Object} classModel
 * @param {Object} callback
 */
var requireHomeWork = function(classModel, callback) {
	events.closeWaiting();
	//console.log("请求作业数据：" + 123);
	var comData = {};
	if(role == 2) {
		comData.teacherId = personalUTID;
	} else {
		comData.studentId = personalUTID;
	}
	comData.classId = classModel.gid;
	comData.pageIndex = classModel.pageIndex;
	if(role == 2) {
		postDataPro_GetHomeworkList(comData, null, function(data) {
			//console.log('老师、作业主界面获取的作业列表：' + JSON.stringify(data));
			if(data.RspCode == 0) {
				totalPageCount = data.RspData.PageCount;
				selectGContainer.classInfo.totalPageCount = totalPageCount;
				setHashData(comData, data);
				callback(data.RspData.Dates, 2);
			} else {
				mui.toast(data.RspTxt);
			}
				endFresh();
		})
	} else { //家长学生
		postDataPro_GetHomeworkListStu(comData, null, function(data) {
			//console.log('学生、作业主界面获取的作业列表：' + JSON.stringify(data));
			if(data.RspCode == 0) {
				totalPageCount = data.RspData.PageCount;
				//向作业数组中合并人员信息
				//获取临时作业，老师id
				var tempIDs = [];
				var tempArray = [];
				for(var i in data.RspData.Dates) {
					//						if(data.RspData.Dates[i].AnswerResults.length > 0) {
					tempArray = tempArray.concat(data.RspData.Dates[i].AnswerResults);
					tempArray = tempArray.concat(data.RspData.Dates[i].Homeworks);
					//						}
				}
				//console.log('重组后的学生作业：' + JSON.stringify(tempArray));
				for(var m in tempArray) {
					var tempModel = tempArray[m];
					tempIDs.push(tempModel.TeacherId);
				}
				//有临时作业
				if(tempIDs.length > 0) {
					//给老师id数组去重
					tempIDs = events.arraySingleItem(tempIDs)
					//21.通过用户ID或ID串获取用户资料
					//所需参数
					var comData1 = {
						vvl: tempIDs.toString(), //用户id，查询的值,p传个人ID,g传ID串
						vtp: 'g' //查询类型,p(个人)g(id串)
					};
					//21.通过用户ID或ID串获取用户资料
					postDataPro_PostUinf(comData1, null, function(data1) {
						//console.log('通过用户ID或ID串获取用户资料：' + JSON.stringify(data1));
						if(data1.RspCode == 0) {
							//循环遍历
							for(var m in data.RspData.Dates) {
								for(var j in data.RspData.Dates[m].AnswerResults) {
									for(var n in data1.RspData) {
										var tempModel1 = data1.RspData[n];
										//判断id是否一致，一致则合并
										if(tempModel1.utid == data.RspData.Dates[m].AnswerResults[j].TeacherId) {
											jQuery.extend(data.RspData.Dates[m].AnswerResults[j], tempModel1);
											break;
										}
									}
								}
								for(var k in data.RspData.Dates[m].Homeworks) {
									for(var n in data1.RspData) {
										var tempModel1 = data1.RspData[n];
										//判断id是否一致，一致则合并
										if(tempModel1.utid == data.RspData.Dates[m].Homeworks[k].TeacherId) {
											jQuery.extend(data.RspData.Dates[m].Homeworks[k], tempModel1);
											break;
										}
									}
								}
							}
							//console.log('合并后的数据为：' + JSON.stringify(data));
							selectGContainer.classInfo.totalPageCount = totalPageCount;
							setHashData(comData, data);
							callback(data.RspData.Dates, 30)
						}
					});
				} else { //没有临时作业
					selectGContainer.classInfo.totalPageCount = totalPageCount;
					setHashData(comData, data);
					callback(data.RspData.Dates)
				}
			} else {
				mui.toast(data.RspTxt);
			}
			endFresh();
		})
	}

}
/**
 * 防止作业数据
 * @param {Object} data 作业数据
 * @param {Object} type 获取作业身份时的角色类型
 */
var setData = function(data, type) {
	/**
	 * 如果角色和数据身份不符，不放置数据
	 */
	if(role != type) {
		events.closeWaiting();
		return;
	}
	//老师角色
	if(role == 2) {
		setPublishedData(data);
		//家长和学生
	} else {
		setHomeworkData(data);
	}
	endFresh();
}
/**
 * 放置我发布的数据
 */
var setPublishedData = function(publishedData) {
	var fragment = document.createDocumentFragment();
	var showType;
	mui('#work-list').scroll().scrollTo(0,0,100);
	//console.log("要放置的发布作业数据：" + JSON.stringify(publishedData));
	if(publishedData && publishedData.length > 0) {
		showType = 0;
		//console.log('发布作业的Id：' + selectGId + ';老师作业的数据：' + JSON.stringify(publishedData));
		//遍历老师发布的作业
		publishedData.forEach(function(DateHM, i) {
			var divider = document.createElement('li');
			divider.className = 'mui-table-view-divider';
			divider.innerText = DateHM.Date.split(' ')[0].replace(/\//g,"-");
			fragment.appendChild(divider);
			//普通作业数据
			if(DateHM.Homeworks && DateHM.Homeworks.length > 0) {
				DateHM.Homeworks.forEach(function(homework, i) {
					homework.classId = selectGId;
					homework.Date = DateHM.Date.replace(/\//g,'-');
					var li = document.createElement('li');
					li.homeworkInfo = homework;
					li.className = 'mui-table-view-cell publishedHomework';
					li.innerHTML = createHomeworkInner(homework);
					fragment.appendChild(li);
				})
			}
			//临时作业数据
			if(DateHM.AnswerResultIds && DateHM.AnswerResultIds.ThumbUrls.length > 0) {
				var li = document.createElement('li');
				DateHM.AnswerResultIds.Date = DateHM.Date.replace(/\//g,"-");
				li.homeworkInfo = DateHM.AnswerResultIds;
				li.className = 'mui-table-view-cell publishedAnswer';
				li.innerHTML = createAnswerResultInner(DateHM.AnswerResultIds);
				fragment.appendChild(li);
			}
		})

	} else {
		showType = 1;
	}
	showNoData(showType);
	events.closeWaiting();
	list.appendChild(fragment);
}
/**
 * 
 * @param {Object} homework 
 * "Contents":"1+1=？","HomeworkId":109,
 * "HomeworkTitle":"2016年12月8日星期四语文作业",
 * "Remain":11,"Subject":"语文","Upload":0
 */
var createHomeworkInner = function(homework) {
	var inner = '<a><div class="homework-header"><span class=" iconfont subject-icon ' +
		getHomeworkIcon(homework.Subject) + '"></span><div class="header-words"><h6 class="header-title single-line">' +
		homework.HomeworkTitle + '</h6><p class="header-content single-line">' + homework.Contents + '</p></div></div>' +
		submitOnlineCondition(homework) + '</a>';
	return inner;
}
/**
 * 是否需在线提交
 * @param {Object} homework
 */
var submitOnlineCondition = function(homework) {
	if(homework.SubmitOnline) {
		return '<div class="homework-bottom"><p>未提交数(' + homework.Remain +
			')</p><p>已提交数(' + homework.Upload + ')</p></div>';
	} else {
		return '';
	}

}
/**
 * 临时作业已提交数
 * @param {Object} answerResult
 */
var createAnswerResultInner = function(answerResult) {
	return '<a><div class="answerResult-header">' + getAnswerImgs(answerResult.ThumbUrls) +
		'</div><p class="answerResult-bottom">已提交数(' + answerResult.Upload + ')</p></a>'
}
//获取临时作业图片
var getAnswerImgs = function(thumbUrls) {
	var imgsInner = '';
	thumbUrls.forEach(function(thumbUrl) {
		if(thumbUrl != null) {
			imgsInner += '<img class="answerResult-pic" src="' + thumbUrl + '"/>';
		}
	})
	imgsInner += '<span class="mui-icon mui-icon-arrowright temporary-more"></span>'
	return imgsInner;
}
/**
 * 学生作业的inner
 * @param {Object} homework
 */
var createStuHomeworkInner = function(homework) {
	return '<a><div class="stuHomework-header"><span class=" iconfont subject-icon ' +
		getHomeworkIcon(homework.Subject) + '"></span><div class="header-words stuHead-words"><h6 class="header-title single-line">' +
		homework.HomeworkTitle + '</h6><p class="header-content single-line">' + homework.Contents + 
		'</p><p class="publisher-container single-line">发布人 : ' + homework.unick + '</p></div><div class="img-container"></div></div></a>';
}
/**
 * 设置学生作业
 * @param {Object} answerResult
 */
var getResultBackground = function(answerResult) {
	var backClassName;
	if(answerResult.IsCommented) {
		backClassName = 'isCommentedBG'
	} else {
		backClassName = 'noCommentedBG'
	}
	return backClassName;
}
/**
 * 设置学生作业背景图片
 * @param {Object} homework
 */
var getBackGround = function(homework) {
	var backClassName = ''
	//已评论
	if(homework.IsCommented) {
		backClassName = 'isCommentedBG'
	} else {
		//已提交
		if(homework.IsSubmitted) {
			backClassName = 'isSubmitted';
			//未提交
		} else {
			//需在线提交
			if(homework.SubmitOnline) {
				backClassName = 'submitOnline';
			} else {
				backClassName = 'noSubmit';
			}
		}
	}
	return backClassName;
}
/**
 * 获取学生临时作业的inner
 * @param {Object} answerResult
 */
var createStuAnswerResultInner = function(answerResult) {
	return '<a><div class="answerResult-header">' + getStuAnswerImges(answerResult) +
		'</div><p class="answerResult-bottom"><span>' + answerResult.unick + '</span><span>' + answerResult.UploadTime + '</span></p></a>';
}
var getStuAnswerImges = function(answerResult) {

	return '<img class="answerResult-pic" src="' + answerResult.ThumbUrl + '"/>';
}
/**
 * 获取科目图标
 * @param {Object} subject
 */
var getHomeworkIcon = function(subject) {
	var subjectIcon = '';
	switch(subject) {
		case '语文':
			subjectIcon = 'icon-yuwen';
			break;
		case '数学':
			subjectIcon = 'icon-shuxue';
			break;
		case '英语':
			subjectIcon = 'icon-yingyu';
			break;
		case '政治':
			subjectIcon = 'icon-zhengzhi';
			break;
		case '历史':
			subjectIcon = 'icon-lishi';
			break;
		case '地理':
			subjectIcon = 'icon-dili';
			break;
		case '物理':
			subjectIcon = 'icon-wuli';
			break;
		case '化学':
			subjectIcon = 'icon-huaxue';
			break;
		case '生物':
			subjectIcon = 'icon-shengwu';
			break;
		default:
			subjectIcon = 'icon-qita';
			break;
	}
	return subjectIcon;
}
/**
 * 放置学生作业数据
 * @param {Object} homeworkData 作业数据
 */
var setHomeworkData = function(homeworkData) {
	var fragment = document.createDocumentFragment();
	var showType;
	mui('#work-list').scroll().scrollTo(0,0,100);
	if(homeworkData && homeworkData.length > 0) {
		showType = 0;
		homeworkData.forEach(function(DateHM, i) {
			var divider = document.createElement('li');
			divider.className = 'mui-table-view-divider';
			divider.innerText = DateHM.Date.split(' ')[0].replace(/\//g,"-");
			fragment.appendChild(divider);
			if(DateHM.Homeworks && DateHM.Homeworks.length > 0) {
				DateHM.Homeworks.forEach(function(homework, i) {
					var li = document.createElement('li');
					homework.Date = DateHM.Date.replace(/\//g,"-");
					li.homeworkInfo = homework;
					li.className = 'mui-table-view-cell stuHomework ' + getBackGround(homework);
					li.innerHTML = createStuHomeworkInner(homework);
					fragment.appendChild(li);
					//console.log("获取的元素："+li.innerHTML);
				})
			}
			if(DateHM.AnswerResults && DateHM.AnswerResults.length > 0) {
				DateHM.AnswerResults.forEach(function(answerResult) {
					if(answerResult.ThumbUrl != null) {
						answerResult.Date = DateHM.Date.replace(/\//g,"-");
						answerResult.workType = 0;
						var li = document.createElement('li');
						li.homeworkInfo = answerResult;
						li.className = 'mui-table-view-cell stuAnswer ' + getResultBackground(answerResult);
						li.innerHTML = createStuAnswerResultInner(answerResult);
						fragment.appendChild(li);
					}

				})

			}
		})
	} else {
		showType = 1;
	}
	showNoData(showType);
	events.closeWaiting();
	list.appendChild(fragment);
}
/**
 * 以键值对的形式放置数据
 * @param {Object} comData
 * @param {Object} data
 */
var setHashData = function(comData, data) {
	if(comData.pageIndex == 1) {
		if(role == 2) {
			teacherHash.put(comData.classId, data.RspData.Dates);
		} else {
			studentHash.put(comData.classId, data.RspData.Dates);
		}
	} else {
		if(role == 2) {
			teacherHash.put(comData.classId, teacherHash.get(comData.classId).concat(data.RspData.Dates));
		} else {
			studentHash.put(comData.classId, studentHash.get(comData.classId).concat(data.RspData.Dates));
		}
	}
}

//获取老师、家长作业列表
function requestData(comData) {
	// 等待的对话框
	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
	//1.根据教师Id和班级Id获取作业列表；逻辑：获取有效的、未毕业的、教师Id在群中的角色是老师的群列表；
	postDataPro_GetHomeworkList(comData, wd, function(data) {
		wd.close();
		//console.log('作业主界面作业列表：' + JSON.stringify(data));
		if(data.RspCode == 0) {
			changeSavedData(comData, data.RspData.Dates);
		} else {
			mui.toast(data.RspTxt);
		}
	});
}
/**
 * 仿HashMap
 */
var newHashMap = function() {
	var HashMap = {
		put: function(key, value) {
			this[key] = value
		},
		get: function(key) {
			return this[key]
		},
		contains: function(key) {
			return this.Get(key) == null ? false : true
		},
		remove: function(key) {
			delete this[key]
		},
		length: function() {
			return Object.getOwnPropertyNames(this).length - 5;
		}
	}
	return HashMap;
}
/**
 * 设置标题栏
 * @param {Object} title 标题
 * @param {Object} roles 角色
 * @param {Object} btn_m 按钮
 */
var setChoices = function(title, roles, btn_m) {
	//老师和家长角色
	if(teacherClasses.length > 0 && studentClasses.length > 0) {
		if(roles.classList.contains("mui-active")) {
			mui('#workPage-roles').switch().toggle();
		}
		title.style.display = 'none';
		roles.style.display = 'inline-block';
		//		btn_m.style.display = 'none';
		role = 2; //老师
		//老师角色
	} else if(teacherClasses.length > 0) {
		title.style.display = 'inline-block';
		roles.style.display = 'none';
		title.innerText = '我发布的';
		role = 2; //老师
		//		btn_m.style.display = 'none';
		//家长角色
	} else if(studentClasses.length > 0) {
		title.style.display = 'inline-block';
		roles.style.display = 'none';
		title.innerText = '学生作业'
		//		btn_m.style.display = 'block'
		role = 30;
	}
	//获取作业详情
	getWorkDetail();
}