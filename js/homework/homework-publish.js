//从老师的作业列表界面，将身份为老师的群，传到这个界面，总群数组
//var classArray = []; //{"gid":14,"gname":"10群","gimg":"","mstype":2}
var selectSubjectID;
//老师发布作业时，选择的群
var selectClassArray = [];
var submitOnLine = true; //是否在线提交 默认为是
//科目控件
var subjectsContainer = document.getElementById('subjects');
//个人id
var personalUTID;
mui.init({
	beforeback:function(){
		homworkPublish.resetData();
		return true;
	}
});

mui.plusReady(function() {
	mui.fire(plus.webview.currentWebview().opener(),"publishIsReady");
	mui.previewImage();
	events.blurBack();
	//最大长度500
	jQuery('#publish-content').prop("maxLength", 500);
	//	var webHeight = plus.android.invoke(plus.android.currentWebview(), "getHeight");
	//	//console.log("屏幕宽度：" + webHeight);
	events.preload('classes-select.html', 200);
	window.addEventListener('postClasses', function(e) {
		CloudFileUtil.files = [];
		events.clearChild(document.getElementById('pictures'));
		personalUTID = parseInt(window.myStorage.getItem(window.storageKeyName.PERSONALINFO).utid);
		//console.log('发布作业界面获取的班级数据：' + JSON.stringify(e.detail.data));
		var switchItem = document.getElementById("onlineSwitch");
		var isActive = switchItem.classList.contains("mui-active");
		if(!isActive) {
			mui('#onlineSwitch').switch().toggle();
		}
		document.getElementById('publish-content').value = null;
		//选中班级为全部班级
		selectClassArray = e.detail.data;
		//请求所有班级学生数据
		requestClassStudents();
		//科目
		requestSubjectList(setSubjects);
	});
	events.addTap('select-classes', function() {
		events.fireToPageWithData('classes-select.html', 'postClasses', selectClassArray);
	})
	CloudFileUtil.setDelPicListener();
	events.areaInScroll();
	/**
	 * 监听选择班级后的返回数据
	 */
	window.addEventListener('selectedClasses', function(e) {
		selectClassArray = e.detail.data;
		setClasses(selectClassArray);
	})
	//删除班级的监听
	setRemoveClassListener();
	//设置是否在线的监听
	setIsOnline();
	//提交作业的监听
	setSubmitEvent();
	var lastEditRange = null;
	var publish_container = document.getElementById('publish-content');

	//相册按钮
	events.addTap('get_gallery', function() {
		if(CloudFileUtil.files.length < 9) {
			var picCount = 0; //上传图片计数
			gallery.getMultiplePic(9 - CloudFileUtil.files.length, function(paths) { //回调函数
				plus.nativeUI.showWaiting(storageKeyName.UPLOADING, {
					back: 'none'
				}); //等待框
				//console.log("保存的路径：" + JSON.stringify(paths));
				var saveSpace = storageKeyName.CLASSSPACE; //保存路径
				compress.compressPics(paths, function(compressedPaths) {
					//console.log('获取的图片路径：' + JSON.stringify(compressedPaths));
					var data = CloudFileUtil.getMultipleUploadDataOptions(compressedPaths, 6, 200, 0, saveSpace); //获取获取token的各参数
					CloudFileUtil.getQNUpTokenWithManage(storageKeyName.QNGETUPLOADTOKEN, data.options, function(datas) {
							//console.log("传回来的值：" + JSON.stringify(datas)) //回调数据
							if(datas.Status == 1) { //成功
								var tokenInfos = datas.Data; //参数信息
								var imgs=[];
								//上传图片
								CloudFileUtil.uploadFiles(compressedPaths, tokenInfos, function(uploadData, status,index) {
									//console.log(JSON.stringify(uploadData));
									 imgs[index] = {
										url: tokenInfos[0].Domain + JSON.parse(uploadData.responseText).key,
										thumb: (tokenInfos[0].Domain + JSON.parse(uploadData.responseText).key).replace(saveSpace, saveSpace + "thumb/"),
										type: 1
									}
									picCount++;
								
									if(picCount == compressedPaths.length) { //所有图片已上传
										plus.nativeUI.closeWaiting(); //关闭等待框
										for(var i in imgs){
											CloudFileUtil.setPic(imgs[i]); //放置图片
										}
										
									}
								});

							}
						},
						//错误的回调
						function(xhr, type, errorThrown) {
							//console.log("错误类型：" + type + errorThrown);
							plus.nativeUI.closeWaiting();
						});
				});

			});
		} else {
			mui.toast('上传图片附件不得多于9张！');
		}
	});
	//相机按钮
	events.addTap('getImg', function() {
		var item=this;
		jQuery(item).css("pointerEvents","none");
		if(CloudFileUtil.files.length < 9) {
			camera.getPic(camera.getCamera(), function(picPath) {
				jQuery(item).css("pointerEvents","all");
				plus.nativeUI.showWaiting(storageKeyName.UPLOADING, {
					back: 'none'
				});
				var saveSpace = storageKeyName.CLASSSPACE; //保存空间
				compress.compressPIC(picPath, function(event) {
					var localPath = event.target;
					var data = CloudFileUtil.getSingleUploadDataOptions(localPath, 6, 200, 0, saveSpace);
					CloudFileUtil.getQNUpTokenWithManage(storageKeyName.QNGETUPLOADTOKEN, data.options, function(datas) {
						//console.log("获取的数据：" + JSON.stringify(datas));
						if(datas.Status == 1) {
							var tokenInfo = datas.Data;

							//上传文件
							CloudFileUtil.uploadFile(tokenInfo, localPath, function(uploadData, status) {
								//console.log(JSON.stringify(uploadData));
								var img = { //图片信息
									url: tokenInfo.Domain + tokenInfo.Key,
									thumb: tokenInfo.OtherKey[data.thumbKey],
									type: 1
								}
								//关闭等待框
								plus.nativeUI.closeWaiting();
								//放置图片
								CloudFileUtil.setPic(img);
							});
						}

					}, function(xhr, type, errorThrown) {
						//console.log("错误类型：" + type + errorThrown);
						plus.nativeUI.closeWaiting(); //关闭等待框
					});
				})
			},function(err){
				jQuery(item).css("pointerEvents","all");
			})
		} else {
			jQuery(item).css("pointerEvents","all");
			mui.toast('上传图片附件不得多于9张！');
		}
	})
	//录像按钮
	events.addTap('getVideo', function() {
		//			camera.getVideo(camera.getCamera(), function(videoPath) {
		//				//console.log("videoPath:" + videoPath);
		//			})
		mui.toast('功能暂未开放！');
	});
	//录音按钮
	events.addTap("get_record", function() {
		mui.toast("功能暂未开放！")
	})
	setListener();
})
var setListener = function() {
	//	jQuery("#input-content").focus(function(){
	//		mui.scrollTo(document.querySelector("#input-content"))
	//	})
}
//17.获取所有科目列表
function requestSubjectList(callback) {
	//所需参数
	var comData = {};
	// 等待的对话框
	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
	//17.获取所有科目列表
	postDataPro_GetSubjectList(comData, wd, function(data) {
		wd.close();
		//console.log('发布作业界面获取的科目列表数据：' + JSON.stringify(data));
		if(data.RspCode == 0) {
			//给科目数组赋值
			callback(data.RspData.List);
		} else {
			mui.toast(data.RspTxt);
		}
	});
}
/**
 * 放置科目
 * @param {Object} subjectList
 */
