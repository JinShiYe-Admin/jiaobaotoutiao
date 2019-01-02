var nativeWebview, imm, InputMethodManager;
var initNativeObjects = function() {
    if (mui.os.android) {
        var main = plus.android.runtimeMainActivity();
        var Context = plus.android.importClass("android.content.Context");
        InputMethodManager = plus.android.importClass("android.view.inputmethod.InputMethodManager");
        imm = main.getSystemService(Context.INPUT_METHOD_SERVICE);
    } else {
        nativeWebview = plus.webview.currentWebview().nativeInstanceObject();
    }
};
var showSoftInput = function(selector) {
    if (mui.os.android) {
        imm.toggleSoftInput(2000, InputMethodManager.SHOW_FORCED);
    } else {
        nativeWebview.plusCallMethod({
            "setKeyboardDisplayRequiresUserAction": false
        });
    }
    setTimeout(function() {
       //此处可写具体逻辑设置获取焦点的input
       var inputElem = document.querySelector(selector);
              inputElem.focus(); 
    }, 0);
};
