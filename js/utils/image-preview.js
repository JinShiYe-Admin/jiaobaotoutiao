/**
 * 图片预览功能
 */
Vue.component('img-container',{
	props:['imgs',index]
	template:'<div></div>'
})
var imgPreview=new Vue({
	el:'#img-preview',
	child:{
		template:
	}
	data:{
		imgs:[],
		index:0
	},
	methods:{
		setImgs:function(imgs,index){
			this.imgs=imgs;
			this.index=index;
		}
	}
})
