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
</style>
<template>
  <div class="page">
    <van-nav-bar id="toolbar" title="我的收藏" left-text="返回" left-arrow @click-left="back" fixed placeholder @click-right="$router.push('/newCollection')">
      <template #right>
        <a>新增</a>
      </template>
    </van-nav-bar>
    <div class="collectionlist full">
      <van-tabs v-model="active">
        <van-tab v-for="(item, index) in collections" :key="index" :title="item.title">
          <van-pull-refresh v-model="refreshing" @refresh="getCollection(item.mainType)" class="full">
            <van-list v-model="loading" :finished="finished" @load="getCollection(item.mainType)">
              <div v-for="(item, index) in myCollection" :key="index">
                <van-swipe-cell>
                  <van-cell
                    class="collectionlist__box"
                    :label="item.files.length + ' 个内容 · ' + (item.isPublic ? '公开收藏夹' : '私密收藏夹')"
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
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      myCollection: [],
      refreshing: false,
      loading: false,
      finished: false,
      collections:[{
        "title":"文档",
        "mainType":"DOCUMENT"
      }]
    };
  },
  mounted() {},
  methods: {
    back() {
      this.$router.go(-1); //返回上一层
    },
    getCollection(mainType) {
      this.$Axios({
        method: 'get',
        url: '/collectionService/getCollection',
        params: {
          "mainType": mainType
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
  },
};
</script>

<style scoped>
</style>