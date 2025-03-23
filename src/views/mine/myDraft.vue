<style lang="less" scoped>
@import '~@/vant-variables.less';
.page {
  background-color: @gray-1;
}
.pullRefresh {
  margin-bottom: 40px;
}
.myUpload {
  margin: 10px 10px 0px 10px;
  &__fileBox {
    padding: 10px;
  }
  &__actions {
    display: flex;
    padding: 8px 16px;
  }
  &__spacer {
    flex: 1;
  }
  &__details {
    padding: 10px;
  }
  &__table {
    width: 100%;
    border-collapse: collapse;
    font-size: 12px;
  }
  &__table th, &__table td {
    text-align: left;
    padding: 4px;
  }
  &__divider {
    height: 1px;
    background-color: #ebedf0;
    margin: 0;
  }
}
</style>
<style lang="less" scoped>
:deep(.van-tabs__content) {
  flex: 1;
  display: flex;
  flex-direction: column;
}
</style>
<template>
  <div class="page">
    <van-nav-bar ref="toolbar" title="草稿箱" left-text="返回" left-arrow @click-left="back" fixed placeholder></van-nav-bar>
    <van-tabs sticky class="full" :offset-top="tabsOffset">
      <van-tab title="文档" name="0" class="full">
        <van-pull-refresh class="pullRefresh full" v-model="content.fileList.refreshing" @refresh="getMyFileList(true)">
          <van-list v-model:loading="content.fileList.loading" :finished="content.fileList.finished" @load="getMyFileList()" class="full">
            <div v-for="fileInfo in myFileList" :key="fileInfo.fileID">
              <van-card class="myUpload">
                <v-fileBox class="myUpload__fileBox" :fileID="fileInfo.fileID" :abstractContent="fileInfo.abstractContent" :title="fileInfo.title" :fileType="fileInfo.fileType"
                  :previewPictureObjectName="fileInfo.previewPictureObjectName" :readNum="fileInfo.fileExtraEntity.readNum" :score="fileInfo.fileExtraEntity.score"
                  :ratersNum="fileInfo.fileExtraEntity.ratersNum" :paymentMethod="fileInfo.paymentMethod" :paymentAmount="fileInfo.paymentAmount"
                  :isVipIncome="fileInfo.fileExtraEntity.isVipIncome" :fileTagList="fileInfo.tagNames"></v-fileBox>
                <div class="myUpload__actions">
                  <van-button type="primary" size="mini" icon="edit" round></van-button>
                  <van-button type="primary" size="mini" icon="share" round class="ml-2"></van-button>
                  <van-button type="warning" size="mini" icon="close" round class="ml-2"></van-button>
                  <div class="myUpload__spacer"></div>
                  <van-button plain icon="arrow-down" @click="fileInfo.show = !fileInfo.show;$forceUpdate();" v-if="!fileInfo.show"></van-button>
                  <van-button plain icon="arrow-up" @click="fileInfo.show = !fileInfo.show;$forceUpdate();" v-else></van-button>
                </div>
                <van-collapse-transition>
                  <div v-show="fileInfo.show">
                    <div class="myUpload__divider"></div>
                    <div class="myUpload__details">
                      <table class="myUpload__table">
                        <thead>
                          <tr>
                            <th class="text-left">下载量</th>
                            <th class="text-left">点赞量</th>
                            <th class="text-left">收藏量</th>
                            <th class="text-left">评论量</th>
                            <th class="text-left">精品</th>
                            <th class="text-left">上传时间</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>{{fileInfo.fileExtraEntity.downloadNum}}次</td>
                            <td>{{fileInfo.fileExtraEntity.likeNum}}次</td>
                            <td>{{fileInfo.fileExtraEntity.collectionNum}}次</td>
                            <td>{{fileInfo.fileExtraEntity.commentNum}}次</td>
                            <td>
                              <van-icon :name="fileInfo.fileExtraEntity.isProCert==0?'warning':'success'" :color="fileInfo.fileExtraEntity.isProCert==0?'#ff9800':'#4caf50'" size="16px" />
                            </td>
                            <td>{{fileInfo.uploadDate}}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </van-collapse-transition>
              </van-card>
            </div>
            <template #finished>
              <!--若无文件则显示空提示-->
              <van-empty description="您还没有已经发布的文档呢" v-if="myFileList.length==0">
                <template v-slot:image>
                  <img :src="require('@/images/empty-picture/no_record.svg')" />
                </template>
                <template>
                  <van-button type="primary" size="small" class="mr-2" to="/uploadFile">上传更多文档
                    <van-icon name="upgrade" />
                  </van-button>
                  <van-button type="primary" size="small">查看草稿箱文档
                    <van-icon name="bookmark" />
                  </van-button>
                </template>
              </van-empty>
              <div v-else class="notice-nomore__text">没有更多已经发布的文档了</div>
              <van-button type="primary" size="small" class="mr-2" to="/uploadFile">上传更多文档
                <van-icon name="upgrade" />
              </van-button>
              <van-button type="primary" size="small">查看草稿箱文档
                <van-icon name="bookmark" />
              </van-button>
            </template>
          </van-list>
        </van-pull-refresh>
      </van-tab>
      <van-tab title="专栏" name="1">
        <van-empty description="程序猿们正在努力开发中">
          <template v-slot:image>
            <img :src="require('@/images/empty-picture/no_internet.svg')" />
          </template>
          <van-button type="primary" size="small" class="mr-2" to="/about">加入我们
            <van-icon name="manager" />
          </van-button>
        </van-empty>
      </van-tab>
      <van-tab title="帮帮帖" name="2">
        <van-empty description="程序猿们正在努力开发中">
          <template v-slot:image>
            <img :src="require('@/images/empty-picture/no_internet.svg')" />
          </template>
          <van-button type="primary" size="small" class="mr-2" to="/about">加入我们
            <van-icon name="manager" />
          </van-button>
        </van-empty>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import fileBox from '../../components/fileBox';

export default {
  components: {
    'v-fileBox': fileBox,
  },
  data() {
    return {
      tabsOffset: 0,
      myFileList: [],
      content: {
        fileList: {
          loading: false,
          finished: false,
          refreshing: false,
          pageNum: 1,
        },
        folderList: {
          loading: false,
          finished: false,
          refreshing: false,
          pageNum: 1,
        },
        noteList: {
          loading: false,
          finished: false,
          refreshing: false,
          pageNum: 1,
        },
      },
    };
  },
  mounted() {
    this.tabsOffset = this.$refs['toolbar'].height;
  },
  methods: {
    back() {
      this.$router.go(-1); //返回上一层
    },
    getMyFileList(isRefreshing = false) {
      if (isRefreshing) {
        this.content.fileList.pageNum = 1;
        this.content.fileList.finished = false;
      }
      this.$Axios({
        method: 'get',
        url: '/docInfoService/getMyFileList',
        params: {
          isFolder: false,
          pageNum: this.content.fileList.pageNum,
          pageSize: 4,
        },
      }).then((response) => {
        if (!isRefreshing) {
          this.myFileList.push(...response.data.msg.list);
        } else {
          this.myFileList = response.data.msg.list;
        }
        this.myFileList.map((data) => {
          data.show = false;
        });
        if (response.data.msg.isLastPage) {
          this.content.fileList.finished = true;
        } else {
          this.content.fileList.pageNum += 1;
        }
        this.content.fileList.loading = false;
        this.content.fileList.refreshing = false;
      });
    },
  },
};
</script>

<style scoped>
</style>