var detailTea = new Vue({
	el: '#detail-tea',
	data: {
		workDetail: {

		},
		stuList: {
			comList: [],
			uncList: []
		}
	},
	methods: {
		resetData: function() {
			this.workDetail = {};
			this.stuList = {
				comList: [],
				uncList: []
			}
		},
		requireWorkDetail: function(workId) {
			postDataPro_GetHomework({
				teacherId: events.getUtid(), //教师Id
				homeworkId: workId //作业id；
			},null,function(data){
				console.log("获取的作业信息：",data);
			})
		},
		requireStuList: function() {

		}
	}
})