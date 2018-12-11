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
      <div class="hot-singers" @click="">
          <i-icon type="ios-person-outline" size="30" />
          <span>歌手分类</span>
          <i-icon type="ios-arrow-forward" size="30" />
      </div>
      <div class="hot-search-box">
        <p>热门搜索</p>
        <div>
          <span class="hot-search-item" v-for="(item, index) in hotSearchArr" :key="index">{{ item.first }}</span>
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

      <div class="search-content" v-show="searchArrs.length">
        <i-tabs i-class="pad-top tab-bar" :current="currentTab" color="#f759ab" @change="handleChange">
          <i-tab key="song" title="单曲"></i-tab>
          <i-tab key="artist" title="歌手"></i-tab>
          <i-tab key="album" title="专辑"></i-tab>
          <i-tab key="playLists" title="歌单"></i-tab>
          <i-tab key="videos" title="视频"></i-tab>
        </i-tabs>
        <div class="search-detail-box">
          <ul class="">
            <li v-for="item in searchArrs" :key="item.id">
              {{ item.name }}
            </li>
          </ul>
        </div>
        <!--<Tabs value="song">-->
          <!--<TabPane label="单曲" name="song" @click="searchMusic(keyword, '1', 30, 0)">-->
            <!---->
          <!--</TabPane>-->
          <!--<TabPane label="歌手" name="artist" @click="searchMusic(keyword, '100', 30, 0)">-->

          <!--</TabPane>-->
          <!--<TabPane label="专辑" name="album" @click="searchMusic(keyword, '10', 30, 0)">-->

          <!--</TabPane>-->
          <!--<TabPane label="歌单" name="playLists" @click="searchMusic(keyword, '1', 30, 0)">-->

          <!--</TabPane>-->
          <!--<TabPane label="视频" name="videos" @click="searchMusic(keyword, '1004', 30, 0)">-->

          <!--</TabPane>-->
        <!--</Tabs>-->
      </div>
    </div>
  </div>
</template>
<script>
  import service from '../../service/service';
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
            currentTab: 'song',
          }
      },
    mounted() {
          this.hotSearch();
    },
    methods: {
      handleChange (detail) {
        this.currentTab =  detail.target.key;
        switch(this.currentTab) {
          case 'song': {
            this.searchMusic(this.keyword, '1', 30, 0);
            break;
          }
          case 'artist': {
              this.searchMusic(this.keyword, '100', 30, 0);
            break;
          }
          case 'album': {
              this.searchMusic(this.keyword, '10', 30, 0);
            break;
          }
          case 'playLists': {
            this.searchMusic(this.keyword, '1', 30, 0);
            break;
          }
          case 'videos': {
            this.searchMusic(this.keyword, '1004', 30, 0);
            break;
          }
        }
      },
      searchMusic: function (keyword, type, limit, offset) {
            let vm = this;
            console.log(keyword);
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
      }
    }
  }
</script>

<style scoped>
  .search-box {
    width: 80%;
    padding-left: 10rpx;
    top: 20rpx;
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
  }
  .search-input {
    color: #333;
  }
  .search-detail-box {
    padding-top: 50rpx;
  }
</style>
