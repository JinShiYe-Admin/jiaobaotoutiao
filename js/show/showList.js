//Vue.component("show-card", {
//	props: ['items'],
//	template: '<div v-bind:class="mui-table-view cityNews-container"><li v-for="item of items" class="mui-table-view-cell news-container" v-on:tap="jumpToDetail()"><div class="img-container news-img"' +
//		' style="background-image:url(../../image/utils/video-loading.gif);text-align:center;background-position:center;background-size:cover;">' +
//		'<img v-if="isVideo(item)" class="play-video" src="../../image/utils/playvideo.png"/>' +
//		'</div>' +
//		'<div class="news-words"><p class="news-title single-line">{{item.MsgTitle }}</p>' +
//		'<div class="anthor-date"><p class="news-anthor single-line">{{ item.unick }}</p><p class="news-date">' +
//		'{{item.PublishDate}}</p></div></div></li></div>',
//	methods: {,
//		jumpToDetail: function(e) {
//			events.singleWebviewInPeriod(e.target, "../quan/space-detail.html", item.info);
//		}
//	}
//})
var showList = new Vue({
	el: "#slider",
	data: {
		attendedList: [],
		allList: [],
		isAttended:false
	},
	methods: {
		isVideo: function(item) {
			var isVideo = false;
			if(item.EncType) {
				switch(item.EncType) {
					case 2: //视频
						isVideo = true;
						break;
					case 5: //图文混合
						var addrs = item.EncAddr.split(".");
						switch(addrs[addrs.length - 1]) {
							case "mp4":
							case "MP4":
								isVideo = true;
								break;
							default:
								break;
						}
						break;
					default:
						break;
				}
			}
			return isVideo;
		},
		jumpToDetail: function(item) {
			events.openNewWindowWithData("../quan/space-detail.html", item.info);
			//		events.singleWebviewInPeriod(e.target, "../quan/space-detail.html", item.info);
		},
		updateData: function() {
			this.$nextTick(function() {
				jQuery(".img-container").lazyload();
			})
		},
		getItemImg:function(item){
			return item.EncImgAddr.split("|")[0];
		}
	}
})