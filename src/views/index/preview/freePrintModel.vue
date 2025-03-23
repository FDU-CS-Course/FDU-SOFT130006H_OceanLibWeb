<style scoped lang="less">
@import '~@/vant-variables.less';
.free-print {
  &__img {
    background: url('../../../images/main-picture/motaPrint.jpg') center center no-repeat;
    height: 200px;
    background-size: auto 100%;
  }
  &__title {
    color: #333;
    font-size: 16px;
    line-height: 1;
    padding-top: 20px;
    text-align: center;
  }
  &__content {
    text-align: center;
    margin: 10px 0;
    color: #666;
    font-size: 14px;
  }
}
</style>
<template>
  <van-dialog v-model:show="freePrintModel" :close-on-click-overlay="false" width="290px">
    <div class="free-print__img"></div>
    <div class="free-print__title">
      使用点墨自助打印设备打印
    </div>
    <div class="free-print__content">无套路，文档打印全部免费</div>
    <div style="display: flex; justify-content: flex-end; padding: 10px;">
      <van-button plain @click="freePrintModel = false" style="margin-right: 10px;">
        稍后再说
      </van-button>
      <van-button type="primary" @click="$router.push('/freePrint')">
        立刻前往
      </van-button>
    </div>
  </van-dialog>
</template>

<script>
export default {
  name: 'app',
  data() {
    return {
      freePrintModel: false,
    };
  },
  mounted() {},
  methods: {
    open() {
      this.freePrintModel = true;
    },
  },
};
</script>

<style>
</style>