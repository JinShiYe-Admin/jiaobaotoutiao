var qiniuUpload = (function(mod) {
	mod.uploadFile = function(file) {

	}
	mod.delFile = function() {

	}
	mod.uploadFiles = function(files) {

	}
	mod.delFiles = function() {

	}
	/**
	 *
	 * @param {Object} appId app的id
	 */
	function getAppKey(appId) {
		var desKey;
		switch(appId) {
			case 0:
				break;
			case 1:
				break;
			case 2: //资源平台
				desKey = "jsy8004";
				break;
			case 3: //教宝云作业
				desKey = "zy309309!";
				break;
			case 4: //教宝云盘
				desKey = "jbyp@2017";
				break;
			case 5: //教宝云用户管理
				desKey = "jbman456";
				break;
			case 6: //家校圈
				desKey = "jxq789!@";
				break;
			case 7: //家校圈
				desKey = "qz123qwe";
				break;
			default:
				break;
		}
		return desKey;
	}
	return mod;
})(qiniuUpload || {})