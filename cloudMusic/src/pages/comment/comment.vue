<template>
  <div class="app-content">
    <div class="similar-songs-box">
      <i-row class="similar-song-info-box">
        <i-col span="6">
        <img class="col-img" :src="recommendSong.album ? recommendSong.album.picUrl : ''" />
        </i-col>
        <i-col class="similar-song-content" span="18">
          <div class="col-content">
            <div>{{ recommendSong.name }}</div>
            <div>{{ recommendSong.artists ? recommendSong.artists[0].name : '' }}</div>
          </div>
        </i-col>
      </i-row>
    </div>
    <div class="comments-box">
      <div v-if="hotComments.length" class="comment-item" v-for="item in hotComments" :key="item.commentId">
        <i-row>
          <i-col span="4" class="avatar-box">
            <i-avatar :src="item.user ? item.user.avatarUrl : ''"></i-avatar>
          </i-col>
          <i-col span="20" class="comment-content">
            <div class="nickname">{{ item.user ? item.user.nickname : '' }}
              <span class="float-right">
                <i-icon type="praise" :color="item.liked ? '#ff0000' : '#999'" size="24" @click="toggleLikeComment(item.liked, item.commentId)"/>
                {{ item.likedCount > 99 ? '99+' : item.likedCount }}
              </span>
            </div>
          <div>{{ item.time | formatTime }}</div>
          <div>{{ item.content }}</div>
          </i-col>
        </i-row>
      </div>
      <div v-if="!hotComments.length">
        <p>暂无评论</p>
      </div>
    </div>
    <div class="comment-publish-box">
      <input class="comment-input" placeholder="输入评论内容..." v-model="commentContent" />
      <button class="comment-btn" @click="publishComment()">评论</button>
    </div>
  </div>
</template>

<script>
  import service from '../../service/service';
  import util from '../../utils/index';
  export default {
    name: 'Comment',
    mounted() {
      this.id = this.$root.$mp.query.id;
      this.commentType = this.$root.$mp.query.type;
      if(this.id != '' && this.id != undefined) {
        this.getSimilarSong(this.id);
        this.getMusicComment(this.id, this.currentOffset);
      }
      wx.setNavigationBarTitle({
        title: '歌曲评论'
      });
    },
    data() {
      return {
        hotComments: [],
        comments: [],
        recommendSong: {},
        commentContent: '',
        commentType: 0,
        id: '',
        currentOffset: 0,
        hasMore: false
      }
    },
    filters: {
      formatTime: function(time) {
        return util.formatterTime(time)
      }
    },
    methods: {
      getSimilarSong: function (id) {
        let vm = this;
        service.getSimilarSongs(id).then(function (res) {
          if(res.code == 200 && res.songs.length) {
            vm.recommendSong = res.songs[0];
          }
        })
      },
      getMusicComment: function (id, offset) {
        let vm = this;
        let currentCommentType = '';
        switch(this.commentType) {
          case 0: {
              currentCommentType = 'music';
              break;
          }
          case 1: {
            currentCommentType = 'mv';
            break;
          }
          case 2: {
            currentCommentType = 'playlist';
            break;
          }
          case 3: {
            currentCommentType = 'album';
            break;
          }
          case 4: {
            currentCommentType = 'dj';
            break;
          }
          case 4: {
            currentCommentType = 'video';
            break;
          }
          default: {
            currentCommentType = 'music';
            break;
          }
        }
        service.getComment(currentCommentType, id, offset).then(function (res) {
          if(res.code == 200) {
            vm.hasMore = res.more;
            vm.hotComments = vm.hotComments.concat(res.hotComments);
            vm.comments = vm.comments.concat(res.comments);
          }
        })
      },
      toggleLikeComment: function (t,commentId) {
        t = t ? 0 : 1;
        let type = this.commentType;
        let id= this.id;
        service.likeComment(t, type, id, commentId).then(function (res) {
          console.log(res);
        })
      },
      publishComment: function () {
        let t = 1;
        let type = 0;
        let id = this.$route.query.id;
        let content = this.commentContent;
        if(content != '') {
          service.comment(t, id, type, content).then(function (res) {
            if(res.code == 200) {
              alert('发布成功！');
              vm.commentContent = '';
            }
          })
        }
      }
    },
    onReachBottom() {
      let vm = this;
      if(vm.hasMore) {
        vm.currentOffset++;
        vm.getMusicComment(vm.id, vm.currentOffset);
      }
    }
  }
</script>

<style scoped>
  .similar-songs-box {
    height: 25%;
    font-size: 30rpx;
  }
  .similar-song-info-box,
  .similar-song-info-box > div {
    height: 100%
  }
  .similar-song-content {
    display: flex;
    padding-left: 5%;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
  }
  .comments-box {
    padding: 0 20rpx 120rpx 0;
  }
  .comment-item {
    margin-top: 20rpx;
  }
  .avatar-box {
    text-align: center;
  }
  .comment-content {
    font-size: 24rpx;
  }
  .like-music-icon {
    float: right;
    margin-right: 5%;
    position: relative;
  }
  .similar-songs-box {
    padding: 20rpx;
  }
  .comment-publish-box {
    width:100%;
    height:100rpx;
    position: fixed;
    bottom: 0;
    border: 1px solid #ccc;
    background: #fff;
    /*box-shadow: 0px 2px 5px 5px rgba(125,125,125,0.6);*/
  }
  .comment-input {
    width: 80%;
    height: 100%;
    padding-left: 10rpx;
    display: inline-block;
    font-size: 24rpx;
    border: none;
    background: #fff;
    outline: none;
  }
  .comment-btn {
    height: 100%;
    float: right;
    font-size: 30rpx;
    line-height:3;
    color: #fff;
    border: none;
    border-radius:0;
    background: #e64340;
  }
</style>
