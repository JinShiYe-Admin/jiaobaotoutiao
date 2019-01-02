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

//1.获取所有话题
//所需参数
//		var comData = {
//			pageIndex: '',//当前页数
//			pageSize:''//每页记录数,传入0，获取总记录数
//		};
//返回值：model_Channel
var postDataQZPro_getAllChannels = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINQIUZHI + 'askAnswer/getAllChannels', enData, commonData, 2, wd, callback);
}

//2.获取符合条件的专家信息
//所需参数
//		var comData = {
//			askId: '',//问题ID，传入0，则不包括问题参数
//			userIds: '',//用户编号列表,Array,传入0，获取所有专家
//			channelId:'',//话题ID,传入0，获取所有话题数据
//			pageIndex: '',//当前页数
//			pageSize:''//每页记录数,传入0，获取总记录数
//		};
//返回值：model_expert
var postDataQZPro_getExpertsByCondition = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINQIUZHI + 'askAnswer/getExpertsByCondition', enData, commonData, 2, wd, callback);
}

//3.获取某个用户的信息
//所需参数
//		var comData = {
//			userId: ''//用户ID
//		};
//返回值：model_QZUserInfo
var postDataQZPro_getUserInfo = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINQIUZHI + 'askAnswer/getUserInfo', enData, commonData, 2, wd, callback);
}

//4.获取所有符合条件问题
//所需参数
//		var comData = {
//			userId: '',//用户ID
//			askTitle: '',//问题标题,用于查找，可输入部分标题
//			channelId:'',//话题ID,传入0，获取所有话题数据
//			pageIndex: '',//当前页数
//			pageSize:''//每页记录数,传入0，获取总记录数
//		};
//返回值：model_QZAsk
var postDataQZPro_getAsksByCondition = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINQIUZHI + 'askAnswer/getAsksByCondition', enData, commonData, 2, wd, callback);
}

//5.获取某个问题的详情
//所需参数
//		var comData = {
//			userId: '',//用户ID
//			askId: '',//问题ID
//			orderType:'',//回答排序方式,1 按时间排序,2 按质量排序：点赞数+评论数
//			pageIndex: '',//当前页数
//			pageSize:''//每页记录数,传入0，获取总记录数
//		};
//返回值：model_QZAskDetail,model_QZAnswer
var postDataQZPro_getAskById = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINQIUZHI + 'askAnswer/getAskById', enData, commonData, 2, wd, callback);
}

//6.新增某个用户提交问题
//所需参数
//		var comData = {
//			askTitle: '',//问题标题,200
//			askNote:'',//问题说明,2000
//			encType:'',//附件类型,1图片,2视频,3仅文字,4音频,5图文混排
//			encLen:'',//音视频时长
//			encAddr:'',//附件地址,300,多个的情况例如：1.jpg|2.jpg
//			thumbnail: '',//缩略图,3000,
//			cutImg: '',//剪切图,3000,
//			askChannel: '',//问题话题
//			askMan:'',//提问人
//			isAnonym: '',//是否匿名
//			inviteExperts:''//邀请专家,例如[1,2,3]
//		};
//返回值：非0为正确
var postDataQZPro_addAsk = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINQIUZHI + 'askAnswer/addAsk', enData, commonData, 2, wd, callback);
}

//7.修改某个用户的某个问题
//所需参数
//		var comData = {
//			askId: '',//问题ID
//			askTitle: '',//问题标题,200
//			askNote:'',//问题说明,2000
//			encType:'',//附件类型，1图片，2视频，3仅文字，4音频，5图文混排
//			encLen:'',//音视频时长
//			thumbnail:'',//缩略图，3000
//			cutImg:'',//剪切图，3000
//			encAddr:''//附件地址,300,多个的情况例如：1.jpg|2.jpg
//		};
//返回值：1为正确
var postDataQZPro_setAskById = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINQIUZHI + 'askAnswer/setAskById', enData, commonData, 2, wd, callback);
}

//8.获取某个回答的详情
//所需参数
//		var comData = {
//			userId: '',//用户ID
//			answerId: '',//回答ID
//			orderType:'',//评论排序方式,1 时间正序排序,2 时间倒序排序
//			pageIndex: '',//当前页数
//			pageSize:''//每页记录数,传入0，获取总记录数
//		};
//返回值：model_QZAnswersDetail,model_QZComment
var postDataQZPro_getAnswerById = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINQIUZHI + 'askAnswer/getAnswerById', enData, commonData, 2, wd, callback);
}

