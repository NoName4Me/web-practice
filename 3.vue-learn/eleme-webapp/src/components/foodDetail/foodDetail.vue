<template>
<div class="food-detail-wrapper" ref="foodDetail">
  <div class="food-detail">
    <div class="top-img"><img :src="food.image" alt=""><i class="ic-arrow_lift" @click="back()"></i></div>
    <div class="basic-info">
      <h1 class="big">{{food.name}}</h1>
      <span class="small">月售{{food.sellCount}}份</span>
      <span class="small">好评率{{food.rating}}%</span>
      <div class="price-add-cart">
        <div class="price">
          <span class="current-price"><span class="pre">￥</span>{{food.price}}</span>
          <span class="old-price" v-show="food.oldPrice"><span class="pre">￥</span>{{food.oldPrice}}</span>
        </div>
        <div class="add-to-cart-wrapper">
          <div @click="addToCart(food, $event)" class="add-to-cart" v-if="!food.count || food.count===0">加入购物车</div>
          <v-number-ctrl :hub="hub" v-if="food.count>0" :food="food"></v-number-ctrl>
        </div>
      </div>
    </div>
    <div class="description" v-show="food.info">
      <h1>商品介绍</h1>
      <p class="info">{{food.info}}</p>
    </div>
    <div class="ratings">
      <h1 class="title">商品评价</h1>
      <v-rating-filter :ratings="food.ratings" @filterd="filterRatings"></v-rating-filter>
      <!--
      <div class="filters border-1px">
        <p class="all">全部<span>{{food.ratings[0].username}}</span></p>
        <p class="recommend">推荐<span>{{recommendCount}}</span></p>
        <p class="bad">吐槽<span>{{badCount}}</span></p>
      </div>
      <div class="filter-only-content" @click="filterContentOnly()"><i class="ic-check_circle" :class="{active:isContentOnly}"></i><span>只看有内容的评价</span></div>
