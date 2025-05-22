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
      <!-- 评论输入区 -->
      <v-textarea
        v-model="commentContent"
        label="写下你的评论..."
        variant="outlined"
        auto-grow
        rows="4"
        class="mb-4"
      ></v-textarea>

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
import { ref, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getCurrentInstance } from 'vue'

const route = useRoute()
const router = useRouter()
const { proxy } = getCurrentInstance()

// 评论内容
const commentContent = ref('')
const isSubmitting = ref(false)

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
        replyTo: route.query.noteId
      }
    })

    if (res.data && res.data.code === '1') {
      showSnackbar('评论发布成功')
      setTimeout(() => {
        router.back()
      }, 1500)
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
</style>