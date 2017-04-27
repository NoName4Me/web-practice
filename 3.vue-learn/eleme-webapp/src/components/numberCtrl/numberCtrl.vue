<template>
<div class="number-ctrl">
  <transition name="fade">
    <div v-show='food.count>0' class="ctrl-minus ic-remove_circle_outline" @click="minusOne($event)"></div>

  </transition>
  <div v-show='food.count>0' class="ctrl-number">{{food.count}}</div>
  <div class="ctrl-plus ic-add_circle" @click="plusOne($event)"></div>
</div>
</template>


<script type="text/javascript">
import Vue from 'vue';
export default {
  name: 'numberCtrl',
  props: {
    food: {
      type: Object
    }
  },
  created() {
    // console.log(this.food);
  },
  methods: {
    plusOne(event) {
      if (!event._constructed) {
        return;
      }
      if (!this.food.count) {
        Vue.set(this.food, 'count', 1);
      } else {
        this.food.count++;
      }
    },
    minusOne(event) {
      if (!event._constructed) {
        return;
      }
      if (this.food.count) {
        this.food.count--;
      }
    }
  }
};
</script>


<style rel="stylesheet/scss" lang="scss">
.number-ctrl {
    font-size: 0;
    & > * {
        display: inline-block;
        font-size: 24px;
        color: rgb(0,160,220);
    }
    .fade-enter {
        opacity: 0;
        transform: perspective(500px) translateZ(-200px) rotate(180deg) translateX(-20px);
    }
    .fade-enter-active {
        transition: all 0.5s ease-in;
    }

    .fade-leave {
        // keep normal
    }
    .fade-leave-active {
        transition: all 0.3s ease-out;

    }
    .fade-leave-to {
        transform: perspective(500px) translateZ(200px) rotate(180deg);
        opacity: 0;
    }

    .ctrl-number {
        width: 20px;
        font-size: 10px;
        text-align: center;
        vertical-align: top;
        color: rgb(147,153,159);
    }

}
</style>
