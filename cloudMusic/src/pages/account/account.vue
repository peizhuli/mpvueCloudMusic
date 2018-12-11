<template>
  <div class="app-content">
    <div class="profile-info">
      <div class="profile-info-content" :style="{ background: profileBackUrl }">
        <!--<Avatar size="large" :src="user.profile.userId ? user.profile.avatarUrl : defaultAvatar"></Avatar>-->
        <i-row i-class="">
          <i-col span="8">
          <!--<img class="profile-avatar" :src="user.profile.userId ? user.profile.avatarUrl : defaultAvatar" />-->
            <i-avatar size="large" :src="user.profile ? user.profile.avatarUrl : defaultAvatar"></i-avatar>
            <p @click="logout()">{{ user.profile ? user.profile.nickname : '未登录' }}</p>
          </i-col>
          <i-col span="8" offset="8">
            <div class="daily-sign">
              <i-button type="default" shape="circle" icon="brush" @click="dailySign(user.profile.userId)">签到</i-button>
            </div>
          </i-col>
        </i-row>
      </div>
      <i-row class="account-count-box">
        <i-col span="6">
        <div @click="$router.push('/profileEvent')">
          动态
          <div>{{ eventCount }}</div>
        </div>
        </i-col>
        <i-col span="6">
        <div @click="$router.push({path: '/friends/follows'})">
          关注
          <div>{{ followsCount }}</div>
        </div>
        </i-col>
        <i-col span="6">
        <div>粉丝</div>
        <div>{{ followedsCount }}</div>
        </i-col>
        <i-col span="6">
        <div><i-icon type="editor" size="20" /></div>
        <div>我的资料</div>
        </i-col>
      </i-row>
    </div>
    <div class="menu-list-box">
      <i-cell-group class="list-group">
        <i-cell class="list-item" title="我的消息">
          <i-icon type="mail" slot="icon" />
        </i-cell>
      </i-cell-group>
      <i-cell-group class="list-group">
        <i-cell class="list-item" title="VIP会员">
          <i-icon type="integral" slot="icon" />
        </i-cell>
        <i-cell class="list-item" title="商城">
          <i-icon type="publishgoods_fill" slot="icon" />
        </i-cell>
        <i-cell class="list-item" title="在线听歌免流量">
          <i-icon type="customerservice" slot="icon" />
        </i-cell>
      </i-cell-group>
      <i-cell-group class="list-group">
        <i-cell class="list-item" title="设置">
          <i-icon type="setup" slot="icon" />
        </i-cell>
        <i-cell class="list-item" title="扫一扫">
          <i-icon type="scan" slot="icon" />
        </i-cell>
        <i-cell class="list-item" title="主题换肤">
          <i-icon type="emoji" slot="icon" />
        </i-cell>
        <i-cell class="list-item" title="夜间模式">
          <i-icon type="ios-cart-outline" slot="icon" />
          <i-switch :value="openNightModel" slot="extra" />
        </i-cell>
        <i-cell v-if="user.profile" class="list-item" title="退出登录" @click="logout()">
          <!--<i-icon type="ios-cart-outline"/>-->
          <!--<div class="" slot="extra"></div>-->
        </i-cell>
      </i-cell-group>
    </div>
  </div>
</template>
<script>
  import {mapState, mapMutations } from 'vuex';
  import util from '../../utils/index';
  import service from '../../service/service';
  export default {
    mounted() {
      this.profileBackUrl = "url(" + this.user.profile.backgroundUrl + ") center no-repeat";
    },
    data() {
      return {
        profileBackUrl: "",
        openNightModel: false,
        defaultAvatar: require('../../../static/img/avater.gif')
      }
    },
    computed: {
      ...mapState(['user', 'followedsCount', 'followsCount', 'eventCount'])
    },
    methods: {
      ...mapMutations(['SET_PROFILE']),
      dailySign: function () {
        service.dailySign(1).then(function (res) {
          if(res.code == 200) {
            wx.showToast({
              title: '签到成功！',
              icon: 'success',
              duration: 2000
            });
          }
        })
      },
      logout: function () {
        let vm = this;
        service.logout().then(function (res) {
          if(res.code == 200) {
            wx.showToast({
              title: '退出登录成功！',
              icon: 'success',
              duration: 2000
            });
            wx.removeStorageSync('user');
            vm.SET_PROFILE({});
            wx.navigateTo({
              url: '/pages/login/main'
            });
          }
        });
      }
    }
  }
</script>

<style scoped>
  .profile-info {
    width: 100%;
    height: 30%;
  }
  .profile-info-content {
    width: 100%;
    height: 70%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    font-size: 30rpx;
    color: #999;
  }
  .profile-info-content > div {
    height: 100%;
  }
  .list-group {
    margin-top: 20rpx;
    background: #fff;
  }
  .account-count-box {
    clear: both;
    padding-top: 20rpx;
    text-align: center;
    font-size: 30rpx;
  }

  .profile-avatar {
    width: 40%;
    border-radius: 50%;
  }
  .profile-avatar-box {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 30rpx;
    line-height: 2;
  }
</style>
