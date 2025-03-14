<style scoped>
.v-btn:not(.v-btn--round).v-size--default {
  height: -webkit-fill-available;
}
</style>
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
    <div class="text-h5" style="margin:20px 0px">互助集市 <v-icon color="var(--v-primary-base)">mdi-sticker</v-icon>
    </div>
    <van-sticky :offset-top="0">
      <div class="wall__search">
        <v-toolbar dark color="var(--v-primary-base)">
          <v-text-field hide-details prepend-icon="mdi-magnify" single-line></v-text-field>
          <v-btn icon>
            <v-icon>mdi-filter</v-icon>
          </v-btn>
          <v-btn icon>
            <v-icon>mdi-refresh</v-icon>
          </v-btn>
        </v-toolbar>
      </div>
    </van-sticky>

    <div>
      <div v-for="(item,index) in wallInfo" :key="index">

        <v-card class="mx-auto mb-4" v-if="item.isAD" dark max-width="400">
          <v-parallax height="150" src="@/images/ad-2.png"></v-parallax>
        </v-card>

        <v-card class="mx-auto mb-4" :color="item.backgroundColor" dark max-width="400" v-else>
          <v-card-title>
            <v-icon left>
              {{item.noticeIcon?item.noticeIcon:getIcon(item.noticeType)}}
            </v-icon>
            <span class="wall__card__type">{{item.noticeTypeName?item.noticeTypeName:getTypeName(item.noticeType)}}</span>
          </v-card-title>

          <v-card-text class="wall__card__content">
            {{item.noticeContent}}
          </v-card-text>

          <v-card-actions>
            <v-list-item class="grow">
              <v-avatar color="grey darken-3" size="28" v-if="!item.isAnonymous">
                <v-img class="elevation-6" :src="item.buildUserEntity.avatar" alt="Avatar" v-if="item.buildUserEntity.avatar != null" />
                <span v-else>{{ item.buildUserEntity.nickname.substring(0, 1) }}</span>
              </v-avatar>
              <v-avatar color="grey darken-3" size="28" v-else>
                <v-img class="elevation-6"
                  src="https://avataaars.io/?avatarStyle=Transparent&topType=Hat&accessoriesType=Round&facialHairType=Blank&clotheType=BlazerShirt&eyeType=Wink&eyebrowType=RaisedExcitedNatural&mouthType=Serious&skinColor=Light"
                  alt="Avatar" />
              </v-avatar>
<!--              <v-list-item-content>-->
              <div class="text-body-2">{{item.isAnonymous?"匿名纸条":item.buildUserEntity.nickname}}</div>
<!--              </v-list-item-content>-->
              <v-row align="center" justify="end">
                <v-icon class="mr-1">
                  mdi-comment-eye
                </v-icon>
                <span class="text-caption mr-2">{{item.focusNum}}</span>
                <span class="mr-1">·</span>
                <v-icon class="mr-1">
                  mdi-comment
                </v-icon>
                <span class="text-caption">{{item.commentNum}}</span>
              </v-row>
            </v-list-item>
          </v-card-actions>
        </v-card>
      </div>
    </div>
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
    <div style="position: fixed;bottom: 60px;right: 10px;">
      <v-speed-dial v-model="fab" bottom right direction="top" transition="slide-y-reverse-transition">
        <template v-slot:activator>
          <v-btn v-model="fab" color="blue darken-2" dark fab>
            <v-icon v-if="fab">
              mdi-close
            </v-icon>
            <v-icon v-else>
              mdi-fountain-pen-tip
            </v-icon>
          </v-btn>
        </template>
        <v-btn fab dark small color="green">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn fab dark small color="red">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </v-speed-dial>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      fab: true,
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
    getIcon(noticeType) {
      switch (noticeType) {
        case '1':
          return 'mdi-help-circle';
        case '2':
          return 'mdi-note-search';
        case '3':
          return 'mdi-account-search';
        case '4':
          return 'mdi-map-marker-radius';
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
  },
};
</script>

<style scoped>
</style>