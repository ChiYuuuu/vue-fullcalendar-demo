<template>
  <div>
    <button @click="goToDate">指定日期</button>
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
          <p>{{ arg.event.extendedProps.custom_title }}</p>
        </div>

        <div slot="reference" class="popover">
          <div class="fc-daygrid-event-dot"></div>
          <div class="fc-event-time">{{ arg.event.title }}</div>
        </div>
      </el-popover>
    </template>
  </FullCalendar>
  </div>
</template>

<script>
import '@fullcalendar/core/vdom'
import FullCalendar from '@fullcalendar/vue'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import {Lunar, Solar} from "lunar-javascript";
import axios from "axios";
import moment from "moment";

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
        customButtons: {
          next: {
            click: this.nextClick
          },
          prev: {
            click: this.prevClick
          },
          today: {
            text: '今天', // 按钮的展示文本
            click: this.todayClick // 点击按钮触发的事件，这里要注意的是当按钮绑定了事件之后该按钮原本自带的事件将会失效
          }
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


      },
      calendarApi: null,
    }
  },
  mounted() {
    this.getCalendarEvents()

    this.calendarApi = this.$refs.fullCalendar.getApi()

  },
  methods: {
    /**
     * 点击next
     */
    nextClick() {
      let date = moment(this.calendarApi.getDate()).format('YYYY-MM-DD')
      this.getCalendarEvents({date: date})
      this.calendarApi.next()
    },
    /**
     * 点击prev
     */
    prevClick() {
      let date = moment(this.calendarApi.getDate()).format('YYYY-MM-DD')
      this.getCalendarEvents({date: date})
      this.calendarApi.prev()
    },
    todayClick(){
      let date = moment(this.calendarApi.getDate()).format('YYYY-MM-DD')
      this.getCalendarEvents({date: date})
      this.calendarApi.today()
    },
    handleDateClick(arg) {
      alert('date click! ' + arg.dateStr)
    },
    /**
     * 动态获取单元格事件
     */
    getCalendarEvents(params = {}) {
      axios.post('/api/events', {
        params: params
      }).then(response => {
        console.log(response.data.data)
        this.calendarOptions.events = response.data.data
      })
          .catch(function (error) {
            console.log(error);
          });

    },
    /**
     * 自定义日期单元格内容
     * @param item
     * @returns {{html: string}}
     */
    buildDayCellHtml(item) {

      let date = item.date
      let solar = Solar.fromDate(date) // 阳历
      let lunar = Lunar.fromDate(date) // 阴历
      let jieQi = lunar.getJieQi() //节气

      if (solar.getFestivals().length !== 0) {
        solar.getFestivals()[0]
      }

      let html='<div class="custom-day-cell-content">'
      html+=`<div>${item.dayNumberText}</div>`
      html+=`<div class="lunar-content">`

      if(lunar.getDayInChinese()==='初一'){
        html+=`<div>${lunar.getMonthInChinese()}月</div>` // 初一时显示当前月份名称
      }else{
        html+=`<div>${lunar.getDayInChinese()}</div>`
      }

      html+=`<div class="festival">${ solar.getFestivals()[0]?solar.getFestivals()[0]:'' }</div>`
      html+=`<div class="festival">${ lunar.getFestivals()[0]?lunar.getFestivals()[0]:'' }</div>`
      html+=`<div class="festival">${ jieQi?jieQi:'' }</div>`


      html+=`</div></div>`
      return {html: html}

    },
    /**
     * 跳转指定日期
     */
    goToDate() {
      let date='2022-01-01'
      this.calendarApi.gotoDate(date);
    },

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

.custom-day-cell-content {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 5px;
}
.lunar-content{
  text-align: right;
}
.festival{
  font-size: 12px;
  line-height: 2;
}
.popover {
  display: flex;
  align-items: center;
}

/*添加日期单元格hover样式*/
.fc .fc-daygrid-day-frame:hover {
  background: #f0f8ff;
}
/*自定义单元格内内容 去除原有样式*/
.fc .fc-daygrid-day-number{
  padding: 0;
}
/*固定单元格高度避免内容不一导致的样式问题*/
 .fc .fc-daygrid-day-frame {
  cursor: pointer;
  height: 80px;
}
.custom-poper-class {
  background-color: #d9ecff !important;
}
</style>