var setSubjects = function(subjectList) {
	events.clearChild(subjectsContainer);
	subjectList.forEach(function(subject, i) {
		var op = document.createElement('option');
		op.className = "select-subject";
		op.value = subject.Value;
		op.innerText = subject.Text;
		subjectsContainer.appendChild(op);
	});
	homworkPublish.classes=subjectList;
}
//	/**
//	 * 选中科目的监听
//	 */
//var getSelectSubject = function() {
//		selectSubjectID = subjectsContainer[subjectsContainer.selectedIndex].value;
//	}
/**
 * 放置班级列表
 * @param {Object} classes
 */
var setClasses = function() {
	//班级数据列表控件
	var classesContainer = document.getElementById('classes');
	//清空班级数据
	events.clearChild(classesContainer)
	for(var i in selectClassArray) {
		if(selectClassArray[i].isSelected) {
			var p = document.createElement('p');
			p.className = 'class-container gid' + selectClassArray[i].gid;
			//				p.innerText = classes[i].gname;
			p.innerHTML = selectClassArray[i].gname + '<span class="iconfont icon-close class-del"></span>'
			classesContainer.appendChild(p);
			p.querySelector('.class-del').bindClass = selectClassArray[i];
		}

	}
}
/**
 * 删除班级的监听
 */
