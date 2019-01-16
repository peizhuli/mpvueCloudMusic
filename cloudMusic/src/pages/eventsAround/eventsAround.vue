<template>
  <div class="app-content">
    <div class="event-header">
      <div class="btn-group">
        <button class="event-btn" @click="getDynamicNews">动态</button>
        <button class="event-btn" @click="getUserFocusList">关注</button>
      </div>
    </div>
    <div class="events-box" v-if="currentTab == 1">
      <div class="events-item" v-for="item in events" :key="item.id">
        <i-row>
          <i-col span="4" class="avatar-box">
            <i-avatar :src="item.user.avatarUrl"></i-avatar>
          </i-col>
          <i-col span="18" class="event-content">
            <div class="nickname">{{ item.user.nickname }} - {{ item.user.signature }}</div>
            <div>{{ item.json.msg}}</div>
            <div>{{ item.eventTime }}</div>
            <div v-if="item.json.video || item.json.song" :id="item.json.video ? item.json.video.videoId : item.json.song.id || ''">
              <img :src="item.json.video ? item.json.video.coverUrl : item.json.song.album.picUrl || '' " />
              <div>{{ item.json.video ? item.json.video.title : item.json.song.name || '' }}</div>
            </div>
          </i-col>
        </i-row>
      </div>
    </div>
    <div class="follows-box" v-if="currentTab == 2">
      <div class="events-item" v-for="item in follows" :key="item.userId">
        <i-row>
          <i-col span="4" class="avatar-box">
            <i-avatar :src="item.avatarUrl"></i-avatar>
          </i-col>
          <i-col span="18" class="event-content">
            <div>{{ item.nickname }}  | 粉丝：{{ item.followeds }} |  关注：{{ item.follows }}</div>
            <div>{{ item.signature }}</div>
          </i-col>
        </i-row>
      </div>
    </div>
  </div>
</template>
<script>
  import { mapState } from 'vuex'
  import util from '../../utils/index';
  import service from '../../service/service';
  export default {
    mounted() {
      let tab = this.$root.$mp.query.tab;
//      if(!tab) return;
      tab == 2 ? this.getUserFocusList() : this.getDynamicNews();
      wx.setNavigationBarTitle({
        title: '周边动态'
      });
    },
    data() {
      return {
        events: [],
        follows: [],
        currentTab: 1
      }
    },
    computed: {
      ...mapState(['user'])
    },
    filters: {
      formatTime: function(time) {
        return util.formatterTime(time)
      }
    },
    methods: {
      getUserFocusList: function () {
        let vm = this;
        service.getUserFocusList(vm.user.profile.userId).then(function (res) {
          if(res.code == 200) {
            vm.currentTab = 2;
            vm.follows = res.follow;
            wx.setNavigationBarTitle({
              title: '关注'
            });
          }
        })
      },
      getDynamicNews: function () {
        let vm = this;
        service.getDynamicNews().then(function (res) {
          vm.currentTab = 1;
          vm.events = res.event;
          vm.events.map(function(item) {
              item.json = JSON.parse(item.json);
              item.eventTime = util.formatterTime(item.eventTime);
          });
          wx.setNavigationBarTitle({
            title: '周边动态'
          });
        })
      }
    }
  }
</script>
<style>
  .event-header {
    text-align: center;
    padding: 20rpx 0;
  }
  .avatar-box {
    text-align: center;
  }
  .event-content {
    padding-left: 20rpx;
    font-size: 24rpx;
  }
  .events-item {
    margin-bottom: 30rpx;
  }
  .event-btn {
    display: inline-block;
    padding: 0 30rpx;
    font-size: 24rpx;
    border-radius: 10rpx;
    border: none;
    color: #fff;
    background: #d6413d;
  }
</style>