//9.新增某个用户回答问题
//所需参数
//		var comData = {
//			askId: '',//问题ID
//			answerContent: '',//回答内容,4000
//			encType:'',//附件类型,1图片,2视频,3仅文字,4音频,5图文混排
//			encLen:'',//音视频时长
//			encAddr: '',//附件地址,300,多个的情况例如：1.jpg|2.jpg
//			thumbnail:'',//缩略图,3000
//			cutImg:'',//剪切图,3000
//			answerMan:'',//回答人
//			isAnonym:''//是否匿名
//		};
//返回值：非0为正确
var postDataQZPro_addAnswer = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINQIUZHI + 'askAnswer/addAnswer', enData, commonData, 2, wd, callback);
}

//10.修改某个用户的某条回答
//所需参数
//		var comData = {
//			answerId: '',//回答ID
//			answerContent:'',//回答内容,4000
//			encType:'',//附件类型，1图片，2视频，3仅文字，4音频，5图文混排
//			encLen:'',//音视频时长
//			thumbnail:'',//缩略图，3000
//			cutImg:'',//剪切图，3000
//			encAddr:''//附件地址,300,多个的情况例如：1.jpg|2.jpg
//		};
//返回值：1为正确
var postDataQZPro_setAnswerById = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINQIUZHI + 'askAnswer/setAnswerById', enData, commonData, 2, wd, callback);
}

//11.删除某个用户的某条回答
//所需参数
//		var comData = {
//			answerId:''//回答ID
//		};
//返回值：1为正确
var postDataQZPro_delAnswerById = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINQIUZHI + 'askAnswer/delAnswerById', enData, commonData, 2, wd, callback);
}

//12.新增某个问题的查看数量
//所需参数
//		var comData = {
//			askId:''//问题ID
//		};
//返回值：1为正确
var postDataQZPro_addAskRead = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINQIUZHI + 'askAnswer/addAskRead', enData, commonData, 2, wd, callback);
}

//13.获取是否已对某个问题关注
//所需参数
//		var comData = {
//			userId: '',//用户ID
//			askId:''//问题ID
//		};
//返回值：非0为已关注
var postDataQZPro_getAskFocusByUser = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINQIUZHI + 'askAnswer/getAskFocusByUser', enData, commonData, 2, wd, callback);
}

//14.设置某个问题的关注
//所需参数
//		var comData = {
//			userId: '',//用户ID
//			askId: '',//问题ID
//			status:''//关注状态,0 不关注,1 关注
//		};
//返回值：1为正确
var postDataQZPro_setAskFocus = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINQIUZHI + 'askAnswer/setAskFocus', enData, commonData, 2, wd, callback);
}

//15.获取某个问题的关注列表
//所需参数
//		var comData = {
//			askId: '',//问题ID
//			pageIndex: '',//当前页数
//			pageSize:''//每页记录数,传入0，获取总记录数
//		};
//返回值：UserId:用户ID,UserNote:用户简介
var postDataQZPro_getFocusUsersByAsk = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINQIUZHI + 'askAnswer/getFocusUsersByAsk', enData, commonData, 2, wd, callback);
}

//16.获取某条评论
//所需参数
//		var comData = {
//			userId:'',//	用户ID
//			answerId:'',//回答ID
//			commentId:''//评论ID
//		};
//返回值：model_QZComment
var postDataQZPro_getCommentById = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINQIUZHI + 'askAnswer/getCommentById', enData, commonData, 2, wd, callback);
}

//17.新增某条回答的评论
//所需参数
//		var comData = {
//			answerId: '',//回答ID
//			upperId:'',//上级评论ID,第一个评论传0，其他的传最上层的ID
//			userId: '',//评论用户ID,
//			commentContent: '',//评论内容
//			replyId:''//回复用户ID,新增评论的话传0，回复评论传用户ID
//		};
//返回值：非0为正确
var postDataQZPro_addAnswerComment = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINQIUZHI + 'askAnswer/addAnswerComment', enData, commonData, 2, wd, callback);
}

//18.删除某条回答的评论
//所需参数
//		var comData = {
//			commentId:''//评论ID
//		};
//返回值：1为正确
var postDataQZPro_delCommentById = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINQIUZHI + 'askAnswer/delCommentById', enData, commonData, 2, wd, callback);
}

//19.获取是否已对某条回答点赞
//所需参数
//		var comData = {
//			userId: '',//用户ID
//			answerId:''//回答ID
//		};
//返回值：非0为已点赞
var postDataQZPro_getAnswerLikeByUser = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINQIUZHI + 'askAnswer/getAnswerLikeByUser', enData, commonData, 2, wd, callback);
}

