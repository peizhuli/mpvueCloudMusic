<template>
  <div class="app-content">
    <i-tabs i-class="tab-bar" :current="currentTab" color="#f759ab" @change="handleChange">
      <i-tab key="MVNew" title="最新MV"></i-tab>
      <i-tab key="MVRank" title="MV排行榜"></i-tab>
    </i-tabs>
    <div class="mv-box" v-if="currentTab == 'MVNew'">
      <div class="mv-item" v-for="item in latestMV" :key="item.id" @click="goUrl('/pages/playVideo/main?id=' + item.id)">
        <img :src="item.cover" />
        <p>{{ item.briefDesc }}</p>
      </div>
    </div>
    <div class="mv-box" v-if="currentTab == 'MVRank'">
      <div class="mv-item" v-for="item in MVRank" :key="item.id">
        <img :src="item.cover" />
        <p>{{ item.briefDesc }}</p>
      </div>
    </div>
  </div>
</template>

<script>
  import service from '../../service/service';
  export default {
    mounted() {
      this.getLatestMV();
    },
    data() {
      return {
        currentTab: 'MVNew',
        latestMV: [],
        MVRank: []
      }
    },
    methods: {
      getLatestMV: function () {
        let vm = this;
        service.getNewMV().then(function (res) {
          vm.latestMV = res.data;
        })
      },
      getTopMV: function () {
        let vm = this;
        service.getTopMV().then(function (res) {
          vm.MVRank = res.data;
        })
      },
      handleChange (detail) {
        this.currentTab =  detail.target.key;
        switch(this.currentTab) {
          case 'MVNew': {
            this.getLatestMV();
            break;
          }
          case 'MVRank': {
            this.getTopMV();
            break;
          }
        }
      },
      goUrl: function(url) {
          wx.navigateTo({
            url: url
          });
      }
    }
  }
</script>

<style scoped>
  .mv-item {
    padding: 10px;
  }
  .mv-item img {
    max-width: 100%;
  }
</style>
