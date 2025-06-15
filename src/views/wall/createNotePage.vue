<template>
  <div class="post-container">
    <!-- 标题区域（含返回按钮） -->
    <div class="header-bar">
      <v-btn icon style="margin-left: -5px;" @click="$router.back()" variant="text">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <h1 style="" class="text-h5">发布新帖子</h1>
    </div>

    <div class="form-group">
      <label class="text-h6" style = "margin-bottom: 20px;">选择标签</label>
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
      <label class="text-h6" style="margin-bottom: 20px;">发布设置</label>
      <div class="text-h7">
        <label>
          <input type="checkbox" v-model="isAnonymous" style="width: 18px; height: 18px; vertical-align: middle;">
          <span style="margin-left: 15px;">匿名发布</span>
        </label>
        <label>
          <input type="checkbox" v-model="allowComment" style="width: 18px; height: 18px; vertical-align: middle;">
          <span style="margin-left: 15px;">允许评论</span>
        </label>
      </div>
    </div>

    <div class="content-editor">
      <textarea v-model="content" placeholder="请在正确的分区发帖" style="font-size: 16px;"></textarea>
    </div>

    <div class="preview-section">
      <span style="font-size: 20px;">预览</span>
      <div class="preview-content">{{ content }}</div>
    </div>

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
const isAnonymous = ref(false);
const allowComment = ref(true); // 默认允许评论

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
      isAnon: isAnonymous.value === false ? 0 : 1,
      isAllowComment: allowComment.value === false ? 0 : 1
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

.post-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.form-group {
  margin-bottom: 30px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
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
  width: 100%;
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

.preview-content {
  margin-top: 15px;
}
</style>