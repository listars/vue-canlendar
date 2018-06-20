<template>
  <div class="vue-canlendar">
    <div class="canlendar-head">
      <button class="canlendar-arrow none-back" @click="prevClick">&lt;</button>
      {{changeTime(selectMonth, 'YYYY年M月')}}
      <button class="canlendar-arrow none-back" @click="nextClick">&gt;</button>
    </div>
    <div class="canlendar-week spaceBetween">
      <p class="title" v-for="(item, index) in weekTitle" :key="index">{{item}}</p>
    </div>
    <div class="canlendar-day spaceBetween" v-for="(item, index) in canlendarData" :key="index">
      <div class="day-con" v-for="(dItem, dIndex) in item" :key="dIndex">{{changeTime(dItem.time, 'M/D')}}</div>
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
      ],
      canlendarData: [],
      selectMonth: new Date()
    }
  },
  mounted() {
    this.getCanlendarList(new Date())
  },
  methods: {
    prevClick() {
      this.selectMonth = new Date(
        this.expendTime(this.selectMonth, 'YEAR', 'before') +
          '-' +
          this.expendTime(this.selectMonth, 'MM', 'before') +
          '-01'
      )
      console.log(this.selectMonth)
      this.getCanlendarList(new Date(this.selectMonth))
    },
    nextClick() {
      this.selectMonth = new Date(
        this.expendTime(this.selectMonth, 'YEAR', 'after') +
          '-' +
          this.expendTime(this.selectMonth, 'MM', 'after') +
          '-01'
      )
      this.getCanlendarList(new Date(this.selectMonth))
    },
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
        afterDays = new Date(
          this.expendTime(date, 'YEAR', 'after'),
          this.expendTime(date, 'MM', 'after'),
          0
        ).getDate(),
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
      if (+fecha.format(date.setDate(monthDays), 'd') !== 6) {
        // let downDay = afterDays
        for (
          let i = 1;
          i <= 6 - fecha.format(date.setDate(monthDays), 'd');
          i++
        ) {
          editDay[editDay.length - 1].push(
            this.createDay(
              this.expendTime(date, 'YEAR', 'after') +
                '-' +
                this.expendTime(date, 'MM', 'after') +
                `-${String(i).length === 1 ? '0' + i : i}`
            )
          )
        }
      }
      /**
       *  1.全部天数在一个数组  2.一周一周切分组成一个月  ====>   选择2的方案，这样联动一些拓展事件自由度高一点
       */
      this.canlendarData = editDay
      console.log(editDay)
    },
    // 整理日期数据方法
    createDay(i) {
      let returnObj = {
        time: fecha.format(new Date(i), 'YYYY-MM-DD')
      }
      return returnObj
    },
    // 日期转换方法
    changeTime(date, type) {
      return fecha.format(new Date(date), type)
    },
    // 时间操作拓展方法
    expendTime(date, type, status) {
      let expendYear = +fecha.format(date, 'YYYY'),
        expendMonth = +fecha.format(date, 'MM')
      if (status === 'after') {
        expendMonth + 1 > 12 ? (expendYear++, (expendMonth = 1)) : expendMonth++
      } else if (status === 'before') {
        expendMonth - 1 === 0
          ? (expendYear--, (expendMonth = 12))
          : expendMonth--
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
  width 75%
  margin 0 auto
  color #666
  font-size 14px
  * {
    box-sizing border-box
    margin 0
  }
  .none-back {
    background none
    border none
    outline none
  }
  .spaceBetween {
    width 100%
    display flex
    justify-content space-between
  }
  .canlendar-head {
    border-top-left-radius 3px
    border-top-right-radius 3px
    border 1px solid #f0f0f0
    text-align center
    padding 15px
  }
  .canlendar-arrow {
    font-size 16px
    margin 0 25px
  }
  .canlendar-arrow:hover{
    color rgb(81, 160, 250)
  }
  .canlendar-week {
    background #f0f0f0
    padding 15px
    .title {
      width 14.28%
      text-align center
    }
  }
  .canlendar-day {
    border-left 1px solid #f0f0f0
    .day-con {
      width 14.28%
      height 130px
      border 1px solid #f0f0f0
      border-width 0 1px 1px 0
      display flex
      flex-direction column-reverse
      text-align right
      padding 8px
    }
    .day-con:hover {
      background rgb(240,247,250)
    }
  }
}
.vue-canlendar:hover{
  box-shadow 0 0 3px #f0f0f0
}
</style>
