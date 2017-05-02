<template>
<div id="app">
  <v-header :seller="seller"></v-header>
  <div class="tab border-1px">
    <div class="tab-item">
      <router-link to="/goods">商品</router-link>
    </div>
    <div class="tab-item">
      <router-link to="/ratings">评论</router-link>
    </div>
    <div class="tab-item">
      <router-link to="/seller">商家</router-link>
    </div>
  </div>
  <router-view :seller="seller"></router-view>
</div>
</template>

<script>
import header from './header/header.vue';
import goods from './goods/goods.vue';
export default {
  data: function() {
    return {
      seller: {}
    };
  },
  created: function() {
    this.$http.get('/get/seller').then((res) => {
      this.seller = res.body.data;
    });
  },
  // name: 'App',
  components: {
    'v-header': header,
    'v-content': goods
  }
};
</script>

<style rel="stylesheet/scss" lang='scss'>
@import '../common/sass/screen.scss';
.tab {
    display: flex;
    justify-content: space-around;
    width: 100%;
    height: 40px;
    align-items: center;
    font-weight: 500;
    @include border-1px(rgba(7,17,27,.2));
    .tab-item {
        flex: 1;
        // display: block;
        & > a {
            color: rgb(77,85,93);
            text-align: center;
            display: block;
            width: 100%;
            &.active {
                color: rgb(240,20,20);
            }
        }
    }
}
</style>
