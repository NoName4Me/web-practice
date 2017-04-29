<template>
<div class="cart">
  <div class="left">
    <div class="icon-wrapper">
      <div class="icon" :class="{active:iconActive}"><i class="ic-shopping_cart"></i></div>
      <div class="count" v-show="iconActive">{{foodCount}}</div>
    </div>
    <div class="price-wrapper">
      <span class="food-price" :class="{active:foodPrice>1}">￥{{foodPrice}}</span>
      <span class="deliver-price">另需配送费￥{{cartPrices.deliveryPrice}}元</span>
    </div>
  </div>
  <div class="right" :class="{active:foodPrice>=cartPrices.minPrice}">
    <span class="pay">{{payDescription}}</span>
  </div>
  <transition name="drop" @before-enter="beforeEnter" @enter="enter">
    <div v-show="showDrop" class="ball-drop-wrapper">
      <div class="inner"></div>
    </div>
  </transition>
  <transition name="drop" @before-enter="beforeEnter" @enter="enter">
    <div v-show="showRemove" class="ball-remove-wrapper">
      <div class="inner"></div>
    </div>
  </transition>
</div>
</template>

<script type="text/javascript">
export default {
  name: 'cart',
  props: {
    cartPrices: {
      type: Object,
      default () {
        return {
          deliveryPrice: 4,
          minPrice: 1
        };
      }
    },
    foodList: {
      type: Array,
      default () {
        return [{
          price: 10,
          count: 1
        }];
      }
    },
    hub: Object
  },
  data() {
    return {
      dropBallOffset: [],
      showDrop: false,
      showRemove: false,
      iconActive: false
    };
  },
  created() {
    this.hub.$on('drop-ball', this.dropBall);
    this.hub.$on('remove-ball', this.removeBall);
  },
  computed: {
    foodCount: function() {
      return this.foodList.reduce((cnt, food) => cnt + food.count, 0);
    },
    foodPrice: function() {
      return this.foodList.reduce((price, food) => price + (food.price * food.count), 0);
    },
    payDescription() {
      if (this.foodPrice === 0) {
        return `￥${this.cartPrices.minPrice}起送`;
      } else if (this.foodPrice < this.cartPrices.minPrice) {
        return `还差￥${this.cartPrices.minPrice - this.foodPrice}元起送`;
      } else {
        return '去结算';
      }
    }
  },
  methods: {
    beforeEnter: function(el) {
      if (this.showDrop) {
        let wrapper = document.querySelector('.ball-drop-wrapper');
        wrapper.style.transform = `translate3d(${this.dropBallOffset[0]}px,0,0)`;

        let inner = wrapper.querySelector('.inner');
        inner.style.opacity = '1';
        inner.style.transform = `translate3d(0,-${this.dropBallOffset[1]}px,0)`;
      } else {
        let wrapper = document.querySelector('.ball-remove-wrapper');
        wrapper.style.transform = 'translate3d(0,0,0)';

        let inner = wrapper.querySelector('.inner');
        inner.style.opacity = 1;
        inner.style.transform = 'translate3d(0,0,0)';
      }
      console.log(this.dropBallOffset);
    },
    enter: function(el, done) {
      let vm = this;
      if (this.showDrop) {
        setTimeout(function() {
          let wrapper = document.querySelector('.ball-drop-wrapper');
          wrapper.style.transform = 'translate3d(0,0,0)';
          let inner = wrapper.querySelector('.inner');
          inner.style.opacity = 0.8;
          inner.style.transform = 'translate3d(0,0,0) scale(2)';
        }, 0);
        // done();
        this.showDrop = false;
        setTimeout(function() {
          // let icon = document.querySelector('.icon-wrapper .icon');
          // console.log(icon.className);
          // if (!(icon.className && icon.className.split(' ').some(x => x.trim() === 'active'))) {
          //   icon.className += ' active';
          // }
          vm.iconActive = true;
        }, 400);
      } else {
        setTimeout(function() {
          let wrapper = document.querySelector('.ball-remove-wrapper');
          wrapper.style.transform = 'translate3d(-80px,0,0)';
          let inner = wrapper.querySelector('.inner');
          inner.style.opacity = 1;
          inner.style.transform = 'translate3d(0,-40px,0)';
        }, 0);
        // done();
        this.showRemove = false;
        setTimeout(function() {
          // let icon = document.querySelector('.icon-wrapper .icon');
          if (vm.foodCount < 1) {
            // icon.className = 'icon';
            vm.iconActive = false;
          }
        }, 50);
      }
      console.log('enter: showDrop= ', this.showDrop);
    },
    dropBall(srcRect) {
      // var curRect = document.querySelector('.ball-animate-wrapper').getBoundingClientRect();
      // console.log(curRect);
      this.dropBallOffset[0] = Math.abs(36 - srcRect.left);
      this.dropBallOffset[1] = Math.abs(window.innerHeight - 12 - srcRect.bottom);
      this.showDrop = true;
      // console.log(srcRect);
    },
    removeBall() {
      this.showRemove = true;
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.cart {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 46px;
    background-color: #141d27;
    display: flex;
    z-index: 50;
    color: rgba(255,255,255,.4);
    .left {
        flex: 1;
        // display: flex;
        .icon-wrapper {
            display: inline-block;
            position: relative;
            top: -10px;
            margin: 0 12px;
            width: 50px;
            height: 50px;
            padding: 6px;
            text-align: center;
            background-color: #141d27;
            border-radius: 50%;
            .icon {
                display: inline-block;
                width: 44px;
                height: 44px;
                background-color: #2b333b;
                border-radius: 50%;
                i {
                    font-size: 24px;
                    line-height: 44px;
                }
                &.active {
                    background-color: rgb(0,160,220);
                    color: #fff;
                }
            }
            .count {
                position: absolute;
                top: 0;
                right: 0;
                width: 24px;
                height: 16px;
                line-height: 16px;
                text-align: center;
                font-size: 9px;
                font-weight: 700;
                color: #fff;
                background-color: rgb(240,20,20);
                border-radius: 16px;
                box-shadow: 0 4px 8px 0 rgba(0,0,0,.4);
            }
        }
        .price-wrapper {
            display: inline-block;
            height: 46px;
            line-height: 46px;
            & > * {
                display: inline-block;
                vertical-align: middle;

                vertical-align: top;
                line-height: 24px;
            }
            .food-price {
                font-size: 16px;
                padding-right: 12px;
                font-weight: 700;
                border-right: 1px solid rgba(255,255,255,.1);
                &.active {
                    color: #fff;
                }
            }
            .deliver-price {
                font-size: 12px;
                padding-left: 12px;
            }
        }
    }
    .right {
        flex: 0 0 105px;
        background-color: #2b333b;
        text-align: center;
        line-height: 46px;
        .pay {
            display: inline-block;
            font-size: 12px;
            font-weight: 700;
        }
        &.active {
            background-color: #00b43c;
            color: #fff;
        }
    }
    .ball-drop-wrapper,
    .ball-remove-wrapper {
        position: absolute;
        left: 32px;
        bottom: 18px;
        transition: all 0.3s linear;
        .inner {
            width: 24px;
            height: 24px;
            background-color: rgb(0,160,220);
            border-radius: 50%;
            opacity: 0;
            transition: all 0.3s cubic-bezier(.61,-0.25,.93,.8);
        }
    }
    .ball-remove-wrapper {
        transition: all 0.2s linear;
        .inner {
            transition: all 0.2s cubic-bezier(.09,.83,.75,.98);
        }
    }

}
</style>
