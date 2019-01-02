var personalUTID; //个人id
var role; //角色
var imgs; //图片数据
var stuSubmitAnswer; //true学生提交答案||FALSE学生修改答案
var answerResultId; //学生答案id
var teaInfo;
mui.init();
mui.plusReady(function() {
//	events.preload('homework-commented.html', 200);
	mui.previewImage();
	/**
	 * 作业主界面传值的监听
	 */
	window.addEventListener('roleInfo', function(e) {
		personalUTID = parseInt(myStorage.getItem(storageKeyName.PERSONALINFO).utid);
		answerResultId = null;
		stuSubmitAnswer = true;
		events.clearChild(document.getElementById('pictures'));
		document.getElementById('post-imgs').innerText = '上传';
		imgs = [];
		document.getElementById('checkResult').style.display = 'none';
		//console.log('上传答案||作业界面获取的上级页面传过来的信息：' + JSON.stringify(e.detail));
		var data = e.detail.data;
		role = data.role;
		var studentClasses = data.studentClasses;
		setCondition(role, studentClasses);
	})
	/**
	 * 更改答案的监听
	 */
	window.addEventListener('modifyAnswer', function(e) {
		personalUTID = parseInt(myStorage.getItem(storageKeyName.PERSONALINFO).utid);
		//console.log('上个页面传回来的值：' + JSON.stringify(e.detail.data));
		answerResultId = e.detail.data.AnswerResultId;
		imgs = [];
		stuSubmitAnswer = false;
		events.clearChild(document.getElementById('pictures'));
		document.getElementById('post-imgs').innerText = '修改';
		getStudentClasses(setCondition);
	})

	/**
	 * 通过系统相机获取图片
	 * 并显示在界面上
	 */
	events.addTap('getAnswer', function() {
		camera.getPic(camera.getCamera(), function(picPath) {
			plus.nativeUI.showWaiting(storageKeyName.WAITING);
			if(role == 2) {
				saveSpace = storageKeyName.TEAPICBUCKET;
			} else {
				saveSpace = storageKeyName.STUPICBUCKET;
			}
			var data=CloudFileUtil.getSingleUploadDataOptions(picPath,3,200,0,saveSpace);
			var img;
			CloudFileUtil.getQNUpTokenWithManage(storageKeyName.QNGETUPLOADTOKEN, data.options, function(datas) {
				//console.log("获取的数据：" + JSON.stringify(datas));
				if(datas.Status == 1) {
					var tokenInfo = datas.Data;
					//压缩照片
					compress.compressPIC(picPath, function(event) {
						CloudFileUtil.uploadFile(tokenInfo, event.target, function(uploadData, status) {
							//console.log(JSON.stringify(uploadData));
							img={
								url:tokenInfo.Domain+tokenInfo.Key,
								thumb:tokenInfo.OtherKey[data.thumbKey],
								type:1
							}
							plus.nativeUI.closeWaiting();
							setPic(img);
						});
					})

				}
			}, function(xhr, type, errorThrown) {
				//console.log("错误类型：" + type + errorThrown);
				plus.nativeUI.closeWaiting();
			});
		})
	});
	/**
	 * 查看结果按钮点击事件
	 */
	events.addTap('checkResult', function() {
		if(teaInfo) {
			var teachers_container = document.getElementById('receive-teachers'); //selectid
			teaInfo = teachers_container.options[teachers_container.selectedIndex].teaInfo;
		}
		jQuery.extend(teaInfo, {
			AnswerResultId: answerResultId,
			workType: 0
		})
		//console.log('传递的answerResultId：' + answerResultId);
		events.openNewWindowWithData('homework-commented.html',teaInfo)
//		events.fireToPageWithData('homework-commented.html', 'workDetail', teaInfo);
	})
//	//删除图标的点击事件
//	mui('#pictures').on('tap', '.icon-guanbi', function() {
//		CloudFileUtil.files.splice(CloudFileUtil.files.indexOf(this.parentElement.img), 1);
//		//删除图片
//		pictures.removeChild(this.parentElement);
//	})
	CloudFileUtil.setDelPicListener();
	addPostEventListener();
})
var addPostEventListener = function() {
	
	//上传按钮点击事件
	events.addTap('post-imgs', function() {
		//console.log('修改答案字符串'+JSON.stringify(imgs));
		if(imgs.length > 0) {
			//选择的科目id
			var selectSubjectID = jQuery('#publish-subjects').val();
			setOrder(imgs);
			//判断当前显示的是老师身份0，还是家长、学生身份1
			if(role == 2) {
				//14.发布答案,只能上传图片；
				//所需参数
				var comData = {
					teacherId: personalUTID, //教师Id
					subjectId: selectSubjectID, //科目Id， 见（一）.17. GetSubjectList()；
					files: imgs //上传文件的id串，例如“1,2”；
				};
				requestPublishAnswer(comData);
			} else {
				var teachers_container = document.getElementById('receive-teachers'); //selectid
				teaInfo = teachers_container.options[teachers_container.selectedIndex].teaInfo;
				//判断是要学生提交答案0，还是修改答案1
				//console.log('teaInfo:' + JSON.stringify(teaInfo))
				if(stuSubmitAnswer) {
					//6.	提交答案结果
					//所需参数
					var comData = {
						userId: personalUTID, //学生/家长id，
						classId: teaInfo.gid, //班级id
						studentId: personalUTID, //学生Id；
						files: imgs, //文件id数组；
						teacherId: teaInfo.utid, //老师Id；
						teacherName: "" //老师名字；
					};
					//					TeacherId=teaInfo.utid;
					requestSubmitAnswer(comData);
				} else {
					//8.修改答案结果；
					//所需参数
					var comData = {
						userId: personalUTID, //学生/家长id，
						studentId: personalUTID, //学生Id；
						answerResultId: answerResultId, //要修改的答案id；
						files: imgs.toString(), //文件id数组；
						teacherId: teaInfo.utid, //老师Id；
						teacherName: "" //老师名字；
					};
					//					TeacherId=teaInfo.utid;
					requestModifyAnswer(comData);
				}
			}
		} else {
			mui.toast('请拍照后上传');
		}
	})
}
var setOrder=function(imgs){
	for(var i in imgs){
		imgs[i].order=i;
	}
	return imgs;
}
var getStudentClasses = function(callback) {
	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
	//9.获取用户群
	postDataPro_PostGList({
		vtp: 'ag', //要获取的项:cg(创建的群),ug(参与群),mg(协管的群),ag(所有的群),ig(群信息vvl对应群ID)
		vvl: personalUTID //查询的各项，对应人的utid，可以是查询的任何人
	}, wd, function(data) {
		wd.close();
		//console.log('获取的群信息：' + JSON.stringify(data));
		var studentClasses = [];
		if(data.RspCode == 0) {
			for(var i in data.RspData) {
				//家长、学生
				if(data.RspData[i].mstype == 0 || data.RspData[i].mstype == 3) {
					studentClasses.push(data.RspData[i]);
				}
			}
			studentClasses = arraySingleItem(studentClasses);
			setCondition(30, studentClasses);
		}else{
			mui.toast(data.RspTxt);
		}
	})
}
var arraySingleItem = function(array) {
	var r = [];
	for(var i = 0, l = array.length; i < l; i++) {
		for(var j = i + 1; j < l; j++)
			if(array[i].gid == array[j].gid) {
				j = ++i;
			}
		r.push(array[i]);
	}
	return r;
}

