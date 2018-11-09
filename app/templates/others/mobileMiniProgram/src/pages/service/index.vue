
<template>
  <div id="page-service">
    <web-view 
      v-if="cookie" 
      :src="'https://sz.duowan.com/static/kf-app-talk/index.html?product=STEP_PRO&typeId=4&cookie='+cookie"
    ></web-view>
  </div>
</template>

<script>

export default {
  data: {
    cookie: ''
  },
  onShow(){
    const { query } = this.$root.$mp;
    this.cookie = query.cookie;
  }
};
</script>

<style lang="scss" scoped>

</style>
