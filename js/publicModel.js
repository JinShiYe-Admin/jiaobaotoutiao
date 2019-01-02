//此js用于保存网络请求后，返回的model


var publicModel = (function($, mod) {
	//握手后，返回公钥
	mod.model_ShakeHand = {
		Exponent:'',//公钥模式
		Modulus:''//公钥值
	};
	
	//注册后，或者登录后，返回用户的信息
	mod.model_personalInfo = {
		utid:'',//用户表ID
		uid:'',//电话号码
		uname:'',//姓名,账号,只能修改一次,且只能字母开头,字母与数字,定了就不能修改
		uimg:'',//用户头像地址
		unick:'',//用户昵称
		usex:'',//用户性别
		utxt:'',//用户签名
		uarea:'',//用户区域,省代码 市代码|省名称 市名称
		token:'',//用户令牌
		ispw:'',//0无密码，1有密码
		isLogin:''//是否登录，0没有登录过，1有登录过
	};
	
	//9.获取用户群
	mod.model_groupList = {
		gid:'',//群ID
		gname:'',//群名
		gimg:'',//群头像,群头像的链接
		mstype:''//用户管理角色,0家长,1管理员,2老师,3学生
	}
	
	//11.通过用户账号和手机号搜索用户
	mod.model_userInfo = {
		utid:'',//用户表ID
		uid:'',//用户手机号
		uname:'',//用户名
		unick:'',//用户昵称
		usex:'',//性别
		utxt:'',//签名
		uimg:''//用户头像地址
	}
	
	//13.通过群ID获取群的正常用户
	mod.model_groupNormalUser = {
		gid:'',//群ID
		gutid:'',//用户在群ID
		utid:'',//用户tid
		ugname:'',//用户在群昵称，用户在群里的备注名称
		ugnick:'',//用户昵称，用户资料昵称
		uimg:'',//用户头像，用户头像
		mstype:''//资料类型,0家长,1管理员,2老师,3学生
	}
	
	//16.通过群ID获取群对象资料
	mod.model_groupStus = {
		gid:'',//群ID
		stuid:'',//资料id
		stuname:'',//名称
		stuimg:'',//头像,头像地址
		mstype:''//资料类型,0家长,1管理员,2老师,3学生
	}
	
	//17.通过审批者ID获取相应的入群邀请或申请
	mod.model_groupRequestUser = {
		gutid:'',//	邀请记录ID	int		否	
		gid:'',//	群ID	int		否	
		gname:'',//	群名	string		否	
		invname:'',//	邀请人姓名	string		否	申请人
		invimg:'',//	邀请人头像	string		否	申请人
		gimg	:'',//群头像	string		否	
		beinvname:'',//	被邀请人姓名	string		否	
		mstype:'',//	邀请成为类型	int		否	0家长,1管理员,2老师,3学生
		stuname:'',//	关联学生姓名	string		否	
		aptime:'',//	申请时间	string		否	
		appnote:'',//	申请备注	string		否	
		stat:''//状态，0待审,1通过,2被拒绝
	}
	
	//22.通过用户资料ID获取用户各项资料
	mod.model_userDataInfo = {
		gid:'',//群ID
		gname:'',//群名称
		gimg:'',//群头像
		utid:'',//用户账号表ID
		ugname:'',//用户在群昵称
		uimg:'',//用户头像
		umstype:'',//用户在群类型
		stat:'',//用户在群状态
		urel:'',//用户与资料关系
		stuname:'',//资料名称
		stuimg:'',//资料头像
		stumstype:'',//资料在群类型
		job:'',//职位
		title:'',//职称
		expsch:'',//教龄
		sub:'',//科目
		stuid:'',//资料ID
		gutid:'',//账号在群ID
		ustuid:''//关联ID
	}
	
	//云盘
	
	//26.用户云盘顶层文件及文件夹获取
	mod.model_PostDiFi = {
		pid:'',//父ID	int			该文件的上层ID
		fid:'',//文件ID	int			该文件ID
		fname:'',//	文件名称	string			文件名称
		ftype:'',//	文件类型	string			存文件的扩展名,如.file为文件夹
		fpath:'',//	文件路径	string			文件路径,为文件用
		fsize:'',//	文件大小	int			文件用
		utid	:'',//所属人ID	int			
		fdate:''//	上传时间	string			
	}
	
	//32.通过群ID,类型获取用户自身在群的信息
	mod.model_postGuInfo = {
		gutid:'',//	用户在群ID
		utid	:'',//用户表ID
		ugname:'',//	用户在群昵称
		mstype:''//	类型,0家长,1管理员,2老师,3学生
	}
	
	//40.通过用户ID获取用户各项资料
	mod.model_PostGusinf = {
		utid	:'',//用户账号表ID
		urel	:'',//用户与资料关系
		stuname:'',//	资料名称
		stuimg:'',//	资料头像
		stumstype:'',//	资料在群类型
		job:'',//	职位
		title:'',//	职称
		expsch:'',//	教龄
		sub:'',//	科目
		stuid:'',//	资料ID
		gutid:'',//	账号在群ID
		ustuid:''//	关联ID
	}
	
	//41.获取某个区域下的所有子区域
	mod.model_area = {
		procode:'',//省份code，自己添加的参数
		proname:'',//省份名称，自己添加的参数
		acode:'',//节点代码,通用6位,前两位为省份编码,中间两位为城市编码,后两位为区县编码--城市代码
		aname:'',//节点名称--城市名称
		atype:''//节点类型,0省1城市2区县
	}
	
	//45.分页新闻
	mod.model_new = {
		title:'',//标题
		tnote:'',//摘要
		tips:'',//作者等信息
		timgs:'',//图片信息，多个中间用|隔开
		turl	:'',//原文url
		recdate:''//	记录时间
	}
	
	//48.通过区域代码及相应参数获取对应分页新闻
	mod.model_newPG = {
		PageIndex:'',//当前页码
		RowCount:'',//总行数
		PageCount:'',//总页数
		PageSize:''//每页行数
	}
	mod.model_newDT = {
		title:'',//标题
		tabid:'',//新闻ID
		tnote:'',//摘要
		tips	:'',//作者等信息
		timgs:'',//图片信息,多个中间用|隔开
		turl:'',//原文url
		ischeck:'',//审核状态
		recdate:''//	记录时间
	}
	
	//家校圈
	//2.（点到记事）获取用户未读点到记事列表
	mod.model_homeSchoolList = {
		TotalPage:'',//总页数
		TotalCnt:'',//总记录数
		NoReadCnt:'',//未读条数
		Data:[//列表数据
			
		]
	}
	
	//家校圈用户记事信息---看实际model
	mod.model_userNoteInfo = {
		//共用
		TabId:'',//点到记事ID，16班级空间id,28用户空间id，
		PublisherId:'',//发布者ID
		PublishDate:'',//发布时间
		MsgContent:'',//记事内容
		NoteType:'',//点到记事类型，1云笔记2个人空间动态
		CheckType:'',//点到情况
		EncType:'',//附件类型
		EncAddr:'',//附件地址，多个的情况例如：1.jpg|2.jpg
		EncImgAddr:'',//附件缩略图
		PubArea:'',//发布区域
		MsgTitle:'',//记事标题
		//个人信息,2,7,
		StudentId:'',//学生ID
		
		//班级信息，14，19，
		ClassId:'',//班级ID
		
		//个人空间----26，37
		UserId:'',//用户ID，发消息用户ID
		EncIntro:'',//附件简介
		
		//16.（班级空间）获取用户针对某班级的空间列表，28
		ReadCnt:'',//浏览次数
		LikeCnt:'',//点赞次数
		//28
		LikeUsers:'',//点赞列表
		InShow:'',//是否展现
		Comments:'',//评论列表
		
		EncTypeStr:'',//附件类型说明，
		EncLen:'',//音视频时长
		NoteTypeStr:'',//点到记事类型说明,信息类型说明
		CheckTypeStr:'',//点到情况说明
		
		IsLike:'',//是否点赞
		IsFocused:'',//是否已关注
		//36
		NoReadCnt:''//未读条数
	}
	
	//74.（用户空间）获取多用户空间所有用户动态列表
	mod.model_userComment = {
		TabId:'',//评论ID
		UserId:'',//	评论用户ID
		ReplyId:'',//回复用户ID
		CommentContent:'',//	评论或回复内容
		CommentDate:'',//评论或回复时间
		UpperId:'',//上级ID
		Replys:''//	下级回复列表
	}
	
	//用户空间，用户列表
	mod.model_userSpaceInfo = {
		TabId:'',//评论ID
		UserId:'',//评论用户ID
		UserSpaceId:'',//记事ID
		CommentContent:'',//评论或回复内容
		CommentDate:'',//评论或回复时间
		UpperId:'',//上级ID
		Replys:[],//回复数组
		
		//31,49，
		ReplyId:'',//回复用户ID
		//51,
		MsgContent:'',//留言或回复内容
		//49
		Replys:'',//回复的数组
		
		MsgDate:''//留言或回复时间，49，
	}
	
	//56.（用户空间）获取与我相关
	mod.model_userSpaceAboutMe = {
		TabId:'',//留言ID,56消息ID
		UserId:'',//留言用户ID
		MsgType:'',//消息类型,1为其他用户评论2为评论的回复3为其他用户点赞4为其他用户留言5为留言的回复
		MsgDate:'',//消息时间
		MsgArray:'',//消息数组
		MsgFrom:'',//发消息者,从属MsgArray
		MsgTo:'',//接消息者,从属MsgArray
		MsgContent:'',//消息内容,从属MsgArray
		MsgTypeStr:'',//消息类型说明
		Content:'',//消息内容	String		否	从属Data
		SpaceId:'',//空间动态ID	int		否	从属Data
		MsgContent:'',//	动态内容	String		否	从属Data
		EncType:'',//附件类型	int		否	从属Data
		EncTypeStr:'',//附件类型说明
		EncLen:'',//音视频时长
		EncAddr:'',//附件地址	String		否	从属Data
		EncImgAddr:''//附件缩略图地址	String		否	从属Data

	}
	
	mod.model_msgArray = {
		MsgFrom:'',//发消息者
		MsgTo:'',//接消息者
		MsgContent:''//消息内容
	}
	
	//69.（云档案）按家长获取学生档案
	mod.model_getStudentFile = {
		TabId:'',//档案记事ID
		StudentName:'',//学生姓名
		ClassName:'',//	班级信息
		PublisherName:'',//发布者姓名
		PublishDate:'',//发布时间
		MsgContent:'',//	记事内容
		NoteType:'',//点到记事类型
		CheckType:'',//点到情况
		EncType:'',//附件类型
		EncAddr:'',//附件地址,多个的情况例如：1.jpg|2.jpg
		EncImgAddr:'',//	附件缩略图
		EncTypeStr:'',//	附件类型说明
		EncLen:'',//音视频时长
		CheckTypeStr:'',//点到情况说明
		NoteTypeStr:''//	点到记事类型说明
	}
	
	//话题--求知
	mod.model_Channel = {
		TabId:'',//话题ID
		ChannelCode:'',//话题编号
		ChannelName:''//话题名称
	}
	
	//专家信息--求知
	mod.model_expert = {
		TabId:'',//问答用户表ID
		UserId:'',//	用户ID
		UserNote	:'',//专家简介
		ExpertLevel:'',//专家等级
		ExpertChannels:'',//	专家话题列表,Array,例如[1,2,3]
		AnswerNum:'',//回答数
		IsInvited:''//是否邀请
	}
	
	//用户信息--求知
	mod.model_QZUserInfo = {
		TabId:'',//问答用户表ID	int		否	
		UserId:'',//	用户ID	int		否	
		IsExpert:'',//是否专家	int		否	
		UserNote:'',//用户简介	String		否	
		ExpertLevel:'',//专家等级	int		否	
		ExpertChannels:'',//	专家话题列表	Array		否	例如[1,2,3]
		ExpertChannelNames:''//专家话题名称列表	Array
		AnswerNum:'',//回答数	int		否	
		AskNum:'',//	提问数	int		否	
		CommentNum:'',//	评论数	int		否	
		InviteNum:''//邀请数	int		否
		IsLikeNum:'',//回答点赞数	int		否	
		FocusAskNum:'',//关注问题数	int		否	
		FocusManNum:'',//关注人数	int		否	
		IsFocusedManNum:''//	被人关注数	int		否	
	}
	
	//符合条件问题--求知
	mod.model_QZAsk = {
		TabId:'',//问题表ID
		AskSFlag	:'',//问题来源,1 为外部导入数据
		AskTitle	:'',//问题标题
		AskNote:'',//问题说明
		AskEncType:'',//问题附件类型
		AskEncLen:'',//问题音视频时长
		AskEncTypeStr:'',//问题附件类型说明
		AskEncAddr:'',//问题附件地址,多个的情况例如：1.jpg|2.jpg
		AskThumbnail:'',//问题缩略图
		AskCutImg:'',//问题剪切图
		AskChannelId	:'',//问题所属话题ID
		AskChannel:'',//	问题所属话题
		AskMan:'',//	提问人
		AskTime:'',//提问时间
		IsAnonym:'',//是否匿名
		AnswerId	:'',//回答ID
		AnswerSFlag:'',//回答来源,1 为外部导入数据
		AnswerContent:'',//回答内容
		AnswerEncType:'',//回答附件类型
		AnswerEncLen	:'',//回答音视频时长
		AnswerEncTypeStr	:'',//回答附件类型说明
		IsLikeNum:'',//回答点赞数
		AnswerEncAddr:'',//回答附件,多个的情况例如：1.jpg|2.jpg
		AnswerThumbnail:'',//回答缩略图
		AnswerCutImg	:'',//回答剪切图
		AnswerMan:'',//回答人
		AnswerTime:'',//回答时间
		IsFocused:'',//是否已关注
		CommentNum:''//回答评论数
	}
	
	//某个问题的详情--求知
	mod.model_QZAskDetail = {
		TabId:'',//	问题ID
		AskSFlag:'',//问题来源,1 为外部导入数据
		AskTitle:'',//问题标题
		AskNote:'',//问题说明
		AskEncType:'',//问题附件类型
		AskEncLen:'',//问题音视频时长
		AskEncTypeStr:'',//问题附件类型说明
		AskEncAddr:'',//问题附件地址,多个的情况例如：1.jpg|2.jpg
		AskThumbnail:'',//问题缩略图
		AskCutImg:'',//问题剪切图
		AskChannelId:'',//问题所属话题ID
		AskChannel:'',//	问题所属话题
		ReadNum:'',//阅读数
		AnswerNum:'',//回答数
		FocusNum:'',//关注数
		AskMan:'',//	提问人
		AskTime:'',//提问时间
		IsAnonym	:'',//是否匿名
		TotalPage:'',//评论总页数
		TotalCnt:'',//评论总记录数,用于分页，结果应该与AnswerNum相同
		Data:'',//	回答列表,Array[model_QZAnswer]
		IsFocused:'',//	是否已关注
		IsAnswered:'',//	是否已回答
		AnswerId	:'',//本人回答ID，未回答时为0
		IsAnswerOff:'',//回答是否被屏蔽,1 已屏蔽,0 未屏蔽
		AskChannel:'',//	问题话题
		AskId:''//问题ID
	}
	
	//回答详情--求知
	mod.model_QZAnswer = {
		AnswerId	:'',//回答ID
		AnswerSFlag:'',//回答来源,1 为外部导入数据
		AnswerContent:'',//	回答内容
		AnswerEncType:'',//回答附件类型
		AnswerEncLen:'',//	回答音视频时长
		AnswerEncTypeStr	:'',//回答附件类型说明
		AnswerEncAddr:'',//回答附件地址,多个的情况例如：1.jpg|2.jpg
		AnswerThumbnail:'',//回答缩略图
		AnswerCutImg	:'',//回答剪切图
		AnswerMan:'',//	回答人
		AnswerTime:'',//	回答时间
		IsAnonym	:'',//是否匿名
		IsLikeNum:'',//	回答点赞数
		CommentNum:'',//	回答评论数
		IsLiked:''//	是否已点赞
	}
	
	//某个回答的详情--求知
	mod.model_QZAnswersDetail = {
		AnswerId:'',//回答ID
		AnswerSFlag:'',//回答来源,1 为外部导入数据
		TabId:'',//	回答ID
		AskId:'',//	问题ID
		AskTitle:'',//	问题标题
		AskChannelId:'',//问题话题ID
		AskChannel:'',//	问题话题
		AnswerContent:'',//	回答内容
		AnswerEncType:'',//回答附件类型
		AnswerEncLen:'',//回答音视频时长
		AnswerEncTypeStr	:'',//回答附件类型说明
		AnswerEncAddr:'',//回答附件地址,多个的情况例如：1.jpg|2.jpg
		AnswerThumbnail:'',//回答缩略图
		AnswerCutImg:'',//回答剪切图
		AnswerMan:'',//	回答人
		AnswerManNote:'',//	回答人简介
		IsAnonym	:'',//是否匿名
		AnswerTime:'',//	回答时间
		IsLikeNum:'',//	回答点赞数
		CommentNum:'',//	回答评论数
		TotalPage:'',//	评论总页数
		TotalCnt	:'',//评论总记录数,用于分页，结果应该与CommentNum相同
		IsLiked:'',//	是否已点赞
		Data	:''//评论列表,Array[model_QZComment]
	}
	
	//回答详情--求知
	mod.model_QZComment = {
		TabId:'',//评论ID
		UserId:'',//	评论用户ID
		ReplyId:'',//回复用户ID
		CommentContent:'',//	评论或回复内容
		CommentDate:'',//评论或回复时间
		UpperId:'',//上级ID
		LikeNum:'',//评论点赞数
		IsLiked:'',//是否已点赞
		Replys:'',//	下级回复列表,Array
		
		AnswerId:''//回答ID
	}
	
	//消息提醒--求知
	mod.model_QZetNotification = {
		UserId:'',//	发消息用户ID	int		否	从属Data,包括回答人ID、评论人ID、邀请人ID、关注人ID
		MsgType:'',//消息类型	int		否	从属Data，1 回答我的提问，2 回答我关注的提问，3 问题的回答被点赞，4 回答下的评论被点赞，5 问题的回答被评论，6 回答下的评论被回复，7 问题被邀请，8 被人关注
		MsgTime:'',//消息时间	String		否	从属Data
		AskTitle:'',//问题标题	String		否	从属Data
		AnswerContent:'',//回答内容	String		否	从属Data
		AnswerSFlag:'',//回答来源,1 为外部导入数据
		ContentId:''//内容ID	int		否	从属Data,1,2，3的内容ID是回答ID；4,5,6的内容ID是评论ID；7的内容ID是问题ID；8的内容ID是用户ID
	}
	
	//获取某个用户的评论列表--求知
	mod.model_QZCommentsByUser = {
		AskId:'',//	问题ID	int
		AskTitle:'',//	问题标题	String
		AnswerId:'',//	回答ID	int
		AnswerContent:'',//	回答内容	String
		CommentId:'',//	评论ID	int
		AnswerSFlag:'',//回答来源,1 为外部导入数据
		CommentContent:'',//	评论内容	String
		CommentDate:'',//评论时间
		AskChannel:'',//	问题话题
		LikeNum:''//	评论点赞数	int
	}

	return mod;

})(mui, publicModel || {});
