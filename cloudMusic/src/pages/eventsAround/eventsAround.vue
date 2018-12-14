<template>
  <div class="app-content">
    <div class="event-header">
      <div class="btn-group">
        <i-button type="error" to="/friends/events">动态</i-button>
        <i-button type="error" to="/friends/follows">关注</i-button>
      </div>
    </div>
    <div class="events-box">
      <div class="events-item" v-for="item in events" :key="item.id">
        <i-row>
          <i-col span="2" class="avatar-box">
          <i-avatar :src="item.user.avatarUrl"></i-avatar>
          </i-col>
          <i-col span="22" class="event-content">
          <div class="nickname">{{ item.user.nickname }} - {{ item.user.signature }}</div>
          <div>{{ item.json | toJSON }}</div>
          <div>{{ item.eventTime | formatTime }}</div>
          </i-col>
        </i-row>
      </div>
      <div class="follows-box">
        <div class="events-item" v-for="item in follows" :key="item.userId">
          <i-row>
            <i-col span="2" class="avatar-box">
            <i-avatar :src="item.avatarUrl"></i-avatar>
            </i-col>
            <i-col span="22" class="event-content">
            <div>{{ item.nickname }}  | 粉丝：{{ item.followeds }} |  关注：{{ item.follows }}</div>
            <div>{{ item.signature }}</div>
            </i-col>
          </i-row>
        </div>
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
      if(!tab) return;
      tab == 1 ? this.getDynamicNews() : this.getUserFocusList();
    },
    data() {
      return {
        events: [],
        follows: []
      }
    },
    computed: {
      ...mapState(['user'])
    },
    filters: {
      formatTime: function(time) {
        return util.formatterTime(time)
      },
      toJSON: function (content) {
        return JSON.parse(content).msg;
      }
    },
    methods: {
      getUserFocusList: function () {
        let vm = this;
        service.getUserFocusList(vm.user.profile.userId).then(function (res) {
          if(res.code == 200) {
            vm.follows = res.follow;
          }
        })
      },
      getDynamicNews: function () {
        let vm = this;
        service.getDynamicNews().then(function (res) {
          vm.events = res.event;
        })
      }
    }
  }
</script>
<style>
  .event-header {
    text-align: center;
    padding-top: 30rpx;
  }
  .avatar-box {
    text-align: right;
  }
  .event-content {
    padding-left: 20rpx;
    font-size: 24rpx;
  }
  .events-item {
    margin-bottom: 30rpx;
  }
</style>
