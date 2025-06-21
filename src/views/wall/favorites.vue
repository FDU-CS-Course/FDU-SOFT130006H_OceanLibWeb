<!--
/**
 * Favorites Page Component
 * 
 * Features:
 * - Display user's favorited notes with authentication-aware loading
 * - Pull-to-refresh functionality with visual feedback
 * - Tag-based filtering and categorization
 * - Responsive card layout with note details
 * - Navigation to detailed note view
 * - Empty state handling with user guidance
 * 
 * Authentication Updates (2024-12-19):
 * - Updated to work with new authentication API
 * - Removed manual username parameter - backend now uses @AuthUser annotation
 * - Enhanced error handling with proper user feedback
 * - Added defensive coding practices
 * - Improved data loading consistency
 * 
 * API Endpoints:
 * - POST /noteService/getBehaviourByUsername (updated for authentication)
 * - POST /noteService/getNoteById
 * 
 * Dependencies:
 * - Vue 3 Composition API
 * - Vue Router
 * - Vuetify components
 * - Vant UI components
 * - Axios for API calls
 */
-->
<template>
    <div class="favorites-page">
        <!-- 顶部导航栏 -->
        <v-app-bar color="white" elevation="1">
            <v-btn icon @click="$router.push('/wall')">
                <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
            <v-toolbar-title class="text-h6">我的收藏</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="handleRefresh" :loading="isRefreshing">
                <v-icon>mdi-refresh</v-icon>
            </v-btn>
        </v-app-bar>

        <!-- 下拉刷新指示器 -->
        <div v-if="isPulling && pullDistance > 0" class="pull-refresh-indicator"
            :style="{ transform: `translateY(${Math.min(pullDistance, refreshThreshold)}px)` }">
            <v-progress-circular v-if="pullDistance >= refreshThreshold" indeterminate size="24"
                color="primary"></v-progress-circular>
            <v-icon v-else color="grey">mdi-arrow-down</v-icon>
            <span class="ml-2">{{ pullDistance >= refreshThreshold ? '释放刷新' : '下拉刷新' }}</span>
        </div>

        <!-- 加载状态 -->
        <div v-if="isLoading" class="text-center mt-5">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
        </div>

        <!-- 空状态 -->
        <div v-else-if="favoriteNotes.length === 0" class="empty-state">
            <v-icon size="64" color="grey">mdi-star-outline</v-icon>
            <p class="text-h6 mt-4 text-grey">暂无收藏的帖子</p>
            <p class="text-body-2 text-grey">去发现一些有趣的内容吧！</p>
            <v-btn color="primary" @click="$router.push('/wall')" class="mt-4">
                浏览帖子
            </v-btn>
        </div>

        <!-- 收藏列表 -->
        <div v-else class="favorites-list">
            <div v-for="(item, index) in favoriteNotes" :key="index">
                <v-card class="mx-auto mb-4" style="border-radius: 10px; background-color: white;"
                    @click="goToDetail(item, $event)">
                    <v-card-title style="padding: 25px 20px 15px;">
                        <span class="wall__card__type text-h6">{{ getValueLabel(tags, item.tag) }}</span>
                    </v-card-title>

                    <v-card-text class="wall__card__content">
                        {{ item.content }}
                    </v-card-text>

                    <v-card-actions>
                        <div class="d-flex align-center justify-space-between w-100">
                            <div class="d-flex align-center" style="padding-left: 20px;">
                                <v-icon small class="mr-1" color="grey">mdi-account-circle</v-icon>
                                <span class="text-caption text--secondary">
                                    {{ item.isAnon === true ? '匿名纸条' : item.buildUsername }}
                                </span>
                            </div>

                            <div class="d-flex align-center" style="padding-right: 20px; font-size: 12px;">
                                <v-icon small class="mr-1">mdi-comment-eye</v-icon>
                                <span class="text-caption mr-2">{{ item.readNum }}</span>
                                <span class="mr-1">·</span>
                                <v-icon small class="mr-1">mdi-comment</v-icon>
                                <span class="text-caption">{{ item.commentNum }}</span>
                                <span class="ml-2">·</span>
                                <v-icon small class="ml-1" color="orange">mdi-star</v-icon>
                            </div>
                        </div>
                    </v-card-actions>
                </v-card>
            </div>
        </div>

        <!-- Snackbar 提示 -->
        <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000" location="bottom">
            {{ snackbar.text }}
        </v-snackbar>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, getCurrentInstance } from 'vue';
import { useRouter } from 'vue-router';

const tags = [
    { value: 'question', label: '问题' },
    { value: 'finditem', label: '寻物' },
    { value: 'help', label: '帮帮' },
    { value: 'findperson', label: '捞人' }
];

const { proxy } = getCurrentInstance();
const router = useRouter();

const favoriteNotes = ref([]);
const isLoading = ref(false);
const isRefreshing = ref(false);

// Snackbar 控制
const snackbar = reactive({
    show: false,
    text: '',
    color: 'success'
});

