<template>
  <div class="wall-detail">
    <!-- 顶部导航栏 -->
    <v-app-bar style="background-color: rgb(var(--v-theme-primary));" elevation="1">
      <v-btn icon @click="$router.push('/wall')" color="white">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-toolbar-title class="text-h6" style="color: white;">帖子详情</v-toolbar-title>
      <v-btn icon @click="goToReplyPage(note.noteID, note.buildUsername, note.content, note.isAnon)" color="white">
        <v-icon>mdi-reply</v-icon>
      </v-btn>
      <v-btn icon @click="sharePost" color="white">
        <v-icon>mdi-share-variant</v-icon>
      </v-btn>
      <v-btn icon @click="toggleFavorite" :color="isFavorited ? 'orange' : 'white'">
        <v-icon>{{ isFavorited ? 'mdi-star' : 'mdi-star-outline' }}</v-icon>
      </v-btn>

      <!-- 设置菜单按钮 -->
      <v-btn ref="settingsBtn" icon color="white" v-if="canDelete">
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>

      <!-- 设置下拉菜单 -->
      <v-menu v-model="isSettingsMenuOpen" :activator="settingsBtn" location="bottom end"
        transition="slide-y-transition">
        <v-list dense style="min-width: 120px;">
          <v-list-item @click="confirmDeletePost" class="delete-item">
            <v-list-item-title class="text-red">
              <v-icon small class="mr-2" color="red">mdi-delete</v-icon>
              删除帖子
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <!-- 帖子列表 -->
    <div class="post-list">
      <!-- 主帖 -->
      <v-card v-if="note" class="post-card mb-4 mt-4"
        @click="goToReplyPage(note.noteID, note.buildUsername, note.content, note.isAnon)">
        <div class="post-header">
          <span class="floor-number">1楼</span>

          <!-- 匿名用户显示 -->
          <div class="d-flex align-center" v-if="note.isAnon === 'true'">
            <v-icon
              style="color: rgb(var(--v-theme-primary)); font-size: 20px; margin-right: 8px;">mdi-account-circle</v-icon>
            <span class="username">匿名纸条</span>
          </div>

          <!-- 实名用户显示 -->
          <div class="d-flex align-center" v-else>
            <v-username type="avater" :avatarSize="20" :username="note.buildUsername"></v-username>
            <v-username type="username" :username="note.buildUsername" class="username ml-2"></v-username>
          </div>
        </div>

        <v-card-text class="post-content">
          {{ note.content }}
        </v-card-text>

        <v-card-actions>
          <div class="d-flex align-center justify-end w-100">
            <!-- 点赞按钮 -->
            <v-btn icon @click.stop="toggleLike" :disabled="isLiking" :color="isLiked ? 'red' : ''" variant="text">
              <v-icon :color="isLiked ? 'red' : 'rgb(var(--v-theme-primary))'">{{ isLiked ? 'mdi-heart' :
                'mdi-heart-outline' }}</v-icon>
              <span class="ml-1">{{ note.likeNum || 0 }}</span>
            </v-btn>
            <v-btn icon variant="text">
              <v-icon style="color: rgb(var(--v-theme-primary));">mdi-comment-eye</v-icon>
              <span class="ml-1">{{ note.readNum }}</span>
            </v-btn>
          </div>
        </v-card-actions>

        <!-- 发帖时间 -->
        <div class="post-time-footer">
          <span class="post-time">{{ formatDate(note.buildDate) }}</span>
        </div>
      </v-card>

      <!-- 回复列表 -->
      <div v-for="(reply, index) in wallContentInfo" :key="index" class="mb-4">
        <v-card class="post-card" @click="goToReplyPage(reply.id, reply.noteCommentBuildUsername, reply.commentContent,
          reply.replyToUsername === note.buildUsername && note.isAnon)">
          <div class="post-header">
            <span class="floor-number">{{ index + 2 }}楼</span>

            <!-- 匿名用户显示 -->
            <div class="d-flex align-center"
              v-if="(reply.noteCommentBuildUsername === note.buildUsername && note.isAnon === 'true')">
              <v-icon
                style="color: rgb(var(--v-theme-primary)); font-size: 20px; margin-right: 8px;">mdi-account-circle</v-icon>
              <span class="username">匿名纸条</span>
            </div>

            <!-- 实名用户显示 -->
            <div class="d-flex align-center" v-else>
              <v-username type="avater" :avatarSize="20" :username="reply.noteCommentBuildUsername"></v-username>
              <v-username type="username" :username="reply.noteCommentBuildUsername" class="username ml-2"></v-username>
            </div>
          </div>

          <v-card-text class="post-content">
            <div v-if="reply.replyTo" class="reply-reference" style="margin-bottom: 15px;">
              <span class="font-weight-bold">@{{
                (reply.replyToUsername === note.buildUsername && note.isAnon === 'true') ? "匿名纸条" :
                  reply.replyToUsername
              }}</span>
            </div>
            {{ reply.commentContent }}
          </v-card-text>

          <v-card-actions>
            <div class="d-flex align-center justify-space-between w-100">
              <div></div>
              <div class="d-flex align-center">
                <v-btn icon variant="text" @click.stop="deleteComment(reply.id)" color="red">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </div>
            </div>
          </v-card-actions>

          <!-- 发帖时间 -->
          <div class="post-time-footer">
            <span class="post-time">{{ formatDate(reply.createTime) }}</span>
          </div>
        </v-card>
      </div>
    </div>

    <!-- 加载提示 -->
    <div v-if="isLoading" class="text-center my-4">
      <v-progress-circular indeterminate style="color: rgb(var(--v-theme-primary));"></v-progress-circular>
    </div>

    <!-- Snackbar 提示 -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000" location="bottom">
      {{ snackbar.text }}
    </v-snackbar>

    <!-- 删除确认对话框 -->
    <v-dialog v-model="deleteDialog" max-width="420" persistent>
      <v-card class="delete-dialog">
        <div class="dialog-header">
          <v-icon color="red" size="48" class="mb-3">mdi-alert-circle</v-icon>
          <v-card-title class="text-h5 text-center pa-0 mb-2">
            确认删除
          </v-card-title>
        </div>

        <v-card-text class="text-center pb-4">
          <p class="text-body-1 mb-2">确定要删除这个帖子吗？</p>
          <p class="text-caption text-grey">删除后无法恢复，请谨慎操作</p>
        </v-card-text>

        <v-card-actions class="pa-4 pt-0 dialog-actions">
          <v-btn variant="outlined" color="grey" block class="mr-2" @click="deleteDialog = false">
            取消
          </v-btn>
          <v-btn variant="flat" color="red" block class="mr-2" @click="confirmDelete">
            确认删除
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, getCurrentInstance, watch } from 'vue'
import { useRoute } from 'vue-router';
import VUsername from "@/components/common/username/username.vue";

