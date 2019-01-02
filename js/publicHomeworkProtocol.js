//本页面存放界面中需要的协议，接口作用、需要传值内容、调用的方法---作业模块

//本地存储
document.write('<script src="../../js/libs/myStorage/myStorage.js"><\/script>');
document.write('<script src="../../js/storageKeyName.js"><\/script>');
//加密
document.write('<script src="../../js/libs/RSA/Barrett.js"><\/script>');
document.write('<script src="../../js/libs/RSA/BigInt.js"><\/script>');
document.write('<script src="../../js/libs/RSA/RSA.js"><\/script>');
document.write('<script src="../../js/utils/RSAEncrypt.js"><\/script>');
//网络请求
document.write('<script src="../../js/utils/postData.js"><\/script>');
//签名
document.write('<script src="../../js/libs/crypto-js/require.js"><\/script>');
//document.write('<script src="../../js/utils/sortSign.js"><\/script>');
document.write('<script src="../../js/utils/signHmacSHA1.js"><\/script>');
document.write('<script src="../../js/libs/jquery.js"><\/script>');


//--------------------------------------------教师---------------------------------------------


//1.获取教师发布作业列表,逻辑：获取当前教师在当前班级的作业列表，默认近1周数据，每次多加载1周数据；
//所需参数
//		var comData = {
//			teacherId: '',//教师Id
//			classId:'',//班级群Id；
//			pageIndex: ''//当前页码，默认1；
//		};
var postDataPro_GetHomeworkList=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINHOMEWORKURLTEACHER + 'GetHomeworkList', enData, commonData, 2, wd, callback);
}


//2.获取教师发布作业详情；
//所需参数
//		var comData = {
//			teacherId: '',//教师Id
//			homeworkId:''//作业id；
//		};
var postDataPro_GetHomework=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINHOMEWORKURLTEACHER + 'GetHomework', enData, commonData, 2, wd, callback);
}


//3.	获取作业对应学生列表
//所需参数
//		var comData = {
//			teacherId: '',//教师Id
//			classId:'',//班级群Id；
//			homeworkId:''//作业id；
//		};
var postDataPro_GetStudentList=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINHOMEWORKURLTEACHER + 'GetStudentList', enData, commonData, 2, wd, callback);
}


//4.	根据教师Id和班级Id获取学生某个日期上传的答案列表；
//所需参数
//		var comData = {
//			teacherId: '',//教师Id
//			classId:'',//班级群Id；
//			date:''//查看的日期，不带时间；
//		};
var postDataPro_GetAnswerResultList=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINHOMEWORKURLTEACHER + 'GetAnswerResultList', enData, commonData, 2, wd, callback);
}


//5.	 获取学生上传作业详情
//所需参数
//		var comData = {
//			teacherId: '',//教师Id
//			StudentId: '',//学生Id；
//			classId:'',//班级群Id；
//			homeworkId:''//作业id；
//		};
var postDataPro_GetHomeworkResult=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINHOMEWORKURLTEACHER + 'GetHomeworkResult', enData, commonData, 2, wd, callback);
}


//6.	 获取学生上传答案详情
//所需参数
//		var comData = {
//			teacherId: '',//教师Id
//			StudentId: '',//学生Id；
//			classId:'',//班级群Id；
//			answerResultId:''//作业id；
//		};
var postDataPro_GetAnswerResult=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINHOMEWORKURLTEACHER + 'GetAnswerResult', enData, commonData, 2, wd, callback);
}


//7.	 获取老师上传答案详情,逻辑：根据学生上传答案匹配出来的老师答案，不仅限于当前老师上传的答案；
//所需参数
//		var comData = {
//			teacherId: '',//教师Id
//			answerResultId:''//学生上传答案id；
//		};
var postDataPro_GetAnswer=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINHOMEWORKURLTEACHER + 'GetAnswer', enData, commonData, 2, wd, callback);
}


//8.	评价学生上传作业，作业评价
//所需参数
//		var comData = {
//			teacherId: '',//教师Id
//			studentId: '',//学生Id；
//			classId:'',//班级群Id；
//			homeworkId:'',//作业id；
//			comment:''//评价
//		};
//返回值：{“r”：true}
var postDataPro_CommentHomeworkResult=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINHOMEWORKURLTEACHER + 'CommentHomeworkResult', enData, commonData, 2, wd, callback);
}


