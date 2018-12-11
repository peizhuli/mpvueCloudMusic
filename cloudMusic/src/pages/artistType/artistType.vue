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
        artistType: [
          {
            name: '华语男歌手',
            value:  1001
          },
          {
            name: '华语女歌手',
            value:  1002
          },
          {
            name: '华语组合/乐队',
            value:  1003
          },
          {
            name: '欧美男歌手',
            value:  2001
          },
          {
            name: '欧美女歌手',
            value:  2002
          },
          {
            name: '欧美组合/乐队',
            value:  2003
          },
          {
            name: '日本男歌手',
            value:  6001
          },{
            name: '日本女歌手',
            value:  6002
          },
          {
            name: '日本组合/乐队',
            value:  6003
          },
          {
            name: '韩国男歌手',
            value:  7001
          },
          {
            name: '韩国女歌手',
            value:  7002
          },
          {
            name: '韩国组合/乐队',
            value:  7003
          },
          {
            name: '其他男歌手',
            value:  4001
          },
          {
            name: '其他女歌手',
            value:  4002
          },
          {
            name: '其他组合/乐队',
            value:  4003
          }
        ],
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
