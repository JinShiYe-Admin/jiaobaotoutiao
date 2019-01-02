var list=(function(mod){
	mod.createList=function(headImgs,names,questions,answers){
		var data=new Array();
		headImgs.forEach(function(img,index,imgs){
			data.push(createItem(img,names[index],questions[index],answers[index]))
		})
//		//console.log(JSON.stringify(data))
		return data;
	}
	
	var createItem=function(img,name,question,answer){
		var item=new Object();
		item.headImg=img;
		item.name=name;
		item.question=question;
		item.answerDetail=answer;
		return item;
	}
	mod.createView=function(data){
		var list=document.getElementById('knowledge_list')
//		//console.log(JSON.stringify(data))
		data.forEach(function(item,i,data){
			var li=document.createElement('li');
			li.className='mui-table-view-cell';
			li.innerHTML=createInner(item);
			list.appendChild(li);
		})
	}
	var createInner=function(item){
		var inner='<div class="item-head" >'
		   			+'<img class="head-img" src="'+item.headImg+'"/>'
		   			+'<p>'+item.name+'</p>'
	   			+'</div>'
	   			+'<div class="question-answer">'
		   			+'<p class="title">'+item.question.words+'</p>'
		   			+'<span class="detail">详情</span>'
		   			+createImgInner(item.question.imgs)+''
		   			+createAnswersInner(item.answerDetail)
	   			+'</div>';
//		   	//console.log("inner:"+inner)
		   	return inner;
	}
	var createImgInner=function(imgs){
		var imgInner='';
		if(imgs){
			imgs.forEach(function(img,i,imgs){
				if(imgs.length>3){
					imgInner+='<img style="width:33.333333333%;" src="'+img+'"/>'
				}else{
					imgInner+='<img style="width:'+100/imgs.length+'%;" src="'+img+'"/>';
				}
			})
		
		}
//		//console.log('imginner'+imgInner);
		return imgInner;
	}
	var createAnswersInner=function(answerDetail){
		var answer=''
		answerDetail.name.forEach(function(na,i,words){
			if(answerDetail.imgs){
				answer+='<div class="chat_content_top">'
				   			+'<div class="chat-body">'
					   			+na+"回答:"+answerDetail.words[i]+'<br/>'
					   			+createImgsInner(answerDetail.imgs)
				   			+'</div>'
		   				+'</div>';
			}else{
				answer+='<div class="chat_content_top">'
				   			+'<div class="chat-body">'
					   			+'<div class="answer-name">'+na+'</div>'
					   			+'<div class="answer-answer">'+"回答:"+answerDetail.words[i]+'<br/></div>'
				   			+'</div>'
		   				+'</div>';
			}   				
		})
//		//console.log("answer"+answer)
		return answer
	}
	return mod;
})(window.list||{})
