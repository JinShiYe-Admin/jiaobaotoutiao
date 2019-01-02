var homeWorkComment=new Vue({
	el:"#work-comment",
	data:{
		workInfo:{
			
		}
	},
	methods:{
		resetData:function(){
			this.workInfo={};
		}
	}

})
var workInfo;
var personalUTID;
mui.init({
	beforeback: function() {
		if(mui.getPreviewImage().isShown()){
			return true;
		}
		document.querySelector(".answer-info").innerText = "";
		document.getElementById("answer-imgs").innerHTML = "";
		document.getElementById('submit-time').innerText = "";
		document.getElementById('stu-head').src = "";
		document.getElementById('stu-name').innerText = "";
		document.getElementById('comment-area').value = "";
		document.querySelector(".commented-words").innerText = "";
		homeWorkComment.resetData();
		return true;
	}
});

mui.plusReady(function() {

	mui.previewImage();
//	events.softIn("comment-area");
	mui.fire(plus.webview.getWebviewById("workdetail-tea-sub.html"), "commentIsReady");
	window.addEventListener('workInfo', function(e) {
//		mui('.mui-content').scrollTo(0, 0, 100); //100毫秒滚动到顶
		workInfo = e.detail.data;
		//console.log('老师评价页面获取的作业信息：' + JSON.stringify(workInfo))
		personalUTID = myStorage.getItem(storageKeyName.PERSONALINFO).utid;
		setStuInfo();
		setCondition();
		if(workInfo.workType == 0) { //临时作业
			requireAnswerResult();
		} else { //普通作业
			requireHomeworkResult();
		}
	})
	window.addEventListener("commentChanged", function(e) {
		var commentValue = e.detail;
		document.getElementById('commented-words').innerHTML = commentValue.replace(/ /g, "&nbsp;").replace(/\n/g, "<br/>");
		workInfo.Comment = commentValue;
	})
	//设置最大长度为1000
	jQuery('.comment-area').prop("maxLength", 1000);
	setListener();
	events.areaInScroll();
})
/**
 * 放置学生信息
 */
var setStuInfo = function() {
	var uimg = workInfo.uimg;
	var ugnick = workInfo.ugnick;
	document.getElementById('stu-head').src = updateHeadImg(uimg, 2);
	document.getElementById('stu-name').innerText = ugnick;
}
/**
 * 根据情况不同设置
 */
var setCondition = function() {
	var btn_comment = document.getElementById('btn-comment');
	//是否已评论
	if(workInfo.IsCommented) {
		btn_comment.innerText = '更改评论';
	} else {
		btn_comment.innerText = '提交评论';
	}

}
/**
 * 设置监听
 */
var setListener = function() {
	events.addTap('btn-comment', function() {
		var commentValue = document.getElementById('comment-area').value;
		commentValue = events.trim(commentValue);
		if(commentValue) {
			if(events.limitInput(commentValue, 2000)) {
				return;
			}
			if(workInfo.hasOwnProperty("workType") && workInfo.workType == 0) {
				if(workInfo.IsCommented) {
					modifyAnswerComment(commentValue);
				} else {
					commentAnswer(commentValue);
				}
			} else {
				if(workInfo.IsCommented) {
					modifyHomeworkComment(commentValue);
				} else {
					commentHomework(commentValue);
				}

			}
		} else {
			mui.toast('请输入评论内容');
		}

	})
	document.querySelector('.change-holder').addEventListener("tap", function() {
		toggleEditContainer(1);
	})
}
var toggleEditContainer = function(isToShow, isFirst) {
	if(workInfo.Comment) {
		document.getElementById('comment-area').value = workInfo.Comment;
		document.querySelector(".commented-words").innerHTML = workInfo.Comment.replace(/ /g, "&nbsp;").replace(/\n/g, "<br/>");
	}
	if(isToShow) {
		document.querySelector('.comment-holder').style.display = "block";
		document.querySelector(".commented-holder").style.display = "none";
	} else {
		document.querySelector('.comment-holder').style.display = "none";
		document.querySelector(".commented-holder").style.display = "block";
	}
}
/**
 * 获取普通作业老师评论
 * @param {Object} workInfo
 */
var requireHomeworkResult = function() {
	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
	postDataPro_GetHomeworkResult({
		teacherId: personalUTID,
		studentId: workInfo.StudentId,
		classId: workInfo.ClassId,
		homeworkId: workInfo.HomeworkId
	}, wd, function(data) {
		wd.close();
		//console.log('老师评价作业界面获取的作业信息：' + JSON.stringify(data));
		if(data.RspCode == '0000') {
			HomeworkResultId = data.RspData.HomeworkResultId;
			workInfo.stuFiles = data.RspData.Files;
			data.RspData.Files = null;
			jQuery.extend(workInfo, data.RspData);
		} else {
			mui.toast(data.RspTxt);
		}
		requireHomeworkInfo();
	})
}
/**
 * 获取作业详情
 */
