var files = (function(mod) {
	mod.getFilesByWWW = function() {
		mod.getFiles(plus.io.PRIVATE_WWW);
	};
	mod.getFilesByDOC = function() {
		mod.getFiles(plus.io.PRIVATE_DOC);
	};
	mod.getFilesPDOC = function() {
		mod.getFiles(plus.io.PUBLIC_DOCUMENTS);
	};
	mod.getFilesDownload = function() {
		mod.getFiles(plus.io.PUBLIC_DOWNLOADS);
	};
	mod.getFiles = function(type) {
		plus.io.requestFileSystem(type, function(fs) {
			// 可通过fs进行文件操作 
			mod.readDirectory(fs.root)
			//console.log("files" + fs.name);
		}, function(e) {
			alert("Request file system failed: " + e.message);
		});
	}
	mod.readDirectory = function(directory) {
		var directoryReader = directory.createReader();
		var entries = [];
		//console.log("whatever")
		directoryReader.readEntries(function(entries) {
			var i;
			for(i = 0; i < entries.length; i++) {
				//console.log(JSON.stringify(entries[i].name));
			}
		}, function(e) {
			alert("Read entries failed: " + e.message);
		});

	}
	mod.getFileByPath = function(path, callback) {
			plus.io.resolveLocalFileSystemURL(path, function(entry) {
				//			//console.log(JSON.stringify(entry.File.fileName))
				// Read data from file
				var abPath = entry.toLocalURL();
				var img = new Image();
				img.onload=function(){
					var imgData = getBase64Image(img);
					//console.log(imgData);
					callback('data:image/png;base64,'+imgData);
				}
				img.src = abPath;
				
				//			var reader = null;
				//			entry.file(function(file) {
				//				reader = new plus.io.FileReader();
				//				//console.log("getFile:" + JSON.stringify(file));
				//				reader.onloadend = function(evt) {
				//					//console.log("Read success:"+evt.target.result);
				//					// Get data
				//					var fileStream=evt.target.result
				//					
				//					//console.log(fileStream);
				//					
				//					callback(fileStream);
				//				};
				//				reader.readAsBinaryString(file)
				//				reader.readAsDataURL(file);
			}, function(e) {
				console('获取文件流错误：' + e.message);
			});
		}
		//			},
		//			function(e) {
		//				//console.log(e.message);
		//			}
		//将图片压缩转成base64 
	function getBase64Image(img) {
		var canvas = document.createElement("canvas");
		var width = img.width;
		var height = img.height;
		//console.log('img.width:'+img.width+",img.height:"+img.height);
		// calculate the width and height, constraining the proportions 
		if(width > height) {
			if(width > 500) {
				height = Math.round(height *= 500 / width);
				width = 500;
			}
		} else {
			if(height > 500) {
				width = Math.round(width *= 500 / height);
				height = 500;
			}
		}
		canvas.width = width; /*设置新的图片的宽度*/
		canvas.height = height; /*设置新的图片的长度*/
		var ctx = canvas.getContext("2d");
		ctx.drawImage(img, 0, 0, width, height); /*绘图*/
		var dataURL = canvas.toDataURL("image/png", 0.8);
		return dataURL.replace("data:image/png;base64,", "");
	}
	return mod;
})(window.files || {})