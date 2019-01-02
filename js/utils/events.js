//公共方法js
window.onerror = function (errorMessage, scriptURI, lineNumber, columnNumber, errorObj) {
    console.log("错误信息-0:", errorMessage.detail);
    console.log("错误信息-1:" + errorMessage);
    console.log("出错文件:" + scriptURI);
    console.log("出错行号:" + lineNumber);
    console.log("出错列号:" + columnNumber);
    console.log("错误详情:" + errorObj);
    var webUrl = window.location.toString();
    var ids = webUrl.split("/");
    var webId = ids[ids.length - 1];
    var showAlert = false;
    switch (webId) { //主页，预加载的页面
        case "firstPage.html": //初始页
        case "index.html": //主页
        case "cloud_home.html": //云盘主页
        case "sciedu_home.html": //科教主页
        case "show-home.html": //展现主页
        case "show-attended.html": //展现关注
        case "show-all.html": //展现全部
        case "course-home.html": //微课主页
        case "course-attended.html": //课程关注
        case "course-all.html": //课程全部
        case "storage_transport.html": //预加载-传输列表页
        case "sciedu_show_main.html": //预加载-科教新闻详情页
            break;
        default:
            showAlert = true;
            break;
    }
    var isMuiLazyError = false; //是否是mui懒加载的BUG
    if (errorMessage.detail != undefined) {
        //mui懒加载的BUG的判断逻辑
        if (errorMessage.detail["element"] != undefined && errorMessage.detail["uri"] != undefined) {
            if (errorMessage.detail["element"]["_mui_lazy_width"] != undefined || errorMessage.detail["element"][
                    "_mui_lazy_height"
                ] != undefined) {
                isMuiLazyError = true;
            }
        }
    }
    if (!scriptURI) {
        return;
    }
    if (window.plus) {
        if (isMuiLazyError) {
            return;
        }
        if (showAlert) {
            console.log("界面id:" + plus.webview.currentWebview().id);
            plus.nativeUI.alert('当前界面加载出现错误', function () {
                console.log("界面id:" + webId);
                plus.webview.close(webId, utils.getAniClose());
            }, 'ERROR', '确定');
        } else {
            plus.nativeUI.toast('当前界面加载出现错误');
        }
        plus.nativeUI.closeWaiting();
    } else {
        window.alert("当前界面加载出现错误");
    }
}

