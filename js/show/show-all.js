var showAll = new Vue({
	el: '#show-all',
	data: {
		listData: [],
		detailReady: false,
		isRequired: false
	},
	watch: {
		listData:function(val){
			if(val.length>0){
				document.body.style.backgroundColor="transparent";
			}else{
				document.body.style.backgroundColor="white";
			}
			this.$nextTick(function(){
				jQuery('.news-img').lazyload();
			})
		}
	},
	methods: {
		resetData: function() {
			this.listData = [];
		},
		addData: function(pageIndex, dataArr) {
			if(pageIndex == 1) {
				this.listData = [];
			}
			for(var i = 0; i < dataArr.length; i += 6) {
				this.listData.push(dataArr.slice(i, i + 6));
			}
		},
		getBackImg: function(item, index) {
			if(item.EncImgAddr) {
				return item.EncImgAddr.split('|')[0]
			}
			if(parseInt(index) > 0) {
				return '../../image/show/show-default-small.png';
			}
			return '../../image/show/show-default-large.png';
		},
		jumpToPage: function(item) {
			console.log("点击事件")
			if(myStorage.getItem(storageKeyName.ISSHOWDETAILREADY)) {
				events.fireToPageWithData("show-detail.html", "showDetail", item);
			} else {
				setTimeout(function() {
					showAll.jumpToPage(item)
				}, 500);
			}
		},
		isVideo: function(cell) {
			var isVideo = false;
			if(cell.EncType) {
				switch(cell.EncType) {
					case 2: //视频
						isVideo = true;
						break;
					case 5: //图文混合
						var addrs = cell.EncAddr.split(".");
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
			return isVideo
		}
	}
})