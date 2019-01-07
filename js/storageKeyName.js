//此js用于保存本地存储时，用到的key值

var storageKeyName = (function(mod) {

	mod.key = 0; //0,开发;1,测试--教宝云;2,测试--微视学堂 3外网--微视学堂 4外网--教宝云
// 	var exLog = console.log;
// 	console.log = function(hint, object) {
// 		if(mod.key === 0) {
// 			var argus = hint;
// 			if(typeof(object)!=='undefined') {
// 				argus = hint + JSON.stringify(object);
// 			}
// 			exLog.apply(this, [argus]);
// 		}
// 	}
	switch(mod.key) {
		case 0: //开发
			//---开发---start---
			mod.MAINEDU = 'http://jsypay.jiaobaowang.net/jbcloudapi/'; //科教图片url
			mod.MAINURL = 'http://jsypay.jiaobaowang.net/jbcloudapi/api/CloudApi/'; //主url
			mod.MAINJIAOXIAOURL = 'http://192.168.1.113:8081/JiaoBaoCloudService/'; //家校圈url
			mod.MAINHOMEWORKURL = 'http://192.168.1.44:8513/'; //作业主url
			mod.MAINQIUZHI = 'http://192.168.1.113:8081/JiaoBaoCloudService/'; //求知主url
			mod.MAINMICROCLASS = 'http://192.168.1.113:8081/JiaoBaoCloudService/'; //微课主url
			//---开发---end---
			//---七牛空间和接口---开发---start---
			mod.QNPB = 'http://qn-kfpb.jiaobaowang.net/'; //公开空间域名
			mod.QNGETUPLOADTOKEN = 'http://114.215.222.186:8004/Api/QiNiu/GetUpLoadToKen';
			mod.QNGETUPTOKENHEADIMGE = 'http://114.215.222.186:8004/Api/QiNiu/GetUpLoadToKen'; //获取上传个人头像，群头像，资料头像到七牛的token的url
			mod.QNGETUPTOKENFILE = 'http://114.215.222.186:8004/Api/QiNiu/GetUpLoadToKen'; //获取上传文件（云存储）到七牛的token的url
			mod.QNGETDOWNTOKENFILE = 'http://114.215.222.186:8004/Api/QiNiu/GetAccess'; //获取下载文件（云存储）的token的url，url+七牛文件url
			mod.QNGETTOKENDELETE = 'http://114.215.222.186:8004/Api/QiNiu/Delete'; //获取批量（或者一个）删除七牛文件的token的url
			//	---七牛空间和接口---开发---end---
			break;
		case 1: //测试--教宝云
			//---测试---start---
			mod.MAINEDU = 'http://114.215.222.186:8002/'; //科教图片url
			mod.MAINURL = 'http://114.215.222.186:8002/api/CloudApi/'; //主url
			mod.MAINJIAOXIAOURL = 'http://192.168.1.178:8080/JiaoBaoCloudService/'; //家校圈url
			mod.MAINHOMEWORKURL = 'http://192.168.1.178:8088/'; //作业主url
			mod.MAINQIUZHI = 'http://192.168.1.178:8080/JiaoBaoCloudService/'; //求知主url
			mod.MAINMICROCLASS = 'http://192.168.1.178:8080//JiaoBaoCloudService/'; //微课主url
			
			//---测试---end---

			//---七牛空间和接口---测试---start---
			mod.QNPB = 'http://qn-cspb.jiaobaowang.net/'; //公开空间域名
			mod.QNGETUPLOADTOKEN = 'http://114.215.222.186:8005/Api/QiNiu/GetUpLoadToKen';
			mod.QNGETUPTOKENHEADIMGE = 'http://114.215.222.186:8005/Api/QiNiu/GetUpLoadToKen'; //获取上传个人头像，群头像，资料头像到七牛的token的url
			mod.QNGETUPTOKENFILE = 'http://114.215.222.186:8005/Api/QiNiu/GetUpLoadToKen'; //获取上传文件（云存储）到七牛的token的url
			mod.QNGETDOWNTOKENFILE = 'http://114.215.222.186:8005/Api/QiNiu/GetAccess'; //获取下载文件（云存储）的token的url，url+七牛文件url
			mod.QNGETTOKENDELETE = 'http://114.215.222.186:8005/Api/QiNiu/Delete'; //获取批量（或者一个）删除七牛文件的token的url
			//---七牛空间和接口---测试---end---
			break;
		case 2: //测试--微视学堂
			//---移动版---start---
			mod.MAINEDU = 'http://192.168.1.178:8020/'; //科教图片url
			mod.MAINURL = 'http://192.168.1.178:8020/api/CloudApi/'; //主url
			mod.MAINJIAOXIAOURL = 'http://192.168.1.178:8080/JiaoBaoCloudService/'; //家校圈url
			mod.MAINHOMEWORKURL = 'http://192.168.1.178:8021/'; //作业主url
			mod.MAINQIUZHI = 'http://192.168.1.178:8080/JiaoBaoCloudService/'; //求知主url
			mod.MAINMICROCLASS = 'http://192.168.1.178:8080/JiaoBaoCloudService/'; //微课主url
			//---内网---end---

			//---七牛空间和接口---测试---start---
			mod.QNPB = 'http://qn-cspb.jiaobaowang.net/'; //公开空间域名
			mod.QNGETUPLOADTOKEN = 'http://114.215.222.186:8005/Api/QiNiu/GetUpLoadToKen';
			mod.QNGETUPTOKENHEADIMGE = 'http://114.215.222.186:8005/Api/QiNiu/GetUpLoadToKen'; //获取上传个人头像，群头像，资料头像到七牛的token的url
			mod.QNGETUPTOKENFILE = 'http://114.215.222.186:8005/Api/QiNiu/GetUpLoadToKen'; //获取上传文件（云存储）到七牛的token的url
			mod.QNGETDOWNTOKENFILE = 'http://114.215.222.186:8005/Api/QiNiu/GetAccess'; //获取下载文件（云存储）的token的url，url+七牛文件url
			mod.QNGETTOKENDELETE = 'http://114.215.222.186:8005/Api/QiNiu/Delete'; //获取批量（或者一个）删除七牛文件的token的url
			break;
		case 3: //外网--微视学堂
			mod.MAINEDU = 'https://jbyc.jiaobaowang.net:8442/'; //科教图片url
			mod.MAINURL = 'https://jbyc.jiaobaowang.net:8442/api/CloudApi/'; //主url
			mod.MAINJIAOXIAOURL = 'https://jbyj.jiaobaowang.net:9443/JiaoBaoCloudService/'; //家校圈url
			mod.MAINHOMEWORKURL = 'https://jbyc.jiaobaowang.net:8448/'; //作业主url
			mod.MAINQIUZHI = 'https://jbyj.jiaobaowang.net:9443/JiaoBaoCloudService/'; //求知主url
			mod.MAINMICROCLASS = 'https://jbyj.jiaobaowang.net:9443/JiaoBaoCloudService/'; //微课主url
			//---外网---end---

			//---七牛空间和接口---测试---start---
			mod.QNPB = 'http://qn-cspb.jiaobaowang.net/'; //公开空间域名
			mod.QNGETUPLOADTOKEN = 'http://114.215.222.186:8005/Api/QiNiu/GetUpLoadToKen';
			mod.QNGETUPTOKENHEADIMGE = 'http://114.215.222.186:8005/Api/QiNiu/GetUpLoadToKen'; //获取上传个人头像，群头像，资料头像到七牛的token的url
			mod.QNGETUPTOKENFILE = 'http://114.215.222.186:8005/Api/QiNiu/GetUpLoadToKen'; //获取上传文件（云存储）到七牛的token的url
			mod.QNGETDOWNTOKENFILE = 'http://114.215.222.186:8005/Api/QiNiu/GetAccess'; //获取下载文件（云存储）的token的url，url+七牛文件url
			mod.QNGETTOKENDELETE = 'http://114.215.222.186:8005/Api/QiNiu/Delete'; //获取批量（或者一个）删除七牛文件的token的url
			break;
		case 4: //外网--教宝云
			//---外网---start---
			mod.MAINEDU = 'https://jbyc.jiaobaowang.net:8442/'; //科教图片url
			mod.MAINURL = 'https://jbyc.jiaobaowang.net:8442/api/CloudApi/'; //主url
			mod.MAINJIAOXIAOURL = 'https://jbyj.jiaobaowang.net/JiaoBaoCloudService/'; //家校圈url
			mod.MAINHOMEWORKURL = 'https://jbyc.jiaobaowang.net:8441/'; //作业主url
			mod.MAINQIUZHI = 'https://jbyj.jiaobaowang.net/JiaoBaoCloudService/'; //求知主url
			mod.MAINMICROCLASS = 'https://jbyj.jiaobaowang.net/JiaoBaoCloudService/'; //微课主url
			//---外网---end---

			//---七牛空间和接口---测试---start---
			mod.QNPB = 'http://qn-cspb.jiaobaowang.net/'; //公开空间域名
			mod.QNGETUPLOADTOKEN = 'https://jbyc.jiaobaowang.net:8445/Api/QiNiu/GetUpLoadToKen';
			mod.QNGETUPTOKENHEADIMGE = 'https://jbyc.jiaobaowang.net:8445/Api/QiNiu/GetUpLoadToKen'; //获取上传个人头像，群头像，资料头像到七牛的token的url
			mod.QNGETUPTOKENFILE = 'https://jbyc.jiaobaowang.net:8445/Api/QiNiu/GetUpLoadToKen'; //获取上传文件（云存储）到七牛的token的url
			mod.QNGETDOWNTOKENFILE = 'https://jbyc.jiaobaowang.net:8445/Api/QiNiu/GetAccess'; //获取下载文件（云存储）的token的url，url+七牛文件url
			mod.QNGETTOKENDELETE = 'https://jbyc.jiaobaowang.net:8445/Api/QiNiu/Delete'; //获取批量（或者一个）删除七牛文件的token的url
			//---七牛空间和接口---测试---end---
			break;
		default:
			break;
	}

	mod.PERSONALINFO = 'personalInfo1111'; //个人信息，登录成功后返回值
	mod.SHAKEHAND = 'ShakeHand'; //公钥，登录时，返回的握手信息，
	mod.AUTOLOGIN = 'autoLogin'; //登录信息
	mod.DOCUMENTSPATH = 'DOCUMENTSPATH'; //记录document的地址
	mod.SEHISTORY = 'seHistory'; //科教历史记录
	mod.SECITY = 'seCity'; //科教订制的城市
	mod.SHOWCITY = 'showCity'; //展现订制的城市
	mod.FOCUSEPERSEN = "foucusPersen"; //求知关注的人
	mod.FOCUSEQUESTION = "focusQuestion"; //求知关注的问题
	mod.SHOWFOCUSEPERSEN = "showfoucusPersen"; //展现关注的人
	mod.FOCUSECOURSES = "focusCourses"; //关注的课程
	mod.COURSELASTTIME = "courseLastTime";
	mod.SHOWTYPE = "showType";
	mod.COURSETYPE = "courseType";
	mod.ISSHOWDETAILREADY = "isDetailReady"; //预加载是否完成
	mod.VIEWCANCLICK = 'viewCanClick';
	mod.SCIEDUREADED='sciedu-readed';//科教已读
	mod.CUSTOMREQUESTTIME='customer-request-time';

	mod.MAINHOMEWORKURLTEACHER = mod.MAINHOMEWORKURL + 'TeacherService.svc/'; //老师作业url
	mod.MAINHOMEWORKURLSTUDENT = mod.MAINHOMEWORKURL + 'StudentService.svc/'; //学生作业url
	mod.WAITING = '加载中...'; //
	mod.UPLOADING = '上传中...';
	mod.SIGNKEY = 'jsy309'; //签名密钥
	//---七牛---start---
	//七牛上传空间key值
	//资源平台
	mod.QNPUBZYKEY = "jsy8004";
	//教宝云作业
	mod.QNPUBJBYZYKEY = "zy309309!";
	//教宝云盘
	mod.QNPUBJBYPKEY = "jbyp@2017";
	//教宝云用户管理
	mod.QUPUBJBMANKEY = "jbman456";
	//家校圈
	mod.QNPUBJXQKEY = "jxq789!@";
	//求知
	mod.QNPUBQZKEY = "qz123qwe";

	//七牛存储子空间（文件二级文件名）
	mod.QNPUBSPACE = "pb"; //七牛公开空间
	mod.QNPRISPACE = "pv"; //七牛私有空间
	mod.TEAPICBUCKET = 'TeaAnswersPic/'; //老师临时作业答案存储空间
	mod.TEATHUMBPICBUCKET = 'TeaAnThumbPic/Thumb/'; //老师临时作业答案缩略图存储空间
	mod.STUPICBUCKET = 'StuAnswerPic/'; //学生临时作业答案存储空间
	mod.STUTHUMBPICBUCKET = 'StuAnThumbPic/Thumb/'; //学生临时作业缩略图存储空间
	mod.PERSONALSPACE = 'PersonalSpace/'; //个人空间、原图
	mod.PERSONALSPACETHUMB = 'PersonalSpace/Thumb/'; //个人空间、缩略图
	mod.CLASSSPACE = 'ClassSpace/'; //班级空间、原图
	mod.CLASSSPACETHUMB = 'ClassSpace/Thumb/'; //班级空间、缩略图
	mod.NOTE = 'Note/'; //笔记、原图
	mod.NOTETHUMB = 'Note/Thumb/'; //笔记、缩略图
	mod.RECORD = 'Record/'; //记事、原图
	mod.RECORDTHUMB = 'Record/Thumb/'; //记事、缩略图
	mod.KNOWLEDGE = 'Knowledge/'; //求知、原图
	mod.KNOWLEDGETHUMB = 'Knowledge/Thumb/'; //求知、缩略图
	mod.HEADIMAGE = 'HeadImage/'; //个人头像，资料头像，群头像
	mod.HEADIMAGETHUMB = 'HeadImage/Thumb/'; //个人头像，资料头像，群头像
	mod.CLOUDSTORAGE = 'CloudStorage/'; //云存储的文件
	mod.CLOUDSTORAGETHUMB = 'CloudStorage/Thumb/'; //云存储的文件缩略图
	//---七牛---end---

	//---默认图片---start---
	mod.DEFAULTPERSONALHEADIMAGE = '../../image/utils/default_personalimage.png'; //默认的个人头像
	mod.DEFAULTSCIEDUIMAGELOAD = '/image/utils/default_load_2.gif'; //科教首页，懒加载显示加载中的图片
	mod.DEFAULTIMAGELOAD = '/image/utils/default_load_2_1.gif';
	//---默认图片---end---

	//---Activity的code---start---
	mod.CODERECORDVIDEO = 0; //录像
	mod.CODEPLAYVIDEO = 1; //播放视频
	//---Activity的code---end---

	return mod;

})(storageKeyName || {});