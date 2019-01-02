var dynamiclistitem = (function($, mod) {
	mod.addComment = function(gesture, commentNode) {
		//回复评论时 判断是否为自己
		if(tempIndex.indexOf('-') >= 0) {
			//console.log(tempIndex)
			var indexArr = tempIndex.split('-');
			var id = indexArr[0]; //动态的id
			var commentId = indexArr[1]; //第几个评论
			var replyId = indexArr[2]; //回复的id

			var tempModel = zonepArray[id].Comments[commentId];
			if(!tempModel) {
				if(gesture == 'tap') {
					mui.toast('不可以回复自己');
				}
				return;
			}
			//			//console.log(JSON.stringify(tempModel));
			var upperId = tempModel.TabId; //添加的评论的上级评论ID
			var replyUserId; //回复者ID
			var ReplyIdName; //回复者名字
			var currCommentID;
			if(replyId == '评论') {
				replyUserId = tempModel.UserId
				ReplyIdName = tempModel.UserIdName
				currCommentID = tempModel.TabId
			} else {
				replyUserId = tempModel.Replys[replyId].UserId;
				ReplyIdName = tempModel.Replys[replyId].UserIdName;
				currCommentID = tempModel.Replys[replyId].TabId
			}
			//			//console.log('personalUTID=' + personalUTID + '----' + 'replyUserId=' + replyUserId + 'PublisherId=' + zonepArray[id].PublisherId)
			if(gesture == 'tap' && personalUTID == replyUserId) {
				mui.toast('不可以回复自己');
				return;
			}
			if(gesture == 'longtap' && personalUTID != zonepArray[id].PublisherId && personalUTID != replyUserId) {
				//console.log('不做任何操作')
				return;
			}

			if(gesture == 'longtap' && (personalUTID == zonepArray[id].PublisherId || personalUTID == replyUserId)) { //
				//				//console.log('长按删除')
				commentNode.style.backgroundColor = 'lightgray'
				var btnArray = [{
					title: '删除',
					style: "destructive"
				}];
				plus.nativeUI.actionSheet({
					cancel: "取消",
					buttons: btnArray
				}, function(e) {
					var flag = e.index;
					switch(flag) {
						case 0:
						case -1:
							{
								commentNode.style.backgroundColor = 'transparent';
								//console.log('取消或点击空白----' + commentNode.id + '变为白色')
								grayFlag = 0;
							}
							break;
						case 1:
							{
								var btnArray = ['取消', '确定'];
								var closeId = this.id;
								mui.confirm('确定删除此条评论？', '提醒', btnArray, function(e) {
									if(e.index == 1) {
										//47.（用户空间）删除某条用户空间评论
										//所需参数
										var comData = {
											userSpaceCommentId: currCommentID //用户空间评论ID
										};
										//1为正确
										var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
										postDataPro_delUserSpaceCommentById(comData, wd, function(data) {
											wd.close();
											//console.log('删除空间评论_delUserSpaceCommentById' + JSON.stringify(data));
											if(data.RspCode == 0) {
												mui.toast('已删除');
												if(replyId == '评论') {
													var pageID = sliderId.replace('top_', '')
													var commentId = 'replyComment' + pageID + idFlag + tempIndex;
													//console.log('commentId=' + commentId)
													var deleteNode = document.getElementById(commentId);
													deleteNode.parentNode.removeChild(deleteNode);
													//tempModel.Replys[replyId].splice(index, 1)
												} else {
													var pageID = sliderId.replace('top_', '')
													var commentId = 'replyComment' + pageID + idFlag + tempIndex;
													//console.log('commentId=' + commentId)
													var deleteNode = document.getElementById(commentId);
													deleteNode.parentNode.removeChild(deleteNode);
													//tempModel.Replys[replyId].splice(index, 1)
												}

											} else {
												mui.toast(data.RspTxt)
											}
										})
									}
								})
							}
							break;
					}
				})

				return;
			}
		}
		events.openNewWindowWithData('../show/add-comment.html', {
			tempIndex: tempIndex,
			zonepArray: zonepArray
		})

	}
	mod.addSomeEvent = function() {
		mui(".mui-table-view").on("tap", ".video-container", function() {
			//console.log(this.getAttribute('videourl') + this.getAttribute('thb'))
			video.playVideo(this.getAttribute('videourl'), this.getAttribute('thb'));
		})
		window.addEventListener('praise', function(data) {
			var pageID = sliderId.replace('top_', '')
			var index = data.detail.index;
			var a = document.getElementById("praise" + pageID + idFlag + index);
			//模拟点击点赞按钮
			mui.trigger(a, 'tap');
		})
		window.addEventListener('deleteDynamic', function(data) {
			var index = data.detail
			//console.log('删除动态的监听' + JSON.stringify(index))
			var deleteNode = document.getElementById(index);
			deleteNode.parentNode.removeChild(deleteNode);

		})
		mui('.mui-table-view').on('tap', '.icon-xiajiantou', function() {
			var personalUTID = window.myStorage.getItem(window.storageKeyName.PERSONALINFO).utid; //用户昵称

			var pageID = sliderId.replace('top_', '')
			var tempId = this.id;
			var index = this.id.replace('btn-focus' + pageID + idFlag, '');
			var isFocus = zonepArray[index].IsFocused;
			var userId = zonepArray[index].PublisherId;

			//					var isFocus = jQuery('#'+this.id).data('isFocus');
			var title, status;
			//console.log(this.id)
			if(personalUTID == userId) {
				title = '删除'
			} else {
				if(isFocus == 0) {
					title = '关注'
					status = 1;
				} else {
					title = '取消关注'
					status = 0;
				}
			}

			var btnArray = [{
				title: title,
			}];
			plus.nativeUI.actionSheet({
				cancel: "取消",
				buttons: btnArray
			}, function(e) {
				var flag = e.index;
				switch(flag) {
					case 0:
						break;
					case 1:
						{
							//判断是否是游客身份登录
							if(personalUTID == 0) {
								var isDel = title == '关注' ? 0 : 1;
								events.toggleStorageArray(storageKeyName.SHOWFOCUSEPERSEN, parseInt(userId), isDel);
								var pageID = sliderId.replace('top_', '')
								//console.log('pageID=' + pageID)
								setTimeout(function() {
									//获取数据
									if(pageID != 1) { //定制的城市
										for(var item in datasource) {
											var tempArr = datasource[item]
											for(var j in tempArr) {
												if(zonepArray[index].PublisherId == tempArr[j].PublisherId) {
													if(isFocus == 0) {
														tempArr[j].IsFocused = 1;
														datasource[item] = tempArr
													} else {
														tempArr[j].IsFocused = 0;
														datasource[item] = tempArr
													}

												}

											}
										}
										//console.log('status=' + status)
										if(status == 0) {
											mui.toast("取消关注成功")
										} else {
											mui.toast("关注成功")
										}
									} else { //关注的人数据
										//81.（用户空间）获取用户所有关注的用户

										var showfocusperson = window.myStorage.getItem(window.storageKeyName.SHOWFOCUSEPERSEN);
										var tempModel = cities[cities.length - 1];
										userIDs = showfocusperson;
										tempModel.userIDs = userIDs;
										tempModel.index = 1;
										tempModel.isRefresh = 0; //是刷新0，还是加载更多1
										//74.(用户空间）获取多用户空间所有用户动态列表
										//console.log(JSON.stringify(tempModel))
										getAllUserSpacesByUser(tempModel);
										for(var item in datasource) {
											var tempArr = datasource[item]
											for(var j in tempArr) {
												if(zonepArray[index].PublisherId == tempArr[j].PublisherId) {
													if(isFocus == 0) {
														tempArr[j].IsFocused = 1;
														datasource[item] = tempArr
													} else {
														tempArr[j].IsFocused = 0;
														datasource[item] = tempArr
													}

												}

											}
										}

									}
								}, 1000);
								return;
							} else {

							}
							if(personalUTID == userId) {
								var btnArray = ['取消', '确定'];
								mui.confirm('确定删除此条动态？', '提醒', btnArray, function(e) {
									if(e.index == 1) {
										var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
										var comData = {
											userSpaceId: zonepArray[index].TabId //用户空间ID
										};
										postDataPro_delUserSpaceById(comData, wd, function(data) {
											wd.close();
											//console.log(JSON.stringify(data))
											if(data.RspCode == 0) {
												mui.toast('已删除');
												var pageID = sliderId.replace('top_', '')
												var deleteNode = document.getElementById(pageID + idFlag + index);
												deleteNode.parentNode.removeChild(deleteNode);
												if(document.getElementById("spaceDetail")) {
													mui.fire(plus.webview.currentWebview().opener(), 'deleteDynamic', preModel.tempIndex)
													mui.back()
												}
											} else {
												mui.toast(data.RspTxt);
											}
										})
									}
								}, 'div');

								return;
							}
							//80.（用户空间）设置某用户的关注
							//所需参数
							var comData = {
								userId: personalUTID, //用户ID
								focusId: zonepArray[index].PublisherId, //关注ID
								status: status //关注状态，0 不关注，1 关注
							};
							//返回：1为正确
							var wd = events.showWaiting();
							postDataPro_setUserFocus(comData, wd, function(data) {
								wd.close();
								//console.log(JSON.stringify(data))
								if(data.RspCode == 0) {
									var pageID = sliderId.replace('top_', '')
									//console.log('pageID=' + pageID)
									setTimeout(function() {
										//获取数据
										if(pageID != 1) { //定制的城市
											for(var item in datasource) {
												var tempArr = datasource[item]
												for(var j in tempArr) {
													if(zonepArray[index].PublisherId == tempArr[j].PublisherId) {
														if(isFocus == 0) {
															tempArr[j].IsFocused = 1;
															datasource[item] = tempArr
														} else {
															tempArr[j].IsFocused = 0;
															datasource[item] = tempArr
														}

													}

												}
											}
											//console.log('status=' + status)
											if(status == 0) {
												mui.toast("取消关注成功")
											} else {
												mui.toast("关注成功")
											}
										} else { //关注的人数据
											//81.（用户空间）获取用户所有关注的用户
											getFocusByUser();
										}
									}, 1000);
								}

							})

						}
						break;
				}
			});
		});
		mui('.mui-table-view').on('tap', '.dynamic-personal-image', function() {
			var id = this.id;
			var self = this;
			self.disabled = true;
			if(isPersonal == 1) {
				var cityID = sliderId.replace('top_', '');
				var index = id.replace('headImg' + cityID + idFlag, '');
				mui.openWindow({
					url: '../quan/zone_main.html',
					id: '../quan/zone_main.html',
					styles: {
						top: '0px', //设置距离顶部的距离
						bottom: '0px'
					},

					extras: {
						data: zonepArray[index].PublisherId,
						NoReadCnt: 0,
						flag: '0'
					},
					createNew: true,

				});
			}
			setTimeout(function() {
				self.disabled = false;
			}, 1500);

		})
		mui('.mui-table-view').on('tap', '.question_content', function() {
			var id = this.id;
			var self = this;
			self.disabled = true;
			if(!document.getElementById("spaceDetail")) {
				var cityID = sliderId.replace('top_', '');
				var index = id.replace('question_content' + cityID + idFlag, '');
				zonepArray[index].tempIndex = index;
				tempIndex = index;
				if(idFlag == '') {
					zonepArray[index].focusFlag = 0;
				} else {
					zonepArray[index].focusFlag = 1;
				}

				events.openNewWindowWithData('../quan/space-detail.html', zonepArray[index])

			}
			setTimeout(function() {
				self.disabled = false;
			}, 1500);

		});
		mui('.mui-table-view').on('tap', '.show', function() {
			var cityID = sliderId.replace('top_', '');
			var index = this.id.replace('show' + cityID + idFlag, '');
			if(idFlag == '') {
				zonepArray[index].focusFlag = 0;
			} else {
				zonepArray[index].focusFlag = 1;
			}
			events.openNewWindowWithData('../quan/space-detail.html', zonepArray[index])

		})
		mui('.mui-table-view').on('tap', '.show2', function() {
			var cityID = sliderId.replace('top_', '');
			var index = this.id.replace('show2' + cityID + idFlag, '');
			if(idFlag == '') {
				zonepArray[index].focusFlag = 0;
			} else {
				zonepArray[index].focusFlag = 1;
			}
			events.openNewWindowWithData('../quan/space-detail.html', zonepArray[index])

		})
		//			评论
		mui('.mui-table-view').on('tap', '.dynamic-icon-comment', function() {
			//判断是否是游客身份登录
			if(events.judgeLoginMode(this)) {
				return;
			}
			this.disabled = false;
			jQuery(this).css("pointerEvents", "all");
			var pageID = sliderId.replace('top_', '')
			//console.log('id=' + this.id)
			tempIndex = this.id.replace('comment' + pageID + idFlag, '');
			mod.addComment('tap');
			window.event.stopPropagation()

		});

		//			回复评论
		mui('.mui-table-view').on('tap', '.replyComment', function() {
			//判断是否是游客身份登录
			if(events.judgeLoginMode(this)) {
				return;
			}
			this.disabled = false;
			jQuery(this).css("pointerEvents", "all");
			var pageID = sliderId.replace('top_', '')
			tempIndex = this.id.replace('replyComment' + pageID + idFlag, '');
			mod.addComment('tap');
			window.event.stopPropagation()

		});
		//			删除评论
		mui('.mui-table-view').on('longtap', '.replyComment', function() {
			//判断是否是游客身份登录
			if(events.judgeLoginMode(this)) {
				return;
			}
			this.disabled = false;
			jQuery(this).css("pointerEvents", "all");
			//			//console.log('长按删除评论')
			var pageID = sliderId.replace('top_', '')
			tempIndex = this.id.replace('replyComment' + pageID + idFlag, '');
			mod.addComment('longtap', this);

			window.event.stopPropagation()

		});
		var grayFlag = 0;
		mui('.mui-table-view').on('touchstart', '.replyComment', function() {
			//console.log('touchstart---' + this.id + '变为灰色')
			if(grayFlag == 0) {
				this.style.backgroundColor = 'lightgray'
				grayFlag = 1;
			}

		});
		mui('.mui-table-view').on('touchend', '.replyComment', function() {
			//console.log('touchend---' + this.id + '变为白色')
			grayFlag = 0;
			this.style.backgroundColor = 'transparent'
		});

		//
		//点击关注
		mui('.mui-table-view').on('tap', '.btn-attention', function() {
			var personalUTID = window.myStorage.getItem(window.storageKeyName.PERSONALINFO).utid; //用户昵称
			var item = this;
			var pageID = sliderId.replace('top_', '')
			var tempId = this.id;
			var index = this.id.replace('btn-focus' + pageID + idFlag, '');
			//console.log('personalUTID=' + personalUTID + '-----' + 'publisherId=' + publisherId)
			//判断是否是游客身份登录
			if(personalUTID == 0) {
				events.toggleStorageArray(storageKeyName.SHOWFOCUSEPERSEN, parseInt(publisherId), 0);
				var btn = document.getElementById(tempId);
				btn.innerHTML = '已关注'
				btn.className = 'mui-btn mui-pull-right btn-attentioned'
				events.fireToPageNone('show-home.html', 'focus', {
					flag: 1
				})
				return;
			}

			//80.（用户空间）设置某用户的关注
			//所需参数
			var comData = {
				userId: personalUTID, //用户ID
				focusId: zonepArray[index].PublisherId, //关注ID
				status: '1' //关注状态，0 不关注，1 关注
			};
			//返回：1为正确
			var wd = events.showWaiting();
			postDataPro_setUserFocus(comData, wd, function(data) {
				wd.close();
				item.disabled = false;
				jQuery(item).css("pointerEvents", "all");
				if(data.RspCode == 0) {
					var btn = document.getElementById(tempId);
					btn.innerHTML = '已关注'
					btn.className = 'mui-btn mui-pull-right btn-attentioned'
					events.fireToPageNone('show-home.html', 'focus', {
						flag: 1
					})
				}

			})
		}) //点击取消关注
		mui('.mui-table-view').on('tap', '.btn-attentioned', function() {

			var item = this;
			var personalUTID = window.myStorage.getItem(window.storageKeyName.PERSONALINFO).utid; //用户昵称

			var pageID = sliderId.replace('top_', '')
			var tempId = this.id;
			var index = this.id.replace('btn-focus' + pageID + idFlag, '');
			//判断是否是游客身份登录
			if(personalUTID == 0) {
				events.toggleStorageArray(storageKeyName.SHOWFOCUSEPERSEN, parseInt(publisherId), 1);
				var btn = document.getElementById(tempId);
				btn.innerHTML = '关注'
				btn.className = 'mui-btn mui-pull-right btn-attention'
				events.fireToPageNone('show-home.html', 'focus', {
					flag: 0
				})
				return;
			}
			//80.（用户空间）设置某用户的关注
			//所需参数
			var comData = {
				userId: personalUTID, //用户ID
				focusId: zonepArray[index].PublisherId, //关注ID
				status: '0' //关注状态，0 不关注，1 关注
			};
			//返回：1为正确
			var wd = events.showWaiting();
			postDataPro_setUserFocus(comData, wd, function(data) {
				wd.close();
				//console.log(JSON.stringify(data));
				item.disabled = false;
				jQuery(item).css("pointerEvents", "all");
				if(data.RspCode == 0) {
					var btn = document.getElementById(tempId);
					btn.innerHTML = '关注'
					btn.className = 'mui-btn mui-pull-right btn-attention'
					events.fireToPageNone('show-home.html', 'focus', {
						flag: 0
					})

				}

			})
		})
		//点击点赞人那一行 跳转到点赞的人的列表界面
		mui('.mui-table-view').on('tap', '.PraiseList', function() {
			//console.log('跳转到点赞人列表界面')
			var cityID = sliderId.replace('top_', '');
			var index = this.id.replace('PraiseList' + cityID + idFlag, '');
			var userSpaceId = zonepArray[index].TabId
			events.fireToPageWithData("../quan/classSpace-persons.html", "personsList", {
				userSpaceId: userSpaceId,
				type: 3
			});
			window.event.stopPropagation()
		})
		//点击点赞的人跳转到相应界面
		mui('.mui-table-view').on('tap', '.praiseName', function() {
			window.event.stopPropagation()
			if(isPersonal == 0) {
				if(publisherId == this.dataset.info) {
					window.event.stopPropagation()
					return;
				}
			}
			//console.log('点赞者id' + this.dataset.info);
			mui.openWindow({
				url: '../quan/zone_main.html',
				id: '../quan/zone_main.html',
				styles: {
					top: '0px', //设置距离顶部的距离
					bottom: '0px'
				},

				extras: {
					data: this.dataset.info,
					NoReadCnt: 0,
					flag: '0'
				},
				createNew: true,

			});

		});
		//点击评论者名字
		mui('.mui-table-view').on('tap', '.dynamic-comment-name', function() {
			if(isPersonal == 0) {
				if(publisherId == this.dataset.info) {
					window.event.stopPropagation()
					return;
				}
			}
			var personalUTID = window.myStorage.getItem(window.storageKeyName.PERSONALINFO).utid;
			if(this.dataset.info == undefined) {
				this.dataset.info = personalUTID
			}
			//console.log('评论者id' + this.dataset.info);
			mui.openWindow({
				url: '../quan/zone_main.html',
				id: '../quan/zone_main.html',
				styles: {
					top: '0px', //设置距离顶部的距离
					bottom: '0px'
				},

				extras: {
					data: this.dataset.info,
					NoReadCnt: 0,
					flag: '0'
				},
				createNew: true,

			});
			window.event.stopPropagation()

		})
		//点赞和取消点赞
		mui('.mui-table-view').on('tap', '.dynamic-icon-praise', function() {

			//判断是否是游客身份登录
			if(events.judgeLoginMode(this)) {
				return;
			}
			var item = this;
			var wd = events.showWaiting();
			var userInfo = window.myStorage.getItem(window.storageKeyName.PERSONALINFO); //用户id
			var pageID = sliderId.replace('top_', '')
			var personalunick = window.myStorage.getItem(window.storageKeyName.PERSONALINFO).unick; //用户昵称
			var tempData;
			var index;

			index = this.id.replace('praise' + pageID + idFlag, '');
			tempData = zonepArray[index];

			var color = this.style.color;

			if(color == 'rgb(183, 183, 183)') {
				var comData = {
					userId: userInfo.utid, //用户ID
					userSpaceId: tempData.TabId, //用户空间ID
				};

				postDataPro_setUserSpaceLikeByUser(comData, wd, function(data) {
					if(data.RspCode == 0) {
						document.getElementById("bottomDiv" + pageID + idFlag + index).style.paddingBottom = '12px';
						var a = document.getElementById("praise" + pageID + idFlag + index);
						a.style.color = 'rgb(26, 155, 255)'
						var PraiseList = document.getElementById("PraiseList" + pageID + idFlag + index);
						var praiseNameList = PraiseList.getElementsByTagName("font");
						tempData.LikeUsers.unshift(userInfo) //把当前用户信息放到数组LikeUsers第一位

						if(praiseNameList.length > 0) {
							PraiseList.innerHTML = PraiseList.innerHTML.replace('mui-pull-left">', 'mui-pull-left">' + '<font class="common-font-family-Regular dynamic-praise-name praiseName" data-info="' + userInfo.utid + '">' + personalunick + '</font>、')
						} else {
							var citycode = sliderId.replace('top_', '');
							document.getElementById('line' + citycode + idFlag + index).className = 'mui-media-body dynamic-line';
							PraiseList.innerHTML = '<img id= "praiseImg' + pageID + idFlag + index + '" src="../../image/dynamic/praise.png" class="dynamic-icon-praise-small mui-pull-left" />' +
								'<font class="common-font-family-Regular dynamic-praise-name praiseName" data-info="' + userInfo.utid + '">' + personalunick + '</font>';
						}
						if(document.getElementById("spaceDetail")) {
							mui.fire(plus.webview.currentWebview().opener(), 'praise', {
								index: preModel.tempIndex
							})
						}
						wd.close();
					} else {
						wd.close();
						mui.toast(data.RspTxt);
					}
					item.disabled = false;
					jQuery(item).css("pointerEvents", "all");
				})

			} else {

				var comData = {
					userId: userInfo.utid, //用户ID
					userSpaceId: tempData.TabId, //用户空间ID
				};
				postDataPro_delUserSpaceLikeByUser(comData, wd, function(data) {

					if(data.RspCode == 0) {
						var a = document.getElementById("praise" + pageID + idFlag + index);
						a.style.color = 'rgb(183, 183, 183)'
						var PraiseList = document.getElementById("PraiseList" + pageID + idFlag + index);
						var praiseName = PraiseList.getElementsByTagName("font");
						var tempLikeUser = tempData.LikeUsers
						for(var i in tempLikeUser) {
							if(tempLikeUser[i].utid == userInfo.utid) {
								tempLikeUser.splice(i, 1);
							}
						}
						if(praiseName.length > 1) {
							//console.log('多个人点赞')
							for(var i = 0; i < praiseName.length; i++) {

								if(praiseName[i].dataset.info == userInfo.utid) {
									PraiseList.innerHTML = PraiseList.innerHTML.replace('<font class="common-font-family-Regular dynamic-praise-name praiseName" data-info="' + userInfo.utid + '">' + personalunick + '</font>、', '')

								}
							}

						} else {

							//console.log('一个人点赞')
							var citycode = sliderId.replace('top_', '');
							var comment0 = document.getElementById('replyComment' + pageID + idFlag + index + '-0-评论');
							if(comment0) {
								document.getElementById('line' + pageID + idFlag + index).className = 'mui-media-body dynamic-line';
							} else {
								document.getElementById("bottomDiv" + pageID + idFlag + index).style.paddingBottom = '0px';
								document.getElementById('line' + pageID + idFlag + index).className = 'mui-media-body dynamic-line mui-hidden';
							}
							for(var i = 0; i < praiseName.length; i++) {
								if(praiseName[i].dataset.info == userInfo.utid) {
									PraiseList.removeChild(praiseName[i]);
								}
							}

							var praiseImg = document.getElementById("praiseImg" + pageID + idFlag + index);
							PraiseList.removeChild(praiseImg);

						}
						if(document.getElementById("spaceDetail")) {
							mui.fire(plus.webview.currentWebview().opener(), 'praise', {
								index: preModel.tempIndex
							})
						}
						wd.close();
					} else {
						wd.close();
						mui.toast(data.RspTxt);
					}
					item.disabled = false;
					jQuery(item).css("pointerEvents", "all");
				})

			}

		});
		//删除动态
		mui('.mui-table-view').on('tap', '.mui-icon-closeempty', function() {
			//判断是否是游客身份登录
			if(events.judgeLoginMode(this)) {
				return;
			}
			var item = this;
			var btnArray = ['取消', '确定'];
			var closeId = this.id;
			mui.confirm('确定删除此条动态？', '提醒', btnArray, function(e) {
				if(e.index == 1) {
					var index = closeId.replace('delete', '');
					//console.log(closeId);
					var wd = plus.nativeUI.showWaiting(storageKeyName.WAITING);
					var comData = {
						userSpaceId: zonepArray[index].TabId //用户空间ID
					};
					postDataPro_delUserSpaceById(comData, wd, function(data) {
						wd.close();
						item.disabled = false;
						jQuery(item).css("pointerEvents", "all");
						if(data.RspCode == 0) {
							mui.toast('已删除');
							var pageID = sliderId.replace('top_', '')
							var deleteNode = document.getElementById(pageID + idFlag + index);
							deleteNode.parentNode.removeChild(deleteNode);
							zonepArray.splice(index, 1)
						} else {
							mui.toast(data.RspTxt);
						}
					})
				} else {
					item.disabled = false;
					jQuery(item).css("pointerEvents", "all");
				}
			})
		})

	}

	mod.addData = function(data) {

		//[[InfoList],[ImageList],[InteractionList]]动态的信息
		var ImageList = []; //内容的图片
		var EncAddrList = [];
		//个人信息和内容
		var tempModel = data;

		tempModel.personalImage = updateHeadImg(tempModel.uimg, 2)
		if(tempModel.ugname) {
			tempModel.personalName = events.shortForString(tempModel.ugname, 15);
		} else {
			tempModel.personalName = events.shortForString(tempModel.unick, 15);
		}
		tempModel.PublishDate = modifyTimeFormat(tempModel.PublishDate);

		if(tempModel.EncImgAddr != '') {
			var EncImgAddrs = tempModel.EncImgAddr.split('|');
			var EncAddrs = tempModel.EncAddr.split('|');

			//内容的图片
			for(var i = 0; i < EncImgAddrs.length; i++) {
				ImageList.push({
					encAddr: EncAddrs[i],
					encImg: EncImgAddrs[i],
					type: mod.getFileType(data.EncType, EncAddrs[i])
				})
			}

		}
		tempModel.ImageList = ImageList
		//底部
		var viewCount = tempModel.ReadCnt;
		var praiseList = [];
		if(tempModel.LikeUsers.length != 0) {
			for(var i = 0; i < tempModel.LikeUsers.length; i++)
				praiseList.push(tempModel.LikeUsers[i]);
		}
		tempModel.praiseList = praiseList

		//[commentList]:评论列表
		//1.评论[commenter,content]，评论者，评论内容
		//2.回复[replyer，commenter，replyContent]回复者，评论者，回复的内容
		var commentList = [];

		for(var i = 0; i < tempModel.Comments.length; i++) {

			var tempComment = tempModel.Comments[i];
			commentList.push(tempComment);

		}
		tempModel.commentList = commentList
		tempModel.IsFocused = data.IsFocused;
		tempModel.cityCode = data.cityCode;
		tempModel.idFlag = data.idFlag;
		tempModel.id = data.id;
		tempModel.id_name = data.id_name;
		return tempModel;

	}
	/**
	 * 获取文件类型
	 * @param {Object} type
	 * @param {Object} fileAddr
	 */
	mod.getFileType = function(type, fileAddr) {
		switch(type) {
			case 5:
				var fileSuffix = fileAddr.split('.')[fileAddr.split('.').length - 1];
				switch(fileSuffix) {
					case 'mp4':
					case 'MP4':
						type = 2;
						break;
					default:
						type = 1;
						break;
				}
				break;
			default:

				break;
		}
		return type;
	}

	mod.addItem = function(ulElement, data) {
		//		//console.log(JSON.stringify(data));
		var li = document.createElement('li');
		li.id = data.id_name;
		li.className = 'mui-table-view-cell';
		mod.addInfo(ulElement, li, data); //增加动态的个人信息和内容

	};

	/**
	 * 增加动态的个人信息和内容
	 * @param {Object} ulElement
	 * @param {Object} liElement
	 * @param {Object} data
	 */
	mod.addInfo = function(ulElement, liElement, data) {
		var closeempty = '';
		if(personalUTID == data.PublisherId) {
			closeempty = '<a data-is-focus=0  id ="btn-focus' + data.id_name + '" class="mui-icon iconfont icon-xiajiantou mui-pull-right" style="color:gray;width:30px;height:30px;padding:5px"></a>';
		} else {
			closeempty = '';
		}

		var html = '';
		var html1 = '<div class="mui-col-sm-12 mui-col-xs-12"><div class="mui-media-body mui-pull-left">';

		//头像
		var html2 = '<img id="headImg' + data.id_name + '" class=" dynamic-personal-image" style="width:40px;height:40px;border-radius: 50%;" src="' + data.personalImage + '"></div>';
		var html3 = '<div class="mui-media-body dynamic-padding-left-10px">' + closeempty;
		//姓名
		var html4 = '<p class="mui-ellipsis" style = "color:#323232;font-size:16px;margin-top:2px">' + data.personalName + '</p>';

		//时间
		var html5 = '<p style = "color:#b7b7b7;font-size:14px">' + data.PublishDate + '</p></div></div>';
		var html6 = '<div class="mui-col-sm-12 mui-col-xs-12"><div class="mui-media-body dynamic-contenttext ">';
		var html7 = '<div id="question_content' + data.id_name + '" style = "color:#808080;font-size:15px;word-spacing:28px;" class="ellipsis-show question_content">';
		//内容
		var html8 = replaceAllBL(data.MsgContent);
		var html99 = '<div id="show' + data.id_name + '" class="showAll show" style="color:#B7B7B7;">展开全部</div>'
		var html9 = '</div>' + html99 + '</div></div>';
		html = html1 + html2 + html3 + html4 + html5 + html6 + html7 + html8 + html9;

		var div = document.createElement('div');
		div.className = 'mui-row mui-row-padding-8px';
		div.innerHTML = html;
		liElement.appendChild(div);

		mod.addImage(ulElement, liElement, data); //增加动态的图片
	};

	/**
	 * 增加动态的图片
	 * @param {Object} ulElement
	 * @param {Object} liElement
	 * @param {Object} data
	 */
	mod.addImage = function(ulElement, liElement, data) {
		//console.log("要放置的data:" + JSON.stringify(data));
		var citycode = data.cityCode
		var ImageUrlList = data.ImageList; //图片路径数组
		var ImageNum = ImageUrlList.length; //图片总数量
		var html = '';
		var imgRe = {};
		var mt;
		if(ImageNum > 0) {
			if(ImageUrlList[0].type == 2) {
				var request = new XMLHttpRequest();
				request.open("GET", ImageUrlList[0].encImg + '?imageInfo', false);
				request.send();
				var imgInfo = JSON.parse(request.responseText);
				var winWidth = SCREEN_WIDTH;
				//console.log("获取的图片信息：" + JSON.stringify(imgInfo));
				if(imgInfo.width > imgInfo.height) { //宽>高
					winWidth = winWidth * 0.75;
					imgRe.height = 190 + 'px';
					imgRe.width = 340 + 'px';
					mt = 190/2-25;
				} else { //宽<=高
					winWidth = winWidth * 0.75;
					imgRe.width = 150 + 'px';
					imgRe.height = 264 + 'px';
					mt =  264/2-25
				}

			}
			//console.log("要设置的图片宽高：" + JSON.stringify(imgRe));

			if(ImageNum == 1) { //一张图片
				if(ImageUrlList[0].type === 2) {
					var html1 = '<div id="video-container' + data.id_name + '" class="video-container" thb=' + ImageUrlList[0].encImg + ' videourl=' + ImageUrlList[0].encAddr +
						' style="position:relative;height: ' + imgRe.height + ';width: ' + imgRe.width + ' ;background-image:url(' + ImageUrlList[0].encImg + ');background-repeat:no-repeat;background-position:center;background-size:cover;text-align:center;">';
					var html2 = '<img id="playvideo' + data.id_name + '"    style= "height: ' + 55 + 'px;width: ' + 55 + 'px;margin-top:' + mt + 'px;margin-left:0px" src="../../image/utils/playvideo.png"/>';
					var html3='';
					if(data.EncLen>0){
						html3 = '<div style="position:absolute;bottom:0px;right:3px;color:white;width:30px;">'+data.EncLen+'"</div></div>'
					}
					html = html1 + html2+html3;
				} else {

					var html1 = '<div>';
					var html2 = '<img class="dynamic-image"  style= "height: ' + SCREEN_WIDTH * 1 / 2 + 'px;width: ' + SCREEN_WIDTH * 1 / 2 + 'px;" src="' + ImageUrlList[0].encImg + '" data-preview-src="' + ImageUrlList[0].encAddr + '" data-preview-group="' + 'cellImageType' + data.id_name + '"/></div>';
					html = html1 + html2;
				}
			} else if(ImageNum == 2) { //两张图片时
				$.each(ImageUrlList, function(index, element) {
					var html1 = '<div class="mui-col-sm-6 mui-col-xs-6 dynamic-image-div" style="height: ' + (SCREEN_WIDTH - 20) / 2 + 'px;width: ' + (SCREEN_WIDTH - 20) / 2 + 'px;">';
					var html2 = '<img class="dynamic-image" style= "height: ' + (SCREEN_WIDTH - 20) / 2 + 'px;" src="' + ImageUrlList[index].encImg + '" data-preview-src="' + ImageUrlList[index].encAddr + '" data-preview-group="' + 'cellImageType' + data.id_name + '"/>' + '</div>';
					html = html + html1 + html2;
				});
			} else if(ImageNum >= 3) { //大于两张图片时
				$.each(ImageUrlList, function(index, element) {
					var html1 = '<div class="mui-col-sm-4 mui-col-xs-4" style="height: ' + (SCREEN_WIDTH - 20) / 3 + 'px;width: ' + (SCREEN_WIDTH - 20) / 3 + 'px;">';
					var html2 = '<img class="dynamic-image" style="height: ' + (SCREEN_WIDTH - 30) / 3 + 'px;width: ' + (SCREEN_WIDTH - 30) / 3 + 'px;"  src="' + element.encImg + '" data-preview-src="' + ImageUrlList[index].encAddr + '" data-preview-group="' + 'cellImageType' + data.id_name + '"/></div>';
					html = html + html1 + html2;
				});
			}
		}

		var div = document.createElement('div');
		div.className = 'mui-row ';
		div.style.paddingLeft = '10px'
		div.style.paddingRight = '10px'
		div.style.marginTop = '-10px'
		div.innerHTML = html;
		liElement.appendChild(div);
		mod.addInteraction(ulElement, liElement, data);

	};
	mod.questionContent = function() {
		var height_0;
		var height_1;
		var contentElements = document.getElementsByClassName("question_content");
		var showAll = document.getElementsByClassName("showAll");
		for(var i = 0; i < contentElements.length; i++) {
			contentElements[i].style.webkitLineClamp = '9';
			height_0 = contentElements[i].offsetHeight;
			contentElements[i].style.webkitLineClamp = '8';
			height_1 = contentElements[i].offsetHeight;
			////console.log(height_0 + '|' + height_1);
			if(height_0 > height_1) {
				//内容高度大于八行
				showAll[i].style.display = 'inline';
			} else {
				showAll[i].style.display = 'none';
			}
		}

	}

	/**
	 * 增加动态的互动
	 * @param {Object} ulElement
	 * @param {Object} liElement
	 * @param {Object} data
	 */
	mod.addInteraction = function(ulElement, liElement, data) {
		var SCREEN_WIDTH = plus.screen.resolutionWidth; //获取设备屏幕宽度分辨率
		var viewCount = data.ReadCnt; //浏览次数
		var praiseList = data.praiseList.reverse(); //点赞列表数组
		var commentList = data.commentList; //评论列表数组
		var html = '';
		var htmlPraiseList = '<div  class="mui-col-sm-12 mui-col-xs-12 dynamic-margin-top-10px"><div id= "PraiseList' + data.id_name + '" class="PraiseList mui-media-body mui-col-sm-12 mui-col-xs-12">'; //点赞列表
		var htmlCommentList = ''; //评论列表

		var html1 = '<div class="mui-col-sm-12 mui-col-xs-12"><div class="mui-media-body">';
		var html2 = '</div></div>'
		var html3 = '<div class="mui-col-sm-12 mui-col-xs-12 dynamic-margin-top-10px"><div class="mui-media-body mui-pull-right" style="margin-right:-15px;margin-top:10px">';
		var html4;
		//点赞状态
		if(data.IsLike != 0) { //已点赞
			html4 = '<a id="praise' + data.id_name + '" style = "color: rgb(26,155,255)"  class="mui-icon iconfont icon-support dynamic-icon-praise"></a>';

		} else { //为点赞
			html4 = '<a id="praise' + data.id_name + '" style = "color: #b7b7b7"  class="mui-icon iconfont icon-support dynamic-icon-praise"></a>';
		}

		var html5 = '<a id="comment' + data.id_name + '" style = "color: #b7b7b7;" class="mui-icon iconfont icon-xiaoxizhongxin dynamic-icon-comment"></a>';
		var html6 = '<font style="padding-right:7px"></font>';
		var html7 = '</div><div class="mui-media-body" style="margin-top:5px"><p  style="color:#999999">浏览' + viewCount + '次</p></div></div>';
		var html8;

		if(praiseList.length > 0 || commentList.length > 0) { //有点赞或者评论时显示分割线
			html8 = '<div  class="mui-col-sm-12 mui-col-xs-12 "><div id="line' + data.id_name + '" class="mui-media-body dynamic-line"></div></div>';
		} else {
			html8 = '<div  class="mui-col-sm-12 mui-col-xs-12 "><div id="line' + data.id_name + '" class="mui-media-body dynamic-line mui-hidden"></div></div>';
		}
		//点赞列表
		html = html1 + html2 + html3 + html4 + html5 + html6 + html7 + html8;
		var nameArr = []
		for(var i in praiseList) {
			var name = praiseList[i].unick;
			name = '<font class="common-font-family-Regular dynamic-praise-name praiseName" data-info="' + praiseList[i].utid + '">' + name + '</font>'
			nameArr.push(name);

		}
		if(nameArr.length > 0 && nameArr.length <= 19) {

			var praiseListStr = nameArr.join('、');
			var html3 = '<img id = "praiseImg' + data.id_name + '" src="../../image/dynamic/praise.png" class="dynamic-icon-praise-small mui-pull-left" />' + praiseListStr;
			htmlPraiseList = htmlPraiseList + html3 + '</div></div>';
		} else if(nameArr.length > 19) {
			nameArr = nameArr.slice(0, 20);
			var praiseListStr = nameArr.join('、');
			var html3 = '<img id = "praiseImg' + data.id_name + '" src="../../image/dynamic/praise.png" class="dynamic-icon-praise-small mui-pull-left" />' + praiseListStr + '等' + praiseList.length + '人觉得点赞';
			htmlPraiseList = htmlPraiseList + html3 + '</div></div>';
		} else {
			htmlPraiseList = htmlPraiseList + '</div></div>';
		}

		//评论列表
		var htmlCommentList1 = '<div id="commentList' + data.id_name + '" class="mui-col-sm-12 mui-col-xs-12">';
		var htmlCommentList2 = '';
		var commentNum = 0;
		$.each(commentList, function(index, element) {
			commentNum++;
			if(commentNum > 20 && (!document.getElementById("spaceDetail"))) {
				return false;
			}
			var firstComment = '';
			var replyComment = '';
			var html1 = '<div id="replyComment' + data.id_name + '-' + index + '-' + '评论' + '" class="mui-media-body replyComment">';
			var html2 = '<font data-info=' + element.UserId + ' class="common-font-family-Regular dynamic-comment-name ">' + element.UserIdName + '</font>';
			var html3 = '<font class="common-font-family-Regular" style = "font-size:14px;color:#B7B7B7">：' + element.CommentContent + '</font>';
			firstComment = html1 + html2 + html3;

			if(element.Replys && element.Replys.length != 0) {
				for(var i = 0; i < element.Replys.length; i++) {
					commentNum++
					if(commentNum > 20 && (!document.getElementById("spaceDetail"))) {
						return false;
					}
					var tempModel = element.Replys;
					var html1 = '<div id="replyComment' + data.id_name + '-' + index + '-' + i + '" class="mui-media-body replyComment">';
					var html2 = '<font data-info=' + tempModel[i].UserId + ' class="common-font-family-Regular dynamic-comment-name">' + tempModel[i].UserIdName + '</font>';
					var html3 = '<font class="common-font-family-Regular" >回复</font>';
					var html4 = '<font data-info=' + tempModel[i].ReplyId + ' class="common-font-family-Regular dynamic-comment-name">' + tempModel[i].ReplyIdName + '</font>';
					var html5 = '<font class="common-font-family-Regular" style = "font-size:14px;color:#B7B7B7">：' + tempModel[i].CommentContent + '</font></div>';
					replyComment = replyComment + html1 + html2 + html3 + html4 + html5;
				}
				replyComment = replyComment + '</div>'
			} else {
				replyComment = '</div>'
			}

			htmlCommentList2 = htmlCommentList2 + firstComment + replyComment;
		});
		if(commentNum > 20 && (!document.getElementById("spaceDetail"))) {
			//console.log('评论大于20')
			showAll = '<div id="show2' + data.id_name + '" class=" show2" style="color:#B7B7B7;">展开全部</div>'
		} else {
			showAll = '';
		}

		htmlCommentList = htmlCommentList1 + htmlCommentList2 + showAll + '</div>';
		html = html + htmlPraiseList + htmlCommentList //+ showAll //+ htmlCommentBtn;
		var div = document.createElement('div');
		div.className = 'mui-row mui-row-padding-8px';
		div.id = 'bottomDiv' + data.id_name;
		div.style.marginTop = '-25px'
		if(praiseList.length > 0 || commentList.length > 0) {

		} else {
			div.style.paddingBottom = '0px'
		}
		div.innerHTML = html;
		liElement.appendChild(div);
		ulElement.appendChild(liElement);
//		//console.log(ulElement.innerHTML);
	};

	return mod;

})(mui, window.dynamiclistitem || {});