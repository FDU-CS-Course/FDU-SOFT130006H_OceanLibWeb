<template>
  <div class="wall-detail">
    <!-- 顶部导航栏 -->
    <v-app-bar color="white" elevation="1">
      <v-btn icon @click="$router.push('/wall')">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-toolbar-title class="text-h6">帖子详情</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="$router.push({ path: '/replyNotePage', query: { noteId: note.noteID, replyToId: note.noteID, replyToUsername: note.buildUsername, replyToContent: note.content } })">
        <v-icon>mdi-reply</v-icon>
      </v-btn>
      <v-btn icon @click="sharePost">
        <v-icon>mdi-share-variant</v-icon>
      </v-btn>
    </v-app-bar>

    <!-- 帖子列表 -->
    <div class="post-list">
      <!-- 主帖 -->
      <v-card v-if="note" class="post-card mb-4 mt-4" @click="$router.push({ path: '/replyNotePage', query: { noteId: note.noteID, replyToId: note.noteID, replyToUsername: note.buildUsername, replyToContent: note.content
      , isAnon: note.isAnon } })">
        <div class="post-header">
          <span class="floor-number">1楼</span>
          <span class="username">{{ note.isAnon ? "匿名纸条" : note.buildUsername }}</span>
          <span class="post-time">{{ formatDate(note.buildDate) }}</span>
        </div>

        <v-card-text class="post-content">
          {{ note.content }}
        </v-card-text>

        <v-card-actions>
          <div class="d-flex align-center justify-end w-100">
            <v-btn icon :color="isLiked ? 'red' : ''" variant="text">
              <v-icon>{{ isLiked ? 'mdi-thumb-up' : 'mdi-thumb-up-outline' }}</v-icon>
              <span class="ml-1">{{ note.likeNum }}</span>
            </v-btn>
            <v-btn icon variant="text">
              <v-icon>mdi-comment-eye</v-icon>
              <span class="ml-1">{{ note.readNum }}</span>
            </v-btn>
          </div>
        </v-card-actions>
      </v-card>

      <!-- 回复列表 -->
      <div v-for="(reply, index) in wallContentInfo" :key="index" class="mb-4">
        <v-card class="post-card" @click="$router.push({ path: '/replyNotePage', query: { noteId: note.noteID, replyToId: reply.id, replyToUsername: reply.noteCommentBuildUsername, replyToContent: reply.commentContent,
         isAnon: note.buildUsername === replyTo.replyToUsername && note.isAnon } })">
          <div class="post-header">
            <span class="floor-number">{{ index + 2 }}楼</span>
            <span class="username">{{ reply.noteCommentBuildUsername }}</span>
            <span class="post-time">{{ formatDate(reply.createTime) }}</span>
          </div>

          <v-card-text class="post-content">
            <div v-if="reply.replyTo" class="reply-reference">
              <span class="font-weight-bold">@{{ reply.replyToUsername === note.buildUsername && note.isAnon ? "匿名纸条" : reply.replyToUsername }}</span>
            </div>
            {{ reply.commentContent }}
          </v-card-text>

          <v-card-actions>
            <div class="d-flex align-center justify-end w-100">
              <v-btn icon variant="text">
                <v-icon>mdi-thumb-up-outline</v-icon>
                <span class="ml-1">{{ reply.likeNum }}</span>
              </v-btn>
            </div>
          </v-card-actions>
        </v-card>
      </div>
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
        replyTo: note.replyTo,
        id: note._id,
        replyToUsername: note.replyToUsername
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

.post-card {
  border-radius: 12px;
  background-color: white;
  transition: all 0.3s ease;
}

.post-header {
  padding: 16px 16px 8px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.floor-number {
  color: #1976d2;
  font-weight: bold;
}

.username {
  font-weight: 500;
}

.post-time {
  color: #666;
  font-size: 0.9em;
}

.post-content {
  padding: 0 16px 16px;
  line-height: 1.6;
}

.reply-reference {
  margin-bottom: 8px;
  padding: 8px;
  background-color: #f5f5f5;
  border-radius: 4px;
  font-size: 0.9em;
}
</style>