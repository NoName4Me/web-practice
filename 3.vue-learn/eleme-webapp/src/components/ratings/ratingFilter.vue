<template>
<div class="rating-filter">
  <div class="filters border-1px">
    <p class="all" :class="{active:actives.all}" @click="activeFilter('all')">全部<span>{{ratings.length}}</span></p>
    <p class="recommend" :class="{active:actives.recommend}" @click="activeFilter('recommend')">推荐<span>{{recommendCount}}</span></p>
    <p class="bad" :class="{active:actives.bad}" @click="activeFilter('bad')">吐槽<span>{{badCount}}</span></p>
  </div>
  <div class="filter-only-content" @click="filterContentOnly()"><i class="ic-check_circle" :class="{active:isContentOnly}"></i><span>只看有内容的评价</span></div>
</div>
</template>

<script>
export default {
  name: 'rating-filter',
  props: {
    ratings: Array
  },
  data() {
    return {
      isContentOnly: false,
      allActive: true,
      recommendActive: false,
      badActive: false,
      actives: {
        'all': true,
        'recommend': false,
        'bad': false
      }
    };
  },
  methods: {
    filterContentOnly() {
      this.isContentOnly = !this.isContentOnly;
      this.$emit('filterd', this.isContentOnly ? 'content-yes' : 'content-no');
    },
    activeFilter(type) {
      let vm = this;
      if (this.actives[type] === true) {
        return;
      }
      Object.keys(this.actives).forEach(function(key) {
        vm.actives[key] = type === key;
      });
      this.$emit('filterd', type);
    }
  },
  computed: {
    recommendCount() {
      return this.ratings.filter(x => x.rateType === 0).length;
    },
    badCount() {
      return this.ratings.filter(x => x.rateType === 1).length;
    }
  }
};
</script>
<style rel="stylesheet/scss" lang='scss'>
@import '../../common/sass/_diy.scss';
.rating-filter {
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
            background-color: rgba(0,160,220,.2);
            span {
                font-size: 8px;
                padding-left: 2px;
            }
            &.active {
                color: white;
            }
        }
        p:first-child,
        p:nth-child(2) {
            &.active {
                background-color: rgb(0,160,220);
            }
        }
        p:last-child {
            background-color: rgba(77,85,93,.2);
            &.active {
                background-color: rgb(77,85,93);
            }
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
    }
}
</style>
