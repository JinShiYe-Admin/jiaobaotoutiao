/**
 * 批准入群關聯資料界面邏輯
 * @anthor an
 */
var gutid; //申请记录id
var roles = [];
var gid; //群id
var choseId = 0;
var mstype; //类型信息
var list = document.getElementById('list-container');
var noDataContainer, selectedDataContainer;
mui.init();
mui('.mui-scroll-wrapper').scroll({
	indicators: true, //是否显示滚动条
})
mui.plusReady(function() {
	//获取传值
	window.addEventListener('postRoles', function(e) {
		noDataContainer = null;
		selectedDataContainer = null;
		choseId = 0;
		//console.log(JSON.stringify(e.detail.data));
		//获取申请记录id
		gutid = e.detail.data.gutid;
		//获取申请角色
		roles = e.detail.data.groupRoles;
		mstype = roles[0];
		//获取申请群id
		gid = e.detail.data.gid;
		//清空所有子元素
		events.clearChild(list);
		document.getElementById("list-container2").innerHTML = "";
		document.getElementById("list-container2").style.display = "block";
		document.querySelector(".no-data").style.display = "none";
		//加载元素无可用资料
		addNoData();
		//根据不同身份,请求数据，并保存至界面
		diffRoles(roles);
		addListener();
	});
})
/**
 * 加载无资料选项
 */
var addNoData = function() {
	//		var li = document.createElement('li');
	//		li.className = "mui-table-view-divider";
	//		li.innerText = '无资料';
	//		list.appendChild(li);
	var li1 = document.createElement('li');
	li1.className = "mui-table-view-cell mui-selected";
	li1.innerHTML = '<a class="mui-navigate-right">无可绑定资料</a>';
	list.appendChild(li1);
}
/**
 * 根据不同身份，放置不同数据
 * @param {Object} roles 身份数组
 */
var diffRoles = function(roles) {
	/**
	 * 角色为老师兼家长
	 */
	if(roles.length > 1) {
		getData(0, setData);
	} else {
		getData(roles[0], setData);
	}
}
/**
 * 获取数据
 * @param {Object} role 角色
 * @param {Object} callback 返回成功后的回调函数
 */
var getData = function(role, callback) {
	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
	//16号接口
	postDataPro_PostGUInf({
		top: -1, //选择条数,-1为全部
		vvl: gid, //群ID,查询的值
		vvl1: role == 2 ? 2 : 3, //如果是老师 获取2其他获取3学生资料
		vtp: role == 0 ? 0 : 1
	}, wd, function(data) {
		wd.close();
		//console.log('角色' + role + '获取的班级资料' + JSON.stringify(data))
		if(data.RspCode != 0) {
			mui.toast(data.RspTxt);
		}
		callback(role, data.RspData);
	})
}
/**
 * 获取数据成功后的回调函数
 * 放置数据
 * @param {Object} type 类型
 * @param {Object} data 数据
 */
var setData = function(type, data) {
	//console.log('放置数据' + JSON.stringify(data));
	if(data) {
		data.forEach(function(item) {
			if(item.stuname) {
				var li = document.createElement('li');
				li.className = 'mui-table-view-cell mui-media mui-col-xs-4 mui-col-sm-3 ';
				li.stuid = item.stuid;
				li.mstype = item.mstype;
				li.innerHTML = createInner(type, item);
				document.getElementById("list-container2").appendChild(li);
			}
		})
		if(document.getElementById("list-container2").firstElementChild) {
			createFirstChild(type);
			document.querySelector(".no-data").style.display = "none";
		} else {
			document.getElementById("list-container2").style.display = "none";
			document.querySelector(".no-data").style.display = "-webkit-flex";
		}
	} else {
		document.getElementById("list-container2").style.display = "none";
		document.querySelector(".no-data").style.display = "-webkit-flex";
	}
	//两个身份，学生身份请求完毕，请求老师身份
	if(roles.length > 1 && type == 0) {
		getData(2, setData);
	}
}
/**
 * 
 * @param {Object} item
 */
