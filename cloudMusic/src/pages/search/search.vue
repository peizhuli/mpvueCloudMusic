<template>
  <div>
    <div class="header-bar">
      <div class="search-box">
        <input class="search-input" placeholder="音乐、视频、歌词、电台" v-model="keyword" @input="hotSearchSuggest" @enter="searchMusic(keyword, '1', 30, 0)" />
        <i-icon type="ios-search" color="#999" size="40" />
      </div>
      <span style="font-size: 32rpx; float: right; margin-right: 10rpx;" @click="goBack">取消</span>
    </div>
    <div class="pad-top">
      <div class="hot-singers" @click="goUrl('/pages/artistType/main')">
          <i-icon type="group" size="24" />
          <span>歌手分类</span>
          <i-icon type="enter" size="24" />
      </div>
      <div class="hot-search-box">
        <p>热门搜索</p>
        <div>
          <span class="hot-search-item" v-for="(item, index) in hotSearchArr" :key="index" @click="searchMusic(item.first, '1', 30, 0)">{{ item.first }}</span>
        </div>
      </div>
      <div class="search-suggest-box" v-if="keyword && searchSuggest.songs">
        <div class="search-artists">
          <ul class="search-list">
            <li v-for="item in searchSuggest.artists" :key="item.id" @click="searchMusic(item.name, '100',30,0)">
              <p>{{ item.name }}</p>
            </li>
            <li v-for="item in searchSuggest.songs" :key="item.id" @click="searchMusic(item.name,'1',30,0)">
              <p>{{ searchSuggest.artists["0"].name }} {{ item.name }}</p>
            </li>
            <li v-for="item in searchSuggest.mvs" :key="item.id" @click="searchMusic(item.name, '1004',30,0)">
              <p>{{ item.artists["0"].name }} {{ item.name }}</p>
            </li>
            <li v-for="item in searchSuggest.playlists" :key="item.id" @click="searchMusic(item.name, '1000',30,0)">
              <p>{{ item.name }}</p>
            </li>
          </ul>
        </div>
      </div>

      <div class="search-content" v-show="showSearchResult">
        <i-tabs i-class="pad-top tab-bar" :current="currentTab" color="#f759ab" @change="handleChange">
          <i-tab key="playMusic" title="单曲"></i-tab>
          <i-tab key="artistInfo" title="歌手"></i-tab>
          <i-tab key="album" title="专辑"></i-tab>
          <i-tab key="playListCategoryDetail" title="歌单"></i-tab>
          <i-tab key="playVideo" title="视频"></i-tab>
        </i-tabs>
        <div class="search-detail-box">
          <ul class="">
            <li class="search-item" v-for="item in searchArrs" :key="item.id" @click="goUrl('/pages/' + currentTab + '/main?id=' + item.id)">
              <!--{{ item.name }}-->
              <i-row v-if="item.picUrl != null">
                <i-col span="6">
                  <img class="col-img" :src="item.picUrl" />
                </i-col>
                <i-col span="18">
                  <div class="col-content">
                    <div>{{ item.name }}</div>
                  </div>
                </i-col>
              </i-row>
              <div class="cover-box" v-else-if="item.cover != null">
                <img :src="item.cover" />
                <div>{{ item.name }}</div>
              </div>
              <span v-else>{{ item.name }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <go-top></go-top>
  </div>
</template>
<script>
  import service from '../../service/service';
  import goTop from '../../components/goTop';
  export default {
      data() {
          return {
            keyword: '',
            searchArrs: [],
            searchHeader: [
              {
                title: '歌曲',
                key: 'musicName'
              },
              {
                title: '歌手',
                key: 'artist'
              },
              {
                title: '专辑',
                key: 'album'
              },
              {
                title: '操作',
                key: 'actions',
                align: 'center',
                render: (h, params) => {
                  return h('div', [
                    h('Icon', {
                      props: {
                        type: 'md-headset'
                      },
                      on: {
                        click: () => {
                          this.playMusic(this.searchPlays[params.index].id)
                        }
                      }
                    }),
                    h('Icon', {
                      props: {
                        type: params.IsCollect ? 'md-heart' : 'md-heart-outline'
                      },
                      on: {
                        click: () => {
                          this.collectMusic(params.IsCollect, this.searchPlays[params.index].id)
                        }
                      }
                    })
                  ]);
                }
              },
            ],
            searchContent: [],
            hotSearchArr: [],
            searchSuggest: {},
            currentTab: 'playMusic',
            showSearchResult: false,
            currentOffset: 0,
            currentType: 1
          }
      },
    components: {
      goTop
    },
    mounted() {
      wx.setNavigationBarTitle({
        title: '搜索'
      });
      this.hotSearch();
    },
    methods: {
      handleChange (detail) {
        this.currentTab =  detail.target.key;
        this.currentOffset = 0;
        switch(this.currentTab) {
          case 'playMusic': {
            this.currentType = 1;
            this.searchMusic(this.keyword, this.currentType, 30, this.currentOffset);
            break;
          }
          case 'artistInfo': {
            this.currentType = 100;
              this.searchMusic(this.keyword, this.currentType, 30, this.currentOffset);
            break;
          }
          case 'album': {
            this.currentType = 10;
              this.searchMusic(this.keyword, this.currentType, 30, this.currentOffset);
            break;
          }
          case 'playListCategoryDetail': {
            this.currentType = 1000;
            this.searchMusic(this.keyword, this.currentType, 30, this.currentOffset);
            break;
          }
          case 'playVideo': {
            this.currentType = 1004;
            this.searchMusic(this.keyword, this.currentType, 30, this.currentOffset);
            break;
          }
        }
      },
      searchMusic: function (keyword, type, limit, offset) {
            let vm = this;
            vm.keyword = keyword;
            service.searMusic(keyword, type, limit, offset).then(function (res) {
              if(res.code == 200) {
                  vm.searchArrs = res.result.artists || res.result.songs || res.result.mvs || res.result.albums || res.result.playlists || [];
                  let count = res.songCount || res.artistCount || res.albumCount || res.playlistCount || res.mvCount || res.djprogramCount || res.userprofileCount;
                  count = count ? count : 0;
//                  vm.searchPlays = res.result.songs;
//                  vm.searchPlays.map(item => {
//                      let obj = {
//                        musicName: item.name,
//                        artist: item.artists["0"].name,
//                        album: item.album.name,
//                        IsCollect: false
//                      };
//                      vm.searchContent.push(obj);
//                  })
                  vm.searchSuggest = {};
                  vm.showSearchResult = true;
              }
            })
          },
      hotSearch: function () {
        let vm = this;
        service.getHotSearch().then(function (res) {
          if(res.code == 200) {
              vm.hotSearchArr = res.result.hots;
          }
        })
      },
      hotSearchSuggest: function () {
        let vm = this;
        vm.showSuggest = true;
        if(vm.keyword.trim().length) {
          service.hotSearchSuggest(vm.keyword).then(function (res) {
            vm.searchSuggest = res.result;
            console.log(vm.searchSuggest);
          })
        }
      },
      bestSearch: function(keyword) {
        let vm = this;
        if(keyword.length) {
          service.mutiSearch(keyword).then(function (res) {
            console.log(res);
          })
        }
      },
      playMusic: function (id) {
        wx.navigateTo({
          url: '/pages/playMusic/main?id=' + id
        });
      },
      collectMusic: function(IsCollect, id) {
        let type = IsCollect ? 0 : 1;
        service.toggleCollectMusic(type, id).then(function (res) {
          console.log(res);
        })
      },
      goBack: function () {
        wx.navigateBack({delta: 1});
      },
      goUrl: function (url) {
        wx.navigateTo({
          url: url
        });
      }
    },
    onReachBottom() {
      let vm = this;
      vm.currentOffset++;
      service.searMusic(vm.keyword, vm.currentType, 30, vm.currentOffset).then(function (res) {
        if(res.code == 200) {
          let resultArr = res.result.artists || res.result.songs || res.result.mvs || res.result.albums || res.result.playlists || [];
          let count = res.result.songCount || res.result.artistCount || res.result.albumCount || res.result.playlistCount || res.result.mvCount || res.result.djprogramCount || res.result.userprofileCount;
          if(vm.searchArrs.length < count) {
            vm.searchArrs = vm.searchArrs.concat(resultArr);
          }
          vm.searchSuggest = {};
          vm.showSearchResult = true;
        }
      })
    }
  }
</script>

<style scoped>
  .search-box {
    width: 80%;
    padding-left: 10rpx;
    top: 20rpx;
    margin-left:30rpx;
    font-size:30rpx;
    float: left;
  }
  .header-bar {
    position: fixed;
    width: 100%;
    height: 100rpx;
    line-height: 100rpx;
    text-align: center;
    color: #fff;
    background: #d6413d;
    z-index: 99;
  }
  .hot-search-item {
    display: inline-block;
    padding: 5px 10px;
    margin: 10rpx;
    color: #000;
    font-size: 24rpx;
    border: 1px solid #ccc;
    border-radius: 20px;
  }
  .search-suggest-box {
    position: absolute;
    width: 100%;
    top: 100rpx;
    left: 0;
    padding: 20rpx 30rpx 20rpx 60rpx;
    font-size: 26rpx;
    line-height: 2;
    background: #fff;
    z-index: 5;
    -webkit-box-shadow: 0 0 0 rgba(125,125,125,0.8);
    box-shadow: 0 0 0 rgba(125,125,125,0.8);
  }
  .hot-singers {
    font-size: 30rpx;
    text-align: center;
    padding-top: 30rpx;
    color: #333;
    overflow: hidden;
  }
  .search-input {
    color: #333;
  }
  .search-detail-box {
    padding: 50rpx 20rpx;
    font-size: 26rpx;
  }
  .cover-box {
    width: 100%;
    text-align: center;
  }
  .cover-box img {
    width: 100%;
  }
  .search-item {
    margin-top: 20rpx;
  }
</style>