//20.设置某条回答的点赞
//所需参数
//		var comData = {
//			answerId: '',//回答ID
//			userId: '',//点赞用户ID
//			status:''//点赞状态,0 取消点赞,1 点赞
//		};
//返回值：1为正确
var postDataQZPro_setAnswerLike = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINQIUZHI + 'askAnswer/setAnswerLike', enData, commonData, 2, wd, callback);
}

//21.修改某个用户的个人简介
//所需参数
//		var comData = {
//			userId: '',//用户ID
//			userNote:''//用户简介,500
//		};
//返回值：1为正确
var postDataQZPro_setUserNoteById = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINQIUZHI + 'askAnswer/setUserNoteById', enData, commonData, 2, wd, callback);
}

//22.获取是否已对某个用户关注
//所需参数
//		var comData = {
//			userId: '',//用户ID
//			focusUserId:''//关注用户ID
//		};
//返回值：非0为已关注
var postDataQZPro_getUserFocusByUser = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINQIUZHI + 'askAnswer/getUserFocusByUser', enData, commonData, 2, wd, callback);
}

//23.设置对某个用户的关注
//所需参数
//		var comData = {
//			userId: '',//用户ID
//			focusUserId: '',//关注用户ID
//			status:''//关注状态,0 不关注,1 关注
//		};
//返回值：1为正确
var postDataQZPro_setUserFocus = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINQIUZHI + 'askAnswer/setUserFocus', enData, commonData, 2, wd, callback);
}

//24.获取某个用户的回答列表
//所需参数
//		var comData = {
//			userId: '',//用户ID
//			pageIndex: '',//当前页数
//			pageSize:''//每页记录数,传入0，获取总记录数
//		};
//返回值：model_QZAnswersDetail
var postDataQZPro_getAnswersByUser = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINQIUZHI + 'askAnswer/getAnswersByUser', enData, commonData, 2, wd, callback);
}

//25.获取某个用户的提问列表
//所需参数
//		var comData = {
//			userId: '',//用户ID
//			pageIndex: '',//当前页数
//			pageSize:''//每页记录数,传入0，获取总记录数
//		};
//返回值：model_QZAskDetail
var postDataQZPro_getAsksByUser = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINQIUZHI + 'askAnswer/getAsksByUser', enData, commonData, 2, wd, callback);
}

//26.获取某个用户的关注问题列表
//所需参数
//		var comData = {
//			userId: '',//用户ID
//			pageIndex: '',//当前页数
//			pageSize:''//每页记录数,传入0，获取总记录数
//		};
//返回值：model_QZAskDetail
var postDataQZPro_getFocusAsksByUser = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINQIUZHI + 'askAnswer/getFocusAsksByUser', enData, commonData, 2, wd, callback);
}

//27.获取某个用户的关注人列表
//所需参数
//		var comData = {
//			userId: '',//用户ID,登录用户
//			focusId:'',//关注用户ID,查看用户
//			pageIndex: '',//当前页数
//			pageSize:''//每页记录数,传入0，获取总记录数
//		};
//返回值：UserId:用户ID,UserNote:用户简介，FocusType：关注情况，0 未关注，1 已关注，2 相互关注，3 无法关注（自己）
var postDataQZPro_getFocusUsersByUser = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINQIUZHI + 'askAnswer/getFocusUsersByUser', enData, commonData, 2, wd, callback);
}

//28.获取某个用户的被人关注列表
//所需参数
//		var comData = {
//			userId: '',//用户ID，登录用户
//			focusId:'',//关注用户ID,查看用户
//			pageIndex: '',//当前页数
//			pageSize:''//每页记录数,传入0，获取总记录数
//		};
//返回值：UserId:用户ID,UserNote:用户简介，，FocusType：关注情况，0 未关注，1 已关注，2 相互关注，3 无法关注（自己）
var postDataQZPro_getIsFocusedByUser = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINQIUZHI + 'askAnswer/getIsFocusedByUser', enData, commonData, 2, wd, callback);
}

//29.获取是否已对某条评论点赞
//所需参数
//		var comData = {
//			userId: '',//用户ID
//			commentId: '',//评论ID
//			answerId:''//回答ID
//		};
//返回值：非0为已点赞
var postDataQZPro_getCommentLikeByUser = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINQIUZHI + 'askAnswer/getCommentLikeByUser', enData, commonData, 2, wd, callback);
}

