<template>
  <div class="app-content">
    <div class="artist-box">
      <i-row :gutter="16">
        <i-col i-class="pad-10" span="8" v-for="item in artistSubType" :key="item.id">
          <div class="hot-singer-item" @click="goUrl('/pages/artistInfo/main?id=' + item.id)">
            <img class="col-img" :src="item.picUrl" />
            <p>{{ item.name }}</p>
          </div>
        </i-col>
      </i-row>
    </div>
  </div>
</template>

<script>
  import service from '../../service/service';
  export default {
    data() {
      return {
        artistSubType: [],
        currentName: '',
        currentCat: '-1',
        currentLimit: 20,
        currentOffset: 0,
        hasMore: false
      }
    },
    mounted() {
      this.currentCat = this.$root.$mp.query.type;
      this.currentName = this.$root.$mp.query.name;
      this.getArtistType(this.currentCat, this.currentLimit, this.currentOffset);
      wx.setNavigationBarTitle({
        title: this.currentName
      });
    },
    methods: {
      getHotSinger: function(limit, offset) {
        var vm = this;
        service.getHotSinger(limit, offset).then(function(res) {
          if(res.code == 200) {
            vm.hasMore = res.more;
            vm.artistSubType = vm.artistSubType.concat(res.artists);
          }
        });
      },
      getArtistType: function (cat, limit, offset) {
        let vm = this;
        if(cat == '-1') {
          vm.getHotSinger(vm.currentLimit, vm.currentOffset);
        } else {
          service.getArtisType(cat, limit, offset).then(function (res) {
            if(res.code == 200) {
              vm.hasMore = res.more;
              vm.artistSubType = vm.artistSubType.concat(res.artists);
            }
          })
        }
      },
      goUrl: function(url) {
        wx.navigateTo({
          url: url
        });
      }
    },
    onReachBottom() {
      let vm = this;
      if(vm.hasMore) {
        vm.currentOffset++;
        vm.getArtistType(vm.currentCat, vm.currentLimit, vm.currentOffset);
      }
    }
  }
</script>

<style scoped>
  .hot-singer-item img {
    max-width: 100%;
    max-height: 100%;
  }
</style>
