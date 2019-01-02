var course_search=(function(mod){
	/**
	 * 
	 * @param {Object} pageIndex 页码
	 * @param {Object} keyWords 搜索字
	 * @param {Object} listContainer 容器
	 * @param {Object} callback 回调
	 */
	mod.getData=function(pageIndex,keyWords,listContainer,callback){
		
	}
	/**
	 * 
	 * @param {Object} pageIndex 页码
	 * @param {Object} data 获取的数据
	 * @param {Object} listContainer 容器
	 */
	mod.setData=function(pageIndex,data,listContainer){
		if(pageIndex==1){
			listContainer.innerHTML="";
		}
		var fragment=document.createDocumentFragment();
		for(var i in data){
			var cell=data[i];
			mod.createCell(cell,fragment);
		}
		listContainer.appendChild(fragment);
	}
	/**
	 * 
	 * @param {Object} cell 子数据
	 * @param {Object} fragment fragment
	 */
	mod.createCell=function(cell,fragment){
		var li =document.createElement("li");
		li.className="mui-table-view-cell";
		li.innerHTML=mod.getInnerHTML(cell);
		fragment.appendChild(li);
	}
	/**
	 * 
	 * @param {Object} cell 子数据
	 */
	mod.getInnerHTML=function(cell){
		var inner='';
		inner+='<div class="course-container">'+
				+'</div>'
	}
	return mod;
})(course_search||{});
