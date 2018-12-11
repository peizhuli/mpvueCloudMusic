<template>
  <div class="app-content">
    <div class="dj-category-info-box">
      <div class="dj-category-item" v-for="item in djCategoryList" :key="item.id" @click="goUrl('/pages/DJRadioDetail/main?id=' + item.id)">
        <i-row class="right-content-box" type="flex" align="center">
          <i-col span="8">
            <img class="col-img" :src="item.picUrl" />
          </i-col>
          <i-col span="16" class="right-info-box">
            <div class="col-content">
              <div>{{ item.name }}</div>
              <div>{{ item.rcmdtext }}</div>
              <div>{{ item.lastProgramName }}</div>
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
      this.getDJCategoryDetail(id);
    },
    data() {
      return {
        djCategoryList: []
      }
    },
    methods: {
      getDJCategoryDetail: function (id) {
        let vm = this;
        service.getDJCategoryRecommend(id).then(function (res) {
          vm.djCategoryList = res.djRadios;
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
