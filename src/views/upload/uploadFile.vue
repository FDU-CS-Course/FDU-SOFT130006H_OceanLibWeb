<style scoped lang="less">
@import '~@/vant-variables.less';
.upload {
  display: flex;
  flex-direction: column;
  background-color: @gray-1;
  height: 100%;
  overflow-x: hidden;
  &__box {
    display: flex;
    flex-direction: column;
    padding: 20px;
  }
  &__title {
    font-size: 20px;
    margin-bottom: 10px;
  }
  &__card {
    &__title {
      &--small {
        font-size: 16px;
        margin: 10px;
        margin-bottom: 0px;
      }
    }
    &__subtitle {
      &--small {
        margin: 10px;
        margin-top: 0px;
        font-size: 14px;
      }
    }
    &__icon {
      &--normal {
        text-align: right;
        padding: 5px;
      }
      &--main {
        text-align: right;
        padding: 10px;
      }
    }
  }
  &__note {
    display: flex;
    flex-direction: column;
  }
  &__typebox {
    display: flex;
    align-items: flex-end;
    justify-content: right;
    &__icon {
      width: 28px;
    }
    &__divider {
      margin: 0 5px;
    }
  }
  &__notice {
    height: 70%;
    display: flex;
    flex-direction: column;
    &__statement {
      overflow-y: scroll;
      flex: 1;
    }
  }
}
</style>
<template style="overflow-x:hidden">
  <div class="upload">
    <van-nav-bar id="toolbar" title="文件上传" left-text="返回" left-arrow @click-left="back">
    </van-nav-bar>
    <div class="upload__box">
      <!-- <p class="upload__title">共建文档 分享即获取</p>
      <p style="font-size:14px">文库坚决打击盗版、非法、侵权内容传播，上传文档请阅读<a>发布须知</a>。</p> -->
      <!-- <van-alert type="warning">
        文库坚决打击盗版、非法、侵权内容传播，上传文档请阅读<a>发布须知</a>。
      </van-alert> -->

      <div style="display: flex;flex-direction: row;margin:10px 0px">
        <van-cell-group inset style="flex:1;background-color:#12b7f5;color:white">
          <div class="upload__card__title--small">QQ上传助手</div>
          <div class="upload__card__subtitle--small">上传QQ群聊中的文件</div>
          <div class="upload__card__icon--normal">
            <van-icon name="chat" color="white" size="30" />
          </div>
        </van-cell-group>
        <div style="width:10px"></div>
        <van-cell-group inset style="flex:1;background-color:#2aae67;color:white">
          <div class="upload__card__title--small">微信上传助手</div>
          <div class="upload__card__subtitle--small">上传微信聊天中的文件</div>
          <div class="upload__card__icon--normal">
            <van-icon name="wechat" color="white" size="30" />
          </div>
        </van-cell-group>
      </div>

      <van-cell-group inset @click="upload('doc')" style="color:white">
        <div style="background-color:#1976d2">
          <van-cell title="共建文档 分享即获取" />
          <van-cell title="分享你的考前复习秘籍，必过指南，帮助学弟学妹们更好应考" />
          <div class="upload__card__icon--main">
            <van-icon name="upgrade" color="white" size="36" />
          </div>
        </div>
        <van-cell>
          <div class="upload__typebox">
            <span>支持格式：</span><img :src="require('../../images/type-icon/doc.svg')" width="28" />
            <span class="upload__typebox__divider"> | </span>
            <img :src="require('../../images/type-icon/xls.svg')" class="upload__typebox__icon" />
            <span class="upload__typebox__divider"> | </span>
            <img :src="require('../../images/type-icon/ppt.svg')" class="upload__typebox__icon" />
            <span class="upload__typebox__divider"> | </span>
            <img :src="require('../../images/type-icon/pdf.svg')" class="upload__typebox__icon" />
          </div>
          <input type="file" hidden ref="docFileUploader" name="docFileUploader" @change="onFileChange">
        </van-cell>
      </van-cell-group>

      <van-divider>或</van-divider>
      <van-cell-group inset>
        <van-cell title="拍摄并上传您的纸质笔记" />
        <van-cell title="晒出你的学霸笔记，和更多优秀的同学共同成长" />
        <van-divider />
        <van-cell class="upload__note">
          <div class="upload__typebox">
            支持格式：<img :src="require('../../images/type-icon/jpg.svg')" class="upload__typebox__icon" />
            <span class="upload__typebox__divider"> | </span>
            <img :src="require('../../images/type-icon/png.svg')" class="upload__typebox__icon" />
          </div>
          <van-uploader v-model="picFileList" multiple accept=".png,.jpg" name="uploadFile" />
          <van-button type="primary" @click="upload('pic')" size="small">
            提交笔记
          </van-button>
        </van-cell>
      </van-cell-group>

      <van-popup class="upload__notice" v-model:show="showNotice" closeable position="bottom" round>
        <v-uploadFileStatement class="upload__notice__statement"></v-uploadFileStatement>
        <van-button type="primary" @click="doUpload()" block>
          同意上述协议并继续
        </van-button>
      </van-popup>

      <van-dialog v-model="uploading" title="上传中" :show-confirm-button="false">
        <van-cell>
          文档已上传{{uploadProgress}}%...
          <van-progress :percentage="uploadProgress" color="#1989fa" />
        </van-cell>
      </van-dialog>

    </div>
  </div>
