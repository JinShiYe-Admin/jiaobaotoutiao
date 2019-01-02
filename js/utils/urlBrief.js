/**
 * 通过网址 获取网址简介模块
 * @anthor an 
 */
var urlBrief = (function(mod) {
	mod.message='';
	mod.urlArrays = new Array();
	mod.itemArray = new Array();
	/**
	 * 从信息中获取Url
	 * @param {Object} message 要替换的信息
	 * @param {Object} callback 回调函数 以获取的替换信息为参数
	 */
	mod.getUrlFromMessage = function(message,callback) {
		mod.message=message;
		/**
		 * 网址的正则表达式
		 * 以http/https/ftp开头
		 */
		var regex = new RegExp("(http|https|ftp)://[a-zA-Z0-9\\.\\-\/#&=\\?]+", "g");
		var thisUrl = null;
		
		do {//先获取第一个满足正则白大师的字段
			thisUrl = regex.exec(message);
			if(thisUrl != null) {
				mod.urlArrays.push(thisUrl[0]);
				//console.log('thisUrl=' + thisUrl[0]);
				//通过网址获取各类信息
				getInfoFromUrl(thisUrl[0], thisUrl.index,callback);
			}
		//如果有符合正则表达式的字段，获取下一个
		} while (thisUrl != null)

	}
	/**
	 * 从Url中获取信息
	 * @param {Object} urls 要获取信息的url
	 * @param {Object} index 位置信息
	 * @param {Object} callback 回调函数
	 */
	var getInfoFromUrl = function(urls, index,callback) {
		mui.ajax(urls, {
			dataType: 'text',
			timeout: 10000,
			//得到html
			success: function(data) {
				//console.log(data)
				var UrlItem = new Object();
				UrlItem.url = urls;
				UrlItem.title = getInnerHTMLTitle(data);
				UrlItem.keywords = getInnerHTMLKeywords(data);
				UrlItem.desc = getInnerHTMLDes(data);
				UrlItem.pic = getFirstHTMLPic(data)
				UrlItem.words = getWords(data);
				UrlItem.index = index;
				//console.log("info:" +mod.message);
				UrlItem.message = getSendMessge(UrlItem);
				//console.log("after:" +mod.message);
				mod.itemArray.push(UrlItem);
//				putMessageInView(document.getElementById('talk'))
				//获取替换后的信息
				mod.getMessage(callback);

			},
			//获取不到html
			error: function(xhr, type, errorThrown) {
				mod.itemArray.push(null);
				//获取替换后的信息
				mod.getMessage(callback);
//				putMessageInView(document.getElementById('talk'))
			}

		})
	}
	/**
	 * 获取标题
	 * @param {Object} data
	 */
	var getInnerHTMLTitle = function(data) {
		var regex = new RegExp("<title>[\\w\\W]*<\/?title>");
		var thisText = regex.exec(data);
		if(thisText != null) {
			var title = thisText[0].replace(/<\/?title>/g, '')
			return title;
		}
		return null;
	}
	/**
	 * 获取关键字
	 * @param {Object} data
	 */
	var getInnerHTMLKeywords = function(data) {
		var regex = new RegExp('meta\\s+name="keywords"[^>]*\/?>');
		var keywords = regex.exec(data);

		if(keywords != null) {
			var keyword = keywords[0].replace(/meta[\s\S]*content="/g, "").replace(/"[\w\W]*\/>/g, '');
			return keyword;
		}
		return null;

	}
	/**
	 * 获取页面描述
	 * @param {Object} data html信息
	 */
	var getInnerHTMLDes = function(data) {
		var regex = new RegExp('meta\\s+name="description"[^>]*\/?>');
		var des = regex.exec(data);

		if(des != null) {
			var description = des[0].replace(/meta[\s\S]*content=\"/g, "").replace(/"[\w\W]*\/>/g, '');
			//console.log(description);
			return description;
		}
		return null;
	}
	/**
	 * 获取内容图片
	 * @param {Object} data html信息
	 */
	var getFirstHTMLPic = function(data) {
		var regex = new RegExp('<img [^>]*src=[\'\"](((http|https|ftp)://|//)[a-zA-Z0-9\\.\\-]+)[^>]*>');
		var pic = regex.exec(data);

		if(pic != null) {
			return pic[0];
		}
		return null;
	}
	/**
	 * 获取内容
	 * @param {Object} data html信息
	 */
	var getWords = function(data) {
		var regex = new RegExp('<p[^>]*>[^(?!.*p>)]*p>', 'g');

		do {
			var p = regex.exec(data);
			if(p != null) {
				//console.log(p[0] + p.index)
				var words = p[0].replace(/<p[^>]*>/, '').replace(/<\/?p>/, '');
				if(words.length > 50) {
					//console.log(words);
					return words;
				}
			}
		} while (p != null)

		return null;
	}
	/**
	 * url更换后的内容 
	 * @param {Object} UrlItem 获取各类信息
	 */
	var getSendMessge = function(UrlItem,message) {
		var replaceWords = '<a href="'+UrlItem.url+'">' +
			'<h6>' + UrlItem.title + '</h6>' +
			UrlItem.pic +
			'<p>' + UrlItem.desc + '</p>' +
			UrlItem.words +
			'</a>'
		//console.log(UrlItem.url)
		mod.message =mod.message.replace(UrlItem.url, replaceWords);
	}
	/**
	 * 获取的最终信息
	 */
	mod.getMessage= function(callback) {
		if(mod.urlArrays.length == mod.itemArray.length) {
			mod.urlArrays = [];
			mod.itemArray = [];
			callback(mod.message);
		}
	}
	return mod;
})(urlBrief || {})