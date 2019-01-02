Vue.component('course-list', {
	template: '<ul v-bind:class="[\'mui-table-view\']">' +
		'<li v-for="(li,index) of listData" v-bind:class="[\'mui-table-view-cell\']">' +
		'{{JSON.stringify(li)}}' +
		//		'<div v-bind:class="[\'course-container\']">' +
		//		'<div v-bind:class="[\'img-container\']">' +
		//		'<img v-bind:class="[\'course-img\']" v-bind:src="li.CoursePic" />' +
		//		'<span  v-bind:class="[\'red-circle\',{\'display-none\':li.IsUpdate==0}]"></span>' +
		//		'</div>' +
		//		'<div v-bind:class="[\'course-detail\']">' +
		//		'<div v-bind:class="[\'courseName-button\']">' +
		//		'<p v-bind:class="[\'course-name\',\'single-line\']">{{li.CourseName}}</p>' +
		////		'<button  type="button"  v-bind:class="[\'input-btn\',{\'btn-focused\':li.IsFocus},{\'btn-unfocus\':!li.IsFocus}]" v-on:tap.stop="toggleFocus(li)">{{li.IsFocus?"已关注":"关注"}}</button>' +
		//		'</div>' +
		//		'<p v-bind:class="[\'course-info\',\'double-line\']">{{li.SecName}}</p>' +
		//		'</div>' +
		//		'</div>' +
		'</li>' +
		'</ul>',
	data: function() {
		return {
			listData: [{
					"TabId": 7,
					"SecId": 85,
					"SecName": "333",
					"CourseName": "课程D",
					"UpdateTime": "2017-08-23 11:17:31",
					"SecStatus": 1,
					"IsFocus": false,
					"CoursePic": "http://qn-kfpb.jiaobaowang.net/jbypc/pc/baotuquan1.jpg",
					"IsUpdate": 1
				},
				{
					"TabId": 3,
					"SecId": 67,
					"SecName": "啊时代大厦",
					"CourseName": "语文",
					"UpdateTime": "2017-07-31 16:41:54",
					"SecStatus": 1,
					"IsFocus": false,
					"CoursePic": "http://qn-kfpb.jiaobaowang.net/jbypc/pc/baotuquan1.jpg",
					"IsUpdate": 0
				},
				{
					"TabId": 12,
					"SecId": 63,
					"SecName": "测试 提醒",
					"CourseName": "课程R",
					"UpdateTime": "2017-07-20 09:23:11",
					"SecStatus": 1,
					"IsFocus": false,
					"CoursePic": "http://qn-kfpb.jiaobaowang.net/jbypc/pc/baotuquan1.jpg",
					"IsUpdate": 0
				},
				{
					"TabId": 8,
					"SecId": 47,
					"SecName": "15589967133 发布",
					"CourseName": "课程E",
					"UpdateTime": "2017-07-17 11:17:11",
					"SecStatus": 1,
					"IsFocus": false,
					"CoursePic": "http://qn-kfpb.jiaobaowang.net/jbypc/pc/baotuquan1.jpg",
					"IsUpdate": 0
				},
				{
					"TabId": 11,
					"SecId": 40,
					"SecName": "去去去",
					"CourseName": "课程H",
					"UpdateTime": "2017-07-13 14:10:39",
					"SecStatus": 1,
					"IsFocus": false,
					"CoursePic": "http://qn-kfpb.jiaobaowang.net/jbypc/pc/baotuquan1.jpg",
					"IsUpdate": 0
				},
				{
					"TabId": 9,
					"SecId": "",
					"SecName": "",
					"CourseName": "课程F",
					"UpdateTime": "",
					"SecStatus": "",
					"IsFocus": false,
					"CoursePic": "http://qn-kfpb.jiaobaowang.net/jbypc/pc/baotuquan1.jpg",
					"IsUpdate": 0
				},
				{
					"TabId": 10,
					"SecId": "",
					"SecName": "",
					"CourseName": "课程G",
					"UpdateTime": "",
					"SecStatus": "",
					"IsFocus": false,
					"CoursePic": "http://qn-kfpb.jiaobaowang.net/jbypc/pc/baotuquan1.jpg",
					"IsUpdate": 0
				},
				{
					"TabId": 4,
					"SecId": "",
					"SecName": "",
					"CourseName": "课程A",
					"UpdateTime": "",
					"SecStatus": "",
					"IsFocus": false,
					"CoursePic": "http://qn-kfpb.jiaobaowang.net/jbypc/pc/baotuquan1.jpg",
					"IsUpdate": 0
				},
				{
					"TabId": 5,
					"SecId": "",
					"SecName": "",
					"CourseName": "课程B",
					"UpdateTime": "",
					"SecStatus": "",
					"IsFocus": false,
					"CoursePic": "http://qn-kfpb.jiaobaowang.net/jbypc/pc/baotuquan1.jpg",
					"IsUpdate": 0
				},
				{
					"TabId": 6,
					"SecId": "",
					"SecName": "",
					"CourseName": "课程C",
					"UpdateTime": "",
					"SecStatus": "",
					"IsFocus": false,
					"CoursePic": "http://qn-kfpb.jiaobaowang.net/jbypc/pc/baotuquan1.jpg",
					"IsUpdate": 0
				}
			],
//			courseInfo: {
//				type: this.$route.params.id,
//				pageIndex: 1,
//				totalPage: 0
//			}
		}
	},
	created: function() {
		console.log("当前route的params的id:" + this.$route.params.id);
//		this.requestData();
	},
	watch: {
		'$route' (to, from) {
			console.log("当前route的params的id:" + this.$route.params.id);
//			this.courseInfo.pageIndex = 1;
//			this.requestData();
		},
		listData: function(newVal, oldVal) {
			console.log("course-list2获取的列表数据", newVal);
			console.log("course-list2曾经的列表数据", oldVal);
		}
	},
	methods: {

	}
})