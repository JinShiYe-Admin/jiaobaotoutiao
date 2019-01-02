//在求知中，详情页，进行删除操作时调用

//data{
//	flag:求知：提问1，回答2，评论3；班级空间：班级动态4；个人空间：个人动态5，个人动态评论6，档案:个人档案7，档案内容10，
//	comData:协议需要参数
//	title:弹出框中，显示的标题
//	buttons:弹出的列表,格式为：[{title:标题，btnFlag:要做的操作}]，btnFlag：1删除，2修改，3屏蔽，4取消屏蔽，5重命名
//	delFlag:删除确认弹出框格式，1从下弹出，2中间confirm
//}
//callback:返回字典，flag为buttons中的操作，data为协议数据
var operationFlag; //区分用于调用哪个协议，删除提问1，删除回答2，删除评论3；班级空间：删除班级动态4；个人空间：删除个人动态5，删除个人动态评论6，屏蔽回答8，取消屏蔽回答9
var delContent_pop = function(data, callback) {
	if(data.delFlag == 1) { //1从下弹出
		plus.nativeUI.actionSheet({
			title: data.title,
			cancel: "取消",
			buttons: data.buttons
		}, function(e) {
			var index = e.index;
			if(index > 0) {
				var tempbtn = data.buttons[index - 1];
				//console.log('tempbtn.value=' + tempbtn.title);
				var temp = {
					flag: tempbtn.btnFlag
				}
				if(tempbtn.btnFlag == 1) { //删除
					data.buttons = [tempbtn];
					data.title = '确定删除？';
					data.delFlag = 2;
					delContent_pop(data, callback);
				} else if(tempbtn.btnFlag == 2) { //修改
					callback(temp);
				} else if(tempbtn.btnFlag == 3) { //屏蔽
					if(data.flag == 2) {
						operationFlag = 8;
						delContent_req(data, tempbtn, callback);
					}
				} else if(tempbtn.btnFlag == 4) { //取消屏蔽
					if(data.flag == 2) {
						operationFlag = 9;
						delContent_req(data, tempbtn, callback);
					}
				} else if(tempbtn.btnFlag == 5) { //重命名
					callback(temp);
				}
			}
		});
	} else { //2从中间弹出confirm
		mui.confirm('', data.title, ['取消', '确定'], function(e) {
			var index = e.index;
			switch(index) {
				case 0: //取消
					break;
				case 1: //确定
					operationFlag = data.flag;
					delContent_req(data, data.buttons[0], callback);
					break;
			}
		}, 'div');
	}
}