-->
      <div class="rating-list">
        <ul>
          <li v-for="rating of food.ratings" class="rating border-1px" v-show="showRating(rating.rateType, rating.text)">
            <div class="time-user">
              <p class="time">{{rating.rateTime | formatDate}}</p>
              <div class="user">
                <span class="name">{{rating.username}}</span><img :src="rating.avatar" alt="" class="avatar" width="12" height="12"></div>
            </div>
            <div class="rating-content">
              <i :class="[rating.rateType === 0?'ic-thumb_up':'ic-thumb_down']"></i> {{rating.text}}
            </div>
          </li>
        </ul>
        <div class="no-rating" v-show="!food.ratings||food.ratings.length===0">
          暂无评价
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import BScroll from 'better-scroll';
import numberCtrl from '../numberCtrl/numberCtrl';
import Vue from 'vue';
import ratingFilter from '../ratings/ratingFilter';
import {
  dateFormat
} from '../../common/js/utils';
export default {
  name: 'food-detail',
  props: {
    food: Object,
    hub: Object
  },
  created() {
    this.$nextTick(() => {
      this.foodDetailScroll = new BScroll(this.$refs.foodDetail, {
        click: true
      });
    });
  },
  data() {
    return {
      isShow: true,
      filterType: 2,
      filterContent: false
    };
  },
  computed: {
    badCount() {
      return this.food.ratings.filter(x => x.rateType === 1).length;
    },
    recommendCount() {
      return this.food.ratings.filter(x => x.rateType === 0).length;
    }
  },
  filters: {
    formatDate(time) {
      return dateFormat(new Date(time), 'yyyy-MM-dd hh:mm');
    }
  },
  methods: {
    show() {
      this.isShow = true;
    },
    back() {
      this.$emit('hide');
    },
    addToCart(food, event) {
      if (!event._constructed) {
        return;
      }
      Vue.set(this.food, 'count', 1);
      this.hub.$emit('drop-ball', event.srcElement.getBoundingClientRect());
    },
    filterRatings(type) {
      switch (type) {
        case 'all':
          this.filterType = 2;
          break;
        case 'recommend':
          this.filterType = 0;
          break;
        case 'bad':
          this.filterType = 1;
          break;
        case 'content-yes':
          this.filterContent = true;
          break;
        case 'content-no':
          this.filterContent = false;
          break;
      }
      // console.log('hello', type, this.filterType);
    },
    showRating(type, text) {
      if (this.filterContent && !text) {
        return false;
      }
      if (this.filterType === 2 || type === this.filterType) {
        return true;
      }
    }
  },
  components: {
    'v-number-ctrl': numberCtrl,
    'v-rating-filter': ratingFilter
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
@import '../../common/sass/_diy.scss';
.food-detail-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 46px;
    width: 100%;
    z-index: 5;
    background-color: #f3f5f7;
    overflow: hidden;
    &.slide-enter,
    &.slide-leave-to {
        transform: translate3d(100%,0,0);
    }
    &.slide-enter-active,
    &.slide-leave-active {
        transition: all 0.3s ease-in-out;
    }
    &.slide-enter-to,
    &.slide-leave {
        transform: translate3d(0,0,0);
    }
    .food-detail {
        .top-img {
            position: relative;
            width: 100%;
            padding-top: 100%;
            height: 0;
            img {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
            }
            i {
                position: absolute;
                left: 10px;
                top: 10px;
                font-size: 20px;
                color: white;
                padding: 10px;
            }
        }
        .basic-info {
            padding: 18px;
            background-color: #fff;
            border-bottom: 1px solid rgba(7,17,27,.1);
            .big {
                font-size: 14px;
                color: rgb(7,17,27);
                line-height: 14px;
                font-weight: 700;
                padding-bottom: 8px;
            }
            .small {
                padding-top: 8px 12px 18px 0;
                font-size: 10px;
                color: rgb(147,153,159);
                line-height: 10px;
            }
            .price-add-cart {
                display: flex;
                justify-content: space-between;
                padding-top: 18px;
                .price {
                    .current-price {
                        font-size: 14px;
                        color: rgb(240,20,20);
                        font-weight: 700;
                        line-height: 24px;
                        .pre {
                            font-size: 10px;
                            font-weight: normal;
                        }
                    }
                    .old-price {
                        font-size: 10px;
                        color: rgb(147,153,159);
                        font-weight: 700;
                        line-height: 24px;
                        text-decoration: line-through;
                        .pre {
                            font-weight: normal;
                        }
                    }
                }
                .add-to-cart-wrapper {
                    .add-to-cart {
                        box-sizing: border-box;
                        font-size: 10px;
                        color: white;
                        line-height: 24px;
                        flex: 0 0 74;
                        padding: 0 12px;
                        height: 24px;
                        text-align: center;
                        background-color: rgb(0,160,220);
                        border-radius: 12px;
                    }
                }
            }
        }
        .description {
            margin-top: 16px;
            padding: 18px;
            background-color: #fff;
            border-top: 1px solid rgba(7,17,27,.1);
            border-bottom: 1px solid rgba(7,17,27,.1);
            h1 {
                font-size: 14px;
                color: rgb(7,17,27);
                line-height: 14px;
                font-weight: 700;
            }
            p {
                font-size: 12px;
                line-height: 24px;
                color: rgb(77,86,93);
                font-weight: 200;
                padding: 6px 8px;

            }
        }
        .ratings {
            margin-top: 16px;
            border-top: 1px solid rgba(7,17,27,.1);
            padding: 18px;
            background-color: #fff;
            h1 {
                font-size: 14px;
                color: rgb(7,17,27);
                line-height: 14px;
                font-weight: 700;
            }
            /*
            .filters {
                display: flex;
                @include border-1px(rgba(7,17,27,.1));
                & > P {
                    font-size: 12px;
                    padding: 8px 12px;
                    line-height: 16px;
                    box-sizing: border-box;
                    margin: 12px 8px 18px 0;
                    color: rgb(77,65,93);
                    span {
                        font-size: 8px;
                        padding-left: 2px;
                    }
                }
                p:first-child {
                    background-color: rgb(0,160,220);
                    color: white;
                }
                p:nth-child(2) {
                    background-color: #ccecf8;
                }
                p:last-child {
                    background-color: rgba(77,85,93,.2);
                }
            }
            .filter-only-content {
                padding: 12px 0;
                @include border-1px(rgba(7,17,27,.1));
                font-size: 12px;
                color: rgb(147,153,159);
                line-height: 24px;
                .ic-check_circle {
                    padding-right: 4px;
                    font-size: 24px;
                    line-height: 24px;
                }
                .active {
                    color: #00b43c;
                }
                span {
                    vertical-align: top;
                }
            }*/
            .rating-list {
                .rating {
                    padding: 16px 0;
                    @include border-1px(rgba(7,17,27,.1));
                    &:last-child {
                        @include border-none;
                        padding-bottom: 0;
                    }
                    .time-user {
                        display: flex;
                        font-size: 10px;
                        line-height: 12px;
                        color: rgb(147,153,159);
                        justify-content: space-between;
                        .user {
                            line-height: 12px;
                            & > * {
                                vertical-align: middle;
                            }
                            .avatar {
                                border-radius: 12px;
                                margin-left: 6px;
                            }
                        }
                    }
                    .rating-content {
                        font-size: 12px;
                        color: rgb(7,17,27);
                        line-height: 16px;
                        padding-top: 6px;
                        .ic-thumb_up {
                            color: rgb(0,160,220);
                            margin-right: 4px;
                        }
                        .ic-thumb_down {
                            color: rgb(147,153,159);
                            margin-right: 4px;
                        }
                    }
                }
            }
            .no-rating {
                padding-top: 16px;
                font-size: 12px;
                color: rgb(147,153,159);
                line-height: 16px;
            }
        }
    }
}
</style>
