var workDetailStu=new Vue({
	el:"#work-detail-stu",
	data:{
		workdetail:{}
	},
	methods:{
		resetData:function(){
			this.workdetail={};
		}
	}
})
var personalUTID; //个人utid
var homeworkInfo; //作业信息
mui.init({
	beforeback: function() {
		if(mui.getPreviewImage().isShown()){
			return true;
		}
		document.querySelector('.startWork-container').style.display = 'none';
		document.querySelector('.subject-icon').className = "subject-icon";
		document.querySelector('.brief-title').innerText = "";
		document.querySelector('.brief-content').innerText = "";
		document.querySelector('.publisher').innerText = "";
		document.querySelector('.publish-date').innerText = "";
		document.getElementById('brief-imgs').innerHTML = "";
		workDetailStu.workdetail={};
		return true;
	}
}); //加载mui
//plusready事件的监听回调
mui.plusReady(function() {
	//预加载做作业界面
	events.preload('doHomework-stu.html', 200);
	mui.fire(plus.webview.getWebviewById("homework-tea.html"), "stuWorkReady");
	mui.previewImage(); //加载预览功能
	//监听与我相关中作业提醒传过来的事件
	window.addEventListener("workNotice", function(e) {
		//console.log("作业提醒传过来的数值：" + JSON.stringify(e.detail.data));
		homeworkInfo = e.detail.data;
		homeworkInfo.gid = homeworkInfo.ClassId;
		homeworkInfo.TeacherId = homeworkInfo.UserId;
		document.querySelector('.homework-brief').className = 'homework-brief submitOnline';
		document.querySelector('.startWork-container').style.display = 'block';
		mui('.mui-scroll-wrapper').scroll().scrollTo(0, 0, 100);
		requestHomeWorkInfo(homeworkInfo);
	})
	//学生作业列表界面传过来的作业详情
	window.addEventListener('workDetail', function(e) {
		mui('.mui-scroll-wrapper').scroll().scrollTo(0, 0, 100);
		personalUTID = parseInt(myStorage.getItem(storageKeyName.PERSONALINFO).utid)
		homeworkInfo = e.detail.data;
		if(homeworkInfo.SubmitOnline) {
			document.querySelector('.homework-brief').className = 'homework-brief submitOnline';
			document.querySelector('.startWork-container').style.display = 'block';
		} else {
			document.querySelector('.homework-brief').className = 'homework-brief';
			document.querySelector('.startWork-container').style.display = 'none';
		}
		//console.log('学生作业详情获取的数据：' + JSON.stringify(homeworkInfo));
		requestHomeWorkInfo(homeworkInfo);

	})
	//作业已提交
	window.addEventListener('workSubmitted', function() {
		document.querySelector('.homework-brief').className = 'homework-brief isSubmitted';
	})
	//开始答题的监听
	events.addTap('btn-startWork', function() {
		events.fireToPageWithData('doHomework-stu.html', 'homeworkInfo', homeworkInfo);
	})
});
/**
 * 请求作业数据
 * @param {Object} homeWorkInfo 传过来的作业数据
 */
var requestHomeWorkInfo = function(homeWorkInfo) {
	var wd = events.showWaiting();
	postDataPro_GetHomeworkStu({
		studentId: personalUTID, //学生Id
		classId: homeWorkInfo.gid, //班级群Id；
		homeworkId: homeWorkInfo.HomeworkId //作业id；
	}, wd, function(data) {
		wd.close();
		//console.log("获取的作业信息：" + JSON.stringify(data));
		if(data.RspCode == 0) {
			jQuery.extend(homeWorkInfo, data.RspData);
		} else {
			//console.log("获取作业信息失败!");
		}
		requestTeaInfo(homeworkInfo.TeacherId);
	})
}
/**
 * 请求老师信息
 * @param {Object} teaId 根据老师id获取老师id
 */
var requestTeaInfo = function(teaId) {
	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
	postDataPro_PostUinf({
		vvl: teaId,
		vtp: 'p'
	}, wd, function(data) {
		wd.close();
		//console.log('学生作业详情界面获取老师信息：' + JSON.stringify(data));
		if(data.RspCode == 0) {
			jQuery.extend(homeworkInfo, data.RspData[0]);
			setContentView();
		} else {
			mui.toast(data.RspTxt);
		}
	})
}
/**
 * 放置作业内容
 */
var setContentView = function() {
	console.log('学生作业详情界面获取老师后的信息：',homeworkInfo);
	document.querySelector('.subject-icon').className = "subject-icon iconfont " + getHomeworkIcon(homeworkInfo.Subject);
	document.querySelector('.brief-title').innerText = homeworkInfo.HomeworkTitle;
	document.querySelector('.brief-content').innerHTML = homeworkInfo.Contents.replace(/ /g, "&nbsp;").replace(/\n/g, "<br/>");
	document.querySelector('.publisher').innerText = events.shortForString(homeworkInfo.unick, 6);
	document.querySelector('.publish-date').innerText = (homeworkInfo.Date ? homeworkInfo.Date : homeworkInfo.MsgDate).split(' ')[0];
	document.getElementById('brief-imgs').innerHTML = getImgsInner(homeworkInfo.File, homeworkInfo.HomeworkId);
	workDetailStu.workdetail=homeworkInfo;
}
/**
 * 放置图片
 * @param {Object} imgs
 * @param {Object} id
 */
var getImgsInner = function(imgs, id) {
	console.log("要放置的图片：",imgs)
	var imgInner = '';
	var win_height = document.body.offsetWidth-30;
	var img_width = win_height / 3;
	if(imgs && imgs.length > 0) {
		for(var i in imgs) {
			imgInner += '<img class="homework-img" style="width:' + img_width + 'px;height:' + img_width + 'px;" src="' + imgs[i].ThumbUrl +
				'" data-preview-src="' + imgs[i].Url + '" data-preview-group="' + id + '"/>';
		}
	}
	return imgInner;
}

/**
 * 作业icon
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