---
title: uni-app APP 更新版本提示
permalink: /uni-app/vue/update.html
date: 2023-12-21 16:28:05
description: 在`App.vue`中，我们需要在`onLaunch`生命周期函数中调用`AppUpdate`方法，来检查是否有新版本的APP。
tag: [前端, uni-app, vue, AppUpdate]
comments: true
categories: 
 - uni-app
 - vue
 - AppUpdate
---

### AppUpdate 方法

```js
import baseUrl from '@/basecall/utils.js'

export function AppUpdate() {
  const appleId = 2021004105638058;
  let _this = this;
  let platform = uni.getSystemInfoSync().platform;
  //1. 获取当前版本号
  let curversion = 100;
  plus.runtime.getProperty(plus.runtime.appid, function (widgetInfo) {
    curversion = widgetInfo.version;
    console.log("当前版本", curversion);
  });

  /* 
    2， 用当前版本号提交给服务端，判断是否需要更新，接口返回信息如下
        versionId		integer(int64)	
        versionId	版本号	string	
        intro	版本描述	string	
        forced	是否强制更新	boolean	
        news	是否是最新版本	boolean	
        url	apk地址	string	
        createTime	创建时间
	 */
  uni.request({
    url: baseUrl.baseUrl + "/getVersion",
    method: "GET",
    success: (res) => {
      const { versionId, forced, url, createTime } = res.data.data;
	  uni.setStorageSync('url', url);
      let currTimeStamp = new Date(createTime).getTime();
      /* 判断是否是最新版 */
      if (versionId !== curversion) {
        //forced true 强制更新 false 自然更新
        if (forced == 'true') {
          uni.showModal({
            title: "紧急升级通知",
            content:
              "亲爱的用户，为了提供更好的使用体验与功能改进，我们进行了系统升级。请立即完成强制升级，否则将无法正常使用APP。感谢您的配合与支持！",
            confirmText: "立即更新",
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                if (platform == "ios") {
                  plus.runtime.launchApplication(
                    {
                      action: `itms-apps://itunes.apple.com/cn/app/id${appleId}?mt=8`,
                    },
                    function (e) {
                      console.log(
                        "Open system default browser failed: " + e.message
                      );
                    }
                  );
                } else {
                  uni.showToast({
                    icon: "none",
                    mask: true,
                    title: "有新的版本发布，程序已启动自动更新。",
                    duration: 5000,
                  });
                  //设置 最新版本apk的下载链接 这是固定的
                  let downloadApkUrl = url;
                  console.log(downloadApkUrl);
                  plus.runtime.openURL(downloadApkUrl);
                }
              }
            },
          });
        } else {
          uni.getStorage({
            key: "tip_version_update_time",
            success: function (res) {
              var lastTimeStamp = res.data; // 本地时间戳
              var tipTimeLength = 0; // 时间间隔
              let cha = lastTimeStamp + tipTimeLength - currTimeStamp;
              if (lastTimeStamp + tipTimeLength > currTimeStamp) {
                console.log("当后台时间戳大于本地时间戳才会进入");
              } else {
                console.log("立即更新");
                //重新设置时间戳
                uni.setStorage({
                  key: "tip_version_update_time",
                  data: currTimeStamp,
                  success: function () {
                    console.log("setStorage-success");
                  },
                });

                uni.showModal({
                  title: "版本更新",
                  content:
                    "尊敬的用户，我们为您准备了最新的版本更新，内含诸多新功能与用户体验优化。点击立即升级，享受更多精彩和便利。",
                  confirmText: "立即更新",
                  cancelText: "取消",
                  success: function (res) {
                    if (res.confirm) {
                      if (platform == "ios") {
                        plus.runtime.launchApplication(
                          {
                            action: `itms-apps://itunes.apple.com/cn/app/id${appleId}?mt=8`,
                          },
                          function (e) {
                            console.log(
                              "Open system default browser failed: " + e.message
                            );
                          }
                        );
                      } else {
                        uni.showToast({
                          icon: "none",
                          mask: true,
                          title: "有新的版本发布，程序已启动自动更新。",
                          duration: 5000,
                        });
                        //设置 最新版本apk的下载链接 这是固定的 每次把包放在这个链接里里面即可 由后端制作
                        let downloadApkUrl = url;
                        plus.runtime.openURL(downloadApkUrl);
                      }
                    } else if (res.cancel) {
                      console.log("下次一定");
                    }
                  },
                });
              }
            },
            fail: function (res) {
              uni.setStorage({
                key: "tip_version_update_time",
                data: currTimeStamp,
                success: function () {
                  console.log("setStorage-success");
                },
              });
            },
          });

          console.log(createTime, "createTimecreateTime");
        }
      }
    },
    fail: () => {},
    complete: () => {},
  });
}
```

### 在APP.vue中注册

在`App.vue`中，我们需要在`onLaunch`生命周期函数中调用`AppUpdate`方法，来检查是否有新版本的APP。

```js
import { AppUpdate } from '@/common/AppUpdate.js';
onLaunch() {    
    AppUpdate()
}
```