/**
 * 
 * @param {Object} picPath
 * @param {Object} fileStream
 */
//var uploadFile = function(picPath, fileStream) {
//	var comData = {
//		fileType: 1, //文件类型，1：图片；2：音频；3：视频；
//		fileName: picPath.split('/')[1], //文件名，带后缀；
//		fileStream: fileStream, //base64格式文件流；
//		displayOrder: imgIds ? imgIds.length : 0 //图片顺序；
//	};
//	if(role == 2) {
//		comData.teacherId = personalUTID;
//		uploadFileTeacher(picPath, comData, setPic);
//	} else {
//		comData.userId = personalUTID;
//		uploadFileStudent(picPath, comData, setPic)
//	}
//}
/**
 * 
 * @param {Object} picPath 
 * //“FileId”：1，       //附件id
	//“FileName”：”xxx.png”,       //附件名
	//“FileType”：1,       //附件类型
	//“Url”：“xxx/xxx.png”       //附件url
	//“ThumbUrl”：”xxxxxxxx/xxx.png”，    //缩略图url
	//“DisplayOrder”：1                //显示顺序
 */
var setPic = function(img) {
	imgs.push(img);
	//	picPath=camero.getAbsolutePath(picPath);
	var pictures = document.getElementById('pictures');
	var div = document.createElement('div');
	div.img = img;
	div.className = 'img-div';
	div.innerHTML = '<img src="' + img.url + '" data-preview-src="' + img.url + '" data-preview-group="1"/>' +
		'<a class="mui-icon iconfont icon-guanbi"></a>';
	//console.log("放置的图片信息:"+JSON.stringify(img));
	pictures.appendChild(div);
}
/**
 * 设置界面
 * @param {Object} role
 */