var setRemoveClassListener = function() {
	mui('.receive-classes').on('tap', '.class-del', function() {
		var classes = document.getElementById('classes');
		classes.removeChild(classes.querySelector('.gid' + this.bindClass.gid));
		//console.log('删除的班级数据：' + JSON.stringify(this.bindClass));
		selectClassArray[selectClassArray.indexOf(this.bindClass)].isSelected = false;
		//console.log('删除班级后所有班级数据：' + JSON.stringify(selectClassArray));
	})
}
/**
 * 是否在线提交
 */
var setIsOnline = function() {
	document.getElementById("onlineSwitch").addEventListener("toggle", function(event) {
		if(event.detail.isActive) {
			submitOnLine = true;
			//console.log("你启动了开关");
		} else {
			submitOnLine = false;
			//console.log("你关闭了开关");
		}
	})
}
/**
 * 提交按钮的监听
 */
var setSubmitEvent = function() {
	//提交按钮
	events.addTap('submitBtn', function() {
		selectSubjectID = parseInt(subjectsContainer[subjectsContainer.selectedIndex].value);
		//判断是否有科目
		if(selectSubjectID) {
			//判断是否选择了班级
			if(selectClassArray.length > 0) {
				var content = document.getElementById('publish-content').value;
				content=events.trim(content);
				//判断是否有发送内容
				if(content) {
					if(events.limitInput(content, 500)) {
						return;
					}
					//12.发布作业
					requestPublishHomework(content);
				} else {
					mui.toast('请输入作业内容')
				}
			} else {
				mui.toast('请选择作业发布班级班级')
			}
		} else {
			mui.toast('您未选科目')
		}

	});
}

//获取班级里面的人
function requestClassStudents() {
	// 等待的对话框
	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
	requirePostGUInfo(wd);
}
/**
 * //13.通过群ID获取群的正常用户
 * @param {Object} i 班级索引
 * @param {Object} wd 等待框
 * @param {Object} callback 回调函数
 */
var requirePostGUInfo = function(wd, callback) {
	var tempFlag = 0;
	for(var a in selectClassArray) {
		var tempModel = selectClassArray[a];
		tempModel.isSelected = true;
		tempModel.studentArray = [];
		//所需参数
		var comData = {
			top: '-1', //选择条数
			vvl: tempModel.gid, //群ID，查询的值
			vvl1: '-1' //群员类型，0家长,1管理员,2老师,3学生,-1取全部
		};
		postDataPro_PostGusers(comData, wd, function(data) {
			tempFlag++;
			if(data.RspCode == 0) {
				//console.log('13.postDataPro_PostGusers:RspCode:' + data.RspCode + ',RspData:' + JSON.stringify(data.RspData) + ',RspTxt:' + data.RspTxt);
				//遍历班级列表，
				for(var n in selectClassArray) {
					var tempModel2 = selectClassArray[n];
					//通过id，将数据塞到不同的数组
					var tempArray = data.RspData;
					for(var m in tempArray) {
						var tempModel1 = tempArray[m];
						//判断群id
						if(tempModel2.gid == tempModel1.gid) {
							//判断是否为家长或学生
							if(tempModel1.mstype == 0 || tempModel1.mstype == 3) {
								tempModel2.studentArray.push(tempModel1);
							}
						}
					}
				}

			}
			//请求完成后，请求下一个班级
			if(tempFlag == selectClassArray.length) {
				//console.log('学生资料群信息数据：' + JSON.stringify(selectClassArray))
				setClasses();
				wd.close();
			}
		});

	}

}

