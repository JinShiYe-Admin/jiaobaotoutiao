/**
 * @author an
 * 轮播图  加载图片
 * @param {Object} imgUrls
 */
var  carousel=(function(mod){
	mod.createList=function(imgUrls,titles,words){
		var data=new Array();
		imgUrls.forEach(function(imgUrl,index){
			if(words){
				data.push(createItem(imgUrl,titles[index],words[index]));
			}else{
				data.push(createItem(imgUrl,titles[index]));
			}
			
		})
		return data;
	}
	createItem=function(img,title,word){
		var item=new Object();
		item.imgUrl=img;
		item.title=title;
		if(word){
			item.word=word;
		}
		return item;
	}
	mod.createView=function(data){
		var group=document.body.querySelector(".mui-slider-group,.mui-slider-loop");
		addDiv(group,data[data.length-1]);
		data.forEach(function(item,index){
			var div=document.createElement('div');
			div.className="mui-slider-item"
			createInner(item,div);
			group.appendChild(div);
		})
		addDiv(group,data[0]);
	}
	var addDiv=function(group,item){
		var div=document.createElement('div');
		div.className="mui-slider-item mui-slider-item-duplicate"
		createInner(item,div);
		group.appendChild(div);
	}
	var createInner=function(item,div){
		if(item.word){
			div.innerHTML=createWordsInner(item);
		}else{
			div.innerHTML=createImgInner(item);
		}
	}
	var createImgInner=function(item){
		var innerHTML='<a href="#">'
			        +'<img src="'+item.imgUrl+'">'
			        +'<p class="mui-slider-title">'+item.title+'</p>'
			      +'</a>';
		return innerHTML;		      
	}
// <a href="javascript:;">
//			            <img class="mui-media-object mui-pull-left" src="../image/knowledge/0.png">
//			            <div class="mui-media-body">
//			                幸福
//			                <p class="mui-ellipsis">能和心爱的人一起睡觉，是件幸福的事情；可是，打呼噜怎么办？</p>
//			            </div>
//			        </a>
	var createWordsInner=function(item){
	return	'<div class="words-inner">'
			        +'<img class="mui-pull-left" style="width:30%"  src="'+item.imgUrl+'"/>'
			        +'<div class="">'
				        +'<h4 class="title">'+item.title+'</h4>'
				        +'<p >'+item.word+'</p>'
			        +'</div>'
			      +'</div>';
	}
	/**
   * 加载底部条状物
   * @param {Object} imgUrls
   */
	mod.addStrip=function(imgUrls){
		var strip=document.body.querySelector(".mui-slider-indicator,.mui-text-right");
		for(i=0;i<imgUrls.length;i++){
			var div=document.createElement('div');
			if(i==0){
				div.className="mui-indicator mui-active";
			}else{
				div.className="mui-indicator";
			}
			strip.appendChild(div);
		}
	}
	return mod;
})(window.carousel||{})