/**
 * 根据数据创建li的innnerHTML
 * @param {Object} type 类型
 * @param {Object} item 单元数据
 */
var createInner = function(type, item) {
	return '<a class="data-container" stuid="' + item.stuid + '" mstype="' + type + '">' +
		'<img src="' + updateHeadImg(item.stuimg, 2) + '"/>' +
		'<div class="mui-media-body">' + item.stuname + '</div>' +
		'</a>';
	//	'<a class="mui-navigate-right" stuid="' + item.stuid + 'mstype="' + type + '"><img src="' +
	//		updateHeadImg(item.stuimg,2) + '" />' + item.stuname + '</a>';
}
/**
 * 
 * @param {Object} type 身份类型
 */
var createFirstChild = function(type) {
	var li = document.createElement('li');
	li.className = 'mui-table-view-divider';
	switch(type) {
		//老师资料
		case 2:
			li.innerText = '老师资料';
			break;
			//学生资料	
		case 0:
		case 3:
			li.innerText = '学生资料';
			break;
		default:
			break;
	}
	list.appendChild(li);
}
/**
 * 加载列表选择监听
 * 加载保存按钮的监听
 */
var addListener = function() {
	document.querySelector('.mui-table-view.mui-table-view-radio').addEventListener('selected', function(e) {
		//console.log("当前选中的为：" + e.detail.el.innerText);
		//		//console.log("当前选中的资料id为：" + e.detail.el.stuid);
		noDataContainer = e.detail.el;
		if(selectedDataContainer) {
			selectedDataContainer.className = "data-container";
		}
		choseId = e.detail.el.stuid ? e.detail.el.stuid : 0;
		getMstype(e.detail.el.mstype);
	});
	mui("#list-container2").on("tap", ".data-container", function() {
		//console.log("点击事件：" + this.className);
		if(!noDataContainer) {
			noDataContainer = list.querySelector(".mui-table-view-cell");
		}
		noDataContainer.className = "mui-table-view-cell";
		if(selectedDataContainer) {
			selectedDataContainer.className = "data-container";
		}
		this.className = "data-container data-selected";
		selectedDataContainer = this;
		choseId = parseInt(this.getAttribute("stuid"));
		mstype=parseInt(this.getAttribute("mstype"));
		//console.log("当前选择的id:"+choseId+"；当前类型 :"+this.getAttribute("mstype"));
	})
}
/**
 * 获取身份
 * @param {Object} dataMstype
 */
var getMstype = function(dataMstype) {
	if(dataMstype) {
		//资料为学生且身份为家长
		if(dataMstype == 3 && roles.indexOf(0) >= 0) {
			//身份为家长
			mstype = 0;
		} else {
			mstype = dataMstype;
		}
	} else {
		mstype = roles[0];
	}

}
//保存按钮
//		var comData = {
//			gutid: '',//申请记录ID，
//			stat:'',//入群状态，0拒绝,后面的字段填0即可,1通过
//			mstype:'',//审批用户类型，0家长,2老师,3学生
//			lnkinfid:'',//关联资料ID，无资料关联填写0
//			urel:''//与资料关系，与资料关系,一般申请加入家长的时候填写,如爸爸,妈妈,其他类型留空
//		};
events.addTap('btn-save', function() {
	postJoinDo(mstype);
})
var postJoinDo = function(type) {
	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING)
	postDataPro_PostJoinDo({
			gutid: gutid,
			stat: 1,
			mstype: type,
			lnkinfid: choseId,
			urel: getRelation(type)
		},
		wd,
		function(data) {
			wd.close();
			//console.log(JSON.stringify(data));
			if(data.RspCode == '0000') {
				mui.toast('申请通过!');
				events.fireToPageNone('/html/mine/approval-apply.html', 'appPassed');
				events.fireToPageNone('mine.html', 'newsChanged');
				mui.back();
			} else {
				mui.toast(data.RspTxt);
			}
		})
}
var getRelation = function(type) {
	if(choseId) {
		return type ? '爸爸' : ''
	}
	return "";
}