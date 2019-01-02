mui.init();
var isMaster;
mui('.mui-scroll-wrapper').scroll({
	indicators: true, //是否显示滚动条
});
mui.plusReady(function() {
	var grouInfo=plus.webview.currentWebview().data;
	groupId = grouInfo.classId;
	groupName = grouInfo.className;
	masterInfo = null;
	isMaster = false;
	document.getElementById('title').innerText = getHeadText(groupName);
	freshContent();
//	window.addEventListener('postGroupInfo', function(e) {
//		masterInfo = null;
//		isMaster = false;
//		//console.log('班级群组界面获取的数据：' + JSON.stringify(e.detail.data));
//		if(e.detail.data) {
//			groupId = e.detail.data.classId;
//			groupName = e.detail.data.className;
//			document.getElementById('title').innerText = getHeadText(groupName);
//			freshContent();
//		}
//	})
	window.addEventListener('groupInfoChanged', function() {
		freshContent();
	})
	window.addEventListener("groupInfoChanged", function(e) {
		//console.log(JSON.stringify(e.detail));
	})
	mui('#gride').on('tap', '.mui-table-view-cell', function() {
			events.fireToPageWithData('group-pInfo.html', 'postPInfo', jQuery.extend({}, this.info, {
				isMaster: isMaster
			}));
	})
//	events.addTap('quit-group', function() {
//		showChoices();
//	})
	mui(".chose-container").on("change", "input", function() {
		if(this.checked) {
			choseRole = parseInt(this.value);
		}
	})
//	setButtonsListener();
})
var getGroupInfo = function() {
	var wd1 = events.showWaiting();
	postDataPro_PostGList({
		vtp: "ig",
		vvl: groupId
	}, wd1, function(data) {
		wd1.close();
		//console.log("获取的群信息：" + JSON.stringify(data));
		if(data.RspCode == 0) {
			document.getElementById("group-info").innerText = data.RspData[0].gnote ? data.RspData[0].gnote : "暂无说明";
		}else{
			mui.toast(data.RspTxt);
		}
	})
}

/**
 * 重置角色选择
 */
var resetRole = function() {
	choseRole = null;
	//家长选择按钮
	document.getElementById('check-parents').checked = false;
	//老师选择按钮
	document.getElementById('check-tea').checked = false;
	//学生选择按钮
	document.getElementById('check-stu').checked = false;
}
var freshContent = function() {
	getGroupInfo();
	groupRoles = [];
	allcount = 0;
	getUserInGroup(-1, function(data) {
		groupRoles = data;
		//		setUgname(groupRoles);
		//console.log('班级群组界面获取的用户在群中的信息:' + JSON.stringify(groupRoles));
		for(var i in groupRoles) {
			if(groupRoles[i].mstype == 1) {
				isMaster = true;
				groupRoles.splice(i, 1);
				break;
			}
		}
		getGroupAllInfo();
	})
}
//var setUgname=function(groupRoles){
//	document.getElementById("name-group").innerText=groupRoles[0].ugname;
//}
/**
 * 获取用户在群组中的信息
 * @param {Object} mstype
 * @param {Object} callback
 */
