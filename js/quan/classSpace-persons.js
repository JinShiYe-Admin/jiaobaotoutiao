mui.init({
	beforeback: function() {
		document.querySelector("#person-list").innerHTML = "";
		document.querySelector(".mui-content").className="mui-content mui-scroll-wrapper";
		mui(".mui-scroll-wrapper").scroll().scrollTo(0, 0);
		return true;
	}
});
mui(".mui-scroll-wrapper").scroll();
var classSpaceInfo;
mui.plusReady(function() {
	window.addEventListener('personsList', function(e) {
		//console.log('传过来的数值:' + JSON.stringify(e.detail.data));
		classSpaceInfo = e.detail.data;
		var title = document.querySelector('.mui-title');
		document.querySelector("#person-list").innerHTML = "";
		//		events.clearChild(document.getElementById('gride'));
		if(classSpaceInfo.type == 1) { //点赞
			title.innerText = '谁点的赞';
			getZanPersons(classSpaceInfo.classSpaceId);
		} else if(classSpaceInfo.type == 0) { //查看
			title.innerText = '谁看过';
			getChakanPersons(classSpaceInfo.classSpaceId);
		} else if(classSpaceInfo.type == 3) {
			title.innerText = '谁点的赞';
			getZonePersons(classSpaceInfo.userSpaceId)
			//			setData(classSpaceInfo.spaceID);
		}
	})
	mui(".mui-table-view").on("tap", ".mui-table-view-cell", function() {
		var info = this.info;
		var self = this;
		self.disabled = true;
		mui.openWindow({
			url: 'zone_main.html',
			id: 'zone_main.html',
			styles: {
				top: '0px', //设置距离顶部的距离
				bottom: '0px'
			},
			extras: {
				data: info.utid,
				NoReadCnt: 0,
				flag: 0
			}
		});
		setTimeout(function() {
			self.disabled = false;
		}, 1500);

	})
})
/**
 * param {type} 0 有人 1 查看的人 2点赞的人
 */
var setBackGround = function(type) {
	var hintWord = "";
	var className = "";
	var wordClassName;
	switch(type) {
		case 0:
			className = "mui-content mui-scroll-wrapper";
			hintWord = "";
			wordClassName = "display-none";
			break;
		case 1:
			className = "mui-content mui-scroll-wrapper noOneDisplay";
			hintWord = "暂时无人查看";
			wordClassName = "display-block";
			break;
		case 2:
			className = "mui-content mui-scroll-wrapper noOneDisplay";
			hintWord = "暂时无人点赞";
			wordClassName = "display-block";
			break;
		default:
			break;
	}
	document.querySelector(".mui-content").className = className;
	document.getElementById("noOne-container").innerText = hintWord;
	document.getElementById("noOne-container").className = wordClassName;
}
/**
 * 获取点赞成员
 * @param {Object} classSpaceId
 */
var getZanPersons = function(classSpaceId) {
	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
	postDataPro_getIsLikeUsersById({
		classSpaceId: classSpaceId
	}, wd, function(data) {
		wd.close();
		//console.log('获取的点赞列表数据：' + JSON.stringify(data));
		if(data.RspCode == 0) {
			if(data.RspData.Users.length > 0) {
				getPersonsInfo(data.RspData.Users);
				setBackGround(0);
			} else {
				setBackGround(2);
			}
		} else {
			mui.toast(data.RspTxt);
		}

	})
}
//获取用户空间所有点赞用户
var getZonePersons = function(userSpaceId) {
	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
	postDataPro_getUserIsLikeUsersById({
		userSpaceId: userSpaceId
	}, wd, function(data) {
		wd.close();
		//console.log('获取的点赞列表数据：' + JSON.stringify(data));
		if(data.RspCode == 0) {
			if(data.RspData.Users.length > 0) {
				getPersonsInfo(data.RspData.Users);
				setBackGround(0);
			} else {
				setBackGround(2);
			}
		} else {
			mui.toast('你逮到我啦，有错误')
		}

	})
}
//获取人员基本信息
var getPersonsInfo = function(users) {
	var userIds = [];
	for(var i in users) {
		userIds.push(users[i].UserId);
	}
	var infos = [];
	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
	postDataPro_PostUinf({
		vvl: userIds.toString(), //用户id，查询的值,p传个人ID,g传ID串
		vtp: 'g' //查询类型,p(个人)g(id串)
	}, wd, function(data) {
		wd.close();
		//console.log("获取的个人信息：" + JSON.stringify(data))
		if(data.RspCode == 0) {
			for(var i in users) {
				for(var j in data.RspData) {
					if(users[i].UserId == data.RspData[j].utid) {
						jQuery.extend(data.RspData[j], users[i]);
					}
				}
			}
			if(classSpaceInfo.type == 3) {
				setData(data.RspData);
			} else {
				getGroupUsers(userIds, data.RspData);
			}
		} else {
			mui.toast(data.RspTxt);
		}
	})
}
/**
 * 
 * @param {Object} users 接口获取的信息
 * @param {Object} userIds 用户ids
 * @param {Object} infos
 */
