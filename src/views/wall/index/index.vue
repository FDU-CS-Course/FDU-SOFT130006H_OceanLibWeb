<style scoped lang="less">
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
    }
    &__content {
      font-size: 14px;
      padding: 0px 20px;
      word-break: break-all;
      word-wrap: break-word;
      line-break: anywhere;
    }
  }
}
</style>
<template>
  <div class="wall">
    <div class="text-h5" style="margin:20px 0px">互助集市 <van-icon name="label-o" color="#1989fa" />
    </div>
    <van-sticky :offset-top="0">
      <div class="wall__search">
        <van-search
          v-model="searchValue"
          placeholder="请输入搜索关键词"
          shape="round"
        >
          <template #right-icon>
            <div style="display: flex;">
              <van-icon name="filter-o" size="20" style="margin-right: 8px;" />
              <van-icon name="replay" size="20" />
            </div>
          </template>
        </van-search>
      </div>
    </van-sticky>

    <div>
      <div v-for="(item,index) in wallInfo" :key="index">

        <van-card class="mb-4" v-if="item.isAD">
          <template #thumb>
            <img src="@/images/ad-2.png" style="height: 150px; width: 100%;" />
          </template>
        </van-card>

        <van-cell-group inset class="mb-4" v-else>
          <van-cell :style="{ backgroundColor: item.backgroundColor, color: 'white' }">
            <template #title>
              <div style="display: flex; align-items: center;">
                <van-icon :name="item.noticeIcon ? item.noticeIcon : getIconName(item.noticeType)" style="margin-right: 5px;" />
                <span class="wall__card__type">{{item.noticeTypeName ? item.noticeTypeName : getTypeName(item.noticeType)}}</span>
              </div>
            </template>
          </van-cell>
          
          <van-cell :style="{ backgroundColor: item.backgroundColor, color: 'white' }">
            <template #default>
              <div class="wall__card__content">
                {{item.noticeContent}}
              </div>
            </template>
          </van-cell>
          
          <van-cell :style="{ backgroundColor: item.backgroundColor, color: 'white' }">
            <template #default>
              <div style="display: flex; align-items: center; justify-content: space-between;">
                <div style="display: flex; align-items: center;">
                  <van-image
                    round
                    width="28px"
                    height="28px"
                    :src="item.isAnonymous ? 'https://avataaars.io/?avatarStyle=Transparent&topType=Hat&accessoriesType=Round&facialHairType=Blank&clotheType=BlazerShirt&eyeType=Wink&eyebrowType=RaisedExcitedNatural&mouthType=Serious&skinColor=Light' : item.buildUserEntity.avatar || ''"
                    v-if="item.isAnonymous || item.buildUserEntity.avatar"
                  >
                    <template #error>
                      <div style="width: 28px; height: 28px; border-radius: 50%; background-color: #ccc; display: flex; justify-content: center; align-items: center; color: white;">
                        {{ item.isAnonymous ? 'A' : item.buildUserEntity.nickname.substring(0, 1) }}
                      </div>
                    </template>
                  </van-image>
                  <div v-else style="width: 28px; height: 28px; border-radius: 50%; background-color: #ccc; display: flex; justify-content: center; align-items: center; color: white;">
                    {{ item.buildUserEntity.nickname.substring(0, 1) }}
                  </div>
                  <div class="text-body-2" style="margin-left: 5px;">{{item.isAnonymous ? "匿名纸条" : item.buildUserEntity.nickname}}</div>
                </div>
                <div style="display: flex; align-items: center;">
                  <van-icon name="eye-o" style="margin-right: 3px;" />
                  <span style="font-size: 12px; margin-right: 8px;">{{item.focusNum}}</span>
                  <span style="margin-right: 8px;">·</span>
                  <van-icon name="chat-o" style="margin-right: 3px;" />
                  <span style="font-size: 12px;">{{item.commentNum}}</span>
                </div>
              </div>
            </template>
          </van-cell>
        </van-cell-group>
      </div>
    </div>
    <div style="position: fixed; bottom: 0; left: 0; right: 0;">
      <van-tabbar v-model="navigation">
        <van-tabbar-item icon="search" to="/index">文库</van-tabbar-item>
        <van-tabbar-item icon="friends-o" to="/wall">互助</van-tabbar-item>
        <van-tabbar-item icon="manager-o" to="/mine">我的</van-tabbar-item>
      </van-tabbar>
    </div>
    <div style="position: fixed; bottom: 60px; right: 10px;">
      <van-button 
        round 
        type="primary" 
        size="small" 
        icon="edit" 
        @click="showActions = true"
      />
      
      <van-action-sheet v-model:show="showActions" :actions="actions" @select="onSelect" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchValue: '',
      showActions: false,
      actions: [
        { name: '编辑', icon: 'edit' },
        { name: '删除', icon: 'delete-o' }
      ],
      navigation: 1,
      wallInfo: [
        {
          backgroundColor: '#3C5C8B',
          noticeType: '1',
          noticeContent: '求计算机大佬帮孩子看看C++，可以请奶茶，留个QQ：1257477940',
          buildUserEntity: {
            nickname: 'Alpha测试',
            avatar:
              'https://avataaars.io/?avatarStyle=Transparent&topType=ShortHairShortCurly&accessoriesType=Prescription02&hairColor=Black&facialHairType=Blank&clotheType=Hoodie&clotheColor=White&eyeType=Default&eyebrowType=DefaultNatural&mouthType=Default&skinColor=Light',
          },
          isAnonymous: true,
          focusNum: '450',
          commentNum: '25',
        },
        {
          backgroundColor: '#4D84B6',
          noticeType: '2',
          noticeContent: '有无计算机院费老师的离散数学ppt可以分享一下呀，孩子马上要考试了，急需这个东西',
          buildUserEntity: {
            nickname: '北理派大星',
            avatar:
              'https://avataaars.io/?avatarStyle=Transparent&topType=ShortHairShortCurly&accessoriesType=Prescription02&hairColor=Black&facialHairType=Blank&clotheType=Hoodie&clotheColor=White&eyeType=Default&eyebrowType=DefaultNatural&mouthType=Default&skinColor=Light',
          },
          isAnonymous: false,
          focusNum: '78',
          commentNum: '2',
        },
        {
          isAD: true,
        },
        {
          backgroundColor: '#83ADCE',
          noticeType: '3',
          noticeContent: '捞一下昨天在二食堂看见的一个穿红色衣服的小哥哥，大概180，我把汤洒他身上了',
          buildUserEntity: {
            nickname: 'Alpha测试3',
            avatar:
              'https://avataaars.io/?avatarStyle=Transparent&topType=ShortHairShortCurly&accessoriesType=Prescription01&hairColor=Black&facialHairType=Blank&clotheType=Hoodie&clotheColor=White&eyeType=Default&eyebrowType=DefaultNatural&mouthType=Default&skinColor=Light',
          },
          isAnonymous: false,
          focusNum: '5',
          commentNum: '0',
        },
        {
          backgroundColor: '#93A4B9',
          noticeType: '4',
          noticeContent: '孩子把新买的平板扔在新校区A座305了，捡到请联系13305007890，重谢',
          buildUserEntity: {
            nickname: 'Alpha测试4',
            avatar:
              'https://avataaars.io/?avatarStyle=Transparent&topType=ShortHairShortCurly&accessoriesType=Prescription03&hairColor=Black&facialHairType=Blank&clotheType=Hoodie&clotheColor=White&eyeType=Default&eyebrowType=DefaultNatural&mouthType=Default&skinColor=Light',
          },
          isAnonymous: false,
          focusNum: '120',
          commentNum: '1',
        },
        {
          backgroundColor: '#93A4B9',
          noticeType: '4',
          noticeContent: '测试',
          buildUserEntity: {
            nickname: 'Alpha测试4',
            avatar:
              'https://avataaars.io/?avatarStyle=Transparent&topType=ShortHairShortCurly&accessoriesType=Prescription03&hairColor=Black&facialHairType=Blank&clotheType=Hoodie&clotheColor=White&eyeType=Default&eyebrowType=DefaultNatural&mouthType=Default&skinColor=Light',
          },
          isAnonymous: false,
          focusNum: '120',
          commentNum: '1',
        },
        {
          backgroundColor: '#93A4B9',
          noticeType: '4',
          noticeContent: '测试',
          buildUserEntity: {
            nickname: 'Alpha测试4',
            avatar:
              'https://avataaars.io/?avatarStyle=Transparent&topType=ShortHairShortCurly&accessoriesType=Prescription03&hairColor=Black&facialHairType=Blank&clotheType=Hoodie&clotheColor=White&eyeType=Default&eyebrowType=DefaultNatural&mouthType=Default&skinColor=Light',
          },
          isAnonymous: false,
          focusNum: '120',
          commentNum: '1',
        },
      ],
    };
  },
  mounted() {},
  methods: {
    getIconName(noticeType) {
      switch (noticeType) {
        case '1':
          return 'question-o';
        case '2':
          return 'search';
        case '3':
          return 'contact';
        case '4':
          return 'location-o';
      }
    },
    getTypeName(noticeType) {
      switch (noticeType) {
        case '1':
          return '问题';
        case '2':
          return '文档帮帮';
        case '3':
          return '捞人';
        case '4':
          return '寻物';
      }
    },
    onSelect(action) {
      this.showActions = false;
      // Handle action selection
    }
  },
};
</script>