
import {
  APIS,
  APPID,
} from '@/config';
import {
  requestWithCookie,
  setCookies,
} from '@/utils';

export function joinAndFinish(option){
  requestWithCookie({
    url: APIS.joinAndFinish,
    ...option
  })
}

export function loginAndGetUserInfo({ success, fail }){
  console.log('login')
  // 微信登录
  wx.login({
    success: (resLogin) => {
      // 获取用户授权信息
      wx.getSetting({
        success: (settingRes) => {
          console.log(settingRes);
          if (settingRes.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称
            wx.getUserInfo({
              success: (infoRes) => {
                console.log('登录互联');
                const { iv, encryptedData } = infoRes;
                wx.request({
                  url: APIS.login,
                  data: {
                    appId: APPID,
                    code: resLogin.code, // 小程序登录返回的code
                    encryptData: encodeURIComponent(encryptedData), // 小程序获取用户信息返回的加密数据
                    iv: encodeURIComponent(iv), // 小程序获取用户信息返回的加密初始向量
                  },
                  success: (res)=> {
                    const cookie = res.data.data.headers;
                    setCookies('cookie', cookie);
                    // eslint-disable-next-line
                    const {udb_oar, yyuid, username} = cookie;
                    // eslint-disable-next-line
                    setCookies('important_cookie', {udb_oar, yyuid, username});
                    wx.setStorageSync('yyuid', cookie.yyuid)
                    success(res);
                  },
                  fail(res) {
                    fail(res);
                  },
                });
              },
              fail(){
                console.log('getUserInfo fail');
              },
            });
          } else {
            fail({
              errMsg: '未授权userInfo',
            });
          }
        },
      });
    },
    fail: (res)=>{
      console.log('login fail')
      wx.showToast({
        title: res.errMsg,
        icon: 'none',
        duration: 2000
      })
    }
  });
}

export function onShareAppMessage(){
  return {
    title: '自定义分享标题',
    withShareTicket: true,
    path: `/pages/home/main`
  }
}

export default{
  loginAndGetUserInfo,
  onShareAppMessage,
}