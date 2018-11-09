<style lang="scss" scoped>
@import '../css/color.scss';

.yy-cell{
  padding: 0 60px;
  height: 186px;
  background: #fff;
  text-align: left;
  font-size: 42px;
  color: #666;
  &:last-child{
    .content{
      border-bottom: none;
    }
  }
}

.content{
  position: relative;
  height: 100%;
  box-sizing: border-box;
  line-height: 186px;
  border-bottom: #eee 1px solid;
}

.iconfont{
  margin-right: 50px;
  color: $color-green;
  font-size: 66px;
}

.icon-arrow{
  position: absolute;
  margin-right: 0;
  color: #ddd;
  right: 0;
  font-size: 40px;
}

span{
  vertical-align: top;
}

button{
  position: relative;
  text-align: left;
  font-size: 42px;
  color: #666;
  background: transparent;
  padding: 0;
  &::after{
    border: none;
  }
}

</style>

<template>
  <div class="yy-cell">
    
    <button v-if="type==='button'" class="content" :open-type="openType">
      <span class="iconfont" :class="'icon-'+icon"></span>
      <span>{{title}}</span>
      <span v-if="url" class="iconfont icon-arrow"></span>
    </button>
    <navigator v-else class="content" :url="url" :open-type="openType">
      <span class="iconfont" :class="'icon-'+icon"></span>
      <span>{{title}}</span>
      <span v-if="url" class="iconfont icon-arrow"></span>
    </navigator>
  </div>
</template>

<script>
import "@/assets/icon/iconfont.css";
import "@/assets/icon/iconfont.svg";

export default {
  props:{
    title: '',
    icon: '',
    url: '',
    openType: '',
    type: ''
  }
}
</script>
