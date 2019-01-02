//课程详情列表的公共方法
var courseDetails = (function(mod) {
	mod.width = null;
	mod.height = null;
	mod.playMarginTop = null;
	mod.playMarginLeft = null;
	/**
	 * 初始化
	 */
	mod.init = function() {
		mod.width = parseInt((plus.screen.resolutionWidth - 30) * 0.35);
		mod.height = parseInt(mod.width * (3 / 5));
		mod.playMarginTop = parseInt((mod.height - 35) / 2);
		mod.playMarginLeft = parseInt((mod.width - 35) / 2);
	}

	/**
	 * 课程列表中的图片加载成功
	 * @param {Object} img 图片元素
	 */
	mod.onImageLoad = function(img) {
		if(img.offsetHeight < img.offsetWidth) {
			if(img.offsetHeight < courseDetails.height) {
				img.style.height = courseDetails.height + "px";
				img.style.width = "initial";
			} else if(img.offsetHeight > courseDetails.height) {
				img.style.marginTop = -parseInt((img.offsetHeight - courseDetails.height) / 2) + "px";
			}
			img.style.marginLeft = -parseInt((img.offsetWidth - courseDetails.width) / 2) + "px";
		} else {
			img.style.marginTop = -parseInt((img.offsetHeight - courseDetails.height) / 2) + "px";
		}
		img.style.visibility = "visible";
	}

	/**
	 * 音视频显示的时间
	 * @param {Object} time
	 */
	mod.getAudioTime = function(time) {
		time = time || 0;
		var strTime = "";
		var hour = Math.floor(time / 3600);

		if(hour > 0) {
			if(hour < 10) {
				strTime = "0" + hour + ':';
			} else {
				strTime = hour + ':';
			}
		}
		var min = Math.floor((time - 3600 * hour) / 60);
		if(min < 10) {
			strTime = strTime + "0" + min + ':';
		} else {
			strTime = strTime + min + ':';
		}
		var sec = time - 3600 * hour - 60 * min;
		if(sec < 10) {
			strTime = strTime + "0" + sec;
		} else {
			strTime = strTime + sec;
		}
		return strTime;
	}

	/**
	 * 课程列表中的图片加载失败
	 * @param {Object} img
	 */
	mod.onImageError = function(img) {
		img.style.visibility = "visible";
		img.src = "../../image/utils/load-img-error.png"
	}

	/**
	 * 音频的外框
	 * @param {Object} width
	 */
	mod.getAudioBorderPath = function(width) {
		if(!width) {
			width = width || plus.screen.resolutionWidth;
			width = parseInt(width * 3 / 5);
		}
		var pathD = "M8 45 C13 40 15 38 15 25 L15 21 Q15 1 36 1 L" + width + " 1 Q" + (width + 20) + " 1 " + (width + 20) + " 21 Q" + (width + 20) + " 41 " + width + " 41 L30 41 Q15 41 12 43 L8 45 Z"
		return pathD;
	}
	return mod;
})(window.courseDetails || {})