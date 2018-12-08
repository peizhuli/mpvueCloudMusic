<template>
  <div class="app-content">
    <i-row :gutter="16">
      <i-col i-class="pad-10" span="8" v-for="item in singers" :key="item.id">
      <div class="hot-singer-item" @click="getArtistPlay(item.id)">
        <img class="col-img" :src="item.picUrl" />
        <p>{{ item.name }}</p>
      </div>
      </i-col>
    </i-row>
  </div>
</template>

<script>
  import service from '../../service/service';
  export default {
    data() {
      return {
        singers: []
      }
    },
    mounted() {
      this.getHotSinger();
    },
    methods: {
      getHotSinger: function() {
        var vm = this;
        service.getHotSinger().then(function(res) {
          vm.singers = res.artists;
        });
      },
      getArtistPlay: function(id) {
        wx.navigateTo({
          url: '/pages/artistInfo/main?id=' + id
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
