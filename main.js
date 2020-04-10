var phone = "10086";
var pwd = "123456";
var width = device.width;
var height = device.height;

function swipeScreen() {
    let x = width / 2;
    let y1 = height - (height / 4);
    let y2 = height / 8;
    let time = (y1 - y2) / 2;
    swipe(x, y1, x, y2, time);
}

if (!device.isScreenOn()) {
    device.wakeUp();
    sleep(1000);
    swipeScreen();
    sleep(500);
}

function onNotice() {
    let notice = 1;
    let url = "server酱的http地址";
    device.keepScreenDim();
    events.observeNotification(); /* 通知监听，依赖于通知服务 */
    events.onNotification(function (notification) {
        if (notification.getText().match("考勤打卡") == "考勤打卡") {
            let content = "通知标题：" + notification.getTitle() + "；通知内容：" + notification.getText() + "；";
            http.post(url, { "text": notification.getText(), "desp": content });
            while (true) {
                if (currentActivity() != "com.android.systemui.recents.RecentsActivity") {
                    recents();
                }
                else {
                    break;
                }
                sleep(500);
            }
            click("全部清除");
            sleep(1000);
            if (notice) {
                notifications();
                while (!click("全部清除"));
            }
            device.cancelKeepingAwake();
            log("任务成功，结束脚本！");
            engines.stopAllAndToast();
            exit();
        }
    });
}
engines.execScript("onNotice", "onNotice();\n" + onNotice.toString());

while (true) {
    if (currentPackage() != "org.mokee.lawnchair") {
        home();
    } else {
        break;
    }
    sleep(500);
}

while (true) {
    if (currentActivity() != "com.android.systemui.recents.RecentsActivity") {
        recents();
    } else {
        break;
    }
    sleep(500);
}
click("全部清除");
sleep(1000);


while (true) {
    if (currentActivity() != "ch.deletescape.lawnchair.Launcher") {
        home();
    } else {
        break;
    }
    sleep(500);
}

launchPackage("com.alibaba.android.rimet");
waitForPackage("com.alibaba.android.rimet");

while (true) {
    let Activity = currentActivity();
    // toastLog("当前界面：" + Activity);
    switch (Activity) {
        case "com.alibaba.android.rimet.biz.SlideActivity":
            toastLog("立即开始界面");
            click("立即开始");
            break;
        case "com.alibaba.android.user.login.SignUpWithPwdActivity":
            toastLog("登录界面");
            login();
            break;
        case "android.widget.FrameLayout":
            toastLog("主界面或开屏界面");
            break;
        default:
            toastLog("未知页面！");
    }
    sleep(5000);
}

/**
 * 登录操作
 */
function login() {
    id("et_phone_input").findOne(2000).setText(phone);
    id("et_pwd_login").findOne(2000).setText(pwd);
    sleep(500);
    id("btn_next").click();
}

/**
 * 守护进程，如果超过5分钟还没有完成打卡，尝试结束钉钉，重新打开。如果依然无法完成打卡，尝试执行手动打卡
 */
