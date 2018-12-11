<template>
  <div class="app-content">
    <div class="dj-detail-info-box">
      <div class="dj-category-item" v-for="item in programs" :key="item.id" @click="goUrl('/pages/playMusic/main?id=' + item.radio.id)">
        <i-row class="right-content-box">
          <i-col span="8">
            <img class="col-img" :src="item.coverUrl" />
          </i-col>
          <i-col span="16" class="right-info-box">
            <div class="col-content">
              <div>{{ item.name }}</div>
              <div class="desc">{{ item.description.length > 70 ? item.description.substr(0,70) + '...' : item.description }}</div>
            </div>
          </i-col>
        </i-row>
      </div>
    </div>
  </div>
</template>

<script>
  import service from '../../service/service';
  export default {
    mounted() {
      let id = this.$root.$mp.query.id;
      this.getDJProgram(id);
    },
    data() {
      return {
        programs: []
      }
    },
    methods: {
      getDJProgram: function (id) {
        let vm = this;
        service.getDJPrograme(id, 10, 0).then(function (res) {
          vm.programs = res.programs;
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
  .desc {
    font-size: 24rpx;
    color: #999;
  }
</style>