var requireHomeworkInfo = function() {
	var wd = events.showWaiting();
	postDataPro_GetHomework({
		teacherId: personalUTID,
		homeworkId: workInfo.HomeworkId
	}, wd, function(data) {
		wd.close();
		//console.log("获取的作业信息详情：" + JSON.stringify(data))
		if(data.RspCode == 0) {
			var homeworkInfo = data.RspData;
			workInfo.teaFiles = data.RspData.File;
			jQuery.extend(workInfo, data.RspData);
			//		}else{
			//			mui.toast(data.RspTxt);
		}
		setHomeWorkInfo(workInfo);
	})
}
/**
 * 
 * @param {Object} workInfo
 * "Comment":null,"Files":[],"HomeworkResultId":654,"IconUrl":null,
 * "Result":"哦哦哦哦哦哦","StudentId":1,"StudentName":null,"UploadTime":"2016-12-17 11:08:43"
 */
var setHomeWorkInfo = function() {
	homeWorkComment.workInfo=workInfo;
	//console.log("要放置的作业数据：" + JSON.stringify(workInfo))
	document.getElementById('submit-time').innerText = events.shortForDate(workInfo.UploadTime);
	var homeworkInfo = document.getElementById('homework-info');
	document.querySelector(".answer-info").innerHTML = workInfo.Result.replace(/ /g, "&nbsp;").replace(/\n/g, "<br/>");
	document.getElementById("answer-imgs").innerHTML = "";
	toggleEditContainer(!workInfo.IsCommented, 1)
	if(workInfo.stuFiles && workInfo.stuFiles.length > 0) {
		createAnswerImgs(homeworkInfo, workInfo.stuFiles, 3);
	}
}
/**
 * 获取临时作业老师评论
 * @param {Object} workInfo
 */
var requireAnswerResult = function() {
	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
	postDataPro_GetAnswerResult({
		teacherId: personalUTID,
		StudentId: workInfo.utid,
		classId: workInfo.gid,
		answerResultId: workInfo.AnswerResultId
	}, wd, function(data) {
		wd.close();
		//console.log('老师评价页面获取的老师临时作业评价：' + JSON.stringify(data))
		if(data.RspCode == '0000') {
			data.RspData.stuFiles = data.RspData.Files;
			data.RspData.stuUploadTime = data.RspData.UploadTime;
			data.RspData.Files = null;
			data.RspData.UploadTime = null;
			jQuery.extend(workInfo, data.RspData);
		} else {
			//console.log('未获取临时作业评价')
		}
		requireTeachersAnswer();
	})
}
/**
 * "AnswerResultId":13,"IsCommented":"未评","QuestionResults":[],
 * "StudentId":0,"ThumbUrl":"Upload/201612/thumb_2_20161216030533.png",
 * "QuestionResultStr":"","gid":1,"gutid":133,"utid":4,"ugname":"rockan007",
 * "ugnick":"rockan007","uimg":"http://o9u2jsxjm.bkt.clouddn.com/headimge4.png",
 * "mstype":0,"workType":0,"Comment":null,"Files":null,"UploadTime":null,
 * "stuFiles":["DisplayOrder":1,"ThumbUrl":"Upload/201612/thumb_2_20161216030533.png","Url":"Upload/201612/2_20161216030533.png"}],
 * "stuUploadTime":"2016/12/16 15:10:54","TeacherId":1,"teaUploadTime":"2016/12/15 17:20:53",
 * "teaFiles":["DisplayOrder":1,"ThumbUrl":"Upload/201612/thumb_1_20161215052053.png","Url":"Upload/201612/1_20161215052053.png"}]}
 *	
 */
var setAnswerInfo = function() {
	//console.log('要放置的临时作业数据：' + JSON.stringify(workInfo));
	document.getElementById('submit-time').innerText = workInfo.stuUploadTime;
	var homeworkInfo = document.getElementById('homework-info');
	//	events.clearChild(homeworkInfo);
	ceateAnswerPinfo(homeworkInfo, 30);
	createAnswerImgs(homeworkInfo, workInfo.stuFiles, 0);
	ceateAnswerPinfo(homeworkInfo, 2);
	createAnswerImgs(homeworkInfo, workInfo.teaFiles, 1);
	if(workInfo.IsCommented) {
		document.getElementById('comment-area').value = workInfo.Comment;
	} else {
		document.getElementById('comment-area').value = null;
	}
	if(workInfo.QuestionResultStr) {
		document.getElementById('result-text').innerText = workInfo.QuestionResultStr.replace(/ /g, "&nbsp;").replace(/\n/g, "<br/>");
	} else {
		document.getElementById('result-text').innerText = null;
	}
}
var ceateAnswerPinfo = function(homeworkInfo, type) {
	var p = document.createElement('p');
	if(type == 30) {
		p.innerText = '学生作业:';
	} else {
		p.innerText = '老师答案:';
	}
	homeworkInfo.appendChild(p);
}
/**
 * 
 * @param {Object} homeworkInfo
 * @param {Object} imgs
 * @param {Object} type 0 学生 1 老师
 */
