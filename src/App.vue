<template>
  <v-app>
    <v-main>
      <router-view :key="key" />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'app',
  computed: {
    key() {
      return this.$route.path + Math.random();
    },
  },
};
</script>

<style lang="less">
@import './vant-variables.less';

.page {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.full {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.notice-nomore__text {
  text-align: center;
  width: 100%;
  font-size: 12px;
  color: @gray-4 !important;
  margin: 15px 0px 5px 0px;
}
</style>

<style lang="less">
@import './assets/font/font.less';
body {
  font-family: 'PingFang SC Regular', Arial, 'Helvetica Neue', Helvetica, sans-serif !important;
}
</style>

<style lang="less">
@import '~vant/lib/index.css';
@import './vant-variables.less';
.van-tabs__line {
  background-color: rgb(var(--v-theme-primary)) !important;
}
</style>
