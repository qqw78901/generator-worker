yy游戏部微信小程序开发指南
------------------

本指南只涉及游戏部小程序开发注意事项和经验，并非新手教程，假如你从未开发过微信小程序，请先学习[微信小程序简易教程](https://developers.weixin.qq.com/miniprogram/dev/)和[微信小程序api](https://developers.weixin.qq.com/miniprogram/dev/api/)。

## 技术选型

[mpvue了解一下](http://mpvue.com/)

## 注意事项

### 资源/后台相关
- 全部接口/资源用https;
- 小程序限制了后台域名数量20个，且每月只能改5次。可用proxyapi.yy.com转发请求规避，详询夏集球;
- 部分后端接口限定了来源域名，要在白名单加上servicewechat.com;
- 请求默认不带cookie，可存在localstorage，在请求headers参数里带（demo中requestWithCookie）;
- 由于部分数据是页面从微信获取传给后端，存在伪造数据的可能性。因此向后端传敏感数据都应该传`加密数据`;
- tabBar用到的图片并不在项目构建范围中，不会复制dist，需手动复制一下;

### 小程序API相关
- 没有dom类的API，所以不能操控dom;
- getUserInfo等敏感数据接口已废弃，必须由用户点击按钮触发授权;
- 小程序大部分api为异步，少数为同步或异同两版本(如`getAccountInfoSync`, `setStorageSync`, `getStorageSync`),涉及状态变化的应尽量选用同步api;

### 调试工具相关
- model在AppData模块;
- web-view(类似iframe)可以右键调出该webview的控制台;
- 加了信任域名必须删项目重加才生效;
- 开发期间要用微信打开小程序，要先在管理后台添加为开发者;
- “真机调试”为开发版（临时二维码），“上传”为体验版（长期二维码），

### 组件/UI相关
- 小程序宽度单位rpx, 1rpx = 屏宽*1/750
- 自定义组件不能和小程序自带组件同名;
- html原生标签和小程序组件可以混用;
- mpvue自定义组件不允许绑定事件(巨坑);
- canvas唯一标识符是canvas-id，非id;
- 要覆盖在canvas上，必须用cover-view，此组件不支持大多数css3;
- web-view可用query传参;
- tabBar和topBar，还有alert等，是微信app原生的，不可覆盖;

## 接口封装

由于微信小程序api都是异步返回，类jq写法，基本包含success, fail, complete等参数，返回值为对象。所以封装接口也采用一样风格（下详）。

## 后台基础接口

文档地址：http://doc.game.yy.com/pages/viewpage.action?pageId=29402224

### 互联登录

先通过`wx.login()`登录，然后判断是否有`userinfo`权限，有则`wx.getUserInfo()`,然后通过互联接口进行互联，并保存cookie于storage，后续请求都主动带上。

[互联登录接口文档](http://doc.game.yy.com/pages/viewpage.action?pageId=29402224#UDB-%E5%BE%AE%E4%BF%A1%E5%B0%8F%E7%A8%8B%E5%BA%8F%E7%99%BB%E5%BD%95-%E5%BE%AE%E4%BF%A1%E5%B0%8F%E7%A8%8B%E5%BA%8F-UDB%E7%99%BB%E5%BD%95%E4%BA%92%E8%81%94)

```js

const APIS = {
  decrypt: 'https://mclogin.yy.com/open/wxmp/decrypt',
  login: 'https://mclogin.yy.com/open/wxmp/login',
};

const APPID = 'wx3fe99b2876386ec9';

export function setCookies(cookieObj) {
  let cookies = '';

  Object.keys(cookieObj).map((key) => {
    cookies += `${key}=${cookieObj[key]};`;
    return false;
  });

  wx.setStorageSync('cookie', cookies);
}

export function loginAndGetUserInfo({ success, fail }) {
  // 微信登录
  wx.login({
    success: (resLogin) => {
      // 获取用户信息
      wx.getSetting({
        success: (settingRes) => {
          console.log(settingRes);
          if (settingRes.authSetting['scope.userInfo']) {
            console.log('已授权userInfo');
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            wx.getUserInfo({
              success: (infoRes) => {
                console.log('登录互联');
                const { iv, encryptedData } = infoRes;
                wx.request({
                  url: APIS.login,
                  data: {
                    APPID,
                    code: resLogin.code, // 小程序登录返回的code
                    encryptData: encodeURIComponent(encryptedData), // 小程序获取用户信息返回的加密数据
                    iv: encodeURIComponent(iv), // 小程序获取用户信息返回的加密初始向量
                  },
                  success(res) {
                    const cookie = res.data.data.headers;
                    setCookies(cookie); // 保存cookie
                    success && success(res);
                  },
                  fail(res) {
                    fail && fail(res);
                  },
                });
              },
            });
          } else {
            fail && fail({
              errMsg: '未授权userInfo',
            });
          }
        },
      });
    },
  });
}
```

### 解密数据

出于安全原因，部分微信api只返回[加密数据(encryptedData)](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/signature.html)，需要通过后台解密。

[解密数据接口文档](http://doc.game.yy.com/pages/viewpage.action?pageId=29402224#UDB-%E5%BE%AE%E4%BF%A1%E5%B0%8F%E7%A8%8B%E5%BA%8F%E7%99%BB%E5%BD%95-%E5%BE%AE%E4%BF%A1%E5%B0%8F%E7%A8%8B%E5%BA%8F-%E6%95%B0%E6%8D%AE%E8%A7%A3%E5%AF%86%E6%8E%A5%E5%8F%A3)

```js
const APIS = {
  decrypt: 'https://mclogin.yy.com/open/wxmp/decrypt',
  login: 'https://mclogin.yy.com/open/wxmp/login',
};

export function decrypt({
  data, // {encryptData, iv} 加密数据和向量
  dataType,
  success,
  fail,
}) {
  wx.request({
    header: {
      cookie: wx.getStorageSync('cookie'), // 需要先登录互联，保存cookie
    },
    url: APIS.decrypt,
    data,
    success(res) {
      if (dataType === 'json') {
        success && success(JSON.parse(res.data));
      } else {
        success && success(res.data);
      }
    },
    fail(res) {
      fail && fail(res);
    },
  });
}
```

