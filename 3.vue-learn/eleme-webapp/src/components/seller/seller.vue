<template>
<div class="seller-page-wrapper" ref="sellerScroll">
  <div class="seller-page">
    <div class="basic-info">
      <div class="up border-1px">
        <div class="left">
          <h1 class="title">{{seller.name}}</h1>
          <div class="rating">
            <v-stars :size="36" :score="seller.score"></v-stars>
            <p class="rating-count">({{ratings.length}})</p>
            <p class="sold-count">月售{{seller.sellCount}}单</p>
          </div>
        </div>
        <div class="right" @click="favorited = !favorited">
          <i class="ic-favorite" :class="{active:favorited}"></i>
          <p class="favorite">{{favorited?'收藏':'已收藏'}}</p>
        </div>
      </div>
      <div class="down">
        <div class="min-price-wrapper">
          <p class="label">起送价</p>
          <p class="min-price">{{seller.minPrice}}<span class="unit">元</span></p>
        </div>
        <div class="delivery-price-wrapper">
          <p class="label">商家配送</p>
          <p class="delivery-price">{{seller.deliveryPrice}}<span class="unit">元</span></p>
        </div>
        <div class="delivery-time-wrapper">
          <p class="label">平均配送时间</p>
          <p class="delivery-time">{{seller.deliveryTime}}<span class="unit">分钟</span></p>
        </div>
      </div>
    </div>
    <div class="bulletin-supports">
      <div class="bulletin border-1px">
        <h1>公告与活动</h1>
        <p>{{seller.bulletin}}</p>
      </div>
      <div class="support-list">
        <ul>
          <li v-for="support of seller.supports" class="support border-1px">
            <span class="icon" :class="classMap[support.type]"></span>
            <span class="text">{{support.description}}</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="seller-pics">
      <h1>商家实景</h1>
      <div class="pics-wrapper" ref="picsWrapper">
        <ul>
          <li v-for="pic of seller.pics" class="pic"><img :src="pic" alt="" width="120" height="90"></li>
        </ul>
      </div>
    </div>
    <div class="more-info">
      <h1>商家信息</h1>
      <p v-for="info of seller.infos" class="info">{{info}}</p>
    </div>
  </div>
</div>
</template>

