<template>
  <div class="title">
    <div class="text-h5" style="margin:30px 30px">互助集市 <v-icon color="orange">mdi-sticker</v-icon></div>
    <van-sticky :offset-top="0">
      <div class="wall__search">
        <v-toolbar color="black">
          <v-text-field hide-details prepend-icon="mdi-magnify" single-line style="padding-left: 20px;"></v-text-field>
          <v-btn icon>
            <v-icon>mdi-filter</v-icon>
          </v-btn>
          <v-btn icon @click="refreshList">
            <v-icon>mdi-refresh</v-icon>
          </v-btn>
        </v-toolbar>
      </div>
    </van-sticky>
  </div>

  <!-- 加载状态 -->
  <div v-if="isLoading" class="text-center mt-5">
    <v-progress-circular indeterminate color="black"></v-progress-circular>
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

        <v-card
            class="mx-auto mb-4"
            style="border-radius: 10px; background-color: white;"
            @click="goToDetail(item)"
        >
          <v-card-title style="padding: 25px 20px 15px;">
            <span class="wall__card__type text-h6">{{ getValueLabel(tags, item.tag) }}</span>
          </v-card-title>

          <v-card-text class="wall__card__content">
            {{ item.content }}
          </v-card-text>

          <v-card-actions>
            <div class="d-flex align-center justify-space-between w-100">
              <div class="text-h6" style="padding-left: 30px;"></div>

              <div class="d-flex align-center" style="padding-right: 20px; font-size: 12px;">
                <v-icon small class="mr-1">mdi-comment-eye</v-icon>
                <span class="text-caption mr-2">{{ item.readNum }}</span>
                <span class="mr-1">·</span>
                <v-icon small class="mr-1">mdi-comment</v-icon>
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
    <v-btn
        v-model="fab"
        :color="fab ? 'white' : 'orange'"
        location="bottom end"
        icon
        size="small"
        fab
    >
      <v-icon :icon="fab ? 'mdi-close' : 'mdi-fountain-pen-tip'"></v-icon>

      <v-menu
          v-model="fab"
          activator="parent"
          location="top"
          transition="slide-y-reverse-transition"
      >
        <v-btn
            style="background-color:green; margin-bottom: 20px;"
            color="white"
            variant="text"
            icon="mdi-pencil"
            size="small"
            fab
            to="/createNotePage"
        ></v-btn>
        <v-btn
            style="background-color:red; margin-bottom: 20px;"
            color="white"
            variant="text"
            icon="mdi-delete"
            size="small"
            fab
        ></v-btn>
      </v-menu>
    </v-btn>
  </div>
</template>

<script setup>
import {ref, onMounted, onUnmounted} from 'vue';
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

const isLoading = ref(false);
const hasMore = ref(true);

const handleScroll = () => {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const windowHeight = window.innerHeight;
  const scrollHeight = document.documentElement.scrollHeight;

  const scrollBottom = scrollHeight - (scrollTop + windowHeight);

  if (scrollBottom <= 50) {
    fetchWallData(true);
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
  fetchWallData(false);
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
      const list = res.data.msg.list.map(note => ({
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
      }));

      // 如果是加载更多，则追加；否则替换
      if (isLoadMore) {
        wallInfo.value = [...wallInfo.value, ...list];
      } else {
        wallInfo.value = list;
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

const goToDetail = (item) => {
  router.push({
    path: '/wall/detail',
    query: {
      id: item.noteID
    }
  });
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
</style>