<style scoped>
.v-btn:not(.v-btn--round).v-size--default {
  height: -webkit-fill-available;
}
</style>
<style lang="less" scoped>
@import '~@/vant-variables.less';
.mine {
  display: flex;
  flex-direction: column;
  font-size: 14px;
  background-color: @gray-1;
  &__userinfo-box {
    margin-bottom: 10px;
    &__tools {
      position: absolute;
      top: 0px;
      right: 0px;
      padding: 10px;
      display: flex;
      align-items: center;
      &__icon {
        margin-left: 8px;
        padding: 0 12px !important;
        min-width: unset !important;
        height: 32px !important;
        color: white !important;
        border-radius: 16px;
        background-color: rgba(0, 0, 0, 0.15);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);

        &.v-btn--text::before {
          opacity: 0.1 !important;
        }

        .v-icon {
          font-size: 18px;
        }
      }
    }
    &__avatar-box {
      position: absolute;
      top: 140px;
      left: 20px;
    }
    &__avatar {
      border: 2px solid white !important;
      font-size: 36px;
    }
    &--edit-mode {
      .mine__userinfo {
        margin-top: 120px;
      }
      .mine__userinfo-box__avatar-box {
        top: 40px;
      }
    }
  }
  &__userinfo {
    margin-top: 150px;
    background-color: white;
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
    padding: 20px;
    &__detail {
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      &__box {
        min-width: 45px;
      }
      &--title {
        font-size: 12px;
        color: #bbb;
      }
      &--number {
        font-size: 14px;
      }
    }
    &__nickname {
      font-size: 18px;
      margin-top: 20px;
      display: flex;
      flex-direction: row;
      align-items: center;
      &__icon {
        margin-left: 5px;
      }
    }
    &__personalsign {
      font-size: 12px;
      margin-top: 5px;
      color: #bbb;
    }
    &__edit-form {
      margin-top: 20px;
      padding-top: 20px;
      .v-text-field, .v-select, .v-textarea {
        margin-bottom: 8px;
      }
      &__buttons {
        display: flex;
        gap: 10px;
        margin-top: 20px;
        justify-content: flex-end;
        .v-btn {
          min-width: 80px;
        }
      }
      &__section {
        margin-bottom: 20px;
        &-title {
          font-size: 16px;
          font-weight: 500;
          color: #333;
          margin-bottom: 15px;
          padding-bottom: 8px;
          border-bottom: 1px solid #e0e0e0;
        }
      }
    }
  }
}
</style>
<template>
  <div class="mine">
    <div class="mine__userinfo-box" :class="{ 'mine__userinfo-box--edit-mode': editMode }" :style="newBackground">
      <div class="mine__userinfo-box__tools">
        <v-btn link to="/notify" class="mine__userinfo-box__tools__icon" text>
          <v-icon>mdi-bell-outline</v-icon>
        </v-btn>
        <v-btn link to="/notify" class="mine__userinfo-box__tools__icon" text>
          <v-icon>mdi-cog-outline</v-icon>
        </v-btn>
        <v-btn class="mine__userinfo-box__tools__icon" text @click="enterEditMode" v-if="!editMode">
          <v-icon>mdi-pencil</v-icon> Edit
        </v-btn>
      </div>
      <v-badge class="mine__userinfo-box__avatar-box" offset-x="20" offset-y="80" bordered color="warning" overlap>
        <template v-slot:badge>
          <div>{{userInfo.level}}</div>
        </template>
        <v-avatar color="primary" size="80" class="mine__userinfo-box__avatar">
          <v-img :src="userInfo.avatar" alt="Avatar" v-if="userInfo.avatar != null && userInfo.avatar !== ''" />
          <span class="white--text" v-else>{{userInfo.nickname.substring(0, 1)}}</span>
        </v-avatar>
      </v-badge>
      <div class="mine__userinfo">
        <template v-if="!editMode">
          <!-- Display mode -->
          <div class="mine__userinfo__detail">
            <div class="mine__userinfo__detail__box">
              <div class="mine__userinfo__detail--title">积分</div>
              <div class="mine__userinfo__detail--number">
                {{ userInfo.wallet.exp }}
              </div>
            </div>
            <div class="mine__userinfo__detail__box">
              <div class="mine__userinfo__detail--title">金币</div>
              <div class="mine__userinfo__detail--number">
                {{ userInfo.wallet.coin }}
              </div>
            </div>
            <div class="mine__userinfo__detail__box">
              <div class="mine__userinfo__detail--title">下载卷</div>
              <div class="mine__userinfo__detail--number">
                {{ userInfo.wallet.ticket }}
              </div>
            </div>
          </div>
          <div>
            <div class="mine__userinfo__nickname">
              {{ userInfo.nickname }}
              <img class="mine__userinfo__nickname__icon" :src="require('../../images/main-icon/icon_VIP.svg')" v-if="userInfo.wallet.isVip === 1" width="20" />
              <v-badge class="mine__userinfo__nickname__icon" bordered color="primary" overlap
                v-if="userInfo.userCertificationEntity!=null && userInfo.userCertificationEntity.certName!=null">
                <template v-slot:badge>
                  <v-icon color="white" size="16">{{userInfo.userCertificationEntity.icon}}</v-icon>
                </template>
                <v-chip x-small color="primary" outlined>
                  {{userInfo.userCertificationEntity.certName}}
                </v-chip>
              </v-badge>
            </div>
            <div class="mine__userinfo__personalsign" v-if="userInfo.userExtraEntity!=null">
              {{
                (userInfo.userExtraEntity.personalSignature == null || userInfo.userExtraEntity.personalSignature === "") ? "原装签名送给每个小可爱" : userInfo.userExtraEntity.personalSignature
              }}
            </div>
          </div>
        </template>
        <template v-else>
          <!-- Edit mode -->
          <div class="mine__userinfo__edit-form">
            <v-form ref="editForm" lazy-validation>
              <!-- Basic Information Section -->
              <div class="mine__userinfo__edit-form__section">
                <div class="mine__userinfo__edit-form__section-title">Basic Information</div>
                <v-text-field 
                  v-model="editUserInfo.nickname" 
                  label="Nickname" 
                  :rules="[v => !!v || 'Required']" 
                  dense
                  outlined
                />
                <v-text-field 
                  v-model="editUserInfo.email" 
                  label="Email" 
                  type="email" 
                  dense
                  outlined
                />
                <v-text-field 
                  v-model="editUserInfo.phoneNum" 
                  label="Phone Number" 
                  dense
                  outlined
                />
                <v-text-field 
                  v-model="editUserInfo.realname" 
                  label="Real Name" 
                  dense
                  outlined
                />
              </div>

              <!-- Personal Details Section -->
              <div class="mine__userinfo__edit-form__section">
                <div class="mine__userinfo__edit-form__section-title">Personal Details</div>
                <v-text-field 
                  v-model="editUserInfo.college" 
                  label="College" 
                  dense
                  outlined
                />
                <v-text-field 
                  v-model="editUserInfo.major" 
                  label="Major" 
                  dense
                  outlined
                />
                <v-menu ref="menu" v-model="menu" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="290px">
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field 
                      v-model="editUserInfo.birthday" 
                      label="Birthday" 
                      readonly 
                      v-bind="attrs" 
                      v-on="on" 
                      dense
                      outlined
                    />
                  </template>
                  <v-date-picker v-model="editUserInfo.birthday" @input="menu = false"></v-date-picker>
                </v-menu>
                <v-select 
                  v-model="editUserInfo.sex" 
                  :items="sexOptions" 
                  label="Sex" 
                  dense
                  outlined
                />
              </div>

              <!-- Profile Section -->
              <div class="mine__userinfo__edit-form__section">
                <div class="mine__userinfo__edit-form__section-title">Profile</div>
                <v-text-field 
                  v-model="editUserInfo.avatar" 
                  label="Avatar URL" 
                  dense
                  outlined
                />
                <v-textarea 
                  v-model="editUserInfo.personalSignature" 
                  label="Personal Signature" 
                  rows="3"
                  dense
                  outlined
                />
              </div>

              <!-- Action Buttons -->
              <div class="mine__userinfo__edit-form__buttons">
                <v-btn color="secondary" outlined @click="cancelEdit">
                  <v-icon left>mdi-close</v-icon>
                  Cancel
                </v-btn>
                <v-btn color="primary" @click="saveEdit">
                  <v-icon left>mdi-check</v-icon>
                  Save
                </v-btn>
              </div>
            </v-form>
          </div>
        </template>
      </div>
    </div>
    <!-- Grid items and menu - only show when not in edit mode -->
    <template v-if="!editMode">
      <van-grid style="margin-bottom: 10px">
        <van-grid-item text="我的收藏" to="/myCollectionList">
          <template #icon>
            <img :src="require('../../images/module-icon/icon_collection.svg')" width="30" style="margin-bottom: 5px" />
          </template>
        </van-grid-item>
        <van-grid-item text="我的下载" to="/myDownloadList">
          <template #icon>
            <img :src="require('../../images/module-icon/icon_download.svg')" width="30" style="margin-bottom: 5px" />
          </template>
        </van-grid-item>
        <van-grid-item text="最近浏览" to="/myRecentlyReadList">
          <template #icon>
            <img :src="require('../../images/module-icon/icon_look.svg')" width="30" style="margin-bottom: 5px" />
          </template>
        </van-grid-item>
        <van-grid-item text="我的贡献" to="/myUpload">
          <template #icon>
            <img :src="require('../../images/module-icon/icon_contribution.svg')" width="30" style="margin-bottom: 5px" />
          </template>
        </van-grid-item>
        <van-grid-item text="上传文档" to="/uploadFile">
          <template #icon>
            <img :src="require('../../images/module-icon/icon_upload.svg')" width="30" style="margin-bottom: 5px" />
          </template>
        </van-grid-item>
        <van-grid-item text="申请VIP" to="/vip">
          <template #icon>
            <img :src="require('../../images/main-icon/icon_VIP.svg')" width="30" style="margin-bottom: 5px" />
          </template>
        </van-grid-item>
      </van-grid>
      <van-cell title="我的订单" is-link />
      <van-cell title="我的钱包变动" is-link to="/walletChangeRecordList" />
      <van-cell title="关于Lib4Univ文库" is-link style="margin-top: 5px" to="/about" />
      <van-cell title="退出登录" style="color: var(--van-danger-color);" is-link @click="handleLogout" />
    </template>
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
    <v-snackbar v-model="snackbar" :color="snackbarColor" :timeout="3000">
      {{ snackbarMsg }}
    </v-snackbar>
  </div>