var delContent_req = function(data1, btn, callback) {
	// 等待的对话框
	var wd = events.showWaiting();
	var temp = {
		flag: btn.btnFlag,
		wd: wd,
		data: ''
	}
	if(operationFlag == 1) { //删除提问1
		//37.删除某个用户的某条提问
		postDataQZPro_delAskById(data1.comData, wd, function(data) {
			//console.log('37.删除某个用户的某条提问:' + data.RspCode + ',RspData:' + JSON.stringify(data.RspData) + ',RspTxt:' + data.RspTxt);
			temp.data = data;
			callback(temp);
			//			if(data.RspCode == 0) {
			//
			//			} else {
			//				mui.toast(data.RspTxt);
			//			}
		});
	} else if(operationFlag == 2) { //删除回答2
		//11.删除某个用户的某条回答
		postDataQZPro_delAnswerById(data1.comData, wd, function(data) {
			//			wd.close();
			//console.log('11.删除某个用户的某条回答:' + data.RspCode + ',RspData:' + JSON.stringify(data.RspData) + ',RspTxt:' + data.RspTxt);
			temp.data = data;
			callback(temp);
			//			if(data.RspCode == 0) {
			//
			//			} else {
			//				mui.toast(data.RspTxt);
			//			}
		});
	} else if(operationFlag == 3) { //删除评论3
		//18.删除某条回答的评论
		postDataQZPro_delCommentById(data1.comData, wd, function(data) {
			//			wd.close();
			//console.log('18.删除某条回答的评论:' + data.RspCode + ',RspData:' + JSON.stringify(data.RspData) + ',RspTxt:' + data.RspTxt);
			//			if(data.RspCode == 0) {
			temp.data = data;
			callback(temp);
			//			} else {
			//				mui.toast(data.RspTxt);
			//			}
		});
	} else if(operationFlag == 4) { //删除班级动态4
		//24.（班级空间）删除某班级空间
		postDataPro_delClassSpaceById(data1.comData, wd, function(data) {
			//			wd.close();
			//console.log('24.（班级空间）删除某班级空间:' + data.RspCode + ',RspData:' + JSON.stringify(data.RspData) + ',RspTxt:' + data.RspTxt);
			//			if(data.RspCode == 0) {
			temp.data = data;
			callback(temp);
			//			} else {
			//				mui.toast(data.RspTxt);
			//			}
		});
	} else if(operationFlag == 5) { //删除个人动态5
		//46.（用户空间）删除某用户空间
		postDataPro_delUserSpaceById(data1.comData, wd, function(data) {
			//			wd.close();
			//console.log('46.（用户空间）删除某用户空间:' + data.RspCode + ',RspData:' + JSON.stringify(data.RspData) + ',RspTxt:' + data.RspTxt);
			//			if(data.RspCode == 0) {
			temp.data = data;
			callback(temp);
			//			} else {
			//				mui.toast(data.RspTxt);
			//			}
		});
	} else if(operationFlag == 6) { //删除个人动态评论6
		//47.（用户空间）删除某条用户空间评论
		postDataPro_delUserSpaceCommentById(data1.comData, wd, function(data) {
			//			wd.close();
			//console.log('47.（用户空间）删除某条用户空间评论:' + data.RspCode + ',RspData:' + JSON.stringify(data.RspData) + ',RspTxt:' + data.RspTxt);
			//			if(data.RspCode == 0) {
			temp.data = data;
			callback(temp);
			//			} else {
			//				mui.toast(data.RspTxt);
			//			}
		});
	} else if(operationFlag == 7) { //删除个人档案
		//90.（云档案）删除档案文件夹
		postDataPro_delStudentDoc(data1.comData, wd, function(data) {
			//			wd.close();
			//console.log('90.（云档案）删除档案文件夹:' + data.RspCode + ',RspData:' + JSON.stringify(data.RspData) + ',RspTxt:' + data.RspTxt);
			//			if(data.RspCode == 0) {
			temp.data = data;
			callback(temp);
			//			} else {
			//				mui.toast(data.RspTxt);
			//			}
		});
	} else if(operationFlag == 8 || operationFlag == 9) { //屏蔽回答8，取消屏蔽回答9
		//38.屏蔽某个用户的某条回答
		postDataQZPro_setAnswerOffById(data1.comData, wd, function(data) {
			//			wd.close();
			//console.log('38.屏蔽某个用户的某条回答:' + data.RspCode + ',RspData:' + JSON.stringify(data.RspData) + ',RspTxt:' + data.RspTxt);
			//			if(data.RspCode == 0) {
			temp.data = data;
			callback(temp);
			//			} else {
			//				mui.toast(data.RspTxt);
			//			}
		});
	} else if(operationFlag == 10) { //删除档案内容
		//85.（云档案）按ID删除学生档案内容
		postDataPro_delStudentFileByIds(data1.comData, wd, function(data) {
			//			wd.close();
			//console.log('85.（云档案）按ID删除学生档案内容:' + data.RspCode + ',RspData:' + JSON.stringify(data.RspData) + ',RspTxt:' + data.RspTxt);
			//			if(data.RspCode == 0) {
			temp.data = data;
			callback(temp);
			//			} else {
			//				mui.toast(data.RspTxt);
			//			}
		});
	} else {
		wd.close();
		callback('啥都不返回');
	}
}