<script>
import stars from '../stars/stars';
import BScroll from 'better-scroll';
export default {
  name: 'seller',
  props: {
    seller: Object
  },
  components: {
    'v-stars': stars
  },
  data() {
    return {
      ratings: [],
      favorited: false
    };
  },
  watch: {
    seller() {
      this._initScroll();
    }
  },
  created() {
    this.$http.get('/get/ratings').then((res) => {
      this.ratings = res.body.data;
      this._initScroll();
    });

    this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
  },
  mounted() {
    this._initScroll();
  },
  methods: {
    _initScroll() {
      if (!this.seller || !this.seller.pics) {
        return;
      }
      if (!this.sellerScroll) {
        this.$nextTick(() => {
          this.sellerScroll = new BScroll(this.$refs.sellerScroll, {
            click: true
          });
        });
      } else {
        this.sellerScroll.refresh();
      }
      if (!this.picsScroll) {
        let width = this.seller.pics.length * (120 + 6) - 6;
        this.$refs.picsWrapper.querySelector('ul').style.width = `${width}px`;
        this.$nextTick(() => {
          this.picsScroll = new BScroll(this.$refs.picsWrapper, {
            click: true,
            scrollX: true
          });
        });
      } else {
        this.picsScroll.refresh();
      }
    }
  }
};
</script>
<style rel="stylesheet/scss" lang='scss'>
@import '../../common/sass/_diy.scss';
.seller-page-wrapper {
    position: absolute;
    top: 174px;
    bottom: 0;
    width: 100%;
    overflow: hidden;
    .seller-page {
        background-color: #f3f5f7;
        .basic-info {
            border-bottom: 1px solid rgba(7,17,27,.1);
            background-color: white;
            padding: 18px;
            display: flex;
            flex-direction: column;
            .up {
                display: flex;
                justify-content: space-between;
                padding-bottom: 18px;
                @include border-1px(rgba(7,17,27,.1));
                h1 {
                    font-size: 14px;
                    color: rgb(7,17,27);
                    line-height: 14px;
                }
                .rating {
                    padding-top: 8px;
                    line-height: 18px;
                    & > * {
                        display: inline-block;
                        padding-right: 8px;
                        font-size: 10px;
                        color: rgb(77,85,93);
                        line-height: 18px;
                        vertical-align: top;
                    }
                    .rating-count {
                        padding-right: 12px;
                    }
                }
                .right {
                    text-align: center;
                    flex: 0 0 36px;
                    i {
                        font-size: 24px;
                        line-height: 24px;
                        padding-bottom: 4px;
                        color: rgb(147,153,159);
                        &.active {
                            color: rgb(240,20,20);
                        }
                    }
                    .favorite {
                        font-size: 10px;
                        color: rgb(77,85,93);
                        line-height: 10px;
                    }
                }
            }
            .down {
                display: flex;
                justify-content: space-around;
                padding-top: 18px;
                & > * {
                    flex: 1 1;
                    text-align: center;
                    border-right: 1px solid rgba(7,17,27,.1);
                    font-size: 24px;
                    color: rgb(7,17,27);
                    .label {
                        font-size: 10px;
                        color: rgb(147,153,159);
                        padding-bottom: 4px;
                    }
                    .unit {
                        font-size: 10px;
                    }
                }
                div:last-child {
                    border-right: none;
                }
            }
        }
        .bulletin-supports {
            margin-top: 16px;
            background-color: white;
            padding: 18px;
            border-bottom: 1px solid rgba(7,17,27,.1);
            border-top: 1px solid rgba(7,17,27,.1);
            .bulletin {
                @include border-1px(rgba(7,17,27,.1));
                h1 {
                    font-size: 14px;
                    color: rgb(7,17,27);
                    line-height: 14px;
                }
                p {
                    padding: 8px 12px 16px;
                    font-size: 12px;
                    line-height: 24px;
                    color: rgb(240,20,20);
                }
            }
            .support-list {
                // padding: 16px 12px 0;
                .support {
                    padding: 16px 12px;
                    @include border-1px(rgba(7,17,27,.1));
                    & > * {
                        vertical-align: middle;
                    }
                    @include icon-with-text(16px,4,4px);
                    .text {
                        font-size: 10px;
                        line-height: 12px;
                    }
                    &:last-child {
                        @include border-none();
                        padding-bottom: 0;
                    }
                }
            }
        }
        .seller-pics {
            margin-top: 16px;
            background-color: white;
            padding: 18px;
            border-bottom: 1px solid rgba(7,17,27,.1);
            border-top: 1px solid rgba(7,17,27,.1);
            h1 {
                font-size: 14px;
                color: rgb(7,17,27);
                line-height: 14px;
                padding-bottom: 12px;
            }
            .pics-wrapper {
                overflow: hidden;
                width: 100%;
                white-space: nowrap;
                .pic {
                    display: inline-block;
                    margin-right: 6px;
                }
            }
        }
        .more-info {
            margin-top: 16px;
            background-color: white;
            padding: 18px 18px 0;
            border-top: 1px solid rgba(7,17,27,.1);
            h1 {
                font-size: 14px;
                color: rgb(7,17,27);
                line-height: 14px;
                padding-bottom: 12px;
            }
            p {
                font-size: 12px;
                line-height: 16px;
                padding: 16px 12px;
                @include border-1px(rgba(7,17,27,.1));
                &:last-child {
                    @include border-none();
                    padding-bottom: 0;
                }
            }
        }
    }
    .pic-view {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(7,17,27,.6);
        backdrop-filter: blur(10px);
        .img-wrapper {
            width: 100%;
            height: 0;
            padding-top: 66.67%;
            position: relative;
            margin: auto 0;
            img {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
            }
        }
    }
}
</style>
