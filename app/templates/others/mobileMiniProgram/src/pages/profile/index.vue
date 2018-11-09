

<template>
  <div id="page-profile">
    <div class="profile">
      <img class="bg" src="../../assets/img/bg-profile.png">
      <img class="head-img" :src="headImg" alt="">
      <span class="name">{{username}}</span>
    </div>
    <yy-cell
      v-for="cell in cellList"
      :key="cell.title"
      :title="cell.title"
      :icon="cell.icon"
      :url="cell.url"
      :openType="cell.openType"
      :type="cell.type"
    ></yy-cell>
  </div>
</template>

<script>
import { mapState } from "vuex";
import yyCell from "@/components/yy-cell";

export default {
  components: {
    "yy-cell": yyCell
  },
  computed: {
    ...mapState({
      headImg: state => state.headImg,
      username: state => state.username
    }),
    cellList() {
      return [
        {
          title: "活动规则",
          icon: "rule",
          url: "/pages/rule/main",
          type: "navigator",
          openType: "navigate"
        },
        {
          title: "兑换记录",
          icon: "record",
          url: "/pages/record/main",
          type: "navigator",
          openType: "navigate"
        },
        {
          title: "联系客服",
          icon: "service",
          url: "/pages/service/main?cookie=" + encodeURIComponent(this.cookie),
          type: "navigator",
          openType: "navigate"
        }
      ];
    }
  },
  data: {
    cookie: ""
  },
  onShow() {
    this.cookie = wx.getStorageSync("important_cookie");
  }
};
</script>

<style lang="scss" scoped>
@import "../../css/color.scss";
@import "../../css/base.scss";

#page-profile {
  text-align: center;
  font-size: 36px;
  color: $color-green;
  display: block;
  background: $color-bg;
  height: 100vh;
}

.profile {
  position: relative;
  padding-top: 130px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #fff;
  z-index: 1;
  margin-bottom: 20px;

  .bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 301px;
    z-index: -1;
  }
  .head-img {
    box-sizing: border-box;
    width: 240px;
    height: 240px;
    border-radius: 240px;
    border: 10px solid #fff;
    background: #b8b8b8;
  }
  .name {
    margin-top: 20px;
    font-size: 50px;
    color: #666;
    font-weight: 600;
  }

}
</style>