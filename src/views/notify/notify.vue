<template>
  <div>
    <van-nav-bar id="toolbar" title="消息" left-text="返回" left-arrow @click-left="back" fixed placeholder></van-nav-bar>

    <!-- 使用 van-tabs 替代 van-grid -->
    <van-tabs v-model="activeTab" sticky>
      <van-tab title="帮帮求助">
        <div class="page">
          <div v-for="(item, index) in invitationList" :key="index" class="notifyBox">
            <div class="notifyBox__top">
              <div class="notifyBox__top__avatar">
                <v-username class="comment__avatar" type="avater" :avatarSize="28"
                  :username="item.buildUsername"></v-username>
              </div>
              <div>
                <div>
                  <v-username type="username" :username="item.buildUsername"></v-username>
                  向你发出了帮帮求助邀请
                </div>
                <div class="notifyBox__top__date">{{ item.buildDate }}</div>
              </div>
            </div>
          </div>
        </div>
      </van-tab>

      <van-tab title="赞同">
        <div class="page">
          <div v-for="(item, index) in likeList" :key="index" class="notifyBox">
            <div class="notifyBox__top">
              <div class="notifyBox__top__avatar">
                <v-username class="comment__avatar" type="avater" :avatarSize="28"
                  :username="item.buildUsername"></v-username>
              </div>
              <div>
                <div>
                  <v-username type="username" :username="item.buildUsername"></v-username>
                  点赞了你的{{ item.action == 'LIKE_COMMENT' ? '评论' : '文章' }}
                </div>
                <div class="notifyBox__top__date">{{ item.buildDate }}</div>
              </div>
            </div>
          </div>
        </div>
      </van-tab>

      <van-tab title="下载与评价">
        <div class="page">
          <div v-for="(item, index) in downloadAndScoreList" :key="index" class="notifyBox">
            <div class="notifyBox__top">
              <div class="notifyBox__top__avatar">
                <v-username class="comment__avatar" type="avater" :avatarSize="28"
                  :username="item.buildUsername"></v-username>
              </div>
              <div>
                <div>
                  <v-username type="username" :username="item.buildUsername"></v-username>
                  {{ item.action == "DOWNLOAD" ? '下载' : '评价' }}了你的文章
                </div>
                <div class="notifyBox__top__date">{{ item.buildDate }}</div>
              </div>
            </div>
          </div>
        </div>
      </van-tab>

      <van-tab title="评论与回复">
        <div class="page">
          <div v-for="(item, index) in commentList" :key="index" class="notifyBox">
            <div class="notifyBox__top">
              <div class="notifyBox__top__avatar">
                <v-username class="comment__avatar" type="avater" :avatarSize="28"
                  :username="item.buildUsername"></v-username>
              </div>
              <div>
                <div>
                  <v-username type="username" :username="item.buildUsername"></v-username>
                  {{ item.action == 'NEW_COMMENT' ? '评论' : '回复' }}了你的评论
                </div>
                <div class="notifyBox__top__date">{{ item.buildDate }}</div>
              </div>
            </div>
          </div>
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import Username from '@/components/common/username/username';
import userNotifyStore from './userNotifyStore.js';

export default {
  components: {
    'v-username': Username,
  },
  mounted() {
    userNotifyStore.pullUserNotifyList(this, () => {
      const notifyData = userNotifyStore.getUserNotifyList();
      this.invitationList = notifyData.invitationList || [];
      this.likeList = notifyData.likeList || [];
      this.downloadAndScoreList = notifyData.downloadAndScoreList || [];
      this.commentList = notifyData.commentList || [];
    });
  },
  data() {
    return {
      activeTab: 0,
      invitationList: [],
      likeList: [],
      downloadAndScoreList: [],
      commentList: [],
    };
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
  },
};
</script>

<style lang="less" scoped>
@import '~@/vant-variables.less';

.page {
  background-color: @gray-1;
  min-height: 200px;
}

.notifyBox {
  background-color: @white;
  padding: 20px;
  margin-bottom: 5px;

  &__top {
    display: flex;
    align-items: flex-start;
    font-size: 14px;

    &__avatar {
      margin-right: 5px;
    }

    &__date {
      font-size: 12px;
      color: @gray-4;
    }
  }
}
</style>