//9.评价学生上传答案，答案评价
//所需参数
//		var comData = {
//			teacherId: '',//教师Id
//			answerResultId: '',//
//			studentId: '',//学生Id；
//			classId:'',//班级群Id；
//			comment:''//评价
//		};
//返回值：{“r”：true}
var postDataPro_CommentAnswerResult=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINHOMEWORKURLTEACHER + 'CommentAnswerResult', enData, commonData, 2, wd, callback);
}

//10.作业提交提醒
//所需参数
//		var comData = {
//			teacherId: '',//教师Id
//			userIds:'',//接收提醒的用户（学生|家长）Id串，逗号分割；
//			homeworkId:''//作业id；
//		};
//{“r”：true}
var postDataPro_HomeworkAlert=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINHOMEWORKURLTEACHER + 'HomeworkAlert', enData, commonData, 2, wd, callback);
}


//11.上传文件；逻辑：如果是图片类型，同时生成缩略图
//所需参数
//		var comData = {
//			teacherId: '',//教师Id
//			fileType: '',//文件类型，1：图片；2：音频；3：视频；
//			filename: '',//文件名，带后缀；
//			fileStream:'',//base64格式文件流；
//			displayOrder:''//图片顺序；
//		};
var postDataPro_UploadFile=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINHOMEWORKURLTEACHER + 'UploadFile', enData, commonData, 2, wd, callback);
}


//12.发布作业,逻辑：作业标题生成标准，时间+星期几+科目+“作业”，比如“11月11日星期一语文作业”
//所需参数
//		var comData = {
//			teacherId: '',//教师Id
//			subjectId: '',//科目Id， 见（一）.17. GetSubjectList()；
//			studentIds: '',//班级Id+学生Id串，班级Id和学生Id以“|“分割，如“班级Id|学生Id”，每对id之间逗号分隔，例如“1|1,1|2”；
//			content: '',//作业内容
//			submitOnLine: '',//是否需要在线提交；
//			fileIds:''//上传文件的id串，例如“1,2”；
//		};
//返回值：{“HomeworkId”：22   //0:保存失败 ，>0：保存成功        }
var postDataPro_PublishHomework=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINHOMEWORKURLTEACHER + 'PublishHomework', enData, commonData, 2, wd, callback);
}


//13.修改作业，逻辑：作业标题生成标准，时间+星期几+科目+“作业”，比如“11月11日星期一语文作业”
//所需参数
//		var comData = {
//			teacherId: '',//教师Id
//			homeworkId: '',//要修改的作业id；
//			subjectId: '',//科目Id， 见（一）.17. GetSubjectList()；
//			studentIds: '',//班级Id+学生Id串，班级Id和学生Id以“|“分割，如“班级Id|学生Id”，每对id之间逗号分隔，例如“1|1,1|2”；
//			content: '',//作业内容
//			submitOnLine: '',//是否需要在线提交；
//			fileIds:''//上传文件的id串，例如“1,2”；
//		};
//{“r”：true       }
var postDataPro_ModifyHomework=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINHOMEWORKURLTEACHER + 'ModifyHomework', enData, commonData, 2, wd, callback);
}


//14.发布答案,只能上传图片；
//所需参数
//		var comData = {
//			teacherId: '',//教师Id
//			subjectId: '',//科目Id， 见（一）.17. GetSubjectList()；
//			fileIds:''//上传文件的id数组；
//		};
//{“AnswerId”：22   //0:保存失败 ，>0：保存成功        }
var postDataPro_PublishAnswer=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINHOMEWORKURLTEACHER + 'PublishAnswer', enData, commonData, 2, wd, callback);
}


//15.修改作业评价
//所需参数
//		var comData = {
//			teacherId: '',//教师Id
//			homeworkResultId: '',//要修改的作业评价id；
//			studentId: '',//学生Id；
//			classId: '',//班级群Id；
//			homeworkId: '',//作业id；
//			comment:''//评价；
//		};
//{“r”：true}
var postDataPro_ModifyHomeworkResultComment=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINHOMEWORKURLTEACHER + 'ModifyHomeworkResultComment', enData, commonData, 2, wd, callback);
}


