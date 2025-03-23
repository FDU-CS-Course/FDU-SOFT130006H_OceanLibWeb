<style lang="less" scoped>
@import '~@/vant-variables.less';
.login {
  display: flex;
  flex-direction: column;
  &__title {
    flex: 1;
    margin-top: 40px;
  }
  &__logo {
    width: 120px;
    margin-bottom: 10px;
  }
  &__body {
    flex: 3;
  }
  &__button {
    margin-top: 5px;
    width: 100%;
  }
  &__alert {
    line-height: 20px;
  }
  &__captcha {
    display: flex;
    flex-direction: row;
    align-items: center;
    &__input {
      margin-right: 10px;
    }
    &__img {
      height: 30px;
      width: 80px;
      margin-left: 10px;
    }
  }
  &__tab {
    padding: 10px 0px;
    &__icon {
      width: 26px;
    }
  }
  &__bottom {
    display: flex;
    align-items: center;
    flex-direction: column;
    font-size: 12px;
  }
  &__divider {
    margin: 0 10px;
  }
  &__copyright {
    margin-top: 5px;
    margin-bottom: 10px;
  }
}
.container {
  padding: 25px;
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
}
</style>

<template>
  <div class="login container md-body-1">
    <van-loading ref="loading" />
    <div class="login__title">
      <img class="login__logo" :src="require('@/images/main-picture/logo.png')" />
      <br />
      <span class="text-h5" style="color:rgba(0,0,0,0.7)"><strong>登录到Ocean</strong></span>
    </div>
    <div class="login__body">
      <van-tabs v-model:active="tab">
        <van-tab name="userlogin">
          <template #title>
            <van-icon name="manager" class="login__tab__icon" />
          </template>
          <van-field v-model="username" type="text" label="用户名" placeholder="请输入用户名"></van-field>
          <van-field v-model="password" 
                    :right-icon="showPassword ? 'eye-o' : 'closed-eye'" 
                    :rules="[{ required: true, message: '密码不可为空' }, { min: 6, message: '密码至少为 6 字符' }]"
                    :type="showPassword ? 'text' : 'password'" 
                    label="密码" 
                    placeholder="请输入账号密码" 
                    @click-right-icon="showPassword = !showPassword"></van-field>
          <van-button class="login__button" type="primary" @click="login">
            登录
          </van-button>
          <van-checkbox v-model="isAutoLogin" shape="square">记住账号和密码</van-checkbox>
        </van-tab>
        <van-tab name="univlogin">
          <template #title>
            <van-icon name="bookmark" class="login__tab__icon" />
          </template>
          <van-field v-model="univ" is-link readonly label="选择你的所在高校" placeholder="点击选择高校" @click="showUnivPicker = true"></van-field>
          <van-popup v-model:show="showUnivPicker" position="bottom">
            <van-picker
              show-toolbar
              :columns="univList.map(item => item.key)"
              @confirm="onUnivConfirm"
              @cancel="showUnivPicker = false"
            />
          </van-popup>
          <v-bitLogin v-if="univ=='BIT'" @onLogin="(data)=>{doLogin(data)}"></v-bitLogin>
        </van-tab>
      </van-tabs>
    </div>

    <div class="login__bottom">
      <div>
        <a @click="reg">注册</a> <span class="login__divider">|</span> <a>帮助</a>
      </div>
      <p class="md-caption login__copyright">Oriole 亦师 (CSU/BIT) © Copyright 2019-2022</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import qs from 'qs';
import { Notify } from '@vant/compat';
import loading from '@/components/loading';
import bitLogin from '@/components/univlogin/bit/bitLogin.vue';

export default {
  components: {
    'v-bitLogin': bitLogin,
    'van-loading': loading,
    [Notify.name]: Notify,
  },
  data() {
    return {
      univList: [
        {
          key: '中南大学',
          value: 'CSU',
        },
        {
          key: '北京理工大学',
          value: 'BIT',
        },
      ],
      univ: null,
      showUnivPicker: false,
      passwordRules: {
        required: (value) => value == null || (value != null && value != '') || '密码不可为空',
        min: (value) => value == null || value.length >= 6 || value.length == 0 || '密码至少为 6 字符',
      },

      showPassword: false,
      tab: 'univlogin',
      username: '',
      password: '',

      isAutoLogin: false,
      noticeShow: false,
    };
  },
  mounted() {
    this.isAutoLogin = localStorage.getItem('isAutoLogin') === 'true';
    if (this.isAutoLogin) {
      this.username = localStorage.getItem('username');
      this.password = localStorage.getItem('password');
    }
  },
  methods: {
    onUnivConfirm(value) {
      this.univ = this.univList.find(item => item.key === value).value;
      this.showUnivPicker = false;
    },
    reg() {
      this.tab = 'csulogin';
      this.noticeShow = true;
    },
    login() {
      this.$refs.loading.show('正在登录');
      if (this.isAutoLogin) {
        if (this.tab == 'userlogin') {
          localStorage.setItem('username', this.username);
          localStorage.setItem('password', this.password);
        } else {
          localStorage.setItem('csuUserID', this.csuUserID);
          localStorage.setItem('csuPwd', this.csuPwd);
        }
        localStorage.setItem('isAutoLogin', 'true');
      } else {
        localStorage.setItem('isAutoLogin', 'false');
      }
      this.doLogin();
    },
    doLogin(args) {
      if (args == null) {
        args = {
          url: this.$root.businessServer + 'userAuth/login',
          data: {
            username: this.username,
            password: this.password,
          },
        };
      }
      axios({
        method: 'post',
        url: args.url,
        data: qs.stringify(args.data),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
        .then((response) => {
          if (response.data.state == 'SUCCESS') {
            if (response.data.code == '1') {
              sessionStorage.clear();
              localStorage.setItem("token", response.data.msg);
              Notify({ type: 'success', message: '登录成功' });
              this.$router.push('/index');
            }
            if (response.data.code == '0' && this.univ != null) {
              sessionStorage.clear();
              localStorage.setItem('regToken', response.data.msg);
              this.$router.push({
                path: '/reg',
                query: {
                  univ: this.univ,
                },
              });
            }
          } else {
            this.$refs.loading.hide();
            if (response.data.code == '-2') {
              Notify({ type: 'danger', message: '用户名 / 密码 / 验证码错误' });
            } else if (response.data.code == '-3') {
              Notify({ type: 'danger', message: '账号已锁定或封禁' });
            }
          }
        })
        .catch((error) => {
          this.$refs.loading.hide();
          Notify({ type: 'danger', message: '其他服务器错误' + error });
        });
    },
  },
};
</script>