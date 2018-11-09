<template>
  <scroll-view id="page-home" scroll-y=true enable-back-to-top=true >
    <img class="bg" src="../../assets/img/bg-home.png" alt="不支持background">
    <div id="main-wrap">
        <canvas id="ring" canvas-id="ring">
          <cover-view class="cover-ring" >
            <cover-view class="top">覆盖canvas</cover-view>
            <cover-view class="middle">必须cover-view</cover-view>
            <cover-view class="bottom">或cover-image</cover-view>
          </cover-view>
        </canvas>
        <br>
        <button class="btn btn-green btn-login" @click="login">互联登录</button>
        <br>
        <button class="btn btn-green btn-userinfo" open-type="getUserInfo" @getuserinfo="getUserInfo">获取userinfo</button>
        <br>
        <button class="btn btn-green btn-getStep" @click="getStep">获取步数</button>
        <br>
        <button class="btn btn-green" open-type="openSetting" @opensetting="openSetting">打开权限设置</button>
    </div>
  </scroll-view>
</template>

<script>
import { requestWithCookie } from "@/utils";
import { loginAndGetUserInfo } from "@/common";
import { APIS } from "@/config";
import store from "@/store";

export default {
  data: {
    screenRadio: 0
  },
  methods: {
    login() {
      wx.showLoading();
      loginAndGetUserInfo({
        success: data => {
          wx.hideLoading();
          wx.showToast({
            title: "互联登录成功"
          });
          console.log("login Success");
          console.log(data);

          const headimg = data.data.data.headers.partnerImage;
          const username = decodeURIComponent(
            data.data.data.headers.partnerNickname
          );
          store.commit("HEADIMG", headimg);
          store.commit("USERNAME", username);
        },
        fail() {
          wx.hideLoading();
          wx.showToast({
            title: "请先授权userInfo",
            icon: "none"
          });
        }
      });
    },
    openSetting(res) {
      console.log("这是权限设置后的回调");
      console.log(res);
    },
    getUserInfo(res) {
      console.log("这是getUserinfo后的回调:");
      console.log(res);
    },
    getStep() {
      console.log("getStep");

      wx.getWeRunData({
        success(weRunData) {
          // 此为加密数据，要经后台解密
          console.log(weRunData);
          requestWithCookie({
            url: APIS.decrypt,
            data: {
              encryptData: weRunData.encryptedData,
              iv: weRunData.iv
            },
            success(res) {
              if (res.data.status === 200) {
                wx.showToast({
                  title: "获取步数&解密成功，数据请看控制台"
                });
              } else {
                wx.showToast({
                  title: "are you 没登录？？",
                  icon: "none"
                });
              }
              console.log(res);
            }
          });
        }
      });
    },
    drawRing() {
      const greenColor = "#12d47c";
      const greenGradientColor = "#19eaa8";
      const lightGreenColor = "#b5f4da";
      const radio = this.screenRadio;
      const outerDiameter = 386;
      const outerRadius = outerDiameter / 2;
      const innerRadius = outerRadius - 20;

      const stepRing = wx.createCanvasContext("ring");
      stepRing.setLineWidth(10 / radio);
      stepRing.lineCap = "round";

      // 底圆
      stepRing.arc(
        outerRadius / radio,
        outerRadius / radio,
        innerRadius / radio,
        0,
        2 * Math.PI
      );
      const grd = stepRing.createLinearGradient(0, 0, 100, 100);
      grd.addColorStop(0, greenColor);
      grd.addColorStop(1, greenGradientColor);
      stepRing.setFillStyle(grd);
      stepRing.fill();

      // 底环
      stepRing.beginPath();
      stepRing.arc(
        outerRadius / radio,
        outerRadius / radio,
        (outerRadius - 5) / radio,
        0,
        2 * Math.PI
      );
      stepRing.setStrokeStyle(lightGreenColor);
      stepRing.stroke();

      stepRing.draw();
    }
  },
  onPullDownRefresh() {
    wx.showLoading();
    setTimeout(() => {
      wx.stopPullDownRefresh();
      wx.hideLoading();
    }, 1000);
  },
  beforeMount() {
    wx.getSystemInfo({
      complete: win => {
        this.screenRadio = 1080 / win.screenWidth;
      }
    });
  },
  mounted() {
    this.drawRing();
  }
};
</script>

<style lang="scss" scoped>
@import "../../css/color.scss";
@import "../../css/base.scss";

#page-home {
  text-align: center;
  font-size: 36px;
  color: $color-green;
  display: block;
}

.bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 543px;
  z-index: -1;
}

#main-wrap {
  display: inline-block;
  background: #fff;
  margin: 30px 0;
  box-shadow: 0px 0px 40px rgba(0, 0, 0, 0.2);
  border-radius: 16px;
  width: 960px;
  padding: 60px;
  box-sizing: border-box;
}

#ring {
  display: inline-block;
  width: 386px;
  height: 386px;
}

.iconfont {
  font-size: 40px;
  margin-right: 10px;
}

.content {
  display: flex;
  justify-content: space-between;
}

.cover-ring {
  display: inline-block;
  z-index: 2;
  // background: linear-gradient(120deg, #12d47b, #12d47b 40%, #19eaa8);
  height: 346px;
  width: 346px;
  border-radius: 346px;
  margin: 20px;
  color: #fff;
  vertical-align: middle;
  left: 0;
  box-sizing: border-box;
  text-align: center;
  .top {
    margin-top: 60px;
    font-size: 36px;
    height: 60px;
  }
  .middle {
    font-size: 50px;
    height: 120px;
    font-weight: 600;
  }
  .bottom {
    display: inline-block;
    padding-top: 20px;
    font-size: 32px;
    width: 250px;
    color: rgba(255, 255, 255, 0.7);
    border-top: #4ee9ab 3px solid;
  }
}

.btn {
  margin: 30px 0;
}
</style>