//16.修改答案评价
//所需参数
//		var comData = {
//			teacherId: '',//教师Id
//			answerResultId: '',//要修改的答案评价的id；
//			studentId: '',//学生Id；
//			classId: '',//班级群Id；
//			comment:''//评价；
//		};
//{“r”：true}
var postDataPro_ModifyAnswerResultComment=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINHOMEWORKURLTEACHER + 'ModifyAnswerResultComment', enData, commonData, 2, wd, callback);
}


//17.获取所有科目列表
//所需参数
//		var comData = {
//		};
var postDataPro_GetSubjectList=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINHOMEWORKURLTEACHER + 'GetSubjectList', enData, commonData, 2, wd, callback);
}

//18.描述：文件上传,逻辑：如果是图片类型，同时生成缩略图
//所需参数
//		var comData = {
//			teacherId:'',//教师Id
//			fileType:'',//文件类型，1：图片；2：音频；3：视频；
//			filename:'',//文件名，带后缀；
//			fileStream:'',//base64格式的文件流；
//			displayOrder:''//文件显示的顺序
//		};
var postDataPro_UploadAnswerFile=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINHOMEWORKURLTEACHER + 'UploadAnswerFile', enData, commonData, 2, wd, callback);
}


//-------------------------------------------------------------学生、家长-----------------------------------------------------------



//1.	获取学生作业列表，逻辑：获取当前学生在当前班级的作业列表，默认近1周数据，每次多加载1
//所需参数
//		var comData = {
//			studentId: '',//学生Id
//			classId: '',//班级群Id；
//			pageIndex:''//当前页码，默认1；
//		};
var postDataPro_GetHomeworkListStu=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINHOMEWORKURLSTUDENT + 'GetHomeworkList', enData, commonData, 2, wd, callback);
}


//2.	获取教师发布作业详情，不包括学生提交的答案；
//所需参数
//		var comData = {
//			studentId: '',//学生Id
//			classId: '',//班级群Id；
//			homeworkId:''//作业id；
//		};
var postDataPro_GetHomeworkStu=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINHOMEWORKURLSTUDENT + 'GetHomework', enData, commonData, 2, wd, callback);
}


//3.	获取作业结果和评价
//所需参数
//		var comData = {
//			studentId: '',//学生Id
//			classId: '',//班级群Id；
//			homeworkId:''//作业id；
//		};
var postDataPro_GetHomeworkResultStu=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINHOMEWORKURLSTUDENT + 'GetHomeworkResult', enData, commonData, 2, wd, callback);
}


//4.	获取答案结果和评价；
//所需参数
//		var comData = {
//			studentId: '',//学生Id
//			classId: '',//班级Id；
//			answerResultId:''//答案结果id；
//		};
var postDataPro_GetAnswerResultStu=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINHOMEWORKURLSTUDENT + 'GetAnswerResult', enData, commonData, 2, wd, callback);
}

//5.	上传文件；逻辑：如果是图片类型，同时生成缩略图
//所需参数
//		var comData = {
//			userId: '',//学生/家长Id；
//			fileType: '',//文件类型，1：图片；2：音频；3：视频；
//			filename: '',//文件名，带后缀；
//			fileStream:'',//base64格式的文件流；
//			displayOrder:''//文件显示的顺序
//		};
var postDataPro_UploadFileStu=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINHOMEWORKURLSTUDENT + 'UploadFile', enData, commonData, 2, wd, callback);
}


//6.	提交答案结果
//所需参数
//		var comData = {
//			userId: '',//学生/家长id，
//			classId: '',//班级id
//			studentId: '',//学生Id；
//			fileIds: '',//文件id数组；
//			teacherId: '',//老师Id；
//			teacherName:''//老师名字；
//		};
//{“AnswerResultId”：3}
var postDataPro_SubmitAnswerResult=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINHOMEWORKURLSTUDENT + 'SubmitAnswerResult', enData, commonData, 2, wd, callback);
}


//7.	提交作业结果；逻辑：如果是图片类型，同时生成缩略图
//所需参数
//		var comData = {
//			userId: '',//学生/家长id，
//			studentId: '',//学生Id；
//			homeworkId: '',//作业id；
//			content: '',//文本答案；
//			fileIds:''//文件id数组；
//		};
//{“HomeworkResultId”：3}
var postDataPro_SubmitHomeworkResult=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINHOMEWORKURLSTUDENT + 'SubmitHomeworkResult', enData, commonData, 2, wd, callback);
}


