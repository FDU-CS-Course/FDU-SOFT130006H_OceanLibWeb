<style scoped lang="less">
@import "../vant-variables.less";
.adBox {
  border: 1px solid @gray-2;
  border-radius: 10px;
  margin: 15px;
  background-color: @gray-1;
  &__title {
    padding: 10px 15px;
    font-size: 14px;
  }
  &__content {
    padding: 5px 15px;
    font-size: 12px;
    color: @gray-4;
  }
}
</style>

<template>
  <div>
    <div class="adBox">
      <div class="adBox__title">这是测试广告标题 -A201 -计费测试用例</div>
      <img :src="require('../images/ad.png')" width="100%" />
      <div class="adBox__content">原神 的广告</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "adBox",
  props: {},
  mounted() {},
  data() {
    return {};
  },
  methods: {},
};
</script>

<style scoped>
</style>