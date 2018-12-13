<template>
  <div class="vue-canlendar">
    <div class="canlendar-head">
      <button class="canlendar-arrow none-back year-arrow" @click="prevClick('YYYY')"><span>&laquo;</span><span style="margin-left: -2.5px">&laquo;</span></button>
      <button class="canlendar-arrow none-back" @click="prevClick">&laquo;</button>
      {{changeTime(selectMonth, 'YYYY年M月')}}
      <button class="canlendar-arrow none-back" @click="nextClick">&raquo;</button>
      <button class="canlendar-arrow none-back year-arrow" @click="nextClick('YYYY')"><span>&raquo;</span><span style="margin-left: -2.5px">&raquo;</span></button>
    </div>
    <div class="canlendar-week spaceBetween">
      <p class="title" v-for="(item, index) in weekTitle" :key="index">{{item}}</p>
    </div>
    <div class="canlendar-day spaceBetween" v-for="(item, index) in canlendarData" :key="index">
      <div class="day-con" :class="[dItem.noSel===1?'gray-day':'now-month']" v-for="(dItem, dIndex) in item" :key="dIndex">
        <span class="con-time">{{changeTime(dItem.time, 'M/D')}}</span>  
        <p class="canlendar-content" v-for="(conItem, conIndex) in dItem.content" :key="conIndex">
          <span @mouseover="conItem.showTip = !conItem.showTip" 
                @mouseout="conItem.showTip = !conItem.showTip"
                class="con-ball" :style="{ background: colorArray[conIndex] }">
            {{conItem.showTip ? conItem.value : ''}}
          </span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
// 需要优化
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
      colorArray: ['#f36554', '#a46666'],
      canlendarData: [],
      selectMonth: new Date()
    }
  },
  mounted() {
    this.getCanlendarList(new Date())
  },
  methods: {
    prevClick(type) {
      if (type === 'YYYY')
        this.selectMonth =
          fecha.format(new Date(this.selectMonth), 'YYYY') -
          1 +
          fecha.format(new Date(this.selectMonth), '-MM-01')
      else
        this.selectMonth = new Date(
          this.expendTime(this.selectMonth, 'YEAR', 'before') +
            '-' +
            this.expendTime(this.selectMonth, 'MM', 'before') +
            '-01'
        )
      this.getCanlendarList(new Date(this.selectMonth))
    },
    nextClick(type) {
      if (type === 'YYYY')
        this.selectMonth =
          +fecha.format(new Date(this.selectMonth), 'YYYY') +
          1 +
          fecha.format(new Date(this.selectMonth), '-MM-01')
      else
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
    // 整理日期数据方法 status 0 当月 1 过去 2 未来
    createDay(i) {
      let itemTime = new Date(fecha.format(new Date(i), 'YYYY-MM')).getTime(),
        selectMonth = new Date(
          fecha.format(new Date(this.selectMonth), 'YYYY-MM')
        ).getTime(),
        nowMonth = new Date(fecha.format(Date.now(), 'YYYY-MM')).getTime(),
        status =
          nowMonth === itemTime
            ? 0
            : nowMonth > itemTime
              ? 1
              : nowMonth < itemTime
                ? 2
                : 0,
        noSel = itemTime === selectMonth ? 0 : 1,
        returnObj = {
          time: fecha.format(new Date(i), 'YYYY-MM-DD'),
          status,
          noSel
        }
      if (returnObj.time === fecha.format(Date.now(), 'YYYY-MM-DD'))
        returnObj.content = [
          {value: 'now', showTip: false},
          {value: 'Date', showTip: false}
        ]
      return returnObj
    },
    // 日期转换方法
    changeTime(date, type) {
      return fecha.format(new Date(date), type)
    },
    // 时间操作拓展方法
    expendTime(date, type, status) {
      let expendYear = +fecha.format(new Date(date), 'YYYY'),
        expendMonth = +fecha.format(new Date(date), 'MM')
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
    margin 0 40px
    color #666
  }
  .canlendar-arrow:hover{
    color rgb(81, 160, 250)
  }
  .year-arrow {
    margin 0 -20px
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
      text-align right
      font-size 0
      padding 8px
      position relative
      .con-time {
        position absolute
        right 8px
        bottom 8px
        font-size 14px
      }
      .canlendar-content {
        .con-ball {
          width 11px 
          height 11px
          display inline-block
          border-radius 50%
          background #f36554
          margin-right 5px
          font-size 12px
        }
      }
    }
    .now-month:hover {
      background rgb(240,247,250)
    }
    .gray-day {
      background #fafafa
      color #bbb
    }
  }
}
.vue-canlendar:hover{
  box-shadow 0 0 3px #f0f0f0
}
</style>
