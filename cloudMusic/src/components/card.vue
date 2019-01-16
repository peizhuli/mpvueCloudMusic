<template>
  <div>
    <i-row class="right-content-box">
      <i-col span="8">
        <img class="col-img" :src="picUrl" />
      </i-col>
      <i-col span="16">
        <div class="col-content">
          <div><i-avatar v-if="hasAvatar" :src="avatartUrl"></i-avatar>{{ title }}</div>
          <div class="recommend-reason">{{ subTitle }}</div>
        </div>
      </i-col>
    </i-row>
  </div>
</template>

<script>
export default {
  props: ['hasAvatar', 'avatartUrl', 'picUrl', 'title', 'subTitle']
}
</script>

<style scoped>
  .recommend-reason {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 28rpx;
    color: #666;
  }
</style>
