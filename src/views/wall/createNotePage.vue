<template>
  <div class="post-container">
    <!-- 标题区域（含返回按钮） -->
    <div class="header-bar">
      <v-btn icon style="height: 0px;" @click="$router.back()" variant="text">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <h1 style="margin-top: 20px;" class="text-h4">发布新帖子</h1>
    </div>

    <div class="form-group">
      <label class="text-h5">选择标签</label>
      <div class="tag-selector">
        <button
            v-for="tag in tags"
            :key="tag.value"
            :class="{ active: selectedTag === tag.value }"
            @click="selectTag(tag.value)"
        >
          {{ tag.label }}
        </button>
      </div>
    </div>

    <div class="form-group">
      <label class="text-h5">发布设置</label>
      <div class="settings-options text-h6">
        <label>
          <input type="checkbox" v-model="isAnonymous" style="width: 18px; height: 18px;">
          匿名发布
        </label>
        <label>
          <input type="checkbox" v-model="allowComment" style="width: 18px; height: 18px;">
          允许评论
        </label>
      </div>
    </div>

    <div class="content-editor">
      <textarea v-model="content" placeholder="请在正确的分区发帖"></textarea>
    </div>

    <div class="preview-section text-h5">
      <h3 style="margin-bottom: 20px;">预览</h3>
      <div class="preview-content">{{ content }}</div>
    </div>

    <!-- 禁用条件：content 为空 -->
    <button class="submit-button" :disabled="!content.trim()" @click="submitPost">
      发布
    </button>
  </div>
</template>

<script setup>
import { getCurrentInstance, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const { proxy } = getCurrentInstance();

const content = ref('');
const selectedTag = ref('question');
const isAnonymous = ref(0);
const allowComment = ref(1); // 默认允许评论

const tags = [
  { value: 'question', label: '问题' },
  { value: 'finditem', label: '寻物' },
  { value: 'help', label: '帮帮' },
  { value: 'findperson', label: '捞人' }
];

const selectTag = (tag) => {
  selectedTag.value = tag;
};

const submitPost = () => {
  if (!content.value.trim()) {
    alert('内容不能为空，请输入内容后再发布。');
    return;
  }

  proxy.$Axios({
    method: 'post',
    url: '/noteService/createNote',
    params: {
      content: content.value,
      tag: selectedTag.value,
      isAnon: isAnonymous.value,
      isAllowComment: allowComment.value,
      buildUsername: sessionStorage.getItem('username')
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })
      .then(() => {
        router.back(); // 发布成功后返回上一页
      })
      .catch((error) => {
        console.error('发布失败:', error);
        alert('发布失败，请重试');
      });
};
</script>

<style scoped>
.header-bar {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.back-button {
  font-size: 20px;
  background: none;
  border: none;
  cursor: pointer;
  margin-right: 10px;
  color: #4CAF50;
}

.post-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
}

.tag-selector {
  display: flex;
  gap: 10px;
}

.tag-selector button {
  padding: 8px 15px;
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
}

.tag-selector button.active {
  background-color: #e0e0ff;
  border-color: #a0a0ff;
}

.content-editor textarea {
  width: 100%;
  min-height: 150px;
  resize: vertical;
  font-size: 13px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.preview-section {
  margin: 20px 0;
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 4px;
  background-color: #f9f9f9;
  overflow-wrap: break-word;
}

.preview-section h3 {
  margin-top: 0;
  color: #666;
}

.submit-button {
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.submit-button:hover {
  background-color: #45a049;
}

.submit-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>