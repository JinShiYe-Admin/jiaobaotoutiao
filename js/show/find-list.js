Vue.component('find-list', {
	props: {
		findInfo: {
			type: Object
		}
	},
	template: '#find-listView',
	data: function() {
		return {
			listData: [],
			showInfo: this.findInfo
		}
	},
	created: function() {
		console.log("组件创建时的数值：" + this.$route.params.id);
		this.showInfo.pageIndex = 1;
		//当创建时且确定为关注或全部时 请求数据
//		this.requireData();
	},
	watch: {
		'$route' (to, from) {
			console.log("发现列表的路由变化的监听：" + this.$route.params.id);
			this.showInfo.pageIndex = 1;
			this.requireData();
		},
	},
	methods: {}
})