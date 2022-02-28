<template>
  <FullCalendar class="fullcalendar" ref="fullCalendar" :options="calendarOptions">
    <template v-slot:eventContent="arg">
      <el-popover
          placement="left"
          title=""
          width="300"
          :visible-arrow="false"
          trigger="hover"
          popper-class="custom-poper-class"
      >
        <div class="popover-content">
          <p>{{arg.event.extendedProps.custom_title}}</p>
        </div>

        <div slot="reference" class="popover">
          <div class="fc-daygrid-event-dot"></div>
          <div class="fc-event-time">{{ arg.event.title }}</div>
        </div>
      </el-popover>
    </template>
  </FullCalendar>
</template>

<script>
import '@fullcalendar/core/vdom'
import FullCalendar from '@fullcalendar/vue'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import {Lunar, Solar} from "lunar-javascript";

export default {
  name: 'FullcalendarDemo',
  components: {
    FullCalendar
  },
  data() {
    return {
      calendarOptions: {
        plugins: [dayGridPlugin, interactionPlugin], // 使用到的插件
        initialView: 'dayGridMonth',  // 视图模式
        locale: 'zh-cn',  // 中文
        headerToolbar: {  // 自定义头部
          left: 'prev,next today',
          center: 'title',
          right: ''  // 这里只使用月视图,所以设置为空
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
        events: this.getCalendarEvents,
        dayMaxEvents: true, // 事件超出折叠
        views: {
          //对应月视图
          dayGridMonth: {
            displayEventTime: false,//是否显示时间
            dayCellContent: this.buildDayCellHtml  // 自定义日期单元格内显示内容
          }
        },


      }
    }
  },
  methods: {
    handleDateClick(arg) {
      alert('date click! ' + arg.dateStr)
    },
    /**
     * 动态获取单元格事件 getCalendarEvents(info, successCallback,failureCallback)
     * @param info
     * @param successCallback
     */
    getCalendarEvents(info, successCallback) {
      let events = []
      let item = {
        title: '自定义事件内容',
        date: new Date(),
        display: 'list-item',
        custom_title: '自定义参数',
        custom_url: '自定义参数',

      }
      events.push(item)

      successCallback(events)

    },
    /**
     * 自定义日期单元格内容
     * @param item
     * @returns {{html: string}}
     */
    buildDayCellHtml(item) {
      let nowdate = item.date
      let solar = Solar.fromDate(nowdate) // 阳历
      let lunar = Lunar.fromDate(nowdate) // 阴历
      let jieQi = lunar.getJieQi() //节气
      let festivals = ''
      let jieRi = ''
      if (solar.getFestivals().length !== 0) {
        festivals = solar.getFestivals()[0]
      }
      if (lunar.getFestivals().length !== 0) {
        jieRi = lunar.getFestivals()[0]
      }
      let html = `<div class="date-info"><p class="item">${item.dayNumberText}</p>`
      html += `<div class="festivals-list">`
      if (festivals !== '') {
        html += `<p class="item">${festivals}</p>`
      }
      if (jieRi !== '') {
        html += `<p class="item">${jieRi}</p>`
      }
      if (jieQi !== '') {
        html += `<p class="item">${jieQi}</p>`
      }
      html += '</div></div>'
      return {html: html}
    }

  }
}
</script>
<style>
p {
  margin: 0;
}

.fullcalendar {
  width: 80%;
  max-height: 88vh;
  margin: 20px auto;
}

.date-info {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 5px;
}
.popover{
  display: flex;
  align-items: center;
}

/*添加日期单元格hover样式*/
.fc .fc-daygrid-day-frame:hover {
  background: #f0f8ff;
}
.custom-poper-class{
  background-color: #d9ecff !important;
}
</style>
