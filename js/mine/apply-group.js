/**
 * 申請入群界面邏輯
 * @anthor an
 */
var firstSearch;
mui.init()
mui('.mui-scroll-wrapper').scroll({
	indicators: true, //是否显示滚动条
})
var list;
var myGroups = []; //我现所在群信息
var groupRoles = []; //群角色
var choseGroupId; //选中申请的群Id
mui.plusReady(function() {
	events.blurBack();
	events.softIn("extra-input");
	events.fobidEnter(document.getElementById("extra-input"));
	//设置最大长度
	jQuery("#extra-input").prop("maxLength", 20);
	list = document.getElementById('groups-container');
	var personalUTID = window.myStorage.getItem(window.storageKeyName.PERSONALINFO).utid;
	getAllGroups(personalUTID, manageMyGroups, 1);
	var search_group = document.getElementById('search-group');
	getChecked();
	search_group.addEventListener('search', function() {
		searchGroup();
	})
	setListListener();
	setButtonsListener();
	events.blurBack('search-group');
});
var searchGroup = function() {
	var search_group = document.getElementById('search-group');
	var secondSearch = null;
	if(!firstSearch) {
		firstSearch = new Date().getTime();
	} else {
		secondSearch = new Date().getTime();
	}
	setTimeout(function() {
		firstSearch = null;
	}, 2000);
	//console.log('search监听开始')
	if(secondSearch) {
		mui.toast('请求太频繁，请稍后！')
	} else {
		var searchType = 'mb'; //搜索数据类型
		if(search_group.value.length != 11 || isNaN(search_group.value)) {
			searchType = 'nm'; //通过用户名搜索账号
		} else {
			searchType = 'mb'; //通过手机号搜索账号
		}
		//清空子数据
		events.clearChild(list);
		var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
		postDataPro_PostUList({
			vvl: search_group.value,
			vtp: searchType //通过
		}, wd, function(data) {
			wd.close();
			//console.log('通过手机号获取个人信息：' + JSON.stringify(data));
			if(data.RspCode == '0000') {
				getAllGroups(data.RspData[0].utid, setData);
			} else if(data.RspCode == 9999) {
				mui.toast('您搜索用户无群组！');
			} else {
				mui.toast(data.RspTxt);
			}
		})
	}

}
/**
 * 成功返回数据后的回调函数
 * 页面加载数据
 * @param {Object} data 返回数据
 */
var setData = function(data) {
	var fragment = document.createDocumentFragment();
	//console.log('界面显示Data:' + JSON.stringify(data));
	data.forEach(function(cell, i, data) {
		var li = document.createElement('li');
		li.className = 'mui-table-view-cell';
		li.gid = cell.gid;
		li.innerHTML = createInner(cell);
		//console.log(i + createInner(cell))
		fragment.appendChild(li);
		if(i == data.length - 1) {
			list.appendChild(fragment);
		}
	})
}
/**
 * 設置列表監聽
 */
var setListListener = function() {
	mui('.mui-table-view').on('tap', '.apply-group', function() {
		choseGroupId = parseInt(this.getAttribute('gid'));
		document.querySelector('#search-group').blur();
		mui('.mui-popover').popover('toggle')
		//console.log('选中的申请的群id：' + choseGroupId);
		resetRoles();
	})
}
/**
 * 设置弹出框的监听事件
 */
var setButtonsListener = function() {
	document.getElementById('search-btn').addEventListener('tap', searchGroup)
	//确定按钮
	var btn_sure = document.getElementById('btn-sure');
	//取消按钮
	var btn_cancel = document.getElementById('btn-cancle');
	//确定按钮加载监听
	btn_sure.addEventListener('tap', function() {
		if(groupRoles.length > 0) {
			var role = groupRoles[0];
			var isMaster = false;
			events.getUserInGroup(choseGroupId, function(data) {
				//console.log("本人在群里的身份：" + JSON.stringify(data));
				if(data.RspCode == 0) {
					for(var i in data.RspData) {
						if(data.RspData[i].mstype == 1) {
							isMaster = true;
							break;
						}
					}
					if(isMaster && (role == 2 || role == 3)) {
						mui.toast("违反身份规则，无法申请！")
					} else {
						applyGroup();
					}
				} else {
					applyGroup();
				}
			});

		} else {
			mui.toast('请选择入群身份');
		}
	});
	//取消按钮加载监听
	btn_cancel.addEventListener('tap', function() {
		mui('.mui-popover').popover('toggle')
	})
}
var applyGroup = function() {
	var myNick = window.myStorage.getItem(window.storageKeyName.PERSONALINFO).unick;
	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
	postDataPro_PostJoinGuser({
		gid: choseGroupId,
		beinvnick: myNick,
		mstype: groupRoles[0],
		urel: getExtraInfo()
	}, wd, function(data) {
		groupRoles = [];
		wd.close();
		//console.log('申请入群获取的数据：' + JSON.stringify(data));
		if(data.RspCode == '0000') {
			mui.toast('申请成功！');
			events.fireToPageNone('/html/mine/approval-apply.html', 'applied')
		} else {
			mui.toast("申请失败:" + data.RspTxt)
		}
		mui('.mui-popover').popover('toggle');
	})
}
var getExtraInfo = function() {
	if(document.getElementById('extra-input').value) {
		return jQuery.trim(document.getElementById('extra-input').value.replace(/\/n/g, ""));
	}
	return "";
}
/**
 * 获取我在的所有群信息
 * @param {Object} data
 */