</template>

<script>
/**
 * Mine/Profile Page Component
 * 
 * Features:
 * - User profile display with avatar, stats, and personal information
 * - Edit mode with organized form sections (Basic Info, Personal Details, Profile)
 * - Responsive layout that adapts between display and edit modes
 * - Form validation and error handling
 * - Clean UI that hides navigation elements during editing
 * 
 * Recent Updates:
 * - Fixed edit mode layout with proper spacing and organization
 * - Added section-based form layout for better UX
 * - Improved button styling and positioning
 * - Added form validation and defensive coding practices
 */
export default {
  data() {
    return {
      navigation: 2,
      newBackground: {
        'background-image': 'url(' + require('../../images/background-picture/background-new.png') + ')',
        'background-size': '100%',
      },
      page: 1,
      userInfo: {
        avatar: null,
        nickname: '中南用户',
        wallet: {
          coin: 0,
          exp: 0,
          ticket: 0,
        },
      },
      editMode: false,
      editUserInfo: {},
      menu: false,
      sexOptions: [
        { text: 'Unknown', value: null },
        { text: 'Male', value: 1 },
        { text: 'Female', value: 2 },
      ],
      snackbar: false,
      snackbarMsg: '',
      snackbarColor: 'success',
    };
  },
  mounted() {
    this.getUserAllInfo();
  },
  methods: {
    getUserAllInfo() {
      this.$Axios({
        method: 'get',
        url: '/userInfoService/getUserAllInfo',
        params: {},
      }).then((response) => {
        this.userInfo = response.data.msg;
      });
    },
    handleLogout() {
      localStorage.removeItem("token");
      this.$router.push("/login");
    },
    enterEditMode() {
      this.editUserInfo = {
        nickname: this.userInfo.nickname,
        email: this.userInfo.email,
        phoneNum: this.userInfo.phoneNum,
        realname: this.userInfo.realname,
        avatar: this.userInfo.avatar,
        college: this.userInfo.userExtraEntity ? this.userInfo.userExtraEntity.college : '',
        major: this.userInfo.userExtraEntity ? this.userInfo.userExtraEntity.major : '',
        birthday: this.userInfo.userExtraEntity ? this.userInfo.userExtraEntity.birthday : '',
        sex: this.userInfo.userExtraEntity ? this.userInfo.userExtraEntity.sex : null,
        personalSignature: this.userInfo.userExtraEntity ? this.userInfo.userExtraEntity.personalSignature : '',
      };
      this.editMode = true;
    },
    cancelEdit() {
      this.editMode = false;
      this.editUserInfo = {};
    },
    /**
     * Save user edit information after validation
     * Validates form, filters empty values, and submits to server
     */
    saveEdit() {
      // Validate form before submission
      if (!this.$refs.editForm.validate()) {
        this.snackbarMsg = 'Please fix validation errors before saving';
        this.snackbarColor = 'error';
        this.snackbar = true;
        return;
      }

      // Filter out empty/null values for cleaner payload
      const payload = {};
      for (const key in this.editUserInfo) {
        const value = this.editUserInfo[key];
        if (value !== undefined && value !== null && value !== '') {
          payload[key] = value;
        }
      }

      // Check if there are any changes to save
      if (Object.keys(payload).length === 0) {
        this.snackbarMsg = 'No changes to save';
        this.snackbarColor = 'warning';
        this.snackbar = true;
        return;
      }

      this.$Axios({
        method: 'post',
        url: '/userInfoService/updateUserInfo',
        data: payload,
      }).then((response) => {
        console.log(response.data);
        this.editMode = false;
        this.getUserAllInfo(); // Refresh user data
        this.snackbarMsg = 'User information updated successfully';
        this.snackbarColor = 'success';
        this.snackbar = true;
      }).catch((error) => {
        let msg = 'Failed to update user info: ';
        if (error && error.response && error.response.data && error.response.data.msg) {
          msg += error.response.data.msg;
        } else if (error && error.message) {
          msg += error.message;
        } else {
          msg += 'Unknown error';
        }
        console.error('Update error:', error);
        this.snackbarMsg = msg;
        this.snackbarColor = 'error';
        this.snackbar = true;
      });
    },
  },
};
</script>

<style scoped>
</style>
