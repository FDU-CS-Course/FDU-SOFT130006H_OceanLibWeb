<template>
  <div class="wall-detail">
    <!-- 顶部导航栏 -->
    <v-app-bar color="white" elevation="1">
      <v-btn icon @click="$router.push('/wall')">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-toolbar-title class="text-h6">问题详情</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="sharePost">
        <v-icon>mdi-share-variant</v-icon>
      </v-btn>
    </v-app-bar>

    <!-- 问题卡片 -->
    <v-card class="mx-auto mb-4 mt-4" style="border-radius: 20px; background-color: white;">
      <v-card-title style="padding: 30px 30px;" class="text-center">
        <span class="text-h4 font-weight-bold">{{ wallInfo.tag }}</span>
      </v-card-title>

      <v-card-text class="wall__card__content">
        {{ wallInfo.content }}
      </v-card-text>

      <v-card-actions>
        <div class="d-flex align-center justify-space-between w-100">
          <div class="d-flex align-center">
            <v-avatar size="32" color="primary" class="mr-2">
              <span class="text-h6">{{ wallInfo.buildUsername.charAt(0) }}</span>
            </v-avatar>
            <span class="text-subtitle-1">{{ wallInfo.isAnon ? "匿名纸条" : wallInfo.buildUsername }}</span>
          </div>
          <div class="d-flex align-center">
            <v-btn icon @click="toggleLike" :color="isLiked ? 'red' : ''" variant="text">
              <v-icon>{{ isLiked ? 'mdi-thumb-up' : 'mdi-thumb-up-outline' }}</v-icon>
              <span class="ml-1">{{ wallInfo.likeNum }}</span>
            </v-btn>
            <v-btn icon @click="toggleDislike" :color="isDisliked ? 'grey' : ''" variant="text">
              <v-icon>{{ isDisliked ? 'mdi-thumb-down' : 'mdi-thumb-down-outline' }}</v-icon>
              <span class="ml-1">{{ wallInfo.dislikeNum }}</span>
            </v-btn>
            <v-btn icon variant="text">
              <v-icon>mdi-comment-eye</v-icon>
              <span class="ml-1">{{ wallInfo.readNum }}</span>
            </v-btn>
          </div>
        </div>
      </v-card-actions>
    </v-card>

    <!-- 评论区 -->
    <v-card class="mx-auto mb-4" style="border-radius: 20px; background-color: white;">
      <v-card-title style="padding: 20px 30px;">
        <span class="text-h5">评论 ({{ wallInfo.commentNum }})</span>
      </v-card-title>

      <!-- 评论列表 -->
      <v-card-text class="comment-list">
        <div v-for="(comment, index) in comments" :key="index" class="comment-item mb-4">
          <div class="d-flex align-center mb-2">
            <v-avatar size="32" color="primary" class="mr-2">
              <span class="text-h6">{{ comment.username.charAt(0) }}</span>
            </v-avatar>
            <span class="text-subtitle-1">{{ comment.username }}</span>
            <span class="text-caption ml-2 text-grey">{{ comment.createTime }}</span>
          </div>
          <div class="comment-content pl-8">
            {{ comment.content }}
          </div>
          <div class="d-flex align-center pl-8 mt-2">
            <v-btn icon size="small" @click="likeComment(index)" :color="comment.isLiked ? 'red' : ''" variant="text">
              <v-icon>{{ comment.isLiked ? 'mdi-thumb-up' : 'mdi-thumb-up-outline' }}</v-icon>
              <span class="ml-1">{{ comment.likeNum }}</span>
            </v-btn>
            <v-btn icon size="small" @click="dislikeComment(index)" :color="comment.isDisliked ? 'grey' : ''" variant="text">
              <v-icon>{{ comment.isDisliked ? 'mdi-thumb-down' : 'mdi-thumb-down-outline' }}</v-icon>
              <span class="ml-1">{{ comment.dislikeNum }}</span>
            </v-btn>
            <v-btn icon size="small" @click="showReplyInput(index)" variant="text">
              <v-icon>mdi-reply</v-icon>
              <span class="ml-1">回复</span>
            </v-btn>
          </div>
          
          <!-- 回复列表 -->
          <div v-if="comment.replies && comment.replies.length > 0" class="replies-section pl-8 mt-2">
            <div v-for="(reply, replyIndex) in comment.replies" :key="replyIndex" class="reply-item mb-2">
              <div class="d-flex align-center">
                <v-avatar size="24" color="primary" class="mr-2">
                  <span class="text-caption">{{ reply.username.charAt(0) }}</span>
                </v-avatar>
                <span class="text-subtitle-2">{{ reply.username }}</span>
                <span class="text-caption ml-2 text-grey">{{ reply.createTime }}</span>
              </div>
              <div class="reply-content pl-6">
                {{ reply.content }}
              </div>
            </div>
          </div>

          <!-- 回复输入框 -->
          <div v-if="activeReplyIndex === index" class="reply-input-section pl-8 mt-2">
            <v-text-field
              v-model="newReply"
              label="写下你的回复..."
              variant="outlined"
              density="comfortable"
              hide-details
              class="mb-2"
              @keyup.enter="submitReply(index)"
            ></v-text-field>
            <div class="d-flex justify-end">
              <v-btn size="small" color="primary" @click="submitReply(index)" :disabled="!newReply.trim()">
                回复
              </v-btn>
              <v-btn size="small" variant="text" @click="cancelReply" class="ml-2">
                取消
              </v-btn>
            </div>
          </div>
        </div>
      </v-card-text>
    </v-card>

    <!-- 固定在底部的评论输入框 -->
    <div class="comment-input-container">
      <v-card class="comment-input-card">
        <v-card-actions class="pa-2">
          <v-text-field
            v-model="newComment"
            label="写下你的评论..."
            variant="outlined"
            density="comfortable"
            hide-details
            class="mr-2"
            @keyup.enter="submitComment"
          ></v-text-field>
          <v-btn color="primary" @click="submitComment" :disabled="!newComment.trim()">
            发送
          </v-btn>
        </v-card-actions>
      </v-card>
    </div>

    <!-- 提示消息 -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="2000"
    >
      {{ snackbar.text }}
    </v-snackbar>
  </div>
