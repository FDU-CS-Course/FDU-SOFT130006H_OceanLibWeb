<template>
  <div class="post-container">
    <!-- 顶部导航栏 -->
    <v-app-bar style="background-color: rgb(var(--v-theme-primary));" elevation="1">
      <v-btn icon @click="$router.back()" color="white">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-toolbar-title class="text-h6" style="color: white;">发布新帖子</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-app-bar>

    <div class="content-area">
      <!-- 标签选择 -->
      <div class="form-section">
        <h3 class="section-title">选择标签</h3>
        <div class="tag-selector">
          <v-btn v-for="tag in tags" :key="tag.value" :variant="selectedTag === tag.value ? 'flat' : 'outlined'"
            :color="selectedTag === tag.value ? 'primary' : 'default'" class="tag-btn" @click="selectTag(tag.value)">
            {{ tag.label }}
          </v-btn>
        </div>
      </div>

      <!-- 发布设置 -->
      <div class="form-section">
        <h3 class="section-title">发布设置</h3>
        <div class="settings-group">
          <v-checkbox v-model="isAnonymous" label="匿名发布" color="primary" class="setting-item"></v-checkbox>
          <v-checkbox v-model="allowComment" label="允许评论" color="primary" class="setting-item"></v-checkbox>
        </div>
      </div>

      <!-- 内容编辑器 -->
      <div class="form-section">
        <v-textarea v-model="content" label="请在正确的分区发帖" variant="outlined" auto-grow rows="6" color="primary"
          class="content-input"></v-textarea>
      </div>

      <!-- 发布按钮 -->
      <v-btn block color="primary" size="large" :disabled="!content.trim() || isSubmitting" :loading="isSubmitting"
        @click="submitPost" class="submit-btn">
        发布
      </v-btn>
    </div>

    <!-- 提示消息 -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000">
      {{ snackbar.text }}
    </v-snackbar>
  </div>
</template>

<script setup>
import { getCurrentInstance, ref, reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const { proxy } = getCurrentInstance();

const content = ref('');
const selectedTag = ref('question');
const isAnonymous = ref(false);
const allowComment = ref(true);
const isSubmitting = ref(false);

// 提示消息控制
const snackbar = reactive({
  show: false,
  text: '',
  color: 'success'
});

const tags = [
  { value: 'question', label: '问题' },
  { value: 'finditem', label: '寻物' },
  { value: 'help', label: '帮帮' },
  { value: 'findperson', label: '捞人' }
];

// 显示提示消息
const showSnackbar = (text, color = 'success') => {
  snackbar.text = text;
  snackbar.color = color;
  snackbar.show = true;
};

const getUserName = () => {
  return (sessionStorage.getItem('username') || '用户')
}

const selectTag = (tag) => {
  selectedTag.value = tag;
};

const submitPost = async () => {
  if (!content.value.trim()) {
    showSnackbar('内容不能为空，请输入内容后再发布', 'error');
    return;
  }

  isSubmitting.value = true;

  try {
    const res = await proxy.$Axios({
      method: 'post',
      url: '/noteService/createNote',
      params: {
        content: content.value,
        tag: selectedTag.value,
        isAnon: isAnonymous.value === false ? 0 : 1,
        isAllowComment: allowComment.value === false ? 0 : 1
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (res.data && res.data.code === '1') {
      showSnackbar('帖子发布成功，即将返回...');
      setTimeout(() => {
        router.push('/wall');
      }, 2000);
    } else {
      showSnackbar(res.data?.msg || '发布失败，请重试', 'error');
    }
  } catch (error) {
    console.error('发布失败:', error);
    showSnackbar('发布失败，请重试', 'error');
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
.post-container {
  min-height: 93vh;
  background-color: #f5f5f5;
}

.content-area {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.form-section {
  margin-bottom: 24px;
}

.form-section:first-child {
  margin-top: 0;
}

.section-title {
  color: rgb(var(--v-theme-primary));
  font-size: 1.1rem;
  font-weight: 600;
}

.tag-selector {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.tag-btn {
  text-transform: none;
  font-weight: 500;
}

.settings-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.setting-item {
  height: 40px;
  margin: 0;
}

.content-input {
  margin-bottom: 16px;
}

.preview-card {
  border-radius: 12px;
  background-color: white;
}

.post-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 16px 8px;
}

.floor-number {
  color: rgb(var(--v-theme-primary));
  font-weight: bold;
  font-size: 0.9rem;
}

.username {
  font-weight: 500;
  font-size: 0.9rem;
}

.post-time {
  color: #666;
  font-size: 0.8rem;
}

.preview-content {
  padding: 0 16px 16px;
  line-height: 1.6;
  word-break: break-word;
}

.submit-btn {
  margin-top: 20px;
  height: 48px;
  font-size: 1rem;
  font-weight: 600;
  text-transform: none;
}
</style>