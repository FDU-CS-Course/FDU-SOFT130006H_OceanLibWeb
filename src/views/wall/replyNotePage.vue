<template>
  <div class="reply-note">
    <v-app-bar color="white" elevation="1">
      <v-btn icon @click="$router.back()">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-toolbar-title class="text-h6">发表评论</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-app-bar>

    <div class="reply-content pa-4">
      <!-- 回复对象信息 -->
      <v-card class="mb-4 reply-to-card" variant="outlined">
        <v-card-text>
          <div class="d-flex align-center">
            <v-icon class="mr-2">mdi-reply</v-icon>
            <span class="text-body-1">回复 {{ isAnon ? "匿名纸条" : replyToUsername }}</span>
          </div>
          <div class="original-content mt-2">{{ originalContent }}</div>
        </v-card-text>
      </v-card>

      <!-- 评论输入区 -->
      <v-textarea
        v-model="commentContent"
        label="写下你的评论..."
        variant="outlined"
        auto-grow
        rows="4"
        class="mb-4"
      ></v-textarea>

      <!-- 预览区域 -->
      <v-card v-if="commentContent && username" class="mb-4 preview-card">
        <div class="post-header">
          <span class="username">{{ username }}</span>
          <span class="post-time">预览</span>
        </div>
        <v-card-text class="post-content">
          <div v-if="replyToUsername" class="reply-reference mb-2">
            <span class="font-weight-bold">@{{ isAnon ? "匿名纸条" : replyToUsername }}</span>
          </div>
          {{ commentContent }}
        </v-card-text>
      </v-card>

      <v-btn
        block
        color="primary"
        size="large"
        @click="submitComment"
        :disabled="!commentContent.trim() || isSubmitting"
        :loading="isSubmitting"
      >
        发布
      </v-btn>
    </div>

    <!-- 提示消息 -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="3000"
    >
      {{ snackbar.text }}
    </v-snackbar>
  </div>
</template>

<script setup>
import {ref, reactive, onMounted} from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getCurrentInstance } from 'vue'

const route = useRoute()
const router = useRouter()
const { proxy } = getCurrentInstance()

// 评论内容
const commentContent = ref('')
const isSubmitting = ref(false)
const username = ref('')  // 新增用户名ref
const isAnon = ref(false)

// 提示消息控制
const snackbar = reactive({
  show: false,
  text: '',
  color: 'success'
})

// 显示提示消息
const showSnackbar = (text, color = 'success') => {
  snackbar.text = text
  snackbar.color = color
  snackbar.show = true
}

// 提交评论
const submitComment = async () => {
  if (!commentContent.value.trim() || isSubmitting.value) return

  isSubmitting.value = true
  try {
    const res = await proxy.$Axios({
      method: 'post',
      url: '/noteService/createNoteComment',
      headers: {
        'Content-Type': 'application/json'
      },
      params: {
        noteId: route.query.noteId,
        userName: sessionStorage.getItem('username'),
        commentContent: commentContent.value.trim(),
        replyTo: route.query.replyToId,
        replyToUsername: route.query.replyToUsername
      }
    })

    if (res.data && res.data.code === '1') {
      showSnackbar('评论发布成功')
      await router.push('/wall')
    } else {
      showSnackbar(res.data?.msg || '评论发布失败', 'error')
    }
  } catch (error) {
    console.error('评论发布失败：', error)
    showSnackbar('评论发布失败，请稍后重试', 'error')
  } finally {
    isSubmitting.value = false
  }
}

// 回复对象信息
const replyToUsername = ref('')
const originalContent = ref('')

onMounted(async () => {
  const noteId = route.query.noteId
  const replyToId = route.query.replyToId || noteId
  replyToUsername.value = route.query.replyToUsername || ''
  originalContent.value = route.query.replyToContent || ''
  username.value = sessionStorage.getItem('username') || ''  // 在onMounted中获取用户名
  isAnon.value = route.query.isAnon
})
</script>

<style scoped>
.reply-note {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.reply-content {
  max-width: 800px;
  margin: 0 auto;
  padding-top: 20px;
}

.reply-to-card {
  background-color: white;
  border-radius: 12px;
}

.original-content {
  color: #666;
  font-size: 0.9em;
  line-height: 1.4;
}

.preview-card {
  border-radius: 12px;
  background-color: white;
  transition: all 0.3s ease;
}

.post-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 16px 8px;
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