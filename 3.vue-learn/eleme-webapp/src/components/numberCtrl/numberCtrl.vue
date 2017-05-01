<template>
<div class="number-ctrl">
  <transition name="fade">
    <div v-show='food.count>0' class="ctrl-minus ic-remove_circle_outline" @click.stop.prevent="minusOne($event)"></div>
  </transition>
  <div v-show='food.count>0' class="ctrl-number">{{food.count}}</div>
  <div class="ctrl-plus ic-add_circle" @click.stop.prevent="plusOne($event)"></div>
</div>
</template>

<script type="text/javascript">
import Vue from 'vue';
export default {
  name: 'numberCtrl',
  props: {
    food: {
      type: Object
    },
    hub: Object
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
      // console.log(event.srcElement.getBoundingClientRect());
      this.hub.$emit('drop-ball', event.srcElement.getBoundingClientRect());
    },
    minusOne(event) {
      if (!event._constructed) {
        return;
      }
      if (this.food.count) {
        this.food.count--;
      }
      this.hub.$emit('remove-ball');
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.number-ctrl {
    font-size: 0;
    display: flex;
    align-items: center;
    // height: 36px;
    & > * {
        display: inline-block;
        font-size: 24px;
        padding: 6px 4px;
        color: rgb(0,160,220);
        flex: 0;
    }
    .fade-enter {
        opacity: 0;
        transform: perspective(500px) translateZ(-200px) rotate(180deg) translateX(-20px);
    }
    .fade-enter-active {
        transition: all 0.4s ease-in;
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
        min-width: 20px;
        width: 20px;
        line-height: 36px;
        font-size: 10px;
        text-align: center;
        color: rgb(147,153,159);
        padding: 0;
    }

}
</style>
