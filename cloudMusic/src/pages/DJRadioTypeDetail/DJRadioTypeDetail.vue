<template>
  <div class="app-content">
    <div class="dj-category-info-box">
      <div class="dj-category-item" v-for="item in djCategoryList" :key="item.id" @click="goUrl('/pages/DJRadioDetail/main?id=' + item.id)">
        <card :picUrl="item.picUrl" :title="item.name" :subTitle="item.lastProgramName"></card>
      </div>
    </div>
  </div>
</template>

<script>
  import service from '../../service/service';
  import Card from '../../components/card.vue';
  export default {
    mounted() {
      let id = this.$root.$mp.query.id;
      console.log(id);
      if(id) {
        this.getDJCategoryDetail(id);
      } else {
          this.getDJPayList();
        wx.setNavigationBarTitle({
          title: '付费精选'
        });
      }
    },
    data() {
      return {
        djCategoryList: [],
        hasMore: false,
        currentOffset: 0,
      }
    },
    components: {
      Card
    },
    methods: {
      getDJCategoryDetail: function (id) {
        let vm = this;
        service.getDJCategoryRecommend(id).then(function (res) {
            if(res.code == 200) {
              vm.currentOffset = 0;
              vm.djCategoryList = res.djRadios;
              vm.$nextTick(function () {
                wx.setNavigationBarTitle({
                  title: this.djCategoryList[0].category
                });
              });
            }
        })
      },
      getDJPayList: function () {
        let vm = this;
        service.getDJPayList(20, vm.currentOffset).then(function (res) {
          vm.currentOffset = 0;
          if(res.code == 200) {
              vm.djCategoryList = res.data.list;
          }
        });
      },
      goUrl: function (url) {
        wx.navigateTo({
          url: url
        });
      }
    },
    onReachBottom() {
      if(this.hasMore) {
        this.currentOffset++;
        this.getDJPayList();
      }
    }
  }
</script>

<style scoped>
  .app-content {
    padding: 20rpx;
  }
</style>
