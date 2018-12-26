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
        currentOffset: 0
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
      getHotSinger: function() {
        var vm = this;
        service.getHotSinger().then(function(res) {
          vm.artistSubType = res.artists;
        });
      },
      getArtistType: function (cat, limit, offset) {
        let vm = this;
        if(cat == '-1') {
          vm.getHotSinger();
        } else {
          service.getArtisType(cat, limit, offset).then(function (res) {
            vm.artistSubType = res.artists;
          })
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
  .hot-singer-item img {
    max-width: 100%;
    max-height: 100%;
  }
</style>