//12.发布作业
function requestPublishHomework(workContent) {
	var emptyClasses = [];
	var realClasses = [];
	for(var i in selectClassArray) {
		if(selectClassArray[i].isSelected) {
			realClasses.push(selectClassArray[i]);
		}
	}
	if(realClasses.length == 0) {
		mui.toast('当前未选择班级！');
		return;
	}
	//组装学生数组串，
	var tempStuArray = [];
	//循环选择的群
	//console.log('发布作业前数据：' + JSON.stringify(selectClassArray));
	for(var i in selectClassArray) {
		var tempClassModel = selectClassArray[i];
		if(tempClassModel.isSelected) {
			//循环群里面的学生、家长
			for(var m in tempClassModel.studentArray) {
				var tempStuModel = tempClassModel.studentArray[m];
				tempStuArray.push(tempClassModel.gid + '|' + tempStuModel.utid);
			}
			if(tempClassModel.studentArray.length == 0) {
				emptyClasses.push(tempClassModel);
			}
		}
	}
	if(tempStuArray.length == 0) {
		mui.toast('群内无学生或家长，无法发布作业！');
		return;
	}
	//给学生去重
	tempStuArray = arrayDupRemoval(tempStuArray);
	for(var i in CloudFileUtil.files) {
		CloudFileUtil.files[i].order = i;
	}
	//所需参数
	var comData = {
		teacherId: personalUTID, //教师Id
		subjectId: selectSubjectID, //科目Id， 见（一）.17. GetSubjectList()；
		studentIds: tempStuArray.toString(), //班级Id+学生Id串，班级Id和学生Id以“|“分割，如“班级Id|学生Id”，每对id之间逗号分隔，例如“1|1,1|2”；
		content:workContent, //作业内容
		submitOnLine: submitOnLine, //是否需要在线提交；
		files: CloudFileUtil.files //上传文件的id串，例如“1,2”；
	};
	// 等待的对话框
	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
	//12.发布作业,逻辑：作业标题生成标准，时间+星期几+科目+“作业”，比如“11月11日星期一语文作业”
	postDataPro_PublishHomework(comData, wd, function(data) {
		wd.close();
		//console.log('发布作业界面发布作业回调：' + JSON.stringify(data));
		if(data.RspCode == 0) {

			events.fireToPageNone('homework-tea.html', 'homeworkPublished');
			//console.log("空值的班级：" + JSON.stringify(emptyClasses))
			var toastInfo = [];
			for(var j in emptyClasses) {
				toastInfo.push(emptyClasses[j].gname);
			}
			if(toastInfo.length > 0) {
				mui.toast(toastInfo.toString() + '班级无发布作业对象，发布失败，其他班级发布作业成功！');
			} else {
				mui.toast("发布作业成功！")
			}
			mui.back();
			setTimeout(function() {
				//提示成功，清空界面数据
				CloudFileUtil.files = [];
				submitOnLine = true;
				document.getElementById('publish-content').value = '';
				events.clearChild(document.getElementById('pictures'));
				events.clearChild(subjectsContainer);
				events.clearChild(document.getElementById('classes'));
			}, 1000)
		} else {
			mui.toast(data.RspTxt);
		}
	});
}