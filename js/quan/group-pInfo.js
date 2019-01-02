mui.init()
var pInfo; //{"gid":1,"gutid":9,"utid":5,
//"ugname":"BugHunter","ugnick":"BugHunter",
//"uimg":"http://oh2zmummr.bkt.clouddn.com/headimge5.png","mstype":3}
//var accountInfo;
var isSelf;
var premark={};
mui.plusReady(function() {
	events.preload('edit-remark.html',100);
	//		events.preload('../mine/qun_data_details.html',200);
	window.addEventListener('postPInfo', function(e) {
		isSelf=false;
		pInfo = e.detail.data;
		//console.log('班级群组传过来的个人信息：' + JSON.stringify(pInfo));
		var selfInfo=myStorage.getItem(storageKeyName.PERSONALINFO);
		if(selfInfo.utid==pInfo.utid){
			isSelf=true;
			document.querySelector('.info-remark').innerText='群昵称';
		}else{
			document.querySelector('.info-remark').innerText='备注';
		}
		getGroupPersonData(manageGroupPersonData);
		getAccountInfo(manageAccountInfo);
		getRemark();
	})
	addListener();
	window.addEventListener('remarkChanged',function(){
		//console.log("修改备注");
		isSelf=false;
		getRemark();
		events.fireToPageNone('../cloud/cloud_home.html', 'infoChanged');
		events.fireToPageNone('class-group.html','groupInfoChanged');
		events.fireToPageNone('class_space.html','infoChanged');
	})
	window.addEventListener('nickChanged',function(e){
		isSelf=true;
		pInfo=e.detail;
		//console.log('修改群昵称后的数据：'+JSON.stringify(pInfo));
		manageAccountInfo();
		events.fireToPageNone('class-group.html','groupInfoChanged');
		events.fireToPageNone('class_space.html','infoChanged');
		events.fireToPageNone('../cloud/cloud_home.html', 'infoChanged');
	})
})
/**
   * 获取备注
   */
var getRemark = function() {
		var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
		postDataPro_PostUmk({
			vvl: pInfo.utid
		}, wd, function(data) {
			wd.close();
			//console.log('获取的备注信息：'+JSON.stringify(data));
			var remark=document.getElementById('person-remark');
			if(data.RspCode=='0000'){
				manageAccountInfo(data.RspData[0]);
			}else{
				remark.innerText=pInfo.ugname;
				pInfo.bunick="";
//				premark.butid=pInfo.utid;
//				premark.bunick=pInfo.ugnick;
			}
		})
	}
	/**
	 * 獲取個人賬號信息
	 */
var getAccountInfo = function(callback) {
	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
	postDataPro_PostUinf({
		vvl: pInfo.utid,
		vtp: 'p'
	}, wd, function(data) {
		wd.close();
		//console.log('詳細資料頁面獲取的個人資料：' + JSON.stringify(data));
		if(data.RspCode == '0000') {
			callback(data.RspData[0]);
		} else {
			mui.toast(data.RspTxt);
		}
	})
}
var manageAccountInfo = function(data) {
		if(data){
			jQuery.extend(pInfo,data);
		}
//		pInfo.bunick=pInfo.bunick?pInfo.bunick:pInfo.ugnick;
		//console.log('獲取的個人賬號信息：' + JSON.stringify(pInfo));
		//{"utid":5,"uid":"18853113151","uname":"test867830028690115",
		//"unick":"BugHunter","usex":0,"utxt":null,
		//"uimg":"http://oh2zmummr.bkt.clouddn.com/headimge5.png"}
		document.getElementById('info-headImg').src = updateHeadImg(pInfo.uimg,2);
//		document.getElementById('info-name').innerText = pInfo.uname;
		document.getElementById('info-nick').innerText =pInfo.unick;
		//如果存在备注 就放置备注 否则 放置群昵称
		//console.log("获取的群昵称："+getNameInGroup(pInfo));
		document.getElementById('person-remark').innerText=getNameInGroup(pInfo);
		document.getElementById('data-info').innerText = pInfo.uid;
		document.getElementById('person-space').innerText = isSelf?"我的空间": events.shortForString(pInfo.unick,10) + '的空间' ;
		document.getElementById('person-area').innerText=pInfo.uarea.split("|")[1];
	}
/**
 *	获取群昵称
 * @param {Object} pInfo
 */
var getNameInGroup=function(pInfo){
	if(pInfo.bunick){
		return pInfo.bunick;
	}
	if(pInfo.ugname){
		return pInfo.ugname;
	}
	return pInfo.ugnick;
}
	/**
	 *40.通过用户ID获取用户各项资料
	 * @param {Object} callback
	 */
var getGroupPersonData = function(callback) {
	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
	postDataPro_PostGusinf({
		vvl: pInfo.gutid,
	}, wd, function(data) {
		wd.close();
		//console.log('获取的用户群资料：' + JSON.stringify(data));
		if(data.RspCode == '0000') {
			callback(data.RspData[0]);
//		} else {
//			mui.toast(data.RspTxt);
		}
	})
}
var manageGroupPersonData = function(data) {
	accountInfo = data;
//	//console.log('获取的用户群资料：' + JSON.stringify(data));
	jQuery.extend(pInfo, data);
//	//console.log('得到后的参数' + JSON.stringify(pInfo));
}
var addListener = function() {
	events.addTap('personal-space', function() {
		mui.openWindow({
				url: 'zone_main.html',
				id: 'zone_main.html',
				styles: {
					top: '0px', //设置距离顶部的距离
					bottom: '0px'
				},
				extras: {
					data: pInfo.utid,
					NoReadCnt: 0,
					flag: 0
				}
			});
//		events.openNewWindowWithData('zone_main.html', {data:pInfo.utid,flag: 0});
	});

	events.addTap('person-gData', function() {
		if(pInfo.isMaster&&pInfo.stuid){
			events.openNewWindowWithData('../mine/qun_data_details.html', pInfo);
		}else{
			mui.toast('不是群主，或无资料！');
		}
		
	})
	events.addTap('edit-remark',function(){
		if(isSelf){
			events.fireToPageWithData('edit-remark.html','editNick',pInfo);
		}else{
			events.fireToPageWithData('edit-remark.html','editRemark',pInfo);
		}
	})
}