const route = useRoute();
const note = ref(null);

// 点赞状态
const isLiked = ref(false);
const isLiking = ref(false);

// 收藏状态
const isFavorited = ref(false)

// Snackbar 控制
const snackbar = reactive({
  show: false,
  text: '',
  color: 'success'
});

// 设置菜单控制
const settingsBtn = ref(null);
const isSettingsMenuOpen = ref(false);

// 删除确认对话框
const deleteDialog = ref(false);

// 分页参数
const pageNo = ref(1);
const pageSize = ref(10);

const canDelete = ref(false);

let collectionId = ref(null);

const wallContentInfo = ref([]);
const { proxy } = getCurrentInstance();

const isLoading = ref(false);
const hasMore = ref(true);

const goToReplyPage = (replyToId, replyToUsername, replyToContent, isAnon) => {
  if (!note.value?.isAllowComment) return;

  if (note.value.isAllowComment === 'false') {
    showSnackbar('楼主已经关闭评论功能~', 'success');
    return;
  }

  proxy.$router.push({
    path: '/replyNotePage',
    query: {
      noteId: note.value.noteID,
      replyToId,
      replyToUsername,
      replyToContent,
      isAnon
    }
  });
};

/**
 * 切换点赞状态
 */
const toggleLike = async () => {
  if (!note.value || isLiking.value) return;

  try {
    isLiking.value = true;

    const newLikeStatus = !isLiked.value;

    const res = await proxy.$Axios({
      method: 'post',
      url: '/noteService/likeNote',
      headers: {
        'Content-Type': 'application/json'
      },
      params: {
        noteId: note.value.noteID,
        isLike: newLikeStatus
      }
    });

    if (res.data && res.data.code === "1") {
      // 更新本地状态
      isLiked.value = newLikeStatus;

      // 更新点赞数
      if (newLikeStatus) {
        note.value.likeNum = (parseInt(note.value.likeNum) || 0) + 1;
      } else {
        note.value.likeNum = Math.max((parseInt(note.value.likeNum) || 0) - 1, 0);
      }

      showSnackbar(newLikeStatus ? '点赞成功' : '取消点赞成功', 'success');
    } else {
      showSnackbar('点赞操作失败，请重试', 'error');
    }
  } catch (err) {
    console.error("点赞请求出错：", err);
    showSnackbar('网络错误，请重试', 'error');
  } finally {
    isLiking.value = false;
  }
};

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

