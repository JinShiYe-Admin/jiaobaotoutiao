var off_canvas = (function($, mod) {
	var main, menu;
	//	var mask = $.createMask(_closeMenu);
	mod.showMenu = false;
	mod.init = function() {
		$.init({
			swipeBack: false,
			beforeback: mod.back,
			gestureConfig: {
				longtap: true
			}
		});
	}
	/**
	 * 
	 * @param {Object} maskType 0关闭1打开
	 */
	mod.toggleMask = function(maskType) {
		if(maskType) {
			main.parent().setStyle({
				mask: "rgba(0,0,0,0.4)"
			});
		} else {
			main.parent().setStyle({
				mask: "none"
			});
		}
		//		$.fire(plus.webview.getWebviewById("index.html"),"toggleMask",maskType);
	}
	mod.back = function() {
		if(mod.showMenu) {
			//菜单处于显示状态，返回键应该先关闭菜单,阻止主窗口执行$.back逻辑；
			mod.closeMenu();
			return false;
		} else {
			//菜单处于隐藏状态，执行返回时，要先close菜单页面，然后继续执行$.back逻辑关闭主窗口；
			//			menu.close('none');
			return true;
		}
	}
	mod.add = function(pagePath, interval) {
		mod.initMenu(pagePath, interval);
		mod.setListener();
	}
	/**
	 * 创建侧滑菜单窗口
	 * @param {Object} pagePath 路径
	 * @param {Object} interval 时间间隔
	 */
	mod.initMenu = function(pagePath, interval) {
		main = plus.webview.currentWebview();
		main.parent().addEventListener('maskClick', mod.closeMenu);
		var ids = pagePath.split("/");
		var id = ids[ids.length - 1];
		if(!(interval && typeof interval == "number")) {
			interval = 0;
		}
		setTimeout(function() {
			menu = $.preload({
				id: id,
				url: pagePath,
				styles: {
					left: 0,
					width: '70%',
					zindex: 9997
				}
			})
		}, interval)
	}
	//	//plusReady事件后，自动创建menu窗口；
	//	$.plusReady(function() {
	//		main = plus.webview.currentWebview();
	//		//setTimeout的目的是等待窗体动画结束后，再执行create webview操作，避免资源竞争，导致窗口动画不流畅；
	//		setTimeout(function() {
	//			//侧滑菜单默认隐藏，这样可以节省内存；
	//			menu = $.preload({
	//				id: 'offcanvas-drag-right-plus-menu',
	//				url: 'offcanvas-drag-right-plus-menu.html',
	//				styles: {
	//					left: 0,
	//					width: '70%',
	//					zindex: 9997
	//				}
	//			});
	//		}, 300);
	//
	//	});
	/**
	 * 显示菜单菜单
	 */
	mod.openMenu = function() {
		if(!mod.showMenu) {
			//侧滑菜单处于隐藏状态，则立即显示出来；
			//显示完毕后，根据不同动画效果移动窗体；
			menu.show('none', 0, function() {
				menu.setStyle({
					left: '0%',
					transition: {
						duration: 150
					}
				});
			});
			//显示遮罩
			//			mask.show();
			mod.toggleMask(1);
			mod.showMenu = true;
		}
	}

	/**
	 * 关闭侧滑菜单
	 */
	mod.closeMenu = function() {
		_closeMenu();
		//关闭遮罩
		mod.toggleMask(0);
		//		mask.close();
	}

	/**
	 * 关闭侧滑菜单（业务部分）
	 */
	function _closeMenu() {
		if(mod.showMenu) {
			//主窗体开始侧滑；
			menu.setStyle({
				left: '-70%',
				transition: {
					duration: 0
				}
			});

			//等窗体动画结束后，隐藏菜单webview，节省资源；
			setTimeout(function() {
				menu.hide();
			}, 200);
			//改变标志位
			mod.showMenu = false;
		}
	}

	/**
	 * 加载监听
	 */
	mod.setListener = function() {
		//点击左上角侧滑图标，打开侧滑菜单；
		document.querySelector('.img-icon').addEventListener('tap', function(e) {
			if(mod.showMenu) {
				mod.closeMenu();
			} else {
				events.fireToPageWithData('../cloud/cloud_home.html', 'topPopover', {
					flag: 1
				})
				mod.openMenu();
			}
		});
		//在android4.4中的swipe事件，需要preventDefault一下，否则触发不正常
		//故，在dragleft，dragright中preventDefault
		window.addEventListener('dragright', function(e) {
			e.detail.gesture.preventDefault();
		});
		window.addEventListener('dragleft', function(e) {
			e.detail.gesture.preventDefault();
		});
		window.addEventListener("menu:close", mod.closeMenu);
		window.addEventListener("menu:open", mod.openMenu);
		//重写$.menu方法，Android版本menu按键按下可自动打开、关闭侧滑菜单；
		$.menu = function() {
			if(mod.showMenu) {
				mod.closeMenu();
			} else {
				mod.openMenu();
			}
		}
	}
	return mod;
})(mui, off_canvas || {});