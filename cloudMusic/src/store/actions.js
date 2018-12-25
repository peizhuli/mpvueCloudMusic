/**
 * Created by Y on 2018/10/25.
 */
import service from '../service/service';
import util from '../utils';
export default {
  async getUser({state,commit}) {
    if(wx.getStorageSync('user')) {
      let userId = wx.getStorageSync('user').profile.userId;
      await service.getUserDetailInfo(userId).then(function(res) {
        commit('SET_PROFILE', res)
      })
    }
  },
  async getPlayList({state, commit}) {
    if(wx.getStorageSync('user')) {
      let userId = wx.getStorageSync('user').profile.userId;
      await service.getUserPlayLists(userId,0).then(function(res) {
        commit('SET_PLAY_LIST', res);
      })
    }
  },
  async getLikeMusicList({state, commit}) {
    if(wx.getStorageSync('user')) {
      let userId = wx.getStorageSync('user').profile.userId;
      await service.getLikeMusicList(userId).then(function(res) {
        commit('SET_LIKE_MUSIC_LIST', res.ids);
      })
    }
  },
  async getUserSubcount({state,commit}) {
    if(wx.getStorageSync('user')) {
      let userId = wx.getStorageSync('user').profile.userId;
      await service.getUserDetailInfo(userId).then(function(res) {
        commit('GET_USER_INFO_COUNT', res.profile)
      })
    }
  },
  async getPlayRecords({state, commit}) {
    if(wx.getStorageSync('user')) {
      let userId = wx.getStorageSync('user').profile.userId;
      await service.getUserPlayLists(userId,0).then(function(res) {
        commit('SET_PLAY_LIST', res.allData)
      })
    }
  },
  async logout({state, commit}) {
    if(wx.getStorageSync('user')) {
      await service.logout().then(function() {
        wx.removeStorageSync('user');
        commit('LOG_OUT');
      })
    }
  }
}
