var show_list = (function(mod) {
	/**
	 * 获取展现的数据
	 * @param {Object} showCity 地区
	 * @param {Object} listContainer 列表
	 * @param {Object} callback 回调
	 */
	mod.getShowList = function(showCity, callback, errBack) {
		//个人信息
		if(showCity.pageFlag == 0) { //关注
			//console.log('关注界面拉');
			//81.（用户空间）获取用户所有关注的用户
			if(events.getUtid() == 0) { //游客
				var showfocusperson = window.myStorage.getItem(window.storageKeyName.SHOWFOCUSEPERSEN);
				//74.(用户空间）获取多用户空间所有用户动态列表
				getAllUserSpacesByUser(showCity, showfocusperson, callback, errBack);
			} else {
				getFocusByUser(showCity, callback, errBack);
			}
		} else { //全部
			var wd = null;
			/**
			 * 78.（用户空间）获取区域用户空间列表
			 */
			postDataPro_getUserSpacesByArea({
				userId: events.getUtid(), //用户ID
				area: '0', //区域
				pageIndex: showCity.pageIndex, //当前页数
				pageSize: 12 //每页记录数
			}, wd, function(data) {
				if(data.RspCode == 0) {
					//总页数
					showCity.totalPage = data.RspData.TotalPage;
					mod.getUserInfo(data.RspData.Data, function(tempData) {
						callback(showCity, tempData);
					});
				} else {
					errBack(data);
				}
			})
		}
	}
	/**
	 * 获取个人信息
	 * @param {Object} tempRspData 
	 * @param {Object} callback 信息回调
	 */
	mod.getUserInfo = function(tempRspData, callback) {
		//获取当前回调留言的个人信息，主要是头像、昵称
		var tempArray = [];
		//先遍历回调数组，获取
		for(var item in tempRspData) {
			//当前循环的model
			var tempModel0 = tempRspData[item];
			if(tempModel0.EncImgAddr.length == 0 || tempModel0.EncImgAddr == null) {
				if(item == 0 || item == 6) { //第一张默认给大图片
					tempModel0.EncImgAddr = '../../image/show/show-default-large.png';
				} else {
					tempModel0.EncImgAddr = '../../image/show/show-default-small.png';
				}
			}
			tempModel0.PublishDate = modifyTimeFormat(tempModel0.PublishDate);
			//将当前model中id塞到数组
			tempArray.push(tempModel0.PublisherId);
		}
		//给数组去重
		tempArray = arrayDupRemoval(tempArray);
		if(tempArray.length == 0) {
			callback(tempRspData);
			return;
		}
		//发送获取用户资料申请
		var tempData = {
			vvl: tempArray.toString(), //用户id，查询的值,p传个人ID,g传ID串
			vtp: 'g' //查询类型,p(个人)g(id串)
		}
		var wd = null;
		//21.通过用户ID获取用户资料
		postDataPro_PostUinf(tempData, wd, function(data1) {
			//			wd.close();
			//console.log('获取个人资料success:RspCode:' + data1.RspCode + ',RspData:' + JSON.stringify(data1.RspData) + ',RspTxt:' + data1.RspTxt);
			if(data1.RspCode == 0) {
				for(var item in tempRspData) {
					//当前循环的model
					var tempModel0 = tempRspData[item];
					//循环当前的个人信息返回值数组
					for(var i in data1.RspData) {
						//当前model
						var tempModel = data1.RspData[i];
						//对比id是否一致
						if(tempModel0.PublisherId == tempModel.utid) {
							//合并
							tempModel0 = $.extend(tempModel0, tempModel);
						}
					}
				}
			}
			callback(tempRspData);
		});
	}

	/**
	 * //81.（用户空间）获取用户所有关注的用户
	 * @param {Object} showCity 地区信息
	 * @param {Object} callback 回调
	 */
	function getFocusByUser(showCity, callback, errBack) {
		//个人信息
		var personal = window.myStorage.getItem(window.storageKeyName.PERSONALINFO);
		//所需参数
		var comData = {
			userId: personal.utid //用户ID
		};
		var wd = null;
		//81.（用户空间）获取用户所有关注的用户
		postDataPro_getFocusByUser(comData, wd, function(data) {
			//console.log('81.（用户空间）获取用户所有关注的用户：' + JSON.stringify(data));
			//			wd.close();
			if(data.RspCode == 0) {
				var tempID = [];
				for(var i in data.RspData.Users) {
					var tempModel = data.RspData.Users[i];
					tempID.push(tempModel.UserId);
				}
				//				//console.log('tempID=', tempID);
				//74.(用户空间）获取多用户空间所有用户动态列表
				if(tempID.length > 0) {
					getAllUserSpacesByUser(showCity, tempID, callback, errBack);
				} else {
					errBack()
				}
			} else {
				errBack(data);
			}
		});
	}

	/**
	 * //74.(用户空间）获取多用户空间所有用户动态列表
	 * @param {Object} showCity 地区信息
	 * @param {Object} paraModel 关注人信息数组
	 * @param {Object} callback 请求的回调
	 */
	function getAllUserSpacesByUser(showCity, paraModel, callback, errBack) {
		if(!paraModel || paraModel.length == 0) {
			callback(showCity, []);
			return;
		}
		//个人信息
		var personal = window.myStorage.getItem(window.storageKeyName.PERSONALINFO);
		//所需参数
		var comData = {
			userId: personal.utid, //用户ID,登录用户
			publisherIds: arrayToStr(paraModel), //发布者ID,例如[1,2,3]
			pageIndex: showCity.pageIndex, //当前页数
			pageSize: 12 //每页记录数
		};
		// 等待的对话框
		var wd1 = null;
		postDataPro_getUserSpacesForAreaByIds(comData, wd1, function(data) {
			if(data.RspCode == 0) {
				if(data.RspData.TotalCnt > 0) {
					showCity.totalPage = data.RspData.TotalPage;
					mod.getUserInfo(data.RspData.Data, function(tempData) {
						showArray = tempData;
						callback(showCity, tempData);
					});
				} else {
					errBack(data);
				}
			} else {
				errBack(data);
			}

		});
	}

	return mod;
})(show_list || {})