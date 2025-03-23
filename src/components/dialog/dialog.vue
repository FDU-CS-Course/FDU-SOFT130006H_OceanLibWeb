<style scoped>
.button {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}
.dialog-alert {
  margin-bottom: 0px;
  padding: 16px;
  border-left: 4px solid;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.dialog-title {
  font-size: 1.25rem;
  margin-top: 8px;
  margin-bottom: 16px;
  margin-left: 8px;
  display: flex;
  align-items: center;
}
.dialog-icon {
  margin-right: 12px;
}
.dialog-content {
  margin-bottom: 24px;
  margin-left: 8px;
}
</style>
<template>
  <van-dialog
    v-model:show="showDialog"
    :show-confirm-button="false"
    :show-cancel-button="false"
    :close-on-click-overlay="false"
    width="290px"
  >
    <div class="dialog-alert" :style="{ borderLeftColor: color }">
      <div class="dialog-title">
        <van-icon :name="icon" :color="color" class="dialog-icon" />
        {{ title }}
      </div>
      <div class="dialog-content" v-html="content"></div>
      <div class="button">
        <van-button
          class="mr-1"
          ref="cancel"
          v-show="isConfirmDialog"
          plain
          size="small"
        >
          {{ cancelText }}
        </van-button>
        <van-button
          ref="confirm"
          :color="color"
          size="small"
          type="primary"
        >
          {{ confirmText }}
        </van-button>
      </div>
    </div>
  </van-dialog>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      showDialog: false,
      title: null,
      content: null,
      confirmText: null,
      cancelText: null,
      isConfirmDialog: false,
      icon: null,
      color: null,
    };
  },
  methods: {
    newDialog(type, title, content, confirmText, cancelText) {
      switch (type) {
        case "error":
          this.icon = "warning-o";
          this.color = "#ee0a24";
          this.isConfirmDialog = false;
          break;
        case "login":
          this.icon = "user-circle-o";
          this.color = "#07c160";
          this.isConfirmDialog = true;
          break;
        case "userInfoAsk":
          this.icon = "contact";
          this.color = "#1989fa";
          this.isConfirmDialog = true;
          break;
      }
      this.showDialog = true;
      this.title = title;
      this.content = content;
      this.confirmText = confirmText != null ? confirmText : "确认";
      this.cancelText = cancelText != null ? cancelText : "取消";
      return new Promise((resolve, reject) => {
        this.$nextTick(() => {
          this.$refs["confirm"].$el.addEventListener("click", () => {
            this.showDialog = false;
            resolve();
          });
          this.$refs["cancel"].$el.addEventListener("click", () => {
            this.showDialog = false;
            reject();
          });
        });
      });
    },
  },
};
</script>