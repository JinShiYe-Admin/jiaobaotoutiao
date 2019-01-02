
//学生查看老师作业评价
mui.init();
//作业model
var homeworkModel = {};
mui('.mui-scroll-wrapper').scroll();
mui.plusReady(function() {
	var data = plus.webview.currentWebview().data;
	homeworkModel = data;
	resetData(); //数据初始化
	//console.log('学生查看作业结果界面：' + JSON.stringify(homeworkModel));
	if(homeworkModel.workType == 0) {
		document.getElementById("modifyHomework").style.display = 'none';
		getAnswerResultStu();
	} else {
//		document.getElementById("modifyHomework").style.display = 'inline-block';
		document.getElementById("list").hidden = '';
		requestHomeworkDetail();
		requestGetHomeworkResultStu();
	}
	getStuName();
	events.areaInScroll();
	mui.previewImage();
	//修改答案后刷新界面
	window.addEventListener('refreshAnswer', function(e) {
		//console.log(JSON.stringify(e.detail.data))
		homeworkDetailNodes.stuResult.innerHTML = e.detail.data.answer.replace(/ /g,"&nbsp;").replace(/\n/g,"<br/>");
		homeworkResult.HomeworkResult.Result = e.detail.data.answer;
		var imgFiles = e.detail.data.Files;
		//console.log(JSON.stringify(imgFiles))
		document.getElementById('brief-imgs-stu').innerHTML = getImgsInner(imgFiles);
		homeworkResult.HomeworkResult.Files = imgFiles;
	})
	//跳转到修改作业界面
	events.addTap('modifyHomework', function() {
		//console.log('homeworkResult=' + JSON.stringify(homeworkResult));
		//console.log('homeworkModel=' + JSON.stringify(homeworkModel));
		if(homeworkModel.workType == 0) { //0:临时作业 1：普通作业
			var modifyAnswerData = mui.extend(homeworkResult, {
				role: 30
			}, homeworkModel)
			//console.log(JSON.stringify(modifyAnswerData));
			events.fireToPageWithData('publish-answer.html', 'modifyAnswer', modifyAnswerData)

		} else {
			events.fireToPageNone('doHomework-stu.html', 'workDetail', homeworkResult);
			plus.webview.getWebviewById("doHomework-stu.html").show();
		}

	})
	//上个界面跳转到此界面的监听事件
	window.addEventListener('workDetail', function(e) {
		homeworkModel = e.detail.data;
		resetData(); //数据初始化
		//console.log('学生查看作业结果界面：' + JSON.stringify(homeworkModel));
		if(homeworkModel.workType == 0) {
			document.getElementById("modifyHomework").style.display="none";
			//			document.getElementById("list").hidden = 'hidden';
			getAnswerResultStu();
		} else {
			document.getElementById("modifyHomework").style.display="inline-block";
			document.getElementById("list").hidden = '';
			requestHomeworkDetail();
			requestGetHomeworkResultStu();
		}
		getStuName();

	})
	var _back = mui.back;
	mui.back = function() {
		console.log('返回上级页面的id:' + plus.webview.currentWebview().opener().id);
		if(homeworkModel.isNotice) {
			plus.webview.getWebviewById('aboutme.html').show();
//			_back();
		} else {
			console.log()
			if(homeworkModel.workType == 1) {
				plus.webview.getWebviewById('homework-tea.html').show();
			} else {
				_back();
			}
		}
	}
});
//重置数据
function resetData() {
	personalUTID = window.myStorage.getItem(window.storageKeyName.PERSONALINFO).utid;
	var tempNodes = mui('.tempComment');
	homeworkResult = {};
	for(var i = 0; i < tempNodes.length; i++) {
		homeworkDetailNodes.list.removeChild(tempNodes[i]);
	}

	if(homeworkModel.workType == 0) { //0:临时作业 1：普通作业
		//console.log('临时作业')
		homeworkDetailNodes.stuHomework.hidden = 'hidden';
		homeworkDetailNodes.stuCell.hidden = 'hidden';
		homeworkDetailNodes.hr.hidden = 'hidden';
		homeworkDetailNodes.headImg.style.display = 'block';
		homeworkDetailNodes.img.style.display = 'none';

	} else {
		//console.log('普通作业')
		homeworkDetailNodes.stuHomework.hidden = '';
		homeworkDetailNodes.stuCell.hidden = '';
		homeworkDetailNodes.hr.hidden = '';
		homeworkDetailNodes.headImg.style.display = 'none';
		homeworkDetailNodes.img.style.display = 'block';

	}

};

