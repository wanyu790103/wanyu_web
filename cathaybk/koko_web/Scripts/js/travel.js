
$(".tab_content").hide();
$(".tab_content:first").show();

  
//tab mode

   $("ul.tabs_list li").click(function() {
   
     $(".tab_content").hide();
     var activeTab = $(this).attr("rel"); 
     $("#"+activeTab).fadeIn();		
     $("ul.tabs_list li").removeClass("active");
     $(this).addClass("active");

     $(".tab-accordion_heading").removeClass("d_active");
     $(".tab-accordion_heading[rel^='"+activeTab+"']").addClass("d_active");
      target= $('.tabs_list');
        $('html,body').animate({
          scrollTop: target.offset().top-110
        }, 1000);
   
   });

 /* acoordion mode */

 $(".tab-accordion_heading").click(function() {
     
     $(".tab_content").hide();
     var d_activeTab = $(this).attr("rel"); 
     $("#"+d_activeTab).fadeIn();
   
    $(".tab-accordion_heading").removeClass("d_active");
     $(this).addClass("d_active");
   
     $("ul.tabs_list li").removeClass("active");
     $("ul.tabs_list li[rel^='"+d_activeTab+"']").addClass("active");
      
   if ( $( this ).hasClass( "d_active" ) ) {
            $(this).removeClass("d_active");
            $("#"+d_activeTab).fadeIn();
   }
   

   });


$(function () {
	$('.owl-carouselphone').owlCarousel({
		margin:10,
		nav:false,
		responsive:{
			0:{
				items:1
			},
			600:{
				items:1
			},
			1000:{
				items:3
			}
		}
  })
  
  $('.owl-itemjQ-owl').owlCarousel({
    autoplayHoverPause: true,
    margin:5,
    responsiveClass: true,
    nav: true,
    stagePadding: 100,
    responsive: {
      0: {
        items: 1
      },
      600: {
        items: 1
      },
      960: {
        items:3
      },
      1000: {
        items:4
      },
      1600: {
        items: 5
      }
    }

  })
});
// vue
var app = new Vue({
  el: '#inputcount',
  template: '#inputcount_t',
  data: {
    user: {
      isLoading: true,
    },
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
    isShowbox() {
      return this.travelChoose_N === '0';
    },
    isShowbox2() {
      return this.travelChoose_N === '1';
    },
    isShowing() {
      return this.airplaneChoose_N === '0' && this.InconvenientChoose_N === '1';
    },
    isShowing2() {
      return this.airplaneChoose_N === '0' && this.InconvenientChoose_N === '0';
    },
    isShowing3() {
      return this.airplaneChoose_N === '1' && this.InconvenientChoose_N === '1';
    },
    isShowing4() {
      return this.airplaneChoose_N === '1' && this.InconvenientChoose_N === '0';
    },
  },
  mounted() {
    this.init();
    console.log('mounted');
    console.log(this.travelChoose_N);
    // this.handeAirplaneChoose();
  },
  methods: {
    init() {
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
    handleDatepickerSelect(date, option) {
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
    selectTime(e) {
      console.log(this.selectTime);
    },
    // airplaneChoose_N(e) {
    //   this.handeAirplaneChoose();
    // },
    // InconvenientChoose_N(e) {
    //   this.handeAirplaneChoose();
    // },
  },
})

// setTimeout(function() {
//   console.log(app.selectTime);
//   console.log(app.selectDate);

// }, 5000);
