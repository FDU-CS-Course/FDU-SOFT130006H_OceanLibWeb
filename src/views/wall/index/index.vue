<template>
  <div class="title">
    <div class="text-h5" style="margin:30px 30px">互助集市 <v-icon
        style="color: rgb(var(--v-theme-primary));">mdi-sticker</v-icon></div>
    <van-sticky :offset-top="0">
      <div class="wall__search">
        <v-toolbar style="background-color: rgb(var(--v-theme-primary));">
          <v-btn icon color="white" @click="toggleSearch">
            <v-icon>mdi-magnify</v-icon>
          </v-btn>
          <v-text-field hide-details v-model="searchString" single-line
            style="padding-left: 10px; flex-grow: 1; color: white;" @keyup.enter="toggleSearch"></v-text-field>
          <v-btn ref="filterBtn" icon color="white">
            <v-icon>mdi-filter</v-icon>
          </v-btn>

          <!-- 筛选下拉菜单 -->
          <v-menu v-model="isFilterMenuOpen" :activator="filterBtn" location="bottom center"
            transition="slide-y-transition">
            <v-list dense style="width: 75px;">
              <!-- "全部"选项 -->
              <v-list-item @click="clearFilter" :class="{ 'selected-item': selectedTag === null }">
                <v-list-item-title>全部</v-list-item-title>
              </v-list-item>

              <v-divider></v-divider>

              <!-- tag 列表 -->
              <v-list-item v-for="tag in tags" :key="tag.value" @click="applyTagFilter(tag.value)"
                :class="{ 'selected-item': selectedTag === tag.value }">
                <v-list-item-title>{{ tag.label }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
          <v-btn icon @click="refreshList" color="white">
            <v-icon>mdi-refresh</v-icon>
          </v-btn>
          <v-btn icon @click="goToFavorites" color="white">
            <v-icon>mdi-star</v-icon>
          </v-btn>
        </v-toolbar>
      </div>
    </van-sticky>
  </div>

  <!-- 加载状态 -->
  <div v-if="isLoading" class="text-center mt-5">
    <v-progress-circular indeterminate style="color: rgb(var(--v-theme-primary));"></v-progress-circular>
  </div>

  <!-- 错误提示 -->
  <div v-else-if="error" class="text-center mt-5 red--text">
    {{ error }}
    <v-btn @click="fetchWallData">重试</v-btn>
  </div>

  <!-- 内容卡片列表 -->
  <div class="wall">
    <div>
      <div v-for="(item, index) in wallInfo" :key="index">

        <v-card class="mx-auto mb-4" style="border-radius: 10px; background-color: white;"
          @click="goToDetail(item, $event)">
          <v-card-title style="padding: 25px 20px 15px;">
            <span class="wall__card__type text-h6" style="color: rgb(var(--v-theme-primary));">{{ getValueLabel(tags,
              item.tag) }}</span>
          </v-card-title>

          <v-card-text class="wall__card__content">
            <span v-if="searchMode && searchString" v-html="highlightSearchTerm(item.content, searchString)"></span>
            <span v-else>{{ item.content }}</span>
          </v-card-text>

          <v-card-actions>
            <div class="d-flex align-center justify-space-between w-100">
              <div class="d-flex align-center" style="padding-left: 20px;">
                <v-icon small class="mr-1" style="color: rgb(var(--v-theme-primary));">mdi-account-circle</v-icon>
                <span class="text-caption text--secondary">
                  {{ item.isAnon === true ? '匿名纸条' : item.buildUsername }}
                </span>
              </div>

              <div class="d-flex align-center" style="padding-right: 20px; font-size: 12px;">
                <!-- 点赞按钮 -->
                <v-btn icon small @click.stop="toggleLike(item, index)" :disabled="item.isLiking" class="like-btn">
                  <v-icon small :color="item.isLikedByCurrentUser ? 'red' : 'grey'" class="mr-1">
                    {{ item.isLikedByCurrentUser ? 'mdi-heart' : 'mdi-heart-outline' }}
                  </v-icon>
                </v-btn>
                <span class="text-caption mr-2">{{ item.likeNum || 0 }}</span>

                <span class="mr-1">·</span>
                <v-icon small class="mr-1" color="black">mdi-comment-eye</v-icon>
                <span class="text-caption mr-2">{{ item.readNum }}</span>

                <span class="mr-1">·</span>
                <v-icon small class="mr-1" color="black">mdi-comment</v-icon>
                <span class="text-caption">{{ item.commentNum }}</span>
              </div>
            </div>
          </v-card-actions>
        </v-card>
      </div>
    </div>
  </div>

  <!-- 底部导航栏 -->
  <div style="position: fixed;bottom: 0;left: 0;right: 0;">
    <v-bottom-navigation shift color="primary" grow class="index__bottom__navigation" v-model="navigation">
      <v-btn link to="/index">
        <span>文库</span>
        <v-icon>mdi-text-box-search</v-icon>
      </v-btn>
      <v-btn link to="/wall">
        <span>互助</span>
        <v-icon>mdi-handshake</v-icon>
      </v-btn>
      <v-btn link to="/mine">
        <span>我的</span>
        <v-icon>mdi-account-circle</v-icon>
      </v-btn>
    </v-bottom-navigation>
  </div>

  <!-- 发布按钮 -->
  <div style="position: fixed; bottom: 80px; right: 20px;">
    <v-btn v-model="fab" :color="fab ? 'white' : 'primary'" location="bottom end" icon size="small" fab>
      <v-icon :icon="fab ? 'mdi-close' : 'mdi-fountain-pen-tip'"></v-icon>

      <v-menu v-model="fab" activator="parent" location="top" transition="slide-y-reverse-transition">
        <v-btn style="background-color: rgb(var(--v-theme-primary)); margin-bottom: 20px;" color="white" variant="text"
          icon="mdi-pencil" size="small" fab to="/createNotePage"></v-btn>
      </v-menu>
    </v-btn>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { getCurrentInstance } from 'vue';

const tags = [
  { value: 'question', label: '问题' },
  { value: 'finditem', label: '寻物' },
  { value: 'help', label: '帮帮' },
  { value: 'findperson', label: '捞人' }
];

const { proxy } = getCurrentInstance();
const router = useRouter();

// 控制浮动按钮
const fab = ref(false);
const navigation = ref(1);

// 分页参数
const pageNo = ref(1);
const pageSize = ref(10);

// 墙数据
const wallInfo = ref([]);
const error = ref(null);

const searchString = ref('');
const searchMode = ref(false);

const originalWallInfo = ref([]);

const isLoading = ref(false);
const hasMore = ref(true);

const filterBtn = ref(null);

const isFilterMenuOpen = ref(false);
const selectedTag = ref(null);

/**
 * 切换点赞状态
 * @param {Object} item - 笔记项
 * @param {Number} index - 项目索引
 */
const toggleLike = async (item, index) => {
  // 防止重复点击
  if (item.isLiking) return;

  try {
    // 设置loading状态
    item.isLiking = true;

    // 获取当前点赞状态
    const isCurrentlyLiked = item.isLikedByCurrentUser;
    const newLikeStatus = !isCurrentlyLiked;

    // 调用后端API
    const res = await proxy.$Axios({
      method: 'post',
      url: '/noteService/likeNote',
      headers: {
        'Content-Type': 'application/json'
      },
      params: {
        noteId: item.noteID,
        isLike: newLikeStatus
      }
    });

    if (res.data && res.data.code === "1") {
      // 更新本地状态
      item.isLikedByCurrentUser = newLikeStatus;

      // 更新点赞数
      if (newLikeStatus) {
        item.likeNum = (item.likeNum || 0) + 1;
      } else {
        item.likeNum = Math.max((item.likeNum || 0) - 1, 0);
      }

      // 更新对应的原始数据
      const originalIndex = originalWallInfo.value.findIndex(
        originalItem => originalItem.noteID === item.noteID
      );
      if (originalIndex !== -1) {
        originalWallInfo.value[originalIndex].isLikedByCurrentUser = newLikeStatus;
        originalWallInfo.value[originalIndex].likeNum = item.likeNum;
      }

    } else {
      console.error("点赞操作失败：", res.data?.msg || "未知错误");
      // 可以添加用户提示
      proxy.$toast.error("点赞操作失败，请重试");
    }
  } catch (err) {
    console.error("点赞请求出错：", err);
    proxy.$toast.error("网络错误，请重试");
  } finally {
    // 清除loading状态
    item.isLiking = false;
  }
};

const handleScroll = () => {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const windowHeight = window.innerHeight;
  const scrollHeight = document.documentElement.scrollHeight;

  const scrollBottom = scrollHeight - (scrollTop + windowHeight);

  if (scrollBottom <= 50) {
    if (searchMode.value) {
      searchList(searchString.value);
    }
    else fetchWallData(true);
  }
};

onMounted(() => {
  fetchWallData();
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

const getValueLabel = (tags, value) => {
  const foundTag = tags.find(tag => tag.value === value);
  return foundTag ? foundTag.label : null;
};

const refreshList = () => {
  pageNo.value = 1;
  hasMore.value = true;
  window.scrollTo(0, 0);
  if (searchMode.value) searchList(true, searchString.value);
  else fetchWallData(false);
}

const toggleSearch = () => {
  if (searchString.value === "") {
    searchMode.value = false;
    pageNo.value = 1;
    hasMore.value = true;
    fetchWallData(false);
  }
  else {
    searchMode.value = true;
    pageNo.value = 1;
    hasMore.value = true;
    searchList(false, searchString.value);
  }
}

/**
 * 处理笔记数据，包括点赞状态
 * @param {Object} note - 后端返回的笔记数据
 * @returns {Object} 处理后的笔记数据
 */
const processNoteData = (note) => ({
  noteID: note.id,
  tag: note.tag,
  content: note.content,
  likeNum: note.likeNum || 0,
  commentNum: note.commentNum || 0,
  readNum: note.readNum || 0,
  buildDate: note.buildDate,
  buildUsername: note.buildUsername,
  isAnon: note.isAnon === 1,
  isAllowComment: note.isAllowComment === 1,
  isDeleted: note.isDeleted === 1,
  isLikedByCurrentUser: note.isLikedByCurrentUser === 1 || note.isLikedByCurrentUser === true,
  isLiking: false // 用于控制点赞按钮loading状态
});

const searchList = async (isLoadMore = false, searchString) => {
  if (isLoading.value || !hasMore.value) return;

  isLoading.value = true;

  try {
    const res = await proxy.$Axios({
      method: 'post',
      url: '/noteService/getNotesByKeywords',
      headers: {
        'Content-Type': 'application/json'
      },
      params: {
        searchString: searchString,
        pageNO: pageNo.value,
        pageSize: pageSize.value
      }
    });

    if (res.data && res.data.code === "1") {
      const list = res.data.msg.list.map(processNoteData);

      originalWallInfo.value = isLoadMore ? [...originalWallInfo.value, ...list] : [...list];

      if (selectedTag.value) {
        wallInfo.value = originalWallInfo.value.filter(item => item.tag === selectedTag.value);
      } else {
        wallInfo.value = [...originalWallInfo.value];
      }

      // 判断是否还有下一页
      if (list.length < pageSize.value) {
        hasMore.value = false;
      } else {
        pageNo.value += 1; // 只有成功加载才自增页码
      }
    } else {
      console.error("数据请求失败！");
      hasMore.value = false;
    }
  } catch (err) {
    console.error("请求出错：", err);
  } finally {
    isLoading.value = false;
  }
}

// 获取数据
const fetchWallData = async (isLoadMore = false) => {
  if (isLoading.value || !hasMore.value) return;

  isLoading.value = true;

  try {
    const res = await proxy.$Axios({
      method: 'post',
      url: '/noteService/getLatestNote',
      headers: {
        'Content-Type': 'application/json'
      },
      params: {
        pageNO: pageNo.value,
        pageSize: pageSize.value
      }
    });

    if (res.data && res.data.code === "1") {
      const list = res.data.msg.list.map(processNoteData);

      originalWallInfo.value = isLoadMore ? [...originalWallInfo.value, ...list] : [...list];

      if (selectedTag.value) {
        wallInfo.value = originalWallInfo.value.filter(item => item.tag === selectedTag.value);
      } else {
        wallInfo.value = [...originalWallInfo.value];
      }

      // 判断是否还有下一页
      if (list.length < pageSize.value) {
        hasMore.value = false;
      } else {
        pageNo.value += 1; // 只有成功加载才自增页码
      }
    } else {
      console.error("数据请求失败！");
      hasMore.value = false;
    }
  } catch (err) {
    console.error("请求出错：", err);
  } finally {
    isLoading.value = false;
  }
};

const applyTagFilter = (tagValue) => {
  selectedTag.value = tagValue;
  isFilterMenuOpen.value = false;

  // 如果有数据就过滤显示
  if (originalWallInfo.value) {
    wallInfo.value = originalWallInfo.value.filter(item => item.tag === tagValue);
  }
};

const clearFilter = () => {
  selectedTag.value = null;
  wallInfo.value = originalWallInfo.value;
};

const goToDetail = (item, event) => {
  event.preventDefault();
  router.push({
    path: '/wall/detail',
    query: {
      noteID: item.noteID,
      tag: item.tag,
      content: item.content,
      likeNum: item.likeNum,
      commentNum: item.commentNum,
      readNum: item.readNum,
      buildDate: item.buildDate,
      buildUsername: item.buildUsername,
      isAnon: item.isAnon,
      isAllowComment: item.isAllowComment,
      isDeleted: item.isDeleted,
      isLikedByCurrentUser: item.isLikedByCurrentUser,
    }
  });
};

const goToFavorites = () => {
  router.push({
    path: '/myCollectionList',
    query: { tab: 1 } // 1 表示"帖子"标签页
  });
};

const highlightSearchTerm = (text, searchTerm) => {
  if (!searchTerm || !text) return text;

  // 转义特殊字符以避免正则表达式错误
  const escapedSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  // 创建正则表达式，使用全局和忽略大小写标志
  const regex = new RegExp(`(${escapedSearchTerm})`, 'gi');

  // 替换匹配的文本为带有高亮样式的HTML
  return text.replace(regex, '<span class="highlight-text">$1</span>');
};
</script>

<style scoped lang="less">
.v-btn:not(.v-btn--round).v-size--default {
  height: -webkit-fill-available;
}

@import '~@/vant-variables.less';

.wall {
  display: flex;
  flex-direction: column;
  background-color: @gray-1;
  padding: 0px 20px;

  &__search {
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin-bottom: 10px;
  }

  &__card {
    &__title {
      margin: 10px;
    }

    &__type {
      font-size: 16px;
      padding-left: 5px;
    }

    &__content {
      font-size: 15px;
      padding: 0 22px 20px;
      word-break: break-all;
      word-wrap: break-word;
      line-break: anywhere;
    }
  }
}

.title {
  margin-bottom: 20px;
}

.selected-item {
  background-color: rgba(var(--v-theme-primary), 0.1) !important; // 浅蓝色背景
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 点赞按钮样式 */
.like-btn {
  min-width: auto !important;
  padding: 0 !important;
  margin-right: 4px !important;

  &:hover {
    background-color: rgba(255, 0, 0, 0.04) !important;
  }
}

/* 高亮搜索词样式 */
.highlight-text {
  background-color: rgba(var(--v-theme-primary), 0.2);
  color: rgb(var(--v-theme-primary));
  font-weight: bold;
}
</style>