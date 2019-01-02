var commentList = new Vue({
	el: '#show-detail',
	data: {
		showDetail: {
			IsFocused: 0, //是否关注
			IsLike: 0, //是否点赞
			Comments: [], //评论列表
			PublishDate: '1970-01-01 00:00:00',
			TotalPage: 0
		},
		imgDivRe: {},
		winWidth: 0,
		flexStyle: {
			display: 'flex',
			display: '-webkit-flex',
			justifyContent: 'center',
			alignItems: 'center'
		},
		isSelfDynamic: false
	},
	created: function() {

	},
	watch: {
		showDetail: function(val) {
			console.log("获取的展现详情：", val);
			this.imgDivRe = commentList.getImgRe(commentList.getImgs(val));
			//console.log("获取的图片宽高：" + JSON.stringify(this.imgDivRe));
			this.isSelfDynamic = (parseInt(val.PublisherId) === events.getUtid());
			//console.log("是不是本人发布的动态：" + this.isSelfDynamic);
		}
	},
	methods: {
		getFocused: function(showDetail) {
			if(!showDetail.TabId) {
				return 0;
			}
			var focused = 0;
			if(!events.getUtid()) {
				var index = events.isExistInStorageArray(storageKeyName.SHOWFOCUSEPERSEN, this.showDetail.PublisherId)[1];
				if(index >= 0) {
					focused = 1;
					this.showDetail.IsFocused = 1;
				}
			} else {
				focused = showDetail.IsFocused;
			}
			return focused;
		},
		resetData: function() {
			this.showDetail = {
				IsFocused: 0, //是否关注
				IsLike: 0, //是否点赞
				Comments: [], //评论列表
				PublishDate: '1970-01-01 00:00:00',
				TotalPage: 0
			}
		},
		getImgs: function(showDetail) {
			//			var showDetail=this.showDetail;
			var imgs = [];
			switch(showDetail.EncType) {
				case 1: //图片
				case 2: //视频
					imgs = commentList.splitImgs(showDetail, showDetail.EncType);
					break;
				case 3: //文字
					break;
				case 4: //音频
					break;
				case 5: //图文混排
					imgs = commentList.splitImgs(showDetail, showDetail.EncType);
					break;
				default:
					break;
			}
			//console.log("获取的图片地址：" + JSON.stringify(imgs));
			return imgs;
		},
		splitImgs: function(showDetail, type) {
			var imgs = [];
			var encImgs = showDetail.EncImgAddr.split('|');
			var encAddrs = showDetail.EncAddr.split('|');
			for(var i in encImgs) {
				if(i == 0) {
					type = commentList.getFileType(encAddrs[0]);
				}
				imgs.push({
					encImg: encImgs[i],
					encAddr: encAddrs[i],
					type: type,
					encLen: showDetail.EncLen
				});
			}
			//console.log("获取图片地址：" + JSON.stringify(imgs));
			return imgs;
		},
		getFileType: function(addr) {
			var type = 0;
			var suffix = addr.split('.')[addr.split('.').length - 1];
			switch(suffix) {
				case 'mp4':
				case 'MP4':
					type = 2; //视频
					break;
				case 'mp3':
				case 'MP3':
					type = 4; //音频
					break;
				default:
					type = 1; //图片
					break;
			}
			return type;
		},
		getSimpleDate: function(date) {
			return events.shortForDate(date);
		},
		//是否已关注
		toggleFocus: function() {
			if(events.getUtid()) {
				//console.log("获取当前状态：" + this.showDetail.IsFocused);
				var wd = events.showWaiting();
				var showDetail = this.showDetail;
				postDataPro_setUserFocus({
					userId: events.getUtid(),
					focusId: showDetail.PublisherId,
					status: showDetail.IsFocused ? 0 : 1
				}, wd, function(data) {
					wd.close();
					//console.log("设置关注返回值：" + JSON.stringify(data));
					if(data.RspCode == 0) {
						if(data.RspData.Result) {
							events.fireToPageNone('show-home.html', "focus");
							//console.log("改变的值：" + JSON.stringify(showDetail));
							if(showDetail.IsFocused) {
								showDetail.IsFocused = 0;
							} else {
								showDetail.IsFocused = 1;
							}
						}
					} else {
						mui.toast(data.RspTxt);
					}
				});
			} else { //游客
				events.toggleStorageArray(storageKeyName.SHOWFOCUSEPERSEN, this.showDetail.PublisherId, this.showDetail.IsFocused);
				this.showDetail.IsFocused = !this.showDetail.IsFocused;
				events.fireToPageNone('show-home.html', "focus");
			}
		},
		//是否已点赞
		toggleLike: function() {
			if(!events.getUtid()) {
				events.judgeLoginMode();
				return;
			}
			var wd = events.showWaiting();
			var showDetail = this.showDetail;
			var comData = {
				userSpaceId: showDetail.TabId,
				userId: events.getUtid()
			}
			if(showDetail.IsLike) {
				postDataPro_delUserSpaceLikeByUser(comData, wd, function(data) {
					//console.log("用户取消点赞结果：" + JSON.stringify(data));
					wd.close();
					if(data.RspCode == 0) {
						if(data.RspData.Result) {
							showDetail.IsLike = 0;
							//							mui.toast("您已取消点赞！");
							showDetail.LikeUsers.splice(commentList.getIndexInLikeUsers(), 1);
						}
					} else {
						mui.toast(data.RspTxt);
					}
				})
			} else {
				postDataPro_setUserSpaceLikeByUser(comData, wd, function(data) {
					//console.log("用户空间点赞结果：" + JSON.stringify(data));
					wd.close();
					if(data.RspCode == 0) {
						if(data.RspData.Result) {
							showDetail.IsLike = 1;
							//							mui.toast("点赞成功！")
							//console.log("获取的个人信息：" + JSON.stringify(myStorage.getItem(storageKeyName.PERSONALINFO)));
							showDetail.LikeUsers.push({
								userId: events.getUtid(),
								userName: myStorage.getItem(storageKeyName.PERSONALINFO).unick
							})
						}
					} else {
						mui.toast(data.RspTxt);
					}
				})
			}
		},
		getIndexInLikeUsers: function() {
			var likers = this.showDetail.LikeUsers;
			for(var i in likers) {
				if(likers[i].userId === events.getUtid()) {
					return parseInt(i);
				}
			}
		},
		//打开跳转页面
		//type为类型 0为留言 1为回复
		//如果是回复 index0是要回复的留言的index,index1为要回复的回复的index.
		openComment: function(type, index0, index1) {
			if(!events.getUtid()) { //判断是否为游客，游客跳转登陆界面
				events.judgeLoginMode();
				return;
			}
			var data = {
				type: type
			};
			if(type === 0) { //留言
				data.type = type;
				data.data = {
					userSpaceId: this.showDetail.TabId
				}
			} else if(type === 1) {
				data.data = {
					upperId: this.showDetail.Comments[index0].TabId,
					userSpaceId: this.showDetail.TabId
				};
				if(typeof(index1) === 'number') {
					data.data.replyUserId = this.showDetail.Comments[index0].Replys[index1].UserId;
				} else {
					data.data.replyUserId = this.showDetail.Comments[index0].UserId;
				}
				if(parseInt(data.data.replyUserId) === events.getUtid()) { //自己无法回复自己
					return;
				}

			}
			events.openNewWindowWithData('detail-comment.html', data);
		},
		//打开个人主页
		openPersonSpace: function(usrId) {
			mui.openWindow({
				url: "../quan/zone_main.html",
				id: "zone_main.html",
				style: {
					top: '0px',
					height: '0px'
				},
				extras: {
					data: usrId,
					NoReadCnt: 0,
					flag: 0
				},
				createNew: true
			})
		},
		openLikers: function() {
			events.fireToPageWithData("../quan/classSpace-persons.html", "personsList", {
				userSpaceId: this.showDetail.TabId,
				type: 3
			})
		},
		showSheet: function(comment, index0, index1) {
			var commentId;
			if(typeof(index1) === "number") {
				commentId = comment.Replys[index1].UserId;
			} else {
				commentId = comment.UserId;
			}
			if(parseInt(commentId) !== events.getUtid()) {
				return;
			}
			events.showActionSheet([{
				title: '删除',
				dia: 1
			}], [function() {
				commentList.delComment(comment, index0, index1);
			}])
		},
		//删除评论
		delComment: function(comment, index0, index1) {
			var showDetails = this.showDetail;
			var wd = events.showWaiting();
			var tabId;
			if(typeof(index1) === "number") {
				tabId = comment.Replys[index1].TabId;
			} else {
				tabId = comment.TabId;
			}
			postDataPro_delUserSpaceCommentById({
				userSpaceCommentId: tabId
			}, wd, function(data) {
				wd.close();
				//console.log("删除留言后的数据：" + JSON.stringify(data))
				if(data.RspCode == 0) {
					if(data.RspData.Result) {
						if(typeof(index1) === 'number') {
							showDetails.Comments[index0].Replys.splice(index1, 1);
						} else {
							showDetails.Comments.splice(index0, 1);
						}
					}
				} else {
					mui.toast(data.RspTxt);
				}
			})
		},
		//获取图片尺寸
		getImgRe: function(imgs) {
			if(imgs.length == 0) {
				return {};
			}
			var winWidth = this.winWidth - 30;
			//console.log('获取元素的宽度：' + winWidth);
			var imgRe = {
				width: 0,
				height: 0
			};
			if(imgs[0].type == 1) {
				this.isVideo = false;
				if(imgs.length < 3) {
					imgRe.width = winWidth / imgs.length - 5 + 'px';
					imgRe.height = winWidth * 0.45 + 'px';
				} else {
					imgRe.width = winWidth / 3 - 5 + 'px';
					imgRe.height = imgRe.width;
				}
				return imgRe;
			}
			if(imgs[0].type == 2) {
				this.isVideo = true;
				var request = new XMLHttpRequest();
				request.open('GET', imgs[0].encImg + '?imageInfo', false);
				request.send();
				var imgInfo = JSON.parse(request.responseText);
				//console.log("获取的图片信息：" + JSON.stringify(imgInfo));
				if(imgInfo.width > imgInfo.height) { //宽>高
					imgRe.height = imgInfo.height / (imgInfo.width / winWidth) + 'px';
					imgRe.width = winWidth + 'px';
				} else { //宽<=高
					winWidth = winWidth * 0.78;
					imgRe.width = imgInfo.width / (imgInfo.height / winWidth) + 'px';
					imgRe.height = winWidth + 'px';
				}
				//console.log("最终图片尺寸" + JSON.stringify(imgRe));
				return imgRe;
			}
		},
		//缩略图点击效果
		exFileTapListener: function(showDetail, img, index) {
			var imgs = commentList.getImgs(showDetail);
			if(imgs[0].type === 1) { //图片

			} else if(imgs[0].type === 2) { //视频播放
				video.playVideo(img.encAddr, img.encImg, function() {
					//console.log("视频播放回调！");
				});
			}
		}
	}
})