var createAnswerImgs = function(homeworkInfo, imgs, type) {
	//	var div = document.createElement('div');
	var win_width = document.getElementById("homework-info").offsetWidth;
	var img_width = (win_width) / 3;
	var imgsInner = '';
	for(var i in imgs) {
		imgsInner += '<img class="answer-img" src="' + imgs[i].ThumbUrl + '" style="width:' + img_width + 'px;height:' + img_width + 'px;"' +
			'data-preview-src="' + imgs[i].Url + '" data-preview-group="' + homeworkInfo.HomeworkResultId + '"/>';
	}
	//	div.innerHTML = imgsInner;
	//console.log("图片的innerHTML：" + imgsInner);
	document.getElementById("answer-imgs").innerHTML = imgsInner;
}
/**
 * 获取老师的临时作业答案
 * @param {Object} workInfo
 * "AnswerResultId":21,"IsCommented":"未评","QuestionResults":[],"StudentId":4,
 * "ThumbUrl":"Upload/201612/thumb_2_20161216041211.png","QuestionResultStr":"",
 * "gid":1,"gutid":133,"utid":4,"ugname":"rockan007","ugnick":"rockan007",
 * "uimg":"http://o9u2jsxjm.bkt.clouddn.com/headimge4.png","mstype":0,"workType":0}
 */
var requireTeachersAnswer = function() {
	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
	postDataPro_GetAnswer({
		teacherId: personalUTID,
		answerResultId: workInfo.AnswerResultId
	}, wd, function(data) {
		wd.close();
		//console.log('老师评价页面获取的老师临时作业答案：' + JSON.stringify(data));
		if(data.RspCode == '0000') {
			data.RspData.teaUploadTime = data.RspData.UploadTime;
			data.RspData.teaFiles = getMatchedImgs(data.RspData.Files);
			data.RspData.UploadTime = null;
			data.RspData.Files = null;
			jQuery.extend(workInfo, data.RspData);
		} else {

		}
		setAnswerInfo(workInfo);
	})
}
/**
 * 
 * @param {Object} files
 */
var getMatchedImgs = function(files) {
	var mactchedFiles = [];
	for(var i in files) {
		if(!(files[i].MatchRate && files[i].MatchRate.replace('%', '') < 50)) {
			mactchedFiles.push(files[i]);
		}
	}
	return mactchedFiles;
}
/**
 * 评论普通作业
 */
var commentHomework = function(commentValue) {
	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
	postDataPro_CommentHomeworkResult({
		teacherId: personalUTID,
		studentId: workInfo.utid,
		classId: workInfo.gid,
		homeworkId: workInfo.HomeworkId,
		comment: commentValue
	}, wd, function(data) {
		wd.close();
		//console.log('老师评价页面获取老师评价普通作业的结果:' + JSON.stringify(data));
		if(data.RspCode == '0000') {
			workInfo.IsCommented = true;
			workInfo.Comment = commentValue;
			events.fireToPageNone(plus.webview.currentWebview().opener().id, 'workCommented');
			toggleEditContainer(0);
			mui.toast('评论成功！');
			/*mui.back();*/
		} else {
			mui.toast(data.RspTxt);
		}
	})
}
/**
 * 评论临时作业
 */
var commentAnswer = function(commentValue) {
	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
	postDataPro_CommentAnswerResult({
		teacherId: personalUTID,
		studentId: workInfo.utid,
		classId: workInfo.gid,
		comment: commentValue,
		answerResultId: workInfo.AnswerResultId
	}, wd, function(data) {
		wd.close();
		//console.log('老师评价页面获取的老师评论临时作业的结果：' + JSON.stringify(data));
		if(data.RspCode == '0000') {
			events.fireToPageNone('workdetailTea-temSub.html', 'workCommented')
			workInfo.IsCommented = true;
			workInfo.Comment = commentValue;
			toggleEditContainer(0);
			mui.toast('评论成功！');
		} else {
			mui.toast(data.RspTxt);
		}
	})
}
/**
 * 更改普通作业评论
 */
var modifyHomeworkComment = function(commentValue) {
	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
	postDataPro_ModifyHomeworkResultComment({
		teacherId: personalUTID,
		homeworkResultId: workInfo.HomeworkResultId,
		studentId: workInfo.utid,
		classId: workInfo.gid,
		homeworkId: workInfo.HomeworkId,
		comment: commentValue
	}, wd, function(data) {
		wd.close();
		//console.log('老师评价页面获取老师更改普通作业评论的结果：' + JSON.stringify(data));
		if(data.RspCode == 0) {
			mui.toast('修改评论成功！')
			workInfo.Comment = commentValue;
			toggleEditContainer(0);
		} else {
			mui.toast(data.RspTxt);
		}
	})
}
/**
 * 更改临时作业评论
 */
var modifyAnswerComment = function(commentValue) {
	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
	postDataPro_ModifyAnswerResultComment({
		teacherId: personalUTID,
		answerResultId: workInfo.AnswerResultId,
		studentId: workInfo.utid,
		classId: workInfo.gid,
		comment: commentValue
	}, wd, function(data) {
		wd.close();
		//console.log('老师评价页面获取老师更改的评论结果：' + JSON.stringify(data));
		if(data.RspCode == '0000') {
			mui.toast('修改评论成功！');
			mui.back();
		} else {
			mui.toast(data.RspTxt);
		}
	})
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