</template>

<script>
import uploadFileStatement from '@/views/statement/uploadFileStatement.vue';

export default {
  components: {
    'v-uploadFileStatement': uploadFileStatement,
  },
  data() {
    return {
      uploadHeader: {
        Authorization: localStorage.getItem('token'),
      },
      uploading: false,
      uploadProgress: 0,
      picFileList: [],
      docFile: [],
      showNotice: false,
      type: null,
    };
  },
  mounted() {},
  methods: {
    back() {
      this.$router.go(-1); //返回上一层
    },
    upload(type) {
      this.type = type;
      if (localStorage.getItem('uploadFileStatement') != 'true') {
        this.showNotice = true;
      } else {
        this.doUpload();
      }
    },
    doUpload() {
      this.showNotice = false;
      localStorage.setItem('uploadFileStatement', true);
      if (this.type == 'doc') {
        this.openFileUploader();
      } else {
        this.uploadPic();
      }
    },
    onSuccessUpload(response) {
      this.$router.push({
        path: '/uploadInfo',
        query: {
          uploadID: response.msg.uploadID,
        },
      });
    },
    openFileUploader() {
      this.$refs.docFileUploader.click();
    },
    onFileChange(event) {
      this.docFile = event.target.files;
      this.uploadFile();
    },
    uploadFile() {
      let param = new FormData();
      param.append('uploadFile', this.docFile[0]);
      param.append('uploadApp', '主应用');

      this.$Axios({
        method: 'post',
        url: '/docFileService/uploadFile',
        data: param,
        onUploadProgress: (progressEvent) => {
          this.uploading = true;
          this.uploadProgress = ((progressEvent.loaded / progressEvent.total) * 100) | 0;
        },
      })
        .then((response) => {
          this.onSuccessUpload(response.data);
        })
        .catch((response) => {
          this.$router.push({
            path: '/result',
            query: {
              state: response.data.state,
              code: response.data.code,
              msg: response.data.msg,
            },
          });
        });
    },
    uploadPic() {
      let param = new FormData();
      for (let index in this.picFileList) {
        param.append('uploadPicFiles', this.picFileList[index].file);
      }
      this.$Axios({
        method: 'post',
        url: '/docFileService/uploadPicFile',
        data: param,
      })
        .then((response) => {
          this.onSuccessUpload(response.data);
        })
        .catch((response) => {
          this.$router.push({
            path: '/result',
            query: {
              state: response.data.state,
              code: response.data.code,
              msg: response.data.msg,
            },
          });
        });
    },
  },
};
</script>