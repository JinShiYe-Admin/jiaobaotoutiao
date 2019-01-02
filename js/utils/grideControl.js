/**
 * @anthor an
 */
/**
 * 
 * @param {Object} gride 九宫格父控件
 * @param {Object} array 元素数组，包括图标和标题
 */
var createGride = function(gride, array) {

	//数组遍历
	array.forEach(
		/**
		 * 创建子元素
		 * @param {Object} map 数组元素
		 * @param {Object} index 数组序号
		 * @param {Object} array 数组
		 */
		function(map, index, array) {
			var li = document.createElement('li'); //子元素
			//			var bgColor=getRandomColor();//获取背景色
			if(array.length <= 3) { //数组小于等于3，每行3个图标
				li.className = "mui-table-view-cell mui-media mui-col-xs-4 mui-col-sm-4";
			} else { //数组大于3，每行四个图标
				li.className = "mui-table-view-cell mui-media mui-col-xs-3 mui-col-sm-3";
			}
			//子控件的innerHTML
			li.innerHTML = '<a href="#">' +
				'<img class="circular-square" src="' + updateHeadImg(map.uimg,2) + '"/></br>' +
				'<small class="">' + getName(map) + '</small>' +
				'</a>';
			/**
			 * 子控件加载点击监听事件
			 */
			li.addEventListener('tap', function() {
				openTarWindow(map.tarUrl, map, index, array);
			})
			//父控件加载子控件
			gride.appendChild(li)
		})
}
var getName = function(item) {
	if(item.bunick) {
		return item.bunick;
	}
	if(item.ugname) {
		return item.ugname;
	}
	if(item.unick) {
		return item.unick;
	}
}
//var getImg = function(img) {
//	return img == null ? "../../image/utils/default_personalimage.png" : img
//}
/**
 * 创建子控件数组
 * @param {Object} chars 底部标题 数组
 * @param {Object} imgUrls 图片Url 数组
 * @param {Object} urls 跳转页面Url数组
 */
var createArray = function(chars, imgUrls, urls) {
	var array = new Array();
	//遍历
	for(i = 0; i < chars.length; i++) {
		var value = {
			description: chars[i],
			imgUrl: imgUrls[i],
			tarUrl: urls[i]
		}
		array.push(value)
	}
	//console.log(JSON.stringify(array))
	return array;
}

/**
 * 打开新页面
 */
var openTarWindow = function(tarUrl, map, index, array) {
	mui.openWindow({
		url: tarUrl,
		id: tarUrl,
		styles: {
			top: localStorage.getItem('$Statusbar') //设置距离顶部的距离
		},
		extras: { //界面传值
			name0: map.description,
			name1: map.imgUrl,
			index: index
		}
	});
	//console.log('打开新界面：' + index);
}