var homeworkDetailNodes = {
	headImg: document.getElementById("headImg"),
	img: document.getElementById("img"), //作业类型图像
	title: document.getElementById("homeworkTitle"), //作业类型标题
	publishDate: document.getElementById("publishDate"), //发布日期
	content: document.getElementById("homeWorkContent"), //作业内容
	commentContent: document.getElementById("commentContent"),
	list: document.getElementById("list"), //列表
	comment: document.getElementById("comment"), //评语
	tempComment: document.getElementsByClassName('tempComment'),
	stuHomework: document.getElementById('stuHomework'), //学生临时作业用到的节点元素
	stuResult: document.getElementById('stuResult'),
	stuCell: document.getElementById('stuCell'),
	hr: document.getElementById('hr'),
}

//个人UTID
//作业结果model
var homeworkResult = {};
var personalUTID;
//获取作业详情
function requestHomeworkDetail() {
	//所需参数
	var comData = {
		teacherId: homeworkModel.TeacherId, //教师Id
		homeworkId: homeworkModel.HomeworkId //作业id；
	};
	// 等待的对话框
	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
	//2.获取教师发布作业详情；
	postDataPro_GetHomework(comData, wd, function(data) {
		wd.close();
		//console.log('2.postDataPro_GetHomework:RspCode:' + data.RspCode + ',RspData:' + JSON.stringify(data.RspData) + ',RspTxt:' + data.RspTxt);
		if(data.RspCode == 0) {
			//修改界面
			document.getElementById('brief-imgs').innerHTML = getImgsInner(data.RspData.File);
		} else {
			mui.toast(data.RspTxt);
		}
	});
}
//获取学生个人资料
function getStuName() {
	if(!homeworkModel.gid){
		homeworkModel.gid =homeworkModel.ClassId
	}
	var tempData = {
		top: '-1', //选择条数
		vvl: homeworkModel.gid, //群ID，查询的值
		vvl1: '-1' //群员类型，0家长,1管理员,2老师,3学生,-1取全部
	};
	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
	//13.通过群ID获取群的正常用户
	postDataPro_PostGusers(tempData, wd, function(data) {
		wd.close();
		//console.log("获取的群成员信息:"+JSON.stringify(data));
		if(data.RspCode == 0) {
			//循环当前的个人信息返回值数组
			for(var i in data.RspData) {
				//当前model
				var tempModel = data.RspData[i];
				//更新头像
				tempModel.uimg = updateHeadImg(tempModel.uimg, 2);
				if(personalUTID == tempModel.utid) {

					homeworkModel = mui.extend(homeworkModel, tempModel);
					//console.log('homeworkModel=' + JSON.stringify(homeworkModel));
				}
			}
		}else{
			mui.toast(data.RspTxt);
		}

	});
}
//3.获取作业结果和评价；学生
function requestGetHomeworkResultStu() {
	if(!homeworkModel.gid){
		homeworkModel.gid =homeworkModel.ClassId
	}
	//所需参数
	var comData = {
		studentId: personalUTID, //学生Id
		classId: homeworkModel.gid, //班级群Id；
		homeworkId: homeworkModel.HomeworkId //作业id；
	};

	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
	//3.	获取作业结果和评价
	postDataPro_GetHomeworkResultStu(comData, wd, function(data) {

		wd.close();
		//console.log('3.postDataPro_GetHomeworkResultStu:RspCode:' + data.RspCode + ',RspData:' + JSON.stringify(data.RspData) + ',RspTxt:' + data.RspTxt);
		if(data.RspCode == 0) {
			homeworkResult = data.RspData;
			if(!homeworkModel.TeacherId){
				homeworkModel.TeacherId = homeworkModel.UserId
			}
			//查找老师info
			requestTeaInfo(homeworkModel.TeacherId);
			refreshUI();
		} else {
			
		}
	});
}
//4.获取临时作业结果和评价；学生
function getAnswerResultStu() {
	//所需参数
	var comData = {
		studentId: personalUTID, //学生Id
		classId: homeworkModel.gid, //班级群Id；
		answerResultId: homeworkModel.AnswerResultId //作业id；
	};

	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
	//4.	获取临时作业结果和评价：学生
	postDataPro_GetAnswerResultStu(comData, wd, function(data) {
		wd.close();
		//console.log('4.postDataPro_GetAnswerResultStu:RspCode:' + data.RspCode + ',RspData:' + JSON.stringify(data.RspData) + ',RspTxt:' + data.RspTxt);
		if(data.RspCode == 0) {
			homeworkResult = data.RspData;
			if(!homeworkModel.TeacherId) {
				homeworkModel.TeacherId = homeworkModel.utid
			}
			requestTeaInfo(homeworkModel.TeacherId);
		} else {

		}
	});
}
//请求老师临时作业答案
var requireTeachersAnswer = function() {
	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
	//console.log('homeworkModel' + JSON.stringify(homeworkModel));
	postDataPro_GetAnswer({
		teacherId: homeworkModel.TeacherId,
		answerResultId: homeworkModel.AnswerResultId
	}, wd, function(data) {
		wd.close();
		//console.log('学生作业页面获取的临时作业答案：' + JSON.stringify(data));
		if(data.RspCode == '0000') {
			mui.extend(homeworkResult, data.RspData);
			//console.log('homeworkResult=' + JSON.stringify(homeworkResult));

			refreshUITemp();
		} else if(data.RspCode == '9999') {
			//				refreshUITemp();
		}
	})
}
//查找老师info
var requestTeaInfo = function(teaId) {
	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
	postDataPro_PostUinf({
		vvl: teaId,
		vtp: 'p'
	}, wd, function(data) {
		wd.close();
		//console.log('学生作业详情界面获取老师信息：' + JSON.stringify(data));
		if(data.RspCode = '0000') {
			mui.extend(homeworkResult, data.RspData[0])
			if(homeworkModel.workType == 0) {
				if(homeworkModel.UploadTime) {
					var dateArr = homeworkModel.UploadTime.split(' ');
					homeworkModel.UploadTime = dateArr[0];
					homeworkModel.UploadTime = homeworkModel.UploadTime.replace('/','-');
					homeworkModel.UploadTime = homeworkModel.UploadTime.replace('/','-');
					homeworkDetailNodes.publishDate.innerHTML = events.shortForString(data.RspData[0].unick, 12) + '&nbsp&nbsp&nbsp&nbsp<span>' + homeworkModel.UploadTime + '</span>'

				} else {
					//console.log(homeworkResult.SubmitTime);
					homeworkModel.UploadTime = homeworkResult.SubmitTime;
					var dateArr = homeworkModel.UploadTime.split(' ');
					homeworkModel.UploadTime = dateArr[0];
					homeworkModel.UploadTime = homeworkModel.UploadTime.replace('/','-');
					homeworkModel.UploadTime = homeworkModel.UploadTime.replace('/','-');

					homeworkDetailNodes.publishDate.innerHTML = events.shortForString(data.RspData[0].unick, 12)  + '&nbsp&nbsp&nbsp&nbsp<span>' + homeworkModel.UploadTime + '</span>'
				}
				homeworkDetailNodes.title.innerText = data.RspData[0].unick;
				homeworkDetailNodes.content.innerText = '';
				document.getElementById("headImg").src = updateHeadImg(data.RspData[0].uimg, 2);

			} else {
				var dateArr = homeworkResult.HomeworkResult.UploadTime.split(' ');
				homeworkResult.HomeworkResult.UploadTime = dateArr[0];
				homeworkResult.HomeworkResult.UploadTime = homeworkResult.HomeworkResult.UploadTime.replace('/','-');
				homeworkResult.HomeworkResult.UploadTime = homeworkResult.HomeworkResult.UploadTime.replace('/','-');

				homeworkDetailNodes.publishDate.innerHTML = events.shortForString(data.RspData[0].unick, 12) + '&nbsp&nbsp&nbsp&nbsp<span>' + homeworkResult.HomeworkResult.UploadTime + '</span>'

			}
			requireTeachersAnswer();

		} else {
			mui.toast(data.RspTxt);
		}
	})
}
//刷新临时作业界面
function refreshUITemp() {

	var TeaAnsLi = document.createElement('li');
	TeaAnsLi.className = 'mui-table-view-divider tempComment divider-color';
	TeaAnsLi.innerHTML = '老师答案';
	var TeaAnsImgLi = document.createElement('li');
	//老师答案图片
	TeaAnsImgLi.className = 'mui-table-view-cell mui-media  tempComment cell-color';
	TeaAnsImgLi.id = 'TeaAnsImgLi';
	TeaAnsImgLi.innerHTML = ''
	if(homeworkResult.Files.length > 0) {

		for(var i = 0; i < homeworkResult.Files.length; i++) {
			var img = homeworkResult.Files[i].ThumbUrl;
			TeaAnsImgLi.innerHTML = TeaAnsImgLi.innerHTML + '<img class="mui-media-object mui-pull-left" src="' + img + '" />';
			if(i == homeworkResult.Files.length - 1) {
				TeaAnsImgLi.innerHTML = TeaAnsImgLi.innerHTML + '<span class="mui-icon mui-icon-forward mui-pull-right " style = "margin-top:10px"></span>'
			}

		}

	} else {
		TeaAnsImgLi.innerHTML = '暂无答案'
	}

	var stuAnsLi = document.createElement('li');
	stuAnsLi.className = 'mui-table-view-divider tempComment divider-color';
	stuAnsLi.innerHTML = '学生作业';
	//学生答案图片
	var stuAnsImgLi = document.createElement('li');
	stuAnsImgLi.id = 'stuAnsImgLi';
	stuAnsImgLi.className = 'mui-table-view-cell mui-media  tempComment cell-color';
	stuAnsImgLi.innerHTML = ''
	homeworkResult.Files = getMatchedImgs(homeworkResult.Files)
	for(var i = 0; i < homeworkResult.File.length; i++) {
		var img = homeworkResult.File[i].ThumbUrl;
		stuAnsImgLi.innerHTML = stuAnsImgLi.innerHTML + '<img class="mui-media-object mui-pull-left" src="' + img + '" />';
		if(i == homeworkResult.File.length - 1) {
			stuAnsImgLi.innerHTML = stuAnsImgLi.innerHTML + '<span class="mui-icon mui-icon-forward mui-pull-right " style = "margin-top:10px"></span>'
		}

	}
	var compareResLi = document.createElement('li');
	compareResLi.className = 'mui-table-view-divider tempComment divider-color';
	compareResLi.innerHTML = '对比结果';
	var ResLi = document.createElement('li');
	ResLi.className = 'mui-table-view-cell mui-media  tempComment cell-color';
	ResLi.innerHTML = '暂无对比结果'
	homeworkDetailNodes.list.insertBefore(TeaAnsLi, homeworkDetailNodes.stuHomework);
	homeworkDetailNodes.list.insertBefore(TeaAnsImgLi, homeworkDetailNodes.stuHomework);
	homeworkDetailNodes.list.insertBefore(stuAnsLi, homeworkDetailNodes.stuHomework);
	homeworkDetailNodes.list.insertBefore(stuAnsImgLi, homeworkDetailNodes.stuHomework);
	homeworkDetailNodes.list.insertBefore(compareResLi, homeworkDetailNodes.stuHomework);
	homeworkDetailNodes.list.insertBefore(ResLi, homeworkDetailNodes.stuHomework);

	var Comment = homeworkResult.Comment;
	if(!Comment) {
		Comment = '无评语';
		document.getElementById("modifyHomework").style.display='inline-block';

	} else {
		document.getElementById("modifyHomework").style.display='none';
	}
	homeworkDetailNodes.commentContent.innerText = Comment;

}
var getMatchedImgs = function(files) {
	var mactchedFiles = [];
	for(var i in files) {

		if(!(files[i].MatchRate && files[i].MatchRate.replace('%', '') < 50)) {
			mactchedFiles.push(files[i]);
		}
	}
	return mactchedFiles;
}
var getImgsInner = function(imgs) {
	var imgInner = '';
	var win_height = document.body.offsetWidth-30;
	var img_width = win_height / 3;
	var random=Math.random(1000);
	if(imgs && imgs.length > 0) {
		for(var i in imgs) {
			if(!imgs[i].ThumbUrl) {
				imgs[i].ThumbUrl = imgs[i].thumb;
			}
			if(!imgs[i].Url) {
				imgs[i].Url = imgs[i].url;
			}
			if(!imgs[i].FileType) {
				imgs[i].FileType = imgs[i].type;
			}

			imgInner += '<img class="homework-img" style="width:' + img_width + 'px;height:' + img_width + 'px;" src="' + imgs[i].ThumbUrl +
				'" onerror="this.src=\''+imgs[i].Url+'\'" data-preview-src="' + imgs[i].Url + '" data-preview-group="' + imgs[i].FileType+random + '"/>';
		}
	}
	//console.log(imgInner)
	return imgInner;
}
//刷新普通作业界面
function refreshUI() {
	
	var className = 'iconfont subject-icon ' + getHomeworkIcon(homeworkModel.Subject);
	homeworkDetailNodes.img.className = className
	if(!homeworkModel.HomeworkTitle){
		homeworkModel.HomeworkTitle = homeworkModel.Homework.HomeworkTitle
	}
	homeworkDetailNodes.title.innerText = homeworkModel.HomeworkTitle;
	homeworkDetailNodes.publishDate.innerText = homeworkModel.HomeworkTitle;
	var HomeworkContents = homeworkResult.Homework.Contents;
	if(!HomeworkContents) {
		HomeworkContents = '作业内容';
	}
	homeworkDetailNodes.content.innerHTML = HomeworkContents.replace(/ /g,'&nbsp;').replace(/\n/g,'<br/>');
	//	document.getElementById('brief-imgs').innerHTML = getImgsInner(homeworkResult.HomeworkResult.Files);
	//console.log(homeworkResult.HomeworkResult.Result)
	homeworkDetailNodes.stuResult.innerHTML = homeworkResult.HomeworkResult.Result.replace(/ /g,'&nbsp;').replace(/\n/g,'<br/>');

	document.getElementById('brief-imgs-stu').innerHTML = getImgsInner(homeworkResult.HomeworkResult.Files);
	var Comment = homeworkResult.HomeworkResult.Comment;
	if(!Comment) {
		Comment = '无评语';
		document.getElementById("modifyHomework").style.display='inline-block'

	} else {
		document.getElementById("modifyHomework").style.display='none';
	}
	homeworkDetailNodes.commentContent.innerText = Comment;
	console.log('已评论作业详情：',homeworkModel)
	workCommented.workCommented=homeworkModel;
}
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
//点击图片跳转到图片详情界面
mui('.mui-table-view').on('tap', '.cell-color', function() {
	if(this.id == 'TeaAnsImgLi') { //老师答案
		//console.log('点击图片');
		var imageArr = homeworkResult.Files;
		events.openNewWindowWithData('pic-detail.html', {
			data: imageArr,
			title: '老师答案'
		})
	} else if(this.id == 'stuAnsImgLi') { //学生答案
		//console.log('点击图片')
		var imageArr = homeworkResult.File;
		events.openNewWindowWithData('pic-detail.html', {
			data: imageArr,
			title: '学生作业'
		})
	}

})
//打击答案内容跳转到做作业界面
//events.addTap('stuCell', function() {
//	events.fireToPageNone('doHomework-stu.html', 'workDetail', homeworkResult);
//	plus.webview.getWebviewById("doHomework-stu.html").show();
//})