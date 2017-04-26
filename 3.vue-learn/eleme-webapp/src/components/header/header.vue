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
    <div v-if='seller.supports' class="supports-count">
      <span class="count">{{seller.supports.length}}个</span>
      <i class="ic-keyboard_arrow_right"></i>
    </div>
  </div>
  <div class="bulletin-wrapper">
    <span class="bulletin-title"></span>
    <span class="bulletin-content">{{seller.bulletin}}</span>
    <i class="ic-keyboard_arrow_right"></i>
  </div>
  <div class="background">
    <!-- <img :src="seller.avatar" alt=""> -->
  </div>
</div>
</template>

<script>
export default {
  name: 'header',
  props: {
    seller: {
      type: Object
    }
  },
  created() {
    this.classMap = ['decrease', 'discount', 'sepecial', 'invoice', 'guarantee'];
  }
};
</script>
<style rel="stylesheet/scss" lang='scss'>
@import '../../common/sass/_diy.scss';
.header {
    position: relative;
    color: #fff;
    background-color: rgba(7,17,27,.2);
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
                .icon {
                    display: inline-block;
                    width: 12px;
                    height: 12px;
                    margin-right: 4px;
                    background-size: 12px 12px;
                    background-repeat: no-repeat;
                    &.decrease {
                        @include bg-image( 'decrease_1');
                    }
                    &.discount {
                        @include bg-image( 'discount_1');
                    }
                    &.guarantee {
                        @include bg-image( 'guarantee_1');
                    }
                    &.invoice {
                        @include bg-image( 'invoice_1');
                    }
                    &.special {
                        @include bg-image( 'special_1');
                    }
                }
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
            background-color: rgba(0,0,0,.2);
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
}
</style>
