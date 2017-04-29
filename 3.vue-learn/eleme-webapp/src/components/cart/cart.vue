<template>
<div class="cart">
  <div class="cart-simple" @click="toggleCartList">
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
  <transition name="cart-detail">
    <div class="cart-content" v-show="isShowCartList">
      <div class="cart-title">
        <span class="title">购物车</span>
        <span class="empty" @click="emptyCart">清空</span>
      </div>
      <div class="food-list-wrapper" ref="foodListWrapper">
        <ul class="food-list">
          <li v-for="food of foodList" class="food">
            <div class="name">{{food.name}}</div>
            <div class="price-number">
              <div class="price"><span class="pre">￥</span>{{food.price*food.count}}</div>
              <v-number-ctrl :food="food" :hub="hub" class="test"></v-number-ctrl>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </transition>
  <transition name="mask">
    <div class="cart-list-mask" v-show="isShowCartList" @click="toggleCartList"></div>
  </transition>
</div>
</template>

<script type="text/javascript">
import numberCtrl from '../numberCtrl/numberCtrl';
import BScroll from 'better-scroll';
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
        return [];
      }
    },
    hub: Object
  },
  data() {
    return {
      dropBallOffset: [],
      showDrop: false,
      showRemove: false,
      iconActive: false,
      isShowCartList: false
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
        inner.style.opacity = 1;
        inner.style.transform = `translate3d(0,-${this.dropBallOffset[1]}px,0)`;
      } else {
        let wrapper = document.querySelector('.ball-remove-wrapper');
        wrapper.style.transform = 'translate3d(0,0,0)';

        let inner = wrapper.querySelector('.inner');
        inner.style.opacity = 1;
        inner.style.transform = 'translate3d(0,0,0)';
      }
      // console.log(this.dropBallOffset);
    },
    enter: function(el, done) {
      let vm = this;
      if (this.showDrop) {
        setTimeout(function() {
          let wrapper = document.querySelector('.ball-drop-wrapper');
          wrapper.style.transform = 'translate3d(0,0,0)';
          let inner = wrapper.querySelector('.inner');
          inner.style.transform = 'translate3d(0,0,0) scale(2)';
        }, 0);
        // done();
        this.showDrop = false;
        setTimeout(function() {
          vm.iconActive = true;
        }, 400);
      } else {
        setTimeout(function() {
          let wrapper = document.querySelector('.ball-remove-wrapper');
          wrapper.style.transform = 'translate3d(-80px,0,0)';
          let inner = wrapper.querySelector('.inner');
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
      // console.log('enter: showDrop= ', this.showDrop);
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
    },
    toggleCartList() {
      if (this.foodCount > 0) {
        if (!this.isShowCartList) {
          this.foodListScroll = new BScroll(this.$refs.foodListWrapper, {
            click: true
          });
        }
        console.log(this.$refs.foodListWrapper);
        this.isShowCartList = !this.isShowCartList;
      }
    },
    emptyCart() {
      this.foodList.forEach(food => {
        if (food.count) {
          food.count = 0;
        }
      });
      this.isShowCartList = false;
      this.iconActive = false;
    }
  },
  components: {
    'v-number-ctrl': numberCtrl
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
@import '../../common/sass/_diy.scss';
.cart {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 46px;
    background-color: #141d27;
    z-index: 10;
    color: rgba(255,255,255,.4);
    .cart-simple {
        display: flex;
        position: relative;
        z-index: 40;
        .left {
            flex: 1;
            display: flex;
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
                height: 46px;
                font-size: 16px;
                display: flex;
                align-items: center;
                & > * {
                    height: 24px;
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
    }
    .ball-drop-wrapper,
    .ball-remove-wrapper {
        position: absolute;
        left: 32px;
        bottom: 18px;
        transition: all 0.3s linear;
        z-index: 50;
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
    .cart-content {
        position: fixed;
        bottom: 46px;
        font-size: 14px;
        max-height: 217px;
        width: 100%;
        color: rgb(7,17,27);
        background-color: #fff;
        z-index: -20;
        &.cart-detail-enter,
        &.cart-detail-leave-to {
            transform: translate3d(0,100%,0);
        }
        &.cart-detail-enter-active{
          transition: all .3s ease-in;
        }
        &.cart-detail-leave-active {
            transition: all .3s ease-out;
        }
        &.cart-detail-enter-to,
        &.cart-detail-leave {
            transform: translate3d(0,0,0);
        }
        .cart-title {
            display: flex;
            padding: 0 18px;
            justify-content: space-between;
            height: 40px;
            line-height: 40px;
            background-color: #f3f5f7;
            border-bottom: 1px solid rgba(7,17,27,.1);
            & > * {
                display: inline-block;
            }
            .title {
                height: 40px;
                font-weight: 200px;
            }
            .empty {
                margin-left: 20px;
                font-size: 12px;
                color: rgb(0,160,220);
            }
        }
        .food-list-wrapper {
            position: relative;
            overflow: hidden;
            .food-list {
                .food {
                    margin: 0 18px;
                    height: 48px;
                    line-height: 48px;
                    display: flex;
                    font-size: 14px;
                    justify-content: space-between;
                    font-weight: normal;
                    @include border-1px(rgba(7,17,27,.1));
                    .name {
                        padding: 12px 0;
                        line-height: 24px;
                    }
                    .price-number {
                        display: flex;
                        align-items: center;
                        .price {
                            color: rgb(240,20,20);
                            font-weight: 700;
                            font-size: 14px;
                            margin-right: 12px;
                            .pre {
                                font-weight: normal;
                                font-size: 10px;
                            }
                        }
                    }
                }
            }
        }
    }
    .cart-list-mask {
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: -21;
        background-color: rgba(7,17,27,.6);
        backdrop-filter: blur(10px);
        &.mask-enter,
        &.mask-leave-to {
            background-color: rgba(7,17,27,0);
        }
        &.mask-enter-active,&.mask-leave-active{
          transition: all .4s ease;
        }
        &.mask-enter-to,
        &.mask-leave {
            background-color: rgba(7,17,27,.6);
        }
    }

}
</style>
