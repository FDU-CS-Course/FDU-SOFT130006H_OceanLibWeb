<template>
  <div class="post-container">
    <h1 style="margin-top: 20px;" class="text-h4">发布新帖子</h1>

    <div class="form-group">
      <label for="post-title" class="text-h5">标题</label>
      <input id="post-title" v-model="title" type="text" class="text-h5" placeholder="输入标题">
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

    <div class="content-editor">
      <textarea v-model="content" placeholder="请在正确的分区发帖"></textarea>
    </div>

    <div class="preview-section text-h5">
      <h3>预览</h3>
      <div class="preview-content">{{ content }}</div>
    </div>

    <button class="submit-button" @click="submitPost">发布</button>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const title = ref('');
const content = ref('');
const selectedTag = ref('question');

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
  console.log('提交帖子:', {
    title: title.value,
    content: content.value,
    tag: selectedTag.value
  });
  // 这里可以添加实际的提交逻辑
};
</script>

<style scoped>
.post-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

h1 {
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
}

input[type="text"], textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
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

.toolbar {
  display: flex;
  gap: 10px;
  margin: 15px 0;
}

.tool-button {
  padding: 8px 12px;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
}

.content-editor textarea {
  min-height: 150px;
  resize: vertical;
  font-size: 13px;
}

.preview-section {
  margin: 20px 0;
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 4px;
  background-color: #f9f9f9;
}

.preview-section h3 {
  margin-top: 0;
  color: #666;
}

.preview-content {
  min-height: 50px;
  padding: 10px;
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

.moderator-icon {
  color: #ff5722;
  font-weight: bold;
}
</style>