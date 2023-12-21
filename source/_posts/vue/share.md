---
title: uni-app 分享页制作
permalink: /uni-app/vue/share.html
date: 2023-12-21 16:17:38
description: 通过canvas 先制作图。可以做一个canvas 背景在生成一个二维码canvas 图，在将两个canvas 合成一个图片，然后将图片分享出来。
tag: [前端, uni-app, canvas, vue]
comments: true
categories: 
 - uni-app
 - vue
---

## uni-app 分享页制作

通过canvas 先制作图。可以做一个canvas 背景在生成一个二维码canvas 图，在将两个canvas 合成一个图片，然后将图片分享出来。

### html 模板

```vue
    <template>
        <view class="content">
            <u-icon name='arrow-left' @click="goBack" style="position: absolute; z-index: 999; top: 80rpx; left: 40rpx; font-size: 40rpx; color: #454545;"></u-icon>
            <view style="width: 100%; height: calc(100vh - 44px);">
                <view class="btn-opate" style="">
                    <button type="primary" size="mini" @click="saveImg">保存分享</button>
                    <button type="default" size="mini" @click="copyCode">复制邀请码</button>
                </view>
                
                <image class="image" style="width: 100%; height: calc(100vh - 44px);" :src="ImagePath" mode="widthFix"></image>
            </view>
            <view v-if="show">
                <canvas canvas-id="myCanvas" style="width: 100vw; height: 100vh;"></canvas>
                <canvas canvas-id="qrcode"></canvas>
            </view>
            
        </view>
    </template>
```

### 二维码制作

```js
import UQRCode from 'uqrcodejs';

qrCode(){
    uni.showLoading({
        title: '分享页制作中...'
    })
    var qr = new UQRCode();
    // 设置二维码内容
    qr.data = `https://app.xianyuangu.com/#/pages/login/h5login?registerCode=${this.invitationCode}`;
    // 设置二维码大小，必须与canvas设置的宽高一致
    qr.size = 120;
    // 调用制作二维码方法
    qr.make();
    const context = uni.createCanvasContext('qrcode', this);
    qr.canvasContext = context;
    // 调用绘制方法将二维码图案绘制到canvas上
    qr.drawCanvas();
    setTimeout(() => {
        // 将canvas内容保存为图片
        uni.canvasToTempFilePath({
            canvasId: 'qrcode',
            success: (res) => {
            this.qrcode = res.tempFilePath;
            this.drawImageToCanvas();
            },
            fail: (err) => {
            console.error(err);
            }
        }, this);
    }, 1000)
}
```

### 绘制图片

```js
drawImageToCanvas() {
    // 获取 canvas 上下文
    const systemInfo = uni.getSystemInfoSync();
    const canvasWidth = systemInfo.windowWidth;
    const canvasHeight = systemInfo.windowHeight;
    
    const context = uni.createCanvasContext('myCanvas', this);

    // Step 6: 使用 drawImage 方法绘制图片
    context.drawImage('/static/image/share.png', 0, 0, canvasWidth, canvasHeight);
    
    context.setFillStyle('#D43030'); // 黑色文本
    context.setFontSize(32); // 文字大小
    context.fillText(this.invitationCode, canvasWidth / 2 - 50, canvasHeight / 2 * 0.84);
    
    context.drawImage(
    this.qrcode,
    canvasWidth / 3 - 20,
    canvasHeight / 2,
    canvasWidth / 1 ,
    canvasWidth / 2
    );
    
    context.save();
    
    // Step 7: 调用 draw 方法渲染 canvas
    context.draw(true, setTimeout(() => {
        // 将canvas内容保存为图片
        uni.canvasToTempFilePath({
            canvasId: 'myCanvas',
            success: (res) => {
            this.show = false;
            this.ImagePath = res.tempFilePath;
            uni.hideLoading();
            // 在这里可以将得到的图片路径进行保存或分享等操作
            },
            fail: (err) => {
                uni.hideLoading();
                console.error(err);
            }
        }, this);
        
    }, 1000));
}
```

### 保存图片

```js
env: uni.getSystemInfoSync().uniPlatform;

saveImg(){
    // app 保存
    if(this.env == 'app') {
        uni.saveImageToPhotosAlbum({
            filePath: this.ImagePath,
            success: function() {
                uni.showToast({
                    title: '保存成功',
                })
            }
        });
    } else {
        /** 生成一个a元素,并创建一个单击事件 */
        let a = document.createElement("a");
        a.download = name || "photo"; // 设置图片名称
        a.href = this.ImagePath; // 将生成的URL设置为a.href属性
        a.setAttribute("id", "myLink");
        document.body.appendChild(a);
        console.log("链接", a);
        this.exportCodeConfirm();
    }
},
exportCodeConfirm() {
    setTimeout(() => {
    let event = new MouseEvent("click");
    /** 触发a的单击事件 */
    document.getElementById("myLink").dispatchEvent(event);
    }, 0);
}
```
