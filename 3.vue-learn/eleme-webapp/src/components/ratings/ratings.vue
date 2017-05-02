<template>
<div class="rating-page-wrapper" ref="ratingScroll">
  <div class="rating-page">
    <div class="basic-info">
      <div class="left">
        <p class="score">{{seller.score}}</p>
        <p class="label">综合评分</p>
        <p class="rank-rate">高于周边商家{{seller.rankRate}}%</p>
      </div>
      <div class="right">
        <div class="service-score">
          <p class="label">服务态度</p>
          <v-stars :score="seller.serviceScore" :size="36">
          </v-stars>
          <p class="score">{{seller.serviceScore}}</p>
        </div>
        <div class="food-score">
          <p class="label">美食评分</p>
          <v-stars :score="seller.foodScore" :size="36">
          </v-stars>
          <p class="score">{{seller.serviceScore}}</p>
        </div>
        <div class="delivery-time-wrapper">
          <p class="label">送达时间</p>
          <p class="delivery-time">{{seller.deliveryTime}}分钟</p>
        </div>
      </div>
    </div>
    <div class="rating-filter-wrapper">
      <v-rating-filter :ratings="ratings" @filterd="filterRatings"></v-rating-filter>
    </div>
    <div class="rating-list">
      <ul>
        <li v-for="rating of ratings" class="rating" v-show="showRating(rating.rateType, rating.text)">
          <img :src=" rating.avatar " class="avatar " width="28 " height="28 " alt=" ">
          <div class="info ">
            <div class="name-time ">
              <span class="name ">{{rating.username}}</span>
              <span class="time ">{{rating.rateTime | formatDate}}</span>
            </div>
            <div class="stars-delivery-time ">
              <v-stars :size="24 " :score="rating.score "></v-stars>
              <span>{{rating.deliveryTime}}分钟送达</span>
            </div>
            <div class="content ">{{rating.text}}</div>
            <div class="recommend " v-if="rating.recommend && rating.recommend.length>0">
              <i :class="rating.rateType===0?'ic-thumb_up':'ic-thumb_down'"></i>
              <span v-for="food of rating.recommend">{{food}}</span>
            </div>
          </div>
        </li>
      </ul>
      <div class="no-rating" v-show="ratings.length===0">
        暂无评价
      </div>
    </div>
  </div>
</div>
</template>

<script>
import ratingFilter from './ratingFilter';
import stars from '../stars/stars';
import {
  dateFormat
} from '../../common/js/utils';
import BScroll from 'better-scroll';
export default {
  name: 'ratings',
  props: {
    seller: Object
  },
  data() {
    return {
      ratings: [],
      filterType: 2,
      filterContent: false
    };
  },
  created() {
    this.$http.get('/get/ratings').then((res) => {
      this.ratings = res.body.data;
      this.$nextTick(() => {
        this.ratingScroll = new BScroll(this.$refs.ratingScroll, {
          click: true
        });
      });
    });
  },
  filters: {
    formatDate(time) {
      return dateFormat(new Date(time), 'yyyy-MM-dd hh:mm');
    }
  },
  methods: {
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

      this.$nextTick(() => {
         this.ratingScroll.refresh();
       });
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
    'v-rating-filter': ratingFilter,
    'v-stars': stars
  }
};
</script>
<style rel="stylesheet/scss" lang='scss'>
.rating-page-wrapper {
    position: absolute;
    top: 174px;
    bottom: 0;
    width: 100%;
    overflow: hidden;
    .rating-page {
        background-color: #f3f5f7;
        .basic-info {
            display: flex;
            background-color: white;
            border-bottom: 1px solid rgba(7,17,27,.2);
            // padding: 18px;
            .left {
                flex: 2 1;
                margin: 18px 0;
                text-align: center;
                border-right: 1px solid rgba(7,17,27,.1);
                .score {
                    font-size: 24px;
                    color: rgb(255,153,0);
                    line-height: 28px;
                    padding-bottom: 6px;
                }
                .label {
                    font-size: 12px;
                    color: rgb(7,17,27);
                    line-height: 12px;
                    padding-bottom: 8px;
                }
                .rank-rate {
                    font-size: 10px;
                    color: rgb(147,153,159);
                    line-height: 10px;
                    padding-bottom: 6px;
                }
            }
            .right {
                flex: 3 1;
                // display: flex;
                // flex-direction: column;
                padding: 18px 24px;
                @media (max-width:320px) {
                    padding: 18px 4px;
                }
                & > div {
                    margin-bottom: 8px;
                    line-height: 18px;
                    & > * {
                        display: inline-block;
                        padding-right: 6px;
                        vertical-align: middle;
                        @media (max-width:320px) {
                            padding-right: 2px;
                        }
                    }
                }
                .label {
                    font-size: 12px;
                    color: rgb(7,17,27);
                    line-height: 12px;
                }
                .score {
                    font-size: 12px;
                    line-height: 18px;
                    color: rgb(255,153,0);
                }
                .delivery-time {
                    font-size: 12px;
                    color: rgb(147,153,159);
                    line-height: 18px;
                }
            }
        }
        .rating-filter-wrapper {
            padding: 0 18px;
            margin-top: 18px;
            // border-bottom: 1px solid rgba(7,17,27,.2);
            border-top: 1px solid rgba(7,17,27,.2);
            background-color: white;
        }
        .rating-list {
            background-color: white;
            padding: 18px;
            .rating {
                display: flex;
                padding-bottom: 18px;
                &:last-child {
                    padding-bottom: 0;
                }
                .avatar {
                    border-radius: 14px;
                }
                .info {
                    padding-left: 12px;
                    flex: 1 1;
                    .name-time {
                        display: flex;
                        justify-content: space-between;
                        font-size: 10px;
                        color: rgb(7,17,27);
                        line-height: 12px;
                        .name {}
                        .time {
                            color: rgba(7,17,27,.2);
                        }
                    }
                    .stars-delivery-time {
                        padding-top: 4px;
                        font-size: 10px;
                        color: rgba(7,17,27, .2);
                        & > * {
                            display: inline-block;
                            padding-right: 6px;
                        }
                    }
                    .content {
                        padding-top: 6px;
                        color: rgb(7,17,27);
                        font-size: 12px;
                        line-height: 18px;
                    }
                    .recommend {
                        line-height: 16px;
                        & > i {
                            margin-right: 4px;
                            font-size: 12px;
                            line-height: 18px;
                        }
                        .ic-thumb_up {
                            color: rgb(0,160,220);
                        }
                        .ic-thumb_down {
                            color: rgb(147,153,159);
                        }
                        & > span {
                            display: inline-block;
                            padding: 0 6px;
                            margin-right: 8px;
                            border: 1px solid rgba(7,17,27,.1);
                            border-radius: 1px;
                            font-size: 9px;
                            color: rgb(147,153,159);

                            // background-color: white;
                        }
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
</style>
