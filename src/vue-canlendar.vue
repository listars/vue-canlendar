<template>
  <div class="vue-canlendar">
    <div class="canlendar-week">
      <p class="title" v-for="(item, index) in weekTitle" :key="index">{{item}}</p>
    </div>
  </div>
</template>

<script>
import fecha from 'fecha'
export default {
  name: 'VueCanlendar',
  props: {},
  data() {
    return {
      weekTitle: [
        'Sunday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Moneday'
      ]
    }
  },
  mounted() {
    this.getCanlendarList(new Date())
  },
  methods: {
    // 获取整个月份的数据
    getCanlendarList(date) {
      let monthDays = new Date(
          fecha.format(date, 'YYYY'),
          fecha.format(date, 'MM'),
          0
        ).getDate(),
        beforeDays = new Date(
          this.expendTime(date, 'YEAR', 'before'),
          this.expendTime(date, 'MM', 'before'),
          0
        ).getDate(),
        // afterDays = new Date(this.expendTime(date, 'YEAR', 'after'), this.expendTime(date, 'MM', 'after'), 0).getDate(),
        editDay = []
      for (let i = 1; i <= monthDays; i++) {
        let now = fecha.format(date.setDate(1), 'd') - 1 + i
        if (!(editDay[Math.floor(now / 7)] instanceof Array))
          editDay[Math.floor(now / 7)] = []
        editDay[Math.floor(now / 7)].push(
          this.createDay(
            fecha.format(date, 'YYYY-MM') +
              `-${String(i).length === 1 ? '0' + i : i}`
          )
        )
        // console.log(Math.floor(i/7))
      }
      if (+fecha.format(date.setDate(1), 'd') !== 0) {
        let downDay = beforeDays
        for (
          let i = beforeDays - fecha.format(date.setDate(1), 'd') + 1;
          i <= downDay;
          downDay--
        ) {
          editDay[0].unshift(
            this.createDay(
              this.expendTime(date, 'YEAR', 'before') +
                '-' +
                this.expendTime(date, 'MM', 'before') +
                `-${String(downDay).length === 1 ? '0' + downDay : downDay}`
            )
          )
        }
      }
      /**
       *  1.全部天数在一个数组  2.一周一周切分组成一个月  ====>   选择2的方案，这样联动一些拓展事件自由度高一点
       */
    },
    // 整理日期数据方法
    createDay(i) {
      let returnObj = {
        time: fecha.format(new Date(i), 'YYYY-MM-DD')
      }
      return returnObj
    },
    // 时间操作拓展方法
    expendTime(date, type, status) {
      let expendYear = +fecha.format(date, 'YYYY'),
        expendMonth = +fecha.format(date, 'MM')
      if (status === 'after') {
        expendMonth + 1 > 12 ? expendYear++ : expendMonth++
      } else if (status === 'before') {
        expendMonth - 1 === 0 ? expendYear-- : expendMonth--
      }
      if (type === 'YEAR') return expendYear
      else
        return String(expendMonth).length === 1
          ? `0${expendMonth}`
          : expendMonth
    }
  }
}
</script>

<style lang="stylus">
.vue-canlendar {
  width 100%
  .canlendar-week {
    width 100%
    display flex
    justify-content space-between
    .title {
      width 14.28%
      text-align center
    }
  }
}
</style>
