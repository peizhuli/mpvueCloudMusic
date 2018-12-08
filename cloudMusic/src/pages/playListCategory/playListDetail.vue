<template>
  <div>
    <div class="category-list">
      <span @click="getCategoryType(-1)">全部</span>
      <span v-for="(item, index) in categories" :key="index" @click="getCategoryType(index)">
        <span>{{ item }}</span>
      </span>
    </div>
    <ul class="sub-category-list">
      <li class="sub-category-item" v-for="(item, index) in currentSubCategories" :key="index" @click="getCategoryInfos(item.name, 20, 0, 'hot')">
        <span :data-type="item.category"> {{ item.name }} </span>
      </li>
    </ul>

    <div class="category-detail-box">
      <ul class="category-detail-list">
        <li class="category-detail-item" v-for="item in categoryDetail" :key="item.id" @click="getCategoryDetail(item.id)">
          <img class="col-img" :src="item.coverImgUrl" />
          <p>{{ item.name }}</p>
          <!--<p class="">{{ item.description }}</p>-->
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import service from '../../service/service';
  export default {
    mounted() {
      this.currentCategory = this.$root.$mp.query.category || 0;
      let currentCategoryName = this.$root.$mp.query.name || this.currentSubCategories[0].name;
      this.getCategory();
      this.getCategoryInfos(currentCategoryName, 20, 0, 'hot');
    },
    data() {
      return {
        categories: [],
        subCategories: [],
        currentSubCategories: [],
        categoryDetail: [],
        currentCategory: 0
      }
    },
    methods: {
      getCategory: function() {
        let vm = this;
        service.getPlayList().then(function(res) {
          if(res.code == 200) {
            vm.categories = res.categories;
            vm.subCategories = res.sub;
            vm.currentSubCategories = res.sub;
            vm.$nextTick(function() {
              vm.getCategoryType(this.currentCategory);
            })
          }
        })
      },
      getCategoryInfos: function(cat,limit,order) {
        let vm = this;
        service.getWellChosenList(cat,limit,order).then(function(res) {
          if(res.code == 200) {
            vm.categoryDetail = res.playlists;
          }
        });
      },
      getCategoryType: function(type) {
          console.log(type);
        this.currentSubCategories = [];
        if(type == -1) {
          this.currentSubCategories = this.subCategories;
        } else {
          this.subCategories.map(item => {
            if(item.category == type) {
              this.currentSubCategories.push(item);
            }
          });
        }
      },
      getCategoryDetail: function(id) {
        this.$router.push({path: '/songsCategoryDetail', query: { id: id }});
      },
    }
  }
</script>

<style scoped>
  .sub-category-item {
    display: inline-block;
    cursor: pointer;
  }
  .category-detail-item {
    float: left;
    width: 33.3%;
    font-size: 24rpx;
  }
  .category-detail-item img {
    width: 100%;
  }
</style>
