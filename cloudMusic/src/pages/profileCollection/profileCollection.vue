<template>
  <div>
    <p>收藏列表</p>
  </div>
</template>

<script>
  import service from '../../service/service';
  import {mapState} from 'vuex';
  export default {
    mounted() {
      this.getCollections();
    },
    data() {
      return {}
    },
    computed: {
      ...mapState(['user'])
    },
    methods: {
      getCollections: function() {
        let vm = this;
        let id = vm.user.profile.userId;
        service.getUserSongs(id).then(function(res) {
          console.log(res);
        });
      }
    }
  }
</script>