var setCondition = function(role, stuClasses) {
	//	var btn_post = document.getElementById('post-imgs');
	var title = document.getElementById('title');
	var pictures = document.getElementById('pictures');
	if(role == 2) {
		document.querySelector('.subjects-container').style.display = 'block';
		document.querySelector('.teachers-container').style.display = 'none';
		//		btn_post.innerText = '上传答案';
		title.innerText = '上传答案';
		pictures.className = 'img-container temWork-teaHint';
		requestSubjectList();
	} else {
		stuSubmitAnswer = true;
		document.querySelector('.subjects-container').style.display = 'none';
		document.querySelector('.teachers-container').style.display = 'block';
		//		btn_post.innerText = '上传作业';
		title.innerText = '上传作业';
		pictures.className = 'img-container temWork-stuHint';
		//循环遍历老师数组，将群和老师身份的拼接
		requestClassTeacherInfo(stuClasses);
	}
}

//17.获取所有科目列表
function requestSubjectList() {
	//所需参数
	var comData = {};
	// 等待的对话框
	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
	//17.获取所有科目列表
	postDataPro_GetSubjectList(comData, wd, function(data) {
		wd.close();
		//console.log('上传作业||答案界面获取的科目列表：' + JSON.stringify(data));
		if(data.RspCode == 0) {
			//给科目数组赋值
			subjectArray = data.RspData.List;
			var subjects = document.getElementById('publish-subjects');
			//清空数据
			events.clearChild(subjects);
			//加载选项
			subjectArray.forEach(function(subject, i) {
				var op = document.createElement('option');
				op.value = subject.Value;
				op.innerText = subject.Text;
				subjects.appendChild(op);
			})
			//给选择的科目id取第一个值
			selectSubjectID = subjectArray[0].Value;
		} else {
			mui.toast(data.RspTxt);
		}
	});
}

//循环遍历老师数组，将群和老师身份的拼接
function requestClassTeacherInfo(stuClasses) {
	//学生身份时，存储班级里的老师数组
	var classTeacherArray = [];
	var count = 0;
	// 等待的对话框
	var wd = plus.nativeUI.showWaiting(storageKeyName.UPLOADING);
	for(var i in stuClasses) {
		//		var tempModel = stuClasses[i];
		//所需参数
		var comData = {
			top: -1, //选择条数,-1为全部
			vvl: stuClasses[i].gid, //群ID,查询的值
			vvl1: -1 //类型,0家长,1管理员,2老师,3学生,-1全部
		};
		//13.通过群ID获取群对象资料【model_groupStus】
		postDataPro_PostGusers(comData, wd, function(data) {
			//console.log('上传答案||作业界面获取的资料数据：' + JSON.stringify(data))
			wd.close();
			if(data.RspCode == 0) {
				count++;
				var tempArray = data.RspData; //[{"stuid":19,"gid":14,"stuname":"10群学1","stuimg":"","mstype":3}]
				//循环得到的资料数组，
				for(var m in tempArray) {
					//找到当前的老师
					if(tempArray[m].mstype == 2 || tempArray[m].mstype == 1) {
						//将班级信息，添加到老师model
						for(var n in stuClasses) {
							//群号相同
							if(tempArray[m].gid == stuClasses[n].gid) {
								//将群名添加到群资料model中
								tempArray[m].gname = stuClasses[n].gname;
								if(classTeacherArray.indexOf(tempArray[m]) < 0) {
									//添加到数组中
									classTeacherArray.push(tempArray[m]);
								}
								break;
							}
						}
					}
				}
				if(count == stuClasses.length) {
					setTeachers(arraySingleItem(classTeacherArray));
				}
			} else {
				mui.toast(data.RspTxt);
			}
		});
	}

}
/**
 * 去重
 * @param {Object} array
 */
