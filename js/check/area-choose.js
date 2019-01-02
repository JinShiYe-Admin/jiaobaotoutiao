mui.init();
var curAreaInfo;
var checkedProButton;
var selectCityContainer;
mui(".mui-scroll-wrapper").scroll();
mui.plusReady(function() {
	//console.log("子页面触发plusready事件：" + plus.webview.currentWebview().opener().id)
	mui.fire(plus.webview.currentWebview().opener(), "subReady", 1);
	plus.webview.currentWebview().opener().subIsReady = true;
	window.addEventListener("chooseArea", function(e) {
		document.getElementById("list-container").innerHTML = "";
		curAreaInfo = e.detail.data;
		//console.log("当前城市代码：" + curAreaInfo);
		getEreas(0);
	})
	//	curCityCode=plus.webview.currentWebview().data;
	//	getEreas(0);
	setListener();
//	rewriteBack();
})
/**
 * 重写返回上级界面的方法
 */
//var rewriteBack = function() {
//	var _back = mui.back;
//	mui.back = function() {
//		//向上级页面传递所选地区
//		mui.fire(plus.webview.currentWebview().opener(), "choseArea", curAreaInfo);
//		_back();
//	}
//}
/**
 * 设置监听
 */
var setListener = function() {
	document.querySelector('.mui-table-view.mui-table-view-radio').addEventListener('selected', function(e) {
		//console.log("当前选中的为：" + e.detail.el.className);
		checkedProButton = e.detail.el;
		if(selectCityContainer) {
			selectCityContainer.className = "city-container single-line";
		}
		curAreaInfo = checkedProButton.areaInfo;
		//console.log("当前选中地区的信息："+JSON.stringify(curAreaInfo));
	});
	mui(".mui-table-view.mui-table-view-radio").on("tap", ".city-container", function() {
		//console.log("城市选择监听：" + this.className)
		if(selectCityContainer) {
			selectCityContainer.className = "city-container single-line";
		}
		this.className = "city-container single-line selected-city"
		selectCityContainer = this;
		if(checkedProButton) {
			checkedProButton.className = "mui-table-view-cell";
		}
		curAreaInfo = selectCityContainer.areaInfo;
		//console.log("当前选中地区的信息："+JSON.stringify(curAreaInfo));
	})
	document.getElementById("chose-area").addEventListener("tap",function(){
		mui.fire(plus.webview.currentWebview().opener(), "choseArea", curAreaInfo);
		mui.back();
	})
}

// "acode": "370000",
//      "aname": "山东省",
//      "atype": 0
//  {
//      "acode": "420000",
//      "aname": "湖北省",
//      "atype": 0
//  },
// {
//      "acode": "450000",
//      "aname": "广西壮族自治区",
//      "atype": 0
//  },
//  {
//      "acode": "460000",
//      "aname": "海南省",
//      "atype": 0
//  },
/**
 * 获取地区属性
 * @param {Object} ncode //0(获取省份),1(获取城市),2(获取区县),3获取所有城市,4模糊查询城市
 * @param {Object} acode //查询的值(acode节点编码,查询所有省份或城市留空,模糊查询城市填写查询值)
 */
var getEreas = function(ncode, acode, callback) {
	if(!acode) {
		acode = "";
	}
	var wd = events.showWaiting();
	postDataPro_PostArea({
		vtp: ncode, //0(获取省份),1(获取城市),2(获取区县),3获取所有城市,4模糊查询城市
		vvl: acode //查询的值(acode节点编码,查询所有省份或城市留空,模糊查询城市填写查询值)
	}, wd, function(data) {
		wd.close();
		//console.log("获取的城市代码：" + JSON.stringify(data));
		if(data.RspCode == 0) {
			if(ncode == 0) {
				//获取四省份
				var provinces = getProvinces(data.RspData)
				setProvinces(provinces);
			} else {
				if(callback) {
					callback(data.RspData);
				}
			}
		} else {

		}
	})
}
/**
 * 放置四个省份的数据
 * @param {Object} selectPros
 */