var getUserInGroup = function(mstype, callback) {
	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
	postDataPro_PostGuI({
		vvl: groupId,
		vtp: mstype
	}, wd, function(data) {
		wd.close()
		//console.log('用户在群的身份 ' + JSON.stringify(data));
		if(data.RspCode == '0000') {
			if(callback) {
				callback(data.RspData);
			}
		}
	})
}
var getGroupAllInfo = function() {
	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING)
	//請求群組成員數據
	postDataPro_PostGusers({
		top: -1,
		vvl: groupId,
		vvl1: -1
	}, wd, function(groupData) {
		wd.close();
		//console.log('获取群组成员：' + JSON.stringify(groupData));
		//成功囘調
		if(groupData.RspCode == 0) {
			getRemarkInfos(groupData.RspData);
		}
	});
}
var getRemarkInfos = function(data) {
	getRemarkData(data, function(Remarkdata) {
		var list = [];
		if(Remarkdata.RspCode == '0000') {
			list = addRemarkData(data, Remarkdata.RspData);
		} else {
			list = addRemarkData(data)
		}
		events.clearChild(gride);
		//console.log('最终呈现的数据：' + JSON.stringify(list));
		list = resortArray(list);
		allGroupInfos=list;
		createGride(gride, list);
	})
}
var resortArray = function(list) {
	list.sort(function(a, b) {
		return a.order - b.order;
	})
	return list;
}
var addRemarkData = function(list, remarkList) {
	if(remarkList) {
		for(var i in list) {
			list[i] = setOrder(list[i]);
			var hasBunick = false;
			for(var j in remarkList) {
				if(list[i].utid == remarkList[j].butid) {
					hasBunick = true;
					list[i].bunick = remarkList[j].bunick;
					break;
				}
			}
			//			if(!hasBunick) {
			//				list[i].bunick = list[i].ugname;
			//			}
		}
	} else {
		list.forEach(function(cell, i) {
			//			list[i].bunick = cell.ugname;
			list[i] = setOrder(cell);
		})
	}
	return list;
}
var setOrder = function(cell) {
	switch(cell.mstype) {
		case 0:
			cell.order = 2;
			break;
		case 1:
			cell.order = 0;
			break;
		case 2:
			cell.order = 1;
			break;
		case 3:
			cell.order = 3;
			break;
		default:
			break;
	}
	return cell;
}
/**
 * 获取备注
 */
var getRemarkData = function(list, callback) {
	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
	var utids = [];
	list.forEach(function(cell) {
		utids.push(cell.utid);
	})
	//console.log('传的字符串：' + utids.toString())
	postDataPro_PostUmk({
		vvl: utids.toString()
	}, wd, function(data) {
		wd.close();
		//console.log('获取的备注信息：' + JSON.stringify(data));
		var remark = document.getElementById('person-remark');
		callback(data);
	})
}
/**
 * 加載九宮格數據
 * @param {Object} gride 九宫格父控件
 * @param {Object} array 元素数组，包括图标和标题
 */
var createGride = function(gride, array) {
	//数组遍历
	array.forEach(
		/**
		 * 创建子元素
		 * @param {Object} map 数组元素
		 * @param {Object} index 数组序号
		 * @param {Object} array 数组
		 */
		function(cell, index, array) {
			var li = document.createElement('li'); //子元素
			//			var bgColor = getRandomColor(); //获取背景色
			if(array.length <= 3) { //数组小于等于3，每行3个图标
				li.className = "mui-table-view-cell mui-media mui-col-xs-4 mui-col-sm-4";
			} else { //数组大于3，每行四个图标
				li.className = "mui-table-view-cell mui-media mui-col-xs-3 mui-col-sm-3";
			}
			cell.gname = groupName;
			//			if(!cell.bunick) {
			//				cell.bunick = cell.ugnick;
			//			}
			li.info = cell;
			//子控件的innerHTML
			li.innerHTML = '<a class="gride-inner" href="#">' +
				'<img class="circular-square" src="' + updateHeadImg(cell.uimg, 2) + '"/></br>' +
				'<small class="' + setMasterNameClass(cell) + '">' + getRoleInGroup(cell) + setBeunick(cell) + '</small>' +
				'</a>';
			gride.appendChild(li);
		})
}
var setBeunick = function(item) {
	if(item.bunick) {
		return item.bunick;
	}
	return item.ugname;
}
var setMasterNameClass = function(info) {
	if(info.mstype == 1) {
		return 'master-name'
	}
	return '';
}
var getRoleInGroup = function(cell) {
	var role = '';
	switch(cell.mstype) {
		case 0:
			role = '[家长]';
			break;
		case 1:
			role = '[群主]';
			break;
		case 2:
			role = '[老师]';
			break;
		case 3:
			role = '[学生]';
		default:
			break;
	}
	//console.log(JSON.stringify(cell));
	return role;
}
var getHeadText = function(className) {
	if(className.length > 10) {
		className = className.substring(0, 8) + '...'
	}
	return className;
}
/**
 * 根据角色数量 显示不同选择
 * @param {Object} data
 */