var arraySingleItem = function(array) {
	var r = [];
	for(var i = 0, l = array.length; i < l; i++) {
		for(var j = i + 1; j < l; j++)
			if(array[i].gid == array[j].gid && array[i].utid == array[j].utid) {
				j = ++i;
			}
		r.push(array[i]);
	}
	return r;
}
var setTeachers = function(teaInfos) {
	//console.log('上传答案||作业界面要放置的老师资料：' + JSON.stringify(teaInfos))
	var teaContainer = document.getElementById('receive-teachers');
	events.clearChild(teaContainer);
	teaInfos.forEach(function(teaInfo, i) {
		var op = document.createElement('option');
		op.teaInfo = teaInfo;
		op.innerHTML = '<p><span  class="receiver-name">' + events.shortForString(teaInfo.ugnick, 8) +
			'</span><span class="recerver-">-</span><span class="receiver-class">' + events.shortForString(teaInfo.gname, 8) + '</span></p>';
		teaContainer.appendChild(op);
	})
	teaInfo = teaContainer.firstElementChild.teaInfo;
}

//所需参数
//				var comData = {
//					teacherId: personalUTID, //教师Id，如果为学生，userId: personalUTID,
//					fileType: '1', //文件类型，1：图片；2：音频；3：视频；
//					filename: '', //文件名，带后缀；
//					fileStream: '', //base64格式文件流；
//					displayOrder: '' //图片顺序；
//				};

//11.上传文件；逻辑：如果是图片类型，同时生成缩略图
function uploadFileTeacher(picPath, comData, callback) {
	// 等待的对话框
	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
	//11.上传文件；逻辑：如果是图片类型，同时生成缩略图
	postDataPro_UploadAnswerFile(comData, wd, function(data) {
		wd.close();
		//console.log('发布答案||作业界面老师上传答案返回值' + JSON.stringify(data));
		if(data.RspCode == 0) {
			callback(picPath, data.RspData);
		} else {
			mui.toast(data.RspTxt);
		}
	});
}

//所需参数
//				var comData = {
//					userId: personalUTID, //学生ID
//					fileType: '1', //文件类型，1：图片；2：音频；3：视频；
//					filename: '', //文件名，带后缀；
//					fileStream: '', //base64格式文件流；
//					displayOrder: '' //图片顺序；
//				};

//5.	上传文件；逻辑：如果是图片类型，同时生成缩略图，学生
function uploadFileStudent(picPath, comData, callback) {
	// 等待的对话框
	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
	//5.	上传文件；逻辑：如果是图片类型，同时生成缩略图
	postDataPro_UploadAnswerFileStu(comData, wd, function(data) {
		wd.close();
		//console.log('发布答案||作业界面学生上传作业返回值' + JSON.stringify(data));
		if(data.RspCode == 0) {
			callback(picPath, data.RspData);
		} else {
			mui.toast(data.RspTxt);
		}
	});
}

//14.发布答案,只能上传图片；老师
function requestPublishAnswer(comData) {
	// 等待的对话框
	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
	//14.发布答案,只能上传图片；
	postDataPro_PublishAnswer(comData, wd, function(data) {
		wd.close();
		//console.log('发布答案||作业界面老师发布答案返回值：' + JSON.stringify(data));
		if(data.RspCode == 0) {
			mui.toast('上传成功');
			events.clearChild(document.getElementById('pictures'));
			imgs=[];
		} else {
			mui.toast(data.RspTxt);
		}
	});
}

//6.	提交答案结果，学生
function requestSubmitAnswer(comData) {
	// 等待的对话框 
	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
	//6.	提交答案结果
	postDataPro_SubmitAnswerResult(comData, wd, function(data) {
		wd.close();
		//console.log('提交答案||作业界面学生提交作业返回值：' + JSON.stringify(data))
		if(data.RspCode == 0) {
			mui.toast('上传成功');
			stuSubmitAnswer = false;
			answerResultId = data.RspData.AnswerResultId;
			document.getElementById('checkResult').style.display = 'block'
			document.getElementById('post-imgs').innerText = '修改';
		} else {
			mui.toast(data.RspTxt);
		}
	});
}

//8.修改答案结果；学生
function requestModifyAnswer(comData) {
	// 等待的对话框
	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
	//8.修改答案结果；
	postDataPro_ModifyAnswerResult(comData, wd, function(data) {
		wd.close();
		//console.log('8.postDataPro_ModifyAnswerResult:RspCode:' + data.RspCode + ',RspData:' + JSON.stringify(data.RspData) + ',RspTxt:' + data.RspTxt);
		if(data.RspCode == 0) {
			if(data.RspData.r) {
				mui.toast("修改答案成功！");
			} else {
				mui.toast('修改答案失败！');
			}
		} else {
			mui.toast(data.RspTxt);
		}
	});
}