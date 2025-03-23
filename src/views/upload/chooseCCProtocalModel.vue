<style scoped lang="less">
@import '~@/vant-variables.less';
.ccprotocal {
  max-height: 70%;
  display: flex;
  flex-direction: column;
  &__box {
    flex: 1;
    overflow-y: scroll;
  }
  &__title {
    margin: 15px;
    text-align: center;
    font-size: 16px;
  }
  &__checkbox {
    margin: 0px 20px;
    display: flex;
    flex-wrap: wrap;
    &__label {
      font-size: 14px;
      min-width: 110px;
    }
  }
  &--primary {
    font-size: 14px;
    color: rgb(var(--v-theme-primary));
    font-weight: bold;
  }
}
</style>
<template>
  <van-popup class="ccprotocal" v-model:show="showCCprotocalModel" round position="bottom" closeable>
    <p class="ccprotocal__title">请选择版权协议</p>
    <van-card class="ccprotocal__box">
      <div class="ccprotocal__checkbox">
        <van-checkbox v-model="copyrightNotice" name="BY" :disabled="ccDisabled">
          <span class="ccprotocal__checkbox__label">姓名标示（BY）</span>
        </van-checkbox>
        <van-checkbox v-model="copyrightNotice" name="NC" :disabled="ccDisabled">
          <span class="ccprotocal__checkbox__label">非商业性（NC）</span>
        </van-checkbox>
        <van-checkbox v-model="copyrightNotice" name="ND" :disabled="ccDisabled">
          <span class="ccprotocal__checkbox__label">禁止改作（ND）</span>
        </van-checkbox>
        <van-checkbox v-model="copyrightNotice" name="SA" :disabled="ccDisabled">
          <span class="ccprotocal__checkbox__label">相同方式分享（SA）</span>
        </van-checkbox>
        <van-checkbox v-model="copyrightNotice" name="COPYRIGHT">
          <span class="ccprotocal__checkbox__label">作者保留全部著作权</span>
        </van-checkbox>
      </div>

      <van-cell @click="showMore = !showMore">
        <div>什么是CC版权协议</div>
        <template #right-icon>
          <van-icon :name="showMore ? 'arrow-up' : 'arrow-down'" />
        </template>
      </van-cell>

      <van-collapse-transition>
        <div v-show="showMore">
          <van-divider />
          <v-ccProtocalStatement></v-ccProtocalStatement>
        </div>
      </van-collapse-transition>
    </van-card>
    <van-button type="primary" block @click="ok()">
      确定
    </van-button>
  </van-popup>
</template>

<script>
import ccProtocalStatement from '@/views/statement/ccProtocalStatement.vue';

export default {
  components: {
    'v-ccProtocalStatement': ccProtocalStatement,
  },
  props: {
    value: String,
  },
  data() {
    return {
      showMore: false,
      showCCprotocalModel: false,
      copyrightNotice: [],
    };
  },
  computed: {
    ccDisabled() {
      if (this.copyrightNotice.indexOf('COPYRIGHT') != -1) {
        return true;
      } else {
        return false;
      }
    },
  },
  watch: {
    value() {
      this.copyrightNotice = this.value.split('-');
    },
    ccDisabled() {
      if (this.ccDisabled) {
        this.copyrightNotice = ['COPYRIGHT'];
      }
    },
  },
  methods: {
    open() {
      this.showCCprotocalModel = true;
    },
    ok() {
      this.showCCprotocalModel = false;
      this.$emit('onSelect', this.copyrightNotice.join('-'));
    },
  },
};
</script>

<style>
</style>