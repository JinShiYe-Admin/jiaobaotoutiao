var autoTextArea = (function(mod) {
	var minHeight;
	mod.set = function(parentElem, elem, leftElem, maxWords) {
		//console.log("######################这里运行自适应高度################")
		var addEvent = function(type, callback) {
			elem.addEventListener ?
				//正常人类加载事件方法
				elem.addEventListener(type, function() {
					callback(parentElem, elem, leftElem, maxWords)
				}, false) :
				//微软加载事件方法
				elem.attachEvent('on' + type, function() {
					callback(parentElem, elem, leftElem, maxWords)
				});
		};
		//最小高度即为当前控件的高度
		minHeight = parseFloat(getStyle(elem, 'height'));
		//console.log("获取的高度：" + minHeight)
		//textarea 用户无法调整控件的	尺寸
		elem.style.resize = 'none';
		addEvent('propertychange', mod.change); //ie输入事件
		addEvent('input', mod.change); //输入事件
		addEvent('focus', mod.change); //获取焦点事件
		elem.onkeydown=function(event){
			//console.log("键盘输入事件："+JSON.stringify(event))
			if(event.keyCode==13){
				return false;
			}
		}
		mod.change(parentElem, elem, leftElem, maxWords);
	};
	//获取样式
	var getStyle = function(elem, name) {
		return getComputedStyle(elem, null)[name];
	}
	//改变
	mod.change = function(parentElem, elem, leftElem, maxWords) {
		//console.log("#######################change事件##################")
		//定义scrollTop 高度，
		//内边距为0
		var scrollTop, height,
			padding = 0,
			//style为控件的style
			style = elem.style;
		//		var elem._length=0;
		//如果这个属性 =value.length 就此别过
//		if(elem._length) {
//			if(elem._length === elem.value.length) {
//				return;
//			}
//		}
		//否则 让元素的_length属性=value.length
//		elem._length = elem.value ? elem.value.length : 0;
		//边距=上内边距+下内边距
		padding = parseInt(getStyle(elem, 'paddingTop')) + parseInt(getStyle(elem, 'paddingBottom'));
//		jQuery(elem).prop("maxLength",maxWords+elem.value.length-jQuery.trim(elem.value).length)
		//scrollTop
		scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
		//输入框初始高度
		elem.style.height = minHeight + 'px';
		parentElem.style.height = minHeight + 1 + 'px';
		//console.log("输入框初始高度：" + minHeight);
		
		//如果滚动高度大于最小宽度
		leftElem.innerText = maxWords - elem.value.length;
		if(elem.scrollHeight > minHeight) {
			//console.log("输入框实际高度：" + elem.scrollHeight);

			//有最大高度 且  滚动高度>最大高度
			//				if(maxHeight && elem.scrollHeight > maxHeight) {
			//					height = maxHeight; //控件实际高度=最大高度-边距
			//					style.overflowY = 'auto'; //超出y距离
			//				} else {
			height = elem.scrollHeight; //控件实际高度=滚动距离-边距
			style.overflowY = 'hidden'; //超出y距离隐藏
			//				};
			style.height = height  + 'px'; //控件高度=实际高度+光标与输入框的距离
			parentElem.style.height = height  + 1 + 'px';

			//console.log("输入框高度：" + style.height);
			scrollTop += parseInt(style.height) - elem.currHeight; //差值
			document.body.scrollTop = scrollTop; //整个页面的scrollTop
			document.documentElement.scrollTop = scrollTop; //同上
			elem.currHeight = parseInt(style.height); //当前高度
		};
		elem.value=elem.value.replace(/\/n/g,"");
	};
	return mod;
})(autoTextArea || {});