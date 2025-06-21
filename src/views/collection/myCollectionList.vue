<style scoped lang="less">
@import '~@/vant-variables.less';
.collectionlist {
  margin-top: 10px;
  &__box {
    padding: 10px 20px;
    &__title {
      margin-right: 10px;
    }
  }
}

.favorites-list {
  padding: 20px;
  background-color: #f5f5f5;
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

.note-card {
  border-radius: 10px;
  background-color: white;
  margin-bottom: 16px;
  
  &__title {
    padding: 25px 20px 15px;
  }
  
  &__content {
    padding: 0 22px 20px;
  }
  
  &__actions {
    padding: 0 20px 20px;
  }
}
</style>
<template>
  <div class="page">
    <van-nav-bar id="toolbar" title="我的收藏" left-text="返回" left-arrow @click-left="back" fixed placeholder @click-right="handleRightClick">
      <template #right>
        <a>{{ activeTab === 0 ? '新增' : '刷新' }}</a>
      </template>
    </van-nav-bar>
    <div class="collectionlist full">
      <van-tabs v-model:active="activeTab" @change="onTabChange">
        <van-tab v-for="(item, index) in collections" :key="index" :title="item.title">
          <!-- 文档收藏夹 -->
          <div v-if="item.mainType === 'DOCUMENT'">
            <van-pull-refresh v-model="refreshing" @refresh="getCollection(item.mainType)" class="full">
              <van-list v-model:loading="loading" :finished="finished" @load="getCollection(item.mainType)">
                <div v-for="(item, index) in myCollection" :key="index">
                  <van-swipe-cell>
                    <van-cell
                      class="collectionlist__box"
                      :label="item.items.length + ' 个内容 · ' + (item.isPublic ? '公开收藏夹' : '私密收藏夹')"
                      @click="showItem(item.collectionID, item.name, item.desc, item.isPublic)"
                    >
                      <template #title>
                        <span class="collectionlist__box__title">{{ item.name }}</span>
                        <v-icon size="20" color="primary" v-if="!item.isPublic">mdi-eye-remove-outline</v-icon>
                      </template>
                    </van-cell>
                    <template #right>
                      <van-button
                        square
                        text="修改"
                        type="danger"
                        style="height: 100%"
                        @click="toChangeCollection(item.collectionID, item.name, item.desc, item.isPublic)"
                      />
                    </template>
                  </van-swipe-cell>
                </div>
                <template #finished>
                  <!--若无收藏夹则显示空提示-->
                  <van-empty description="您尚未建立收藏夹" v-if="myCollection.length == 0">
                    <template v-slot:image>
                      <img :src="require('@/images/empty-picture/no_data.svg')" />
                    </template>
                    <template>
                      <v-btn color="primary" small @click="$router.push('/newCollection')">
                        新增收藏夹
                        <v-icon right dark> mdi-star-plus </v-icon>
                      </v-btn>
                    </template>
                  </van-empty>
                  <div v-else class="notice-nomore__text">没有更多的收藏了</div>
                </template>
              </van-list>
            </van-pull-refresh>
          </div>
          
          <!-- 帖子收藏 -->
          <div v-else-if="item.mainType === 'NOTE'" class="favorites-list">
            <van-pull-refresh v-model="notesRefreshing" @refresh="fetchFavorites">
              <!-- 加载状态 -->
              <div v-if="notesLoading" class="text-center" style="padding: 20px;">
                <van-loading size="24px" />
                <div style="margin-top: 10px;">加载中...</div>
              </div>

              <!-- 空状态 -->
              <van-empty v-else-if="favoriteNotes.length === 0" description="暂无收藏的帖子">
                <template v-slot:image>
                  <img :src="require('@/images/empty-picture/no_data.svg')" />
                </template>
                <template>
                  <van-button type="primary" @click="$router.push('/wall')">
                    浏览帖子
                  </van-button>
                </template>
              </van-empty>

              <!-- 收藏列表 -->
              <div v-else>
                <div v-for="(note, index) in favoriteNotes" :key="index">
                  <div class="note-card" @click="goToDetail(note)">
                    <div class="note-card__title">
                      <span class="wall__card__type">{{ getValueLabel(tags, note.tag) }}</span>
                    </div>

                    <div class="note-card__content wall__card__content">
                      {{ note.content }}
                    </div>

                    <div class="note-card__actions">
                      <div style="display: flex; align-items: center; justify-content: space-between;">
                        <div style="display: flex; align-items: center;">
                          <van-icon name="user-circle-o" size="14px" color="#999" />
                          <span style="font-size: 12px; color: #999; margin-left: 4px;">
                            {{ note.isAnon === true ? '匿名纸条' : note.buildUsername }}
                          </span>
                        </div>

                        <div style="display: flex; align-items: center; font-size: 12px; color: #999;">
                          <van-icon name="eye-o" size="12px" />
                          <span style="margin-left: 2px; margin-right: 8px;">{{ note.readNum }}</span>
                          <span style="margin-right: 8px;">·</span>
                          <van-icon name="chat-o" size="12px" />
                          <span style="margin-left: 2px; margin-right: 8px;">{{ note.commentNum }}</span>
                          <span style="margin-right: 4px;">·</span>
                          <van-icon name="star" size="12px" color="#ff8c00" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </van-pull-refresh>
          </div>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import { showToast } from 'vant';

export default {
  data() {
    return {
      activeTab: 0,
      myCollection: [],
      refreshing: false,
      loading: false,
      finished: false,
      collections: [{
        "title": "文档",
        "mainType": "DOCUMENT"
      }, {
        "title": "帖子", 
        "mainType": "NOTE"
      }],
      // 帖子收藏相关数据
      favoriteNotes: [],
      notesLoading: false,
      notesRefreshing: false,
      tags: [
        { value: 'question', label: '问题' },
        { value: 'finditem', label: '寻物' },
        { value: 'help', label: '帮帮' },
        { value: 'findperson', label: '捞人' }
      ]
    };
  },
  mounted() {
    // 检查是否有tab查询参数
    const tabParam = this.$route.query.tab;
    if (tabParam !== undefined) {
      this.activeTab = parseInt(tabParam);
    }
    
    // 根据当前tab加载对应数据
    this.loadCurrentTabData();
  },
  methods: {
    back() {
      this.$router.push('/mine');
    },
    
    handleRightClick() {
      if (this.activeTab === 0) {
        // 文档tab - 新增收藏夹
        this.$router.push('/newCollection');
      } else {
        // 帖子tab - 刷新
        this.fetchFavorites();
      }
    },
    
    onTabChange(index) {
      this.activeTab = index;
      this.loadCurrentTabData();
    },
    
    loadCurrentTabData() {
      const currentCollection = this.collections[this.activeTab];
      if (currentCollection.mainType === 'DOCUMENT') {
        this.getCollection(currentCollection.mainType);
      } else if (currentCollection.mainType === 'NOTE') {
        this.fetchFavorites();
      }
    },
    
    getCollection(mainType) {
      this.$Axios({
        method: 'get',
        url: '/collectionService/getCollection',
        params: {
          mainType: "DOCUMENT"
        }
      }).then((response) => {
        this.myCollection = response.data.msg.collection;
        this.loading = false;
        this.refreshing = false;
        this.finished = true; //一次性全部加载，直接完成
      });
    },
    
    showItem(collectionID, collectionName, collectionDesc, isPublic) {
      this.$router.push({
        path: '/myCollectionItem',
        query: {
          collectionID: collectionID,
          collectionName: collectionName,
          collectionDesc: collectionDesc,
          isPublic: isPublic,
        },
      });
    },
    
    toChangeCollection(collectionID, collectionName, collectionDesc, isPublic) {
      this.$router.push({
        path: '/newCollection',
        query: {
          collectionID: collectionID,
          collectionName: collectionName,
          collectionDesc: collectionDesc,
          isPublic: isPublic,
          isChange: true,
        },
      });
    },
    
    // 帖子相关方法
    getValueLabel(tags, value) {
      const foundTag = tags.find(tag => tag.value === value);
      return foundTag ? foundTag.label : value;
    },
    
    // 获取收藏的帖子列表
    async fetchFavorites() {
      this.notesLoading = true;
      this.notesRefreshing = true;

      try {
        // 第一步：获取用户收藏的noteId列表
        const behaviorRes = await this.$Axios({
          method: 'post',
          url: '/noteService/getBehaviourByUsername',
          headers: {
            'Content-Type': 'application/json'
          },
          params: {
            username: sessionStorage.getItem('username'),
            pageNo: 1,
            pageSize: 50
          }
        });

        console.log('Behavior API response:', behaviorRes.data);

        if (behaviorRes.data && behaviorRes.data.code === "1") {
          const favoriteNoteIds = behaviorRes.data.msg.list.map(behavior => ({
            noteId: behavior.noteId,
            favoriteDate: behavior.createTime || new Date().toISOString()
          }));

          // 第二步：根据每个noteId获取帖子详细信息
          const favoriteList = [];

          for (const favorite of favoriteNoteIds) {
            try {
              const noteRes = await this.$Axios({
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
                  tag: noteData.tag || 'unknown',
                  content: noteData.content || '内容已删除',
                  likeNum: noteData.likeNum || 0,
                  commentNum: noteData.commentNum || 0,
                  readNum: noteData.readNum || 0,
                  buildDate: noteData.buildDate || new Date().toISOString(),
                  buildUsername: noteData.buildUsername || '匿名用户',
                  isAnon: noteData.isAnon === 1,
                  isAllowComment: noteData.isAllowComment === 1,
                  isDeleted: noteData.isDeleted === 1,
                  favoriteDate: favorite.favoriteDate // 收藏时间
                });
              } else {
                console.warn(`获取帖子 ${favorite.noteId} 详情失败，API返回：`, noteRes.data);
              }
            } catch (noteErr) {
              console.error(`获取帖子 ${favorite.noteId} 详情失败：`, noteErr);
              // 继续处理下一个，不中断整个流程
            }
          }

          // 按收藏时间倒序排列
          this.favoriteNotes = favoriteList.sort((a, b) => new Date(b.favoriteDate) - new Date(a.favoriteDate));
          
          console.log('Loaded favorites:', this.favoriteNotes.length);
          
          if (this.notesRefreshing) {
            // showToast({
            //   message: `刷新成功，共加载 ${this.favoriteNotes.length} 个收藏`,
            //   type: 'success'
            // });
          }
        } else {
          showToast({
            message: '获取收藏列表失败',
            type: 'fail'
          });
        }
      } catch (err) {
        console.error("获取收藏列表出错：", err);
        showToast({
          message: '获取收藏列表失败，请稍后重试',
          type: 'fail'
        });
      } finally {
        this.notesLoading = false;
        this.notesRefreshing = false;
      }
    },
    
    // 跳转到帖子详情页
    goToDetail(note) {
      this.$router.push({
        path: '/wall/detail',
        query: {
          noteID: note.noteID,
          tag: note.tag,
          content: note.content,
          likeNum: note.likeNum,
          commentNum: note.commentNum,
          readNum: note.readNum,
          buildDate: note.buildDate,
          buildUsername: note.buildUsername,
          isAnon: note.isAnon,
          isAllowComment: note.isAllowComment,
          isDeleted: note.isDeleted,
        }
      });
    }
  },
};
</script>

<style scoped>
</style>