//30.设置某条评论的点赞
//所需参数
//		var comData = {
//			commentId: '',//评论ID
//			userId:'',//点赞用户ID
//			answerId: '',//回答ID
//			status:''//点赞状态，0 取消点赞，1 点赞
//		};
//返回值：1为正确
var postDataQZPro_setCommentLike = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINQIUZHI + 'askAnswer/setCommentLike', enData, commonData, 2, wd, callback);
}

//31.消息提醒
//所需参数
//		var comData = {
//			userId: '',//用户ID
//			pageIndex: '',//当前页数
//			pageSize:''//每页记录数
//		};
//返回值：model_QZetNotification
var postDataQZPro_getNotification = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINQIUZHI + 'askAnswer/getNotification', enData, commonData, 2, wd, callback);
}

//32.消息提醒置为已读
//所需参数
//		var comData = {
//			userId: '',//用户ID
//			msgTypes:''//信息类型，Array	是	否	body	1 回答我的提问，2 回答我关注的提问,3 问题的回答被点赞,4 回答下的评论被点赞,5 问题的回答被评论,6 回答下的评论被回复,7 问题被邀请,8 被人关注另：打开消息提醒时可调用[1,2,3,4,5,6,7,8]同时设为已读。
//		};
//返回值：1为正确
var postDataQZPro_setNotiReadByUser = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINQIUZHI + 'askAnswer/setNotiReadByUser', enData, commonData, 2, wd, callback);
}

//33.获取某个用户的评论列表
//所需参数
//		var comData = {
//			userId: '',//用户ID
//			pageIndex: '',//当前页数
//			pageSize:''//每页记录数,传入0，获取总记录数
//		};
//返回值：model_QZCommentsByUser
var postDataQZPro_getCommentsByUser = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINQIUZHI + 'askAnswer/getCommentsByUser', enData, commonData, 2, wd, callback);
}

//34.邀请某人回答
//所需参数
//		var comData = {
//			inviteMan: '',//邀请人ID
//			askId: '',//问题ID
//			expertId:''//专家ID
//		};
//返回值：1为正确
var postDataQZPro_addInvite = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINQIUZHI + 'askAnswer/addInvite', enData, commonData, 2, wd, callback);
}

//35.获取是否已对某人邀请此回答
//所需参数
//		var comData = {
//			askId: '',//问题ID
//			expertId:''//专家ID
//		};
//返回值：非0为已邀请
var postDataQZPro_getInviteByUser = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINQIUZHI + 'askAnswer/getInviteByUser', enData, commonData, 2, wd, callback);
}

//36.获取某个用户的被邀请问题列表
//所需参数
//		var comData = {
//			userId: '',//用户ID
//			pageIndex: '',//当前页数
//			pageSize:''//每页记录数,传入0，获取总记录数
//		};
//返回值：InviteMan	邀请人ID	int；AskId	问题ID	int；AskTitle	问题标题	String；AskChannel	问题话题；AskChannelId	，问题话题ID
var postDataQZPro_getInviteAsksByUser = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINQIUZHI + 'askAnswer/getInviteAsksByUser', enData, commonData, 2, wd, callback);
}

//37.删除某个用户的某条提问
//所需参数
//		var comData = {
//			askId: ''//提问ID
//		};
//返回值：1为正确
var postDataQZPro_delAskById = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINQIUZHI + 'askAnswer/delAskById', enData, commonData, 2, wd, callback);
}

//38.屏蔽某个用户的某条回答
//所需参数
//		var comData = {
//			answerId: '',//回答ID
//			status:''//屏蔽状态,0 取消屏蔽,1 屏蔽
//		};
//返回值：1为正确
var postDataQZPro_setAnswerOffById = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINQIUZHI + 'askAnswer/setAnswerOffById', enData, commonData, 2, wd, callback);
}

//39.获取问题列表
//所需参数
//		var comData = {
//			askIds:''//问题ID列表，Array，	例如[1,2,3]
//		};
//返回值：model_Channel
var postDataQZPro_getAskByIds = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINQIUZHI + 'askAnswer/getAskByIds', enData, commonData, 2, wd, callback);
}

//40.获取用户列表
//所需参数
//		var comData = {
//			userIds:''//用户ID列表,Array,例如[1,2,3]
//		};
//返回值：[{UserId:用户ID,UserNote:用户简介}]
var postDataQZPro_getUsersByIds = function(commonData, wd, callback) {
	//需要加密的数据
	var enData = {};
	//发送网络请求，data为网络返回值
	postDataEncry(storageKeyName.MAINQIUZHI + 'askAnswer/getUsersByIds', enData, commonData, 2, wd, callback);
}