var showChoices = function(data) {
	//console.log('showChoices' + JSON.stringify(data))
	//console.log('群组角色：' + JSON.stringify(groupRoles));
	if(groupRoles.length > 1 && !isMaster) {
		plus.nativeUI.actionSheet({
			title: "请选择退群方式",
			cancel: "取消",
			buttons: [{
				title: "老师身份退出群组"
			}, {
				title: "家长身份退出群组"
			}, {
				title: "退出所有身份(班主任除外)"
			}]
		}, function(e) {
			//console.log("User pressed: " + e.index);
			if(e.index > 0) {
				if(e.index == 1) {
					events.setDialog('退群', '是否要将老师身份退出此群？', function() {
						//退出老师身份
						quitGroup(getSquadRoleInfo(2), quitSquad);
					}, '您取消了退群')

				} else if(e.index == 2) { //退出家长身份
					events.setDialog('退群', '是否要将家长身份退出此群？', function() {
						//退出老师身份
						quitGroup(getSquadRoleInfo(0), quitSquad);
					}, '您取消了退群')

				} else { //退出班级
					events.setDialog('退群', '是否退出此群？', function() {
						//退出老师身份
						quitGroupAll();
					}, '您取消了退群')

				}
			}

		});
	} else {
		events.setDialog('退群', '是否退出此群？', function() {
			quitGroupAll();
		}, '您取消了退群')
	}
}
/**
 * 获取小组身份信息
 * @param {Object} roleType 0家长 2老师 3家长
 */
var getSquadRoleInfo = function(roleType) {
	var quitRole;
	for(var i in groupRoles) {
		if(groupRoles[i].mstype == roleType) {
			quitRole = groupRoles[i];
			break;
		}
	}
	return quitRole;
}
/**
 * 退出群
 */
var quitGroupAll = function() {
	groupRoles.forEach(function(groupRole, i) {
		if(groupRole.mstype == 1) {
			allcount++;
		} else {
			//班主任不能退出老师身份
			if(isMaster && groupRole.mstype == 2) {
				allcount++;
			} else {
				quitGroup(groupRole, allCallback);
			}
		}
	})
}
/**
 * 退出群
 */
var allCallback = function(roleInfo) {
	allcount++;
	if(allcount > 0 && allcount == groupRoles.length) {
		events.fireToPageNone('../cloud/cloud_home.html', 'infoChanged');
		groupRoles = [];
		allcount = 0;
		if(!isMaster) {
			var curpage = plus.webview.currentWebview();
			curpage.opener().close();
			curpage.close();
		} else {
			freshContent();
		}
	}
}
/**
 * 退出小组 
 * @param {Object} roleInfo
 */
var quitSquad = function(roleInfo) {
	//console.log('退群的groupInfo:' + Array.isArray(groupRoles) + JSON.stringify(roleInfo) + groupRoles.indexOf(roleInfo));
	groupRoles.forEach(function(groupRole, i) {
		if(groupRole.gutid == roleInfo.gutid) {
			groupRoles.splice(i, 1);
		}
	})
	//				groupRoles.splice(groupRoles.indexOf(roleInfo), 1);
	//console.log('退组后的身份信息：' + JSON.stringify(groupRoles));
	freshContent();
	events.fireToPageNone('../quan/tab-zone.html', 'quitGroup');
}
/**
 * 退出群组
 * @param {Object} roleInfo
 * @param {Object} callback
 */
var quitGroup = function(roleInfo, callback) {
	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
	postDataPro_PostGuD({
		vvl: roleInfo.gutid
	}, wd, function(data) {
		//console.log('退群返回值：' + JSON.stringify(data));
		wd.close();
		if(data.RspCode == '0000') {
			mui.toast('退群成功');
			
			callback(roleInfo);
		} else {
			mui.toast(data.RspTxt);
		}
	})
}