var setProvinces = function(selectPros) {
	var country = {
		"acode": "000000",
		"aname": "全国",
		"atype": 0
	}
	selectPros.splice(0, 0, country);
	var list_container = document.getElementById("list-container");
	for(var i in selectPros) {
		var li = document.createElement("li");
		if(selectPros[i].acode==curAreaInfo.acode){
			li.className="mui-table-view-cell mui-selected"
			checkedProButton=li;         
		}else{
			li.className = "mui-table-view-cell";
		}
		li.innerHTML = createProvinceInner(selectPros[i]);
		list_container.appendChild(li);
		li.id = selectPros[i].acode;
		li.areaInfo = selectPros[i];
	}

	getCities(selectPros);
}
/**
 * 根据省数据创建省界面
 * @param {Object} provinceData
 */
var createProvinceInner = function(provinceData) {
	return '<a class="mui-navigate-right">' + provinceData.aname + '</a>'
}
/**
 * 根据省获取省内城市
 * @param {Object} selectPros 省信息数组
 */
var getCities = function(selectPros) {
	var getAreaNo = 1;
	var citiesArray = [];
	for(var i in selectPros) {
		if(parseInt(i)) { //非0 0为全国，其他省市
			getEreas(1, selectPros[i].acode, function(cities) {
				//console.log("增加的城市数据：" + JSON.stringify(cities))
				getAreaNo++;
				citiesArray.push(cities);
				//所有数据已获取完毕
				if(getAreaNo == selectPros.length) {
					setCities(selectPros, citiesArray);
				}
			})
		}
	}
}
/**
 * 
 * @param {Object} selectPros 所有的省数组
 * @param {Object} citiesArray 所有省的城市数组的数组
 */
var setCities = function(selectPros, citiesArray) {
	//console.log("要放置的城市数据：" + JSON.stringify(citiesArray))
	for(var i in citiesArray) {
		var frag = document.createDocumentFragment();
		var div = document.createElement("div");
		div.className = "cities-container";
		createCitiesInner(div, citiesArray[i]);
		frag.appendChild(div);
		setAfterProvince(citiesArray[i], frag);
	}
}
/**
 * 将城市数据添加在省视图之后
 * @param {Object} cities
 * @param {Object} fragment
 */
var setAfterProvince = function(cities, fragment) {
	//console.log("省内城市数组：" + JSON.stringify(cities))
	var cityPCode = cities[0].acode.substring(0, 2);
	var provinceContainer;
	//console.log("获取的城市中的省代码：" + cityPCode);
	switch(parseInt(cityPCode)) {
		//山东省
		case 37:
			provinceContainer = document.getElementById("370000");
			break;
			//湖北省
		case 42:
			provinceContainer = document.getElementById("420000");
			break;
			//广西壮族自治区
		case 45:
			provinceContainer = document.getElementById("450000");
			break;
			//海南省
		case 46:
			provinceContainer = document.getElementById("460000");
			break;
		default:
			break;
	}

	document.getElementById("list-container").insertBefore(fragment, provinceContainer.nextElementSibling);
}
/**
 * 创建城市显示界面
 * @param {Object} cities 单个省内的城市数组
 */
var createCitiesInner = function(container, cities) {
	for(var i in cities) {
		var div = document.createElement("div");
		if(cities[i].acode==curAreaInfo.acode){
			div.className="city-container single-line selected-city";
			selectCityContainer=div;
		}else{
			div.className = "city-container single-line";
		}
		div.innerText = cities[i].aname;
		container.appendChild(div);
		div.areaInfo = cities[i];
	}
}
/**
 * 获取四省份
 * @param {Object} provinces
 */
var getProvinces = function(provinces) {
	var selectPros = [];
	for(var i in provinces) {
		switch(provinces[i].acode) {
			case "370000":
			case "420000":
			case "450000":
			case "460000":
				selectPros.push(provinces[i]);
				break;
			default:
				break;
		}
	}
	return selectPros;
}