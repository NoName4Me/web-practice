<template>
<div id="app">
  <div class="header">
    <v-header></v-header>
  </div>

  <div class="tab">
    <div class="tab-item"><router-link to="/goods">商品</router-link></div>
    <div class="tab-item"><router-link to="/ratings">评论</router-link></div>
    <div class="tab-item"><router-link to="/seller">商家</router-link></div>

  </div>
  <router-view></router-view>
</div>
</template>

<script>
import header from './components/header/header.vue';
export default {
  // name: 'App',
  components: {
    'v-header': header
  }
};
</script>

<style rel="stylesheet/scss" lang='scss' scoped>
.tab {
    width: 100%;
    height: 40px;
    display: flex;
    justify-content: space-around;
    .tab-item {
        // flex: 2;
    }
}
</style>