/**
 * 获取点赞状态
 */
const checkLikeStatus = async () => {
  if (!note.value?.noteID) return;

  try {
    const res = await proxy.$Axios({
      method: 'post',
      url: '/noteService/checkNoteLikeStatus',
      headers: {
        'Content-Type': 'application/json'
      },
      params: {
        noteId: note.value.noteID
      }
    });

    if (res.data && res.data.code === "1") {
      isLiked.value = res.data.msg === true;
    }
  } catch (err) {
    console.error("获取点赞状态出错：", err);
  }
};

onMounted(async () => {
  note.value = {
    noteID: route.query.noteID,
    tag: route.query.tag,
    content: route.query.content,
    likeNum: route.query.likeNum,
    commentNum: route.query.commentNum,
    readNum: route.query.readNum,
    buildDate: route.query.buildDate,
    buildUsername: route.query.buildUsername,
    isAnon: route.query.isAnon,
    isAllowComment: route.query.isAllowComment,
    isDeleted: route.query.isDeleted,
  };

  const res = await proxy.$Axios({
    method: 'post',
    url: '/noteService/canDeleteNote',
    headers: {
      'Content-Type': 'application/json'
    },
    params: {
      noteID: note.value.noteID,
    }
  });

  if (res.data.msg === "true") canDelete.value = true;
  else canDelete.value = false;

  // 如果从列表页传递了点赞状态，直接使用
  if (route.query.isLikedByCurrentUser !== undefined) {
    isLiked.value = route.query.isLikedByCurrentUser === 'true' || route.query.isLikedByCurrentUser === true;
  } else {
    // 否则从服务器获取点赞状态
    checkLikeStatus();
  }

  fetchWallContentData();
  window.addEventListener('scroll', handleScroll);

  proxy.$Axios({
    method: 'post',
    url: '/noteService/readNote',
    headers: {
      'Content-Type': 'application/json'
    },
    params: {
      noteId: note.value.noteID,
    }
  });
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

  const res = await proxy.$Axios({
    method: 'post',
    url: '/noteService/getBehaviourByUsernameAndNoteId',
    headers: {
      'Content-Type': 'application/json'
    },
    params: {
      noteId: note.value.noteID,
    }
  });

  if (res.data && res.data.code === "1" && res.data.msg.noteId == note.value.noteID) {
    collectionId.value = res.data.msg.id;
    isFavorited.value = true;
  } else {
    isFavorited.value = false;
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

// 确认删除帖子
function confirmDeletePost() {
  isSettingsMenuOpen.value = false;
  deleteDialog.value = true;
}

// 确认删除操作
function confirmDelete() {
  deleteDialog.value = false;
  deletePost();
}

// 删除评论
async function deleteComment(commentID) {
  try {
    const res = await proxy.$Axios({
      method: 'post',
      url: '/noteService/deleteNoteComment',
      headers: {
        'Content-Type': 'application/json'
      },
      params: {
        _id: commentID,
        noteId: note.value.noteID
      }
    });

    if (res.data && res.data.code === "1") {
      showSnackbar('评论删除成功', 'success');
      // 从列表中移除已删除的评论
      wallContentInfo.value = wallContentInfo.value.filter(item => item.id !== commentID);
    } else {
      showSnackbar('删除失败：' + (res.data.msg || '未知错误'), 'error');
    }
  } catch (err) {
    console.error("删除评论出错：", err);
    showSnackbar('删除失败，请稍后重试', 'error');
  }
}

// 切换收藏状态
async function toggleFavorite() {
  if (!note.value) return;

  try {
    const res = await proxy.$Axios({
      method: 'post',
      url: '/noteService/favoriteNote',
      headers: {
        'Content-Type': 'application/json'
      },
      params: {
        noteId: note.value.noteID,
        isFavor: isFavorited.value ? false : true,
        id: collectionId.value
      }
    });

    if (res.data && res.data.code === "1") {
      isFavorited.value = !isFavorited.value;
      if (isFavorited.value) {
        collectionId.value = res.data.msg.id;
      }
      showSnackbar(isFavorited.value ? '收藏成功' : '取消收藏成功', 'success');
    } else {
      showSnackbar('操作失败：' + (res.data.msg || '未知错误'), 'error');
    }
  } catch (err) {
    console.error("收藏操作出错：", err);
    showSnackbar('操作失败，请稍后重试', 'error');
  }
}

// 删除帖子
async function deletePost() {
  if (!note.value) return;

  try {
    const res = await proxy.$Axios({
      method: 'post',
      url: '/noteService/deleteNote',
      headers: {
        'Content-Type': 'application/json'
      },
      params: {
        noteID: note.value.noteID
      }
    });

    if (res.data && res.data.code === "1") {
      showSnackbar('帖子删除成功', 'success');
      // 延迟跳转回列表页
      setTimeout(() => {
        proxy.$router.push('/wall');
      }, 1500);
    } else {
      showSnackbar('删除失败：' + (res.data.msg || '未知错误'), 'error');
    }
  } catch (err) {
    console.error("删除帖子出错：", err);
    showSnackbar('删除失败，请稍后重试', 'error');
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
  flex-wrap: wrap;
}

.floor-number {
  color: rgb(var(--v-theme-primary));
  font-weight: bold;
}

.username {
  font-weight: 500;
  font-size: 0.9rem;
}

.post-time {
  color: #666;
  font-size: 0.9em;
  margin-left: auto;
}

.post-time-footer {
  padding: 8px 16px 12px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  justify-content: flex-end;
}

.post-time-footer .post-time {
  margin-left: 0;
  font-size: 0.85em;
  color: #999;
}

.post-content {
  padding: 5px 16px 16px;
  line-height: 1.6;
}

.reply-reference {
  margin-bottom: 8px;
  padding: 8px;
  background-color: #f5f5f5;
  border-radius: 4px;
  font-size: 0.9em;
}

.delete-item:hover {
  background-color: #ffebee !important;
}

.text-red {
  color: #f44336 !important;
}

.delete-dialog {
  border-radius: 16px !important;
  overflow: hidden;
}

.dialog-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 24px 0;
  background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.1) 0%, rgba(var(--v-theme-primary), 0.05) 100%);
}

.delete-dialog .v-card-text {
  padding: 16px 24px;
}

.delete-dialog .v-card-actions {
  /* 使按钮垂直排列 */
  flex-direction: column;
  align-items: stretch;
  background-color: #fafafa;
  gap: 12px;
  /* 上下间距 */
}

.delete-dialog .v-btn {
  height: 44px;
  font-weight: 500;
  text-transform: none;
  letter-spacing: 0.5px;
}
</style>