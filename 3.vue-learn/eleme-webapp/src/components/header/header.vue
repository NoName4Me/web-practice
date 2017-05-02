<template>
<div class="header">
  <div class="content-wrapper">
    <div class="avatar"><img width="64" height="64" :src="seller.avatar" alt=""></div>
    <div class="content">
      <div class="title">
        <span class="brand"></span>
        <span class="name">{{seller.name}}</span></div>
      <div class="description">{{seller.description}} / {{seller.deliveryTime}}分钟送达</div>
      <div v-if='seller.supports' class="supports">
        <span class="icon" :class="classMap[seller.supports[0].type]"></span>
        <span class="text">{{seller.supports[0].description}}</span>
      </div>
    </div>
    <div v-if='seller.supports' class="supports-count" @click="isDetailShow=!isDetailShow">
      <span class="count">{{seller.supports.length}}个</span>
      <i class="ic-keyboard_arrow_right"></i>
    </div>
  </div>
  <div class="bulletin-wrapper" @click="isDetailShow=!isDetailShow">
    <span class="bulletin-title"></span>
    <span class="bulletin-content">{{seller.bulletin}}</span>
    <i class="ic-keyboard_arrow_right"></i>
  </div>
  <div class="background">
    <img :src="seller.avatar" alt="">
  </div>
  <transition name="fade">
    <div class="detail" v-show="isDetailShow">
      <div class="detail-wrapper">
        <div class="detail-main">
          <h1 class="name">{{seller.name}}</h1>
          <div class="stars-wrapper">
            <v-stars :size="48" :score="seller.score"></v-stars>
          </div>
          <div class="title">
            <div class="line"></div>
            <div class="text">优惠信息</div>
            <div class="line"></div>
          </div>
          <ul v-if='seller.supports' class="supports">
            <li v-for="support of seller.supports" class="support-item">
              <span class="icon" :class="classMap[support.type]"></span>
              <span class="text">{{support.description}}</span>
            </li>
          </ul>
          <div class="title">
            <div class="line"></div>
            <div class="text">商家信息</div>
            <div class="line"></div>
          </div>
          <p class="buttletin">{{seller.bulletin}}</p>
        </div>
      </div>
      <div class="detail-close" @click="isDetailShow=!isDetailShow"><i class="ic-close"></i></div>
    </div>
  </transition>
</div>
</template>

<script>
import stars from '../stars/stars';
export default {
  name: 'header',
  props: {
    seller: {
      type: Object
    }
  },
  data() {
    return {
      isDetailShow: false
    };
  },
  created() {
    this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
  },
  components: {
    'v-stars': stars
  }
};
</script>
<style rel="stylesheet/scss" lang='scss'>
@import '../../common/sass/_diy.scss';

.header {
    position: relative;
    color: #fff;
    background-color: rgba(7,17,27,.4);
    overflow: hidden;
    /* 消除背景blur导致的边界阴影 */
    .content-wrapper {
        padding: 24px 12px 18px 24px;
        font-size: 0;
        position: relative;
        & > * {
            display: inline-block;
            vertical-align: middle;
        }
        .avatar {
            img {
                border-radius: 2px;
            }
        }
        .content {
            margin-left: 16px;
            .title {
                margin: 2px 0 8px;
                & > * {
                    display: inline-block;
                    vertical-align: middle;
                }
                .brand {
                    width: 30px;
                    height: 18px;
                    @include bg-image( 'brand');
                    background-size: 30px 18px;
                    background-repeat: no-repeat;
                }
                .name {
                    margin-left: 6px;
                    font-size: 16px;
                    line-height: 18px;
                    font-weight: bold;
                }
            }
            .description {
                margin-bottom: 10px;
                font-size: 12px;
                line-height: 12px;
            }
            .supports {
                & > * {
                    vertical-align: middle;
                }
                @include icon-with-text(12px,1,4px);
                .text {
                    font-size: 10px;
                    line-height: 12px;
                }
            }
        }
        .supports-count {
            position: absolute;
            right: 12px;
            bottom: 14px;
            padding: 0 8px;
            height: 24px;
            line-height: 24px;
            border-radius: 14px;
            background-color: rgba(7,17,27,.2);
            text-align: center;
            & > * {
                font-size: 10px;
                line-height: 24px;
                vertical-align: middle;
            }
            .ic-keyboard_arrow_right {
                margin-left: 2px;
            }
        }

    }
    .bulletin-wrapper {
        position: relative;
        height: 28px;
        padding: 0 20px 0 12px;
        line-height: 28px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-size: 10px;
        background-color: rgba(7,17,27,.2);
        & > * {
            vertical-align: middle;
        }
        .bulletin-content {
            margin: 0 4px;
        }
        .bulletin-title {
            margin-right: -4px;
            display: inline-block;
            width: 22px;
            height: 12px;
            @include bg-image( 'bulletin');
            background-size: 22px 12px;
            background-repeat: no-repeat;
        }
        .ic-keyboard_arrow_right {
            position: absolute;
            right: 12px;
            bottom: 7px;
        }
    }
    .background {
        width: 100%;
        height: 100%;
        position: absolute;
        filter: blur(10px);
        left: 0;
        top: 0;
        z-index: -1;
        img {
            width: 100%;
            height: 100%;
        }
    }
    .detail {
        position: fixed;
        z-index: 100;
        top: 0;
        left: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 0 36px;
        box-sizing: border-box;
        width: 100%;
        height: 100%;
        overflow: auto;
        background-color: rgba(7,17,27,.6);
        backdrop-filter: blur(10px);
        &.fade-enter-active,
        &.fade-leave {
          transition: all .5s ease-out;
        }
        &.fade-enter,
        &.fade-leave-active {
            transition: all .3s ease-in;
            opacity: 0;
            background-color: rgba(7,17,27,0);
        }
        .detail-wrapper {
            h2 {
                text-align: center;
            }
            // min-height: 100%;
            flex: 2;
            .detail-main {
                margin-top: 64px;
                .name {
                    line-height: 16px;
                    font-size: 16px;
                    font-weight: 700;
                    text-align: center;
                }
                .stars-wrapper {
                    margin-top: 18px;
                    padding: 2px 0;
                    text-align: center;
                }
                .title {
                    display: flex;
                    align-items: center;
                    margin: 28px auto 24px;
                    .line {
                        height: 0;
                        flex: 1;
                        border-bottom: 1px solid rgba(255,255,255,.2);
                    }
                    .text {
                        padding: 0 12px;
                        font-size: 14px;
                        font-weight: 700;
                    }
                }
                .supports {
                    display: inline-block;
                    font-size: 0;
                    padding: 0 12px;

                    .support-item {
                        & > * {
                            vertical-align: middle;

                        }
                        margin-top: 12px;
                        @include icon-with-text(16px,2,6px);
                        .text {
                            font-size: 14px;
                        }
                        &:first-child {
                            margin-top: 0;
                        }
                    }

                }
                .buttletin {
                    font-size: 12px;
                    font-weight: 200px;
                    line-height: 24px;
                }
            }
        }
        .detail-close {
            display: relative;
            flex: 0 1;
            font-size: 32px;
            margin-bottom: 32px;
        }

    }
}
</style>
