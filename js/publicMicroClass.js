//本页面存放界面中需要的协议，接口作用、需要传值内容、调用的方法，求知

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

//1.获取所有课程
//所需参数
//		var comData = {
//			userId: '',//用户ID,登录用户
//			pageIndex: '',//当前页数
//			pageSize:''//每页记录数,传入0，获取总记录数
//		};
//返回值：
var postDataMCPro_getAllCourses = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINMICROCLASS + 'course/getAllCourses', enData, commonData, 2, wd, callback);
}

//2.获取所有关注的课程
//所需参数
//		var comData = {
//			userId: '',//用户ID,登录用户
//			pageIndex: '',//当前页数
//			pageSize:''//每页记录数,传入0，获取总记录数
//		};
//返回值：
var postDataMCPro_getAllFocusCourses = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINMICROCLASS + 'course/getAllFocusCourses', enData, commonData, 2, wd, callback);
}

//3.获取课程的节次
//所需参数
//		var comData = {
//			userId: '',//用户ID,登录用户
//			courseId: '',//课程ID
//			pageIndex: '',//当前页数
//			pageSize:''//每页记录数,传入0，获取总记录数
//		};
//返回值：
var postDataMCPro_getAllSectionsByCourse = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINMICROCLASS + 'course/getAllSectionsByCourse', enData, commonData, 2, wd, callback);
}

//4.获取课程信息
//所需参数
//		var comData = {
//			courseId:''//课程ID
//		};
//返回值：
var postDataMCPro_getCourseInfoById = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINMICROCLASS + 'course/getCourseInfoById', enData, commonData, 2, wd, callback);
}

//5.获取是否已对某个课程关注
//所需参数
//		var comData = {
//			userId: '',//用户ID,登录用户
//			courseId:''//课程ID
//		};
//返回值：非0为已关注
var postDataMCPro_getCourseFocusByUser = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINMICROCLASS + 'course/getCourseFocusByUser', enData, commonData, 2, wd, callback);
}

//6.设置对某个课程关注
//所需参数
//		var comData = {
//			userId: '',//用户ID,登录用户
//			courseId: '',//课程ID
//			status:''//关注状态，0 不关注，1 关注
//		};
//返回值：1为正确
var postDataMCPro_setCourseFocus = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINMICROCLASS + 'course/setCourseFocus', enData, commonData, 2, wd, callback);
}

//7.新增某小节课程的评论
//所需参数
//		var comData = {
//			secId: '',//小节ID
//			upperId: '',//上级评论ID，第一个评论传0，其他的传最上层的ID
//			userId: '',//评论用户ID
//			commentContent: '',//评论内容，
//			replyId:''//回复用户ID，新增评论的话传0，回复评论传用户ID
//		};
//返回值：非0为正确
var postDataMCPro_addSecComment = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINMICROCLASS + 'course/addSecComment', enData, commonData, 2, wd, callback);
}

//8.删除某小节课程的评论
//所需参数
//		var comData = {
//			commentId:''//评论ID
//		};
//返回值：1为正确
var postDataMCPro_delCommentById = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINMICROCLASS + 'course/delCommentById', enData, commonData, 2, wd, callback);
}

//9.设置某条评论的点赞
//所需参数
//		var comData = {
//			secId: '',//小节ID
//			commentId: '',//评论ID
//			userId: '',//点赞用户ID
//			status:''//点赞状态，0 取消点赞，1 点赞
//		};
//返回值：1为正确
var postDataMCPro_setCommentLike = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINMICROCLASS + 'course/setCommentLike', enData, commonData, 2, wd, callback);
}

//13.根据课程列表获取所有关注的课程
//所需参数
//		var comData = {
//			userId: '',//用户ID，登录用户
//			courseIds: '',//课程ID，例如[1,2,3]
//			pageIndex: '',//当前页数
//			pageSize:''//每页记录数，传入0，获取总记录数
//		};
//返回值：1为正确
var postDataMCPro_getAllFocusCoursesByIds = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINMICROCLASS + 'course/getAllFocusCoursesByIds', enData, commonData, 2, wd, callback);
}

//14.设置某小节的点赞
//所需参数
//		var comData = {
//			secId: '',//节次ID
//			userId: '',//点赞用户ID
//			status:''//点赞状态,0 取消点赞,1 点赞
//		};
//返回值：1为正确
var postDataMCPro_setSecLike = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINMICROCLASS + 'course/setSecLike', enData, commonData, 2, wd, callback);
}

//16.获取课程的节次
//所需参数
//		var comData = {
//			userId: '',//用户ID，登录用户
//			courseId: '',//课程ID
//			secId: '',//节次ID
//			pageIndex: '',//当前页数
//			pageSize:''//每页记录数，传入0，获取总记录数
//		};
//返回值：
var postDataMCPro_getSectionById = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINMICROCLASS + 'course/getSectionById', enData, commonData, 2, wd, callback);
}

//17.获取是否已对某个小节屏蔽
//所需参数
//		var comData = {
//			secId:''//小节ID
//		};
//返回值：非0为已屏蔽
var postDataMCPro_getCourseOffByUser = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINMICROCLASS + 'course/getCourseOffByUser', enData, commonData, 2, wd, callback);
}