var getGroupUsers = function(userIds, infos) {
	var comData = {
		top: -1, //选择条数
		vvl: classSpaceInfo.classId.toString(), //群ID或IDS,查询的值,多个用逗号隔开
		vvl1: -1 //群员类型，0家长,1管理员,2老师,3学生,-1取全部
	};
	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
	postDataPro_PostGusers(comData, wd, function(data) {
		wd.close();
		//console.log('获取的用户信息：' + JSON.stringify(data));
		if(data.RspCode == 0) {
			var groupInfos = data.RspData;
			var realGroupInfos = groupInfos.filter(function(groupInfo, index, groupInfos) {
				if(groupInfo.mstype == 0) {
					for(var i in groupInfos) {
						if(i != index && groupInfos[i].utid == groupInfo.utid) {
							return false; //除家长外还有其他身份 删除家长身份
						}
					}
					return true;
				} else {
					if(groupInfo.mstype == 2) {
						for(var i in groupInfos) {
							if(groupInfos[i].mstype == 1 && groupInfos[i].utid == groupInfo.utid) {
								return false; //除老师外还有群主身份，删除老师身份
							}
						}
						return true;
					}
					return true;
				}
			})
			getRemark(userIds, realGroupInfos, infos);
		} else {
			mui.toast(data.RspTxt);
		}

	})
}
//获取备注
var getRemark = function(userIds, groupPersons, infos) {
	var wd = events.showWaiting();
	postDataPro_PostUmk({
		vvl: userIds.toString()
	}, wd, function(data) {
		wd.close();
		//console.log("获取的备注信息：" + JSON.stringify(data));
		if(data.RspCode == 0) {
			for(var i in data.RspData) {
				for(var j in groupPersons) {
					if(data.RspData[i].butid == groupPersons[j].utid) {
						jQuery.extend(groupPersons[j], data.RspData[i]);
						break;
					}
				}
			}
		}
		rechargeInfo(groupPersons, infos);
	})
}
//重整数据
var rechargeInfo = function(groupPersons, infos) {
	//	var infos = [];
	//console.log("userIds:" + JSON.stringify(infos) + ';人员信息：' + JSON.stringify(groupPersons))
	for(var m in infos) {
		for(var n in groupPersons) {
			if(infos[m].utid == groupPersons[n].utid) {
				//				//console.log("userId:" + userIds[m] + ";groupPersonsId:" + groupPersons[n].utid)
				//				infos.push(groupPersons[n]);
				jQuery.extend(infos[m], groupPersons[n]);
				break;
			}
		}
	}

	//	var gride = document.getElementById('gride');
	//console.log("最终要放置的数据：" + JSON.stringify(infos))
	setData(infos);
}
var setData = function(infos) {
	infos.sort(function(a, b) {
		if(a.ReadDate) {
			return Date.parse(b.ReadDate) - Date.parse(a.ReadDate)
		}
		return Date.parse(b.LikeDate) - Date.parse(a.LikeDate)
	})
	var list = document.getElementById("person-list");
	for(var i in infos) {
		var li = document.createElement("li");
		li.className = "mui-table-view-cell";
		li.innerHTML = createInner(infos[i]);
		list.appendChild(li);
		li.info = infos[i];
	}

}
var createInner = function(person) {
	return '<div class="person-cell"><img src="' + updateHeadImg(person.uimg, 2) + '"/><div class="person-info"><h6>' +
		getName(person) + '</h6>' + getTime(person) + '</div></div>'
}
var getName = function(person) {
	if(person.bunick) {
		return person.bunick;
	}
	if(person.ugname) {
		return person.ugname;
	}
	return person.unick;
}
var getTime = function(person) {
	if(person.ReadDate) {
		return '<p>' + events.shortForDate(person.ReadDate) + '</p>'
	}
	if(person.LikeDate) {
		return '<p>' + events.shortForDate(person.LikeDate) + '</p>'
	}
	return "";
}
/**
 * 获取浏览的信息
 * @param {Object} classSpaceId
 */
var getChakanPersons = function(classSpaceId) {
	var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
	postDataPro_getReadUserBySpaceId({
		classSpaceId: classSpaceId
	}, wd, function(data) {
		wd.close();
		//console.log('获取的已查看人员数据：' + JSON.stringify(data));
		if(data.RspCode == 0) {
			if(data.RspData.Users.length > 0) {
				getPersonsInfo(data.RspData.Users);
				setBackGround(0)
			} else {
				setBackGround(1);
			}
		} else {
			mui.toast(data.RspTxt);
		}
	})
}