</template>

<script>
export default {
  data() {
    // 暂时写死，后续需要从后端获取
    return {
      wallInfo: {
        tag: "问题",
        content: "求计算机大佬帮孩子看看C++，可以请奶茶，留个QQ：1257477940",
        readNum: 35,
        commentNum: 25,
        likeNum: 12,
        dislikeNum: 3,
        buildUsername: "Alpha测试",
        isAnon: false
      },
      comments: [
        {
          username: "热心网友1",
          content: "我可以帮你看看，加你QQ了",
          createTime: "2024-03-20 10:30",
          likeNum: 5,
          dislikeNum: 1,
          isLiked: false,
          isDisliked: false,
          replies: [
            {
              username: "热心网友2",
              content: "好的，我加你了",
              createTime: "2024-03-20 10:35"
            }
          ]
        },
        {
          username: "热心网友2",
          content: "C++哪个部分需要帮助？",
          createTime: "2024-03-20 11:15",
          likeNum: 3,
          dislikeNum: 0,
          isLiked: false,
          isDisliked: false,
          replies: []
        }
      ],
      newComment: '',
      newReply: '',
      activeReplyIndex: -1,
      isLiked: false,
      isDisliked: false,
      snackbar: {
        show: false,
        text: '',
        color: 'success'
      }
    }
  },
  methods: {
    showSnackbar(text, color = 'success') {
      this.snackbar.text = text
      this.snackbar.color = color
      this.snackbar.show = true
    },
    sharePost() {
      const shareText = `${this.wallInfo.tag}\n${this.wallInfo.content}\n\n来自互助墙：${window.location.href}`
      
      // 创建一个临时的textarea元素
      const textarea = document.createElement('textarea')
      textarea.value = shareText
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      
      try {
        // 选择文本
        textarea.select()
        textarea.setSelectionRange(0, textarea.value.length)
        
        // 执行复制命令
        const successful = document.execCommand('copy')
        if (successful) {
          this.showSnackbar('已复制到剪贴板')
        } else {
          this.showSnackbar('复制失败，请手动复制', 'error')
        }
      } catch (err) {
        this.showSnackbar('复制失败，请手动复制', 'error')
      }
      
      // 移除临时元素
      document.body.removeChild(textarea)
    },
    submitComment() {
      if (!this.newComment.trim()) return
      
      this.comments.unshift({
        username: "我",
        content: this.newComment,
        createTime: new Date().toLocaleString(),
        likeNum: 0,
        dislikeNum: 0,
        isLiked: false,
        isDisliked: false
      })
      
      this.wallInfo.commentNum++
      this.newComment = ''
    },
    toggleLike() {
      this.isLiked = !this.isLiked
      if (this.isLiked) {
        this.wallInfo.likeNum++
        if (this.isDisliked) {
          this.isDisliked = false
          this.wallInfo.dislikeNum--
        }
      } else {
        this.wallInfo.likeNum--
      }
    },
    toggleDislike() {
      this.isDisliked = !this.isDisliked
      if (this.isDisliked) {
        this.wallInfo.dislikeNum++
        if (this.isLiked) {
          this.isLiked = false
          this.wallInfo.likeNum--
        }
      } else {
        this.wallInfo.dislikeNum--
      }
    },
    likeComment(index) {
      const comment = this.comments[index]
      comment.isLiked = !comment.isLiked
      if (comment.isLiked) {
        comment.likeNum++
        if (comment.isDisliked) {
          comment.isDisliked = false
          comment.dislikeNum--
        }
      } else {
        comment.likeNum--
      }
    },
    dislikeComment(index) {
      const comment = this.comments[index]
      comment.isDisliked = !comment.isDisliked
      if (comment.isDisliked) {
        comment.dislikeNum++
        if (comment.isLiked) {
          comment.isLiked = false
          comment.likeNum--
        }
      } else {
        comment.dislikeNum--
      }
    },
    showReplyInput(index) {
      this.activeReplyIndex = index
      this.newReply = ''
    },
    cancelReply() {
      this.activeReplyIndex = -1
      this.newReply = ''
    },
    submitReply(index) {
      if (!this.newReply.trim()) return
      
      if (!this.comments[index].replies) {
        this.comments[index].replies = []
      }
      
      this.comments[index].replies.push({
        username: "我",
        content: this.newReply,
        createTime: new Date().toLocaleString()
      })
      
      this.newReply = ''
      this.activeReplyIndex = -1
    }
  }
}
</script>

<style scoped>
.wall-detail {
  padding: 16px;
  padding-bottom: 80px;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.comment-item {
  border-bottom: 1px solid #eee;
  padding-bottom: 16px;
}

.comment-content {
  color: #333;
  line-height: 1.5;
}

.comment-list {
  max-height: calc(100vh - 400px);
  overflow-y: auto;
}

.comment-input-container {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 8px 16px;
  background-color: #f5f5f5;
  z-index: 100;
}

.comment-input-card {
  border-radius: 20px;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
}

.v-card {
  transition: all 0.3s ease;
}

.v-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.replies-section {
  background-color: #f5f8ff;
  border-radius: 8px;
  padding: 8px;
}

.reply-item {
  padding: 4px 0;
}

.reply-content {
  color: #333;
  font-size: 0.9rem;
  line-height: 1.4;
}

.reply-input-section {
  background-color: #f5f8ff;
  border-radius: 8px;
  padding: 8px;
}
</style> 