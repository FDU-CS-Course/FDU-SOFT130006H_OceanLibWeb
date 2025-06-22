<template>
  <div>
    <van-nav-bar id="toolbar" title="消息" left-text="返回" left-arrow @click-left="back" fixed placeholder></van-nav-bar>

    <!-- 使用 van-tabs 替代 van-grid -->
    <van-tabs v-model="activeTab" sticky>
      <van-tab>
        <template #title>
          <span class="tab-title">
            帮帮求助
            <span v-if="invitationHasUnread" class="tab-badge"></span>
          </span>
        </template>
        <div class="page">
          <div v-for="(item, index) in invitationList" :key="index" class="notifyBox">
            <div class="notifyBox__top">
              <div class="notifyBox__top__avatar">
                <v-username class="comment__avatar" type="avater" :avatarSize="28"
                  :username="item.notifyEntity.buildUsername"></v-username>
              </div>
              <div>
                <div>
                  <v-username type="username" :username="item.notifyEntity.buildUsername"></v-username>
                  向你发出了帮帮求助邀请
                </div>
                <div class="notifyBox__top__date">{{ item.notifyEntity.buildDate }}</div>
              </div>
              <div v-if="item.isRead === 48" class="red_dot"></div>
            </div>
          </div>
        </div>
      </van-tab>

      <van-tab>
        <template #title>
          <span class="tab-title">
            赞同
            <span v-if="likeHasUnread" class="tab-badge"></span>
          </span>
        </template>
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
                <div style="font-size: 14px;">{{ item.comment }}</div>
                <div class="notifyBox__top__date">{{ item.buildDate }}</div>
              </div>
              <div v-if="item.isRead === 48" class="red_dot"></div>
            </div>
          </div>
        </div>
      </van-tab>

      <van-tab>
        <template #title>
          <span class="tab-title">
            下载与评价
            <span v-if="downloadAndScoreHasUnread" class="tab-badge"></span>
          </span>
        </template>
        <div class="page">
          <div v-for="(item, index) in downloadAndScoreList" :key="index" class="notifyBox">
            <div class="notifyBox__top">
              <div class="notifyBox__top__avatar">
                <v-username class="comment__avatar" type="avater" :avatarSize="28"
                  :username="item.notifyEntity.buildUsername"></v-username>
              </div>
              <div>
                <div>
                  <v-username type="username" :username="item.notifyEntity.buildUsername"></v-username>
                  {{ item.notifyEntity.action == "DOWNLOAD" ? '下载' : '评价' }}了你的文章
                </div>
                <div class="notifyBox__top__date">{{ item.notifyEntity.buildDate }}</div>
              </div>
              <div v-if="item.isRead === 48" class="red_dot"></div>
            </div>
          </div>
        </div>
      </van-tab>

      <van-tab>
        <template #title>
          <span class="tab-title">
            评论与回复
            <span v-if="commentHasUnread" class="tab-badge"></span>
          </span>
        </template>
        <div class="page">
          <div v-for="(item, index) in commentList" :key="index" class="notifyBox">
            <div class="notifyBox__top">
              <div class="notifyBox__top__avatar">
                <v-username class="comment__avatar" type="avater" :avatarSize="28"
                  :username="item.buildUsername"></v-username>
              </div>
              <div class="notifyBox__content">
                <div>
                  <v-username type="username" :username="item.buildUsername"></v-username>
                  {{ item.action === 'NEW_COMMENT' ? '评论' : '回复' }}了你的{{ item.type === 'NOTE' ? '帖子' : '评论' }}
                </div>
                <!-- 原评论内容（引用框） -->
                <div v-if="item.originalComment" class="original-comment">
                  "{{ item.originalComment }}"
                </div>
                <!-- 回复内容 -->
                <div class="reply-content">{{ item.replyContent }}</div>
                <div class="notifyBox__top__date">{{ item.buildDate }}</div>
              </div>
              <div v-if="item.isRead === 48" class="red_dot"></div>
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
      this.invitationList.reverse();
      this.likeList.reverse();
      this.downloadAndScoreList.reverse();
      this.commentList.reverse();
      if (this.invitationList.length > 0 && this.invitationList[0].isRead === 48) this.invitationHasUnread = 1;
      if (this.likeList.length > 0 && this.likeList[0].isRead === 48) this.likeHasUnread = 1;
      if (this.downloadAndScoreList.length > 0 && this.downloadAndScoreList[0].isRead === 48) this.downloadAndScoreHasUnread = 1;
      if (this.commentList.length > 0 && this.commentList[0].isRead === 48) this.commentHasUnread = 1;
    });
  },
  data() {
    return {
      activeTab: 0,
      invitationList: [],
      likeList: [],
      downloadAndScoreList: [],
      commentList: [],
      invitationHasUnread: 0,
      likeHasUnread: 0,
      downloadAndScoreHasUnread: 0,
      commentHasUnread: 0,
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

.tab-title {
  position: relative;
  padding-right: 12px;
  /* 为小红点留出空间 */
}

.tab-badge {
  position: absolute;
  top: 0px;
  right: 0;
  width: 6px;
  height: 6px;
  background-color: red;
  border-radius: 50%;
}

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

.red_dot {
  position: absolute;
  right: 20px;
  width: 8px;
  height: 8px;
  transform: translateY(15px);
  background-color: red;
  border-radius: 50%;
}

.notifyBox__content {
  flex: 1;

  .original-comment {
    background-color: @gray-2;
    border-left: 3px solid @gray-5;
    padding: 8px 12px;
    margin: 8px 0;
    font-size: 13px;
    color: @gray-6;
    border-radius: 4px;
    font-style: italic;
  }

  .reply-content {
    font-size: 14px;
    color: @text-color;
    margin: 4px 0;
    line-height: 1.4;
  }
}
</style>