//8.修改答案结果；
//所需参数
//		var comData = {
//			userId: '',//学生/家长id，
//			studentId: '',//学生Id；
//			answerResultId: '',//要修改的答案id；
//			fileIds: '',//文件id数组；
//			teacherId: '',//老师Id；
//			teacherName:''//老师名字；
//		};
//{“r”：true}
var postDataPro_ModifyAnswerResult=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINHOMEWORKURLSTUDENT + 'ModifyAnswerResult', enData, commonData, 2, wd, callback);
}


//9.修改作业结果；逻辑：如果是图片类型，同时生成缩略图
//所需参数
//		var comData = {
//			userId: '',//学生/家长id，
//			studentId: '',//学生Id；
//			homeworkResultId: '',//要修改的作业结果id；
//			content: '',//文本答案；
//			fileIds:''//文件id串，例如“1,2”；
//		};
//{“r”：true}
var postDataPro_ModifyHomeworkResult=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINHOMEWORKURLSTUDENT + 'ModifyHomeworkResult', enData, commonData, 2, wd, callback);
}


//10.获取老师上传答案详情；逻辑：根据学生上传答案匹配出来的老师答案，不仅限于当前老师上传的答案；
//所需参数
//		var comData = {
//			studentId: '',//学生Id
//			answerResultId:''//学生上传答案id；
//		};
var postDataPro_GetAnswerStu=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINHOMEWORKURLSTUDENT + 'GetAnswer', enData, commonData, 2, wd, callback);
}


//11.获取错题列表；
//所需参数
//		var comData = {
//			studentId:''//学生Id；
//		};
var postDataPro_GetErrorList=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINHOMEWORKURLSTUDENT + 'GetErrorList', enData, commonData, 2, wd, callback);
}


//12.获取错题详情；
//所需参数
//		var comData = {
//			studentId: '',//学生Id
//			errorId:''//错题id；
//		};
var postDataPro_GetError=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINHOMEWORKURLSTUDENT + 'GetError', enData, commonData, 2, wd, callback);
}


//13.获取作业记录；逻辑：不区分班级，默认近1周数据，每次多加载1周数据；
//所需参数
//		var comData = {
//			studentId:'',//学生Id
//			pageIndex:''//当前页码，默认1；
//		};
var postDataPro_GetHomeworkRecord=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINHOMEWORKURLSTUDENT + 'GetHomeworkRecord', enData, commonData, 2, wd, callback);
}

//14.获取学生作业记录；逻辑：不区分班级，默认近1周数据，每次多加载1周数据；
//所需参数
//		var comData = {
//			userId:'',//学生/家长Id；
//			pageIndex:'',//页码，从1开始；
//			pageSize:''//每页记录数；
//		};
var postDataPro_GetHomeworkAlert=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINHOMEWORKURLSTUDENT + 'GetHomeworkAlert', enData, commonData, 2, wd, callback);
}

//15.更新我的提醒查看时间；逻辑：不保存是谁看的，保留最后查看时间；
//所需参数
//		var comData = {
//			alertId:''//作业提醒Id；//16 返回数据Data中的TabId
//		};
var postDataPro_ModifyAlertCheck=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINHOMEWORKURLSTUDENT + 'ModifyAlertCheck', enData, commonData, 2, wd, callback);
}

//16.描述：文件上传,逻辑：如果是图片类型，同时生成缩略图
//所需参数
//		var comData = {
//			userId:'',//学生/家长Id；
//			fileType:'',//文件类型，1：图片；2：音频；3：视频；
//			filename:'',//文件名，带后缀；
//			fileStream:'',//base64格式的文件流；
//			displayOrder:''//文件显示的顺序
//		};
var postDataPro_UploadAnswerFileStu=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINHOMEWORKURLSTUDENT + 'UploadAnswerFile', enData, commonData, 2, wd, callback);
}

//17.获取学生作业记录；逻辑：不区分班级，默认近1周数据，每次多加载1周数据；
//所需参数
//		var comData = {
//			userId:'',//学生/家长Id；
//			pageSize:''//每页记录数；
//		};
var postDataPro_GetHomeworkAlertCount=function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINHOMEWORKURLSTUDENT + 'GetHomeworkAlertCount', enData, commonData, 2, wd, callback);
}