var events = (function (mod) {

    mod.click = false; //是否是点击状态
    mod.clickTime = 1000; //点击持续时间，默认1秒
    //	mod.setClickAble=function(canClick){
    //		myStorage.setItem(storageKeyName.VIEWCANCLICK,canClick);
    //	}
    //	mod.getClickAble=function(){
    //	   return Boolean.parse(myStorage.getItem(storageKeyName.VIEWCANCLICK));
    //	}
    //	mod.setClickAble(true);
    //去掉所有html标签
    mod.deleteHtml = function (text) {
        //		var dd = text.replace(/<\/?.+?>/g, "");
        //		var dds = dd.replace(/ /g, "");
        var reTag = /<(?:.|\s)*?>/g;
        return text.replace(reTag, "");
        //		return dds;
    }

    //判断输入字符串是否为空或者全部都是空格
    mod.isNull = function (str) {
        if (str == "") return true;
        var regu = "^[ ]+$";
        var re = new RegExp(regu);
        return re.test(str);
    }

    /**
     * 绑定监听
     * @param {Object} id 绑定dom的Id
     * @param {Object} event 绑定的监听事件
     */
    mod.addTap = function (id, event) {
        //		//console.log("获取当前页面的id：" + plus.webview.currentWebview().id);
        var item = document.getElementById(id);
        if (item) {
            item.addEventListener('tap', event);
        } else {
            //console.log('### ERROR ### 页面: ' + plus.webview.currentWebview().id + ' 未找到id为 ' + id + ' 的元素');
        }
    }
    /**
     * 加载跳转界面监听的公用方法
     * @param {Object} item 加载监听的控件
     * @param {Object} targetHTML 目标Url
     */
    mod.jumpPage = function (item, targetHTML) {
        item.addEventListener('tap', function () {
            mod.openNewWindow(targetHTML);
        })
    }
    /**
     * 打开新界面
     * @param {Object} targetPage 目标界面
     */
    mod.openNewWindow = function (tarPagePath) {
        if (mod.click) {
            return false;
        }
        mod.click = true;
        setTimeout(function () {
            mod.click = false;
        }, mod.clickTime);

        var tarPageIds = tarPagePath.split('/');
        var targetPage = plus.webview.getWebviewById(tarPageIds[tarPageIds.length - 1]);
        //console.log('targetPage是否存在:' + Boolean(targetPage))
        if (targetPage) {
            targetPage.show('slide-in-right', 250);
        } else {
            mui.openWindow({
                url: tarPagePath,
                id: tarPageIds[tarPageIds.length - 1],
                show: {
                    anishow: 'slide-in-right',
                    duration: 250
                },
                waiting: {
                    title: '正在加载...'
                },
                styles: mod.getWebStyle(tarPagePath)
            })
        }

    }
    /**
     * 打开新页面时，同时传值
     * 扩展参数仅在打开新窗口时有效，若目标窗口为预加载页面，
     * 则通过mui.openWindow方法打开时传递的extras参数无效。
     * @param {Object} targetHTML 新页面路径
     * @param {Object} passData 获取要传的值
     */
    mod.openNewWindowWithData = function (targetHTML, passData) {
        if (mod.click) {
            return false;
        }
        mod.click = true;
        setTimeout(function () {
            mod.click = false;
        }, mod.clickTime);
        mui.openWindow({
            url: targetHTML,
            id: targetHTML.split('/')[targetHTML.split('/').length - 1],
            extras: {
                data: passData
            },
            show: {
                anishow: 'slide-in-right',
                duration: 250
            },
            waiting: {
                title: '正在加载...'
            },
            createNew: true,
            styles: mod.getWebStyle(targetHTML)
        });
    };
    /**
     * 加载子页面
     * @param {Object} subPage 子页面路径
     * @param {Object} datas 向子页面加载的数据，可选参数
     */
    mod.initSubPage = function (subPage, datas, height, bottom) {
        if (!datas) {
            datas = null;
        }
        height = height ? height : 0;
        bottom = bottom ? bottom : 0;
        var styles = mod.getWebStyle(subPage);
        styles.top = (localStorage.getItem('StatusHeightNo') * 1 + 45 + height) + 'px';
        styles.bottom = bottom + 'px';
        mui.init({
            gestureConfig: {
                doubletap: true //启用双击监听
            },
            subpages: [{
                url: subPage,
                id: subPage.split('/')[subPage.split('/').length - 1],
                styles: styles,
                extras: {
                    data: datas
                }
            }],
            beforeback: function () {
                mod.closeWaiting();
                return true;
            }
        });
    }

    /**
     *
     * @param {Object} id 刷新的list控件id
     * @param {Object} fresh 下拉刷新加载数据的方法
     * @param {Object} addMore 上拉刷新加载数据的方法
     */
    mod.initRefresh = function (id, fresh, addMore) {

        mui.init({
            gestureConfig: {
                longtap: true
            },
            pullRefresh: {
                container: '#refreshContainer',
                down: {
                    callback: pulldownRefresh
                },
                up: {
                    contentrefresh: '正在加载...',
                    callback: pullupRefresh
                }
            }
        });
        /**
         * 下拉刷新具体业务实现
         */
        function pulldownRefresh() {
            setTimeout(function () {
                //
                var item = document.getElementById(id)
                //清除所有数据
                mod.clearChild(item);
                //					while(item.firstChild != null) {
                //						item.removeChild(item.firstChild)
                //					}
                //加载新控件
                fresh();
                mui('#refreshContainer').pullRefresh().endPulldownToRefresh(); //refresh completed
                mui('#refreshContainer').pullRefresh().enablePullupToRefresh();
                mui('#refreshContainer').pullRefresh().refresh(true);
            }, 150);
        }
        var count = 0;
        /**
         * 上拉加载具体业务实现
         */
        function pullupRefresh() {
            setTimeout(function () {
                addMore();
            }, 1500);
        }
    }
    /**
     * 预加载单个页面 在mui.plusReady里调用
     * @param {Object} tarPage 页面路径
     * @param {Object} interval 延迟加载时间间隔 单位毫秒 ，不输入默认为0
     */
    mod.preload = function (tarPage, interval, navBarStyle) {

        if (!interval) {
            interval = 0;
        }
        var styles
        if (navBarStyle) {
            styles = mod.getNavBarStyle(navBarStyle);
        } else {
            styles = mod.getWebStyle(tarPage);
        }

        //console.log("预加载的页面：" + tarPage)
        if (!plus.webview.getWebviewById(tarPage)) {
            //初始化预加载详情页面
            setTimeout(function () {
                mui.preload({
                    url: tarPage,
                    id: tarPage.split('/')[tarPage.split('/').length - 1], //默认使用当前页面的url作为id
                    styles: styles,
                    show: {
                        anishow: 'slide-in-right',
                        duration: 250
                    },

                    waiting: {
                        title: '正在加载...'
                    }
                })
            }, interval)
        }
    }
    /**
     * 获取样式
     */
    mod.getNavBarStyle = function (navBarStyle) {
        var extraStyle = {
            backgroundColor: "#13b7f6",
            titleColor: "#FFFFFF",
            backButton: {
                color: "#FFFFFF",
                colorPressed: "#0000FF"
            }
        }
        mui.extend(navBarStyle, extraStyle);
        return mui.extend({
            navigationbar: navBarStyle
        }, mod.getWebStyle());
    }
    /**
     * 加载不需要传值的预加载页面
     * @param {Object} tarpge
     */
    mod.showPreloadPage = function (tarPage) {
        var targetPage = null;
        //获得目标页面
        if (!targetPage) {
            targetPage = plus.webview.getWebviewById(tarPage);

        }
        targetPage.show('slide-in-right', 250);
    }
    /**
     * 如果目标页面未加载,需要先预加载页面
     * 传递数值到指定页面并打开页面
     * @param {Object} tarpage 目标页面Id
     * @param {Object} listener 监听事件
     * @param {Object} getDatas 获取数据的方法  return somthing
     */
    mod.fireToPage = function (tarPage, listener, getDatas) {
        //			//console.log('tarPage:' + tarPage);
        tarPage = tarPage.split('/')[tarPage.split('/').length - 1];
        var targetPage = null;
        //获得目标页面
        if (!targetPage) {
            targetPage = plus.webview.getWebviewById(tarPage);
            //				//console.log(typeof(targetPage))
        }
        //触发目标页面的listener事件
        mui.fire(targetPage, listener, {
            data: getDatas()
        });
        //console.log('要传的值是：' + JSON.stringify(getDatas()))
        targetPage.show('slide-in-right', 250)
    }
    /**
     * 如果目标页面未加载,需要先预加载页面
     * 传递数值到指定页面并打开页面
     * @param {Object} tarpage 目标页面Id
     * @param {Object} listener 监听事件
     * @param {Object} datas 要传递的数据
     */
    mod.fireToPageWithData = function (tarPage, listener, datas) {

        tarPage = tarPage.split('/')[tarPage.split('/').length - 1];
        console.log('tarPage:' + tarPage + ",listener:" + listener);
        var targetPage = null;
        //获得目标页面
        if (!targetPage) {
            targetPage = plus.webview.getWebviewById(tarPage);
        }
        //触发目标页面的listener事件
        mui.fire(targetPage, listener, {
            data: datas
        });
        targetPage.show('slide-in-right', 250);
    }
    /**
     * 事件传递 不传数据 常用于 父子页面间
     * @param {Object} tarPage 目标页面
     * @param {Object} listener 事件
     */
    mod.fireToPageNone = function (tarPage, listener, datas) {
        tarPage = tarPage.split('/')[tarPage.split('/').length - 1];
        if (typeof (datas) === "undefined") {
            datas = null;
        }
        console.log('tarPage:' + tarPage);
        var targetPage = null;
        //获得目标页面
        if (!targetPage) {
            targetPage = plus.webview.getWebviewById(tarPage);
        }
        if (targetPage) {
            //触发目标页面的listener事件
            mui.fire(targetPage, listener, {
                data: datas
            });
        } else {
            console.log('目标页面不存在' + tarPage);
        }

    }
    /**
     * 清空子元素
     * @param {Object} item 需清空子元素的控件
     */
    mod.clearChild = function (item) {
        while (item.firstElementChild) {
            item.removeChild(item.firstElementChild);
        }
    }
    /**
     * listView加载数据
     * @param {Object} listContainer
     * @param {Object} data
     * @param {Object} createInner
     */
    mod.createListView = function (listContainer, data, createInner) {
        var list = document.getElementById(listContainer);
        data.forEach(function (cell, i, data) {
            var li = document.createElement('li');
            li.className = 'mui-table-view-cell';
            li.innerHTML = createInner(cell);
            list.appendChild(li);
        })

    }
    mod.arraySingleItem = function (array) {
        var r = [];
        for (var i = 0, l = array.length; i < l; i++) {
            for (var j = i + 1; j < l; j++)
                if (array[i] === array[j]) {
                    j = ++i;
                }
            r.push(array[i]);
        }
        return r;
    }
    mod.infoChanged = function () {
        //console.log("@@@@@@@@@@@@@@@@@@@@@调用的时候的界面：" + plus.webview.currentWebview().id);
        events.fireToPageNone('../../index/mine.html', 'infoChanged');
        events.fireToPageNone('../cloud/cloud_home.html', 'infoChanged');
        mui.fire(plus.webview.getWebviewById("index.html"), 'infoChanged');
        events.fireToPageNone("course-all.html", "infoChanged");
        events.fireToPageNone("course-attended.html", "infoChanged");
        events.fireToPageNone("show-all.html", "infoChanged");
        events.fireToPageNone("show-attended.html", "infoChanged");
        events.fireToPageNone("show-home.html", "infoChanged");
        events.fireToPageNone("course-home.html", "infoChanged");
        events.fireToPageNone("sciedu_home.html", "infoChanged");
    }
    mod.shortForString = function (str, len) {
        if (!str) {
            str = "";
            //console.log("数据错误，请查找！");
        }
        if (str.length > len + 2) {
            return str.substring(0, len) + "...";
        }
        return str;
    }
    mod.shortForDate = function (fullDate) {
        var arrDate = fullDate.split(":");
        arrDate.splice(arrDate.length - 1, 1);
        var noSecond = arrDate.join(':');
        var arrSecond = noSecond.split('-');
        if (new Date().getFullYear() == arrSecond[0]) {
            arrSecond.splice(0, 1);
        }
        return arrSecond.join('-');
    }

    /**
     * 将界面的焦点清除后再退出当前界面
     */
    mod.blurBack = function () {
        var oldBack = mui.back;
        mui.back = function () {
            document.activeElement.blur();
            oldBack();
        }
    }
    /**
     * 返回一个安卓手机返回键无法关闭的等待框
     * @author 莫尚霖
     * @param {Object} string 等待框显示的文字，默认'加载中...'
     */
    mod.showWaiting = function (string) {
        var title = '加载中...';
        if (string) {
            title = string;
        }
        var showWaiting = plus.nativeUI.showWaiting(title, {
            back: 'none'
        });
        return showWaiting;
    }

    /**
     * 关闭一个或所有的等待框
     * @author 莫尚霖
     * @param {Object} waiting 等待框对象
     */
    mod.closeWaiting = function (waiting) {
        if (waiting) {
            waiting.close();
        } else {
            plus.nativeUI.closeWaiting();
        }
    }

    /**
     * 创建一个子页面，并传递数据
     * @author 莫尚霖
     * @param {Object} mainWebviewObject 主页面的窗体
     * @param {Object} subPageUrl 子页面的路径
     * @param {Object} data 传递给子页面的数据
     * @param {Object} loadedCallBack 子页面加载完成的回调
     */
    mod.createSubAppendMain = function (mainWebviewObject, subPageUrl, data, loadedCallBack) {
        var styles = mod.getWebStyle(mainWebviewObject.id);
        styles.top = (localStorage.getItem('StatusHeightNo') * 1 + 45) + 'px';
        var sub = plus.webview.create(subPageUrl, subPageUrl.split('/')[subPageUrl.split('/').length - 1],
            styles, {
                data: data
            });

        sub.addEventListener('loaded', function () {
            mainWebviewObject.append(sub);
            loadedCallBack(sub);
        });

        return sub;
    }

    /**
     * 修改双webview下拉刷新出现的位置，在main中使用
     * @author 莫尚霖
     * @param {Object} top 下拉刷新距离顶部的高度
     */
    mod.changeTopPocket = function (top) {
        setTimeout(function () {
            var toppocket = document.querySelector('.mui-pull-top-pocket');
            var height; //高度
            if (top) {
                height = top;
            } else {
                height = localStorage.getItem('StatusHeightNo') * 1 + 45;
            }
            if (toppocket) {
                document.querySelector('.mui-pull-top-pocket').style.top = height + 'px';
            } else {
                mod.changeTopPocket(height);
            }
        }, 200);
    }
    /**
     * 理论上讲这个是设置方法名的方法
     * @param {Object} filePath 图片路径
     */
    mod.getFileNameByPath = function (filePath) {
        var filePaths = filePath.split(".");
        var fileName = filePaths[filePaths.length - 1];
        return new Date().getTime() + parseInt(Math.random() * 1000) + '.' + fileName;
    }
    /**
     * 通过文件路径获取文件名
     * @param {Object} filePath 文件路径
     */
    mod.getFileName = function (filePath) {
        var paths = filePath.split("/");
        var path = paths[paths.length - 1];
        return path;
    }

    /**
     * 退出登录后执行的方法
     * @author 莫尚霖
     */
    mod.logOff = function () {
        //console.log('退出登录后执行的方法');
        //清理上传下载的任务和界面
        events.fireToPageNone('storage_transport.html', 'removeAllTask');
        //清理云盘主页
        events.fireToPageNone('../cloud/cloud_home.html', 'cleanCloudHome');
        //清理科教
        events.fireToPageNone('../sciedu/sciedu_home.html', 'cleanSicEduHome');
        //清理展现
        events.fireToPageNone('../show/show_home_1.html', 'cleanShowHome');
    }

    mod.ifHaveInfo = function (info) {
        return info ? info : '暂无信息'
    }

    /**
     *
     * @param {Object} title 标题
     * @param {Object} hint 提示语
     * @param {Object} callback 确认回调
     * @param {Object} cancelLog 取消打印信息
     */
    mod.setDialog = function (title, hint, callback, cancelLog) {
        var btnArray = ['否', '是'];
        mui.confirm(hint, title, btnArray, function (e) {
            if (e.index == 1) {
                callback();
            } else {
                mui.toast(cancelLog)
            }
        }, "div");
    }

    mod.format = function (dateTime, format) {
        var o = {
            "M+": dateTime.getMonth() + 1, //month
            "d+": dateTime.getDate(), //day
            "h+": dateTime.getHours(), //hour
            "m+": dateTime.getMinutes(), //minute
            "s+": dateTime.getSeconds(), //second
            "q+": Math.floor((dateTime.getMonth() + 3) / 3), //quarter
            "S": dateTime.getMilliseconds() //millisecond
        };
        if (/(y+)/.test(format)) {
            format = format.replace(RegExp.$1, (dateTime.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" +
                    o[k]).length));
            }
        }
        return format;
    }
    mod.softIn = function (id) {
        //		if(plus.os.name == "Android") {
        //			document.getElementById(id).onfocus = function() {
        //				screen.height = plus.screen.resolutionHeight * plus.screen.scale
        //				var webHeight = plus.android.invoke(plus.android.currentWebview(), "getHeight")
        //				//console.log('状态栏高度:' + plus.navigator.getStatusbarHeight() + "屏幕高度：" + screen.height + "浏览器高度：" + webHeight);
        //				var scrollHeight = parseInt(webHeight) - parseInt(screen.height) - parseInt(plus.navigator.getStatusbarHeight());
        //				//console.log("实际高度：" + scrollHeight)
        //				//		document.querySelector(".mui-input-group").style.marginBottom=scrollHeight+"px";
        //				document.body.clientHeight = scrollHeight;
        //				mui(".mui-scroll-wrapper").scroll().scrollTo(0, -document.getElementById(id).offsetTop);
        //			}
        //			document.getElementById(id).onblur = function() {
        //				mui(".mui-scroll-wrapper").scroll().scrollTo(0, 0);
        //			}
        //			document.getElementById(id).oninput=function(){
        //				mui(".mui-scroll-wrapper").scroll().scrollTo(0, -document.getElementById(id).offsetTop);
        //			}
        //			window.addEventListener('resize', function() {
        //				screen.height = plus.screen.resolutionHeight * plus.screen.scale
        //				var webHeight = plus.android.invoke(plus.android.currentWebview(), "getHeight")
        //				//console.log('状态栏高度:' + plus.navigator.getStatusbarHeight() + "屏幕高度：" + screen.height + "浏览器高度：" + webHeight);
        //			})
        //		}
    }
    /**
     * 设置监听，解决area与scroll冲突问题
     */
    mod.areaInScroll = function () {
        window.addEventListener("touchmove", function (e) {
            var target = e.target;
            //console.log("***tagName" + target.tagName);
            if (target && target.tagName == 'TEXTAREA') {
                if (target.scrollHeight > target.clientHeight) {
                    e.stopPropagation();
                } else {

                }
            }
        }, false);
    }

    /**
     * 获得元素的文本
     * @author 莫尚霖
     * @param {Object} content
     */
    mod.htmlGetText = function (data) {
        var ele = document.createElement('div');
        ele.style.display = 'none';
        ele.id = "html_get_text";
        document.body.appendChild(ele);
        ele.innerHTML = data;
        var content = jQuery('#html_get_text').text(); //获得文字
        ele.parentNode.removeChild(ele);
        return content;
    }

    /**
     * 初始化强制隐藏键盘
     * @author 莫尚霖
     */
    mod.initHideKeyBoard = function () {
        if (plus.os.name == 'Android') {
            var Context = plus.android.importClass("android.content.Context");
            var InputMethodManager = plus.android.importClass("android.view.inputmethod.InputMethodManager");
            var main = plus.android.runtimeMainActivity();
            var inputManger = main.getSystemService(Context.INPUT_METHOD_SERVICE);
            var Focus = plus.android.invoke(main, 'getCurrentFocus');
            ////console.log('invoke ' + plus.android.invoke(main, 'getCurrentFocus'));
            ////console.log('invoke ' + plus.android.invoke(Focus, 'getWindowToken'));
            var WindowToken = plus.android.invoke(Focus, 'getWindowToken');
            var hideOption = {
                manger: inputManger,
                token: WindowToken,
                type: InputMethodManager.HIDE_NOT_ALWAYS
            }
            return hideOption;
        }
    }

    /**
     * 强制隐藏键盘需要和initHideKeyBoard配合使用
     * @author 莫尚霖
     * @param {Object} hideOption initHideKeyBoard 返回的数据
     */
    mod.hideKeyBoard = function (hideOption) {
        document.activeElement.blur();
        if (plus.os.name == 'Android') {
            hideOption.manger.hideSoftInputFromWindow(hideOption.token, hideOption.type);
        }
    }

    /**
     * 图片只加载一遍 onerror
     * @author 莫尚霖
     * @param {Object} image 加载失败的图片元素
     * @param {Object} path 图片加载失败后显示的图片
     */
    mod.imageOnError = function (image, path) {
        image.src = path;
        image.onerror = null;
    }
    /**
     * 限制文字长度模块
     * @param {Object} inputValue 输入的value
     * @param {Object} length 限制的长度
     */
    mod.limitInput = function (inputValue, length) {
        if (inputValue.length > length) {
            mui.toast("输入已超过" + length + "字，请删除多余字符");
            return true;
        }
        return false;
    }

    /**
     * 默认webview的样式
     * @param {Object} path  webView的id或者路径
     */
    mod.getWebStyle = function (path) {
        var styles = {
            top: '0px',
            bottom: '0px',
            softinputMode: "adjustResize",
            hardwareAccelerated: false
        };
        if (path) {
            var ids = path.split('/');
            var id = ids[ids.length - 1];
            //安卓中video标签播放视频需要开启硬件加速
            //1.求知问题详情页
            //2.微课节次详情页
            //3.微课节次单个详情页
            if (id == "qiuzhi-question.html" || id == "course_details.html" || id == "course_section.html" ||
                id == 'space-detail.html' || id == 'zone_main.html' || id == "sciedu_show_main.html" ||
                "storage_show_video.html") {
                styles.hardwareAccelerated = true;
            }
            if (id == "show-home1.html") {
                styles.hardwareAccelerated = "auto";
            }
        }
        return styles;
    }
    /**
     * 禁止使用回车
     * @param {Object} elem  禁止使用回车的元素
     */
    mod.fobidEnter = function (elem) {
        elem.onkeydown = function (event) {
            //console.log("键盘输入事件：" + JSON.stringify(event.keyCode))
            if (event.keyCode == 13) {
                return false;
            }
        }
    }
    /**
     * actionsheet
     * @param {Object} titleArray 各选项 格式如下[{title:选项1,dia：1需要显示dialog},{title:选项1,dia：0 或不填需要显示dialog}]
     * @param {Object} cbArray 各选项回调方法数组，确认选择后的回调函数
     */
    mod.showActionSheet = function (btnArray, cbArray) {
        var len = btnArray.length;
        plus.nativeUI.actionSheet({
            buttons: btnArray,
            cancel: "取消"
        }, function (e) {
            var index = e.index;
            //console.log("点击的index:" + index);
            if (index > 0) {
                if (btnArray[index - 1].dia) {
                    mod.setDialog(btnArray[index - 1].title, "确定？", cbArray[index - 1], "已取消删除")
                } else {
                    cbArray[index - 1]();
                }
            }
        })
    }

    /**
     * 关闭某个webview
     * @author 莫尚霖
     * @param {Object} webview webview的id或object
     * @param {Object} num 动画，默认页面从屏幕中横向向右侧滑动到屏幕外关闭
     */
    mod.closeWebview = function (webview, num) {
        //关闭已经打开的Webview窗口，需先获取窗口对象或窗口id，并可指定关闭窗口的动画
        //若操作窗口对象已经关闭，则无任何效果。
        //使用窗口id时，则查找对应id的窗口，如果有多个相同id的窗口则操作最先打开的窗口，若没有查找到对应id的WebviewObject对象，则无任何效果。
        plus.webview.close(webview, mod.getAniClose(num));
    }

    /**
     * 获取关闭的动画
     * @author 莫尚霖
     * @param {Object} num 类型，默认slide-out-right
     */
    mod.getAniClose = function (num) {
        var aniClose = '';
        var type = num || 2; //默认2
        switch (type) {
            case 0:
                aniClose = 'auto';
                //自动选择显示窗口相对于的动画效果。
                break;
            case 1:
                aniClose = 'none';
                //立即关闭页面，无任何动画效果。 此效果忽略动画时间参数，立即关闭。
                break;
            case 2:
                aniClose = 'slide-out-right';
                //页面从屏幕中横向向右侧滑动到屏幕外关闭。
                //Android - 2.2+ (支持): 默认动画时间为200ms。
                //iOS - 5.1.1+ (支持): 默认动画时间为300ms。
                break;
            case 3:
                aniClose = 'slide-out-left';
                //页面从屏幕中横向向左侧滑动到屏幕外关闭。
                //Android - 2.2+ (支持): 默认动画时间为200ms。
                //iOS - 5.1.1+ (支持): 默认动画时间为300ms。
                break;
            case 4:
                aniClose = 'slide-out-top';
                //页页面从屏幕中竖向向上侧滑动到屏幕外关闭。
                //Android - 2.2+ (支持): 默认动画时间为200ms。
                //iOS - 5.1.1+ (支持): 默认动画时间为300ms。
                break;
            case 5:
                aniClose = 'slide-out-bottom';
                //页面从屏幕中竖向向下侧滑动到屏幕外关闭。
                //Android - 2.2+ (支持): 默认动画时间为200ms。
                //iOS - 5.1.1+ (支持): 默认动画时间为300ms。
                break;
            case 6:
                aniClose = 'fade-out';
                //页面从不透明到透明逐渐隐藏关闭。
                //Android - 2.2+ (支持): 默认动画时间为200ms。
                //iOS - 5.1.1+ (支持): 默认动画时间为300ms。
                break;
            case 7:
                aniClose = 'zoom-in';
                //页面逐渐向页面中心缩小关闭。
                //Android - 2.2+ (支持): 默认动画时间为100ms。
                //iOS - 5.1.1+ (支持): 默认动画时间为100ms。
                break;
            case 8:
                aniClose = 'zoom-fade-in';
                //页面逐渐向页面中心缩小并且从不透明到透明逐渐隐藏关闭。
                //Android - 2.2+ (支持): 默认动画时间为100ms。
                //iOS - 5.1.1+ (支持): 默认动画时间为100ms。
                break;
            case 9:
                aniClose = 'pop-out';
                //页面从屏幕右侧滑出消失，同时上一个页面带阴影效果从屏幕左侧滑入显示。
                //Android - 2.2+ (支持): 默认动画时间为200ms。
                //iOS - 5.1.1+ (支持): 默认动画时间为300ms。
                break;
            default:
                break;
        }
        return aniClose;
    }
    var firstTime = null;

    /**
     * 一段时间内只允许运行一次方法,可用于打开新界面
     * @param {Function} callback 要运行的方法
     */
    mod.singleInstanceInPeriod = function (callback) {
        var secondTime = null;
        if (!firstTime) {
            firstTime = "1234";
            setTimeout(function () {
                firstTime = null;
            }, 2000);
        } else {
            secondTime = "123";
        }
        //console.log("第一次是否存在：" + firstTime + "第二次是否存在：" + secondTime);
        if (!secondTime) {
            callback();
        }
    }
    /**
     * 打开新页面
     * @param {Object} clickedItem
     * @param {Object} webviewUrl
     * @param {Object} data
     */
    mod.singleWebviewInPeriod = function (clickedItem, webviewUrl, data) {
        var waiting = mod.showWaiting();
        if (!data) {
            data = "";
        }
        //		//console.log("当前点击控件是否可点击：" + clickedItem.disabled);
        var webviewSites = webviewUrl.split("/");
        var webviewId = webviewSites[webviewSites.length - 1];
        var targetWebview = plus.webview.create(webviewUrl, webviewId, mod.getWebStyle(webviewUrl), {
            data: data
        });
        targetWebview.onloaded = function () {
            targetWebview.show("slide-in-right", 250);
            setItemAble(clickedItem, targetWebview, waiting);
        }
    }
    var setItemAble = function (item, targetWeb, waiting) {
        //		//console.log("当前点击控件是否可点击：" + item.disabled);
        //console.log("targetWeb是否已显示：" + targetWeb.isVisible());
        setTimeout(function () {
            if (targetWeb.isVisible()) {
                setTimeout(function () {
                    mod.closeWaiting(waiting);
                    if (item) {
                        item.disabled = false;
                        jQuery(item).css("pointerEvents", "all");
                    }
                }, 500)
            } else {
                setItemAble(item, targetWeb, waiting);
            }
        }, 500);
    }
    /**
     * 限制预览下拉刷新
     * @param {Object} refreshId 刷新控件ID
     * @param{Int} type 0为默认样式 1为圈圈
     */
    mod.limitPreviewPullDown = function (refreshId, type) {
        mui.getPreviewImage().open = function (index, group) {
            if (mui('#' + refreshId).length > 0) {
                if (type) {

                } else {
                    mui('#' + refreshId).pullRefresh().setStopped(true);
                }
            }
            if (this.isShown()) {
                return;
            }
            if (typeof index === "number") {
                group = group || defaultGroupName;
                this.addImages(group, index); //刷新当前group
                this.openByGroup(index, group);
            } else {
                group = index.getAttribute('data-preview-group');
                group = group || defaultGroupName;
                this.addImages(group, index); //刷新当前group
                this.openByGroup(this.groups[group].indexOf(index.__mui_img_data), group);
            }
        };
        mui.getPreviewImage().close = function (index, group) {
            if (!this.isShown()) {
                return;
            }
            if (mui('#' + refreshId).length > 0) {
                if (type) {

                } else {
                    mui('#' + refreshId).pullRefresh().setStopped(false);
                }
            }
            this.element.classList.remove(mui.className('preview-in'));
            this.element.classList.add(mui.className('preview-out'));
            var itemEl = this.scroller.querySelector(mui.classSelector('.slider-item:nth-child(' + (
                this.lastIndex + 1) + ')'));
            var imgEl = itemEl.querySelector('img');
            if (imgEl) {
                imgEl.classList.add(mui.className('transitioning'));
                var itemData = this.currentGroup[this.lastIndex];
                var posi = this._getPosition(itemData);
                var sLeft = posi.left;
                var sTop = posi.top;
                if (sTop > window.innerHeight || sLeft > window.innerWidth || sTop < 0 || sLeft < 0) { //out viewport
                    imgEl.style.opacity = 0;
                    imgEl.style.webkitTransitionDuration = '0.5s';
                    imgEl.style.webkitTransform = 'scale(' + itemData.sScale + ')';
                } else {
                    if (this.options.zoom) {
                        mui(imgEl.parentNode.parentNode).zoom().toggleZoom(0);
                    }
                    imgEl.style.webkitTransitionDuration = '0.5s';
                    imgEl.style.webkitTransform = 'translate3d(' + posi.x + 'px,' + posi.y +
                        'px,0) scale(' + itemData.sScale + ')';
                }
            }
            var zoomers = this.element.querySelectorAll(mui.classSelector('.zoom-wrapper'));
            for (var i = 0, len = zoomers.length; i < len; i++) {
                mui(zoomers[i]).zoom().destroy();
            }
            mui(this.element).slider().destroy();
            //		this.empty();
        };

    }
    //判断是否是游客身份登录，页面中有用户操作时调用
    mod.judgeLoginMode = function (item) {
        if (item) {
            item.disabled = true;
            jQuery(item).css("pointerEvents", "none");
        }
        //console.log('判断是否是游客身份登录');
        var personal = window.myStorage.getItem(window.storageKeyName.PERSONALINFO);
        if (personal.utid > 0) { //有账号，正常登录
            return false;
        } else { //游客身份，要有交互，就得先跳转到登录界面
            var targetHTML = '../register/login.html';
            var passData = '';
            mod.singleWebviewInPeriod(item, targetHTML, passData);
            return true;
        }
    }
    //刚启动时，如果有账号，token续订登录，如果没有，游客登录
    mod.defaultLogin = function (callback) {
        //console.log('判断上次有么有账号登录');
        if (plus.networkinfo.getCurrentType() == plus.networkinfo.CONNECTION_NONE) {
            var tempValue = {
                flag: 1, //正常用户登录
                value: -1 //没有网络
            }
            callback(tempValue);
            return;
        }
        //如果之前登录成功，则重新获取token，获取个人信息，则为登录成功
        var personal = window.myStorage.getItem(window.storageKeyName.PERSONALINFO);
        if (personal && personal.utid != 0) { //有账号，正常登录
		var loginInfo = {
			account: personal.account,
			password: personal.password
		}
            //console.log('1221111');
            //先发送握手协议
            //需要加密的数据
            var enData0 = {};
            //不需要加密的数据
            var comData0 = {
                uuid: plus.device.uuid,
                shaketype: 'login',
                appid: plus.runtime.appid
            };
            // 等待的对话框
            var wd = events.showWaiting();
            //发送网络请求，data为网络返回值
            postDataEncry(storageKeyName.MAINURL + 'PostShakeHand', enData0, comData0, 0, wd, function (
                data) {
                //						wd.close();
                //console.log('PostShakeHand:RspCode:' + data.RspCode + ',RspData:' + JSON.stringify(data.RspData) + ',RspTxt:' + data.RspTxt);
                if (data.RspCode == 0) {
                    //存储到手机本地
                    window.myStorage.setItem(window.storageKeyName.SHAKEHAND, data.RspData);
                    //账号密码登录协议
                    //需要加密的数据
                    var enData = {
                        uid: loginInfo.account, //用户手机号或账号或email
                        pw: loginInfo.password
                    };
                    //不需要加密的数据
                    var comData = {
                        uuid: plus.device.uuid,
                        shaketype: 'login', //注册(reg),登录(login),修改密码(repw)
                        appid: plus.runtime.appid,
                        vtp: 'mb' //mb(手机号),nm(账号或邮箱)
                    };
                    //console.log('endata:' + JSON.stringify(enData) + 'comdata:' + JSON.stringify(comData));
                    //发送网络请求，data为网络返回值
                    postDataEncry(storageKeyName.MAINURL + 'PostLoginColl', enData, comData, 0, wd,
                        function (data) {
                            wd.close();
                            wd.close();
                            //console.log('账号密码登录s1111111e:' + data.RspCode + ',RspData:' + JSON.stringify(data.RspData) + ',RspTxt:' + data.RspTxt);
                            if (data.RspCode != 0000) {
                                mui.toast(data.RspTxt);
                                return;
                            } else {
                                mui.toast('登录成功')
                                //存储到手机本地
                                data.RspData.ispw = '1';
                                if (!data.RspData.uimg) {
                                    data.RspData.uimg =
                                        '../../image/utils/default_personalimage.png';
                                }
                                if (data.RspData.unick == '' || data.RspData.unick == undefined) {
                                    data.RspData.unick = '新用户';
                                }
                                //解析省市代码
                                if (data.RspData.uarea.length > 0) {
                                    var tempArray = data.RspData.uarea.split('|');
                                    if (tempArray.length > 0) {
                                        var temp0 = tempArray[0].split(' ');
                                        var temp1 = tempArray[1].split(' ');
                                        var model_area = {
                                            procode: temp0[0], //省份code，自己添加的参数
                                            proname: temp1[0], //省份名称，自己添加的参数
                                            acode: temp0[1], //节点代码,通用6位,前两位为省份编码,中间两位为城市编码,后两位为区县编码--城市代码
                                            aname: temp1[1], //节点名称--城市名称
                                            atype: '' //节点类型,0省1城市2区县
                                        }
                                        data.RspData.uarea = model_area;
                                    }
                                }
                                data.RspData.account = loginInfo.account;
                                data.RspData.password = loginInfo.password;
                                window.myStorage.setItem(window.storageKeyName.PERSONALINFO,
                                    data.RspData);
                                //console.log('登录保存的个人信息：' + JSON.stringify(data.RspData));
                                //退出 界面更新
                                //									events.logOff();
                                //									events.infoChanged();
                                //									mui.fire(plus.webview.getWebviewById("index.html"), 'login');
                                //									events.hidePagesExIndex();
                                //									mui.back();

                                plus.webview.open('../../html/index/index.html');
                                var wvs = plus.webview.all();
                                for (var i = 0, len = wvs.length; i < len; i++) {
                                    if (wvs[i].getURL().indexOf('sciedu_home.html') != -1 ||
                                        wvs[i].getURL().indexOf('collect.html') != -1 ||
                                        wvs[i].getURL().indexOf('mine.html') != -1) {
                                        continue;
                                    }
                                    plus.webview.close(wvs[i]);
                                }
                                var curr = plus.webview.currentWebview();
                                curr.close();
                            }
                        });
                } else {
                    mui.toast(data.RspTxt);
                }
            });

        } else { //游客身份，用默认账号密码登录，要有交互，就得先跳转到登录界面
            var info = {
                account: '00000000000',
                password: '123'
            }
            events.loginBtn(info, callback);
        }
    }

    mod.loginBtn = function (loginInfo, callback) {
        //console.log('1221111');
        //先发送握手协议
        //需要加密的数据
        var enData0 = {};
        //不需要加密的数据
        var comData0 = {
            uuid: plus.device.uuid,
            shaketype: 'login',
            appid: plus.runtime.appid
        };
        // 等待的对话框
        var wd = events.showWaiting();
        //发送网络请求，data为网络返回值
        //		postDataEncry(storageKeyName.MAINURL + 'PostShakeHand', enData0, comData0, 0, wd, function(data) {
        //			//console.log('PostShakeHand:RspCode:' + data.RspCode + ',RspData:' + JSON.stringify(data.RspData) + ',RspTxt:' + data.RspTxt);
        //			if(data.RspCode == 0) {
        //存储到手机本地
        //		window.myStorage.setItem(window.storageKeyName.SHAKEHAND, data.RspData);
        //账号密码登录协议
        //需要加密的数据
        var enData = {

        };
        //不需要加密的数据
        var comData = {
            uid: loginInfo.account, //用户手机号或账号或email
            pw: loginInfo.password,
            uuid: plus.device.uuid,
            shaketype: 'login', //注册(reg),登录(login),修改密码(repw)
            appid: plus.runtime.appid,
            vtp: 'mb' //mb(手机号),nm(账号或邮箱)
        };
        console.log('endata:' + JSON.stringify(enData) + 'comdata:' + JSON.stringify(comData));
        //发送网络请求，data为网络返回值
        postDataEncry(storageKeyName.MAINURL + 'PostLogin', enData, comData, 0, wd, function (data) {
            wd.close();
            wd.close();
            //console.log('账号密码登录s1111111e:' + data.RspCode + ',RspData:' + JSON.stringify(data.RspData) + ',RspTxt:' + data.RspTxt);
            if (data.RspCode != 0000) {
                var tempValue = {
                    flag: 0, //游客登录
                    value: 0 //登录失败
                }
                callback(tempValue);
                mui.toast(data.RspTxt);
                return;
            } else {
                //				mui.toast('登录成功')
                //存储到手机本地
                data.RspData.ispw = '1';
                if (!data.RspData.uimg) {
                    data.RspData.uimg = '../../image/utils/default_personalimage.png';
                }
                if (data.RspData.unick == '' || data.RspData.unick == undefined) {
                    data.RspData.unick = '新用户';
                }
                //解析省市代码
                if (data.RspData.uarea.length > 0) {
                    var tempArray = data.RspData.uarea.split('|');
                    //					if(tempArray.length > 0) {
                    //						var temp0 = tempArray[0].split(' ');
                    //						var temp1 = tempArray[1].split(' ');
                    var model_area = {
                        procode: '00', //省份code，自己添加的参数
                        proname: '全国', //省份名称，自己添加的参数
                        acode: '000000', //节点代码,通用6位,前两位为省份编码,中间两位为城市编码,后两位为区县编码--城市代码
                        aname: '全国', //节点名称--城市名称
                        atype: '' //节点类型,0省1城市2区县
                    }
                    data.RspData.uarea = model_area;
                    //					}
                }
                data.RspData.account = loginInfo.account;
                data.RspData.password = loginInfo.password;
                window.myStorage.setItem(window.storageKeyName.PERSONALINFO, data.RspData);
                //console.log('登录保存的个人信息：' + JSON.stringify(data.RspData));
                //
                //退出登录
                events.logOff();
                events.infoChanged();
                //存储自动登录
                //跳到主界面
                var tempValue = {
                    flag: 0, //游客登录
                    value: 1 //登录成功
                }
                callback(tempValue);
                //						events.openNewWindow('../index/index.html', '');
            }
        });
    }
    mod.hidePagesExIndex = function () {
        var wvs = plus.webview.all();
        for (var i in wvs) {
            //console.log("webview的id:" + wvs[i].id)
            switch (wvs[i].id) {
                case "index.html":
                case "cloud_home.html": //云盘首页
                case "sciedu_home.html": //科教首页
                case "show-home.html": //展现首页
                case "mine.html": //我的，侧边栏
                case "course-home.html": //微课首页
                case plus.webview.currentWebview().id:
                    break;
                case "course_details.html": //微课节次详情和列表
                case "course-introduction.html": //节次介绍
                case "history-records.html": //微课所有节次历史记录
                case "course_section.html": //微课一个节次的详情
                    if (!wvs[i].parent()) {
                        wvs[i].close(); //删除页面
                    }
                    break;
                default:
                    if (!wvs[i].parent()) {
                        wvs[i].hide(); //隐藏页面
                    }
                    break;
            }
        }
    }

    //二维码中，当前时间，时间格式，计算时间间隔
    mod.getNowFormatDate = function () {
        var date = new Date();
        var seperator1 = ",";
        var seperator2 = ",";
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate +
            "," + date.getHours() + seperator2 + date.getMinutes() +
            seperator2 + date.getSeconds();
        return currentdate;
    }

    //判断回答或则问题是否还存在,flag=1为提问，=2为回答，id为对应id
    mod.askDetailOrAnswerDetail = function (flag, id, callback) {
        var personalUTID = window.myStorage.getItem(window.storageKeyName.PERSONALINFO).utid; //当前登录账号utid
        if (flag == 1) { //提问
            //需要加密的数据
            var comData = {
                userId: personalUTID, //用户ID
                askId: id, //问题ID
                orderType: 1, //回答排序方式,1 按时间排序,2 按质量排序：点赞数+评论数
                pageIndex: '1', //当前页数
                pageSize: '1' //每页记录数,传入0，获取总记录数
            };
            // 等待的对话框
            var wd = events.showWaiting();
            //5.获取某个问题的详情
            postDataQZPro_getAskById(comData, wd, function (data) {
                wd.close();
                //console.log('5.获取某个问题的详情:' + data.RspCode + ',RspData:' + JSON.stringify(data.RspData) + ',RspTxt:' + data.RspTxt);
                if (data.RspCode == 1016) {
                    //console.log('wenti 不存在');
                    mui.toast('该提问已不存在');
                    callback(false);
                }
                if (data.RspCode == 404) {
                    mui.toast('网络连接失败，请重新尝试一下');
                    callback(false);
                } else {
                    callback(true);
                }
            });
        } else if (flag == 2) { //回答
            var comData = {
                userId: personalUTID, //用户ID
                answerId: id, //回答ID
                orderType: '1', //评论排序方式,1 时间正序排序,2 时间倒序排序
                pageIndex: '1', //当前页数
                pageSize: '1' //每页记录数,传入0，获取总记录数
            };
            // 等待的对话框
            var wd = events.showWaiting();
            //8.获取某个回答的详情
            postDataQZPro_getAnswerById(comData, wd, function (data) {
                wd.close();
                //console.log('8.获取某个回答的详情:' + data.RspCode + ',RspData:' + JSON.stringify(data.RspData) + ',RspTxt:' + data.RspTxt);
                if (data.RspCode == 1017) {
                    mui.toast('该回答已不存在');
                    callback(false);
                }
                if (data.RspCode == 404) {
                    mui.toast('网络连接失败，请重新尝试一下');
                    callback(false);
                } else {
                    callback(true);
                }
            });
        }
    }
    /**
     * 获取用户在群组中的信息
     * @param {Object} mstype
     * @param {Object} callback
     */
    mod.getUserInGroup = function (groupId, callback) {
        var wd = events.showWaiting();
        postDataPro_PostGuI({
            vvl: groupId,
            vtp: -1
        }, wd, function (data) {
            wd.close();
            callback(data);
        })
    }
    /**
     *
     */
    mod.getUtid = function () {
        var personInfo = myStorage.getItem(storageKeyName.PERSONALINFO);
        return parseInt(personInfo.utid);
    }
    /**
     * 判断是在本地有存储
     * @param {Object} key 本地存储的key值
     * @param {Object} value 要判断的值 为基本数据类型
     */
    mod.isExistInStorageArray = function (key, value) {
        var sArray = myStorage.getItem(key);
        if (sArray && sArray.length > 0) {
            if (sArray.indexOf(value) >= 0) {
                return [sArray, sArray.indexOf(value)]
            } else {
                return [sArray, -1]
            }
        } else {
            return [
                [], -1
            ]
        }
    }
    /**
     *
     * @param {Object} key
     * @param {Object} mapKey
     */
    mod.isExistInStorageMap = function (key, mapKey) {
        var map = myStorage.getItem(key);
        //console.log("获取的map" + JSON.stringify(map))
        if (map) {
            if (typeof (map[mapKey]) == "number") {
                return map[mapKey];
            }
            return false;
        } else {
            return false;
        }
    }
    /**
     *
     * @param {Object} key 保存简直
     * @param {Object} mapKey
     * @param {Object} mapValue
     */
    mod.setValueInMap = function (key, mapKey, mapValue) {
        var map = myStorage.getItem(key);
        if (!map) {
            map = {};
        }
        map[mapKey] = mapValue;
        myStorage.setItem(key, map);
    }
    /**
     * 存储或删除值
     * @param {Object} key 本地存储的key值
     * @param {Object} value 要存储或删除的值 为基本数据类型
     * @param {Boolean} isDel 是否是删除
     */
    mod.toggleStorageArray = function (key, value, isDel) {
        var arrayData = mod.isExistInStorageArray(key, value);
        if (isDel) {
            if (arrayData[1] >= 0) { //有
                arrayData[0].splice(arrayData[1], 1);
                myStorage.setItem(key, arrayData[0]);
            }
            return true;
        } else {
            if (arrayData[1] < 0) {
                arrayData[0].push(value);
                if (key === storageKeyName.SCIEDUREADED) {
                    if (arrayData[0].length >= 200) {
                        arrayData[0].splice(0, 1);
                    }
                }
                myStorage.setItem(key, arrayData[0]);
            }
            return false;
        }
    }
    /**
     *
     * @param {Object} string
     */
    mod.trim = function (string) {
        return string.replace(/^\s+|\s+$/g, '');
    }
    mod.getVideoDuration = function (url) {
        var request = new XMLHttpRequest();
        request.open("GET", url + "?avinfo", false);
        request.send();
        return Math.ceil(JSON.parse(request.responseText).streams[0].duration);
    }
    /**
     * 判断子页面是否加载完成，然后传递数据并打开页面
     * @param {Object} isReady 是否完成加载
     * @param {Object} url 子页面路径
     * @param {Object} lisetener 传递的事件
     * @param {Object} data 传递的数据
     */
    mod.readyToPage = function (isReady, url, lisetener, data) {
        console.log("是否已准备变形：" + isReady);
        if (isReady) {
            //console.log("要传递的数据：" + JSON.stringify(data));
            mod.fireToPageWithData(url, lisetener, data);
        } else {
            setTimeout(function () {
                mod.readyToPage(isReady, url, lisetener, data);
            }, 500)
        }
    }

    /**
     * 显示视频时，如果不是WiFi环境弹出提示
     */
    mod.playVideoCheckWeb = function () {
        var type = plus.networkinfo.getCurrentType();
        if (type != plus.networkinfo.CONNECTION_WIFI && type != plus.networkinfo.CONNECTION_NONE) {
            mui.toast("请注意当前不是WIFI环境");
        }
    }

    return mod;

})(events || {});
