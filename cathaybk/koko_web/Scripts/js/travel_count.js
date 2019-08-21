// vue
var app = new Vue({
  el: '#inputcount',
  data: {
    originTime: ['01:00','02:00','03:00','04:00','05:00','06:00','07:00','08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00','23:00','24:00'],
    time: [],
    selectTime: '',
    selectDate: '',
    afterHours: 3,
    travelChoose_N: '0',
    airplaneChoose_N: '0',
    InconvenientChoose_N: '0',
  },
  computed: {
    isShowbox: function()  {
      return this.travelChoose_N === '0';
    },
    isShowbox2: function(){
      return this.travelChoose_N === '1';
    },
    isShowing: function() {
      return this.airplaneChoose_N === '0' && this.InconvenientChoose_N === '1';
    },
    isShowing2: function() {
      return this.airplaneChoose_N === '0' && this.InconvenientChoose_N === '0';
    },
    isShowing3: function() {
      return this.airplaneChoose_N === '1' && this.InconvenientChoose_N === '1';
    },
    isShowing4: function(){
      return this.airplaneChoose_N === '1' && this.InconvenientChoose_N === '0';
    },
  },
  mounted: function() {
    this.init();
    console.log('mounted');
    console.log(this.travelChoose_N);
  },
  methods: {
    init: function() {
      $("#datepicker").datepicker({
        showOtherMonths : true,
        hideIfNoPrevNext : true,
        dateFormat:'yy-mm-dd',
        timeFormat: "HH:mm",
        minDate : "0d",
        maxDate : "+180d",
        autoclose: true, 
        todayHighlight: true,
        onSelect: this.handleDatepickerSelect,
      });
    },
    handleDatepickerSelect: function(date, option) {
      this.selectDate = date;
      var today = new Date();
      var today_month = today.getMonth();
      var today_day = today.getDate();
      var today_hour = today.getHours();

      var select_month = option.currentMonth;
      var select_day = Number(option.currentDay);
  
      var isToday = select_month === today_month && select_day === today_day;
      if (isToday) {
        var target_index = today_hour + this.afterHours - 1;
        this.time = this.originTime.slice(target_index, this.originTime.length);
      } else {
        this.time = this.originTime;
      }
    },
  },
  watch: {
    selectTime: function(e) {
      console.log(this.selectTime);
    },
  },
})
