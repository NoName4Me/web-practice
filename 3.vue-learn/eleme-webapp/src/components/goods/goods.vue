<template>
<div class="goods">
  <div class="menu-wrapper" ref="menuWrapper">
    <ul class="names">
      <li v-for="(good,index) of goods" class="good-item" :class="{active: currentIdx === index}" @click="selectMenu(index,$event)">
        <div class="good-item-cell border-1px">
          <span v-if="good.type>0" class="icon" :class="classMap[good.type]"></span>
          <span class="text">{{good.name}}</span>
        </div>
      </li>
    </ul>
  </div>
  <div class="content-wrapper" ref="contentWrapper">
    <ul class="foods-list">
      <li v-for="good of goods" class="foods">
        <h1 class="title">{{good.name}}</h1>
        <ul class="food-list">
          <li v-for="food of good.foods" class="food border-1px">
            <div class="avatar"><img width="57" height="57" :src="food.icon" alt=""></div>
            <div class="content">
              <h1 class="name">{{food.name}}</h1>
              <p class="description">{{food.description}}</p>
              <div class="extra">
                <span class="sold-count">月售{{food.sellCount}}份</span>
                <span>好评率{{food.rating}}%</span>
              </div>
              <div class="price">
                <span class="now-price"><span class="pre">￥</span>{{food.price}}</span>
                <span v-if="food.oldPrice" class="old-price"><span class="pre">￥</span>{{food.oldPrice}}</span>
                <div class="number-ctrl-wrapper">
                  <v-number-ctrl :food="food"></v-number-ctrl>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </li>
    </ul>
  </div>
  <v-cart :food-list="foodList" :cart-prices="{deliveryPrice:seller.deliveryPrice,minPrice:seller.minPrice}"></v-cart>
</div>
</template>

<script>
import BScroll from 'better-scroll';
import cart from '../cart/cart';
import numberCtrl from '../numberCtrl/numberCtrl';
export default {
  name: 'goods',
  props: {
    seller: Object
  },
  data: function() {
    return {
      goods: [],
      scrollY: 0,
      heightList: [0]
    };
  },
  computed: {
    currentIdx() {
      for (let i = 0; i < this.heightList.length; i++) {
        if (this.scrollY >= this.heightList[i] && this.scrollY < this.heightList[i + 1]) {
          return i;
        }
      }
      return 0;
    },
    foodList() {
      let foods = [];
      this.goods.forEach(good => {
        good.foods.forEach(food => {
          if (food.count) {
            foods.push(food);
          }
        });
      });
      return foods;
    }
  },
  watch: {
    currentIdx: function() {
      let menuList = document.querySelectorAll('.menu-wrapper .good-item');
      this.menuScroll.scrollToElement(menuList[this.currentIdx], 500);
    }
  },
  created() {
    this.$http.get('/get/goods').then((res) => {
      this.goods = res.body.data;
      this.$nextTick(() => {
        this.menuScroll = new BScroll(this.$refs.menuWrapper, {
          click: true
        });
        this.contentScroll = new BScroll(this.$refs.contentWrapper, {
          click: true,
          probeType: 3
        });
        this.contentScroll.on('scroll', (pos) => {
          this.scrollY = Math.abs(Math.round(pos.y));
        });
        this.calculateScrollY();
      });
    });
    this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
  },
  methods: {
    calculateScrollY() {
      let contentList = this.$refs.contentWrapper.querySelectorAll('.content-wrapper .foods');
      let height = 0;
      contentList.forEach((element) => {
        height += element.clientHeight;
        this.heightList.push(height);
      });
    },
    selectMenu(index, event) {
      if (!event._constructed) {
        return;
      }
      let contentList = this.$refs.contentWrapper.querySelectorAll('.content-wrapper .foods');
      let el = contentList[index];
      this.contentScroll.scrollToElement(el, 500);
    }
  },
  components: {
    'v-cart': cart,
    'v-number-ctrl': numberCtrl
  }
};
</script>
<style rel="stylesheet/scss" lang='scss'>
@import '../../common/sass/_diy.scss';
.goods {
    position: absolute;
    top: 174px;
    bottom: 46px;
    display: flex;
    width: 100%;
    overflow: hidden;
    .menu-wrapper {
        flex: 0 0 80px;
        background-color: #f3f5f7;
        font-size: 0;
        .active {
            background-color: #fff;
            position: relative;
            font-weight: 700;
            z-index: 10;
            margin-top: -1px;
            .good-item-cell {
                @include border-none();
            }
        }
        .good-item {
            padding: 0 12px;
            height: 54px;
            width: 56px;
            display: table;
            line-height: 14px;
            @include icon-with-text(12px,3,4px);
            .icon {
                vertical-align: top;
                margin-right: 2px;
            }
            .good-item-cell {
                vertical-align: middle;
                display: table-cell;
                @include border-1px(rgba(7,17,27,.1));
            }
            .text {
                font-size: 12px;
                vertical-align: middle;
            }
        }
    }
    .content-wrapper {
        flex: 1 1;
        .title {
            height: 26px;
            line-height: 26px;
            margin: 0;
            padding: 0 0 0 12px;
            border-left: 2px solid #d9dde1;
            background-color: #f3f5f7;
            color: rgb(147,153,159);
            font-size: 12px;
        }
        .food-list {
            padding: 0 18px;
            .food {
                display: flex;
                padding: 18px 0;
                @include border-1px(rgba(7,17,27,.1));
                &:last-child {
                    @include border-none();
                }
                .avatar {
                    flex: 0 0 57px;
                    margin-right: 10px;
                }
                .content {
                    flex: 1;
                    .name {
                        font-size: 14px;
                        line-height: 14px;
                        color: rgb(7,17,27);
                        margin-top: 2px;
                    }
                    .description,
                    .extra,
                    .price {
                        margin-top: 8px;
                        font-size: 10px;
                        line-height: 12px;
                        color: rgb(147,153,159);
                    }
                    .sold-count {
                        margin-right: 12px;
                    }
                    .price {
                        font-size: 0;
                    }
                    .now-price,
                    .old-price {
                        font-size: 14px;
                        font-weight: 700;
                        color: #f01414;
                        margin-right: 8px;
                        .pre {
                            font-size: 10px;
                            font-weight: normal;
                        }
                    }
                    .old-price {
                        color: rgb(147,153,159);
                        font-size: 10px;
                        text-decoration: line-through;
                    }
                    .number-ctrl-wrapper {
                        position: absolute;
                        right: 0;
                        bottom: 16px;
                        height: 24px;
                        line-height: 24px;
                    }
                }
            }
        }
    }
}
</style>
