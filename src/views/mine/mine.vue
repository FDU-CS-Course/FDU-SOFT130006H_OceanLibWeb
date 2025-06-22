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
      &__avatar-section {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 15px;
      }
      &__avatar-preview {
        display: flex;
        justify-content: center;
      }
      &__avatar {
        border: 2px solid #e0e0e0 !important;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }
      &__avatar-upload {
        width: 100%;
        max-width: 300px;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      &__file-info {
        display: flex;
        justify-content: center;
        margin: 8px 0;
      }
      &__progress {
        margin: 10px 0;
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
              <!-- Avatar Section -->
              <div class="mine__userinfo__edit-form__section">
                <div class="mine__userinfo__edit-form__section-title">Avatar</div>
                <div class="mine__userinfo__edit-form__avatar-section">
                  <div class="mine__userinfo__edit-form__avatar-preview">
                    <v-avatar color="primary" size="100" class="mine__userinfo__edit-form__avatar">
                      <v-img :src="editUserInfo.avatar || userInfo.avatar" alt="Avatar" v-if="editUserInfo.avatar || userInfo.avatar" />
                      <span class="white--text" v-else style="font-size: 40px;">{{userInfo.nickname.substring(0, 1)}}</span>
                    </v-avatar>
                  </div>
                  <div class="mine__userinfo__edit-form__avatar-upload">
                    <!-- Hidden file input -->
                    <input
                      type="file"
                      ref="avatarInput"
                      accept="image/*"
                      @change="onAvatarChange"
                      style="display: none;"
                    />
                    
                    <!-- Upload button with better styling -->
                    <v-btn 
                      color="primary" 
                      :disabled="avatarUploading" 
                      :loading="avatarUploading"
                      @click="selectAvatar"
                      outlined
                      block
                    >
                      <v-icon left>mdi-camera-plus</v-icon>
                      {{ avatarFile ? 'Change Avatar' : 'Select Avatar' }}
                    </v-btn>
                    
                    <!-- File info display -->
                    <div v-if="avatarFile" class="mine__userinfo__edit-form__file-info">
                      <v-chip small color="primary" outlined>
                        <v-icon left small>mdi-file-image</v-icon>
                        {{ avatarFile.name }}
                        <span class="ml-2">({{ formatFileSize(avatarFile.size) }})</span>
                      </v-chip>
                    </div>
                    
                    <!-- Upload progress -->
                    <div v-if="avatarUploading" class="mine__userinfo__edit-form__progress">
                      <v-progress-linear
                        :value="uploadProgress"
                        color="primary"
                        height="8"
                        rounded
                      />
                      <div class="text-caption text-center mt-1">
                        {{ uploadProgress }}% uploaded
                      </div>
                    </div>
                    
                    <!-- Upload button -->
                    <v-btn 
                      v-if="avatarFile && !avatarUploading"
                      color="success" 
                      @click="uploadAvatar"
                      block
                    >
                      <v-icon left>mdi-upload</v-icon>
                      Upload Avatar
                    </v-btn>
                  </div>
                </div>
              </div>

              <!-- Basic Information Section -->
              <div class="mine__userinfo__edit-form__section">
                <div class="mine__userinfo__edit-form__section-title">Basic Information</div>
                <v-text-field 
                  v-model="editUserInfo.nickname" 
                  label="Nickname" 
                  :rules="nicknameRules" 
                  dense
                  outlined
                />
                <v-text-field 
                  v-model="editUserInfo.email" 
                  label="Email" 
                  type="email" 
                  :rules="emailRules"
                  dense
                  outlined
                />
                <v-text-field 
                  v-model="editUserInfo.phoneNum" 
                  label="Phone Number" 
                  :rules="phoneRules"
                  dense
                  outlined
                />
                <v-text-field 
                  v-model="editUserInfo.realname" 
                  label="Real Name" 
                  :rules="nameRules"
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
                  :rules="textRules"
                  dense
                  outlined
                />
                <v-text-field 
                  v-model="editUserInfo.major" 
                  label="Major" 
                  :rules="textRules"
                  dense
                  outlined
                />
                <v-text-field 
                  v-model="editUserInfo.birthday" 
                  label="Birthday (YYYY-MM-DD)" 
                  placeholder="e.g. 1990-01-15"
                  :rules="birthdayRules"
                  dense
                  outlined
                  append-icon="mdi-calendar"
                />
                <v-select
                  v-model="editUserInfo.sex"
                  label="Sex"
                  :items="sexOptions"
                  dense
                  outlined
                  clearable
                />
              </div>

              <!-- Profile Section -->
              <div class="mine__userinfo__edit-form__section">
                <div class="mine__userinfo__edit-form__section-title">Profile</div>
                <v-textarea 
                  v-model="editUserInfo.personalSignature" 
                  label="Personal Signature" 
                  rows="3"
                  :rules="signatureRules"
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
import axios from 'axios';

/**
 * Mine/Profile Page Component
 * 
 * Features:
 * - User profile display with avatar, stats, and personal information
 * - Edit mode with organized form sections (Avatar, Basic Info, Personal Details, Profile)
 * - Avatar upload support with image preview and validation
 * - Responsive layout that adapts between display and edit modes
 * - Form validation and error handling with security measures
 * - Clean UI that hides navigation elements during editing
 * 
 * Avatar Upload:
 * - Supports JPEG, PNG, GIF, WebP formats up to 5MB
 * - Uploads to http://seleixi_home.seleixi.com:8886/api/uploadImage
 * - Provides immediate preview and validation feedback
 * - Integrates with user profile update API
 * 
 * Recent Updates:
 * - Added avatar upload functionality with file validation and preview
 * - Simplified birthday field to text input with YYYY-MM-DD format validation
 * - Replaced sex dialog with intuitive select dropdown using string options
 * - Added string/integer conversion methods for sex field (UI uses strings, API uses integers)
 * - Added comprehensive date validation (format, range, and safety checks)
 * - Enhanced defensive coding practices with comprehensive input validation
 * 
 * Note: Database schema stores birthday as VARCHAR and sex as VARCHAR, but Java entities 
 * expect Date and Integer respectively. Spring Boot handles the conversion automatically.
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
      snackbar: false,
      snackbarMsg: '',
      snackbarColor: 'success',
      sexOptions: ['Unknown', 'Male', 'Female'],
      avatarFile: null,
      avatarUploading: false,
      uploadProgress: 0,
    };
  },
  computed: {

    /**
     * Validation rules for nickname field
     * Prevents HTML tags, SQL injection, and ensures reasonable length
     */
    nicknameRules() {
      return [
        v => !!v || 'Nickname is required',
        v => (v && v.length >= 2) || 'Nickname must be at least 2 characters',
        v => (v && v.length <= 20) || 'Nickname must be less than 20 characters',
        v => this.validateSafeInput(v) || 'Nickname contains invalid characters',
      ];
    },
    /**
     * Validation rules for email field
     * Ensures valid email format and prevents malicious input
     */
    emailRules() {
      return [
        v => !v || this.validateEmail(v) || 'Must be a valid email address',
        v => !v || this.validateSafeInput(v) || 'Email contains invalid characters',
        v => !v || (v.length <= 100) || 'Email must be less than 100 characters',
      ];
    },
    /**
     * Validation rules for phone number field
     */
    phoneRules() {
      return [
        v => !v || /^(?:\+?86)?1[3-9]\d{9}/.test(v) || 'Invalid phone number format',
        v => this.validateSafeInput(v) || 'Phone number contains invalid characters',
      ];
    },
    /**
     * Validation rules for name fields (realname)
     */
    nameRules() {
      return [
        v => !v || (v.length <= 50) || 'Name must be less than 50 characters',
        v => this.validateSafeInput(v) || 'Name contains invalid characters',
      ];
    },
    /**
     * Validation rules for general text fields (college, major)
     */
    textRules() {
      return [
        v => !v || (v.length <= 100) || 'Text must be less than 100 characters',
        v => this.validateSafeInput(v) || 'Text contains invalid characters',
      ];
    },
    /**
     * Validation rules for personal signature
     */
    signatureRules() {
      return [
        v => !v || (v.length <= 200) || 'Signature must be less than 200 characters',
        v => this.validateSafeInput(v) || 'Signature contains invalid characters',
      ];
    },
    /**
     * Validation rules for birthday field
     * Validates YYYY-MM-DD format and reasonable date ranges
     * Note: Database stores birthday as VARCHAR, backend converts to Date
     */
    birthdayRules() {
      return [
        v => !v || this.validateDateFormat(v) || 'Birthday must be in YYYY-MM-DD format (e.g. 1990-01-15)',
        v => !v || this.validateDateRange(v) || 'Birthday must be between 1900 and current year',
        v => !v || (v.length <= 10) || 'Birthday must be 10 characters or less',
        v => this.validateSafeInput(v) || 'Birthday contains invalid characters',
      ];
    },
    /**
     * Validation rules for avatar file upload
     * Ensures file type and size constraints
     */
    avatarRules() {
      return [
        v => !v || v.size < 5000000 || 'Avatar size should be less than 5 MB',
        v => !v || ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'].includes(v.type) || 'Avatar must be an image file (JPEG, PNG, GIF, WebP)',
      ];
    },
  },

  mounted() {
    this.getUserAllInfo();
  },
  methods: {
    /**
     * Validates email format using comprehensive regex
     * @param {string} email - Email to validate
     * @returns {boolean} - True if valid email format
     */
    validateEmail(email) {
      if (!email) return true; // Optional field
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return emailRegex.test(email);
    },
    /**
     * Validates input for security threats (HTML tags, SQL injection, XSS)
     * @param {string} input - Input to validate
     * @returns {boolean} - True if input is safe
     */
    validateSafeInput(input) {
      if (!input) return true; // Allow empty values
      
      // Check for HTML tags
      const htmlRegex = /<[^>]*>/;
      if (htmlRegex.test(input)) return false;
      
      // Check for SQL injection patterns
      const sqlPatterns = [
        /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/i,
        /(--|\/\*|\*\/|;|'|"|`)/,
        /(\bOR\b|\bAND\b).*[=<>]/i,
      ];
      for (const pattern of sqlPatterns) {
        if (pattern.test(input)) return false;
      }
      
      // Check for XSS patterns
      const xssPatterns = [
        /javascript:/i,
        /on\w+\s*=/i,
        /data:text\/html/i,
        /vbscript:/i,
      ];
      for (const pattern of xssPatterns) {
        if (pattern.test(input)) return false;
      }
      
      return true;
    },
    /**
     * Validates date format (YYYY-MM-DD)
     * @param {string} dateString - Date string to validate
     * @returns {boolean} - True if valid format
     */
    validateDateFormat(dateString) {
      if (!dateString) return true; // Optional field
      
      // Trim whitespace
      dateString = dateString.trim();
      
      // Check basic format with regex (YYYY-MM-DD)
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(dateString)) return false;
      
      // Split and validate components
      const [year, month, day] = dateString.split('-').map(Number);
      
      // Basic range checks
      if (year < 1000 || year > 9999) return false;
      if (month < 1 || month > 12) return false;
      if (day < 1 || day > 31) return false;
      
      // Check if it's a valid date using Date constructor
      const date = new Date(year, month - 1, day); // month is 0-indexed in Date constructor
      
      // Verify the date components match (catches invalid dates like 2023-02-30)
      return date.getFullYear() === year && 
             date.getMonth() === month - 1 && 
             date.getDate() === day;
    },
    /**
     * Validates date is within reasonable range (1900 to current year)
     * @param {string} dateString - Date string to validate
     * @returns {boolean} - True if within valid range
     */
    validateDateRange(dateString) {
      if (!dateString) return true; // Optional field
      
      // Trim whitespace
      dateString = dateString.trim();
      
      // Extract year from YYYY-MM-DD format
      const year = parseInt(dateString.substring(0, 4), 10);
      const currentYear = new Date().getFullYear();
      
      // Check reasonable range for birthdays
      return year >= 1900 && year <= currentYear;
    },
    /**
     * Sanitizes input by removing potentially dangerous characters
     * @param {string} input - Input to sanitize
     * @returns {string} - Sanitized input
     */
    sanitizeInput(input) {
      if (!input) return input;
      return input
        .replace(/[<>]/g, '') // Remove angle brackets
        .replace(/['"]/g, '') // Remove quotes
        .replace(/[;&]/g, '') // Remove semicolons and ampersands
        .trim();
    },
    /**
     * Convert sex integer value to string for display
     * @param {number|null} sexValue - Sex value from API (1=Male, 2=Female, null=Unknown)
     * @returns {string} - String representation for UI
     */
    sexIntToString(sexValue) {
      switch (sexValue) {
        case 1:
          return 'Male';
        case 2:
          return 'Female';
        case null:
        case undefined:
        default:
          return 'Unknown';
      }
    },
    /**
     * Convert sex string value to integer for API submission
     * @param {string} sexString - Sex string from UI ('Male', 'Female', 'Unknown')
     * @returns {number|null} - Integer value for API (1=Male, 2=Female, null=Unknown)
     */
    sexStringToInt(sexString) {
      switch (sexString) {
        case 'Male':
          return 1;
        case 'Female':
          return 2;
        case 'Unknown':
        default:
          return null;
      }
    },
    /**
     * Extract date part from ISO datetime string
     * @param {string} isoDateString - ISO datetime string (e.g. "2022-11-12T00:00:00.000+00:00")
     * @returns {string} - Date part only (e.g. "2022-11-12")
     */
    extractDateFromISO(isoDateString) {
      if (!isoDateString) return '';
      
      // If it's already in YYYY-MM-DD format, return as is
      if (/^\d{4}-\d{2}-\d{2}$/.test(isoDateString)) {
        return isoDateString;
      }
      
      // Extract date part from ISO datetime string
      try {
        const date = new Date(isoDateString);
        if (isNaN(date.getTime())) {
          console.warn('Invalid date string:', isoDateString);
          return '';
        }
        
        // Format as YYYY-MM-DD
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        
        return `${year}-${month}-${day}`;
      } catch (error) {
        console.error('Error parsing date:', error);
        return '';
      }
    },
    getUserAllInfo() {
      this.$Axios({
        method: 'get',
        url: '/userInfoService/getUserAllInfo',
        params: {},
      }).then((response) => {
        this.userInfo = response.data.msg;
      }).catch((error) => {
        console.error('Failed to get user info:', error);
        this.snackbarMsg = 'Failed to load user information';
        this.snackbarColor = 'error';
        this.snackbar = true;
      });
    },

    handleLogout() {
      localStorage.removeItem("token");
      this.$router.push("/login");
    },
    enterEditMode() {
      const sexValue = this.userInfo.userExtraEntity ? this.userInfo.userExtraEntity.sex : null;
      const birthdayValue = this.userInfo.userExtraEntity ? this.userInfo.userExtraEntity.birthday : null;
      
      this.editUserInfo = {
        nickname: this.userInfo.nickname || '',
        email: this.userInfo.email || '',
        phoneNum: this.userInfo.phoneNum || '',
        realname: this.userInfo.realname || '',
        college: this.userInfo.userExtraEntity ? (this.userInfo.userExtraEntity.college || '') : '',
        major: this.userInfo.userExtraEntity ? (this.userInfo.userExtraEntity.major || '') : '',
        birthday: this.extractDateFromISO(birthdayValue),
        sex: this.sexIntToString(sexValue),
        personalSignature: this.userInfo.userExtraEntity ? (this.userInfo.userExtraEntity.personalSignature || '') : '',
        avatar: this.userInfo.avatar || '',
      };
      
      this.editMode = true;
    },
    cancelEdit() {
      this.editMode = false;
      this.editUserInfo = {};
      this.avatarFile = null;
      this.avatarUploading = false;
      this.uploadProgress = 0;
      // Clear file input
      if (this.$refs.avatarInput) {
        this.$refs.avatarInput.value = '';
      }
      // Reset form validation
      if (this.$refs.editForm) {
        this.$refs.editForm.resetValidation();
      }
    },
    /**
     * Validates all form fields manually using computed validation rules
     * @returns {Object} - { isValid: boolean, errors: string[] }
     */
    validateAllFields() {
      const errors = [];
      const data = this.editUserInfo;

      // Validate nickname
      if (data.nickname !== undefined && data.nickname !== null) {
        for (const rule of this.nicknameRules) {
          const result = rule(data.nickname);
          if (result !== true) {
            errors.push(`Nickname: ${result}`);
            break;
          }
        }
      }

      // Validate email
      if (data.email !== undefined && data.email !== null && data.email !== '') {
        for (const rule of this.emailRules) {
          const result = rule(data.email);
          if (result !== true) {
            errors.push(`Email: ${result}`);
            break;
          }
        }
      }

      // Validate phone number
      if (data.phoneNum !== undefined && data.phoneNum !== null && data.phoneNum !== '') {
        for (const rule of this.phoneRules) {
          const result = rule(data.phoneNum);
          if (result !== true) {
            errors.push(`Phone: ${result}`);
            break;
          }
        }
      }

      // Validate real name
      if (data.realname !== undefined && data.realname !== null && data.realname !== '') {
        for (const rule of this.nameRules) {
          const result = rule(data.realname);
          if (result !== true) {
            errors.push(`Real Name: ${result}`);
            break;
          }
        }
      }

      // Validate college
      if (data.college !== undefined && data.college !== null && data.college !== '') {
        for (const rule of this.textRules) {
          const result = rule(data.college);
          if (result !== true) {
            errors.push(`College: ${result}`);
            break;
          }
        }
      }

      // Validate major
      if (data.major !== undefined && data.major !== null && data.major !== '') {
        for (const rule of this.textRules) {
          const result = rule(data.major);
          if (result !== true) {
            errors.push(`Major: ${result}`);
            break;
          }
        }
      }

      // Validate birthday
      if (data.birthday !== undefined && data.birthday !== null && data.birthday !== '') {
        for (const rule of this.birthdayRules) {
          const result = rule(data.birthday);
          if (result !== true) {
            errors.push(`Birthday: ${result}`);
            break;
          }
        }
      }

      // Validate personal signature
      if (data.personalSignature !== undefined && data.personalSignature !== null && data.personalSignature !== '') {
        for (const rule of this.signatureRules) {
          const result = rule(data.personalSignature);
          if (result !== true) {
            errors.push(`Personal Signature: ${result}`);
            break;
          }
        }
      }

      return {
        isValid: errors.length === 0,
        errors: errors
      };
    },
    /**
     * Save user edit information after validation and sanitization
     * Validates form, sanitizes input, filters empty values, and submits to server
     */
    saveEdit() {
      // First, validate using Vue form validation
      if (!this.$refs.editForm.validate()) {
        this.snackbarMsg = 'Please fix validation errors before saving';
        this.snackbarColor = 'error';
        this.snackbar = true;
        return;
      }

      // Second, perform comprehensive manual validation
      const validationResult = this.validateAllFields();
      if (!validationResult.isValid) {
        this.snackbarMsg = `Validation failed: ${validationResult.errors.join('; ')}`;
        this.snackbarColor = 'error';
        this.snackbar = true;
        return;
      }

      // Sanitize and filter payload
      const payload = {};
      for (const key in this.editUserInfo) {
        let value = this.editUserInfo[key];
        
        // Skip undefined, null, or empty string values
        if (value === undefined || value === null || value === '') {
          continue;
        }
        
        // Handle sex field conversion from string to integer
        if (key === 'sex') {
          value = this.sexStringToInt(value);
        } else if (key === 'avatar') {
          // Avatar URL should be used as-is (already validated during upload)
          // Skip data URLs (base64 previews) and only include actual URLs
          if (value.startsWith('data:')) {
            continue;
          }
          payload[key] = value;
          continue;
        } else if (typeof value === 'string') {
          // Sanitize other string values
          value = this.sanitizeInput(value);
          // Skip if sanitization resulted in empty string
          if (value === '') continue;
        }
        
        payload[key] = value;
      }

      // Check if there are any changes to save
      if (Object.keys(payload).length === 0) {
        this.snackbarMsg = 'No changes to save';
        this.snackbarColor = 'warning';
        this.snackbar = true;
        return;
      }

      // Final validation after sanitization
      // Re-validate critical fields that might have been affected by sanitization
      if (payload.email && !this.validateEmail(payload.email)) {
        this.snackbarMsg = 'Email format is invalid after sanitization';
        this.snackbarColor = 'error';
        this.snackbar = true;
        return;
      }

      if (payload.phoneNum && !/^(?:\+?86)?1[3-9]\d{9}/.test(payload.phoneNum)) {
        this.snackbarMsg = 'Phone number format is invalid after sanitization';
        this.snackbarColor = 'error';
        this.snackbar = true;
        return;
      }

      if (payload.birthday && (!this.validateDateFormat(payload.birthday) || !this.validateDateRange(payload.birthday))) {
        this.snackbarMsg = 'Birthday format is invalid';
        this.snackbarColor = 'error';
        this.snackbar = true;
        return;
      }

      // Final safety check for all payload values
      for (const [key, value] of Object.entries(payload)) {
        if (typeof value === 'string' && !this.validateSafeInput(value)) {
          this.snackbarMsg = `Invalid characters detected in ${key} field`;
          this.snackbarColor = 'error';
          this.snackbar = true;
          return;
        }
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
    /**
     * Trigger file selection dialog
     */
    selectAvatar() {
      this.$refs.avatarInput.click();
    },
    /**
     * Format file size for display
     * @param {number} bytes - File size in bytes
     * @returns {string} - Formatted file size
     */
    formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },
    /**
     * Handle avatar file selection and preview
     * @param {Event} event - File input change event
     */
    onAvatarChange(event) {
      const file = event.target.files[0];
      this.avatarFile = file;
      
      console.log("onAvatarChange");
      console.log("event: ", event);
      console.log("avatarFile: ", this.avatarFile);
      
      if (file) {
        console.log("file size: ", file.size);
        console.log("file type: ", file.type);
        console.log("file name: ", file.name);
        console.log("file: ", file);

        // Validate file
        for (const rule of this.avatarRules) {
          const result = rule(file);
          if (result !== true) {
            this.snackbarMsg = result;
            this.snackbarColor = 'error';
            this.snackbar = true;
            this.avatarFile = null;
            // Clear the input
            this.$refs.avatarInput.value = '';
            return;
          }
        }
        
        // Create preview URL for immediate display
        if (file && file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e) => {
            this.editUserInfo.avatar = e.target.result;
          };
          reader.readAsDataURL(file);
        }
      } else {
        // File was cleared
        this.editUserInfo.avatar = this.userInfo.avatar || '';
      }
    },
    /**
     * Upload avatar to the specified API endpoint
     * Uses direct axios (not this.$Axios) to avoid BaseURL and JWT Token
     * Sends POST request to http://seleixi_home.seleixi.com:8886/api/uploadImage
     */
    async uploadAvatar() {
      if (!this.avatarFile) {
        this.snackbarMsg = 'Please select an avatar file first';
        this.snackbarColor = 'warning';
        this.snackbar = true;
        return;
      }

      // Validate file again before upload
      for (const rule of this.avatarRules) {
        const result = rule(this.avatarFile);
        if (result !== true) {
          this.snackbarMsg = result;
          this.snackbarColor = 'error';
          this.snackbar = true;
          return;
        }
      }

      this.avatarUploading = true;
      this.uploadProgress = 0;

      try {
        // Create FormData for file upload
        const formData = new FormData();
        formData.append('source', this.avatarFile);

        // Upload to the specified endpoint using direct axios
        const response = await axios.post(
          'http://seleixi_home.seleixi.com:8886/api/uploadImage',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            timeout: 30000, // 30 second timeout for file upload
            onUploadProgress: (progressEvent) => {
              // Calculate upload progress percentage
              const progress = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              this.uploadProgress = progress;
              console.log(`Upload progress: ${progress}%`);
            },
          }
        );

        // Extract the public URL from response
        if (response.data && response.data.image && response.data.image.url) {
          const avatarUrl = response.data.image.url;
          
          // Update the edit form with the new avatar URL
          this.editUserInfo.avatar = avatarUrl;
          
          this.snackbarMsg = 'Avatar uploaded successfully!';
          this.snackbarColor = 'success';
          this.snackbar = true;
          
          // Clear the file input and reset
          this.avatarFile = null;
          this.$refs.avatarInput.value = '';
          this.uploadProgress = 0;
        } else {
          throw new Error('Invalid response format: missing image URL');
        }
      } catch (error) {
        console.error('Avatar upload failed:', error);
        
        let errorMsg = 'Failed to upload avatar: ';
        if (error.response && error.response.data && error.response.data.message) {
          errorMsg += error.response.data.message;
        } else if (error.message) {
          errorMsg += error.message;
        } else {
          errorMsg += 'Unknown error occurred';
        }
        
        this.snackbarMsg = errorMsg;
        this.snackbarColor = 'error';
        this.snackbar = true;
        
        // Reset avatar preview to original
        this.editUserInfo.avatar = this.userInfo.avatar || '';
      } finally {
        this.avatarUploading = false;
        this.uploadProgress = 0;
      }
    },
  },
};
</script>

<style scoped>
</style>