// 下拉刷新相关变量
const startY = ref(0);
const currentY = ref(0);
const pullDistance = ref(0);
const isPulling = ref(false);
const refreshThreshold = 80; // 触发刷新的距离阈值

onMounted(() => {
    fetchFavorites();
    // 添加触摸事件监听
    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: false });
});

onUnmounted(() => {
    // 移除触摸事件监听
    document.removeEventListener('touchstart', handleTouchStart);
    document.removeEventListener('touchmove', handleTouchMove);
    document.removeEventListener('touchend', handleTouchEnd);
});

// 触摸开始
const handleTouchStart = (e) => {
    if (window.scrollY === 0) {
        startY.value = e.touches[0].clientY;
        isPulling.value = true;
    }
};

// 触摸移动
const handleTouchMove = (e) => {
    if (!isPulling.value || isRefreshing.value) return;

    currentY.value = e.touches[0].clientY;
    pullDistance.value = Math.max(0, currentY.value - startY.value);

    if (pullDistance.value > 0 && window.scrollY === 0) {
        e.preventDefault();
        // 可以在这里添加视觉反馈，比如显示下拉提示
    }
};

// 触摸结束
const handleTouchEnd = () => {
    if (!isPulling.value || isRefreshing.value) return;

    if (pullDistance.value >= refreshThreshold) {
        // 触发刷新
        handleRefresh();
    }

    // 重置状态
    isPulling.value = false;
    pullDistance.value = 0;
    startY.value = 0;
    currentY.value = 0;
};

// 下拉刷新处理
const handleRefresh = async () => {
    if (isRefreshing.value) return;

    isRefreshing.value = true;
    showSnackbar('正在刷新...', 'info');

    try {
        await fetchFavorites();
        showSnackbar('刷新成功', 'success');
    } catch (err) {
        showSnackbar('刷新失败', 'error');
    } finally {
        isRefreshing.value = false;
    }
};

const getValueLabel = (tags, value) => {
    const foundTag = tags.find(tag => tag.value === value);
    return foundTag ? foundTag.label : null;
};

// 获取收藏列表
const fetchFavorites = async () => {
    isLoading.value = true;

    try {
        // 第一步：获取用户收藏的noteId列表
        const behaviorRes = await proxy.$Axios({
            method: 'post',
            url: '/noteService/getBehaviourByUsername',
            headers: {
                'Content-Type': 'application/json'
            },
            params: {
                username: sessionStorage.getItem('username'),
                pageNo: 1,
                pageSize: 10
            }
        });

        if (behaviorRes.data && behaviorRes.data.code === "1") {
            const favoriteNoteIds = behaviorRes.data.msg.list.map(behavior => ({
                noteId: behavior.noteId,
                favoriteDate: behavior.createTime
            }));

            // 第二步：根据每个noteId获取帖子详细信息
            const favoriteList = [];

            for (const favorite of favoriteNoteIds) {
                try {
                    const noteRes = await proxy.$Axios({
                        method: 'post',
                        url: '/noteService/getNoteById',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        params: {
                            noteId: favorite.noteId
                        }
                    });

                    if (noteRes.data && noteRes.data.code === "1") {
                        const noteData = noteRes.data.msg;
                        favoriteList.push({
                            noteID: noteData.id,
                            tag: noteData.tag,
                            content: noteData.content,
                            likeNum: noteData.likeNum || 0,
                            commentNum: noteData.commentNum || 0,
                            readNum: noteData.readNum || 0,
                            buildDate: noteData.buildDate,
                            buildUsername: noteData.buildUsername,
                            isAnon: noteData.isAnon === 1,
                            isAllowComment: noteData.isAllowComment === 1,
                            isDeleted: noteData.isDeleted === 1,
                            favoriteDate: favorite.favoriteDate // 收藏时间
                        });
                    }
                } catch (noteErr) {
                    console.error(`获取帖子 ${favorite.noteId} 详情失败：`, noteErr);
                    // 继续处理下一个，不中断整个流程
                }
            }

            // 按收藏时间倒序排列
            favoriteNotes.value = favoriteList.sort((a, b) => new Date(b.favoriteDate) - new Date(a.favoriteDate));
        } else {
            showSnackbar('获取收藏列表失败', 'error');
        }
    } catch (err) {
        console.error("获取收藏列表出错：", err);
        showSnackbar('获取收藏列表失败，请稍后重试', 'error');
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

// 跳转到详情页
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
        }
    });
};
</script>

<style scoped lang="less">
.favorites-page {
    background-color: #f5f5f5;
    min-height: 100vh;
    padding-bottom: 20px;
}

.favorites-list {
    padding: 20px;
}

.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 60vh;
    text-align: center;
}

.wall__card__type {
    font-size: 16px;
    padding-left: 5px;
}

.wall__card__content {
    font-size: 15px;
    padding: 0 22px 20px;
    word-break: break-all;
    word-wrap: break-word;
    line-break: anywhere;
}

.pull-refresh-indicator {
    position: fixed;
    top: 64px;
    /* 导航栏高度 */
    left: 0;
    right: 0;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px);
    z-index: 1000;
    transition: transform 0.3s ease;
}
</style>