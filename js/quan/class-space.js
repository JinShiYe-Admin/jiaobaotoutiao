Vue.component("class-item", {
	props: ['item'],
	template: '<li class="mui-table-view-cell" v-bind:style="itemContainer">' +
		'<div v-bind:style="pubContainer" class="single-line">' + '<img v-bind:src="getHeadImg(item)" v-bind:style="headImg"/>' + '<p>{{getShowName(item)}}</p>' + '</div>' +
		'<div class="chat_content_left" v-bind:style="chatLeft" ref="chatLeft">' + '<p>{{item.MsgContent}}</p>' + '<div>{{getImgInner(item)}}</div>' + '<p></p>' + '</div>' +
		'</li>',
	data: function() {
		return {
			itemContainer: {
				display: "flex"
			},
			headImg: {
				width: "4rem",
				height: "4rem"
			},
			pubContainer: {
				width: "4rem"
			},
			chatLeft: {
				width: "50%",
				"flex-grow": "1",
				"margin-left": "2rem"
			}
		}
	},
	methods: {
		getHeadImg: function(item) {
			return item.uimg ? item.uimg : "../../image/utils/default_personalimage.png";
		},
		getShowName: function(item) {
			if(item.bunick) {
				return item.bunick;
			}
			if(item.ugname) {
				return item.ugname;
			}
			if(item.unick) {
				return item.unick;
			}
			return "";
		},
		getImgInner: function(item) {
			var width = this.getBubWidth();
			var inner = "";
			if(item.EncAddr) {
				var imgs = item.EncImgAddr.split('|');
				var trueImgs = item.EncAddr.split('|');
				var imgWidth;
				var imgHeight;
				if(imgs.length < 3) {
					imgWidth = width / imgs.length;
					imgHeight = width * 0.45;
				} else {
					imgWidth = width / 3;
					imgHeight = imgWidth;
				}
				switch(parseInt(item.EncType)) {
					case 1:
						for(var i in imgs) {
							inner += '<div class="img-container display-inlineBlock" data-original=' + imgs[i] + ' style="background-image:url(../../image/utils/default_load_2_1.gif); width:' + imgeWith + 'px; height:' + imgHeight +
								'px;margin-right:2px;background-position:center;background-repeat:no-repeat;background-size:cover;"' +
								' data-preview-src="' + trueImgs[i] + '" data-preview-group="' + cell.PublishDate + index + '"></div>'
						}
						break;
					case 2:
						inner += '<div class="video-container"  style="width:' + imgWidth + 'px;height:' + imgHeight + 'px;margin-bottom:8px;background-image:url(' + imgs[0] + ');background-color:#101010; background-position:center;background-size:auto 120%;background-repeat:no-repeat;">' +
							'<img src="../../image/utils/playvideo.png" style="width:36px;height:36px;margin:' + (imgHeight- 36) / 2 + 'px ' + (width - 36) / 2 + 'px;"/>' + '</div>'
						break;
					default:
						break;
				}
			}
			return inner;
		},
		getBubWidth: function() {
			var width = this.$refs.chatLeft.clientWidth;
			//console.log("width" + width);
			return width;
		}
	}
});
var classList = new Vue({
	el: "#class-list",
	data: {
		list: [],
		pageIndex: 1,
		classInfo: {},
		personalInfo: {}
	},
	methods: {
		//获取班级动态列表
		getList: function() {
			var wd = events.showWaiting();
			if(!this.personalInfo.utid) {
				classList.getPersonalInfo();
			}
			if(!this.classInfo.classId) {
				classList.getClassInfo();
			}
			postDataPro_getClassSpacesByUserForClass({
				userId: parseInt(this.personalInfo.utid),
				classId: this.classInfo.classId,
				pageIndex: this.pageIndex,
				pageSize: 10
			}, wd, function(data) {
				wd.close();
				//console.log("获取的班级空间信息" + JSON.stringify(data));
				if(data.RspCode == 0) {
					var listData = data.RspData.Data;
					if(listData.length > 0) {
						classList.getClassPersenInfo(classList.getPersonIds(listData), listData, classList.rechargeListData)
					} else {
						mui.toast("暂无班级动态！")
					}
				} else {
					mui.toast(data.RspTxt);
				}
			})
		},
		//组合数据
		rechargeListData: function(listData, singlePersen) {
			for(var i in listData) {
				if(singlePersen[listData[i].PublisherId]) {
					Object.assign(listData[i], singlePersen[listData[i].PublisherId]);
				}
			}
			if(this.pageIndex == 1) {
				this.list = listData;
			} else {
				this.list = this.list.concat(listData);
			}
			//console.log("获取的班级空间数据：" + JSON.stringify(this.list));
		},
		//获取成员id
		getPersonIds: function(data) {
			var persenIds = [];
			for(var i in data) {
				persenIds.push(data[i].PublisherId);
			}
			return events.arraySingleItem(persenIds);
		},
		//获取备注名称
		getRemarkName: function(ids, listData, singlePersen, callback) {
			var wd = events.showWaiting();
			postDataPro_PostUmk({
				vvl: ids.toString()
			}, wd, function(data) {
				JSON.stringify("获取的备注信息：" + JSON.stringify(data));
				wd.close();
				if(data.RspCode == 0) {
					for(var i in data.RspData) {
						Object.assign(singlePersen[data.RspData[i].butid], data.RspData[i]);
					}
				}
				if(Object.keys(singlePersen).length < ids.length) {
					ids = ids.filter(function(item, index, ids) {
						return !Boolean.parse(singlePersen[item]);
					})
				}
				classList.getPersonalInfos(ids, listData, singlePersen, callback);
			})
		},
		//获取群成员信息
		getClassPersenInfo: function(ids, listData, callback) {
			var wd = events.showWaiting();
			postDataPro_PostGusers({
				vvl: this.classInfo.classId,
				vvl1: -1,
				top: -1
			}, wd, function(data) {
				wd.close();
				var singlePersen = {};
				if(data.RspCode == 0) {
					//console.log("获取的班级成员信息" + JSON.stringify(data));
					var classPersen = data.RspData;
					for(var i in classPersen) {
						if(classPersen[i].mstype == 1 || classPersen[i].mstype == 2) {
							singlePersen[classPersen[i].utid] = classPersen[i];
						}
					}
					for(var j in classPersen) {
						if(!singlePersen[classPersen[i].utid]) {
							singlePersen[classPersen[i].utid] = classPersen[i];
						}
					}

				}
				classList.getRemarkName(ids, listData, singlePersen, callback)
			})
		},
		//获取个人信息
		getPersonalInfos: function(ids, listData, singlePersen, callback) {
			var wd = events.showWaiting();
			postDataPro_PostUinf({
				vvl: ids.toString(),
				vtp: 'g'
			}, wd, function(data) {
				wd.close();
				//console.log("获取的个人信息数据：" + JSON.stringify(data));
				if(data.RspCode == 0) {
					var personalInfos = data.RspData;
					for(var i in personalInfos) {
						if(!singlePersen[personalInfos[i].utid]) {
							singlePersen[personalInfos[i].utid] = personalInfos[i];
						}
					}
				}

				callback(listData, singlePersen);
			})
		},
		//获取班级信息的方法，需在plusReady里调用；
		getClassInfo: function() {
			//班级info
			this.classInfo = plus.webview.currentWebview().data;
		},
		//获取个人信息，在plusready里调用
		getPersonalInfo: function() {
			//个人信息
			this.personalInfo = myStorage.getItem(storageKeyName.PERSONALINFO);
		}
	}
})