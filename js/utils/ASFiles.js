var asFiles=(function(mod){
	mod.openASFiles=function(){
		if(plus.os.name=="Android"){
			var REQUESTCODE = 1;
			var main=plus.android.runtimeMainActivity();
			var Intent=plus.android.importClass('android.content.Intent');
			var intent=new Intent(Intent.ACTION_GET_CONTENT);
			intent.setType("*/*");
			main.startActivityForResult(intent,REQUESTCODE);
			main.onActivityResult = function(requestCode, resultCode, data) { 
                    if (REQUESTCODE == requestCode) {
                        var context = main;
                        plus.android.importClass(data);
                        // 获得文件路径
                        var fileData = data.getData();  
                        var path = plus.android.invoke(fileData, "getPath");
                        //console.log("path:"+path);
                        // 判断文件类型
                        var resolver = context.getContentResolver();
                        var fileType = plus.android.invoke(resolver, "getType",fileData);
                        //console.log("fileType:"+fileType);
                    }
               };
          }
		}

	return mod;
})(document.asFiles||{})
