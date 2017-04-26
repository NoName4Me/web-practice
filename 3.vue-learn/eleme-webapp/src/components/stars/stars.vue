<template>
<div class="stars">
  <span v-for="oneStar of allStars" :class="[oneStar,starSize]" class="star-item"></span>
</div>
</template>

<script>
const STAR_NUMBER = 5;
const CLASS_ON = 'on';
const CLASS_HALF = 'half';
const CLASS_OFF = 'off';

export default {
  name: 'stars',
  props: {
    size: Number,
    score: Number
  },
  computed: {
    allStars() {
      let result = [];
      result.length = STAR_NUMBER;
      result.fill(CLASS_OFF);
      let newScore = Math.floor(this.score * 2) / 2;
      if (!Number.isInteger(newScore)) {
        result[Math.floor(newScore)] = CLASS_HALF;
      }
      result.fill(CLASS_ON, 0, Math.floor(newScore));
      return result;
    },
    starSize() {
      return 'star-' + this.size;
    }
  }
};
</script>
<style rel="stylesheet/scss" lang='scss'>
@import '../../common/sass/_diy.scss';

.stars {
    .star-item {
        display: inline-block;
        font-size: 0;
    }
    @include star-style(48,20px,22px);
    @include star-style(36,15px,6px);
    @include star-style(24,10px,3px);
}
</style>
