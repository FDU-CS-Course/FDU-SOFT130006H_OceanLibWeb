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
    <v-card v-if="note" class="mx-auto mb-4 mt-4" style="border-radius: 20px; background-color: white;" @click="$router.push({ path: '/replyNotePage', query: { noteId: note.noteID } })">
      <v-card-title style="padding: 30px 30px;" class="text-center">
        <span class="text-h4 font-weight-bold">{{ note.tag }}</span>
      </v-card-title>

      <v-card-text class="wall__card__content">
        {{ note.content }}
      </v-card-text>

      <v-card-actions>
        <div class="d-flex align-center justify-space-between w-100">
          <div class="d-flex align-center">
            <span class="text-subtitle-1">{{ note.isAnon ? "匿名纸条" : note.buildUsername }}</span>
          </div>
          <div class="d-flex align-center">
            <v-btn icon :color="isLiked ? 'red' : ''" variant="text">
              <v-icon>{{ isLiked ? 'mdi-thumb-up' : 'mdi-thumb-up-outline' }}</v-icon>
              <span class="ml-1">{{ note.likeNum }}</span>
            </v-btn>
            <v-btn icon variant="text">
              <v-icon>mdi-comment-eye</v-icon>
              <span class="ml-1">{{ note.readNum }}</span>
            </v-btn>
          </div>
        </div>
      </v-card-actions>
    </v-card>

    <!-- 评论区域 -->
    <v-container v-if="wallContentInfo.length > 0" class="mt-6">
      <h3 class="text-h6 mb-4">评论</h3>
      <div v-for="(comment, index) in wallContentInfo" :key="index" class="mb-4">
        <v-card style="border-radius: 12px; background-color: #fff; padding: 16px;">

          <!-- 用户名和时间 -->
          <div class="text-caption mt-2">
            {{ comment.noteCommentBuildUsername }} · {{ formatDate(comment.createTime) }}
          </div>

          <!-- 回复内容（如果有） -->
          <div v-if="comment.replyTo" class="replies-section mt-2">
            <div class="reply-item">
              <span class="font-weight-bold">@{{ comment.replyTo }}</span>：
              {{ comment.commentContent }}
            </div>
          </div>
        </v-card>
      </div>
    </v-container>

    <!-- 没有评论时的提示 -->
    <div v-if="wallContentInfo.length === 0 && !isLoading" class="text-center mt-6">
      <p>暂无评论，快来抢沙发吧～</p>
    </div>

    <!-- 加载提示 -->
    <div v-if="isLoading" class="text-center my-4">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>
  </div>
</template>

<script setup>
import {ref, reactive, onMounted, onUnmounted, getCurrentInstance} from 'vue'
import {useRoute} from 'vue-router';

// 新评论和回复输入
const newComment = ref('')
const newReply = ref('')
const activeReplyIndex = ref(-1)

const route = useRoute();
const note = ref(null);

// 点赞状态
const isLiked = ref(false)

// Snackbar 控制
const snackbar = reactive({
  show: false,
  text: '',
  color: 'success'
});

// 分页参数
const pageNo = ref(1);
const pageSize = ref(10);

const wallContentInfo = ref([]);
const { proxy } = getCurrentInstance();

const isLoading = ref(false);
const hasMore = ref(true);

// 日期格式化
const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

const handleScroll = () => {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const windowHeight = window.innerHeight;
  const scrollHeight = document.documentElement.scrollHeight;

  const scrollBottom = scrollHeight - (scrollTop + windowHeight);

  if (scrollBottom <= 50) {
    fetchWallContentData(true);
  }
};

onMounted(() => {
  note.value = {
    noteID: route.query.noteID,
    tag: route.query.tag,
    content: route.query.content,
    likeNum: route.query.likeNum,
    commentNum: route.query.commentNum,
    readNum:route.query.readNum,
    buildDate: route.query.buildDate,
    buildUsername: route.query.buildUsername,
    isAnon: route.query.isAnon,
    isAllowComment: route.query.isAllowComment,
    isDeleted: route.query.isDeleted,
  };

  console.log(note.value.tag);

  fetchWallContentData();
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

const fetchWallContentData = async (isLoadMore = false) => {
  if (isLoading.value || !hasMore.value) return;

  isLoading.value = true;

  try {
    const res = await proxy.$Axios({
      method: 'post',
      url: '/noteService/getNoteCommentByNoteId',
      headers: {
        'Content-Type': 'application/json'
      },
      params: {
        noteId: note.value.noteID,
        pageNo: pageNo.value,
        pageSize: pageSize.value
      }
    });

    if (res.data && res.data.code === "1") {
      const list = res.data.msg.list.map(note => ({
        noteId: note.noteId,
        commentContent: note.commentContent,
        likeNum: note.likeNum || 0,
        createTime: note.createTime,
        noteCommentBuildUsername: note.noteCommentBuildUsername,
        replyTo: note.replyTo
      }));

      wallContentInfo.value = isLoadMore ? [...wallContentInfo.value, ...list] : [...list];

      // 判断是否还有下一页
      if (list.length < pageSize.value) {
        hasMore.value = false;
      } else {
        pageNo.value += 1; // 只有成功加载才自增页码
      }
    } else {
      hasMore.value = false;
    }
  } catch (err) {
    console.error("请求出错：", err);
  } finally {
    isLoading.value = false;
  }
};

// 显示提示条
function showSnackbar(text, color = 'success') {
  snackbar.text = text
  snackbar.color = color
  snackbar.show = true
  setTimeout(() => {
    snackbar.show = false
  }, 3000)
}

// 分享帖子
function sharePost() {
  if (!note.value) return;
  
  const shareText = `${note.value.tag}\n${note.value.content}\n\n来自互助墙：${window.location.href}`

  const textarea = document.createElement('textarea')
  textarea.value = shareText
  textarea.style.position = 'fixed'
  textarea.style.opacity = '0'
  document.body.appendChild(textarea)

  try {
    textarea.select()
    textarea.setSelectionRange(0, textarea.value.length)
    const successful = document.execCommand('copy')
    if (successful) {
      showSnackbar('已复制到剪贴板')
    } else {
      showSnackbar('复制失败，请手动复制', 'error')
    }
  } catch (err) {
    showSnackbar('复制失败，请手动复制', 'error')
  }

  document.body.removeChild(textarea)
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