var manageMyGroups = function(data) {
	myGroups = data;
}
/**
 * 创建li的innerText
 * @param {Object} cell (gid gname gimg)
 */
var createInner = function(cell) {
	var isIn = false;
	var thisClassRoles = [];
	for(var i in myGroups) {
		if(myGroups[i].gid == cell.gid) {
			if(myGroups[i].mstype == 3) {
				thisClassRoles.push(myGroups[i]);
				break;
			} else {
				if(myGroups[i].mstype != 1) {
					thisClassRoles.push(myGroups[i]);
				}
			}
		}
	}
	//长度大于1
	if(thisClassRoles.length > 1) {
		isIn = true;
	} else if(thisClassRoles.length == 1 && thisClassRoles[0].mstype == 3) {
		isIn = true;
	} else {
		isIn = false;
	}
	if(isIn) {
		return '<a>' +
			'<img src="' + getGimg(cell) + '"/>' + cell.gname + '<p>已入群</p></a>'
	} else {
		return '<a href="" class="apply-group" gid="' + cell.gid + '">' +
			'<img src="' + getGimg(cell) + '"/>' + cell.gname + '</a>'
	}
}
/**
 * 获取群头像
 * @param {Object} cell
 */
var getGimg = function(cell) {
	return cell.gimg ? cell.gimg : '../../image/utils/default_personalimage.png';
}
/**
 * 清空子元素
 */
//var clearChildren = function() {
//		while(list.firstElementChild) {
//			list.removeChild(list.firstElementChild);
//		}
//	}
/**
 * 获取用户创建的群
 * @param {Object} utid
 * @param {Object} callback
 */
var getAllGroups = function(utid, callback, first) {
	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
	postDataPro_PostGList({
		vtp: 'cg', //要获取的项:cg(创建的群),ug(参与群),mg(协管的群),ag(所有的群),ig(群信息vvl对应群ID)
		vvl: utid
	}, wd, function(data) {
		wd.close();
		//console.log('申请入群获取的群数据：' + JSON.stringify(data));
		if(data.RspCode == 0) {
			callback(data.RspData);
		} else {
			if(data.RspCode != 9) {
				mui.toast(data.RspTxt);
			}
		}
	})

}
/**
 * 重置角色选择
 */
var resetRoles = function() {
	groupRoles = [];
	//家长选择按钮
	document.getElementById('check-parents').checked = false;
	//老师选择按钮
	document.getElementById('check-tea').checked = false;
	//学生选择按钮
	document.getElementById('check-stu').checked = false;
	//	document.getElementById("extra-input").style.display="none";
	document.getElementById("extra-input").value = "";
}
/**
 * 多选按钮选择逻辑
 */
var getChecked = function() {
	//家长选择按钮
	var check_parents = document.getElementById('check-parents');
	//老师选择按钮
	var check_tea = document.getElementById('check-tea');
	//学生选择按钮
	var check_stu = document.getElementById('check-stu');
	mui('.chose-container').on('change', 'input', function() {
		if(this.checked) {
			var choseRole = parseInt(this.value);
			var extra_input = document.getElementById('extra-input');
			//			if(choseRole){
			//				extra_input.style.display="none";
			//			}else{
			//				extra_input.style.display="block";
			//			}
		}
		groupRoles = [choseRole];
		//console.log('groupRoles:' + groupRoles);
	});
}
/**
 * 删除数组目标元素
 * @param {Object} item 目标元素
 * @param {Object} arrays 数组
 */
var removeItemFromArray = function(item, arrays) {
	if(arrays.indexOf(item) >= 0) {
		arrays.splice(arrays.indexOf(item), 1);
	}
	return arrays;
}