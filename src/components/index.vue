<template>
  <FullCalendar class="fullcalendar" :options="calendarOptions" />
</template>

<script>
import '@fullcalendar/core/vdom'
import FullCalendar from '@fullcalendar/vue'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import {Lunar, Solar} from 'lunar-javascript'
export default {
  name:'FullcalendarDemo',
  components: {
    FullCalendar
  },
  data() {
    return {
      calendarOptions: {
        plugins: [ dayGridPlugin ,interactionPlugin], // 使用到的插件
        initialView: 'dayGridMonth',  // 视图模式
        locale: 'zh-cn',  // 中文
        headerToolbar: {  // 自定义头部
          left: 'prev,next today',
          center: 'title',
          right:''  // 这里只使用月视图,所以设置为空
          // right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth' // 其他视图安装对应插件
        },
        buttonText: { // 自定按钮上的文字
          today: '今天',
          // month: '月',
          // week: '周',
          // day: '日',
          // list: '表',
          // prev:'上一月',
          // next:'下一月'
        },
        dateClick: this.handleDateClick,  // 日期单元格点击事件
        events: [ // 单元格内事件数据
          { title: 'event 1', date: new Date() },
          { title: 'event 2', date:  new Date() },
          { title: 'event 3', date:  new Date() },
          { title: 'event 4', date:  new Date() }
        ],
        dayMaxEvents: true, // 事件超出折叠

      }
    }
  },
  methods: {
    handleDateClick(arg) {
      alert('date click! ' + arg.dateStr)
    }
  }
}
</script>
<style>
.fullcalendar {
  width: 80%;
  max-height: 88vh;
  margin: 20px auto;
}
</style>
