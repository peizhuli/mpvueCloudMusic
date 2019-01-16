<template>
  <div class="app-content">
    <div class="recommend-list">
      <div v-for="item in recommends" :key="item.id" @click="goUrl('/pages/playListCategoryDetail/main?id=' + item.id)">
        <card :picUrl="item.picUrl" :title="item.name" :subTitle="item.reason"></card>
      </div>
    </div>
  </div>
</template>

<script>
  import service from '../../service/service';
  import Card from '../../components/card.vue';
  export default {
    mounted() {
      this.getDailyRecomment();
      wx.setNavigationBarTitle({
        title: '每日歌单推荐'
      });
    },
    data() {
      return {
        recommends: []
      }
    },
    components: {
      Card
    },
    methods: {
      getDailyRecomment: function () {
        let vm = this;
        service.getDailyRecomment().then(function (res) {
          if(res.code == 200) {
            vm.recommends = res.recommend;
          }
        })
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
  .app-content {
    padding: 20rpx;
  }
  .recommend-reason {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
