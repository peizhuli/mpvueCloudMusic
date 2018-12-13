<template>
  <div class="app-content">
    <i-tabs i-class="tab-bar" :current="currentTab" color="#f759ab" @change="handleChange">
      <i-tab key="weekly" title="最近一周"></i-tab>
      <i-tab key="all" title="全部"></i-tab>
    </i-tabs>
    <div class="play-record-box" v-if="user.profile">
      <div class="" v-if="currentTab == 'weekly'" v-for="item in weekList" @click="goUrl('/pages/playMusic/main?id=' + item.song.id)">
        <i-row class="play-list-box">
          <i-col span="6">
          <img class="col-img" :src="item.song.al.picUrl" />
          </i-col>
          <i-col span="18" class="play-list-content">
            <div class="col-content">
              <div>{{ item.song.name }} - {{ item.song.ar[0].name }}</div>
              <div v-if="item.song.alia.length">{{ item.song.alia["0"] }}</div>
            </div>
          </i-col>
        </i-row>
      </div>
      <div class="" v-if="currentTab == 'all'" v-for="item in allList" @click="goUrl('/pages/playMusic/main?id=' + item.song.id)">
        <i-row class="play-list-box">
          <i-col span="6">
          <img class="col-img" :src="item.song.al.picUrl" />
          </i-col>
          <i-col span="18" class="play-list-content">
            <div class="col-img">
              <div>{{ item.song.name }} - {{ item.song.ar[0].name }}</div>
              <div v-if="item.song.alia.length">{{ item.song.alia["0"] }}</div>
            </div>
          </i-col>
        </i-row>
      </div>
    </div>
    <div v-else>
      <p>暂无播放记录</p>
    </div>
  </div>
</template>

<script>
  import {mapState} from 'vuex';
  import service from '../../service/service';
  export default {
    mounted() {
        if(this.user.profile) {
          this.getUserPlayLists(1);
        }
    },
    data() {
      return {
        weekList: [],
        allList: [],
        currentTab: 'weekly'
      }
    },
    computed: {
      ...mapState(['user'])
    },
    methods: {
      getUserPlayLists: function (type) {
        let vm = this;
        service.getUserPlayLists(vm.user.profile.userId, type).then(function (res) {
          if(res.code == 200) {
            type == 1 ?  vm.weekList = res.weekData : vm.allList = res.allData;
          }
        })
      },
      handleChange (detail) {
        this.currentTab =  detail.target.key;
        switch(this.currentTab) {
          case 'weekly': {
            this.getUserPlayLists(1);
            break;
          }
          case 'all': {
            this.getUserPlayLists(0);
            break;
          }
        }
      },
      goUrl: function (url) {
        wx.navigateTo({
          url: url
        });
      }
    }
  }
</script>

<style scoped>
  .play-list-box {
    overflow: hidden;
  }
  .play-list-content {
    padding-left: 20rpx;
    font-size: 24rpx;
  }
</style>
